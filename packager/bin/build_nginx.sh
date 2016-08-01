# !/bin/bash


cd ~/

devRootDir=${devRootDir:-`pwd`}

ffmpegLibsDir=${ffmpegLibsDir:-$devRootDir/liveDVR/node_addons/FormatConverter/build/FFmpeg}


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


if which git &> /dev/null
then
    packagerDir="$devRootDir/nginx-vod-module"
    if [ ! -d "$packagerDir" ]
    then
        echo "$packagerDir does not exist."
        git clone https://github.com/kaltura/nginx-vod-module || echo "error $?"
    fi
    cd $packagerDir
    git checkout master
    git pull
fi


nginxVersion=${nginxVersion:-1.8.1}

if [ ! -d "$devRootDir/nginx-$nginxVersion" ]
then
    wget http://nginx.org/download/nginx-$nginxVersion.tar.gz
    tar -zxvf nginx-$nginxVersion.tar.gz
fi

echo "$devRootDir/nginx-$nginxVersion"

cd $devRootDir/nginx-$nginxVersion

./configure --add-module=$devRootDir/nginx-vod-module --with-debug --with-cc-opt="-O0"
make
make install