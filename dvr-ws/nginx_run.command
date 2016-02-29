#!/bin/bash


here="`dirname \"$0\"`"


dvrPath=$( sed -n 's/.*"rootFolderPath": "\(.*\)",/\1/p' $here/../common/config/config.json )
echo "DvrPath=$dvrPath"

logFileNames=($( sed -n 's/.*"logFileName": "\(.*\)",/\1/p' $here/../common/config/config.json ))
logFileName=${logFileNames[1]}

echo "logFileName=$logFileName"
logPath=`dirname $logFileName`
echo "logPath=$logPath"




nginxPath="$dvrPath/nginx"
mkdir  "$nginxPath"
mkdir  "$nginxPath/logs"

echo "nginxPath=$nginxPath"

public="$here/public"

sed -e "s#@dvrContentRootPath@#$dvrPath#g"  -e "s#@public@#$public#g" $here/conf/nginx.conf.template  > $here/conf/nginx.conf


cd "$here"
echo "Stopping"
./nginx -p "$nginxPath"  -c "$here/conf/nginx.conf" -s stop
echo "Restarting"
./nginx -p "$nginxPath"  -c "$here/conf/nginx.conf"