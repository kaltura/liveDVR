/**
 * Created by gadyaari on 24/02/2016.
 */

var entryDownloaderCtor = require('./EntryDownloader');
var stateManagerCtor = require('./StateManager');
var logger = require('./../logger/logger')(module);
var events = require('events');
var util = require('util');
var Q = require('q');

function LiveEntry(entryObject, isNewSession) {
    events.EventEmitter.call(this);
    this.entryId = entryObject.entryId;
    this.entryDownloader = new entryDownloaderCtor(entryObject, isNewSession);
    this.stateManager = stateManagerCtor(entryObject);
}
util.inherits(LiveEntry, events.EventEmitter);

function onEntryDownloaderStopped() {

}

function onEntryReadyToPlay() {

}

LiveEntry.prototype.start = function() {
    var that = this;
    // Entry created -> report BROADCASTING to server
    logger.info("Entry " + that.entryId + " started streaming, report BROADCASTING to server");
    return that.stateManager.onNotifyBroadcasting()
        .then(function() {
            //var entryDownloader = new entryDownloaderCtor(that.entryParameters)
            that.entryDownloader.on('stopped', onEntryDownloaderStopped.bind(that));
            that.entryDownloader.on('play', onEntryReadyToPlay.bind(that));
            return that.entryDownloader.start();
        });
};

LiveEntry.prototype.stop = function() {

};

module.exports = LiveEntry;