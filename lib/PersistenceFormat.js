/**
 * Created by elad.benedict on 8/23/2015.
 */

var path = require('path');
var config = require('./Configuration');

module.exports = {

    getEntryDestPath: function (entryId) {
        return path.join(config.get('rootFolderPath'), entryId);
    },

    getFlavorDestPath: function (entryId, bitrate) {
        return path.join(config.get('rootFolderPath'), entryId, bitrate.toString());
    }

};