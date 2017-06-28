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
	echo "usage get_bins <version> [live root path]"
	exit 1
fi

LIVE_ROOT_PATH=
OS=linux

#[ "`uname`" = "Darwin" ] && OS="darwin"

[ "$#" -eq 2 ] && LIVE_ROOT_PATH=$2
[ "$#" -eq 3 ] && OS=$3

VERSION=$1

FILES_TO_DOWNLOAD=(FormatConverter.node nginx ts_to_mp4_convertor)
DEST_PATH=(bin bin liveRecorder/bin)
BASE_URL=http://lna-ci-slave2.kaltura.com/bin/$VERSION/${OS}/release
LATEST_URL=http://lna-ci-slave2.kaltura.com/bin/latest/${OS}/release

function download_files()
{
	for ((i=0;i<${#FILES_TO_DOWNLOAD[@]};++i))
	do
	    local filename="${FILES_TO_DOWNLOAD[$i]}"
	    local dest="${DEST_PATH[$i]}"
		echo "starting to download ${filename}"
		echo "wget --header="accept-encoding: gzip" ${BASE_URL}/${filename} -O ${filename}.gz"
		wget --header="accept-encoding: gzip" ${BASE_URL}/${filename} -O ${filename}.gz
		if [ $? -ne 0 ]; then
		    echo "wget ${BASE_URL}/${filename} returned $?"
			wget --header="accept-encoding: gzip" ${LATEST_URL}/${filename} -O ${filename}.gz
		else
			echo "successfully downloaded ${BASE_URL}/${filename}"
		fi
		if [ $? -ne 0 ]; then
			echo "error $?, returned from wget --header="accept-encoding: gzip" ${LATEST_URL}/${filename} -O ${filename}.gz"
			exit 1;
		else
			echo "successfully downloaded ${LATEST_URL}/${filename}"
		fi
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