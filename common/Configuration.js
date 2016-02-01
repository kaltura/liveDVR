/**
 * Created by elad.benedict on 8/24/2015.
 */

var path = require('path');
var fs = require('fs');
var _ = require('underscore')

module.exports = (function(){

    var machineName = require('./utils/hostname');

    var configTemplateContent = fs.readFileSync(path.join(__dirname, './config/config.json.template'), 'utf8');
    var updatedConfigContent = configTemplateContent.replace('@HOSTNAME@', machineName);
    var configObj = JSON.parse(updatedConfigContent);

    var mappingFilePath = path.join(__dirname, 'config', 'configMapping.json');
    if (fs.existsSync(mappingFilePath))
    {
        var mappingContent = fs.readFileSync(mappingFilePath, 'utf8');
        var mappingData = JSON.parse(mappingContent)[machineName];
        if (mappingData)
        {
            assignValues(mappingData, configObj);
        }
    }

    function assignValues(configPropertiesObj, configOutputObj) {
        for (var p in configPropertiesObj) {
            if (configPropertiesObj.hasOwnProperty(p)) {
                if (configPropertiesObj[p] instanceof Object) {
                    if (!configOutputObj[p]) {
                        configOutputObj[p] = {};
                    }
                    assignValues(configPropertiesObj[p], configOutputObj[p]);
                } else {
                    configOutputObj[p] = configPropertiesObj[p];
                }
            }
        }
    }

    //fs.writeFileSync(path.join(__dirname, './config/config.json'), JSON.stringify(configObj, null, 2));

    var nconf = require('nconf');

    // Setup nconf to use (in-order):
    //   1. Command-line arguments
    //   2. Environment variables
    //   3. A file located at 'path/to/config.json'
    //
    nconf.argv()
        .env()
       // .file({ file: path.join(__dirname, './config/config.json') });
        .defaults(configObj);

    return nconf;
})();
