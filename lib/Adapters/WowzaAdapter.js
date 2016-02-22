/**
 * Created by elad.benedict on 8/26/2015.
 */

var Q = require('q');
var _ = require('underscore');
var config = require('../../common/Configuration');
//var logger = require('../../../common/logger/logger.js')(module);
var NetworkClient=require('../NetworkClient.js');
var url = require('url');
var BaseAdapter=require('./BaseAdapter.js').BaseAdapter;
var util=require('util');

var entryCache = require('./EntryCache.js');
var WowzaStreamInfo = require('./WowzaStreamInfo.js');


var applicationName=config.get('mediaServer').applicationName;
var hostname = config.get('mediaServer').hostname;
var port = config.get('mediaServer').port;
var wowzaUrl="http://localhost:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/"+applicationName+"/instances";
//var wowzaUrl2="http://localhost:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/"+applicationName+"/instances/_definst_/incomingstreams/"+entryId+"/monitoring/current”
var backendClient=require('../BackendClientFactory.js').getBackendClient();



function WowzaAdapter() {

    BaseAdapter.call(this);

}
util.inherits(WowzaAdapter,BaseAdapter);

var getStreamInfo = function() {
    return  new WowzaStreamInfo(this.entryId, this.flavorParamsIds, this.sourceIp);
};


WowzaAdapter.prototype.getLiveEntries=function() {
    var self=this;
    return NetworkClient.read({
            url:wowzaUrl,
            json:true
        })
        .then(function(res) {
            if (res.instanceList.length==0) {
                return [];
            }
            var promises= _.map(res.instanceList[0].incomingStreams,function(stream) {
                var entryId = "";
                var i = stream.name.lastIndexOf('_');
                if (i != -1) {
                    entryId = stream.name.substr(0, i);
                }
                var cachedEntryInfo = self.entries[entryId];
                if (cachedEntryInfo) {
                    return Q.resolve(cachedEntryInfo);
                }
                return backendClient.getEntries([entryId])
                    .then(function (entryArr) {
                        var newEntry=entryArr[0];
                        self.entries[entryId] = newEntry;
                        newEntry.sourceIp = stream.sourceIp;
                        newEntry.getStreamInfo = getStreamInfo;
                        return Q.resolve(newEntry);
                });
            });

           return Q.all(promises).then(function(res) {
               return Q.resolve(res);
           })


        })
        .catch(function(err) {
            console.warn(err,"",err.stack);
            return [];
        });
}

module.exports = WowzaAdapter;