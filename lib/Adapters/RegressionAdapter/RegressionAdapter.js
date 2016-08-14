
var Q = require('q');
var _ = require('underscore');
var config = require('../../../common/Configuration');
var BaseAdapter=require('./../BaseAdapter.js').BaseAdapter;
var WowzaStreamInfo=require('./../WowzaStreamInfo.js');
var util=require('util');
var url=require('url');
var http=require('http');
var fs=require('fs');
var networkClient = require('./../../NetworkClientFactory').getNetworkClient();
var m3u8 = require('m3u8');
var logger = require('../../../common/logger');
var validator = require('./hlsStreamRegressionValidator');
var ErrorUtils = require('../../utils/error-utils');
var glob = require('glob');
const qio = require('q-io/fs');
const process = require('process');
const regerssionConfig = require('./RegressionConfig');

var weblogger = logger.getLogger("RegressionAdapter-Web");
var regressionAdapterConfig = config.get('regressionAdapter');
var mediaServer = config.get('mediaServer');
var entriesInfo = config.get('regressionAdapter').entries;

// Todo: find solution to following:
// Run folowing tests:
// 1) simulating stream that one or more flavors fail by intention.
// With current implementation (sync of all flavors download),
// the test will be blocked forever.
// 2) simulate disconnections (missing tss)


var testHelper;

if (!regressionAdapterConfig || !regressionAdapterConfig.enable) {
    return;
}

const master_playlist = {
    '1':   '#EXTM3U\n\
             #EXT-X-STREAM-INF:BANDWIDTH=5187246, URI="32/chunklist.m3u8", RESOLUTION=1280x720\n\
             playlist.m3u8',
    '2':   '#EXTM3U\n\
             #EXT-X-STREAM-INF:BANDWIDTH=1094569, URI="33/chunklist.m3u8", RESOLUTION=480x270\n\
             playlist.m3u8',
    '3':   '#EXTM3U\n\
             #EXT-X-STREAM-INF:BANDWIDTH=1447205, URI="34/chunklist.m3u8", RESOLUTION=640x360\n\
             playlist.m3u8',
    '4':   '#EXTM3U\n\
             #EXT-X-STREAM-INF:BANDWIDTH=2205365, URI="35/chunklist.m3u8", RESOLUTION=640x360\n\
             playlist.m3u8',
};

let logheader1 = function(literals, ...values) {

    return '[' + values[0] + '-' + values[1] + '] <<<< ' + values[2] + ' >>>> ';

};

let regression_status = { running: 'running', ending_failed: 'failed', ending_succeeded: 'succeeded' };

function readFile(res, full_path_file, entryId) {
    fs.readFile(full_path_file, function (err, data) {
        if (err) {
            res.writeHead(404);
            res.end(JSON.stringify(err));
            testHelper.logger.error('[%s] failed to read path=%s, from \'DATA WAREHOUSE\'. Error: %s', entryId, full_path_file, ErrorUtils.error2string(err));
        }
        res.writeHead(200);
        res.end(data);
    });
}


function EntryInfo(entryId) {

    this.id = entryId;
    this.chunklist_index = {};
    this.playlist = {};
    this.initial_chunklist_index = -1;
    this.last_chunklist_index = -1;
    this.chunklist_count = this.initial_chunklist_index - 1;
    this.data_warehouse_path = 'undefined';
    this.flavors = {};
    this.validation_failure_tolerated_count = {};
    this.fullpath = {};
    this.playlist_sent = {};
    // each flavor has new promise created each time chunklist retrieved.
    // the promise is resolved by min flavor when it started to perform the validation
    this.promise_per_flavor = {};
    this.results_saved = false;
    this.status = regression_status.running;
}

function TestHelper() {

    this.rootFolderPath =  regressionAdapterConfig['dataWarehouseRootFolderPath'] ;
    this.entries = {};
    this.logger = logger.getLogger('regressionAdapter');
    this.validators = {};
}

