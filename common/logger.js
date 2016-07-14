/**
 * Created by ron.yadgar on 18/04/2016.
 */


var config = require('./Configuration');
var path = require('path');
var mkdirp = require('mkdirp');
var util = require('util');
var hostname = require('./utils/hostname');
var log4js = require( "log4js" );
/*
HACK: log4js leaks (file) appender when reloaded...
 log4js.shutdown  cleans up but disables all logging
 loggerModule must be accessed directly to enable logging back...
*/
var loggerModule = require( "./../node_modules/log4js/lib/logger" );
var _ = require( "underscore" );

var logFullPath = config.get('logFileName');
logFullPath= logFullPath.replace(/~/g,hostname.homedir());
mkdirp.sync(path.dirname(logFullPath));


var getLoggerConfig = function(){
    var appenders = [
        {
            "type": "file",
            "filename": logFullPath,
            "timezoneOffset": 300 // NYC timezone offset relative to UTC (5 * 60)
        }
    ];

    if (config.get('logToConsole')) {
        appenders.push({
            "type": "console",
            "layout": {
                "type": "pattern",
                pattern: "%d{ABSOLUTE} %[%-5p%] %c %m"
            },
        });
    }

    return {
        "appenders": appenders,
        "replaceConsole": false,
        "levels": {
            "[all]": config.get('logLevel')
        }
    };
};

var log4jsConfiguration = getLoggerConfig();

log4js.configure(log4jsConfiguration);

var reloadLogger = function() {
    log4js.shutdown();
    loggerModule.enableAllLogWrites();
    log4js.configure(log4jsConfiguration);
};

var isEqualLoggerConfig = function(newConfig){
    return JSON.stringify(newConfig) === JSON.stringify(_.omit(log4jsConfiguration,['makers']));
};

// Support log rotate - this is the signal that is used
process.on('SIGUSR1', reloadLogger);

// register on configChanged notification to react on the run-time configuration changes
config.on('configChanged',function(){
    var newConfig = getLoggerConfig();
    if( !isEqualLoggerConfig(newConfig) ){
        log4jsConfiguration = newConfig;
        reloadLogger();
    }
});

function decorate(logger, id) {

    if (id) {
        var loggerEx = {};
        function modify(func) {

            loggerEx[func] = function () {
                if (arguments && arguments.length > 0) {
                    arguments[0] = id + arguments[0];
                }
                return logger[func].apply(logger, arguments);
            }
        }

        modify("debug");
        modify("warn");
        modify("info");
        modify("trace");
        modify("error");
        modify("fatal");

        loggerEx.logger = logger;

        return loggerEx;
    } else {
        return logger;
    }
}

function getLogger(module, id) {
    var loggerName=module;
    var type=typeof(module);
    if (type==='object')
        loggerName=path.basename(module.filename);


    var logger=log4js.getLogger("["+loggerName+"]");

    return decorate(logger,id);
};

module.exports = {
    decorate:   decorate,
    getLogger: getLogger
}