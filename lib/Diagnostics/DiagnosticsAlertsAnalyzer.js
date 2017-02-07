/**
 * Created by gadyaari on 09/01/2017.
 */

var loggerModule = require('../../common/logger');
var diagnosticsAlerts = require('./DiagnosticsAlerts');
var config = require('../../common/Configuration');
var ErrorUtils = require('./../utils/error-utils');
var _ = require('underscore');

class EntryDiagnostics {
    constructor(entryId, diagnosticsModule) {
        this.entryId = entryId;
        this.logger = loggerModule.getLogger('EntryDiagnostics', '[' + entryId + '] ');
        this.bitrateDiffPercentageAllowed = config.get('diagnostics').bitrateDiffPercentageAllowed;
        this.diagnostics = diagnosticsModule;
        this.inputsRunningTime = new Map();
        this.lastAudioVideoCheck = new Map();
        this.lastClock = 0;
        this.ptsData = {
            windowSize : config.get('diagnostics').ptsRollingWindowSizeInMSec,
            percentageDifference : config.get('diagnostics').ptsDiffPercentageAllowed,
            infoArray : []
        };
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
        // Push in array the most recent ptsData received and clear all the ones that exceed window size
        this.ptsData.infoArray.push(ptsStruct);
        while (this.ptsData.infoArray.length > 1) {
            if ((this.ptsData.infoArray[this.ptsData.infoArray.length - 1].clock - this.ptsData.infoArray[0].clock) <= this.ptsData.windowSize)
                break;
            this.ptsData.infoArray.shift();
        }
    }

    getPtsDrift(first, last, type = '') {
        let calcPtsRate = (index)=> {
          let deltaFirst = first.ptsData[index][0] - first.ptsData[index][1] + first.ptsData[index][2];
          let deltaLast = last.ptsData[index][0] - last.ptsData[index][1] + last.ptsData[index][2];

          // If array contains only 1 object return a 0 drift and;
          return (first.clock !== last.clock) ? ((last.clock - first.clock) / (deltaLast - deltaFirst)) : 0;
        };

        let ptsDrift = 0;
        let min = 1 - (this.ptsData.percentageDifference / 100);
        let max = 1 + (this.ptsData.percentageDifference / 100);
        switch (type) {
            case 'video':
                ptsDrift += calcPtsRate(0);
                break;
            case 'audio':
                ptsDrift += calcPtsRate(1);
                break;
            default:
                ptsDrift = 0;
        }
        return {
            driftNum : ptsDrift,
            isAlert : ptsDrift && ((ptsDrift < min) || (ptsDrift > max))
        };
    }

    checkPtsSynchronization(clock, ptsInfo, input) {
        this.updatePtsArray({
            clock : clock,
            ptsData : ptsInfo
        });

        let videoPtsDrift = this.getPtsDrift(this.ptsData.infoArray[0], this.ptsData.infoArray[this.ptsData.infoArray.length - 1], 'video');
        let audioPtsDrift = this.getPtsDrift(this.ptsData.infoArray[0], this.ptsData.infoArray[this.ptsData.infoArray.length - 1], 'audio');

        let alertObj = new diagnosticsAlerts.PtsDrift(this.entryId, videoPtsDrift.driftNum, audioPtsDrift.driftNum, input);
        if (videoPtsDrift.isAlert || audioPtsDrift.isAlert) {
            this.diagnostics.pushAlert(alertObj);
            this.logger.info(alertObj.msg);
        }
        else {
            this.diagnostics.removeAlert(alertObj.hashKey);
        }
        this.iterator++;
    }

    // Test out all alerts checkups - Restart, audio only, video only, bitrate unmatched
    runFullDiagnosticsAnalysis(diagObj) {
        try {
            // Check should be performed only when object is updated
            if (this.lastClock === diagObj.currentTime)
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
            this.lastClock = diagObj.currentTime;
        }
        catch (error) {
            this.logger.error("runFullDiagnosticsAnalysis failed: %s", ErrorUtils.error2string(error));
        }
    }
}

module.exports = EntryDiagnostics;