/**
 * Created by ronyadgar on 03/03/2016.
 */

var logger = require('./../logger/logger')(module);
var backendClient = require('../BackendClientFactory.js').getBackendClient();
var KalturaLiveStatus = require('../kaltura-client-lib/KalturaTypes').KalturaLiveEntryStatus;
var StateMachine =require("../utils/fsm.js");
var sessionManager = require('./../SessionManager');
var config = require('../../common/Configuration');
var Q = require('q');

module.exports = function(entryObject) {

    var lastRegisteredInAPI = null;
    var updateIntervalTime = config.get('apiUpdateInterval');
    var stateMachineMessagePattern = "Event '%s' raised for entry %s: Moving from state '%s' to state '%s'";

    var fsm = StateMachine.create({
        initial: 'init',
        events: [
            {name: 'start', from: 'init', to: 'broadcast'},
            {name: 'play', from: 'broadcast', to: 'playing'},
            {name: 'update', from: 'playing', to: 'playing'},
            {name: 'stop', from: 'broadcast', to: 'stopped'},
            {name: 'stop', from: 'playing', to: 'stopped'}
        ],
        callbacks: {
            onstart : onstart,
            onstop : onstop,
            onplay : onplay,
            onupdate : onplay
        }
    });

    function onstart(event, from, to) {
        logger.info(stateMachineMessagePattern, event.toUpperCase(), entryObject.entryId, from, to);
        return backendClient.registerEntryInDatabase(entryObject, KalturaLiveStatus.BROADCASTING, event)
            .catch(function(err) {
                logger.error("Failed to register media server BROADCAST: %s", err);
            });
    }

    function onstop(event, from, to) {
        lastRegisteredInAPI = null;
        logger.info(stateMachineMessagePattern, event.toUpperCase(), entryObject.entryId, from, to);
        return backendClient.unregisterEntryInDatabase(entryObject.entryId)
            .catch(function(err) {
                logger.error("Failed to unregister from media server: %s", err);
            });
    }

    function onplay(event, from, to) {
        var currTime = new Date().getTime();
        if ((lastRegisteredInAPI === null) || ((currTime - lastRegisteredInAPI) >= updateIntervalTime)) {
            logger.info(stateMachineMessagePattern, event.toUpperCase(), entryObject.entryId, from, to);
            // Refresh entry's timestamp
            return sessionManager.refreshSessionTimestamp(entryObject.entryId)
                .then(function() {
                    lastRegisteredInAPI = new Date().getTime();
                    return backendClient.registerEntryInDatabase(entryObject, KalturaLiveStatus.PLAYABLE, event)
                        .catch(function (err) {
                            logger.error("Failed to register media server PLAYING: %s", err);
                            //TODO: what to do here? -> Gad
                        });
                })
                .catch(function (err) {
                    logger.error("Error refreshing timestamp for entry %s err: %s stack: %s", entryObject.entryId, err, err.stack);
                });
        }
    }

    return fsm;
};