/**
* Created by ron.yadgar on 17/07/2016.
*/
const Q = require('q');
const util = require('util');
const events = require("events");
const config = require('../../../common/Configuration');
const qio = require('q-io/fs');
const path = require('path');
const _ = require('underscore');
const glob = require('glob');
const ErrorUtils = require('../../utils/error-utils');
const PlaylistGenerator = require('../../playlistGenerator/PlaylistGenerator');
const PersistenceFormat = require('../../../common/PersistenceFormat.js');
const RecordingEntrySession = require('./RecordingEntrySession.js')
const logger = require('../../../common/logger').getLogger("RecordingManager");
const kalturaTypes = require('../../kaltura-client-lib/KalturaTypes');
const unknownEntry = "UNKNOWN"
const backendClient = require('../../BackendClientFactory.js').getBackendClient();
const basePlugin = require('../BasePlugin')
class RecordingManager extends basePlugin{
//todo what to do if we stop stream and start, but other machine has start to get it
//todo move all path join baseName etc to persistent format
// should also recording for primary ?
//change then style, and fix indentation
// todo Assumptions:
    /*
     1. No change configuration!
     2. recording window in not more that entry session window -  check it
     3. All chunks are comming at the same time
     recordingRootPath -
     recordingEntryPath
     recordingSessionPath
     recordingSessionSourcePath"
     */
    constructor(config) {
        super("RecordingManager");
        this.config = config
        const recordingTimeInterval = config.recordingTimeIntervalInSec * 1000;
        this.completedRecordingFolderPath = config.completedRecordingFolderPath;
        this.recordingMaxDurationInMs = config.recordingMaxDurationInHours * 60 * 60 * 1000 - 5*60*1000;
        this.recordingList = {};

        logger.info("Initializing recording manager");

        setInterval(()=>{
            this.handleRecordingEntries()
        }, recordingTimeInterval, this)
    }
    getEvents(entryObj) {
        let events = { // todo should define for all as constant! better define it as event base
            "addNewChunks" : this.addNewChunks.bind(this),
            "startLive" : this.startRecording.bind(this),
            "suspendLive" : this.stopLive.bind(this)

        }
        if (entryObj.recordStatus != kalturaTypes.KalturaRecordStatus.DISABLED ){
            return events
        }

    }

