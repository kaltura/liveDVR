/**
 * Created by elad.benedict on 8/26/2015.
 */

var Q = require('q');
var _ = require('underscore');
var kalturaTypes = require('./../kaltura-client-lib/KalturaTypes');
var kalturaVO = require('./../kaltura-client-lib/KalturaVO');
var config = require('../../common/Configuration');
var KalturaLiveStatus = require('../kaltura-client-lib/KalturaTypes').KalturaEntryServerNodeStatus;
var logger = require('../../common/logger').getLogger('BackendClientMock');

var realBackendClient = null;

if ( config.get('mockBackendProvideRealInfo') ) {
    realBackendClient = require('../BackendClient');
}

var entries=[{
    entryId : '1_xxxxx',
    flavorParamsIds: "32",
    serverType:"0",
    playWindow : 60*60*2,
    dvrEnabled : true
}, {
    entryId : ["1_mkz6lwog","1_k5i4l96e","1_gffgxm38","0_0beuc28z","0_0fggyzn1","0_9g53qrm5"],
    flavorParamsIds: "32,33,34,35", //,33,34,35
    serverType: "0",
    playWindow : 60*60*2,
    dvrEnabled : true
}, {
    entryId : '*',
    flavorParamsIds: "32,33,34,35", //,33,34,35
    serverType: "0",
    playWindow : 150,
    dvrEnabled : false
}];

var entryServerNodes= {
    id: 1,
    data: [],
    findIndex:function(entryObject) {
       return _.findIndex(this.data, function (e) {
            return e.entryId==entryObject.entryId && entryObject.serverType=== e.serverType;
        });
    },
    add:function add(entryObject,state) {

        var index=this.findIndex(entryObject);
        if (index>-1) {
            this.data[index].updated= new Date();
            this.data[index].state= state;
        } else {
            this.data.push({
                entryId: entryObject.entryId,
                serverType: entryObject.serverType,
                state: state,
                id: this.id++,
                updated: new Date()
            });
        }
    },
    remove:  function removeEntryNode(entryObject) {
        var index=this.findIndex(entryObject);
        if (index>-1) {
            var obj=this.data[index];
            this.data.splice(index,1);
            return obj;
        }
        return null;
    },
    list:function(entryId) {
        return _.filter(this.data, function (e) {
            return e.entryId === entryId;
        });
    },
    updateStreamInfo:function( entryServerNodeId, flavorsObjArray) {
        var entryServerNode = _.find(this.data, function (e) {
            return e.id==entryServerNodeId;
        });
        if (entryServerNode) {
            entryServerNode.streamInfo=flavorsObjArray;
            return Q.resolve(entryServerNode);
        } else {
            return Q.reject("");
        }
    }
};


module.exports = {
    getLiveEntriesForMediaServer : Q.resolve(entries),
    getEntryInfo : function(entryId) {
        if (realBackendClient) {
            return realBackendClient.getEntryInfo(entryId).then(function(res) {
                entryServerNodes.add(res, KalturaLiveStatus.BROADCASTING);
                return res;
            });
        }
        var res=_.find(entries,function(e) {
            if (_.isArray(e.entryId) && _.indexOf(e.entryId,entryId)>-1) {
                return true;
            }

            return e.entryId===entryId || e.entryId==='*';
        });
        if (res) {
            var result=_.clone(res);
            result.entryId=entryId;
            return Q.resolve(result);
        }
        return Q.reject("No such entry");
    },
    registerEntryInDatabase : function(entryObject, state, event) {
        logger.info("[%s] Calling registerMediaServer, serverIndex: [%s], state=%s", entryObject.entryId,entryObject.serverType,state);

        return Q.resolve(entryServerNodes.add(entryObject,state));
    },
    unregisterEntryInDatabase: function(entryObject) {
        logger.info("[%s] Calling unregisterMediaServer, serverIndex: [%s]", entryObject.entryId,entryObject.serverType);
        entryServerNodes.remove(entryObject);
        return Q.resolve();
    },
    getLiveEntryServerNodes: function(entryId, filter) {
        logger.info("[%s] Calling getLiveEntryServerNodes", entryId);
        return Q.resolve(entryServerNodes.list(entryId));
    },

    updateStreamInfo: function(entryId, entryServerNodeId, flavorsObjArray) {
        logger.debug("Calling updateStreamInfo, with new flavors object array %j",flavorsObjArray);
        return entryServerNodes.updateStreamInfo(entryServerNodeId,flavorsObjArray);
    },

    isEntryLive: function(entryId) {
        if (realBackendClient) {
            return realBackendClient.isEntryLive(entryId);
        }
        let filter = new kalturaVO.KalturaLiveEntryServerNode();
        filter.isLive = kalturaTypes.KalturaNullableBoolean.TRUE_VALUE;
        filter.statusIn = '1,2';
        return this.getLiveEntryServerNodes(entryId, filter)
            .then((serverObjs) => {
                return serverObjs.length > 0;
            });
        return Q.resolve(true);
    }


};