/**
 * Created by elad.benedict on 8/23/2015.
 */

var path = require('path');
var qio = require('q-io/fs');
var _ = require('underscore');
var Q = require('q');

module.exports = {

    getAllStoredEntries : function(){
        var config = require('./Configuration');
        var rootFolder = config.get('rootFolderPath');

        return qio.list(rootFolder).then(function(files){
            // Convert to full path
            files = _.map(files, function(file) { return path.resolve(rootFolder, file);});
            var statsPromises = _.map(files, function(file) {
                return qio.stat(file).then(function(stat){
                    return {
                        stat: stat,
                        file : file
                    };
                });
            });
            return Q.all(statsPromises);
        }).then(function(extendedStats){
            var directories =  _.filter(extendedStats, function(es){
                return es.stat.isDirectory();
            });
            return _.map(directories, function(es) { return path.basename(es.file); });
        });
    },

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