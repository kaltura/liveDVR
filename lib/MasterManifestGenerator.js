/**
 * Created by elad.benedict on 8/20/2015.
 */

var m3u8Parser = require('./promise-m3u8');
var Q = require('q');
var _ = require('underscore');
var networkClient = require('./NetworkClientFactory').getNetworkClient();
var url = require('url');
var config = require('./../common/Configuration');

module.exports = function(entryId, hostname, port, applicationName, flavors, logger) {

    /* jshint shadow:true */
    var hostname = hostname || 'localhost';
    var applicationName = applicationName || 'kLive';

    function getUrlPath(path) {
        return url.format({
            protocol : 'http',
            hostname : hostname,
            port : port,
            pathname : path
        });
    }

    function wowzaBehaviour() {
        // Examples:
        // Old smil URL
        // http://localhost:1935/test/smil:testStream.smil/playlist.m3u8
        // http://localhost:1935/test/smil:testStream.smil/chunklist_w1955191818_b400000.m3u8
        function getMediaServerLiveUrl(smil) {
            var smil = smil || 'all';
            var path = '/' + applicationName + '/smil:' + entryId + "_" + smil + ".smil/";
            return getUrlPath(path);
        }

        function getMediaServerManifest(smil) {
            return Q.fcall(function(){
                var mediaServerBaseUrl = getMediaServerLiveUrl(smil);
                var mediaServerPlaylistUrl = url.resolve(mediaServerBaseUrl, 'playlist.m3u8');
                logger.info("Sending request for " + mediaServerPlaylistUrl);
                return networkClient.read(mediaServerPlaylistUrl);
            }).then(function(manifestData){
                return m3u8Parser.parseM3U8(manifestData, {'verbatim' : true});
            });
        }

        return{
            getMediaServerManifest : getMediaServerManifest,
            getMediaServerLiveUrl : getMediaServerLiveUrl
        };
    }


    function retryPromise(fn, intervalRetry, maxRetries, errorString) {
        //logger.debug("retryPromise");
        return fn().catch(function() { // if it fails
                return Q.delay(intervalRetry) // delay
                    // retry with more time
                    .then(function(){
                        if (maxRetries <= 0) {
                            throw new Error(errorString + " (after "+ maxRetries + " retries)");
                        }
                        return retryPromise(fn, intervalRetry, maxRetries - 1);
                    });
        });
    }

    function newBehaviour() {
        // New URL
        // http://localhost:1935/kLive/entryId_flavorId/playlist.m3u8
        function getMediaServerLiveUrl(flavor) {
            var path = '/' + applicationName + "/_definst_/" + entryId + "_" + flavor + "/";
            return getUrlPath(path);
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
                    var mediaServerBaseUrl = getMediaServerLiveUrl(flavor);
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
    }

    var getManifest = function getManifest(requestURL, smil){

        // Assemble the absolute URL for the various flavors:
        // 1. Same host name as in the request URL
        // 2. Some web server identifier
        // 3. Local path to manifest

        return getMediaServerManifest(smil).then(function(manifest){
            var applicationName = config.get('webServerParams:applicationName');

            _.forEach(manifest.items.StreamItem, function(item)
            {
                var persistenceFormat = require('./../common/PersistenceFormat');
                //TODO: find a more elegant way to combine url chunks. url.resolve is not good enough...
                var flavorRelativePath = persistenceFormat.getFlavorRelativePath(entryId, item.get('bandwidth')).replace('\\', '/');
                var updatedUrl = '../../' + applicationName + '/' + flavorRelativePath + '/' + persistenceFormat.getManifestName();
                item.set('uri', updatedUrl);
            });
            return manifest;
        });
    };

    var getAllFlavors = function getAllFlavors(newUrlFormat)
    {
        var returnFlavorsObjectArray = function(manifest) {
            var flavorIndex = 0;
            var getFlavorFullPath = function(uri, urlPath){
                var parsedUrl = url.parse(uri);
                if (parsedUrl.protocol) // Absolute path
                {
                    return uri;
                }
                else // Relative path
                {
                    return url.resolve(urlPath, uri);
                }
            };
            return _.map(manifest.items.StreamItem, function(flavorObj){
                var urlPath = (newUrlFormat) ? newBehaviour().getMediaServerLiveUrl(flavors[flavorIndex++]) : wowzaBehaviour.getMediaServerLiveUrl();
                return {
                    bandwidth : flavorObj.get('bandwidth'),
                    liveURL : getFlavorFullPath(flavorObj.get('uri'), urlPath),
                    entryId : entryId
                };
            });
        };
        var repetitivePromise = retryPromise(newBehaviour().getMediaServerManifest, 3000, 10, "Could not get manifest");

        var promise = (newUrlFormat) ? repetitivePromise : wowzaBehaviour().getMediaServerManifest();

        return promise.then(returnFlavorsObjectArray)
            .catch(function(err) {
                logger.error("Manifest couldn't be parsed correctly: " + err.value);
            });
    };

    return {
        getManifest : getManifest,
        getAllFlavors : getAllFlavors
    };
};