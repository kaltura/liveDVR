## liveController & LiveRecorder
The liveDVR repository contains to products: liveContrller and liveRecorder.
Kaltura liveController controls the live stream including recording during live.
The liveController handles live entries state and stream content integrity throughout live session. It integrates with the Wowza to get list of live streams and download the content.
It integrates with the BE for live state update and live entry info get/set.
The liveController supports DC failover.
Kaltura liveRecorder is responsible for VOD preparation from recorded live content and upload to destination storage.

### Deployment
#### LiveController Deployment
Please refer to [liveController deployment doc](liveController_deployment.md)

###
#### liveRecorder Deployment
Please refer to [liveRecorder deployment doc](liveRecorder/liveRecorder_deployment.md)

###
#### meida_server Deployment
Please refer to [medi_server deployment doc](https://github.com/kaltura/media-server/media-server_deployment)

### Copyright & License

All code in this project is released under the [AGPLv3 license](http://www.gnu.org/licenses/agpl-3.0.html) unless a different license for a particular library is specified in the applicable library path.

Copyright © Kaltura Inc. All rights reserved.