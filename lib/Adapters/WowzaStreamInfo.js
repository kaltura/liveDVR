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
var config = require('../../common/Configuration');
var promUtils = require('../utils/promise-utils');
var loggerDecorator = require('../utils/log-decorator');

var mediaServer = config.get('mediaServer');
var applicationName = mediaServer.applicationName;
var hostname = mediaServer.hostname;
var port = mediaServer.port;

function WowzaStreamInfo(entryId, flavorParamsIds, sourceIp) {
    StreamInfo.call(this,entryId,flavorParamsIds);
    this.sourceIp = sourceIp;
    this.logger = loggerDecorator(logger, "[" + entryId + "] ");
}
util.inherits(WowzaStreamInfo, StreamInfo);

module.exports = WowzaStreamInfo;

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

function getMasterManifest() {
    var that = this;
    var mapFlavors = _.map(this.flavorParamsIds, function(flavor) {
        var mediaServerBaseUrl = getFullLiveUrl(that.entryId,flavor);
        var mediaServerPlaylistUrl = url.resolve(mediaServerBaseUrl, 'playlist.m3u8');
        that.logger.info("Sending request for %s", mediaServerPlaylistUrl);
        return networkClient.read(mediaServerPlaylistUrl)
            .then(function(content) {
                return m3u8Parser.parseM3U8(content, {'verbatim': true});
        });
    });

    // Map the flavors array to a promise array containing the url response for each flavor.
    return Q.allSettled(mapFlavors)
        .then(function(results) {
            var flavorsObjArray = [];
            _.each(results, function(result,index) {
                if (result.state === 'fulfilled') {
                    var m3u8 = result.value;
                    if (m3u8 && m3u8.items && m3u8.items.StreamItem.length > 0) {
                        var flavorObj = m3u8.items.StreamItem[0];
                        var bandwidth = flavorObj.get('bandwidth');
                        var resolution = flavorObj.get('resolution');
                        if (!resolution || !bandwidth) {// not ready yet
                            throw new Error("Flavors not ready");
                        }

                        var mediaServerBaseUrl = getFullLiveUrl(that.entryId, that.flavorParamsIds[index]);
                        flavorsObjArray.push({
                            name : that.flavorParamsIds[index],
                            bandwidth : bandwidth,
                            resolution: resolution,
                            codecs: flavorObj.get('codecs'),
                            liveURL : url.resolve(mediaServerBaseUrl, flavorObj.get('uri')),
                            entryId : that.entryId
                        });
                    }
                }
                else {
                    that.logger.error("Promise not fulfilled: %s", result.reason.message);
                }
            });
            return (flavorsObjArray.length === 0) ? Q.reject("Flavors not ready") : Q.resolve(flavorsObjArray);
        })
        .catch(function(error) {
            // TODO: Why in the first iteration error is a string and from then on an object? -> Gad
            // Variable is due to the fact that in the first iteration error is just a string and from then
            // on an Object containing ebj.message.
            var errMsg = error.message ? error.message : error;
            that.logger.error("Flavor parsing failed: %s", errMsg);
            return Q.reject(error);
        });
}

WowzaStreamInfo.prototype.getAllFlavors = function() {
    var that = this;
    var promise = promUtils.retryPromise(function() {
        return getMasterManifest.bind(that)();
    }, 5000, 10, "Could not get manifest");

    return promise;
};
