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
const unknownEntry = "UNKNOWN";
const backendClient = require('../BackendClientFactory.js').getBackendClient();

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
        //veryfiy that recordingMaxDurationInHours is no longer that
        this.recordingMaxDurationInMs = config.get("recording").recordingMaxDurationInHours * 60 * 60 * 1000;
        this.recordingMinDurationInMS = config.get("recording").recordingMinDurationInSec * 1000;
        this.recordingList = {};

        logger.info("Initializing recording manager");

        setInterval(()=> {
            this.handleRecordingEntries()
        }, recordingTimeInterval, this);
    }

    startRecording(entryObj, mp4FilesQueue = null){
        return Q.resolve().then(()=> {
            function makeFlavorDirectories(recordingEntrySession) {
                logger.debug(`[${entryObj.entryId}-${entryObj.recordedEntryId}] About to create directories ${recordingEntrySession.flavors}`);
                let creatingDirectoriesPromise = _.map(recordingEntrySession.flavors, (flavorId)=> {
                    let flavorPath = path.join(recordingEntrySession.recordingSessionPath, flavorId)
                    return qio.makeDirectory(flavorPath)
                });
                return Q.allSettled(creatingDirectoriesPromise)
                    .then((results)=> {
                        _.each(results, (promise)=> {
                            if (promise.state === 'rejected') {
                                if (promise.reason && promise.reason.code === 'EEXIST') {
                                    logger.debug(`[${entryObj.entryId}-${entryObj.recordedEntryId}] path ${promise.reason.path} already exist`);
                                }
                                else {
                                    logger.error(`[${entryObj.entryId}-${entryObj.recordedEntryId}] Failed to make directory ${ErrorUtils.error2string(promise.reason)}`);
                                }
                            }
                        })
                    })
            }
            function getRecordingEntrySession(entryObj) {
                let entryId = entryObj.entryId;
                if (!entryObj.recordedEntryId) {
                    entryObj.recordedEntryId =  unknownEntry;
                    logger.warn(`[${entryObj.entryId}] Entry has no recordedEntryId`);
                }
                if (!this.recordingList[entryId]) {
                    logger.info(`[${entryObj.entryId}-${entryObj.recordedEntryId}] Create new recording session`);
                    let recordingEntrySession = new RecordingEntrySession(entryObj);
                    this.recordingList[entryId] = recordingEntrySession;
                    return Q.resolve(recordingEntrySession);
                }
                else if (this.recordingList[entryId].recordedEntryId != entryObj.recordedEntryId) {
                    logger.info(`[${entryObj.entryId}-${entryObj.recordedEntryId}] New recorded entryId has been generated. Delete existed session and start new one`);
                    return this.stopRecording(entryObj.entryId)
                        .then(()=> {
                            let recordingEntrySession = new RecordingEntrySession(entryObj, mp4FilesQueue);
                            this.recordingList[entryId] = recordingEntrySession;
                            return Q.resolve(recordingEntrySession);
                        })
                        .catch((error)=> {
                            return Q.reject(error);
                        });
                }
                else {
                    logger.info(`[${entryObj.entryId}-${entryObj.recordedEntryId}] Found a previous recording session, update time stamp`);
                    this.recordingList[entryId].lastUpdateTime = new Date();
                    return Q.resolve(null);
                }
            }

            const startExistSession = (recordingEntrySession)=> {
                logger.debug(`[${entryObj.entryId}-${entryObj.recordedEntryId}] startExistSession`);
                let doneFilePath = path.join(recordingEntrySession.recordingSessionPath, 'done');
                return recordingEntrySession.accessibleRecording()
                    .then(()=>{
                        return qio.exists(doneFilePath)
                    })
                    .then((fileDoneExist)=> {

                        if (fileDoneExist) {
                            logger.debug(`[${entryObj.entryId}-${entryObj.recordedEntryId}] file-done exists, remove it`);
                            return qio.remove(doneFilePath)
                        }
                        else {
                            logger.warn(`[${entryObj.entryId}-${entryObj.recordedEntryId}] file done is not exist, check for restoration`);
                            return makeFlavorDirectories(recordingEntrySession).then(()=>{
                                return recordingEntrySession.restoreSession()
                            })
                        }
                    })
            };
            const startNewSession = (recordingEntrySession)=> {
                logger.debug(`[${entryObj.entryId}-${entryObj.recordedEntryId}] startNewSession`);
                return qio.makeTree(recordingEntrySession.recordingSessionPath)
                    .then(()=>{
                        return makeFlavorDirectories(recordingEntrySession)
                    })
                    .then(()=>{
                        return recordingEntrySession.accessibleRecording()
                    })
            };

            let startRecordingTime = new Date();
            logger.debug(`[${entryObj.entryId}-${entryObj.recordedEntryId}] Start recording`);
            return getRecordingEntrySession.call(this, entryObj)
                .then((recordingEntrySession)=> {
                    if (recordingEntrySession == null) {
                        return Q.resolve();
                    }
                    let startSessionPromise;
                    return qio.exists(recordingEntrySession.recordingSessionPath).then((sessionExist)=> {
                        if (sessionExist) {
                            startSessionPromise = startExistSession(recordingEntrySession);
                        }
                        else {
                            startSessionPromise = startNewSession(recordingEntrySession);
                        }
                        return startSessionPromise
                            .then(()=> {
                                // Once start process is complete, release lock on files queue
                                recordingEntrySession.mp4FilesQueueLock = false;
                                let startRecordingTimeDuration = new Date() - startRecordingTime;
                                logger.info(`[${entryObj.entryId}-${entryObj.recordedEntryId}] Start recording is completed, time : ${startRecordingTimeDuration} ms`);
                            })
                    });
                })
                .catch((err)=> {
                    // In case of error, pass message on and print to log
                    return Q.reject(err);
                });
        }).catch((err)=>{
            logger.error(`[${entryObj.entryId}-${entryObj.recordedEntryId}] Error while trying to start recording : ${ErrorUtils.error2string(err)}, delete object`);
            delete this.recordingList[entryObj.entryId];
            return Q.reject()
        })
    }

    stopLive(entryId){
        let recordingEntrySession = this.recordingList[entryId];
        if (!recordingEntrySession) {
            logger.warn("[%s] Can't updateServer recording, entry does not exist on recording list", entryId);
            return
        }
        if (this.isRecordedEntryUnknown(recordingEntrySession.recordedEntryId)){
            this.replaceUnknownRecordedEntry(recordingEntrySession);
        }
        recordingEntrySession.updateEntryDuration(true)
    }

    splitRecording(entryId) {
        let recordingSession = this.recordingList[entryId];
        if (!recordingSession.mp4FilesQueueLock) {
            recordingSession.mp4FilesQueueLock = true;
            logger.info(`[${entryId}] Recording entry ${this.recordingList[entryId].recordedEntryId} has passed the limit of recording duration - ${this.recordingMaxDurationInMs/1000} seconds. Split session`);
            return recordingSession.handleRecordingReachedMaxDuration()
                .then((newRecordedEntryId)=> {
                    logger.info(`[${entryId}] Successfully created new recordedEntryId: [${newRecordedEntryId}]; restart session`);
                    recordingSession.entryObject.recordedEntryId = newRecordedEntryId;
                    // Pass startRecording the queue of previous session in case there are files waiting to be written
                    return this.startRecording(recordingSession.entryObject, recordingSession.mp4FilesQueue);
                })
                .then(()=> {
                    logger.info(`[${entryId}] Split process completed successfully`);
                })
                .catch((err)=> {
                    logger.error(`[${entryId}] Error splitting recording for entry. Error: ${ErrorUtils.error2string(err)}`);
                });
        }
    }

    isRecordedEntryUnknown(recordedEntryId){
        return recordedEntryId === unknownEntry
    }

    addNewChunks (Mp4Files, entryId, flavorId) {
        let recordingEntrySession =  this.recordingList[entryId];
        let chunksNameChained = _.reduce(Mp4Files, function (str, obj) {
            return str + obj.chunkName + " ";
        }, "");

        logger.info(`[${entryId}] Receiving new chunks: ${chunksNameChained}`);

        if (!recordingEntrySession) {
            logger.info(`[${entryId}] Entry does not exist in recording list. Maybe entry has passed the limit of max duration`);
            return
        }

        if (recordingEntrySession.getDurationMSec() > this.recordingMaxDurationInMs) {
            this.splitRecording(entryId);
        }
        // update lastUpdateTime
        recordingEntrySession.lastUpdateTime = new Date();

        let Mp4FilesClone = _.clone(Mp4Files);
        recordingEntrySession.updateRecordingFiles(Mp4FilesClone, flavorId);
    }

    handleRecordingEntries(){
        let now = new Date();
        // Function is not used anywhere in the project!

        function isRecordingFinish(recordingSession) {
            if (now - recordingSession.lastUpdateTime > recordingSession.recordingSessionDuration){
                logger.info("[%s-%s] recording  didn't get new chunks for %d - stop recording", recordingSession.entryId, recordingSession.recordedEntryId, recordingSession.recordingSessionDuration);
                return true
            }
            if (recordingSession.playlistGenerator.MaxClipCountReached()){
                logger.warn("[%s-%s] recording  has passed num of clips - stop recording", recordingSession.entryId, recordingSession.recordedEntryId);
                return true
            }
            return false
        }

        try {
            logger.debug("Check for end recording session");
            _.each(this.recordingList,  (element, entryId) =>{
                logger.debug("[%s] handleRecordingEntries-  now:[%s], duration: [%s], element: [%j]",
                    element.recordingSessionId, now, element.getDurationMSec() / 1000, element);

                if (this.isRecordedEntryUnknown(element.recordedEntryId)) {
                    this.replaceUnknownRecordedEntry(element)
                }
                if (isRecordingFinish(element)) {
                    this.stopRecording(entryId);
                }
            });
            logger.info("Available recording entry: %j", _.keys(this.recordingList));
        } catch (err) {
            logger.error("Error while trying to run handleRecordingEntries: %s ", ErrorUtils.error2string(err))
        }
    }

    replaceUnknownRecordedEntry(recordingEntrySession) {
        try {
            if (recordingEntrySession.changeRecordingIsRunning === true){
                return Q.reject("changeRecordingIsRunning is still running")
            }
            recordingEntrySession.changeRecordingIsRunning = true;
            logger.debug("[%s][recplaceUnknownRecordedEntry][1 of 4] About to call get entry");
            let entryId = recordingEntrySession.entryId;
            let oldRecordingSessionPath = recordingEntrySession.recordingSessionPath;
            let recordedEntryId;
            let deferred = Q.defer();
            return backendClient.getEntryInfo(entryId)
                .then((entryObj)=> {

                    if (entryObj.recordedEntryId) {
                        recordedEntryId = entryObj.recordedEntryId;
                        logger.debug("[%s] Found recordedEntryId : %s", entryId, recordedEntryId)
                        return Q.resolve(recordedEntryId)
                    }
                    else {
                        return Q.reject("recordedEntryId not exist on entry object")
                    }
                })
                .then((recordedEntryId)=> {
                    logger.debug("[%s-%s][replaceUnknownRecordedEntry][2 of 4] About to call changeRecordedEntry on recordingEntrySession", entryId, recordedEntryId);

                    recordingEntrySession.serializedActionsPromise = deferred.promise; //lock the ability to change playlistJson, in order to avoid race-condition
                    return recordingEntrySession.changeRecordedEntry(recordedEntryId);
                }).then(()=> {
                    logger.debug("[%s-%s][replaceUnknownRecordedEntry][3 of 4] About to change directory name from [%s] to [%s]", entryId, recordedEntryId, oldRecordingSessionPath, recordingEntrySession.recordingSessionPath)
                    return qio.rename(oldRecordingSessionPath, recordingEntrySession.recordingSessionPath)
                })
                .then(()=> {
                    logger.debug("[%s-%s][replaceUnknownRecordedEntry][4 of 4] About to export it to live directory", entryId, recordedEntryId);
                    return recordingEntrySession.accessibleRecording()
                })
                .catch((err)=> {
                    logger.error("[%s] Failed to changeRecordedEntry: %s", entryId, ErrorUtils.error2string(err))
                })
                .finally(()=> {
                    logger.info("[%s-%s][replaceUnknownRecordedEntry] Finished successfully", entryId, recordedEntryId);
                    recordingEntrySession.changeRecordingIsRunning = false;
                    deferred.resolve()

                })
        }
        catch (err){
            logger.error("Failed to changeRecordedEntry: %s", ErrorUtils.error2string(err))
        }
    }

    stopRecording(entryId) {
        if (this.recordingList[entryId]) {
            let recordingEntrySession = this.recordingList[entryId];
            if (!recordingEntrySession) {
                logger.warn(`[${entryId}][stopRecording] Can't stop recording, entry doesn't exist on recording list`);
                return Q.resolve();
            }
            let doneFilePath = path.join(recordingEntrySession.recordingSessionPath, 'done');
            return recordingEntrySession.serializedActionsPromise
                .finally(() => { // check first that all chunks are completed
                    let totalAddedChunks = _.reduce(recordingEntrySession.flavorsChunksCounter, (memo, flavorChunks) => {
                        return memo + flavorChunks
                    }, 0);
                    //todo should also print warning if # of chunks is not equal between all flavors!
                    let recordingSessionDuration = recordingEntrySession.getDurationMSec() - recordingEntrySession.startDuration;
                    if (recordingSessionDuration < this.recordingMinDurationInMS) {
                        logger.warn(`[${entryId}-${recordingEntrySession.recordedEntryId}][stopRecording] Recording duration is less than minimum required, do nothing. Start: [${recordingEntrySession.getDurationMSec()}], Current: [${recordingEntrySession.startDuration}], totalAddedChunks: [${totalAddedChunks}]`);
                        delete this.recordingList[entryId];
                        return qio.write(doneFilePath, 'done')
                    }
                    let recordingDuration = recordingEntrySession.getDurationMSec().toString();
                    let stampFilePath = path.join(recordingEntrySession.recordingSessionPath, 'stamp');
                    return qio.write(stampFilePath, recordingDuration)
                        .then(() => {
                            if (this.isRecordedEntryUnknown(recordingEntrySession.recordedEntryId)) {
                                logger.error(`[${entryId}-${recordingEntrySession.recordedEntryId}][stopRecording]: recorded entry is unknown, skip creating soft link`);
                                return Q.resolve()
                            }
                            if (recordingEntrySession.serverType !== kalturaTypes.KalturaEntryServerNodeType.LIVE_PRIMARY) {
                                logger.info(`[${entryId}-${recordingEntrySession.recordedEntryId}][stopRecording] entry is backup, skip creating soft link`);
                                return Q.resolve()
                            }
                            let destFilePath = path.join(this.completedRecordingFolderPath, entryId + '_' + recordingEntrySession.recordedEntryId + '_' + recordingDuration);
                            return qio.symbolicLink(destFilePath, recordingEntrySession.recordingSessionPath, 'directory')
                                .then(() => {
                                    logger.info(`[${entryId}-${recordingEntrySession.recordedEntryId}][stopRecording] Successfully create soft link from ${recordingEntrySession.recordingSessionPath} to ${destFilePath}; Recording chunks in this session: [${totalAddedChunks}] recordingSessionDuration [${recordingSessionDuration}]`);
                                })
                        })
                        .then(() => {
                            delete this.recordingList[entryId];
                            return qio.write(doneFilePath, 'done');
                        })
                        .catch((err) => {
                            return Q.reject(err);
                        })
                })
                .catch((err) => {
                    logger.error(`[${entryId}-${recordingEntrySession.recordedEntryId}][stopRecording] Failure: ${ErrorUtils.error2string(err)}`);
                    return Q.reject(err);
                });
        }
        else {
            return Q.resolve();
        }
    }


}
if (!configRecording.enable){
    return
}
let recordingManager = new RecordingManager()
module.exports = recordingManager