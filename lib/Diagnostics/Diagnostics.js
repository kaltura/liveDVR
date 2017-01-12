/**
 * Created by gadyaari on 25/09/2016.
 */

var config = require('../../common/Configuration');
var loggerModule = require('../../common/logger');

class Diagnostics {
    constructor(loggerInfo) {
        this.alertWindowSizeInMSec = config.get('diagnostics').errorsWindowSizeInMin * 60 * 1000;
        this._alerts = [];
        this._uniqueAlertsMapping = new Map();
        this._logger = loggerModule.getLogger("Diagnostics", `[${loggerInfo}] `);
    }

    toJSON() {
        return this._alerts;
    }
    
    pushAlert(diagnosticsAlertObj) {
        // TODO: Maybe move clearOldAlerts to toJSON so will be called only when printing
        this.clearOldAlerts();
        if (diagnosticsAlertObj.unique) {
            this.insertUniqueAlert(diagnosticsAlertObj);
        }
        else {
            this._alerts.push(diagnosticsAlertObj);
        }
        this._logger.debug('pushAlert. %d alerts', this._alerts.length);
    }

    // TODO: Figure out with Guy a way to do it more efficient -> Gad
    clearOldAlerts() {
        let currTime = new Date();

        while (this._alerts.length > 0) {
            // Only keep alerts from the past hour
            if (currTime - this._alerts[0].time < this.alertWindowSizeInMSec) {
                break;
            }
            let removedItem = this._alerts.shift();
            // If alert to be removed is flagged "unique" update the uniqueAlerts Map
            if (removedItem.unique) {
                this._uniqueAlertsMapping.delete(removedItem.errorCode);
            }
            this._uniqueAlertsMapping.forEach((key, value)=> {
               this._uniqueAlertsMapping.set(key, value - 1);
            });
        }
    }

    insertUniqueAlert(alert) {
        // Find if the unique alert exists
        if (this._uniqueAlertsMapping.has(alert.errorCode)) {
            // Unique alert exists. Replace it with the new one.
            let currentAlertIndex = this._uniqueAlertsMapping.get(alert.errorCode);
            this._alerts[currentAlertIndex] = alert;
        }
        else {
            // Add updated Alert
            let length = this._alerts.push(alert);
            // Map the alert in the relevant unique alerts Map
            this._uniqueAlertsMapping.set(alert.errorCode, length - 1);
        }
    }

    removeAlert(code) {
        if (this._uniqueAlertsMapping.has(code)) {
            // Remove alert from both alerts array and unique alerts map
            this._alerts.splice(this._uniqueAlertsMapping.get(code), 1);
            this._uniqueAlertsMapping.delete(code);
        }
    }
}

module.exports = Diagnostics;