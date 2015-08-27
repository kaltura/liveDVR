/**
 * Created by elad.benedict on 8/20/2015.
 */

var m3u8Parser = require('./promise-m3u8');
var Q = require('Q');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var networkClient = require('./NetworkClientFactory').getNetworkClient();
var url = require('url');

module.exports = function(entryId, hostname, port, applicationName) {

    var persistenceFormat = require('./PersistenceFormat');
    var hostname = hostname || 'localhost';
    var port = port || 1935;
    var applicationName = applicationName || 'kLive';

    // Examples:
    // http://localhost:1935/test/smil:testStream.smil/playlist.m3u8
    // http://localhost:1935/test/smil:testStream.smil/chunklist_w1955191818_b400000.m3u8
    var getMediaServerLiveUrl = function getMediaServerLiveUrl(smil)
    {
        var smil = smil || 'all';
        var path = url.resolve( applicationName, '/smil:' + entryId + "_" + smil);
        var url = url.format({
            protocol : 'http',
            hostname : hostname,
            port : port,
            pathname : path
        })
        return url;
    };

    var getMediaServerManifest = function(smil){
        return Q.fcall(function(){
            var mediaServerBaseUrl = getMediaServerLiveUrl(smil);
            var mediaServerPlaylistUrl = url.resolve(mediaServerBaseUrl, 'playlist.m3u8');
            return networkClient.read(mediaServerPlaylistUrl);
        }).then(function(manifestData){
            return m3u8Parser.parseM3U8(manifestData, {'verbatim' : true});
        });
    };

    var getManifest = function getManifest(smil){

        // Assemble the absolute URL for the various flavors:
        // 1. Same host name as in the request URL
        // 2. Some web server identifier
        // 3. Local path to manifest

        return getMediaServerManifest(smil).then(function(manifest){
            //http://kalsegsec-a.akamaihd.net/dc-1/m/ny-live-publish1/kLive/smil:1_oorxcge2_publish.smil/chunklist_b475136.m3u8

            _.forEach(manifest.items.StreamItem, function(item)
            {

                //item.set('uri', persistenceFormat.getFlavorDestPath(entryId, item.get('bandwidth')));
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
