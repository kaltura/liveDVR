/**
 * Created by elad.benedict on 8/26/2015.
 */

var sinon = require('sinon');
var Q = require('q');
var _ = require('underscore');


var logger = require('../../common/logger').getLogger('BackendClientMock');

var entries=[{
    entryId : '1_xxxxx',
    flavorParamsIds: "32",
    dvrWindow : 60*60*2
},{
    entryId : '*',
    flavorParamsIds: "32",
    dvrWindow : 60*60*2
}];

module.exports = {
    getLiveEntriesForMediaServer : Q.resolve(entries),
    getEntryInfo : function(entryId) {
        var res=_.find(entries,function(e) {
            return e.entryId===entryId || e.entryId==='*';
        });
        if (res) {
            var result=_.clone(res);
            result.entryId=entryId;
            return Q.resolve(result);
        }
        return Q.reject("No such entry");
    },
    registerEntryInDatabase : function(entryObject, state, event) {
        logger.info("[%s] Calling registerMediaServer, serverIndex: [%s], state=%s", entryObject.entryId,entryObject.serverType,state);
        return Q.resolve();
    },
    unregisterEntryInDatabase: function(entryObject) {
        logger.info("[%s] Calling unregisterMediaServer, serverIndex: [%s]", entryObject.entryId,entryObject.serverType);
        return Q.resolve();
    }
};