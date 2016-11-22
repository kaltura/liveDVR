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
const preserveOriginalHLS = config.get('preserveOriginalHLS').enable;
const simulateStreams = config.get('simulateStreams').enable;
const rootFolder = config.get('rootFolderPath');

class PersistenceFormatBase {
    getEntryBasePath (entryId) {
        return path.join(rootFolder, this.getEntryHash(entryId), entryId);
    }

    getRelativePathFromFull(fullPath) {
        return fullPath.substr(this.getBasePathFromFull(fullPath).length);
    }

    getFlavorFullPath (entryId, flavorName) {
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
                retVal = { fullPath };
                break;

            case "flavor":
                retVal = this.getFlavorPath(destPath,param)
                if ( _.isEqual(param ,retVal.hash) )
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
        let lastSepIdx = _.lastIndexOf(fullPath,path.sep) - 1;
        return fullPath.substring(0,_.lastIndexOf(fullPath,path.sep,lastSepIdx)+1)
    }

    getFlavorPath (destPath,param) {
        let hours = new Date().getHours().toString();
        let hash = hours < 10 ? ("0" + hours) : hours;
        let fullPath = path.join(destPath, hash);
        return { fullPath, hash };
    }

    compressChunkName(tsChunkName) {
        var matched = tsChunktMatch.exec(tsChunkName);
        if (matched) {
            return matched[1] + '-' + matched[2] + '.mp4';
        }
        return tsChunkName;
    }

    getFlavorPreserveHlsFullPath(entryId, flavor) {
        logger.error(`A bug found: should not call getFlavorPreserveHlsPath if preserveOriginalHLS.enable=false`);
        return this.getFlavorFullPath(entryId, flavor);
    }

    getChunkPreserveFullPath( flavorPath, chunkName ) {
        return null;
    }

}


if (!preserveOriginalHLS) {
    module.exports = new PersistenceFormatBase();
} else {

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
            .then(() => {
                return retVal;
            })
            .catch(err => {
                logger.error(`failed to create hierarchy path. Error: ${ErrorUtils.error2string(err)}`);
            });
    }

    function preserveStreamPath() {
        let entryPath = null;
        let createFolderPerSession = config.get('preserveOriginalHLS').createFolderPerSession;

        try {
            if (simulateStreams) {
                entryPath = config.get('preserveOriginalHLS').path ? config.get('preserveOriginalHLS').path.trim() : config.get('simulateStreams').entryId;
                let index = 1;
                let basePath = `${rootFolder}/${entryPath}-`;
                let checkPath = `${basePath}${index}`;

                if (createFolderPerSession) {
                    let stat = fs.lstatSync(checkPath);

                    while (stat.isDirectory()) {
                        index++;
                        checkPath = `${basePath}-${index}`;
                        stat = fs.lstatSync(checkPath);
                    }

                } else {
                    entryPath = `${rootFolder}/${entryPath}-1`;
                }
            }
        } catch (err) {
            if (err.code != 'ENOENT') {
                logger.error(`Error while initializing stream preserve path. Error: ${ErrorUtils.error2string(err)}`);
            }
        } finally {
            logger.info(`STREAM PRESERVE PATH: ${entryPath}`);
        }

        return entryPath;
    }

    class PreserveOriginalHLSFormat extends PersistenceFormatBase {

        constructor() {
            super();
            // (\/Users\/lilach.maliniak\/Documents\/tmp\/DVR\/)(.\/)(.*?)(\/[\d]+\/.+\.)mp4
            // (\/Users\/lilach.maliniak\/Documents\/tmp\/DVR\/)(.\/)(.*?)(\/[\d]+\/.+\.)mp4
            let pattern = `(${rootFolder.replace('\\', '\/')}\/)(.\/)(.*?)(\/[\\d]+\/.+\\.)mp4`;
            this.mp4PathMatch = new RegExp(pattern, "g");
            this.entryFullPath = preserveStreamPath.call(this);
        }

        getBasePathFromFull(fullPath) {
            return fullPath.substring(0,_.lastIndexOf(fullPath,path.sep)+1);
        }

        getFlavorPath (destPath,param) {
            return { fullPath:destPath, hash:param };
        }

        createHierarchyPath(destPath, lastFileHash) {
            return createHierarchyPathHelper.call(this, destPath, lastFileHash, lastFileHash);
         }

        getFlavorPreserveHlsFullPath(entryId, flavor) {
            return this.entryFullPath ? path.join(this.entryFullPath, flavor.toString()) : super.getFlavorFullPath(`${entryId}-1`, flavor.toString());
        }

        getMP4FileNamefromInfo(chunkPath) {
            return chunkPath.replace('.ts', '.mp4');
        }

     /*   getTSChunknameFromMP4FileName(chunkPath) {

            let resArray = chunkPath.exec(this.mp4PathMatch);
            let tsPath = null;

            try {
                if (resArray && resArray.length) {
                    let entryId = resArray[3];
                    let filename = resArray[4];

                    if (this.entryPath) {
                        tsPath = path.join(this.entryPath, filename);
                    } else {
                        tsPath = path.join(this.entryPath, '1', `${entryId}-1`, filename);
                    }
                }
            } catch (err) {
                logger.error(`getTSChunknameFromMP4FileName failed parsing ${chunkPath}. Error: ${ErrorUtils.error2string(err)}`);
            }
            if (!tsPath) {
                logger.error(`getTSChunknameFromMP4FileName failed parsing ${chunkPath}. Unknown error. Is it a bug?`);
            }
            return tsPath;
        }
*/
        
        // ???? required ???
        compressChunkName(tsChunkName) {
            return super.getMP4FileNamefromInfo(tsChunkName);
        }

        getChunkPreserveFullPath( flavorFullPath, chunkName ) {
            return path.join(flavorFullPath, this.getTSChunknameFromMP4FileName(chunkName));
        }

    }
    module.exports = new PreserveOriginalHLSFormat();
}
