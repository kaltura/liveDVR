/**
 * Created by AsherS on 8/24/15.
 */

var winston = require('winston');
var config = require('../Configuration');

winston.emitErrs = true;
var path = require('path');
var mkdirp = require('mkdirp');
var util = require('util');
var momentTz = require('moment-timezone');

var logger = function (file, level, logToConsole) {

    var logFullPath = path.resolve(file);
    mkdirp.sync(path.dirname(logFullPath));

    var createFileTransport = function() {
        return new (winston.transports.File)({
            name: 'info-file',
            filename: file,
            level: level,
            json: false,
            colorize: false,
            handleExceptions: true,
            humanReadableUnhandledException: true,
            timestamp: function() { return momentTz().tz('America/New_York').format(); }
        });
    }

    var transports = [];
    transports.push(createFileTransport());

    if (logToConsole){
        transports.push(new winston.transports.Console({
            level: config.get("logLevel"),
            handleExceptions: true,
            json: false,
            colorize: true,
            humanReadableUnhandledException: true,
            timestamp: function() { return momentTz().tz('America/New_York').format(); }
        }));
    }

    var logger = new winston.Logger({
        transports: transports,
        exitOnError: false
    });

    // Support log rotate - this is the signal that is used
    process.on('SIGUSR1', function() {
        // Remove reference to old file
        logger.remove('info-file');

        // Create a reference to the new file
        logger.add(createFileTransport(), null, true);
    });

    return logger;
};
var messageDecoration = function(msg) {
    return "[PID="+process.pid+"] "+ msg;
};
var loggerDecorator = require('../../lib/utils/log-decorator');
module.exports=function(file, level, logToConsole, callingModule){
    return loggerDecorator(logger(file, level, logToConsole, callingModule),messageDecoration);
};