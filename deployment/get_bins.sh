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

live_root_path=

[ "$#" -eq 2 ] && live_root_path=$2

version=$1

echo "starting to download FormatConverter.node"
wget --header="accept-encoding: gzip" http://lna-ci-slave2.kaltura.com/bin/$version/linux/release/FormatConverter.node -O FormatConverter.node.gz
echo "extracting FormatConverter.node.gz"
gunzip FormatConverter.node.gz
if [ ! -w $live_root_path ]; then
	mv FormatConverter.node $version/bin
else
   mv FormatConverter.node $live_root_path/bin
fi
echo "successfully downloaded FormatConverter.node"
echo "starting to download nginx"
wget --header="accept-encoding: gzip" http://lna-ci-slave2.kaltura.com/bin/$version/linux/release/nginx -O nginx.gz
echo "extracting nginx.gz"
gunzip nginx.gz
if [ ! -w $live_root_path ]; then
	mv nginx $version/bin
else
	mv nginx $live_root_path/bin
fi
echo "successfully downloaded nginx"
echo "starting to download ts_to_mp4_convertor"
wget --header="accept-encoding: gzip" http://lna-ci-slave2.kaltura.com/bin/$version/linux/release/ts_to_mp4_convertor -O ts_to_mp4_convertor.gz
echo "extracting ts_to_mp4_convertor.gz"
gunzip ts_to_mp4_convertor.gz
if [ ! -w $live_root_path ]; then
	mv ts_to_mp4_convertor $version/liveRecorder/bin
else
    mv ts_to_mp4_convertor $live_root_path/liveRecorder/bin
fi
echo "successfully downloaded ts_to_mp4_convertor"