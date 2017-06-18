# !/bin/bash

APP_NAME=liveRecorder
PREPDIR="/opt/kaltura/builds/${APP_NAME}"
ADDONS_ROOT_PATH=$PREPDIR/node_addons/FormatConverter
ADDONS_BUILD_PATH=
ADDONS_BIN_PATH=$PREPDIR/bin
BUILD_CONF=Release
SCRIPT_PATH=$PREPDIR/scripts
FORMAT_CONVERTER_BIN=FormatConverter.so
FFMPEG_INSTALL_PATH=~/Documents

OS=`uname`
echo "OS=$OS"

while [ "$1" != "" ]; do
	key="$1"

    case $key in
        -p | --path )
                    shift
			        FFMPEG_INSTALL_PATH=$1
			        [ ! -e $1 ] &&  FFMPEG_INSTALL_PATH=~/
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
			        echo "-p | --path [full path], ffmpeg install path"
			        echo "-m | --mode [debug/release], the build mode debug/release"
			        exit
		;;
        * )
                    echo "$1 is invalid arguments"
                    exit
        ;;
    esac

done

if [ ! -e  $PREPDIR ]; then
	ADDONS_ROOT_PATH=`dirname ${BASH_SOURCE[0]}`
	SCRIPT_PATH=$ADDONS_ROOT_PATH/../../scripts/
	ADDONS_BIN_PATH=../../bin
fi

[ BUILD_CONF = "Debug"] && ADDONS_BUILD_PATH=build/Debug || ADDONS_BUILD_PATH=build/Release


echo "current path `pwd`"

echo "*******************************************************************************"
echo "* about to start ffmpeg build...                                              *"
echo "*******************************************************************************"


echo "export BUILD_CONF=$BUILD_CONF"
echo "export FFMPEG_INSTALL_PATH=$FFMPEG_INSTALL_PATH"

export BUILD_CONF
export FFMPEG_INSTALL_PATH

echo "sh $SCRIPT_PATH/build_ffmpeg.sh"

sh $SCRIPT_PATH/build_ffmpeg.sh

echo "*******************************************************************************"
echo "*   finished ffmpeg build                                                     *"
echo "*******************************************************************************"

echo "current path `pwd`"
echo "ADDONS_BUILD_PATH=$ADDONS_BUILD_PATH"
echo "ADDONS_ROOT_PATH=$ADDONS_ROOT_PATH"

pushd $ADDONS_ROOT_PATH

	[ -d "$ADDONS_BUILD_PATH" ] || mkdir -p "ADDONS_BUILD_PATH"

	`which node-gyp` || npm install node-gyp -g

	[ -d '/usr/local/lib/node_modules/nan' ] || npm install nan -g

	gyp_args=''

	echo "Installing NAN"
	npm install -unsafe-perm nan

	case $OS in
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

	echo "cp ${ADDONS_BUILD_PATH}/${FORMAT_CONVERTER_BIN} ${ADDONS_BIN_PATH}/FormatConverter.node$debugExt"
    cp "${ADDONS_BUILD_PATH}/${FORMAT_CONVERTER_BIN}" "${ADDONS_BIN_PATH}/FormatConverter.node$debugExt"

popd


