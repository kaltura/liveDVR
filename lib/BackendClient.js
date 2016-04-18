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
var moduleLogger = require('./logger/logger')(module);

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
    var mediaServerIndexPromise = null;

    function printAPIResponse(logger, result, headers) {
        logger.info("API call headers: %j", headers);
        if(result)
            logger.info("API call result: %j", result);
    }

    function createSession() {
        var deferred = Q.defer();
        var now = new Date();
        //create session
        if (!lastSessionTime || (now - lastSessionTime) > sessionDuration) {
            moduleLogger.debug("Request for createSession started");
            client = new kalturaClient.KalturaClient(clientConfig);
            client.session.start(function(results, err, headers) {
                var endTime  = new Date();
                var operationTime = endTime - now;
                moduleLogger.debug("Request for createSession took %s", operationTime);
                if (err) {
                    moduleLogger.error("Failed to create session: %j", err);
                    printAPIResponse(moduleLogger, results, headers);
                    deferred.reject(err);
                }
                if (results) {
                    lastSessionTime = now;
                    moduleLogger.info("session created successfully %j", results);
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

    function getMediaServerIndexPromise() {
        if (mediaServerIndexPromise) {
            return mediaServerIndexPromise;
        }

        var deferred = Q.defer();

        //get serverNode id by mediaServerHostName
        var serverNodeFilter = new kalturaVO.KalturaWowzaMediaServerNodeFilter();
        serverNodeFilter.hostNameLike = mediaServerHostname;

        client.serverNode.listAction(function(results,err,headers) {
            if (err) {
                moduleLogger.error("Failed to retrieve serverNodeIndex for host %s with error %s", mediaServerHostname, err);
                printAPIResponse(moduleLogger, results, headers);
                deferred.reject(err);
            }
            if (results && results.objects[0] && results.objects[0].objectType !== 'KalturaAPIException') {
                var serverNode = results.objects[0];
                moduleLogger.info("successfully retrieve serverNodeId for host name %s id %s", mediaServerHostname, serverNode.id);
                deferred.resolve(serverNode.id);
            }
        }, serverNodeFilter);

        mediaServerIndexPromise=deferred.promise;

        return mediaServerIndexPromise;
    }

    function convertKalturaEntry(item){
        var res = {
          "entryId" : item.id,
          "flavorParamsIds" : item.flavorParamsIds
            // TODO: Retreive ServerIndex! -> Gad
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
        moduleLogger.debug("Request for liveStream.listAction started");
        client.liveStream.listAction(function(results, err, headers) {
            var endTime = new Date();
            var operationTime = endTime - startTime;
            moduleLogger.debug("Request for liveStream.listAction took %s", operationTime);
            if (results) {
                var objs = _.map(results.objects, convertKalturaEntry);
                moduleLogger.debug("Got live entries: %j", objs);
                deferred.resolve(objs);
            }
            else {
                printAPIResponse(moduleLogger, results, headers);
                moduleLogger.error("Failed to get live entries: %s", err);
                deferred.reject(new Error("Failed to retrieve live entries from server"));
            }
        }, filter, pager);

        return deferred.promise;
    }

    function getEntryInfo(entryId, serverNodeId) {

        var deferred = Q.defer();

        //get live stream entry by Entry ID
        var startTime = new Date();
        client.liveStream.get(function(result, err, headers) {
            var endTime = new Date();
            var operationTime = endTime - startTime;
            moduleLogger.info("Got server node info for entry %s (took %d)", entryId, operationTime);
            printAPIResponse(moduleLogger, result, headers);

            if (result.objectType !== "KalturaAPIException") {  //Use to indicate success operation
                var liveEntry = convertKalturaEntry(result);

                if(result.primaryServerNodeId === serverNodeId)
                    liveEntry.serverType = kalturaTypes.KalturaEntryServerNodeType.LIVE_PRIMARY;
                else
                    liveEntry.serverType = kalturaTypes.KalturaEntryServerNodeType.LIVE_BACKUP;
                deferred.resolve(liveEntry);
            }
            else {
                moduleLogger.error("Failed to retrieve live stream entry info for from server: %s", result[0].message);
                deferred.reject(new Error("%s: %s", result.objectType, result.code));
            }
        }, entryId);

        return deferred.promise;
    }

    function registerEntryInDatabase(entryId, serverIndex, state, event, logger) {
        var deferred = Q.defer();
        logger.debug("Request for register media server started");
        client.liveStream.registerMediaServer(function(result, err, headers) {
            if (result.objectType === "KalturaLiveStreamEntry") {  //Use to indicate success operation
                logger.info("Register media server for entry finished successfully - '%s'", event.toUpperCase());
                deferred.resolve(result);   //check which object, if any, need to pass.
            }
            else {
                printAPIResponse(logger, result, headers);
                logger.error("Failed to register media server - '%s' - for entry. Error: %s", event.toUpperCase(), result.message);
                deferred.reject(new Error(result.objectType + ": " + result.code));
            }
        }, entryId, mediaServerHostname, serverIndex, applicationName , state);
        return deferred.promise;
    }

    function unregisterEntryInDatabase(entryId, serverIndex, logger) {
        var deferred = Q.defer();
        logger.debug("Request for unregister media server started");
        client.liveStream.unregisterMediaServer(function(result, err, headers) {
            if (result.objectType === "KalturaLiveStreamEntry") {  //Use to indicate success operation
                logger.info("Unregister media server for entry finished successfully");
                deferred.resolve(result);   //check which object, if any, need to pass.
            }
            else {
                printAPIResponse(logger, result, headers);
                logger.error("Failed to unregister media from server: %s", result.message);
                deferred.reject(new Error("%s: %s", result.objectType, result.code));
            }
        }, entryId, mediaServerHostname, serverIndex, applicationName);
        return deferred.promise;
    }

    BackendClient.getLiveEntriesForMediaServer = function() {
       return createSession()
           .then(function() {
                return getLiveEntries();
            });
    };

    BackendClient.getEntries = function(entryId) {
        return createSession()
            .then(function () {
                return getMediaServerIndexPromise().then(function(index) {
                    return getEntryInfo(entryId, index);
                });
            });
    };

    BackendClient.registerEntryInDatabase = function(entryObject, state, event, logger) {
        logger.info("Calling registerMediaServer, updating entry in database");
        return createSession()
            .then(function() {
                // TODO: Change hard coded 1 value to serverIndex parameter -> Gad
                return registerEntryInDatabase(entryObject.entryId, entryObject.serverType, state, event, logger);
            });
    };

    BackendClient.unregisterEntryInDatabase = function(entryId, logger) {
        logger.debug("Calling unregisterMediaServer, and delete entry from database");
        return createSession()
            .then(function() {
                return unregisterEntryInDatabase(entryId, logger);
            });


    };

    return BackendClient;
})();

module.exports = BackendClient;
