/**
 * Created by gadyaari on 07/02/2016.
 */
const _ = require('underscore');
const Q = require('q');

function retryPromise(fn, intervalRetry, maxRetries, errorString) {
    //logger.debug("retryPromise");
    let retriesLeft = maxRetries;
    return fn()
        .catch(()=> {
            return Q.delay(intervalRetry).then(()=> {
                // Delay for 'intervalRetry' msec and retry again
                if (maxRetries <= 0) {
                    throw new Error(errorString + " (after "+ maxRetries + " retries)");
                }
                return retryPromise(fn, intervalRetry, retriesLeft - 1, errorString);
            });
        });
}

// Function receives an array of promises and returns Q.resolve if all are fulfilled and Q.reject otherwise
function promisesAllFulfilled(promiseArray) {
    return Q.allSettled(promiseArray)
        .then(()=> {
            // Check if all promises are resolved
            let allResolved = _.every(promiseArray, p => { return p.state === 'fulfilled'; });
            return (allResolved) ? Q.resolve() : Q.reject();
        })
}

function SynchornizedPromises(logger) {
    let lastCallback = Q.resolve();
    this.defaultTimeOut = 20*1000; //~ 20 seconds
    let that = this;
    this.exec=function(fn, timeOut) {
        lastCallback = lastCallback
            .catch(function() {
                return Q.resolve();
            }).then(function() {
                let deferred = Q.defer();
                let timeoutHandler = setTimeout(function() {
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
        return lastCallback;
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
    retryPromise : retryPromise,
    promisesAllFulfilled : promisesAllFulfilled,
    SynchornizedPromises : SynchornizedPromises,
    runningArrayOfPromisesInBlocks : runningArrayOfPromisesInBlocks
};