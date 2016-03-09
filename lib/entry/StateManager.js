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
            {name: 'update', from: 'playing', to: 'playing'},
            {name: 'stop', from: 'broadcast', to: 'init'},
            {name: 'stop', from: 'playing', to: 'init'}
        ],
        callbacks: {
            onstart : onstart,
            onstop : onstop,
            onreadyForPlaying : onreadyForPlaying,
            onupdate : onupdate
        }
    });

    var timeoutId;
    //TODO: Check if need to registermediaserver in each interval time -> Ron
    //whats happen if after register media server (broadcast and playing) dvr crush

    function onstart(event, from, to) {
        return stratBroadcasting(fsm);
    }

    function onstop(event, from, to) {
        if (from === "broadcast"){
            clearTimeout(timeoutId);
            logger.info("cancel timer for  timeoutId", timeoutId);
        }
        return backendClient.unregisterEntryInDatabase(entryObject.entryId);
    }

    function onreadyForPlaying() {
             logger.info("Event onreadyForPlaying raised: Changed state to 'playing'");
             return backendClient.registerEntryInDatabase(entryObject, KalturaLiveStatus.PLAYABLE)
                 .catch(function(err) {
                     logger.error("Failed to register media server: ", err);
                     //TODO: what to do here? -> Ron
                 })
    }

    function stratBroadcasting(fsm) {
        //TODO: what happens if there are already chunks from manifest -> Ron
        //TODO: what happens if register broadcasting failed? -> Ron
        logger.info("onStrartBroadcasting: temporally calling register media server in 40 second, with timeoutId", timeoutId);
        return backendClient.registerEntryInDatabase(entryObject, KalturaLiveStatus.BROADCASTING);
    }

    function onupdate() {
        logger.info("Event onupdate raised: Entry " + entryObject.entryId + " is still in 'playing' state");
        return backendClient.registerEntryInDatabase(entryObject, KalturaLiveStatus.PLAYABLE)
            .catch(function(err) {
                logger.error("Failed to register media server: ", err);
                //TODO: what to do here? -> Ron
            })
    }

    return fsm;
};