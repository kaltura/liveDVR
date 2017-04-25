/**
 * Created by elad.benedict on 8/23/2015.
 */

var config = require('./Configuration');
var path = require('path');
var qio = require('q-io/fs');
var _ = require('underscore');
var Q = require('q');

const tsChunktMatch = new RegExp(/media-([^_]+).*?([\d]+)\.ts.*/);
const rootFolder = config.get('rootFolderPath');

class PersistenceFormat {
    getFlavorFromLivePath(filePath){
        let arrayPath = filePath.split(path.sep);
        return  arrayPath[arrayPath.length -3];
    }

    getFlavorFromRecordingPath(filePath){
        let arrayPath = filePath.split(path.sep);
        return arrayPath[arrayPath.length -2];
    }

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

    getBasePathFromFull(fullPath, type = 'live') {
        let fullPathBase = path.dirname(fullPath)
        if (type == 'live'){
          //if live, decapsulated one more layer path
            fullPathBase =  path.dirname(fullPathBase)
         }
        return  fullPathBase + '/';
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

module.exports = new PersistenceFormat();
