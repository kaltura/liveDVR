/**
 * Created by gadyaari on 09/01/2017.
 */

const loggerModule = require('../../common/logger');
const diagnosticsAlerts = require('./DiagnosticsAlerts');
const config = require('../../common/Configuration');
const ErrorUtils = require('./../utils/error-utils');
const _ = require('underscore');
const ptsWindowSize = config.get('diagnostics').ptsRollingWindowSizeInSec * 1000;
const ptsPercentageDifference = config.get('diagnostics').ptsDiffPercentageAllowed;

class EntryDiagnostics {
    constructor(entryId, diagnosticsModule) {
        this.entryId = entryId;
        this.logger = loggerModule.getLogger('EntryDiagnostics', '[' + entryId + '] ');
        this.bitrateDiffPercentageAllowed = config.get('diagnostics').bitrateDiffPercentageAllowed;
        this.diagnostics = diagnosticsModule;
        this.inputsRunningTime = new Map();
        this.lastAudioVideoCheck = new Map();
        this.lastDiagnosticsRunTime = 0;
        this.ptsDataHistory = [];
    }

    hasEntryRestarted(currRunTime, input) {
        if (!this.inputsRunningTime.has(input)) {
            this.inputsRunningTime.set(input, 0);
        }
        let alertObj = new diagnosticsAlerts.EntryRestartedAlert(this.entryId, currRunTime, input);
        if (this.inputsRunningTime.get(input) > currRunTime) {
            this.diagnostics.pushAlert(alertObj);
            this.logger.info(alertObj.msg);
        }
        else if (this.diagnostics._externalAlerts.has(alertObj.hashKey)) {
            let currAlert = this.diagnostics._externalAlerts.get(alertObj.hashKey);
            let time = new Date();
            if (time - currAlert.time > this.diagnostics.alertWindowSizeInMSec) {
                this.diagnostics.removeAlert(currAlert.hashKey);
            }
        }
        this.inputsRunningTime.set(input, currRunTime);
    }

    checkAudio(audioDataRate, input) {
        let alertObj = new diagnosticsAlerts.NoAudioSignal(this.entryId, input);
        if (!audioDataRate) {
            this.diagnostics.pushAlert(alertObj);
            this.logger.info(alertObj.msg);
        }
        else {
            this.diagnostics.removeAlert(alertObj.hashKey);
        }
    }

    checkVideo(videoDataRate, input) {
        let alertObj = new diagnosticsAlerts.NoVideoSignal(this.entryId, input);
        if (!videoDataRate) {
            this.diagnostics.pushAlert(alertObj);
            this.logger.info(alertObj.msg);
        }
        else {
            this.diagnostics.removeAlert(alertObj.hashKey);
        }
    }

    checkAudioVideoSignals(audioDataRate, videoDataRate, input) {
        // Audio and video occur every window size
        let currTime = new Date();
        if (!this.lastAudioVideoCheck.has(input)) {
            this.lastAudioVideoCheck.set(input, 0);
        }
        if (currTime - this.lastAudioVideoCheck.get(input) > this.diagnostics.alertWindowSizeInMSec) {
            this.checkAudio(audioDataRate, input);
            this.checkVideo(videoDataRate, input);
            this.lastAudioVideoCheck.set(input, currTime);
        }
    }

    checkIncomingBitrate(incomingBitrate, configuredBitrate, input) {
        if (configuredBitrate && incomingBitrate) {
            let alertObj = new diagnosticsAlerts.BitrateUnmatched(this.entryId, configuredBitrate, incomingBitrate, input);
            let percentageDiff = Math.abs((1 - incomingBitrate / configuredBitrate) * 100);
            if (percentageDiff > this.bitrateDiffPercentageAllowed) {
                this.diagnostics.pushAlert(alertObj);
                this.logger.info(alertObj.msg);
            }
            else {
                this.diagnostics.removeAlert(alertObj.hashKey);
            }
        }
    }

    getConfiguredDatarate(input) {
        let video = input.Encoder.videodatarate ? input.Encoder.videodatarate : 0;
        let audio = input.Encoder.audiodatarate ? input.Encoder.audiodatarate : 0;
        return Number(audio) + Number(video);
    }

    updatePtsArray(ptsStruct) {
        // Push in array the most recent pts data received and clear all the ones that exceed window size
        this.ptsDataHistory.push(ptsStruct);
        while (this.ptsDataHistory.length > 1) {
            if ((this.ptsDataHistory[this.ptsDataHistory.length - 1].clock - this.ptsDataHistory[0].clock) <= ptsWindowSize)
                break;
            this.ptsDataHistory.shift();
        }
    }

    calculatePtsDrift(obj, type) {
        let first = this.ptsDataHistory[0];
        let last = this.ptsDataHistory[this.ptsDataHistory.length - 1];

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

    buildPtsObj(clock, ptsInfo) {
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

    checkPtsSynchronization(clock, ptsInfo, input) {
        let alertArgs = {};
        this.updatePtsArray(this.buildPtsObj(clock, ptsInfo));

        let videoPtsDrift = this.calculatePtsDrift(alertArgs, 'video');
        let audioPtsDrift = this.calculatePtsDrift(alertArgs, 'audio');

        let alertObj = new diagnosticsAlerts.PtsDrift(this.entryId, alertArgs, input);
        if (videoPtsDrift || audioPtsDrift) {
            this.diagnostics.pushAlert(alertObj);
            this.logger.info(alertObj.msg);
        }
        else {
            this.diagnostics.removeAlert(alertObj.hashKey);
        }
    }

    // Test out all alerts checkups - Restart, audio only, video only, bitrate unmatched
    runFullDiagnosticsAnalysis(diagObj) {
        try {
            // Check should be performed only when object is updated
            if (this.lastDiagnosticsRunTime === diagObj.currentTime)
                return;
            _.each(diagObj.inputs, (input, index)=> {
                if (input.clientProperties) {
                    this.hasEntryRestarted(input.clientProperties.timeRunningSeconds, index);
                }
                if (input.Encoder) {
                    this.checkAudioVideoSignals(input.Encoder.audiodatarate, input.Encoder.videodatarate, index);
                    if (input.IOPerformance) {
                        this.checkIncomingBitrate(input.IOPerformance.bitrate, this.getConfiguredDatarate(diagObj.inputs[index]), index);
                    }
                    if (input.Encoder.syncPTSData) {
                        this.checkPtsSynchronization(diagObj.currentTime, input.Encoder.syncPTSData, index);
                    }
                }
            });
        }
        catch (error) {
            this.logger.error("runFullDiagnosticsAnalysis failed: %s", ErrorUtils.error2string(error));
        }
        this.lastDiagnosticsRunTime = diagObj.currentTime;
    }
}

module.exports = EntryDiagnostics;