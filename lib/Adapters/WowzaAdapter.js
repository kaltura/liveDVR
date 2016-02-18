/**
 * Created by elad.benedict on 8/26/2015.
 */

var Q = require('q');
var _ = require('underscore');
var config = require('../../common/Configuration');
//var logger = require('../../../common/logger/logger.js')(module);
var NetworkClient=require('../NetworkClient.js');
var url = require('url');
var BaseAdapter=require('./BaseAdapter.js').BaseAdapter;
var util=require('util');


var applicationName=config.get('mediaServer').applicationName;
var hostname = config.get('mediaServer').hostname;
var port = config.get('mediaServer').port;
var wowzaUrl="http://localhost:8087/v2/servers/_defaultServer_/vhosts/_defaultVHost_/applications/"+applicationName+"/instances";


function getFullLiveUrl(entryId,flavor) {
    var path = '/' + applicationName + "/_definst_/" + entryId + "_" + flavor + "/";
    return url.format({
        protocol : 'http',
        hostname : hostname,
        port : port,
        pathname : path
    });
}



function WowzaAdapter() {


}

util.inherits(WowzaAdapter,BaseAdapter);



WowzaAdapter.prototype.getLiveEntriesForMediaServer=function() {

    var self=this;
  //  BaseAdapter.prototype.getLiveEntries.call(this);

    return NetworkClient.read( {
            url:wowzaUrl,
            json:true
        })
        .then(function(res) {

            if (res.instanceList.length==0) {
                return [];
            }
            var entriesInfo= _.map(res.instanceList[0].incomingStreams,function(stream) {

                var entryId="";

                var i = stream.name.lastIndexOf('_');
                if (i != -1) {
                    entryId = stream.name.substr(0, i) ;
                }


                return {
                    entryId: entryId,
                    clientAddress: stream.sourceIp,
                    getChunklistUrl: function(kalturaFlavor) {
                        return getFullLiveUrl(entryId,kalturaFlavor);
                    }
                };
            });
            return BaseAdapter.prototype.extendEntryInfoFromAPI.call(self,entriesInfo);
        })
        .catch(function(err) {
            return [];
        });
}

module.exports = WowzaAdapter;