/**
 * Created by elad.benedict on 8/26/2015.
 */

var sinon = require('sinon');
var Q = require('q');

module.exports = {
    getLiveEntriesForMediaServer : sinon.stub().returns(Q([{
        entryId : '12345',
        dvrWindow : 60*60*2
    }]))
};