/**
 * Created by gadyaari on 24/02/2016.
 */

var masterManifestCtor = require('./../manifest/MasterManifestGenerator');
var flavorDownloader = require('./FlavorDownloader');
var persistenceFormat = require('./../../common/PersistenceFormat');
var config = require('../../common/Configuration');
var logger = require('./../logger/logger')(module);
var ErrorUtils = require('./../utils/error-utils');
var events = require('events');
var util = require('util');
var Q = require('q');
var _ = require('underscore');
var FSM = require('./StateManager');

function LiveEntry(entryObject, isNewSession) {
    events.EventEmitter.call(this);
    this.entryId = entryObject.entryId;
    this.masterManifestGenerator = new masterManifestCtor(entryObject, isNewSession);
    this.manifestTimeWindow = entryObject.manifestTimeWindow;
    this.manifestMaxChunkCount = entryObject.maxChunkCount;
    this.flavorsDownloaders = [];
    this.playbackRaised = false;
    this.FSM = FSM(entryObject);
}
util.inherits(LiveEntry, events.EventEmitter);

function onNewTsFilesDownloaded(numOfTsFilesDownloaded) {
    if (!this.playbackRaised) {
        if (numOfTsFilesDownloaded >= config.get('minChunksForPlayback')) {
            logger.info("Received " + config.get('minChunksForPlayback') + " chunks, calling onNotifyPlaying");
            this.playbackRaised = true;
            this.FSM.readyForPlaying();
        }
    }
}

// TODO: Change function to fit the updated flow of entry streaming -> Gad
function onFlavorDownloaderStopped() {
    var that = this;
    logger.info("Flavor " + flavor + " stopped - checking if any flavor is still active for entry " + that.entryId);
    if (_.every(that.flavorsDownloaders, function(f) { return f.runStatus === 'stopped'; })) {
        logger.info("No remaining active flavor downloaders for entry " + that.entryId + " - shutting down entry downloader");
        that.emit('stopped', that.entryId);
    }
}

function createFlavorDownloaders(flavorsObjArray) {
    var that = this;
    that.flavorsDownloaders = _.chain(flavorsObjArray)
        .uniq(function(flavor) {
            // Iterate through the flavors array and erase duplicate flavors if they exists
            return flavor.name;
        })
        .map(function(flavor) {
            var playlistName = persistenceFormat.getManifestName();
            var destPath = persistenceFormat.getFlavorFullPath(that.entryId, flavor.name);
            logger.info("EntryId: " + that.entryId + " - creating flavor downloader: " + flavor.name);
            return new flavorDownloader(flavor.liveURL, destPath, that.entryId, flavor.name, playlistName, that.manifestTimeWindow, that.manifestMaxChunkCount);
        })
        .value();
    //start the download
    var promises = _.map(that.flavorsDownloaders, function(f) {
        logger.info("EntryId: " + that.entryId + " - starting flavor downloader: " + f.flavor);
        f.on('newTsFiles', onNewTsFilesDownloaded.bind(that));
        f.on('stopped', onFlavorDownloaderStopped.bind(that));
        return f.start();
    });

    return Q.allSettled(promises);
}

LiveEntry.prototype.start = function() {
    var that = this;
    // Entry created -> report BROADCASTING to server
    logger.info("Entry " + that.entryId + " started streaming, report BROADCASTING to server");
    var p = that.FSM.start()
       return p[1]
           .then(function() {
               // Create master manifest and save it on disk
                return that.masterManifestGenerator.createManifest();
            })
            .then(function(result) {
                // Create a flavorDownloader for each of the flavors currently streaming
                return createFlavorDownloaders.call(that, result);
            })
            .then(function(results) {
                var errs = ErrorUtils.aggregateErrors(results);
                if (errs.numErrors === results.length) {
                    // Fail if no flavor downloader could be started
                    throw new Error("Failed to start entry downloader for entry: " + that.entryId + ". All flavor downloaders failed");
                }
                if (errs.numErrors > 0) {
                    // Report an error (but proceed) if only some flavor downloaders could not be started
                    logger.error("Failed  to start flavor downloaders for some of the flavors:\n", errs.err);
                }
            });
};

LiveEntry.prototype.stop = function() {
    var that = this;
    if (that.stopPromise) {
        logger.info("Entry stop already requested for entry " + this.entryId + " ignoring request");
        return that.stopPromise;
    }
    logger.info("Stopping live entry: " + this.entryId);
    var stopPromises =_.map(that.flavorsDownloaders, function(downloader) {
        return downloader.stop();
    });
    that.stopPromise = Q.all(stopPromises).then(function() {
        logger.info("Successfully stopped live entry : " + that.entryId);
    }, function(err) {
        logger.error("Failed stopping flavor downloader for entry id: " + that.entryId + ", error: " + err + "\n" + err.stack);
        throw err;
    });
    logger.info("Entry " + that.entryId + " stopped streaming, report unregister to server");
    var p = that.FSM.stop();
    return p[1].then(function() {
        return that.stopPromise ;
    })
};

module.exports = LiveEntry;