/**
 * Created by elad.benedict on 8/26/2015.
 */

var sinon = require('sinon');
var Q = require('q');

module.exports = {
    liveEntries : [],
    getLiveEntriesForMediaServer : sinon.stub().returns(Q(this.liveEntries))
};