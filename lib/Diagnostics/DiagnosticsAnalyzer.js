/**
 * Created by gadyaari on 09/01/2017.
 */

const loggerModule = require('../../common/logger');
const diagnosticsAlerts = require('./DiagnosticsAlerts');
const config = require('../../common/Configuration');
const ErrorUtils = require('./../utils/error-utils');
const _ = require('underscore');
const EventEmitter = require('events');
const ptsWindowSize = config.get('diagnostics').ptsRollingWindowSizeInSec * 1000;
const ptsPercentageDifference = config.get('diagnostics').ptsDiffPercentageAllowed;

class EntryDiagnostics extends EventEmitter{
    constructor(entryId, alertsWindowSize) {
        super();
        this._entryId = entryId;
        this._logger = loggerModule.getLogger('EntryDiagnostics', '[' + entryId + '] ');
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
        let alertObj = new diagnosticsAlerts.NoAudioSignal(this._entryId, input);
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
        let alertObj = new diagnosticsAlerts.NoVideoSignal(this._entryId, input);
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
            let alertObj = new diagnosticsAlerts.BitrateUnmatched(this._entryId, configuredBitrate, incomingBitrate, input);
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

    _checkPtsSynchronization(clock, ptsInfo, input) {
        let alertArgs = {};
        this._updatePtsArray(this._buildPtsObj(clock, ptsInfo));

        let videoPtsDrift = this._calculatePtsDrift(alertArgs, 'video');
        let audioPtsDrift = this._calculatePtsDrift(alertArgs, 'audio');

        let alertObj = new diagnosticsAlerts.PtsDrift(this._entryId, alertArgs, input);
        if (videoPtsDrift || audioPtsDrift) {
            this.alertsToSend.push(alertObj);
            this._logger.info(alertObj.msg);
        }
        else {
            this.alertsToRemove.push(alertObj.hashKey);
        }
    }

    // Test out all alerts checkups - Restart, audio only, video only, bitrate unmatched
    runFullDiagnosticsAnalysis(diagObj) {
        try {
            // Clear the array before performing diagnosis
            this.alertsToSend.length = 0;
            this.alertsToRemove.length = 0;
            _.each(diagObj.inputs, (input, index)=> {
                if (input.Properties) {
                    this._hasEntryRestarted(input.Properties.timeRunningSeconds, index);
                }
                if (input.Encoder) {
                    this._checkAudioVideoSignals(input.Encoder.audiodatarate, input.Encoder.videodatarate, index);
                    if (input.IOPerformance) {
                        this._checkIncomingBitrate(input.IOPerformance.bitrate, this._getConfiguredDatarate(diagObj.inputs[index]), index);
                    }
                    if (input.Encoder.syncPTSData) {
                        this._checkPtsSynchronization(diagObj.currentTime, input.Encoder.syncPTSData, index);
                    }
                }
            });

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

module.exports = EntryDiagnostics;