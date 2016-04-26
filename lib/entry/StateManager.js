/**
 * Created by ronyadgar on 03/03/2016.
 */

var backendClient = require('../BackendClientFactory.js').getBackendClient();
var KalturaLiveStatus = require('../kaltura-client-lib/KalturaTypes').KalturaEntryServerNodeStatus;
var StateMachine = require("../utils/fsm.js");
var config = require('../../common/Configuration');
var sessionManager = require('./../SessionManager');
var Q = require('q');
var promUtils = require('../utils/promise-utils');
var loggerModule = require('../../common/logger');

module.exports = function(entryObject, manifestGenerator) {
    var logger = loggerModule.getLogger("StateManager", "[" + entryObject.entryId + "] ");
    var lastRegisteredInAPI = null;
    var lastLiveTimestamp = new Date();
    var updateIntervalTime = config.get('apiUpdateInterval');
    var stateMachineMessagePattern = "Event '%s' raised for entry: Changing state from '%s' to '%s'";
    var sync = new promUtils.SynchornizedPromises(logger);

    var fsm = StateMachine.create({
        initial: 'init',
        events: [
            //todo check all possible scenario 
            {name: 'broadcast', from: 'init', to: 'broadcasting'},
            {name: 'play', from: 'broadcasting', to: 'playing'},
            {name: 'play', from: 'playing', to: 'playing'},
            {name: 'play', from: 'suspending', to: 'playing'},
            {name: 'update', from: 'broadcasting', to: 'broadcasting'},
            {name: 'update', from: 'playing', to: 'playing'},
            {name: 'update', from: 'suspending', to: 'broadcasting'},
            {name: 'suspend', from: 'broadcasting', to: 'suspending'},
            {name: 'suspend', from: 'playing', to: 'suspending'},
            {name: 'suspend', from: 'suspending', to: 'suspending'},
            {name: 'stop', from: 'suspending', to: 'stopped'}
        ],
        callbacks: {
            onbroadcast : onbroadcast,
            onstop : onstop,
            onsuspend : onsuspend,
            onplay : onplay,
            onupdate : onupdate
        }
    });

    function onbroadcast(event, from, to) {
        logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
        return sync.exec(function() {
            return backendClient.registerEntryInDatabase(entryObject, KalturaLiveStatus.BROADCASTING, event, logger)
                .catch(function (err) {
                    logger.error("Failed to register media server BROADCAST: %j", err);
            })
        });
    }

    function onstop(event, from, to) {
        lastRegisteredInAPI = null;
        logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
        return sync.exec(function() {

            return backendClient.unregisterEntryInDatabase(entryObject, logger)
                .catch(function(err) {
                    logger.error("Failed to unregister from media server: %j", err);
             });
        });
    }

    function onsuspend(event, from, to) {
        logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
        if (sessionManager.lastTimestampSessionModification(lastLiveTimestamp, false, entryObject.entryId)) {
            return Q.resolve();
        }
        else {
            return Q.reject();
        }
    }

    function onplay(event, from, to) {
        if (from ==="suspending"){
            logger.warn("Something went wrong:", stateMachineMessagePattern, event.toUpperCase(), from, to)
        }
        var currTime = new Date().getTime();
        if ((lastRegisteredInAPI === null) || ((currTime - lastRegisteredInAPI) >= updateIntervalTime)) {
            // When reporting play update entry's playlist
            manifestGenerator.updatePlaylist();
            logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
            // Refresh entry's timestamp
            return sessionManager.refreshSessionTimestamp(entryObject.entryId)
                .then(function() {
                    lastRegisteredInAPI = new Date().getTime();
                    return sync.exec(function() {
                        return backendClient.registerEntryInDatabase(entryObject, KalturaLiveStatus.PLAYABLE, event, logger)
                            .catch(function (err) {
                                logger.error("Failed to register media server PLAYING: %j", err);
                                //TODO: what to do here? -> Gad
                            });
                    });
                })
                .catch(function (err) {
                    logger.error("Error refreshing timestamp for entry, err: %j stack: %s", err, err.stack);
                });
        }
    }

    function onupdate(event, from, to) {
        logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
        lastLiveTimestamp = new Date();
    }

    return fsm;
};