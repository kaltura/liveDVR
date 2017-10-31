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

const PUSH_TEMPLATE_SYSTEM_NAME = 'EXPLICIT_LIVE_PUSH_NOTIFICATIONS';

let instance = null;

class PushManager {

    constructor(controllerRef)
    {
        if (!instance) {
            instance = this;
            instance.registeredEntries = {};
        }
        if (!this.controllerRef && controllerRef)
            instance.controllerRef = controllerRef;
        return instance;
    }

    registerEntry(partnerId, entryId)
    {
        const This = this;
        if (!This.registeredEntries[entryId] || !This.registeredEntries[entryId].init)
            BackendClient.registerToPush(PUSH_TEMPLATE_SYSTEM_NAME, partnerId, entryId).then((registerResult) =>{
                logger.debug(`registered successfully to push event notifications data [${util.inspect(registerResult)}]`);
                if (!This.socket)
                    This._initSocket(registerResult.url);

                this.socket.emit('listen', registerResult.queueName, registerResult.queueKey);
                //when listen event is caught in pub-sub-server it emits a "connected" event.
                this.socket.on('connected', function(queueKey, queueKeyHash) {
                    logger.debug('connected event [' + queueKey + '] hash [' + queueKeyHash + ']');
                    if (!This.registeredEntries[entryId])
                        This.registeredEntries[entryId] = {enabled: false};
                    This.registeredEntries[entryId]['init'] = true;
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
        const entry = msg[0];
        logger.debug(`message received for entry [${entry.id}] registered [${util.inspect(this.registeredEntries)}]`);
        if (this.registeredEntries[entry.id] && this.registeredEntries[entry.id].enabled)
        {
            logger.debug(`handling message for entry ${entry.id}`);
            //logger.debug(`@@NA entry [${util.inspect(entry)}]`);
            //if (entry.viewMode == kalturaTypes.KalturaViewMode.ALLOW_ALL)// @@NA change after client update
            this._updateEntryObject(entry);

            if (entry.viewMode == 1)
            {
                this._startDVR(entry);
            }
            //if (entry.recordingStatus == kalturaTypes.KalturaRecordngStatus.ACTIVE) //@@NA change after client update
            if (entry.recordingStatus == 2)
            {
                this._startRecording(entry);
            }

        }
        else
            logger.debug('entry not yet enabled, not handling')
    }

    _updateEntryObject(entry)
    {
        this.controllerRef.handledEntries[entry.id].entryObject.explicitLive = entry.explicitLive;
        this.controllerRef.handledEntries[entry.id].entryObject.viewMode = entry.viewMode;
        this.controllerRef.handledEntries[entry.id].entryObject.recordingStatus = entry.recordingStatus;
    }

    _startDVR(entry)
    {
        logger.debug(`starting dvr [${util.inspect(this.controllerRef.handledEntries[entry.id])}]`);
        const newPlayWindow = Math.ceil(this.controllerRef.handledEntries[entry.id].entryObject.playWindow * 1000);
        if (newPlayWindow > this.controllerRef.handledEntries[entry.id].playlistGenerator.playListLimits.manifestTimeWindowInMsec)
        {
            this.controllerRef.handledEntries[entry.id].playlistGenerator.playListLimits.liveWindowDurationMsec = newPlayWindow;
            this.controllerRef.handledEntries[entry.id].playlistGenerator.playListLimits.manifestTimeWindowInMsec = playListGenerator.applyHLSWindowFactor(newPlayWindow);
            this.controllerRef.handledEntries[entry.id].playlistGenerator.reset();
        }
        else
            logger.debug(`new dvr length is smaller than existing one, disregarding`);
    }

    _startRecording(entry)
    {
        logger.debug(`starting recording on [${entry.id}]`);
        if (this.controllerRef.handledEntries[entry.id].recordingEnable) {
            RecordingManager.startRecording(this.controllerRef.handledEntries[entry.id].entryObject).then(()=> {
                this.logger.info(`Successfully started recording [${entry.id}]`);
            })
            .catch((err)=> {
                this.logger.warn("Start recording has failed %s, change recordingEnable status to false ", ErrorUtils.error2string(err));
                this.controllerRef.handledEntries[entry.id].recordingEnable = false;
            });
        }
    }
}

module.exports.PushManager = PushManager;