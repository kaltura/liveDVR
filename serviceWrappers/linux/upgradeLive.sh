#!/bin/bash
# For upgrade just type ./upgradeLive <version>
# This uploads NVM
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" || (echo "nvm not found in $NVM_DIR, this is a must, Exiting!" ; exit 1 )
cd /opt/kaltura/liveController
echo updating liveController v.$1
if [ ! -d "$1" ] ; then
    if [ ! -L "$latest" ] ; then
        echo Try to download  https://github.com/kaltura/liveDVR/archive/v$1.tar.gz
        wget https://github.com/kaltura/liveDVR/archive/v$1.tar.gz
        echo try to unzip v$1.tar.gz
        tar -xvzf v$1.tar.gz
        mv liveDVR-$1 $1
        cd $1
        nvm install
        cp /opt/kaltura/liveController/latest/common/config/configMapping.json /opt/kaltura/liveController/$1/common/config/
        cp /opt/kaltura/liveController/latest/liveRecorder/Config/configMapping.ini /opt/kaltura/liveController/$1/liveRecorder/Config/
        npm install
        cd ..
        unlink /opt/kaltura/liveController/latest
        ln -s /opt/kaltura/liveController/$1 /opt/kaltura/liveController/latest
        ln -s /opt/kaltura/liveController/latest/serviceWrappers/linux/kLiveController /etc/init.d/kLiveController
        /etc/init.d/kLiveController restart
        /etc/init.d/recording_uploder.sh restart
        # also better to call dvr saas config
        echo "Warning: live-dvr-saas-config is not updated"
        rm -rf /opt/kaltura/liveController/v$1.tar.gz
        /opt/kaltura/liveController/latest/packager/bin/run_nginx.sh
    else
        echo "No previous version found"
    fi
else
    echo $1 is allready exsist
fi
