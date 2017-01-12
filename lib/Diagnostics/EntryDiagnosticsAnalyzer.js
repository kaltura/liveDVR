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
        this.diagnostics = diagnosticsModule;
        this.inputsRunningTime = new Map();
        this.bitrateDiffPercentageAllowed = config.get('bitrateDiffPercentageAllowed');
        this.lastAudioVideoCheck = 0;
    }

    hasEntryRestarted(currRunTime, input) {
        if (!this.inputsRunningTime.has(input)) {
            this.inputsRunningTime.set(input, 0);
        }
        try {
            if (this.inputsRunningTime.get(input) > currRunTime) {
                let alertObj = new diagnosticsAlerts.EntryRestartedAlert(this.entryId, currRunTime, input);
                this.diagnostics.pushAlert(alertObj);
                this.logger.info(alertObj.msg);
            }
            this.inputsRunningTime.set(input, currRunTime);
        }
        catch (error) {
            this.logger.error('Error occurred while testing entry restart. %s', ErrorUtils.error2string(error));
        }
    }

    checkAudioVideoSignals(audioDataRate, videodDataRate, input) {
        // Audio and video occur every alerts window size
        let currTime = new Date();
        if (currTime - this.lastAudioVideoCheck > this.diagnostics.alertWindowSizeInMSec) {
            if (!audioDataRate) {
                let alertObj = new diagnosticsAlerts.NoAudioSignal(this.entryId, input);
                this.diagnostics.pushAlert(alertObj);
                this.logger.info(alertObj.msg);
            }
            if (!videodDataRate) {
                let alertObj = new diagnosticsAlerts.NoVideoSignal(this.entryId, input);
                this.diagnostics.pushAlert(alertObj);
                this.logger.info(alertObj.msg);
            }
            this.lastAudioVideoCheck = currTime;
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
                this.diagnostics.removeAlert(alertObj.errorCode);
            }
        }
    }

    getConfiguredDatarate(diagObj) {
        let video = diagObj.inputs[1].Encoder.videodatarate ? diagObj.inputs[1].Encoder.videodatarate : 0;
        let audio = diagObj.inputs[1].Encoder.audiodatarate ? diagObj.inputs[1].Encoder.audiodatarate : 0;
        return Number(audio) + Number(video);
    }

    // Test out all alerts checkups - Restart, audio only, video only, bitrate unmatched
    runFullDiagnosticsAnalysis(diagObj) {
        let index = 1;
        _.each(diagObj.inputs, (input)=> {
            this.hasEntryRestarted(input.clientProperties.timeRunningSeconds, index);
            this.checkAudioVideoSignals(input.Encoder.audiodatarate, diagObj.inputs[1].Encoder.videodatarate, index);
            let x = this.getConfiguredDatarate(diagObj);
            this.checkIncomingBitrate(input.IOPerformance.bitrate, x, index);
            index++
        });
        /*this.hasEntryRestarted(diagObj.inputs[1].clientProperties.timeRunningSeconds);
        this.checkAudioVideoSignals(diagObj.inputs[1].Encoder.audiodatarate, diagObj.inputs[1].Encoder.videodatarate);
        this.checkIncomingBitrate(diagObj.inputs[1].IOPerformance.bitrate, diagObj.inputs[1].Encoder.videodatarate);*/
    }
}

module.exports = EntryDiagnostics;