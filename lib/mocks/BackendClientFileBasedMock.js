/**
 * Created by elad.benedict on 9/7/2015.
 */

var qio = require('q-io/fs');
var path = require('path');

module.exports = {
    getLiveEntriesForMediaServer : function(){
        return qio.read(path.join(__dirname, 'mockBackendResults.json')).then(function(jsonString){
            return JSON.parse(jsonString);
        });
    }
};