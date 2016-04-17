/**
 * Created by ronyadgar on 03/03/2016.
 */

var backendClient = require('../BackendClientFactory.js').getBackendClient();
var KalturaLiveStatus = require('../kaltura-client-lib/KalturaTypes').KalturaLiveEntryStatus;
var StateMachine = require("../utils/fsm.js");
var config = require('../../common/Configuration');
var sessionManager = require('./../SessionManager');
var Q = require('q');
var loggerDecorator = require('../utils/log-decorator');

module.exports = function(entryObject, manifestGenerator, LiveEntryLogger) {
    var logger= loggerDecorator(LiveEntryLogger, "[StateManager] ");
    var lastRegisteredInAPI = null;
    var lastLiveTimestamp = new Date();
    var updateIntervalTime = config.get('apiUpdateInterval');
    var stateMachineMessagePattern = "Event '%s' raised for entry: Changing state from '%s' to '%s'";

    var fsm = StateMachine.create({
        initial: 'init',
        events: [
            {name: 'start', from: 'init', to: 'broadcast'},
            {name: 'play', from: 'broadcast', to: 'playing'},
            {name: 'play', from: 'playing', to: 'playing'},
            {name: 'play', from: 'suspending', to: 'playing'},
            {name: 'update', from: 'broadcast', to: 'broadcast'},
            {name: 'update', from: 'playing', to: 'playing'},
            {name: 'suspend', from: 'broadcast', to: 'suspending'},
            {name: 'suspend', from: 'playing', to: 'suspending'},
            {name: 'suspend', from: 'suspending', to: 'suspending'},
            {name: 'stop', from: 'suspending', to: 'stopped'}
        ],
        callbacks: {
            onstart : onstart,
            onstop : onstop,
            onsuspend : onsuspend,
            onplay : onplay,
            onupdate : onupdate
        }
    });

    function onstart(event, from, to) {
        logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
        return backendClient.registerEntryInDatabase(entryObject, KalturaLiveStatus.BROADCASTING, event, logger)
            .catch(function(err) {
                logger.error("Failed to register media server BROADCAST: %j", err);
            });
    }

    function onstop(event, from, to) {
        lastRegisteredInAPI = null;
        logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
        return backendClient.unregisterEntryInDatabase(entryObject.entryId, logger)
            .catch(function(err) {
                logger.error("Failed to unregister from media server: %j", err);
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
        var currTime = new Date().getTime();
        if ((lastRegisteredInAPI === null) || ((currTime - lastRegisteredInAPI) >= updateIntervalTime)) {
            // When reporting play update entry's playlist
            manifestGenerator.updatePlaylist();
            logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
            // Refresh entry's timestamp
            return sessionManager.refreshSessionTimestamp(entryObject.entryId)
                .then(function() {
                    lastRegisteredInAPI = new Date().getTime();
                    return backendClient.registerEntryInDatabase(entryObject, KalturaLiveStatus.PLAYABLE, event, logger)
                        .catch(function (err) {
                            logger.error("Failed to register media server PLAYING: %j", err);
                            //TODO: what to do here? -> Gad
                        });
                })
                .catch(function (err) {
                    logger.error("Error refreshing timestamp for entry, err: %j stack: %s", err, err.stack);
                });
        }
    }

    function onupdate() {
        lastLiveTimestamp = new Date();
    }

    return fsm;
};