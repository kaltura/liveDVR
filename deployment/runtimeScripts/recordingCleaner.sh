#!/bin/bash
set -x
echo `date`

sd=$(dirname "$0")
BASE_REC_DIR="${BASE_DIR}/liveRecorder"
#export DAYS_TO_KEEP_RECORDINGS=30
export FOLDER_TO_COPY=("done" "error" "recordings/append" "recordings/newSession" )

source $sd/cleaner.sh

cleaner $BASE_REC_DIR $folders $DAYS_TO_KEEP_RECORDINGS