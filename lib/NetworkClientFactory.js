/**
 * Created by elad.benedict on 8/24/2015.
 */

module.exports = (function(){

    var getNetworkClient = function getNetworkClient(){
        var networkClient;
        var config = require('./../common/Configuration');
        if (config.get('mockNetwork'))
        {
            networkClient = require('./mocks/NetworkClientMock');
        }
        else
        {
            networkClient = require('./NetworkClient');
        }

        return networkClient;
    };

    return {
        getNetworkClient : getNetworkClient
    };
})();