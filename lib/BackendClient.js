/**
 * Created by elad.benedict on 8/26/2015.
 */

const Q = require('q');
const _ = require('underscore');
const kalturaVO = require('./kaltura-client-lib/KalturaVO');
const kalturaClient = require('./kaltura-client-lib/KalturaClient');
const kalturaClientBase = require('./kaltura-client-lib/KalturaClientBase');
const kalturaTypes = require('./kaltura-client-lib/KalturaTypes');
const config = require('./../common/Configuration');
const logger = require('../common/logger').getLogger('BackendClient');
const ErrorUtils = require('./utils/error-utils');
const util=require('util');
const stringUtil = require('./utils/string-utils');

var BackendClient = (function(){

    function createClientConfig() {
        var conf = new kalturaClientBase.KalturaConfiguration(partnerId);
        conf.serviceUrl = config.get('backendClient').serviceUrl;
        return conf;
    }

    function convertToMs(minutes) {
        return minutes * 60 * 1000;
    }

    const adminSecret = config.get('backendClient').adminSecret;
    const partnerId = config.get('backendClient').partnerId;
    const ksPrivileges = config.get('backendClient').ksPrivileges;
    const mediaServerHostname = config.get('mediaServer').hostname;
    const applicationName = config.get('mediaServer').applicationName;
    const sessionDuration = convertToMs(config.get('backendClient').ksSessionRefreshIntervalMinutes);
    let client = null;
    let clientConfig = createClientConfig();
    let lastSessionTime = null;
    let BackendClient = {};
    let mediaServerIdPromise = null;
    let sessionRequestPromise=null;

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

    function iskMultiRequestSuccessful(results, err, numOfTests) {
        if (!err && results && _.isArray(results) && results.length === numOfTests) {
            let isThereNullValue = _.find(results, (result)=> {
               return result === null;
            });
            let isThereException = _.find(results, (result)=> {
               return result.objectType === 'KalturaAPIException';
            });
            return ((isThereNullValue === undefined) && (isThereException === undefined));
        }
        return false;
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

            if (iskMultiRequestSuccessful(results, err, 2)) {  //Use to indicate success operation
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

    function registerEntryInDatabase(entryObject, streamState, event) {
        var deferred = Q.defer();
        // recorded entry Id is created by liveStream.createRecordedEntry(), this flag is for backward compatibility
        let createRecordedEntryId = false;
        logger.debug(`[${entryObject.entryId}] Calling registerMediaServer. Hostname: [${mediaServerHostname}], serverIndex: [${entryObject.serverType}], Application: [${applicationName}], streamState: [${streamState}]`);

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
        }, entryObject.entryId, mediaServerHostname, entryObject.serverType, applicationName , streamState, createRecordedEntryId);

        //Remove impersonation
        client.setPartnerId(partnerId);
        return deferred.promise;
    }

    function getFlavorsMultiStream(entryObject, flavors, filter = new kalturaVO.KalturaLiveParamsFilter()) {
        let deferred = Q.defer();
        logger.debug("[%s] Calling flavorParamsListAction. Hostname: [%s], serverIndex: [%s], Application: [%s]", entryObject.entryId, mediaServerHostname, entryObject.serverType, applicationName);

        //Impersonate call to the entry's partnerId to execute the call in the partner's context
        let partnerId = entryObject.partnerId;
        client.setPartnerId(partnerId);
        filter.idIn = flavors.join(',');
        client.flavorParams.listAction((result, error, headers)=> {
            printAPIResponse(result, headers);
            if (error || result.objectType === 'KalturaAPIException') {
                logger.debug("[%s] Failed to retrieve flavors list for MultiStream check [%s]", entryObject.entryId, flavors);
                deferred.reject();
            }
            // Return a map of each flavor's extra params
            let res = _.object(_.map(result.objects, (flavorParams)=> {
                return [flavorParams.id, flavorParams.multiStream]
            }));

            deferred.resolve(res);
        }, filter);

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

    function updateStreamInfo(entryId, entryServerNodeId, liveEntryServerNode) {
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
        let deferred = Q.defer();
        logger.debug("[%s] Retrieve entry server node list", entryId);
        let entryServerNodeFilter = filter ? filter : new kalturaVO.KalturaEntryServerNodeFilter();
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
                        let msg = util.format("[%s] Failed to retrieve entry server node list: %s %j", entryId, ErrorUtils.error2string(err), result);
                        logger.error(msg);
                        deferred.reject(new Error(msg));
                    }
                }, entryServerNodeFilter);
            });

        return deferred.promise;
    }

    function updateEntryDuration(entryId, cumulativeDurationMs, recordedEntryId, entryServerNodeId) {
        let deferred = Q.defer();
        let mediaEntry = new kalturaVO.KalturaMediaEntry();
        mediaEntry.msDuration = cumulativeDurationMs;
        let entryServerNode = new kalturaVO.KalturaLiveEntryServerNode();
        let recordingInfo = new kalturaVO.KalturaLiveEntryServerNodeRecordingInfo();
        recordingInfo.recordedEntryId = recordedEntryId;
        recordingInfo.duration = cumulativeDurationMs;
        let recordingInfoArray = [];
        recordingInfoArray.push(recordingInfo);
        entryServerNode.recordingInfo = recordingInfoArray;
        let durationSec = (cumulativeDurationMs/1000).toFixed(0);
        let durationString = stringUtil.durationSecondsToString(durationSec);
        let recordingSessionId = `[${entryId}-${recordedEntryId}]`;

        client.startMultiRequest();
        client.entryServerNode.update(null, entryServerNodeId, entryServerNode);
        client.liveStream.update(null, entryId, mediaEntry);
        client.doMultiRequest((results, err, headers)=> {
            printAPIResponse(results, headers);

            if (iskMultiRequestSuccessful(results, err, 2)) {
                logger.info(`${recordingSessionId} Successfully updated recording duration to [${durationString}]=[${cumulativeDurationMs} msec]`);
                return deferred.resolve();
            }
            else {
                let errMsg = util.format(`${recordingSessionId} Failed to update recording duration to [${durationString}]=[${cumulativeDurationMs} msec]. Response: ${JSON.stringify(results)}`);
                logger.error(errMsg);
                return deferred.reject(new Error(errMsg));
            }
        });

        return deferred.promise;
    }

    /**********************************************/
    // Call three API requests:
    // 1) liveStream.update: Update liveStream with an empty recordedEntryID.
    // 2) entryServerNode.list: Retrieve entry's last status in sever.
    // 3) liveStream.registerMediaServer: Register entry in server with
    //    the last status received and get a new recordedEntryId.
    /**********************************************/
    function resetRecordingEntry(entryObj) {
        let deferred = Q.defer();
        logger.debug(`[${entryObj.entryId}] Calling multiRequest for resetting recordedEntryID`);
        client.startMultiRequest();
        let KalturaMediaEntry = new kalturaVO.KalturaMediaEntry();
        // liveStream.update parameter
        KalturaMediaEntry.recordedEntryId = "";
        KalturaMediaEntry.msDuration = 0;
        KalturaMediaEntry.redirectEntryId = "";
        // entryServerNode.lise parameter
        let EntryServerNodeFilter = new kalturaVO.KalturaEntryServerNodeFilter();
        EntryServerNodeFilter.entryIdEqual = entryObj.entryId;
        // liveStream.registerMediaServer parameter
        let streamState = '{2:result:objects:0:status}';
        client.setPartnerId(entryObj.partnerId);
        let createRecordedEntryId = false;

        client.liveStream.update(null, entryObj.entryId, KalturaMediaEntry);
        client.entryServerNode.listAction(null, EntryServerNodeFilter);
        client.liveStream.registerMediaServer(null, entryObj.entryId, mediaServerHostname, entryObj.serverType, applicationName, streamState, createRecordedEntryId);

        client.doMultiRequest((results, err, headers)=> {
            printAPIResponse(results, headers);

            if (iskMultiRequestSuccessful(results, err, 3)) {
                deferred.resolve();
            }
            else {
                let errMsg = util.format(`[${entryObj.entryId}] Failed to retrieve live stream entry info for from server: ${ErrorUtils.error2string(err)}. ${results}`);
                logger.error(errMsg);
                deferred.reject(new Error(errMsg));
            }
        });

        //Remove impersonation
        client.setPartnerId(partnerId);
        return deferred.promise;
    }

    function enableServerNode(serverNodeId) {
        let deferred = Q.defer();
        client.serverNode.enable((result, err, headers) => {
            deferred.resolve({ result, err, headers });
        }, serverNodeId);

        return deferred.promise;
    }

    function addServerNode(hostname) {
        let deferred = Q.defer();
        let kalturaWowzaServerNode = new kalturaVO.KalturaWowzaMediaServerNode();
        kalturaWowzaServerNode.name = hostname;
        kalturaWowzaServerNode.hostName = hostname;
        kalturaWowzaServerNode.applicationName = 'kLive';

        kalturaWowzaServerNode.liveServicePort = '888';
        kalturaWowzaServerNode.liveServiceProtocol = 'http';

        client.serverNode.add((result, err, headers) => {
                deferred.resolve({ result, err, headers });
            }, kalturaWowzaServerNode);

        return deferred.promise;
    }

    // note: the streamState as derived from Live Entry's state machine (fsm) is not necessarily aligned with BE
    // for that reason we need to get the streamState. Unless we decided that streamState is always KalturaLiveStatus.PLAYABLE
    // when we call createRecordedEntry
    function createRecordedEntry(entryObj)  {
        let deferred = Q.defer();
        client.startMultiRequest();
        // entryServerNode.listAction() parameter
        let entryServerNodeFilter = new kalturaVO.KalturaEntryServerNodeFilter();
        entryServerNodeFilter.entryIdEqual = entryObj.entryId;
        let streamState = '{1:result:objects:0:status}';

        //Impersonate call to the entry's partnerId to execute the call in the partner's context
        client.setPartnerId(entryObj.partnerId);

        client.entryServerNode.listAction(null, entryServerNodeFilter);
        client.liveStream.createRecordedEntry(null, entryObj.entryId, entryObj.serverType, streamState);

        client.doMultiRequest((results, err, headers)=> {
            printAPIResponse(results, headers);
            if (iskMultiRequestSuccessful(results, err, 2)) {
                let newRecordedEntryId = results[1].recordedEntryId;
                logger.info(`[${entryObj.entryId}] Successfully retrieved recordedEntryId [${newRecordedEntryId}]`);
                deferred.resolve(newRecordedEntryId);
            }
            else {
                let errMsg = util.format(`[${entryObj.entryId}] Failed to create recordedEntryId. Error: ${ErrorUtils.error2string(err)}. ${results}`);
                logger.error(errMsg);
                deferred.reject(new Error(errMsg));
            }
        });

        //Remove impersonation
        client.setPartnerId(partnerId);
        return deferred.promise;
    }


    function sendBeacon(entryId, clientPartnerId, data, beaconTag) {
        let deferred = Q.defer();
        logger.debug(`[${entryId}] Calling beacon.add, Tag: [${beaconTag}]`);

        let KalturaBeacon = new kalturaVO.KalturaBeacon();
        KalturaBeacon.relatedObjectType = kalturaTypes.BeaconObjectTypes.ENTRY_BEACON;
        KalturaBeacon.eventType = beaconTag;
        KalturaBeacon.objectId = entryId;
        KalturaBeacon.privateData = JSON.stringify(data);

        //Impersonate call to the entry's partnerId to execute the call in the partner's context
        client.setPartnerId(clientPartnerId);

        client.beacon.add((result, err, headers)=> {
            printAPIResponse(result, headers);
            if(err || result.objectType === 'KalturaAPIException') {
                logger.debug(`[${entryId}] Failed to send beacon to server. Error: ${ErrorUtils.error2string(err)}`);
                deferred.reject();
            }
            else {
                logger.info(`[${entryId}] Successfully sent Beacon [${beaconTag}] to server`);
                deferred.resolve();
            }
        }, KalturaBeacon, kalturaTypes.KalturaNullableBoolean.TRUE_VALUE);

        //Remove impersonation
        client.setPartnerId(partnerId);
        return deferred.promise;
    }

    function updateRecordingStatus(entryId, entryServerNodeId, recordedEntryId, recordingStatus) {
        let actionPromise = Q.defer();
        logger.debug(`[${entryId}] Calling entryServerNode.update`);

        let entryServerNode = new kalturaVO.KalturaLiveEntryServerNode();
        let recordingInfo = new kalturaVO.KalturaLiveEntryServerNodeRecordingInfo();
        recordingInfo.recordedEntryId = recordedEntryId;
        recordingInfo.recordingStatus = recordingStatus;
        let recordingInfoArray = [];
        recordingInfoArray.push(recordingInfo);
        entryServerNode.recordingInfo = recordingInfoArray;
        
        client.entryServerNode.update((result, err, headers) => {
                printAPIResponse(result, headers);
                if(err || result.objectType === 'KalturaAPIException') {
                    logger.debug(`[${entryId}] Failed to update recordingStatus to [${recordingStatus}], [entryServerNodeId:${entryServerNodeId}]. Error: ${ErrorUtils.error2string(err)}]`);
                    actionPromise.reject(err);
                }
                else {
                    logger.info(`[${entryId}] Successfully updated recording status to [${recordingStatus}]`);
                    actionPromise.resolve();
                }
            }, entryServerNodeId, entryServerNode);

        return actionPromise.promise;

    }



    BackendClient.isEntryLive = function(entryId) {
        let filter = new kalturaVO.KalturaLiveEntryServerNode();
        filter.isLive = kalturaTypes.KalturaNullableBoolean.TRUE_VALUE;
        filter.statusIn = '1,2';
        return getLiveEntryServerNodes(entryId, filter)
            .then((serverObjs) => {
                return serverObjs.length > 0;
        });

    };

    BackendClient.getEntryServerNodeId = function(entryId) {
        let filter = new kalturaVO.KalturaEntryServerNodeFilter();
        return mediaServerIdPromise
            .then((mediaServerNodeId)=> {
                filter.serverNodeIdEqual = mediaServerNodeId;
                filter.entryIdEqual = entryId;
            })
            .then(()=> {
                return getLiveEntryServerNodes(entryId, filter)
                    .then((liveEntryServerNodes)=> {
                        if (liveEntryServerNodes.length > 0) {
                            logger.info(`[${entryId}], received entry server node, id:[${liveEntryServerNodes[0].id}]`);
                            return Q.resolve(liveEntryServerNodes[0].id);
                        }
                        else {
                            let msg = `[${entryId}] failed to get entryServerNode Id, liveEntryServerNodes.length=0`;
                            logger.error(msg);
                            Q.reject(msg);
                        }
                    });
            });
    };

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

    BackendClient.getFlavorsMultiStream = function(entryObject, flavors) {
        logger.debug("[%s] Entered getFlavorsMultiStream. Creating session and retrieving live flavors extra params", entryObject.entryId);
        return createSession()
            .then(()=> {
                return getFlavorsMultiStream(entryObject, flavors);
            })
    };

    BackendClient.registerEntryInDatabase = function(entryObject, streamState, event) {
        logger.debug("[%s] Entered registerEntryInDatabase. Creating session and calling register", entryObject.entryId);
        return createSession()
            .then(function() {
                return registerEntryInDatabase(entryObject, streamState, event);
            });
    };

    BackendClient.unregisterEntryInDatabase = function(entryObject) {
        logger.debug("[%s] Entered unregisterEntryInDatabase. Creating session and calling unregister", entryObject.entryId);
        return createSession()
            .then(function() {
                return unregisterEntryInDatabase(entryObject.entryId, entryObject.serverType);
            });
    };

    BackendClient.updateEntryDuration = function(entryId, cumulativeDurationMs, recordedEntryId, serverNodeId){
        logger.debug(`[${entryId}-${recordedEntryId}] updating recording duration, on server [id=${serverNodeId}], to [${cumulativeDurationMs}] milliseconds`);
        return createSession()
            .then(function() {
                return updateEntryDuration(entryId, cumulativeDurationMs, recordedEntryId, serverNodeId);
            });
    };

    BackendClient.resetRecordingEntry = function(entryObj) {
        logger.debug(`[${entryObj.entryId}] reset recordedEntryId`);
        return createSession()
            .then(()=> {
                return resetRecordingEntry(entryObj);
            });
    };

    BackendClient.updateStreamInfo = function(entryId, entryServerNodeId, flavorsDownloaders) {
        logger.debug("Calling updateStreamInfo, with new flavors object array");

        var liveEntryServerNode = new kalturaVO.KalturaLiveEntryServerNode();
        var streamInfoArray = [];
        _.each(flavorsDownloaders, function(flavorsDownloader) {
            var KalturaLiveStreamParams = new kalturaVO.KalturaLiveStreamParams();
            KalturaLiveStreamParams.bitrate = flavorsDownloader.getTotalBitrate() * 1000; // Convert to bit/second
            KalturaLiveStreamParams.flavorId = flavorsDownloader.flavor;
            KalturaLiveStreamParams.width = flavorsDownloader.mediaInfo.resolution ? flavorsDownloader.mediaInfo.resolution[0] : null;
            KalturaLiveStreamParams.height = flavorsDownloader.mediaInfo.resolution ? flavorsDownloader.mediaInfo.resolution[1] : null;
            KalturaLiveStreamParams.frameRate = flavorsDownloader.getEncoderFrameRate();
            KalturaLiveStreamParams.keyFrameInterval = flavorsDownloader.mediaInfo.keyFramesDistance;
            if(flavorsDownloader.flavorObj.language)
                KalturaLiveStreamParams.language = flavorsDownloader.flavorObj.language;

            streamInfoArray.push(KalturaLiveStreamParams);
        });
        liveEntryServerNode.streams = streamInfoArray;

        return createSession()
            .then(function() {
                return updateStreamInfo(entryId, entryServerNodeId, liveEntryServerNode);
            });
    };

    BackendClient.addServerNode = (hostname) => {
        return createSession()
            .then(() => {
                return addServerNode(hostname);
            });
    };

    BackendClient.enableServerNode = (serverNodeId) => {
        return createSession()
            .then(() => {
                return enableServerNode(serverNodeId);
            })
    };

    BackendClient.createRecordedEntry = function(entryObj) {
        logger.debug(`[${entryObj.entryId}-${entryObj.recordedEntryId}] creating new recordedEntryId`);
        return createSession()
            .then(()=> {
                return createRecordedEntry(entryObj);
            });
    };

    BackendClient.sendBeacon = (entryId, partnerId, data, beaconTag) => {
        logger.debug(`[${entryId}] Entered sendBeacon. Creating session and sending call`);
        return createSession()
            .then(()=> {
                return sendBeacon(entryId, partnerId, data, beaconTag);
            });
    };

    BackendClient.updateRecordingStatus = (entryObj, entryServerNodeId, recordingStatus)=> {
        logger.debug(`[${entryObj.entryId}-${entryObj.recordedEntryId}] updating recording status to [${recordingStatus}]`);
        return createSession()
            .then(()=> {
                return updateRecordingStatus(entryObj.entryId, entryServerNodeId, entryObj.recordedEntryId, recordingStatus);
            });
    };

    return BackendClient;
})();

module.exports = BackendClient;
