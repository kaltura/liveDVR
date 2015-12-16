/**
 * Created by elad.benedict on 9/6/2015.
 */

var persistenceFormat = require('./../common/PersistenceFormat');
var config = require('../common/Configuration');
var Q = require('q');
var qio = require('q-io/fs');
var logger = require('./logger/logger')(module);
var path = require('path');
var touch = require('touch');
var storageClientFactory = require('./StorageClientFactory');

module.exports = (function(){

    var storageClient = storageClientFactory.getStorageClient();
    var isNewSession = function isNewSession(entryId) {
        return storageClient.isNewSession(entryId);
    };

    var refreshSessionTimestamp = function(entryId){
        return storageClient.refreshEntrySession(entryId);
    };

    var getSessionDuration = function(){
        return config.get('sessionDuration');
    };

    return  {
        isNewSession : isNewSession,
        getSessionDuration : getSessionDuration,
        refreshSessionTimestamp : refreshSessionTimestamp
    };
})();