/**
 * Created by gadyaari on 07/02/2016.
 */

var Q = require('q');

function retryPromise(fn, intervalRetry, maxRetries, errorString) {
    //logger.debug("retryPromise");
    return fn().catch(function() { // if it fails
        return Q.delay(intervalRetry) // delay
            // retry with more time
            .then(function(){
                if (maxRetries <= 0) {
                    throw new Error(errorString + " (after "+ maxRetries + " retries)");
                }
                return retryPromise(fn, intervalRetry, maxRetries - 1);
            });
    });
}

function SynchornizedPromises() {
    var lastApi =  Q.resolve();
    var defultTimeOut = 20000; //~ 20 seconds
    this.exec=function(fn, timeOut) {

        lastApi = lastApi.finally(function() {

            var deferred=Q.defer();
            
            var timeoutHandler= setTimeout(function(){
                deferred.reject();
            }, timeOut ? timeOut : defultTimeOut);

            fn().then(function (){
                clearTimeout(timeoutHandler);
                deferred.resolve();
            })

            return deferred.promise;
        });
        return lastApi;
    }

}

module.exports =  {
            retryPromise : retryPromise,
    SynchornizedPromises : SynchornizedPromises
};