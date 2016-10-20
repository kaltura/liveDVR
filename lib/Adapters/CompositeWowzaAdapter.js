/**
 * Created by elad.benedict on 8/26/2015.
 */

var Q = require('q');
var _ = require('underscore');
var baseAdapter = require('./BaseAdapter.js').BaseAdapter;
var WowzaAdapter=require('./WowzaAdapter.js');
var util = require('util');


function CompositeWowzaAdapter(mediaServerConfig) {
    this.entries = {};
    baseAdapter.call(this);
    this._mediaServers=_.map(mediaServerConfig.hostname,(hostname)=>{
        return new WowzaAdapter(mediaServerConfig,hostname);
    })
}
util.inherits(CompositeWowzaAdapter,baseAdapter);


CompositeWowzaAdapter.prototype.getLiveEntries = function() {

    return Q.allSettled(_.map(this._mediaServers,(mediaServerAdapter)=>{
        return mediaServerAdapter.getLiveEntries();
    })).then(function(res) {

        let entries =  _.reduce(res,(response,p) => {
            if (p.state === "fulfilled") {
                return response.concat(p.value);
            }
            return response;
        },[]);

        entries=_.uniq(entries,(ret)=> {
            return ret.entryId;
        });

        return entries;
    });
};

module.exports = CompositeWowzaAdapter;