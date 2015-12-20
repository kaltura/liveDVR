/**
 * Created by elad.benedict on 8/26/2015.
 */

var backendClient = require('./BackendClientFactory').getBackendClient();
var _ = require('underscore');
var entryDownloaderCtor = require('./EntryDownloader');
var logger = require('./logger/logger')(module);
var Q = require('q');
var config = require('./../common/Configuration');
var sessionManager = require('./SessionManager');
var qio = require('q-io/fs');
var persistenceFormat = require('./../common/PersistenceFormat');
var mkdirp = require('mkdirp');
var endListAppenderCtor = require('./EndListAppender');
var path = require('path');

module.exports = (function(){

    var Worker = function Worker(){
        this.hostname = config.get('mediaServer').hostname;
        this.port = config.get('mediaServer').port;
        this.applicationName = config.get('mediaServer').applicationName;
        this._intervalObj = null; // Created by setInterval
        this.handledEntries = {};
        this.pollingInterval = config.get('backendPollingInterval');
        this.maxChunkCount = config.get('maxChunkCount');
        this.shouldRun = true;
        this.endListAppender = new endListAppenderCtor();
    };

    var createEntryDownloader = function(e){
        var that = this;

        var cleanupEntryFolderForNewSession = function(){
            // 1. Remove folder if exists
            var entryFolderPath = persistenceFormat.getEntryFullPath(e.entryId);
            return qio.isDirectory(entryFolderPath).then(function (res) {
                if (res) {
                    logger.debug("removing directory " + entryFolderPath);
                    var renamedFolderName = path.join(config.get("oldContentFolderPath"), persistenceFormat.getEntryRelativePath(e.entryId) + '_' + (new Date()).getTime().toString());
                    return qio.rename(entryFolderPath, renamedFolderName);
                }
            }).then(function () {
                // 2. Create (clean) folder
                logger.debug("removed directory " + entryFolderPath + " - recreating it");
                var mkdirFunc = Q.denodeify(mkdirp);
                return mkdirFunc(entryFolderPath);
            });
        };

        return sessionManager.isNewSession(e.entryId)
            .then(function(isNewSession) {
                if (isNewSession) {
                    return cleanupEntryFolderForNewSession();
                }
            })
            .then(function(){
                return sessionManager.refreshSessionTimestamp(e.entryId);
            })
            .then(function() {
                var entryDownloader = new entryDownloaderCtor(e.entryId, that.hostname, that.port, that.applicationName, e.dvrWindow, e.maxChunkCount);
                return entryDownloader.start().then(function(){
                    return entryDownloader;
                });
            })
            .then(function(entryDownloader) {
                logger.debug("adding entry " + e.entryId + " to list of handled entries");
                that.handledEntries[e.entryId] = entryDownloader;
                logger.debug("removing entry " + e.entryId + " from endlistAppender");
                that.endListAppender.removeEntry(e.entryId) // Entry is alive
                    .catch(function(err){
                        logger.error('Error adding entry to endlist appender processing - ' + err.message);
                    });
            });
    };

    var processAlreadyLiveEntries = function(currentlyLiveEntries) {
        var that = this;

        var alreadyLiveEntries = _.filter(currentlyLiveEntries, function (e) {
            var entryIds = Object.keys(that.handledEntries);
            return _.contains(entryIds, e.entryId);
        });

        _.forEach(alreadyLiveEntries, function (e) {
            // Refresh timestamp
            sessionManager.refreshSessionTimestamp(e.entryId).catch(function (err) {
                logger.error('Error refreshing timestamp for entry ' + e.entryId + " err: " + err + " stack: " + err.stack);
            });
        });
    };

    var processUnhandledLiveEntries = function(currentlyLiveEntries){
        var that = this;
        var unhandledLiveEntries = _.filter(currentlyLiveEntries, function(e) {
            var entryIds = Object.keys(that.handledEntries);
            return !_.contains(entryIds, e.entryId);
        });

        _.forEach(unhandledLiveEntries, function (e) {

            // Mark that this entry is already being handled (by the "pending" indicator) so that another
            // downloader won't be created for it until the previous one's creation has completed
            if (!that.handledEntries[e.entryId])
            {
                that.handledEntries[e.entryId] = 'pending';
                logger.info("Entry " + e.entryId + " started playing - creating an entry downloader for it");
                createEntryDownloader.call(that, e).catch(function(err) {
                    logger.error('Error starting entry downloader for ' + e.entryId + ': ' + err.message + " " + err.stack);
                    // If the entry downloader creation was unsuccessful, allow it to be created again
                    // in the next round
                    delete that.handledEntries[e.entryId];
                });
            }
        });
    };

    var processNoLongerLiveEntries = function(currentlyLiveEntries){
        var that = this;
        var noLongerLiveEntries = _.difference(Object.keys(that.handledEntries), _.map(currentlyLiveEntries, function(e) {return e.entryId;}));
        _.forEach(noLongerLiveEntries, function (noLongerLiveEntry) {
            var entryDownloader = that.handledEntries[noLongerLiveEntry];
            Q.fcall(function(){
                return entryDownloader.stop();
            }).catch(function(err){
                logger.error('Error stopping entry downloader for ' + noLongerLiveEntry + " err: " + err + " stack: " + err.stack);
            });
            delete that.handledEntries[noLongerLiveEntry];
            logger.debug("adding entry " + noLongerLiveEntry + " to endlistAppender");
            that.endListAppender.addEntry(noLongerLiveEntry) // Indicate entry is down and should (later) have end-list appended
                .catch(function(err){
                    logger.error('Error adding entry to endlist appender processing - ' + err.message);
                });
        });
    };

    var handleEntries = function(){
        var that = this;
        return backendClient.getLiveEntriesForMediaServer().then(function(liveEntries){
            if (that.shouldRun) {

                var entryIds = Object.keys(that.handledEntries);
                logger.debug("handled live entries: " + JSON.stringify(entryIds));

                processAlreadyLiveEntries.call(that, liveEntries);
                processUnhandledLiveEntries.call(that, liveEntries);
                processNoLongerLiveEntries.call(that, liveEntries);
            }
        }).catch(function(err){
            logger.error('Unhandled exception: ' + err + err.stack);
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

    return Worker;
})();

