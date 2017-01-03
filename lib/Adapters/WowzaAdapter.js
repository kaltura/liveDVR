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
var errorUtils = require('../utils/error-utils');
var backendClient = require('../BackendClientFactory.js').getBackendClient();

var requestTimeout = config.get("requestTimeout");

function WowzaAdapter(mediaServerConfig,hostname) {
    this.entries = {};

    let applicationName = mediaServerConfig.applicationName;
    let port = mediaServerConfig.port;
    let user = mediaServerConfig.user;
    let password = mediaServerConfig.password;
    this.diagnosticsInterval = config.get('adapterDiagnosticsIntervalInSec');
    var authentication = ((user !== "") && (password !== "")) ? user + ":" + password + "@" : "";
    this._wowzaUrl = "http://" + authentication + hostname + ":8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/" + applicationName + "/instances";
    this._wowzaDiagUrl = "http://" + authentication + hostname + ":8086/diagnostics/entries";
    if (mediaServerConfig.entryIds) {
        this._entryIds = new Set(mediaServerConfig.entryIds) ;
    }
    if (mediaServerConfig.includeAllEntriesFrom && new Set(mediaServerConfig.includeAllEntriesFrom).has(hostname)) {
        delete this._entryIds;
    }
    this._baseUrl= url.format({
        protocol : 'http',
        hostname : hostname,
        port : port,
        pathname : applicationName
    });
    this.flavorMismatchRetryAttempts = mediaServerConfig.flavorMismatchRetryAttempts;
    this.disconnectTimeoutInSec = mediaServerConfig.disconnectTimeoutInSec;
    this.getLiveEntriesTimestamp = 0;
    this.liveEntriesCache = [];
    this.liveEntriesDiagnostics = {};
    baseAdapter.call(this);

    getDiagnostics.call(this);
}

util.inherits(WowzaAdapter,baseAdapter);

