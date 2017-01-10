/**
 * Created by gadyaari on 25/09/2016.
 */

var config = require('../../common/Configuration');
var loggerModule = require('../../common/logger');
var _ = require('underscore');

class Diagnostics {
    constructor(loggerInfo) {
        this.alertWindowSizeInMSec = config.get('diagnostics').errorsWindowSizeInMin * 60 * 1000;
        this._alerts = [];
        this._logger = loggerModule.getLogger("Diagnostics", `[${loggerInfo}] `);
        this._uniqueAlerts = [101];
    }

    toJSON() {
        return this._alerts;
    }
    
    pushAlert(diagnosticsAlertObj) {
        this.clearOldAlerts();
        if (_.contains(this._uniqueAlerts, diagnosticsAlertObj.errorCode)) {
            this.insertUniqueAlert(diagnosticsAlertObj);
        }
        else {
            this._alerts.push(diagnosticsAlertObj);
        }
        this._logger.debug('pushAlert. %d alerts',this._alerts.length);
    }

    clearOldAlerts() {
        let currTime = new Date();

        while (this._alerts.length > 0) {
            // Only keep alerts from the past hour
            if (currTime - this._alerts[0].time < this.alertWindowSizeInMSec) {
                break;
            }
            this._alerts.shift();
        }
    }

    insertUniqueAlert(alert) {
        // Find if the unique alert exists
        let indexOfCurrAlert = _.findIndex(this._alerts, (a)=> {
            return a.errorCode === alert.errorCode;
        });
        if (indexOfCurrAlert !== -1) {
            // Unique alert exists. Remove it.
            this._alerts.splice(indexOfCurrAlert, 1);
        }
        // Add updated Alert
        this._alerts.push(alert);
    }

    removeAlert(code) {
        let alertIndex = _.indexOf(this._alerts, (a)=> {
            return a.args.errorCode === code;
        });
        this._alerts.splice(alertIndex, 1);
    }
}

module.exports = Diagnostics;