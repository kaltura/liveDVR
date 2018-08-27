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
                    let registeredObject = this.registeredObjects[objectId];
                    if (!registeredObject)
                    {
                        registeredObject = {
                            enabled: enabledDefault,
                            templates: {}
                        };
                        this.registeredObjects[objectId] = registeredObject;
                    }
                    let encryptedQueueKey = registerResult.queueKey; //Bug of naming in the server
                    registeredObject.encryptedQueueKey = encryptedQueueKey;
                    registeredObject.callback = callback;
                    registeredObject.templates[templateName] = {'init': true};

                    this.registeredQueues[encryptedQueueKey] = {'objectId': objectId, 'deferredObject': deferred};
                    this.socket.on('reconnect', (attemptNumber) => {
                        if (this.registeredQueues[registerResult.queueKey])
                        {
                            logger.info('Reconnected in the  [' + attemptNumber + "] attempt for Queue: " + registerResult.queueName);
                            this.socket.emit('listen', registerResult.queueName, registerResult.queueKey);
                        }
                    });

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
        let registeredObject = this.registeredObjects[objectId];
        if (registeredObject)
        {
            if (registeredObject.encryptedQueueKey)
                this.socket.emit('unlisten', registeredObject.encryptedQueueKey);
            else
                logger.warn(`No encryptedQueueKey on registeredObjects for objectId ${objectId}`);

            delete this.registeredQueues[registeredObject.encryptedQueueKey];
            delete this.registeredQueues[registeredObject.queueKey];
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

        this.socket.on('reconnect_attempt', () => {
              logger.error('Socket disconnected - trying to reconnect to ' + url);
        });

        this.socket.on('validated', () => {
            logger.debug('connection validated');
        });
        this.socket.on('error', (err)=>{
            logger.error(`error received [${util.inspect(err)}]`);
            this.socket = null;
        });

        this.socket.on('message',  (...args) => this._messageReceived(...args));

        this.socket.on('connected', (queueKey, encryptedQueueKey) =>
        {
            logger.debug('connected event [' + queueKey + '] hash [' + encryptedQueueKey + ']');
            let deferred = this.registeredQueues[encryptedQueueKey].deferredObject;

            //save the queueKey on the object
            let objectId = this.registeredQueues[encryptedQueueKey].objectId;
            this.registeredObjects[objectId].queueKey = queueKey;
            //duplicate registeredQueues from the encryptedQueueKey to the queueKey
            this.registeredQueues[queueKey] = this.registeredQueues[encryptedQueueKey];

            deferred.resolve();
        });
    }

    _messageReceived(queueKey, msg)
    {
        logger.debug(`message received [${util.inspect(msg)}]`);
        if (this.registeredQueues[queueKey])
        {
            const objectId = this.registeredQueues[queueKey].objectId;
            if (this.registeredObjects[objectId].enabled)
                this.registeredObjects[objectId].callback(msg);
            else
                logger.debug(`object with id [${objectId}] not enabled, not handling`);
        }
    }
}

module.exports.PushManager = new PushManager();