var Q = require('q');
var _ = require('underscore');

function BaseAdapter() {
    this.entries={};
}


BaseAdapter.prototype.getLiveEntriesForMediaServer=function() {
}



function StreamInfo(entryId,flavorParamsIds) {
    this.entryId=entryId;
    this.flavorParamsIds=flavorParamsIds.split(',');
}

StreamInfo.prototype.getAllFlavors=function() {

}

exports.BaseAdapter=BaseAdapter;
exports.StreamInfo=StreamInfo;
