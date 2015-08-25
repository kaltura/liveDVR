/**
 * Created by AsherS on 8/24/15.
 */

var winston = require('winston');
winston.emitErrs = true;

var logger = new winston.Logger({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: 'logs/filelog-info.log',
            level: 'debug',
            json: false,
            colorize: false,
            handleExceptions: true,
        }),
        new winston.transports.Console({
            level: 'debug',
            handleExceptions: true,
            json: false,
            colorize: true
        })
    ],
    exitOnError: false
});

module.exports = logger;
module.exports.stream = {
    write: function(message, encoding){
        logger.info(message);
    }
};
