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
function HlsStreamRegressionValidator(entryId, flavors, last_chunklist_index) {

    this.logger = logger.getLogger('hlsStreamRegressionValidator');
    this.entryId = entryId;
    this.flavors = flavors;
    this.last_chunklist_index = last_chunklist_index;
    // path to load/save regression test results
    // the path is initialized in init()
    this.fullpath;

//    this.createDestinationDir();
    // create initial json for regression results database
    this.regression_results_db = {};
    this.this_run_results = {};

}

HlsStreamRegressionValidator.prototype.init = function(config) {

    // add root to path
    this.fullpath = config.path;

    var filename = this.entryId + '_regression_test_resulsts.json';

    if (this.fullpath.lastIndexOf('/') < this.fullpath.length - 1) {
        this.fullpath += '/';
        this.fullpath += filename;
    }

    var that = this;
    return this.loadResultsDatabase(config)
        .then( function() {
            that.logger.debug('[%s] regression tests validator successfully initialized.', that.entryId);
        })
        .catch (function(err) {
            that.logger.error('[%s] failed to initialize regression tests validator. Error: %s, stack: %s', that.entryId, err.message, err.stack);
        });
}

HlsStreamRegressionValidator.prototype.createDestinationDir = function() {

    var that = this;
    var deferred = Q.defer();

    mkdirp(getDirName(this.fullpath), function (err) {
        if (err) {
            that.logger.error('[%s] error creating dir to save regression test results to %s. Error: %s', that.entryId, that.fullpath, err);
            deferred.reject(err);
        }
        else {
            that.logger.debug('[%s] error creating dir to save regression test results to %s.', that.entryId, that.fullpath);
            deferred.resolve();
        }
    });

    return deferred.promise;
}

HlsStreamRegressionValidator.prototype.addChunklist = function (chunklist, flavorId, index, url) {

    var that = this;
    var chunklistObj;
    // todo: complete the code

    // check if flavor exists and add to results if not
    if (!_.has(this.this_run_results, flavorId))
    {
        this.this_run_results[flavorId] = { 'ts': {}, 'm3u8': {} };
    }

    var deffered = Q.defer();

    return m3u8Handler.parseM3U8(chunklist, {'verbatim': true})
        .then(function (m3u8) {
            chunklistObj = m3u8;
            if (!_.has(that.this_run_results[flavorId].m3u8[index])) {
                // todo: ask Guy what is prefferable, checksum from raw chunklist or from the parsed (m3u8 obj)
                that.this_run_results[flavorId].m3u8[index] = checksum(m3u8.toString());
            }
            // build playlist per flavor
            var p = _.map(m3u8.items, function (playlist) {
                // for each segment in checklist get the segment if already in results
                var tsp = _.map(playlist, function(item) {
                    that.logger.debug('next playlist item to validate %s', item);
                    // get head of all the segments in the chunklist
                    var url = util.format("http://localhost:8080/kLive/smil:%s_all.smil/%s/%s", that.entryId, flavorId, item.properties['uri']);
                    var ts_id = item.properties.uri.split('.')[0];
                    return networkClient.read({url: url, timeout: 10000})
                        .then(function (content) {
                            // add to results new segment
                            if (!_.has(that.this_run_results[flavorId].ts[ts_id])) {
                                that.this_run_results[flavorId].ts[ts_id] = content.length;
                            }
                        })
                        .catch(function (err) {
                            deffered.reject(err);
                        });

                });

                // todo: check if this code is correct????
               return Q.all(tsp);

            });

            // todo: check if this code is correct????
           return Q.all(p);

        })
        .then(function (value) {
            // verify if it was the last chunklist and all flavors completed to download

            // in case validation finished for all the stream segments, call the comparator to compare with
            // ground truth DB or save.
            that.logger.warn('[%s-%s] **** SUCCESSFULLY VALIDATED ****  obj=[%s], url=[%s]', that.entryId, flavorId, chunklistObj, url);
            deffered.resolve(chunklistObj);
        })
        .catch(function (e) {
            that.logger.error('[%s-%s] **** VALIDATION FAILED!!! **** error=[%s], url=[%s]', that.entryId, flavorId, e.message, url);
            deffered.reject();
        });

        return deffered.promise;

}



HlsStreamRegressionValidator.prototype.saveResultsToFile = function (reason) {

    var that = this;
    var deferred = Q.defer();

    this.logger.info('[%s] saving regression results. Reason: %s', reason);

    fs.writeFile(this.fullpath, JSON.stringify(this.this_run_results, null, 2), function (err) {
        if (err) {
            that.logger.error('[%s] error writing regression test results to %s. Error: %s', that.entryId, that.fullpath, err.message);
            deferred.reject(err);
        }
        else {
            that.logger.debug('[%s] successfully saved regression test results to %s.', that.entryId, that.fullpath);
            deferred.resolve();
        }
    });

    return deferred.promise;
}

HlsStreamRegressionValidator.prototype.loadResultsDatabase = function (config) {

    var that = this;
    var override = config.override;
    var history_count = config.history_count;
    //var deferred = Q.defer();

    return this.createDestinationDir()
        .then( function() {
            // todo: check if file exist and history_count > 0 than rename.

            // todo: count files and delete old files so that total number including new one is up to history_count

            if (config.override === true) {
                that.logger.debug("[%s] creating new database for regression test results!", that.entryId);
            }
            else {
                that.logger.debug('Going to open %s. Override=%s', that.fullpath, config.override);

                fs.readFile(that.fullpath, 'utf8', function (err, data) {
                    if (err) {
                        that.logger.info('File %s doesn\'t exist. Error: %s', that.fullpath, err.message);
                        reject(err);
                    }
                    else {
                        that.logger.debug('Successfully read file %s.', that.fullpath);
                        that.regression_results_db = JSON.parse(data);
                    }
                });
            }
        });

}

module.exports = HlsStreamRegressionValidator;


