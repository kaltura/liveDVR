#!/bin/sh

#  install_ffmpeg.sh
#  livetranscoder
#
#  Created by Guy.Jacubovski on 30/12/2018.
#  Copyright © 2018 Kaltura. All rights reserved.
set -ex


#export PATH="$HOME/compiled/bin":$PATH
#export PKG_CONFIG_PATH=$HOME/compiled/lib/pkgconfig

if [ "$#" -lt 1 ]; then
	echo "usage  : $0 <ffmpeg build path>"
	echo "example: $0 /opt/kaltura/liveController/v1.14.5/bin/ffmpeg/ffmpeg-4.1"
	exit 1
fi

FFMPEG_BUILD_PATH=$1

rm -rf "$FFMPEG_BUILD_PATH"
git clone -b n4.1 https://git.ffmpeg.org/ffmpeg.git "$FFMPEG_BUILD_PATH" || echo "FFmpeg dir already exists"
cd "$FFMPEG_BUILD_PATH"
./configure --disable-everything --disable-doc --enable-protocol=file --enable-encoder=movtext  --enable-demuxer=mpegts --enable-muxer=rtp_mpegts --enable-parser=h264 --enable-parser=aac --enable-muxer=mp4 --enable-zlib --enable-bsfs --enable-decoder=aac  --enable-encoder=aac --enable-decoder=h264 --enable-muxer=flv --enable-protocol=rtmp --enable-encoder=libmp3lame
make
