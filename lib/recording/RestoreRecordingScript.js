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
const kalturaVO = require('./../kaltura-client-lib/KalturaVO');
const recordingEntryMetaDataFile = 'metadata.json'

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
let dcFilePath;

if (options.all === true){
    chunksDir =  fs.readdirSync(pathBase)
        .filter(file => fs.statSync(path.join(pathBase, file)).isDirectory())
}
else{
    chunksDir = options.flavors;
}
let recordedId = arg[arg.length - 1];
let entryId = arg[arg.length - 2];
let entryObject;

backendClient.getEntryInfo(entryId)
    .then((entryObj)=> {
        entryObject = entryObj;
        // read entryServeNodeId
        dcFilePath = path.join(pathBase, recordingEntryMetaDataFile);
        return qio.read(dcFilePath);
    })
    .then((data)=> {
        let metadata = JSON.parse(data);
        return metadata.entryServerNodeId;
    })
    .catch((err)=> {
        logger.warn(`[${entryId}] failed to read dc file from [${dcFilePath}]. Error: ${ErrorUtils.error2string(err)}. Trying to get entryServerNode from BE`);
        let entryServerNodeFilter = new kalturaVO.KalturaEntryServerNodeFilter();
        entryServerNodeFilter.serverTypeEqual = parseInt(entryObject.serverType);

        let entryServerNodePromise = backendClient.getSingleEntryServerNode.call(entryObject.entryId, entryServerNodeFilter)
            .catch((err)=> {
                let msg = `failed to get server node id. Error: ${ErrorUtils.error2string(err)}`;
                return Q.reject(msg);
            })
            .then((entryServerNode)=> {
                return Q.resolve(entryServerNode.id);
            });

        return entryServerNodePromise;
    })
    .then((entryServerNodeId)=> {
        let flavorsObjArray = [];
        _.each(chunksDir, (chunkDir)=> {
            flavorsObjArray.push({"name": chunkDir})
        });
        entryObject.recordedEntryId = recordedId;
        recordingEntrySession = new RecordingEntrySession(entryObject, entryServerNodeId, null, flavorsObjArray);

        let jsonPath = recordingEntrySession.playlistGenerator.playlistPath;

        return qio.exists(jsonPath).then((isExist)=> {
            if (isExist && options.useSameJson == false) {
                let jsonPathNew = path.join(jsonPath + "_" + new Date().getTime().toString())
                logger.info("Found playlist json exist, rename it to %s", jsonPathNew)
                return qio.rename(jsonPath, jsonPathNew)
            }
        })
    })
    .then(()=> {
        return recordingEntrySession.restoreSession()
    })
    .then(()=> {
        logger.info("Finish to write files, about to create link")
        recordingManager.recordingList[entryId] = recordingEntrySession
        //return recordingManager.stopRecording(entryId, recordedId, pathBase)
        return recordingManager.stopRecording(entryId, recordingEntrySession);
    })
    .then(()=> {
        logger.info("Finish to create link")
        process.exit(0);
    })
    .catch((err)=> {
        logger.info("Error: [%s]", ErrorUtils.error2string(err))
        process.exit(1);
    })
