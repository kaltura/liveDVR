/**
 * Created by lilach.maliniak on 24/08/2016.
 */
var _ = require('underscore');
var logger = require('../../common/logger').getLogger('general-utils');
var util=require('util');

function logCommandLineArgs() {
    var argv = process.argv;
    var count = 0;
    logger.info('================================================================================');
    logger.info('|LiveController\'s command line arguments:                                      |');
    logger.info('================================================================================');
    _.each(process.argv, (arg) => {
        logger.info(util.format('(%s) %s', ++count, arg));
    });
    logger.info('================================================================================');
}

module.exports = {
    logCommandLineArgs : logCommandLineArgs
};