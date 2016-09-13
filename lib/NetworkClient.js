/**
 * Created by elad.benedict on 8/24/2015.
 */

var Q = require('q');
var request = require('request');
var util = require('util');

function readRequest(requestData)
{
    var d = Q.defer();
    if (!requestData.encoding) {
        requestData.encoding = null; // Treat as binary
    }

    request(requestData, function (error, response, body) {
        if (error) {
            d.reject(error);
            return;
        }
        if (!error && response.statusCode === 200) {
            d.resolve({body: body, headers: response.headers});
            return;
        }
        var msg = util.format("Response for %j returned with status code %d", requestData, response.statusCode)
        d.reject(new Error(msg));
    });
    return d.promise;
}

module.exports = {
    read : readRequest
};