TestHelper.prototype.initEntries = function() {

    var that = this;

    var root_mp4_path = config.get('rootFolderPath');

    var p = _.map(entriesInfo, function (entryConfig) {
    // remove directory
    var fullpath = root_mp4_path + '/' + entryConfig.entryId;
    qio.removeTree(fullpath)
        .then(function () {
            that.logger.debug('[%s] CLEANUP SUCCEEDED @@@@ removed content of path=%s', entryConfig.entryId, fullpath);
        })
        .catch(function (err) {
            if (err.code != 'ENOENT') {
                that.logger.error('[%s] couldn\'t remove %s, path doesn\'t exist. Error: %s', entryConfig.entryId, fullpath, ErrorUtils.error2string(err));
                throw err;
            }
            else {
                that.logger.error('[%s] error removing %s. Error: %s', entryConfig.entryId, fullpath, ErrorUtils.error2string(err));
            }
        })
        .then (function() {


            var flavors = entryConfig.flavorParamsIds.split(',').map((item) => item.trim());

            that.entries[entryConfig.entryId] = new EntryInfo(entryConfig.entryId);
            that.entries[entryConfig.entryId].flavors = flavors;
            var path_fix = entryConfig.entryPath.replace('%20',' ');
            that.entries[entryConfig.entryId].data_warehouse_path = that.rootFolderPath + '/' + path_fix + '/' + flavors[0];
            that.entries[entryConfig.entryId].entryPath = entryConfig.entryPath;

            that.initChunklistEdgeIndexes(entryConfig.entryId, that.entries[entryConfig.entryId].data_warehouse_path)
                .then(function () {
                    that.validators[entryConfig.entryId] = new validator(entryConfig.entryId, flavors, that.entries[entryConfig.entryId].last_chunklist_index, entryConfig.validator);
                })
                .then(function() {
                    return that.validators[entryConfig.entryId].init();
                })
                .then(function () {
                    _.each(flavors, function (flavor) {
                        that.entries[entryConfig.entryId].chunklist_index[flavor] = that.entries[entryConfig.entryId].initial_chunklist_index - 1;
                        that.entries[entryConfig.entryId].validation_failure_tolerated_count[flavor] = 0;
                        that.entries[entryConfig.entryId].fullpath[flavor] = that.rootFolderPath + '/' + entryConfig.entryPath + '/' + flavor;
                        that.entries[entryConfig.entryId].playlist_sent[flavor] = false;
                        that.entries[entryConfig.entryId].promise_per_flavor[flavor] = Q.defer();
                    });
                })
                .then(function() {
                   return Q.resolve();
                });

        }).catch(function (err) {
            that.logger.error('[%s] initialization failed. Error: %s', entryConfig.entryId, ErrorUtils.error2string(err));
            proccess.exit(-3);
        });
    });
    return Q.all(p);
};

TestHelper.prototype.initChunklistEdgeIndexes = function (entryId, fullPath) {

    var that = this;
    var re = '.*_([0-9]+).m3u8';
    var pGlob = Q.nfbind(glob);

    return pGlob(fullPath + '/*')
        .then( function(files) {
            var chunklist_files = _.filter(files, function(file) { return file.endsWith('.m3u8'); });
            return chunklist_files;
        })
        .then (function(files) {
            var last_chunklist_index = _.reduce(files, function (index, next_file) {
                var regExp = new RegExp(re);
                var new_index = regExp.exec(next_file)[1];
                new_index = !isNaN(new_index) ? parseInt(new_index) : 0;
                return (new_index > index ? new_index : index);
            }, 0);
            that.logger.debug('[%s] last checuklist index is %s @@@@', entryId, last_chunklist_index);
            that.entries[entryId].last_chunklist_index = last_chunklist_index;
            return Q.resolve(files);
        })
        .then (function(files) {
            var first_chunklist_index = _.reduce(files, function (index, next_file) {
                var regExp = new RegExp(re);
                var new_index = regExp.exec(next_file)[1];
                new_index = !isNaN(new_index) ? parseInt(new_index) : 0;
                return (new_index < index ? new_index : index);
            }, that.entries[entryId].last_chunklist_index);
            that.logger.debug('[%s] first checuklist index is %s @@@@', entryId, first_chunklist_index);
            that.entries[entryId].initial_chunklist_index = first_chunklist_index;
            that.entries[entryId].chunklist_count = first_chunklist_index - 1;
        })
        .catch( function (err) {
            that.logger.debug('[%s] failed to read checuklist files from data warehouse, %s. Error: %s', entryId, fullPath, ErrorUtils.error2string(err));
        });
};

TestHelper.prototype.resetChunklistCount = function(entryId, flavorId) {

    this.entries[entryId].chunklist_index[flavorId] = this.entries[entryId].initial_chunklist_index - 1;
    this.logger.debug('[%s-%s] reset chunklist index of flavor %s to %s after playlist initialized', entryId,
        flavorId, flavorId, this.entries[entryId].chunklist_index[flavorId]);
};

