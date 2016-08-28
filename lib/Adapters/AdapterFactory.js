var WowzaAdapter=require('./WowzaAdapter.js');
var APIQueryAdapter=require('./APIQueryAdapter.js');
var TestAdapter=require('./TestAdapter.js');
var RegressionAdapter=require('./RegressionAdapter/RegressionAdapter.js');
var config = require('../../common/Configuration');

var simulateStreams = config.get('simulateStreams');
var regressionAdapterConfig = config.get('regressionAdapter');

getAdapter = function(controller) {
    
    if (regressionAdapterConfig && regressionAdapterConfig.enable) {
        return new RegressionAdapter(controller);
    }
    if (simulateStreams && simulateStreams.enable) {
        return new TestAdapter();
    } else {
        return new WowzaAdapter();
    }

};

var exitProcess = function(code) {
    process.exit(code);
}

module.exports = {
    getAdapter: getAdapter
}

