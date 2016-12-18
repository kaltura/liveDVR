#!/usr/bin/env bash

#! /bin/bash



function usage {
    echo "$0 -entryId <entryId>"
    echo "-flv <flavorId_filter> (i.g. f4)"
    echo "-plst <playlist filter> query packager on specific playlist snapshot"
    echo "-srv <server> server ip to use in queries"
    echo "-plst_dir <playlist directory >  used in conjunction with -plst"
    echo "-outfile <outfile> "
}

function parse_args {
    while (( "$#" ))
    do
     case "$1" in
      "-entryId")
         shift
         entryId=$1
      ;;
      "-flv")
         shift
         filter=$1
      ;;
       "-plst")
         shift
         playlist_filter=$1
      ;;
        "-srv")
         shift
         server=$1
      ;;
      "-plst_dir")
         shift
         playlistDirectory=$1
      ;;
       "-outfile")
         shift
         outfile=$1
      ;;
      *)
        echo "unsupported option $1"
        usage
      ;;
     esac
    shift
    done
}

parse_args "$@"

entryId=${entryId:-*}

filter=${filter:-.*}

server=${server:-127.0.0.1}

playlist_filter=${playlist_filter:-playlist.json}

playlistDirectory=${playlistDirectory:-ddd}

outfile=${outfile:-/var/tmp/output}

echo "entryId=$entryId server=$server playlistDirectory=$playlistDirectory server=$server filter=$filter outfile=$outfile"

[ -d "$playlistDirectory" ] && playlists=(`ls $playlistDirectory/$entryId/$playlist_filter`) || playlists=('playlist.json')

#echo "${playlists[@]}"
[ -f $outfile ] &&  >$outfile || touch $outfile;

use_dts_times=1
if [[ "$use_dts_times" -eq "1" ]]
then
    threshold=$((1*90))
    align_threshold=$((10*90))
    dts_wrap=$((1<<33))
    function dts_diff(){
         local retval=$(( ($1 + $dts_wrap - $2) % $dts_wrap ))
         #check for negative diff...
         (( retval >= dts_wrap/2 )) && retval=$(($1-$2))
         echo $retval
    }
else
    threshold="0.001"
    align_threshold="0.01"
    function dts_diff(){
         echo "$1 - $2" | bc
    }
fi

echo "use_dts_times=$use_dts_times threshold=$threshold align_threshold=$align_threshold"

function checkDiscontinuity {

  local trackEndDTS=$2

  if [ -n "$trackEndDTS" ]
  then
     local trackStartDTS=$1
     local media=$3
     local diff=`dts_diff $trackStartDTS  $trackEndDTS`

     if [ `echo "$diff < -$threshold" | bc` = "1" ]
     then
         echo "($media) discontinuity: dts go back $diff"
     elif [ `echo "$diff > $threshold" | bc` = "1" ]
     then
         echo "($media) discontinuity: dts jumps forwards  $diff"
     fi
  fi
}

# sample input: seg-1466803160985-12000-146680317-f1-v1.ts -> [seg , 1466803160985 , 12000 , 146680317 , f1  , v1.ts]
function dbgInfoCmp {
    #echo "dbgInfoCmp <$1> <$2>"
    IFS="-"
    local di1=(${1})
    local di2=(${2})
    local starrttime1=${di1[1]} ; local dur1=${di1[2]}
    local starrttime2=${di2[1]} ; local dur2=${di2[2]}

    #echo "starrttime1=$starrttime1  dur1=$dur1  starrttime2=$starrttime2 dur2=$dur2"

    [[ "$starrttime1" -ne "$starrttime2" ]] && echo "starttime: $starrttime1 != $starrttime2"
    [[ "dur1" -ne "$dur2" ]] && echo "duration: $dur1 != $dur2"
}

