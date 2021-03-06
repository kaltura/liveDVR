/**
 * Created by elad.benedict on 8/24/2015.
 */

var path = require('path');
var fs = require('fs');
var _ = require('underscore')
var hostname = require('./utils/hostname');

module.exports = (function(){

    let machineName = hostname.getLocalMachineHostname();
    let machineShortName = hostname.getLocalMachineHostname(false);
    var configTemplateContent = fs.readFileSync(path.join(__dirname, './config/config.json.template'), 'utf8');
    var configObj = JSON.parse(configTemplateContent);

    var mappingFilePath = path.join(__dirname, 'config', 'configMapping.json');
    if (fs.existsSync(mappingFilePath))
    {
        var mappingContent = fs.readFileSync(mappingFilePath, 'utf8');
        var mappingObj=JSON.parse(mappingContent);
        _.each(mappingObj, function(value, key) {
            console.log("Matching configurations arguments. Key: [%s] => Match: [%s]", key, machineName.match(key));
            if (machineName.match(key)) {
                assignValues(value, configObj);
            }
        });
    }
    

    function assignValues(configPropertiesObj, configOutputObj) {
        for (var p in configPropertiesObj) {
            if (configPropertiesObj.hasOwnProperty(p)) {
                if (!_.isArray(configPropertiesObj[p]) &&
                    _.isObject(configPropertiesObj[p]) &&
                    _.has(configOutputObj,p)) {
                    assignValues(configPropertiesObj[p], configOutputObj[p]);
                }
                else {
                    configOutputObj[p] = configPropertiesObj[p];
                }
            }
        }
    }

    let confString = JSON.stringify(configObj, null, 2);
    confString = confString.replace(/~/g,hostname.homedir());
    confString = confString.replace(/@HOSTNAME@/g, machineName);
    confString = confString.replace(/@HOSTNAME_SHORT@/g, machineShortName);
    fs.writeFileSync(path.join(__dirname, './config/config.json'), confString);

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
