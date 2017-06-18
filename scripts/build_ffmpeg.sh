# !/bin/bash

ROOT_PATH=`dirname ${BASH_SOURCE[0]}`
PREPDIR="/opt/kaltura/builds/${APP_NAME}"
FFMPEG_ROOT_PATH=

[ "FFMPEG_BUILD_MODE" != "Debug" ] && echo "target config: release" ||  echo "target config: debug"


if [ -e $PREPDIR ]; then
	FFMPEG_ROOT_PATH=$PREPDIR/node_addons/FormatConverter/build
else
	FFMPEG_ROOT_PATH=$ROOT_PATH/../node_addons/FormatConverter/build
fi

	FFMPEG_DEV_PATH=$FFMPEG_ROOT_PATH/FFmpeg

	echo "FFMPEG_ROOT_PATH=$FFMPEG_ROOT_PATH"


function makeFFmpeg()
{
	echo "FFMPEG_DEV_PATH=$FFMPEG_DEV_PATH"
    echo "FFMPEG_INSTALL_PATH=$FFMPEG_INSTALL_PATH"

    echo "current path [$ROOT_PATH]"

    if [ -e $FFMPEG_INSTALL_PATH ]
    then
        curl -OL https://github.com/FFmpeg/FFmpeg/releases/download/n3.0/ffmpeg-3.0.tar.gz
        mv ./ffmpeg-3.0.tar.gz /var/tmp/ffmpeg-3.0.tar.gz

        tar -xzvf /var/tmp/ffmpeg-3.0.tar.gz -C $FFMPEG_INSTALL_PATH
        ln -s $FFMPEG_INSTALL_PATH/ffmpeg-3.0 $FFMPEG_DEV_PATH
    fi

    pushd $FFMPEG_DEV_PATH

        echo "current path `pwd`"

        debug_specifics=
        [ "$BUILD_CONF" = "Debug" ] &&  debug_specifics='--enable-debug --disable-optimizations'

        configFileName=./lastConfigure

        confCmd="./configure --disable-everything --disable-doc --enable-protocol=file --enable-demuxer=mpegts --enable-muxer=rtp_mpegts --enable-parser=h264 --enable-parser=aac --enable-muxer=mp4 --enable-zlib --enable-bsf=aac_adtstoasc --enable-decoder=aac --enable-decoder=h264 --enable-muxer=flv --enable-protocol=rtmp --enable-encoder=libmp3lame $debug_specifics"

        [ "$os_name" == "Linux" ] && confCmd="$confCmd --enable-pic"

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

}

makeFFmpeg

