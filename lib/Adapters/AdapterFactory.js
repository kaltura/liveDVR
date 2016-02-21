
var WowzaAdapter=require('./WowzaAdapter.js');
var APIQueryAdapter=require('./APIQueryAdapter.js');
var TestAdapter=require('./TestAdapter.js');



exports.getAdapter=function() {

    return new WowzaAdapter();

};

