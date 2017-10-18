/**
 * Created by gadyaari on 09/01/2017.
 */

const loggerModule = require('../../common/logger');
const diagnosticsAlerts = require('./DiagnosticsAlerts');
const config = require('../../common/Configuration');
const ErrorUtils = require('./../utils/error-utils');
const _ = require('underscore');
const EventEmitter = require('events');
const kalturaTypes = require('../kaltura-client-lib/KalturaTypes');
const DiagnosticsErrorCodes = require('./DiagnosticsAlerts').DiagnosticsErrorCodes;
const ptsWindowSize = config.get('diagnostics').ptsRollingWindowSizeInSec * 1000;
const ptsPercentageDifference = config.get('diagnostics').ptsDiffPercentageAllowed;
const keyFrameIntervalExpected = config.get('diagnostics').keyFrameIntervalExpectedInMSec;
const keyFrameIntervalDiffAllowed = config.get('diagnostics').keyFrameIntervalDiffAllowedInMSec;
const maxFramesPerSeconds = config.get('diagnostics').maxFramesPerSeconds;

class DiagnosticsAnalyzer extends EventEmitter{
    constructor(entryId, alertsWindowSize) {
        super();
        this._entryId = entryId;
        this._logger = loggerModule.getLogger('DiagnosticsAnalyzer', '[' + entryId + '] ');
        this._bitrateDiffPercentageAllowed = config.get('diagnostics').bitrateDiffPercentageAllowed;
        this._alertsWindowSizeInMSec = alertsWindowSize;
        this._inputsRunningTime = new Map();
        this._audioVideo = {
            lastChecked: new Map(),
            isAudio: false,
            isVideo: false
        };
        this._ptsDataHistory = [];

        this.alertsToSend = [];
        this.alertsToRemove = [];
    }

    _hasEntryRestarted(currRunTime, input) {
        if (!this._inputsRunningTime.has(input)) {
            this._inputsRunningTime.set(input, 0);
        }
        let alertObj = new diagnosticsAlerts.EntryRestartedAlert(this._entryId, currRunTime, input);
        if (this._inputsRunningTime.get(input) > currRunTime) {
            this.alertsToSend.push(alertObj);
            this._logger.info(alertObj.msg);
        }
        this._inputsRunningTime.set(input, currRunTime);
    }

    _checkAudio(audioDataRate, input) {
        let alertObj = new diagnosticsAlerts.NoAudioSignalAlert(this._entryId, input);
        if (!audioDataRate) {
            if (this._audioVideo.isAudio) {
                // Audio data stopped arriving. Shutdown flag and report alert.
                this._audioVideo.isAudio = false;
                this.alertsToSend.push(alertObj);
                this._logger.info(alertObj.msg);
            }
        }
        else {
            if (!this._audioVideo.isAudio) {
                // Audio data resumed. Raise flag and remove alert
                this._audioVideo.isAudio = true;
                this.alertsToRemove.push(alertObj.hashKey);
            }
        }
    }

    _checkVideo(videoDataRate, input) {
        let alertObj = new diagnosticsAlerts.NoVideoSignalAlert(this._entryId, input);
        if (!videoDataRate) {
            if (this._audioVideo.isVideo) {
                // Video data stopped arriving. Shutdown flag and report alert.
                this._audioVideo.isVideo = false;
                this.alertsToSend.push(alertObj);
                this._logger.info(alertObj.msg);
            }
        }
        else {
            if (!this._audioVideo.isVideo) {
                // Video data resumed. Raise flag and remove alert
                this._audioVideo.isVideo = true;
                this.alertsToRemove.push(alertObj.hashKey);
            }
        }
    }

    _checkAudioVideoSignals(audioDataRate, videoDataRate, input) {
        // Audio and video check occur every window size
        let currTime = new Date();
        if (!this._audioVideo.lastChecked.has(input)) {
            this._audioVideo.lastChecked.set(input, 0);
        }
        if (currTime - this._audioVideo.lastChecked.get(input) > this._alertsWindowSizeInMSec) {
            this._checkAudio(audioDataRate, input);
            this._checkVideo(videoDataRate, input);
            this._audioVideo.lastChecked.set(input, currTime);
        }
    }

