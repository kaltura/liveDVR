#!/usr/bin/env bash

 entryDir=${entryDir:-/Users/igors/kLive_content/live/0_0tqdn8vw/}

 echo "entryDir=$entryDir"

 function errorCheck {
    local err=$?
    if [[ "$err" -ne "0" ]]
    then
        echo "error $err"
        exit $err
    fi
 }


function Sleep {
    sleep $1
    #echo ""
}

 last=0
 #files=("/Users/igors/kLive_content/live/0_0tqdn8vw/playlist.json_1470056933749" "/Users/igors/kLive_content/live/0_0tqdn8vw/playlist.json_1470056942873" )
 files=${files:-`ls $entryDir/playlist.json_* | sort`}
 entryId=`basename $entryDir`

 for f in ${files[@]}
 do
    if [[ "$f" =~ (.*)_(.*)$ ]]
    then
        disp_time=${BASH_REMATCH[2]}
        playlistFileName=`basename $f`
        lines=(`curl http://localhost:8080/hls/$entryId/$playlistFileName/index-f1-v1-a1.m3u8`)
        if [[ "last" -ne "0" ]]
         then
            diff=$(((disp_time-last)/1000))
            echo "$playlistFileName last=$last disp_time=$disp_time media-seq=$(((disp_time-946684800000)/10000)) sleeping $diff sec ${lines[3]} ${lines[4]}"
            Sleep $diff
         else
            echo "$playlistFileName last=$last disp_time=$disp_time media-seq=$(((disp_time-946684800000)/10000)) ${lines[3]} ${lines[4]}"
            Sleep 10
         fi
         echo "rename playlist.json"
         ln -sf "$f" $entryDir/playlist.json || errorCheck
         last=$disp_time
    fi
 done

 echo "done simulating"