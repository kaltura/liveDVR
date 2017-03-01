/**
 * Created by ron.yadgar on 29/12/2016.
 */

const commandLineArgs = require('command-line-args')
const optionDefinitions = [

    { name: 'path', alias: 'p', type: String},  // path to recording
    { name: 'flavors', alias: 'f', type: String,  multiple: true,}, //in case of restore specific flavors, e.g. -f 32 -f 33 etc..
    { name: 'all', alias: 'a', type: Boolean, defaultOption: false } //in case of restore recording of all flavors
]

const Q = require('q');
const fs = require('fs');
const util = require('util');
const events = require("events");
const options = commandLineArgs(optionDefinitions) //qio must call after options
const qio = require('q-io/fs');
const path = require('path');
const _ = require('underscore');
const glob = require('glob');
const config = require('../../common/Configuration')
config.set('logToConsole', true);
//let recordingConf = config.get('recording');
//recordingConf.recordingFolderPath = "/web/content/kLive/liveRecorder/recordings";
//recordingConf.completedRecordingFolderPath = "/web/content/kLive/liveRecorder/incoming";
//config.set('recording', recordingConf);
const ErrorUtils = require('../utils/error-utils');
const PlaylistGenerator = require('../playlistGenerator/PlaylistGenerator');
const PersistenceFormat = require('../../common/PersistenceFormat.js');
const RecordingEntrySession = require('./RecordingEntrySession.js')
const recordingManager = require('./RecordingManager.js')
const logger = require('../../common/logger').getLogger("RecordingManager");
const backendClient = require('../BackendClientFactory.js').getBackendClient();
let valid = 'path' in options && ('flavors' in options || 'all' in options)
if (valid !== true){
    logger.error("Invalid argument, path must be included, and flavor or all flag.")
    process.exit(1);
}
let arg = options.path.split(path.sep);
let pathBase = options.path;
let recordingEntrySession;
let chunksDir;
if (options.all === true){
    chunksDir =  fs.readdirSync(pathBase)
        .filter(file => fs.statSync(path.join(pathBase, file)).isDirectory())
}
else{
    chunksDir = options.flavors;
}
let recordedId = arg[arg.length - 1];
let enrtyId = arg[arg.length - 2];
backendClient.getEntryInfo(enrtyId).then((entryObj)=>{
    let flavorsObjArray = []
    _.each(chunksDir, (chunkDir)=>{
        flavorsObjArray.push({"name" : chunkDir})
    });
    entryObj.recordedEntryId = recordedId
    recordingEntrySession = new RecordingEntrySession(entryObj, flavorsObjArray)
    let jsonPath =  recordingEntrySession.playlistGenerator.playlistPath;

    return qio.exists(jsonPath).then((isExist)=>{
        if (isExist){
            let jsonPathNew = path.join(jsonPath + "_"+ new Date().getTime().toString())
            logger.info("Found playlist json exist, rename it to %s", jsonPathNew)
            return qio.rename(jsonPath, jsonPathNew)
        }
    })
})
    .then(()=>{
        return recordingEntrySession.restoreSession()
})
    .then(()=>{
        logger.info("Finish to write files, about to create link")
        recordingManager.recordingList[enrtyId] = recordingEntrySession
        return recordingManager.stopRecording(enrtyId, recordedId, pathBase)
    })
    .then(()=>{
        logger.info("Finish to create link")
        process.exit(0);
        })
    .catch((err)=>{
        logger.info("Error: [%s]",  ErrorUtils.error2string(err))
        process.exit(1);
    })
