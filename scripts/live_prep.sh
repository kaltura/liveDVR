# !/bin/bash

APP_NAME=liveController
PRODUCT_ROOT_PATH="/opt/kaltura/builds/${APP_NAME}"
BUILD_CONF=Release
BUILD_TARGET=node_addons
SCRIPT_PATH=`dirname ${BASH_SOURCE[0]}`

ADDONS_ROOT_PATH=
ADDONS_BUILD_PATH=build/Release
ADDONS_BIN_PATH=../../bin

FFMPEG_BUILD_PATH=~/
FFMPEG_BUILD_PATH_SET=0

OS=`uname`
echo "OS=$OS"

contains_element () {
  local e
  for e in "${@:2}"; do [[ "$e" == "$1" ]] && return 0; done
  return 1
}

while [ "$1" != "" ]; do
	key="$1"

    case $key in
        -b | --build )
                    shift
                    BUILD_TARGET=$1
			        build_op=(ffmpeg node_addons all)
					contains_element $BUILD_TARGET "${build_op[@]}"
					res=$?
					if [ $res -eq "1" ]; then
						echo "invalid build option. use -h | --help for available options"
						exit
					fi
			        echo "-b | --build $1"
			        shift
        ;;
        -p | --path )
                    shift
			        FFMPEG_BUILD_PATH=$1
  					FFMPEG_BUILD_PATH_SET=1
			        [ ! -e $1 ] &&  FFMPEG_BUILD_PATH=~/
			        echo "-p | --path $1"
			        shift
        ;;
        -m | --mode )
                    shift
                    [ $1 = 'debug' ] && BUILD_CONF=Debug || BUILD_CONF=Release
			        echo "-m | --mode $1"
			        shift
		;;
        -r | --root )
                    shift
                    PRODUCT_ROOT_PATH=$1
			        echo "-r | --root $1"
			        shift
		;;
        -h | --help )
                    echo "-b | --build [ffmpeg/node_addons (default)/all]"
			        echo "-p | --path [full path], ffmpeg build path"
			        echo "-m | --mode [debug/release], build mode, debug/release"
			        echo "-r | --root [full path], liveController root path. Example: /opt/kaltura/builds/liveController"
			        exit
		;;
        * )
                    echo "$1 is invalid arguments"
                    exit
        ;;
    esac

done

if [ ! -d "$PRODUCT_ROOT_PATH" ]; then
	PRODUCT_ROOT_PATH=$SCRIPT_PATH/..
	ADDONS_ROOT_PATH=$SCRIPT_PATH/../node_addons/FormatConverter

	case $OS in
    	'Darwin')
    	    [ $FFMPEG_BUILD_PATH_SET -eq "0" ] && FFMPEG_BUILD_PATH=~/Documents
    	    ;;
    	*) ;;
    esac
else
	ADDONS_ROOT_PATH=$PRODUCT_ROOT_PATH/node_addons/FormatConverter
fi

if [ "$BUILD_CONF" = "Debug" ]; then
	ADDONS_BUILD_PATH=build/Debug
    echo "target config: debug"
else
    echo "target config: release"
fi

echo "current path `pwd`"

if [ "$BUILD_TARGET" = "ffmpeg" ] || [ "$BUILD_TARGET" = "all" ]; then

	echo "export BUILD_CONF=$BUILD_CONF"
	export BUILD_CONF

	echo "*******************************************************************************"
	echo "* starting to build ffmpeg build                                              *"
	echo "*******************************************************************************"

	echo "export FFMPEG_BUILD_PATH=$FFMPEG_BUILD_PATH"
	echo "export PRODUCT_ROOT_PATH=$PRODUCT_ROOT_PATH"

	export FFMPEG_BUILD_PATH
	export PRODUCT_ROOT_PATH

	echo "sh $SCRIPT_PATH/build_ffmpeg.sh"

	sh $SCRIPT_PATH/build_ffmpeg.sh

	echo "*******************************************************************************"
	echo "* finished building ffmpeg                                                    *"
	echo "*******************************************************************************"
fi

if [ "$BUILD_TARGET" = "node_addons" ] || [ "$BUILD_TARGET" = "all" ]; then

	echo "*******************************************************************************"
	echo "* starting to build node addons                                               *"
	echo "*******************************************************************************"

	echo "current path `pwd`"

	echo "export ADDONS_BUILD_PATH=$ADDONS_BUILD_PATH"
	echo "export ADDONS_ROOT_PATH=$ADDONS_ROOT_PATH"
	echo "export ADDONS_BIN_PATH=$ADDONS_BIN_PATH"

	export ADDONS_BUILD_PATH
	export ADDONS_ROOT_PATH
	export ADDONS_BIN_PATH

	echo "sh $SCRIPT_PATH/build_node_addons.sh"

	sh $SCRIPT_PATH/build_node_addons.sh

	echo "*******************************************************************************"
    echo "* finished building node addons                                               *"
    echo "*******************************************************************************"

fi


