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

    createHierarchyPath (destPath, entity, param) {
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
}



if(!preserveOriginalHLS) {
    class DefaultPersistenceFormat extends PersistenceFormatBase {

        getBasePathFromFull(fullPath) {
            // cut away both flavor and time components
            let lastSepIdx = _.lastIndexOf(fullPath,path.sep) - 1;
            return fullPath.substring(0,_.lastIndexOf(fullPath,path.sep,lastSepIdx)+1)
        }

        getEntryHash (entryId) {
              return entryId.charAt(entryId.length - 1);
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

    }
    module.exports = new DefaultPersistenceFormat();
} else {
    class PreserveOriginalHLSFormat extends PersistenceFormatBase {
        getBasePathFromFull(fullPath) {
            return fullPath.substring(0,_.lastIndexOf(fullPath,path.sep)+1);
        }

        getFlavorPath (destPath,param) {
            return { fullPath:destPath, hash:param };
        }

        compressChunkName(tsChunkName) {
            return super.getMP4FileNamefromInfo(tsChunkName);
        }
    }
    module.exports = new PreserveOriginalHLSFormat();
}
