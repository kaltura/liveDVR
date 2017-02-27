# !/bin/bash

[ "$1" = "DEBUG" ] && build_conf=Debug || build_conf=Release

[ "$build_conf" != "Debug" ] && echo "target config: release" ||  echo "target config: debug"


os_name=`uname`

function makeFFmpeg()
{
    local ffmpegDir=$1/FFmpeg

    echo "ffmpegDir=$ffmpegDir"

    cd $1

    if [ ! -d "$ffmpegDir" ]
    then
        curl -OL https://github.com/FFmpeg/FFmpeg/releases/download/n3.0/ffmpeg-3.0.tar.gz
        mv ./ffmpeg-3.0.tar.gz /var/tmp/ffmpeg-3.0.tar.gz
        case $os_name in
         'Linux')
            devFFmpegDir=~/
            ;;
        'Darwin')
            devFFmpegDir=~/Documents/
            ;;
        *) ;;
        esac

        tar -xzvf /var/tmp/ffmpeg-3.0.tar.gz -C $devFFmpegDir
        ln -s $devFFmpegDir/ffmpeg-3.0 $ffmpegDir
    fi

    cd $ffmpegDir

    debug_specifics=
    [ "$build_conf" = "Debug" ] &&  debug_specifics='--enable-debug --disable-optimizations'

    configFileName=$ffmpegDir/lastConfigure


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

}

path=`dirname ${BASH_SOURCE[0]}`

`which node-gyp` || npm install node-gyp -g

[ -d '/usr/local/lib/node_modules/nan' ] || npm install nan -g

cd $path

path=`pwd`

[ -d "$path/build" ] || mkdir -p "$path/build"

makeFFmpeg $path/build

cd $path

gyp_args=''

echo "Installing NAN"
npm install nan

case $os_name in
'Darwin')
    echo "Mac OS"
    gyp_args='-- -f xcode'
    echo "$gyp_args"
    node-gyp configure $gyp_args
    ;;
*) ;;
esac

echo "Start node-gyp configure"
node-gyp configure

if [ "$build_conf" = "Debug" ]; then
    gyp_debug="--debug"
    debugExt=".debug"
fi
echo "Start node-gyp build. $gyp_debug"
node-gyp build $gyp_debug -v

case $os_name in
 'Linux')
    cp `pwd`/build/$build_conf/FormatConverter.so "`pwd`/../../bin/linux/FormatConverter.node$debugExt"
    ;;
'Darwin')
    cp `pwd`/build/$build_conf/FormatConverter.dylib "`pwd`/../../bin/darwin/FormatConverter.node$debugExt"
    ;;
*) ;;
esac