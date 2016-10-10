/**
 * Created by gadyaari on 25/09/2016.
 */

var config = require('../../common/Configuration');

class Diagnostics {
    constructor() {
        this.alertWindowSizeInMSec = config.get('diagnostics').errorsWindowSizeInMin * 60 * 1000;
        this._alerts = [];
    }

    toJSON() {
        return this._alerts;
    }
    
    pushAlert(diagnosticsAlertObj) {
        this.clearOldAlerts();
        this._alerts.push(diagnosticsAlertObj);
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
}

module.exports = Diagnostics;