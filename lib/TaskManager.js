/**
 * Created by david.winder on 04/15/2018.
 */

const util = require('util');
const BackendClient = require('./BackendClientFactory').getBackendClient();
const KalturaTypes = require('./kaltura-client-lib/KalturaTypes');
const kalturaVO = require('./kaltura-client-lib/KalturaVO');
const logger = require('../common/logger').getLogger('TaskManager');
const config = require('../common/Configuration');
const pushManager = require('./PushManager').PushManager;

const interval = config.get('tasksPollingIntervalInSeconds');
const partnerId = config.get('backendClient').partnerId;

class TaskManager {
    
    constructor()
    {
        this.callbackMap = {};
        this.mediaServerIdPromise = BackendClient.getMediaServerId();
        this.mediaServerIdPromise.then(serverNodeId => {
            setTimeout(()=>{this._updateList(serverNodeId);}, interval * 1000);
        });
    }

    setPrefix(prefix)
    {
        logger.debug("Setting TaskManager prefix as: " + prefix);
        this.prefix = prefix;
    }
    
    register(entryServerNodeType, templateName, callback)
    {
        this.callbackMap[entryServerNodeType] = callback;
        this.mediaServerIdPromise.then(serverNodeId => {
            logger.debug("Register to Task with for " + templateName + " [" + entryServerNodeType + "] for partner: " + partnerId);
            pushManager.registerObjectToPush(partnerId, templateName, templateName, {'serverNodeId': serverNodeId}, (...args) => this._pushMessageReceived(...args));
            pushManager.setObjectEnabled(templateName, true);
        });
    }

    _execIfCan(task)
    {
        let err = null;
        if (this.prefix && !task.entryId.startsWith(this.prefix))
            err = 'Task with ID [' + task.id + '] should not be execute - prefix [' + this.prefix + '] entryId: ' + task.entryId;
        if (!this.callbackMap[task.serverType])
            err = 'Task with ID [' + task.id + '] cannot be execute - No callback in map';

        if (!err)
            return this.callbackMap[task.serverType](task);
        logger.info(err);
    }

    _pushMessageReceived(msg)
    {
        if (!Array.isArray(msg) || msg.length < 1)
            return logger.error('Got un-valid massage from push server: ' + msg);

        let task = msg[0];
        BackendClient.getEntryServerNode(task.id).then(entryServerNode => {
            if (entryServerNode && entryServerNode.status == KalturaTypes.KalturaEntryServerNodeStatus.TASK_PENDING)
                return this._execIfCan(task);
            logger.info('Task with ID [' + task.id + '] should no executed');
        });
    }

    static _getEntryServerNodesList(serverNodeId, interval)
    {
        let filter = new kalturaVO.KalturaEntryServerNodeFilter();
        filter.serverNodeIdEqual = serverNodeId;
        filter.statusIn = KalturaTypes.KalturaEntryServerNodeStatus.TASK_PENDING;
        filter.createdAtLessThanOrEqual = - interval;
        return BackendClient.getLiveEntryServerNodes(null, filter);
    }
    
    _updateList(serverNodeId)
    {
        TaskManager._getEntryServerNodesList(serverNodeId, interval).then(entryServerNodes => {
            for (var i = 0; i < entryServerNodes.length; i++)
                this._execIfCan(entryServerNodes[i]);
        }).finally(() => {
            setTimeout(()=>{this._updateList(serverNodeId);}, interval * 1000);
        });
    }

}

module.exports.TaskManager = new TaskManager();