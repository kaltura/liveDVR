 to build dockers run from root:
 `docker build -t  kaltura/live-controller -f ./deployment/docker/liveController/Dockerfile .`
 `docker build -t  kaltura/live-packager -f ./deployment/docker/packager/Dockerfile .`
 
 on wowza:
 
  `docker build -t kaltura/media-server .`
  
  
 run
 `docker-compose up`