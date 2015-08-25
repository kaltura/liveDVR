/**
 * Created by elad.benedict on 8/23/2015.
 */

var path = require('path');

module.exports = function(rootFolderPath){
    return {
        getEntryDestPath : function(entryId){
            return path.join(rootFolderPath, entryId);
        },

        getFlavorDestPath : function(entryId, bitrate){
            return path.join(rootFolderPath, entryId, bitrate.toString());
        }
    };
};