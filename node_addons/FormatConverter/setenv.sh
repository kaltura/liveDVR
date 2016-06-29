# !/bin/bash

Release=${DEBUG:-1}

[ "$Release" != "" ] && echo "target config: release" ||  echo "target config: debug"

os_name=`uname`

function makeFFmpeg()
{
    local ffmpegDir=$1/FFmpeg

    echo "ffmpegDir=$ffmpegDir"

    cd $1

    [ -d "$ffmpegDir" ] || curl -o "https://github.com/FFmpeg/FFmpeg/releases/download/n3.0/ffmpeg-3.0.tar.gz" && tar -xvzf  ffmpeg-3.0.tar.gz

    cd $ffmpegDir

    debug_specifics=""
    [ "$Release" == "" ] &&  debug_specifics='--enable-debug --disable-optimizations'

    configFileName=$ffmpegDir/lastConfigure



    confCmd="./configure --disable-everything --disable-doc --enable-protocol=file --enable-demuxer=mpegts --enable-muxer=rtp_mpegts --enable-parser=h264 --enable-parser=aac --enable-muxer=mp4   --enable-zlib --enable-bsf=aac_adtstoasc $debug_specifics --enable-decoder=aac"

    [ "$os_name" == "Linux" ] && confCmd="$confCmd --enable-pic"

    actualCmd=""

    [ -f "$configFileName" ] && actualCmd=`cat $configFileName`

    echo -e "actualCmd=\n<$actualCmd>"
    echo -e "confCmd=\n<$confCmd>"

    if [ "$actualCmd" != "$confCmd" ]
    then
        echo "configuring ffmpeg..."
         eval "$confCmd"
    fi

    echo $confCmd > $configFileName

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

case $os_name in
'Darwin')
    echo "Mac OS"
    gyp_args='-- -f xcode'
    ;;
*) ;;
esac

echo "$gyp_args"
echo "Installing NAN"
npm install nan
echo "Start node-gyp configure"
node-gyp configure $gyp_args

gyp_debug=${Release:---debug}
echo "Start node-gyp build"
node-gyp build $gyp_debug -v