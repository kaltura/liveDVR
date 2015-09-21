/**
 * Created by elad.benedict on 8/24/2015.
 */

var path = require('path');
module.exports = (function(){

    var nconf = require('nconf');

    // Setup nconf to use (in-order):
    //   1. Command-line arguments
    //   2. Environment variables
    //   3. A file located at 'path/to/config.json'
    //
    nconf.argv()
        .env()
        .file({ file: path.join(__dirname, './config/config.json') });

    return nconf;
})();
