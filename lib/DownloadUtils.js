/**
 * Created by AsherS on 8/20/15.
 */

var fs = require('fs');
var request = require('request');
var Q = require('q');

var DownloadUtils = (function(){

    function DownloadUtils(){

    }

    DownloadUtils.downloadFile = function (url,dest) {

        var deferred = Q.defer();

        try {
            var req = request.get(url);
            req
                .on('response', function (response) {
                    console.log("url : " + url);
                    console.log("status code: " + response.statusCode);
                    console.log(response.headers['content-type']);

                    if (response.statusCode != 200) {
                        deferred.reject("bad code: " + response.statusCode);    //TODO err value
                        return;
                    }

                    var file = fs.createWriteStream(dest);

                    //pipe the request only if the status code is 200
                    req.pipe(file);
                })

                .on('error', function (err) {
                    console.log(err);   //TODO error msg
                    deferred.reject(err);
                })

                .on('complete', function () {
                    deferred.resolve(); //TODO resolve value?
                });
        } catch (err) {
            deferred.reject(new Error(err));
        }
        return deferred.promise;
    };

    return DownloadUtils;
})();

module.exports = DownloadUtils;



