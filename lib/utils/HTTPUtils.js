/**
 * Created by AsherS on 8/24/15.
 */

var qfs = require("q-io/fs");
var qhttp = require("q-io/http");
//var networkClient = require('./NetworkClientFactory').getNetworkClient(); //TODO replace with elad's read function

var HTTPUtils = (function(){

    var obj = {};

    obj.downloadFile = function (url,pathDestination, timeout) {

        var request = {
            url: url
        };
        if (timeout) {
            request.timeout = timeout;
        }

        //TODO add read timeout from configuration file

        //return networkClient  //TODO, replace with Elad's read function
        //    .read(request)

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

    return obj;

})();

module.exports = HTTPUtils;

