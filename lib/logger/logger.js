/**
 * Created by AsherS on 8/24/15.
 */

var winston = require('winston');
var config = require('../Configuration');

winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: config.get("logFileName"),
            level: config.get("logLevel"),
            json: false,
            colorize: false,
            handleExceptions: true,
        }),
        new winston.transports.Console({
            level: config.get("logLevel"),
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;