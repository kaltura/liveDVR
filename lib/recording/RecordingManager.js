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
const persistenceFormat = require('./../../common/PersistenceFormat');
const unknownEntry = "UNKNOWN"
const backendClient = require('../BackendClientFactory.js').getBackendClient();
const recordingRootPath = config.get('recording').recordingFolderPath;

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
        this.recordingList = {};

        logger.info("Initializing recording manager");

        setInterval(()=>{
            this.handleRecordingEntries()
        }, recordingTimeInterval, this)
    }

    startRecording(entryObj, flavorsObjArray){
        return Q.resolve().then(()=> {


             function handleStreamNotMatchTranscodingProfile() {

                 // configFlavors in actually the flavors suiting live entry's transcoding profile
                 let flavorsList = entryObj.configFlavors.split(',').map(function(item) {
                     return item.trim();
                 });
                 let promises = _.map(flavorsList, (flavorId) => {
                     if (flavorId !== '32') {
                         let flavorPath = path.join(recordingSessionPath, flavorId);
                         let flavorDstPath = flavorPath + '.delete';
                         return qio.rename(flavorPath, flavorDstPath)
                             .then((value) => {
                                logger.debug("[%s-%s] successfully renamed flavor %s dir to %s", entryObj.entryId, entryObj.recordedEntryId, flavorId, flavorDstPath);
                             })
                             .catch((err) => {
                                 if (err.code && err.code === 'ENOENT') {
                                     logger.warn("[%s-%s] dir %s not found, cannot rename it to %s", entryObj.entryId, entryObj.recordedEntryId, flavorId, flavorDstPath)
                                 } else {
                                     logger.error("[%s-%s] failed to rename flavor %d dir. Error: %s", entryObj.entryId, entryObj.recordedEntryId, flavorId, ErrorUtils.error2string(err));
                                 }
                             });
                     } else {
                         return Q.resolve();
                     }
                 });

                 return Q.allSettled(promises)
                     .then(() => {
                      let srcPath = path.join(recordingSessionPath, 'playlist.json');
                      let dstPath = path.join(recordingSessionPath, 'playlist.json.delete');
                      return qio.rename(srcPath, dstPath)
                          .then(() => {
                              logger.debug("[%s-%s] successfully renamed playlist.json to %s. Reason for renaming dir, provisioned stream doesn't match transcoding profile", entryObj.entryId, entryObj.recordedEntryId, dstPath);
                          }).catch((err) => {
                              if (err.code && err.code === 'ENOENT') {
                                  logger.debug("[%s-%s] playlist.json not found, cannot rename it to %s", entryObj.entryId, entryObj.recordedEntryId, dstPath);
                              } else {
                                  logger.warn("[%s-%s] failed to rename playlist.json. Error: %s", entryObj.entryId, entryObj.recordedEntryId, recordingSessionPath, ErrorUtils.error2string(err));
                              }
                          });
                    }).catch((err) => {
                        logger.error("[%s-%s] failed to handle flavors mismatch to transcoding profile. Error: %s", entryObj.entryId, entryObj.recordedEntryId, ErrorUtils.error2string(err));
                         // todo: check if it is correct to swallow error here
                        return Q.resolve();
                    })
            }

            // the purpose of this function is to check if recording path exists and also verify
            // whether in previous time the live entry was streaming, flavors didn't match the transcoding profile
            function checkRecordingExists() {

                return qio.exists(recordingSessionPath)
                   .then((exists) => {
                       if (!exists) {
                           return Q.resolve({flavorsNotMatchTranscodingProfile: false, recordingSessionPath: false});
                       }
                       return qio.listDirectoryTree(recordingSessionPath)
                            .then((directories) => {
                                let re = /^[0-9]+$/;
                                let numFlavors = _.reduce(directories, (mem, dir) => {
                                    let flavorDir = dir.split('/').pop();

                                    let result = flavorDir.match(re);
                                    if (result) {
                                        return mem+1;
                                    } else {
                                        return mem;
                                    }

                                }, 0);

                                if (numFlavors === 1) {
                                    logger.debug("[%s-%s] found that flavors didn't match transcoding profile in previous recording session", entryObj.entryId, entryObj.recordedEntryId);
                                    return Q.resolve({
                                        flavorsNotMatchTranscodingProfile: true,
                                        recordingSessionPath: true
                                    });
                                }
                                return Q.resolve({
                                    flavorsNotMatchTranscodingProfile: false,
                                    recordingSessionPath: true
                                });
                            })
                            .catch((err) => {
                                logger.debug("[%s-%s] failed to check whether flavors didn't matched transcoding profile in previous recording session. Error: $s", entryObj.entryId, entryObj.recordedEntryId, ErrorUtils.error2string(err));
                                return Q.resolve({
                                    flavorsNotMatchTranscodingProfile: false,
                                    recordingSessionPath: true
                                });
                            })

                    })
            }

            function makeFlavorDirectories() {
                logger.debug("[%s-%s] About to create directories %s", entryObj.entryId, entryObj.recordedEntryId, recordingEntrySession.flavors);
                let creatingDirectoriesPromise = _.map(recordingEntrySession.flavors, (flavorId)=> {
                    let flavorPath = path.join(recordingEntrySession.recordingSessionPath, flavorId);
                    return qio.makeDirectory(flavorPath);
                });
                return Q.allSettled(creatingDirectoriesPromise)
                    .then((results)=> {
                        _.each(results, (promise)=> {
                            if (promise.state === 'rejected') {
                                if (promise.reason && promise.reason.code === 'EEXIST') {
                                    logger.debug("[%s-%s] path %s already exist", entryObj.entryId, entryObj.recordedEntryId, promise.reason.path);
                                }
                                else {
                                    logger.error("[%s-%s] Failed to make directory %s", entryObj.entryId, entryObj.recordedEntryId, ErrorUtils.error2string(promise.reason));
                                }
                            }
                        })
                    })
            }
            const getRecordingEntrySession = (streamNotMatchTranscodingProfile)=>{
                let that = this;
                let recordingEntrySession = null;
                let entryId = entryObj.entryId;
                if (!("recordedEntryId" in entryObj && entryObj.recordedEntryId != undefined)){
                    entryObj.recordedEntryId =  unknownEntry;
                    logger.warn("[%s] Entry has no recordedEntryId", entryObj.entryId);
                }
                if (streamNotMatchTranscodingProfile && that.recordingList[entryId]) {
                    if (that.recordingList[entryId].streamNotMatchTranscodingProfile) {
                        streamNotMatchTranscodingProfile = true;
                    }
                    delete that.recordingList[entryId];
                }
                if (!that.recordingList[entryId]) {
                    logger.info("[%s-%s] Create new recording session.", entryObj.entryId, entryObj.recordedEntryId);
                    if (streamNotMatchTranscodingProfile) {
                       let flavor32Obj = _.find(flavorsObjArray, (flavor) =>{
                           return flavor.name === '32';
                       });
                       recordingEntrySession = new RecordingEntrySession(entryObj, [flavor32Obj], streamNotMatchTranscodingProfile);
                    } else {
                        recordingEntrySession = new RecordingEntrySession(entryObj, flavorsObjArray, streamNotMatchTranscodingProfile);
                        that.recordingList[entryId] = recordingEntrySession;
                    }
                }
                else {
                    logger.info("[%s-%s] Found a previous recording session, update time stamp", entryObj.entryId, entryObj.recordedEntryId);
                    that.recordingList[entryId].lastTimeUpdateChunk = new Date();
                    recordingEntrySession = that.recordingList[entryId];
                }
                return recordingEntrySession;
            }

            const startExistSession = ()=>{
                logger.debug("[%s-%s] startExistSession", entryObj.entryId, entryObj.recordedEntryId);
                let doneFilePath = path.join(recordingSessionPath, 'done');
                return recordingEntrySession.accessibleRecording()
                    .then(()=>{
                        return qio.exists(doneFilePath)
                    })
                    .then((fileDoneExist)=> {

                        if (fileDoneExist) {
                            logger.debug("[%s-%s] file done exist, remove it ", entryObj.entryId, entryObj.recordedEntryId);
                            return qio.remove(doneFilePath)
                        }
                        else {
                            logger.warn("[%s-%s] file done is not exist, check for restoration", entryObj.entryId, entryObj.recordedEntryId);
                            return makeFlavorDirectories().then(()=>{
                                
                                return recordingEntrySession.restoreSession()
                            })
                        }
                    })
            };

            const startNewSession = ()=>{
                logger.debug("[%s-%s] startNewSession", entryObj.entryId, entryObj.recordedEntryId)
                return qio.makeTree(recordingSessionPath)
                    .then(()=>{
                        return makeFlavorDirectories()
                    })
                    .then(()=>{
                        return recordingEntrySession.accessibleRecording()
                    })
            };

            let startRecordingTime = new Date();
            logger.debug("[%s-%s] Start recording ", entryObj.entryId, entryObj.recordedEntryId);
            let recordingSessionPath = persistenceFormat.getRecordedSessionPath(recordingRootPath, entryObj.entryId, entryObj.recordedEntryId, entryObj.recordStatus);
            let recordingEntrySession = getRecordingEntrySession(entryObj.flavorsNotMatchedTranscodingProfile);

            return checkRecordingExists(() => {
            }).then((result) => {
                if (result.flavorsNotMatchTranscodingProfile || entryObj.flavorsNotMatchedTranscodingProfile) {
                    recordingEntrySession.flavorsNotMatchTranscodingProfile = true;
                    logger.info("[%s-%s] flavors doesn't match transcoding profile. " +
                        "Only flavor '32' will be recorded. " +
                        "Unused flavors directories will be renamed. " +
                        "Full transcoridng will be done in BE", entryObj.entryId, entryObj.recordedEntryId);
                    return handleStreamNotMatchTranscodingProfile()
                        .then(() => {
                            logger.debug("[%s-%s] successfully initialized recording to record main flavor (32), reason: flavors don't match transcoding profile.", entryObj.entryId, entryObj.recordedEntryId);
                           return Q.resolve(result.recordingSessionPath);
                        })
                        .catch((err) => {
                            logger.error("[%s-%s] failed to handle flavor not matching transcoding profile. Error: %s", entryObj.entryId, entryObj.recordedEntryId, ErrorUtils.error2string(err));
                            return Q.resolve(result.recordingSessionPath);
                        })
                } else {
                    return Q.resolve(result.recordingSessionPath);
                }
            }).then((sessionExists) => {
                if (sessionExists) {
                    return startExistSession();
                } else {
                    return startNewSession();
                }
            }).then(()=> {
                let startRecordingTimeDuration = new Date() - startRecordingTime;
                logger.info("[%s-%s] Start recording is completed, time : %s ms", entryObj.entryId, entryObj.recordedEntryId, startRecordingTimeDuration);
            });

        }).catch((err)=> {
            logger.error("[%s-%s] Error while try to start recording : %s, delete object", entryObj.entryId, entryObj.recordedEntryId, ErrorUtils.error2string(err));
            if ( this.recordingList[entryObj.entryId]) {
                delete this.recordingList[entryObj.entryId];
            }
        })
    }

    stopLive(entryObject){

        let recordingEntrySession = this.recordingList[entryObject.entryId];
        if (!recordingEntrySession) {
            logger.warn("[%s] Can't updateServer recording, entry is not exist on recording list", entryObject.entryId);
            return
        }
        if (this.isRecordedEntryUnknown(recordingEntrySession.recordedEntryId)){
            this.replaceUnknownRecordedEntry(recordingEntrySession);
        }
        recordingEntrySession.updateEntryDuration(true)
    }


    isRecordedEntryUnknown(recordedEntryId){
        return recordedEntryId === unknownEntry
    }

    addNewChunks (Mp4Files, entryId, flavorId){


        let recordingEntrySession =  this.recordingList[entryId];

        let chunksNameChained = _.reduce(Mp4Files, function (str, obj) {
            return str + obj.chunkName + " ";
        }, "");

        logger.info("[%s] Receiving new chunks :%s", entryId , chunksNameChained);

        if (!recordingEntrySession) {
            logger.info("[%s] Entry is not exist on recording list: %s - maybe entry was passed the limit of max duration", entryId, chunksNameChained);
            return
        }

        if (recordingEntrySession.flavors.indexOf(flavorId) === -1) {
            logger.info("[%s] flavorId %s is not being recording. Chunk %s not added to recording", entryId, flavorId, chunksNameChained);
            return;
        }

        if (recordingEntrySession.getDuration() > this.recordingMaxDurationInMs) {
            logger.info("Recording %s of entry %s has passed the limit of recording duration - %s seconds", this.recordingList[entryId].recordedEntryId, entryId, this.recordingMaxDurationInMs)
            return;
        }

        // update lastTimeUpdateChunk
        recordingEntrySession.lastTimeUpdateChunk = new Date();

        let Mp4FilesClone= _.clone(Mp4Files)
        return recordingEntrySession.linkAndUpdateJson(Mp4FilesClone, flavorId);
    }

    handleRecordingEntries(){
        let now = new Date();
        function getRecordedEntry(entryId) {
            backendClient.getEntryInfo(entryId).then((entryObj)=>{
                if (!("recordedEntryId" in entryObj && entryObj.recordedEntryId != undefined)){
                    logger.error("[%s] getRecordedEntry: Can't find recordedEntryId", entryId)
                    return Q.reject()
                }
                return Q.resolve(entryObj.recordedEntryId)
            })

        }

        function isRecordingFinish(element) {
            if (now - element.lastTimeUpdateChunk > element.recordingSessionDuration){
                logger.info("[%s-%s] recording  didn't get new chunks for %d - stop recording", element.entryId, element.recordedEntryId, element.recordingSessionDuration);
                return true
            }
            if (element.playlistGenerator.MaxClipCountReached()){
                logger.warn("[%s-%s] recording  has passed num of clips - stop recording", element.entryId, element.recordedEntryId);
                return true
            }
            return false
        }

        try {

            logger.debug("Check for end recording session");
            _.each(this.recordingList,  (element, entryId) =>{
                logger.debug("[%s] handleRecordingEntries-  now:[%s], duration: [%s], element: [%j]",
                    element.recordingSessionId, now, element.getDuration() / 1000, element);

                if (this.isRecordedEntryUnknown(element.recordedEntryId)){
                    this.replaceUnknownRecordedEntry(element)
                }
                if (isRecordingFinish(element)) {
                    this.stopRecording(entryId, element.recordedEntryId, element.recordingSessionPath)
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
                    return recordingEntrySession.changeRecordedEntry(entryObj);
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
    stopRecording(entryId, recordedEntryId, recordingSessionPath){

        let doneFilePath = path.join(recordingSessionPath, 'done')
        let recordingEntrySession = this.recordingList[entryId];
        if (!recordingEntrySession) {
            logger.warn("[%s][stopRecording]  Can't stop recording, entry doesn't exist on recording list", entryId);
            return
        }
        return recordingEntrySession.serializedActionsPromise.finally(() =>{ // check first that all chunks are completed
            let totalAddedChunks = _.reduce(recordingEntrySession.flavorsChunksCounter,(memo,flavorChunks)=>{
                return memo+ flavorChunks
            }, 0)
            //todo should also print warning if # of chunks is not equall between all flavors!
            let recordingSessionDuration = recordingEntrySession.getDuration() - recordingEntrySession.startDuration
            if (! recordingSessionDuration > 0 ){
                logger.warn("[%s-%s][stopRecording] Entry duration hasn't changed, do nothing. start [%s] current[%s], totalAddedChunks [%s]", entryId, recordedEntryId, recordingEntrySession.getDuration(), recordingEntrySession.startDuration , totalAddedChunks)
                delete this.recordingList[entryId];
                return qio.write(doneFilePath, 'done')
            }

            let recordingDuration = recordingEntrySession.getDuration().toString();
            let stampFilePath = path.join(recordingSessionPath, 'stamp');
            return qio.write(stampFilePath, recordingDuration)
                .then(()=>{
                    if (this.isRecordedEntryUnknown(recordedEntryId)){
                        logger.error("[%s][stopRecording]: recorded entry is unknown, skip creating soft link", entryId);
                        return Q.resolve()
                    }
                    if (recordingEntrySession.serverType  !== kalturaTypes.KalturaEntryServerNodeType.LIVE_PRIMARY){
                        logger.info("[%s-%s][stopRecording] entry is backup, skip creating soft link",  entryId, recordedEntryId);
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
                    return qio.write(doneFilePath, 'done')
                })
                .catch((err) => {
                    logger.error("[stopRecording] Failed: %s", ErrorUtils.error2string(err))
                })
        })

    }


}
if (!configRecording.enable){
    return
}
let recordingManager = new RecordingManager()
module.exports = recordingManager