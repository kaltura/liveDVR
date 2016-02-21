
var WowzaAdapter=require('./WowzaAdapter.js');
var APIQueryAdapter=require('./APIQueryAdapter.js');



exports.getAdapter=function() {

    return new WowzaAdapter();

};

