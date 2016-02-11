/**
 * Created by gadyaari on 07/02/2016.
 */

var m3u8Parser = require('./promise-m3u8');
var Q = require('q');
var _ = require('underscore');
var networkClient = require('./NetworkClientFactory').getNetworkClient();
var url = require('url');

module.exports = function(entryId, hostname, port, applicationName, logger, flavors) {
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

    function appendManifest(manifest, newData, forPlayer, flavor) {
        var tmpString = newData;
        var persistenceFormat = require('./../common/PersistenceFormat');

        if (manifest !== "") {
            var subStringIndex = newData.indexOf("#EXT-X-STREAM-INF");
            tmpString = newData.substring(subStringIndex);
        }
        return (forPlayer) ? tmpString.replace("chunklist.m3u8", flavor + "/" + persistenceFormat.getManifestName()) : tmpString;
    }

    function updateFlavorsList(manifest) {
        flavors = manifest.match(/^[0-9]*(?=\/chunklist[.]m3u8$)/gm);
    }

    function getMediaServerManifest() {
        var mapFlavors = _.map(flavors, function(flavor) {
            var mediaServerBaseUrl = getFullLiveUrl(flavor);
            var mediaServerPlaylistUrl = url.resolve(mediaServerBaseUrl, 'playlist.m3u8');
            logger.info("Sending request for " + mediaServerPlaylistUrl);
            return networkClient.read(mediaServerPlaylistUrl);
        });
        var playlist = "";
        var flavorArrIndex = 0;

        // Map the flavors array to a promise array containing the url response for each flavor.
        return Q.allSettled(mapFlavors)
            .then(function(results) {
                var masterManifest = "";
                _.each(results, function(result) {
                    if (result.state === "fulfilled") {
                        // Only when RESOLUTION appears in manifest flavor is ready for playing
                        if (result.value.indexOf("RESOLUTION") > -1) {
                            masterManifest += appendManifest(masterManifest, result.value);
                            playlist += appendManifest(playlist, result.value, true, flavors[flavorArrIndex]);
                        }
                    }
                    else {
                        logger.error("Promise not fulfilled: " + result.reason);
                    }
                    flavorArrIndex++;
                });
                return (masterManifest === "") ? Q.reject("Flavors not ready") : Q.resolve(masterManifest);
            })
            .then(function(manifest) {
                // Received a manifest, update the flavors array and keep only the ones we use
                updateFlavorsList(playlist);
                // Parse the manifest received and return a manifest obj
                logger.info("Received manifest:\n" + manifest);
                return m3u8Parser.parseM3U8(manifest, {'verbatim' : true});
            })
            .then(function(manifest) {
                // Add Name property to each of the flavors in the manifest obj
                var index = 0;
                _.each(manifest.items.StreamItem, function(flavorObj) {
                    flavorObj.name = flavors[index++];
                });
                return Q.resolve({playlistObj : manifest, playlist : playlist});
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