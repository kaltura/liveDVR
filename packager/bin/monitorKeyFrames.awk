BEGIN{
diffThresholdMsec=200
flavorCnt=0
}

{
    callCnt++
    n = split($0,b,"-");
    segIdx=b[4]
    segTime=b[2]
    flavor=b[5]
    if(!(flavor in flavors)){
        flavors[flavor]=1
        flavorCnt++
    }
     #print "INFO: segIdx="segIdx" adding  "segTime" for "flavor
    if(mins[segIdx]){
        if( min[segIdx]>segTime){
             min[segIdx]=segTime
        } else if( max[segIdx]<segTime){
            max[segIdx]=segTime
        }
        if(max[segIdx]-min[segIdx]>diffThresholdMsec){
            print "WARN: segIdx="segIdx" exceeded threshold "max[segIdx]-min[segIdx]
        }
    } else {
        min[segIdx]=segTime
        max[segIdx]=segTime
    }
    if(flavorCnt > 0 && callCnt == 10*flavorCnt ){
       # for(seg in max){
        #   print "INFO: segIdx="seg" diff  "max[seg]-min[seg]
        #}
        delete max
        delete min
        callCnt = 0
    }
}