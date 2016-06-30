BEGIN{
    if(!maxInterval)
        maxInterval=60
    if(!maxChunkDuration)
        maxChunkDuration=12000
    if(!minChunkDuration)
        minChunkDuration=1000
    state = "waitChunk"
    if(!verbose)
        verbose=1
}

function addStats(caption,data){
    cnts[caption] = cnts[caption] + 1
    sums[caption] = sums[caption] + data
    sums2[caption] = sums2[caption] + data*data
}

function printStats(caption){
    cnt = cnts[caption]
    if(cnt){
        sum = sums[caption]
        sum2 = sums2[caption]
        stddev = 0
        if((cnt > 1)){
         stddev = sqrt( (sum2*cnt -sum*sum) / (cnt*(cnt-1)))
        }
        printf "%s avg request interval: %.2f stddev: %.2f #: %d\n", caption,sum/cnt,stddev,cnt
    } else {
        print "couldn't find stats for "caption
    }
}

function parseChunkName(arr){

   if(segId && (segId+1) == b[4] && (segTime + segDuration != b[2])){

        printf ("[%d] segment discontinuity: %d new { %d %d } old: { %d %d }\n",
         segId,b[2]-(segTime+segDuration),b[2],b[3],
         segTime,segDuration)
   }

    segTime = b[2]
    segDuration = b[3]
    segId = b[4]

    #printf("parseChunkName segTime=%d segDuration=%d segId=%d\n",
    #    segTime,
    #    segDuration,
    #    segId)

}

$0 ~ /\[debug\]/ && $0 ~ /GET \/hls\/(.*)\/playlist.json\/seg/ {
    n =n split($10,b,"-");
    lastChunkPath=$10
    if(verbose){
        print $2 " "lastChunkPath;
    }

    if(n >= 6){
        lastChunkId = b[4]
        parseChunkName(b)
    } else {
        lastChunkId =  b[2]
    }
    if(lastChunk && lastChunk+1 != lastChunkId){
        print $2" "lastChunkPath" error: expected chunk "lastChunk+1" got: "lastChunkId
        delete __lastDTS[0]
    }
    lastChunk=lastChunkId;
    split($2,a,":");
    time=a[3]+a[2]*60+a[1]*3600;
    if(lastTime){
        diff=time-lastTime
        if(diff>maxInterval){
            print $2" "lastChunkPath" error: requested chunk after "diff" sec."
        }
        if(diff>0){
            addStats("chunkInterval",diff)
        }
    }
    lastTime = time
    state = "checkDTS"
}

verbose && state == "checkDTS" && $0 ~ /parsed clip source/ {
    print $2" "$11" "$12" "$13
}

state == "checkDTS" && $0 ~ /first frame dts/ {
    state = "waitChunk"
    if( __lastDTS[0]){
        chunkDuration = $11 -  __lastDTS[0]

        addStats("chunkDuration",chunkDuration)
        if(chunkDuration > maxChunkDuration || chunkDuration < minChunkDuration){
            print $2" "lastChunkPath" bad chunk duration "chunkDuration
        }
    }
     __lastDTS[0] = $11
}

$0 ~ /media_set_parse_json: produced segment/ {
    tmp1 = $9
    tmp2=$11
    tmp3=$13
    if(segment_index){
        if(segment_index == tmp1 - 1){
            if(segment_start_time+segment_duration != tmp2){
                printf (" chunk %d adjucent chunks  differ: diff: %d prev={ %d  %d}  cur={%d %d}\n",tmp1,
                (tmp2-segment_start_time-segment_duration),
                segment_start_time,
                segment_duration,
                tmp2,
                tmp3)
            }
        } else {
            print "segment discontinuity: cur: "tmp1" prev: "segment_index
        }
    }
    segment_index = tmp1
    segment_start_time=tmp2
    segment_duration=tmp3

  # print " debug info:  "segment_index" "segment_start_time" "segment_duration
}

END {
    printStats("chunkInterval")
    printStats("chunkDuration")
}