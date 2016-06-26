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

threshold="0.0005"

function checkDiscontinuity {

  local trackEndDTS=$2

  if [ -n "$trackEndDTS" ]
  then
     local trackStartDTS=$1
     local media=$3
     local diff=`echo "$trackStartDTS - $trackEndDTS" | bc`
     if [ `echo "$diff < 0" | bc` = "1" ]
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

   #grep "$chunk" $outfile &> /dev/null && return

lookupTSFile $chunk
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

        line=`ffprobe "$urlPrefix/$chunk"  -show_packets  -select_streams $media  | \
         awk 'BEGIN{ offset=length("dts_time=")+1; dur_offset=length("duration_time=")+1} \
            /duration_time=/ { duration_time=substr($0,dur_offset);} \
            /dts_time=/  { last=substr($0,offset); if(!first){first=last}} \
          END{ last+=duration_time; print first" "last" "(last-first)}'`
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
            chunkStartEndTSDiff=`echo "${video[2]} -${audio[2]}" | bc`
            #there's no double processing in bash...
            [ `echo "$chunkStartEndTSDiff >= $threshold" | bc` = "1" ]  || [ `echo "$chunkStartEndTSDiff >= $threshold" | bc` = "1" ]  && warning="$warning bad alignment WARNING: $chunkStartEndTSDiff"

            echo "diffs: $chunkStartDTSDiff $chunkStartEndTSDiff `echo "${video[3]} - ${audio[3]}" | bc` errors: $warning" >> $outfile;
         else
           echo "${video[1]} ${video[2]} ${video[3]} errors: $warning" >> $outfile;
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