#!/bin/bash

APP_NAME=liveRecorder
PREPDIR="/opt/kaltura/builds/${APP_NAME}"
BUILD_PATH=
WEBAPPDIR=/web/kaltura/${APP_NAME}
BUILD_FFMPEG_PATH=${WEBAPPDIR}/ffmpeg/ffmpeg-3.0
ROOT_PATH=.
TARGET=ts_to_mp4_convertor
BIN_DIR=${ROOT_PATH}/../bin/
BUILD_FFMPEG_PATH=

if [ -e $PREPDIR ]; then
	ROOT_PATH==${PREPDIR}/${APP_VERSION}
	CONVERTOR_DIR=${ROOT_PATH}/${TARGET}
	BUILD_PATH=${CONVERTOR_DIR}/obj
	BUILD_FFMPEG_PATH=${WEBAPPDIR}/ffmpeg/ffmpeg-3.0
else
	SCRIPT_DIR="$( dirname "${BASH_SOURCE[0]}" )"
	CONVERTOR_DIR=${SCRIPT_DIR}/../${TARGET}
	BUILD_PATH=${CONVERTOR_DIR}/obj
	BUILD_FFMPEG_PATH="../../node_addons/FormatConverter/build/FFmpeg"
fi

TARGET_FULL_PATH=${BUILD_PATH}/${TARGET}
export BUILD_FFMPEG_PATH
echo "FFMPEG_SOURCE_DIR=${FFMPEG_SOURCE_DIR}"
echo "TARGET_FULL_PATH=${TARGET_FULL_PATH}"
BASH_VERSION="${BASH_VERSINFO[0]}.${BASH_VERSINFO[1]}"
echo BASH_VERSION=${BASH_VERSION}
echo "BIN_DIR=${BIN_DIR}"
echo "make FFMPEG_SOURCE_DIR=${BUILD_FFMPEG_PATH}"
echo uname=$(uname)


if [ -e $CONVERTOR_DIR ]; then
	pushd $CONVERTOR_DIR
		mkdir -p obj
		[ -e  ${TARGET} ] && rm -f ${TARGET}
		[ -e  obj/${TARGET} ] && rm -f obj/${TARGET}

		echo "starting to build ${TARGET} from ${PWD}"

		make

		if [ -s  obj/${TARGET} ] ; then
			echo "**************************************************************************************"
			echo "${TARGET} was built successfully, copying to bin folder"
			echo "**************************************************************************************"
			mkdir -p bin
			echo "cp obj/${TARGET} bin"
			cp obj/${TARGET}  bin
		else
			echo "**************************************************************************************"
			echo "Something went wrong, failed to build ts_to_mp4_convertor!!!, please check build results"
			echo "**************************************************************************************"
			exit 1
		fi
	popd
else
	echo "**************************************************************************************"
	echo "${ROOT_DIR}/${CONVERTOR_DIR} folder is missing, can't build ${TARGET}"
	echo "**************************************************************************************"
	exit 1
fi
