#! /bin/bash

dirname=`dirname $0`

scriptName=`basename $0`

os_name=`uname`

confDir=$dirname/../config/



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

declare a dylibFiles

baseDir="$dirname/$binDir/"

for dylibFile in `find $baseDir -type f -name "*.dylib"`
do
    targetFile=${dylibFile/$baseDir/}
    echo "$targetFile"
    if [ ! -f "$targetFile" ]
    then
        echo "not found!"
        dylibFiles+=("$targetFile")
        ln -sf $dylibFile $targetFile
    fi
done

function cleanup()
{
    echo "cleanup... ";
    for file in ${dylibFiles[@]} ;
    do
        rm -f $file
    done
    echo "done!"
}

if [ "${#dylibFiles[@]}" -ne "0" ]
then
    trap cleanup SIGINT SIGTERM SIGSTOP 0
fi

contentDir=${1:-$HOME/dvr/dvrContentRootPath}

port=${2:-8080}

sed  -e "s#@CONTENT_DIR@#$contentDir/#" -e "s#@PORT@#$port#" $confDir/nginx.conf.template > /var/tmp/nginx.conf

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