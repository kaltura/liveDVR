
var WowzaAdapter=require('./WowzaAdapter.js');
var CompositeWowzaAdapter=require('./CompositeWowzaAdapter.js');
var APIQueryAdapter=require('./APIQueryAdapter.js');
var TestAdapter=require('./TestAdapter.js');
var RegressionAdapter=require('./RegressionAdapter.js');
var config = require('../../common/Configuration');
const _ = require('underscore');

var simulateStreams = config.get('simulateStreams');
var regressionAdapterConfig = config.get('regressionAdapter');

var mediaServerConfig = config.get('mediaServer');

exports.getAdapter = function() {

    if (regressionAdapterConfig && regressionAdapterConfig.enable) {
        return new RegressionAdapter();
    }
    if (simulateStreams && simulateStreams.enable) {
        return new TestAdapter();
    } else {
        if (_.isArray(mediaServerConfig.hostname)) {
            return new CompositeWowzaAdapter(mediaServerConfig);
        } else {
            return new WowzaAdapter(mediaServerConfig,mediaServerConfig.hostname);
        }
    }

};

