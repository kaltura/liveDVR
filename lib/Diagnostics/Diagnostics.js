/**
 * Created by gadyaari on 25/09/2016.
 */

var config = require('../../common/Configuration');
var loggerModule = require('../../common/logger');
var ErrorUtils = require('./../utils/error-utils');

class Diagnostics {
    constructor(loggerInfo) {
        this.alertWindowSizeInMSec = config.get('diagnostics').errorsWindowSizeInMin * 60 * 1000;
        this._internalAlerts = [];
        this._externalAlerts = new Map();
        this._logger = loggerModule.getLogger("Diagnostics", `[${loggerInfo}] `);
        this.clearOldAlerts.call(this);
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

    clearOldAlerts() {
        let that = this;
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
        setTimeout(that.clearOldAlerts.bind(that), this.alertWindowSizeInMSec);
    }

    removeAlert(key) {
        // Remove alert from both alerts array and unique alerts map
        this._externalAlerts.delete(key);
    }
}

module.exports = Diagnostics;