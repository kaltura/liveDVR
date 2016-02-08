/**
 * Created by elad.benedict on 8/20/2015.
 */

var Q = require('q');
var _ = require('underscore');
var url = require('url');
var config = require('./../common/Configuration');
var promUtils = require('./utils/promise-utils');

module.exports = function(entryId, hostname, port, applicationName, manifestGenerator, logger) {

    /*/!* jshint shadow:true *!/
    var hostname = hostname || 'localhost';*/
    var applicationName = applicationName || 'kLive';

    var getManifest = function(){

        // Assemble the absolute URL for the various flavors:
        // 1. Same host name as in the request URL
        // 2. Some web server identifier
        // 3. Local path to manifest

        return manifestGenerator.getMediaServerManifest().then(function(manifest){
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
                //var urlPath = (newUrlFormat) ? newBehaviour().getMediaServerLiveUrl(flavors[flavorIndex++]) : wowzaBehaviour.getMediaServerLiveUrl();
                var urlPath = manifestGenerator.getMediaServerLiveUrl(flavorIndex++);
                return {
                    bandwidth : flavorObj.get('bandwidth'),
                    liveURL : getFlavorFullPath(flavorObj.get('uri'), urlPath),
                    entryId : entryId
                };
            });
        };
        var promise = promUtils().retryPromise(manifestGenerator.getMediaServerManifest, 5000, 10, "Could not get manifest");

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