/**
 * Created by elad.benedict on 8/26/2015.
 */

var Q = require('q');
var _ = require('underscore');
var config = require('../../common/Configuration');
var networkClient = require('../NetworkClient.js');
var logger = require('../logger/logger')(module);
var baseAdapter = require('./BaseAdapter.js').BaseAdapter;
var WowzaStreamInfo = require('./WowzaStreamInfo.js');
var url = require('url');
var util = require('util');
//var entryCache = require('./EntryCache.js');


var applicationName = config.get('mediaServer').applicationName;
var hostname = config.get('mediaServer').hostname;
var port = config.get('mediaServer').port;
var user = config.get('mediaServer').user;
var password = config.get('mediaServer').password;
var authentication = ((user !== "") && (password !== "")) ? user + ":" + password + "@" : "";
var wowzaUrl = "http://" + authentication + hostname + ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" + applicationName + "/instances";
var backendClient = require('../BackendClientFactory.js').getBackendClient();

function WowzaAdapter() {
    this.entries = {};
    baseAdapter.call(this);
}
util.inherits(WowzaAdapter,baseAdapter);

var getStreamInfo = function() {
    return  new WowzaStreamInfo(this.entryId, this.flavorParamsIds, this.sourceIp);
};

function deleteInactiveStreams(currentlyActiveStreams) {
    var that = this;
    var unactiveEntries = _.reject(that.entries, function(e1) {
        return _.findWhere(currentlyActiveStreams, {'entryId' : e1.entryId});
    });
     _.each(unactiveEntries, function(e) {
        logger.debug("Detected entry %s not streaming anymore", e.entryId);
        delete that.entries[e.entryId];
    });
}

WowzaAdapter.prototype.getLiveEntries = function() {
    var that = this;
    return networkClient.read({
            url : wowzaUrl,
            json : true
        })
        .then(function(res) {
            logger.debug("Received playing entries list from Wowza")
            if (res.instanceList.length === 0) {
                logger.debug("No wowza instances");
                return [];

            }
            if (res.instanceList[0].incomingStreams.length === 0) {
                logger.debug("No streams are currently playing");
                return [];
            }
            var uniqueList = _.uniq(res.instanceList[0].incomingStreams, function(item) {
                var i = item.name.lastIndexOf('_');
                var entryId;
                if (i != -1) {
                    entryId = item.name.substr(0, i);
                    item.entryId = entryId;
                }
                return entryId
            });
            // Make sure module's entries list doesn't contain entries that are no longer streaming
            logger.debug("wowzaAdapter - Check for streams that are no longer playing and update list");
            deleteInactiveStreams.call(that, uniqueList);
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
                            logger.info("Received stream info for entry %s %j", entryId,newEntry);
                            return Q.resolve(newEntry);
                        }
                        logger.error("Entry %s doesn't exist in server, reject promise", entryId);
                        return Q.reject("Entry doesn't exist in server");
                });
            });

            return Q.allSettled(promises)
                .then(function(res) {
                    // Return only the entries that their promise is resolved
                    var passed = _.filter(res, function(p) { return p.state === "fulfilled"; });
                    return Q.resolve(_.map(passed, function(p) {
                        return p.value;
                    }));
                });
        })
        .catch(function(err) {
            logger.error("Received the following warning: %j, (%s)", err, err.stack ? err.stack : "");
            return [];
        });
}

module.exports = WowzaAdapter;