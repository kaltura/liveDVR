/**
 * Created by david.winder on 04/15/2018.
 */

const util = require('util');
const BackendClient = require('./BackendClientFactory').getBackendClient();
const KalturaTypes = require('./kaltura-client-lib/KalturaTypes');
const kalturaVO = require('./kaltura-client-lib/KalturaVO');
const logger = require('../common/logger').getLogger('TaskManager');
const config = require('../common/Configuration');
var _ = require('underscore');
const Q = require('q');
const pushManager = require('./PushManager').PushManager;

const interval = 120;

class TaskManager {
    
    constructor()
    {
        this.CallbackMap = {};
        this.mediaServerIdPromise = BackendClient.getMediaServerId();
        this.mediaServerIdPromise.then(serverNodeId => {
            setTimeout(this._updateList.bind(this, serverNodeId),interval * 1000);
        });
        
    }
    
    register(entryServerNodeType, callback)
    {
        let templateName = config.get('newTaskPushNotificationTemplateName');
        let partnerId = config.get('backendClient').partnerId;
        this.CallbackMap[entryServerNodeType] = callback;
        this.mediaServerIdPromise.then(serverNodeId => {
            let params = {'serverNodeId': serverNodeId, "entryServerNodeType": entryServerNodeType};
            logger.debug("Register to Task with params " + util.inspect(params) + " for partner: " + partnerId);
            pushManager.registerObjectToPush(partnerId, templateName, templateName, params, msg => {
                let task = msg[0];
                return BackendClient.getEntryServerNode(task.id).then(entryServerNode => {
                    if (entryServerNode && entryServerNode.status == KalturaTypes.KalturaEntryServerNodeStatus.TASK_CREATED)
                    {
                        return callback(task);
                    }
                    logger.info('Task with ID [' + task.id + '] should no executed');
                });
            });
            pushManager.setObjectEnabled(templateName, true);
        });
    }

    _getEntryServerNodesList(serverNodeId, prefix, interval)
    {
        let filter = new kalturaVO.KalturaEntryServerNodeFilter();
        filter.serverNodeIdEqual = serverNodeId;
        filter.statusIn = KalturaTypes.KalturaEntryServerNodeStatus.TASK_PENDING;
        filter.createdAtLessThanOrEqual = - interval;
        return BackendClient.getLiveEntryServerNodes(null, filter).then((objects => {
            return _.filter(objects,  (e) =>{
                return e.entryId.indexOf(prefix) === 0;});
        }));
    }
    
    _updateList(serverNodeId)
    {
        this._getEntryServerNodesList(serverNodeId, 0, interval).then(entryServerNodes => {
            for (var i = 0; i < entryServerNodes.length; i++)
            {
                if (this.CallbackMap[entryServerNodes[i].serverType])
                    this.CallbackMap[entryServerNodes[i].serverType](entryServerNodes[i]);
            }
            setTimeout(this._updateList.bind(this, serverNodeId),interval * 1000);
        });
    }

}

module.exports.TaskManager = new TaskManager();