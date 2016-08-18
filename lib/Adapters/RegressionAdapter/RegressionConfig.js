/**
 * Created by lilach.maliniak on 09/08/2016.
 */
'use strict';

const logger = require('../../../common/logger');
var config = require('../../../common/Configuration');
const _ = require('underscore');
const ErrorUtils = require('../../utils/error-utils');
const process = require('process');
const fs = require("fs");
const path = require("path");
const util = require("util");
const Q = require('q');

// todo: use entryId commandline arg for recording also do same for run_regression and add flaovors arg

let regressionConfig = Symbol();
let regressionConfigEnforcer = Symbol();

/*
    singleton
 */
class RegressionConfig {

    constructor(enforcer) {
        if (enforcer !== regressionConfigEnforcer) {
            throw "Cannot construct singleton";
        }
        this.properties();
        this.init();
    }

    static get instance() {
        if (!this[regressionConfig]) {
            this[regressionConfig] = new RegressionConfig(regressionConfigEnforcer);
        }
        return this[regressionConfig];
    }

    properties() {
        this.logger = logger.getLogger('RegressionConfig');
        this.config = config.get('regressionAdapter');
        this.config['command'] = {run_regression: this.config.enable, record: config.get('preserveOriginalHLS') };
        // index of 1st argument to parse from commmand line argv.
        this.first = process.argv.length;
        // recording/regression configuration arguments, in root level
        this.recordingConfig = { preserveOriginalHLS: false, recordingDurationMinutes: 0, overrideOldRecordedHLS: true };
        this.simulateStreams = config.get('simulateStreams');
    }
    
    init() {

        var count = 0;
        this.logger.debug('===============================');
        this.logger.debug('|The command line arguments:  |');
        this.logger.debug('===============================');
        _.each(process.argv, (arg) => {
            this.logger.debug('(%s) %s', ++count, arg);
        });
        this.logger.debug('===============================');
        
        var that = this;

        let app_arg = _.find(process.argv, function(arg) {
            arg = arg.replace(/-/g, '');
            return (arg.localeCompare('record') === 0 || arg.localeCompare('run_regression') === 0);
        });

        this.first = app_arg ? process.argv.indexOf(app_arg) : undefined;

        if (this.first && this.first <  process.argv.length - 1) {
            if (!this.updateConfig()) {
                process.exit(-7);
            }
        } else {
            if (this.config.command.run_regression) {
                config.set('flavorSuccessPollingInterval', 1);
                config.set('flavorFailPollingInterval', 1);
                this.logger.info('changes in root configuration:\n%j', {flavorSuccessPollingInterval: config.get('flavorSuccessPollingInterval') + ' msec',  flavorFailPollingInterval: config.get('flavorFailPollingInterval') + ' msec'});
            }
        }

        Object.keys(this.recordingConfig).forEach(function(key) {
            that.recordingConfig[key] = config.get(key);
        });

    }
};

RegressionConfig.prototype.updateLiveControllerConfiguration = function() {
    
    this.simulateStreams.enable = this.simulateStreams['enable'];
    // --------------------------------------------------------
    // update this run config according to command line args
    // --------------------------------------------------------
    let operation = this.config['command'].run_regression ? 'regression tests' : 'HLS recording session';
    this.logger.info('starting to run %s ', operation);
    this.logger.info('=====================================================');
    this.logger.info('Configuration changes for %s:', operation);
    this.logger.info('=====================================================');
    if (this.config['command'].run_regression) {
        this.logger.info('changes in regressionAdapter configuration:\n%j', this.config);
    }
    this.logger.info('changes in root configuration:\n%j', this.recordingConfig);
    this.logger.info('changes in simulatedStream configuration: \n%j', this.simulateStreams);

    config.set('regressionAdapter', this.config);
    config.set('simulateStreams', this.simulateStreams);
    Object.keys(this.simulateStreams).forEach((key) =>  {
        config.set('simulateStreams.'+ key, this.simulateStreams[key]);
    });

    Object.keys(this.recordingConfig).forEach((key) => {
        config.set(key, this.recordingConfig[key]);
    });
}

