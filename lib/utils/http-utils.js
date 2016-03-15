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

        var startTime = new Date();
        var downloadedTime=null;
        logger.debug("Request for %s",url);
        return networkClient
            .read(request)
            .finally(function(){
                downloadedTime = new Date();
                var processTime = downloadedTime-startTime;
                logger.debug("Request for %s took %d ms",url, processTime);
            })
            .then(function(data) {
                if (compareFn && compareFn(data)) {
                    return Q.reject(HttpDownloadNotChanged);
                }
                return qfs.write(pathDestination, data).then(function() {
                    var savedTime = new Date();
                    var fileSaveTime = savedTime-downloadedTime;
                    logger.debug("Saving file %s took %d ms",pathDestination,fileSaveTime);
                });
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