TestHelper.prototype.nextChunklist = function (entryId, flavorId) {

    if (this.entries[entryId].chunklist_index[flavorId] < this.entries[entryId].last_chunklist_index) {

        this.entries[entryId].chunklist_index[flavorId]++;
    }

    return ('chunklist_' + this.entries[entryId].chunklist_index[flavorId] ) + '.m3u8';
};

TestHelper.prototype.isMinFlavor = function (entryId, flavorId) {

    var min = _.min(this.entries[entryId].flavors);

    return (min === flavorId);
};

TestHelper.prototype.exitRegressionWithError = function(entryId, flavorId, iteration, errors, url) {

    let that = this;
    let err_obj = errors;
    let deferred = Q.defer();
    var flavor_header = logheader1 `${entryId}${flavorId}${iteration}`;

    if (that.entries[entryId].status.localeCompare(regression_status.running) === 0) {
        that.entries[entryId].status = regression_status.ending_failed;

        if (!_.has(err_obj, flavorId)) {
            let err_msg = ErrorUtils.error2string(errors);
            err_obj[flavorId] = {errors: {}};
            err_obj[flavorId].errors[new Date().toISOString()] = err_msg;
            err_obj[flavorId]['action item'] = 'verify nginx is running!';
            that.logger.error('%s ***** VALIDATION FAILED!!! ***** error=[%s], url=[%s]', flavor_header, err_msg, url);
        }

        return testHelper.validators[entryId].validateResults(false, err_obj)
            .catch(function (err) {
                that.logger.debug('%s save regression results failed. Check if it\'s a bug. Error=[%s], url=[%s]', flavor_header, ErrorUtils.error2string(err), url);
            })
            .then(function() {
                process.exit(-5);
            })
            .then(function() {
                deferred.reject();
            });

    } else {
        deferred.reject();
    }

    return deferred.promise;
}

TestHelper.prototype.validateSingleFlavor = function (entryId, flavorId, iteration) {

    let that = this;
    let deferred = Q.defer();
    var flavor_header = logheader1 `${entryId}${flavorId}${iteration}`;
    let url = util.format("http://localhost:8080/kLive/smil:%s_all.smil/%s/chunklist.m3u8", entryId, flavorId);

    try {
        that.logger.debug('%s getting chunklist, url=[%s]', flavor_header, url);

        return networkClient.read({url: url, timeout: 10000})
            .then(function (content) {
                return that.validators[entryId].addChunklist(content, flavorId, iteration);
             })
            .then(function (m3u8) {
                that.logger.info('%s ***** SUCCESSFULLY VALIDATED ***** url=[%s]', flavor_header, m3u8.toString(), url);
                deferred.resolve(m3u8);
            })
            .catch(function (errors) {
                return that.exitRegressionWithError(entryId, flavorId, iteration, errors, url);
            })
            .then(function() {
                deferred.reject();
            })
            .catch(function() {
                deferred.reject();
            });
    }
    catch (e) {
        that.logger.error('%s failed to get chunklist', flavor_header)
    }
            
    return deferred.promise;        
}

