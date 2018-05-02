#!/bin/bash


LOGDIR=/var/log/liveRecorder
HOSTNAME=`hostname`
RECORDING_FOLDER=/web/content/kLive/liveRecorder


sed -e "s#@HOSTNAME@#.*#g" \
    -e "s#@RECORDING_FOLDER@#$RECORDING_FOLDER#g" \
    -e "s#@KALTURA_PARTNER_ADMIN_SECRET@#$PARTNER_ADMIN_SECRET#g" \
    -e "s#@KALTURA_PARTNER_ID@#$PARTNER_ID#g" \
    -e "s#@VOD_UPLOAD_MODE@#remote#g" \
    -e "s#@LIVE_PACKAGER_TOKEN@#$PACKAGER_SECURE_TOKEN#g" \
    -e "s#@LOGS_BASE_PATH@#$LOGDIR#g" \
    -e "s#@KALTURA_SERVICE_URL@#$SERVICE_URL#g" \
    ./Config/configMapping.ini.template > ./Config/configMapping.ini

pwd
cat  ./Config/configMapping.ini

createFolders() {
	[ -d ${LOGDIR} ] || mkdir -p ${LOGDIR}
	[ -d ${RECORDING_FOLDER} ] || mkdir -p ${RECORDING_FOLDER}

	#create recording folders if they are not there
	mkdir -p ${RECORDING_FOLDER}/{incoming,done,error}
	mkdir -p ${RECORDING_FOLDER}/recordings/{append,newSession}

	SHARED_APP_DIR=$RECORDING_FOLDER
	echo "Creating folders in ${SHARED_APP_DIR} for ${HOSTNAME}"
	if [ -d  ${SHARED_APP_DIR} ] ; then
		mkdir -p ${SHARED_APP_DIR}/${HOSTNAME}/{UploadTask/{incoming,failed,processing},ConcatenationTask/{failed,processing}}
		[ -L ${SHARED_APP_DIR}/${HOSTNAME}/ConcatenationTask/incoming ] || ln -s ${RECORDING_FOLDER}/incoming ${SHARED_APP_DIR}/${HOSTNAME}/ConcatenationTask/incoming
	else
		echo "can't find ${SHARED_APP_DIR}, cannot start, check mounts"
		exit 2
	fi
}

echo "starting liveRecorder..."
createFolders || exit 4
python main.py
echo "ok!"


