## Machine prerequisites:
====================================================
liveController & liveRecorder can be installed in single or separate machines.

## Software prerequisites:
====================================================
 - RHEL/CentOS 7 or above or Ubuntu 16.0.4 or above
 - ffmpeg 3.0 - (run build_scripts/build_ffmpeg.sh)
 - python 2.7 or above

### Install python 2.7
====================================================
Python can be installed using one of listed scripts or manually.
- prepare config.ini, set recording_base_dir value to liveRecorder installation path then run install.sh
	run liveRecorder/install.sh
	or
- use installPython2.7 script
liveRecorder/installPython2.7.sh
pip install poster
pip install psutil
pip install m3u8
pip install schedule
pip install pycrypto
    or
- run the whole liveRecorder installation which includes python
  deployment/upgradeLive <version> install_live_recorder
- nginx
  follow instructions in [nginx installation](https://github.com/kaltura/nginx-vod-module)


 ## New installation of liveRecorded (version format v[X.Y.Z]):
 ==============================================================
 # General
 If you are running both liveController and liveRecorder on the same machine you can install both in single installation:
  deployment/upgradeLive <version> install_live_recorder
 - it is recommended to install each version in directory created with the version name
 and use symlink named latest to currently used version

 - install latest liveRecorder version from git (liveDVR repository):
 wget https://github.com/kaltura/liveDVR/archive/v[x.y.z].tar.gz
 tar -xvzf v[x.y.z].tar.gz
 mv liveDVR-[x.y.z] [installation base path]
 rm -f v[x.y.z].tar.gz
 -
 - create configMapping.ini from liveRecorder/Config/configMapping.ini.template:

	@RECORDING_FOLDER@ - root path to all streams recorded content
	@KALTURA_PARTNER_ID@ - partner Id to be used to get vod from nginx
	@VOD_UPLOAD_MODE@ - working mode should be set to "remote" if content is uploaded to remote server (BE server), otherwise "local"
	@LIVE_PACKAGER_TOKEN@ - token key, for secured access to nginx

	Log files configuration
	===================================================
	@LOGS_BASE_PATH@ - the path to all liveRecorder log files
	recording_cron.log -
	liveRecorder.log - main liveRecorder log file. Logging of liveRecorder tasks progress (Concat and Upload)
	recorder.log -

	BE server configuration section:
    ===================================
	@KALTURA_SERVICE_URL@ - url to access the BE server (example:  "http://my_backend_server.com")
	@KALTURA_PARTNER_ADMIN_SECRET@ - admin secret for secured access to BE server

    binaries build:
    =================================
    - install and build ffmpeg 3.0
    > build_scripts/build_ffmpg.sh <ffmpeg build path> <ffmpeg version>
    - build ts_to_mp4_convertor
    > build_scripts/build_ts2mp4_convertor.sh [installation path] <ffmpeg build path>

    optional:
    =================================
    create symlink named latest to current installed version
    ln -s [installation base path]/version [installation base path]/latest
    - create symlink to process daemon wrapper under /etc/init.d
    ln -s [installation base path]/latest/liveRecorder/serviceWrappers/linux/liveRecorder /etc/init.d/liveRecorder
    - start liveRecorder
    /etc/init.d/liveRecorder start



 ## liveRecorder upgrade:
 ====================================================
  - deployment/upgradeLive can be used for upgrade
   > [installation base path]/latest/deployment/upgradeLive vx.y.z
   alternatively download and install latest version according to following instructions:
    wget https://github.com/kaltura/liveDVR/archive/v[x.y.z].tar.gz
    tar -xvzf v[x.y.z].tar.gz
    mv liveDVR-[x.y.z] [installation base path]
    rm -f v[x.y.z].tar.gz
    - install Node Version Manager 6.3.0+
    - install Node Packaged Modules (npm) 1.4.3+
    - stop liveRecorder
    /etc/init.d/liveRecorder stop
    - unlink latest
    unlink [installation base path]/latest
    - create symlink from current installed version path to latest dir
    ln -s [installation base path]/version [installation base path]/latest
    - start liveRecorder
    /etc/init.d/liveRecorder start



