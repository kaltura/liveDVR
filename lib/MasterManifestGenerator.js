/**
 * Created by elad.benedict on 8/20/2015.
 */

var m3u8Parser = require('./promise-m3u8');
var Q = require('Q');
var _ = require('underscore');
var networkClient = require('./NetworkClientFactory').getNetworkClient();
var url = require('url');
var config = require('./Configuration');
var logger = require('./logger/logger');

module.exports = function(entryId, hostname, port, applicationName) {

    /* jshint shadow:true */
    var hostname = hostname || 'localhost';
    var applicationName = applicationName || 'kLive';

    // Examples:
    // http://localhost:1935/test/smil:testStream.smil/playlist.m3u8
    // http://localhost:1935/test/smil:testStream.smil/chunklist_w1955191818_b400000.m3u8
    var getMediaServerLiveUrl = function getMediaServerLiveUrl(smil)
    {
        var smil = smil || 'all';
        var path = '/' + applicationName + '/smil:' + entryId + "_" + smil + ".smil/";
        var resultUrl = url.format({
            protocol : 'http',
            hostname : hostname,
            port : port,
            pathname : path
        });
        return resultUrl;
    };

    var getMediaServerManifest = function(smil){
        return Q.fcall(function(){
            var mediaServerBaseUrl = getMediaServerLiveUrl(smil);
            var mediaServerPlaylistUrl = url.resolve(mediaServerBaseUrl, 'playlist.m3u8');
            logger.info("Sending request for " + mediaServerPlaylistUrl);
            return networkClient.read(mediaServerPlaylistUrl);
        }).then(function(manifestData){
            return m3u8Parser.parseM3U8(manifestData, {'verbatim' : true});
        });
    };

    var getManifest = function getManifest(requestURL, smil){

        // Assemble the absolute URL for the various flavors:
        // 1. Same host name as in the request URL
        // 2. Some web server identifier
        // 3. Local path to manifest

        return getMediaServerManifest(smil).then(function(manifest){
            var applicationName = config.get('webServerParams:applicationName');
            var index = requestURL.indexOf(applicationName);
            var urlPrefix = requestURL.substring(0, index);

            _.forEach(manifest.items.StreamItem, function(item)
            {
                var persistenceFormat = require('./PersistenceFormat');
                //TODO: find a more elegant way to combine url chunks. url.resolve is not good enough...
                var flavorRelativePath = persistenceFormat.getFlavorRelativePath(entryId, item.get('bandwidth')).replace('\\', '/');
                var updatedUrl = urlPrefix + applicationName + '/' + flavorRelativePath + '/' + persistenceFormat.getManifestName();
                item.set('uri', updatedUrl);
            });
            return manifest;
        });
    };

    var getAllFlavors = function getAllFlavors()
    {
        return getMediaServerManifest('all').then(function(manifest)
        {
            var getFlavorFullPath = function(uri){
                var parsedUrl = url.parse(uri);
                if (parsedUrl.protocol) // Absolute path
                {
                    return uri;
                }
                else // Relative path
                {
                    return url.resolve(getMediaServerLiveUrl(), uri);
                }
            };

            return _.map(manifest.items.StreamItem, function(flavorObj){
                return {
                    bandwidth : flavorObj.get('bandwidth'),
                    liveURL : getFlavorFullPath(flavorObj.get('uri')),
                    entryId : entryId
                };
            });
        });
    };

    return {
        getManifest : getManifest,
        getAllFlavors : getAllFlavors
    };
};
