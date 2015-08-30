/**
 * Created by AsherS on 8/24/15.
 */


var EntryDownloader = (function () {

    var _ = require('underscore');
    var path = require('path');
    var logger = require('./logger/logger');
    var flavorDownloader = require('./FlavorDownloader');
    var masterManifestGeneratorCreator = require('./MasterManifestGenerator');
    var persistenceFormat = require('./PersistenceFormat');
    var Q = require('Q');


    function EntryDownloader(entryId, hostname, port, applicationName) {
        this.entryId = entryId;
        this.flavorsDownloaders = [];
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

                return Q.allSettled(promises);

            }).then(function (results) {
                var failedFlavors = _.filter(results, function (result) {
                    return result.state === "rejected";
                });

                if (failedFlavors.length === results.length) {
                    throw new Error("Failed to start entry downloader for entry: " + that.entryId + ". All flavor downloaders failed");
                }

                var successfullFlavors = _.filter(results, function(result){
                    return result.state === "fulfilled";
                })

                if (failedFlavors.length > 0)
                {
                    var message = 'Could not start the following flavors for entry id: ' + this.entryId + '\n';
                    message += _.map(failedFlavors, function(err){
                       return err.flavor;
                    }).toString();
                    logger.warn(message);
                }
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
