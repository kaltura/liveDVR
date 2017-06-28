#!/bin/bash

#===============================================================================
#          FILE: build_ffmpeg.sh
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
	echo "usage  : $0 <ffmpeg build path> <ffmpeg version> [Release/Debug]"
	echo "example: $0 /opt/kaltura/liveController/v1.14.5 /opt/kaltura/liveController/v1.14.5/bin/ffmpeg 3.0"
	exit 1
fi

FFMPEG_BUILD_PATH=$1
FFMPEG_VERSION=$2
BUILD_CONF=Release
TMP_PATH=/var/tmp
OS=`uname`

[ "${OS}" = "Darwin" ] && TMP_PATH=.
[ "$3" = "Debug" ] && BUILD_CONF=Debug

echo "build mode ${BUILD_CONF}"
echo "TMP_PATH=${TMP_PATH}"
echo "FFMPEG_BUILD_PATH=${FFMPEG_BUILD_PATH}"

mkdir -p ${FFMPEG_BUILD_PATH}
mkdir -p ${TMP_PATH}

echo "Fetching tar from https://github.com/FFmpeg/FFmpeg/releases/download/n${FFMPEG_VERSION}/ffmpeg-${FFMPEG_VERSION}.tar.gz"
curl -sL https://github.com/FFmpeg/FFmpeg/releases/download/n${FFMPEG_VERSION}/ffmpeg-${FFMPEG_VERSION}.tar.gz -o ${TMP_PATH}/ffmpeg-${FFMPEG_VERSION}.tar.gz

echo "opening tarball ${TMP_PATH}/ffmpeg-${FFMPEG_VERSION}.tar.gz"
tar -xzf ${TMP_PATH}/ffmpeg-${FFMPEG_VERSION}.tar.gz -C ${FFMPEG_BUILD_PATH}

cd ${FFMPEG_BUILD_PATH}/ffmpeg-${FFMPEG_VERSION}

[ "${BUILD_CONF}" = "Debug" ] &&  DEBUG_SPECIFICS='--enable-debug --disable-optimizations'

CONFIG_FILENAME=./lastConfigure

CONF_CMD="./configure --disable-everything --disable-doc --enable-protocol=file --enable-demuxer=mpegts --enable-muxer=rtp_mpegts --enable-parser=h264 --enable-parser=aac --enable-muxer=mp4 --enable-zlib --enable-bsf=aac_adtstoasc --enable-decoder=aac --enable-decoder=h264 --enable-muxer=flv --enable-protocol=rtmp --enable-encoder=libmp3lame ${DEBUG_SPECIFICS}"

[ "${OS}" = "Linux" ] && CONF_CMD="${CONF_CMD} --enable-pic"
[ "${OS}" = "Darwin" ] && CONF_CMD="${CONF_CMD} --disable-static --enable-shared"

echo "configuring ffmpeg..."
eval "${CONF_CMD}"

echo "Saving configs to ${CONFIG_FILENAME} for traceability"
echo "version=${FFMPEG_VERSION} ${CONF_CMD}" > ${CONFIG_FILENAME}

echo "### starting ffmpeg build..."

make

echo "### ffmpeg build finished successfully. ffmpeg path: ${FFMPEG_BUILD_PATH}"