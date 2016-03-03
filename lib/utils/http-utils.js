/**
 * Created by AsherS on 8/24/15.
 */

var networkClientFactory = require('../NetworkClientFactory');
var configuration = require('../../common/Configuration');
var HTTPUtils = function(logger){

    var qfs = require("q-io/fs");
    var obj = {};

    obj.downloadFile = function(url, pathDestination, timeout) {
        var networkClient = networkClientFactory.getNetworkClient();
        var config = configuration;
        var request = {
            url: url
        };
        if (timeout) {
            request.timeout = timeout;
        }
        else if (config.get("requestTimeout")) {
            request.timeout = config.get("requestTimeout");
        }

        var startTime = new Date();
        var downloadedTime=0;
        logger.debug("HttpRequest for %s",url);
        return networkClient
            .read(request)
            .finally(function(){
                downloadedTime = new Date();
                var processTime = downloadedTime-startTime;
                logger.debug("Request for %s took %d", url , processTime);
            })
            .then(function(data) {
                return qfs.write(pathDestination, data).then(function() {
                    var savedTime = new Date();
                    var fileSaveTime = savedTime-downloadedTime;
                    logger.debug("Saving file %s  took %s ms", pathDestination,fileSaveTime);

                });
            })
            .catch(function(err){
                throw new Error("Failed to download file.\nUrl: " + url + "\nDestination: " + pathDestination + "\n" + err + " stack: " + err.stack);
            }
        );
    };

    return obj;

};

module.exports = HTTPUtils;

