# !/bin/bash

if [[ $# -eq 0 ]] ; then
    echo 'missing ffmpeg path parameter. example: ffmpeg_build ../../node_addons/FormatConverter/build/FFmpeg'
    exit 1
fi

ffmpegLibsDir=$1
echo ffmpeg lib dir: [$ffmpegLibsDir]

currentDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
echo current dir: [$currentDir]

ts2mp4ConverterDir="$currentDir/../../liveRecorder/ts_to_mp4_convertor"
echo ts_to_mp4_convertor dir: [$ts2mp4ConverterDir]
cd $ts2mp4ConverterDir

[ -d "$ts2mp4ConverterDir/obj" ] || mkdir -p $ts2mp4ConverterDir/obj
echo [$ts2mp4ConverterDir/obj]

os_name=`uname`
echo [$os_name]

case  $os_name in
"Darwin")
    export OS="darwin"
    ;;
"Linux")
	export OS="linux"
   ;;
esac

echo os=[$OS]


echo "********************"
echo  Starting new build
echo "********************"

make FFMPEG_LIB_DIR=$ffmpegLibsDir

echo "*******************"
echo    Build Ended
echo "*******************"


[ -d "$currentDir/../bin/${os_name}" ] || mkdir -p "$currentDir/../bin/${os_name}"

case  $os_name in
"Darwin")
    echo "Copying $ts2mp4ConverterDir/obj/ts_to_mp4_convertor to $currentDir/../bin/${os_name}/"
    cp $ts2mp4ConverterDir/obj/ts_to_mp4_convertor $currentDir/../bin/${os_name}/
    ;;
"Linux")
    echo "Copying $ts2mp4ConverterDir/obj/ts_to_mp4_convertor to $currentDir/../bin/${os_name,,}/ts_to_mp4_convertor"
    cp $ts2mp4ConverterDir/obj/ts_to_mp4_convertor $currentDir/../bin/${os_name,,}/ts_to_mp4_convertor
   ;;
esac