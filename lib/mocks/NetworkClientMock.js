/**
 * Created by elad.benedict on 8/24/2015.
 */

var Q = require('q');
var sinon = require('sinon');

module.exports = {
    read : sinon.stub().returns(Q())
};