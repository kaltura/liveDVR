/**
 * Created by elad.benedict on 8/26/2015.
 */

var Q = require('q');
var _ = require('underscore');
var config = require('../../common/Configuration');
var networkClient = require('../NetworkClient.js');
var logger = require('../../common/logger').getLogger("WowzaAdapter");
var baseAdapter = require('./BaseAdapter.js').BaseAdapter;
var WowzaStreamInfo = require('./WowzaStreamInfo.js');
var url = require('url');
var util = require('util');
//var entryCache = require('./EntryCache.js');


var applicationName = config.get('mediaServer').applicationName;
var hostname = config.get('mediaServer').hostname;
var port = config.get('mediaServer').port;
var user = config.get('mediaServer').user;
var requestTimeout = config.get("requestTimeout");
var password = config.get('mediaServer').password;
var authentication = ((user !== "") && (password !== "")) ? user + ":" + password + "@" : "";
var wowzaUrl = "http://" + authentication + hostname + ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" + applicationName + "/instances";
var backendClient = require('../BackendClientFactory.js').getBackendClient();
var errorUtils = require('../utils/error-utils');

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
    var inactiveEntries = _.reject(that.entries, function(e1) {
        return _.findWhere(currentlyActiveStreams, {'entryId' : e1.entryId});
    });
     _.each(inactiveEntries, function(e) {
        logger.debug("[%s] Detected that entry is not streaming anymore", e.entryId);
        delete that.entries[e.entryId];
    });
}

WowzaAdapter.prototype.getLiveEntries = function() {
    var that = this;
    return networkClient.read({
            url : wowzaUrl,
            json : true,
            timeout: requestTimeout ? requestTimeout : 20000
        })
        .then(function(res) {
            logger.debug("Received playing entries list from Wowza")
            if (res.instanceList.length === 0) {
                logger.debug("No wowza instances");
                return [];

            }
            var incomingStreams = [];
            // Concat all incoming streams into one big list
            _.each(res.instanceList, function(list) {
                Array.prototype.push.apply(incomingStreams, list.incomingStreams);
            });
            if (incomingStreams.length === 0) {
                logger.debug("No streams are currently playing");
            }

            let uniqueList={};

            //filter out all unique entries and build a flavor map per entry
            _.each(incomingStreams, (item) => {
                let re=/([01]_[^_]+)_(?:publish_)?(.*)/.exec(item.name);
                if (re && re.length===3) {
                    let entryId=re[1];
                    let flavor=re[2];
                    if (!uniqueList[entryId])
                        uniqueList[entryId]={ 'entryId': entryId,
                                              'sourceIp': item.sourceIp,
                                              'flavors': []};

                    if (item.sourceIp === "local (Transcoder)") {
                        uniqueList[entryId]['flavors'].push(flavor);
                    }
                } else {
                    logger.warn("Unidentified stream %j",item);
                }
            });
            // Make sure module's entries list doesn't contain entries that are no longer streaming
            logger.debug("Check for streams that are no longer playing and update list");
            deleteInactiveStreams.call(that, uniqueList);
            var promises = _.map(uniqueList, function(stream) {
                var entryId = stream.entryId
                let flavorParamsIds = stream.flavors.join(',');
                var cachedEntryInfo = that.entries[entryId];
                //no need for API call if nothing has changed
                if (cachedEntryInfo) {
                    if (cachedEntryInfo.flavorParamsIds !== flavorParamsIds) {
                        cachedEntryInfo.flavorParamsIds = flavorParamsIds;
                        cachedEntryInfo.getStreamInfo = getStreamInfo;
                    }
                    cachedEntryInfo.canPlay = true;
                    return Q.resolve(cachedEntryInfo);
                }
                return backendClient.getEntryInfo(entryId)
                    .then(function(entryInfo) {
                        if (entryInfo) {
                            that.entries[entryId] = entryInfo;
                            entryInfo.sourceIp = stream.sourceIp;
                            //If playing flavors are equal to the configured flavors, allow entry to start playing immediately.
                            //otherwise wait another iteration to allow flavors to arrive.
                            entryInfo.canPlay = (entryInfo.flavorParamsIds === flavorParamsIds);
                            entryInfo.getStreamInfo = getStreamInfo;
                            logger.info("Received stream info for entry %s %j", entryId,entryInfo);
                            return Q.resolve(entryInfo);
                        }
                        logger.error("Entry %s doesn't exist in server, reject promise", entryId);
                        return Q.reject("Entry doesn't exist in server");
                    })
                    .catch(function(err) {
                        logger.error("Error occurred while calling server: %s", errorUtils.error2string(err));
                        return Q.reject(err);
                    });
            });

            return Q.allSettled(promises)
                .then(function(res) {
                    // Return only the entries that their promise is resolved
                    var passed = _.filter(res, function(p) { return (p.state === "fulfilled") && (p.value.canPlay); });
                    return Q.resolve(_.map(passed, function(p) {
                        return p.value;
                    }));
                });
        })
        .catch(function(err) {
            logger.error("Received the following warning: %s", errorUtils.error2string(err));
            that.entries = {};
            return [];
        });
};

module.exports = WowzaAdapter;