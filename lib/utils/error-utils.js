/**
 * Created by AsherS on 9/2/15.
 */

var _ = require('underscore');

var ErrorUtils = (function(){

    var obj = {};

    obj.error2string=function (err) {
        return _.isObject(err) ? "Message: " + err.message + "; Stack: " + err.stack : err;
    };
    obj.aggregateErrors = function(promises) {

        var msg = "";
        var numErrors = 0;

        _.chain(promises)
            .filter(function(p) {
                return p.state === "rejected";
            }).forEach(function (rejectedPromise) {
                numErrors += 1;
                var reason = rejectedPromise.reason;
                if (reason instanceof Error) {
                    msg += "Error " + numErrors + ": " + reason.message + " Stacktrace:\n" + reason.stack + "\n";
                }
                else {
                    msg += "Error " + numErrors + ": " + reason + '\n';
                }
            });

        var retVal = {
            numErrors: numErrors
        };
        if (numErrors > 0) {
            retVal.err = new Error(msg);
        }
        return retVal;
    };
    return obj;
})();

module.exports = ErrorUtils;

