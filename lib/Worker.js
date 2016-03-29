/**
 * Created by elad.benedict on 8/26/2015.
 */

var entryDownloaderCtor = require('./EntryDownloader');
var flavorDownloaderCtor = require('./FlavorDownloader');
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

                logger.info("Exception returning response to monitor server",e, e.stack);
            }
        }).listen(4380+prefix);
    };

    var createEntryDownloader = function(e){
        var that = this;
        var cleanupEntryFolderForNewSession = function(){
            var entryFolderPath = persistenceFormat.getEntryFullPath(e.entryId);
            return fsUtils.cleanFolder(entryFolderPath, e.entryId);
        };
        var onEntryDownloaderStopped = function(entryId){
            var that = this;
            logger.info("Entry " + entryId + " notified it stopped - removing it from the list of handled entries");
            delete that.handledEntries[entryId];
        };

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
                    var entryDownloader = new entryDownloaderCtor(e, isNewSession);

                    return entryDownloader.start().then(function(){
                        return entryDownloader;
                    });
            })
            .then(function(entryDownloader) {
                if (that.handledEntries[e.entryId] !== 'cancelPending') {
                    logger.debug("adding entry " + e.entryId + " to list of handled entries");
                    that.handledEntries[e.entryId] = entryDownloader;
                    entryDownloader.on('stopped', onEntryDownloaderStopped.bind(that));
                    logger.debug("removing entry " + e.entryId + " from endlistAppender");
                    that.endListAppender.removeEntry(e.entryId) // Entry is alive
                        .catch(function(err){
                            logger.error('Error adding entry to endlist appender processing - ' + err.message);
                        });
                }
                else {
                    logger.info("Entry downloader creation aborted for entry " + e.entryId);
                    entryDownloader.stop().catch(function(err){
                        logger.error('error aborting entry downloader creation - ' + err);
                    }).finally(function(){
                        logger.info("Removing entry downloader for entry " + e.entryId + " from handled entries list");
                        delete that.handledEntries[e.entryId];
                    });
                }
            });
    };

    var processAlreadyLiveEntries = function(currentlyLiveEntries) {
        var that = this;
        var alreadyLiveEntries = _.filter(currentlyLiveEntries, function (e) {
            var entryIds = Object.keys(that.handledEntries);
            return _.contains(entryIds, e.entryId);
        });
        _.forEach(alreadyLiveEntries, function (e) {
            if (that.handledEntries[e.entryId] !== 'pending') {
                that.handledEntries[e.entryId].updatePlaylist();
            }
            // Refresh timestamp
            sessionManager.refreshSessionTimestamp(e.entryId).catch(function (err) {
                logger.error('Error refreshing timestamp for entry ' + e.entryId + " err: " + err + " stack: " + err.stack);
            });
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
            // downloader won't be created for it until the previous one's creation has completed
            if (!that.handledEntries[e.entryId] && (!that.phantomEntries[e.entryId] || that.phantomEntries[e.entryId] < maxEntryInitializationTryCount))
            {
                that.handledEntries[e.entryId] = 'pending';
                logger.info("Entry " + e.entryId + " started playing - creating an entry downloader for it");
                createEntryDownloader.call(that, e).then(
                    function() {
                        // If the entry downloader creation is successful remove it from the list of phantom entries
                        if (that.phantomEntries[e.entryId])
                        {
                            logger.info('Successfully created entry downloader for entry ' + e.entryId + ' removing it from the phantom list');
                            delete that.phantomEntries[e.entryId];
                        }
                    },
                    function(err) {
                        logger.error('Error starting entry downloader for ' + e.entryId + ': ' + err.message + " " + err.stack);
                        // If the entry downloader creation was unsuccessful, allow it to be created again
                        // in the next round
                        var entryDownloaderCreationTryCount = that.phantomEntries[e.entryId] || 0;
                        if (!that.phantomEntries[e.entryId])
                        {
                            logger.info('Adding entry ' + e.entryId + ' to the phantom entries list');
                        }

                        that.phantomEntries[e.entryId] = entryDownloaderCreationTryCount + 1;
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
            var entryDownloader = that.handledEntries[noLongerLiveEntry];
            if (entryDownloader === 'pending')
            {
                logger.info("Entry " + noLongerLiveEntry + " status changed to not live before an entry downloader could be created for it. Entry downloader creation cancellation pending");
                that.handledEntries[noLongerLiveEntry] = 'cancelPending';
            }
            else if (entryDownloader === 'cancelPending')
            {
                logger.info("Entry downloader stop requested for entry " + noLongerLiveEntry + " when creation cancellation for it is pending");
            }
            else {
                Q.fcall(function(){
                    logger.info("Entry " + noLongerLiveEntry + " is no longer live - calling entryDownloader.stop");
                    return entryDownloader.stop();
                })
                .catch(function(err){
                    logger.error('Error stopping entry downloader for ' + noLongerLiveEntry + " err: " + err);
                })
                .then(function(){
                    logger.info("Entry " + noLongerLiveEntry + " is no longer live - removing it from the list of handled entries");
                    delete that.handledEntries[noLongerLiveEntry];
                    logger.debug("adding entry " + noLongerLiveEntry + " to endlistAppender");
                    that.endListAppender.addEntry(noLongerLiveEntry) // Indicate entry is down and should (later) have end-list appended
                        .catch(function(err){
                            logger.error('Error adding entry to endlist appender processing - ' + err.message);
                        });
                })
                .then(function() {
                    logger.info("Entry " + noLongerLiveEntry + " is no longer live, removing master manifest");
                    var playlistPath = path.join(persistenceFormat.getEntryFullPath(noLongerLiveEntry), persistenceFormat.getMasterManifestName());
                    qio.remove(playlistPath);
                })
                .done();
            }
        });
    };

    var handleEntries = function(){
        var that = this;
        return  adapter.getLiveEntries()
            .then(function(liveEntries) {
                var relevantEntries =  _.filter(liveEntries, function(e){
                    return e.entryId.indexOf(that.prefix) === 0;
                })
                logger.debug('relevant live entries: ' + JSON.stringify(relevantEntries));
                return relevantEntries;
            }).then(function(liveEntries){
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

