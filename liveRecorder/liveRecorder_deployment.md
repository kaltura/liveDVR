## Machine prerequisites: ##
- LiveController and liveRecorder can be installed in single or separate machines.
- RHEL/CentOS 6.4 or above or Ubuntu 16.0.4 or above
- ffmpeg 3.0 - (run build_scripts/build_ffmpeg.sh)
- python 2.7 or above

### Install python 2.7 ###
1. use installPython2.7 script <br/>
    ```
    liveRecorder/installPython2.7.sh
    pip install poster
    pip install psutil
    pip install m3u8
    pip install schedule
    pip install pycrypto
    ```
3. run the whole liveRecorder installation which includes python<br/>
```deployment/upgradeLive <version> install_live_recorder```

## Nginx Installation ##
Follow instructions in [nginx installation](https://github.com/kaltura/nginx-vod-module)

##Binaries build: ##
- install and build ffmpeg 3.0<br>
``` build_scripts/build_ffmpg.sh <ffmpeg build path> <ffmpeg version>```
- build ts_to_mp4_convertor<br>
``` build_scripts/build_ts2mp4_convertor.sh </path/to/liveRecorder/source> <path/to/ffmpeg/source>```

# Installation of live-recorder
* If you are running both liveController and liveRecorder on the same machine you can install both in single installation:
  deployment/upgradeLive <version> install_live_recorder
* it is recommended to install each version in directory created with the version name
 and use symlink named latest to currently used version
1. install latest liveRecorder version from git (liveDVR repository):<br>
   ```wget https://github.com/kaltura/liveDVR/archive/v[x.y.z].tar.gz
    tar -xvzf v[x.y.z].tar.gz
    mv liveDVR-[x.y.z] [installation base path]
    rm -f v[x.y.z].tar.gz```
        
2. create configMapping.ini from liveRecorder/Config/configMapping.ini.template:
3. edit configMapping.ini parameters
4. create symlink named latest to current installed version<br>
   ```ln -s [installation base path]/version [installation base path]/latest```
5. create symlink to process daemon wrapper under /etc/init.d<br>
   ```ln -s [installation base path]/latest/liveRecorder/serviceWrappers/linux/liveRecorder /etc/init.d/liveRecorder```
6. start liveRecorder<br>
   ```/etc/init.d/liveRecorder start```

## Configuration (configMapping.ini)

@RECORDING_FOLDER@ - root path to all streams recorded content<br>
@KALTURA_PARTNER_ID@ - partner Id to be used to get vod from nginx<br>
@VOD_UPLOAD_MODE@ - working mode should be set to "remote" if content is uploaded to remote server (BE server), otherwise "local"<br>
@LIVE_PACKAGER_TOKEN@ - token key, for secured access to nginx<br>
@LOGS_BASE_PATH@ - the path to all liveRecorder log files<br>
@KALTURA_SERVICE_URL@ - url to access the BE server (example:  "http://www.kaltura.com")<br>
@KALTURA_PARTNER_ADMIN_SECRET@ - admin secret for secured access to BE server<br>
@RUN_DIR@ - pid file full path (excluding filename)
@USE_NVM@ - if you intend to use nvm, set to "1".
@KLIVE_RECORDER_PREFIX@ - symlink name to be linked to latest installed version
if value set to [path/to/liveRecorder/source/latest] and
liveRecorder source is installed under [path/to/liveRecoder/source/[x.y.z]]
then following symlink will be created:
[path/to/liveRecorder/source/latest] -> [path/to/liveRecorder/source/[x.y.z]]

##LiveRecorder upgrade: ##
 
1. deployment/upgradeLive can be used for upgrade<br>
   ```wget https://github.com/kaltura/liveDVR/archive/v[x.y.z].tar.gz
    tar -xvzf v[x.y.z].tar.gz
    mv liveDVR-[x.y.z] [installation base path]
    rm -f v[x.y.z].tar.gz```

2. install Node Version Manager 6.3.0+
3. install Node Packaged Modules (npm) 1.4.3+
4. stop liveRecorder<br>
    ```/etc/init.d/liveRecorder stop```
5. unlink latest<br>
    ```unlink [installation base path]/latest```
6. create symlink from current installed version path to latest dir<br>
    ```ln -s [installation base path]/version [installation base path]/latest```
7. start liveRecorder<br>
    ```/etc/init.d/liveRecorder start```



