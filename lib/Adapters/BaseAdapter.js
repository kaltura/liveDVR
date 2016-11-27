var Q = require('q');
var _ = require('underscore');
var util=require('util');
var events = require('events');

function BaseAdapter() {
    this.entries = {};
}

BaseAdapter.prototype.getLiveEntries = function() {};

BaseAdapter.prototype.toJSON = function() {
    return {};
};


util.inherits(BaseAdapter, events.EventEmitter);

function StreamInfo(entryId, flavorParamsIds) {
    this.entryId = entryId;
    this.flavorParamsIds = _.uniq(flavorParamsIds.split(','));
}

StreamInfo.prototype.getAllFlavors = function() {}


class BaseTestAdapter extends BaseAdapter {

    constructor() {
        super();
        // controllerWrapper ref.
        // used to signal regression-tests (grunt unit test), that regression ended.
        this.controllerWrapper;
        this.once('exit', this.gracefullyExit);
    }
}

BaseTestAdapter.prototype.setControllerWrapper = function(controllerWrapper) {
    this.controllerWrapper = controllerWrapper;
};

BaseTestAdapter.prototype.gracefullyExit = function(exit_code) {
    if (this.controllerWrapper) {
        this.controllerWrapper.emit('exit', exit_code);
    } else {
        process.exit(exit_code);
    }
}

module.exports = {
    BaseAdapter : BaseAdapter,
    BaseTestAdapter : BaseTestAdapter,
    StreamInfo : StreamInfo
};
