
var Q = require('q');
var _ = require('underscore');
var config = require('../../../common/Configuration');
var BaseAdapter=require('./../BaseAdapter.js').BaseAdapter;
var StreamInfo=require('./../BaseAdapter.js').StreamInfo;
var WowzaStreamInfo=require('./../WowzaStreamInfo.js');
var util=require('util');
var url=require('url');
var http=require('http');
var fs=require('fs');
var networkClient = require('./../../NetworkClientFactory').getNetworkClient();
var promUtils = require('../../utils/promise-utils');
var m3u8Handler = require('../../manifest/promise-m3u8');
var m3u8 = require('m3u8');
var m3u = require('m3u');
var fs_utils = require('../../utils/fs-utils');
var basePath=__dirname + "/../../tests/resources/liveSessionData/";
var logger = require('../../../common/logger')
var validator = require('./hlsStreamRegressionValidator');
var ErrorUtils = require('../../utils/error-utils');
var glob = require('glob');
const qio = require('q-io/fs');

var weblogger = logger.getLogger("RegressionAdapter-Web");
var regressionAdapterConfig = config.get('regressionAdapter');
var mediaServer = config.get('mediaServer');
var entriesInfo = config.get('regressionAdapter').entries;
var hostname = mediaServer.hostname;
var port = mediaServer.port;

var testHelper;

if (!regressionAdapterConfig || !regressionAdapterConfig.enable) {
    return;
}

const master_playlist = {
    '32':   '#EXTM3U\n\
             #EXT-X-STREAM-INF:BANDWIDTH=5187246, URI="32/chunklist.m3u8", RESOLUTION=1280x720\n\
             playlist.m3u8',
    '33':   '#EXTM3U\n\
             #EXT-X-STREAM-INF:BANDWIDTH=1094569, URI="33/chunklist.m3u8", RESOLUTION=480x270\n\
             playlist.m3u8',
    '34':   '#EXTM3U\n\
             #EXT-X-STREAM-INF:BANDWIDTH=1447205, URI="34/chunklist.m3u8", RESOLUTION=640x360\n\
             playlist.m3u8',
    '35':   '#EXTM3U\n\
             #EXT-X-STREAM-INF:BANDWIDTH=2205365, URI="35/chunklist.m3u8", RESOLUTION=640x360\n\
             playlist.m3u8',
};

const max_validation_failure_tolerate = 0;

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


function EntryInfo(entryId, first_chunklist_index) {

    this.id = entryId;
    this.chunklist_index = {};
    this.playlist = {};
    this.initial_chunklist_index = first_chunklist_index;
    this.last_chunklist_index = -1;
    this.chunklist_count = this.initial_chunklist_index - 1;
    this.data_warehouse_path = 'undefined';
    this.flavors = {};
    this.validation_failure_tolerated_count = {};
    this.fullpath = {};
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
    var p;
    p = _.map(entriesInfo, function (entryConfig) {
    // remove directory
    var fullpath = root_mp4_path + '/' + entryConfig.entryId;
    return qio.removeTree(fullpath)
        .then(function () {
            that.logger.debug('[%s] CLEANUP SUCCEEDED @@@@ removed content of path=%s', entryConfig.entryId, fullpath)

            var flavors = entryConfig.flavorParamsIds.split(',').map((item) => item.trim());

            that.entries[entryConfig.entryId] = new EntryInfo(entryConfig.entryId, entryConfig.firstChunklistIndex);
            that.entries[entryConfig.entryId].flavors = flavors;
            that.entries[entryConfig.entryId].data_warehouse_path = that.rootFolderPath + '/' + entryConfig.entryPath + '/' + entryConfig.entryId + '/' + flavors[0];
            that.entries[entryConfig.entryId].entryPath = entryConfig.entryPath;

            return that.getLastChunklistFileIndex(entryConfig.entryId, that.entries[entryConfig.entryId].data_warehouse_path)
                .then(function (last_chunklist_index) {
                    that.entries[entryConfig.entryId].last_chunklist_index = last_chunklist_index;
                    that.logger.debug('[%s] @@@ max chunklist index = %s', entryConfig.entryId, that.entries[entryConfig.entryId].last_chunklist_index);
                    that.validators[entryConfig.entryId] = new validator(entryConfig.entryId, flavors, that.entries[entryConfig.entryId].last_chunklist_index, entryConfig.validator);
                })
                .then(function() {
                    return that.validators[entryConfig.entryId].init();
                })
                .then(function () {
                    _.each(flavors, function (flavor) {
                        that.entries[entryConfig.entryId].chunklist_index[flavor] = entryConfig.firstChunklistIndex - 1;
                        that.entries[entryConfig.entryId].validation_failure_tolerated_count[flavor] = 0;
                        that.entries[entryConfig.entryId].fullpath[flavor] = that.rootFolderPath + '/' + entryConfig.entryPath + '/' + entryConfig.entryId + '/' + flavor;
                    });
                });
        }).catch(function (err) {
            that.logger.error('[%s] initialization failed. Error: %s', entryConfig.entryId, ErrorUtils.error2string(err));
        });
    });
    return Q.all(p);
}

