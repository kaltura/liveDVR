/**
 * Created by elad.benedict on 8/24/2015.
 */

var Q = require('q');
var request = require('request');

var readRequest = function(requestData)
{
    var d = Q.defer();
    if (!requestData.encoding)
    {
        requestData.encoding = null; // Treat as binary
    }

    request(requestData, function (error, response, body) {
        if (error)
        {
            d.reject(error);
            return;
        }
        if (!error && response.statusCode === 200) {
            d.resolve(body);
            return;
        }
        d.reject(new Error("Response for "+requestData+" returned with status code " + response.statusCode));
    });
    return d.promise;
};

module.exports = {
    read : readRequest
};