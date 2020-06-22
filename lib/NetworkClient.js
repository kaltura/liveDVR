/**
 * Created by elad.benedict on 8/24/2015.
 */

var Q = require('q');
var request = require('request');
var util = require('util');
var logger = require('../common/logger').getLogger("NetworkClient");

function requestPromisify(requestData) {
    return Q.Promise((resolve, reject) => {
        request(requestData, (error, response, body)=> {
            if (error) {
                error.retryable = true;
                reject(error);
                return;
            }
            resolve({body: body, response: response});
        });
    });

}
function readRequest(requestData, retries = 0)
{
    if (!requestData.encoding) {
        requestData.encoding = null; // Treat as binary
    }
    return requestPromisify(requestData).then((res)=> {
        if (res.response.statusCode === 200) {
            return Q.resolve({body: res.body, headers: res.response.headers});
        }
        return Q.reject(new Error(util.format("Response for %s returned with status code %d", requestData.url, res.response.statusCode)));
    }).catch((err) => {
        if (err.retryable && retries > 0) {
            logger.error("Failed with: " + err + " retries of: " + retries);
            return Q.delay(1000).then(()=> {
                return readRequest(requestData, --retries);
            });
        }
        return Q.reject(err);
    });
}

module.exports = {
    read : readRequest
};