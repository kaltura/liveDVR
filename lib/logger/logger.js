var config = require('../../common/Configuration');
var logger = require('../../common/logger/logger')(config.get('logFileName'), config.get('logLevel'), config.get('logToConsole'));

module.exports = function(){
    return logger;
};