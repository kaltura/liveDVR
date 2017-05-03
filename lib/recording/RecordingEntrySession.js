/**
 * Created by ron.yadgar on 19/10/2016.
 */
/**
 * Created by ron.yadgar on 17/07/2016.
 */
const Q = require('q');
const loggerBase = require('../../common/logger')
const util = require('util');
const events = require("events");
const config = require('../../common/Configuration');
const qio = require('q-io/fs');
const path = require('path');
const _ = require('underscore');
const glob = require('glob');
const ErrorUtils = require('../utils/error-utils');
const PlaylistGenerator = require('../playlistGenerator/PlaylistGenerator');
const mp4Utils = require('../utils/mp4-utils.js');
const PersistenceFormat = require('../../common/PersistenceFormat.js');
const pGlob = Q.denodeify(glob);
const kalturaTypes = require('../kaltura-client-lib/KalturaTypes');
const backendClient = require('../BackendClientFactory.js').getBackendClient();
const promUtils = require('../utils/promise-utils');
const recordingUpdateEntryTimeIntervalMs = config.get('recording').recordingUpdateEntryTimeIntervalInMin * 60 * 1000
const recordingRootPath = config.get('recording').recordingFolderPath;
const recordingMaxDurationInMs = config.get('recording').recordingMaxDurationInHours * 60 * 60 * 1000;
const unknownEntry = "UNKNOWN"
class RecordingEntrySession {


    constructor(entryObj, flavorsObjArray){

        const appendDirName = 'append'
        const newSessionDirName = 'newSession'

        const createPlaylistGenerator = (entryObj, flavors) => {
            //create playlist  json
            let options = {
                'recording': true,
                'recordingSessionPath': recordingSessionPath
            }
            if (flavors) {
                options.flavors = flavorsObjArray
            }
            return new PlaylistGenerator(entryObj, options)
        }

        let now = new Date()
        let entryId = entryObj.entryId;
        let recordedEntryId = entryObj.recordedEntryId;
        let modeDirName
        if (entryObj.recordStatus === kalturaTypes.KalturaRecordStatus.APPENDED){
            modeDirName = appendDirName
        }
        else {
            modeDirName = newSessionDirName
        }
        this.modeDirName = modeDirName
        let recordingSessionPath  = path.join(recordingRootPath, modeDirName, entryId.slice(-1), entryId, entryObj.recordedEntryId)
        this.flavors = []
        this.flavorsChunksCounter ={}
        _.each(flavorsObjArray, (flavorObj)=>{
            this.flavors.push(flavorObj.name)
            this.flavorsChunksCounter[flavorObj.name] = 0
        });
        this.recordingSessionDuration = entryObj.recordingSessionDuration;
        this.lastTimeUpdateChunk = now;
        this.recordedEntryId = recordedEntryId;
        this.entryId = entryId
        this.lastUpdateDuration = 0

        this.recordingSessionPath = recordingSessionPath;
        this.playlistGenerator = createPlaylistGenerator(entryObj, recordingSessionPath) //todo check that its not passed the limit
        this.recordingSessionId = entryId + '-' + recordedEntryId;
        this.logger = loggerBase.getLogger('RecordingEntrySession', '[' + this.recordingSessionId + '] ');
        this.logger.info("Starting a new recording session");
        this.serializedActionsPromise = Q.resolve()
        this.getDuration = ()=>{
            return this.playlistGenerator.getTotalDuration()
        }
        this.serverType = entryObj.serverType

    }

    accessibleRecording () {
        /*
         Create manifest,and then crate symbolic link to live
         */
        return this.playlistGenerator.initializeStart().then(()=> {
            return this.playlistGenerator.finalizeStart().then(()=> {
                if (this.getDuration() >  recordingMaxDurationInMs){
                    let msg=util.format("Recorded entry is passed the limit of recording session, limit: %s, got %s", recordingMaxDurationInMs, this.getDuration());
                    return Q.reject(msg)
                }
                if(this.playlistGenerator.MaxClipCountReached()){
                    return Q.reject("Recording has passed num of clips")
                }
                if (this.startDuration === undefined){
                    this.startDuration = this.getDuration();
                    this.logger.debug("Start duration %s", this.startDuration);
                }
                let accessibleRecordingFolder = PersistenceFormat.getEntryBasePath(this.recordedEntryId)
                let accessibleRecordingBasePath = path.dirname(accessibleRecordingFolder)
                return qio.makeTree(accessibleRecordingBasePath).then(()=>{
                    return qio.exists(accessibleRecordingFolder).then((isExist)=> {
                        if (!isExist) {
                            if (this.recordedEntryId === unknownEntry){
                                this.logger.warn("Can't link recorded entry into live, recorded entry is unknown")
                                return Q.resolve()
                            }
                            this.logger.info("Accessible recording")
                            return qio.symbolicLink(accessibleRecordingFolder, this.recordingSessionPath, 'directory')
                        }
                    })
                })
            })
        })
    }

