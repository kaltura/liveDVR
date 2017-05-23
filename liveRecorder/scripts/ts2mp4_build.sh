#!/bin/bash

# default bash version in Darwin is currently (May 2017), 3.2.
# the version doesn't support {$a,,} or {$a,} to change string to lower or upper case

APP_NAME=liveRecorder
PREPDIR="/opt/kaltura/builds/${APP_NAME}"
BUILD_PATH=
WEBAPPDIR=/web/kaltura/${APP_NAME}
BUILD_FFMPEG_PATH=${WEBAPPDIR}/ffmpeg/ffmpeg-3.0
ROOT_PATH=.
TARGET=ts_to_mp4_convertor
BIN_DIR=
BUILD_FFMPEG_PATH=

if [ -e $PREPDIR ]; then
	ROOT_PATH==${PREPDIR}/${APP_VERSION}
	CONVERTOR_DIR=${TARGET}
	BUILD_PATH=${ROOT_PATH}/${$CONVERTOR_DIR}
	BUILD_FFMPEG_PATH=${WEBAPPDIR}/ffmpeg/ffmpeg-3.0
elif [ -e ../${TARGET} ]; then
	CONVERTOR_DIR=../${TARGET}
	BUILD_PATH=../${TARGET}
	BUILD_FFMPEG_PATH=../../node_addons/FormatConverter/build/FFmpeg
fi

if [ -e $CONVERTOR_DIR ]; then
	echo "CONVERTOR_DIR=${CONVERTOR_DIR}, running make to create ${TARGET}"
	echo uname=$(uname)
	uname=$(uname)
	OS=darwin

	pushd $BUILD_PATH
		mkdir -p obj
		[ -e  $BUILD_PATH/${TARGET} ] && rm -f ${TARGET}
		[ -e  obj/${TARGET} ] && rm -f obj/${TRAGET}
		if ((BASH_VERSINFO[0] >= 4)); then
			OS=\${uname,,}
			dpkg -l yasm || (echo "yasm is not installed, please install it" ; exit 1)
		else
			OS=$(echo $uname | tr '[:upper:]' '[:lower:]')
		fi
		BIN_DIR=${ROOT_PATH}/../bin/${OS}/
		echo "OS=${OS}"
		echo "BIN_DIR=${BIN_DIR}"
		echo "make FFMPEG_LIB_DIR=${BUILD_FFMPEG_PATH}"
		make FFMPEG_LIB_DIR=${BUILD_FFMPEG_PATH}
		if [ -s  ${BUILD_PATH}/obj/${TARGET} ] ; then
			echo "**************************************************************************************"
			echo "${TARGET} was built successfully, copying to bin folder"
			echo "**************************************************************************************"
			mkdir -p ${ROOT_PATH}/bin/${OS}
			echo "cp ${BUILD_PATH}/obj/${TARGET} ${BIN_DIR}"
			cp ${BUILD_PATH}/obj/${TARGET} ${BIN_DIR}
		else
			echo "**************************************************************************************"
			echo "Something is wrong, failed to build ts_to_mp4_convertor!!!, please check build results"
			echo "**************************************************************************************"
			exit 1
		fi
	popd
else
	echo "**************************************************************************************"
	echo "${ROOT_DIR}/${$CONVERTOR_DIR} folder is missing, can't build ${TARGET}"
	echo "**************************************************************************************"
	exit 1
fi
