/**
 * Created by gadyaari on 25/09/2016.
 */

const config = require('../../common/Configuration');
const loggerModule = require('../../common/logger');
const PromUtils = require('../utils/promise-utils');
const ErrorUtils = require('./../utils/error-utils');
const BackendClient = require('../BackendClientFactory.js').getBackendClient();
const DiagnosticsAlertsAnalyzer = require('./DiagnosticsAlertsAnalyzer');
const AlertsErrorCodes = require('./DiagnosticsAlerts').DiagnosticsErrorCodes;
const AlertsSeverity = require('./DiagnosticsAlerts').AlertSeverity;
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
  Good: 'Good',
  Fair: 'Fair',
  Poor: 'Poor'
};

class Diagnostics extends EventEmitter {
    constructor(entryId) {
        super();
        this.entryId = entryId;
        this._diagnosticsEnd = Q.defer();
        this._shouldRun = true;
        this._logger = loggerModule.getLogger("Diagnostics", `[${entryId}] `);
        this._syncPromise = new PromUtils.SynchornizedPromises(this._logger);
        this._reportIntervalTimeInMSec = config.get('diagnostics').diagnosticsReportIntervalRunTimeInSec *1000;
        this.alertWindowSizeInMSec = config.get('diagnostics').errorsWindowSizeInMin * 60 * 1000;

        this.staticMetaData = { modified: false };
        this.dynamicMetaData = { inputs: [], flavors: [] };
        this.alerts = {
            streamHealth: StreamHealth.Good,
            reportedAlerts: new Map()
        };
        this._initAlertsAnalyzer.call(this, entryId);

        this._internalAlerts = [];
        this._runDiagnosticsReport.call(this);
    }

    toJSON() {
        return { "internalAlerts" : this._internalAlerts, "reportedAlerts" : Array.from(this.alerts.reportedAlerts) };
    }

    _initAlertsAnalyzer(entryId) {
        this._diagnosticsAnalyzer = new DiagnosticsAlertsAnalyzer(entryId, this.alertWindowSizeInMSec);
        // Enlist on events
        this._diagnosticsAnalyzer.on('insertAlert', this.insertAlert.bind(this));
        this._diagnosticsAnalyzer.on('removeAlert', this.removeAlert.bind(this));
    }

    cleanup() {
        this._logger.debug('Stopping diagnostics module');
        this._shouldRun = false;
        return this._diagnosticsEnd.promise
            .then(()=> {
                this._logger.debug('Diagnostics Module stopped');
            })
    }

    insertAlert(diagnosticsAlertObj) {
        if (diagnosticsAlertObj.hashKey) {
            this.alerts.reportedAlerts.set(diagnosticsAlertObj.hashKey, diagnosticsAlertObj);
            return this._updateStreamHealth.call(this)
                .then(()=> {
                    return this._syncPromise.exec(()=> {
                        this._logger.debug('Alert inserted to map. Updating [alerts] beacon');
                        return BackendClient.sendBeacon(this.entryId, this.alerts, 'alerts');
                    });
                })
        }
        else {
            this._internalAlerts.push(diagnosticsAlertObj);
        }
        this._logger.debug('insertAlert. Alert: %s', diagnosticsAlertObj.name);
    }

    removeAlert(key) {
        let deleteResult = false;
        // If hasKey is for an alert of type 'EntryRestartedAlert' && alert exists
        // (Only alert of type EntryRestartedAlert will have hashKey '100_')
        if (key.includes(AlertsErrorCodes.EntryRestartedAlert + '_') &&
            this.alerts.reportedAlerts.has(key)) {
            let currAlert = this.alerts.reportedAlerts.get(key);
            if (new Date() - currAlert.time > this.alertsWindowSizeInMSec) {
                deleteResult = this.alerts.reportedAlerts.delete(key);
            }
        }
        else {
            // Remove alert from both alerts array and unique alerts map
            deleteResult = this.alerts.reportedAlerts.delete(key);
        }
        // Only if an alert was actually removed from map, update beacon. If
        if (deleteResult) {
            return this._updateStreamHealth.call(this)
                .then(()=> {
                    return this._syncPromise.exec(()=> {
                        this._logger.debug('Alert removed. Updating [alerts] beacon');
                        return BackendClient.sendBeacon(this.entryId, this.alerts, 'alerts');
                    });
                });
        }
    }

    _cleanAlerts() {
        try {
            let currTime = new Date();
            while (this._internalAlerts.length > 0) {
                // Only keep alerts from the past hour
                if (currTime - this._internalAlerts[0].time < this.alertWindowSizeInMSec) {
                    break;
                }
                this._internalAlerts.shift();
            }
        }
        catch (error) {
            this._logger.warn("Error clearing Diagnostics Alerts List: %s", ErrorUtils.error2string(error));
        }
    }

    _updateStreamHealth() {
        return Q.fcall(()=> {
            if (this.alerts.reportedAlerts.length) {
                let maxSeverity = _.max(this.alerts.reportedAlerts, (a) => {
                    return a.severity;
                });
                switch (maxSeverity) {
                    case AlertsSeverity.error:
                    case AlertsSeverity.critical:
                        this.alerts.streamHealth = StreamHealth.Poor;
                        return;
                    case AlertsSeverity.warning:
                        this.alerts.streamHealth = StreamHealth.Fair;
                        return;
                    case AlertsSeverity.debug:
                    case AlertsSeverity.info:
                    default:
                        this.alerts.streamHealth = StreamHealth.Good;
                        return;
                }
            }
            else {
                this.alerts.streamHealth = StreamHealth.Good;
            }
        });
    }

    _runDiagnosticsReport() {
        if (!this._shouldRun) {
            this._logger.debug('Diagnostics module stopped. Exiting runDiagnosticsReport method');
            this._diagnosticsEnd.resolve();
            return Q.resolve();
        }

        return Q.fcall(() => {
            // If staticInfo is modified -> update server beacon
            this._logger.debug('Starting Diagnostic report process');
            if (this.staticMetaData.modified) {
                this._logger.info('Entry static information has been modified. Reporting [staticData] beacon');
                return BackendClient.sendBeacon(this.entryId, this.staticMetaData.data, 'staticData');
            }
        })
        .then(() => {
            // Update dynamic info in every iteration
            if (this.dynamicMetaData.flavors.length) {
                this._logger.info('Sending [dynamicData] beacon');
                return BackendClient.sendBeacon(this.entryId, this.dynamicMetaData, 'dynamicData');
            }
        })
        .then(() => {
            // Clean alerts that are past the window size
            this._cleanAlerts();
        })
        .finally(() => {
            setTimeout(this._runDiagnosticsReport.bind(this), this._reportIntervalTimeInMSec);
            if (!this._shouldRun) {
                this._diagnosticsEnd.resolve();
            }
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
        this.dynamicMetaData.inputs = _.map(metaData.source.inputs, (input, index) => {
            return {
                'index': index,
                'bitrate': input.IOPerformance.bitrate,
                'ptsData': input.Encoder.syncPTSData
            }
        });
        this.dynamicMetaData.flavors = metaData.flavors;
    }
}

module.exports = Diagnostics;