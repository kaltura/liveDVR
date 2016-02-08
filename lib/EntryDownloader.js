/**
 * Created by AsherS on 8/24/15.
 */

var _ = require('underscore');
var logger = require('./logger/logger')(module);
var flavorDownloader = require('./FlavorDownloader');
var masterManifestGeneratorCreator = require('./MasterManifestGenerator');
var smilBasedManifest = require('./SmilManifestGenerator');
var flavorsBasedManifest = require('./FlavorManifestGenerator');
var Q = require('q');
var ErrorUtils = require('./utils/error-utils');
var util = require('util');
var events = require("events");

var EntryDownloader = (function () {

    function EntryDownloader(entryId, hostname, port, applicationName, flavorsIds, manifestTimeWindow, manifestMaxChunkCount, flavorBase) {
        events.EventEmitter.call(this);
        this.entryId = entryId;
        this.manifestTimeWindow = manifestTimeWindow;
        this.manifestMaxChunkCount = manifestMaxChunkCount;
        this.flavorsDownloaders = [];
        this.manifestGenerator = (flavorBase) ? flavorsBasedManifest(entryId, hostname, port, applicationName, flavorsIds, logger) :
            smilBasedManifest(entryId, hostname, port, applicationName, logger);
        this.masterManifestGenerator = masterManifestGeneratorCreator(entryId, hostname, port, applicationName, this.manifestGenerator, logger);
    }

    util.inherits(EntryDownloader, events.EventEmitter);

    var onFlavorDownloaderStopped = function(flavor){
        var that = this;
        logger.info("Flavor " + flavor + " stopped - checking if any flavor is still active for entry " + that.entryId);
        if (_.every(that.flavorsDownloaders, function(f){ return f.runStatus === 'stopped'; }))
        {
            logger.info("No remaining active flavor downloaders for entry " + that.entryId + " - shutting down entry downloader");
            that.emit('stopped', that.entryId);
        }
    };

    EntryDownloader.prototype.start = function () {
        var that = this;
        logger.info("Entry start requested for entry " + that.entryId);
        var persistenceFormat = require('./../common/PersistenceFormat');
        logger.info("Starting entry downloader for entryId: " + that.entryId + "\n");
        // TODO: Figure out how and which manifest obj to transfer as a parameter
        return that.masterManifestGenerator.getAllFlavors()
            .then(function(flavors) {
                that.flavorsDownloaders = _.chain(flavors)
                    .uniq(function(flavor){
                        return flavor.bandwidth;
                    })
                    .map(function (flavor) {
                        var playlistName = persistenceFormat.getManifestName();
                        var bitrate = flavor.bandwidth;
                        var destPath = persistenceFormat.getFlavorFullPath(that.entryId, bitrate);
                        logger.info("EntryId: " + that.entryId + " - creating flavor downloader: " + bitrate);
                        return new flavorDownloader(flavor.liveURL, destPath, that.entryId, bitrate, playlistName, that.manifestTimeWindow, that.manifestMaxChunkCount);
                    }).value();

                //start the download
                var promises = _.map(that.flavorsDownloaders, function (f) {
                    logger.info("EntryId: " + that.entryId + " - starting flavor downloader: " + f.flavor);
                    f.on('stopped', onFlavorDownloaderStopped.bind(that));
                    return f.start();
                });

                return Q.allSettled(promises);

            }).then(function (results) {

                var errs = ErrorUtils.aggregateErrors(results);

                if (errs.numErrors === results.length) {
                    // Fail if no flavor downloader could be started
                    throw new Error("Failed to start entry downloader for entry: " + that.entryId + ". All flavor downloaders failed");
                }

                if (errs.numErrors > 0) {
                    // Report an error (but proceed) if only some flavor downloaders could not be started
                    logger.error('Failed to start flavor downloaders for some of the flavors:\n',errs.err);
                }
            });
    };

    EntryDownloader.prototype.stop = function () {
        var that = this;
        if (that.stopPromise)
        {
            logger.info("Entry stop already requested for entry " + this.entryId + " ignoring request");
            return that.stopPromise;
        }

        logger.info('stopping entry downloader for entry id: ' + this.entryId);
        var stopPromises =_.map(this.flavorsDownloaders, function (downloader) {
            return downloader.stop();
        });

        that.stopPromise = Q.all(stopPromises).then(function(){
            logger.info('successfully stopped entry downloader for entry id: ' + that.entryId);
        }, function(err){
            logger.error('failed stopping flavor downloader for entry id: ' + that.entryId + ' and flavor ' + downloader.flavor + "\n" + err + "\n" + err.stack);
            throw err;
        });

        return that.stopPromise;
    };

    return EntryDownloader;
})();

module.exports = EntryDownloader;