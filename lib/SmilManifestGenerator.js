/**
 * Created by gadyaari on 07/02/2016.
 */

var m3u8Parser = require('./promise-m3u8');
var Q = require('q');
var _ = require('underscore');
var networkClient = require('./NetworkClientFactory').getNetworkClient();
var url = require('url');

module.exports = function(entryId, hostname, port, applicationName, logger) {
    /* jshint shadow:true */
    var hostname = hostname || 'localhost';
    var applicationName = applicationName || 'kLive';

    // Old smil URL
    // http://localhost:1935/test/smil:testStream.smil/playlist.m3u8
    // http://localhost:1935/test/smil:testStream.smil/chunklist_w1955191818_b400000.m3u8
    function getFullLiveUrl(smil) {
        var path = '/' + applicationName + '/smil:' + entryId + "_" + smil + ".smil/";
        //return getUrlPath(path)
        return url.format({
            protocol : 'http',
            hostname : hostname,
            port : port,
            pathname : path
        });
    }

    function getMediaServerLiveUrl() {
        return getFullLiveUrl('all');
    }

    function getMediaServerManifest() {
        return Q.fcall(function(){
            var mediaServerBaseUrl = getFullLiveUrl('all');
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
};