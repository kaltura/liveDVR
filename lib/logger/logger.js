/**
 * Created by Elad Benedict on 8/24/15.
 */

var commonLogger = require('../../common/logger/logger');
var curry = require('curry');
var config = require('../../common/Configuration');
var logger = curry(commonLogger)(config.get('logFileName'), config.get('logLevel'), config.get('logToConsole'));

module.exports = logger;