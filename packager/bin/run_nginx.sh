#! /bin/bash

dirname=`dirname $0`

[[ $dirname =~ ^/ ]] || dirname="`pwd`/$dirname"

cd $dirname

scriptName=`basename $0`

os_name=`uname`

confDir=$dirname/../config/

echo "dirname=$dirname"

echo "confDir=$confDir"

case  $os_name in
"Darwin")
    binDir=darwin
    ;;
"Linux")
    binDir=linux
    ;;
esac

nginxPath="$dirname/../../bin/$binDir/nginx"

contentDir=`cat "$dirname/../../common/config/config.json" | awk '$0 ~ /rootFolderPath/ { printf substr($2,2,length($2)-3) }'`

if [ -z "$contentDir" ]
then
    echo "could not infer contentDir!"
    exit 1
fi

echo "contentDir = $contentDir"

wwwDir="$dirname/../www"
echo wwwDir = $wwwDir
port=${2:-8080}

rm -rf "/var/tmp/*nginx.conf*"

echo "copying $confDir*"
for file in $confDir* ; do
    filename=${file##*/}
    newFile="/var/tmp/${filename/.template/}"
    echo "$file"  to  "$newFile"
    sed  -e "s#@CONTENT_DIR@#$contentDir/#" -e "s#@PORT@#$port#" -e "s#@WWW_DIR@#$wwwDir#"  ${file} > ${newFile}
done

function getNginxPids(){
    ps -fA | grep nginx | grep -vE "grep|$scriptName" | awk '{print $2}'
}

processes=(`getNginxPids`)

echo "processes=$processes"

for p in ${processes[@]}
do
    echo "killing $p"
    kill -9 $p
done

echo "running $nginxPath -c /var/tmp/nginx.conf"

nginxDir="/usr/local/nginx"

[ -d "$nginxDir" ] || mkdir -p $nginxDir

[ -d "$nginxDir/logs" ] || mkdir -p "$nginxDir/logs"

$nginxPath -c /var/tmp/nginx.conf &> /dev/null &

echo "nginx log dir is: $nginxDir/logs"

echo "nginx pid(s) is:"
getNginxPids
