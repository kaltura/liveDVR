/**
 * Created by root on 2/1/16.
 */
var Q = require('q');
var config = require('./../common/Configuration');
var path = require('path');
var kalturaVO = require('./kaltura-client-lib/KalturaVO');
var kalturaTypes = require('./kaltura-client-lib/KalturaTypes');
var logger = require('./logger/logger')(module);

module.exports = function updateConfiguration(){

    var stressConfig = config.get('stressTest');

    var mediaServer = config.get('mediaServer');

    if(stressConfig) {
        mediaServer.applicationName = path.join(mediaServer.hostname, mediaServer.applicationName + '_' + stressConfig.realEntryId);
        var arr =  stressConfig.proxyServerName.split(':');
        mediaServer.hostname = arr[0];
        if(arr.length > 1) {
            mediaServer.port = arr[1];
        }

        var liveEntries = { objects: function genLiveEntries() {
           var randomized  = [];
           var pattern = "1234567";

            for (var i = 0; i < stressConfig.numOfEntries; i++) {
               var id = '1_' + i;
               var index = 0;
               for (j = i; j > 0;j /= 10) {
                 index++;
               }
               randomized.push({
                    "id": id + pattern.substr(index),
                    dvrStatus: kalturaTypes.KalturaDVRStatus.ENABLED
                });
           }
           return randomized;
        }() };
        mediaServer.getLiveEntries = function () {
            return Q.resolve(liveEntries);
        };
        if(config.get('mockDownloadChunk')) {
            mediaServer.mockDownloadChunk = function () {
                var deferred = Q.defer();
                setTimeout(function () {
                    deferred.resolve(0);
                }, Math.random() * 200 + 20);
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