TestHelper.prototype.getLastChunklistFileIndex = function (entryId, fullPath) {

    var that = this;
    var re = '([^\/]*)$';
    var pGlob = Q.nfbind(glob);

    return pGlob(fullPath + '/*')
        .then (function(files) {
            last_chunklist_index = _.reduce(files, function (index, next_file) {
                var regExp = new RegExp(re);
                var new_index = regExp.exec(next_file)[0].split('_')[0];
                new_index = !isNaN(new_index) ? parseInt(new_index) : 0;
                return (next_file.endsWith('m3u8') && new_index > index ? new_index : index);
            }, 0);
            that.logger.debug('[%s] last checuklist index is %s', entryId, last_chunklist_index);
            return Q.resolve(last_chunklist_index);
        })
        .catch( function (err) {
            that.logger.debug('[%s] failed to read checuklist files from data warehouse, %s. Error: %s', entryId, fullPath, ErrorUtils.error2string(err));
        });
}

TestHelper.prototype.resetChunklistCount = function(entryId, flavorId) {
    this.entries[entryId].chunklist_index[flavorId] = this.entries[entryId].initial_chunklist_index - 1;
}

TestHelper.prototype.nextChunklist = function (entryId, flavorId) {

    if (this.isMinFlavor(entryId, flavorId) &&
        this.entries[entryId].chunklist_index[flavorId] < this.entries[entryId].last_chunklist_index) {

        this.entries[entryId].chunklist_index[flavorId]++;
    }

    return ("00000" + this.entries[entryId].chunklist_index[flavorId] ).slice(-6) + '_chunklist.m3u8';
}

TestHelper.prototype.readyToValidateChunklist = function(entryId, index) {

   var that  = this;

   var p=_.map(this.entries[entryId].chunklist_index, function(flavor_chunklist_index) {
        if (flavor_chunklist_index > index && index > that.entries[entryId].initial_chunklist_index + 1) {
            return Q.resolve();
        }
        return Q.reject('flavor index under requirement');
    });

    return Q.all(p);
}

TestHelper.prototype.isMinFlavor = function (entryId, flavorId) {

    var min = _.min(this.entries[entryId].chunklist_index);

    return (min === this.entries[entryId].chunklist_index[flavorId]);
}

TestHelper.prototype.validateFlavor = function (entryId, flavorId) {
    
    var that = this;
    var finished_regression_test = false;
    
    var index = this.entries[entryId].chunklist_index[flavorId] - 1;
    
    if (index <= this.entries[entryId].initial_chunklist_index) {
        this.logger.debug('[%s] validate skipped for too low chunklist index %s', entryId, index);
        return Q.resolve();
    }

    return this.readyToValidateChunklist(entryId, index)
        .then( function() {
            var p = _.map(that.entries[entryId].flavors, function(flavor) {
                var url = util.format("http://localhost:8080/kLive/smil:%s_all.smil/%s/chunklist.m3u8", entryId, flavor);
                return networkClient.read({url: url, timeout: 10000})
                    .then(function (content) {
                        return that.validators[entryId].addChunklist(content, flavor, index, url);
                    })
                    .then(function (m3u8) {
                        // todo: check why the resolved value is undefined???
                        that.logger.info('[%s-%s] <<<< iteration %s >>>> **** SUCCESSFULLY VALIDATED ****  url=[%s]', entryId, flavor, index, url);
                    })
                    .catch(function (e) {
                        that.logger.error('[%s-%s] <<< iteration %s >>> **** VALIDATION FAILED!!! **** error=[%s], url=[%s]', entryId, flavor, index, e.message, url);
                        that.entries[entryId].validation_failure_tolerated_count[flavor]++;
                        if (that.entries[entryId].validation_failure_tolerated_count[flavor] > max_validation_failure_tolerate)
                            process.exit(-5);
                    });
            });

            return Q.all(p)
                .then(function () {
                    that.entries[entryId].chunklist_count++;
                    if (that.entries[entryId].chunklist_count === that.entries[entryId].last_chunklist_index) {
                        finished_regression_test = true;
                    }
                })
                .then( function() {
                    if (finished_regression_test) {
                        that.logger.debug('[%s]<< iteration %s >> @@@ finished regression test.', entryId, that.entries[entryId].chunklist_count);
                        return testHelper.validators[entryId].saveResultsToFile('finished regression test. last chunklist index ' + index)
                            .then( function() {
                                return testHelper.validators[entryId].validateResults();
                            })
                            .then(function () {
                                process.exit(0);
                            })
                            .catch(function (err) {
                                that.logger.error('[%s]<< iteration %s >> error, %s', entryId, that.entries[entryId].chunklist_count, entryId,ErrorUtils.error2string(err));
                                
                                return testHelper.validators[entryId].saveResultsToFile('validation failed')
                                    .then(function() {
                                        process.exit(-5);
                                    })
                                    .catch( function(err) {
                                        that.logger.error('[%s] error saving regression results of failed test. Error: %s', entryId, ErrorUtils.error2string(err));
                                        process.exit(-5);
                                    });
                            });
                    }
                })
                .catch( function(err) {
                    that.entries[entryId].chunklist_count++;
                    that.logger.debug('[%s] finished aggregating results iteration %s.', entryId, that.entries[entryId].chunklist_count);
                });
        })
        .catch( function(err) {
            that.logger.debug('[%s] validate skipped chunklist index %s. Reason: %s', entryId, index, ErrorUtils.error2string(err));
        })

}

