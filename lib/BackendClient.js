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
            "segmentDurationMilliseconds" : item.segmentDuration,
            "capabilities" : item.capabilities,
            "viewMode" : item.viewMode,
            "recordingStatus" : item.recordingStatus,
            "updatedAt" : item.updatedAt
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

        liveEntryObject.isRedundancy = (apiCallResults[1].objects.length > 1);
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
        var entryServerNodeFilter = new kalturaVO.KalturaLiveEntryServerNodeFilter();
        entryServerNodeFilter.entryIdEqual = entryId;
        entryServerNodeFilter.serverTypeIn = kalturaTypes.KalturaEntryServerNodeType.LIVE_BACKUP + ',' + kalturaTypes.KalturaEntryServerNodeType.LIVE_PRIMARY;
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

    function registerEntryInDatabase(entryObject, state, event) {
        var deferred = Q.defer();
        logger.debug("[%s] Calling registerMediaServer. Hostname: [%s], serverIndex: [%s], Application: [%s], state: [%s]", entryObject.entryId, mediaServerHostname, entryObject.serverType, applicationName, state);

        //Impersonate call to the entry's partnerId to execute the call in the partner's context
        client.setPartnerId(entryObject.partnerId);

        const shouldCreateRecordedEntry = (entryObject.recordingStatus == kalturaTypes.KalturaRecordingStatus.ACTIVE);

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
        }, entryObject.entryId, mediaServerHostname, entryObject.serverType, applicationName , state, shouldCreateRecordedEntry);

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
        let entryServerNodeFilter = filter ? filter : new kalturaVO.KalturaLiveEntryServerNodeFilter();
        entryServerNodeFilter.entryIdEqual = entryId;

        return createSession()
            .then(() => {
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

                return deferred.promise;
            });
    }

    function updateEntryDuration(entryId, cumulativeDurationMs) {
        var KalturaMediaEntry = new kalturaVO.KalturaMediaEntry();
        var deferred = Q.defer();
        KalturaMediaEntry.msDuration = cumulativeDurationMs;
        client.liveStream.update( function(result, err, headers) {
            printAPIResponse(result, headers);
            if(err || result.objectType === 'KalturaAPIException') {
                logger.debug("[%s] Failed to update entry duration for [%s] with error [%s]", entryId,  ErrorUtils.error2string(err));
                deferred.reject();
            }
            else {
                deferred.resolve();
            }

        }, entryId, KalturaMediaEntry);
        return deferred.promise;
    }

    /**********************************************/
    // Call three API requests:
    // 1) liveStream.update: Update liveStream with an empty recordedEntryID.
    // 2) entryServerNode.list: Retrieve entry's last status in sever.
    // 3) liveStream.registerMediaServer: Register entry in server with
    //    the last status received and get a new recordedEntryId.
    /**********************************************/
    function resetRecordingEntry(entryObj, allowRecordedEntryCreation) {
        let deferred = Q.defer();
        logger.debug(`[${entryObj.entryId}] Calling multiRequest for resetting recordedEntryID`);
        client.startMultiRequest();
        let KalturaMediaEntry = new kalturaVO.KalturaMediaEntry();
        // liveStream.update parameter
        KalturaMediaEntry.recordedEntryId = "";
        KalturaMediaEntry.msDuration = 0;
        KalturaMediaEntry.redirectEntryId = "";
        // entryServerNode.lise parameter
        let EntryServerNodeFilter = new kalturaVO.KalturaLiveEntryServerNodeFilter();
        EntryServerNodeFilter.entryIdEqual = entryObj.entryId;
        // liveStream.registerMediaServer parameter
        let streamState = '{2:result:objects:0:status}';
        client.setPartnerId(entryObj.partnerId);

        client.liveStream.update(null, entryObj.entryId, KalturaMediaEntry);
        client.entryServerNode.listAction(null, EntryServerNodeFilter);
        client.liveStream.registerMediaServer(null, entryObj.entryId, mediaServerHostname, entryObj.serverType, applicationName, streamState, allowRecordedEntryCreation);

        client.doMultiRequest((results, err, headers)=> {
            printAPIResponse(results, headers);

            if (iskMultiRequestSuccessful(results, err, 3)) {
                logger.info(`[${entryObj.entryId}] Successfully retrieved new recordedEntryId`);
                deferred.resolve(results[2].recordedEntryId);
            }
            else {
                let errMsg = util.format(`[${entryObj.entryId}] Failed to retrieve live stream entry info for from server: ${ErrorUtils.error2string(err)}. ${results}`);
                logger.error(errMsg);
                deferred.reject(new Error(errMsg));
            }
        });

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

    function getEntryPermission(entryId, clientPartnerId, permissionName) {
        let deferred = Q.defer();
        //Impersonate call to the entry's partnerId to execute the call in the partner's context
        client.setPartnerId(clientPartnerId);

        logger.debug(`[${entryId}] [getEntryPermission] partner: [${clientPartnerId}], permissionName: [${permissionName}]`);

        client.permission.get((result, err, headers)=> {
            printAPIResponse(result, headers);
            if(err || result.objectType === 'KalturaAPIException') {
                logger.debug(`[${entryId}] operation permission.get failed. Error: ${ErrorUtils.error2string(err)}`);
                deferred.reject();
            }
            else {
                logger.info(`[${entryId}] operation permission.get successfully ended. Response [${JSON.stringify(result)}]`);
                deferred.resolve(result);
            }
        }, permissionName);

        //Remove impersonation
        client.setPartnerId(partnerId);
        return deferred.promise;

    }

    function registerToPush(templateSystemName, partnerIdToRegister, params)
    {
        const deferred = Q.defer();

        client.setPartnerId(partnerIdToRegister);
        const userParams = {};
        userParams.userParams = _.map(params,
            function(value, key)
            {
                return {'key': key, value: {objectType:getValueType(value), 'value': value}};
            });

        client.eventNotificationTemplate.register((result, err, headers)=> {
            printAPIResponse(result, headers);
            if(err || result.objectType === 'KalturaAPIException') {
                logger.debug(`operation eventNotificationTemplate.register failed. Error: ${ErrorUtils.error2string(err)}`);
                deferred.reject('Operation failed');
            }
            else {
                logger.info(`operation eventNotificationTemplat.register successfully ended. Response [${JSON.stringify(result)}]`);
                deferred.resolve(result);
            };
        }, templateSystemName, userParams);
        client.setPartnerId(partnerId);
        return deferred.promise;
    }

    function getValueType(value)
    {
        if (typeof value == 'string')
            return 'KalturaStringValue';
    }

    function updateEntryServerNode(entryServerNodeId, liveEntryServerNode)
    {
        var deferred = Q.defer();
        client.entryServerNode.update( function(result, err, headers) {
            printAPIResponse(result, headers);
            if(err || result.objectType === 'KalturaAPIException') {
                logger.debug("[%s] Failed to update is-playeable-user for [%s] with error [%s]", entryServerNodeId,  ErrorUtils.error2string(err));
                deferred.reject();
            }
            else {
                deferred.resolve();
            }

        }, entryServerNodeId, liveEntryServerNode);
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

    };

    BackendClient.getLiveEntryServerNodes = function(entryId, filter = null) {
        return getLiveEntryServerNodes(entryId, filter);
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
    };

    BackendClient.resetRecordingEntry = function(entryObj, allowRecordedEntryCreation = true) {
        logger.debug(`[${entryObj.entryId}] reset recordedEntryId`);
        return createSession()
            .then(()=> {
                return resetRecordingEntry(entryObj, allowRecordedEntryCreation);
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

    BackendClient.sendBeacon = (entryId, partnerId, data, beaconTag) => {
        logger.debug(`[${entryId}] Entered sendBeacon. Creating session and sending call`);
        return createSession()
            .then(()=> {
                return sendBeacon(entryId, partnerId, data, beaconTag);
            });
    };

    BackendClient.getEntryPermission = (entryId, clientPartnerId, permissionName)=> {
        return createSession()
            .then(() => {
                return getEntryPermission(entryId, clientPartnerId, permissionName);
            });
    };

    BackendClient.registerToPush = (templateSystemName, partnerIdToRegister, params) => {
        return createSession().
            then(() => {
               return registerToPush(templateSystemName, partnerIdToRegister, params);
            });
    };

    BackendClient.updateIsPlayableUser = (entryServerNodeId, isPlayableUser) => {
        return createSession().
            then(() => {
                const liveEntryServerNode = new kalturaVO.KalturaLiveEntryServerNode();
                liveEntryServerNode.isPlayableUser = isPlayableUser;
                return updateEntryServerNode(entryServerNodeId, liveEntryServerNode);
            });
    };

    return BackendClient;
})();

module.exports = BackendClient;
