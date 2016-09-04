var regressionAdapterConfig = require('./RegressionAdapter/RegressionConfig.js').RegressionConfig.instance;
var config = require('../../common/Configuration');
var WowzaAdapter=require('./WowzaAdapter.js');
var APIQueryAdapter=require('./APIQueryAdapter.js');
var TestAdapter=require('./TestAdapter.js');
var RegressionAdapter=require('./RegressionAdapter/RegressionAdapter');

var adapter;

getAdapter = function() {

    if (!adapter) {
        let simulateStreams = config.get('simulateStreams');

        if (regressionAdapterConfig && regressionAdapterConfig.regressionConfig.enable) {
            adapter = new RegressionAdapter();
        } else if (simulateStreams && simulateStreams.enable) {
            adapter = new TestAdapter();
        } else {
            adapter = new  WowzaAdapter();
        }
    }
    return adapter;
};


module.exports = {
    getAdapter: getAdapter
}

