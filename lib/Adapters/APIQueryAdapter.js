
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



APIQueryAdapter.prototype.getLiveEntriesForMediaServer=function() {
    var self = this;

    return backendClient.getLiveEntriesForMediaServer().then(function (res) {

        _.each(res, function (r) {
            r.getStreamInfo=function() {
                return new WowzaStreamInfo(r.entryId, r.flavorParamsIds);
            };
        });
        return Q.resolve(res);
    });
}



module.exports = APIQueryAdapter;