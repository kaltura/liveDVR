var WowzaAdapter=require('./WowzaAdapter.js');
var APIQueryAdapter=require('./APIQueryAdapter.js');
var TestAdapter=require('./TestAdapter.js');
var regression = require( './RegressionAdapter/RegressionConfig.js');
// parses command line and update LiveController configuration
var updateConfig  = regression.RegressionConfig.instance;
// config is defined after updateConfig, in order to get
// changes done in RegressionConfig.js
var config = require('../../common/Configuration');
var RegressionAdapter=require('./RegressionAdapter/RegressionAdapter.js');

var simulateStreams = config.get('simulateStreams');
var regressionAdapterConfig = config.get('regressionAdapter');

exports.getAdapter = function() {

    if (regressionAdapterConfig && regressionAdapterConfig.enable) {
        return new RegressionAdapter();
    }
    if (simulateStreams && simulateStreams.enable) {
        return new TestAdapter();
    } else {
        return new WowzaAdapter();
    }

};

