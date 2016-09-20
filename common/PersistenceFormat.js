/**
 * Created by elad.benedict on 8/23/2015.
 */

var config = require('./Configuration');
var path = require('path');
var qio = require('q-io/fs');
var _ = require('underscore');
var Q = require('q');


module.exports = {

    getEntryBasePath: function (entryId) {
        return path.join(config.get('rootFolderPath'), entryId);
    },
    
    getBasePathFromFull: function (directory) {
            return path.dirname(path.dirname(directory));
    },

    getFlavorFullPath: function (entryId, flavorName) {
        return path.join(config.get('rootFolderPath'), entryId, flavorName.toString());
    },

    getMasterManifestName: function () {
        return 'playlist.json';
    },
    
    getMP4FileNamefromInfo: function(chunkPath){
        return path.basename(chunkPath) + '.mp4';
    },
    
    getTSChunknameFromMP4FileName: function(mp4FileName){
        return mp4FileName.substr(0, mp4FileName.length - 4); //'.mp4'.length);
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
    }
};