/**
 * Created by noam.arad on 10/23/2017.
 */

const io = require('socket.io-client');
const util = require('util');
const BackendClient = require('./BackendClientFactory').getBackendClient();
const logger = require('../common/logger').getLogger('PushManager');
const Q = require('q');

class PushManager {

    constructor()
    {
        this.registeredObjects = {};
        this.registeredQueues = {};
        this.qKeyToQHash = {};
    }

    registerObjectToPush(partnerId, templateName, objectId, params, callback, enabledDefault = false)
    {
        const deferred = Q.defer();
        if (!this.registeredObjects[objectId] || !this.registeredObjects[objectId].templates[templateName] || !this.registeredObjects[objectId].templates[templateName].init)
        {
            BackendClient.registerToPush(templateName, partnerId, params).then((registerResult) => {
                logger.debug(`registered successfully to push event notifications data [${util.inspect(registerResult)}]`);
                this._initSocket(registerResult.url);
                if (this.socket)
                {
                    if (!this.registeredObjects[objectId])
                        this.registeredObjects[objectId] = {
                            enabled: enabledDefault,
                            templates: {}
                        };
                    this.registeredObjects[objectId]['queueKey'] = registerResult.queueKey;
                    this.registeredObjects[objectId]['callback'] = callback;
                    this.registeredObjects[objectId].templates[templateName] = {'init': true};
                    this.registeredQueues[registerResult.queueKey] = {'objectId': objectId, 'deferredObject': deferred};
                    //when listen event is caught in pub-sub-server it emits a "connected" event.
                    this.socket.emit('listen', registerResult.queueName, registerResult.queueKey);
                }
            }).
            catch((err)=>{
                    logger.error(`Register to push notification failed ${err}`);
                    deferred.reject();
                });
        }
        else
        {
            logger.warn(`Already registered to objectId ${objectId} and template ${templateName}`);
            deferred.resolve();
        }
        return deferred.promise;
    }

    removeObject(objectId)
    {
        if (this.registeredObjects[objectId])
        {
            this.socket.emit('unlisten', this.registeredObjects[objectId].queueKey);
            delete this.registeredQueues[this.registeredObjects[objectId].queueKey];
            delete this.registeredObjects[objectId];
        }
    }

    setObjectEnabled(objectId, enabled)
    {
        if (!this.registeredObjects[objectId])
            this.registeredObjects[objectId] = {templates: {}};
        this.registeredObjects[objectId]['enabled'] = enabled;
    }

    _initSocket(url)
    {
        if (this.socket)
            return;
        const This = this;
        this.socket = io.connect(url,  {forceNew: true,
            reconnection: true,
            'force new connection': true,
            transports: [ 'websocket' ],
            secure: true} );

        this.socket.on('connect', () => {
            logger.debug('socket connected');
        });

        this.socket.on('validated', () => {
            logger.debug('connection validated');
        });
        this.socket.on('error', (err)=>{
            logger.error(`error received [${util.inspect(err)}]`);
            this.socket = null;
        });

        //this.socket.on('message',  function(queueKey, msg){logger.debug(`message received [${util.inspect(msg)}]`);});
        this.socket.on('message',  (...args) => this._messageReceived(...args));

        this.socket.on('connected', (queueKey, queueKeyHash) =>
        {
            logger.debug('connected event [' + queueKey + '] hash [' + queueKeyHash + ']');
            let deferred = this.registeredQueues[queueKeyHash].deferredObject;
            this.qKeyToQHash[queueKey] = queueKeyHash;
            deferred.resolve();
        });
    }

    _messageReceived(queueKey, msg)
    {
        logger.debug(`message received [${util.inspect(msg)}]`);
        if (this.qKeyToQHash[queueKey])
        {
            let queueKeyHash = this.qKeyToQHash[queueKey];
            const objectId = this.registeredQueues[queueKeyHash].objectId;
            if (this.registeredObjects[objectId].enabled)
                this.registeredObjects[objectId].callback(msg);
            else
                logger.debug(`object with id [${objectId}] not enabled, not handling`);
        }
    }
}

module.exports.PushManager = new PushManager();