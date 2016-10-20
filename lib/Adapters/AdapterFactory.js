var regressionAdapterConfig = require('./RegressionAdapter/RegressionConfig.js').RegressionConfig.instance;
var config = require('../../common/Configuration');
var WowzaAdapter=require('./WowzaAdapter.js');
var CompositeWowzaAdapter=require('./CompositeWowzaAdapter.js');
var APIQueryAdapter=require('./APIQueryAdapter.js');
var RegressionAdapter=require('./RegressionAdapter/RegressionAdapter');
const _ = require('underscore');

var simulateStreams = config.get('simulateStreams');
var mediaServerConfig = config.get('mediaServer');
var adapter;


getAdapter = function() {

    if (regressionAdapterConfig && regressionAdapterConfig.regressionConfig.enable) {
        if (!adapter){
            adapter = new RegressionAdapter();
        }
        return adapter;
    } else if (simulateStreams && simulateStreams.enable) {
        if (!adapter) {
            adapter = require('./TestAdapter.js').TestAdapter.instance;
        }
        return adapter;
    } else {
        if (_.isArray(mediaServerConfig.hostname)) {
            return new CompositeWowzaAdapter(mediaServerConfig);
        } else {
            return new WowzaAdapter(mediaServerConfig, mediaServerConfig.hostname);
        }
    }

}


module.exports = {
    getAdapter: getAdapter
}

