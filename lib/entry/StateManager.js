/**
 * Created by ronyadgar on 03/03/2016.
 */

var backendClient = require('../BackendClientFactory.js').getBackendClient();
var KalturaLiveStatus = require('../kaltura-client-lib/KalturaTypes').KalturaEntryServerNodeStatus;
var persistenceFormat = require('./../../common/PersistenceFormat');
var StateMachine = require("../utils/fsm.js");
var fsUtils = require('../utils/fs-utils');
var config = require('../../common/Configuration');
var sessionManager = require('./../SessionManager');
var _ = require('underscore');
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
    var lastStreamInfoUpdateTime = 0;
    var streamInfoUpdateInterval = config.get('streamInfoUpdateInterval');

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
            {name: 'suspend', from: 'init', to: 'suspending'},
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
        return checkNewSession()
            .then(function() {
                return sessionManager.refreshSessionTimestamp(liveEntry.entryId);
            })
            .then(function() {
                logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
                return (liveEntry.entryObject.liveStatus === 1) ? Q.resolve() : sync.exec(function() {
                    return backendClient.registerEntryInDatabase(liveEntry.entryObject, KalturaLiveStatus.BROADCASTING, event)
                        .then((entryObj) => {
                            if (entryObj && 'recordedEntryId' in entryObj){
                                liveEntry.entryObject.recordedEntryId = entryObj.recordedEntryId;
                            }
                        })
                        .catch(function(err) {
                            logger.error("Error while calling BROADCAST for entry. %s", ErrorUtils.error2string(err));
                        });
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
        if (from === 'init') { 
            // Entry stopped before finished initialization -> stop immediately
            return Q.resolve(); 
        }
        logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
        let result = (sessionManager.lastTimestampSessionModification(lastLiveTimestamp, false, liveEntry.entryId));
        logger.info("Should entry stop result: [%s]", result);
        return (result) ? Q.resolve() : Q.reject();
    }

    function onplay(event, from, to) {
        if (from === "suspending"){
            logger.warn("Something went wrong:" + stateMachineMessagePattern, event.toUpperCase(), from, to)
        }
        var currTime = new Date();
        if ((lastServerUpdate === null) || ((currTime - lastServerUpdate) >= serverUpdateInterval)) {
            logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
            // Refresh entry's timestamp
            return sessionManager.refreshSessionTimestamp(liveEntry.entryId)
                .then(function() {
                    return sync.exec(function() {
                        return updateStreamInfo(currTime)
                            .finally(function() {
                                return backendClient.registerEntryInDatabase(liveEntry.entryObject, KalturaLiveStatus.PLAYABLE, event)
                                    .then(function() {
                                        lastServerUpdate = new Date();
                                    })
                                    .catch(function (err) {
                                        logger.error("Error calling registerEntryInDatabase - PLAY for entry. %s", ErrorUtils.error2string(err));
                                        //TODO: what to do here? -> Gad
                                    });
                            })
                    });
                })
                .catch(function (err) {
                    logger.error("Error refreshing timestamp for entry. %s", ErrorUtils.error2string(err));
                });
        }
    }

    function onupdate(event, from, to) {
        logger.info(stateMachineMessagePattern, event.toUpperCase(), from, to);
        lastLiveTimestamp = new Date();
    }

    function updateStreamInfo(currentTime) {
        if ((currentTime - lastStreamInfoUpdateTime) >= streamInfoUpdateInterval) {
            return getEntryServerNodeId()
                .then(function () {
                    return backendClient.updateStreamInfo(liveEntry.entryId, liveEntry.entryServerNodeId, liveEntry.flavorsDownloaders)
                        .then(function() {
                            logger.debug("Flavors updated in DB for entry server node [%s]", liveEntry.entryServerNodeId);
                            lastStreamInfoUpdateTime = new Date();
                            return Q.resolve();
                        });
                })
                .catch(function (err) {
                    logger.warn("entryServerNodeId not found, stream info will not update! Error: %s", ErrorUtils.error2string(err));
                    liveEntry.entryServerNodeId = null;
                    return Q.reject(err);
                });
        }
        else
            return Q.resolve();
    }

    function getEntryServerNodeId() {
        var getLiveEntryServerNodeIdPromise =
            liveEntry.entryServerNodeId ? Q.resolve()
                : backendClient.getLiveEntryServerNodes(liveEntry.entryId)
                .then(function (liveEntryServerNodes) {
                    _.each(liveEntryServerNodes, function (liveEntryServerNode) {
                        //note that serverType and entryServerType can be string or int values
                        if (liveEntryServerNode.serverType == liveEntry.entryServerType) {
                            logger.info("Saving SeverNodeId for entry: [%s]", liveEntryServerNode.id);
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
    
    function checkNewSession() {
        return sessionManager.isNewSession(liveEntry.entryId)
            .then(function(result) {
                if (result || liveEntry.playlistGenerator.checkTranscodingProfileChange()) {
                    logger.info("New session Started");
                    return fsUtils.cleanFolder(persistenceFormat.getEntryBasePath(liveEntry.entryId), liveEntry.entryId)
                        .catch((error) => {
                            logger.error("Error cleaning folder: %s", ErrorUtils.error2string(error));
                        })
                        .then(function() {
                            return liveEntry.playlistGenerator.reset();
                        });
                }
                return Q.resolve();
            });
    }
    
    return fsm;
};