var Q = require('q');

var entryCache = require('./EntryCache.js');
var _ = require('underscore');

function BaseAdapter() {
}


BaseAdapter.prototype.getLiveEntriesForMediaServer=function() {

}



BaseAdapter.prototype.extendEntryInfoFromAPI=function(entries) {

    var entriesId = _.pluck(entries, "entryId");

    _.each(entries, function (item) {
        _.extend(item, {
            "flavorParamsIds": "1",
            "maxChunkCount": 20
        });
    });

    return Q.resolve(entries);

    return entryCache.getEntries(entriesId).then(function () {
        _.each(entries, function (item) {
            _.extend(item, entryCache.get(item.entryId));
        });

        return Q.resolve(entries);
    });

}


exports.BaseAdapter=BaseAdapter;