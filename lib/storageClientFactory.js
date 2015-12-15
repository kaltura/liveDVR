/**
 * Created by elad.benedict on 12/15/2015.
 */

module.exports = (function(){

    var storageClient;

    var getStorageClient = function getStorageClient(){
        if (!storageClient)
        {
            storageClient = require('./persistence/nedbStorageClient');
        }
        return storageClient;
    };

    return {
        getStorageClient : getStorageClient
    };
})();