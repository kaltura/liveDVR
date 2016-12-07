/**
 * Created by lilach.maliniak on 10/08/2016.
 */
var Q = require('q');
var _ = require('underscore');
var config = require('../../../common/Configuration');
var regressionAdapterConfig = config.get('regressionAdapter');
if(!regressionAdapterConfig.enable)
    return;
var BaseAdapter=require('./../BaseAdapter.js').BaseAdapter;
var WowzaStreamInfo=require('./../WowzaStreamInfo.js');
var util=require('util');
var url=require('url');
var http=require('http');
var fs=require('fs');
var m3u8 = require('m3u8');
var logger = require('../../../common/logger');
var ErrorUtils = require('../../utils/error-utils');
var glob = require('glob');
const qio = require('q-io/fs');
const process = require('process');
const _utility = require('./regression_utility');
var validatorFactory = require('./RegressionValidatorFactory');
const persistenceFormat = require('./../../../common/PersistenceFormat');

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
        this.flavors = {};
        this.validation_failure_tolerated_count = {};
        this.fullpath = {};
        this.playlist_sent = {};
        // each flavor has new promise created each time chunklist retrieved.
        // the promise is resolved by min flavor when it started to perform the validation
        this.promise_per_flavor = {};
        this.total_chunkslists = 0;
        this.analyzer_root = regressionAdapterConfig.analyzerRootPath;
        this.chunklist_map = {};
        this.ts_map = {};

    }
}

class RegressionEngine {

    constructor(regressionAdapter)
    {
        this.regressionAdapter = regressionAdapter;
        this.rootFolderPath = regressionAdapterConfig['dataWarehouseRootFolderPath'];
        this.entries = {};
        this.logger = logger.getLogger('regressionAdapter');
        this.validators = {};
        this.start_time = process.hrtime();
    }
}

RegressionEngine.prototype.logRegressionProgress = function (entryId) {

    let progress = (100 * (this.entries[entryId].chunklist_count - this.entries[entryId].initial_chunklist_index + 1) / this.entries[entryId].total_chunkslists).toFixed();
    let msg = util.format('>>>>>>>> [index %d] progress %d\%', this.entries[entryId].chunklist_count, progress);
    console.log(msg);
    this.logger.info(msg);
    setTimeout(() => {
        this.logRegressionProgress.call(this , entryId);
    }, 20000);
}

