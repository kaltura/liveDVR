#!/bin/bash
set -x
echo `date`

sd=$(dirname "$0")
#export BASE_DIR=/web/content/kLive
#export DAYS_TO_KEEP_LIVE=7
export FOLDER_TO_COPY=("archive" "live")

source $sd/cleaner.sh

cleaner $BASE_DIR $DAYS_TO_KEEP_LIVE