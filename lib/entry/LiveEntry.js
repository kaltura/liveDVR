/**
 * Created by gadyaari on 24/02/2016.
 */

var PlaylistGenerator = require('./../playlistGenerator/PlaylistGenerator');
var flavorDownloader = require('./FlavorDownloader');
var persistenceFormat = require('./../../common/PersistenceFormat');
var config = require('../../common/Configuration');
var loggerModule = require('../../common/logger');
var ErrorUtils = require('./../utils/error-utils');
var FSM = require('./StateManager');
var events = require('events');
var util = require('util');
var Q = require('q');
var _ = require('underscore');
var KalturaLiveStatus = require('../kaltura-client-lib/KalturaTypes').KalturaEntryServerNodeStatus;

function LiveEntry(entryObject, isNewSession) {
    events.EventEmitter.call(this);
    this.entryObject = entryObject;
    this.entryId = entryObject.entryId;
    this.recovered = entryObject.liveStatus && entryObject.liveStatus === KalturaLiveStatus.PLAYABLE;
    this.logger = loggerModule.getLogger("LiveEntry", "[" + this.entryId + "] ");
    this.playlistGenerator = new PlaylistGenerator(entryObject, isNewSession,this.logger);
    this.FSM = FSM(entryObject);
    this.flavorsDownloaders = [];
}
util.inherits(LiveEntry, events.EventEmitter);

function onNewTsFilesDownloaded(flavorObj, numOfTsFilesDownloaded) {
    // Once entry has the configured minChunksForPlayback call registerMediaServer->Playing every time chunklist is
    // updated. On the first time change its state and raise isLive for player, from there on update database
    // that entry is still alive every 60 seconds.
    if (flavorObj === this.flavorsDownloaders[0]) {
        this.cumulativeChunk = this.cumulativeChunk + numOfTsFilesDownloaded;
        this.logger.debug("Number of new chunks added: %d, cumulative new chunks: %d" , numOfTsFilesDownloaded ,this.cumulativeChunk);
        if (this.recovered) {
            this.logger.info("Entry recovered after process crashed, change state to PLAYING");
            this.recovered = false;
            this.FSM.play();
        }
        else if (this.cumulativeChunk >= config.get('minChunksForPlayback') && this.FSM.current !== "suspending") {
            this.logger.info("Min configured chunks: %d, report PLAYING to server", config.get('minChunksForPlayback'));
            this.FSM.play();
        }
    }
}

function onFlavorDownloaderStopped(flavor) {
    var that = this;
    that.logger.info("Flavor %s stopped - checking if any flavor is still active", flavor);
    if (_.every(that.flavorsDownloaders, function(f) { return f.runStatus === 'stopped'; })) {
        // If all flavorDownloaders stopped - report
        that.logger.info("No remaining active flavor downloaders");
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
            that.logger.info("Creating flavor downloader: %s", flavor.name);
            return new flavorDownloader(flavor, that.entryObject, destPath, that.playlistGenerator);
        })
        .value();
    //start the download
    var promises = _.map(that.flavorsDownloaders, function(f) {
        f.on('newTsFiles', onNewTsFilesDownloaded.bind(that));
        f.on('stopped', onFlavorDownloaderStopped.bind(that));
        return f.start();
    });

    return Q.allSettled(promises);
}

LiveEntry.prototype.start = function() {
    var that = this;
    this.cumulativeChunk = 0;
    // Entry created -> report BROADCASTING to server
    that.logger.info("Entry started streaming, report BROADCASTING to server and register in database");
    var startPromise = that.FSM.broadcast();
    return startPromise
        .then(function() {
             // Create master manifest and save it on disk
             return that.playlistGenerator.createManifest();
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
                that.logger.error("Failed  to start flavor downloaders for some of the flavors:\n", errs.err);
            }
        });
};

LiveEntry.prototype.stop = function() {
    var that = this;

    if (that.FSM.current === 'stopped') {
        that.logger.debug("Stop is pending, ignoring request");
        return;
    }
    // Check if entry had a 15 seconds grace period before shutting down
    var suspendPromise = that.FSM.suspend();
    return suspendPromise
        .then(function() {
            // Wait for all flavorDownloaders to stop
            that.suspended = true;
            var flavorsPromises = _.map(that.flavorsDownloaders, function (flavor) {
                return flavor.stop();
            });
            // Regardless of the stopping result worker must remove entry from handledEntries list
            return Q.all(flavorsPromises)
                .then(function() {
                    var stopPromise = that.FSM.stop()
                    return stopPromise
                        .catch(function() {
                            return Q.resolve();
                        });
                })
                .catch(function(err) {
                    that.logger.error("Error stopping entry: %s", err.message);
                    return Q.resolve();
                });
        })
        .catch(function() {
            return Q.reject();
        });
};

LiveEntry.prototype.updateLiveTimestamp = function() {
    this.FSM.update();
};

module.exports = LiveEntry;
