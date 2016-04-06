/**
 * Created by AsherS on 8/24/15.
 */

var networkClientFactory = require('../NetworkClientFactory');
var configuration = require('../../common/Configuration');
var qfs = require("q-io/fs");
var Q = require("q");
var MP4WriteStream = require('../MP4WriteStream');
var http = require('http');

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
            })
            .then(function(data) {
                var processTime = downloadedTime-startTime;
                if (compareFn && compareFn(data)) {
                    logger.debug("Request for %s took %d ms, ignoring since content hasn't changed",url, processTime);
                    return Q.reject(HttpDownloadNotChanged);
                }
                logger.debug("Request for %s took %d ms",url, processTime);
                return qfs.write(pathDestination, data).then(function() {
                    var savedTime = new Date();
                    var fileSaveTime = savedTime-downloadedTime;
                    logger.debug("Saving file %s took %d ms",pathDestination,fileSaveTime);
                });
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

    obj.downloadStream = function(url, stream, pathDestination, timeout ) {

        var startTime = new Date();
        var downloadedTime=null;
        logger.debug("Request for %s",url);

        var def = Q.defer(),
            tm,
            onError = function (err) {
                def.reject(new Error('timeout ' + url));
                if (tm) {
                    clearTimeout(tm);
                }
            };

        try {
            var req = http.get(url);

            if (timeout) {
                tm = setTimeout(onError, timeout);
            }

            req.on('error', onError)
                .on('response', function (response,err) {
                    if (tm) {
                        clearTimeout(tm);
                    }
                    if (err) {
                        onError(err);
                    } else {
                        response
                            .pipe(stream)
                            .on('error', onError)
                            .on('end',function(retVal){
                                var savedTime = new Date();
                                var fileSaveTime = savedTime-downloadedTime;
                                logger.debug("Saving file %s took %d ms",pathDestination,fileSaveTime);
                                def.resolve(retVal);
                            });
                    }
                    req.end();
                });
        }
        catch(err){
            onError(err);
        }
        return def.promise;
    };

    obj.downloadConvert = function(url, pathDestination, timeout ) {
        var stream = new MP4WriteStream(pathDestination,logger);
        return this.downloadStream(url,stream,pathDestination,timeout);
    };

return obj;

};

module.exports= {
    HttpDownloader: HttpDownloader,
    HttpDownloadNotChanged: HttpDownloadNotChanged
}