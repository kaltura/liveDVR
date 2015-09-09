/**
 * Created by AsherS on 9/6/15.
 */

var expressWinston = require('express-winston');
var winston = require('winston'); // for transports.Console

var logger = {
    consoleLogger: expressWinston.logger({
        transports: [
            new winston.transports.Console({
                json: true,
                colorize: true
            })
        ]
    }),

    errorLogger: expressWinston.errorLogger({
        transports: [
            new winston.transports.Console({
                json: true,
                colorize: true
            })
        ]
    })
};

module.exports = logger;