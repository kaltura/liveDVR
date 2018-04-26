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
const pushManager = require('./PushManager').PushManager;

const interval = 120;
const templateName = config.get('newTaskPushNotificationTemplateName');
const partnerId = config.get('backendClient').partnerId;

class TaskManager {
    
    constructor()
    {
        this.callbackMap = {};
        this.mediaServerIdPromise = BackendClient.getMediaServerId();
        this.mediaServerIdPromise.then(serverNodeId => {
            setTimeout(this._updateList.bind(this, serverNodeId),interval * 1000);
        });
        
    }
    
    register(entryServerNodeType, callback)
    {
        this.callbackMap[entryServerNodeType] = callback;
        this.mediaServerIdPromise.then(serverNodeId => {
            let params = {'serverNodeId': serverNodeId, "entryServerNodeType": entryServerNodeType};
            logger.debug("Register to Task with params " + util.inspect(params) + " for partner: " + partnerId);
            pushManager.registerObjectToPush(partnerId, templateName, templateName, params, msg => {
                let task = msg[0];
                return BackendClient.getEntryServerNode(task.id).then(entryServerNode => {
                    if (entryServerNode && entryServerNode.status == KalturaTypes.KalturaEntryServerNodeStatus.TASK_PENDING)
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
                if (this.callbackMap[entryServerNodes[i].serverType])
                    this.callbackMap[entryServerNodes[i].serverType](entryServerNodes[i]);
            }
        }).finally(() => {
            setTimeout(this._updateList.bind(this, serverNodeId),interval * 1000);
        });
    }

}

module.exports.TaskManager = new TaskManager();