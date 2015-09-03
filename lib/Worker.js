/**
 * Created by elad.benedict on 8/26/2015.
 */

var backendClient = require('./BackendClientFactory').getBackendClient();
var _ = require('underscore');
var entryDownloaderCtor = require('./EntryDownloader');
var logger = require('./logger/logger');
var Q = require('Q');
var config = require('./Configuration');

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

    var handleEntries = function(){
        var that = this;
        return backendClient.getLiveEntriesForMediaServer().then(function(liveEntries){
            if (that.shouldRun) {
                var unhandledLiveEntries = _.difference(liveEntries, Object.keys(that.handledEntries));
                _.forEach(unhandledLiveEntries, function (newLiveEntry) {
                    var entryDownloader = new entryDownloaderCtor(newLiveEntry, that.hostname, that.port, that.applicationName);
                    that.handledEntries[newLiveEntry] = entryDownloader;
                    entryDownloader.start();
                });

                var noLongerLiveEntries = _.difference(Object.keys(that.handledEntries), liveEntries);
                _.forEach(noLongerLiveEntries, function (noLongerLiveEntry) {
                    var entryDownloader = that.handledEntries[noLongerLiveEntry];
                    entryDownloader.stop();
                });
            }
        }).catch(function(err){
            logger.error('Unhandled exception: ' + err + err.stack);
        });
    };

    Worker.prototype.start = function() {
        handleEntries.call(this);
        this._intervalObj = setInterval(handleEntries.bind(this), this.pollingInterval);
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