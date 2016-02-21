/**
 * Created by gadyaari on 07/02/2016.
 */

var m3u8Parser = require('./../manifest/promise-m3u8');
var networkClient = require('./../NetworkClientFactory').getNetworkClient();
var Q = require('q');
var _ = require('underscore');
var url = require('url');
var util=require('util');
var StreamInfo=require('./BaseAdapter.js').StreamInfo;
var logger = require('../logger/logger')(module);
var persistenceFormat = require('./../../common/PersistenceFormat');
var config = require('../../common/Configuration');
var promUtils = require('../utils/promise-utils');


var mediaServer=config.get('mediaServer');
var applicationName=mediaServer.applicationName;
var hostname = mediaServer.hostname;
var port = mediaServer.port;

function WowzaStreamInfo(entryId,flavorParamsIds,sourceIp) {

    StreamInfo.call(this,entryId,flavorParamsIds);
    this.sourceIp=sourceIp;
    this.actualFlavorsParamsId=this.flavorParamsIds;
}

util.inherits(WowzaStreamInfo,StreamInfo);



module.exports=WowzaStreamInfo;



// http://localhost:1935/kLive/_definst_/entryId_flavorId/playlist.m3u8
function getFullLiveUrl(entryId,flavor) {
    var path = '/' + applicationName + "/_definst_/" + entryId + "_" + flavor + "/";
    return url.format({
        protocol : 'http',
        hostname : hostname,
        port : port,
        pathname : path
    });
}

function appendManifest(manifest, newData, forPlayer, flavor) {
    var tmpString = newData;

    if (manifest !== "") {
        var subStringIndex = newData.indexOf("#EXT-X-STREAM-INF");
        tmpString = newData.substring(subStringIndex);
    }
    return (forPlayer) ? tmpString.replace(/chunklist.*.m3u8/, flavor + "/" + persistenceFormat.getManifestName()) : tmpString;
}

WowzaStreamInfo.prototype._updateFlavorsList=function(manifest) {
    this.actualFlavorsParamsId = manifest.match(/^[0-9]*(?=\/chunklist[.]m3u8$)/gm);
}


WowzaStreamInfo.prototype._getMasterManifest=function() {
    var self=this;

    var mapFlavors = _.map(this.flavorParamsIds, function(flavor) {
        var mediaServerBaseUrl = getFullLiveUrl(self.entryId,flavor);
        var mediaServerPlaylistUrl = url.resolve(mediaServerBaseUrl, 'playlist.m3u8');
        logger.info("Sending request for " + mediaServerPlaylistUrl);
        return networkClient.read(mediaServerPlaylistUrl);
    });
    var playerPlaylist = "";
    var flavorArrIndex = 0;

    // Map the flavors array to a promise array containing the url response for each flavor.
    return Q.allSettled(mapFlavors)
        .then(function(results) {
            var originMasterManifest = "";
            _.each(results, function(result) {
                if (result.state === "fulfilled") {
                    // Only when RESOLUTION appears in manifest flavor is ready for playing
                    if (result.value.indexOf("RESOLUTION") > -1) {
                        originMasterManifest += appendManifest(originMasterManifest, result.value);
                        playerPlaylist += appendManifest(playerPlaylist, result.value, true, self.actualFlavorsParamsId[flavorArrIndex]);
                    }
                }
                else {
                    logger.error("Promise not fulfilled: " + result.reason);
                }
                flavorArrIndex++;
            });
            return (originMasterManifest === "") ? Q.reject("Flavors not ready") : Q.resolve(originMasterManifest);
        })
        .then(function(manifest) {
            // Received a manifest, update the flavors array and keep only the ones we use
            self._updateFlavorsList(playerPlaylist);
            // Parse the manifest received and return a manifest obj
            logger.info("Received manifest:\n" + playerPlaylist);
            return m3u8Parser.parseM3U8(manifest, {'verbatim' : true});
        })
        .then(function(manifest) {
            // Add Name property to each of the flavors in the manifest obj
            var index = 0;

            _.each(manifest.items.StreamItem, function(flavorObj,flavorIndex) {
                var mediaServerBaseUrl = getFullLiveUrl(self.entryId,self.actualFlavorsParamsId[flavorIndex]);
                flavorObj.name = self.actualFlavorsParamsId[index++];
                flavorObj.url= url.resolve(mediaServerBaseUrl, flavorObj.get('uri'));

            });
            return Q.resolve({playlistObj : manifest, playlist : playerPlaylist, flavorsList : self.actualFlavorsParamsId});
        })
        .catch(function(error) {
            logger.error("Flavor parsing failed: " + error);
            return Q.reject(error);
        });
}

WowzaStreamInfo.prototype.getAllFlavors = function() {
    var self=this;

    var promise = promUtils().retryPromise(function() {
        return self._getMasterManifest();
    }, 5000, 10, "Could not get manifest");

    return promise.then(function(result) {

        var flavorsObjArray = _.map(result.playlistObj.items.StreamItem, function(flavorObj){
            return {
                name : flavorObj.name,
                bandwidth : flavorObj.get('bandwidth'),
                resolution: flavorObj.get('resolution'),
                codecs: flavorObj.get('codecs'),
                liveURL : flavorObj.url,
                entryId : self.entryId
            };
        });

        return {flavorsObj : flavorsObjArray, flavorsList : result.flavorsList};
    })
    .catch(function(err) {
        logger.error("Manifest couldn't be parsed correctly: " + err.value);
    });
};
