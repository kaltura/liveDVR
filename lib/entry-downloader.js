/**
 * Created by AsherS on 8/24/15.
 */

var _ = require('underscore');
var path = require('path');
var url = require('url');
var logger = require('./logger/logger');
var flavorDownloader = require('./flavor-downloader');
var masterManifestGeneratorCreator = require('./MasterManifestGenerator');
var persistenceFormat = require('./PersistenceFormat');
var config = require('./Configuration');
var qio = require('q-io/fs');

var EntryDownloader = (function () {

    function EntryDownloader(entryId) {
        this.entryId = entryId;
        this.flavorsDownloaders = [];

        var hostname = config.get('mediaServer.hostname');
        var port = config.get('mediaServer.port');
        var applicationName = config.get('mediaServer.applicationName');
        this.masterManifestGenerator = masterManifestGeneratorCreator(entryId, hostname, port, applicationName, persistenceFormat.getEntryDestPath(entryId));
    }

    EntryDownloader.prototype.start = function () {

        var that = this;
        that.masterManifestGenerator.getAllFlavors().then(function (flavors) {
            var promises = _.map(flavors, function (flavor) {
                var bitrate = flavor.get('bandwidth');
                var destPath = that.persistanceFormat.getFlavorDestPath(that.entryId, bitrate);
                return qio.makeTree(destPath).then(function () {
                    return flavor;
                });
            });
            return Q.all(promises).then(function() {
                return flavors;
            });
        }).then(function (flavors){
            _.chain(flavors).forEach(function(flavor) {
                var downloader = flavorDownloader(flavor.liveURL, destPath, that.entryId, bitrate, playlistName);
                that.flavorsDownloaders.push(downloader);
                downloader.start();
            });
        }).catch(function(err) {
            throw new Error("Failed to start entry downloader for entry: " + that.entryId + "\n" + err);
        });
    };

    EntryDownloader.prototype.stop = function () {
        logger.info('stopping entry downloader for entry id: ' + this.entryId);
        _.forEach(this.flavorsDownloaders, function (downloader) {
            try {
                downloader.stop();
            }
            catch(err){
                logger.error('failed stoppign flavor downloader for entry id: ' + this.entryId + ' and flavor ' + downloader.flavor);
            }
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


