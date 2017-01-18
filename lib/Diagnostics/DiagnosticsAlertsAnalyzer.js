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
        else if (this.diagnostics._customerAlerts.has(alertObj.hashKey)) {
            let currAlert = this.diagnostics._customerAlerts.get(alertObj.hashKey);
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

    // Test out all alerts checkups - Restart, audio only, video only, bitrate unmatched
    runFullDiagnosticsAnalysis(diagObj) {
        try {
            _.each(diagObj.inputs, (input, index)=> {
                if (input.clientProperties) {
                    this.hasEntryRestarted(input.clientProperties.timeRunningSeconds, index);
                }
                if (input.Encoder) {
                    this.checkAudioVideoSignals(input.Encoder.audiodatarate, input.Encoder.videodatarate, index);
                    if (input.IOPerformance) {
                        this.checkIncomingBitrate(input.IOPerformance.bitrate, this.getConfiguredDatarate(diagObj.inputs[index]), index);
                    }
                }
            });
        }
        catch (error) {
            this.logger.error("runFullDiagnosticsAnalysis failed: %s", ErrorUtils.error2string(error));
        }
    }
}

module.exports = EntryDiagnostics;