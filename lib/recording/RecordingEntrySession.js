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

const recordingUpdateEntryTimeIntervalMs = config.get('recording').recordingUpdateEntryTimeIntervalInMin * 60 * 1000
const recordingRootPath = config.get('recording').recordingFolderPath;
const recordingMaxDurationInMs = config.get('recording').recordingMaxDurationInHours * 60 * 60 * 1000;
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

    }

    accessibleRecording () {
        /*
         Create manifest,and then crate symbolic link to live
         */
        return this.playlistGenerator.initializeStart().then(()=> {
            return this.playlistGenerator.finalizeStart().then(()=> {
                if (this.getDuration() >  this.recordingMaxDurationInMs){
                    let msg=util.format("Recorded entry is passed the limit of recording session, limit: %s, got %s", this.recordingMaxDurationInMs, this.getDuration());
                    throw new Error(msg)
                }

                let accessibleRecordingFolder = PersistenceFormat.getEntryBasePath(this.recordedEntryId)
                let accessibleRecordingBasePath = path.dirname(accessibleRecordingFolder)
                return qio.makeTree(accessibleRecordingBasePath).then(()=>{
                    return qio.exists(accessibleRecordingFolder).then((isExist)=> {
                        if (!isExist) {
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
    updateEntry(force){
        let duration = this.getDuration()
        if (force || duration>this.lastUpdateDuration + recordingUpdateEntryTimeIntervalMs) {
            this.lastUpdateDuration = duration
            this.logger.info("New last update duration %s", duration)
            return backendClient.updateEntryDuration(this.recordedEntryId, duration).then(()=> {
                this.logger.info("Successfully update recorded with duration %s", duration)
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
                    return this.LinkAndUpdateJson(Mp4Files)
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
                    return Q.allSettled(this.playlistGenerator.update(missingChunks))
                        .then((results)=> {
                            if (results[0].state == 'rejected'){
                                this.logger.error("Failed to update chunks: %s ",ErrorUtils.error2string(results[0].reason))
                            }
                            else {
                                this.logger.info("checkFilesFromRecordingFolder: Successfully add chunks %s.",  JSON.stringify(missingChunks))
                            }
                            return Q.resolve() // return resolve anyway!
                        })

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
                    return this.getMetaData(missingChunks)
                }
            })
    }

    /*
     This function is parsing the metadata of all files
     */
    getMetaData(missingChunks) {
        this.logger.debug("About to parse meta data for the file %s", missingChunks)
        let updateChunksPromises = _.map(missingChunks,  (filePath) => {
            return qio.stat(filePath)
                .then((stats)=>{
                    if (!stats.size) {
                        this.logger.error("Zero bytes in file %s!", filePath)
                        return Q.reject()
                    }
                    return mp4Utils.extractMetadata(filePath)
                        .then((metaData)=> {
                                metaData.path = filePath
                                metaData.flavor = path.basename(path.dirname(filePath))
                                this.logger.debug("Extract Metadata for %s: %s", filePath, JSON.stringify(metaData))
                                return Q.resolve(metaData)
                            },
                            (err)=> {
                                this.logger.error("Failed to get metadata for file %s: %s", filePath, ErrorUtils.error2string(err))
                                return Q.reject()
                            })
                })

        })
        return Q.allSettled(updateChunksPromises).then((results)=> {
            let errs = ErrorUtils.aggregateErrors(results);
            if (errs.numErrors > 0) {
                this.logger.error("getMetaData: Failed to extract matadata for the chunks %s: %s", missingChunks, errs.err.message)
                results = _.filter(results,  (p)=> {
                    return (p.state === 'fulfilled')
                }); //remove all failed promise
            }
            let resultsValue = _.map(results,  (result)=> {
                return result.value
            })
            let resultsValueSorted = _.sortBy(resultsValue, 'startTime')
            return Q.resolve(resultsValueSorted) // return resolve anyway!
        })
    }

    LinkAndUpdateJson(Mp4Files, flavorId){
        this.serializedActionsPromise =  this.serializedActionsPromise.finally(()=>{
            return this.LinkAndUpdateJsonSerialize(Mp4Files, flavorId)
        })
    }
    LinkAndUpdateJsonSerialize(Mp4Files, flavorId) {
        let Mp4FilesPath = _.map(Mp4Files, function(element){ return  element.path; });
        this.logger.debug("LinkAndUpdateJson : %s", Mp4FilesPath)
        var promises = _.map(Mp4Files, (Mp4File) =>{
            let SourcefilePath = Mp4File.path;
            let chunkName = path.basename(Mp4File.path)
            if (flavorId == undefined){
                let arrayPath = Mp4File.path.split(path.sep);
                var flavorId = arrayPath[arrayPath.length - 3];
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

        return Q.allSettled(promises).then( (results) => { //todo check why no error trow when try to acess non existing elemnt in promise
            let Mp4FilesUpdated = _.reduce(results, (sum,promise)=> {
                if (promise.state=='fulfilled' && promise.value) {
                    sum.push(promise.value);
                }
                return sum;
            },[]);
            return Q.resolve(Mp4FilesUpdated)
        })
            .then((Mp4FilesUpdated) => {
                let chunksNameChained = _.reduce(Mp4FilesUpdated, (str, obj)=> {
                    return str + obj.chunkName + " ";
                }, "");
                if (flavorId != undefined) {
                    this.flavorsChunksCounter[flavorId] = this.flavorsChunksCounter[flavorId] + Mp4FilesUpdated.length
                }
                this.logger.debug("About to update chunks: %s", chunksNameChained)
                return Q.allSettled(this.playlistGenerator.update(Mp4FilesUpdated))
                    .then((results)=> {
                        if (results[0].state == 'rejected') {
                            this.logger.error("LinkAndUpdateJson Failed to update chunks: %s ", ErrorUtils.error2string(results[0].reason))
                        }
                        else {
                            this.logger.debug("LinkAndUpdateJson, Successfully update: %s", chunksNameChained)
                        }
                        return this.updateEntry()
                            .then(()=>{
                                return Q.resolve() // return resolve anyway!
                            })
                    })
            })
            .catch( (err) =>{
                this.logger.error("Error occurred while try to add new chunks: %s", ErrorUtils.error2string(err));
                return Q.reject(err);
            })

    }
}
module.exports = RecordingEntrySession