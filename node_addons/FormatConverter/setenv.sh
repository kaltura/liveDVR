# !/bin/bash

ROOT_PATH=`dirname ${BASH_SOURCE[0]}`
echo "ROOT_PATH=$ROOT_PATH"
FFMPEG_DOWNLOAD_PATH=~/
# for Darwin recommended:
# FFMPEG_DOWNLOAD_PATH=~/Documents/
BIN_PATH=$ROOT_PATH/../../bin
FFMPEG_DEV_PATH=
FORMAT_CONVERTER_BIN=FormatConverter.so
PREPDIR="/opt/kaltura/builds/${APP_NAME}"
BUILD_CONF=Release

while [ "$1" != "" ]; do
	key="$1"

    case $key in
        -p | --path )
                    shift
			        BIN_PATH=$1
			        #[ ! -e $1 ] && $BIN_PATH=$PREPDIR/$FFMPEG_BIN_DIR
			        echo "-p | --path $1"
			        shift
        ;;
        -m | --mode )
                    shift
                    [ $1 = 'debug' ] && BUILD_CONF=Debug || BUILD_CONF=Release
			        echo "-m | --mode $1"
			        shift
		;;
        -h | --help )
			        echo "-p | --path [full path], FormatConverter bin path"
			        echo "-m | --mode [debug/release], the build mode debug/release"
			        exit
		;;
        * )
                    echo "$1 is invalid arguments"
                    exit
        ;;
    esac

done


[ "$BUILD_CONF" != "Debug" ] && echo "target config: release" ||  echo "target config: debug"

FFMPEG_BUILD_PATH=$ROOT_PATH/build/$BUILD_CONF
echo "FFMPEG_BUILD_PATH=$FFMPEG_BUILD_PATH"

[ -d "$FFMPEG_BUILD_PATH" ] || mkdir -p "FFMPEG_BUILD_PATH"

if [ -e $PREPDIR ]; then
	FFMPEG_DEV_PATH=$PREPDIR/node_addons/FormatConverter/build/FFmpeg
else
	FFMPEG_DEV_PATH=$ROOT_PATH/build/FFmpeg
fi

[ -d "$FFMPEG_BUILD_PATH" ] || mkdir -p "FFMPEG_BUILD_PATH"


function makeFFmpeg()
{
	echo "FFMPEG_DEV_PATH=$FFMPEG_DEV_PATH"
    echo "FFMPEG_DOWNLOAD_PATH=$FFMPEG_INSTALL_PATH"

    echo "current path [$ROOT_PATH]"

    if [ -e $FFMPEG_DEV_PATH ]
    then
        curl -OL https://github.com/FFmpeg/FFmpeg/releases/download/n3.0/ffmpeg-3.0.tar.gz
        mv ./ffmpeg-3.0.tar.gz /var/tmp/ffmpeg-3.0.tar.gz

        tar -xzvf /var/tmp/ffmpeg-3.0.tar.gz -C FFMPEG_DOWNLOAD_PATH
        ln -s FFMPEG_INSTALL_PATH/ffmpeg-3.0 $FFMPEG_DEV_PATH
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

echo "current path `pwd`"

`which node-gyp` || npm install node-gyp -g

[ -d '/usr/local/lib/node_modules/nan' ] || npm install nan -g

makeFFmpeg

gyp_args=''

echo "Installing NAN"
npm install nan

case `uname` in
'Darwin')
    echo "Mac OS"
    gyp_args='-- -f xcode'
    echo "$gyp_args"
    node-gyp configure $gyp_args
    FORMAT_CONVERTER_BIN=FormatConverter.dylib
    ;;
*) ;;
esac

echo "Start node-gyp configure"
node-gyp configure

debugExt=''

if [ "$BUILD_CONF" = "Debug" ]; then
    gyp_debug="--debug"
    debugExt=".debug"
fi
echo "Start node-gyp build. $gyp_debug"
node-gyp build $gyp_debug -v

echo "cp ${FFMPEG_BUILD_PATH}/${FORMAT_CONVERTER_BIN} ${BIN_PATH}/FormatConverter.node$debugExt"

cp "${FFMPEG_BUILD_PATH}/${FORMAT_CONVERTER_BIN}" "${BIN_PATH}/FormatConverter.node$debugExt"
