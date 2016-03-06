
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
            {name: 'stop', from: 'playing', to: 'stopped'}
        ],
        callbacks: {
            onstart: function (event, from, to) {
                return stratBroadcasting();
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
    //todo need to check if need to registermediaserver in each interval time.
    //whats happen if after register media server (broadcast and playing) dvr crush


    function onreadyForPlaying() {
             logger.info("onreadyForPlaying: calling registermedia server");
             return backendClient.registerEntryInDatabase(entryObject.entryId, KalturaLiveStatus.PLAYABLE)
                 .catch(function(err) {
                     logger.error("Failed to register media server: ",err);
                     //todo: what to do here?
                 })
    }
    function stratBroadcasting() {
        //todo what happen if there are allreay chunks from manifest
        //todo what happen if register brodcasting failed?
         timeoutId = setTimeout( function(){
            fsm.readyForPlaying();
        }, 40*1000); //temporally
        logger.info("onstrartBroadcasting: temporally calling register media server in 40 second, with timeoutId",timeoutId);
        return backendClient.registerEntryInDatabase(entryObject.entryId, KalturaLiveStatus.BROADCASTING);
    }
    return fsm;
}