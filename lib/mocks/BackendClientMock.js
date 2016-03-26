/**
 * Created by elad.benedict on 8/26/2015.
 */

var sinon = require('sinon');
var Q = require('q');
var _ = require('underscore');

var logger = require('../logger/logger')(module);

var entries=[{
    entryId : '1_abc123',
    flavorParamsIds:'1',
    dvrWindow : 60*60*2
}];

module.exports = {
    getLiveEntriesForMediaServer : Q.resolve(entries),
    getEntries : function(request) {
        var res=_.filter(entries,function(e) {
            return request.indexOf(e.entryId)>-1;
        });
        return Q.resolve(res);
    },
    registerEntryInDatabase : function(entryObject, state, event) {
        logger.info("Calling registerMediaServer, updating entry %s in database state=%s", entryObject.entryId,state);
        return Q.resolve();
    },
    unregisterEntryInDatabase: function(entryId) {
        logger.info("Calling unregisterMediaServer, and delete entry %s from database", entryId);
        return Q.resolve();


    }
};