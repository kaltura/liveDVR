/**
 * Created by Elad Benedict on 8/24/15.
 */

var commonLogger = require('../../common/logger/logger');
var config = require('../../common/Configuration');
var logger = commonLogger(config.get('logFileName'), config.get('logLevel'), config.get('logToConsole'));
var loggerDecorator = require('../utils/log-decorator');
var path = require('path');

module.exports = function(module){
    var messageDecoration = function(msg) {
        return '[' + path.basename(module.filename) + '] ' + msg;
    };
    return loggerDecorator(logger, messageDecoration);
}