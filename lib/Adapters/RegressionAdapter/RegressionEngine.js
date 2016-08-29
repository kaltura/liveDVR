/**
 * Created by lilach.maliniak on 10/08/2016.
 */
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
//var validator = require('./hlsStreamRegressionValidator');
var ErrorUtils = require('../../utils/error-utils');
var glob = require('glob');
const qio = require('q-io/fs');
const process = require('process');
const genUtils = require('../../utils/general-utils');
var validatorFactory = require('./StreamRegressionValidatorFactory');

var regressionAdapterConfig = config.get('regressionAdapter');
var mediaServer = config.get('mediaServer');
var entriesInfo = config.get('regressionAdapter').entries;


let logheader1 = function(literals, ...values) {

    return '[' + values[0] + '-' + values[1] + '] <<<< ' + values[2] + ' >>>> ';

};


class RegressionEntryInfo {

    constructor(entryId) {
        this.id = entryId;
        this.chunklist_index = {};
        this.playlist = {};
        this.initial_chunklist_index = -1;
        this.last_chunklist_index = -1;
        this.chunklist_count = this.initial_chunklist_index - 1;
        // this.data_warehouse_path = 'undefined';
        this.flavors = {};
        this.validation_failure_tolerated_count = {};
        this.fullpath = {};
        this.playlist_sent = {};
        // each flavor has new promise created each time chunklist retrieved.
        // the promise is resolved by min flavor when it started to perform the validation
        this.promise_per_flavor = {};

    }
}

class RegressionEngine {

    constructor(controller)
    {
        this.controller = controller;
        this.rootFolderPath = regressionAdapterConfig['dataWarehouseRootFolderPath'];
        this.entries = {};
        this.logger = logger.getLogger('regressionAdapter');
        this.validators = {};
    }
}

RegressionEngine.prototype.logRegressionProgress = function (entryId) {

    let progress = (100 * (this.entries[entryId].chunklist_count - this.entries[entryId].initial_chunklist_index + 1) / this.entries[entryId].total_chunkslists).toFixed();
    let msg = util.format('>>>>>>>> [index %d] progress %d\%', this.entries[entryId].chunklist_count, progress);
    console.log(msg);
    setTimeout(() => {
        this.logRegressionProgress.call(this , entryId);
    }, 20000);
}

RegressionEngine.prototype.initEntries = function() {

    var that = this;

    var root_mp4_path = config.get('rootFolderPath');

    var p = _.map(entriesInfo, function (entryConfig) {
        // remove directory
        var fullpath = root_mp4_path + '/' + entryConfig.entryId;

        var deferred = Q.defer();

        qio.removeTree(fullpath)
            .then(function () {
                that.logger.debug('[%s] CLEANUP SUCCEEDED @@@@ removed content of path=%s', entryConfig.entryId, fullpath);
            })
            .catch(function (err) {
                if (err.code != 'ENOENT') {
                    that.logger.error('[%s] couldn\'t remove %s, path doesn\'t exist. Error: %s', entryConfig.entryId, fullpath, ErrorUtils.error2string(err));
                    deferred.reject();
                }
                else {
                    that.logger.error('[%s] error removing %s. Error: %s', entryConfig.entryId, fullpath, ErrorUtils.error2string(err));
                }
            })
            .then (function() {
                var flavors = entryConfig.flavorParamsIds.split(',').map((item) => item.trim());

                that.entries[entryConfig.entryId] = new RegressionEntryInfo(entryConfig.entryId);
                that.entries[entryConfig.entryId].flavors = flavors;
                that.entries[entryConfig.entryId].entryPath = entryConfig.entryPath;

                var path_fix = entryConfig.entryPath.replace('%20', ' ');
                that.entries[entryConfig.entryId].data_warehouse_path = that.rootFolderPath + '/' + path_fix + '/' + flavors[0];
                that.entries[entryConfig.entryId].entryPath = entryConfig.entryPath;
            })
            .then( function() {
                if (!entryConfig.start_chunklist_index || !entryConfig.last_chunklist_index ||
                entryConfig.start_chunklist_index === -1 || entryConfig.last_chunklist_index === -1
                || isNaN(entryConfig.start_chunklist_index) || isNaN(entryConfig.last_chunklist_index)) {
                    throw 'invalid or undefined chunklist indexes';
                }
                
                that.entries[entryConfig.entryId].initial_chunklist_index = parseInt(entryConfig.start_chunklist_index);
                that.entries[entryConfig.entryId].chunklist_count = that.entries[entryConfig.entryId].initial_chunklist_index - 1;
                that.entries[entryConfig.entryId].last_chunklist_index = parseInt(entryConfig.last_chunklist_index);
                that.entries[entryConfig.entryId].total_chunkslists = 1 + that.entries[entryConfig.entryId].last_chunklist_index - that.entries[entryConfig.entryId].initial_chunklist_index;

            })
            .then(function () {
                that.validators[entryConfig.entryId] = validatorFactory.getValidator(entryConfig, that.entries[entryConfig.entryId].flavors, that.entries[entryConfig.entryId].last_chunklist_index);
            })
            .then(function() {
                return that.validators[entryConfig.entryId].init();
            })
            .then(function () {
                _.each(that.entries[entryConfig.entryId].flavors, function (flavor) {
                    that.entries[entryConfig.entryId].chunklist_index[flavor] = that.entries[entryConfig.entryId].initial_chunklist_index - 1;
                    that.entries[entryConfig.entryId].validation_failure_tolerated_count[flavor] = 0;
                    that.entries[entryConfig.entryId].fullpath[flavor] = that.rootFolderPath + '/' + entryConfig.entryPath + '/' + flavor;
                    that.entries[entryConfig.entryId].playlist_sent[flavor] = false;
                    that.entries[entryConfig.entryId].promise_per_flavor[flavor] = Q.defer();
                });
                that.logRegressionProgress(entryConfig.entryId);

            }).then(function() {
            deferred.resolve();
        }).catch(function (err) {
            that.logger.error('[%s] initialization failed. Error: %s', entryConfig.entryId, ErrorUtils.error2string(err));
            deferred.reject();
        });

        return deferred.promise;
    });

    return Q.all(p);
};

