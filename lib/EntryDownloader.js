/**
 * Created by AsherS on 8/24/15.
 */

var _ = require('underscore');
var logger = require('./logger/logger')(module);
var flavorDownloader = require('./FlavorDownloader');
var masterManifestGeneratorCreator = require('./MasterManifestGenerator');
var Q = require('q');
var ErrorUtils = require('./utils/error-utils');

var EntryDownloader = (function () {

    function EntryDownloader(entryId, hostname, port, applicationName, dvrWindow) {
        this.entryId = entryId;
        this.dvrWindow = dvrWindow;
        this.flavorsDownloaders = [];
        this.masterManifestGenerator = masterManifestGeneratorCreator(entryId, hostname, port, applicationName);
    }

    EntryDownloader.prototype.start = function () {
        var persistenceFormat = require('./PersistenceFormat');
        var that = this;
        logger.info("Starting entry downloader for entryId: " + that.entryId + "\n");
        return that.masterManifestGenerator.getAllFlavors()
            .then(function (flavors) {
                that.flavorsDownloaders = _.map(flavors, function (flavor) {

                    var playlistName = persistenceFormat.getManifestName();
                    var bitrate = flavor.bandwidth;
                    var destPath = persistenceFormat.getFlavorFullPath(that.entryId, bitrate);
                    logger.info("EntryId: " + that.entryId + " - creating flavor downloader: " + bitrate);
                    return new flavorDownloader(flavor.liveURL, destPath, that.entryId, bitrate, playlistName, that.dvrWindow);
                });

                //start the download
                var promises = _.map(that.flavorsDownloaders, function (f) {
                    logger.info("EntryId: " + that.entryId + " - starting flavor downloader: " + f.flavor);
                    return f.start();
                });

                return Q.allSettled(promises);

            }).then(function (results) {

                var errs = ErrorUtils.aggregateErrors(results);

                if (errs.numErrors === results.length) {
                    throw new Error("Failed to start entry downloader for entry: " + that.entryId + ". All flavor downloaders failed\n" + errs.err);
                }

                if (errs.numErrors > 0) {
                    logger.error('Failed to start entry downloader:\n',errs.err);
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
            logger.error('failed stopping flavor downloader for entry id: ' + that.entryId + ' and flavor ' + downloader.flavor + "\n" + err + "\n" + err.stack);
            throw err;
        });
    };

    return EntryDownloader;
})();

module.exports = EntryDownloader;