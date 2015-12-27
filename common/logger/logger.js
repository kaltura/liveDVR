/**
 * Created by AsherS on 8/24/15.
 */

var config = require('../Configuration');
var path = require('path');
var mkdirp = require('mkdirp');
var util = require('util');

var logger = function (file, level, logToConsole) {

    var logFullPath = path.resolve(file);
    mkdirp.sync(path.dirname(logFullPath));

    var log4js = require( "log4js" );
    var appenders = [
        {
            "category": "newHLS",
            "type": "file",
            "filename": logFullPath,
            "timezoneOffset" : 300 // NYC timezone offset relative to UTC (5 * 60)
        }
    ];

    if (logToConsole)
    {
        appenders.push({
            "type": "console",
            "layout": {
                "type": "pattern",
                "pattern": "%m"
            },
            "category": "newHLS"
        });
    }

    var log4jsConfiguration = {
        "appenders": appenders,
        "replaceConsole": true,
        "levels" : {
            "newHLS": level
        }
    };

    log4js.configure(log4jsConfiguration);

    // Support log rotate - this is the signal that is used
    process.on('SIGUSR1', function() {
        log4js.clearAppenders();
        log4js.configure(log4jsConfiguration);
    });

    var res = log4js.getLogger("newHLS");
    return res;
};

var messageDecoration = function(msg) {
    return "[PID="+process.pid+"] "+ msg;
};

var loggerDecorator = require('../../lib/utils/log-decorator');

module.exports = function(file, level, logToConsole){
    return loggerDecorator(logger(file, level, logToConsole), messageDecoration);
};