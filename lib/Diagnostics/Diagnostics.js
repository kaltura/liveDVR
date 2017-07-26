/**
 * Created by gadyaari on 25/09/2016.
 */

const config = require('../../common/Configuration');
const loggerModule = require('../../common/logger');
const ErrorUtils = require('./../utils/error-utils');
const BackendClient = require('../BackendClientFactory.js').getBackendClient();
const DiagnosticsAlertsAnalyzer = require('./DiagnosticsAlertsAnalyzer');
const _ = require('underscore');

class Diagnostics {
    constructor(entryId) {
        this._logger = loggerModule.getLogger("Diagnostics", `[${entryId}] `);
        this._alertWindowSizeInMSec = config.get('diagnostics').errorsWindowSizeInMin * 60 * 1000;
        this._reportIntervalTimeInMSec = config.get('diagnostics').diagnosticsReportIntervalRunTimeInSec *60 *1000;
        this.staticMetaData = { modified : false };
        this.dynamicMetaData = {};
        // TODO: Move alert alaysis to rin from here and remove it from liveEntry
        this._diagnosticsAnalyzer = new DiagnosticsAlertsAnalyzer(this.entryId);
        this._internalAlerts = [];
        this._externalAlerts = new Map();
        this._runDiagnosticsReport.call(this);
    }

    toJSON() {
        return { "internalAlerts" : this._internalAlerts, "externalAlerts" : Array.from(this._externalAlerts) };
    }
    
    pushAlert(diagnosticsAlertObj) {
        if (diagnosticsAlertObj.hashKey) {
            this._externalAlerts.set(diagnosticsAlertObj.hashKey, diagnosticsAlertObj);
        }
        else {
            this._internalAlerts.push(diagnosticsAlertObj);
        }
        this._logger.debug('pushAlert. Alert: %s', diagnosticsAlertObj.name);
    }

    removeAlert(key) {
        // Remove alert from both alerts array and unique alerts map
        this._externalAlerts.delete(key);
    }

    _cleanAlerts() {
        try {
            let currTime = new Date();
            while (this._internalAlerts.length > 0) {
                // Only keep alerts from the past hour
                if (currTime - this._internalAlerts[0].time < this._alertWindowSizeInMSec) {
                    break;
                }
                this._internalAlerts.shift();
            }
        }
        catch (error) {
            this._logger.warn("Error clearing Diagnostics Alerts List: %s", ErrorUtils.error2string(error));
        }
    }

    _runFullAlertsAnalysis() {

    }

    _runDiagnosticsReport() {
        // If staticInfo is modified -> update server beacon
        if (this.staticMetaData.modified) {
            this._logger.info('Entry static information has been modified. Reporting beacon to server');
            BackendClient.sendBeacon(this.staticMetaData.data);
        }
        // Clean alerts that are past the window size
        this._cleanAlerts();
        this._runFullAlertsAnalysis();

        setTimeout(this._runDiagnosticsReport.bind(this), this._reportIntervalTimeInMSec);
    }

    handleDiagnosticsReport(metaData) {
        this._setStaticMetaData(metaData);
    }

    _setStaticMetaData(metaData) {
        // If Diagnostics first receives metaData -> send beacon
        if (!this.staticMetaData.data) {
            this._logger.debug('staticMetadata received!');
            this.staticMetaData = {
                modified : true,
                data : { 'inputs': metaData.source.inputs, 'playlistGenerator': metaData.playlistGenerator }
            };
        }
        // If one of the inputs was removed or another has been added -> send beacon
        else if (metaData.source.inputs.length !== this.staticMetaData.data.inputs.length) {
            this._logger.debug('staticMetadata changed! Inputs list size has changed, raising modified flag');
            this.staticMetaData = {
                modified : true,
                data : { 'inputs': metaData.source.inputs, 'playlistGenerator': metaData.playlistGenerator }
            };
        }
        else {
            let inputsSessionIds = _.map(metaData.source.inputs, i => {
                return i.Properties.Id;
            });
            // If an input was changed and now has a different sessionId -> send beacon
            let x = _.find(this.staticMetaData.data.inputs, (i, index) => {
                return i.Properties.Id !== inputsSessionIds[index]
            });
            if (x) {
                this._logger.debug(`staticMetadata changed! SessionId is different for one of the inputs, raising modified flag`);
                this.staticMetaData = {
                    modified : true,
                    data : { 'inputs': metaData.source.inputs, 'playlistGenerator': metaData.playlistGenerator }
                };
            }
            else {
                this.staticMetaData.modified = false;
            }
        }
    }

    _setDynamicMetaData(metaData) {
        let encoderDynamicInfo = _.map(metaData.source.inputs, i => {
        });
        // Update the dynamic diagnostics info of the entry
        this.dynamicMetaData = {

        }
    }
}

module.exports = Diagnostics;