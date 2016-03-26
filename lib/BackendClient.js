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
//var logger = require('./logger/logger')(module);

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

    function printAPIResponse(result, headers) {
        logger.info("API call headers: %j", headers);
        logger.info("API call result: %j", result);
    }

    function createSession(logger) {
        var deferred = Q.defer();
        var now = new Date();
        //create session
        if (!lastSessionTime || (now - lastSessionTime) > sessionDuration) {
            logger.debug("Request for createSession started");
            client = new kalturaClient.KalturaClient(clientConfig);
            client.session.start(function(results, err, headers) {
                var endTime = new Date();
                var operationTime = endTime - now;
                logger.debug("Request for createSession took %s", operationTime);
                if (err) {
                    logger.error("Failed to create session: %s", err);
                    printAPIResponse(results, headers);
                    deferred.reject(err);
                }
                if (results) {
                    lastSessionTime = now;
                    logger.info("session created successfully %s", results);
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

    function getParams(item){
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
        logger.debug("Request for liveStream.listAction started");
        client.liveStream.listAction(function(results, err, headers) {
            var endTime = new Date();
            var operationTime = endTime - startTime;
            logger.debug("Request for liveStream.listAction took %s", operationTime);
            if (results) {
                var objs = _.map(results.objects, function (item) {
                    return getParams(item);
                });
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

    function getEntries(list, logger) {
        var deferred = Q.defer();

        var startTime = new Date();
        logger.debug("Request for liveStream.listAction started");
        var entriesString = "";
        _.each(list, function(entryId) {
            entriesString += entryId + ",";
        });
        var filter = new kalturaVO.KalturaLiveStreamEntryFilter();
        filter.idIn = entriesString;
        client.liveStream.listAction(function(results, err, headers) {
            var endTime = new Date();
            var operationTime = endTime - startTime;
            logger.debug("Request for liveStream.listAction took %s" , operationTime);
            if (results.objects) {
                // Retrieve only the entries that didn't return with exception
                var unRejectedEntries = _.filter(results.objects, function(r) {
                    if (r.objectType == "KalturaAPIException") {
                        logger.info("Entry Error: %s: %s", r.code, r.message);
                        return false;
                    }
                    return true;
                });
                var objs = _.map(unRejectedEntries, function(item) {
                    return  getParams(item);
                });
                logger.debug("Got live entries: %j", objs);
                deferred.resolve(objs);
            }
            else {
                printAPIResponse(results, headers);
                logger.error("Failed to retrieve live entries. Code: %s; Error: %s", results.code, err);
                deferred.reject(new Error("Failed to retrieve live entries from server"));
            }
        }, filter);

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
                printAPIResponse(result, headers);
                logger.error("Failed to register media server - '%s' - for entry. Error: %s", event.toUpperCase(), result.message);
                deferred.reject(new Error(result.objectType + ": " + result.code));
            }
        }, entryId, mediaServerHostname, serverIndex, applicationName , state);
        return deferred.promise;
    }

    function unregisterEntryInDatabase(entryId, logger) {
        var deferred = Q.defer();
        logger.debug("Request for unregister media server started");
        client.liveStream.unregisterMediaServer(function(result, err, headers) {
            if (result.objectType === "KalturaLiveStreamEntry") {  //Use to indicate success operation
                logger.info("Unregister media server for entry finished successfully");
                deferred.resolve(result);   //check which object, if any, need to pass.
            }
            else {
                printAPIResponse(result, headers);
                logger.error("Failed to unregister media from server: %s", result.message);
                deferred.reject(new Error("%s: %s", result.objectType, result.code));
            }
        }, entryId, mediaServerHostname, 1, applicationName);
        return deferred.promise;
    }

    BackendClient.getLiveEntriesForMediaServer = function() {
        // TODO: Should we transfer logger here as well? Only called from APIQueryAdapter and not used currently -> Gad
       return createSession()
           .then(function() {
                return getLiveEntries();
            });
    };

    BackendClient.getEntries = function(entryList, logger) {
        return createSession(logger)
            .then(function () {
                return getEntries(entryList, logger);
            });
    };

    BackendClient.registerEntryInDatabase = function(entryObject, state, event, logger) {
        logger.info("Calling registerMediaServer, updating entry in database");
        return createSession(logger)
            .then(function() {
                // TODO: Change hard coded 1 value to serverIndex parameter -> Gad
                return registerEntryInDatabase(entryObject.entryId, 1, state, event, logger);
            });
    };

    BackendClient.unregisterEntryInDatabase = function(entryId, logger) {
        logger.debug("Calling unregisterMediaServer, and delete entry from database");
        return createSession(logger)
            .then(function() {
                return unregisterEntryInDatabase(entryId, logger);
            });


    };

    return BackendClient;
})();

module.exports = BackendClient;
