# !/bin/bash

if [ "$#" -eq 0 ]; then
	echo "usage build_addon <product path> <release/debug - optional>"
	exit
fi

PRODUCT_ROOT_PATH=$1
BUILD_CONF=
ADDON_PATH=$PRODUCT_ROOT_PATH/node_addons/FormatConverter
FORMAT_CONVERTER_BIN=FormatConverter.so
OS=`uname`
echo "OS=$OS"

[ "$#" -eq 2 ] && BUILD_CONF=$2 || BUILD_CONF=Release

if [ "$BUILD_CONF" = "debug" ]; then
	BUILD_CONF=Debug
	echo "Debug mode"
else
	BUILD_CONF=Release
	echo "Release mode"
fi

echo "ADDON_PATH=$ADDON_PATH"

pushd $ADDON_PATH

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

	echo "cp build/${BUILD_CONF}/${FORMAT_CONVERTER_BIN} ${PRODUCT_ROOT_PATH}/bin/FormatConverter.node$debugExt"
	cp "build/${BUILD_CONF}/${FORMAT_CONVERTER_BIN}" "${PRODUCT_ROOT_PATH}/bin/FormatConverter.node$debugExt"

popd