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
class RecordingManager {
    //todo check that this is primary!!!
    //todo find new name for all recording dir hierarchy
    // todo limit to 24 hours
    //
    //change then style, and fix indentation
    // todo Assumptions:
    /*
    1. No change configuration!
    2. recording window in not more that entry session window -  check it
    3. All chunks are comming at the same time
     */
    constructor() {
        const pGlob = Q.denodeify(glob);
        const recordingTimeInterval = config.get("recordingTimeInterval");
        const completedRecordingFolderPath = config.get("completedRecordingFolderPath");
        const recordingDir = config.get('recordingFolderPath');
        const liveFolderPath = config.get('rootFolderPath');
        const recordingList = {};

        logger.info("Initializing recording manager");


        const accessibleRecording = (playlistGenerator ,recordedEntryId, recordingPath) =>{
            /*
             Create manifest,and then crate symbolic link to live
             */
            return playlistGenerator.initializeStart().then(()=>{
                return playlistGenerator.finalizeStart().then(()=>{
                    let accessibleRecordingFolder = path.join(liveFolderPath, recordedEntryId)
                    return qio.exists(accessibleRecordingFolder).then((isExist)=>{
                        if (!isExist){
                            logger.info("Accessible recording entry %s", recordedEntryId)
                            return qio.symbolicLink(accessibleRecordingFolder, recordingPath, 'directory')
                        }
                    })
                })
            })
        }

        const startRecording =  (entryObj, flavorId) => {

            let recordingPath;
            let entryId = entryObj.entryId
            let createManifestPromise = Q.resolve()
            if (!recordingList[entryId]) { // if this flavor is the first todo check that no race between flavor
                let now = new Date() //todo check it getTime
                logger.info("Starting a new recording session for entry  %s", entryId);
                recordingPath =  path.join(recordingDir, entryId, entryObj.recordedEntryId)
                recordingList[entryId] = {
                    "recordingSessionDuration": entryObj.recordingSessionDuration,
                    "lastTimeUpdateChunk": now,
                    'recordedEntryId': entryObj.recordedEntryId,
                    "recordingPath" : recordingPath,
                    'flavors' : [flavorId]
                }

                //create playlist  json
                let options = {
                    'recording' : true,
                    'recordingPath': recordingPath
                }
                let playlistGenerator =  new PlaylistGenerator(entryObj, options)
                recordingList[entryId].playlistGenerator = playlistGenerator
                createManifestPromise = accessibleRecording(playlistGenerator ,entryObj.recordedEntryId, recordingPath) //todo change it
            }
            else{
                recordingList[entryId].flavors.push(flavorId)
            }

            let recordingFlavorPath = path.join(recordingPath, flavorId);
            return qio.makeTree(recordingFlavorPath).then(()=> {
                return createManifestPromise.then(()=> {
                    let doneFilePath = path.join(recordingFlavorPath, 'done')
                    return qio.exists(doneFilePath).then((fileDoneExist)=> {
                        if (fileDoneExist) {
                            logger.info("Found previous recording session for entry: %s", entryObj.entryId)
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
            recordingList[entryId].lastTimeUpdateChunk = new Date(); //todo Assume key exist
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
                let now = new Date();
                logger.debug("Check for end recording session");
                _.each(recordingList, function (element, entryId) {
                    if (now - element.lastTimeUpdateChunk > element.recordingSessionDuration) { //todo what to do if we stop stream and start, but other machine has start to get it
                        logger.info("recording for entry %s didn't get new chunk for %d - stop recording", entryId, element.recordingSessionDuration);
                        let source = findSourceStreamId(element.flavors)
                        let recordingSessionDirectoryPath = path.join(element.recordingPath, source);
                        stopRecording(entryId, element.recordedEntryId, recordingSessionDirectoryPath);
                    }
                });
                logger.debug("Available recording entry: %j", _.keys(recordingList));    //todo on start or on the end? is it effective to explore list again?
            } catch (err) {
               logger.error("Error while trying to run handleRecordingEntries: %s ", ErrorUtils.error2string(err))
            }
        }

        const findSourceStreamId = (flavorList) =>{
            if (flavorList.length > 0)
                return flavorList.min()
            //todo should throw error
        }

        const stopRecording = (entryId, recordedEntryId, recordingSessionDirectoryPath) =>{

            let now = new Date().getTime().toString()
            let destFilePath = path.join(completedRecordingFolderPath, entryId +'_' + recordedEntryId + '_' +now);
            qio.symbolicLink(destFilePath, recordingSessionDirectoryPath, 'directory')
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

            const checkAndGetMissionChunks = (chunksDirLivePath, chunksRecordingPath, enrtyId) => {
                var pGlob = Q.denodeify(glob);
                return pGlob(path.join(chunksDirLivePath, '*/*/*.mp4'))
                    .then(function(downloadedChunks) {
                        var checkCrashedFiles = [];
                        _.each(downloadedChunks, function (c) {
                            var fileName = path.basename(c);
                            if (thfghfghfghat.playlistGenerator.checkFileExists(fileName)) {
                                //if not exist, create hard link
                            }
                            })
                        return checkAndAddFileToJson()
                        });


            }

            /*
                This funcion check that all file in recording direcotry are also in Json, Otherwise, calling addFileToJson
             */
            const checkAndAddFileToJson = ()=>{

            }

            /*
            This function is paring the metadata of file, and add it to json
             */
            const addFileToJson = (fileName)=>{

            }
/*
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
            */



            return pGlob(path.join(recordingDir, '*/')) // get all folders in recording dir
            //todo add entry id pattern to regex?
                    .then((recordedEntryList)=> {

                        let now = new Date();
                        let CheckRecordedEntryPromises = _.map(recordedEntryList, function (recordingEntryDirectoryPath) {
                            let entryId = path.basename(recordingEntryDirectoryPath)
                            let deferred  = Q.defer();
                            return getEntryObject(entryId)
                                .then((entryObj)=> {
                                let recordedEntryId = entryObj.recordedEntryId;
                                return pGlob(path.join(recordingEntryDirectoryPath, recordedEntryId, '*/'))
                                    .then((flavorListPath)=>{
                                        let flavorList = []
                                        _.each(flavorListPath, function (flavorPath) {
                                            let flavorId = path.basename(flavorPath);
                                            flavorList.push(flavorId)
                                        })
                                        let source = findSourceStreamId(flavorList)
                                        let recordingSessionDirectoryPath = path.join(recordingEntryDirectoryPath, recordedEntryId, source)
                                        let chunksDirLivePath = path.join(liveFolderPath, entryId)
                                      //  return checkAndGetMissionChunks(chunksDirLivePath, recordingSessionDirectoryPath, entryId)
                                    //        .then(()=>{
                                            return getLastUpdateChunk(recordingSessionDirectoryPath)
                                                .then((lastTimeUpdateChunk)=> {
                                                if (now - lastTimeUpdateChunk > entryObj.recordingSessionDuration) {    // if session is expired, move directory
                                                    return qio.exists(path.join(recordingSessionDirectoryPath, 'done'))
                                                        .then((fileDoneExist)=> {
                                                        if (!fileDoneExist) {
                                                            logger.info("onStartUp: recorded entry %s didn't get new chunk for %d seconds- stop recording", entryId, entryObj.recordingSessionDuration / 1000);
                                                            deferred = stopRecording(entryId, recordedEntryId, recordingSessionDirectoryPath)
                                                        }
                                                    })
                                                }
                                                else {
                                                    let recordingPath =  path.join(recordingEntryDirectoryPath, recordedEntryId)
                                                    let options = {
                                                        'isRecording' : true,
                                                        'recordingPath': recordingPath
                                                    }
                                                    let playlistGenerator =  new PlaylistGenerator(entryObj, options)

                                                    recordingList[entryId] = {
                                                        "recordingSessionDuration": entryObj.recordingSessionDuration,
                                                        "lastTimeUpdateChunk": now,
                                                        'recordedEntryId': entryObj.recordedEntryId,
                                                        "recordingPath": recordingPath,
                                                        "playlistGenerator" : playlistGenerator
                                                    }

                                                    deferred = accessibleRecording(playlistGenerator,  entryObj.recordedEntryId, recordingPath)
                                                }
                                             })
                                        })
                                //    })
                                })
                            return deferred.promise
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

        this.start = onStartUp
        //this.start = ()=>{ return Q.resolve() }
        this.startRedording = startRecording
        this.addNewChunks = addNewChunks
        setInterval(handleRecordingEntries, recordingTimeInterval)
        }

    }
module.exports = new RecordingManager();
