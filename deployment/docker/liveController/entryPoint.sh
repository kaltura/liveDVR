#!/bin/bash

source initScript.sh

echo applying new configMapping
LOG_FILE_NAME=/var/log/liveController/kLiveController.log
LIVE_CONTENT_PATH="${BASE_CONTENT_FOLDER}/live"
LIVE_ARCHIVE_CONTENT_PATH="${BASE_CONTENT_FOLDER}/archive"
RECORDING_FOLDER="${BASE_CONTENT_FOLDER}/liveRecorder"


jsonFile=$1;

node > ./common/config/configMapping.json << EOF
const fs=require("fs");
//Read data
let data = JSON.parse(fs.readFileSync('./common/config/configMapping.json.template', 'utf8'));
let config=data[".*"];
config.rootFolderPath="$LIVE_CONTENT_PATH";
config.oldContentFolderPath="$LIVE_ARCHIVE_CONTENT_PATH";
config.logFileName="$LOG_FILE_NAME";
config.logToConsole = true;

config.backendClient.serviceUrl="$SERVICE_URL";
config.backendClient.adminSecret="$PARTNER_ADMIN_SECRET";
config.backendClient.partnerId=$PARTNER_ID;

config.mediaServer.hostname="$SERVER_NODE_HOST_NAME";
config.mediaServer.user="$WOWZA_ADMIN_USER";
config.mediaServer.password="$WOWZA_ADMIN_PASSWORD";
config.mediaServer.wowzaHost="$WOWZA_HOSTNAME";
config.mediaServer.wowzaMetadataHost="$WOWZA_METADATA_HOST";
config.mediaServer.port=80;

config.recording.recordingFolderPath= "$RECORDING_FOLDER/recordings";
config.recording.completedRecordingFolderPath= "$RECORDING_FOLDER/incoming";

//Output data
console.log(JSON.stringify(data,null,2));

EOF


cat ./common/config/configMapping.json

echo adding  $SERVER_NODE_HOST_NAME to backend
node ./deployment/addServerNode.js $SERVER_NODE_HOST_NAME
exec node ./lib/App.js
echo "it's the end of the world"