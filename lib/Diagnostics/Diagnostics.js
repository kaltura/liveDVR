/**
 * Created by gadyaari on 25/09/2016.
 */

var config = require('../../common/Configuration');
var loggerModule = require('../../common/logger');
var ErrorUtils = require('./../utils/error-utils');

class Diagnostics {
    constructor(loggerInfo) {
        this.alertWindowSizeInMSec = config.get('diagnostics').errorsWindowSizeInMin * 60 * 1000;
        this._devAlerts = [];
        this._customerAlerts = new Map();
        this._logger = loggerModule.getLogger("Diagnostics", `[${loggerInfo}] `);
        this.clearOldAlerts.call(this);
    }

    toJSON() {
        return { "flavorAlerts" : this._devAlerts, "entryAlerts" : Array.from(this._customerAlerts) };
    }
    
    pushAlert(diagnosticsAlertObj) {
        if (diagnosticsAlertObj.hashKey) {
            this._customerAlerts.set(diagnosticsAlertObj.hashKey, diagnosticsAlertObj);
        }
        else {
            this._devAlerts.push(diagnosticsAlertObj);
        }
        this._logger.debug('pushAlert. Alert: %s', diagnosticsAlertObj.name);
    }

    clearOldAlerts() {
        let that = this;
        try {
            let currTime = new Date();
            while (this._devAlerts.length > 0) {
                // Only keep alerts from the past hour
                if (currTime - this._devAlerts[0].time < this.alertWindowSizeInMSec) {
                    break;
                }
                this._devAlerts.shift();
            }
        }
        catch (error) {
            this._logger.warn("Error clearing Diagnostics Alerts List: %s", ErrorUtils.error2string(error));
        }
        setTimeout(that.clearOldAlerts.bind(that), this.alertWindowSizeInMSec);
    }

    removeAlert(key) {
        if (this._customerAlerts.has(key)) {
            // Remove alert from both alerts array and unique alerts map
            this._customerAlerts.delete(key);
        }
    }
}

module.exports = Diagnostics;