# lookupTSFile prints warnings in case existing ts matches partially (bad starttime/duration correlation)
# returns: length of matcvhed ts, 0 in cast ts doesn't exist
function lookupTSFile {

    local ifs=$IFS
    IFS="-"
    items=($1)
    local n=${#items[@]}
    #echo ${items[@]}
    # result: seg-1466803160985-12000-146680317-f1-v1.ts -> seg 1466803160985 12000 146680317 f1 v1.ts
    # take 3 last tokens
    local n=${#items[@]}
    [[ "$1" =~ "-a1" ]] &&  audio=1 || audio=0
    [[ "$audio" -eq "1" ]] && pattern="(.*)-${items[$n-4]}-${items[$n-3]}-${items[$n-2]}-${items[$n-1]}" || pattern="(.*)-${items[$n-3]}-${items[$n-2]}-${items[$n-1]}"
    found=`grep -iEo "$pattern" $outfile`

    # if debug info on chunk name is present then validate
    local retval=${#found}
    [[ "$audio" -eq "1" ]] && fieldsCnt=5 || fieldsCnt=4
    if (( $retval > 0 && $n > $fieldsCnt ))
    then
        #echo "n=$n found=$found"
        dbgInfoCmp "$1" "$found"
    fi
    #echo "found=$found"

    IFS=$ifs
    return $retval
}

function analyzeChunk {

   chunk=$1

  #echo "analyzeChunk $chunk"

   warning=`lookupTSFile $chunk`

   retval=$?

   #echo "analyzeChunk chunk=$chunk retval=$retval"

   [ -n "$warning" ] && echo $warning >> $outfile

   [ "$retval" -eq "0" ] || return

   #echo "analyzeChunk new chunk $chunk"

   echo  "`date` $chunk" >> $outfile;

    declare -a mediaTypes
    if [[ "$chunk" =~ "-v1" ]]
    then
        mediaTypes[0]='v'
    fi
    [[ "$chunk" =~ "-a1" ]] && mediaTypes[1]='a'

    echo "mediaTypes=${mediaTypes[@]}"

    local urlPrefix="http://$server:8080/hls/$entryId/playlist.json"

    unset medias
    for media in ${mediaTypes[@]}
    do
        #echo -e "\nstream=$media " >> $outfile

        [ "$media" = "v" ] &&  index=0 || index=1

        if [[ "$use_dts_times" -eq "1" ]]
        then
            dts_pat="dts=";   initial_dts="9090"
            pts_pat="pts=";
        else
            dts_pat="dts_time=";   initial_dts="11"
            pts_pat="pts_time=";
        fi
        #NB: 9090 is packager initial offset for dts
        line=`ffprobe "$urlPrefix/$chunk"  -show_packets  -select_streams $media  | \
         awk -v dtspat=$dts_pat -v ptspat=$pts_pat -v dts_initial_dts=$initial_dts\
           'BEGIN{ offset=length(dtspat)+1; dur_offset=length(dts_durationpat)+1; durCnt = 0; durSum = 0 } \
            $0 ~ ptspat  {  if(!first_pts){ first_pts=substr($0,offset); first_pts=((first_pts+8589934592)-dts_initial_dts)%8589934592 } } \
            $0 ~ dtspat  {  cur=substr($0,offset); if(last){ durCnt++;durSum += cur-last; } last = cur; if(!first){first=last} } \
          END{ if(durCnt==0){durCnt=1} duration_time=int(durSum/durCnt);  last=((last+8589934592)-dts_initial_dts)%8589934592; first=((first+8589934592)-dts_initial_dts)%8589934592; last+=duration_time; print first_pts" "((first_pts+(last-first)+8589934592)%8589934592)" "(last-first)}'`

         medias[index]="$media $line"
         #>> $outfile
       # echo -e "$endLine" >> $outfile
    done;

    if [ -n "${medias[0]}" ]
    then
         video=(${medias[0]})


         [ -n "$videoTrackEndDTS" ] && warning="$warning `checkDiscontinuity ${video[1]} $videoTrackEndDTS  video`"
         videoTrackEndDTS=${video[2]}
         #echo "warning=$warning"

         if [ -n "${medias[1]}" ]
         then
            audio=(${medias[1]})

            [ -n "$audioTrackEndDTS" ] && warning="$warning `checkDiscontinuity ${audio[1]} $audioTrackEndDTS  audio`"
            audioTrackEndDTS=${audio[2]}

            echo "${video[@]}  ${audio[@]}" >> $outfile;
            chunkStartDTSDiff=`echo "${video[1]} -${audio[1]}" | bc`
            cumulativeDiff=`echo "$cumulativeDiff+$chunkStartDTSDiff" | bc`
            chunkStartEndTSDiff=`echo "${video[2]} -${audio[2]}" | bc`
            #there's no double processing in bash...
            [[ `echo "$chunkStartEndTSDiff >= $align_threshold" | bc` = "1" ]]  || [[ `echo "$chunkStartEndTSDiff >= $align_threshold" | bc` = "1" ]]  && warning="$warning video/audio track alignment: $chunkStartEndTSDiff > $align_threshold sync=$cumulativeDiff"

            [[ "$warning" =~ [A-Za-z] ]] && warning="errors: $warning"
            echo "diffs: $chunkStartDTSDiff $chunkStartEndTSDiff `echo "${video[3]} - ${audio[3]}" | bc` $warning" >> $outfile;
         else
           [[ "$warning" =~ [A-Za-z] ]] && warning="errors: $warning"
           echo "${video[1]} ${video[2]} ${video[3]} $warning" >> $outfile;
         fi

    fi
}

function queryChunks {

    for playlist in ${playlists[@]}
    do
        [[ "$playlist" =~ ".human" ]] && continue

        #echo "processing $playlist"

        urlPrefix="http://$server:8080/hls/$entryId/`basename $playlist`"

        #echo "urlPrefix=$urlPrefix"

        indices=(`curl $urlPrefix/master.m3u8 | grep -iE "index-$filter"`)

        #echo "${indices[@]}"


        for index in ${indices[@]}
        do
            chunks=(`curl $urlPrefix/$index | grep "seg-"`) || echo "curl $urlPrefix/$index | grep \"seg-\" error $?"

            for chunk in ${chunks[@]}
            do
                #echo -e $partitionLine"$chunk"
                analyzeChunk "$chunk"
            done
        done

    done
}

g_done=0

trap "g_done=1" SIGINT SIGTERM



while [ "$g_done" -ne "1" ]
do
    queryChunks
    sleep 5s
done


#wait
echo "done..."
cat $outfile