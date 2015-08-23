/**
 * Created by AsherS on 8/20/15.
 */

var fs = require('fs');
var request = require('request');
var Q = require('q');

var IOUtils = (function(){

    function IOUtils(){

    }

    IOUtils.downloadFile = function (url,dest) {

        var deferred = Q.defer();
        var req = request.get(url);
        req
            .on('response', function (response) {
                console.log("status code: " + response.statusCode);
                console.log(response.headers['content-type']);

                if (response.statusCode != 200) {
                    deferred.reject(new Error("Request failed " + url + " failed. error code: " + response.statusCode));    //TODO return response instead?
                    return;
                }

                var file = fs.createWriteStream(dest);

                //pipe the request only if the status code is 200
                req.pipe(file);
            })

            .on('error', function (err) {
                console.log(err);
                deferred.reject(new Error(err));
            })

            .on('complete', function () {
                deferred.resolve();
            });
        return deferred.promise;
    };

    return IOUtils;
})();

module.exports = IOUtils;



