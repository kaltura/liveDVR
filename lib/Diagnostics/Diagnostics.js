/**
 * Created by gadyaari on 25/09/2016.
 */

const config = require('../../common/Configuration');
const loggerModule = require('../../common/logger');
const ErrorUtils = require('./../utils/error-utils');
const BackendClient = require('../BackendClientFactory.js').getBackendClient();
const DiagnosticsAlertsAnalyzer = require('./DiagnosticsAlertsAnalyzer');
const diagAlertsErrorCodes = require('./DiagnosticsAlerts').DiagnosticsErrorCodes;
const _ = require('underscore');
const Q = require('q');
const EventEmitter = require('events');

/********************************************************************/
/* Diagnostics holds two types of data structures:
    1) An object called StaticMetaData combined of a data object and
    a boolean flag for the class to know if data needs to be updated
    to server.
    StaticMetaData = {
        modified: false
        data: {},
    }
    2) An object called DynamicMetaData containing two arrays.
    Dynamic object is sent to server regularly
    DynamicMetaData = {
        inputs: [],
        flavors: []
    }
 */
/********************************************************************/

const StreamHealth = {
  Good: 'GOOD',
  Fair: 'FAIR',
  Bad: 'Bad'
};

class Diagnostics extends EventEmitter {
    constructor(entryId) {
        super();
        this._logger = loggerModule.getLogger("Diagnostics", `[${entryId}] `);
        this._reportIntervalTimeInMSec = config.get('diagnostics').diagnosticsReportIntervalRunTimeInSec *1000;
        this.alertWindowSizeInMSec = config.get('diagnostics').errorsWindowSizeInMin * 60 * 1000;

        this.staticMetaData = { modified: false };
        this.dynamicMetaData = { inputs: [], flavors: [] };
        this.alerts = {
            streamHealth: StreamHealth.Good,
            internalAlerts: [],
            externalAlerts: new Map()
        };
        this._initAlertsAnalyzer.call(this, entryId);

        // this._internalAlerts = [];
        // this._externalAlerts = new Map();
        this._runDiagnosticsReport.call(this);
    }

    toJSON() {
        return { "internalAlerts" : this.alerts.internalAlerts, "externalAlerts" : Array.from(this.alerts.externalAlerts) };
    }

    _initAlertsAnalyzer(entryId) {
        this._diagnosticsAnalyzer = new DiagnosticsAlertsAnalyzer(entryId, this.alertWindowSizeInMSec);
        // Enlist on events
        this._diagnosticsAnalyzer.on('insertAlert', this.insertAlert.bind(this));
        this._diagnosticsAnalyzer.on('removeAlert', this.removeAlert.bind(this));
    }

    insertAlert(diagnosticsAlertObj) {
        if (diagnosticsAlertObj.hashKey) {
            this.alerts.externalAlerts.set(diagnosticsAlertObj.hashKey, diagnosticsAlertObj);
        }
        else {
            this.alerts.internalAlerts.push(diagnosticsAlertObj);
        }
        this._logger.debug('insertAlert. Alert: %s', diagnosticsAlertObj.name);
    }

    removeAlert(key) {
        // If hasKey is for an alert of type 'EntryRestartedAlert' && alert exists
        // (Only alert of type EntryRestartedAlert will have hashKey '100_')
        if (key.includes(diagAlertsErrorCodes.EntryRestartedAlert + '_') &&
            this.alerts.externalAlerts.has(key)) {
            let currAlert = this.alerts.externalAlerts.get(key);
            if (new Date() - currAlert.time > this.alertsWindowSizeInMSec) {
                this.alerts.externalAlerts.delete(key);
            }
        }
        else {
            // Remove alert from both alerts array and unique alerts map
            this.alerts.externalAlerts.delete(key);
        }
    }

    _cleanAlerts() {
        try {
            let currTime = new Date();
            while (this.alerts.internalAlerts.length > 0) {
                // Only keep alerts from the past hour
                if (currTime - this.alerts.internalAlerts[0].time < this.alertWindowSizeInMSec) {
                    break;
                }
                this.alerts.internalAlerts.shift();
            }
        }
        catch (error) {
            this._logger.warn("Error clearing Diagnostics Alerts List: %s", ErrorUtils.error2string(error));
        }
    }

    _updateStreamHealthIn(alertObj) {
        switch (this.alerts.streamHealth) {
            case StreamHealth.Good:

                break;
            case StreamHealth.Fair:
                break;
            case StreamHealth.Bad:
                break;
            default:
                this._logger.warn('Stream-Health is NOT one of three possible states: GOOD / FAIR / BAD!');
        }
    }

    _updateStreamHealthOut(alertObj) {

    }

    _handle

    _runDiagnosticsReport() {
        return Q.fcall(() => {
            // If staticInfo is modified -> update server beacon
            this._logger.debug('Starting Diagnostic report process');
            if (this.staticMetaData.modified) {
                this._logger.info('Entry static information has been modified. Reporting beacon to server');
                return BackendClient.sendBeacon(this.staticMetaData.data);
            }
        })
        .then(() => {
            // Update dynamic info in every iteration
            this._logger.info('Sending dynamic data to server');
            BackendClient.sendBeacon(this.dynamicMetaData);
        })
        .then(() => {
            // Clean alerts that are past the window size
            this._cleanAlerts();
        })
        .finally(() => {
            setTimeout(this._runDiagnosticsReport.bind(this), this._reportIntervalTimeInMSec);
        });

    }

    handleDiagnosticsReport(metaData) {
        this._diagnosticsAnalyzer.runFullDiagnosticsAnalysis(metaData.source);
        this._setStaticMetaData(metaData);
        this._setDynamicMetaData(metaData);

    }

    _setStaticMetaData(metaData) {
        // There are 3 scenarios where we would send the static data to server:
        // (1) If Diagnostics first receives metaData -> send beacon
        if (!this.staticMetaData.data) {
            this._logger.debug('staticMetadata received!');
            this.staticMetaData.modified = true;
        }
        // (2) If one of the inputs was removed or another has been added -> send beacon
        else if (Object.keys(metaData.source.inputs).length !== Object.keys(this.staticMetaData.data.inputs).length) {
            this._logger.debug('staticMetadata changed! Inputs list size has changed, raising modified flag');
            this.staticMetaData.modified = true;
        }
        else {
            // (3) If an input was changed and now has a different sessionId -> send beacon
            let incomingInputsSessionIds = _.map(metaData.source.inputs, i => i.Properties.Id );
            let cachedInputsSessionIds = _.map(this.staticMetaData.data.inputs, i => i.Properties.Id);
            if (_.difference(incomingInputsSessionIds, cachedInputsSessionIds).length) {
                this._logger.debug(`staticMetadata changed! SessionId is different for one of the inputs, raising modified flag`);
                this.staticMetaData.modified = true;
            }
            else {
                this.staticMetaData.modified = false;
            }
        }

        if (this.staticMetaData.modified) {
            this.staticMetaData.data = { 'inputs': metaData.source.inputs, 'playlistGenerator': metaData.playlistGenerator };
        }
    }

    _setDynamicMetaData(metaData) {
        // Build the dynamicMetaData structure and prepare it for sending
        this._logger.info('dynamicMetaData update');
        _.map(metaData.source.inputs, (input, index) => {
            this.dynamicMetaData.inputs.push({
                'index': index,
                'bitrate': input.IOPerformance.bitrate,
                'ptsData': input.Encoder.syncPTSData
            })
        });
        this.dynamicMetaData.flavors = metaData.flavors;
    }
}

module.exports = Diagnostics;