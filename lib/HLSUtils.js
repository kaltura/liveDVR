/**
 * Created by AsherS on 8/23/15.
 */

var fs = require('fs');
var m3u8Parser = require('m3u8');
var Q = require('q');

var HLSUtils = (function(){

    function HLSUtils(){

    }

    HLSUtils.readM3u8File = function(dest) {

        var deferred = Q.defer();
        var parser = m3u8Parser.createStream();
        var playlist = fs.createReadStream(dest);

        // This will wait until we know the readable stream is actually valid before piping
        playlist.on('open', function () {
            console.log('stream is open');
            playlist.pipe(parser);
        });

        // This catches any errors that happen while creating the readable stream (usually invalid names)
        playlist.on('error', function(err) {
            console.log('error: ' + err);
            deferred.reject(err);   //TODO reject parameter
        });

        parser.on('m3u', function (m3u) {
            deferred.resolve(m3u);
        });
        parser.on('error', function (err) {
            deferred.reject(err);   //TODO reject parameter
        });
        return deferred.promise;
    };

    return HLSUtils;
})();

module.exports = HLSUtils;