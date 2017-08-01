## Machine prerequisites: ##
- liveController and liveRecorder can be installed in single or separate machines.
- RHEL/CentOS 6.4 or above or Ubuntu 16.04 or above 

## New installation of liveController (version format v[X.Y.Z]) ##
### General ###
- it is recommended to install each version in directory created with the version name and use symlink from latest to the currently used version
- you can install liveController using deployment/upgradeLive or manually.

### Binaries Build: ###
- build_scripts/build_ffmpeg.sh
- build_scripts/build_addon.sh /path/to/liveController/source> <path/to/ffmpeg/source> [Release/Debug]

#### LiveController Binaries Build
    run build_ffmpeg.sh and build_addon.sh

#### LiveRecorder Binaries Build
    run build_ffmpeg.sh and build_ts2mp4_convertor.sh

### Install Order: ###
* If you are running both liveController and liveRecorder on the same machine you can install both in single installation:
  deployment/upgradeLive <version> install_live_recorder
* it is recommended to install each version in directory created with the version name
 and use symlink named latest to currently used version
1. install latest liveController version from git (liveDVR repository):<br>
    ```wget https://github.com/kaltura/liveDVR/archive/v[x.y.z].tar.gz
        tar -xvzf v[x.y.z].tar.gz
        mv liveDVR-[x.y.z] [installation base path]
        rm -f v[x.y.z].tar.gz```

5. install Node Version Manager 6.3.0+<br>
6. rename common/config/configMapping.json.template to common/config/configMapping.json<br>
7. edit parameters in common/config/configMapping.json<br>
8. create symlink named latest to current installed version
    ```ln -s [path/to/liveController/source]/version [installation base path]/latest```
8 create symlink to process daemon wrapper under /etc/init.d<br>
    ```ln -s [path/to/liveController/source]/serviceWrappers/linux/kLiveController /etc/init.d/kLiveController```
9. start liveController<br>
    ```/etc/init.d/kLiveController start```

###


## Configuration parameters (configMapping.json.template ) ## 

### General configuration: ###
@LIVE_CONTENT_PATH@ - root path to all live streams content
@LIVE_ARCHIVE_CONTENT_PATH@ - root path for archived live streams content
@LOG_FILE_NAME@ - liveController's log filename, including full path. The path should end with liveController.
e.g. [logs/root/path]/liveController/kLiveController.log
### BE server configuration section: ###
@KALTURA_SERVICE_URL@ - url to access the BE server (example:  "http://my_backend_server.com")
@KALTURA_PARTNER_ADMIN_SECRET@ - admin secret for secured access to BE server
@KALTURA_PARTNER_ID@ - partner id, used to get stream from wowza and to access BE
### Media server configuration section: ###
@HOSTNAME@ - wowza (media-server), machine hostname
@WOWZA_ADMIN_USER@ - credentials to access wowza server
@WOWZA_ADMIN_PASSWORD@ - credentials to access wowza server
### Recording configuration section: ###
@RECORDING_FOLDER@ - root path to all recording streams content.
@LOG_DIR@ - root path to liveController logs. This path must be consistent and derived from @LOG_FILE_NAME@.
if @LOG_FILE_NAME@ [logs/root/path]/liveController/kLiveController.log then set @LOG_DIR@=[logs/root/path]
@RUN_DIR@ - pid file full path (excluding filename)
@USE_NVM@ - if you intend to use nvm, set to "1".
@KLIVE_CONTROLLER_PREFIX@ - symlink name to be linked to latest installed version
if value set to [path/to/liveController/latest] and
liveController source is installed under [path/to/liveController/[x.y.z]]
then following symlink will be created:
[path/to/liveController/latest] -> [path/to/liveController/[x.y.z]]
@NODE_PATH@ - full path to npm modules. If your machine has connection to the Internet, set value as follow:
@KLIVE_CONTROLLER_PREFIX@/node_modules that is [path/to/liveController/source]/node_modules.
Otherwise, set path to rpms wrapping the required npms, [path/to/rpm/of/node/modules]
   
   
## LiveController upgrade: ##
1. install latest liveController version from git (liveDVR repository):<br>
    ```wget https://github.com/kaltura/liveDVR/archive/v[x.y.z].tar.gz```
       tar -xvzf v[x.y.z].tar.gz
       mv liveDVR-[x.y.z] [installation base path]
       rm -f v[x.y.z].tar.gz```

5. stop liveController<br>
    ```/etc/init.d/kLiveController stop```
6. unlink latest<br>
    ```unlink [installation base path]/latest```
7. create symlink from current installed version path to latest dir<br>
    ```ln -s [installation base path]/version [installation base path]/latest```
8. start liveController<br>
    ```/etc/init.d/kLiveController start```



