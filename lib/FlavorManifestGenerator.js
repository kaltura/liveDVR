/**
 * Created by gadyaari on 07/02/2016.
 */

var m3u8Parser = require('./promise-m3u8');
var Q = require('q');
var _ = require('underscore');
var networkClient = require('./NetworkClientFactory').getNetworkClient();
var url = require('url');

module.exports = function(entryId, hostname, port, applicationName, flavors, logger) {
    // New URL
    // http://localhost:1935/kLive/_definst_/entryId_flavorId/playlist.m3u8
    function getFullLiveUrl(flavor) {
        var path = '/' + applicationName + "/_definst_/" + entryId + "_" + flavor + "/";
        return url.format({
            protocol : 'http',
            hostname : hostname,
            port : port,
            pathname : path
        });
    }

    function getMediaServerLiveUrl(flavorIndex) {
        return getFullLiveUrl(flavors[flavorIndex]);
    }

    function appendManifest(manifest, newData) {
        if (manifest !== "")
        {
            var subStringIndex = newData.indexOf("#EXT-X-STREAM-INF");
            var subString = newData.substring(subStringIndex);
            return subString;
        }
        return newData;
    }

    function getMediaServerManifest() {
        var mapFlavors = _.map(flavors, function(flavor) {
            var mediaServerBaseUrl = getFullLiveUrl(flavor);
            var mediaServerPlaylistUrl = url.resolve(mediaServerBaseUrl, 'playlist.m3u8');
            logger.info("Sending request for " + mediaServerPlaylistUrl);
            return networkClient.read(mediaServerPlaylistUrl);
        });

        return Q.allSettled(mapFlavors)
            .then(function(results) {
                var masterManifest = "";
                _.each(results, function(result) {
                    if (result.state === "fulfilled") {
                        if (result.value.indexOf("RESOLUTION") > -1) {
                            masterManifest += appendManifest(masterManifest, result.value);
                        }
                    }
                    else {
                        logger.error("Promise not fulfilled: " + result.reason);
                    }
                });
                return (masterManifest === "") ? Q.reject("Flavors not ready") : Q.resolve(masterManifest);
            })
            .then(function(manifest) {
                logger.info("Received manifest:\n" + manifest)
                return m3u8Parser.parseM3U8(manifest, {'verbatim' : true});
            })
            .catch(function(error) {
                logger.error("Flavor parsing failed: " + error);
                return Q.reject(error);
            });
    }

    return {
        getMediaServerManifest : getMediaServerManifest,
        getMediaServerLiveUrl : getMediaServerLiveUrl
    };
};