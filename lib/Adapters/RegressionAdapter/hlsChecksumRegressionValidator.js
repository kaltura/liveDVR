/**
 * Created by lilach.maliniak on 12/07/2016.
 */
var Q = require('q');
var _ = require('underscore');
var fs = require('fs');
var util=require('util');
var logger = require('../../../common/logger');
var m3u8Handler = require('../../manifest/promise-m3u8');
var mkdirp = require('mkdirp');
var networkClient = require('./../../NetworkClientFactory').getNetworkClient();
const crypto = require('crypto');
const v_utility = require('./validatorUtility');
const qio = require('q-io/fs');
const ErrorUtils = require('../../utils/error-utils');
var RegressionValidatorBase = require('./RegressionValidatorBase')

function checksum (str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}

/*
  ------------------------------------------------------------------------------------------------------
  Class HlsChecksumRegressionValidator
  ------------------------------------------------------------------------------------------------------
  This class is responsibilities:
   (1) Generate baseline database (json file), with properties of stream (e.g. bytes count, checksum) for
   all the chunklists and segments (ts files), fetched from the packager for single Live entry, during regression test
   period.
 */
class HlsChecksumRegressionValidator extends RegressionValidatorBase {

    constructor(config, flavors, chunklistIndexes, verbose) {
        super(config, flavors, chunklistIndexes, verbose);

        this.logger = logger.getLogger('hlsChecksumRegressionValidator');
        this.override = config.validator.override;
        // path to load/save regression test results
        // the path is initialized in init()
        this.fullpath = config.validator.path + '/' + config.entryPath;
        if (config.entryPath.lastIndexOf('/') < this.fullpath.length - 1) {
            this.fullpath += '/';
        }
        // add root to path
        this.db_filename = this.fullpath + this.entryId + '_regression_test_db.json';

        // create initial json for regression results database
        this.regression_results_db;
        this.this_run_results = {};
        this.latest_regression_path = config.validator.path + '/' + 'last_regression_run/';
        this.last_chunklist_checksum = {};
    }

    init() {
        let deferred = Q.defer();

        if (!this.isEntryConfigValid()) {
            deferred.reject('illegal or undefined chunklist indexes');
        }

        this.loadResultsDatabase()
            .then(() => {
                this.logger.debug('[%s] regression tests validator successfully initialized.', this.entryId);
                deferred.resolve();
            })
            .catch((err) => {
                this.logger.error('[%s] failed to initialize regression tests validator. Error: %s', this.entryId, ErrorUtils.error2string(err));
                deferred.reject(err);
            });

        return deferred.promise;
    }

    validateAllFlavors(index) {
        let p = _.map(this.flavors, (next_flavor) => {
            this.log_header = `[${this.entryId}-${next_flavor}] <<<< ${index} >>>> `;
            this.logger = logger.getLogger("FlavorDownloader", this.log_header);
            return this.validateSingleFlavor(next_flavor, index);
        });

        return Q.all(p)
    }

    saveResultsToFile(reason, error) {

        var that = this;
        var test_passed = !(reason.localeCompare('validation failed') === 0);
        var fullpath = test_passed ? this.db_filename : that.fullpath + that.entryId + '_all_regression_run_results.json';
        var what = test_passed ? 'new regression test db' : 'regression results of failed test';
        if (error) {
            if (!this.this_run_results.hasOwnProperty('errors')) {
                this.this_run_results['errors'] = {};
            }
            let errMsg = _.isObject(error) ? error.message : error;
            this.this_run_results['errors'][new Date().toISOString()] = errMsg;
        }

        this.logger.info('[%s] saving regression results. Reason: %s', this.entryId, reason);

        if (this.config.override || this.regression_results_db === undefined || !test_passed) {
            return qio.write(fullpath, JSON.stringify(this.this_run_results, null, 2))
                .then(function() {
                    that.logger.debug('>>>>>> @@@ [%s] successfully saved %s, %s. Path: %s', that.entryId, what, reason, fullpath);
                })
                .catch(function(err) {
                    that.logger.error('>>>>>> !!! [%s] error writing %s to %s (save reason: %s). Path: %s, Error: %s', that.entryId, what, reason, fullpath, ErrorUtils.error2string(err));
                });
        }
        else {
            this.logger.debug('[%s] \'override\' is false, not saving %s to %s.', that.entryId, what, fullpath);
            return Q.resolve(0);
        }
    }

}

