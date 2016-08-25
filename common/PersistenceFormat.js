/**
 * Created by elad.benedict on 8/23/2015.
 */

var config = require('./Configuration');
var path = require('path');
var qio = require('q-io/fs');
var _ = require('underscore');
var Q = require('q');

module.exports = {

    getEntryFullPath: function (entryId) {
        return path.join(config.get('rootFolderPath'), entryId);
    },

    getEntryBasePath: function (path) {
        let subString = path.match(/([01]_\w+\/[0-9]+\/)/)[1];
        return path.substr(0, path.lastIndexOf(subString) + subString.length);
    },

    getFlavorFullPath: function (entryId, flavorName) {
        return path.join(config.get('rootFolderPath'), entryId, flavorName.toString());
    },

    getFlavorRelativePath: function (entryId, flavorName) {
        return path.join(entryId, flavorName.toString());
    },

    getManifestName: function () {
        return 'chunklist.m3u8';
    },

    getMasterManifestName: function () {
        return 'playlist.json';
    },
    
    getMP4FileNamefromInfo: function(chunkPath){
        return path.basename(chunkPath) + '.mp4';
    },
    
    getTSChunknameFromMP4FileName: function(mp4FileName){
        return mp4FileName.substr(0,mp4FileName.length -'.mp4'.length);    
    }
};