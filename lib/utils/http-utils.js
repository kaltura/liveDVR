/**
 * Created by AsherS on 8/24/15.
 */

var networkClientFactory = require('../NetworkClientFactory');
var configuration = require('../../common/Configuration');
var FixedArray = require("fixed-array");
var Q = require("q");
var url=require("url");
var http=require("http");
var fs=require("fs");

var ts_request_log = FixedArray(100);
var m3u8_request_log = FixedArray(100);

var pendingRequests=0;

function getCounterStats(arr) {
    return {
        min: arr.min(),
        max: arr.max(),
        mean: arr.mean(),
        variance: arr.variance()
    }
}
function getStats() {
    return {
        pendingRequests: pendingRequests,
        ts: getCounterStats(ts_request_log),
        m3u8: getCounterStats(m3u8_request_log)
    }
}

function isSameBufferContent(a, b) {
    if (a.length !== b.length) return false;

    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }

    return true;
};

var HttpDownloadNotChanged="HttpDownloadNotChanged";

var HttpDownloader = function(logger,compareResults,inMemory){

    var qfs = require("q-io/fs");
    var obj = {};

    obj.lastResult=null;

    if (inMemory) {
        obj.downloadFile = function (url, pathDestination, timeout) {
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

            pendingRequests++;
            var startTime = new Date();
            logger.debug("Request for %s started" , url);
            return networkClient
                .read(request)
                .finally(function () {
                    pendingRequests--;
                    var endTime = new Date();
                    var processTime = endTime - startTime;
                    logger.debug("Request for %s took %d" , url,processTime);
                    if (url.indexOf(".ts") > -1) {
                        ts_request_log.push(processTime);
                    } else {
                        m3u8_request_log.push(processTime);
                    }
                })
                .then(function (data) {
                    if (compareResults) {

                        if (obj.lastResult && isSameBufferContent(obj.lastResult, data)) {
                            return Q.reject(HttpDownloadNotChanged);
                        }
                        obj.lastResult = data;
                    }
                    return qfs.write(pathDestination, data);
                })
                .catch(function (err) {
                    if (err instanceof  Error)
                        throw new Error("Failed to download file.\nUrl: " + url + "\nDestination: " + pathDestination + "\n" + err + " stack: " + err.stack);
                    else {
                        return Q.reject(err);
                    }
                }
            );
        };
    } else {
        obj.downloadFile = function (urlRequsted, pathDestination, oldContent, timeout) {

            var options = {};
            var parsedUrl = url.parse(urlRequsted);
            options.hostname = parsedUrl.hostname;
            options.port = parsedUrl.port;
            options.path = parsedUrl.path;


            var startTime = new Date();
            logger.debug("Request for %s started" , urlRequsted);
            var def = Q.defer();
            try {

                pendingRequests++;

                var request = http.get(options, function (response) {

                    if(response.statusCode == 200) {


                        var file = fs.createWriteStream(pathDestination, {flags: 'w'});

                        response.pipe(file);
                        file.on('finish', function () {

                            var endTime = new Date();
                            var processTime = endTime - startTime;
                            logger.debug("Request for %s took %d" , urlRequsted,processTime);

                            file.close(function () {
                                def.resolve();
                            });  // close() is async, call cb after close completes.
                        });
                    } else {

                        def.reject();
                    }
                }).on('error', function (e) { // Handle erro

                    pendingRequests--;
                    fs.unlink(pathDestination,function(){}); // Delete the file async. (But we don't check the result)
                    throw new Error("Failed to download file.\nUrl: " + urlRequsted + "\nDestination: " + pathDestination + "\n" + e + " stack: " + e.stack);
                }).on('end', function (e) { // Handle erro

                    pendingRequests--;
                    fs.unlink(pathDestination,function(){}); // Delete the file async. (But we don't check the result)
                    throw new Error("Failed to download file.\nUrl: " + urlRequsted + "\nDestination: " + pathDestination + "\n" + e + " stack: " + e.stack);
                });

            } catch (e) {
                console.warn(e, e.stack);
            }

            return def.promise;

        };
    }

    return obj;

};

module.exports= {
    getStats: getStats,
    HttpDownloader: HttpDownloader,
    HttpDownloadNotChanged: HttpDownloadNotChanged
}


