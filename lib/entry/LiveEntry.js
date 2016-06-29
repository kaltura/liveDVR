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
var backendClient = require('../BackendClientFactory.js').getBackendClient();
var KalturaLiveStatus = require('../kaltura-client-lib/KalturaTypes').KalturaEntryServerNodeStatus;

function LiveEntry(entryObject, isNewSession) {
    events.EventEmitter.call(this);
    this.entryObject = entryObject;
    this.entryId = entryObject.entryId;
    this.recovered = entryObject.liveStatus && entryObject.liveStatus === KalturaLiveStatus.PLAYABLE;
    this.logger = loggerModule.getLogger("LiveEntry", "[" + this.entryId + "] ");
    this.playlistGenerator = new PlaylistGenerator(entryObject, isNewSession);
    this.FSM = FSM(entryObject);
    this.flavorsDownloaders = [];
    this.cumulativeDurationInSec = 0;
    this.entryServerNodeId = entryObject.entryServerNodeId;
    this.entryServerType = parseInt(entryObject.serverType);
}
util.inherits(LiveEntry, events.EventEmitter);

function onNewTsFilesDownloaded(flavorObj, streamDurationAdditionInSec) {
    // Once entry has the configured minChunksForPlayback call registerMediaServer->Playing every time chunklist is
    // updated. On the first time change its state and raise isLive for player, from there on update database
    // that entry is still alive every 60 seconds.
    if (flavorObj === this.flavorsDownloaders[0]) {
        this.cumulativeDurationInSec = this.cumulativeDurationInSec + streamDurationAdditionInSec;
        this.logger.debug("New files' duration: [%d sec]; Total stream duration: [%d sec]" , streamDurationAdditionInSec, this.cumulativeDurationInSec);
        if (this.recovered) {
            this.logger.info("Entry recovered after process crashed, change state to PLAYING");
            this.recovered = false;
            this.FSM.play();
        }
        else if (this.cumulativeDurationInSec >= config.get('minDurationForPlaybackInSec') && this.FSM.current !== "suspending") {
            this.logger.info("Report PLAYING to server");
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
        f.on('newStreamFiles', onNewTsFilesDownloaded.bind(that));
        f.on('stopped', onFlavorDownloaderStopped.bind(that));
        return f.start();
    });

    return Q.allSettled(promises);
}

function updateStreamInfo(flavorsObjArray) {
    var that = this;
    return backendClient.updateStreamInfo(this.entryId, this.entryServerNodeId, flavorsObjArray)
        .then(function() {
            that.logger.debug("[%s] Flavors updated in DB for entry server node [%s]", that.entryId, that.entryServerNodeId);
        });
}

function checkForErrors(results) {
    var that = this;
    var errs = ErrorUtils.aggregateErrors(results);
    if (errs.numErrors === results.length) {
        // Fail if no flavor downloader could be started
        throw new Error("Failed to start entry downloader for entry: %s. All flavor downloaders failed", that.entryId);
    }
    if (errs.numErrors > 0) {
        // Report an error (but proceed) if only some flavor downloaders could not be started
        that.logger.error("Failed  to start flavor downloaders for some of the flavors: %s ", ErrorUtils.error2string(errs.err));
    }
}

function getEntryServerNodeId() {
    var that = this;
    var deferred = Q.defer();

    that.entryServerNodeId ? deferred.resolve()
        : backendClient.getLiveEntryServerNodes(that.entryId)
        .then(function(liveEntryServerNodes) {
            _.each(liveEntryServerNodes, function(liveEntryServerNode) {
                if (liveEntryServerNode.serverType === that.entryServerType) {
                    that.entryServerNodeId = liveEntryServerNode.id;
                    return deferred.resolve();
                }

                return deferred.reject();
            });
        })
        .catch(function() {
            that.entryServerNodeId = 0;
            return deferred.reject();
        });

    return deferred.promise;
}

LiveEntry.prototype.start = function() {
    var that = this;
    // Entry created -> report BROADCASTING to server
    that.logger.info("Entry started streaming, report BROADCASTING to server and register in database");
    var startPromise = that.FSM.broadcast();
    return startPromise
        .then(function() {
             // Create master manifest and save it on disk
             return that.playlistGenerator.createManifest();
        })
        .then(function(flavorsObjArray) {
            getEntryServerNodeId.call(that)
                .then(function() {
                    updateStreamInfo.call(that, flavorsObjArray);
                })
                .catch(function(){
                    that.logger.warn("entryServerNodeId not found, stream info will not updated");
                });

            return flavorsObjArray;
        })
        .then(function(result) {
             // Create a flavorDownloader for each of the flavors currently streaming
             return createFlavorDownloaders.call(that, result);
        })
        .then(function(results) {
            checkForErrors.call(that, results);
        });
};

LiveEntry.prototype.stop = function() {
    var that = this;

    if (that.FSM.current === 'stopped') {
        that.logger.debug("Stop is pending, ignoring request");
        return Q.reject("");
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
                    var stopPromise = that.FSM.stop();
                    return stopPromise
                        .catch(function(err) {
                            that.logger.error("Error calling FSM.stop: %s" ,ErrorUtils.error2string(err));
                            return Q.resolve();
                        });
                })
                .catch(function(err) {
                    that.logger.error("Error stopping entry: %s" ,ErrorUtils.error2string(err));
                    return Q.resolve();
                });
        })
        .catch(function(err) {
            //TODO: we need this line? -> Ron
            return Q.reject(err);
        });
};

LiveEntry.prototype.updateLiveTimestamp = function() {
    this.FSM.update();
};

module.exports = LiveEntry;