TestHelper.prototype.validateAllFlavors = function (entryId, flavorId) {
    
    var that = this;
    var validate_delay_milliseconds = 500;
    var exit_delay_milliseconds = 1000;
    var index = this.entries[entryId].chunklist_index[flavorId] - 1;
    var log_header = logheader1 `${entryId}${flavorId}${index}`;
    var stop = false;

    var playlist_sent_for_all_flavors = _.reduce(this.entries[entryId].flavors, function (memo, flavor) {
        return (that.entries[entryId].playlist_sent[flavor] === false) ?  false : memo;
    }, true);

    if (!playlist_sent_for_all_flavors) {
        this.logger.debug('%s validate skipped didn\'t get all master playlists, {readyToValidateChunklist}',log_header);
        this.entries[entryId].promise_per_flavor[flavorId].resolve();
        return Q.resolve();
    }

    var p_finished_iteration = _.map(this.entries[entryId].flavors, function (flavor) {
        if (index < that.entries[entryId].chunklist_index[flavor]) {
            return Q.resolve();
        }
        that.logger.debug('%s flavor %s didn\'t finish current iteration %s', log_header, flavor, that.entries[entryId].chunklist_index[flavor]);
        return Q.reject('not all flavors finished');
    });

    return Q.all(p_finished_iteration)
        .then( function() {
            that.logger.debug('%s starting validation iteration, getting stream data from \'packager\'', log_header);
            let p = _.map(that.entries[entryId].flavors, function(next_flavor) {
                    return that.validateSingleFlavor(entryId, next_flavor, index);
            });

            return Q.all(p)
                .then(function () {
                    that.entries[entryId].chunklist_count++;
                    if (that.entries[entryId].chunklist_count === that.entries[entryId].last_chunklist_index) {
                        return true;
                    }
                    return false;
                })
                .then( function(finished) {
                    if (finished) {
                        that.logger.debug('%s @@@ finished regression test.', log_header);
                        return testHelper.validators[entryId].saveResultsToFile('finished regression test. last chunklist index ' + index)
                            .then( function() {
                                return testHelper.validators[entryId].validateResults(true);
                            })
                            .then(function () {
                                return Q.delay(exit_delay_milliseconds);
                            })
                            .then(function() {
                                process.exit(0);
                            })
                            .catch(function (err) {
                                that.logger.error('%s error, %s', entryId, that.entries[entryId].chunklist_count, log_header, ErrorUtils.error2string(err));
                                
                                return testHelper.validators[entryId].saveResultsToFile('validation failed')
                                    .then(function() {
                                        return Q.delay(exit_delay_milliseconds);
                                    })
                                    .then(function() {
                                        process.exit(-5);
                                    })
                                    .catch( function(err) {
                                        that.logger.error('%s error saving regression results of failed test. Error: %s', log_header, ErrorUtils.error2string(err));
                                        return Q.delay(exit_delay_milliseconds);
                                    })
                                    .then(function() {
                                        process.exit(-5);
                                    });
                            });
                    }
                })
                .catch( function(err) {
                    that.entries[entryId].chunklist_count++;
                    that.logger.debug('%s aggregating results returned error, %s.', log_header, err);
                })
                .then( function() {
                    _.each(that.entries[entryId].flavors, function(flavor) {
                        if (that.entries[entryId].chunklist_index[flavor] === index + 1) {
                            that.entries[entryId].promise_per_flavor[flavor].resolve();
                        }
                    });
                });
        })
        .catch( function(err) {
            that.logger.debug('%s aggregate validation info delayed by %s seconds. Reason: %s', log_header, validate_delay_milliseconds/1000, ErrorUtils.error2string(err));
            if (!stop) {
                setTimeout(function () {
                    that.validateAllFlavors(entryId, flavorId);
                }, validate_delay_milliseconds);
            }
        });

};

TestHelper.prototype.resolveUrl = function(url, params) {

    var deferred = Q.defer();

    try {
        var re=/(.*)_definst_\/(.*)_(%20)?(.*)\/(.*)/.exec(url);
        params.entryId = re[2];
        params.flavorId = re[4];
        params.filename = re[5];

        // chunklist
        if (params.filename.indexOf('chunklist.m3u8') > -1 ||
            params.filename.indexOf('playlist.m3u8') > -1 ) {
            params.request_type.chunklist = true;
            params.validate = testHelper.isMinFlavor(params.entryId, params.flavorId);
            var extended_filename = testHelper.nextChunklist(params.entryId, params.flavorId);
            params.fullpath = testHelper.entries[params.entryId].fullpath[params.flavorId] + '/' + extended_filename;
            weblogger.info('[%s-%s] <<<< iteration %s >>>> next chunklist to get from DATA WAREHOUSE, fullpath=%s', params.entryId, params.flavorId, testHelper.entries[params.entryId].chunklist_index[params.flavorId],  params.fullpath);

            if (testHelper.entries[params.entryId].chunklist_index[params.flavorId] ===
                testHelper.entries[params.entryId].initial_chunklist_index) {
                testHelper.entries[params.entryId].promise_per_flavor[params.flavorId].resolve();
                deferred.resolve();
            }
            else if (params.validate) {
                testHelper.validateAllFlavors(params.entryId, params.flavorId)
                    .then(function () {
                        deferred.resolve();
                    })
                    .catch(function (err) {
                        weblogger.error('[%s-%s] ##### is this is a bug??? validateAllFlavors() returned reject with err %s', params.entryId, params.flavorId, err);
                        deferred.resolve();
                    });
            }
            else {
                deferred.resolve();
            }
        }
        // segment (ts)
        else if (params.filename.substr(-3).localeCompare('.ts') === 0) {
            params.request_type.ts = true;
            params.fullpath = testHelper.entries[params.entryId].fullpath[params.flavorId] + '/' + params.filename;

            deferred.resolve();
        }
        // playlist (master manifest)
        else if (params.filename.indexOf('playlist_w111.m3u8') > -1) {
            params.request_type.playlist = true;
            weblogger.debug('>>>>> GETTING PLAYLIST, OF ENTRY %s, FLAVOR %s <<<<< %s', params.entryId, params.flavorId, params.filename );
            testHelper.resetChunklistCount(params.entryId, params.flavorId);

            deferred.resolve();
        }
        else {
            deferred.reject('<<<< iteration %s >>>> failed to recognize request type, url=%s', params.entryId, params.flavorId, testHelper.entries[params.entryId].chunklist_index[params.flavorId],  url);
        }
        // Todo : make sure all the flavors chunklists are download is aligned.
        // this won't work if there is even single cunklist for single flavor that is missing in the
        // video entry repository
        // so, it is the responsibility of the Python live-testing application to make sure that
        // exact number of chunklist files with same names are downloaded.
        // otherwise there should be a mechanism to skip chunklists that are absent for one or more flavors
    } catch (err) {
        weblogger.error("error parsing url %s. Error: %s", url, ErrorUtils.error2string(err));
        deferred.reject();
    }

    return deferred.promise

};

