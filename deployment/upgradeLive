#!/bin/bash
# For upgrade just type ./upgradeLive <version>
# This uploads NVM
set -e
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" || (echo "nvm not found in $NVM_DIR, this is a must, Exiting!" ; exit 1 )
cd /opt/kaltura/liveController
echo updating liveController v$1
if [ ! -d "$1" ] ; then
	if [ -L "${latest}" ]; then
		echo "unlink ${latest}"
		unlink ${latest}
	fi
    echo Try to download  https://github.com/kaltura/liveDVR/archive/v$1.tar.gz
    wget https://github.com/kaltura/liveDVR/archive/v$1.tar.gz
    echo try to unzip v$1.tar.gz
    tar -xvzf v$1.tar.gz
    mv liveDVR-$1 $1
    cd $1
    nvm install
    # move configuration files (liveController's and liveRecorder's) to latest version
    cp /opt/kaltura/liveController/configMapping.json /opt/kaltura/liveController/$1/common/config/
    cp /opt/kaltura/liveController/configMapping.ini /opt/kaltura/liveController/$1/liveRecorder/Config/
    npm install
    cd ..
    # download binaries from Jenkins
    bash /opt/kaltura/liveController/$1/deployment/get_bins "$1"
    rm -rf /opt/kaltura/liveController/v$1.tar.gz
    # create symlinks to latest dir and process script
    ln -s /opt/kaltura/liveController/$1 /opt/kaltura/liveController/latest
    ln -s /opt/kaltura/liveController/latest/serviceWrappers/linux/kLiveController /etc/init.d/kLiveController
    # start nginx (web server), liveController and liveRecorder
    /opt/kaltura/liveController/$1/packager/bin/run_nginx.sh
    /etc/init.d/kLiveController restart
    /etc/init.d/recording_uploder.sh restart
else
    echo $1 is already exists
fi
