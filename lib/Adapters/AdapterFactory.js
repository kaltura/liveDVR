
var WowzaAdapter=require('./WowzaAdapter.js');
var APIQueryAdapter=require('./APIQueryAdapter.js');
var TestAdapter=require('./TestAdapter.js');

var config = require('../../common/Configuration');

var simulateStreams = config.get('simulateStreams');

exports.getAdapter=function() {

    if (simulateStreams && simulateStreams.enable) {
        return new TestAdapter();
    } else {
        return new WowzaAdapter();

    }

};

