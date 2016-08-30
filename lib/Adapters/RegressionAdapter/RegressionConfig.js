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
var glob = require('glob');
const genUtils = require('../../utils/general-utils');


// todo: add support in analysis flag (in regression)

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
        this.regressionConfig = config.get('regressionAdapter');
        this.regressionConfig['command'] = {run_regression: this.regressionConfig.enable, record: config.get('preserveOriginalHLS') };
        // index of 1st argument to parse from commmand line argv.
        this.first = process.argv.length;
        // recording/regression configuration arguments, in root level
        this.rootConfig = {
            preserveOriginalHLS: false,
            recordingDurationMinutes: 0,
            overrideOldRecordedHLS: config.get('overrideOldRecordedHLS')};
        this.simulateStreams = config.get('simulateStreams');
    }
};

RegressionConfig.prototype.init = function() {

    var that = this;

    genUtils.logCommandLineArgs();

    Object.keys(that.rootConfig).forEach(function(key) {
        that.rootConfig[key] = config.get(key);
    });

    if (!this.updateConfig()) {
        this.logger.error('failed parsing command line args. Process will exit');
        process.exit(-7);
    }
}

RegressionConfig.prototype.updateLiveControllerConfiguration = function() {

    // --------------------------------------------------------
    // update this run config according to command line args
    // --------------------------------------------------------
    let operation = this.regressionConfig['command'].run_regression ? 'regression tests' : 'HLS recording session';
    this.logger.info('starting to run %s ', operation);
    this.logger.info('=====================================================');
    this.logger.info('Configuration changes for %s:', operation);
    this.logger.info('=====================================================');
    if (this.regressionConfig['command'].run_regression) {
        this.logger.info('changes in regressionAdapter configuration:\n%j', this.regressionConfig);
    }
    this.logger.info('changes in root configuration:\n%j', this.rootConfig);
    this.logger.info('changes in simulatedStream configuration: \n%j', this.simulateStreams);

    config.set('regressionAdapter', this.regressionConfig);
    config.set('simulateStreams', this.simulateStreams);

    Object.keys(this.rootConfig).forEach((key) => {
        config.set(key, this.rootConfig[key]);
    });

}

RegressionConfig.prototype.setRecordingPathExtension = function() {

    // if override = true the index that will be overwritten is 1.
    if (this.rootConfig['overrideOldRecordedHLS'] === true) {
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
            checkPath = util.format('%s%s-%s', recordingFullPath, relativePath, index);
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
 | The full path is=dataWarehouseRootFolderPath + '/' + entry_path
 | Todo: add support in entryId and override
 | override - true, to replace regression results db (ground truth). Default value
 | is false, (do not override results db).
 |-------------------------------------------------------------------------------
 | -start_chunklist_index: configuration of initial chunklist index (as concatenated in the filename)
 | -last_chunklist_index: configuration of last chunklist index (as concatenated in the filename)
 | by default both have value of -1, and the data warehouse files list will be read
 | to find the indexes. To set values use: -start_index=[value], -end_index=[value]
 | -entry_id=[entry Id]
 | -flavors=[flavors string comma separated], example: '1,2,3,4'
 | try to avoid using url and use only entry_id and flavors.
 | if url is used with entry_id and or flavors the url will be ignored.
 | Important: if entry_id doesn't exit in default config or configMapping and
 | command line args doesn't include flavors flag then all flavors are used.
 | -override - true/false, set true to replace regression ground truth db, otherwise false or not set.
 | -analysis - true/false, set true to run regression with analysis. (default false).
 --------------------------------------------------------------------------------
 | example: -entry_path='1_oorxcge2 1'
 | example with grunt test:
 --------------------------------------------------------------------------------
 | recording has following configuration options:
 | 1) duration=[value], the duration of recording in minutes. Default if not
 |  defined is 5 minutes.
 | 2) -override=[value], true/false. the default is true.
 | 3) -path=[value] this is the relative path to save stream files.
 | full path= ['rootFolderPath']/'[entryId] [counter]' or ['rootFolderPath']/'[path]
 | example: ~/tmp/DVR/1_oorxcge2 1/
 | record url=http://localhost:8080/kLive/smil:1_oorxcge2_all.smil/chunklist.m3u8 -duration=10 -override=true -path=demo_1
 --------------------------------------------------------------------------------*/
RegressionConfig.prototype.updateConfig = function() {

    let need_config_update = this.preCommandLineParse();

    if (!need_config_update) {
        return true;
    }

    if (!this.parseCommand()) {
       return false;
    }

    var cl_config = {};
    if (!this.parseArgs(cl_config)) {
       return false;
    }

    let entry_index = _.reduce(this.regressionConfig.entries, function (mem_index, configEntry) {
        if (configEntry.entryId === cl_config['entry_id']) {
            return mem_index;
        }
        else {
            return mem_index + 1;
        }
    }, 0);

    if (this.regressionConfig.command.run_regression) {
        return this.updateRegressionConfig(cl_config, entry_index);
    } else {
        return this.updateRecordConfig(cl_config);
    }

};

