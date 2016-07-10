#! /bin/bash

function usage {
    echo "usage:"
    echo "$0 -r <seg # from> <seg # to>"
    echo "-url <url prefix for master/index> "
    echo "-url <url prefix for master/index> "
    echo "-out <output file (defaults to /var/tmp/output)> "
    echo "-flv <restrict dump to specific flavor (f1 etc)>"
}

function parse_args {
    while (( "$#" ))
    do
     case "$1" in
      "-r")
         shift
         range_start=$1
         shift
         range_end=$1
      ;;
      "-url")
         shift
         urlPrefix=$1
      ;;
       "-out")
         shift
         outfile=$1
      ;;
        "-flv")
         shift
         flv=$1
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

range_start=${range_start:-0}
range_end=${range_end:-0}

echo "range=$range_start-$range_end"

urlPrefix=${urlPrefix:-http://127.0.0.1:8080/hls/0_bvu1eq3g/playlist.json}
echo "urlPrefix=$urlPrefix"

outfile=${outfile:-/var/tmp/output}
echo "outfile=$outfile"

flv=${flv:-}
echo "flv=$flv"

indices=(`curl $urlPrefix/master.m3u8 | grep -E "index-$flv"`)

echo "${indices[@]}"

partitionLine="\n-------------------------\n"
endLine="\n++++++++++++++++++++++\n"

declare -a mediaTypes=('a' 'v')

[ -f $outfile ] &&   >$outfile || touch $outfile;
range_length=$((range_end-range_start))


for index in ${indices[@]}
do
    chunklist=`curl $urlPrefix/$index | grep -iE "seg-"`

    for chunk in ${chunklist[@]}
    do
        found=
        if [[ "$range_length" -ne "0" ]]
        then
            for segnum in `seq 0 $range_length`
            do
                ((segnum+=range_start))
                #echo "chunk=$chunk matching $segnum"
                if [[ "$chunk" =~ "-$segnum-" ]]
                then
                    found=$chunk
                    break
                fi
            done
        else
            found=$chunk
        fi

        echo "found=$found chunk=$chunk"
        [ -n "$found" ] || continue

        echo -e $partitionLine"$found" >> $outfile;

        for media in ${mediaTypes[@]}
        do
            echo -e "\nstream=$media" >> $outfile

            #echo -e "\ncount:\tdts:\n$partitionLine" >> $outfile

            ffprobe -show_packets  $urlPrefix/$found  -select_streams $media  | \
            awk 'BEGIN{ offset=length("dts_time=")} $0 ~ /dts_time=/  { print counter++"\t"substr($0,offset+1)}' | \
            awk 'NR == 1 { printf "%s\n", $0 } { last = $0 } END { printf last} ' >> $outfile
           # echo -e "$endLine" >> $outfile
        done;
    done
done

echo "done"
cat $outfile