/**
 * Created by elad.benedict on 8/24/2015.
 */

var config = require('./../common/Configuration');
var realNetworkClient = require('./NetworkClient');
module.exports = (function(){

    var getNetworkClient = function getNetworkClient(){
        var networkClient;

        if (config.get('mockNetwork'))
        {
            networkClient = require('./mocks/NetworkClientMock');
        }
        else
        {
            // In production, no need to require the same module over and over - it has its overhead
            networkClient = realNetworkClient;
        }

        return networkClient;
    };

    return {
        getNetworkClient : getNetworkClient
    };
})();