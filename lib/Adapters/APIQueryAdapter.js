var Q = require('q');
var _ = require('underscore');
var config = require('../../common/Configuration');
var WowzaStreamInfo = require('./WowzaStreamInfo.js');
var BaseAdapter=require('./BaseAdapter.js').BaseAdapter;
var util=require('util');
var backendClient=require('../BackendClientFactory.js').getBackendClient();

function APIQueryAdapter() {
    BaseAdapter.call(this);
}
util.inherits(APIQueryAdapter,BaseAdapter);

var getWowzaStreamInfo = function() {
    return new WowzaStreamInfo(this.entryId, this.flavorParamsIds);
};

APIQueryAdapter.prototype.getLiveEntries = function() {
    return backendClient.getLiveEntriesForMediaServer()
        .then(function(res) {
            _.each(res, function(r) {
                r.getStreamInfo = getWowzaStreamInfo;
            });
            return Q.resolve(res);
        });
};

module.exports = APIQueryAdapter;