RegressionEngine.prototype.initEntries = function() {

    var that = this;
    let config_is_valid = config.get('valid');

    if (!config_is_valid) {
        let err = new Error();
        return Q.reject({code:-7, message:'invalid configuration', stack: err.stack});
    }

    var p = _.map(entriesInfo, function (entryConfig) {
        // remove directory
        var fullpath = persistenceFormat.getEntryBasePath(entryConfig.entryId);

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
                    that.logger.warn('[%s] didn\'t remove %s, file doesn\'t exist.', entryConfig.entryId, fullpath, ErrorUtils.error2string(err));
                }
            })
            .then (function() {
                let flavors = entryConfig.flavorParamsIds.split(',').map((item) => item.trim());

                that.entries[entryConfig.entryId] = new RegressionEntryInfo(entryConfig.entryId);
                that.entries[entryConfig.entryId].flavors = flavors;
                that.entries[entryConfig.entryId].entryPath = entryConfig.entryPath;

                let path_fix = entryConfig.entryPath.replace('%20', ' ');
                that.entries[entryConfig.entryId].data_warehouse_path = that.rootFolderPath + '/' + path_fix + '/' + flavors[0];
                that.entries[entryConfig.entryId].entryPath = entryConfig.entryPath;
                that.entries[entryConfig.entryId].initial_chunklist_index = parseInt(entryConfig.start_chunklist_index);
                that.entries[entryConfig.entryId].chunklist_count = that.entries[entryConfig.entryId].initial_chunklist_index - 1;
                that.entries[entryConfig.entryId].last_chunklist_index = parseInt(entryConfig.last_chunklist_index);
                that.entries[entryConfig.entryId].total_chunkslists = 1 + that.entries[entryConfig.entryId].last_chunklist_index - that.entries[entryConfig.entryId].initial_chunklist_index;
            })
            .then(function () {
                that.validators[entryConfig.entryId] = validatorFactory.getValidator(
                    entryConfig,
                    that.entries[entryConfig.entryId].flavors,
                    {start_index: that.entries[entryConfig.entryId].initial_chunklist_index,
                    end_index: that.entries[entryConfig.entryId].last_chunklist_index},
                    regressionAdapterConfig.verbose);
            })
            .then(function() {
                return that.validators[entryConfig.entryId].init()
                    .catch((err) => {
                        that.logger.error('[%s] initialization failed. Error: %s', entryConfig.entryId, ErrorUtils.error2string(err));
                        deferred.reject(err);
                    });
            })
            .then(function () {
                _.each(that.entries[entryConfig.entryId].flavors, function (flavor) {
                    that.entries[entryConfig.entryId].chunklist_index[flavor] = that.entries[entryConfig.entryId].initial_chunklist_index - 1;
                    that.entries[entryConfig.entryId].validation_failure_tolerated_count[flavor] = 0;
                    that.entries[entryConfig.entryId].fullpath[flavor] = persistenceFormat.getFlavorFullPath(entryConfig.entryPath, flavor);
                    that.entries[entryConfig.entryId].playlist_sent[flavor] = 0;
                    that.entries[entryConfig.entryId].promise_per_flavor[flavor] = Q.defer();
                    that.entries[entryConfig.entryId].chunklist_map[flavor] = {};
                    that.entries[entryConfig.entryId].ts_map[flavor] = {};
                    that.mapStreamFiles(entryConfig.entryId, flavor);
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

RegressionEngine.prototype.mapStreamFiles = function (entryId, flavor) {

    let that =  this;
    
    let chunklists = glob.sync(`${this.entries[entryId].fullpath[flavor]}/**/*.m3u8`);

    this.entries[entryId].chunklist_map[flavor] = chunklists.reduce( (map, fullPath) => {
        let filename = fullPath.substr(fullPath.lastIndexOf('/')+1);
        map[filename] = fullPath;
        return map;
    }, {});
 /*
    _.each(Object.keys(that.entries[entryId].chunklist_map[flavor]), (item) => {
        this.logger.debug(`<><><><> the new chunklists map [${entryId}-${flavor}]: [${item},${that.entries[entryId].chunklist_map[flavor][item]}]`);
    });*/

    let tsFiles = glob.sync(`${this.entries[entryId].fullpath[flavor]}/**/*.ts`);

    this.entries[entryId].ts_map[flavor] = tsFiles.reduce( (map, fullPath) => {
        let filename = fullPath.substr(fullPath.lastIndexOf('/')+1);
        map[filename] = fullPath;
        return map;
    }, {});
    
   /* _.each(Object.keys(this.entries[entryId].ts_map[flavor]), (item) => {
        this.logger.debug(`<><><><> the new Tss map [${entryId}-${flavor}]: [${item},${this.entries[entryId].ts_map[flavor][item]}]`);
    });*/

}

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


RegressionEngine.prototype.validateAllFlavors = function (entryId, flavorId) {

    var that = this;
    var validate_delay_milliseconds = 500;
    var index = this.entries[entryId].chunklist_index[flavorId] - 1;
    // todo: replace with call to his.logger = logger.getLogger("FlavorDownloader", this.log_header);
    var log_header = logheader1 `${entryId}${flavorId}${index}`;

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
                return that.validators[entryId].validateAllFlavors(index)
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
                            that.logger.debug('%s @@@ finished regression test.', log_header);
                            that.endRegression(entryId, index);
                        }
                    })
                    .catch( function(err) {
                        that.entries[entryId].chunklist_count = that.entries[entryId].last_chunklist_index;
                        that.logger.error('%s ***** VALIDATION FAILED!!! ***** error=[%s]', log_header,  ErrorUtils.error2string(err));
                        that.gracefullyExit(err, entryId);
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
            setTimeout(function () {
                that.validateAllFlavors(entryId, flavorId);
            }, validate_delay_milliseconds);
        });

};

RegressionEngine.prototype.endRegression = function(entryId, index) {

    this.validators[entryId].validateResults(true)
        .then(() => {
            return this.validators[entryId].saveResultsToFile(`finished regression test. last processed chunklist <<<< ${index} >>>>`);
        })
        .then((code) => {
            code = code || 0;
            this.gracefullyExit(code, entryId);
        })
        .catch((err) => {
            this.logger.error(`validation/save results error. Error: ${ ErrorUtils.error2string(err)}`);
            this.gracefullyExit(err, entryId);
        });
}


RegressionEngine.prototype.resolveUrl = function(url, params) {

    var that = this;
    var deferred = Q.defer();

    try {
        var re=/(.*)_definst_\/(.*)_(%20)?(.*)\/(.*)/.exec(url);
        params.entryId = re[2];
        params.flavorId = re[4];
        params.filename = re[5];
        params.request_type.chunklist = this.checkFlavorDownloadStarted(params);

        // chunklist
        if (params.request_type.chunklist) {
            
            params.validate = this.isMinFlavor(params.entryId, params.flavorId);
            var extended_filename = this.nextChunklist(params.entryId, params.flavorId);
            params.fullpath = this.entries[params.entryId].chunklist_map[params.flavorId][extended_filename];

            if (!params.fullpath) {
                let errMsg = `<<-- ERROR -->> call developer, need check data warehouse integrity. Next chunklist is ${extended_filename} but failed to get chunklist map entry for: ${params.entryId}, [${params.flavorId}], requested url: ${url}`;
                let err = new Error();
                this.logger.error(errMsg);
                this.gracefullyExit({code: -11, message: errMsg, stack: err.stack}, params.entryId);
                deferred.reject(`failed to parse url!`);
            }

            this.logger.info('[%s-%s] <<<< index %s >>>> next chunklist to get from DATA WAREHOUSE, fullpath=%s', params.entryId, params.flavorId, this.entries[params.entryId].chunklist_index[params.flavorId],  params.fullpath);

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
                        that.logger.error(`[${params.entryId}-${params.flavorId}] #### cannot proceed with regression due to critical error, check that ${params.fullpath} exists. Error: [${ErrorUtils.error2string(err)}]`);
                        that.gracefullyExit(err, params.entryId);
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
            params.fullpath = this.entries[params.entryId].ts_map[params.flavorId][params.filename];
            if (!params.fullPath) {
                params.filename = persistenceFormat.compressTsChunkName(params.filename);
                params.fullpath = this.entries[params.entryId].ts_map[params.flavorId][params.filename];
            }
            deferred.resolve();
        }
        else if (params.request_type.playlist) {
            deferred.resolve();
        }

        else {
            deferred.reject('<<<< index %s >>>> failed to recognize request type, url=%s', params.entryId, params.flavorId, this.entries[params.entryId].chunklist_index[params.flavorId],  url);
        }
        // Todo : make sure all the flavors chunklists are downloaded and aligned.
        // this won't work if there is even single cunklist for single flavor that is missing in the
        // video entry repository
        // so, it is the responsibility of the Python live-testing application to make sure that
        // exact number of chunklist files with same names are downloaded.
        // otherwise there should be a mechanism to skip chunklists that are absent for one or more flavors
    } catch (err) {
        this.logger.error("error parsing url %s. Error: %s", url, ErrorUtils.error2string(err));
        deferred.reject(err);
    }

    return deferred.promise

};

RegressionEngine.prototype.gracefullyExit = function(error, entryId) {

    let deferred = Q.defer();

    let code = error.code || error;
    code = !isNaN(code) ? code : -5;

    if (error != 0) {
        let errMsg = `regression ended with error: [${ErrorUtils.error2string(error)}]`;
        this.logger.error(errMsg);
        console.error(errMsg);
        if (entryId) {
            this.validators[entryId].saveResultsToFile('validation failed', errMsg)
                .done(() => {
                    deferred.resolve();
                });
        } else {
            deferred.resolve();
        }
    } else {
        deferred.resolve();
    }

    deferred.promise
        .done(() => {
            _utility.logCommandLineArgs();
            let total_run_time = process.hrtime(this.start_time);
            this.logger.info(`================================================================================`);
            this.logger.info(`@@@ exiting with code [${code}], total run time <<< ${(total_run_time[0] + total_run_time[1] / 1e9).toFixed(3)} seconds >>>`);
            this.logger.info(`================================================================================`);

            this.regressionAdapter.emit('exit', code);
    });
}

RegressionEngine.prototype.checkFlavorDownloadStarted = function(params) {
    let chunklistRequested = params.filename.indexOf('chunklist.m3u8') > -1;
    let startDownload = chunklistRequested && this.entries[params.entryId].playlist_sent[params.flavorId] === 1;
    if (startDownload) {
        params.request_type.playlist = true;
        this.logger.debug('>>>>> GETTING STARTED WITH ENTRY %s, FLAVOR %s <<<<< ', params.entryId, params.flavorId);
        this.resetChunklistCount(params.entryId, params.flavorId);
        return false;
    } else if (chunklistRequested && this.entries[params.entryId].playlist_sent[params.flavorId] === 0) {
        this.entries[params.entryId].playlist_sent[params.flavorId] = 1;
    }
    return chunklistRequested;
}


module.exports = RegressionEngine;