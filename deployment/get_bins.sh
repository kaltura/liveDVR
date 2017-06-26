#!/bin/bash
#===============================================================================
#          FILE: get_bins.sh
#         USAGE: ./upgradelive.sh
#   DESCRIPTION:
#       OPTIONS: ---
#  REQUIREMENTS: ---
#          BUGS: ---
#         NOTES: ---
#        AUTHOR:  (), Lilach Maliniak
#  ORGANIZATION: Kaltura, inc.
#       CREATED: June 26, 2017
#      REVISION:  ---
#===============================================================================

if [ "$#" -lt 1 ]; then
	echo "usage get_bins <VERSION> [live root path]"
	exit 1
fi

LIVE_ROOT_PATH=

[ "$#" -eq 2 ] && LIVE_ROOT_PATH=$2

VERSION=$1

FILES_TO_DOWNLOAD=(FormatConverter.node nginx ts_to_mp4_convertor)
DEST_PATH=(bin bin liveRecorder/bin)
BASE_URL=http://lna-ci-slave2.kaltura.com/bin/$VERSION/linux/release/

function download_files()
{
	for ((i=0;i<${#FILES_TO_DOWNLOAD[@]};++i))
	do
	    local filename="${FILES_TO_DOWNLOAD[$i]}"
	    local dest="${DEST_PATH[$i]}"
		echo "starting to download ${filename}"
		wget --header="accept-encoding: gzip" ${BASE_URL}${filename} -O ${filename}.gz
		echo "extracting ${filename}.gz"
		gunzip ${filename}.gz
		if [ ! -w ${LIVE_ROOT_PATH} ]; then
			echo "moving ${filename} to $VERSION/${dest}"
			mv -f ${filename} $VERSION/${dest}
		else
			echo "moving ${filename} to ${LIVE_ROOT_PATH}/${dest}"
		    mv -f ${filename} ${LIVE_ROOT_PATH}/${dest}
		fi
		echo "successfully downloaded ${filename}"
	done
}

download_files