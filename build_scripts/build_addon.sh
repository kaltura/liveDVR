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
	echo "usage  : $0 <product path> <ffmpeg path> [Release/Debug]"
	echo "example: $0 /opt/kaltura/liveController/v1.14.5 /opt/kaltura/liveController/v1.14.5/bin/ffmpeg/ffmpeg-3.0 Release"
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

echo "PRODUCT_ROOT=${PRODUCT_ROOT}"
echo "FFMPEG_PATH=${FFMPEG_PATH}"
echo "BUILD_CONF=${BUILD_CONF}"

mkdir -p ${PRODUCT_ROOT_PATH}/bin
mkdir -p ${ADDON_PATH}/build

# note: if the second argument already exists and is a directory,
# ln will create a symlink to the target inside that directory.

if [  -L ${FFMPEG_SYMLINK} ]; then
	echo "unlink ${FFMPEG_SYMLINK}"
	unlink ${FFMPEG_SYMLINK}
fi

if [ ! -r ${FFMPEG_SYMLINK} ]; then
	echo "ln -s ${FFMPEG_PATH} ${FFMPEG_SYMLINK}"
	ln -s ${FFMPEG_PATH} ${FFMPEG_SYMLINK}
fi

pushd ${ADDON_PATH}

	mkdir -p ${BUILD_CONF}

	`which node-gyp` || npm install node-gyp -g

	case ${OS} in
	'Darwin')
	    echo "Mac OS"
	    GYP_ARGS='-- -f xcode'
	    echo "${GYP_ARGS}"
	    node-gyp configure ${GYP_ARGS}
	    FORMAT_CONVERTER_BIN=FormatConverter.dylib
	    ;;
	*) ;;
	esac

	echo "Start node-gyp configure"
	node-gyp configure

	if [ "${BUILD_CONF}" = "Debug" ]; then
	    GYP_DEBUG="--debug"
	    DEBUG_EXT=".debug"
	fi
	echo "Start node-gyp build. ${GYP_DEBUG}"
	node-gyp build ${GYP_DEBUG} -v

    if [ -r "build/${BUILD_CONF}/${FORMAT_CONVERTER_BIN}"  ]; then
		echo "cp build/${BUILD_CONF}/${FORMAT_CONVERTER_BIN} ${PRODUCT_ROOT_PATH}/bin/FormatConverter.node${DEBUG_EXT}"
		cp "build/${BUILD_CONF}/${FORMAT_CONVERTER_BIN}" "${PRODUCT_ROOT_PATH}/bin/FormatConverter.node${DEBUG_EXT}"
		echo "### build finished successfully"
	else
		echo "### build failed, could not access build/${BUILD_CONF}/${FORMAT_CONVERTER_BIN}, check if file exists"
		RES=1
	fi

popd

exit ${RES}
