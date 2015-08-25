/**
 * Created by AsherS on 8/23/15.
 */

var fs = require('fs');
var m3u8Parser = require('m3u8');
var Q = require('q');
var logger = require('../logger/logger');


//TODO, remove and replace with elad's m3u8 function promise-m3u8
var HLSUtils = (function(){

    function HLSUtils(){

    }

    HLSUtils.readM3u8File = function(filePath) {

        logger.debug("reading m3u8 file from: " + filePath);

        var deferred = Q.defer();
        var parser = m3u8Parser.createStream();
        var playlist = fs.createReadStream(filePath);

        playlist.on('open', function () {
            playlist.pipe(parser);
        });

        playlist.on('error', function(err) {
            logger.error("failed to createReadStream: " + err);
            deferred.reject(err);
        });

        parser.on('m3u', function (m3u) {
            deferred.resolve(m3u);
        });
        parser.on('error', function (err) {
            logger.error("failed to get m3u: " + err);
            deferred.reject(err);
        });
        return deferred.promise;
    };

    return HLSUtils;
})();

module.exports = HLSUtils;