RegressionEngine.prototype.resetChunklistCount = function(entryId, flavorId) {

    this.entries[entryId].chunklist_index[flavorId] = this.entries[entryId].initial_chunklist_index - 1;
    this.logger.debug('[%s-%s] reset chunklist index of flavor %s to %s after playlist initialized', entryId,
        flavorId, flavorId, this.entries[entryId].chunklist_index[flavorId]);
};

RegressionEngine.prototype.nextChunklist = function (entryId, flavorId) {

    if (this.entries[entryId].chunklist_index[flavorId] < this.entries[entryId].last_chunklist_index) {

        this.entries[entryId].chunklist_index[flavorId]++;
    }

    return ('chunklist_' + this.entries[entryId].chunklist_index[flavorId] ) + '.m3u8';
};

RegressionEngine.prototype.isMinFlavor = function (entryId, flavorId) {

    var min = _.min(this.entries[entryId].flavors);

    return (min === flavorId);
};

RegressionEngine.prototype.exitRegressionWithError = function(entryId, flavorId, iteration, errors, url) {

    let that = this;
    let err_obj = errors;
    let deferred = Q.defer();
    var flavor_header = logheader1 `${entryId}${flavorId}${iteration}`;

 /*   if (that.entries[entryId].status.localeCompare(regression_status.running) === 0) {
        that.entries[entryId].status = regression_status.stopped;
*/
        if (!_.has(err_obj, flavorId)) {
            let err_msg = ErrorUtils.error2string(errors);
            err_obj[flavorId] = {errors: {}};
            err_obj[flavorId].errors[new Date().toISOString()] = err_msg;
            err_obj[flavorId]['action item'] = 'verify nginx is running!';
            that.logger.error('%s ***** VALIDATION FAILED!!! ***** error=[%s], url=[%s]', flavor_header, err_msg, url);
        }

        return this.validators[entryId].validateResults(false, err_obj)
            .catch(function (err) {
                that.logger.debug('%s save regression results failed. Check if it\'s a bug. Error=[%s], url=[%s]', flavor_header, ErrorUtils.error2string(err), url);
                return err;
            })
            .then(function(err) {
                if (!isNaN(err)) {
                    that.gracefullyExit(parseInt(err))
                } else {
                    that.gracefullyExit(-5);
                }
            })
            .then(function() {
                deferred.reject();
            });

 /*   } else {
        deferred.reject();
    }*/

    return deferred.promise;
}



