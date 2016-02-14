/**
 * Created by elad.benedict on 8/20/2015.
 */

var Q = require('q');
var _ = require('underscore');
var url = require('url');
var config = require('./../../common/Configuration');
var promUtils = require('./../utils/promise-utils');
var path = require('path');
var persistenceFormat = require('./../../common/PersistenceFormat');

module.exports = function(entryId, hostname, port, applicationName, manifestGenerator, logger) {

    /*/!* jshint shadow:true *!/
    var hostname = hostname || 'localhost';
    var applicationName = applicationName || 'kLive'; */

    var savePlaylist = function (manifest) {
        var fsUtils = require('./utils/fs-utils');

        // Get the destination to save the manifest
        var destPath = path.join(config.get('rootFolderPath'), entryId, persistenceFormat.getMasterManifestName());
        //return qfs.write(destPath, manifest);
        return fsUtils.writeFileAtomically(destPath, manifest);
    };

    var getAllFlavors = function() {
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
                var urlPath = manifestGenerator.getMediaServerLiveUrl(flavorIndex++);
                return {
                    flavorRecognizer : flavorObj.name,
                    bandwidth : flavorObj.get('bandwidth'),
                    liveURL : getFlavorFullPath(flavorObj.get('uri'), urlPath),
                    entryId : entryId
                };
            });
        };
        var promise = promUtils().retryPromise(manifestGenerator.getMediaServerManifest, 5000, 10, "Could not get manifest");

        return promise.then(function(result) {
            // Save the player's manifest to the disc before continuing parsing
            savePlaylist(result.playlist)
            return result.playlistObj ;
        })
            .then(returnFlavorsObjectArray)
            .catch(function(err) {
                logger.error("Manifest couldn't be parsed correctly: " + err.value);
            });
    };

    return {
        getAllFlavors : getAllFlavors
    };
};