     startRecording(entryObj, flavorsObjArray){
         return Q.resolve().then(()=> {

            function makeFlavorDirectories() {
                logger.debug("[%s-%s] About to create directories %s", entryObj.entryId, entryObj.recordedEntryId, recordingEntrySession.flavors)
                let creatingDirectoriesPromise = _.map(recordingEntrySession.flavors, (flavorId)=> {
                    let flavorPath = path.join(recordingEntrySession.recordingSessionPath, flavorId)
                    return qio.makeDirectory(flavorPath)
                    return qio.makeDirectory(flavorPath)
                })
                return Q.allSettled(creatingDirectoriesPromise)
                    .then((results)=> {
                        _.each(results, (promise)=> {
                            if (promise.state === 'rejected') {
                                if (promise.reason && promise.reason.code === 'EEXIST') {
                                    logger.debug("[%s-%s] path %s already exist", entryObj.entryId, entryObj.recordedEntryId, promise.reason.path)
                                }
                                else {
                                    logger.error("[%s-%s] Failed to make directory %s", entryObj.entryId, entryObj.recordedEntryId, ErrorUtils.error2string(promise.reason))
                                }
                            }
                        })
                    })
            }
             const getRecordingEntrySession = ()=>{
                 let recordingEntrySession = null
                 let entryId = entryObj.entryId;
                 if (!("recordedEntryId" in entryObj && entryObj.recordedEntryId != undefined)){
                     entryObj.recordedEntryId =  unknownEntry
                     logger.warn("[%s] Entry has no recordedEntryId", entryObj.entryId)
                 }
                 if (!this.recordingList[entryId]) {
                    logger.info("[%s-%s] Create new recording session.", entryObj.entryId, entryObj.recordedEntryId)
                    recordingEntrySession = new RecordingEntrySession(this.config, entryObj, flavorsObjArray)
                    this.recordingList[entryId] = recordingEntrySession
                   }
                 else {
                    logger.info("[%s-%s] Found a previous recording session, update time stamp", entryObj.entryId, entryObj.recordedEntryId)
                     this.recordingList[entryId].lastTimeUpdateChunk = new Date()

                 }
                 return recordingEntrySession
            }

            const startExistSession = ()=>{
                logger.debug("[%s-%s] startExistSession", entryObj.entryId, entryObj.recordedEntryId)
                let doneFilePath = path.join(recordingSessionPath, 'done');
                return recordingEntrySession.accessibleRecording()
                    .then(()=>{
                        return qio.exists(doneFilePath)
                    })
                    .then((fileDoneExist)=> {

                        if (fileDoneExist) {
                            logger.debug("[%s-%s] file done exist, remove it ", entryObj.entryId, entryObj.recordedEntryId)
                            return qio.remove(doneFilePath)
                        }
                        else {
                            logger.warn("[%s-%s] file done is not exist, check for restoration", entryObj.entryId, entryObj.recordedEntryId)
                            return makeFlavorDirectories().then(()=>{
                                return recordingEntrySession.restoreSession()
                            })
                        }
                    })
                }

             const startNewSession = ()=>{
                 logger.debug("[%s-%s] startNewSession", entryObj.entryId, entryObj.recordedEntryId)
                 return qio.makeTree(recordingSessionPath)
                     .then(()=>{
                        return makeFlavorDirectories()
                     })
                     .then(()=>{
                         return recordingEntrySession.accessibleRecording()
                     })
             }

             let startRecordingTime = new Date()
             logger.debug("[%s-%s] Start recording ", entryObj.entryId, entryObj.recordedEntryId)
             let recordingEntrySession = getRecordingEntrySession();
             if (recordingEntrySession == null) {
                 return Q.resolve();
             }
             let recordingSessionPath = recordingEntrySession.recordingSessionPath;
             let startSessionPromise;
             return qio.exists(recordingSessionPath).then((sessionExist)=> {
                 if (sessionExist) {
                     startSessionPromise = startExistSession()
                 }
                 else {
                     startSessionPromise = startNewSession()
                 }
                 return startSessionPromise
                     .then(()=> {
                         let startRecordingTimeDuration = new Date() - startRecordingTime
                         logger.info("[%s-%s] Start recording is completed, time : %s ms", entryObj.entryId, entryObj.recordedEntryId, startRecordingTimeDuration)
                     })
             })
         }).catch((err)=>{
            logger.error("[%s-%s] Error while try to start recording : %s, delete object", entryObj.entryId, entryObj.recordedEntryId, ErrorUtils.error2string(err))
            delete this.recordingList[entryObj.entryId]
            return Q.reject()
        })
}
    stopLive(entryObject){

        function changeRecordedEntry() {
            let entryId = entryObject.entryId;
            let oldRecordingSessionPath = recordingEntrySession.recordingSessionPath;
            let recordedEntryId;
            logger.debug("[%s][changeRecordedEntry][1 of 4] About to call get entry",  entryId);
            return backendClient.getEntryInfo(entryId)
                .then((entryObj)=>{
                    if ('recordedEntryId' in entryObj){
                        recordedEntryId = entryObj.recordedEntryId;
                        logger.debug("[%s] Found recordedEntryId : %s",  entryId, recordedEntryId)
                        return Q.resolve(recordedEntryId)
                    }
                    else{
                        logger.error("[%s] recordedEntryId not exist on entry object",  entryId)
                        return Q.reject()
                    }
                })
                .then((recordedEntryId)=> {
                    logger.debug("[%s-%s][changeRecordedEntry][2 of 4] About to call changeRecordedEntry on recordingEntrySession", entryId, recordedEntryId)
                    return recordingEntrySession.changeRecordedEntry(recordedEntryId);
                }).then(()=>{
                    logger.debug("[%s-%s][changeRecordedEntry][3 of 4] About to change directory name from [%s] to [%s]",  entryId, recordedEntryId, oldRecordingSessionPath,  recordingEntrySession.recordingSessionPath)
                    return qio.rename(oldRecordingSessionPath, recordingEntrySession.recordingSessionPath)
                })
                .then(()=>{
                    logger.debug("[%s-%s][changeRecordedEntry][4 of 4] About to export it to live directory",  entryId, recordedEntryId)
                    return recordingEntrySession.accessibleRecording()
                })
                .then(()=>{
                    logger.info("[%s-%s][changeRecordedEntry] Finished successfully",  entryId, recordedEntryId)
                })
                .catch((err)=>{
                    logger.error("[%s] Failed to changeRecordedEntry: %s", entryId, ErrorUtils.error2string(err))
                })
        }

            let recordingEntrySession = this.recordingList[entryObject.entryId];
            if (!recordingEntrySession) {
                logger.warn("[%s] Can't updateServer recording, entry is not exist on recording list", entryObject.entryId);
                return
            }
            if (recordingEntrySession.recordedEntryId === unknownEntry){
                changeRecordedEntry()
            }
            recordingEntrySession.updateEntryDuration(true)
        }

