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

function checksum (str, algorithm, encoding) {
    return crypto
        .createHash(algorithm || 'md5')
        .update(str, 'utf8')
        .digest(encoding || 'hex')
}

/*
  ------------------------------------------------------------------------------------------------------
  Class HlsStreamRegressionValidator
  ------------------------------------------------------------------------------------------------------
  This class is responsibilities:
   (1) Generate baseline database (json file), with properties of stream (e.g. bytes count, checksum) for
   all the chunklists and segments (ts files), fetched from the packager for single Live entry, during regression test
   period.
 */
function HlsStreamRegressionValidator(entryId, flavors, last_chunklist_index, config) {

    this.logger = logger.getLogger('hlsStreamRegressionValidator');
    this.entryId = entryId;
    this.flavors = flavors;
    this.config = config;
    this.override = config.override;
    this.last_chunklist_index = last_chunklist_index;
    // path to load/save regression test results
    // the path is initialized in init()
    this.fullpath = config.path;
    // add root to path
    var filename = this.entryId + '_regression_test_db.json';

    if (this.fullpath.lastIndexOf('/') < this.fullpath.length - 1) {
        this.fullpath += '/';
        this.fullpath += filename;
    }
    
    // create initial json for regression results database
    this.regression_results_db;
    this.this_run_results = {};

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

    return qio.makeTree(getDirName(this.fullpath.substring(0, this.fullpath.lastIndexOf('/'))))
        .then( function() {
            that.logger.debug('[%s] successfully created dir to save regression test results, [dir=%s].', that.entryId, that.fullpath);
        })
        .catch (function(err) {
            that.logger.error('[%s] error creating dir to save regression test results, [dir=%s]. Error: %s', that.entryId, that.fullpath, ErrorUtils.error2string(err));
        });
}

HlsStreamRegressionValidator.prototype.addChunklist = function (chunklist, flavorId, index, url) {

    var that = this;
    var m3u;
    // todo: complete the code

    // check if flavor exists and add to results if not
    if (!_.has(this.this_run_results, flavorId))
    {
        this.this_run_results[flavorId] = { 'ts': {}, 'm3u8': {} };
    }

    var deffered = Q.defer();

    return m3u8Handler.parseM3U8(chunklist, {'verbatim': true})
        .then(function (m3u8) {
            m3u = m3u8;
            if (!_.has(that.this_run_results[flavorId].m3u8[index])) {
                // todo: ask Guy what is prefferable, checksum from raw chunklist or from the parsed (m3u8 obj)
                that.this_run_results[flavorId].m3u8[index] = checksum(m3u8.toString());
            }
            var p = _.map(m3u8.items, function (playlist) {

               /* var new_ts_list = _.filter(playlist, function(item) {
                    return !_.has(that.this_run_results[flavorId].ts[item.properties.uri.split('.')[0]]);
                });
                */
                if (playlist.length === 0) {
                    return Q.resolve();
                }

                // for each segment in checklist get the segment if not already in results
                var tsp = _.map(playlist, function(item) {
                    that.logger.debug('[%s] <<< iteration %s >>> next playlist item to validate %s', that.entryId, index, item);
                    // get head of all the segments in the chunklist
                    var url = util.format("http://localhost:8080/kLive/smil:%s_all.smil/%s/%s", that.entryId, flavorId, item.properties.uri);
                    return networkClient.read({url: url, timeout: 10000})
                        .then(function (content) {
                            // add to results new segment
                            var ts_id =  item.properties.uri.split('.')[0];
                            if (!_.has(that.this_run_results[flavorId].ts[ts_id])) {
                                that.this_run_results[flavorId].ts[ts_id] = content.length;
                            } else if (that.this_run_results[flavorId].ts[ts_id] != content.length) {
                                that.logger.debug('[%s] <<< iteration %s >>> validation error (different sizes for same playlist item), %s', that.entryId, index, item);
                                Q.reject('playlist item validation failed');
                            }
                        })
                        .catch(function (err) {
                            that.logger.debug('[%s-%s] <<< iteration %s >>> failed to get playlist item %s from packager. Error = %s', that.entryId, flavorId, index, item, ErrorUtils.error2string(err));
                            deffered.reject(err);
                        });

                });

                // todo: check if this code is correct????
               return Q.all(tsp);

            });

            // todo: check if this code is correct????
           return Q.all(p);

        })
        .then(function (m3u8) {
            // verify if it was the last chunklist and all flavors completed to download
            // in case validation finished for all the stream segments, call the comparator to compare with
            // ground truth DB or save.
            that.logger.info('[%s-%s] <<< iteration %s >>> **** SUCCESSFULLY VALIDATED ****  obj=[%s], url=[%s]', that.entryId, flavorId, index, m3u8.toString(), url);
            deffered.resolve(m3u8);
        })
        .catch(function (err) {
            that.logger.error('[%s-%s] <<< iteration %s >>> **** VALIDATION FAILED!!! **** error=[%s], url=[%s]', that.entryId, flavorId, index, ErrorUtils.error2string(err), url);
            deffered.reject();
        });

        return deffered.promise;

}



HlsStreamRegressionValidator.prototype.saveResultsToFile = function (reason) {

    var that = this;
    var test_passed = !(reason.localeCompare('validation failed') === 0);
    var fullpath = test_passed ? that.fullpath : that.config.path + '/' + that.entryId + '_all_regression_run_results.json';
    var what = test_passed ? 'new regression test db' : 'regression results of failed test'

    this.logger.info('[%s] saving regression results. Reason: %s', this.entryId, reason);

    if (this.override || this.regression_results_db === undefined || !test_passed) {
        return qio.write(fullpath, JSON.stringify(this.this_run_results, null, 2))
            .then(function() {
                that.logger.debug('[%s] successfully saved %s, %s. Path: %s', that.entryId, what, reason, fullpath);
            })
            .catch(function(err) {
                that.logger.error('[%s] error writing %s to %s (save reason: %s). Path: %s, Error: %s', that.entryId, what, reason, fullpat, hErrorUtils.error2string(err));
            });
    }
    else {
        this.logger.debug('[%s] \'override\' is false, not saving %s to %s.', that.entryId, what, fullpath);
        return Q.resolve();
    }

}

HlsStreamRegressionValidator.prototype.validateResults = function() {

    this.logger.info('[%s] starting to validate regression results.', this.entryId);

    return v_utility.validateRegressionResults.call(this);
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
                that.logger.debug('Going to open %s. Override=%s', that.fullpath, that.override);

                return qio.read(that.fullpath)
                    .then(function (content) {
                        that.logger.debug('[%s] successfully read file %s.', that.entryId, that.fullpath);
                        that.regression_results_db = JSON.parse(content);
                    })
                    .catch(function (err) {
                        that.logger.info('[%s] failed to open regression tests db file, %s. Error: %s', that.entryId, that.fullpath, ErrorUtils.error2string(err));
                        process.exit(-3);
                    });
            }
        });

}

module.exports = HlsStreamRegressionValidator;


