/**
 * Created by elad.benedict on 8/20/2015.
 */

var Q = require('q');
var _ = require('underscore');
var url = require('url');
var config = require('./../../common/Configuration');
var promUtils = require('./../utils/promise-utils');
var path = require('path');

module.exports = function(entryId, hostname, port, applicationName, manifestGenerator, logger) {

    /*/!* jshint shadow:true *!/
    var hostname = hostname || 'localhost';
    var applicationName = applicationName || 'kLive'; */

    var getAllFlavors = function() {
        var promise = promUtils().retryPromise(manifestGenerator.getMediaServerManifest, 5000, 10, "Could not get manifest");

        return promise.then(function(result) {
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
                var flavorsObjArray = _.map(result.playlistObj.items.StreamItem, function(flavorObj){
                    var urlPath = manifestGenerator.getMediaServerLiveUrl(flavorIndex++);
                    return {
                        name : flavorObj.name,
                        bandwidth : flavorObj.get('bandwidth'),
                        liveURL : getFlavorFullPath(flavorObj.get('uri'), urlPath),
                        entryId : entryId
                    };
                });

                return {flavorsObj : flavorsObjArray, flavorsList : result.flavorsList, playlist: result.playlist};
            })
            .catch(function(err) {
                logger.error("Manifest couldn't be parsed correctly: " + err.value);
            });
    };

    return {
        getAllFlavors : getAllFlavors
    };
};