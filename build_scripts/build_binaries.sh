#!/bin/bash -l
commit_files=""
version=$1
if [ -z "$version" ]; then
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    echo "version parameter must be set. Use 0 if you don't want to copy build bins to version dir.\ncommand: <version> <branch> <build option:build_ffmpeg/build_addons/build_nginx/build_ts2mp4_convertor>"
    echo "example: . ~/build_binaries.sh 1.21.3 1.21 build_ts2mp4_convertor"
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    exit 1
else
   echo "building version [${version}]"
fi
branch=$2
if [ -z "$branch" ]; then
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    echo "branch parameter must be set as 2nd paramter.\n command: . ~/build_binaries <version> <branch> <build option>\n"
    echo "example: . ~/build_binaries.sh 1.21.3 1.21 build_ts2mp4_convertor"
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    exit 1
else
   echo "building from branch [${branch}]"
fi
build_option=$3
if [ -z "$build_option" ]; then
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!"
    echo "module build must be defined. Choose one of the listed options:\n1. build_addons - use to build formatConverter\n2. build_ffmpeg - use to build ffmpeg\n3. build_nginx - use to build nginx\n4. build_ts2mp4_convertor - use to build ts2mp4_convertor, binary for liveRecorder VOD processing\n"
    echo "example: . ~/build_binaries.sh 1.21.3 1.21 build_ts2mp4_convertor"
    echo "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!" 
   exit 1
fi

if [ -z "$ffmpeg_path" ]; then
	ffmpeg_path=/home/kaltura-ci/workspace/kLiveController-build-binaries/node_addons/FormatConverter/build/FFmpeg
fi
if [ -z "$ffmpeg_build_path" ]; then
	ffmpeg_build_path=/home/kaltura-ci
fi
if [ -z "$product_root_path" ]; then
	product_root_path=/home/kaltura-ci/workspace/kLiveController-build-binaries
fi
if [ -z "$BUILD_CONF" ]; then
	BUILD_CONF=Release
fi
if [ -z "$ffmpeg_lib_path" ]; then
     ffmpeg_lib_path=/home/kaltura-ci/ffmpeg-3.0
fi

build_path=/home/kaltura-ci/workspace/kLiveController-build-binaries
echo "product version=$version"
echo "running npm installation"
npm install
git checkout ${branch}
#git pull origin ${branch}
git pull --rebase origin ${branch}

mkdir -p /home/kaltura-ci/bin/latest/linux/debug
mkdir -p /home/kaltura-ci/bin/latest/linux/release
mkdir -p /home/kaltura-ci/bin/latest/darwin/debug
mkdir -p /home/kaltura-ci/bin/latest/darwin/release
mkdir -p /home/kaltura-ci/bin/${version}/linux/debug
mkdir -p /home/kaltura-ci/bin/${version}/linux/release
mkdir -p /home/kaltura-ci/bin/${version}/darwin/debug
mkdir -p /home/kaltura-ci/bin/${version}/darwin/release

function build_addons
{
    echo "Building node_addon"
    echo "./build_scripts/build_addon.sh $product_root_path $ffmpeg_lib_path"
    bash ./build_scripts/build_addon.sh $product_root_path $ffmpeg_lib_path
    echo "./build_scripts/build_addon.sh $product_root_path $ffmpeg_lib_path Debug"
    bash ./build_scripts/build_addon.sh $product_root_path $ffmpeg_lib_path Debuug
    local __error=$?
    if [ "$__error" -eq "0" ] && [ "$version" != "0" ]; then
        echo "cp ./bin/FormatConverter.node /home/kaltura-ci/bin/latest/linux/release"
        cp ./bin/FormatConverter.node /home/kaltura-ci/bin/latest/linux/release
        echo "cp ./bin/FormatConverter.node /home/kaltura-ci/bin/${version}/linux/release"
        cp ./bin/FormatConverter.node /home/kaltura-ci/bin/${version}/linux/release
        echo "cp ./bin/FormatConverter.node.debug /home/kaltura-ci/bin/latest/linux/debug"
        cp ./bin/FormatConverter.node.debug /home/kaltura-ci/bin/latest/linux/debug
        echo "cp ./bin/FormatConverter.node.debug /home/kaltura-ci/bin/${version}/linux/debug"
        cp ./bin/FormatConverter.node.debug /home/kaltura-ci/bin/${version}/linux/debug
    elif [ "$__error" -ne "0" ]; then
        echo "build addons failed with error [${__error}]"
    fi
}

function build_ffmpeg
{
    echo "Building ffmpeg"
    if [ "$BUILD_CONF" = "Release" ]; then
        echo "./build_scripts/build_ffmpeg.sh $ffmpeg_build_path 3.0"
        bash ./build_scripts/build_ffmpeg.sh $ffmpeg_build_path 3.0
    else 
        echo "./build_scripts/build_ffmpeg.sh $ffmpeg_build_path 3.0 Debug"
        bash ./build_scripts/build_ffmpeg.sh $ffmpeg_build_path 3.0 Debug      
    fi
}

function build_nginx
{
    echo "Building packager"
    ./packager/bin/build_nginx.sh $version
    local __error=$?
    if [ "$__error" -eq "0" ] && [ "$version" != "0" ]; then
        echo "cp ./bin/nginx /home/kaltura-ci/bin/${version}/linux/release"
        cp ./bin/nginx /home/kaltura-ci/bin/${version}/linux/release
        echo "cp $product_root_path/bin/nginx /home/kaltura-ci/bin/latest/linux/release"
        cp ./bin/nginx /home/kaltura-ci/bin/latest/linux/release
    elif [ "$__error" -ne "0" ]; then
        echo "build nginx failed with error [${__error}]" 
    fi   
}

# when building ts_to_mp4_convertor,
# product root path of liveRecorder must be full path including liveRecorder
function build_ts2mp4_convertor
{
    echo "Building ts_to_mp4_convertor ffmpeg_path=$ffmpeg_lib_path"
    echo pwd=`pwd`
    echo "bash ./build_scripts/build_ts2mp4_convertor.sh $product_root_path/liveRecorder $ffmpeg_lib_path"    
    bash ./build_scripts/build_ts2mp4_convertor.sh $product_root_path/liveRecorder $ffmpeg_lib_path
    local __error=$?
    if [ "$__error" -eq "0" ] && [ "$version" != "0" ]; then
        echo "cp ./liveRecorder/bin/ts_to_mp4_convertor /home/kaltura-ci/bin/latest/linux/release"
        cp ./liveRecorder/bin/ts_to_mp4_convertor /home/kaltura-ci/bin/latest/linux/release
        echo "cp ./liveRecorder/bin/ts_to_mp4_convertor /home/kaltura-ci/bin/${version}/linux/release"
        cp ./liveRecorder/bin/ts_to_mp4_convertor /home/kaltura-ci/bin/${version}/linux/release
    elif [ $__error -ne "0" ]; then
        echo "build ts2mp4_convertor failed with error [${__error}]"
    fi
}

pushd ${build_path}
case "$build_option" in
        build_addons)
        echo "building formatConverter (${build_option})"
        build_addons
        ;;
        build_ffmpeg)
        echo "building ffmpeg (${build_option})"
        build_ffmpeg
        ;;
        build_nginx)
        echo "building nginx (${build_option})"
        build_nginx
        ;;
        build_ts2mp4_convertor)
        echo "building ts2mp4_convertor (${build_option})"
        build_ts2mp4_convertor
        ;;
        *)
        echo "the build option [${build_option}] in unknown. use one of following: build_addons|build_ffmpeg|build_nginx|build_ts2mp4_convertor"
        ;;
esac
popd +1

