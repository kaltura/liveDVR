    #!/bin/sh

#  pythonInstall.sh
#  
#
#  Created by Ron Yadgar on 25/09/2016.
#
SOURCE_DIRECTORY="/opt/kaltura/liveController/latest"
HOME_DIRECTORY=`grep recording_base_dir $SOURCE_DIRECTORY/recordingUploader/config.ini | awk '{ print $3 }'`
HOSTNAME=$(hostname)
HOSTNAME_DIRECTORY="$HOME_DIRECTORY/$HOSTNAME"
FFMPEG_PATH=`grep ffmpeg_path $SOURCE_DIRECTORY/recordingUploader/config.ini | awk '{ print $3 }'`
echo "home directory $HOME_DIRECTORY"
if [ ! -d $HOME_DIRECTORY ]; then
echo "ERROR: can't find recording path"
exit
fi
if ! [[ $(python --version 2>&1) == *2\.7\.1[012] ]]; then
echo "Requrie python version 2.7.x";
exit
fi
wget -O /tmp http://cdnbakmi.kaltura.com/content/clientlibs/python_22-06-2016.tar.gz
tar -zxvf /tmp/python_22-06-2016.tar.gz
cd /tmp/python/
python setup.py install
pip install  poster
mkdir $HOME_DIRECTORY
mkdir "$HOME_DIRECTORY/recordings"
mkdir "$HOME_DIRECTORY/error"
mkdir "$HOME_DIRECTORY/incoming"
mkdir $HOSTNAME_DIRECTORY
UPLOAD_TASK_DIRECTORY="$HOSTNAME_DIRECTORY/UploadTask"
CONCATINATION_TASK_DIRECTORY="$HOSTNAME_DIRECTORY/ConcatenationTask"
mkdir $CONCATINATION_TASK_DIRECTORY
ln -s "$HOME_DIRECTORY/incoming" $CONCATINATION_TASK_DIRECTORY
mkdir "$CONCATINATION_TASK_DIRECTORY/failed"
mkdir "$CONCATINATION_TASK_DIRECTORY/processing"
mkdir $UPLOAD_TASK_DIRECTORY
mkdir "$UPLOAD_TASK_DIRECTORY/failed"
mkdir "$UPLOAD_TASK_DIRECTORY/incoming"
mkdir "$UPLOAD_TASK_DIRECTORY/processing"
if [ ! -f $FFMPEG_PATH ]; then
echo "Warning: can't find ffmpeg path"
exit
fi