TestHelper.prototype.resolveUrl = function(url, params) {

    var parsed = false;
    var re=/(.*)_definst_\/(.*)_(%20)?(.*)\/(.*)/.exec(url);

    try {
        params.entryId = re[2];
        params.flavorId = re[4];
        params.filename = re[5];
        params.validate=false;


        // following code is meant for all chunklists download to be aligned
        if (params.filename.indexOf('chunklist.m3u8') > -1 ||
            params.filename.indexOf('playlist.m3u8') > -1 ) {
            params.validate = this.isMinFlavor(params.entryId, params.flavorId);
            var extended_filename = this.nextChunklist(params.entryId, params.flavorId);
            params.fullpath = this.entries[params.entryId].fullpath[params.flavorId] + '/' + extended_filename;
        }
        // segments
        else if (params.filename.substr(-3).localeCompare('.ts') === 0) {
            params.fullpath = this.entries[params.entryId].fullpath[params.flavorId] + '/' + params.filename;
        }
        // playlist
        else {
            if (params.filename.indexOf('playlist_w111.m3u8') > -1) {
                weblogger.debug('>>>>> GETTING PLAYLIST, OF ENTRY %s, FLAVOR %s <<<<< %s', params.entryId, params.flavorId, params.filename );
                this.resetChunklistCount(params.entryId, params.flavorId);
            }
            params.playlist = true;
        }
        // Todo : make sure all the flavors chunklists are download is aligned.
        // this won't work if there is even single cunklist for single flavor that is missing in the
        // video entry repository
        // so, it is the responsibility of the Python live-testing application to make sure that
        // exact number of chunklist files with same names are downloaded.
        // otherwise there should be a mechanism to skip chunklists that are absent for one or more flavors

        parsed = true;
    } catch (err) {
        weblogger.error("Exception parsing url %s. Error: %s", url, ErrorUtils.error2string(err));
    }

    return parsed;
}

var httpMock=http.createServer(function(req, res) {

    try {
         var params = {
             entryId: '',
             flavorId: '',
             fullpath: '',
             filename: '',
             validate: false,
             playlist: false
         };

        if (testHelper.resolveUrl(req.url, params)) {
            if (!params.playlist || params.flavorId.indexOf('all') > -1) {
                var p = Q.resolve();

                if (params.validate) {
                    p = testHelper.validateFlavor(params.entryId, params.flavorId);
                }

               p.finally(function () {
                    weblogger.debug('Reading [%s], from \'DATA WAREHOUSE\'', params.fullpath);
                    readFile(res, params.fullpath, params.entryId);
                    weblogger.debug('successfully read [%s], from \'DATA WAREHOUSE\'', params.fullpath);
               });
            } else if (params.playlist) {
                res.writeHead(200);
                res.end(master_playlist[params.flavorId]);
            }else {
                // Unprocessable Entity (WebDAV; RFC 4918)
                // The request was well-formed but was unable to be followed due to semantic errors.
                res.writeHead(422);
                res.end();
            }
        } else {
            // 400 Bad Request
            // The server cannot or will not process the request due to an apparent client error
            // (e.g., malformed request syntax, invalid request message framing, or deceptive request routing)
            res.writeHead(400);
            res.end();
        }
    }catch(err) {
        weblogger.error("Exception returning response to monitor server %s, from \'DATA WAREHOUSE\'", ErrorUtils.error2string(err));
    }
}).listen(8888);

function RegressionAdapter() {
    var that = this;
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
        })
        return (result);
    })
}


module.exports = RegressionAdapter;

