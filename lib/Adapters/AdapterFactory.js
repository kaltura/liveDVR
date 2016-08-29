var WowzaAdapter=require('./WowzaAdapter.js');
var APIQueryAdapter=require('./APIQueryAdapter.js');
var TestAdapter=require('./TestAdapter.js');
var RegressionAdapter=require('./RegressionAdapter/RegressionAdapter');
var config = require('../../common/Configuration');


getAdapter = function(controller) {

    var simulateStreams = config.get('simulateStreams');
    var regressionAdapterConfig = config.get('regressionAdapter');

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

