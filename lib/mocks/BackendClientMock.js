/**
 * Created by elad.benedict on 8/26/2015.
 */

var sinon = require('sinon');
var Q = require('q');
var _ = require('underscore');

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
    }
};