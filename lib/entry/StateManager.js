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
        // TODO: Insert ability to move from 'init' state to 'playing' immediately? -> Gad
        logger.info("Event '%s' raised: Changing state from '%s' to '%s'", event.toUpperCase(), from, to);
        return backendClient.registerEntryInDatabase(entryObject, KalturaLiveStatus.BROADCASTING, event);
    }

    function onstop(event, from, to) {
        // TODO: Check difference between stop from BROADCASTING to stop from PLAYING -> Gad
        lastRegisteredInAPI = null;
        logger.info("Event '%s' raised: Changing state from '%s' to '%s'", event.toUpperCase(), from, to);
        return backendClient.unregisterEntryInDatabase(entryObject.entryId);
    }

    function onplay(event, from, to) {
        // TODO: Erase duplicate code!!! -> Gad
        switch (event) {
            case "play":
                logger.info("Event '%s' raised: Changing state from '%s' to '%s'", event.toUpperCase(), from, to);
                // Refresh entry's timestamp
                return sessionManager.refreshSessionTimestamp(entryObject.entryId)
                    .then(function() {
                        lastRegisteredInAPI = new Date().getTime();
                        return backendClient.registerEntryInDatabase(entryObject, KalturaLiveStatus.PLAYABLE, event)
                            .catch(function(err) {
                                logger.error("Failed to register media server: ", err);
                                //TODO: what to do here? -> Gad
                            });
                    })
                    .catch(function(err) {
                        logger.error("Error refreshing timestamp for entry %s err: %s stack: %s", entryObject.entryId, err, err.stack);
                    });
            case "update":
                var currTime = new Date().getTime();
                if ((currTime - lastRegisteredInAPI) >= updateIntervalTime) {
                    logger.info("Event '%s' raised: Entry %s is still in 'playing' state", event.toUpperCase(), entryObject.entryId);
                    // Refresh entry's timestamp
                    return sessionManager.refreshSessionTimestamp(entryObject.entryId)
                        .then(function() {
                            lastRegisteredInAPI = new Date().getTime();
                            return backendClient.registerEntryInDatabase(entryObject, KalturaLiveStatus.PLAYABLE, event)
                                .catch(function(err) {
                                    logger.error("Failed to register media server: ", err);
                                    //TODO: what to do here? -> Gad
                                });
                        })
                        .catch(function(err) {
                            logger.error("Error refreshing timestamp for entry %s err: %s stack: %s", entryObject.entryId, err, err.stack);
                        });
                }
        }
    }

    return fsm;
};