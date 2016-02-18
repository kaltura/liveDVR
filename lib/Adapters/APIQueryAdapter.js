
var Q = require('q');
var _ = require('underscore');
var config = require('../../common/Configuration');
//var logger = require('../../../common/logger/logger.js')(module);
var backendClient = require('../BackendClient');

var APIQueryAdapter = (function(){

    var self=this;


    var applicationName=config.get('mediaServer').applicationName;
    var hostname = config.get('mediaServer').hostname;
    var port = config.get('mediaServer').port;



    function getFullLiveUrl(entryId,flavor) {
        var path = '/' + applicationName + "/_definst_/" + entryId + "_" + flavor + "/";
        return url.format({
            protocol : 'http',
            hostname : hostname,
            port : port,
            pathname : path
        });
    }

    self.includeEntryInfo=true;

    self.getLiveEntries = function () {

       return backendClient.getLiveEntriesForMediaServer.then(function(res) {

           _.each(res,function(r) {
               r.getChunklistUrl= function (kalturaFlavor) {
                   return getFullLiveUrl(this.entryId, kalturaFlavor);
               }
           });

           return Q.resolve(res);
       });


    };
    return self;
})();

module.exports = APIQueryAdapter;