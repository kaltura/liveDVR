/**
 * Created by gadyaari on 07/02/2016.
 */
var Q = require('q');
function retryPromise(fn, intervalRetry, maxRetries, errorString) {
    //logger.debug("retryPromise");
    let retriesLeft = maxRetries
    return fn().catch(function() { // if it fails
        return Q.delay(intervalRetry) // delay
            // retry with more time
            .then(function(){
                if (maxRetries <= 0) {
                    throw new Error(errorString + " (after "+ maxRetries + " retries)");
                }
                return retryPromise(fn, intervalRetry, retriesLeft - 1, errorString);
            });
    });
}

function SynchornizedPromises(logger) {
    var lastApi = Q.resolve();
    this.defaultTimeOut = 20*1000; //~ 20 seconds
    var that = this;
    this.exec=function(fn, timeOut) {

        lastApi = lastApi.catch(function() {
                return Q.resolve();
            }).finally(function() {

                var deferred = Q.defer();

                var timeoutHandler = setTimeout(function() {
                    deferred.reject(new Error("Timeout occurred"));
                }, timeOut ? timeOut : that.defaultTimeOut);

                Q.allSettled([fn()]).then(function(result) {
                    if (!deferred.promise.isRejected()) {
                        clearTimeout(timeoutHandler);
                        if (result[0].state === "fulfilled") {
                            deferred.resolve(result[0].value);
                        }
                        else {
                            deferred.reject(new Error(result[0].reason));
                        }
                    }
                    else {
                        logger.warn("Promise is %j but timeout occurred before.", result[0])
                    }
                });
                return deferred.promise;
            });
        return lastApi;
    }
}

function runningArrayOfPromisesInBlocks(func, blockSize, arrParams) {
    let promiseResults = []
    function callingFunctionAndWaitForDone(startIndex) {
        if (startIndex >= arrParams.length){
            return Q.resolve(promiseResults)
        }
        let lastIndex = startIndex + blockSize;
        if (lastIndex > arrParams.length){
            lastIndex = arrParams.length;
        }
        let arrayOfPromise = [];
        for (var i = startIndex ; i < lastIndex ; i++) {
            let param = arrParams[i];
            arrayOfPromise.push(func(param))
        }
        return Q.allSettled(arrayOfPromise).then((result)=>{
            promiseResults = promiseResults.concat(result);
            return    callingFunctionAndWaitForDone(lastIndex)
        })
    }
    return callingFunctionAndWaitForDone(0)

}

module.exports =  {
    runningArrayOfPromisesInBlocks : runningArrayOfPromisesInBlocks,
            retryPromise : retryPromise,
    SynchornizedPromises : SynchornizedPromises
};