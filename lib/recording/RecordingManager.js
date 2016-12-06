/**
* Created by ron.yadgar on 17/07/2016.
*/
const Q = require('q');
const util = require('util');
const events = require("events");
const config = require('../../common/Configuration');
const qio = require('q-io/fs');
const path = require('path');
const _ = require('underscore');
const glob = require('glob');
const ErrorUtils = require('../utils/error-utils');
const PlaylistGenerator = require('../playlistGenerator/PlaylistGenerator');
const PersistenceFormat = require('../../common/PersistenceFormat.js');
const RecordingEntrySession = require('./RecordingEntrySession.js')
const logger = require('../../common/logger').getLogger("RecordingManager");
const configRecording = config.get("recording")
const kalturaTypes = require('../kaltura-client-lib/KalturaTypes');
class RecordingManager {
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
     recordingSessionSourcePath
     */
    constructor() {

        const recordingTimeInterval = configRecording.recordingTimeIntervalInSec * 1000;
        this.completedRecordingFolderPath = configRecording.completedRecordingFolderPath;
        this.recordingMaxDurationInMs = configRecording.recordingMaxDurationInHours * 60 * 60 * 1000 - 5*60*1000;
        this.recordingList = {};

        logger.info("Initializing recording manager");

        setInterval(()=>{
            this.handleRecordingEntries()
        }, recordingTimeInterval, this)
    }

     startRecording(entryObj, flavorsObjArray){
        function makeFlavorDirectories() {
            logger.debug("[%s-%s] About to create directories %s", entryObj.entryId, entryObj.recordedEntryId, recordingEntrySession.flavors)
            let creatingDirectoriesPromise = _.map(recordingEntrySession.flavors, (flavorId)=> {
                let flavorPath = path.join(recordingEntrySession.recordingSessionPath, flavorId)
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
             if (!this.recordingList[entryId]) {
                logger.info("[%s-%s] Create new recording session.", entryObj.entryId, entryObj.recordedEntryId)
                recordingEntrySession = new RecordingEntrySession(entryObj, flavorsObjArray)
                this.recordingList[entryId] = recordingEntrySession
               }
             else {
                logger.info("[%s-%s] Found a previous recording session, update time stamp", entryObj.entryId, entryObj.recordedEntryId)
                 this.recordingList[entryId].lastTimeUpdateChunk = new Date()
                //todo what todo? should check that no configuarion changed?
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
        if (recordingEntrySession == null){
            return Q.resolve();
        }
        let entryId = entryObj.entryId;

        let recordingSessionPath = recordingEntrySession.recordingSessionPath;
        let startSessionPromise;
        return qio.exists(recordingSessionPath).then((sessionExist)=> {
            if (sessionExist) {
                startSessionPromise =  startExistSession()
            }
            else {
                startSessionPromise = startNewSession()
            }
            return startSessionPromise
                .then(()=>{
                let startRecordingTimeDuration =  new Date() - startRecordingTime
                logger.info("[%s-%s] Start recording is completed, time : %s ms", entryObj.entryId, entryObj.recordedEntryId, startRecordingTimeDuration)
                })
        }).catch((err)=>{
            logger.error("[%s-%s] Error while try to start recording : %s, delete object", entryObj.entryId, entryObj.recordedEntryId, ErrorUtils.error2string(err))
            delete this.recordingList[entryId]
            return Q.reject()
        })
}
    updateServer(entryObject){
        let recordingEntrySession = this.recordingList[entryObject.entryId];
        if (!recordingEntrySession) {
            logger.warn("[%s] Can't updateServer recording, entry is not exist on recording list", entryObject.entryId);
            return
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
            logger.warn("[%s] Can't stop recording, entry is not exist on recording list", entryId);
            return
        }
        return recordingEntrySession.serializedActionsPromise.finally(() =>{ // check first that all chunks are completed
            let totalAddedChunks = _.reduce(recordingEntrySession.flavorsChunksCounter,(memo,flavorChunks)=>{
                return memo+ flavorChunks
            }, 0)
                //todo should also print warning if # of chunks is not equall between all flavors!
            if (totalAddedChunks == 0 ){
                logger.warn("[%s-%s][stopRecording] No chunks added to entry", entryId, recordedEntryId)
                delete this.recordingList[entryId];
                return
            }

            let recordingDuration = recordingEntrySession.getDuration().toString();
            let stampFilePath = path.join(recordingSessionPath, 'stamp')
            let destFilePath = path.join(this.completedRecordingFolderPath, entryId + '_' + recordedEntryId + '_' + recordingDuration);
            return qio.write(stampFilePath, recordingDuration)
                .then(()=>{
                    if (recordingEntrySession.serverType  !== kalturaTypes.KalturaEntryServerNodeType.LIVE_PRIMARY){
                        logger.info("[%s-%s] Entry is backup, skip of create soft link",  entryId, recordedEntryId)
                        return Q.resolve()
                    }

                    return qio.symbolicLink(destFilePath, recordingSessionPath, 'directory')
                })
                .then(()=> {
                    delete this.recordingList[entryId];
                    logger.info("[%s-%s] Successfully create soft link from %s, into %s, recording chunks in this session: [%s]", entryId, recordedEntryId, recordingSessionPath, destFilePath, totalAddedChunks);
                    return Q.resolve()
                })
                .then(()=> {
                    let doneFilePath = path.join(recordingSessionPath, 'done')
                    return qio.write(doneFilePath, 'done')
                })
                .catch((err) => {
                    logger.error(ErrorUtils.error2string(err))
                })
            })

}


}
if (!configRecording.enable){
    return
}
let recordingManager = new RecordingManager()
module.exports = recordingManager