RegressionConfig.prototype.initChunklistEdgeIndexes = function (entry_index) {

    var that = this;
    var re = '.*_([0-9]+).m3u8';
    var entryConfig = this.regressionConfig.entries[entry_index];
    var entryId = entryConfig.entryId;
    var path_fix = entryConfig.entryPath.replace('%20', ' ');
    let flavors = entryConfig.flavorParamsIds.split(',').map((item) => item.trim());
    var fullPath = this.regressionConfig.dataWarehouseRootFolderPath + '/' + path_fix + '/' + flavors[0];

    try {
        let files = glob.sync(fullPath + '/*.m3u8');

         if (files.length === 0) {
             let err = util.format('data warehouse is empty, verify correctness of path (%s). Cannot run regression tests', fullPath);
             this.logger.info(err);
             return false;
         }

         var last_chunklist_index = _.reduce(files, function (index, next_file) {
                                         var regExp = new RegExp(re);
                                         var new_index = regExp.exec(next_file)[1];
                                         new_index = !isNaN(new_index) ? parseInt(new_index) : 0;
                                         return (new_index > index ? new_index : index);
                                     }, 0);

         this.logger.debug('[%s] last checuklist index is %s @@@@', entryId, last_chunklist_index);
         entryConfig.last_chunklist_index = last_chunklist_index;

         var first_chunklist_index = _.reduce(files, function (index, next_file) {
                                         var regExp = new RegExp(re);
                                         var new_index = regExp.exec(next_file)[1];
                                         new_index = !isNaN(new_index) ? parseInt(new_index) : 0;
                                         return (new_index < index ? new_index : index);
                                         }, entryConfig.last_chunklist_index);
         that.logger.debug('[%s] first checuklist index is %s @@@@', entryId, first_chunklist_index);
         entryConfig.start_chunklist_index = first_chunklist_index;

         if (entryConfig.last_chunklist_index === entryConfig.start_chunklist_index) {
             let err = util.format('data warehouse is empty, verify correctness of path (%s). Cannot run regression tests', fullPath);
             this.logger.info(err);
             return false;
         }

        that.rootConfig['flavorSuccessPollingInterval'] = 1;
        that.rootConfig['flavorFailPollingInterval'] = 1;

    } catch (err) {
        this.logger.debug('failed to get chunklist indexes from %s, %s', fullPath, ErrorUtils.error2string(err));
        return false;
    }

    return true;
};


RegressionConfig.prototype.preCommandLineParse = function() {

    let need_config_update = false;
    let app_arg = _.find(process.argv, function (arg) {
                        arg = arg.replace(/-/g, '');
                        return (arg.localeCompare('record') === 0 || arg.localeCompare('run_regression') === 0);
                    });

    this.first = app_arg ? process.argv.indexOf(app_arg) : undefined;

    if (!this.first || this.first === process.argv.length - 1) {

        //Todo: when supporing multiple entryIds replace entry_index=0 with loop on config entries
        let entry_index = 0;
        
        if (this.regressionConfig.command.run_regression) {
            this.initChunklistEdgeIndexes(entry_index);
            this.updateLiveControllerConfiguration();
        } else {
            this.setRecordingPathExtension();
            config.set('simulateStreams', this.simulateStreams);
        }

    } else {
       need_config_update = true;
    }

    return need_config_update;
};

RegressionConfig.prototype.parseCommand = function() {

    let parsed = false;
    let command_str = process.argv[this.first].substr(process.argv[this.first].lastIndexOf('-') + 1, process.argv[this.first].length);

    if (command_str.localeCompare('run_regression') === 0) {

        this.regressionConfig['command'].run_regression = true;
        this.regressionConfig['command'].record = false;
        // enable regression tests
        this.regressionConfig['enable'] = true;
        this.simulateStreams['enable'] = false;
        this.rootConfig.preserveOriginalHLS = false;
        parsed = true;
    }
    else if (command_str.localeCompare('record') === 0) {

        this.regressionConfig['command'].record = true;
        this.regressionConfig['command'].run_regression = false;
        // enable stream recording
        this.simulateStreams['enable'] = true;
        // disable regression tests
        this.regressionConfig['enable'] = false;

        this.rootConfig.preserveOriginalHLS = true;
        parsed = true;
    }
    else {
        this.logger.error("unsupported command \'%s\'. App.js will exit", command_str);
    }

    return parsed;
}

