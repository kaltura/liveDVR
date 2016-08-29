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
var getDirName = require('path').dirname;
var networkClient = require('./../../NetworkClientFactory').getNetworkClient();
const crypto = require('crypto');
const v_utility = require('./validatorUtility');
const qio = require('q-io/fs');
const ErrorUtils = require('../../utils/error-utils');
var StreamRegressionValidatorBase = require('./StreamRegressionValidatorBase')


function checksum (str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}

let logheader1 = function(literals, ...values) {

    return '[' + values[0] + '-' + values[1] + '] <<<< ' + values[2] + ' >>>> ';

};

/*
  ------------------------------------------------------------------------------------------------------
  Class HlsStreamRegressionValidator
  ------------------------------------------------------------------------------------------------------
  This class is responsibilities:
   (1) Generate baseline database (json file), with properties of stream (e.g. bytes count, checksum) for
   all the chunklists and segments (ts files), fetched from the packager for single Live entry, during regression test
   period.
 */
class HlsStreamRegressionValidator extends StreamRegressionValidatorBase {

    constructor (config, flavors, last_chunklist_index) {
        super(config, flavors, last_chunklist_index);

        this.logger = logger.getLogger('hlsStreamRegressionValidator');
        this.override = config.validator.override;
        this.last_chunklist_index = last_chunklist_index;
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
    }

}

HlsStreamRegressionValidator.prototype.init = function() {
    
    var that = this;
    return this.loadResultsDatabase()
        .then( function() {
            that.logger.debug('[%s] regression tests validator successfully initialized.', that.entryId);
        })
        .catch (function(err) {
            that.logger.error('[%s] failed to initialize regression tests validator. Error: %s', that.entryId, ErrorUtils.error2string(err));
        });
}

HlsStreamRegressionValidator.prototype.createDestinationDir = function() {

    var that = this;
 
    return qio.makeTree(that.fullpath)
        .then( function() {
            that.logger.debug('[%s] successfully created dir to save regression test results, [dir=%s].', that.entryId, that.fullpath);
        })
        .catch (function(err) {
            that.logger.error('[%s] error creating dir to save regression test results, [dir=%s]. Error: %s', that.entryId, that.fullpath, ErrorUtils.error2string(err));
        });
}

HlsStreamRegressionValidator.prototype.getSegmentFromPackager = function(item, data) {

    var that = this;
    var deferred  = Q.defer();

    data.errors[data.flavor] = {errors: {}};
    var flavor_header = logheader1 `${this.entryId}${data.flavor}${data.iteration}`;

    let url = util.format("http://localhost:8080/kLive/smil:%s_all.smil/%s/%s", this.entryId, data.flavor, item.properties.uri);

    networkClient.read({url: url, timeout: 10000})
        .then(function (content) {
            // add to results new segment
            var ts_id = item.properties.uri.split('.')[0];
            if (!_.has(that.this_run_results[data.flavor].ts[ts_id])) {
                that.this_run_results[data.flavor].ts[ts_id] = content.length;
                deferred.resolve();
            } else if (that.this_run_results[flavorId].ts[ts_id] != content.length) {
                that.logger.debug('%s %s validation failed', flavor_header, ts_id);
                let err_msg = 'playlist item validation failed, url=' + url;
                data.errors[data.flavor]['action item'] = 'check if it\'s a bug';
                return Q.reject(err_msg);
            }
        })
        .catch(function (err) {
            let err_msg = ErrorUtils.error2string(err);
            data.errors[data.flavor]['action item'] = 'verify url correctness';
            that.logger.debug('%s ***** VALIDATION FAILED!!! ***** error=[%s], url=[%s]', flavor_header, err_msg, item.properties.uri);
            data.errors[data.flavor].errors[url] = err_msg;
            deferred.reject(data.errors);
        });

    return deferred.promise;
}

