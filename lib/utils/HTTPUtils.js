/**
 * Created by AsherS on 8/24/15.
 */

var qfs = require("q-io/fs");
var qhttp = require("q-io/http");

var HTTPUtils = (function(){

    function HTTPUtils(){

    }

    HTTPUtils.downloadFile = function (url,pathDestination, timeout) {  //TODO timeout in conf file?

        var request = {
            url: url
        };
        if (timeout) {
            request.timeout = timeout;
        }

        return qhttp
            .read(request)
            .then(
            function(res) {
                return res;
            })
            .then(function(data) {
                return qfs.write(pathDestination, data);
            });
    };

    return HTTPUtils;

})();

module.exports = HTTPUtils;