RegressionConfig.prototype.parseArgs = function(cl_config) {

    let parsed = false;

    try {
        for (var i = this.first + 1; i < process.argv.length; i++) {
            let splited = process.argv[i].split('=');

            if (splited.length === 2) {
                let key = splited[0].trim().replace(/-/g, '');
                cl_config[key] = splited[1].trim();
            }
            else {
                this.logger.error('invalid command line arg %s. Regression tests won\'t run', arg);
                return false;
            }

            if (cl_config && cl_config.hasOwnProperty('url') &&
                (!this.regressionConfig.run_regression || (this.regressionConfig.run_regression && !cl_config.hasOwnProperty('entry_Id')))) {

                    let re = /http:\/\/.*\/smil:([01]_[^_]+)_all\.smil[\/]?(\d+)?\/(playlist.m3u8|chunklist.m3u8)/g.exec(cl_config.url);

                    cl_config['entry_id'] = re[1];
                    cl_config['flavors'] = (re.length === 4) ? re[2] : '1,2,3,4';
            }
        }

        parsed = true;

    } catch(err) {
        this.logger.debug('failed to parse \"recording\" command line args, %s', ErrorUtils.error2string(err));
    }

    return parsed;
}

RegressionConfig.prototype.updateRegressionConfig = function(cl_config, entry_index) {

    try {
        let results_db_override= cl_config.hasOwnProperty('override') ? JSON.parse(cl_config['override'].toLowerCase()) : false;

        if (entry_index === this.regressionConfig.entries.length) {
            // todo: when multiple entries are supported use real entry_index
            entry_index = 0;

            if (!cl_config['flavors']) {
                cl_config['flavors'] = '1,2,3,4';
            }
            this.logger.info('@@@@ adding configuration of new entry Id %s, (parsed from command line url=%s).', cl_config['entry_id'], cl_config.url);

            this.regressionConfig.entries[0] = {
                "entryId": cl_config['entry_id'],
                "flavorParamsIds": cl_config['flavors'],
                "serverType": 0,
                "entryPath": cl_config['entry_id'] + '\ 1',
                "playWindow": 150,
                "validator": {
                    "path": this.regressionConfig.entries[0].validator.path,
                    "override": results_db_override,
                    "history_count": 0
                }
            };

        } else {
            if (cl_config.hasOwnProperty('flavors')) {
                this.regressionConfig.entries[entry_index].flavorParamsIds = cl_config['flavors'];
            }
            this.regressionConfig.entries[entry_index].entryId = cl_config['entry_id'];
            if (cl_config.hasOwnProperty('override')) {
                this.regressionConfig.entries[entry_index].validator['override'] = results_db_override;
            }
        }

        if (cl_config.hasOwnProperty('entry_path')) {
            this.regressionConfig.entries[entry_index].entryPath = cl_config['entry_path'];
        }
        if (cl_config.hasOwnProperty('result_path')) {
            this.regressionConfig.entries[entry_index].validator.path = cl_config['result_path'];
        }
        if (cl_config.hasOwnProperty('start_index')) {
            this.regressionConfig.entries[entry_index].start_chunklist_index = cl_config['start_chunklist_index'];
        }
        if (cl_config.hasOwnProperty('end_index')) {
            this.regressionConfig.entries[entry_index].last_chunklist_index = cl_config['last_chunklist_index'];
        }
        if (cl_config.hasOwnProperty('analysis')) {
            this.regressionConfig.entries[entry_index].analysis = cl_config['analysis'];
        }

        if (this.initChunklistEdgeIndexes(entry_index)) {
            this.updateLiveControllerConfiguration();
        } else {
            return false;
        }

    } catch(err) {
        this.logger.debug('failed to parse \"regression\" command line args, %s', ErrorUtils.error2string(err));
        return false;
    }

    return true;
}


RegressionConfig.prototype.updateRecordConfig = function(cl_config) {

    try {
        if (cl_config.hasOwnProperty('duration')) {
            if (Number(cl_config.hasOwnProperty('duration'))) {
                this.rootConfig['recordingDurationMinutes'] = parseInt(cl_config['duration']);
            } else {
                this.logger.error('duration=%s is not a number. Please fix and rerun!', cl_config.hasOwnProperty('duration'));
                return false;
            }
        }

        if (cl_config.hasOwnProperty('url')) {
            this.simulateStreams['wowzaUrl'] = cl_config['url'];
        }

        if (cl_config.hasOwnProperty('override')) {
            this.rootConfig['overrideOldRecordedHLS'] = JSON.parse(cl_config['override'].toLowerCase());
        }

        // set simulateStreams.entryId
        if (cl_config.hasOwnProperty('entry_id')) {
            this.simulateStreams['entryId'] = cl_config['entry_id'];
        }

        if (cl_config.hasOwnProperty('path')) {
            this.simulateStreams['path'] = cl_config['path'];
        }

        this.setRecordingPathExtension();

        this.updateLiveControllerConfiguration();

    } catch (err) {
        this.logger.error('Failed to initialized recording config. Error: %s', ErrorUtils.error2string(err));
        return false;
    }

    return true;
}


function getRegressionConfig() {
    return RegressionConfig.instance.regressionConfig;
};

module.exports = {
    instance : RegressionConfig.instance,   
    getConfig: getRegressionConfig,
    RegressionConfig : RegressionConfig
};


