/**
 * Created by elad.benedict on 8/26/2015.
 */

var sinon = require('sinon');
var Q = require('q');

module.exports = {
    getLiveEntriesForMediaServer : sinon.stub().returns(Q(['12345']))
};