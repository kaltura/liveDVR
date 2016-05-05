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
var loggerModule = require('../../common/logger');
var config = require('../../common/Configuration');
var promUtils = require('../utils/promise-utils');

var mediaServer = config.get('mediaServer');
var applicationName = mediaServer.applicationName;
var hostname = mediaServer.hostname;
var port = mediaServer.port;

function WowzaStreamInfo(entryId, flavorParamsIds, sourceIp) {
    StreamInfo.call(this, entryId, flavorParamsIds);
    this.sourceIp = sourceIp;
    this.logger = loggerModule.getLogger("WowzaStreamingInfo", "[" + entryId + "] ");
}
util.inherits(WowzaStreamInfo, StreamInfo);

module.exports = WowzaStreamInfo;

// http://localhost:1935/kLive/_definst_/entryId_flavorId/playlist.m3u8
function getFullLiveUrl(entryId, flavor) {
    var path = '/' + applicationName + "/_definst_/" + entryId + "_" + flavor + "/";
    return url.format({
        protocol : 'http',
        hostname : hostname,
        port : port,
        pathname : path
    });
}

function checkChunklistReturnCode() {
    var baseUrl = getFullLiveUrl(this.entryId, this.flavorParamsIds[0]);
    var fullUrl = url.resolve(baseUrl, 'chunklist.m3u8');
    this.logger.info("Sending request for %s", fullUrl);
    return networkClient.read(fullUrl);
}

function mapFlavors() {
    var that = this;
    return _.map(that.flavorParamsIds, function(flavor) {
        var mediaServerBaseUrl = getFullLiveUrl(that.entryId, flavor);
        var mediaServerPlaylistUrl = url.resolve(mediaServerBaseUrl, 'playlist.m3u8');
        that.logger.info("Sending request for %s", mediaServerPlaylistUrl);
        return networkClient.read(mediaServerPlaylistUrl)
            .then(function (content) {
                return m3u8Parser.parseM3U8(content, {'verbatim': true});
            });
    });
}

function insertFlavorToPlaylist(flavorsObj, flavor, index) {
    var mediaServerBaseUrl = getFullLiveUrl(this.entryId, this.flavorParamsIds[index]);
    flavorsObj.push({
        name : this.flavorParamsIds[index],
        bandwidth : flavor.get('bandwidth'),
        resolution: flavor.get('resolution'),
        codecs: flavor.get('codecs'),
        liveURL : url.resolve(mediaServerBaseUrl, flavor.get('uri')),
        entryId : this.entryId
    });
}

function getMasterManifest() {
    var that = this;

    return checkChunklistReturnCode.call(that)
        .then(function() {
            // Map the flavors array to a promise array containing the url response for each flavor.
            var promiseArr = mapFlavors.call(that);
            return Q.allSettled(promiseArr);
        })
        .then(function (results) {
            var flavorsObjArray = [];
            _.each(results, function(result, index) {
                if (result.state === 'fulfilled') {
                    var m3u8 = result.value;
                    if (m3u8 && m3u8.items && m3u8.items.StreamItem.length > 0) {
                        insertFlavorToPlaylist.call(that, flavorsObjArray, m3u8.items.StreamItem[0], index);
                    }
                }
            });
            return (flavorsObjArray.length === 0) ? Q.reject(new Error("Flavors not ready in wowza")) : Q.resolve(flavorsObjArray);
        })
        .catch(function(error) {
            that.logger.error("Error creating Playlist: %s", error.message);
            return Q.reject(error);
        });
}

WowzaStreamInfo.prototype.getAllFlavors = function() {
    var that = this;
    return promUtils.retryPromise(function() {
        return getMasterManifest.bind(that)();
    }, 5000, 7, "Could not get manifest");
};
