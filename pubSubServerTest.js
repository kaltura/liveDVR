//MAKE SURE TO FLUSH EVENTS SO THAT NO EVENTS WILL BE GOTTEN BEFORE WE WANT THEM TO
/*
Disable pub-sub server
curl -i -u "<admin_username>:<admin_pass>" -d'{"vhost":"/","name":"push","truncate":"50000","requeue":"false","encoding":"auto","count":"<size_of_messages>"}' "http://<rabbit_server>:15672/api/queues/%2F/push/get"
 */
const util = require('util');
const request = require('request');
const pushManager = require('./lib/PushManager').PushManager;
const kalturaVO = require('./lib/kaltura-client-lib/KalturaVO');
const kalturaClient = require('./lib/kaltura-client-lib/KalturaClient');
const kalturaClientBase = require('./lib/kaltura-client-lib/KalturaClientBase');

const entryId = '0_2lh8dnbi';
const OBJECT_ID = 'liveDVRTest';

const client = createBackendClient();

let testCounter = 0;
const NUMBER_OF_TESTS = 100;
const TEST_TIMEOUT = 2;// Timeout to verify that previous test has actually completed
const TIMEOUT_TO_ENABLE = 1.5; // Timeout to let existing message to be received before receiving new messages

let updateCounter = 0;

function testEasyFlow()
{
    if (testCounter >= NUMBER_OF_TESTS)
    {
        console.log('pubSubTest: All tests done, I guess it was a success');
        process.exit(0);
    }
    updateCounter = 0;
    pushManager.registerObjectToPush(101, "EXPLICIT_LIVE_PUSH_NOTIFICATIONS", OBJECT_ID, {"entryId": entryId}, easyFlowFirstMessage).then(()=>{
        setTimeout(()=>{
            pushManager.setObjectEnabled(OBJECT_ID, true);
            const liveStream = new kalturaVO.KalturaLiveStreamEntry();
            liveStream.viewMode = 1;
            updateCounter++;
            client.liveStream.update( function(result, err, headers) {
                console.log('pubSubTest: entry updated first time');
                if ((updateCounter % 2) == 0)
                {
                    setTimeout(()=>{
                        testCounter++;
                        testEasyFlow();
                    }, TEST_TIMEOUT * 1000);
                }
            },entryId, liveStream);

        }, TIMEOUT_TO_ENABLE * 1000);

    });

    function easyFlowFirstMessage()
    {
        if ((updateCounter % 2) == 1)
        {
            console.log('pubSubTest: GOOD: Should be called');
            pushManager.removeObject(OBJECT_ID);
            const liveStream = new kalturaVO.KalturaLiveStreamEntry();
            liveStream.viewMode = 0;
            updateCounter++;
            client.liveStream.update(function (result, err, headers)
            {
                console.log('pubSubTest: entry updated second time');
            }, entryId, liveStream);
        }
        else if ((updateCounter % 2) == 0)
        {
            console.log("pubSubTest: BAD: we shouldn't have received this message");
            process.exit(1);
        }
    }

}

function createBackendClient()
{
    const clientConfig = new kalturaClientBase.KalturaConfiguration();
    clientConfig.serviceUrl = 'http://laio.mysystem.local';
    const client = new kalturaClient.KalturaClient(clientConfig);
    client.setSessionId('MTZmNDAxOWFmYTE3MjZmMzJlYjkyODBlZmEwYWZkMTU4MzQ0NTUxMHwxMDE7MTAxOzI1MDk4ODkzMjY7MjsxNTA5ODg5MzI3LjI4MTQ7YWRtaW47ZGlzYWJsZWVudGl0bGVtZW50Ozs=');
    return client;
}

testEasyFlow();