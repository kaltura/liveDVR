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

module.exports = (function(){

    var Worker = function Worker(){
        this.hostname = config.get('mediaServer').hostname;
        this.port = config.get('mediaServer').port;
        this.applicationName = config.get('mediaServer').applicationName;
        this._intervalObj = null; // Created by setInterval
        this.handledEntries = {};
        this.pollingInterval = config.get('backendPollingInterval');
        this.shouldRun = true;
        this.endListAppender = new endListAppenderCtor();
    };

    var createEntryDownloader = function(e){
        var that = this;
        return sessionManager.isNewSession(e.entryId)
            .then(function(isNewSession) {
                if (isNewSession) {
                    // 1. Remove folder if exists
                    var entryFolderPath = persistenceFormat.getEntryFullPath(e.entryId);
                    return qio.isDirectory(entryFolderPath).then(function (res) {
                        if (res) {
                            logger.debug("removing directory " + entryFolderPath);
                            return qio.removeTree(entryFolderPath);
                        }
                    }).then(function () {
                        // 2. Create (clean) folder
                        logger.debug("removed directory " + entryFolderPath + " - recreating it");
                        var mkdirFunc = Q.denodeify(mkdirp);
                        return mkdirFunc(entryFolderPath);
                    });
                }
            })
            .then(function(){
                // 3. Create or update timestamp file indicating session start
                return sessionManager.refreshSessionTimestamp(e.entryId);
            })
            .then(function() {
                var entryDownloader = new entryDownloaderCtor(e.entryId, that.hostname, that.port, that.applicationName, e.dvrWindow);
                return entryDownloader.start().then(function(){
                    return entryDownloader;
                });
            })
            .then(function(entryDownloader){
                logger.debug("adding entry " + e.entryId + " to list of handled entries");
                that.handledEntries[e.entryId] = entryDownloader;
                logger.debug("removing entry " + e.entryId + " from endlistAppender");
                that.endListAppender.removeEntry(e.entryId); // Entry is alive
            });
    };

    var handleEntries = function(){
        var that = this;
        return backendClient.getLiveEntriesForMediaServer().then(function(liveEntries){
            if (that.shouldRun) {

                var alreadyLiveEntries = _.filter(liveEntries, function(e) {
                    var entryIds = Object.keys(that.handledEntries);
                    return _.contains(entryIds, e.entryId);
                });

                _.forEach(alreadyLiveEntries, function (e) {
                    // Refresh timestamp
                    sessionManager.refreshSessionTimestamp(e.entryId).catch(function(err){
                        logger.error('Error refreshing timestamp for entry ' + e.entryId  + " err: " + err + " stack: " + err.stack);
                    });
                });

                var unhandledLiveEntries = _.filter(liveEntries, function(e) {
                    var entryIds = Object.keys(that.handledEntries);
                    logger.debug("handled live entries: " + JSON.stringify(entryIds));
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
                                logger.error('Error starting entry downloader for ' + e.entryId + ': ' + err + " " + err.stack);
                                // If the entry downloader creation was unsuccessful, allow it to be created again
                                // in the next round
                                delete that.handledEntries[e.entryId];
                            });
                    }
                });

                var noLongerLiveEntries = _.difference(Object.keys(that.handledEntries), _.map(liveEntries, function(e) {return e.entryId;}));
                _.forEach(noLongerLiveEntries, function (noLongerLiveEntry) {
                    var entryDownloader = that.handledEntries[noLongerLiveEntry];
                    entryDownloader.stop().catch(function(err){
                        logger.error('Error stopping entry downloader for ' + noLongerLiveEntry + " err: " + err + " stack: " + err.stack);
                    });
                    delete that.handledEntries[noLongerLiveEntry];
                    that.endListAppender.addEntry(noLongerLiveEntry); // Indicate entry is down and should (later) have end-list appended
                });
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

