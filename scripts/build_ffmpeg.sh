# !/bin/bash

if [ "$#" -lt 2 ]; then
	echo "usage build_ffmpeg <ffmpeg build path> <product path> <release/debug - optional>"
	exit
fi

FFMPEG_BUILD_PATH=$1
PRODUCT_ROOT_PATH=$2
BUILD_CONF=$3
OS=`uname`

echo "PRODUCT_ROOT_PATH=$PRODUCT_ROOT_PATH"

[ ! -e $FFMPEG_BUILD_PATH ] || mkdir -p "$FFMPEG_BUILD_PATH"
[ -z "$BUILD_CONF" ] && BUILD_CONF=Release

FFMPEG_SYMLINK=$PRODUCT_ROOT_PATH/node_addons/FormatConverter/build/${BUILD_CONF}/FFmpeg

echo "current path `pwd`"
echo "FFMPEG_BUILD_PATH=$FFMPEG_BUILD_PATH"
echo "FFMPEG_SYMLINK=$FFMPEG_SYMLINK"

if [ -d $FFMPEG_BUILD_PATH ]; then

    if [ -L "$FFMPEG_SYMLINK" ]; then
        rm $FFMPEG_SYMLINK
    fi

    curl -OL https://github.com/FFmpeg/FFmpeg/releases/download/n3.0/ffmpeg-3.0.tar.gz
    mv ./ffmpeg-3.0.tar.gz /var/tmp/ffmpeg-3.0.tar.gz

    tar -xzvf /var/tmp/ffmpeg-3.0.tar.gz -C $FFMPEG_BUILD_PATH
    ln -s $FFMPEG_BUILD_PATH/ffmpeg-3.0 $FFMPEG_SYMLINK
fi

pushd $FFMPEG_SYMLINK

    echo "current path `pwd`"

    debug_specifics=
    [ "$BUILD_CONF" = "Debug" ] &&  debug_specifics='--enable-debug --disable-optimizations'

    configFileName=./lastConfigure

    confCmd="./configure --disable-everything --disable-doc --enable-protocol=file --enable-demuxer=mpegts --enable-muxer=rtp_mpegts --enable-parser=h264 --enable-parser=aac --enable-muxer=mp4 --enable-zlib --enable-bsf=aac_adtstoasc --enable-decoder=aac --enable-decoder=h264 --enable-muxer=flv --enable-protocol=rtmp --enable-encoder=libmp3lame $debug_specifics"

    [ $OS == "Linux" ] && confCmd="$confCmd --enable-pic"

    actualCmd=""

   [ -f "$configFileName" ] && actualCmd=`cat $configFileName`

   echo -e "actualCmd=\n<$actualCmd>"
   echo -e "confCmd=\n<$confCmd>"
   if [ "$actualCmd" != "$confCmd" ]
   then
      echo "configuring ffmpeg..."
      eval "$confCmd"
   else
      echo "no need to run configure"
   fi

   echo "$confCmd" > $configFileName

   make &> /dev/null
popd


