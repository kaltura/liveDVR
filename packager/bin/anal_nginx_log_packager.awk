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



$0 ~ /\[debug\]/ && $0 ~ /GET \/hls\/(.*)\/playlist.json\/seg/ {
    split($10,b,"-");
    lastChunkPath=$10
    if(verbose){
        print $2 " "lastChunkPath;
    }
    if(lastChunk && lastChunk+1 != b[2]){
        print $2" "lastChunkPath" error: expected chunk "lastChunk+1" got: "b[2]
        delete __lastDTS[0]
    }
    lastChunk=b[2];
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

END {
    printStats("chunkInterval")
    printStats("chunkDuration")
}