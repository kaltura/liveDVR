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

let instance = null;

class PushManager {

    constructor()
    {
        if (!instance) {
            instance = this;
            instance.registeredEntries = {};
        }
        return instance;
    }

    registerEntry(entryId, partnerId, templateName, callback)
    {
        const This = this;
        if (!This.registeredEntries[entryId] || !This.registeredEntries[entryId].templates[templateName].init)
            BackendClient.registerToPush(templateName, partnerId, entryId).then((registerResult) =>{
                logger.debug(`registered successfully to push event notifications data [${util.inspect(registerResult)}]`);
                if (!This.socket)
                    This._initSocket(registerResult.url, callback);

                this.socket.emit('listen', registerResult.queueName, registerResult.queueKey);
                //when listen event is caught in pub-sub-server it emits a "connected" event.
                this.socket.on('connected', function(queueKey, queueKeyHash) {
                    logger.debug('connected event [' + queueKey + '] hash [' + queueKeyHash + ']');
                    if (!This.registeredEntries[entryId])
                        This.registeredEntries[entryId] = {enabled: false, templates:{}};
                    This.registeredEntries[entryId].templates[templateName] = {'init': true};
                    This.registeredEntries[entryId]['queueKey'] = queueKey;
                });

            });
    }

    removeEntry(entryId)
    {
        if (this.registeredEntries[entryId])
            delete this.registeredEntries[entryId];
    }

    setEntryEnabled(entryId, enabled)
    {
        if (!this.registeredEntries[entryId])
            this.registeredEntries[entryId] = {};
        this.registeredEntries[entryId]['enabled'] = enabled;
    }

    _initSocket(url, callback)
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
        this.socket.on('message',  (...args) => this._messageReceived(callback, ...args));
        this.socket.on('error', (err)=>{logger.debug(`socket error ${util.inspect(err)}`)});
    }

    _messageReceived(callback, queueKey, msg)
    {
        const entry = msg[0];
        logger.debug(`message received for entry [${entry.id}] registered [${util.inspect(this.registeredEntries)}]`);
        if (this.registeredEntries[entry.id] && this.registeredEntries[entry.id].enabled)
        {
            callback(entry);
        }
        else
            logger.debug('entry not yet enabled, not handling')
    }
}

module.exports.PushManager = PushManager;