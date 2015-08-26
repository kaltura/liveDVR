/**
 * Created by elad.benedict on 8/25/2015.
 */

var config = require('./Configuration');

module.exports = (function(){

    var getBackendClient = function getNetworkClient(){
        var networkClient;
        if (config.get('mockBackend'))
        {
            networkClient = require('./mocks/BackendClientMock');
        }
        else
        {
            networkClient = require('./BackendClient');
        }

        return networkClient;
    };

    return {
        getBackendClient : getBackendClient
    };
})();
