/**
 * Created by gadyaari on 24/02/2016.
 */

var PlaylistGenerator = require('./../playlistGenerator/PlaylistGenerator');
var flavorDownloader = require('./FlavorDownloader');
var config = require('../../common/Configuration');
var loggerModule = require('../../common/logger');
var ErrorUtils = require('./../utils/error-utils');
var FSM = require('./StateManager');
var events = require('events');
var util = require('util');
var Q = require('q');
var _ = require('underscore');
var KalturaLiveStatus = require('../kaltura-client-lib/KalturaTypes').KalturaEntryServerNodeStatus;
var RecordingManager = require('./../recording/RecordingManager');
var kalturaTypes = require('./../kaltura-client-lib/KalturaTypes');
var Diagnostics = require('../Diagnostics/Diagnostics');
var DiagnosticsAlertsAnalyzer = require('./../Diagnostics/DiagnosticsAlertsAnalyzer');
const BackendClient = require('../BackendClientFactory.js').getBackendClient();
const PromUtils = require('../utils/promise-utils');

function LiveEntry(entryObject) {
    events.EventEmitter.call(this);
    this.entryObject = entryObject;
    this.entryId = entryObject.entryId;
    this.recovered = entryObject.liveStatus && entryObject.liveStatus === KalturaLiveStatus.PLAYABLE;
    this.logger = loggerModule.getLogger("LiveEntry", "[" + this.entryId + "] ");
    this.entryObject.syncPromises = new PromUtils.SynchornizedPromises(this.logger);
    this.playlistGenerator = new PlaylistGenerator(entryObject);
    this.FSM = FSM(this);
    this.diagnostics = new Diagnostics(this.entryId);
    this.diagnosticsAnalyzer = new DiagnosticsAlertsAnalyzer(this.entryId, this.diagnostics);
    this.flavorsDownloaders = [];
    this.cumulativeDurationInSec = 0;
    this.entryServerNodeId = null;
    this.entryServerType = parseInt(entryObject.serverType);
    this.adapterDiagnosticsObj = {};
    this.playlistGenerator.on('diagnosticsAlert', this.diagnostics.pushAlert.bind(this.diagnostics));
    this.recordingEnable =  entryObject.recordStatus != kalturaTypes.KalturaRecordStatus.DISABLED  &&
        config.get('recording').enable;
    this.startPlayingDurationSec = _.isNumber(entryObject.segmentDurationMilliseconds) ? (3*entryObject.segmentDurationMilliseconds)/1000 : config.get('minDurationForPlaybackInSec');
    this.isMultipleAudio = false;
}
util.inherits(LiveEntry, events.EventEmitter);

function onNewTsFilesDownloaded(flavorObj, streamDurationAdditionInSec) {
    // Once entry has the configured minimum video time, call registerMediaServer->Playing every time chunklist is
    // updated. On the first time change its state and raise isLive for player, from there on update database
    // that entry is still alive every 60 seconds.
    if (flavorObj === this.flavorsDownloaders[0]) {
        this.cumulativeDurationInSec = this.cumulativeDurationInSec + streamDurationAdditionInSec;
        this.logger.debug("New files duration: [%d sec]; Total stream duration: [%d sec]" , streamDurationAdditionInSec.toFixed(2), this.cumulativeDurationInSec.toFixed(2));
        if (this.recovered) {
            this.logger.info("Entry recovered after process crashed, change state to PLAYING");
            this.recovered = false;
            this.FSM.play();
        }
        else if (this.cumulativeDurationInSec.toFixed(2) >= this.startPlayingDurationSec && this.FSM.current !== "suspending") {
            this.logger.info("Report PLAYING to server");
            this.FSM.play();
        }
    }
}

function onFlavorDownloaderStopped(flavor) {
    var that = this;
    that.logger.info("Flavor %s stopped - checking if any flavor is still active", flavor);
    if (_.every(that.flavorsDownloaders, function(f) { return f.runStatus === 'stopped'; })) {
        // If all flavorDownloaders stopped - report
        that.logger.info("No remaining active flavor downloaders");
    }
}

function updateFlavorsLanguage() {
    let flavors = _.pluck(this.entryObject.flavorsObjArray, 'name');
    return BackendClient.getFlavorsMultiStream(this.entryObject, flavors)
        .then((result)=> {
            this.logger.debug(`Received MultiStream info from server`);
            _.each(this.entryObject.flavorsObjArray, (f)=> {
                let flavorMultiStream = result[f.name];
                this.logger.debug(`Flavor: ${f.name}, MultiStream: ${flavorMultiStream}`);
                if (flavorMultiStream) {
                    let flavorMultiStreamJson = JSON.parse(flavorMultiStream);
                    if (flavorMultiStreamJson.audio && flavorMultiStreamJson.audio.languages) {
                        f.language = flavorMultiStreamJson.audio.languages[0];
                        this.isMultipleAudio = true;
                    }
                }
            });
        })
        .catch((error)=> {
            this.logger.error("Error retrieving MultiStream for flavors: %s", ErrorUtils.error2string(error));
        });
}