    /*
     In order to check that all chunks in live directory exist in recording, we check first that all chunks in recording are in json
     */
    updateEntryDuration(force){
        let duration = this.getDuration()
        if (force || duration>this.lastUpdateDuration + recordingUpdateEntryTimeIntervalMs) {
            this.lastUpdateDuration = duration
            this.logger.info("New last update duration %s", duration)
            return backendClient.updateEntryDuration(this.entryId, duration).then(()=> {
                this.logger.info("Successfully update liveEntry %s with duration %s", this.entryId, duration)
            })
        }
        return Q.resolve()
    }
    restoreSession() {

        return this.accessibleRecording() //in order to check if file exist, first need to load Json form disk
            .then(()=>{
                return this.checkFilesFromRecordingFolder()
            })
            .then(()=> {
                return this.checkFilesFromLiveFolder()
            })
            .then(()=>{
                this.logger.info("restoreSession is finished")
            })
            .catch((err)=>{
                this.logger.error("Failed to restore session : %s", ErrorUtils.error2string(err))
            })
    }
    checkMissingChunks  (downloadedChunks) {
        let missingChunks = [];
        _.each(downloadedChunks, (filePath)=> {
            let fileName = path.basename(filePath);
            if (!this.playlistGenerator.checkFileExists(fileName)) {
                this.logger.info("checkMissingChunks: Found chunk %s missing on playList: path %s", fileName, filePath)
                missingChunks.push(filePath)
            }

        })
        return missingChunks
    }

    checkFilesFromLiveFolder (){
        let liveEntryPath = PersistenceFormat.getEntryBasePath(this.entryId);
        return this.findMissingChunksAndGetMetadata(path.join(liveEntryPath, '*/*/*.mp4'))
            .then((Mp4Files)=> {
                if (Mp4Files) {
                    _.each(Mp4Files, (Mp4File)=>{
                        Mp4File.flavor = PersistenceFormat.getFlavorFromLivePath(Mp4File.path)
                        return Mp4File
                    })
                    return this.linkAndUpdateJson(Mp4Files)
                }
        })

    }

    /*
     This funcion check that all file in recording directory are also in Json, Otherwise, calling addFileToJson
     */
    checkFilesFromRecordingFolder() {
            return this.findMissingChunksAndGetMetadata(path.join(this.recordingSessionPath, '*/*.mp4')).then((missingChunks)=> {
                if (missingChunks) {
                    this.logger.debug("checkFilesFromRecordingFolder: About to update chunks %s in json for recorded session id", JSON.stringify(missingChunks))
                    _.each(missingChunks, (Mp4File)=>{
                        Mp4File.flavor = PersistenceFormat.getFlavorFromRecordingPath(Mp4File.path)
                        return Mp4File
                    })
                    return this.updateJson(missingChunks)
                }
            })
    }

    findMissingChunksAndGetMetadata(directoriesToCheck){

        return pGlob(directoriesToCheck)
            .then( (downloadedChunks) => {
                let missingChunks = this.checkMissingChunks(downloadedChunks);
                if (missingChunks.length == 0) {
                    this.logger.debug(" No missing chunks found compare to folders %s", directoriesToCheck);
                    return Q.resolve()
                }
                else {
                    this.logger.info("Found %d missing chunks compare to %s : %s", missingChunks.length, directoriesToCheck, missingChunks);
                    return this.getAllMetaData(missingChunks)
                }
            })
    }

    /*
     This function is parsing the metadata of all files
     */
    getAllMetaData(missingChunks) {

        function getMetaDataChunk(filePath) {
            this.logger.debug("About to parse meta data for the file %s", filePath)
            return qio.stat(filePath)
                .then((stats)=>{
                    if (!stats.size) {
                        this.logger.error("Zero bytes in file %s!", filePath)
                        return Q.reject()
                    }
                    return mp4Utils.extractMetadata(filePath)
                        .then((metaData)=> {
                                metaData.path = filePath
                                metaData.chunkName = path.basename(filePath)
                                this.logger.debug("Extract Metadata for %s: %s", filePath, JSON.stringify(metaData))
                                return Q.resolve(metaData)
                            },
                            (err)=> {
                                this.logger.error("Failed to get metadata for file %s: %s", filePath, ErrorUtils.error2string(err))
                                return Q.reject()
                            })
                })
        }
        return promUtils.runningArrayOfPromisesInBlocks(getMetaDataChunk.bind(this),100,missingChunks)
        .then((results)=> {
            let errs = ErrorUtils.aggregateErrors(results);
            if (errs.numErrors > 0) {
                this.logger.error("getMetaData: Failed to extract matadata for the chunks %s: %s", missingChunks, errs.err.message)
            }
            return this.removeFailurePromisesAndSort(results)
        })
    }

