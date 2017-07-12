    #!/bin/sh

#  pythonInstall.sh
#  
#
#  Created by Ron Yadgar on 25/09/2016.
#
SOURCE_DIRECTORY="/opt/kaltura/liveController/latest"
HOME_DIRECTORY=`grep recording_base_dir $SOURCE_DIRECTORY/liveRecorder/Config/config.ini | awk '{ print $3 }'`
HOSTNAME=$(hostname)
HOSTNAME_DIRECTORY="$HOME_DIRECTORY/$HOSTNAME"
echo "home directory $HOME_DIRECTORY"
if [ ! -d $HOME_DIRECTORY ]; then
    echo "ERROR: can't find recording path"
    exit 1
fi
if ! [[ $(python --version 2>&1) == *2\.7\.* ]]; then
    echo "Python version >= 2.7.0 is required";
    exit 2
fi
pip install  poster
pip install psutil
pip install m3u8
pip install schedule
pip install pycrypto
mkdir -p $HOME_DIRECTORY
mkdir -p "$HOME_DIRECTORY/recordings"
mkdir -p "$HOME_DIRECTORY/recordings/newSession"
mkdir -p "$HOME_DIRECTORY/recordings/append"
mkdir -p "$HOME_DIRECTORY/error"
mkdir -p "$HOME_DIRECTORY/incoming"
mkdir -p $HOSTNAME_DIRECTORY
UPLOAD_TASK_DIRECTORY="$HOSTNAME_DIRECTORY/UploadTask"
CONCATINATION_TASK_DIRECTORY="$HOSTNAME_DIRECTORY/ConcatenationTask"
mkdir  -p $CONCATINATION_TASK_DIRECTORY
ln -s "$HOME_DIRECTORY/incoming" "$CONCATINATION_TASK_DIRECTORY/incoming"
mkdir -p "$CONCATINATION_TASK_DIRECTORY/failed"
mkdir -p "$CONCATINATION_TASK_DIRECTORY/processing"
mkdir -p $UPLOAD_TASK_DIRECTORY
mkdir -p "$UPLOAD_TASK_DIRECTORY/failed"
mkdir -p "$UPLOAD_TASK_DIRECTORY/incoming"
mkdir -p "$UPLOAD_TASK_DIRECTORY/processing"
cp $SOURCE_DIRECTORY/recordingUploader/liveRecorder.sh /etc/init.d/liveRecorder
/etc/init.d/liveRecorder.sh restart