    _checkIncomingBitrate(incomingBitrate, configuredBitrate, input) {
        if (configuredBitrate && incomingBitrate) {
            let alertObj = new diagnosticsAlerts.BitrateUnmatchedAlert(this._entryId, Math.round(configuredBitrate), Math.round(incomingBitrate), input);
            let percentageDiff = Math.abs((1 - incomingBitrate / configuredBitrate) * 100);
            if (percentageDiff > this._bitrateDiffPercentageAllowed) {
                this.alertsToSend.push(alertObj);
                this._logger.info(alertObj.msg);
            }
            else {
                this.alertsToRemove.push(alertObj.hashKey);
            }
        }
    }

    _getConfiguredDatarate(input) {
        let video = input.Encoder.videodatarate ? input.Encoder.videodatarate : 0;
        let audio = input.Encoder.audiodatarate ? input.Encoder.audiodatarate : 0;
        return Number(audio) + Number(video);
    }

    _updatePtsArray(ptsStruct) {
        // Push in array the most recent pts data received and clear all the ones that exceed window size
        this._ptsDataHistory.push(ptsStruct);
        while (this._ptsDataHistory.length > 1) {
            if ((this._ptsDataHistory[this._ptsDataHistory.length - 1].clock - this._ptsDataHistory[0].clock) <= ptsWindowSize)
                break;
            this._ptsDataHistory.shift();
        }
    }

    _buildPtsObj(clock, ptsInfo) {
        let getData = (data) => {
            return  {
                refClock : data[0],
                refPts : data[1],
                lastPts : data[2],
                clock: clock
            }
        };

        return {
            clock: clock,
            video: getData(ptsInfo[0]),
            audio: getData(ptsInfo[1])
        }
    }

    _calculatePtsDrift(obj, type) {
        let first = this._ptsDataHistory[0];
        let last = this._ptsDataHistory[this._ptsDataHistory.length - 1];

        let absPtsFirst = first[type].refClock - first[type].refPts + first[type].lastPts;
        let absPtsLast = last[type].refClock - last[type].refPts + last[type].lastPts;

        // If array contains only 1 object return a 0 drift and;
        let ptsDrift = (last.clock !== first.clock) ? ((absPtsLast - absPtsFirst) / (last.clock - first.clock)) : 1;

        obj[type] = {
            drift: ptsDrift,
            first: first[type],
            last: last[type]
        };

        return Math.abs(ptsDrift - 1) > (ptsPercentageDifference / 100);
    }

    _checkPtsSynchronization(clock, ptsInfo, input) {
        let alertArgs = {};
        this._updatePtsArray(this._buildPtsObj(clock, ptsInfo));

        // Perform drift check only if video exists
        if (this._audioVideo.isVideo) {
            let videoPtsDrift = this._calculatePtsDrift(alertArgs, 'video');

            let alertObj = new diagnosticsAlerts.PtsDriftAlert(this._entryId, alertArgs, input);
            if (videoPtsDrift) {
                this.alertsToSend.push(alertObj);
                this._logger.info(alertObj.msg);
            }
            else {
                this.alertsToRemove.push(alertObj.hashKey);
            }
        }
    }

    _checkInvalidKeyFrameInterval(flavorsArray) {
        // Go over all flavors and return the first one that has an invalid key frame interval
        let invalidKeyFrameFlavor = _.find(flavorsArray, f => {
            return Math.abs(keyFrameIntervalExpected - f.mediaInfo.keyFrameDistance) > keyFrameIntervalDiffAllowed
        });

        if (invalidKeyFrameFlavor) {
            let alertObj = new diagnosticsAlerts.InvalidKeyFrameIntervalAlert(invalidKeyFrameFlavor.name, invalidKeyFrameFlavor.mediaInfo.lastChunkName, keyFrameIntervalExpected / 1000, Math.round(invalidKeyFrameFlavor.mediaInfo.keyFrameDistance) / 1000);
            this._logger.info(alertObj.msg);
            this.alertsToSend.push(alertObj);
        }
        else {
            this.alertsToRemove.push(DiagnosticsErrorCodes.InvalidKeyFrameIntervalAlert + '_1');
        }
    }

