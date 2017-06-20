# !/bin/bash

FORMAT_CONVERTER_BIN=FormatConverter.so

pushd $ADDONS_ROOT_PATH

	[ -d "$ADDONS_BUILD_PATH" ] || mkdir -p "$ADDONS_BUILD_PATH"

	`which node-gyp` || npm install node-gyp -g

	[ -d '/usr/local/lib/node_modules/nan' ] || npm install nan -g

	gyp_args=''

	echo "Installing NAN"
	npm install -unsafe-perm nan

	case `uname` in
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