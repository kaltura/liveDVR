# !/bin/bash

currentDir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo $currentDir
devRootDir=${devRootDir:-"$currentDir/../build"}
mkdir $devRootDir
echo "$devRootDir"

ffmpegLibsDir=${ffmpegLibsDir:-$devRootDir/liveDVR/node_addons/FormatConverter/build/FFmpeg}
packagerDir="$devRootDir/nginx-vod-module"
nginxVersion=${nginxVersion:-1.8.1}
nginxDir="$devRootDir/nginx-$nginxVersion"
os_name=`uname`


export LIB_AV_CODEC="$ffmpegLibsDir/libavcodec/libavcodec__.a"
export LIB_AV_FILTER="$ffmpegLibsDir/libavfilter/libavfilter.a"
export LIB_AV_UTIL=$ffmpegLibsDir/libavutil/libavutil.a
case  $os_name in
"Darwin")
    ;;
"Linux")
    LIB_AV_FILTER="$LIB_AV_FILTER  -lpthread -lm -lrt"
   ;;
esac

if [ "$1" = "clean" ]
then
    echo "Cleaning $packagerDir and $nginxDir directories"
    rm -rf $packagerDir
    rm -rf $nginxDir
fi


cd $devRootDir

if which git &> /dev/null
then
    if [ ! -d "$packagerDir" ]
    then
        echo "$packagerDir does not exist."
        git clone https://github.com/kaltura/nginx-vod-module || echo "error $?"
    fi
    cd $packagerDir
    git checkout master
    git pull
fi

cd $devRootDir

if [ ! -d "$nginxDir" ]
then
    wget http://nginx.org/download/nginx-$nginxVersion.tar.gz
    tar -zxvf nginx-$nginxVersion.tar.gz
    rm nginx-$nginxVersion.tar.gz -f
fi


echo "$nginxDir"
cd $nginxDir

./configure --with-http_secure_link_module --add-module=$packagerDir --with-debug --with-cc-opt="-O0 -DDISABLE_PTS_DELAY_COMPENSATION"
make
#make install

case  $os_name in
"Darwin")
    echo "Copying $nginxDir/objs/nginx to $currentDir/../../bin/${os_name}/"
    cp $nginxDir/objs/nginx $currentDir/../../bin/${os_name}/
    ;;
"Linux")
    echo "Copying $nginxDir/objs/nginx to $currentDir/../../bin/${os_name,,}/"
    cp $nginxDir/objs/nginx $currentDir/../../bin/${os_name,,}/
   ;;
esac


