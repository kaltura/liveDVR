/**
 * Created by AsherS on 8/24/15.
 */

var networkClientFactory = require('../NetworkClientFactory');
var configuration = require('../../common/Configuration');
var qfs = require("q-io/fs");
var Q = require("q");



var HttpDownloadNotChanged="HttpDownloadNotChanged";

var HttpDownloader = function(logger,compareFn) {

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
                if (compareFn && compareFn(data)) {
                    return Q.reject(HttpDownloadNotChanged);
                }
                return qfs.write(pathDestination, data);
            })
            .catch(function(err){
                if (err instanceof  Error)
                    throw new Error("Failed to download file.\nUrl: " + url + "\nDestination: " + pathDestination + "\n" + err + " stack: " + err.stack);
                else {
                    return Q.reject(err);
                }
            }
        );
    };

    return obj;

};

module.exports= {
    HttpDownloader: HttpDownloader,
    HttpDownloadNotChanged: HttpDownloadNotChanged
}