HlsChecksumRegressionValidator.prototype.createDestinationDir = function() {

    var that = this;
 
    return qio.makeTree(that.fullpath)
        .then(() => {return qio.removeTree(that.latest_regression_path);})
        .then(function () {
            that.logger.debug(`[${that.entryId}] CLEANUP SUCCEEDED @@@@ removed content of ${that.latest_regression_path}`);
        })
        .catch(function (err) {
            if (err.code != 'ENOENT') {
                that.logger.error(`[${that.entryId}] cannot clean ${that.latest_regression_path} doesn't exist. Error: ${ErrorUtils.error2string(err)}`);
                return Q.reject(err);
            } else {
                that.logger.error(`[${that.entryId}] ${that.latest_regression_path} doesn't exist, no cleanup done.`);
            }
        })
        .then( function() {
            return qio.makeTree(that.latest_regression_path)
        })
        .then( function() {
            that.logger.debug(`[${that.entryId}] successfully created dir to save "latest regression test results", [${that.fullpath}]`);
        })
        .catch (function(err) {
            that.logger.error(`[${that.entryId}] error creating dir to save "latest regression test results", [${that.fullpath}]. Error: ${ErrorUtils.error2string(err)}`);
        });
}

HlsChecksumRegressionValidator.prototype.getSegmentFromPackager = function(item, data) {

    var that = this;
    var deferred  = Q.defer();
    data.errors[data.flavor] = {errors: {}};
    url = `http://localhost:8080/live/hls/p/0/e/${this.entryId}/${item.properties.uri}`;
    var options = {
        method: 'HEAD',
        url: url,
        timeout: 10000};

    networkClient.read(options)
        .then(function (content) {
            var ts_id = item.properties.uri.split('.')[0];
            if (!_.has(that.this_run_results[data.flavor].ts[ts_id])) {
                that.this_run_results[data.flavor].ts[ts_id] = parseInt(content.headers['content-length']);
                deferred.resolve();
            } else if (that.this_run_results[flavorId].ts[ts_id] != content.headers.length) {
                that.logger.debug('%s validation failed', ts_id);
                let err_msg = 'chunk validation failed, url=' + url;
                data.errors[data.flavor].errors[url] = err_msg;
                data.errors[data.flavor]['action item'] = 'check if it\'s a bug';
                return Q.reject(err_msg);
            }
        })
        .catch(function (err) {
            let err_msg = ErrorUtils.error2string(err);
            if (_.isObject(err)) {
                data.errors[data.flavor].errors[url] = err_msg;
                data.errors[data.flavor]['action item'] = 'verify url correctness';
            }
            that.logger.debug('[%s] ***** VALIDATION FAILED!!! ***** error=[%s], url=[%s]', data.flavor, err_msg, item.properties.uri);
            deferred.reject(data.errors);
        });

    return deferred.promise;
}

HlsChecksumRegressionValidator.prototype.downloadFlavorSegments = function(data) {

    let that = this;

    if (data.m3u8.items.PlaylistItem === undefined) {
        return Q.reject('this is a bug, \'playlist.m3u8.PlaylistItem\' is undefined');
    }

    let p = _.map(data.m3u8.items.PlaylistItem, function(item) {
        that.logger.debug('next playlist item to validate %s', item.properties.uri);
        return that.getSegmentFromPackager(item, data);
    });

    return Q.all(p)
        .then(function() {
            return Q.resolve(data.m3u8);
        })
        .catch(function() {
            return Q.reject(data.errors);
        });
}

