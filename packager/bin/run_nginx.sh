#! /bin/bash

dirname=`dirname $0`
cd $dirname

scriptName=`basename $0`

os_name=`uname`
release_name=`lsb_release -d | awk '{print $2}'`

confDir=$dirname/../config/

echo "dirname=$dirname"

echo "confDir=$confDir"

case  $os_name in
"Darwin")
    binDir=darwin
    ;;
"Linux")
    binDir=linux
    case $release_name in
    "CentOS")
      binDir="$binDir/centos"
      ;;
    "Ubuntu")
       binDir="$binDir/ubuntu"
       packages=(libpcre3 libpcre3-dev zlibc zlib1g zlib1g-dev libssl-dev git make)
       to_install=
       for pkg in ${packages[@]}
       do
            dpkg-query -W $pkg &> /dev/null || to_install="$to_install $pkg"
       done
       [ -n "$to_install" ] && apt-get install $to_install

       LIBCVER='2.17'

       libcVersion=`dpkg-query -W libc6 | awk '{split($2,b,"-"); print b[1]}'`
       if [[ "$libcVersion" != "$LIBCVER" ]]
       then
          wget http://launchpadlibrarian.net/130794928/libc6_$LIBCVER-0ubuntu4_amd64.deb
          dpkg -i libc6_$LIBCVER-0ubuntu4_amd64.deb
       fi
       ;;
    esac
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
