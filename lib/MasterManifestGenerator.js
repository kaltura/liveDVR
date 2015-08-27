/**
 * Created by elad.benedict on 8/20/2015.
 */

var m3u8Parser = require('./promise-m3u8');
var Q = require('Q');
var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var networkClient = require('./NetworkClientFactory').getNetworkClient();

module.exports = function(entryId, hostname, port, applicationName) {

    var persistenceFormat = require('./PersistenceFormat');

    // http://192.168.162.45:1935/live/smil:1_abcdefgh_all.smil/playlist.m3u8
    var getMediaServerLiveUrl = function getMediaServerLiveUrl(smil)
    {
        var result = '';
        result += 'http://';
        result += hostname;
        if (port)
        {
            result += ':' + port;
        }

        result += '/' + applicationName + '/';
        result += 'smil:' + entryId + '_';
        if (smil === undefined) {
            smil = 'all';
        }
        result += smil + '.smil/playlist.m3u8';
        return result;
    };

    var getMediaServerManifest = function(smil){
        return Q.fcall(function(){
            var mediaServerUrl = getMediaServerLiveUrl(smil);
            return networkClient.read(mediaServerUrl);
        }).then(function(manifestData){
            return m3u8Parser.parseM3U8(manifestData, {'verbatim' : true});
        });
    };

    var getManifest = function getManifest(smil){
        return getMediaServerManifest(smil).then(function(manifest){
            _.forEach(manifest.items.StreamItem, function(item)
            {
                item.set('uri', persistenceFormat.getFlavorDestPath(entryId, item.get('bandwidth')));
            });
            return manifest;
        });
    };

    var getAllFlavors = function getAllFlavors()
    {
        return getMediaServerManifest('all').then(function(manifest)
        {
            return _.map(manifest.items.StreamItem, function(flavorObj){
                return {
                    bandwidth : flavorObj.get('bandwidth'),
                    liveURL : flavorObj.get('uri'),
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
