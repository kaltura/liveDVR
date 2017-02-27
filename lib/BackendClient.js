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
var ErrorUtils = require('./utils/error-utils');
var util=require('util');

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
    var ksPrivileges = config.get('backendClient').ksPrivileges;
    var mediaServerHostname = config.get('mediaServer').hostname;
    var applicationName = config.get('mediaServer').applicationName;
    var client = null;
    var clientConfig = createClientConfig();
    var sessionDuration = convertToMs(config.get('backendClient').ksSessionRefreshIntervalMinutes);
    var BackendClient = {};
    var mediaServerIdPromise = null;
    var sessionRequestPromise=null;
    function printAPIResponse(results, headers) {
        logger.info("API call headers: %j", headers);
        if(results)
            logger.info("API call result: %j", results);
    }

    function createSession() {

        var now = new Date();

        //create session
        if (!sessionRequestPromise || !lastSessionTime || (now - lastSessionTime) > sessionDuration) {

            sessionRequestPromise = null;
        }

        if (!sessionRequestPromise) {

            var deferred = Q.defer();
            logger.debug("Request for createSession started");
            client = new kalturaClient.KalturaClient(clientConfig);
            client.session.start(function (results, err, headers) {
                var endTime = new Date();
                var operationTime = endTime - now;
                logger.debug("Request for createSession took %s", operationTime);
                if (err) {
                    logger.error("Failed to create session: %s",  ErrorUtils.error2string(err));
                    printAPIResponse(results, headers);
                    deferred.reject(err);
                }
                if (results) {
                    lastSessionTime = now;
                    logger.info("session created successfully %j", results);
                    client.setSessionId(results);
                    deferred.resolve();
                }
            }, adminSecret, null, kalturaTypes.KalturaSessionType.ADMIN, partnerId, null, ksPrivileges);

            sessionRequestPromise = deferred.promise;
        }

        return sessionRequestPromise;
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

            if (!err && results && _.isArray(results.objects) && results.objects.length>0 && results.objects[0].objectType !== 'KalturaAPIException') {
                var serverNode = results.objects[0];
                logger.info("successfully retrieve serverNodeId for host name %s id %s", mediaServerHostname, serverNode.id);
                deferred.resolve(serverNode.id);
            } else {
                logger.error("Failed to retrieve serverNodeIndex for host %s with error %s %j", mediaServerHostname,  ErrorUtils.error2string(err),results);
                printAPIResponse(results, headers);
                deferred.reject(err);
            }
        }, serverNodeFilter);

        mediaServerIdPromise = deferred.promise;

        return mediaServerIdPromise;
    }

    function convertKalturaEntry(item){
        var res = {
            "entryId" : item.id,
            "partnerId" : item.partnerId,
            "dvrEnabled" : false,
            "recordStatus" : item.recordStatus,
            "segmentDurationMilliseconds" : item.segmentDuration
        };
        if (item.recordStatus !== kalturaTypes.KalturaRecordStatus.DISABLED){
            res.recordingSessionDuration = config.get('recording').recordingSessionDurationInSec * 1000;
            res.recordedEntryId=  item.recordedEntryId;
        }

        let sortedFlavorsArray = item.flavorParamsIds.split(',').sort();
        res.flavorParamsIds = sortedFlavorsArray.join();

        if (item.dvrStatus === kalturaTypes.KalturaDVRStatus.ENABLED) {

            res.dvrEnabled = true;
            if (item.dvrWindow) {
                var entryDVRWindow = item.dvrWindow * 60;     //   assuming dvrWindow from backend is in minutes!
                res.playWindow = Math.max(config.get("minimalDvrWindowInSec"), entryDVRWindow);

            }
            else {
                res.playWindow = config.get("defaultDvrWindowInSec");
            }
        }
        else {
            res.playWindow = config.get("defaultPlayWindowInSec");
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

            if (!err && results) {
                var objs = _.map(results.objects, convertKalturaEntry);
                logger.debug("Got live entries: %j", objs);
                deferred.resolve(objs);
            }
            else {
                printAPIResponse(results, headers);
                logger.error("Failed to get live entries: %s", ErrorUtils.error2string(err));
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

            if (!err && results && _.isArray(results) && results.length===2 && results[0] && results[1] &&
                (results[0].objectType !== "KalturaAPIException" || results[1].objectType !== "KalturaAPIException")) {  //Use to indicate success operation
                var liveEntry = parseServerEntryInfo(serverNodeId, results);
                deferred.resolve(liveEntry);
            }
            else {
                var msg=util.format("[%s] Failed to retrieve live stream entry info for from server: %s %j", entryId,  ErrorUtils.error2string(err), results);
                logger.error(msg);
                deferred.reject(new Error(msg));
            }
        });

        return deferred.promise;
    }

    function registerEntryInDatabase(entryObject, state, event) {
        var deferred = Q.defer();
        logger.debug("[%s] Calling registerMediaServer. Hostname: [%s], serverIndex: [%s], Application: [%s], state: [%s]", entryObject.entryId, mediaServerHostname, entryObject.serverType, applicationName, state);

        //Impersonate call to the entry's partnerId to execute the call in the partner's context
        client.setPartnerId(entryObject.partnerId);
        
        client.liveStream.registerMediaServer(function(result, err, headers) {
            printAPIResponse(result, headers);
            if (!err && result && result.objectType === "KalturaLiveStreamEntry") {  //Use to indicate success operation
                logger.info("[%s] Register media server finished successfully - '%s'", entryObject.entryId, event.toUpperCase());
                deferred.resolve(result);   //check which object, if any, need to pass.
            }
            else {
                var msg=util.format("[%s] Failed to register media from server: %s %j", entryObject.entryId,  ErrorUtils.error2string(err), result);
                logger.error(msg);
                deferred.reject(new Error(msg));
            }
        }, entryObject.entryId, mediaServerHostname, entryObject.serverType, applicationName , state);

        //Remove impersonation
        client.setPartnerId(partnerId);
        return deferred.promise;
    }

    function unregisterEntryInDatabase(entryId, serverIndex) {
        var deferred = Q.defer();
        logger.debug("[%s] Calling unregisterMediaServer. Hostname: [%s], serverIndex: [%s], Application: [%s]", entryId, mediaServerHostname, serverIndex, applicationName);
        client.liveStream.unregisterMediaServer(function(result, err, headers) {
            printAPIResponse(result, headers);
            if (!err && result && result.objectType === "KalturaLiveStreamEntry") {  //Use to indicate success operation
                logger.info("[%s] Unregister media server finished successfully", entryId);
                deferred.resolve(result);   //check which object, if any, need to pass.
            }
            else {
                var msg=util.format("[%s] Failed to unregister media from server: %s %j", entryId,  ErrorUtils.error2string(err), result);
                logger.error(msg);
                deferred.reject(new Error(msg));
            }
        }, entryId, mediaServerHostname, serverIndex, applicationName);
        return deferred.promise;
    }

    function updateStreamInfo(entryId, entryServerNodeId, liveEntryServerNode)
    {
        var deferred = Q.defer();
        logger.debug("[%s] Calling updateStreamInfo for entryServerNode id [%s], with stream info array [%j]", entryId, entryServerNodeId, liveEntryServerNode.streams);
        client.entryServerNode.update(function(result, err, headers) {
            printAPIResponse(result, headers);
            if(err || result.objectType === 'KalturaAPIException') {
                logger.debug("[%s] Failed to updateStreamInfo for entryServerNode id [%s] with error [%s]", entryId, entryServerNodeId,  ErrorUtils.error2string(err));
                deferred.reject();
            }
            deferred.resolve();
            
        }, entryServerNodeId, liveEntryServerNode);

        return deferred.promise;
    }

    function getLiveEntryServerNodes(entryId, filter) {
        var deferred = Q.defer();
        logger.debug("[%s] Retrieve entry server node list", entryId);
        var entryServerNodeFilter = filter ? filter : new kalturaVO.KalturaEntryServerNodeFilter();
        entryServerNodeFilter.entryIdEqual = entryId;

        createSession()
            .then(function () {
                client.entryServerNode.listAction(function (result, err, headers) {

                    printAPIResponse(result, headers);
                    if (!err && result && result.objectType !== "KalturaAPIException" && result.objects) {  //Use to indicate success operation
                        logger.info("[%s] entry server node list successfully retrieved [%j]", entryId, result.objects);

                        deferred.resolve(result.objects);
                    }
                    else {
                        var msg = util.format("[%s] Failed to retrieve entry server node list: %s %j", entryId, ErrorUtils.error2string(err), result);
                        logger.error(msg);
                        deferred.reject(new Error(msg));
                    }
                }, entryServerNodeFilter);
            });

        return deferred.promise;
    }

    function updateEntryDuration(entryId, cumulativeDurationMs) {
        var KalturaMediaEntry = new kalturaVO.KalturaMediaEntry()
        var deferred = Q.defer();
        KalturaMediaEntry.msDuration = cumulativeDurationMs
        client.liveStream.update( function(result, err, headers) {
            printAPIResponse(result, headers);
            if(err || result.objectType === 'KalturaAPIException') {
                logger.debug("[%s] Failed to update entry duration for [%s] with error [%s]", entryId,  ErrorUtils.error2string(err));
                deferred.reject();
            }
            deferred.resolve();

        }, entryId, KalturaMediaEntry)
        return deferred.promise;
    }

    BackendClient.isEntryLive = function(entryId) {
        let filter = new kalturaVO.KalturaLiveEntryServerNode();
        filter.isLive = kalturaTypes.KalturaNullableBoolean.TRUE_VALUE;
        filter.statusIn = '1,2';
        return getLiveEntryServerNodes(entryId, filter)
            .then((serverObjs) => {
                return serverObjs.length > 0;
        });

    }

    BackendClient.getLiveEntryServerNodes = function(entryId, filter) {
        return createSession()
            .then(function() {
                return getLiveEntryServerNodes(entryId, filter);
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
        logger.debug("[%s] Entered registerEntryInDatabase. Creating session and calling register", entryObject.entryId);
        return createSession()
            .then(function() {
                return registerEntryInDatabase(entryObject, state, event);
            });
    };

    BackendClient.unregisterEntryInDatabase = function(entryObject) {
        logger.debug("[%s] Entered unregisterEntryInDatabase. Creating session and calling unregister", entryObject.entryId);
        return createSession()
            .then(function() {
                return unregisterEntryInDatabase(entryObject.entryId, entryObject.serverType);
            });
    };
    BackendClient.updateEntryDuration = function(entryId, cumulativeDurationMs){
        logger.debug("[%s] updateEntry with %s", entryId, cumulativeDurationMs);
        return createSession()
            .then(function() {
                return updateEntryDuration(entryId, cumulativeDurationMs);
            });
    }
    BackendClient.updateStreamInfo = function(entryId, entryServerNodeId, flavorsObjArray) {
        logger.debug("Calling updateStreamInfo, with new flavors object array");

        var liveEntryServerNode = new kalturaVO.KalturaLiveEntryServerNode();
        var streamInfoArray = [];
        _.each(flavorsObjArray, function(flavorInfo) {
            var KalturaLiveStreamParams = new kalturaVO.KalturaLiveStreamParams();
            KalturaLiveStreamParams.bitrate = flavorInfo.getTotalBitrate() * 1000; // Convert to bit/second
            KalturaLiveStreamParams.flavorId = flavorInfo.flavor;
            KalturaLiveStreamParams.width = flavorInfo.mediaInfo.resolution ? flavorInfo.mediaInfo.resolution[0] : null;
            KalturaLiveStreamParams.height = flavorInfo.mediaInfo.resolution ? flavorInfo.mediaInfo.resolution[1] : null;
            KalturaLiveStreamParams.frameRate = flavorInfo.getEncoderFrameRate();
            KalturaLiveStreamParams.keyFrameInterval = flavorInfo.mediaInfo.keyFramesDistance;

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
