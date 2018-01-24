 to build dockers run from root:
 `docker build -t  kaltura/live-controller -f ./deployment/docker/liveController/Dockerfile .`
 cd ./deployment/docker/packager
 `docker build -t  kaltura/live-packager  .`
 
 on wowza:
 
  `docker build -t kaltura/media-server .`
  
  
 run
 `docker up`