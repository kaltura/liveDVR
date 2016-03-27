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

    var createClientConfig = function () {
        var conf = new kalturaClientBase.KalturaConfiguration(partnerId);
        conf.serviceUrl = config.get('backendClient').serviceUrl;
        return conf;
    };

    var convertToMs = function (minutes) {
        return minutes * 60 * 1000;
    };

    var lastSessionTime = null;
    var adminSecret = config.get('backendClient').adminSecret;
    var partnerId = config.get('backendClient').partnerId;
    var mediaServerHostname = config.get('mediaServer').hostname;
    var client = null;
    var clientConfig = createClientConfig();
    var sessionDuration = convertToMs(config.get('backendClient').ksSessionRefreshIntervalMinutes);

    var BackendClient = {};

    var createSession = function() {
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
    };

    var getLiveEntries = function () {
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
                var objs = _.map(results.objects,  function (item) {

                    var res = {
                        "entryId" : item.id,
                        "flavorParamsIds" : item.flavorParamsIds
                    };

                    if (item.dvrStatus === kalturaTypes.KalturaDVRStatus.ENABLED) {

                        if (item.dvrWindow) {
                            var entryDVRWindow = item.dvrWindow * 60;     //   assuming dvrWindow from backend is in minutes!
                            res.dvrWindow = Math.max(config.get("minimalDvrWindow"), entryDVRWindow);

                        }
                        else
                        {
                            res.dvrWindow = config.get("defaultDvrWindow");
                        }

                        res.maxChunkCount = config.get("dvrMaxChunkCount");
                    }
                    else {
                        res.maxChunkCount = config.get("liveMaxChunkCount");
                    }

                    return res;
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
    };

    var getEntries = function (list) {
        var deferred = Q.defer();

        var startTime = new Date();
        logger.debug("Request for liveStream.listAction started at " + startTime);
        client.startMultiRequest();
        _.each(list,function(entryId) {
            client.liveStream.get(null,entryId);
        });

        client.doMultiRequest(function (results) {
            var endTime = new Date();
            var operationTime = endTime - startTime;
            logger.debug("Request for multirequest liveStream.get (started at " + startTime + ") took " + operationTime);
            if (results) {
                var objs = _.map(results, function (item) {


                    return item;
                });
                logger.debug('Got live entries: ' + JSON.stringify(objs));
                deferred.resolve(objs);
            }
            else {
                logger.error('Failed to get live entries');
                deferred.reject(new Error("Failed to retrieve live entries from server"));
            }
        });

        return deferred.promise;
    };

    BackendClient.getLiveEntriesForMediaServer = function () {
       return createSession().
            then(function () {
                return getLiveEntries();
            });
    };

    BackendClient.getEntries = function (entryList) {
        return createSession().
                then(function () {
                    return getEntries(entryList);
                });
    };
    return BackendClient;
})();

module.exports = BackendClient;