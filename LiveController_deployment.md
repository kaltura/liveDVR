## Machine prerequisites: ##
- liveController and liveRecorder can be installed in single or separate machines.
- RHEL/CentOS 6.4 or above or Ubuntu 16.0.4 or above 
## New installation of liveController (version format v[X.Y.Z]) ##
### General ###
- it is recommended to install each version in directory created with the version name and use symlink from latest to the currently used version
- you can install liveController using deployment/upgradeLive or manually.
### Binaries build: ###
- run build_scripts/build_ffmpeg.sh 
- build_scripts/build_ffmpg.sh <ffmpeg build path> <ffmpeg version>
- build_scripts/build_addons.sh [installation path] <ffmpeg build path>
### Install order: ###
   * wget https://github.com/kaltura/liveDVR/archive/v[x.y.z].tar.gz
   * tar -xvzf v[x.y.z].tar.gz
   * mv liveDVR-[x.y.z] [installation base path]
   * rm -f v[x.y.z].tar.gz
   * install Node Version Manager 6.3.0+
   * rename common/config/configMapping.json.template to common/config/configMapping.json
   * edit parameters in common/config/configMapping.json
   * create symlink named latest to current installed version
   ln -s [installation base path]/version [installation base path]/latest
   * create symlink to process daemon wrapper under /etc/init.d
   ln -s [installation base path]/latest/serviceWrappers/linux/kLiveController /etc/init.d/kLiveController
   * start liveController
   /etc/init.d/kLiveController start


## Configuration parameters (configMapping.json.template ) ## 

### General configuration: ###
@LIVE_CONTENT_PATH@ - root path to all live streams content
@LIVE_ARCHIVE_CONTENT_PATH@ - root path for archived live streams content
@LOG_FILE_NAME@ - liveController's log filename, including full path
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
   
   
## LiveController upgrade: ##
- deployment/upgradeLive can be used for upgrade
 [installation base path]/latest/deployment/upgradeLive vx.y.z
alternatively download and install latest version according to following instructions:
wget https://github.com/kaltura/liveDVR/archive/v[x.y.z].tar.gz
tar -xvzf v[x.y.z].tar.gz
mv liveDVR-[x.y.z] [installation base path]
rm -f v[x.y.z].tar.gz
- stop liveController
/etc/init.d/kLiveController stop
- unlink latest
unlink [installation base path]/latest
- create symlink from current installed version path to latest dir
ln -s [installation base path]/version [installation base path]/latest
- start liveController
/etc/init.d/kLiveController start



