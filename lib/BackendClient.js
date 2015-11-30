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

    var createSession = function () {
        var deferred = Q.defer();
        var startTime = new Date().getTime();
        logger.debug("Request for createSession started at " + startTime);
        client = new kalturaClient.KalturaClient(clientConfig);
        client.session.start(function(ks, err){
            var endTime = new Date().getTime();
            var operationTime = endTime - startTime;
            logger.debug("Request for createSession (started at " + startTime + ") took " + operationTime + " ms");
            if (err){
                logger.error("Failed to create session", err);
                deferred.reject(err);
            }
            if(ks){
                logger.info('session created successfully. ks: ' + ks);
                client.setSessionId(ks);
                deferred.resolve();
            }
        }, adminSecret, null, kalturaTypes.KalturaSessionType.ADMIN, partnerId, null, null);

        return deferred.promise;
    };

    var getLiveEntries = function () {
        var deferred = Q.defer();
        var filter = new kalturaVO.KalturaLiveStreamEntryFilter();
        filter.isLive = kalturaTypes.KalturaNullableBoolean.TRUE_VALUE;
        filter.hasMediaServerHostname = mediaServerHostname;
        var pager = null;
        var startTime = new Date().getTime();
        logger.debug("Request for liveStream.listAction started at " + startTime);
        client.liveStream.listAction(function (results) {
            var endTime = new Date().getTime();
            var operationTime = endTime - startTime;
            logger.debug("Request for liveStream.listAction (started at " + startTime + ") took " + operationTime + " ms");
            if (results) {
                var objs = _.map(results.objects, function (item) {
                    var dvrWindow = config.get("dvrWindow");
                    if (item.dvrStatus === kalturaTypes.KalturaDVRStatus.DISABLED) {
                        dvrWindow = config.get("liveDvrWindow");
                    }
                    return {
                        "dvrWindow": dvrWindow,
                        "entryId" : item.id
                    };
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

    BackendClient.getLiveEntriesForMediaServer = function () {
        var now = new Date().getTime();
        //create session
        if (!lastSessionTime || (now - lastSessionTime) > sessionDuration) {
            logger.info("Session does not exists or expired. Creating session");
            return createSession().
                then(function () {
                    lastSessionTime = now;
                    return getLiveEntries();
                });
        }
        else {
            //session exists
            logger.debug("session already exists. getting live entries");
            return getLiveEntries();
        }
    };
    return BackendClient;
})();

module.exports = BackendClient;