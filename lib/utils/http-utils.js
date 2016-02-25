/**
 * Created by AsherS on 8/24/15.
 */

var networkClientFactory = require('../NetworkClientFactory');
var configuration = require('../../common/Configuration');
var FixedArray = require("fixed-array");
var Q = require("q");

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

var HttpDownloader = function(logger,compareResults){

    var qfs = require("q-io/fs");
    var obj = {};

    obj.lastResult=null;

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

        pendingRequests++;
        var startTime = new Date().getTime();
        logger.debug("Request for " + url + " started at " + startTime);
        return networkClient
            .read(request)
            .finally(function(){
                pendingRequests--;
                var endTime = new Date().getTime();
                var processTime = endTime-startTime;
                if (url.indexOf(".ts")>-1) {
                    ts_request_log.push(processTime);
                }else {
                    m3u8_request_log.push(processTime);
                }
                logger.debug("Request for " + url + " (started at " + startTime + ") took " + processTime);
            })
            .then(function(data) {
                if (compareResults) {

                    if (obj.lastResult && isSameBufferContent(obj.lastResult,data)) {
                        return Q.reject(HttpDownloadNotChanged);
                    }
                    obj.lastResult=data;
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
    getStats: getStats,
    HttpDownloader: HttpDownloader,
    HttpDownloadNotChanged: HttpDownloadNotChanged
}


