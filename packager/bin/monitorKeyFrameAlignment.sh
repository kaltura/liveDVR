#!/usr/bin/env bash
# usage: bash /opt/kaltura/liveDVR/packager/bin/monitorKeyFrameAlignment.sh | awk -f /opt/kaltura/liveDVR/packager/bin/monitorKeyFrames.awk

server=${1:-localhost}
entryId=${entryId:-0_bvu1eq3g}
urlPrefix=${1:-"http://$server:8080/hls/$entryId/playlist.json"}

#echo "$urlPrefix/master.m3u8"

indices=`curl  "$urlPrefix/master.m3u8" | grep index`
waitInterval=${waitInterval:-10}

g_done=0

trap "g_done=1" SIGINT SIGTERM

#echo "indices=${indices[@]}"

while [ "$g_done" -ne "1" ]
do
    for index in ${indices[@]}
    do
        chunklist=`curl "$urlPrefix/$index" | grep "seg-"`
        for chunk in ${chunklist[@]}
        do
          echo "$chunk"
        done
    done
    sleep $waitInterval
done