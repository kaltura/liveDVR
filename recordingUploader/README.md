# Recording uploader

## Preqrequisites
* python 2.7


## Clone repository
```
git clone https://github.com/kaltura/liveDVR.git ; cd recordingUploader/
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
 cp recording_uploder.sh /etc/init.d/recording_uploder
```


```
service recording_uploder start
```

To stop the server

```
service recording_uploder stop
```

To restart the server

```
service recording_uploder restart
```


To check the server status

```
service recording_uploder status
```