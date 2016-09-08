/**
 * Created by lilach.maliniak on 21/08/2016.
 */
var logger = require('../../../common/logger');
var HlsChecksumRegressionValidator = require('./hlsChecksumRegressionValidator');
const qio = require('q-io/fs');
var Q = require('q');
var util=require('util');
const ErrorUtils = require('../../utils/error-utils');
const _utility = require('./regression_utility');
const fs = require('fs');
const child_process = require('child_process');


class HlsAnalysisRegressionValidator extends HlsChecksumRegressionValidator {

    constructor(config, flavors, last_chunklist_index) {
        // set override to true in order to force rewrite of results db
        config.validator.override = true;

        super(config, flavors, last_chunklist_index);

        this.logger = logger.getLogger('hlsAnalysisRegressionValidator');
        this.analyzer_fullPath = `${require('../../../common/Configuration').get('regressionAdapter').analyzerRootPath}`;
        this.analyzer_main_fullPath = `${this.analyzer_fullPath}/analyzer/main.py`;
        let log_fullPath = require('../../../common/Configuration').get('logFileName');
        this.analyzer_log_path = log_fullPath.substring(0, log_fullPath.lastIndexOf('\/'));
        this.alerts_ignore_list = `exclude_alerts=[${this.config.analyzerAlertsIgnoreList}]`;
        this.out = fs.openSync(`${this.analyzer_log_path}/analyzer_out.log`, 'a');
        this.err = fs.openSync(`${this.analyzer_log_path}/analyzer_err.log`, 'a');

    }

     init() {

        let that = this;
        let filename = this.db_filename.substring(this.db_filename.lastIndexOf('/')+1);
        let path = this.db_filename.substring(0, this.db_filename.lastIndexOf('/')+1);
        var rename_db_fullpath = util.format('%s%s_%s', path,  new Date().toISOString(), filename);
        var history_fullpath = `${this.analyzer_fullPath}/history/`;
        var reports_path =  `${this.analyzer_fullPath}/reports/`;

        super.init();

        qio.removeTree(history_fullpath) // clean analyzer history
             .then(() => {
                 this.logger.debug(`[${this.entryId}] successfully removed history files, ${history_fullpath}`);
             })
             .catch((err) => {
                 if (err.code === 'ENOENT') {
                     this.logger.debug(`[${history_fullpath}] history doesn't exits. No cleaning done`);
                 } else {
                     this.logger.warn(`[${this.entryId}] failed to remove analyzer history files, ${history_fullpath}, ${ErrorUtils.error2string(err)}`);
                 }
             })
            .then(() => {
                return qio.removeTree(reports_path);
            })
            .then(() => {
                this.logger.debug(`[${this.entryId}] successfully removed reports files, ${reports_path}`);
            })
            .catch((err) => {
                if (err.code === 'ENOENT') {
                    this.logger.debug(`[${reports_path}] reports doesn't exits. No cleaning done`);
                } else {
                    this.logger.warn(`[${this.entryId}] failed to remove analyzer reports files, ${reports_path}, ${ErrorUtils.error2string(err)}`);
                }
            })
            .then(() => { // rename db file
                return qio.rename(this.db_filename, rename_db_fullpath);
             })
            .then(() => {
                 this.logger.debug('[%s] successfully read file %s.', that.entryId, that.db_filename);
             })
             .catch((err) => {
                 if (err.code === 'ENOENT') {
                     this.logger.debug(`[${this.entryId}] history doesn't exits. No cleaning done`);
                 } else {
                     this.logger.warn(`[${this.entryId}] failed to rename regression tests db (${this.db_filename}-->${rename_db_fullpath}). Error: ${ErrorUtils.error2string(err)}`);
                 }
             });
    }

