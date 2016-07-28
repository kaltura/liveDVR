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
var ErrorUtils = require('./../utils/error-utils');

module.exports = function(liveEntry) {
    var logger = loggerModule.getLogger("StateManager", "[" + liveEntry.entryId + "] ");
    var serverUpdateInterval = config.get('apiUpdateInterval');
    var lastServerUpdate = null;
    var lastLiveTimestamp = new Date();
    var stateMachineMessagePattern = "Event '%s' raised for entry: Changing state from '%s' to '%s'";
    var sync = new promUtils.SynchornizedPromises(logger);
    var lastStreamInfoUpdate = 0;

    var fsm = StateMachine.create({
        initial: 'init',
        events: [
            {name: 'broadcast', from: 'init', to: 'broadcasting'},
            {name: 'play', from: 'broadcasting', to: 'playing'},
            {name: 'play', from: 'playing', to: 'playing'},
            {name: 'play', from: 'suspending', to: 'playing'},
            {name: 'update', from: 'broadcasting', to: 'broadcasting'},
            {name: 'update', from: 'suspending', to: 'broadcasting'},
            {name: 'update', from: 'playing', to: 'playing'},
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
        return (liveEntry.entryObject.liveStatus === 1) ? Q.resolve() : sync.exec(function() {
            return backendClient.registerEntryInDatabase(liveEntry.entryObject, KalturaLiveStatus.BROADCASTING, event)
                .catch(function(err) {
                    logger.error("Failed to register media server BROADCAST: %s", ErrorUtils.error2string(err));
                    //TODO: what to do here? -> Gad
            });
        });
    }

    function onstop(event, from, to) {
        lastServerUpdate = null;
        logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
        // Update the last timeStamp in the disk before shutting down entry
        sessionManager.refreshSessionTimestamp(liveEntry.entryId);
        return sync.exec(function() {
            return backendClient.unregisterEntryInDatabase(liveEntry.entryObject)
                .catch(function(err) {
                    logger.error("Failed to unregister from media server: %s", ErrorUtils.error2string(err));
                    //TODO: what to do here? -> Gad
             });
        });
    }

    function onsuspend(event, from, to) {
        logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
        if (sessionManager.lastTimestampSessionModification(lastLiveTimestamp, false, liveEntry.entryId)) {
            return Q.resolve();
        }
        else {
            return Q.reject();
        }
    }

    function onplay(event, from, to) {
        if (from === "suspending"){
            logger.warn("Something went wrong:" + stateMachineMessagePattern, event.toUpperCase(), from, to)
        }
        var currTime = new Date().getTime();
        if ((lastServerUpdate === null) || ((currTime - lastServerUpdate) >= serverUpdateInterval)) {
            logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
            // Refresh entry's timestamp
            return sessionManager.refreshSessionTimestamp(liveEntry.entryId)
                .then(function() {
                    return sync.exec(function() {
                        return updateStreamInfo()
                            .then(function() {
                                return backendClient.registerEntryInDatabase(liveEntry.entryObject, KalturaLiveStatus.PLAYABLE, event)
                            })
                            .then(function() {
                                lastServerUpdate = new Date().getTime();
                            })
                            .catch(function (err) {
                                logger.error("Failed to call PLAY for entry: %s", ErrorUtils.error2string(err));
                                //TODO: what to do here? -> Gad
                            });
                    });
                })
                .catch(function (err) {
                    logger.error("Error refreshing timestamp for entry, err: %s", ErrorUtils.error2string(err));
                });
        }
    }

    function onupdate(event, from, to) {
        logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
        lastLiveTimestamp = new Date();
    }

    function updateStreamInfo() {
        return getEntryServerNodeId
            .then(function() {
                return backendClient.updateStreamInfo(liveEntry.entryId, liveEntry.entryServerNodeId, liveEntry.flavorsObjArray)
                    .then(function(result) {
                        if (result) {
                            logger.debug("Flavors updated in DB for entry server node [%s]", liveEntry.entryId, liveEntry.entryServerNodeId);
                            lastStreamInfoUpdate = new Date();
                        }
                    });
            })
            .catch(function(err) {
                logger.warn("entryServerNodeId not found, stream info will not updated error: %s",  ErrorUtils.error2string(err));
                return Q.reject(err)
            });
    }

    function getEntryServerNodeId() {
        var that = this;

        var getLiveEntryServerNodeIdPromise =
            that.entryServerNodeId ? Q.resolve()
                : backendClient.getLiveEntryServerNodes(liveEntry.entryId)
                .then(function (liveEntryServerNodes) {
                    _.each(liveEntryServerNodes, function (liveEntryServerNode) {
                        if (liveEntryServerNode.serverType === liveEntry.entryServerType) {
                            liveEntry.entryServerNodeId = liveEntryServerNode.id;
                            return false;
                        }
                    });
                    return liveEntry.entryServerNodeId ? Q.resolve() : Q.reject("Couldn't find entryServerNodeId");
                })
                .catch(function (err) {
                    liveEntry.entryServerNodeId = 0;
                    return Q.reject(err);
                });

        return getLiveEntryServerNodeIdPromise;
    }
    
    return fsm;
};