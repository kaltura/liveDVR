#!/bin/bash

echo "statrting nginx"
cd /opt/nginx-vod-module-saas/conf/


CONF_FOLDER=/usr/local/nginx/externalConf
PORT=80
WWW_DIR=/opt/nginx-vod-module-saas/static/
LIVE_ENCRYPT_HLS_KEY=1234
CONTENT_DIR=/web/content/kLive

if [ "$(ls -A $CONF_FOLDER)" ]; then
    echo "copy configuration"
    cp -r $CONF_FOLDER/* /opt/nginx-vod-module-saas/

else
    echo "create configuration from templates"

    sed -e "s#@PORT@#$PORT#g"   -e "s#@WWW_DIR@#$WWW_DIR#g"   ./nginx.conf.template > ./nginx.conf

    sed -e "s#@LIVE_ENCRYPT_HLS_KEY@#$LIVE_ENCRYPT_HLS_KEY#g"  ./nginx.conf.live.protocols.template > ./nginx.conf.live.protocols

    sed -e "s#@CONTENT_DIR@#$CONTENT_DIR#g"   ./nginx.conf.live.bootstrap.template > ./nginx.conf.live.bootstrap

    cp ./nginx.conf.live.conf.template  ./nginx.conf.live.conf
fi

echo "start process"
/usr/local/nginx/sbin/nginx -g "daemon off;"
