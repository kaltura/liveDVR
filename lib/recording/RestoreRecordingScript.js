/**
 * Created by ron.yadgar on 29/12/2016.
 */

const Q = require('q');
const fs = require('fs');
const util = require('util');
const events = require("events");
const qio = require('q-io/fs');
const path = require('path');
const _ = require('underscore');
const glob = require('glob');
const config = require('../../common/Configuration')
config.set('logToConsole', true);
const ErrorUtils = require('../utils/error-utils');
const PlaylistGenerator = require('../playlistGenerator/PlaylistGenerator');
const PersistenceFormat = require('../../common/PersistenceFormat.js');
const RecordingEntrySession = require('./RecordingEntrySession.js')
const recordingManager = require('./RecordingManager.js')
const logger = require('../../common/logger').getLogger("RecordingManager");
const backendClient = require('../BackendClientFactory.js').getBackendClient();
const options = require('commander');
options
    .version('0.0.1')
    .option('-p, --path <path>', 'specify path')
    .option('-f, --flavors [type]', 'specify specific flavor/s', list, [])
    .option('-a, --all', 'if want to add all flavors', false)
    .option('-u, --useSameJson [bool]', 'if want add all chunks to the exisit json, (WARNING: this can be irreversible since it change playlistjson', false)
    .parse(process.argv);

function list(val) {
    return val.split(',').map(Number);
}
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
        if (isExist && options.useSameJson == false){
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
