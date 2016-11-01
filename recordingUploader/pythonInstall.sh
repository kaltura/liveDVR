    #!/bin/sh

#  pythonInstall.sh
#  
#
#  Created by Ron Yadgar on 25/09/2016.
#
SOURCE_DIRECTORY="/opt/kaltura/liveController/latest"
HOME_DIRECTORY=`grep recording_base_dir $SOURCE_DIRECTORY/recordingUploader/Config/config.ini | awk '{ print $3 }'`
HOSTNAME=$(hostname)
HOSTNAME_DIRECTORY="$HOME_DIRECTORY/$HOSTNAME"
echo "home directory $HOME_DIRECTORY"
if [ ! -d $HOME_DIRECTORY ]; then
echo "ERROR: can't find recording path"
exit
fi
if ! [[ $(python --version 2>&1) == *2\.7\.1[012] ]]; then
echo "Requrie python version 2.7.x";
exit
fi
pip install  poster
pip install psutil
easy_install pycrypto
pip install watchdog
mkdir -p $HOME_DIRECTORY
mkdir -p "$HOME_DIRECTORY/recordings"
mkdir -p "$HOME_DIRECTORY/error"
mkdir -p "$HOME_DIRECTORY/incoming"
mkdir -p $HOSTNAME_DIRECTORY
UPLOAD_TASK_DIRECTORY="$HOSTNAME_DIRECTORY/UploadTask"
CONCATINATION_TASK_DIRECTORY="$HOSTNAME_DIRECTORY/ConcatenationTask"
mkdir  -p $CONCATINATION_TASK_DIRECTORY
ln -s  $CONCATINATION_TASK_DIRECTORY "$HOME_DIRECTORY/incoming"
mkdir -p "$CONCATINATION_TASK_DIRECTORY/failed"
mkdir -p "$CONCATINATION_TASK_DIRECTORY/processing"
mkdir -p $UPLOAD_TASK_DIRECTORY
mkdir -p "$UPLOAD_TASK_DIRECTORY/failed"
mkdir -p "$UPLOAD_TASK_DIRECTORY/incoming"
mkdir -p "$UPLOAD_TASK_DIRECTORY/processing"
