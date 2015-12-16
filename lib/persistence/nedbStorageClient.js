/**
 * Created by elad.benedict on 12/15/2015.
 */

var config = require('../../common/Configuration');
var path = require('path');
var Datastore = require('nedb')
var dbFilesFolderPath = config.get("nedbFilesFolderPath");
var entryPersistence = new Datastore({ filename: path.join(dbFilesFolderPath, 'entry.db'), autoload: true });
var Q = require('q');
var _ = require('underscore');

var pInsert = Q.nbind(entryPersistence.insert, entryPersistence);
var pFindOne = Q.nbind(entryPersistence.findOne, entryPersistence);
var pRemove = Q.nbind(entryPersistence.remove, entryPersistence);
var pUpdate = Q.nbind(entryPersistence.update, entryPersistence);
var pFind = Q.nbind(entryPersistence.find, entryPersistence);

module.exports = (function(){

    var addEntry = function(entryId){
        var objToInsert = {
            _id : entryId,
            id : entryId,
            downloadedChunks:{},
            chunksToDownload:{},
            lastUpdatedAt : new Date().getTime()
        };

        return pInsert(objToInsert)
    }

    var getEntry = function(entryId){
        return pFindOne({
            _id : entryId
        }).then(function(doc){
            if (!doc){
                throw new Error('getEntry: entry ' + entryId + ' does not exist in the DB');
            }
            return doc;
        })
    }

    var removeEntry = function(entryId){
        return pRemove({ _id: entryId }, {}).then(function(numRemoved){
            if (numRemoved === 0)
            {
                throw new Error('removeEntry: entry ' + entryId + ' does not exist in the DB');
            }
        })
    }

    var refreshEntrySession = function refreshEntrySession(entryId)
    {
        return pUpdate({_id : entryId}, { $set :{ lastUpdatedAt : new Date().getTime()} }).then(function(res){
            if (!res)
            {
                throw new Error("refreshEntrySession: Entry " + entryId + " not updated in the DB")
            }
        });;
    }

    var markChunksAsDownloaded = function markChunksAsDownloaded(entryId, flavor, chunkNames)
    {
        var modifier = {};

        var chunksToDownloadProperty = 'chunksToDownload.' + flavor;
        var downloadedChunksProperty = 'downloadedChunks.' + flavor;

        // $pull: { chunksToDownload.90000 : { $in: chunkNames } }
        var pull = modifier['$pull'] = {};
        pull[chunksToDownloadProperty] = {$in: chunkNames };

        // $addToSet: { downloadedChunks.90000 : {$each: chunkNames } },
        var addToSet = modifier['$addToSet'] = {};
        addToSet[downloadedChunksProperty] = {$each: chunkNames };

        return pUpdate({ _id: entryId }, modifier, {}).then(function(res){
            if (!res)
            {
                throw new Error("markChunksAsDownloaded: Entry " + entryId + " not updated in the DB")
            }
        });
    }

    var markChunksAsObsolete = function markChunksAsObsolete(entryId, flavor, chunkNames)
    {
        var modifier = {};

        var downloadedChunksProperty = 'downloadedChunks.' + flavor;

        // $pull: { downloadedChunks.90000 : { $in: chunkNames } }
        var pull = modifier['$pull'] = {};
        pull[downloadedChunksProperty] = {$in: chunkNames };

        return pUpdate({ _id: entryId }, modifier, {});
    }

    var isNewSession = function isNewSession(entryId)
    {
        return pFindOne({
            _id : entryId
        }).then(function(doc){
            if (!doc){
                return true;
            }
            return doc.lastUpdatedAt + config.get('sessionDuration') < new Date().getTime() ;
        })
    }

    var getAllHandledEntryIds = function getAllHandledEntryIds()
    {
        return pFind({}).then(function(entries){
            return _.map(entries, function(e){
                return e.entryId;
            })
        });
    }

    var getAllData = function getAllData()
    {
        return pFind({});
    }

    var addToListOfChunksToDownload = function addToListOfChunksToDownload(entryId, flavor, chunkNames)
    {
        var chunksToDownloadProprety = 'chunksToDownload.'  + flavor;
        var addToSetObj = {};
        addToSetObj[chunksToDownloadProprety] = {$each: chunkNames }

        // pUpdate({ _id: entryId }, { $addToSet: { chunksToDownload: {$each: chunkNames } } }, {})
        return pUpdate({ _id: entryId }, { $addToSet: addToSetObj }, {})
            .then(function(res){
                if (!res)
                {
                    throw new Error("addToListOfChunksToDownload: Entry " + entryId + " not updated in the DB")
                }
            });
    }

    var addFlavorToEntry = function(entryId, flavor)
    {
        var downloadedChunksProprety = 'downloadedChunks.' + flavor;
        var chunksToDownloadProprety = 'chunksToDownload.' + flavor;
        var setObj = {};
        setObj[downloadedChunksProprety] = [];
        setObj[chunksToDownloadProprety] = [];
        return pUpdate({ _id: entryId }, { $set: setObj }, {}).then(function(res){
            if (!res)
            {
                throw new Error("addFlavorToEntry: Entry " + entryId + " not updated in the DB")
            }
        });
    }

    return {
        addEntry : addEntry,
        addFlavorToEntry : addFlavorToEntry,
        getEntry : getEntry,
        removeEntry : removeEntry, // USE!!
        refreshEntrySession : refreshEntrySession,
        markChunksAsObsolete : markChunksAsObsolete,
        markChunksAsDownloaded : markChunksAsDownloaded,
        addToListOfChunksToDownload : addToListOfChunksToDownload,
        isNewSession : isNewSession,
        getAllHandledEntryIds : getAllHandledEntryIds, // USE!
        getAllData : getAllData
    }

})();
