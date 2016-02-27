/**
 * Created by gadyaari on 24/02/2016.
 */

var backendClient = require('./../BackendClient.js');
var logger = require('./../logger/logger')(module);
    var KalturaLiveStatus = require('../kaltura-client-lib/KalturaTypes').KalturaLiveEntryStatus;
var Q = require('q');

module.exports = function(entryObject) {

    function onNotifyBroadcasting() {
        return Q.fcall(function() {
            // TODO: Create callback function for registerMediaServer!
           return backendClient.registerEntryInDatabase(entryObject, KalturaLiveStatus.BROADCASTING);
        });
    }

    function onNotifyPlaying() {

    }

    function onNotifyStop() {

    }

    return {
        onNotifyBroadcasting : onNotifyBroadcasting,
        onNotifyPlaying : onNotifyPlaying,
        onNotifyStop : onNotifyStop
    };
};