# !/bin/bash

if [ "$#" -lt 2 ]; then
	echo "usage build_ffmpeg <ffmpeg build path> <product path> [Release/Debug]"
	exit
fi

FFMPEG_BUILD_PATH=$1
PRODUCT_ROOT_PATH=$2
FFMPEG_VERSION=3.0
ADDON_BUILD_PATH=$PRODUCT_ROOT_PATH/node_addons/FormatConverter/build/
FFMPEG_SYMLINK=$ADDON_BUILD_PATH/FFmpeg
BUILD_CONF=Release
OS=`uname`

echo "PRODUCT_ROOT_PATH=$PRODUCT_ROOT_PATH"

mkdir -p "$FFMPEG_BUILD_PATH"

[ "$#" -eq 3 && "$3" = "Debug" ] && BUILD_CONF=$3

echo "build mode $BUILD_CONF"

mkdir -p ${BUILD_CONF}


echo "current path `pwd`"
echo "FFMPEG_BUILD_PATH=$FFMPEG_BUILD_PATH"
echo "ADDON_BUILD_PATH=$ADDON_BUILD_PATH"

echo "unlink $FFMPEG_SYMLINK"
unlink $FFMPEG_SYMLINK


if [ ! -r $FFMPEG_SYMLINK ]; then

	curl -L https://github.com/FFmpeg/FFmpeg/releases/download/n3.0/ffmpeg-$FFMPEG_VERSION.tar.gz -o /tmp/ffmpeg-$FFMPEG_VERSION.tar.gz

	# note: if the second argument already exists and is a directory,
	# ln will create a symlink to the target inside that directory.

    tar -xzvf /var/tmp/ffmpeg-$FFMPEG_VERSION.tar.gz -C $FFMPEG_BUILD_PATH
    ln -s $FFMPEG_BUILD_PATH/ffmpeg-$FFMPEG_VERSION $FFMPEG_SYMLINK
else
	echo "$FFMPEG_SYMLINK exists skipping ffmpeg download"
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


