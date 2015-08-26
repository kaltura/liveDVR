/**
 * Created by elad.benedict on 8/26/2015.
 */

var sinon = require('sinon');

module.exports = {
    liveEntries : [],
    getLiveEntriesForMediaServer : sinon.stub().returns(this.liveEntries)
};