    addNewChunks (Mp4Files, entryId, flavorId){


        let recordingEntrySession =  this.recordingList[entryId];
        let chunksNameChained = _.reduce(Mp4Files, function (str, obj) {
            return str + obj.chunkName + " ";
        }, "");

        logger.info("[%s] Receiving new chunks :%s", entryId , chunksNameChained);

        if (!recordingEntrySession) {
            logger.warn("[%s] Entry is not exist on recording list: %s - maybe entry was passed the limit of max duration", entryId, chunksNameChained);
            return
        }

        if (recordingEntrySession.getDuration() > this.recordingMaxDurationInMs) {
            logger.warn("Recording %s of entry %s has passed the limit of recording duration - %s seconds", this.recordingList[entryId].recordedEntryId, entryId, this.recordingMaxDurationInMs)
            return;
        }

        // update lastTimeUpdateChunk
        recordingEntrySession.lastTimeUpdateChunk = new Date();

        let Mp4FilesClone= _.clone(Mp4Files)
        return recordingEntrySession.LinkAndUpdateJson(Mp4FilesClone, flavorId);
}

    handleRecordingEntries(){
        function getRecordedEntry(entryId) {
            backendClient.getEntryInfo(entryId).then((entryObj)=>{
                if (!("recordedEntryId" in entryObj && entryObj.recordedEntryId != undefined)){
                    logger.error("[%s] getRecordedEntry: Can't find recordedEntryId", entryId)
                    return Q.reject()
                }
                return Q.resolve(entryObj.recordedEntryId)
            })

        }

        try {
            let now = new Date();
            logger.debug("Check for end recording session");
            _.each(this.recordingList,  (element, entryId) =>{
                logger.debug("[%s] handleRecordingEntries-  now:[%s], duration: [%s], element: [%j]",
                    element.recordingSessionId, now, element.getDuration() / 1000, element);

                if (now - element.lastTimeUpdateChunk > element.recordingSessionDuration) {
                    logger.info("[%s-%s] recording  didn't get new chunks for %d - stop recording", entryId, element.recordedEntryId, element.recordingSessionDuration);
                    this.stopRecording(entryId, element.recordedEntryId, element.recordingSessionPath)
                }

            });
            logger.info("Available recording entry: %j", _.keys(this.recordingList));
        } catch (err) {
            logger.error("Error while trying to run handleRecordingEntries: %s ", ErrorUtils.error2string(err))
        }
}

    stopRecording(entryId, recordedEntryId, recordingSessionPath){


        let recordingEntrySession = this.recordingList[entryId];
        if (!recordingEntrySession) {
            logger.warn("[%s][stopRecording]  Can't stop recording, entry is not exist on recording list", entryId);
            return
        }
        return recordingEntrySession.serializedActionsPromise.finally(() =>{ // check first that all chunks are completed
            let totalAddedChunks = _.reduce(recordingEntrySession.flavorsChunksCounter,(memo,flavorChunks)=>{
                return memo+ flavorChunks
            }, 0)
                //todo should also print warning if # of chunks is not equall between all flavors!
            let recordingSessionDuration = recordingEntrySession.getDuration() - recordingEntrySession.startDuration
            if (! recordingSessionDuration > 0 ){
                logger.warn("[%s-%s][stopRecording] Entry duration has no change, do nothing. start [%s] current[%s], totalAddedChunks [%s]", entryId, recordedEntryId, recordingEntrySession.getDuration(), recordingEntrySession.startDuration , totalAddedChunks)
                delete this.recordingList[entryId];
                return
            }

            let recordingDuration = recordingEntrySession.getDuration().toString();
            let stampFilePath = path.join(recordingSessionPath, 'stamp')
            return qio.write(stampFilePath, recordingDuration)
                .then(()=>{
                    if (recordedEntryId === unknownEntry){
                        logger.error("[%s][stopRecording]: recorded entry is unknown, skip of create soft link", entryId)
                        return Q.resolve()
                    }
                    if (recordingEntrySession.serverType  !== kalturaTypes.KalturaEntryServerNodeType.LIVE_PRIMARY){
                        logger.info("[%s-%s][stopRecording]   Entry is backup, skip of create soft link",  entryId, recordedEntryId)
                        return Q.resolve()
                    }
                    let destFilePath = path.join(this.completedRecordingFolderPath, entryId + '_' + recordedEntryId + '_' + recordingDuration);
                    return qio.symbolicLink(destFilePath, recordingSessionPath, 'directory')
                        .then(()=>{
                            logger.info("[%s-%s][stopRecording] Successfully create soft link from %s, into %s, recording chunks in this session: [%s] recordingSessionDuration [%s]", entryId, recordedEntryId, recordingSessionPath, destFilePath, totalAddedChunks, recordingSessionDuration);
                        })
                })
                .then(()=> {
                    delete this.recordingList[entryId];
                    let doneFilePath = path.join(recordingSessionPath, 'done')
                    return qio.write(doneFilePath, 'done')
                })
                .catch((err) => {
                    logger.error("[stopRecording] Failed: %s", ErrorUtils.error2string(err))
                })
            })

}

}
module.exports = RecordingManager