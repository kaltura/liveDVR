/**
 * Created by elad.benedict on 8/23/2015.
 */

var path = require('path');


module.exports = {

    getEntryFullPath: function (entryId) {
        var config = require('./Configuration');
        return path.join(config.get('rootFolderPath'), entryId);
    },

    getEntryRelativePath: function (entryId) {
        return entryId;
    },

    getFlavorFullPath: function (entryId, bitrate) {
        var config = require('./Configuration');
        return path.join(config.get('rootFolderPath'), entryId, bitrate.toString());
    },

    getFlavorRelativePath: function (entryId, bitrate) {
        return path.join(entryId, bitrate.toString());
    },

    getManifestName: function () {
        return 'manifest.m3u8';
    }
};