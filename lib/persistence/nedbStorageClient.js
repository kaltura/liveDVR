/**
 * Created by elad.benedict on 12/15/2015.
 */

var config = require('../../common/Configuration');
var path = require('path');
var Datastore = require('nedb')
var dbFilesFolderPath = config.get("nedbFilesFolderPath");
var entryPersistence = new Datastore({ filename: path.join(dbFilesFolderPath, 'entry.db'), autoload: true });
var Q = require('q');

var pInsert = Q.nbind(entryPersistence.insert, entryPersistence);
var pFindOne = Q.nbind(entryPersistence.findOne, entryPersistence);
var pRemove = Q.nbind(entryPersistence.remove, entryPersistence);
var pUpdate = Q.nbind(entryPersistence.update, entryPersistence);

module.exports = (function(){

    var addEntry = function(entryId, flavors){
        return pInsert({
            _id : entryId,
            id : entryId,
            flavors : flavors,
            lastUpdatedAt : new Date().getTime()
        })
    }

    var getEntry = function(entryId){
        return pFindOne({
            _id : entryId
        }).then(function(doc){
            if (!doc){
                throw new Error('entry ' + entryId + ' does not exist in the DB');
            }
            return doc;
        })
    }

    var removeEntry = function(entryId){
        return pRemove({ _id: entryId }, {}).then(function(numRemoved){
            if (numRemoved === 0)
            {
                throw new Error('entry ' + entryId + ' does not exist in the DB');
            }
        })
    }

    var refreshEntrySession = function refreshEntrySession(entryId)
    {
        return pUpdate({_id : entryId}, { lastUpdatedAt : new Date().getTime()});
    }

    var addToListOfChunksToDownload = function addToListOfChunksToDownload(entryId, chunkNames)
    {
        return pUpdate({ _id: entryId }, { $addToSet: { chunksToDownload: {$each: chunkNames } } }, {});
    }

    var markChunksAsDownloaded = function addToListOfChunksToDownload(entryId, chunkNames)
    {
        return pUpdate({ _id: entryId },
            {
                $addToSet: { downloadedChunks: {$each: chunkNames } },
                $pull: { chunksToDownload: { $in: chunkNames } }
            }, {});
    }

    // isNewSession(entryId)
    // refresh session
    // entries awaiting ext-x-endlist - load on start and update on add/remove
    // chunks to download - update on intermediate manifest update and remove upon download

    return {
        addEntry : addEntry,
        getEntry : getEntry,
        removeEntry : removeEntry,
        refreshEntrySession : refreshEntrySession,
        addToListOfChunksToDownload : addToListOfChunksToDownload,
        markChunksAsDownloaded : markChunksAsDownloaded
    }
})();
