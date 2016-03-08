/**
 * Created by ronyadgar on 03/03/2016.
 */

var logger = require('./../logger/logger')(module);
var backendClient = require('./../BackendClient.js');
var logger = require('./../logger/logger')(module);
var KalturaLiveStatus = require('../kaltura-client-lib/KalturaTypes').KalturaLiveEntryStatus;
var Q = require('q');
var StateMachine =require("../utils/fsm.js");
var config = require('../../common/Configuration');

module.exports = function(entryObject) {
    var fsm = StateMachine.create({
        initial: 'init',
        events: [
            {name: 'start', from: 'init', to: 'broadcast'},
            {name: 'readyForPlaying', from: 'broadcast', to: 'playing'},
            {name: 'stop', from: 'broadcast', to: 'init'},
            {name: 'stop', from: 'playing', to: 'init'}
        ],
        callbacks: {
            onstart : function (event, from, to) {
                return stratBroadcasting(fsm);
            },
            onstop : function (event, from, to) {
                if (from==="broadcast"){
                    clearTimeout(timeoutId);
                    logger.info("cancel timer for  timeoutId", timeoutId);
                }
                return backendClient.unregisterEntryInDatabase(entryObject.entryId);
            },

            onreadyForPlaying: onreadyForPlaying
        }
    });
    var timeoutId;
    //TODO: Check if need to registermediaserver in each interval time -> Ron
    //whats happen if after register media server (broadcast and playing) dvr crush

    function onreadyForPlaying() {
             logger.info("onreadyForPlaying: calling registermedia server");
             return backendClient.registerEntryInDatabase(entryObject, KalturaLiveStatus.PLAYABLE)
                 .catch(function(err) {
                     logger.error("Failed to register media server: ", err);
                     //TODO: what to do here? -> Ron
                 })
    }

    function stratBroadcasting(fsm) {
        //TODO: what happens if there are already chunks from manifest -> Ron
        //TODO: what happens if register broadcasting failed? -> Ron
        /*timeoutId = setTimeout( function() {
                fsm.readyForPlaying();
            }, 40 * 1000); //temporally*/
        logger.info("onStrartBroadcasting: temporally calling register media server in 40 second, with timeoutId", timeoutId);
        return backendClient.registerEntryInDatabase(entryObject, KalturaLiveStatus.BROADCASTING);
    }
    return fsm;
}