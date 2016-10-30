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
class RecordingManager {
//todo what to do if we stop stream and start, but other machine has start to get it
//todo move all path join baseName etc to persistent format
//todo check zero bytes only in staring or each one?
// should also recording for primary ?
    //todo recording enable check where!
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
        this.recordingMaxDuration = configRecording.recordingMaxDurationInHours * 60 * 60;
        this.recordingList = {};

        logger.info("Initializing recording manager");

        setInterval(()=>{
            this.handleRecordingEntries()
        }, recordingTimeInterval, this)
    }

     startRecording(entryObj, flavorsObjArray){
        // todo what should do if startRecording failed? should flavordownload should also failed?
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
        let recordingEntrySession
        let entryId = entryObj.entryId
        if (!this.recordingList[entryId]) {
            logger.info("[%s-%s] Create new recording session.", entryObj.entryId, entryObj.recordedEntryId)
            recordingEntrySession = new RecordingEntrySession(entryObj, flavorsObjArray)
            this.recordingList[entryId] = recordingEntrySession
        }
        else {
            logger.info("[%s-%s] Found a previous recording session.", entryObj.entryId, entryObj.recordedEntryId)
            recordingEntrySession = this.recordingList[entryId]
            //todo what todo? should check that no configuarion changed?
        }
        let recordingSessionPath = recordingEntrySession.recordingSessionPath;
        return qio.exists(recordingSessionPath).then((sessionExist)=> {
            if (sessionExist) {
                let doneFilePath = path.join(recordingSessionPath, 'done');
                return qio.exists(doneFilePath).then((fileDoneExist)=> {
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
            else {
                return qio.makeTree(recordingSessionPath).then(()=>{
                    return makeFlavorDirectories()
                })
            }
        }).then(()=> {
            return recordingEntrySession.accessibleRecording()
        }).catch((err)=>{
            logger.error("[%s-%s] Error while try to start recording : %s", entryObj.entryId, entryObj.recordedEntryId, ErrorUtils.error2string(err))
        })
}
    addNewChunks (Mp4Files, entryId){

        let recordingEntrySession =  this.recordingList[entryId];
        let chunksNameChained = _.reduce(Mp4Files, function (str, obj) {
            return str + obj.chunkName + " ";
        }, "");

        logger.info("[%s] Receiving new chunks :%s", entryId , chunksNameChained);

        if (!recordingEntrySession) {
            logger.warn("Recording of entry %s is not exist on recording list: %s ", entryId, chunksNameChained);
            return
        }

        let recordingDuration = recordingEntrySession.getDuration() / 1000;
        if (recordingDuration > this.recordingMaxDuration) {
            logger.warn("Recording %s of entry %s has passed the limit of recording duration - %s seconds", this.recordingList[entryId].recordedEntryId, entryId,recordingDuration)
            return;
        }

        // update lastTimeUpdateChunk
        this.recordingList[entryId].lastTimeUpdateChunk = new Date();
        return recordingEntrySession.LinkAndUpdateJson(Mp4Files);
        if (!this.ppp) {
            this.ppp=Q.resolve();
        }
        this.ppp=this.ppp.finally( () => {
            return recordingEntrySession.LinkAndUpdateJson(Mp4Files);
        });
}

    handleRecordingEntries(){
        try {
            let now = new Date();
            logger.debug("Check for end recording session");
            _.each(this.recordingList,  (element, entryId) =>{
                logger.debug("[%s] handleRecordingEntries-  now:[%s], duration: [%s], element: [%j]",
                    element.recordingSessionId,  element.getDuration() / 1000,  now, element);
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

        let recordingDuration = this.recordingList[entryId].getDuration().toString()
        let destFilePath = path.join(this.completedRecordingFolderPath, entryId + '_' + recordedEntryId + '_' + recordingDuration);
        return qio.symbolicLink(destFilePath, recordingSessionPath, 'directory')
            .then(()=> {
                delete this.recordingList[entryId];
                logger.info("[%s-%s] Successfully create soft link from %s, into %s", entryId, recordedEntryId, recordingSessionPath, destFilePath);
                return Q.resolve()
            })
            .then(()=> {
                let doneFilePath = path.join(recordingSessionPath, 'done')
                return qio.write(doneFilePath, 'done')
            })
            .catch((err) => {
                logger.error(ErrorUtils.error2string(err))
            })

}


}
if (!configRecording.enable){
    return
}
let recordingManager = new RecordingManager()
module.exports = recordingManager