/**
 * Created by AsherS on 8/24/15.
 */

var _ = require('underscore');
var path = require('path');
var url = require('url');
var httpUtils = require('./utils/http-utils');
var logger = require('./logger/logger');
var m3u8Handler = require('./promise-m3u8');
var flavorDownloader = require('./flavor-downloader');

var EntryDownloader = (function () {

    function EntryDownloader(entryId, persistenceFormat) {
        this.entryId = entryId;
        this.persistanceFormat = persistenceFormat;
        this.flavorsObjects = null;

    }

    var buildM3u8Url = function (masterManifestUrl, flavorUrl) {
        return flavorUrl;    //TODO, here we should handle relative/absolute url in master manifest
    };

    var buildManifestUrl = function() { //TODO, remove
        return "http://cdnapi.kaltura.com/p/931702/sp/93170200/playManifest/entryId/1_oorxcge2/format/applehttp/protocol/http/uiConfId/28428751/a.m3u8?referrer=aHR0cDovL3dlYXRoZXJuYXRpb250di5jb20=&playSessionId=449149e6-b7b1-6862-d8a5-519d3b10d754";
    };

    EntryDownloader.prototype.start = function () {


        var that = this;
        var masterManifestPath = path.join(that.persistanceFormat.getEntryDestPath(that.entryId),"original-playlist.m3u8");

        //get master manifest url
        var manifestUrl = buildManifestUrl();   //TODO function that generates wowza's manifest. master manifest generator does this - just need to expose the function

        httpUtils.downloadFile(manifestUrl, masterManifestPath)

            .then(function parseManifest() {
                return m3u8Handler.parseM3U8(masterManifestPath);
            })
            .then(function startDownloaders(masterManifest) {

                that.flavorsObjects = _.map(masterManifest.items.StreamItem, function(flavorObj){


                    var m3u8Url = buildM3u8Url(manifestUrl, flavorObj.get('uri'));

                    //get playlist name:
                    var parsedUrl = url.parse(m3u8Url);
                    var playlistName = path.basename(parsedUrl.pathname);
                    //TODO, replace that.persistanceFormat.getManifestName() once committed.

                    var bitrate = flavorObj.get('bandwidth');
                    var destPath = that.persistanceFormat.getFlavorDestPath(that.entryId, bitrate);

                    return new flavorDownloader(m3u8Url, destPath, that.entryId, bitrate, playlistName);
                });

                //start the download
                _.forEach(that.flavorsObjects, function (f) {
                    f.start();  //TODO verify success with on-started event?
                });

                //TODO, generate DVR master manifest

            })
            .catch(function(err) {
                throw new Error("Failed to start entry downloader for entry: " + that.entryId + "\n" + err);
            });
    };

    EntryDownloader.prototype.stop = function () {
        logger.info('stopping entry downloader for entry id: ' + this.entryId);
        _.forEach(this.flavorsObjects, function (f) {
            f.stop();
        });
    };

    return EntryDownloader;
})();

module.exports = EntryDownloader;





var persistence = require('./PersistenceFormat')("/Users/AsherS/Downloads/DVR/root");
var downloader = new EntryDownloader("some_entry",persistence);
downloader.start();

setTimeout(function () {
    logger.info('----------------------------------------');
    downloader.stop();
}, 10000);