    linkFiles (Mp4Files, flavorId){
        let Mp4FilesPath = _.map(Mp4Files, function(element){ return  element.path; });
        this.logger.debug("LinkAndUpdateJson : %s", Mp4FilesPath)
        var promises = _.map(Mp4Files, (Mp4File) =>{
            let SourcefilePath = Mp4File.path;
            let chunkName = path.basename(Mp4File.path)
            if (flavorId == undefined){
                flavorId = Mp4File.flavor
            }
            let DestFilePath = path.join(this.recordingSessionPath, flavorId, chunkName);

            return qio.link(SourcefilePath, DestFilePath)
                .then(()=> {
                    Mp4File.path = DestFilePath;
                    this.logger.debug("Linked %s to %s", chunkName, DestFilePath)
                    return Q.resolve(Mp4File)
                }, (err)=> {
                    if (err.code == 'EEXIST') { // if the error is the file exist...
                        this.logger.warn(" %s", err.message)
                        return Q.resolve()
                    }
                    else { //Otherwise return reject promise!
                        this.logger.error("%s ", ErrorUtils.error2string(err))
                        return Q.reject(ErrorUtils.error2string(err))
                    }
                })
         });
        return Q.allSettled(promises)
    }

    parseUpdateJsonResult(result){
        _.each(result, (chunk)=>{
            if ('error' in chunk){
                this.logger.error("Failed to add %s to playlist, %ss", chunk.chunkName, ErrorUtils.error2string(chunk.error))
            }

        })
    }
    removeFailurePromisesAndSort(results){

        let Mp4FilesUpdated = _.reduce(results, (sum,promise)=> {
            if (promise.state=='fulfilled' && promise.value) {
                sum.push(promise.value);
            }
            return sum;
        },[]);
        let Mp4FilesUpdatedSorted = _.sortBy(Mp4FilesUpdated, 'startTime')
        return Q.resolve(Mp4FilesUpdatedSorted)
    }

    updateJson(Mp4Files){

        let chunksNameChained = _.reduce(Mp4Files, (str, obj)=> {
            return str + obj.chunkName + " ";
        }, "");
        this.logger.debug("About to update chunks: %s", chunksNameChained)
        return Q.allSettled(this.playlistGenerator.update(Mp4Files))
            .then(()=> {
                this.parseUpdateJsonResult(Mp4Files)
                return Q.resolve(chunksNameChained)
            })
    }

    linkAndUpdateJson(Mp4Files, flavorId){
        var deferred = Q.defer();
        this.serializedActionsPromise =  this.serializedActionsPromise.finally(()=>{
            return this.linkAndUpdateJsonSerialize(Mp4Files, flavorId).finally(()=>{
                deferred.resolve()
            })
        })
        return deferred.promise
    }

    linkAndUpdateJsonSerialize(Mp4Files, flavorId) {

        return this.linkFiles(Mp4Files, flavorId)
            .then( (results) => { //todo check why no error trow when try to acess non existing elemnt in promise
                return this.removeFailurePromisesAndSort(results)
            })
            .then((Mp4FilesUpdated) => {
                if (flavorId != undefined) {
                    this.flavorsChunksCounter[flavorId] = this.flavorsChunksCounter[flavorId] + Mp4FilesUpdated.length
                }
                return this.updateJson(Mp4FilesUpdated)
            })
            .then(()=>{
                return this.updateEntryDuration()
            })
            .then(()=>{
                return Q.resolve() // return resolve anyway!
            })
            .catch( (err) =>{
                this.logger.error("Error occurred while try to add new chunks: %s", ErrorUtils.error2string(err));
                return Q.reject(err);
            })

    }

    changeRecordedEntry(recordedEntryId){
        this.recordedEntryId = recordedEntryId;
        this.recordingSessionId = this.entryId + '-' + recordedEntryId;
        this.recordingSessionPath  = path.join(recordingRootPath, this.modeDirName, this.entryId.slice(-1), this.entryId, recordedEntryId);
        return this.playlistGenerator.setBasePath(this.recordingSessionPath)
    }
}
module.exports = RecordingEntrySession