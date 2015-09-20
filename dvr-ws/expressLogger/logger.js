/**
 * Created by elad.benedict on 9/20/2015.
 */

var expressWinston = require('express-winston');
var winston = require('winston'); // for transports.Console
var mkdirp = require('mkdirp');
var path = require('path');

var logPath = 'log/ws.log';
mkdirp.sync(path.dirname(logPath));

var logger = {
    consoleLogger: expressWinston.logger({
        transports: [
            new winston.transports.Console({
                json: true,
                colorize: true
            }),
            new winston.transports.File({ filename: logPath })
        ]
    }),

    errorLogger: expressWinston.errorLogger({
        transports: [
            new winston.transports.Console({
                json: true,
                colorize: true
            }),
            new winston.transports.File({ filename: logPath })
        ]
    })
};

module.exports = logger;