RegressionEngine.prototype.validateAllFlavors = function (entryId, flavorId) {

    var that = this;
    var validate_delay_milliseconds = 500;
    var exit_delay_milliseconds = 1000;
    var progress_report_milliseconds = 30000;
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
                return that.validators[entryId].validateSingleFlavor(entryId, next_flavor, index);
            });

            return Q.all(p)
                .then(function () {
                    that.entries[entryId].chunklist_count++;
                    if (that.entries[entryId].chunklist_count === that.entries[entryId].last_chunklist_index) {
                        that.logRegressionProgress(entryId);
                        return true;
                    }
                    return false;
                })
                .then( function(finished) {
                    if (finished) {
                        //that.entries[entryId].status = regression_status.stopped;
                        that.logger.debug('%s @@@ finished regression test.', log_header);
                        return that.validators[entryId].saveResultsToFile('finished regression test. last chunklist index ' + index)
                            .then( function() {
                                return that.validators[entryId].validateResults(true)
                                    .catch(function(err) {
                                        throw err;
                                    });
                            })
                            .then(function () {
                                return Q.delay(exit_delay_milliseconds);
                            })
                            .then(function() {
                                that.gracefullyExit(0);
                            })
                            .catch(function (err) {
                                if (!isNaN(err)) {
                                    that.logger.error('%s error, %s', entryId, that.entries[entryId].chunklist_count, log_header, ErrorUtils.error2string(err));
                                }

                                var code = !isNaN(err) ? parseInt(err) : -5;

                                return that.validators[entryId].saveResultsToFile('validation failed')
                                    .then(function() {
                                        return Q.delay(exit_delay_milliseconds);
                                    })
                                    .then(function() {
                                        that.gracefullyExit(code);
                                    })
                                    .catch( function(err) {
                                        that.logger.error('%s error saving regression results of failed test. Error: %s', log_header, ErrorUtils.error2string(err));
                                        return Q.delay(exit_delay_milliseconds);
                                    })
                                    .then(function() {
                                        that.gracefullyExit(code);
                                    });
                            });
                    }
                })
                .catch( function(err) {
                    that.entries[entryId].chunklist_count++;
                    //that.entries[entryId].status = regression_status.stopped;
                    that.logger.error('%s aggregating results returned error, %s.', log_header, err);
                    that.gracefullyExit(-9);
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

RegressionEngine.prototype.resolveUrl = function(url, params) {

    var that = this;
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
            params.validate = this.isMinFlavor(params.entryId, params.flavorId);
            var extended_filename = this.nextChunklist(params.entryId, params.flavorId);
            params.fullpath = this.entries[params.entryId].fullpath[params.flavorId] + '/' + extended_filename;
            this.logger.info('[%s-%s] <<<< iteration %s >>>> next chunklist to get from DATA WAREHOUSE, fullpath=%s', params.entryId, params.flavorId, this.entries[params.entryId].chunklist_index[params.flavorId],  params.fullpath);

            if (this.entries[params.entryId].chunklist_index[params.flavorId] ===
                this.entries[params.entryId].initial_chunklist_index) {
                this.entries[params.entryId].promise_per_flavor[params.flavorId].resolve();
                deferred.resolve();
            }
            else if (params.validate) {
                this.validateAllFlavors(params.entryId, params.flavorId)
                    .then(function () {
                        deferred.resolve();
                    })
                    .catch(function (err) {
                        that.logger.error('[%s-%s] ##### is this is a bug??? validateAllFlavors() returned reject with err %s', params.entryId, params.flavorId, err);
                        deferred.reject(err);
                    });
            }
            else {
                deferred.resolve();
            }
        }
        // segment (ts)
        else if (params.filename.substr(-3).localeCompare('.ts') === 0) {
            params.request_type.ts = true;
            params.fullpath = this.entries[params.entryId].fullpath[params.flavorId] + '/' + params.filename;

            deferred.resolve();
        }
        // playlist (master manifest)
        else if (params.filename.indexOf('playlist_w111.m3u8') > -1) {
            params.request_type.playlist = true;
            this.logger.debug('>>>>> GETTING PLAYLIST, OF ENTRY %s, FLAVOR %s <<<<< %s', params.entryId, params.flavorId, params.filename );
            this.resetChunklistCount(params.entryId, params.flavorId);

            deferred.resolve();
        }
        else {
            deferred.reject('<<<< iteration %s >>>> failed to recognize request type, url=%s', params.entryId, params.flavorId, this.entries[params.entryId].chunklist_index[params.flavorId],  url);
        }
        // Todo : make sure all the flavors chunklists are download is aligned.
        // this won't work if there is even single cunklist for single flavor that is missing in the
        // video entry repository
        // so, it is the responsibility of the Python live-testing application to make sure that
        // exact number of chunklist files with same names are downloaded.
        // otherwise there should be a mechanism to skip chunklists that are absent for one or more flavors
    } catch (err) {
        this.logger.error("error parsing url %s. Error: %s", url, ErrorUtils.error2string(err));
        deferred.reject();
    }

    return deferred.promise

};

RegressionEngine.prototype.gracefullyExit = function(error) {
    genUtils.logCommandLineArgs();
    this.controller.emit('exit', error);
}

module.exports = RegressionEngine;
