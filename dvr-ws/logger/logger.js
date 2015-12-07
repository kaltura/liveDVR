/**
 * Created by Elad Benedict on 8/24/15.
 */

var commonLogger = require('../../common/logger/logger');
var config = require('../../common/Configuration');
var logger = commonLogger(config.get('webServerParams:logFileName'), config.get('webServerParams:logLevel'), config.get('webServerParams:logToConsole'));

module.exports = logger;