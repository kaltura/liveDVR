/**
 * Created by gadyaari on 24/02/2016.
 */

var masterManifestCtor = require('./../manifest/MasterManifestGenerator');
var flavorDownloader = require('./FlavorDownloader');
var persistenceFormat = require('./../../common/PersistenceFormat');
var config = require('../../common/Configuration');
var logger = require('./../logger/logger')(module);
var ErrorUtils = require('./../utils/error-utils');
var sessionManager = require('./../SessionManager');
var events = require('events');
var util = require('util');
var Q = require('q');
var _ = require('underscore');
var FSM = require('./StateManager');
var loggerDecorator = require('../utils/log-decorator');

function LiveEntry(entryObject, isNewSession) {
    events.EventEmitter.call(this);
    this.entryObject = entryObject;
    this.entryId = entryObject.entryId;
    this.masterManifestGenerator = new masterManifestCtor(entryObject, isNewSession);
    this.manifestTimeWindow = entryObject.manifestTimeWindow;
    this.manifestMaxChunkCount = entryObject.maxChunkCount;
    this.flavorsDownloaders = [];
    this.FSM = FSM(entryObject);
    this.playbackRaised = false;
    this.lastLiveTimestamp = new Date().getTime();
    //this.logger = loggerDecorator(logger, "[" + that.entryId + "]");
}
util.inherits(LiveEntry, events.EventEmitter);

function onNewTsFilesDownloaded(numOfTsFilesDownloaded) {
    // Once entry has the configured minChunksForPlayback call registerMediaServer->Playing every time chunklist is
    // updated. On the first time change its state and raise isLive for player, from there on update database
    // that entry is still alive every 60 seconds.
    if (!this.playbackRaised) {
        if (numOfTsFilesDownloaded >= config.get('minChunksForPlayback')) {
            logger.info("Entry %s contains %s chunks, report PLAYING to server", this.entryId, config.get('minChunksForPlayback'));
            this.playbackRaised = true;
            this.FSM.play();
        }
    }
    else {
        logger.info("Entry %s already playing, report UPDATE to server every minute", this.entryId);
        this.FSM.update();
    }

}

function onFlavorDownloaderStopped(flavor) {
    var that = this;
    logger.info("Flavor %s stopped - checking if any flavor is still active for entry %s", flavor, that.entryId);
    if (_.every(that.flavorsDownloaders, function(f) { return f.runStatus === 'stopped'; })) {
        // If all flavorDownloaders stopped - report
        logger.info("No remaining active flavor downloaders for entry %s - shutting it down", that.entryId);
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
            logger.info("EntryId %s - creating flavor downloader: %s", that.entryId, flavor.name);
            return new flavorDownloader(flavor, that.entryObject, destPath, playlistName);
        })
        .value();
    //start the download
    var promises = _.map(that.flavorsDownloaders, function(f) {
        logger.info("EntryId %s - starting flavor downloader: %s", that.entryId, f.flavor);
        f.on('newTsFiles', onNewTsFilesDownloaded.bind(that));
        f.on('stopped', onFlavorDownloaderStopped.bind(that));
        return f.start();
    });

    return Q.allSettled(promises);
}

LiveEntry.prototype.start = function() {
    var that = this;
    // Entry created -> report BROADCASTING to server
    logger.info("Entry %s started streaming, report BROADCASTING to server and register in database", that.entryId);
    var startPromise = that.FSM.start();
        return startPromise[1]
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
                    throw new Error("Failed to start entry downloader for entry: %s. All flavor downloaders failed", that.entryId);
                }
                if (errs.numErrors > 0) {
                    // Report an error (but proceed) if only some flavor downloaders could not be started
                    logger.error("Failed  to start flavor downloaders for some of the flavors:\n", errs.err);
                }
            });
};

LiveEntry.prototype.stop = function() {
    var that = this;
    // Check if entry had a 15 seconds grace period before shutting down
    if (sessionManager.lastTimestampSessionModification(that.lastLiveTimestamp, false, that.entryId)) {
        logger.info("Stopping live entry: %s", that.entryId);
        // Wait for flavorDownloaders to stop
        var stopPromises = _.map(that.flavorsDownloaders, function(flavor) {
            return flavor.stop();
        });
        return Q.all(stopPromises)
            .then(function() {
                logger.info("Successfully stopped entry : %s, report unregister to server", that.entryId);
                var stopPromise = that.FSM.stop();
                return stopPromise[1].then(function() {
                    that.playbackRaised = false;
                    return Q.resolve(true);
                });
            })
            .catch(function(err) {
                logger.error("Failed stopping flavor downloader for entry id: %s, error: %s\n%s", that.entryId, err, err.stack);
                throw err;
            });
    }
    else {
        return Q.resolve(false);
    }
};

LiveEntry.prototype.updateLiveTimestamp = function() {
    this.lastLiveTimestamp = new Date();
};

module.exports = LiveEntry;