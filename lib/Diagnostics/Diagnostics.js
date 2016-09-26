/**
 * Created by gadyaari on 25/09/2016.
 */

var config = require('../../common/Configuration');

function Diagnostics() {
    this.alertWindowSize = config.get('diagnostics').errorsWindowSizeInMSec;
    this._alerts = [];
}

Diagnostics.prototype.toJSON = function() {
    this._alerts.toJSON();
};

Diagnostics.prototype.getAlerts = function() {
    return this._alerts;
};

Diagnostics.prototype.pushAlert = function(diagnosticsAlertObj) {
    checkRollingWindow.call(this);
    this._alerts.push(diagnosticsAlertObj);
};

function checkRollingWindow() {
    let currTime = new Date();

    while (this._alerts.length > 0) {
        // Only keep alerts from the past hour
        if (currTime - this._alerts[0].time < this.alertWindowSize) {
            break;
        }
        this.alerts.pop();
    }
}

module.exports = Diagnostics;