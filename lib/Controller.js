/**
 * Created by elad.benedict on 8/26/2015.
 */

// parse command line args and update config obj
var adapter = require('./Adapters/AdapterFactory.js').getAdapter();
var LiveEntryCtor = require('./entry/LiveEntry');
var flavorDownloaderCtor = require('./entry/FlavorDownloader');
var logger = require('../common/logger').getLogger("Controller");
var fsUtils = require('./utils/fs-utils');
var config = require('./../common/Configuration');
var sessionManager = require('./SessionManager');
var persistenceFormat = require('./../common/PersistenceFormat');
var _ = require('underscore');
var ErrorUtils = require('./utils/error-utils');
var Q = require('q');
var qio = require('q-io/fs');
var path = require('path');
var util = require('util');
var MonitorServer=require('./MonitorServer.js');
var CrossDCsStreamPersistence = require('./entry/crossDCsStreamPersistence');
var backendClient=require('./BackendClientFactory.js').getBackendClient();
var RecordingManager = require('./recording/RecordingManager');

module.exports = (function(){

    function Controller(prefix){
        var self=this;
        this.prefix = prefix;
        this._handledEntriesTimeout = null; // Created by setTimeout
        this.handledEntries = {};
        this.phantomEntries = {}; // Entries reported to be live even though they're not really live (e.g. due to API bugs)
        this.pollingInterval = config.get('wowzaPollingInterval');
        this.shouldRun = true;
        this.monitorServer = new MonitorServer(this.prefix);
        this.crossDCsStreamPersistence = new CrossDCsStreamPersistence(this.prefix);

        this.monitorServer.register('/diagnostics',(req,res)=> {
            res.writeHead(200, {"Content-Type": "application/json"});
            res.end(JSON.stringify(self.getDiagnostics()));
        });
        //ability to call entry methods from webservice
        this.monitorServer.register('/entry/(.*)/(.*)',(req,res)=> {
            if (req.args && req.args.length > 1) {
                let entryIds = req.args[0];
                let method = req.args[1];
                let response="";
                _.each(self.handledEntries, (entry, entryId ) => {
                    if (_.isObject(entry) && (entryIds=="*" || entryId===entryIds)) {
                        logger.info("[%s] Request to reset entry", entryId);
                        if (_.isFunction(entry[method])) {
                            entry[method](req.args.splice(2));
                            response+="Method " + method + " on " + entryId + " was called\n";
                        } else {
                            response+="method " + method + " not found\n";
                        }
                    }
                });
                if (!response) {
                    response="Entry " + entryIds + " not found";
                }
                res.writeHead(200, {"Content-Type": "text/plain"});
                res.end(response);
            }
        });

        this.monitorServer.listen(config.get('monitorPort') + this.prefix);
    }

    function createLiveEntry(e){
        var that = this;
        var liveEntry = new LiveEntryCtor(e);

        this.crossDCsStreamPersistence.removeEntry(e.entryId);

        return liveEntry.start()
            .then(function () {
                return liveEntry;
            })
            .catch(function(err) {
                logger.error("[%s] LiveEntry Failed to start: %s", e.entryId, ErrorUtils.error2string(err));
                if (!_.isObject(err)){
                    err= new Error(err);
                }

                err.entry = liveEntry;
                return Q.reject(err);
            })
            .then(function(entry) {
                if (that.handledEntries[e.entryId] !== 'cancelPending') {
                    logger.debug("[%s] Adding entry to list of handled entries", e.entryId);
                    that.handledEntries[e.entryId] = entry;
                    //entry.on('stopped', onLiveEntryStopped.bind(that));
                }
                else {
                    logger.info("[%s] Entry creation aborted", e.entryId);
                    entry.cleanup()
                        .catch(function(err) {
                            logger.error("[%s] Aborting liveEntry object creation - %s", e.entryId, ErrorUtils.error2string(err));
                        })
                        .then(function() {
                            logger.info("[%s] Removing liveEntry object from handled entries list", e.entryId);
                            delete that.handledEntries[e.entryId];
                        });
                }
            });
    }

    function processAlreadyLiveEntries(currentlyLiveEntries) {
        var that = this;
        var alreadyLiveEntries = _.filter(currentlyLiveEntries, function(e) {
            return _.has(that.handledEntries, e.entryId);
        });
        _.forEach(alreadyLiveEntries, function(e) {
            var entry = that.handledEntries[e.entryId];
            if (entry === 'cancelPending') {
                that.handledEntries[e.entryId] = 'pending';
                logger.info("[%s] Entry started playing again after it stopped, changing state back to 'pending'", e.entryId);
            } else if  (entry !== 'pending') {
                entry.update(e.diagnosticsObj);
            }
        });
    }

    function processNewLiveEntries(currentlyLiveEntries){
        var that = this;
        var timeToCoolDown = 60*1000;
        var now = new Date();
        var unhandledLiveEntries = _.filter(currentlyLiveEntries, function(e) {
            return !_.has(that.handledEntries, e.entryId);
        });

        _.forEach(unhandledLiveEntries, function(e) {
            if (!that.handledEntries[e.entryId] && (!that.phantomEntries[e.entryId] || (now - that.phantomEntries[e.entryId] > timeToCoolDown))) {
                // Mark that this entry is already being handled (by the "pending" indicator) so that another
                // entry won't be created for it until the previous one's creation has completed
                that.handledEntries[e.entryId] = 'pending';
                logger.info("[%s] Entry started playing - creating a new object for it", e.entryId);
                createLiveEntry.call(that, e)
                    .then(function() {
                        // If the entry object creation is successful remove it from the list of phantom entries
                        if (that.phantomEntries[e.entryId]) {
                            logger.info("[%s] Successfully created liveEntry object, removing it from phantom list", e.entryId);
                            delete that.phantomEntries[e.entryId];
                        }
                    },
                    function(err) {
                        logger.error("[%s] Error starting entry object: %s", e.entryId, ErrorUtils.error2string(err));
                        if (that.handledEntries[e.entryId] === 'cancelPending') {
                            // Entry stopped streaming while trying to create object for it. Ignore the error and delete it from list
                            logger.info("[%s] Live entry stopped streaming", e.entryId);
                            if (err.entry) {
                                logger.info("[%s] Calling stop for entry", e.entryId);
                                err.entry.stop()
                                    .then(function () {
                                        logger.debug("[%s] Live entry Successfully Stopped", e.entryId);
                                    });
                            }
                        }
                        else {
                            // If the liveEntry creation was unsuccessful, wait a cool down time of 60 seconds and try again
                            var failTime = new Date();
                            that.phantomEntries[e.entryId] = failTime;
                            logger.debug("[%s] Updating last failure time and adding to phantom list: %s", e.entryId, failTime);
                        }
                        logger.info("[%s] Removing entry from handled entries list", e.entryId);
                        delete that.handledEntries[e.entryId];
                    });
            }
        });
    }

    function processNoLongerLivePhantomEntries(currentlyLiveEntries){
        var that = this;
        var noLongerLivePhantomEntries = _.difference(Object.keys(that.phantomEntries), _.map(currentlyLiveEntries, function(e) {return e.entryId;}));
        _.each(noLongerLivePhantomEntries, function(pe){
            logger.info('Phantom entry ' + pe + ' is no longer "live" - removing it from the phantom entries list');
            delete that.phantomEntries[pe];
        });
    }

    function processNoLongerLiveEntries(currentlyLiveEntries){
        var that = this;
        var noLongerLiveEntries = _.difference(Object.keys(that.handledEntries), _.map(currentlyLiveEntries, function(e) {return e.entryId;}));
        _.forEach(noLongerLiveEntries, function (noLongerLiveEntry) {
            var liveEntry = that.handledEntries[noLongerLiveEntry];
            if (liveEntry === 'pending') {
                logger.info("[%s] Entry status changed to not live before an object could be created for it. Changing state to 'cancelPending'", noLongerLiveEntry);
                that.handledEntries[noLongerLiveEntry] = 'cancelPending';
            }
            else if (liveEntry === 'cancelPending') {
                logger.info("[%s] Stop was requested for entry. Waiting to cancel its creation", noLongerLiveEntry);
            }
            else {
                logger.info("[%s] Entry is no longer live, stopping it", noLongerLiveEntry);
                return liveEntry.stop()
                    .then(() => {
                        if (liveEntry.isDVR()) {
                            that.crossDCsStreamPersistence.addEntry(noLongerLiveEntry, that.handledEntries[noLongerLiveEntry]);
                        }
                    })
                    .then(function() {
                        logger.debug("[%s] Stopped entry. Removing it from list of handled entries", noLongerLiveEntry);
                        delete that.handledEntries[noLongerLiveEntry];
                    })
                    .catch(function(err) {
                       logger.debug("[%s] Waiting %s seconds grace period", noLongerLiveEntry, config.get('flavorDownloaderTeardownInterval')/1000);
                    })
                    .done();
            }
        });
    }

    function handleEntries(){
        var that = this;
        var startTime = Date.now();
        return adapter.getLiveEntries()
            .then(function(liveEntries) {
                var relevantEntries = _.filter(liveEntries, function (e) {
                    try {
                        return e.entryId.indexOf(that.prefix) === 0;
                    } catch(err) {
                        logger.warn("Failed to identify if entry is relevant [%s]", ErrorUtils.error2string(err));
                        return false;
                    }
                });
                logger.debug("Received playing entries list from Wowza");
                return relevantEntries;
            })
            .then(function(liveEntries){
                if (that.shouldRun) {
                    logger.debug("handled live entries: %j", _.keys(that.handledEntries));
                    var phantomEntryIds = Object.keys(that.phantomEntries);
                    logger.debug("phantom live entries: %j" , phantomEntryIds);
                    logger.debug("Active flavor downloaders: %j" , flavorDownloaderCtor.activeInstances);

                    processAlreadyLiveEntries.call(that, liveEntries);
                    processNewLiveEntries.call(that, liveEntries);
                    processNoLongerLivePhantomEntries.call(that, liveEntries);
                    processNoLongerLiveEntries.call(that, liveEntries);
                    that.crossDCsStreamPersistence.processStoppedEntries();
                }
            })
            .catch(function(err) {
                logger.warn("Failed to execute handleEntries with error [%s]", ErrorUtils.error2string(err));
            })
            .finally(() => {
                // always start new timer at the end of handleEntries iteration
                let now = Date.now();
                let timeout = that.pollingInterval - (now - startTime);
                timeout = Math.max(0, timeout);
                if (timeout === 0) {
                    logger.warn(`handle entries took more than ${that.pollingInterval} milliseconds. Next iteration will immediately start.`);
                }
                that._handledEntriesTimeout = setTimeout(handleEntries.bind(that), timeout);
            });
    }

    Controller.prototype.start = function() {
        var that = this;
        logger.warn("Starting liveProxy pid: %s, wowza: '%s', API server: '%s', prefix='%s'",process.pid,config.get("mediaServer").hostname,config.get('backendClient').serviceUrl,that.prefix);
        logger.warn("Log files %s",config.get('logFileName'));
        return Q.fcall(function() {
            return that.crossDCsStreamPersistence.init()
                .finally(function() {
                    return handleEntries.call(that);
                });
        });
    };

    Controller.prototype.stop = function() {
        var that = this;
        if (this._handledEntriesTimeout) {
            clearTimeout(this._handledEntriesTimeout);
            this._handledEntriesTimeout = null;
            this.shouldRun = false;
            var stopPromises = _.map(Object.keys(this.handledEntries), function(entryId){
                return that.handledEntries[entryId].stop();
            });
            return Q.all(stopPromises);
        }
    };

    Controller.prototype.getDiagnostics = function() {
        return {
            "handledEntries": this.handledEntries,
            "phantomEntries": this.phantomEntries,
            "stoppedEntries": this.crossDCsStreamPersistence,
            "recordingManager": RecordingManager,
            "adapter": adapter
        }
    };

    return Controller;
})();