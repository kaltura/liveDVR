/**
 * Created by root on 2/1/16.
 */
var Q = require('q');
var config = require('./../common/Configuration');
var path = require('path');
var kalturaVO = require('./kaltura-client-lib/KalturaVO');
var kalturaTypes = require('./kaltura-client-lib/KalturaTypes');
var logger = require('./logger/logger')(module);

module.exports = function(){

    var stressConfig = config.get('stressTest');

    var mediaServer = config.get('mediaServer');

    if(stressConfig) {
        mediaServer.applicationName = path.join(mediaServer.hostname, mediaServer.applicationName + '_' + stressConfig.realEntryId);
        var arr =  stressConfig.proxyServerName.split(':');
        mediaServer.hostname = arr[0];
        if(arr.length > 1) {
            mediaServer.port = arr[1];
        }
        var liveEntries = function () {
           var randomized  = [];
           var pattern = "1234567";

            for (var i = 0; i < stressConfig.numOfEntries; i++) {
               var id = '1_' + i;
               while (i > 10) {
                 pattern = pattern.shift(1);
                 i /= 10;
               }
               randomized.push({
                    "id": id + pattern,
                    dvrStatus: kalturaTypes.KalturaDVRStatus.ENABLED
                });
           }
           return randomized;
        }();
        mediaServer.getLiveEntries = function () {
            return Q.resolve(Q.resolve({objects:liveEntries}));
        };
        if(config.get('mockDownloadChunk')) {
            mediaServer.mockDownloadChunk = function () {
                var deferred = Q.defer();
                setTimeout(function () {
                    deferred.resolve(0);
                }, Math.Random() % 200);
                return deferred.promise;
            };
        }
    } else {
        mediaServer.getLiveEntries = function (client,startTime) {
            return Q.Promise( function(resolve,reject,notify) {
                var filter = new kalturaVO.KalturaLiveStreamEntryFilter();

                filter.isLive = kalturaTypes.KalturaNullableBoolean.TRUE_VALUE;
                filter.hasMediaServerHostname = mediaServer.hostname;
                var pager = null;

                logger.debug("Request for liveStream.listAction started at " + startTime);
                client.liveStream.listAction(function (results) {
                    return resolve(results);
                }, filter, pager);
            });
        };
    }
    return mediaServer;
}();

