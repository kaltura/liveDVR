/**
 * Created by elad.benedict on 8/23/2015.
 */

var config = require('./Configuration');
var path = require('path');
var qio = require('q-io/fs');
var _ = require('underscore');
var Q = require('q');
const fs = require('fs');
var util=require('util');
const ErrorUtils = require('./../lib/utils/error-utils');
var logger =  require('./logger').getLogger("PersistenceFormatter");

const tsChunktMatch = new RegExp(/media-([^_]+).*?([\d]+)\.ts.*/);
const preserveOriginalHLS = config.get('preserveOriginalHLS').enable;
const rootFolder = config.get('rootFolderPath');

class PersistenceFormatBase {
    getRelativePathFromFull(fullPath) {
        return fullPath.substr(this.getBasePathFromFull(fullPath).length);
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

    getEntryHash(entryId) {
        return entryId.charAt(entryId.length - 1);
    }

    getFlavorHash() {
        let hours = new Date().getHours().toString();
        return hours < 10 ? ("0" + hours) : hours;
    }

    createHierarchyPath(destPath, entity, param) {
        let fullPath;
        let retVal = {};
        switch (entity) {
            case "entry":
                fullPath = path.join(destPath, this.getEntryHash(param));
                retVal = {fullPath};
                break;

            case "flavor":
                let hash = this.getFlavorHash();
                fullPath = path.join(destPath, hash);
                retVal = {fullPath, hash};
                if (param === hash)
                    return Q.resolve(retVal);
                break;
        }

        return qio.makeTree(fullPath)
            .then(() => {
                return retVal;
            });
    }
}

function createHierarchyPathHelper(fullPath, hash, lastFileHash) {

    let retVal = {};
    switch (hash) {
        case "entry":
            retVal = {fullPath};
            break;

        case "flavor":
            retVal = {fullPath, hash};
            if (hash === lastFileHash)
                return Q.resolve(retVal);
            break;
    }

    return qio.makeTree(fullPath)
        .then( () => {
            return retVal;
        })
        .catch( err => {
            logger.error(`failed to create hierarchy path. Error: ${ErrorUtils.error2string(err)}`);
        });
}

if (!preserveOriginalHLS) {
    class DefaultPersistenceFormat extends PersistenceFormatBase {
        getBasePathFromFull(fullPath) {
            // cut away both flavor and time components
            let lastSepIdx = _.lastIndexOf(fullPath, path.sep) - 1;
            return fullPath.substring(0, _.lastIndexOf(fullPath, path.sep, lastSepIdx) + 1)
        }

        compressChunkName(tsChunkName) {
            var matched = tsChunktMatch.exec(tsChunkName);
            if (matched) {
                return matched[1] + '-' + matched[2] + '.mp4';
            }
            return tsChunkName;
        }

        getEntryBasePath(entryId) {
            return path.join(rootFolder, this.getEntryHash(entryId), entryId);
        }

        getFlavorFullPath(entryId, flavorName) {
            return path.join(this.getEntryBasePath(entryId), flavorName.toString());
        }

    }
    module.exports = new DefaultPersistenceFormat();
} else {

    preserveStreamPath = function () {
        let entryPath = config.get('preserveOriginalHLS').path ? config.get('preserveOriginalHLS').path.trim() : config.get('simulateStreams').entryId;
        let createFolderPerSession = config.get('preserveOriginalHLS').createFolderPerSession;
        let index = 1;
        let basePath = `${rootFolder}/${entryPath}`;
        let checkPath = `${basePath}-${index}`;
        let entryFullPath = '';

        try {
            if (createFolderPerSession) {
                let stat = fs.lstatSync(checkPath);

                while (stat.isDirectory()) {
                    index++;
                    checkPath = `${basePath}-${index}`;
                    stat = fs.lstatSync(checkPath);
                }
            }
        } catch (err) {
            if (err.code != 'ENOENT') {
                logger.error(`failed to get flavor path. Error: ${ErrorUtils.error2string(err)}`);
            }
        } finally {
            entryFullPath = `${basePath}-${index}`;
            logger.info(`STREAM PRESERVE PATH: ${entryFullPath}`);
        }

        return entryFullPath;
    }

    class PreserveOriginalHLSFormat extends PersistenceFormatBase {

        constructor() {
            super();
            this.entryFullPath = preserveStreamPath(this.entry);
        }

        getBasePathFromFull(fullPath) {
            return fullPath.substring(0, _.lastIndexOf(fullPath, path.sep) + 1);
        }

        createHierarchyPath(destPath, lastFileHash) {
            return createHierarchyPathHelper(destPath, lastFileHash, lastFileHash);
        }

        compressChunkName(tsChunkName) {
            return super.getMP4FileNamefromInfo(tsChunkName);
        }

        getEntryBasePath(entryId) {
            return path.join(config.get('rootFolderPath'), entryId);
        }

        getFlavorFullPath(entryId, flavorName) {
            return `${this.entryFullPath}/${flavorName}`;
        }

    }
    module.exports = new PreserveOriginalHLSFormat();
}
