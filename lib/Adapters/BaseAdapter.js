var Q = require('q');
var _ = require('underscore');
var util=require('util');
var events = require('events');

function BaseAdapter() {
    this.entries = {};
    this.once('exit', this.gracefullyExit);
}

util.inherits(BaseAdapter, events.EventEmitter);

BaseAdapter.prototype.getLiveEntries = function() {};

function StreamInfo(entryId, flavorParamsIds) {
    this.entryId = entryId;
    this.flavorParamsIds = _.uniq(flavorParamsIds.split(','));
}

StreamInfo.prototype.getAllFlavors = function() {}

module.exports = {
    BaseAdapter : BaseAdapter,
    StreamInfo : StreamInfo
};