var httpMock=http.createServer(function(req, res) {

    var that = this;

    try {
         var params = {
             entryId: '',
             flavorId: '',
             fullpath: '',
             filename: '',
             validate: false,
             parsed: false,
             request_type: {
                     chunklist: false,
                     playlist: false,
                     ts: false
                 }
         };

         testHelper.resolveUrl(req.url, params)
             .then(function() {
                    if (params.request_type.chunklist) {
                        testHelper.entries[params.entryId].promise_per_flavor[params.flavorId].promise
                            .then(function () {
                                weblogger.debug('Reading [%s], from \'DATA WAREHOUSE\'', params.fullpath);
                                readFile(res, params.fullpath, params.entryId);
                                testHelper.entries[params.entryId].promise_per_flavor[params.flavorId] = Q.defer();
                                weblogger.debug('successfully read [%s], from \'DATA WAREHOUSE\'', params.fullpath);
                            })
                            .catch(function (err) {
                                weblogger.error('[%s-%s] ##### is this is a bug??? flavor promise rejected, %s', params.entryId, params.flavorId, err);
                                res.writeHead(400);
                                res.end();
                                testHelper.entries[params.entryId].promise_per_flavor[params.flavorId] = Q.defer();
                            });
                    } else if (params.request_type.ts) {
                        weblogger.debug('Reading [%s], from \'DATA WAREHOUSE\'', params.fullpath);
                        readFile(res, params.fullpath, params.entryId);
                        weblogger.debug('successfully read [%s], from \'DATA WAREHOUSE\'', params.fullpath);
                    } else if (params.request_type.playlist) {
                        res.writeHead(200);
                        res.end(master_playlist[params.flavorId]);
                        testHelper.entries[params.entryId].playlist_sent[params.flavorId] = true;
                    } else {
                        // Unprocessable Entity (WebDAV; RFC 4918)
                        // The request was well-formed but was unable to be followed due to semantic errors.
                        res.writeHead(422);
                        res.end();
                    }
            })
            .catch(function (err) {
                weblogger.error('[%s-%s] ##### is this is a bug??? validateAllFlavors() returned reject with err %s', params.entryId, params.flavorId, err);
                // 400 Bad Request
                // The server cannot or will not process the request due to an apparent client error
                // (e.g., malformed request syntax, invalid request message framing, or deceptive request routing)
                res.writeHead(400);
                res.end();
                if (params.request_type.chunklist)
                    testHelper.entries[params.entryId].promise_per_flavor[params.flavorId] = Q.defer();
            });
    }catch(err) {
        weblogger.error("Exception returning response to monitor server %s, from \'DATA WAREHOUSE\'", ErrorUtils.error2string(err));
    }
}).listen(8888);

function RegressionAdapter() {

    BaseAdapter.call(this);
    testHelper = new TestHelper();
    this.initPromise=testHelper.initEntries()
        .catch( function(err) {
          testHelper.logger.error('RegressionAdapter failed to initialize. Error=%s', ErrorUtils.error2string(err));
            throw err;
        });
}

util.inherits(RegressionAdapter,BaseAdapter);

RegressionAdapter.prototype.getLiveEntries=function() {

    return this.initPromise.then(function() {

        var result = [];
        // read the entry Ids and fill the result array
        // with entriesInfo configuration
        _.each(entriesInfo,function(template) {
            var entry = _.extend(template, {
                getStreamInfo: function () {
                    return new WowzaStreamInfo(this.entryId, this.flavorParamsIds, "");
                } });
            result.push(entry);
        });
        return (result);
    })
};


module.exports = RegressionAdapter;


