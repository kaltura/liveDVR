/**
 * Created by elad.benedict on 8/26/2015.
 */

var backendClient = require('./BackendClientFactory').getBackendClient();
var _ = require('underscore');
var entryDownloaderCtor = require('./EntryDownloader');
var logger = require('./logger/logger');
var Q = require('Q');
var config = require('./Configuration');
var sessionManager = require('./SessionManager');
var qio = require('q-io/fs');
var persistenceFormat = require('./PersistenceFormat');
var mkdirp = require('mkdirp');

module.exports = (function(){

    var Worker = function Worker(){
        this.hostname = config.get('mediaServer').hostname;
        this.port = config.get('mediaServer').port;
        this.applicationName = config.get('mediaServer').applicationName;
        this._intervalObj = null; // Created by setInterval
        this.handledEntries = {};
        this.pollingInterval = config.get('backendPollingInterval');
        this.shouldRun = true;
    };

    var createEntryDownloader = function(e){
        var that = this;
        sessionManager.isNewSession(e.entryId)
            .then(function(isNewSession) {
                if (isNewSession) {
                    // 1. Remove folder if exists
                    var entryFolderPath = persistenceFormat.getEntryFullPath(e.entryId);
                    return qio.isDirectory(entryFolderPath).then(function (res) {
                        if (res) {
                            return qio.removeTree(entryFolderPath);
                        }
                    }).then(function () {
                        // 2. Create (clean) folder
                        var mkdirFunc = Q.denodeify(mkdirp);
                        return mkdirFunc(entryFolderPath);
                    });
                }
            })
            .then(function() {
                var entryDownloader = new entryDownloaderCtor(e.entryId, that.hostname, that.port, that.applicationName, e.dvrWindow);
                return entryDownloader.start().then(function(){
                    return entryDownloader;
                });
            })
            .then(function(entryDownloader){
                that.handledEntries[e.entryId] = entryDownloader;
            })
            .catch(function(err) {
                logger.error('Error starting entry downloader for ' + e.entryId, err);
            });
    };

    var handleEntries = function(){
        var that = this;
        return backendClient.getLiveEntriesForMediaServer().then(function(liveEntries){
            if (that.shouldRun) {
                var unhandledLiveEntries = _.filter(liveEntries, function(e) {
                    var entryIds = Object.keys(that.handledEntries);
                    return !_.contains(entryIds, e.entryId);
                });
                _.forEach(unhandledLiveEntries, function (e) {
                    logger.info("Entry " + e.entryId + " started playing - creating an entry downloader for it");
                    createEntryDownloader.call(that, e);
                });

                var noLongerLiveEntries = _.difference(Object.keys(that.handledEntries), _.map(liveEntries, function(e) {return e.entryId;}));
                _.forEach(noLongerLiveEntries, function (noLongerLiveEntry) {
                    var entryDownloader = that.handledEntries[noLongerLiveEntry];
                    entryDownloader.stop().catch(function(err){
                        logger.error('Error stopping entry downloader for ' + noLongerLiveEntry, err);
                    });
                    delete that.handledEntries[noLongerLiveEntry];
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
            return handleEntries.call(that);
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