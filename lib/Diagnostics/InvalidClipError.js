/**
 * Created by igors on 13/10/2016.
 */
const diagnosticsAlerts =  require('./DiagnosticsAlerts')

class InvalidClipError extends Error {
    constructor(type, fileInfo, other) {
        let alert
        if (type instanceof diagnosticsAlerts.Alert) {
            alert = type;
        } else {
            other = other || [];
            alert = Reflect.construct(type, [fileInfo.flavor, fileInfo.chunkName].concat(other));
        }
        super(alert.msg)
        this._alert = alert;
    }
}

module.exports = InvalidClipError;