RegressionConfig.prototype.setRecordingPathExtension = function() {

    // if override = true the index that will be overwritten is 1.
    if (this.recordingConfig['overrideOldRecordedHLS'] === true) {
        return;
    }

    let recordingFullPath = config.get('rootFolderPath') + '/';
   // recordingFullPath = recordingFullPath.replace(/\//g,'\\\/');
   // recordingFullPath = recordingFullPath.replace(/\./g,'\\\.');
    let relativePath = this.simulateStreams.hasOwnProperty('path') ? this.simulateStreams['path'] : this.simulateStreams['entryId'];
    let index = 1;
    let checkPath = util.format('%s%s %s', recordingFullPath, relativePath, index );
   // let pattern = util.format('%s(%s\\s\\d+)', recordingFullPath, relativePath);

    try {
        // use loop to find highest index
        let stat = fs.lstatSync(checkPath);

        while (stat.isDirectory()) {
            index++;
            checkPath = util.format('%s%s %s', recordingFullPath, relativePath, index);
            stat = fs.lstatSync(checkPath);
        }
    } catch(err) {
        if (err.code != 'ENOENT') {
            logger.debug('new recording path, %s', recordingFullPath);
            throw err;
        }
    }
    finally
    {
        this.simulateStreams['firstIndex'] = index;
    }

}

/*------------------------------------------------------------------------------
 | valid command line examples:
 | node lib/App.js run_regression url=http://localhost:8080/kLive/smil:1_oorxcge2_all.smil/1/chunklist.m3u8 entry_path="1_oorxcge2\ 1"
 | url and entry_path are optional. If they won't appear in command line the values
 | from configuration file will be used.
 --------------------------------------------------------------------------------
 | url - same url as used to download entry from Wowza
 --------------------------------------------------------------------------------
 | example url to test all flavors:
 --------------------------------------------------------------------------------
 |  url=http://localhost:8080/kLive/smil:1_oorxcge2_all.smil/chunklist.m3u8
 --------------------------------------------------------------------------------
 | example url to test specific flavor (flavor id 1):
 --------------------------------------------------------------------------------
 | url : http://localhost:8080/kLive/smil:1_oorxcge2_all.smil/1/chunklist.m3u8
 --------------------------------------------------------------------------------
 | entry_path - entry relative path in data warehouse. This is the relative
 | location where the HLS stream files are read from.
 | The full path is=dataWarehouseRootFolderPath + '/' + src_path
 | Todo: add support in entryId and override
 | override - true, to replace regression results db (ground truth). Default value
 | is false, (do not override results db).
 --------------------------------------------------------------------------------
 | example entry_path='1_oorxcge2 1'
 --------------------------------------------------------------------------------
 | recording has following configuration options:
 | 1) duration=[value], the duration of recording in minutes. Default if not
 |  defined is 5 minutes.
 | 2) override=[value], true/false. the default is true.
 | path= ['rootFolderPath']/'[entryId] [counter]'
 | example: ~/tmp/DVR/1_oorxcge2 1/
 | record url=http://localhost:8080/kLive/smil:1_oorxcge2_all.smil/chunklist.m3u8 -duration=10 -override=true
 --------------------------------------------------------------------------------*/
