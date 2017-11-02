/**
 * Created by noam.arad on 10/23/2017.
 */

const io = require('socket.io-client');
const util = require('util');
const BackendClient = require('./BackendClientFactory').getBackendClient();
const logger = require('../common/logger').getLogger('PushManager');
const kalturaTypes = require('./kaltura-client-lib/KalturaTypes');
const playListGenerator = require('./playlistGenerator/PlaylistGenerator');
const RecordingManager = require('./recording/RecordingManager');

class PushManager {

    constructor()
    {
        this.registeredObjects = {};
        this.registeredQueues = {};
    }

    registerObjectToPush(partnerId, templateName, objectId, params, callback)
    {
        const This = this;
        if (!This.registeredObjects[objectId] || !This.registeredObjects[objectId].templates[templateName].init)
        {
            BackendClient.registerToPush(templateName, partnerId, params).then((registerResult) => {
                logger.debug(`registered successfully to push event notifications data [${util.inspect(registerResult)}]`);
                if (!This.socket)
                {
                    This._initSocket(registerResult.url);
                }

                this.socket.emit('listen', registerResult.queueName, registerResult.queueKey);
                //when listen event is caught in pub-sub-server it emits a "connected" event.
                this.socket.on('connected', function (queueKey, queueKeyHash) {
                    logger.debug('connected event [' + queueKey + '] hash [' + queueKeyHash + ']');
                    if (!This.registeredObjects[objectId])
                        This.registeredObjects[objectId] = {enabled: false, templates: {}, 'queueKey': queueKey, 'callback': callback,};
                    This.registeredObjects[objectId].templates[templateName] = {'init': true};
                    This.registeredQueues[queueKey] = {'objectId': objectId};
                });

            });
        }
        else
            logger.warn(`Already registered to objectId ${objectId} and template ${templateName}`);
    }

    removeObject(objectId)
    {
        if (this.registeredObjects[objectId])
        {
            delete this.registeredQueues[this.registeredObjects[objectId].queueKey];
            delete this.registeredObjects[objectId];
        }
    }

    setObjectEnabled(objectId, enabled)
    {
        if (!this.registeredObjects[objectId])
            this.registeredObjects[objectId] = {};
        this.registeredObjects[objectId]['enabled'] = enabled;
    }

    _initSocket(url)
    {
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
        });

        //this.socket.on('message',  function(queueKey, msg){logger.debug(`message received [${util.inspect(msg)}]`);});
        this.socket.on('message',  (...args) => this._messageReceived(...args));
        this.socket.on('error', (err)=>{logger.debug(`socket error ${util.inspect(err)}`)});
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
                logger.debug('object not enabled, not handling')
        }
    }
}

module.exports.PushManager = new PushManager();