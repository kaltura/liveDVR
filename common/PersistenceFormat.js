/**
 * Created by elad.benedict on 8/23/2015.
 */

var config = require('./Configuration');
var path = require('path');
var qio = require('q-io/fs');
var _ = require('underscore');
var Q = require('q');

const tsChunktMatch =  new RegExp(/media-([^_]+).*?([\d]+)\.ts.*/);
var preserveOriginalHLS = config.get('preserveOriginalHLS').enable;

class PersistenceFormatBase {
    getEntryBasePath (entryId) {
        return path.join(config.get('rootFolderPath'), entryId);
    }

    getRelativePathFromFull (fullPath) {
        return fullPath.substr(this.getBasePathFromFull(fullPath).length);
    }

    getFlavorFullPath (entryId, flavorName) {
        return path.join(config.get('rootFolderPath'), entryId, flavorName.toString());
    }

    getMasterManifestName() {
        return 'playlist.json';
    }

    getMP4FileNamefromInfo(chunkPath){
        return chunkPath.replace('.ts','.mp4');
    }


    getTSChunknameFromMP4FileName(mp4FileName){
        return mp4FileName.replace('.mp4','.ts');
    }

    getEntryBasePath (entryId) {
        return path.join(config.get('rootFolderPath'), entryId);
    }


}

function createHierarchyPathHelper (fileFullPath, hash,lastFileHash) {
    let retVal = {fileFullPath, hash};
    if (lastFileHash === hash)
        return Q.resolve(retVal);

    return qio.makeTree(fileFullPath)
        .then(function() {
            return retVal;
        });
}

if(!preserveOriginalHLS) {
    class DefaultPersistenceFormat extends PersistenceFormatBase {
        getBasePathFromFull(fullPath) {
            // cut away both flavor and time components
            let lastSepIdx = _.lastIndexOf(fullPath,path.sep) - 1;
            return fullPath.substring(0,_.lastIndexOf(fullPath,path.sep,lastSepIdx)+1)
        }

        createHierarchyPath(destPath, lastFileHash) {

            let hash = new Date().getHours().toString();
            let fileFullPath = path.join(destPath, (hash) < 10 ? ("0" + hash) : hash);

            return createHierarchyPathHelper(fileFullPath, hash, lastFileHash);
        }

        compressChunkName(tsChunkName) {
            var matched = tsChunktMatch.exec(tsChunkName);
            if (matched) {
                return matched[1] + '-' + matched[2] + '.mp4';
            }
            return tsChunkName;
        }

    }
    module.exports = new DefaultPersistenceFormat();
} else {
    class PreserveOriginalHLSFormat extends PersistenceFormatBase {
        getBasePathFromFull(fullPath) {
            return fullPath.substring(0,_.lastIndexOf(fullPath,path.sep)+1);
        }

        createHierarchyPath(destPath, lastFileHash) {
            return createHierarchyPathHelper(destPath, lastFileHash, lastFileHash);
        }

        compressChunkName(tsChunkName) {
            return super.getMP4FileNamefromInfo(tsChunkName);
        }
    }
    module.exports = new PreserveOriginalHLSFormat();
}
