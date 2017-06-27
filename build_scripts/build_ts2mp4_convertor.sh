#!/bin/bash

#===============================================================================
#          FILE: build_ts2mp4_convertor.sh
#         USAGE: ./deploy_liveRecorder.sh
#   DESCRIPTION:
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR:  (), Lilach Maliniak
#  ORGANIZATION: Kaltura, inc.
#       CREATED:  June 25, 2017
#      REVISION:  ---
#===============================================================================
set -e
if [ "$#" -lt 2 ]; then
	echo "usage build_ts2mp4_convertor <ffmpeg path> <product path>"
	exit 1
fi

FFMPEG_BUILD_PATH=$1
PRODUCT_ROOT_PATH=$2
TARGET=ts_to_mp4_convertor
CONVERTOR_DIR=${PRODUCT_ROOT_PATH}/${TARGET}
RES=0

export FFMPEG_BUILD_PATH


if [ -w ${CONVERTOR_DIR} ]; then
	pushd ${CONVERTOR_DIR}
		mkdir -p obj

		echo "starting to build ${TARGET}"

		make install

		if [ $? -eq 0 ] ; then
			echo "**************************************************************************************"
			echo "${TARGET} was built successfully, copying to bin folder"
			echo "**************************************************************************************"
		else
			echo "**************************************************************************************"
			echo "Something went wrong, failed to build ts_to_mp4_convertor!!!, please check build results"
			echo "**************************************************************************************"
			RES=1
		fi
	popd
else
	echo "**************************************************************************************"
	echo "{CONVERTOR_DIR} is missing or there is no write permission, can't build ${TARGET}"
	echo "**************************************************************************************"
	RES=1
fi

exit ${RES}