RegressionConfig.prototype.updateConfig = function() {

    var that = this;

    try {

            let command_str = process.argv[this.first].substr(process.argv[this.first].lastIndexOf('-')+1, process.argv[this.first].length);

            if (command_str.localeCompare('run_regression') === 0) {

                this.config['command'].run_regression = true;
                this.config['command'].record = false;
                // enable regression tests
                this.config['enable'] = true;
                this.simulateStreams['enable'] = false;
            }
            else if (command_str.localeCompare('record') === 0) {

                this.config['command'].record = true;
                this.config['command'].run_regression = false;
                // enable stream recording
                this.simulateStreams['enable'] = true;
                // disable regression tests
                this.config['enable'] = false;

                this.recordingConfig.preserveOriginalHLS = true;
            }
            else {
                this.logger.error("unsupported command \'%s\'. App.js will exit", command_str);
                return false;
            }

            var cl_config = {};

            for (var i=this.first+1; i< process.argv.length; i++)
            {
                    let splited = process.argv[i].split('=');

                    if (splited.length === 2) {
                        let key = splited[0].trim().replace(/-/g, '');
                        cl_config[key] = splited[1].trim();
                    }
                    else {
                        this.logger.error('invalid command line arg %s. Regression tests won\'t run', arg);
                        return false;
                    }

                    if (cl_config && cl_config.hasOwnProperty('url')) {
                        let re = /(.*)\/kLive\/smil:([01]_[^_]+)_all\.smil[\/]?(\d+)?\/(chunklist.m3u8)/g.exec(cl_config.url);

                        cl_config['entryId'] = re[2];
                        cl_config['flavors'] = (re.length === 6) ? re[3] : '1,2,3,4';
                    }
            }

        if (this.config['command'].run_regression) {

                let entry_index = _.reduce(this.config.entries, function (mem_index, configEntry) {
                    if (configEntry.entryId === cl_config['entryId']) {
                        return mem_index;
                    }
                    else {
                        return mem_index + 1;
                    }
                }, 0);

                let results_db_override = cl_config['override'] ? JSON.parse(cl_config['override'].toLowerCase()) : false;

                if (entry_index === this.config.entries.length) {
                    this.logger.info('@@@@ adding configuration of new entry Id %s, (parsed from command line url=%s).', cl_config['entryId'], cl_config.url);
                    this.config['regressionAdapter'].entries[entry_index] = {
                        "entryId": cl_config['entryId'],
                        "flavorParamsIds": cl_config['flavors'],
                        "serverType": 0,
                        "entryPath": cl_config['entryId'] + '\ 1',
                        "playWindow": 150,
                        "validator":  {
                            "path": this.config.entries[0].validator.path,
                            "override": results_db_override,
                            "history_count": 0
                        }
                    };

                } else {
                    this.config.entries[entry_index].flavorParamsIds = cl_config['flavors'];
                    this.config.entries[entry_index].entryId = cl_config['entryId'];
                    this.config.entries[entry_index].validator['override'] = results_db_override;
                }

                if (cl_config.hasOwnProperty('entry_path')) {
                    this.config.entries[entry_index].entryPath = cl_config['entry_path'];
                }
                if (cl_config.hasOwnProperty('result_path')) {
                    this.config.entries[entry_index].validator.path = cl_config['result_path'];
                }

                this.recordingConfig['flavorSuccessPollingInterval'] = 1;
                this.recordingConfig['flavorFailPollingInterval'] = 1;
            }
            else if (this.config['command'].record) {

                if (cl_config.hasOwnProperty('duration')) {
                    if (Number(cl_config.hasOwnProperty('duration'))) {
                        this.recordingConfig['recordingDurationMinutes'] = parseInt(cl_config['duration']);
                    } else {
                        this.logger.error('duration=%s is not a number. Please fix and rerun!', cl_config.hasOwnProperty('duration'));
                        return false;
                    }

                }

                if (cl_config.hasOwnProperty('override')) {
                    this.recordingConfig['overrideOldRecordedHLS'] = JSON.parse(cl_config['override'].toLowerCase());
                }

                // set simulateStreams.entryId
                if (cl_config.hasOwnProperty('entryId')) {
                    this.simulateStreams['entryId'] = cl_config['entryId'];
                }

                if (cl_config.hasOwnProperty('path')) {
                    this.simulateStreams['path'] = cl_config['path'];
                }

                this.setRecordingPathExtension();
            }

            this.updateLiveControllerConfiguration();

    } catch (err) {
        this.logger.error('failed to parse command line args %j. Process will exit. Error: %s', process.argv, ErrorUtils.error2string(err));
        return false;
    }

    return true;
};

function getRegressionConfig() {
    return RegressionConfig.instance.config;
};

module.exports = {
    getConfig: getRegressionConfig,
    RegressionConfig : RegressionConfig
};


