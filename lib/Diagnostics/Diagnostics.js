/**
 * Created by gadyaari on 25/09/2016.
 */

var config = require('../../common/Configuration');

function checkRollingWindow() {
    let currTime = new Date();

    while (this._alerts.length > 0) {
        // Only keep alerts from the past hour
        if (currTime - this._alerts[0].time < this.alertWindowSize) {
            break;
        }
        this._alerts.pop();
    }
}

class Diagnostics {
    constructor() {
        this.alertWindowSize = config.get('diagnostics').errorsWindowSizeInMSec;
        this._alerts = [];
    }

    toJSON() {
        return this._alerts;
    }
    
    pushAlert(diagnosticsAlertObj) {
        checkRollingWindow.call(this);
        this._alerts.push(diagnosticsAlertObj);
    }
}

module.exports = Diagnostics;