/**
 * Created by gadyaari on 07/02/2016.
 */

var Q = require('q');

module.exports = function() {

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

    return {
      retryPromise : retryPromise
    };
};