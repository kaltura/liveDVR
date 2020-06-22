/**
 * Created by AsherS on 8/24/15.
 */

var networkClientFactory = require('../NetworkClientFactory');
var configuration = require('../../common/Configuration');
var qfs = require("q-io/fs");
var Q = require("q");
var MP4WriteStream = require('../MP4WriteStream').MP4WriteStream;
var loggerModule = require('../../common/logger');
var http = require('http');
var pFormat = require('../../common/PersistenceFormat');
var url_lib = require('url');
const util = require('util');


var HttpDownloadNotChanged="HttpDownloadNotChanged";
var keepAliveAgent = new http.Agent({ keepAlive: true, maxSockets: 100});

const defaultRequestTimeout=configuration.get("requestTimeout");

var HttpDownloader = function(loggerInfo ,compareFn) {

    var logger = loggerModule.getLogger("Http-utils", loggerInfo);
    var obj = {};


    obj.downloadFile = function(url, pathDestination, timeout = defaultRequestTimeout) {
        var networkClient = networkClientFactory.getNetworkClient();
        var request = {
            url: url,
            agent: keepAliveAgent,
            timeout: timeout,
            headers: {"Connection":"Keep-Alive"},
        };

        var startTime = new Date();
        var downloadedTime=null;
        logger.debug("Request for %s",url);
        return networkClient
            .read(request)
            .finally(function(){
                downloadedTime = new Date();
            })
            .then(function(data) {
                downloadedTime = downloadedTime || new Date();
                var processTime = downloadedTime-startTime;
                if (compareFn && compareFn(data.body)) {
                    logger.debug("Request for %s took %d ms, ignoring since content hasn't changed",url, processTime);
                    return Q.reject(HttpDownloadNotChanged);
                }
                logger.debug("Request for %s took %d ms",url, processTime);
                return data.body;
                /*
                return qfs.write(pathDestination, data.body).then(function() {
                    var savedTime = new Date();
                    var fileSaveTime = savedTime-downloadedTime;
                    logger.debug("Saving file %s took %d ms", pathDestination, fileSaveTime);
                    return data.body;
                });*/
            })
            .catch(function(err){
                    if (err instanceof  Error)
                        throw new Error("Failed to download file. Url: " + url + " Destination: " + pathDestination + " Err: " + err + " stack: " + err.stack);
                    else {
                        return Q.reject(err);
                    }
                }
            );
    };

    obj.downloadStream = function(url, stream, pathDestination, timeout = defaultRequestTimeout ) {

        var downloadedTime = null;
        logger.debug("Request for %s",url);

        var def = Q.defer(),
            req = null,
            tm,
            onError = function (err) {
                if( typeof err === 'string'){
                    err = new Error(err + url);
                } else if(!err || !err.message) {
                    err = new Error('error ' + url);
                }
                def.reject(err);
                if (tm) {
                    clearTimeout(tm);
                    tm=null;
                }
            };
        stream.on('error',onError)

        try {
            var q = url_lib.parse(url, true);
            let options = {
                agent: keepAliveAgent,
                path:  q.pathname,
                host: q.hostname,
                port: q.port,
                headers: {"Connection":"Keep-Alive"}
            };


            req = http.get(options, (res, err) => {
                if (!err && res.statusCode!==200) {
                    err = new Error(`failed downloading ${url} - bad statusCode ${res.statusCode}`)
                }
                if (err) {
                    if (tm) {
                        clearTimeout(tm);
                        tm=null;
                    } else {
                        return;//we already send something
                    }
                    onError(err);
                } else {
                    downloadedTime = downloadedTime || new Date();
                    res.on('error', onError)
                        .pipe(stream)
                        .on('end',function(retVal){
                            if (tm) {
                                clearTimeout(tm);
                                tm=null;
                            }else {
                                return;//we already send response
                            }
                            var savedTime = new Date();
                            var fileSaveTime = savedTime-downloadedTime;
                            logger.debug("Saving file %s took %d ms",pathDestination,fileSaveTime);
                            def.resolve(retVal);
                        });
                }
            });
            req.on('error', onError);
            req.end();


            if (timeout) {
                tm = setTimeout(function(){
                    req.destroy();
                    onError('timeout');
                }, timeout);
            }

        }
        catch(err){
            onError(err);
        }
        return def.promise;
    };

    obj.downloadConvert = function(url, pathDestination, timeout , retries = 3) {
        var stream = new MP4WriteStream(pathDestination, loggerInfo);
        return this.downloadStream(url,stream,pathDestination,timeout).fail((err) => {
            logger.debug("Got Error of %s with [%d] retries left", util.inspect(err), retries);
            if (retries > 0)
                return this.downloadConvert(url, pathDestination, timeout , --retries);
            return Q.reject(err);
        });
    };

    return obj;

};

module.exports= {
    HttpDownloader: HttpDownloader,
    HttpDownloadNotChanged: HttpDownloadNotChanged
};