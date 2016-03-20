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
var logger = require('./logger/logger')(module);

var BackendClient = (function(){

    function createClientConfig() {
        var conf = new kalturaClientBase.KalturaConfiguration(partnerId);
        conf.serviceUrl = config.get('backendClient').serviceUrl;
        return conf;
    };

    var convertToMs = function(minutes) {
        return minutes * 60 * 1000;
    };

    var lastSessionTime = null;
    var adminSecret = config.get('backendClient').adminSecret;
    var partnerId = config.get('backendClient').partnerId;
    var mediaServerHostname = config.get('mediaServer').hostname;
    var applicationName = config.get('mediaServer').applicationName;
    var client = null;
    var clientConfig = createClientConfig();
    var sessionDuration = convertToMs(config.get('backendClient').ksSessionRefreshIntervalMinutes);
    var BackendClient = {};

    function createSession() {
        var deferred = Q.defer();
        var now = new Date();
        //create session
        if (!lastSessionTime || (now - lastSessionTime) > sessionDuration) {
            logger.debug("Request for createSession started at " + now);
            client = new kalturaClient.KalturaClient(clientConfig);
            client.session.start(function (ks, err) {
                var endTime = new Date();
                var operationTime = endTime - now;
                logger.debug("Request for createSession (started at " + now + ") took " + operationTime);
                if (err) {
                    logger.error("Failed to create session", err);
                    deferred.reject(err);
                }
                if (ks) {
                    lastSessionTime = now;
                    logger.info('session created successfully. ks: ' + ks);
                    client.setSessionId(ks);
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
          "flavorParamsIds" : item.flavorParamsIds,
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
        logger.debug("Request for liveStream.listAction started at " + startTime);
        client.liveStream.listAction(function (results) {
            var endTime = new Date();
            var operationTime = endTime - startTime;
            logger.debug("Request for liveStream.listAction (started at " + startTime + ") took " + operationTime);
            if (results) {
                var objs = _.map(results.objects, function (item) {
                    return getParams(item);
                });
                logger.debug('Got live entries: ' + JSON.stringify(objs));
                deferred.resolve(objs);
            }
            else {
                logger.error('Failed to get live entries');
                deferred.reject(new Error("Failed to retrieve live entries from server"));
            }
        }, filter, pager);

        return deferred.promise;
    }

    function getEntries(list) {
        var deferred = Q.defer();

        var startTime = new Date();
        logger.debug("Request for liveStream.listAction started at " + startTime);
        var entriesString = "";
        _.each(list, function(entryId) {
            entriesString += entryId + ",";
        });
        var filter = new kalturaVO.KalturaLiveStreamEntryFilter();
        filter.idIn = entriesString;
        client.liveStream.listAction(function(results) {
            var endTime = new Date();
            var operationTime = endTime - startTime;
            logger.debug("Request for liveStream.listAction (started at %s) took %s" , startTime, operationTime);
            if (results.objects) {
                var unRejectedEntries = _.filter(results.objects, function(r) {
                    if (r.objectType == "KalturaAPIException") {
                        logger.info("Entry Error: " + r.code + ": " + r.message);
                        return false;
                    }
                    return true;
                });
                var objs = _.map(unRejectedEntries, function(item) {
                    return  getParams(item);
                });
                logger.debug('Got live entries: %j', objs);
                deferred.resolve(objs);
            }
            else {
                logger.error("Failed to retrieve live entries. Code: " + results.code);
                deferred.reject(new Error("Failed to retrieve live entries from server"));
            }
        }, filter);

        return deferred.promise;
    }

    function registerEntryInDatabase(entryId, serverIndex, state, event) {
        var deferred = Q.defer();
        var startTime = new Date();
        logger.debug("Request for register media server, started at " + startTime);
        client.liveStream.registerMediaServer(function(result) {
            if (result.objectType === "KalturaLiveStreamEntry") {  //Use to indicate success operation
                deferred.resolve(result);   //check which object, if any, need to pass.
                logger.info("Register media server for entry %s finished successfully - '%s'", result.id, event.toUpperCase());
            }
            else {
                logger.error("Failed to register media server - '%s' - for entry: %s, Error: %s", event.toUpperCase(), result.id, result.message);
                deferred.reject(new Error(result.objectType + ": " + result.code));
            }
        }, entryId, mediaServerHostname, serverIndex, applicationName , state);
        return deferred.promise;
    }

    function unregisterEntryInDatabase(entryId) {
        var deferred = Q.defer();
        var startTime = new Date();
        logger.debug("Request for unregister media server, started at %s", startTime);
        client.liveStream.unregisterMediaServer(function (result) {
            if (result.objectType === "KalturaLiveStreamEntry") {  //Use to indicate success operation
                deferred.resolve(result);   //check which object, if any, need to pass.
                logger.info("Unregister media server for entry %s finished successfully", result.id);
            }
            else {
                logger.error("Failed to unregister media from server: %s", result.message);
                deferred.reject(new Error("%s: %s", result.objectType, result.code));
            }
        }, entryId, mediaServerHostname, 1, applicationName);
        return deferred.promise;
    }

    BackendClient.getLiveEntriesForMediaServer = function() {
       return createSession()
           .then(function() {
                return getLiveEntries();
            });
    };

    BackendClient.getEntries = function(entryList) {
        return createSession().
                then(function () {
                    return getEntries(entryList);
                });
    };

    BackendClient.registerEntryInDatabase = function(entryObject, state, event) {
        logger.info("Calling registerMediaServer, updating entry %s in database", entryObject.entryId);
        return createSession()
            .then(function() {
                // TODO: Change hard coded 1 value to serverIndex parameter -> Gad
                return registerEntryInDatabase(entryObject.entryId, 1, state, event);
            });
    };

    BackendClient.unregisterEntryInDatabase = function(entryId) {
        logger.info("Calling unregisterMediaServer, and delete entry %s from database", entryId);
        return createSession()
            .then(function() {
                return unregisterEntryInDatabase(entryId);
            });


    };
    //This method is use for debugging ---NOT WORKING
    BackendClient.IsLive = function(entryId) {
        return createSession()
            .then(function() {
                client.liveStream.isLive(function (result) {
                    logger.info(result);
                }, entryId, "http");
            });

    }

    return BackendClient;
})();

module.exports = BackendClient;
