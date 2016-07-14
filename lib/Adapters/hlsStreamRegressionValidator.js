/**
 * Created by lilach.maliniak on 12/07/2016.
 */
var Q = require('q');
var _ = require('underscore');
var fs = require('fs');
var logger = require('../../common/logger');
var m3u8Handler = require('../manifest/promise-m3u8');

/*
  ------------------------------------------------------------------------------------------------------
  Class HlsStreamRegressionValidator
  ------------------------------------------------------------------------------------------------------
  This class is responsibilities:
   (1) Generate baseline database (json file), with properties of stream (e.g. bytes count, checksum) for
   all the chunklists and segments (ts files), fetched from the packager for single Live entry, during regression test
   period.
 */
function HlsStreamRegressionValidator(entryId, flavors, config, last_chunklist_index) {

    this.logger = logger.getLogger('hlsStreamRegressionValidator');
    this.entryId = entryId;
    this.flavors = flavors;
    this.last_chunklist_index = last_chunklist_index;
    // add root to path
    this.fullpath = config.path;

    var filename = entryId + '_regression_test_resulsts.json';

    if (this.fullpath.lastIndexOf('/') < this.fullpath.length - 1) {
        this.fullpath += '/';
        this.fullpath += filename;
    }
    // create initial json for regression results database
    this.regression_results_db = {};
    this.this_run_results = {};

    this.loadResultsDatabase(config);
}

HlsStreamRegressionValidator.prototype.addChunklist = function (content, flavorId, url) {

    // todo: complete the code
    // return promise
    // var q = Q.defer();
    return m3u8Handler.parseM3U8(content, {verbatim: true});
}

HlsStreamRegressionValidator.prototype.saveResultsToFile = function (reason) {

    var that = this;

    this.logger.info('[%s] saving regression results. Reason: %s', reason);

    fs.writeFile(this.fullpath, JSON.stringify(this.regression_results_db, null, 2), function (err) {
        if (err) {
            that.logger.error('[%s] error writing regression test results to %s. Error: %s', that.entryId, that.fullpath, err.message);
        }
        that.logger.debug('[%s] successfully saved regression test results to %s.', that.entryId, that.fullpath);
    });
}

HlsStreamRegressionValidator.prototype.loadResultsDatabase = function (config) {

    var that = this;
    var override = config.override;
    var history_count = config.history_count;

    // todo: check if file exist and history_count > 0 than rename.

    // todo: count files and delete old files so that total number including new one is up to history_count

    if (config.override === true) {
        this.logger.debug("[%s] creating new database for regression test results!", this.entryId);
        return;
    }

    this.logger.debug('Going to open %s. Override=%s', this.fullpath, config.override);

    if (config.override == false) {
        fs.readFile(this.fullpath, 'utf8', function (err, data) {
            if (err) {
                that.logger.info('File %s doesn\'t exist. Error: %s', that.fullpath, err.message);
            }
            else {
                that.logger.debug('Successfully read file %s.', that.fullpath);
                that.regression_results_db = JSON.parse(data);
            }
        });
    }

    return;
}

module.exports = HlsStreamRegressionValidator;