HlsStreamRegressionValidator.prototype.downloadFlavorSegments = function(data) {

    let that = this;
    let flavor_header = logheader1 `${this.entryId}${data.flavor}${data.iteration}`;

    if (data.m3u8.items.PlaylistItem === undefined) {
        return Q.reject('this is a bug, \'playlist.m3u8.PlaylistItem\' is undefined');
    }

    let p = _.map(data.m3u8.items.PlaylistItem, function(item) {
        that.logger.debug('%s next playlist item to validate %s', flavor_header, data.iteration, item.properties.uri);
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

HlsStreamRegressionValidator.prototype.addChunklist = function (chunklist, flavorId, index) {

    let that = this;
    var data = { 'm3u8': undefined, 'flavor':flavorId, 'iteration':index, 'errors': {}};
    var deferred = Q.defer();

    // check if flavor exists and add to results if not
    if (!_.has(this.this_run_results, flavorId))
    {
        this.this_run_results[flavorId] = { 'ts': {}, 'm3u8': {} };
    }

    m3u8Handler.parseM3U8(chunklist, {'verbatim': true})
        .then(function(m3u8) {
            if (!_.has(that.this_run_results[flavorId].m3u8[index])) {
                that.this_run_results[flavorId].m3u8[index] = checksum(m3u8.toString());
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

HlsStreamRegressionValidator.prototype.validateSingleFlavor = function (entryId, flavorId, iteration) {

    let that = this;
    let deferred = Q.defer();
    var flavor_header = logheader1 `${entryId}${flavorId}${iteration}`;
    let url = util.format("http://localhost:8080/kLive/smil:%s_all.smil/%s/chunklist.m3u8", entryId, flavorId);

    try {
        that.logger.debug('%s getting chunklist, url=[%s]', flavor_header, url);

        return networkClient.read({url: url, timeout: 10000})
            .then(function (content) {
                return that.addChunklist(content, flavorId, iteration);
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

HlsStreamRegressionValidator.prototype.saveResultsToFile = function (reason) {

    var that = this;
    var test_passed = !(reason.localeCompare('validation failed') === 0);
    var fullpath = test_passed ? this.db_filename : that.fullpath + that.entryId + '_all_regression_run_results.json';
    var what = test_passed ? 'new regression test db' : 'regression results of failed test'

    this.logger.info('[%s] saving regression results. Reason: %s', this.entryId, reason);

    if (this.config.override || this.regression_results_db === undefined || !test_passed) {
        return qio.write(fullpath, JSON.stringify(this.this_run_results, null, 2))
            .then(function() {
                that.logger.debug('[%s] successfully saved %s, %s. Path: %s', that.entryId, what, reason, fullpath);
            })
            .catch(function(err) {
                that.logger.error('[%s] error writing %s to %s (save reason: %s). Path: %s, Error: %s', that.entryId, what, reason, fullpath, ErrorUtils.error2string(err));
            });
    }
    else {
        this.logger.debug('[%s] \'override\' is false, not saving %s to %s.', that.entryId, what, fullpath);
        return Q.resolve();
    }

}

HlsStreamRegressionValidator.prototype.validateResults = function(do_validate, errors) {

    this.logger.info('[%s] starting to validate regression results.', this.entryId);

    return v_utility.validateRegressionResults.call(this, (do_validate && !this.override), errors);
}

HlsStreamRegressionValidator.prototype.loadResultsDatabase = function () {

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

                return qio.read(that.db_filename)
                    .then(function (content) {
                        that.logger.debug('[%s] successfully read file %s.', that.entryId, that.db_filename);
                        that.regression_results_db = JSON.parse(content);
                    })
                    .catch(function (err) {
                        that.logger.info('[%s] failed to open regression tests db file, %s, @@@@ creating new regression db. Error: %s', that.entryId, that.db_filename, ErrorUtils.error2string(err));
                        that.override = true;
                        return Q.resolve();
                    });
            }
        });

}

module.exports = HlsStreamRegressionValidator;