    validateAllFlavors(index) {

    let url = `http://localhost:8080/kLive/smil:${this.entryId}_all.smil/playlist.m3u8`;
    var analyzerp = Q.defer();
    this.log_header = `[${this.entryId}-${this.flavors}] <<<< ${index} >>>> `;
    this.logger = logger.getLogger("Regression-Analyzer", this.log_header);

    try {

        this.logger.debug(`run analyzer command line: python ${this.analyzer_fullPath} -i ${url}`);

        // call python process to verify all flavors
        // example:
        // python [live-monitor root path]/analyzer/main.py -i http://localhost:8080/kLive/smil:1_oorxcge2_all.smil/1/chunklist.m3u8
        // -o TSExtractor.chunks_to_inspect=100 ['INFTagDurationDoesntMatch','BitrateOutsideOfTargetAlert','InvalidKeyFrameIntervalAlert','SegmentCountMismatchAlert']
        var analyzer = child_process.spawn(
            'python',
            ['./analyzer/main.py',
                '-i',
                url,
                '-o',
                'TSExtractor.chunks_to_inspect=100',
                this.alerts_ignore_list
            ],
            {
                cwd: this.analyzer_fullPath,
                detached: true,
                stdio: [ 'ignore', this.out, this.err ]
            }
        );

       analyzer.unref();

       analyzer.on('error', (data) => {
            this.logger.error(`!!!!! Analyzer error, test will continue. Error: ${data}`);
            // todo: don't remove comment as Guy & Lilach decided that only Alerts shall cause test to halt
           if (!data.startsWith('find')) {
               analyzerp.reject();
           }
        });

        analyzer.on('close', (code) => {
            if (code !== 0) {
                this.logger.error(`analyzer exit with error ${code}`);
                analyzerp.reject(`analyzer process exit with error ${code}`);
            } else {
                return this.verifyNoAlarms(index)
                    .then(() => {
                        return super.validateAllFlavors(index);
                    })
                    .then(() => {
                        analyzerp.resolve();
                    })
                    .catch((err) => {
                        this.logger.error(`validation failed. Error: ${ErrorUtils.error2string(err)}`);
                        return super.validateAllFlavors(index);
                    })
                    .then(() => {
                        analyzerp.reject(err);
                    });
            }
        });

    } catch (err) {
        this.logger.error(`validation failed. Error: ${ErrorUtils.error2string(err)}`);
        analyzerp.reject(err);
    }

    return analyzerp.promise;

    }

    saveResultsToFile(reason) {
        
       super.saveResultsToFile(reason);
       
        let report_fullpath = `${this.analyzer_fullPath}\/reports/hlsAnalyze.json`;
        let report_copy_fullpath = `${this.latest_regression_path}hlsAnalyze.json`;

       // fs.createReadStream(report_fullpath).pipe(fs.createWriteStream(report_copy_fullpath));

        // search alarm in hlsAnalyze.json
        return qio.read(report_fullpath)
            .then((content) => {
                // if regression test finished save hlsAnalize.json in latest_regression_path.
                return qio.write(report_copy_fullpath, content);
            })
            .then(() => {
                return Q.resolve(`successfully saved ${report_copy_fullpath}!`);
            })
            .catch((err) => {
                this.logger.error(`Failed to copy report (hlsAnalyze.json). Error: ${ErrorUtils.error2string(err)}`);
            });
        
    }

}

HlsAnalysisRegressionValidator.prototype.verifyNoAlarms = function(index) {

    let report_fullpath = `${this.analyzer_fullPath}\/reports/hlsAnalyze.json`;
    let hlsAnalize_copy = `${this.fullpath}hlsAnalyze.json`;
    this.logger.debug('starting to review analyzer report, %s', report_fullpath);

    // search alarm in hlsAnalyze.json
    return qio.read(report_fullpath)
        .then((content) => {
            let json_report = JSON.parse(content);
            if (json_report.entryReports.abc.hasOwnProperty('entryAlerts')
                && Object.keys(json_report.entryReports.abc.entryAlerts).length > 0) {
                this.logger.error(`<<<<<<<< ${report_fullpath} >>>>>>> content: ${content}`);

                return qio.write(hlsAnalize_copy, content)
                    .then(() => {
                      return qio.write(`${this.latest_regression_path}/hlsAnalyze.json`);
                    })
                    .then(() => {
                        return Q.reject(`analyzer validation failed, check ${hlsAnalize_copy}!`);
                    });
            } else {
                this.logger.debug(`successfully finished validation by analyzer`);
            }

        });
}


module.exports = HlsAnalysisRegressionValidator;