/**
 * Created by ron.yadgar on 17/07/2016.
 */
const Q = require('q');
const logger = require('../common/logger').getLogger("RecordingManager");
const util = require('util');
const events = require("events");
const config = require('./../common/Configuration');
const qio = require('q-io/fs');
const path = require('path');
const _ = require('underscore');
const glob = require('glob');
const ErrorUtils = require('./utils/error-utils');
const backendClient=require('./BackendClientFactory.js').getBackendClient();
const PlaylistGenerator = require('./playlistGenerator/PlaylistGenerator');
class RecordingManager { //todo check that this is primary!!!
    // todo Assumptions:
    /*
    1. No change configuration!
    2. recording window in not more that entry session window -  check it
    3. All chunks are comming at the same time
     */
    constructor() {
        const recordingTimeInterval = config.get("recordingTimeInterval");
        const completedRecordingFolderPath = config.get("completedRecordingFolderPath");
        const recordingDir = config.get('recordingFolderPath');
        const liveFolderPath = config.get('rootFolderPath');
        const recordingList = {};

        logger.info("Initializing recording manager");

        const startRecording =  (entryObject, flavorId) => {

            let recordingPath;
            let entryId = entryObject.entryId
            let createManifestPromise = Q.resolve()
            if (!recordingList[entryId]) { // if this flavor is the first todo check that no race between flavor
                let now = new Date().getTime()
                logger.info("Starting a new recording session for entry  %s", entryId);
                recordingPath =  path.join(recordingDir, entryId, entryObject.recordedEntryId)
                recordingList[entryId] = {
                    "recordingSessionDuration": entryObject.recordingSessionDuration,
                    "lastTimeUpdateChunk": now,
                    'recordedEntryId': entryObject.recordedEntryId,
                    "recordingPath" : recordingPath
                }

                //create palylist json
                let options = {
                    'recording' : true,
                    'recordingPath': recordingPath
                }
                let playlistGenerator =  new PlaylistGenerator(entryObject, options)
                recordingList[entryId].playlistGenerator = playlistGenerator
                createManifestPromise= playlistGenerator.initializeStart().then(()=>{
                    return playlistGenerator.finalizeStart()
                })

            }
            let recordingFlavorPath = path.join(recordingPath, flavorId);
            return qio.makeTree(recordingFlavorPath).then(()=> {
                return createManifestPromise.then(()=> {
                    let doneFilePath = path.join(recordingFlavorPath, 'done')
                    return qio.exists(doneFilePath).then((fileDoneExist)=> {
                        if (fileDoneExist) {
                            logger.info("Found previous recording session for entry: %s", entryObject.entryId)
                            return qio.remove(doneFilePath)
                                .catch((err)=> {
                                    logger.warn('Failed to remove done file at %s : %s', fileDoneExist, ErrorUtils.error2string(err))
                                })
                        }
                    })
                })
            })
        }

        const addNewChunks =  (Mp4Files, entryId, flavorId) =>{

            const checkForErrors = (results, entryId) => {
                const errs = ErrorUtils.aggregateErrors(results);
                if (errs.numErrors === results.length) {

                    throw new Error("Failed to start entry recording for entry: "+entryId+". All chunks link failed"); //todo should pass the error obj
                }
                if (errs.numErrors > 0) {
                    // Report an error (but proceed) if only some flavor downloaders could not be started
                    logger.error("Failed  to link chunk:  %s ", ErrorUtils.error2string(errs.err));
                }
            }



            let chunksNameChained = _.reduce(Mp4Files, function(str, obj){ return str+ obj.chunkName+ " " }, "")
            logger.info("Receiving new chunks from %s :%s", entryId, chunksNameChained);
            // update lastTimeUpdateChunk
            recordingList[entryId].lastTimeUpdateChunk = new Date().getTime(); //todo Assume key exist
            let recordingFlavorDir = path.join(recordingList[entryId].recordingPath, flavorId);

            // generate hard link for each of the file!
            var promises = _.map(Mp4Files, function (Mp4File) {
                let SourcefilePath = Mp4File.path;
                let DestFilePath = path.join(recordingFlavorDir, Mp4File.chunkName + ".mp4"); //todo change it
                return qio.link(SourcefilePath, DestFilePath)
            });
            return Q.allSettled(promises).then(function (results) {
                    checkForErrors(results, entryId);
                })
                .then(function () {
                    return recordingList[entryId].playlistGenerator.update(Mp4Files);
                })
                .catch(function (err) {
                    logger.error("Error occurred while try to add new chunks for entry %s: %j", entryId, ErrorUtils.error2string(err));
                    return Q.reject(err);
                })
        }

        const handleRecordingEntries =  () => {
            try {
                let now = new Date().getTime();
                logger.debug("Check for end recording session");
                _.each(recordingList, function (element, entryId) {
                    if (now - element.lastTimeUpdateChunk > element.recordingSessionDuration) { //todo what to do if we stop stream and start, but other machine has start to get it
                        logger.info("recording for entry %s didn't get new chunk for %d - stop recording", entryId, element.recordingSessionDuration);
                        let source = findSourceStreamId(entryId)
                        let recordingSessionDirectoryPath = path.join(element.recordingPath, source);
                        stopRecording(entryId, element.recordedEntryId, recordingSessionDirectoryPath);
                    }
                });
                logger.debug("Available recording entry: %j", _.keys(recordingList));    //todo on start or on the end? is it effective to explore list again?
            } catch (err) {
               logger.error("Error while trying to run handleRecordingEntries: %s ", ErrorUtils.error2string(err))
            }
        }

        const findSourceStreamId = (entryId) =>{
            return '32'
        }

        const stopRecording = (entryId, recordedEntryId, recordingSessionDirectoryPath) =>{

            let now = new Date().getTime().toString()
            let destFilePath = path.join(completedRecordingFolderPath, recordedEntryId + '_' +now);
            qio.symbolicCopy(recordingSessionDirectoryPath, destFilePath)
                .then(function(){
                    let doneFilePath = path.join(recordingSessionDirectoryPath, 'done')
                    qio.write(doneFilePath, 'done')
                })
                .then(function () {
                        delete recordingList[entryId];
                        logger.info("Successfully  creare soft link from %s, into %s", recordingSessionDirectoryPath, destFilePath);
                        return Q.resolve()
                    })
                .catch(function (err) {
                    logger.error(ErrorUtils.error2string(err))
                    // todo what to do ?
                })
        }


        const onStartUp = ()=> { //todo onsttartup shoulf finish before open new entry downloaders!

            const getEntryObject = (entryId)=> {
                return backendClient.getEntryInfo(entryId)
            };

            const getLastUpdateChunk = (DirectoryPath) => {
                /*
                last update chunk is in fact, the last time where the directory has been changed.
                However, note that the last is true, only with the assumption that no action on the folder is  done
                except insert
                 */
                return qio.stat(DirectoryPath).then((fileStat) => {
                                let lastModifiedSessionDir =fileStat.node.mtime.getTime()
                                return lastModifiedSessionDir  // retutn two valued
                            })
            }

            const checkAndGetMissionChunks = (chunksDirLivePath, chunksRecordingPath, enrtyId) =>{

                return qio.list(chunksDirLivePath).then((fileList)=>{
                    let promises =_.each(fileList, (fileName)=>{
                        let filePath = path.join(chunksRecordingPath, fileName)
                        return qio.exists(filePath).then((fileExist)=>{
                            if (!fileExist){
                                let sourceFIle = path.join(chunksDirLivePath, fileName)
                                logger.warn("Detect unlink file for entry %s, create hard-link for %s", enrtyId, fileName)
                                return qio.link(sourceFIle, filePath)
                            }
                        })
                    })
                    return Q.allSettled(promises).then((results)=>{
                            const errs = ErrorUtils.aggregateErrors(results);
                            if (errs.numErrors > 0) {
                                logger.error(errs.err.message)
                            }
                    })
                })
            }


            let pGlob = Q.denodeify(glob);
            return pGlob(path.join(recordingDir, '*/')) // get all folders in recording dir
            //todo add entry id pattern to regex?
                    .then((recordedEntryList)=> {

                        let now = new Date().getTime();
                        let CheckRecordedEntryPromises = _.map(recordedEntryList, function (recordingEntryDirectoryPath) {

                            let entryId = path.basename(recordingEntryDirectoryPath)
                            let deferred = Q.resolve(); //todo change it
                            return getEntryObject(entryId).then((entryObj)=> {
                                let recordedEntryId = entryObj.recordedEntryId; //todo wrapped by try catch for each entry, to deny null pointer exeption etc...
                                let source = findSourceStreamId(entryId)
                                let recordingSessionDirectoryPath = path.join(recordingEntryDirectoryPath, recordedEntryId, source)
                                let chunksDirLivePath = path.join(liveFolderPath, entryId, source)
                                return checkAndGetMissionChunks(chunksDirLivePath, recordingSessionDirectoryPath, entryId).then(()=>{
                                    return getLastUpdateChunk(recordingSessionDirectoryPath).then((lastTimeUpdateChunk)=> {
                                        if (now - lastTimeUpdateChunk > entryObj.recordingSessionDuration) {    // if session is expired, move directory
                                            qio.exists(path.join(recordingSessionDirectoryPath, 'done')).then((fileDoneExist)=> {
                                                if (!fileDoneExist) {
                                                    logger.info("onStartUp: recorded entry %s didn't get new chunk for %d seconds- stop recording", entryId, recordingSessionDuration / 1000);
                                                    deferred = stopRecording(entryId, recordedEntryId, recordingSessionDirectoryPath)
                                                }
                                            })
                                        }
                                        else {

                                            recordingList[entryId] = {
                                                "recordingSessionDuration": entryObj.recordingSessionDuration,
                                                "lastTimeUpdateChunk": now,
                                                'recordedEntryId': entryObj.recordedEntryId,
                                                "recordingPath": path.join(recordingEntryDirectoryPath, recordedEntryId)
                                            }
                                            /*
                                             let options = {
                                             'isNewSession' : false,
                                             'isRecording' : true,
                                             'recordingPath': recordingPath
                                             }
                                             let playlistGenerator =  new PlaylistGenerator(entryObj, options)
                                             recordingList[entryId].playlistGenerator = playlistGenerator
                                             deferred= playlistGenerator.createManifest();
                                             */
                                    }
                                })
                                })
                            })
                        })
                        return Q.allSettled(CheckRecordedEntryPromises).then(function (results) {
                            const errs = ErrorUtils.aggregateErrors(results);
                            if (errs.numErrors > 0) {
                                logger.error(errs.err.message)
                            }
                        })
                    })
                .catch(function (err) {
                    logger.error(ErrorUtils.error2string(err));
                })
        }

        //this.start = onStartUp
        this.start = ()=>{ return Q.resolve() }
        this.startRedording = startRecording
        this.addNewChunks = addNewChunks
        setInterval(handleRecordingEntries, recordingTimeInterval)
        }

    }
module.exports = new RecordingManager();
