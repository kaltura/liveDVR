/**
 * Created by AsherS on 8/24/15.
 */

var HTTPUtils = (function(){

    var qfs = require("q-io/fs");
    var obj = {};

    obj.downloadFile = function(url, pathDestination, timeout) {
        var networkClient = require('../NetworkClientFactory').getNetworkClient();
        var config = require('../Configuration');
        var request = {
            url: url
        };
        if (timeout) {
            request.timeout = timeout;
        }
        else if (config.get("requestTimeout")) {
            request.timeout = config.get("requestTimeout");
        }

        return networkClient
            .read(request)
            .then(function(data) {
                return qfs.write(pathDestination, data);
            })
            .catch(function(err){
                throw new Error("Failed to download file.\nUrl: " + url + "\nDestination: " + pathDestination + "\n" + err);
            }
        );
    };

    return obj;

})();

module.exports = HTTPUtils;

