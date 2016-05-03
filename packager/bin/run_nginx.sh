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

nginxPath=$dirname/$binDir/nginx

sed "s#@CONTENT_DIR@#~/dvr/dvr/dvrContentRootPath/#" $confDir/nginx.conf.template > /var/tmp/nginx.conf

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

$nginxPath -c /var/tmp/nginx.conf &> /dev/null &

echo "nginx pid(s) is:"
getNginxPids