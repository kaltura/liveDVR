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

class RecordingManager {
//todo what to do if we stop stream and start, but other machine has start to get it
//todo move all path join baseName etc to persistent format
//todo check zero bytes only in staring or each one?
//todo start recording on flavordownlowner, check
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
        let configRecording = config.get("recording")
        const recordingTimeInterval = configRecording.recordingTimeInterval;
        const completedRecordingFolderPath = configRecording.completedRecordingFolderPath;
        const recordingMaxDuration = configRecording.recordingMaxDuration;
        const recordingList = {};

        logger.info("Initializing recording manager");


        const startRecording = (entryObj, flavorsObjArray) => {

            function makeFlavorDirectories() {
                logger.debug("[%s-%s] About to create directories %s", entryObj.entryId, entryObj.recordedEntryId, recordingEntrySession.flavors)
                let creatingDirectroriesPromise = _.map(recordingEntrySession.flavors, (flavorId)=> {
                    let flavorPath = path.join(recordingEntrySession.recordingSessionPath, flavorId)
                    return qio.makeDirectory(flavorPath)
                })
                return Q.allSettled(creatingDirectroriesPromise)
                    .then((results)=> {
                        //todo should check for error
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
            //todo function should wrapped by try catch? or catch promise in the end to see if succsedd?
            let recordingEntrySession
            let entryId = entryObj.entryId
            if (!recordingList[entryId]) { // if this flavor is the first todo check that no race between flavor
                recordingEntrySession = new RecordingEntrySession(entryObj, flavorsObjArray)
                recordingList[entryId] = recordingEntrySession
            }
            else {
                logger.info("[%s-%s] Found a previous recording session.", entryObj.entryId, entryObj.recordedEntryId)
                recordingEntrySession = recordingList[entryId]
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
        //todo function should wrapped by try catch? or catch promise in the end to see if succsedd?
            const addNewChunks = (Mp4Files, entryId, duration) => {

                let recordingEntrySession
                let chunksNameChained = _.reduce(Mp4Files, function (str, obj) {
                    return str + obj.chunkName + " ";
                }, "");

                if (!recordingList[entryId]) {
                    logger.warn("Recording of entry %s is not exist on recording list ", entryId);
                    return
                }

                if (recordingList[entryId].duration > recordingMaxDuration) {
                    logger.warn("Recording %s of entry %s has passed the limit of recording duration - %s seconds", recordingList[entryId].recordedEntryId, entryId, recordingList[entryId].duration)
                    return;
                }

                recordingEntrySession = recordingList[entryId]

                let recordedEntryId = recordingEntrySession.recordedEntryId;
                logger.info("[%s-%s] Receiving new chunks :%s", entryId, recordedEntryId, chunksNameChained);

                // update lastTimeUpdateChunk
                recordingList[entryId].lastTimeUpdateChunk = new Date();
                return recordingEntrySession.LinkAndUpdateJson(Mp4Files)
            }

            const handleRecordingEntries = () => {
                try {
                    let now = new Date();
                    logger.debug("Check for end recording session");
                    _.each(recordingList, function (element, entryId) {
                        logger.debug("[%s-%s] handleRecordingEntries-  now:%s, element: %j", entryId, element.recordedEntryId, now, element)
                        if (now - element.lastTimeUpdateChunk > element.recordingSessionDuration) {
                            logger.info("[%s-%s] recording  didn't get new chunks for %d - stop recording", entryId, element.recordedEntryId, element.recordingSessionDuration);
                            stopRecording(entryId, element.recordedEntryId, element.recordingSessionPath)
                        }
                    });
                    logger.info("Available recording entry: %j", _.keys(recordingList));
                } catch (err) {
                    logger.error("Error while trying to run handleRecordingEntries: %s ", ErrorUtils.error2string(err))
                }
            }

            const stopRecording = (entryId, recordedEntryId, recordingSessionPath) => {

                let now = new Date().getTime().toString()
                let destFilePath = path.join(completedRecordingFolderPath, entryId + '_' + recordedEntryId + '_' + now);
                return qio.symbolicLink(destFilePath, recordingSessionPath, 'directory')
                    .then(function () {
                        delete recordingList[entryId];
                        logger.info("[%s-%s] Successfully create soft link from %s, into %s", entryId, recordedEntryId, recordingSessionPath, destFilePath);
                        return Q.resolve()
                    })
                    .then(function () {
                        let doneFilePath = path.join(recordingSessionPath, 'done')
                        return qio.write(doneFilePath, 'done')
                    })
                    .catch(function (err) {
                        logger.error(ErrorUtils.error2string(err))
                    })

            }



        this.startRecording = startRecording
        this.addNewChunks = addNewChunks
        setInterval(handleRecordingEntries, recordingTimeInterval)
    }
}
module.exports = new RecordingManager();
