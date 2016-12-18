#!/bin/bash


#TODO: fix sort suspected issue that causes false alarm on missing tss in high edge of flavor '3' when running following:
#./validate_hls_data_warehouse.sh -p "/Users/lilach.maliniak/Documents/tmp/DVR/1_oorxcge2_101016-2" -r "sort -n -t_ -k3" -i "s/.*_\([0-9]*\).ts/\1/"

debug=true
path='a'
ts_pattern='a' # 'sort -n -t_ -k3' or 'sort -n -t- -k3'
ts_index_pattern='a' #'s/.*_\([0-9]*\).ts/\1/' or 's/.*-\([0-9]*\)-.*.ts/\1/'
res_file='file1'
result="succeeded"

function printDebugMsg() {
	local __message=$1

	if [ $debug = true ];
		then
		echo "$__message"
	fi;
}

# Read the file in parameter and fill the array named "array"
function getArray() {
    array=() # Create array
    while IFS= read -r line # Read a line
    do
        array+=("$line") # Append line to the array
    done < "$1"
}


function walkFiles() {

	echo "starting walkFiles()"

	local __files_pattern="$1"
	local __index_pattern="$2"
	local __flavor_dir="$3"
	local __first_index="$4"
	local __last_index="$5"
	local __missing_files="$6"
	local __subject="$7"
	local __first_file="${8}"
	local __last_file="${9}"
	local __sort="${10}"
	local __files_count="${11}"
	local __k=0
	local __msg=''
	local __ordered_files_array=($( $__files_pattern | $__sort));
	local count=${#__ordered_files_array[@]};

    if [ "$debug" = true ];
    	then
    		echo "validating $__subject of [flavor-$__flavor_dir]:"
    		echo "num $__subject files: ${#__ordered_files_array[@]}"
			echo "__files_pattern=$__files_pattern"
			echo "__index_pattern=$__index_pattern"
			echo "__flavor_dir=$__flavor_dir"
			echo "__first_index=$__first_index"
			echo "__last_index=$__last_index"
			echo "__missing_files=$__missing_files"
			echo "__subject=$__subject"
			echo "__first_file=$__first_file"
			echo "__last_file=$__last_file"
			echo "__sort=$__sort"
			echo "__files_count=$__files_count"
	fi;

	#echo "$count";
	eval $__files_count=$count;
	#echo "__ordered_files_array: count=${#__ordered_files_array[@]}";

	local __file_index=($(echo ${__ordered_files_array[0]} | sed $__index_pattern));
	#echo "<<< __file_index=$__file_index >>>"

	__file_index=($(echo ${__ordered_files_array[0]} | sed $__index_pattern));
	eval $__first_index=$__file_index;
	#echo "<<< $__first_index=$__file_index >>>"
	#echo "${__ordered_files_array[0]}"
	eval $__first_file=${__ordered_files_array[0]};
	#echo "<<< $__first_file=${__ordered_files_array[0]} >>>"

	for file in "${__ordered_files_array[@]}";
	    do
			printf -v __msg "%s" "$file"
			printDebugMsg "$__msg"

			__next_index=($(echo $file | sed $__index_pattern));

            while [ $__next_index != $__file_index ];
            do
            	    echo "missing index=$__file_index != $__next_index"
            	    printf -v __msg "%s/%d/chunklist_%d.m3u8" "$path" "$__flavor_dir" "$__file_index"
            		eval $__missing_files[$__k]=$__msg
            		echo "missing $__subject __missing_files[$__k]=$__msg";
            		__k="$(($__k+1))";
            		let __file_index=__file_index+1
            done
            __file_index="$(($__next_index + 1))";
    done;

    local __last="$((${#__ordered_files_array[@]} - 1))";
	eval $__last_index=$__next_index;
	#echo "<<< $__last_index=$__next_index >>>"
	eval $__last_file=${__ordered_files_array[$__last]};
	#echo "<<< $__last_file=${__ordered_files_array[$__last]} >>>"

    echo "finished walkFiles()"
}

function getMin() {
	echo "starting getMin()"
    echo "NOT IMPLEMENTED"
	echo "finished getMin()"
}

function getMax() {
 	echo "starting getMax()"
 	local __minmax_array=$1
 	local __flavors=$2
 	local __subject=$3
 	local __max_index= #${!__minmax_array[1]}
 	eval __max_index=\( \${${__minmax_array}[@]} \)
 	local __result=$4

 	echo "__minmax_array=$__minmax_array"
 	echo "num items: ${#__minmax_array[@]}"
 	echo "__flavors=$__flavors"
 	echo "__subject=$__subject"
 	echo "__max_index=$__max_index"

 	for i in "${!__minmax_array[@]}";
 	do
       echo "testing: $i"
 	done;

 	echo "max $3 index is $__max_index"
 	echo "__result=${!__result}"

 	echo "finished getMax()"
}

function parseCommandLineArgs() {
	echo "starting parseCommandLineArgs()"
	local args=$1

	while [[ args -gt 1 ]]
	do
	key="$1"
	    case $1 in
	        -p | --path )           shift
	                                echo "${key}=${1}"
	                                path=$1
	                                ;;
	        -r | --ts_pattern )     shift
	                                echo "${key}=${1}"
	                                ts_pattern=$1
	                                ;;
  			-i | --ts_index_pattern ) shift
	                                echo "${key}=${1}"
                                    ts_index_pattern=$1
	                                ;;
	        -h | --help )           usage
	                                exit
	                                ;;
	        * )                     usage
	                                echo "${key}=$2"
	                                exit 1
	    esac
	    shift
	done;
	echo "finished parseCommandLineArgs()"
}

