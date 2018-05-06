#!/bin/bash

source initScript.sh

echo applying new configMapping

LOG_FILE_NAME=/var/log/liveController/kLiveController.log
CONTENT_DIR=/web/content/kLive
LIVE_CONTENT_PATH=${CONTENT_DIR}/live
LIVE_ARCHIVE_CONTENT_PATH=${CONTENT_DIR}/archive
WOWZA_ADMIN_USER=wowza
WOWZA_ADMIN_PASSWORD=wowza
RECORDING_FOLDER=${CONTENT_DIR}/liveRecorder
WOWZA_HOSTNAME=media-server


sed -e "s#@LIVE_CONTENT_PATH@#$LIVE_CONTENT_PATH#g" \
    -e "s#@LIVE_ARCHIVE_CONTENT_PATH@#$LIVE_ARCHIVE_CONTENT_PATH#g" \
    -e "s#@LOG_FILE_NAME@#$LOG_FILE_NAME#g" \
    -e "s#@KALTURA_SERVICE_URL@#$SERVICE_URL#g" \
    -e "s#@KALTURA_PARTNER_ADMIN_SECRET@#$PARTNER_ADMIN_SECRET#g" \
    -e "s#@KALTURA_PARTNER_ID@#$PARTNER_ID#g" \
    -e "s#@HOSTNAME@#$SERVER_NODE_HOST_NAME#g" \
    -e "s#@WOWZA_ADMIN_USER@#$WOWZA_ADMIN_USER#g" \
    -e "s#@WOWZA_ADMIN_PASSWORD@#$WOWZA_ADMIN_PASSWORD#g" \
    -e "s#@RECORDING_FOLDER@#$RECORDING_FOLDER#g" \
    ./common/config/configMapping.json.template > ./common/config/configMapping.json

cat ./common/config/configMapping.json

echo adding  $SERVER_NODE_HOST_NAME to backend
node ./deployment/addServerNode.js $SERVER_NODE_HOST_NAME
exec node ./lib/App.js
echo "it's the end of the world"