/**
 * Created by elad.benedict on 8/26/2015.
 */

var liveEntryCtor = require('./entry/LiveEntry');
var flavorDownloaderCtor = require('./entry/FlavorDownloader');
var logger = require('./logger/logger')(module);
var fsUtils = require('./utils/fs-utils');
var config = require('./../common/Configuration');
var sessionManager = require('./SessionManager');
var persistenceFormat = require('./../common/PersistenceFormat');
var endListAppenderCtor = require('./manifest/EndListAppender');
var _ = require('underscore');
var Q = require('q');
var qio = require('q-io/fs');
var path = require('path');
var util = require('util');
var adapter=require('./Adapters/AdapterFactory.js').getAdapter();
var http = require("http");

module.exports = (function(){

    var Worker = function Worker(prefix){
        var self=this;
        this.prefix = prefix;
        this.hostname = config.get('mediaServer').hostname;
        this.port = config.get('mediaServer').port;
        this.applicationName = config.get('mediaServer').applicationName;
        this._intervalObj = null; // Created by setInterval
        this.handledEntries = {};
        this.phantomEntries = {}; // Entries reported to be live even though they're not really live (e.g. due to API bugs)
        this.pollingInterval = config.get('backendPollingInterval');
        this.maxChunkCount = config.get('maxChunkCount');
        this.shouldRun = true;
        this.endListAppender = new endListAppenderCtor();
        this.monitorServer = http.createServer(function(request, response) {
            try {
                response.writeHead(200, {"Content-Type": "application/json"});
                response.end(JSON.stringify(self.getStat()));
                response.end();
            }catch(e) {

                logger.info("Exception returning response to monitor server", e, e.stack);
            }
        }).listen(4380+prefix);
    };

    var createLiveEntry = function(e){
        var that = this;
        var cleanupEntryFolderForNewSession = function(){
            var entryFolderPath = persistenceFormat.getEntryFullPath(e.entryId);
            return fsUtils.cleanFolder(entryFolderPath, e.entryId);
        };
        /*var onLiveEntryStopped = function(entryId){
            var that = this;
            logger.info("Entry %s notified it stopped - removing it from the list of handled entries", entryId);
            delete that.handledEntries[entryId];
        };*/

        return sessionManager.isNewSession(e.entryId)
            .then(function(isNewSession) {
                if (isNewSession) {
                     return cleanupEntryFolderForNewSession()
                         .then(function() {
                             return isNewSession;
                         });
                }
                return isNewSession;
            })
            .then(function(isNewSession){
                sessionManager.refreshSessionTimestamp(e.entryId);
                return isNewSession;
            })
            .then(function(isNewSession) {
                    var liveEntry = new liveEntryCtor(e, isNewSession);

                    return liveEntry.start().then(function(){
                        return liveEntry;
                    });
            })
            .then(function(entry) {
                if (that.handledEntries[e.entryId] !== 'cancelPending') {
                    logger.debug("adding entry %s to list of handled entries", e.entryId);
                    that.handledEntries[e.entryId] = entry;
                    //entry.on('stopped', onLiveEntryStopped.bind(that));
                    logger.debug("removing entry %s from endlistAppender", e.entryId);
                    that.endListAppender.removeEntry(e.entryId) // Entry is alive
                        .catch(function(err){
                            logger.error("Error adding entry to endlist appender processing - %s", err.message);
                        });
                }
                else {
                    logger.info("Entry creation aborted for entry %s", e.entryId);
                    entry.stop()
                        .catch(function(err) {
                            logger.error("error aborting liveEntry object creation - %s", err);
                        })
                        .finally(function() {
                            logger.info("Removing liveEntry object for entry %s from handled entries list", e.entryId);
                            delete that.handledEntries[e.entryId];
                        });
                }
            });
    };

    var processAlreadyLiveEntries = function(currentlyLiveEntries) {
        var that = this;
        var alreadyLiveEntries = _.filter(currentlyLiveEntries, function(e) {
            var entryIds = Object.keys(that.handledEntries);
            return _.contains(entryIds, e.entryId);
        });
        _.forEach(alreadyLiveEntries, function(e) {
            var entry = that.handledEntries[e.entryId];
            if (entry !== 'pending')
                entry.updateLiveTimestamp();
        });
    };

    var processUnhandledLiveEntries = function(currentlyLiveEntries){
        var maxEntryInitializationTryCount = 1;
        var that = this;
        var unhandledLiveEntries = _.filter(currentlyLiveEntries, function(e) {
            var entryIds = Object.keys(that.handledEntries);
            return !_.contains(entryIds, e.entryId);
        });

        _.forEach(unhandledLiveEntries, function (e) {

            // Mark that this entry is already being handled (by the "pending" indicator) so that another
            // entry won't be created for it until the previous one's creation has completed
            if (!that.handledEntries[e.entryId] && (!that.phantomEntries[e.entryId] || that.phantomEntries[e.entryId] < maxEntryInitializationTryCount))
            {
                that.handledEntries[e.entryId] = 'pending';
                logger.info("Entry " + e.entryId + " started playing - creating an entry object for it");
                createLiveEntry.call(that, e).then(
                    function() {
                        // If the entry object creation is successful remove it from the list of phantom entries
                        if (that.phantomEntries[e.entryId]) {
                            logger.info('Successfully created liveEntry object for entry ' + e.entryId + ' removing it from the phantom list');
                            delete that.phantomEntries[e.entryId];
                        }
                    },
                    function(err) {
                        logger.error('Error starting entry object for ' + e.entryId + ': ' + err.message + " " + err.stack);
                        // If the liveEntry creation was unsuccessful, allow it to be created again
                        // in the next round
                        var liveEntryCreationTryCount = that.phantomEntries[e.entryId] || 0;
                        if (!that.phantomEntries[e.entryId]) {
                            logger.info('Adding entry ' + e.entryId + ' to the phantom entries list');
                        }

                        that.phantomEntries[e.entryId] = liveEntryCreationTryCount + 1;
                        logger.info('Entry ' + e.entryId + ' creation retry count: ' + that.phantomEntries[e.entryId]);
                        logger.info('Removing entry ' + e.entryId + ' from the handled entries list');
                        delete that.handledEntries[e.entryId];
                    }
                );
            }
        });
    };

    var processNoLongerLivePhantomEntries = function(currentlyLiveEntries){
        var that = this;
        var noLongerLivePhantomEntries = _.difference(Object.keys(that.phantomEntries), _.map(currentlyLiveEntries, function(e) {return e.entryId;}));
        _.each(noLongerLivePhantomEntries, function(pe){
            logger.info('Phantom entry ' + pe + ' is no longer "live" - removing it from the phantom entries list');
            delete that.phantomEntries[pe];
        });
    };

    var processNoLongerLiveEntries = function(currentlyLiveEntries){
        var that = this;
        var noLongerLiveEntries = _.difference(Object.keys(that.handledEntries), _.map(currentlyLiveEntries, function(e) {return e.entryId;}));
        _.forEach(noLongerLiveEntries, function (noLongerLiveEntry) {
            var liveEntry = that.handledEntries[noLongerLiveEntry];
            if (liveEntry === 'pending') {
                logger.info("Entry %s status changed to not live before an entry object could be created for it. Entry object creation cancellation pending", noLongerLiveEntry);
                that.handledEntries[noLongerLiveEntry] = 'cancelPending';
            }
            else if (liveEntry === 'cancelPending') {
                logger.info("Entry object stop requested for entry %s when creation cancellation for it is pending", noLongerLiveEntry);
            }
            else {
                // TODO: Stop log writing from being called so many times! -> Gad
                logger.info("Entry %s is no longer live - calling liveEntry.stop", noLongerLiveEntry);
                return liveEntry.stop()
                    .then(function(result) {
                        if (result) {
                            logger.info("Entry %s is no longer live - removing it from the list of handled entries", noLongerLiveEntry);
                            delete that.handledEntries[noLongerLiveEntry];
                            logger.debug("Adding entry %s to endlistAppender", noLongerLiveEntry);
                            return that.endListAppender.addEntry(noLongerLiveEntry) // Indicate entry is down and should (later) have end-list appended
                                .catch(function (error) {
                                    logger.error("Error adding entry to endlistAppender processing - %s", error.message);
                                })
                                .then(function() {
                                    logger.info("Entry %s is no longer live, removing master manifest", noLongerLiveEntry);
                                    var playlistPath = path.join(persistenceFormat.getEntryFullPath(noLongerLiveEntry), persistenceFormat.getMasterManifestName());
                                    qio.remove(playlistPath);
                                });
                        }
                        else {
                            logger.info("Entry %s is not live, but wait grace period before calling stop", noLongerLiveEntry);
                        }
                    })
                    .catch(function(error) {
                        logger.error("Error stopping liveEntry for %s err: %s", noLongerLiveEntry, error);
                    })
                    .done();
            }
        });
    };

    var handleEntries = function(){
        var that = this;
        return adapter.getLiveEntries()
            .then(function(liveEntries){
            if (that.shouldRun) {
                logger.debug("handled live entries: " + util.inspect(that.handledEntries,{depth : 1}));
                var phantomEntryIds = Object.keys(that.phantomEntries);
                logger.debug("phantom live entries: " + JSON.stringify(phantomEntryIds));
                logger.debug("Number of active flavor downloaders: " + Object.keys(flavorDownloaderCtor.activeInstances).length);
                logger.debug("Active flavor downloaders:\n" + util.inspect(flavorDownloaderCtor.activeInstances));

                processAlreadyLiveEntries.call(that, liveEntries);
                processUnhandledLiveEntries.call(that, liveEntries);
                processNoLongerLivePhantomEntries.call(that, liveEntries);
                processNoLongerLiveEntries.call(that, liveEntries);
            }
        }).catch(function(err){
            logger.error('Unhandled exception: ' + err);
        });
    };

    Worker.prototype.start = function() {
        var that = this;
        return Q.fcall(function() {
            that._intervalObj = setInterval(handleEntries.bind(that), that.pollingInterval);
            that.endListAppender.init().then(function(){
                return handleEntries.call(that);
            });
        });
    };

    Worker.prototype.stop = function() {
        var that = this;
        if (this._intervalObj) {
            clearInterval(this._intervalObj);
            this._intervalObj = null;
            this.shouldRun = false;
            var stopPromises = _.map(Object.keys(this.handledEntries), function(entryId){
                return that.handledEntries[entryId].stop();
            });
            return Q.all(stopPromises);
        }
    };
    Worker.prototype.getStat=function() {

        return {
            "handledEntries": this.handledEntries,
            "phantomEntries": this.phantomEntries
        }
    }

    return Worker;
})();

