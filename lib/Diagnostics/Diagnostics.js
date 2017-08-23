/**
 * Created by gadyaari on 25/09/2016.
 */

const config = require('../../common/Configuration');
const loggerModule = require('../../common/logger');
const PromUtils = require('../utils/promise-utils');
const ErrorUtils = require('./../utils/error-utils');
const BackendClient = require('../BackendClientFactory.js').getBackendClient();
const DiagnosticsAnalyzer = require('./DiagnosticsAnalyzer');
const StreamHealth = require('./DiagnosticsAlerts').StreamHealth;
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
        this._diagnosticsAnalyzer = new DiagnosticsAnalyzer(entryId, this.alertWindowSizeInMSec);
        // Enlist on event
        this._diagnosticsAnalyzer.on('updateBeacons', this.updateBeacons.bind(this));
    }

    cleanup() {
        this._logger.debug('Stopping diagnostics module');
        this._shouldRun = false;
        return this._diagnosticsEnd.promise
            .then(()=> {
                this._logger.debug('Diagnostics Module stopped');
            })
    }

    insertAlert(alertObj) {
        this._logger.debug(`[insertAlert] Alert: ${alertObj.name}`);
        this._internalAlerts.push(alertObj);
    }

    _cleanAlerts() {
        try {
            // Clean internal alerts array
            let currTime = new Date();
            while (this._internalAlerts.length > 0) {
                // Only keep alerts from the past hour
                if (currTime - this._internalAlerts[0].time < this.alertWindowSizeInMSec) {
                    break;
                }
                this._internalAlerts.shift();
            }

            // Clean reported alerts that are sent from playlistGenerator and are not removed by it
            let alertToRemove = [];
            this.reportedAlerts.forEach(a => {
                if ((a.isTimed) && (new Date() - a.time > this.alertWindowSizeInMSec)) {
                    this._logger.debug(`Alert [${a.name}] exceeds window time frame; removing it form map`);
                    alertToRemove.push(a.hashKey);
                }
            });
            if (alertToRemove.length) {
                this.updateBeacons({ remove: alertToRemove });
            }
        }
        catch (error) {
            this._logger.warn("Error clearing Diagnostics Alerts List: %s", ErrorUtils.error2string(error));
        }
    }

    updateBeacons(beaconsModificationObj) {
        let isReported = false;
        let isRemoved = false;

        if (beaconsModificationObj.report) {
            isReported = true;
            this._reportBeacon(beaconsModificationObj.report);
        }
        if (beaconsModificationObj.remove) {
            // Only if an alert was actually removed from map, update beacon
            isRemoved = this._removeBeacon(beaconsModificationObj.remove);
        }

        if (isReported || isRemoved) {
            return this._updateStreamHealth.call(this)
                .then(() => {
                    this._logger.debug('Beacons updated and sent to server');
                })
        }
    }

    _reportBeacon(alertObj) {
        // Since method is invoked from multiple places we need to distinguish whether we get an array of
        // alerts (from DiagnosticsAnalyzer) or single objects (from PlaylistGenerator)
        if (Array.isArray(alertObj)) {
            alertObj.forEach(a => {
                this._logger.debug(`[reportBeacon] Alert: ${a.name}`);
                this.reportedAlerts.set(a.hashKey, a);
            })
        }
        else {
            this._logger.debug(`[reportBeacon] Alert: ${alertObj.name}`);
            this.reportedAlerts.set(alertObj.hashKey, alertObj);
        }

    }

    _removeBeacon(keysArray) {
        let deleteResult = false;
        keysArray.forEach(key => {
            let removedAlert = this.reportedAlerts.get(key);
            // It's enough that only one alert was removed to check streamHealth again and send beacon
            deleteResult = deleteResult || this.reportedAlerts.delete(key);

            if (removedAlert) {
                this._logger.debug(`[removeAlert] Alert: ${removedAlert.name}`);
            }
        });

        return deleteResult;
    }

    _updateStreamHealth() {
        return Q.fcall(()=> {
            let streamHealth = StreamHealth.Good;
            if (this.reportedAlerts.length) {
                let isPoor = false;
                let isFair = false;
                _.forEach(this.reportedAlerts, a => {
                    if (a.health === StreamHealth.Poor) {
                        isPoor = true;
                    }
                    else if (a.health === StreamHealth.Fair) {
                        isFair = true;
                    }
                });

                if (isPoor) streamHealth = StreamHealth.Poor;
                else if (isFair) streamHealth = StreamHealth.Fair;
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