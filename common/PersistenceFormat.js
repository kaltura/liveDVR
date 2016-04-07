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

    getEntryRelativePath: function (entryId) {
        return entryId;
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
    getMP4fromTSchunkName: function(chunkName){
        var bn = path.basename(chunkName);
        return bn + '.mp4';
    },
    getTSfromMP4chunkName: function(chunkName){
        var bn = path.basename(chunkName);
        var idx = bn.lastIndexOf('.mp4');
        if(idx > 0){
            bn = bn.substring(0,idx);
        }
        return bn;
    }
};