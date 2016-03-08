/**
 * Created by elad.benedict on 8/26/2015.
 */

var Q = require('q');
var _ = require('underscore');
var config = require('../../common/Configuration');
//var logger = require('../../../common/logger/logger.js')(module);
var networkClient = require('../NetworkClient.js');
var url = require('url');
var baseAdapter = require('./BaseAdapter.js').BaseAdapter;
var util = require('util');
var entryCache = require('./EntryCache.js');
var WowzaStreamInfo = require('./WowzaStreamInfo.js');

var applicationName = config.get('mediaServer').applicationName;
var hostname = config.get('mediaServer').hostname;
var port = config.get('mediaServer').port;
var wowzaUrl = "http://" + hostname + ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" + applicationName + "/instances";
//var wowzaUrl2="http://localhost:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/"+applicationName+"/instances/_definst_/incomingstreams/"+entryId+"/monitoring/current”
var backendClient = require('../BackendClientFactory.js').getBackendClient();



function WowzaAdapter() {
    this.entries = {};
    baseAdapter.call(this);
}
util.inherits(WowzaAdapter,baseAdapter);

var getStreamInfo = function() {
    return  new WowzaStreamInfo(this.entryId, this.flavorParamsIds, this.sourceIp);
};

function deleteUnactiveStreams(currentlyActiveStreams) {
    var that = this;
    var unactiveEntries = _.reject(that.entries, function(e1) {
        return !_.contains(currentlyActiveStreams, function(e2) {
            return e1.entryId === e2.entryId;
        });
    });
    _.each(unactiveEntries, function(e) {
       delete that.entries(e.entryId);
    });
}

WowzaAdapter.prototype.getLiveEntries = function() {
    var that = this;
    return networkClient.read({
            url : wowzaUrl,
            json : true
        })
        .then(function(res) {
            if (res.instanceList.length === 0) {
                return [];
            }
            var uniqueList = _.uniq(res.instanceList[0].incomingStreams, function(item) {
                var i = item.name.lastIndexOf('_');
                var entryId;
                if (i != -1) {
                    entryId = item.name.substr(0, i);
                    // TODO: Why do we need this assigning? -> Gad
                    item.entryId = entryId;
                }
                return entryId
            });
            deleteUnactiveStreams.call(that, uniqueList);
            var promises = _.map(uniqueList, function(stream) {
                var entryId = stream.entryId;
                var cachedEntryInfo = that.entries[entryId];
                if (cachedEntryInfo) {
                    return Q.resolve(cachedEntryInfo);
                }
                return backendClient.getEntries([entryId])
                    .then(function(entryArr) {
                        if (entryArr.length) {
                            var newEntry = entryArr[0];
                            that.entries[entryId] = newEntry;
                            newEntry.sourceIp = stream.sourceIp;
                            newEntry.getStreamInfo = getStreamInfo;
                            return Q.resolve(newEntry);
                        }
                        return Q.reject("No entries received");
                });
            });

           return Q.all(promises)
               .then(function(res) {
                    return Q.resolve(res);
           });


        })
        .catch(function(err) {
            console.warn("Received the following warning: " + err, "", err.stack);
            return [];
        });
}

module.exports = WowzaAdapter;