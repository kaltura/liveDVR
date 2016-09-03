var regressionAdapterConfig = require('./RegressionAdapter/RegressionConfig.js').RegressionConfig.instance;
var config = require('../../common/Configuration');
var WowzaAdapter=require('./WowzaAdapter.js');
var APIQueryAdapter=require('./APIQueryAdapter.js');
var TestAdapter=require('./TestAdapter.js');
var RegressionAdapter=require('./RegressionAdapter/RegressionAdapter');


getAdapter = function() {

    var simulateStreams = config.get('simulateStreams');

    if (regressionAdapterConfig && regressionAdapterConfig.regressionConfig.enable) {
        return new RegressionAdapter();
    }
    if (simulateStreams && simulateStreams.enable) {
        return new TestAdapter();
    } else {
        return new WowzaAdapter();
    }

};


module.exports = {
    getAdapter: getAdapter
}

