/**
 * Created by gadyaari on 25/09/2016.
 */

const config = require('../../common/Configuration');
const loggerModule = require('../../common/logger');
const PromUtils = require('../utils/promise-utils');
const ErrorUtils = require('./../utils/error-utils');
const BackendClient = require('../BackendClientFactory.js').getBackendClient();
const DiagnosticsAlertsAnalyzer = require('./DiagnosticsAlertsAnalyzer');
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
    constructor(entryObject) {
        super();
        this.entryId = entryObject.entryId;
        this.partnerId = entryObject.partnerId;
        this._diagnosticsEnd = Q.defer();
        this._shouldRun = true;
        this._logger = loggerModule.getLogger("Diagnostics", `[${entryObject.entryId}] `);
        this._syncPromise = new PromUtils.SynchornizedPromises(this._logger);
        this._reportIntervalTimeInMSec = config.get('diagnostics').diagnosticsReportIntervalRunTimeInSec *1000;
        this.alertWindowSizeInMSec = config.get('diagnostics').errorsWindowSizeInMin * 60 * 1000;
        this.lastDiagnosticsObjTime = 0;
        this.staticMetaData = { modified: false };
        this.dynamicMetaData = { inputs: [], flavors: [] };
        this.reportedAlerts = new Map();
        this._initAlertsAnalyzer.call(this, entryObject.entryId);

        this._internalAlerts = [];
        this._runDiagnosticsReport.call(this);
    }

    toJSON() {
        return { "internalAlerts" : this._internalAlerts, "reportedAlerts" : Array.from(this.reportedAlerts) };
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
        this._logger.debug(`[insertAlert] Alert: ${diagnosticsAlertObj.name}`);
        if (diagnosticsAlertObj.hashKey) {
            this.reportedAlerts.set(diagnosticsAlertObj.hashKey, diagnosticsAlertObj);
            return this._updateStreamHealth.call(this)
                .then(()=> {
                    this._logger.debug('Alert inserted to map and sent to server');
                })
        }
        else {
            this._internalAlerts.push(diagnosticsAlertObj);
        }
    }

    removeAlert(key) {
        let deleteResult = false;
        let currAlert = this.reportedAlerts.get(key);
        if (currAlert && currAlert.isTimed) {
            if (new Date() - currAlert.time > this.alertsWindowSizeInMSec) {
                deleteResult = this.reportedAlerts.delete(key);
            }
        }
        else {
            // Remove alert from both alerts array and unique alerts map
            deleteResult = this.reportedAlerts.delete(key);
        }
        // Only if an alert was actually removed from map, update beacon. If
        if (deleteResult) {
            this._logger.debug(`[removeAlert] Alert: ${deleteResult.name}`);
            return this._updateStreamHealth.call(this)
                .then(()=> {
                    this._logger.debug('Alert removed from map and sent to server');
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
            let streamHealth = StreamHealth.Good;
            if (this.reportedAlerts.length) {
                let maxSeverity = _.max(this.reportedAlerts, (a) => {
                    return a.severity;
                });
                switch (maxSeverity) {
                    case AlertsSeverity.error:
                    case AlertsSeverity.critical:
                        streamHealth = StreamHealth.Poor;
                        return;
                    case AlertsSeverity.warning:
                        streamHealth = StreamHealth.Fair;
                        return;
                    case AlertsSeverity.debug:
                    case AlertsSeverity.info:
                    default:
                        streamHealth = StreamHealth.Good;
                        return;
                }
            }

            return streamHealth;
        })
        .then((result)=> {
            return this._syncPromise.exec(()=> {
                this._logger.debug('Sending [healthData] beacon. Stream Health: [result]');
                let data = {
                    streamHealth: result,
                    alerts: [...this.reportedAlerts]
                };
                return BackendClient.sendBeacon(this.entryId, this.partnerId, data, 'healthData');
            });
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
                return BackendClient.sendBeacon(this.entryId, this.partnerId, this.staticMetaData.data, 'staticData')
                    .then(()=> {
                        this.staticMetaData.modified = false;
                    });
            }
        })
        .then(() => {
            // Update dynamic info in every iteration
            if (this.dynamicMetaData.flavors.length) {
                this._logger.info('Sending [dynamicData] beacon');
                return BackendClient.sendBeacon(this.entryId, this.partnerId, this.dynamicMetaData, 'dynamicData');
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
        // Check should be performed only when diagnostics object is updated
        if (this.lastDiagnosticsObjTime === metaData.source.currentTime)
            return;

        this._diagnosticsAnalyzer.runFullDiagnosticsAnalysis(metaData.source);
        this._setStaticMetaData(metaData);
        this._setDynamicMetaData(metaData);

        this.lastDiagnosticsObjTime = metaData.source.currentTime;
    }

    _setStaticMetaData(metaData) {
        // There are 3 scenarios where we would send the static data to server:
        // (1) If Diagnostics first receives metaData -> send beacon
        // (2) If one of the inputs was removed or another has been added -> send beacon
        // (3) If an input was changed and now has a different sessionId -> send beacon
        let tempStaticData = JSON.parse(JSON.stringify({ 'inputs': metaData.source.inputs, 'playlistGenerator': metaData.playlistGenerator }));
        _.each(tempStaticData.inputs, i => {
           delete i.IOPerformance;
           delete i.Encoder.syncPTSData;
           delete i.Properties.timeRunningSeconds;
        });

        if (!this.staticMetaData.data) {
            this._logger.debug('staticMetadata received!');
            this.staticMetaData.modified = true;
        }
        else {
            if (!_.isEqual(tempStaticData, this.staticMetaData.data)) {
                this._logger.debug('staticMetadata changed! Raising modified flag');
                this.staticMetaData.modified = true;
            }
        }

        if (this.staticMetaData.modified) {
            this.staticMetaData.data = tempStaticData;
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