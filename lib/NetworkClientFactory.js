/**
 * Created by elad.benedict on 8/24/2015.
 */

var config = require('./Configuration');

module.exports = (function(){

    var getNetworkClient = function getNetworkClient(){
        var networkClient;
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