/**
 * Created by elad.benedict on 8/23/2015.
 */

var config = require('./Configuration');
var path = require('path');
var qio = require('q-io/fs');
var _ = require('underscore');
var Q = require('q');

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

}

function createHierarchyPathHelper(fileFullPath, hash, lastFileHash) {
    let retVal = {fileFullPath, hash};
    if (lastFileHash === hash)
        return Q.resolve(retVal);

    return qio.makeTree(fileFullPath)
        .then(function () {
            return retVal;
        });
}

if (!preserveOriginalHLS) {
    class DefaultPersistenceFormat extends PersistenceFormatBase {
        getBasePathFromFull(fullPath) {
            // cut away both flavor and time components
            let lastSepIdx = _.lastIndexOf(fullPath, path.sep) - 1;
            return fullPath.substring(0, _.lastIndexOf(fullPath, path.sep, lastSepIdx) + 1)
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
    class PreserveOriginalHLSFormat extends PersistenceFormatBase {
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
            return path.join(config.get('rootFolderPath'), entryId, flavorName.toString());
        }

    }
    module.exports = new PreserveOriginalHLSFormat();
}
