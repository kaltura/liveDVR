/**
 * Created by elad.benedict on 8/24/2015.
 */

var qHttp = require("q-io/http");

module.exports = function(){
    return {
        read : qHttp.read
    };
};