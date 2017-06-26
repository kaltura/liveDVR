# liveRecorder

## Preqrequisites
* python 2.7
* pip 
* shared nfs storage 


## Clone repository
```
git clone https://github.com/kaltura/liveDVR.git ; cd liveRecorder/
```

## Compile code:
```
./build_scripts/build_ffmpeg.sh <FFMPEGPATH> <LIVERECORDER_PATH> [Release/Debug]
./build_scripts/ts2mp4_build.sh <FFMPEGPATH> <LIVERECORDER_PATH>
FFMPEGPATH is the path to the ffmpeg root folder (for example root/ffmpeg/ffmpeg-3.0)
LIVERECORDER_PATH is the path to liveRecorder directory tree
```

## fill configMapping.ini in Config 
```
admin_secret = admin secret
partner_id = 12345
api_service_url = http://serviceURL
session_duration = *** (in seconds)
```

### Run the following script
```
 ./install.sh
```

## Setup service script 
```
 cp liveRecorder.sh /etc/init.d/liveRecorder
```


```
service liveRecorder start
```

To stop the server

```
service liveRecorder stop
```

To restart the server

```
service liveRecorder restart
```


To check the server status

```
service liveRecorder status
```
