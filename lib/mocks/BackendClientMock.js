/**
 * Created by elad.benedict on 8/26/2015.
 */

var sinon = require('sinon');
var Q = require('q');
var _ = require('underscore');


var logger = require('../../common/logger').getLogger('BackendClientMock');

var entries=[{
    entryId : '1_yinsgmiva',
-    flavorParamsIds:'32',
    dvrWindow : 60*60*2
}];

module.exports = {
    getLiveEntriesForMediaServer : Q.resolve(entries),
    getEntryInfo : function(entryId) {
        var res=_.find(entries,function(e) {
            return e.entryId===entryId;
        });
        if (res) {
            return Q.resolve(res);
        }
        return Q.reject("No such entry");
    },
    registerEntryInDatabase : function(entryObject, state, event) {
        logger.info("[%s] Calling registerMediaServer, updating entry in database state=%s", entryObject.entryId,state);
        return Q.resolve();
    },
    unregisterEntryInDatabase: function(entryObject) {
        logger.info("[%s] Calling unregisterMediaServer, and delete entry from database", entryObject.entryId);
        return Q.resolve();


   }
};