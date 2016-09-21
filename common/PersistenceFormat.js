/**
 * Created by elad.benedict on 8/23/2015.
 */

var config = require('./Configuration');
var path = require('path');
var qio = require('q-io/fs');
var _ = require('underscore');
var Q = require('q');

const tsChunktMatch =  new RegExp(/media-([^_]+).*([\d]+)\.ts.*/);

module.exports = persistenceFormat = {

    getEntryBasePath: function (entryId) {
        return path.join(config.get('rootFolderPath'), entryId);
    },

    getBasePathFromFull: function (directory) {
        return path.dirname(path.dirname(directory));
    },

    getRelativePathFromFull: function (fullPath) {
        return fullPath.substr(persistenceFormat.getBasePathFromFull(fullPath).length);
    },

    getFlavorFullPath: function (entryId, flavorName) {
        return path.join(config.get('rootFolderPath'), entryId, flavorName.toString());
    },

    getMasterManifestName: function () {
        return 'playlist.json';
    },
    
    getMP4FileNamefromInfo: function(chunkPath){
         return chunkPath.replace('.ts','.mp4');
    },


    getTSChunknameFromMP4FileName: function(mp4FileName){
        return mp4FileName.replace('.mp4','.ts');
    },

    createHierarchyPath: function(destPath, lastFileHash) {
        let hash = new Date().getHours().toString();
        let fileFullPath = path.join(destPath, (hash) < 10 ? ("0" + hash) : hash);

        let retVal = {fileFullPath, hash};
        if (lastFileHash === hash)
            return Q.resolve(retVal);

        return qio.makeTree(fileFullPath)
            .then(function() {
                return retVal;
            });
    },

    compressChunkName: function(tsChunkName){
        var matched = tsChunktMatch.exec( tsChunkName );
        if(matched){
            return matched[1] + '-' + matched[2] + '.mp4';
        }
        return tsChunkName;
    }

};