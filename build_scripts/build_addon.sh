#!/bin/bash

#===============================================================================
#          FILE: build_addon.sh
#         USAGE: ./deploy_liveRecorder.sh
#   DESCRIPTION:
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR:  (), Lilach Maliniak
#  ORGANIZATION: Kaltura, inc.
#       CREATED: June 25 2017
#      REVISION:  ---
#===============================================================================
set -e
if [ "$#" -lt 2 ]; then
	echo "usage build_addon <product path> <ffmpeg path> [Release/Debug]"
	exit 1
fi

PRODUCT_ROOT_PATH=$1
FFMPEG_PATH=$2
BUILD_CONF=Release
ADDON_PATH=${PRODUCT_ROOT_PATH}/node_addons/FormatConverter/
FFMPEG_SYMLINK=${ADDON_PATH}/build/FFmpeg
FORMAT_CONVERTER_BIN=FormatConverter.so
OS=`uname`
RES=0

echo "OS=$OS"

[ "$3" = "Debug" ] && BUILD_CONF=Debug

echo "current path `pwd`"
echo "PRODUCT_ROOT=${PRODUCT_ROOT}"
echo "FFMPEG_PATH=${FFMPEG_PATH}"
echo "BUILD_CONF=${BUILD_CONF}"

mkdir -p ${PRODUCT_ROOT_PATH}/bin
mkdir -p ${ADDON_PATH}

# note: if the second argument already exists and is a directory,
# ln will create a symlink to the target inside that directory.

if [  -L ${FFMPEG_SYMLINK} ]; then
	echo "unlink ${FFMPEG_SYMLINK}"
	unlink ${FFMPEG_SYMLINK}
fi

if [ ! -r ${FFMPEG_SYMLINK} ]; then
	echo "ln -s ${FFMPEG_PATH} ${FFMPEG_SYMLINK}"
	ln -s ${FFMPEG_PATH} ${FFMPEG_SYMLINK}
else
	echo "failed to unlink ${FFMPEG_PATH}"
	exit 1
fi


pushd ${ADDON_PATH}

	mkdir -p ${BUILD_CONF}

	`which node-gyp` || npm install node-gyp -g

	gyp_args=''

	case ${OS} in
	'Darwin')
	    echo "Mac OS"
	    gyp_args='-- -f xcode'
	    echo "${gyp_args}"
	    node-gyp configure ${gyp_args}
	    FORMAT_CONVERTER_BIN=FormatConverter.dylib
	    ;;
	*) ;;
	esac

	echo "Start node-gyp configure"
	node-gyp configure

	debugExt=''

	if [ "${BUILD_CONF}" = "Debug" ]; then
	    gyp_debug="--debug"
	    debugExt=".debug"
	fi
	echo "Start node-gyp build. ${gyp_debug}"
	node-gyp build ${gyp_debug} -v

    if [ -r "build/${BUILD_CONF}/${FORMAT_CONVERTER_BIN}"  ]; then
		echo "cp build/${BUILD_CONF}/${FORMAT_CONVERTER_BIN} ${PRODUCT_ROOT_PATH}/bin/FormatConverter.node${debugExt}"
		cp "build/${BUILD_CONF}/${FORMAT_CONVERTER_BIN}" "${PRODUCT_ROOT_PATH}/bin/FormatConverter.node${debugExt}"
		echo "### build finished successfully"
	else
		echo "### build failed, could not find ${BUILD_CONF}/${FORMAT_CONVERTER_BIN}, check for errors"
		RES=1
	fi

popd

exit ${RES}