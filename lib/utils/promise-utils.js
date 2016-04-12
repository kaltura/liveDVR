/**
 * Created by gadyaari on 07/02/2016.
 */
var logger = require('./../logger/logger')(module);
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
    var defaultTimeOut = 60*1000; //~ 1 minute
    this.exec=function(fn, timeOut) {

        lastApi = lastApi.finally(function() {

            var deferred=Q.defer();
            
            var timeoutHandler= setTimeout(function(){
                deferred.reject();
            }, timeOut ? timeOut : defaultTimeOut);

            fn().then(function (val){
                if (!deferred.isRejected()) {
                    clearTimeout(timeoutHandler);
                    deferred.resolve(val);
                }
                else{
                    logger.warn("Promise is resolve, but after timeout")
                }
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