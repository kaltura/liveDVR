/**
 * Created by gadyaari on 09/01/2017.
 */

var loggerModule = require('../../common/logger');
var diagnosticsAlerts = require('../Diagnostics/DiagnosticsAlerts');
var config = require('../../common/Configuration');

class EntryDiagnostics {
    constructor(entryId, diagnosticsModule) {
        this.entryId = entryId;
        this.logger = loggerModule.getLogger('EntryDiagnostics', '[' + entryId + '] ');
        this.diagnostics = diagnosticsModule;
        this.runningTime = 0;
        this.isCheckedAudioVideo = false;
        this.bitrateDiffPercentageAllowed = config.get('bitrateDiffPercentageAllowed');
    }

    hasEntryRestarted(currRunTime) {
        let lastRunTime = this.runningTime;
        if (lastRunTime > currRunTime) {
            let alertObj = new diagnosticsAlerts.EntryRestartedAlert(this.entryId, currRunTime);
            this.diagnostics.pushAlert(alertObj);
            this.logger.info(alertObj.msg);
        }
        this.runningTime = currRunTime;
    }

    checkAudioVideoSignals(audioDataRate, videodDatarRate) {
        // Audio and video signals test occurs only
        if (!this.isCheckedAudioVideo) {
            if (!audioDataRate) {
                let alertObj = new diagnosticsAlerts.NoAudioSignal(this.entryId);
                this.diagnostics.pushAlert(alertObj);
                this.logger.info(alertObj.msg);
            }
            if (!videodDatarRate) {
                let alertObj = new diagnosticsAlerts.NoVideoSignal(this.entryId);
                this.diagnostics.pushAlert(alertObj);
                this.logger.info(alertObj.msg);
            }
            this.isCheckedAudioVideo = true;
        }
    }

    checkIncomingBitrate(incomingBitrate, configuredBitrate) {
        let alertObj = new diagnosticsAlerts.BitrateUnmatched(this.entryId, configuredBitrate, incomingBitrate);
        let percentageDiff = Math.abs((1 - incomingBitrate/configuredBitrate) * 100);
        if (percentageDiff > this.bitrateDiffPercentageAllowed) {
            this.diagnostics.pushAlert(alertObj);
            this.logger.info(alertObj.msg);
        }
        else {
            this.diagnostics.removeAlert(alertObj.errorCode);
        }
    }

    // Test out all alerts checkups - Restart, audio only, video only, bitrate unmatched
    runFullDiagnosticsAnalysis(diagObj) {
        this.hasEntryRestarted(diagObj.inputs[1].clientProperties.timeRunningSeconds);
        this.checkAudioVideoSignals(diagObj.inputs[1].Encoder.audiodatarate, diagObj.inputs[1].Encoder.videodatarate);
        this.checkIncomingBitrate(diagObj.inputs[1].IOPerformance.bitrate, diagObj.inputs[1].Encoder.videodatarate);
    }
}

module.exports = EntryDiagnostics;