
var WowzaAdapter=require('./WowzaAdapter.js');
var APIQueryAdapter=require('./APIQueryAdapter.js');
var TestAdapter=require('./TestAdapter.js');
var RegressionAdapter=require('./RegressionAdapter/RegressionAdapter.js');
var process = require('process');
var config = require('../../common/Configuration');

var simulateStreams = config.get('simulateStreams');
var regressionAdapterConfig = config.get('regressionAdapter');
var command = process.argv.length > 2 ? process.argv[2] : undefined;


exports.getAdapter = function() {

    if (command != undefined) {
        regressionAdapterConfig.enable = command.localeCompare('run_regression') === 0 ? true : false;
        simulateStreams.enable = command.localeCompare('record') === 0 ? true : false;
    }

    if (regressionAdapterConfig && regressionAdapterConfig.enable) {
        return new RegressionAdapter();
    }
    if (simulateStreams && simulateStreams.enable) {
        return new TestAdapter();
    } else {
        return new WowzaAdapter();

    }

};

