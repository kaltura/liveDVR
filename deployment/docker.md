 to build dockers run from root:
 `docker build -t  kaltura/live-controller -f ./deployment/docker/liveController/Dockerfile .`
 `docker build -t  kaltura/live-packager -f ./deployment/docker/packager/Dockerfile .`
 
 on wowza:
 
  `docker build -t kaltura/media-server .`
  
stop all:
docker stop $(docker ps -a -q) && docker rm  $(docker ps -a -q)

run
`docker-compose   -f ./deployment/docker/docker-compose.yml up
`
 
 
 
 #option1:
 #docker  run --add-host pa-udrm:127.0.0.1    -v /Users/guyjacubovski/dev/nginx-vod-module-saas:/usr/local/nginx/externalConf  -p 80:80  --name packager  -t live-packager
 #or docker  run    -p 80:80  --name packager  -t kaltura/live-packager
 
 
 #docker exec -it `docker ps | grep "live-packager" | awk '{print $1}'` bash
 
 
