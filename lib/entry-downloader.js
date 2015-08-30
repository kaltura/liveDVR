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

        var hostname = config.get('mediaServer').hostname;
        var port = config.get('mediaServer').port;
        var applicationName = config.get('mediaServer').applicationName;
        this.masterManifestGenerator = masterManifestGeneratorCreator(entryId, hostname, port, applicationName);
    }

    EntryDownloader.prototype.start = function () {
        var that = this;
        logger.info("Starting entry downloader for entryId: " + that.entryId);
        return that.masterManifestGenerator.getAllFlavors()
            .then(function (flavors) {
                that.flavorsDownloaders = _.map(flavors, function (flavor) {

                    var playlistName = persistenceFormat.getManifestName();
                    var bitrate = flavor.bandwidth;
                    var destPath = persistenceFormat.getFlavorFullPath(that.entryId, bitrate);

                    logger.info("EntryId: " + that.entryId + " - creating flavor downloader: " + bitrate);
                    return new flavorDownloader(flavor.liveURL, destPath, that.entryId, bitrate, playlistName);
                });

                //start the download
                var promises = _.map(that.flavorsDownloaders, function (f) {
                    logger.info("EntryId: " + that.entryId + " - starting flavor downloader: " + f.flavor);
                    return f.start();
                });

                return Q.all(promises);

            }).then(function () {
                logger.info("Successfully started all flavor downloaders for EntryId: " + that.entryId);
            }).catch(function(err) {
                throw new Error("Failed to start entry downloader for entry: " + that.entryId + "\n" + err);
            });
    };

    EntryDownloader.prototype.stop = function () {
        logger.info('stopping entry downloader for entry id: ' + this.entryId);
        var that = this;
        var stopPromises =_.map(this.flavorsDownloaders, function (downloader) {
                return downloader.stop();
        });

        return Q.all(stopPromises).then(function(){
            logger.info('successfully stopped entry downloader for entry id: ' + that.entryId);
        }, function(err){
            logger.error('failed stopping flavor downloader for entry id: ' + that.entryId + ' and flavor ' + downloader.flavor + "\n" + err);
            throw err;
        });
    };

    return EntryDownloader;
})();

module.exports = EntryDownloader;
