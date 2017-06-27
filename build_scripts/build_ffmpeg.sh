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
	echo "usage build_ffmpeg <ffmpeg build path> <product path> [Release/Debug]"
	exit 1
fi

FFMPEG_BUILD_PATH=$1
PRODUCT_ROOT_PATH=$2
FFMPEG_VERSION=3.0
BUILD_CONF=Release
TMP_PATH=/var/tmp/
OS=`uname`

[ "$3" = "Debug" ] && BUILD_CONF=Debug

echo "current path `pwd`"
echo "PRODUCT_ROOT_PATH=${PRODUCT_ROOT_PATH}"
echo "build mode ${BUILD_CONF}"
echo "current path `pwd`"
echo "FFMPEG_BUILD_PATH=${FFMPEG_BUILD_PATH}"

mkdir -p "${FFMPEG_BUILD_PATH}"
mkdir -p ${BUILD_CONF}
mkdir -p ${TMP_PATH}

curl -L https://github.com/FFmpeg/FFmpeg/releases/download/n${FFMPEG_VERSION}/ffmpeg-${FFMPEG_VERSION}.tar.gz -o ${TMP_PATH}ffmpeg-${FFMPEG_VERSION}.tar.gz

echo "opening tarball ${TMP_PATH}ffmpeg-${FFMPEG_VERSION}.tar.gz"

tar -xzf ${TMP_PATH}ffmpeg-${FFMPEG_VERSION}.tar.gz -C ${FFMPEG_BUILD_PATH}

debug_specifics=
[ "${BUILD_CONF}" = "Debug" ] &&  debug_specifics='--enable-debug --disable-optimizations'

configFileName=./lastConfigure

confCmd="./configure --disable-everything --disable-doc --enable-protocol=file --enable-demuxer=mpegts --enable-muxer=rtp_mpegts --enable-parser=h264 --enable-parser=aac --enable-muxer=mp4 --enable-zlib --enable-bsf=aac_adtstoasc --enable-decoder=aac --enable-decoder=h264 --enable-muxer=flv --enable-protocol=rtmp --enable-encoder=libmp3lame ${debug_specifics}"

[ ${OS} == "Linux" ] && confCmd="${confCmd} --enable-pic"

echo "configuring ffmpeg..."
eval "${confCmd}"

echo "version=${FFMPEG_VERSION} ${confCmd}" > ${configFileName}

make


