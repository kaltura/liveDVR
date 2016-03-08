var Q = require('q');
var _ = require('underscore');

function BaseAdapter() {
    this.entries = {};
}

BaseAdapter.prototype.getLiveEntries = function() {};

function StreamInfo(entryId, flavorParamsIds) {
    this.entryId = entryId;
    this.flavorParamsIds = flavorParamsIds.split(',');
}

StreamInfo.prototype.getAllFlavors = function() {}

module.exports = {
    BaseAdapter : BaseAdapter,
    StreamInfo : StreamInfo
};
