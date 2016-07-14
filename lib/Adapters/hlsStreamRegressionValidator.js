/**
 * Created by lilach.maliniak on 12/07/2016.
 */
var Q = require('q');
var _ = require('underscore');
var fs = require('fs');
var logger = require('../../common/logger');
var m3u8Handler = require('../manifest/promise-m3u8');
var mkdirp = require('mkdirp');
var getDirName = require('path').dirname;

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

HlsStreamRegressionValidator.prototype.addChunklist = function (content, flavorId, url) {

    // todo: complete the code
    // return promise
    // var q = Q.defer();
    return m3u8Handler.parseM3U8(content, {verbatim: true});
}



HlsStreamRegressionValidator.prototype.saveResultsToFile = function (reason) {

    var that = this;
    var deferred = Q.defer();

    this.logger.info('[%s] saving regression results. Reason: %s', reason);

    fs.writeFile(this.fullpath, JSON.stringify(this.regression_results_db, null, 2), function (err) {
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
                return;
            }

            that.logger.debug('Going to open %s. Override=%s', that.fullpath, config.override);

            if (config.override == false) {
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