function getFlavorsDirs() {
	echo "starting getFlavorsDirs()"
	local __dirs=$1
	local __arr=($(ls -d *))
	local __j=0

    echo "flavors list:"
	for i in "${__arr[@]}";
	    do
	    	if [ -d "${i}" ];
	    		then
	    			 eval $__dirs[$__j]=$i;
	    			 echo " $i"
	   			 	 __j=$__j+1;
	        fi;
	done;
	echo "finished getFlavorsDirs()"
}

function integritySummary() {

    echo "starting validateFilesOnEdges()"
    local __name=$1[@]
    local __edge_chunklist_files=("${!__name}")
    __name=$2[@]
    local __missing_tss=("${!__name}")
    __name=$3[@]
    local __flavors_dirs=("${!__name}")
    __name=$4[@]
    local __missing_chunklists=("${!__name}")
    __name=$5[@]
    local __chunklist_edge_indexes=("${!__name}")
    local __min_chunklist=0
    local __max_chunklist=0
    local total_missing_chunklists=0
    local total_missing_tss=0


	if [ "$debug" = true ]
	then
		echo "__edge_chunklist_files size=${#__edge_chunklist_files[@]}"
	    for i in "${__edge_chunklist_files[@]}" ; do
	        echo "$i"
	    done;
        echo "__missing_tss size=${#__missing_tss[@]}"
	    for i in "${__missing_tss[@]}" ; do
	        echo "$i"
	    done;
        echo "__flavors_dirs size=${#__flavors_dirs[@]}"
	    for i in "${__flavors_dirs[@]}" ; do
	        echo "$i"
	    done;
    	echo "__missing_chunklists size=${#__missing_chunklists[@]}"
	    for i in "${__missing_chunklists[@]}" ; do
	        echo "$i"
	    done;
        echo "__chunklist_edge_indexes size=${#__chunklist_edge_indexes[@]}"
	    for i in "${__chunklist_edge_indexes[@]}" ; do
	        echo "$i"
	    done;
    fi;

   __min_chunklist=${__chunklist_edge_indexes[0]};
   __max_chunklist=${__chunklist_edge_indexes[0]};

   local __z=0
   while [  $__z -lt ${#__chunklist_edge_indexes[@]} ];
   do
      if [ $__min_chunklist -gt ${__chunklist_edge_indexes[$__z]} ];
      then
      		printDebugMsg "$__z, ${__chunklist_edge_indexes[$__z]}"
      		__min_chunklist=${__chunklist_edge_indexes[$__z]}
      		printDebugMsg "__min_chunklist=$__min_chunklist"
      fi;
 	  if [ $__max_chunklist -lt ${__chunklist_edge_indexes[$(($__z+1))]} ];
      then
      		printDebugMsg "$(($__z+1)), ${__chunklist_edge_indexes[$(($__z+1))]}"
      		__max_chunklist=${__chunklist_edge_indexes[$(($__z+1))]}
      		printDebugMsg "__max_chunklist=$__max_chunklist"
      fi;
      __z=$(($__z+2))
   done;

   echo "chunklists range: [$__min_chunklist-$__max_chunklist]"

   local __z=0

   #echo "${#__chunklist_edge_indexes[@]}"

   while [  $__z -lt ${#__chunklist_edge_indexes[@]} ];
   do
   	  echo "__chunklist_edge_indexes[$__z]=${__chunklist_edge_indexes[$__z]} __min_chunklist=$__min_chunklist"
   	  if [ ${__chunklist_edge_indexes[$__z]} -gt $__min_chunklist ];
      then
      		local msg
      		printf -v msg "[f-%d] missing chunklists on the lower edge:" $((1+$__z/2))
      		echo $msg
      		echo $msg >> $res_file
      		total_missing_chunklists=$((${__chunklist_edge_indexes[$__z]} - $__min_chunklist))

      		printf -v msg "total_missing_chunklists=%d" "$total_missing_chunklists"
            echo $msg
            echo $msg >> $res_file

            for ((i=1;i<=$total_missing_chunklists;i++));
            do
	            # missing chunklist files at the edges
	      		printf -v msg "%d: %s/%d/chunklist_%d.m3u8\n" "$i" $path "$((1+$__z/2))" "$(( ${__chunklist_edge_indexes[$(($__z+1))]} - $__min_chunklist+ $i))";
	      		echo $msg
	      		echo $msg >> $res_file
      		done;

      		if [ "$total_missing_chunklists" -ne "0" ]; then
       	  		result="failed"
      		fi
      fi;

   	  if [ ${__chunklist_edge_indexes[$(($__z+1))]} -lt $__max_chunklist ];
      then
      		local msg
      		printf -v msg "[f-%d] missing chunklists on the high edge:" $((1+$__z/2))
      		echo $msg
      		echo $msg >> $res_file
      		total_missing_chunklists=$(($__max_chunklist - ${__chunklist_edge_indexes[$(($__z+1))]}))

      		printf -v msg "total_missing_chunklists=%d" "$total_missing_chunklists"
            echo $msg
            echo $msg >> $res_file

            for ((i=1;i<=$total_missing_chunklists;i++));
            do
	            # missing chunklist files at the edges
	      		printf -v msg "%d: %s/%d/chunklist_%d.m3u8\n" "$i" $path "$((1+$__z/2))" "$(( ${__chunklist_edge_indexes[$(($__z+1))]} + $i))";
	      		echo $msg
	      		echo $msg >> $res_file
      		done;

      		if [ "$total_missing_chunklists" -ne "0" ]; then
       	  		result="failed"
      		fi
      fi;
      __z=$(($__z+2))
    done;

	echo " >>>>>>>>>>>>>>>>> validation process finished <<<<<<<<<<<<<<<<<<< "
	echo "<====== ${#__missing_chunklists[*]} Chunklist Files Missing =======>"
	echo '  ' $'\x1d' "<====== ${#__missing_chunklists[*]} Chunklist Files Missing =======>" $'\x1d' | column -t -s$'\x1d' >> $res_file
	if [ "${#__missing_chunklists[*]}" -ne "0" ]; then
       	result="failed"
    fi

	for key in ${!__missing_chunklists[*]};
	do
		echo "$(($key+1)): ${__missing_chunklists[$key]}"
		printf "%d: %s\n" $(($key+1)) ${__missing_chunklists[$key]} >> $res_file
	done;
	echo "<============ ${#__missing_tss[*]} TS Files Missing ===========>"
	echo '  ' $'\x1d' "<====== ${#__missing_tss[*]} TS Files Missing =======>" $'\x1d' | column -t -s$'\x1d' >> $res_file
	if [ "${#__missing_chunklists[*]}" -ne "0" ]; then
       	result="failed"
    fi

	for key in ${!__missing_tss[*]};
	do
	   echo "$(($key+1)): ${__missing_tss[$key]}"
	   printf "%d: %s\n" $(($key+1)) ${__missing_tss[$key]} >> $res_file
	done;
	echo "<======================== end of validation summary ============================>"

    if [ "$debug" = true ]; then
		for i in ${!__edge_chunklist_files[*]};
		do
			printf "__edge_chunklist_files[%d]=%s\n" $i ${__edge_chunklist_files[$i]}
		done;
	fi;

	__z=0
	local l=0
    local __msg
    local flavor
    local title=''

    # echo "${#__edge_chunklist_files[@]}"
	while [  $__z -lt ${#__edge_chunklist_files[@]} ];
   	do
   		flavor=$(($__z/2+1))
   		l=6
   		local ts_arr=()
   		#!!! Note: !!! the number of ts chunks in playlist depends on the window size
   		# => 20 might not be enough in some cases
   		if [ $(($__z % 2)) -eq 0 ]; then
   			printf -v __msg "[f-%d] missing TSs on low edge:" $flavor
   			ts_arr=($(ls $flavor/*.ts |  $ts_pattern | head -n 20))
   			title="validating TSs on low edge"
        else
        	printf -v __msg "[f-%d] missing TSs on high edge:" $flavor
        	ts_arr=($(ls $flavor/*.ts |  $ts_pattern | tail -n 20))
        	title="validating TSs on high edge"
        fi;
   		echo $__msg
   		echo $__msg >> $res_file

		local edge_file=${__edge_chunklist_files[$__z]}
		getArray "${edge_file}"

		echo "$title"

		if [ $debug = true ];
		then
		    echo "****** DEBUG SECTION STARTED ******"
			echo "file=$edge_file"
			echo "[f-$flavor] 1st file:"
			echo "<><><> ${#array[@]} array[$l]=${array[$l]}"
			echo "${array[$l]}"

			for e in "${array[@]}"
			do
			    echo "$e"
			done

			#low=($(echo ${array[$l]} | awk -F"[_.]" '{print $3}'));
			#echo $low
			#echo "dir content: $msg"
			for f in "${ts_arr[@]}"
			do
				echo "$f"
			done
			echo "******* DEBUG SECTION ENDED *******"
		fi;

		echo "[f-$flavor] chunklist content size: ${#array[@]}"
		local total_missing_tss=0
        local __errmsg=''

        if [ "${#array[@]}" -eq "0" ]; then
            printf -v __errmsg "[f-%u] file %s is empty" "$flavor" "${edge_file}"
            echo "empty ${edge_file}"
            echo $__errmsg
            echo $__errmsg >> $res_file
            result="failed"
        else
			#for ((i=0; i<${#ts_arr[@]}; i++));
			i=0
			while [ "$l" -lt "${#array[@]}" ];
			do
			   #echo  "found file: ${ts_arr[$i]}"
               local index_from_ts_filename=($(echo ${ts_arr[$i]} | sed $ts_index_pattern));
               local index_from_chunklist_content=($(echo ${array[$l]} | sed $ts_index_pattern));
               echo "index from list of TS files: $index_from_ts_filename"
               echo "index from chunklist content: $index_from_chunklist_content"

	           #while [  "${ts_arr[$i]}"  "$flavor/${array[$l]}" ];
	           if [ "$index_from_ts_filename" -lt "$index_from_chunklist_content" -a "$i" -lt "${#ts_arr[@]}" ];
	           	then
	           	    local __infoMsg
	           		while [ "$index_from_ts_filename" -lt "$index_from_chunklist_content" -a "$i" -lt "${#ts_arr[@]}" ]
	           		do
	           		   printf -v __infoMsg "[f-%u] skipping TS file that is not in chunklist %s"  "$flavor" "${ts_arr[$i]}"
	           		   echo "echo $__infoMsg"
	           		   printDebugMsg "$__infoMsg"
		               let i=i+1
		               index_from_ts_filename=($(echo ${ts_arr[$i]} | sed $ts_index_pattern));
		               printf -v __infoMsg "[f-%u] next TS file index from TSs files list: %u" "$flavor $index_from_ts_filename"
		               printDebugMsg "$__infoMsg"
		           done;
	           fi;
	           if [ "$i" -lt "${#ts_arr[@]}" ];
	           then
		           while [ "$index_from_ts_filename" -gt "$index_from_chunklist_content" ]
		           do
		               printf -v __msg "[f-%u] missing TS: %s" "$flavor" "${array[$l]}"
		               echo $__msg
		               echo $__msg >> $res_file
		               let l=l+2
		               let total_missing_tss=total_missing_tss+1
		               index_from_chunklist_content=($(echo ${array[$l]} | sed $ts_index_pattern));
		           done;
		           let l=l+2
		           let i=i+1
	           else
                   echo "Error, the list of TS files doesn't contain some or all the files in edge chunklist content!!!"
                   result=failed
	           fi;
			done;
		fi;

		if [ "$total_missing_tss" -ne "0" ]; then
       		result="failed"
    	fi

		let __z=__z+1
		printf -v __msg "total missing: %d" "$total_missing_tss"
		echo $__msg
		echo $__msg >> $res_file
   	done

	echo "finished validateFilesOnEdges()"

}

main() {

	# parse command line args
	# parseCommandLineArgs $#

	local dirs=()
	local missing_chunklists=()
	local missing_tss=()
	local chunklist_files=()
	local msg

	while [[ $# -gt 1 ]]
	do
	key="$1"
	    case $1 in
	        -p | --path )            shift
	                                 echo "${key}=${1}"
	                                 path=$1
	                                 ;;
	        -r | --ts_pattern )      shift
	                                 echo "${key}=${1}"
	                                 ts_pattern=$1
	                                 ;;
	        -i | --ts_index_pattern ) shift
	                                echo "${key}=${1}"
                                    ts_index_pattern=$1
	                                ;;
	        -h | --help )           usage
	                                exit
	                                ;;
	        * )                     usage
	                                echo "${key}=$2"
	                                exit 1
	    esac
	    shift
	done;
    # set params from command line args
	if [ $path != "a" ];
		then
			echo "path=${path}";
			echo "cd ${path}"
			cd $path;
			echo "pwd";
			pwd;
	else
	    path='.'
	    echo "path=${path}"
	fi;
	if [ "$ts_pattern" != "a" ];
		then
			echo "ts_pattern=${ts_pattern}";
	else
		    ts_pattern='sort -n -t - -k2';
		    echo "ts_pattern=${ts_pattern}"
	fi;
	if [ "$ts_index_pattern" != "a" ];
       then
          echo "ts_index_pattern=$ts_index_pattern"
    else
    	  ts_index_pattern='s/.*-\([0-9]*\)-.*.ts/\1/'
    	  echo "ts_index_pattern=$ts_index_pattern"
    fi;
	echo;

	echo "$result" &> $res_file

    # get flavors dirs
    getFlavorsDirs dirs

# run validation on chunklists and tss per flavor
echo '  ' $'\x1d' '<====== Chunklists Info =======>' $'\x1d' '<=========  TSs info  ==========>' $'\x1d'  | column -t -s$'\x1d' >> $res_file

local chunklist_files=()
local missing_chunklists=()
local chunklist_edge_indexes=()
#tss_files=()
missing_tss=()
local max_chunklist=0
local min_chunklist=0
local max_ts=0
local min_ts=0
local pos=0

for i in "${!dirs[@]}";
	do

	#validate chunklists

		pattern=$(printf  'ls %d/chunklist_*.m3u8' ${dirs[$i]})
		sort="sort -n -t_ -k1"
		#echo "$pattern"
		last_index1=0
		start_index1=0
		first_file=''
		last_file=''
		chunklist_files_count=0
		walkFiles "$pattern" 's/.*_\([0-9]*\).m3u8/\1/' ${dirs[$i]} start_index1 last_index1 missing_chunklists 'chunklists' first_file last_file "$sort" chunklist_files_count
		chunklist_files[$(($i*2+0))]=$first_file;
		echo "chunklist_files[$(($i*2+0))]=${chunklist_files[$(($i*2+0))]}"
		chunklist_files[$(($i*2+1))]=$last_file;
		echo "chunklist_files[$(($i*2+1))]=${chunklist_files[$(($i*2+1))]}"
		chunklist_edge_indexes[$(($i*2+0))]=$start_index1
		echo "chunklist_edge_indexes[$(($i*2+0))]=${chunklist_edge_indexes[$(($i*2+0))]}"
		chunklist_edge_indexes[$(($i*2+1))]=$last_index1
		echo "chunklist_edge_indexes[$(($i*2+1))]=${chunklist_edge_indexes[$(($i*2+1))]}"
		#pos=$(($pos+1))

	# validate TSs
		#echo "$i"
		pattern=$(printf  'ls %d/*.ts' ${dirs[$i]})
		sort="sort -n -t_ -k3"
		#echo "$pattern"
		last_index2=0
		start_index2=0
		first_file=''
		last_file=''
		ts_files_count=0
		walkFiles "$pattern" "$ts_index_pattern" ${dirs[$i]} start_index2 last_index2 missing_tss 'TSs' ts_first_file last_file "$ts_pattern" ts_files_count

		echo f-${dirs[$i]} $'\x1d' 'Total' ${chunklist_files_count}':  { '${start_index1}' - '${last_index1}' }   ' $'\x1d' 'Total' ${ts_files_count}':  { '${start_index2}' - '${last_index2}' }' $'\x1d' | column -t -s$'\x1d' >> $res_file
   done;

   if [ "$debug" = true ];
   then
        local m=0
        echo "Chunklist edge indexes:"
   		while [ "$m" -lt "${#chunklist_edge_indexes[@]}" ]
	   		do
	   		echo "[f-$(($(($m/2))+1))]: range [${chunklist_edge_indexes[$m]}-${chunklist_edge_indexes[$(($m+1))]}]"
	   		m=$(($m+2))
   		done;
   fi

   integritySummary chunklist_files missing_tss dirs missing_chunklists chunklist_edge_indexes

   echo "validation result: $result" 2> "temp_file"

   cat "$res_file" | sed "1s/.*/${result}/" > "temp_file"
   mv "temp_file" "${res_file}"

   echo "finished validation of $path"

}

main "$@"

