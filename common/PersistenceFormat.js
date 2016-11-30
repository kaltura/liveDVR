/**
 * Created by elad.benedict on 8/23/2015.
 */

var config = require('./Configuration');
var path = require('path');
var qio = require('q-io/fs');
var _ = require('underscore');
var Q = require('q');
const fs = require('fs');
var util = require('util');
const ErrorUtils = require('./../lib/utils/error-utils');
var logger = require('./logger').getLogger("PersistenceFormatter");

const tsChunktMatch = new RegExp(/media-([^_]+).*?([\d]+)\.ts.*/);
const preserveOriginalHLS = config.get('preserveOriginalHLS');
const simulateStreams = config.get('simulateStreams');
const rootFolder = config.get('rootFolderPath');
const dirHierarchy = preserveOriginalHLS.dirHierarchy;

class PersistenceFormatBase {
    
    getEntryBasePath(entryId) {
        return path.join(rootFolder, this.getEntryHash(entryId), entryId);
    }

    getRelativePathFromFull(fullPath) {
        return fullPath.substr(this.getBasePathFromFull(fullPath).length);
    }

    getFlavorFullPath(entryId, flavorName) {
        return path.join(this.getEntryBasePath(entryId), flavorName.toString());
    }

    getMasterManifestName() {
        return 'playlist.json';
    }

    getMP4FileNamefromInfo(chunkPath) {
        return chunkPath.replace('.ts', '.mp4');
    }

    getTSChunknameFromMP4FileName(mp4FileName) {
        return mp4FileName.replace('.mp4', '.ts');
    }

    createHierarchyPath(destPath, entity, param) {
        let fullPath;
        let retVal = {};
        switch (entity) {
            case "entry":
                let dir = this.getEntryHash(param);
                fullPath = dir ? path.join(destPath, dir) : destPath;
                retVal = {fullPath};
                break;

            case "flavor":
                retVal = this.getFlavorPath(destPath, param)
                if (_.isEqual(param, retVal.hash))
                    return Q.resolve(retVal);
                fullPath = retVal.fullPath;
                break;
        }

        return qio.makeTree(fullPath)
            .then(() => {
                return retVal;
            });
    }

    getEntryHash(entryId) {
        return entryId.charAt(entryId.length - 1);
    }

    getFlavorHash() {
        let hours = new Date().getHours().toString();
        return hours < 10 ? ("0" + hours) : hours;
    }

    getBasePathFromFull(fullPath) {
        // cut away both flavor and time components
        let lastSepIdx = _.lastIndexOf(fullPath, path.sep) - 1;
        return fullPath.substring(0, _.lastIndexOf(fullPath, path.sep, lastSepIdx) + 1)
    }

    getFlavorPath(destPath, param) {
        let hours = new Date().getHours().toString();
        let hash = hours < 10 ? ("0" + hours) : hours;
        let fullPath = path.join(destPath, hash);
        return {fullPath, hash};
    }

    compressChunkName(tsChunkName) {
        var matched = tsChunktMatch.exec(tsChunkName);
        if (matched) {
            return matched[1] + '-' + matched[2] + '.mp4';
        }
        return tsChunkName;
    }

    compressTsChunkName(tsChunkName) {
        var matched = tsChunktMatch.exec(tsChunkName);
        if (matched) {
            return matched[1] + '-' + matched[2] + '.ts';
        }
        return tsChunkName;
    }
}


if (!preserveOriginalHLS.enable || dirHierarchy) {
    module.exports = new PersistenceFormatBase();
} else {

    function getEntryPathHelper(entryPath, createFolderPerSession) {

        let basePath = path.join(rootFolder, entryPath).concat('-');
        let index = 1;
        let entryBasePath = null;

        try {
            if (simulateStreams.enable) {
                let checkPath = `${basePath}${index}`;

                if (createFolderPerSession) {
                    let stat = fs.lstatSync(checkPath);

                    while (stat.isDirectory()) {
                        checkPath = `${basePath}${index}`;
                        stat = fs.lstatSync(checkPath);
                        index++;
                    }
                }
            }
        } catch (err) {
            if (err.code != 'ENOENT') {
                logger.error(`Error while initializing stream preserve path. Error: ${ErrorUtils.error2string(err)}`);
            }
        } finally {
            entryBasePath = `${basePath}${index}`;
            logger.info(`STREAM PRESERVE PATH: ${entryBasePath}`);
        }

        return entryBasePath;
    }

    function createHierarchyPathHelper(fullPath, entity, lastFileHash) {

        let retVal = {};
        switch (entity) {
            case "entry":
                retVal = {fullPath};
                break;

            case "flavor":
                if (lastFileHash === entity) {
                    return Q.resolve({fullPath, lastFileHash});
                } else {
                    let hash = entity;
                    retVal = {fullPath, hash};
                }
                break;
        }

        return qio.makeTree(fullPath)
            .then(() => {
                return retVal;
            })
            .catch(err => {
                logger.error(`failed to create hierarchy path. Error: ${ErrorUtils.error2string(err)}`);
            });
    }

    class SimplifiedPersistenceFormat extends PersistenceFormatBase {

        constructor() {
            super();
            this.createFolderPerSession = simulateStreams.enable ? preserveOriginalHLS.createFolderPerSession : false;
            if (simulateStreams.enable) {
                this.entryPath = preserveOriginalHLS.path ? preserveOriginalHLS.path : simulateStreams.entryId;
            } else {
                this.entryPath = null;
            }
            this.entryBasePath = this.entryPath ? getEntryPathHelper(this.entryPath, this.createFolderPerSession) : null;
        }

        getEntryBasePath(entryId) {
           return this.entryBasePath || getEntryPathHelper(entryId, this.createFolderPerSession);
        }

        createHierarchyPath(destPath, entity, param) {
            return createHierarchyPathHelper(destPath, entity, param);
        }

        getBasePathFromFull(fullPath) {
            return fullPath;
        }

    }
    module.exports = new SimplifiedPersistenceFormat();
}

