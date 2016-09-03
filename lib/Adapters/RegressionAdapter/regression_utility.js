/**
 * Created by lilach.maliniak on 06/08/2016.
 */
var _ = require('underscore');
var logger =  require('../../../common/logger').getLogger("regression_utility");
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
    console.log('================================================================================');
    count = 0;
    console.log('================================================================================');
    console.log('|LiveController\'s command line arguments:                                      |');
    console.log('================================================================================');
    _.each(process.argv, (arg) => {
        console.log(util.format('(%s) %s', ++count, arg));
    });
    console.log('================================================================================');
}

module.exports = {
    logCommandLineArgs : logCommandLineArgs
}