    _checkFramesPerSecondRate(flavorsArray) {
        // Go over all flavors and return the first one that its FPS rate is too high
        let highFpsFlavor = _.find(flavorsArray, f => {
            return f.mediaInfo.framerate > maxFramesPerSeconds
        });

        if (highFpsFlavor) {
            let alertObj = new diagnosticsAlerts.HighFpsRateAlert(highFpsFlavor.name, highFpsFlavor.mediaInfo.lastChunkName, highFpsFlavor.mediaInfo.framerate);
            this._logger.info(alertObj.msg);
            this.alertsToSend.push(alertObj);
        }
        else {
            this.alertsToRemove.push(DiagnosticsErrorCodes.HighFpsRateAlert + '_1');
        }
    }

    _checkBackupStreamOnlyAlert(serverType, redundancy, recordingEnabled) {
        let alertObj;
        if (recordingEnabled) {
            alertObj = new diagnosticsAlerts.BackupOnlyStreamRecordingAlert(this._entryId);
        }
        else {
            alertObj = new diagnosticsAlerts.BackupOnlyStreamNoRecordingAlert(this._entryId);
        }

        if (!redundancy && (serverType === kalturaTypes.KalturaEntryServerNodeType.LIVE_BACKUP)) {
            this._logger.info(alertObj.msg);
            this.alertsToSend.push(alertObj);
        }
        else {
            this.alertsToRemove.push(alertObj.hashKey);
        }
    }

    // Test out all alerts checkups - Restart, audio only, video only, bitrate unmatched
    runFullDiagnosticsAnalysis(diagnosticsObj, entryObject) {
        try {
            this._logger.debug(`Starting full diagnostics analysis`);
            // Clear the array before performing diagnosis
            this.alertsToSend.length = 0;
            this.alertsToRemove.length = 0;
            let sourceStreamInfo = diagnosticsObj.source;

            this._checkBackupStreamOnlyAlert(entryObject.serverType, entryObject.isRedundancy, entryObject.recordStatus !== kalturaTypes.KalturaRecordStatus.DISABLED);

            _.each(sourceStreamInfo.inputs, (input, index)=> {
                let indexNum = Number.parseInt(index);
                if (input.Properties) {
                    this._hasEntryRestarted(input.Properties.timeRunningSeconds, indexNum);
                }
                if (input.Encoder) {
                    this._checkAudioVideoSignals(input.Encoder.audiodatarate, input.Encoder.videodatarate, indexNum);
                    if (input.IOPerformance) {
                        this._checkIncomingBitrate(input.IOPerformance.bitrate, this._getConfiguredDatarate(sourceStreamInfo.inputs[index]), indexNum);
                    }
                    if (input.Encoder.syncPTSData) {
                        this._checkPtsSynchronization(sourceStreamInfo.currentTime, input.Encoder.syncPTSData, indexNum);
                    }
                }
            });

            if (diagnosticsObj.flavors && diagnosticsObj.flavors.length) {
                this._checkInvalidKeyFrameInterval(diagnosticsObj.flavors);
                this._checkFramesPerSecondRate(diagnosticsObj.flavors);
            }

            let eventParameter = {};
            if (this.alertsToSend.length) {
                eventParameter.report = this.alertsToSend;
            }
            if (this.alertsToRemove.length) {
                eventParameter.remove = this.alertsToRemove;
            }

            if (eventParameter) {
                this.emit('updateBeacons', eventParameter);
            }
        }
        catch (error) {
            this._logger.error("runFullDiagnosticsAnalysis failed: %s", ErrorUtils.error2string(error));
        }
    }
}

module.exports = DiagnosticsAnalyzer;