/**
 * Created by AsherS on 8/24/15.
 */

var winston = require('winston');
var config = require('../Configuration');

winston.emitErrs = true;
var path = require('path');
var mkdirp = require('mkdirp');
var util = require('util');

var getLabel = function(callingModule) {
    var parts = callingModule.filename.split('/');
    return parts[parts.length - 2] + '/' + parts.pop();
};

var logger = function (file, level, logToConsole, callingModule) {

    var logFullPath = path.resolve(file);
    mkdirp.sync(path.dirname(logFullPath));

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
var messageDecoration = function(msg) {
    return "[PID="+process.pid+"] "+ msg;
};
var loggerDecorator = require('../../lib/utils/log-decorator');
module.exports=function(file, level, logToConsole, callingModule){
    return loggerDecorator(logger(file, level, logToConsole, callingModule),messageDecoration);
};