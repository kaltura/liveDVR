/**
 * Created by elad.benedict on 8/23/2015.
 */

var path = require('path');
var qio = require('q-io/fs');
var _ = require('underscore');
var Q = require('q');

module.exports = {

    getEntryFullPath: function (entryId) {
        var config = require('./Configuration');
        return path.join(config.get('rootFolderPath'), entryId);
    },

    getEntryRelativePath: function (entryId) {
        return entryId;
    },

    getFlavorFullPath: function (entryId, flavorRecognizer) {
        var config = require('./Configuration');
        return path.join(config.get('rootFolderPath'), entryId, flavorRecognizer.toString());
    },

    getFlavorRelativePath: function (entryId, flavorRecognizer) {
        return path.join(entryId, flavorRecognizer.toString());
    },

    getManifestName: function () {
        return 'chunklist.m3u8';
    },

    getMasterManifestName: function () {
        return 'playlist.m3u8';
    }
};