HlsChecksumRegressionValidator.prototype.addChunklist = function (chunklist, flavorId, index) {

    let that = this;
    var data = { 'm3u8': undefined, 'flavor':flavorId, 'index':index, 'errors': {}};
    var deferred = Q.defer();

    that.logger.debug(`[${flavorId}] PACKAGER's CHUNKLIST: [${chunklist}]`);

    // check if flavor exists and add to results if not
    if (!_.has(this.this_run_results, flavorId))
    {
        this.this_run_results[flavorId] = { 'ts': {}, 'm3u8': {} };
    }

    m3u8Handler.parseM3U8(chunklist, {'verbatim': true})
        .then(function(m3u8) {
            if (!_.has(that.this_run_results[flavorId].m3u8[index])) {
                that.this_run_results[flavorId].m3u8[index] = checksum(m3u8.toString());
               // if (that.verbose) {
                    if (!that.this_run_results[flavorId].content) {
                        that.this_run_results[flavorId].content = {};
                    }
                    that.this_run_results[flavorId].content[index] = [`${chunklist}`];
               // }
            }
            if (that.last_chunklist_checksum[flavorId] &&
                that.this_run_results[flavorId].m3u8[index].localeCompare(that.last_chunklist_checksum[flavorId]) === 0) {
                that.logger.warn(`[f-${flavorId}][i-${index}] chunklist didn't change between iterations!!! failing regression current: ${that.last_chunklist_checksum[flavorId]} previous: ${that.this_run_results[flavorId].m3u8[index]}`);
            } else {
                that.last_chunklist_checksum[flavorId] = that.this_run_results[flavorId].m3u8[index];
                //that.logger.debug('[f-%j][i-%d] current checksum: %s, last checksum: %s', flavorId, index, that.this_run_results[flavorId].m3u8[index], that.last_chunklist_checksum[flavorId]);
            }
            return m3u8;
        })
        .then(function(m3u8) {
            data.m3u8 = m3u8;
            return that.downloadFlavorSegments(data)
        })
        .then(function() {
            deferred.resolve(data.m3u8);
        })
        .catch(function (errors) {
            if (flavorId in errors) {
                deferred.reject(errors);
            }
            else {
                let err_msg = ErrorUtils.error2string(errors);
                data.errors[flavorId].errors[new Date().toISOString()] = err_msg;
                deferred.reject(data.errors);
            }
        });

    return deferred.promise;
}

HlsChecksumRegressionValidator.prototype.validateSingleFlavor = function (flavorId, index) {

    let that = this;
    var deferred = Q.defer();
    let url = util.format(`http://localhost:8080/live/hls/p/0/e/${this.entryId}/index-s${flavorId}.m3u8`);
    var options = {
        url: url,
        headers:{'cache-control':'no-cache'},
        timeout: 10000};

    try {
        that.logger.debug('getting chunklist, url=[%s]', url);

        networkClient.read(options)
            .then((content) => {
                that.logger.trace("Response header: %j", content.headers);
                return that.addChunklist(content.body, flavorId, index);
            })
            .then(function (m3u8) {
                that.logger.info('***** SUCCESSFULLY VALIDATED ***** flavor=[%s], url=[%s], content=[%s]', flavorId, url, m3u8.toString());
                deferred.resolve(m3u8);
            })
            .catch(function (errors) {

                var err_obj = {};
                let err_msg = ErrorUtils.error2string(errors);

                if (!_.has(errors, flavorId)) {
                    err_obj[flavorId] = {errors: {}};
                    err_obj[flavorId].errors[new Date().toISOString()] = err_msg;
                    err_obj[flavorId]['action item'] = 'verify nginx is running!';
                } else {
                    err_obj = errors;
                }

                that.logger.error('[%s] ***** VALIDATION FAILED!!! ***** error=[%s], url=[%s]', flavorId, err_msg, url);
                return that.validateResults(false, err_obj)
                    .done(() => {
                        deferred.reject('validation failed');
                    });
            });
    }
    catch (err) {
        that.logger.error('failed to get chunklist');
        deferred.reject(err);
    }

    return deferred.promise;
}

HlsChecksumRegressionValidator.prototype.validateResults = function(do_validate, errors) {

    this.logger.info('[%s] starting to validate regression results.', this.entryId);

    return v_utility.validateRegressionResults.call(this, (do_validate && !this.override), errors);
}

HlsChecksumRegressionValidator.prototype.loadResultsDatabase = function () {

    var that = this;

    return this.createDestinationDir()
        .then( function() {
            // todo: check if file exist and history_count > 0 than rename.

            // todo: count files and delete old files so that total number including new one is up to history_count

            if (that.override === true) {
                that.logger.debug("[%s] creating new database for regression test results!", that.entryId);
            }
            else {
                that.logger.debug('Going to open %s. Override=%s', that.db_filename, that.override);

                qio.read(that.db_filename)
                    .then(function (content) {
                        that.logger.debug('[%s] successfully read file %s.', that.entryId, that.db_filename);
                        that.regression_results_db = JSON.parse(content);
                    })
                    .catch(function (err) {
                        that.logger.info('[%s] failed to open regression tests db file, %s, @@@@ creating new regression db. Error: %s', that.entryId, that.db_filename, ErrorUtils.error2string(err));
                        that.override = true;
                        //return Q.resolve();
                    });
            }
        });

}


module.exports = HlsChecksumRegressionValidator;


