# !/bin/bash

APP_NAME=liveController
PRODUCT_ROOT_PATH="/opt/kaltura/builds/${APP_NAME}"
BUILD_CONF=Release
BUILD_TARGET=node_addons
SCRIPT_PATH=`dirname ${BASH_SOURCE[0]}`

ADDONS_ROOT_PATH=
ADDONS_BUILD_PATH=build/Release
ADDONS_BIN_PATH=../../bin

FORMAT_CONVERTER_BIN=FormatConverter.so
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

	echo "*******************************************************************************"
	echo "* starting to build ffmpeg build                                              *"
	echo "*******************************************************************************"

	echo "export BUILD_CONF=$BUILD_CONF"
	echo "export FFMPEG_BUILD_PATH=$FFMPEG_BUILD_PATH"
	echo "export PRODUCT_ROOT_PATH=$PRODUCT_ROOT_PATH"

	export BUILD_CONF
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
	echo "ADDONS_BUILD_PATH=$ADDONS_BUILD_PATH"
	echo "ADDONS_ROOT_PATH=$ADDONS_ROOT_PATH"

	pushd $ADDONS_ROOT_PATH

		[ -d "$ADDONS_BUILD_PATH" ] || mkdir -p "$ADDONS_BUILD_PATH"

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

	echo "*******************************************************************************"
    echo "* finished building node addons                                               *"
    echo "*******************************************************************************"

fi


