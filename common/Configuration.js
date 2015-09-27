/**
 * Created by elad.benedict on 8/24/2015.
 */

var path = require('path');
var fs = require('fs');

module.exports = (function(){

    var machineName = require('./utils/hostname');
    var configTemplateContent = fs.readFileSync(path.join(__dirname, './config/config.json.template'), 'utf8');
    var updatedConfigContent = configTemplateContent.replace('@HOSTNAME@', machineName);
    fs.writeFileSync(path.join(__dirname, './config/config.json'), updatedConfigContent);

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
