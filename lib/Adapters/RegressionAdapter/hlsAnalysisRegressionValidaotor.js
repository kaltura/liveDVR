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
        //this.analyzer_fullPath = util.format('%s\/%s', require('../../../common/Configuration').get('regressionAdapter').analyzerRootPath, 'analyzer/main.py');
        this.analyzer_fullPath = `${require('../../../common/Configuration').get('regressionAdapter').analyzerRootPath}`;
        this.analyzer_main_fullPath = `${this.analyzer_fullPath}/analyzer/main.py`;
        let log_fullPath = require('../../../common/Configuration').get('logFileName');
        this.analyzer_log_path = log_fullPath.substring(0, log_fullPath.lastIndexOf('\/'));
    }

     init() {

        let that = this;
        let filename = this.db_filename.substring(this.db_filename.lastIndexOf('/')+1);
        let path = this.db_filename.substring(0, this.db_filename.lastIndexOf('/')+1);
        var rename_db_fullpath = util.format('%s%s_%s', path,  new Date().toISOString(), filename);
        var history_fullpath = `${this.analyzer_fullPath}/history/`;

        super.init();

        qio.removeTree(history_fullpath) // clean analyzer history
             .then(() => {
                 this.logger.debug(`[${this.entryId}] successfully removed histroy files, ${history_fullpath}`);
             })
             .catch((err) => {
                 if (err.code === 'ENOENT') {
                     this.logger.debug(`[${history_fullpath}] history doesn't exits. No cleaning done`);
                 } else {
                     this.logger.warn(`[${this.entryId}] failed to remove analyzer history files, ${history_fullpath}, ${ErrorUtils.error2string(err)}`);
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
    const out = fs.openSync(`${this.analyzer_log_path}/out.log`, 'a');
    const err = fs.openSync(`${this.analyzer_log_path}/err.log`, 'a');


        try {
        this.logger.debug(`run analyzer command line: python ${this.analyzer_fullPath} -i ${url}`);
        // call python process to verify all flavors
        // example:
        // python [live-monitor root path]/analyzer/main.py -i http://localhost:8080/kLive/smil:1_oorxcge2_all.smil/1/chunklist.m3u8 -o TSExtractor.chunks_to_inspect=100
        var analyzer = child_process.spawn(
            'python',
            ['./analyzer/main.py',
                '-i',
                url,
                '-o',
                'TSExtractor.chunks_to_inspect=100'],
            {
                cwd: this.analyzer_fullPath,
                detached: true,
                stdio: [ 'ignore', out, err ]
            }
        );

       analyzer.unref();

       analyzer.on('error', (data) => {
            analyzer.stdin.write(`${log_header} ${data}`);
            this.logger.error(`${log_header} ${data}`);
            analyzerp.reject();
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

}

HlsAnalysisRegressionValidator.prototype.verifyNoAlarms = function(index) {

    let report_fullpath = `${this.analyzer_fullPath}\/reports/hlsAnalyze.json`;
    this.logger.debug('starting to review analyzer report, %s', report_fullpath);

    let hlsAnalize_copy = `${this.fullpath}hlsAnalyze.json`;

    // search alarm in hlsAnalyze.json
    return qio.read(report_fullpath)
        .then((content) => {
            let json_report = JSON.parse(content);
            if (json_report.entryReports.abc.hasOwnProperty('entryAlerts')
                && Object.keys(json_report.entryReports.abc.entryAlerts).length > 0) {
                this.logger.error(`<<<<<<<< ${report_fullpath} >>>>>>> content: ${json_report}`);

                return qio.write(hlsAnalize_copy, content)
                    .then(() => {
                        return Q.reject(`analyzer validation failed, check ${hlsAnalize_copy}!`);
                    });
            } else {
                this.logger.debug(`successfully finished validation by analyzer`);
            }

        });
}


module.exports = HlsAnalysisRegressionValidator;