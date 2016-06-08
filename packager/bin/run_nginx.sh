#! /bin/bash

dirname=`dirname $0`
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

contentDir=${1:-$HOME/dvr/dvrContentRootPath}
wwwDir="`pwd`/../www"
echo wwwDir = $wwwDir
port=${2:-8080}

sed  -e "s#@CONTENT_DIR@#$contentDir/#" -e "s#@PORT@#$port#" -e "s#@WWW_DIR@#$wwwDir#"  $confDir/nginx.conf.template > /var/tmp/nginx.conf

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
