# liveDVR
DVR implementation built on top of live streams

# Installation #

## Pre-requisites ##

* Make sure node is installed
* Install npm
* Install nvm (curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.31.2/install.sh | bash)
* Clone repository
* C++ compiler
* Wowza + media-server installed and you are able to stream to it.

## Steps to install ##

* Go to repository and run `nvm install;nvm use`
* Run command `npm install`
* cd into "build_scripts"
* Run `./build_ffmpeg.sh <location you want ffmpeg to be> <ffmpeg version>`
    - NOTE: While this script supports any ffmpeg version we reccomend using "3.0". (no need for 'n' in beginning of version name)
* Run `./build_ts2mp4_convertor.sh <ffmpeg location> <repository path>/liveRecorder/`
* Run `./build_addon.sh <repository path> <ffmpeg location> Release`
* Copy `<repository path>/serviceWrappers/linux/kLiveController` to `/etc/init.d/kLiveController`
* Edit `/etc/init.d/kLiveController`
    - Set `KLIVE_CONTROLLER_PREFIX` to <repository path>
    - Set `LOG_DIR` to your log directory (you can leave as is if you're not sure).
    
* Now you can start the service, run `/etc/init.d/kLiveController start` (to stop use stop).
* That's it now you should be able to view the live you are streaming.