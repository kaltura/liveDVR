/**
 * Created by elad.benedict on 8/25/2015.
 */

var config = require('./../common/Configuration');

var WowzaAdapter=require('./Adapters/WowzaAdapter.js');

module.exports = (function(){

    var getBackendClient = function getNetworkClient(){
        var networkClient;
        if (config.get('mockBackend'))
        {
            if (config.get('mockAdapters')) {
                networkClient = new WowzaAdapter();

            } else
            if (config.get('readMockBackendResponseFromFile'))
            {
                networkClient = require('./mocks/BackendClientFileBasedMock');
            }
            else
            {
                networkClient = require('./mocks/BackendClientMock');
            }

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