function createFlavorDownloaders() {
    this.flavorsDownloaders = _.map(this.entryObject.flavorsObjArray, (flavor)=> {
        this.logger.info("Creating flavor downloader: %s", flavor.name);
        return new flavorDownloader(flavor, this.entryObject, this.playlistGenerator, this.recordingEnable);
    });

    //start the download
    let promises = _.map(this.flavorsDownloaders, (f)=> {
        f.on('newStreamFiles', onNewTsFilesDownloaded.bind(this));
        f.on('stopped', onFlavorDownloaderStopped.bind(this));
        f.on('diagnosticsAlert', this.diagnostics.pushAlert.bind(this.diagnostics));
        return f.start();
    });

    return Q.allSettled(promises);
}

function checkStartupForErrors(results) {
    var that = this;
    var errs = ErrorUtils.aggregateErrors(results);
    if (errs.numErrors === results.length) {
        // Fail if no flavor downloader could be started
        throw new Error(util.format("Failed to start entry downloader for entry: %s. All flavor downloaders failed", that.entryId));
    }
    if (errs.numErrors > 0) {
        // Report an error (but proceed) if only some flavor downloader could not be started
        that.logger.error("Failed  to start flavor downloaders for some of the flavors: %s ", ErrorUtils.error2string(errs.err));
    }
}

function saveFlavorDownloadersConfiguration() {
    _.each(this.flavorsDownloaders, (f)=> {
        f.setEncodedBitrate(this.adapterDiagnosticsObj.outputs[f.flavor]);
    });
}

LiveEntry.prototype.start = function() {
    // Entry created -> report BROADCASTING to server
    this.logger.info("Entry started streaming, initialize playlistGenerator and report BROADCASTING to server");
    this.startTime = new Date();
    return this.playlistGenerator.initializeStart()
        .then ((flavorsObjArray)=> {
            this.entryObject.flavorsObjArray = flavorsObjArray;
            return updateFlavorsLanguage.call(this);
        })
        .then(()=> {
            let startPromise = this.FSM.broadcast();
            return startPromise;
        })
        .then(()=> {
            // Create master manifest and save it on disk
            return this.playlistGenerator.finalizeStart();
        })
        .then(()=> {
            if (this.recordingEnable) {
                    return RecordingManager.startRecording(this.entryObject).then(()=> {
                        this.logger.info("Successfully start recording")
                    })
                .catch((err)=> {
                    this.logger.warn("Start recording has failed %s, change recordingEnable status to false ", ErrorUtils.error2string(err));
                    this.recordingEnable = false
                })
            }

        })
        .then(()=> {
            // Create a flavorDownloader for each of the flavors currently streaming
            return createFlavorDownloaders.call(this);
        })
        .then((results)=> {
            checkStartupForErrors.call(this, results);
        })
        .catch((error)=> {
            this.logger.error("Error: [%s]", ErrorUtils.error2string(error));
            return Q.reject(error);
        });
};

LiveEntry.prototype.stop = function() {
    let that = this;

    if (that.FSM.current === 'stopped') {
        that.logger.debug("Stop is pending, ignoring request");
        return Q.reject("");
    }
    // Check if entry had a 15 seconds grace period before shutting down
    let suspendPromise = that.FSM.suspend();
    return suspendPromise
        .then(function() {
            // Wait for all flavorDownloaders to stop
            that.suspended = true;
            if (that.recordingEnable) {
                RecordingManager.stopLive(that.entryId);
            }
            that.cleanup()
                .finally(function() {
                    let stopPromise = that.FSM.stop();
                    return stopPromise
                        .catch(function(err) {
                            that.logger.error("Error calling FSM.stop: %s" ,ErrorUtils.error2string(err));
                            return Q.resolve();
                        });
                })
                .catch(function(err) {
                    that.logger.error("Error stopping entry: %s" ,ErrorUtils.error2string(err));
                    return Q.resolve();
                });
        })
        .catch(function(err) {
            //TODO: we need this line? -> Ron
            return Q.reject(err);
        });
};

LiveEntry.prototype.update = function(diagnosticsObj) {
    if (diagnosticsObj) {
        try {
            this.adapterDiagnosticsObj = diagnosticsObj;
            saveFlavorDownloadersConfiguration.call(this);
            this.diagnosticsAnalyzer.runFullDiagnosticsAnalysis(diagnosticsObj);
        }
        catch (error) {
            this.logger.error("Error while calling entry update: %s", ErrorUtils.error2string(error));
        }
    }

    this.FSM.update();
};

LiveEntry.prototype.reset = function() {
    _.each(this.flavorsDownloaders, function(f) {
        f.reset();
    });
    this.playlistGenerator.reset();
};

LiveEntry.prototype.toJSON = function() {
    var diag = {
                 'sourceInformation' : this.adapterDiagnosticsObj,
                 'flavors': this.flavorsDownloaders,
                 'startTime': this.startTime,
                 'state': this.FSM ? this.FSM.current : '',
                 'entryServerNodeId': this.entryServerNodeId,
                 'playlistGenerator': this.playlistGenerator,
                 'alerts' : this.diagnostics
    };
    return diag;
};

LiveEntry.prototype.isDVR = function() {
    return this.entryObject.dvrEnabled;
};

LiveEntry.prototype.cleanup = function() {

    var flavorsPromises = _.map(this.flavorsDownloaders, (flavor) => {
        return flavor.stop();
    });

    return Q.all(flavorsPromises)
        .then(() => {
            this.logger.info("Stopping PlaylistGenerator");
            return this.playlistGenerator.stop();
        });
};

module.exports = LiveEntry;
