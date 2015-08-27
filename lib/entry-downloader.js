/**
 * Created by AsherS on 8/24/15.
 */

var _ = require('underscore');
var path = require('path');
var url = require('url');
var logger = require('./logger/logger');
var flavorDownloader = require('./flavor-downloader');
var masterGenerator = require('./MasterManifestGenerator');

var EntryDownloader = (function () {

    function EntryDownloader(entryId, hostname, port, applicationName, persistenceFormat) {
        this.entryId = entryId;
        this.persistanceFormat = persistenceFormat;
        this.flavorsObjects = null;

        //TODO, get these parameters from conf file instead - hostname, port, applicationName
        this.masterManifestGenerator = masterGenerator(entryId, hostname, port, applicationName, persistenceFormat.getEntryDestPath(entryId));
    }

    var buildM3u8Url = function (masterManifestUrl, flavorUrl) {
        return flavorUrl;    //TODO, here we should handle relative/absolute url in master manifest
    };

    EntryDownloader.prototype.start = function () {

        var that = this;
        that.masterManifestGenerator.getAllFlavors()

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
            });;
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




//TODO, what should be the hostname?
var persistence = require('./PersistenceFormat')("/Users/AsherS/Downloads/DVR/root");
var downloader = new EntryDownloader("1_oorxcge2", 'kalsegsec-a.akamaihd.net/dc-1/m/ny-live-publish1', 1935, 'kLive',persistence);
downloader.start();

//entryId, hostname, port, applicationName, persistenceFormat
//ttp:\/\/kalsegsec-a.akamaihd.net\/dc-1\/m\/ny-live-publish1\/kLive\/smil:1_oorxcge2_publish.smil\/chunklist_b475136.m3u8
setTimeout(function () {
    logger.info('----------------------------------------');
    downloader.stop();
}, 10000);


