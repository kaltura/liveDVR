#! /bin/bash

dirname=`dirname $0`

os_name=`uname`

confDir=`readlink -f $dirname/../config/`

case  "$os_name" in
case "Darwin")
    binDir=darwin;;
case "Linux")
    binDir=linux/;;

nginxPath=$dirname/$binDir/nginx

sed "s#@CONTENT_DIR@#~/dvr/dvr/dvrContentRootPath/#" $confDir/nginx.conf.template > /var/tmp/nginx.conf

$nginxPath -c /var/tmp/nginx.conf &> /dev/null &