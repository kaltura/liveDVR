#! /bin/bash


range_start=${1:-0}
range_end=${2:-100}

echo "range=$range_start-$range_end"

urlPrefix=${3:-http://127.0.0.1:8080/hls/1_ceut3fcf/playlist.json}
echo "urlPrefix=urlPrefix"

outfile=${4:-/var/tmp/output}
echo "outfile=$outfile"

partitionLine="\n-------------------------\n"
endLine="\n++++++++++++++++++++++\n"

declare -a mediaTypes=('a' 'v')

[ -f $outfile ] &&   >$outfile || touch $outfile;
for file in `seq $range_start $range_end`
do
    echo -e $partitionLine"seg-$file-v1-a1.ts" >> $outfile;

    for media in ${mediaTypes[@]}
    do
        echo -e "\nstream=$media" >> $outfile

        #echo -e "\ncount:\tdts:\n$partitionLine" >> $outfile

        ffprobe -show_packets  $urlPrefix/seg-$file-v1-a1.ts  -select_streams $media  | \
        awk 'BEGIN{ offset=length("dts_time=")} $0 ~ /dts_time=/  { print counter++"\t"substr($0,offset+1)}' | \
        awk 'NR == 1 { printf "%s\n", $0 } { last = $0 } END { printf last} ' >> $outfile
       # echo -e "$endLine" >> $outfile
    done;
done

cat $outfile