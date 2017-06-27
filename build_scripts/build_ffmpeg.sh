#!/bin/bash

#===============================================================================
#          FILE: build_ffmpeg.sh
#         USAGE: ./deploy_liveRecorder.sh
#   DESCRIPTION:
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR:  (),
#  ORGANIZATION: Kaltura, inc.
#       CREATED:
#      REVISION:  ---
#===============================================================================

if [ "$#" -lt 2 ]; then
	echo "usage build_ffmpeg <ffmpeg build path> <product path> [Release/Debug]"
	exit 1
fi

FFMPEG_BUILD_PATH=$1
PRODUCT_ROOT_PATH=$2
FFMPEG_VERSION=3.0
ADDON_BUILD_PATH=${PRODUCT_ROOT_PATH}/node_addons/FormatConverter/build/
FFMPEG_SYMLINK=${ADDON_BUILD_PATH}/FFmpeg
BUILD_CONF=Release
TMP_PATH=/var/tmp/
OS=`uname`
RES=0

echo "PRODUCT_ROOT_PATH=${PRODUCT_ROOT_PATH}"

mkdir -p "${FFMPEG_BUILD_PATH}"

[ "$3" = "Debug" ] && BUILD_CONF=Debug

echo "build mode ${BUILD_CONF}"

mkdir -p ${BUILD_CONF}


echo "current path `pwd`"
echo "FFMPEG_BUILD_PATH=${FFMPEG_BUILD_PATH}"
echo "ADDON_BUILD_PATH=${ADDON_BUILD_PATH}"

if [ -L ${FFMPEG_SYMLINK} ]; then
	echo "unlink ${FFMPEG_SYMLINK}"
	unlink ${FFMPEG_SYMLINK}
fi


if [ ! -r ${FFMPEG_SYMLINK} ]; then

	mkdir -p ${TMP_PATH}

	curl -L https://github.com/FFmpeg/FFmpeg/releases/download/n${FFMPEG_VERSION}/ffmpeg-${FFMPEG_VERSION}.tar.gz -o ${TMP_PATH}ffmpeg-${FFMPEG_VERSION}.tar.gz

	# note: if the second argument already exists and is a directory,
	# ln will create a symlink to the target inside that directory.

    tar -xzvf ${TMP_PATH}ffmpeg-${FFMPEG_VERSION}.tar.gz -C ${FFMPEG_BUILD_PATH}
    ln -s ${FFMPEG_BUILD_PATH}/ffmpeg-${FFMPEG_VERSION} ${FFMPEG_SYMLINK}
else
	echo "${FFMPEG_SYMLINK} exists skipping ffmpeg download"
fi

pushd ${FFMPEG_SYMLINK}

    echo "current path `pwd`"

    debug_specifics=
    [ "${BUILD_CONF}" = "Debug" ] &&  debug_specifics='--enable-debug --disable-optimizations'

    configFileName=./lastConfigure

    confCmd="./configure --disable-everything --disable-doc --enable-protocol=file --enable-demuxer=mpegts --enable-muxer=rtp_mpegts --enable-parser=h264 --enable-parser=aac --enable-muxer=mp4 --enable-zlib --enable-bsf=aac_adtstoasc --enable-decoder=aac --enable-decoder=h264 --enable-muxer=flv --enable-protocol=rtmp --enable-encoder=libmp3lame ${debug_specifics}"

    [ ${OS} == "Linux" ] && confCmd="${confCmd} --enable-pic"

      echo "configuring ffmpeg..."
      eval "${confCmd}"

     echo "version=${FFMPEG_VERSION} ${confCmd}" > ${configFileName}

   make &> /dev/null
popd
exit $RES

