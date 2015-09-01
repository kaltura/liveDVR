/**
 * Created by elad.benedict on 8/26/2015.
 */

var backendClient = require('./BackendClientFactory').getBackendClient();
var _ = require('underscore');
var entryDownloaderCtor = require('./EntryDownloader');
var logger = require('./logger/logger');
var util = require('util');
var events = require('events');
var Q = require('Q');

module.exports = function(){

    var Worker = function Worker(){
        events.EventEmitter.call(this);
        this.config = require('./Configuration');
        this.hostname = this.config.get('mediaServer').hostname;
        this.port = this.config.get('mediaServer').port;
        this.applicationName = this.config.get('mediaServer').applicationName;
        this.interval;
        this._handling = false;
        this.handledEntries = {};
        this.pollingInterval = this.config.get('backendPollingInterval');
    }

    util.inherits(Worker, events.EventEmitter);

    Worker.prototype._handleEntries = function(){
        var that = this;
        this._handling = true;
        return backendClient.getLiveEntriesForMediaServer().then(function(liveEntries){

                var unhandledLiveEntries = _.difference(liveEntries, Object.keys(that.handledEntries));
                _.forEach(unhandledLiveEntries, function (newLiveEntry) {
                    try {
                        var entryDownloader = new entryDownloaderCtor(newLiveEntry, that.hostname, that.port, that.applicationName);
                        that.handledEntries[newLiveEntry] = entryDownloader;
                        entryDownloader.start();
                    }
                    catch (err) {
                        logger.error('failed to start entry downloader for entry: ' + newLiveEntry + "\n" + err + "\n" + err.stack);
                    }
                });

                var noLongerLiveEntries = _.difference(Object.keys(that.handledEntries), liveEntries);
                _.forEach(noLongerLiveEntries, function (noLongerLiveEntry) {
                    var entryDownloader = that.handledEntries[noLongerLiveEntry];
                    entryDownloader.stop();
                });
        }).catch(function(err){
            logger.error('Unhandled exception: ' + err + err.stack);
        }).finally(function(){
            that._handling = false;
            if (!that.interval){
                this.emit("workerDone");
            }
        });
    };

    Worker.prototype.start = function() {
        this._handleEntries();
        this.interval = setInterval(this._handleEntries.bind(this), this.pollingInterval);
    };

    Worker.prototype.stop = function() {
        console.log("Stopping Worker")
        var that = this;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            var stopPromises = _.map(Object.keys(this.handledEntries), function(entryId){
                return that.handledEntries[entryId].stop();
            })
            return Q.all(stopPromises);
        }
        //if (!this._handling) {
        //    this.emit("workerDone");
        //}
    }

    return Worker;
}();