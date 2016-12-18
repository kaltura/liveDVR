/**
 * Created by ron.yadgar on 18/04/2016.
 */


var config = require('./Configuration');
var path = require('path');
var mkdirp = require('mkdirp');
var util = require('util');
var hostname = require('./utils/hostname');
var log4js = require( "log4js" );


var logFullPath = path.resolve(config.get('logFileName'));
logFullPath= logFullPath.replace(/~/g,hostname.homedir());
mkdirp.sync(path.dirname(logFullPath));

var appenders = [
    {
        "type": "dateFile",
        "filename": logFullPath,
        "pattern": ".yyyy-MM-dd",
        "alwaysIncludePattern": false,
        "timezoneOffset" : config.get('logTimeZoneOffset') // NYC timezone offset relative to UTC (5 * 60)
    }
];

if (config.get('logToConsole'))
{
    appenders.push({
        "type": "console",
        "layout": {
            "type": "pattern",
            pattern: "%d{ABSOLUTE} %[%-5p%] %c %m"
        }
    });
}

var log4jsConfiguration = {
    "appenders": appenders,
    "replaceConsole": false,
    "levels": {
        "[all]":config.get('logLevel')
    }
};

log4js.configure(log4jsConfiguration);

// Support log rotate - this is the signal that is used
process.on('SIGUSR1', function() {
    log4js.clearAppenders();
    log4js.configure(log4jsConfiguration);
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
}

module.exports = {
    decorate:   decorate,
    getLogger: getLogger
};