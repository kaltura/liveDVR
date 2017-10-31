/**
 * Created by ronyadgar on 03/03/2016.
 */

const backendClient = require('../BackendClientFactory.js').getBackendClient();
const KalturaLiveStatus = require('../kaltura-client-lib/KalturaTypes').KalturaEntryServerNodeStatus;
const persistenceFormat = require('./../../common/PersistenceFormat');
const StateMachine = require("../utils/fsm.js");
const fsUtils = require('../utils/fs-utils');
const config = require('../../common/Configuration');
const sessionManager = require('./../SessionManager');
const _ = require('underscore');
const Q = require('q');
const loggerModule = require('../../common/logger');
const ErrorUtils = require('./../utils/error-utils');
const kalturaTypes = require('../kaltura-client-lib/KalturaTypes');
const pushManager = require('../PushManager');

module.exports = function(liveEntry) {
    let logger = loggerModule.getLogger("StateManager", "[" + liveEntry.entryId + "] ");
    let serverUpdateInterval = config.get('apiUpdateInterval');
    let lastServerUpdate = null;
    let lastLiveTimestamp = new Date();
    let stateMachineMessagePattern = "Event '%s' raised for entry: Changing state from '%s' to '%s'";
    let lastStreamInfoUpdateTime = 0;
    let streamInfoUpdateInterval = config.get('streamInfoUpdateInterval');
    let sync = liveEntry.entryObject.syncPromises;

    let fsm = StateMachine.create({
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
                return (liveEntry.entryObject.liveStatus == KalturaLiveStatus.PLAYABLE) ? Q.resolve() : sync.exec(function() {
                    const pushMgr = new pushManager.PushManager();
                    pushMgr.setEntryEnabled(liveEntry.entryId, false);
                    return backendClient.registerEntryInDatabase(liveEntry.entryObject, KalturaLiveStatus.BROADCASTING, event)
                        .then((entryObj) => {
                            pushMgr.setEntryEnabled(liveEntry.entryId, true);
                            if (entryObj && 'recordedEntryId' in entryObj){
                                liveEntry.entryObject.recordedEntryId = entryObj.recordedEntryId;
                            }
                        })
                        .catch(function(err) {
                            logger.error("Error while calling BROADCAST for entry. %s", ErrorUtils.error2string(err));
                        })
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
                .then((entryObj) => {
                    const pushMgr = new pushManager.PushManager();
                    pushMgr.removeEntry(entryObj.entryId);
                })
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
        let result = (sessionManager.isTimeToStopSession(lastLiveTimestamp, liveEntry.entryId));
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
                                const pushMgr = new pushManager.PushManager();
                                pushMgr.setEntryEnabled(liveEntry.entryId, false);
                                return backendClient.registerEntryInDatabase(liveEntry.entryObject, KalturaLiveStatus.PLAYABLE, event)
                                    .then(function() {
                                        lastServerUpdate = new Date();
                                        pushMgr.setEntryEnabled(liveEntry.entryId, true);
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
            return updateEntryServerNodesInfo()
                .then(()=> {
                    if (liveEntry.isMultipleAudio) {
                        logger.debug("Stream is Multiple Audio. Skipping server update");
                        lastStreamInfoUpdateTime = new Date();
                        return Q.resolve();
                    }
                    else {
                        return updateFlavorsToServer(liveEntry.entryId, liveEntry.entryServerNodeId, liveEntry.flavorsDownloaders);
                    }
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

    function updateFlavorsToServer(entryId, serverNode, flavorsDownloaders) {
        return backendClient.updateStreamInfo(entryId, serverNode, flavorsDownloaders)
            .then(()=> {
                logger.debug("Flavors updated in DB for entry server node [%s]", liveEntry.entryServerNodeId);
                lastStreamInfoUpdateTime = new Date();
                return Q.resolve();
            });
    }

    function checkStreamRedundancy(entryServerNodesList) {
        if (entryServerNodesList.length > 1) {
            // Only if the other entryServerNode is in status different than Marked-For-Deletion we can determine redundancy
            let sn = _.find(entryServerNodesList, esn => esn.serverType !== liveEntry.entryServerType);
            return sn.status !== kalturaTypes.KalturaEntryServerNodeStatus.MARKED_FOR_DELETION;
        }
        return false;
    }

    function updateEntryServerNodesInfo() {
        return backendClient.getLiveEntryServerNodes(liveEntry.entryId)
            .then(entryServerNodesList => {
                liveEntry.entryObject.isRedundancy = checkStreamRedundancy(entryServerNodesList);
                if (!liveEntry.entryServerNodeId) {
                    _.each(entryServerNodesList, entryServerNode => {
                        //note that serverType and entryServerType can be string or int values
                        if (entryServerNode.serverType == liveEntry.entryServerType) {
                            logger.info("Saving SeverNodeId for entry: [%s]", entryServerNode.id);
                            liveEntry.entryServerNodeId = entryServerNode.id;
                            return false;
                        }
                    });
                }
                return liveEntry.entryServerNodeId ? Q.resolve() : Q.reject("Couldn't find entryServerNodeId");
            })
            .catch(function (err) {
                return Q.reject(err);
            });
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