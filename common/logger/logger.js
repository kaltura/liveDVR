/**
 * Created by AsherS on 8/24/15.
 */

var winston = require('winston');
var config = require('../Configuration');

winston.emitErrs = true;
var path = require('path');
var mkdirp = require('mkdirp');
var util = require('util');

var logPath = config.get('logFileName');
var logFullPath = path.resolve('.', logPath);

//create logs dir:
mkdirp.sync(path.dirname(logFullPath));

var getLabel = function(callingModule) {
    var parts = callingModule.filename.split('/');
    return parts[parts.length - 2] + '/' + parts.pop();
};


var logger = function (file, level, logToConsole, callingModule) {

    var transports = [];
    transports.push(new (winston.transports.File)({
        name: 'info-file',
        filename: file,
        level: level,
        json: false,
        colorize: false,
        handleExceptions: true,
        humanReadableUnhandledException: true,
        label: getLabel(callingModule)
    }));

    if (logToConsole){
        transports.push(new winston.transports.Console({
            level: config.get("logLevel"),
            handleExceptions: true,
            json: false,
            colorize: true,
            label: getLabel(callingModule),
            humanReadableUnhandledException: true,
        }));
    }

    return new winston.Logger({
        transports: transports,
        exitOnError: false
    });
};
module.exports = logger;