# !/bin/bash

currentDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo current dir: [$currentDir]
devRootDir=${devRootDir:-"$currentDir/../.."}
echo root dir: [$devRootDir]
FormatConverterDir=${FormatConverterDir:-$devRootDir/node_addons/FormatConverter}
echo FormatConverter dir: [$FormatConverterDir]
echo running setenv.sh to set ffmpeg env
#sudo $FormatConverterDir/setenv.sh
ffmpegLibsDir=${ffmpegLibsDir:-$devRootDir/node_addons/FormatConverter/build/FFmpeg}
echo ffmpeg lib dir: [$ffmpegLibsDir]
ts2mp4ConverterDir="$devRootDir/liveRecorder/ts_to_mp4_convertor"
echo ts_to_mp4_convertor dir: [$ts2mp4ConverterDir]
cd $ts2mp4ConverterDir
mkdir $ts2mp4ConverterDir/obj
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

make

echo "*******************"
echo    Build Ended
echo "*******************"

case  $os_name in
"Darwin")
    echo "Copying $ts2mp4ConverterDir/obj/ts_to_mp4_convertor to $currentDir/../../bin/${os_name}/"
    cp $ts2mp4ConverterDir/obj/ts_to_mp4_convertor $currentDir/../bin/${os_name}/
    ;;
"Linux")
    echo "Copying $ts2mp4ConverterDir/obj/ts_to_mp4_convertor to $currentDir/../../bin/${os_name,,}/"
    cp $ts2mp4ConverterDir/obj/ts_to_mp4_convertor $currentDir/../bin/${os_name,,}/
   ;;
esac