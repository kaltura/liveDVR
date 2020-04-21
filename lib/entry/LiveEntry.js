/**
 * Created by gadyaari on 24/02/2016.
 */

const PlaylistGenerator = require('./../playlistGenerator/PlaylistGenerator');
const flavorDownloader = require('./FlavorDownloader');
const config = require('../../common/Configuration');
const loggerModule = require('../../common/logger');
const ErrorUtils = require('./../utils/error-utils');
const FSM = require('./StateManager');
const events = require('events');
const util = require('util');
const Q = require('q');
const _ = require('underscore');
const KalturaLiveStatus = require('../kaltura-client-lib/KalturaTypes').KalturaEntryServerNodeStatus;
const RecordingManager = require('./../recording/RecordingManager');
const kalturaTypes = require('./../kaltura-client-lib/KalturaTypes');
const Diagnostics = require('../Diagnostics/Diagnostics');
const diagnosticsAlerts = require('../Diagnostics/DiagnosticsAlerts');
const BackendClient = require('../BackendClientFactory.js').getBackendClient();
const PromUtils = require('../utils/promise-utils');
const pushManager = require('../PushManager').PushManager;

function LiveEntry(entryObject) {
    events.EventEmitter.call(this);
    this.entryObject = entryObject;
    this.entryId = entryObject.entryId;
    this.recovered = entryObject.liveStatus && entryObject.liveStatus === KalturaLiveStatus.PLAYABLE;
    this.logger = loggerModule.getLogger("LiveEntry", "[" + this.entryId + "] ");
    this.entryObject.syncPromises = new PromUtils.SynchornizedPromises(this.logger);
    this.playlistGenerator = new PlaylistGenerator(entryObject);
    this.FSM = FSM(this);
    this.diagnostics = new Diagnostics(entryObject);
    this.on('updateBeacons', this.diagnostics.updateBeacons.bind(this.diagnostics));
    this.flavorsDownloaders = [];
    this.cumulativeDurationInSec = 0;
    this.entryServerNodeId = null;
    this.entryServerType = parseInt(entryObject.serverType);
    this.adapterDiagnosticsObj = {};
    this.playlistGenerator.on('diagnosticsAlert', this.diagnostics.insertAlert.bind(this.diagnostics));
    this.recordingEnable =  entryObject.recordStatus != kalturaTypes.KalturaRecordStatus.DISABLED  &&
        config.get('recording').enable;
    this.startPlayingDurationSec = _.isNumber(entryObject.segmentDurationMilliseconds) ? (3*entryObject.segmentDurationMilliseconds)/1000 : config.get('minDurationForPlaybackInSec');
    this.isMultipleAudio = false;
    this._registerToPush();
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
            flavorObj.isDirty = false;
            this.recovered = false;
            this.FSM.play();
        }
        else if (flavorObj.isDirty && this.FSM.current === "suspending") {
            this.logger.info("Flavor object is dirty during suspending");
            flavorObj.isDirty = false;
            this.FSM.update();
        }
        else if (this.cumulativeDurationInSec.toFixed(2) >= this.startPlayingDurationSec && this.FSM.current !== "suspending") {
            this.logger.info("Report PLAYING to server");
            flavorObj.isDirty = false;
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
        f.on('diagnosticsAlert', this.diagnostics.insertAlert.bind(this.diagnostics));
        f.on('updateBeacons', this.diagnostics.updateBeacons.bind(this.diagnostics));
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

LiveEntry.prototype.start = function() {
    // Entry created -> report BROADCASTING to server
    this.logger.info("Entry started streaming, initialize playlistGenerator and report BROADCASTING to server");
    this.startTime = new Date();
    this.emit('updateBeacons', { report: new diagnosticsAlerts.EntryStarted(this.entryId) });
    return this.playlistGenerator.initializeStart()
        .then ((flavorsObjArray)=> {
            this.entryObject.flavorsObjArray = flavorsObjArray;
            return updateFlavorsLanguage.call(this);
        })
        .then(()=>{
            this.playlistGenerator.sortFlavors(this.entryObject.conversionProfile.defaultAudioLang);
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
            if (this.recordingEnable && this.entryObject.recordingStatus == kalturaTypes.KalturaRecordingStatus.ACTIVE) {
                    return RecordingManager.startRecording(this.entryObject).then(()=> {
                        this.logger.info("Successfully started recording")
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
    if (this.FSM.current === 'stopped') {
        this.logger.debug("Stop is pending, ignoring request");
        return Q.reject("");
    }
    if (this.FSM.current !== 'suspending') {
        this.emit('updateBeacons', { report: new diagnosticsAlerts.EntryStopped(this.entryId) });
    }
    // Check if entry had a 15 seconds grace period before shutting down
    let suspendPromise = this.FSM.suspend();
    return suspendPromise
        .then(() => {
            if (this.recordingEnable) {
                RecordingManager.stopLive(this.entryId);
            }
            // Wait for all flavorDownloaders to stop
            this.cleanup()
                .finally(() => {
                    let stopPromise = this.FSM.stop();
                    return stopPromise
                        .catch((err) => {
                            this.logger.error("Error calling FSM.stop: %s" ,ErrorUtils.error2string(err));
                            return Q.resolve();
                        });
                })
                .catch((err) => {
                    this.logger.error("Error stopping entry: %s" ,ErrorUtils.error2string(err));
                    return Q.resolve();
                });
        })
        .catch((err) => {
            //TODO: we need this line? -> Ron
            return Q.reject(err);
        });
};

LiveEntry.prototype.update = function(diagnosticsObj) {
    if (diagnosticsObj) {
        try {
            this.adapterDiagnosticsObj = diagnosticsObj;
            let metadata = {
                'source' : this.adapterDiagnosticsObj,
                'flavors' : [],
                'playlistGenerator' : this.playlistGenerator.toJSON()
            };
            _.each(this.flavorsDownloaders, (f)=> {
                f.setEncodedBitrate(this.adapterDiagnosticsObj.outputs[f.flavor]);
                metadata.flavors.push(f.toJSON());
            });

            this.diagnostics.handleDiagnosticsReport(metadata);
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

    let flavorsPromises = _.map(this.flavorsDownloaders, (flavor) => {
        return flavor.stop();
    });

    return Q.all(flavorsPromises)
        .then(() => {
            this.logger.info("Stopping PlaylistGenerator");
            return this.playlistGenerator.stop();
        })
        .then(() => {
            this.logger.debug('Stopping diagnostics module');
            return this.diagnostics.cleanup();
        });
};

LiveEntry.prototype._registerToPush = function()
{
    this.logger.debug(`Registering partner ${this.entryObject.partnerId} and object ${this.entryObject.entryId} for push`);
    pushManager.registerObjectToPush(this.entryObject.partnerId, config.get('explicitLivePushNotificationTemplateName'),this.entryObject.entryId,{'entryId': this.entryObject.entryId}, (...args) => this._pushMessageReceived(...args));
}

LiveEntry.prototype._pushMessageReceived = function(msg)
{
    const entry = msg[0];
    if (this.entryObject.updatedAt >= entry.updatedAt)
    {
        this.logger.debug(`received old message, disregarding`);
        return;
    }
    this.logger.debug(`handling message for entry ${util.inspect(entry)}`);
    this.entryObjectUpdated(entry);
}

LiveEntry.prototype.entryObjectUpdated = function(entry)
{
    const origRecordingStatus = this.entryObject.recordingStatus;
    const origViewMode = this.entryObject.viewMode;
    this._updateEntryObject(entry);

    if (entry.viewMode == kalturaTypes.KalturaViewMode.ALLOW_ALL
        && origViewMode != kalturaTypes.KalturaViewMode.ALLOW_ALL)
    {
        this._startDVR(entry);
        this._setClipFrom((entry.updatedAt - config.get('minDurationForPlaybackInSec')) * 1000, false);
        this._removeClipTo().then (()=>{this._updateIsPlayableUser(true)});
    }
    if (entry.viewMode == kalturaTypes.KalturaViewMode.PREVIEW
        && origViewMode != kalturaTypes.KalturaViewMode.PREVIEW)
    {
        this._setClipTo(entry.updatedAt * 1000);
        /*
            This should happen atomically in the backend server.
            This line is to circumvent a potential race condition that might
            occur with two rapid changes to viewMode property
         */
        this._updateIsPlayableUser(false);
    }
    if (entry.recordingStatus == kalturaTypes.KalturaRecordingStatus.ACTIVE
        && origRecordingStatus != kalturaTypes.KalturaRecordingStatus.ACTIVE)
    {
        this._startRecording(entry);
    }
    else if (entry.recordingStatus == kalturaTypes.KalturaRecordingStatus.STOPPED
        && origRecordingStatus != kalturaTypes.KalturaRecordingStatus.STOPPED)
    {
        this._stopRecording(entry);
    }
}

LiveEntry.prototype._updateEntryObject = function(entry)
{
    this.entryObject.viewMode = entry.viewMode;
    this.entryObject.recordingStatus = entry.recordingStatus;
    this.entryObject.recordedEntryId = entry.recordedEntryId;
    this.entryObject.updatedAt = entry.updatedAt;
}

LiveEntry.prototype._startDVR = function(entry)
{
    this.logger.debug(`starting dvr`);
    const newPlayWindow = Math.ceil(this.entryObject.playWindow * 1000);
    this.playlistGenerator.setDVRDuration(newPlayWindow);
}

LiveEntry.prototype._setClipFrom = function(clipToTimeMs, overrideExist = true)
{
    this.playlistGenerator.setClipFrom(clipToTimeMs, overrideExist);
}

LiveEntry.prototype._setClipTo = function(clipToTimeMs)
{
    this.playlistGenerator.setClipTo(clipToTimeMs);
}

LiveEntry.prototype._removeClipTo = function()
{
    this.playlistGenerator.setClipTo(null);
    const persistePlaylistPromise = this.playlistGenerator.updateWithoutChunks(true);
    return persistePlaylistPromise;
}

LiveEntry.prototype._startRecording = function(entry)
{
    this.logger.debug(`starting recording on [${entry.id}]`);
    _.each(this.flavorsDownloaders, (f)=> {
        f.releaseSavedChunks(entry.updatedAt);
    });
    RecordingManager.startRecording(this.entryObject).then(()=> {
        this.logger.info(`Successfully started recording`);
    })
    .catch((err)=> {
        this.logger.error("Start recording has failed %s, change recordingEnable status to false ", ErrorUtils.error2string(err));
        this.recordingEnable = false
    });
}

LiveEntry.prototype._stopRecording = function(entry)
{
    this.logger.debug(`stopping recording`);
    const resetRecordedEntryId = (this.entryObject.recordStatus != kalturaTypes.KalturaRecordStatus.APPENDED);
    RecordingManager.stopRecording(entry.id, resetRecordedEntryId);
}

LiveEntry.prototype._updateIsPlayableUser = function(isPlayableUser)
{
        this.logger.info(`Updating is live user to [${isPlayableUser}`);
        BackendClient.updateIsPlayableUser(this.entryServerNodeId, isPlayableUser);
}

module.exports = LiveEntry;
