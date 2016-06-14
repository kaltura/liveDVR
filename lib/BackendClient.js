/**
 * Created by elad.benedict on 8/26/2015.
 */

var Q = require('q');
var _ = require('underscore');
var kalturaVO = require('./kaltura-client-lib/KalturaVO');
var kalturaClient = require('./kaltura-client-lib/KalturaClient');
var kalturaClientBase = require('./kaltura-client-lib/KalturaClientBase');
var kalturaTypes = require('./kaltura-client-lib/KalturaTypes');
var config = require('./../common/Configuration');
var logger = require('../common/logger').getLogger('BackendClient');


var BackendClient = (function(){

    function createClientConfig() {
        var conf = new kalturaClientBase.KalturaConfiguration(partnerId);
        conf.serviceUrl = config.get('backendClient').serviceUrl;
        return conf;
    }

    function convertToMs(minutes) {
        return minutes * 60 * 1000;
    }

    var lastSessionTime = null;
    var adminSecret = config.get('backendClient').adminSecret;
    var partnerId = config.get('backendClient').partnerId;
    var mediaServerHostname = config.get('mediaServer').hostname;
    var applicationName = config.get('mediaServer').applicationName;
    var client = null;
    var clientConfig = createClientConfig();
    var sessionDuration = convertToMs(config.get('backendClient').ksSessionRefreshIntervalMinutes);
    var BackendClient = {};
    var mediaServerIdPromise = null;

    function printAPIResponse(result, headers) {
        logger.info("API call headers: %j", headers);
        if(result)
            logger.info("API call result: %j", result);
    }

    function createSession() {
        var deferred = Q.defer();
        var now = new Date();
        //create session
        if (!lastSessionTime || (now - lastSessionTime) > sessionDuration) {
            logger.debug("Request for createSession started");
            client = new kalturaClient.KalturaClient(clientConfig);
            client.session.start(function(results, err, headers) {
                var endTime  = new Date();
                var operationTime = endTime - now;
                logger.debug("Request for createSession took %s", operationTime);
                if (err) {
                    logger.error("Failed to create session: %j", err);
                    printAPIResponse(results, headers);
                    deferred.reject(err);
                }
                if (results) {
                    lastSessionTime = now;
                    logger.info("session created successfully %j", results);
                    client.setSessionId(results);
                    deferred.resolve();
                }
            }, adminSecret, null, kalturaTypes.KalturaSessionType.ADMIN, partnerId, null, null);
        }
        else {
            deferred.resolve();
        }

        return deferred.promise;
    }

    function getMediaServerIdPromise() {
        if (mediaServerIdPromise) {
            return mediaServerIdPromise;
        }

        var deferred = Q.defer();

        //get serverNode id by mediaServerHostName
        var serverNodeFilter = new kalturaVO.KalturaWowzaMediaServerNodeFilter();
        serverNodeFilter.hostNameLike = mediaServerHostname;

        client.serverNode.listAction(function(results,err,headers) {
            if (err) {
                logger.error("Failed to retrieve serverNodeIndex for host %s with error %s", mediaServerHostname, err);
                printAPIResponse(results, headers);
                deferred.reject(err);
            }
            if (results && results.objects[0] && results.objects[0].objectType !== 'KalturaAPIException') {
                var serverNode = results.objects[0];
                logger.info("successfully retrieve serverNodeId for host name %s id %s", mediaServerHostname, serverNode.id);
                deferred.resolve(serverNode.id);
            }
        }, serverNodeFilter);

        mediaServerIdPromise = deferred.promise;

        return mediaServerIdPromise;
    }

    function convertKalturaEntry(item){
        var res = {
            "entryId" : item.id,
            "flavorParamsIds" : item.flavorParamsIds,
            "partnerId" : item.partnerId
        };
        if (item.dvrStatus === kalturaTypes.KalturaDVRStatus.ENABLED) {

            if (item.dvrWindow) {
                var entryDVRWindow = item.dvrWindow * 60;     //   assuming dvrWindow from backend is in minutes!
                res.dvrWindow = Math.max(config.get("minimalDvrWindow"), entryDVRWindow);

            }
            else {
                res.dvrWindow = config.get("defaultDvrWindow");
            }

            res.maxChunkCount = config.get("dvrMaxChunkCount");
        }
        else {
            res.maxChunkCount = config.get("liveMaxChunkCount");
        }
        return res;
    }

    function getLiveEntries() {
        var deferred = Q.defer();
        var filter = new kalturaVO.KalturaLiveStreamEntryFilter();
        filter.isLive = kalturaTypes.KalturaNullableBoolean.TRUE_VALUE;
        filter.hasMediaServerHostname = mediaServerHostname;
        var pager = {
            pageSize : 300,
            pageIndex : 1
        };
        var startTime = new Date();
        logger.debug("Request for liveStream.listAction started");
        client.liveStream.listAction(function(results, err, headers) {
            var endTime = new Date();
            var operationTime = endTime - startTime;
            logger.debug("Request for liveStream.listAction took %s", operationTime);
            if (results) {
                var objs = _.map(results.objects, convertKalturaEntry);
                logger.debug("Got live entries: %j", objs);
                deferred.resolve(objs);
            }
            else {
                printAPIResponse(results, headers);
                logger.error("Failed to get live entries: %s", err);
                deferred.reject(new Error("Failed to retrieve live entries from server"));
            }
        }, filter, pager);

        return deferred.promise;
    }

    function getServerType(serverNodeId, resultReceived) {
        return (resultReceived.primaryServerNodeId === serverNodeId) ? kalturaTypes.KalturaEntryServerNodeType.LIVE_PRIMARY :
            kalturaTypes.KalturaEntryServerNodeType.LIVE_BACKUP;
    }

    function parseServerEntryInfo(serverNodeId, apiCallResults) {
        var liveEntryObject = convertKalturaEntry(apiCallResults[0]);
        liveEntryObject.serverType = getServerType(serverNodeId, apiCallResults[0]);

        _.each(apiCallResults[1].objects, function(s) {
            if (s.serverNodeId === serverNodeId) {
                liveEntryObject.liveStatus = s.status;
                liveEntryObject.entryServerNodeId = s.id;
            }
        });

        return liveEntryObject;
    }

    function getEntryInfo(entryId, serverNodeId) {
        var deferred = Q.defer();

        client.startMultiRequest();
        var entryServerNodeFilter = new kalturaVO.KalturaEntryServerNodeFilter();
        entryServerNodeFilter.entryIdEqual = entryId;
        client.liveStream.get(null, entryId);
        client.entryServerNode.listAction(null, entryServerNodeFilter);

        var startTime = new Date();
        client.doMultiRequest(function(results, err, headers) {
            var endTime = new Date();
            var operationTime = endTime - startTime;
            logger.info("[%s] Got server node info (took %d)", entryId, operationTime);
            printAPIResponse(results, headers);

            if (results[0].objectType !== "KalturaAPIException" || results[1].objectType !== "KalturaAPIException") {  //Use to indicate success operation
                var liveEntry = parseServerEntryInfo(serverNodeId, results);
                deferred.resolve(liveEntry);
            }
            else {
                logger.error("Failed to retrieve live stream entry info for from server: %j", results);
                deferred.reject(new Error(results[0].objectType + "; " + results[0].code));
            }
        });

        return deferred.promise;
    }

    function registerEntryInDatabase(entryId, serverIndex, state, event) {
        var deferred = Q.defer();
        logger.debug("[%s] Calling registerMediaServer. Hostname: [%s], serverIndex: [%s], Application: [%s], state: [%s]", entryId, mediaServerHostname, serverIndex, applicationName, state);
        client.liveStream.registerMediaServer(function(result, err, headers) {
            printAPIResponse(result, headers);
            if (result.objectType === "KalturaLiveStreamEntry") {  //Use to indicate success operation
                logger.info("[%s] Register media server finished successfully - '%s'", entryId, event.toUpperCase());
                deferred.resolve(result);   //check which object, if any, need to pass.
            }
            else {
                logger.error("[%s] Failed to register media server - '%s'. Error: %s", entryId, event.toUpperCase(), result.message);
                deferred.reject(new Error(result.objectType + ": " + result.code));
            }
        }, entryId, mediaServerHostname, serverIndex, applicationName , state);
        return deferred.promise;
    }

    function unregisterEntryInDatabase(entryId, serverIndex) {
        var deferred = Q.defer();
        logger.debug("[%s] Calling unregisterMediaServer. Hostname: [%s], serverIndex: [%s], Application: [%s]", entryId, mediaServerHostname, serverIndex, applicationName);
        client.liveStream.unregisterMediaServer(function(result, err, headers) {
            printAPIResponse(result, headers);
            if (result.objectType === "KalturaLiveStreamEntry") {  //Use to indicate success operation
                logger.info("[%s] Unregister media server finished successfully", entryId);
                deferred.resolve(result);   //check which object, if any, need to pass.
            }
            else {
                logger.error("[%s] Failed to unregister media from server: %s", entryId, result.message);
                deferred.reject(new Error(result.objectType + ": " + result.code));
            }
        }, entryId, mediaServerHostname, serverIndex, applicationName);
        return deferred.promise;
    }

    function updateStreamInfo(entryId, entryServerNodeId, liveEntryServerNode)
    {
        var deferred = Q.defer();
        logger.debug("[%s] Calling updateStreamInfo for entryServerNode id [%s], with stream info array [%j]",entryId,  entryServerNodeId, liveEntryServerNode.streams);

        client.entryServerNode.update(function(result, err, headers) {
            printAPIResponse(result, headers);
            if(err) {
                logger.debug("[%s] Failed to updateStreamInfo for entryServerNode id [%s] with error [%s]",entryId,  entryServerNodeId, err);
            }
            deferred.resolve();
        }, entryServerNodeId, liveEntryServerNode);

        return deferred.promise;
    }

    function getLiveEntryServerNodes(entryId) {
        var deferred = Q.defer();
        logger.debug("[%s] get entry server node list", entryId);

        var entryServerNodeFilter = new kalturaVO.KalturaEntryServerNodeFilter();
        entryServerNodeFilter.entryIdEqual = entryId;
        client.entryServerNode.listAction(function(result, err, headers) {

            printAPIResponse(result, headers);
            if (result.objectType !== "KalturaAPIException") {  //Use to indicate success operation
                logger.info("[%s] entry server node list successfully retrieved [%j]", entryId, result.objects);

                if (result.objects) {
                    deferred.resolve(result.objects);
                }
                else {
                    logger.error("[%s] Failed to locate entry server node ids", entryId);
                    deferred.reject();
                }
            }
            else {
                logger.error("[%s] Failed to retrieve entry server node list. Error: %s", entryId, result.message);
                deferred.reject(result.message);
            }
        }, entryServerNodeFilter);

        return deferred.promise;
    }

    BackendClient.getLiveEntryServerNodes = function(entryId) {
        return createSession()
            .then(function() {
                return getLiveEntryServerNodes(entryId);
            });
    };

    BackendClient.getLiveEntriesForMediaServer = function() {
       return createSession()
           .then(function() {
                return getLiveEntries();
            });
    };

    BackendClient.getEntryInfo = function(entryId) {
        return createSession()
            .then(function () {
                return getMediaServerIdPromise().then(function(index) {
                    return getEntryInfo(entryId, index);
                });
            });
    };

    BackendClient.registerEntryInDatabase = function(entryObject, state, event) {
        logger.debug("Entered registerEntryInDatabase. Creating session and calling register");
        return createSession()
            .then(function() {
                return registerEntryInDatabase(entryObject.entryId, entryObject.serverType, state, event);
            });
    };

    BackendClient.unregisterEntryInDatabase = function(entryObject) {
        logger.debug("Entered unregisterEntryInDatabase. Creating session and calling unregister");
        return createSession()
            .then(function() {
                return unregisterEntryInDatabase(entryObject.entryId, entryObject.serverType);
            });
    };

    BackendClient.updateStreamInfo = function(entryId, entryServerNodeId, flavorsObjArray) {
        logger.debug("Calling updateStreamInfo, with new flavors object array");

        var liveEntryServerNode = new kalturaVO.KalturaLiveEntryServerNode();
        var streamInfoArray = [];
        _.each(flavorsObjArray, function(flavorInfo) {
            var KalturaLiveStreamParams = new kalturaVO.KalturaLiveStreamParams();
            KalturaLiveStreamParams.bitrate = flavorInfo.bandwidth;
            KalturaLiveStreamParams.flavorId = flavorInfo.name;
            KalturaLiveStreamParams.width = flavorInfo.resolution ? flavorInfo.resolution[0] : null;
            KalturaLiveStreamParams.height = flavorInfo.resolution ? flavorInfo.resolution[1] : null;

            streamInfoArray.push(KalturaLiveStreamParams);
        });
        liveEntryServerNode.streams = streamInfoArray;

        return createSession()
            .then(function() {
                return updateStreamInfo(entryId, entryServerNodeId, liveEntryServerNode);
            });
    };

    return BackendClient;
})();

module.exports = BackendClient;
