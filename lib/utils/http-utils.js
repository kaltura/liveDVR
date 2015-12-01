/**
 * Created by AsherS on 8/24/15.
 */

var HTTPUtils = function(logger){

    var qfs = require("q-io/fs");
    var obj = {};

    obj.downloadFile = function(url, pathDestination, timeout) {
        var networkClient = require('../NetworkClientFactory').getNetworkClient();
        var config = require('../../common/Configuration');
        var request = {
            url: url
        };
        if (timeout) {
            request.timeout = timeout;
        }
        else if (config.get("requestTimeout")) {
            request.timeout = config.get("requestTimeout");
        }

        var startTime = new Date().getTime();
        logger.debug("Request for " + url + " started at " + startTime);
        return networkClient
            .read(request)
            .finally(function(){
                var endTime = new Date().getTime();
                var processTime = endTime-startTime;
                logger.debug("Request for " + url + " (started at " + startTime + ") took " + processTime);
            })
            .then(function(data) {
                return qfs.write(pathDestination, data);
            })
            .catch(function(err){
                throw new Error("Failed to download file.\nUrl: " + url + "\nDestination: " + pathDestination + "\n" + err + " stack: " + err.stack);
            }
        );
    };

    return obj;

};

module.exports = HTTPUtils;