var getStreamInfo = function() {

    return  new WowzaStreamInfo(this.baseUrl, this.entryId, this.flavorParamsIds, this.sourceIp);
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

function getIncomingStreamsInfo(incomingStreams) {
    let retValue = {};
    //filter out all unique entries and build a flavor map per entry
    _.each(incomingStreams, (item) => {
        let re=/([01]_[^_]+)_(?:publish_)?(.*)/.exec(item.name);
        if (re && re.length===3) {
            let entryId=re[1];

            if (this._entryIds && !this._entryIds.has(entryId)) {
                return;
            }

            if (item.sourceIp === "local (Transcoder)") {
                let flavor=re[2];
                if (!retValue[entryId])
                    retValue[entryId]={ 'entryId': entryId,
                        'sourceIp': item.sourceIp,
                        'flavors': []};
                retValue[entryId]['flavors'].push(flavor);
            }
        } else {
            logger.warn("Unidentified stream %j",item);
        }
    });

    return retValue;
}

function checkFlavorsMatch(entry, flavorParamsIds) {
    //no need for API call if nothing has changed
    if (entry.canPlay) {
        return;
    }
    if (entry.retryCount > this.flavorMismatchRetryAttempts) {
        entry.canPlay = true;
        logger.info("[%s] Flavors mismatch occurred for %d retries, override configured [%j] with [%j]", entry.entryId, entry.retryCount, entry.flavorParamsIds, flavorParamsIds);
        entry.flavorParamsIds = flavorParamsIds;
        delete entry.retryCount;
    } else if (entry.flavorParamsIds === flavorParamsIds) {
        entry.canPlay = true;
        logger.info("[%s] Configured flavors are the same: [%j] after %d tries", entry.entryId, entry.flavorParamsIds, entry.retryCount);
        delete entry.retryCount;
    }
    else {
        logger.info("[%s] Flavors mismatch between configured [%j] and actual [%j]", entry.entryId, entry.flavorParamsIds, flavorParamsIds);
        entry.retryCount++;
    }
}

function retrieveEntryInfo(entryObj, entryId, flavorParamsIds, sourceIp) {
    this.entries[entryId] = entryObj;
    //If playing flavors are equal to the configured flavors, allow entry to start playing immediately.
    //otherwise wait another iteration to allow flavors to arrive.
    entryObj.canPlay = (entryObj.flavorParamsIds === flavorParamsIds);
    if (!entryObj.canPlay) {
        entryObj.retryCount = 1;
        logger.info("[%s] Flavors mismatch between configured [%j] and actual [%j]", entryId, entryObj.flavorParamsIds, flavorParamsIds);
    }
    entryObj.sourceIp = sourceIp;
    entryObj.baseUrl = this._baseUrl;
    entryObj.getStreamInfo = getStreamInfo;
    logger.info("[%s] Received stream info for entry: %j", entryId, entryObj);
}

function getNewEntryInfo(stream) {
    let that = this;
    var entryId = stream.entryId;
    let flavorParamsIds = stream.flavors.sort().join();

    if (that.entries[entryId]) {
        checkFlavorsMatch.call(that, that.entries[entryId], flavorParamsIds);
        return Q.resolve(that.entries[entryId])
    }

    return backendClient.getEntryInfo(entryId)
        .then((entryInfo) => {
            if (entryInfo) {
                retrieveEntryInfo.call(that, entryInfo, entryId, flavorParamsIds, stream.sourceIp);
                return Q.resolve(entryInfo);
            }
            logger.error("[%s] Entry doesn't exist in server, reject promise", entryId);
            return Q.reject("Entry doesn't exist in server");
        })
        .catch(function(err) {
            logger.error("[%s] Error occurred while calling server: %s", entryId, errorUtils.error2string(err));
            return Q.reject(err);
        });
}

function getDiagnostics() {
    let that = this;
    return networkClient.read({
            url : this._wowzaDiagUrl,
            json : true,
            timeout : 20000
        })
        .then((res)=> {
            logger.debug("Received entries diagnostics from Wowza");
            that.liveEntriesDiagnostics = res.body;
            return Q.resolve();
        })
        .finally(()=> {
            setTimeout(getDiagnostics.bind(that), that.diagnosticsInterval);
        });
}

WowzaAdapter.prototype.getLiveEntries = function() {
    var that = this;
    return networkClient.read({
            url : this._wowzaUrl,
            json : true,
            timeout: requestTimeout ? requestTimeout : 20000
        })
        .then(function(res) {
            that.getLiveEntriesTimestamp = Date.now();
            logger.debug("Received playing entries list from Wowza");
            if (res.body.instanceList.length === 0) {
                logger.debug("No wowza instances");
                return [];

            }
            var incomingStreams = [];
            // Concat all incoming streams into one big list
            _.each(res.body.instanceList, function(list) {
                Array.prototype.push.apply(incomingStreams, list.incomingStreams);
            });
            if (incomingStreams.length === 0) {
                logger.debug("No streams are currently playing");
            }

            let uniqueList = getIncomingStreamsInfo.call(that, incomingStreams);

            // Make sure module's entries list doesn't contain entries that are no longer streaming
            deleteInactiveStreams.call(that, uniqueList);
            var promises = _.map(uniqueList, (stream) => {
                return getNewEntryInfo.call(that, stream);
            });

            return Q.allSettled(promises)
                .then(function(res) {
                    // Return only the entries that their promise is resolved
                    var passed = _.filter(res, (p) => {
                        return (p.state === "fulfilled") && (p.value.canPlay);
                    });
                    that.liveEntriesCache = _.map(passed, (p) => {
                        return p.value;
                    });
                    return _.map(that.liveEntriesCache, (e)=> {
                        e.diagnosticsObj = that.liveEntriesDiagnostics[e.entryId];
                       return e;
                    });
                });
        })
        .catch(function(err) {
            logger.error("Failed to get live entries from wowza. Error: %s", errorUtils.error2string(err));
            if ((Date.now() - that.getLiveEntriesTimestamp) < (1000 * that.disconnectTimeoutInSec) ) {
                return Q.resolve(that.liveEntriesCache);
            } else {
                logger.warn(`Wowza access problem for more than ${that.disconnectTimeoutInSec} sec, all live entries will be stopped!!!`);
                that.entries = {};
                that.liveEntriesCache=[];
                return [];
            }
        });
};

module.exports = WowzaAdapter;