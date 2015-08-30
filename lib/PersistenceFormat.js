/**
 * Created by elad.benedict on 8/23/2015.
 */

var path = require('path');
var config = require('./Configuration');

module.exports = {

    getEntryFullPath: function (entryId) {
        return path.join(config.get('rootFolderPath'), entryId);
    },

    getEntryRelativePath: function (entryId) {
        return entryId;
    },

    getFlavorFullPath: function (entryId, bitrate) {
        return path.join(config.get('rootFolderPath'), entryId, bitrate.toString());
    },

    getFlavorRelativePath: function (entryId, bitrate) {
        return path.join(entryId, bitrate.toString());
    },

    getManifestName : function()
    {
        return 'manifest.m3u8';
    }

};