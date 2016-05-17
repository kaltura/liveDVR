# !/bin/bash

ffmpegLibsDir=${ffmpegLibsDir:-/root/liveDVR/node_addons/FormatConverter/build/FFmpeg}

os_name=`uname`

case  $os_name in
"Darwin")
    ;;
"Linux")
   ;;
esac

#export LIB_AV_CODEC=$ffmpegLibsDir/libavcodec/libavcodec.a
export LIB_AV_FILTER="$ffmpegLibsDir/libavfilter/libavfilter.a -lpthread -lm -lrt"
export LIB_AV_UTIL=$ffmpegLibsDir/libavutil/libavutil.a

cd ~/

devRootDir=${devRootDir:-`pwd`}

if [ ! -d "$devRootDir/nginx-vod-module" ]
then
    git clone https://github.com/kaltura/nginx-vod-module
fi

nginxVersion=${nginxVersion:-1.8.1}

if [ ! -d "$$devRootDir/nginx-$nginxVersion" ]
then
    wget http://nginx.org/download/nginx-$nginxVersion.tar.gz
    tar -zxvf nginx-$nginxVersion.tar.gz
fi

cd $devRootDir/nginx-$nginxVersion
./configure --add-module=$devRootDir/nginx-vod-module --with-debug --with-cc-opt="-O0"
make
make install