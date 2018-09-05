
var config = require('../../common/Configuration');
var WowzaAdapter=require('./WowzaAdapter.js');
var CompositeWowzaAdapter=require('./CompositeWowzaAdapter.js');
var APIQueryAdapter=require('./APIQueryAdapter.js');
var config = require('../../common/Configuration');
const _ = require('underscore');

var simulateStreams = config.get('simulateStreams');
var regressionAdapterConfig = config.get('regressionAdapter');

var mediaServerConfig = config.get('mediaServer');
var adapter;

exports.getAdapter = function() {

    if (!adapter) {
        if (regressionAdapterConfig && regressionAdapterConfig.enable) {
            let RegressionAdapter = require('./RegressionAdapter/RegressionAdapter');
            adapter = new RegressionAdapter();
        } else if (simulateStreams && simulateStreams.enable) {
            adapter = require('./TestAdapter.js').TestAdapter.instance;
        } else {
            if (_.isArray(mediaServerConfig.hostname)) {
                adapter = new CompositeWowzaAdapter(mediaServerConfig);
            } else {
                let hostName = mediaServerConfig.wowzaServer ? mediaServerConfig.wowzaServer: mediaServerConfig.hostname;
                let metadataHostName = mediaServerConfig.wowzaMetadataHost ? mediaServerConfig.wowzaMetadataHost: hostName;
                adapter = new WowzaAdapter(mediaServerConfig, hostName, metadataHostName);
            }
        }
    }

    return adapter;
};
