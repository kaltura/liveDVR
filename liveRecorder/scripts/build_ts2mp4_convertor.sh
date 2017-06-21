#!/bin/bash

if [ "$#" -lt 2 ]; then
	echo "usage build_ts2mp4_convertor <ffmpeg build path> <product path>"
	exit
fi

FFMPEG_BUILD_PATH=$1
PRODUCT_ROOT_PATH=$2
TARGET=ts_to_mp4_convertor
CONVERTOR_DIR=${PRODUCT_ROOT_PATH}/${TARGET}

export FFMPEG_BUILD_PATH

echo "OS=$(uname)"


if [ -e $CONVERTOR_DIR ]; then
	pushd $CONVERTOR_DIR
		mkdir -p obj
		[ -e  ${TARGET} ] && rm -f ${TARGET}
		[ -e  obj/${TARGET} ] && rm -f obj/${TARGET}

		echo "starting to build ${TARGET}"

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
