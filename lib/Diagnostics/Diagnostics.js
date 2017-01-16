/**
 * Created by gadyaari on 25/09/2016.
 */

var config = require('../../common/Configuration');
var loggerModule = require('../../common/logger');
var Q = require('q');


class Diagnostics {
    constructor(loggerInfo) {
        this.alertWindowSizeInMSec = config.get('diagnostics').errorsWindowSizeInMin * 60 * 1000;
        this._alerts = [];
        this._devAlerts = [];
        this._customerAlerts = new Map();
        this._logger = loggerModule.getLogger("Diagnostics", `[${loggerInfo}] `);
        this.clearOldAlerts.call(this);
    }

    toJSON() {
        return this._alerts
    }
    
    pushAlert(diagnosticsAlertObj) {
        if (diagnosticsAlertObj.hashKey) {
            this._customerAlerts.set(diagnosticsAlertObj.hashKey, diagnosticsAlertObj);
        }
        else {
            this._devAlerts.push(diagnosticsAlertObj);
        }
        this._logger.debug('pushAlert. %d alerts', this._devAlerts.length + this._customerAlerts.length);
    }

    clearOldAlerts() {
        let that = this;
        return Q.fcall(()=> {
                let currTime = new Date();
                while (this._devAlerts.length > 0) {
                    // Only keep alerts from the past hour
                    if (currTime - this._devAlerts[0].time < this.alertWindowSizeInMSec) {
                        break;
                    }
                    this._devAlerts.shift();
                }
            })
            .finally(()=> {
                setTimeout(that.clearOldAlerts.bind(that), this.alertWindowSizeInMSec);
            })

    }

    removeAlert(key) {
        if (this._customerAlerts.has(key)) {
            // Remove alert from both alerts array and unique alerts map
            this._customerAlerts.delete(key);
        }
    }

    mergeAlerts() {
        this._alerts = this._devAlerts.concat(Array.from(this._customerAlerts));
    }
}

module.exports = Diagnostics;