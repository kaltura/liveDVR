#!/bin/sh

#  install_ffmpeg.sh
#  livetranscoder
#
#  Created by Guy.Jacubovski on 30/12/2018.
#  Copyright © 2018 Kaltura. All rights reserved.
set -ex


#export PATH="$HOME/compiled/bin":$PATH
#export PKG_CONFIG_PATH=$HOME/compiled/lib/pkgconfig

BASE_DIR="$(dirname "$0")"

BASE_DIR="./"

echo $BASE_DIR

if [ ! -f "$BASE_DIR/ffmpeg/libavcodec/libavcodec.a" ]; then
    rm -rf "$BASE_DIR/ffmpeg"
    git clone -b n4.1 https://git.ffmpeg.org/ffmpeg.git "$BASE_DIR/ffmpeg" || echo "FFmpeg dir already exists"
    cd "$BASE_DIR/ffmpeg"
   ./configure --disable-everything --disable-doc --enable-protocol=file --enable-encoder=movtext  --enable-demuxer=mpegts --enable-muxer=rtp_mpegts --enable-parser=h264 --enable-parser=aac --enable-muxer=mp4 --enable-zlib --enable-bsfs --enable-decoder=aac  --enable-encoder=aac --enable-decoder=h264 --enable-muxer=flv --enable-protocol=rtmp --enable-encoder=libmp3lame 

    make
fi
