/**
 * Created by igors on 5/30/16.
 */
var    _ = require('underscore');
var util = require('util');
var BroadcastEventEmitter = require('./BroadcastEventEmitter');
var playlistUtils = require('./playlistGen-utils');

// this class turns a value type - string, number into object
// it can be passed by reference
// it can be printed or json'd transparently
// triggers event when modified
module.exports  = ValueHolder = function ValueHolder (val){
    this.value = val;
};

util.inherits(ValueHolder,BroadcastEventEmitter);

Object.defineProperty(ValueHolder.prototype , "value", {
    get: function get_Value() {
        return  this._value;
    },
    set: function set_Value(val) {
        if(this._value != val) {
            this._value = val;
            this.emit(playlistUtils.ClipEvents.value_changed, this._value);
        }
    }
});

ValueHolder.prototype.valueOf = function () {
    return this.value;
};

ValueHolder.prototype.toJSON = function () {
    return this._value;
};

