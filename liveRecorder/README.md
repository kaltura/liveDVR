# liveRecorder

## Preqrequisites
* python 2.7
* pip 
* shared nfs storage 


## Clone repository
```
git clone https://github.com/kaltura/liveDVR.git ; cd liveRecorder/
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
 ./instal.sh
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
