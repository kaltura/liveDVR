Recording Modules & Directories:
--------------------------------

Modules:
--------------------------------
RecordingManager: manages all live recording sessions
RecordingEntrySession: handles single recording entry
RecordingSourceOnly:  script used to reproduce issues by restoring recording. Finds all mp4 files both in live
web content and recording content and creates/recreates the playlist.json (+done and stamp).

Directories:
----------------------------------

(1) the source directory for the entry stream files (mp4). It is defined in config.json under "rootFolderPath".
The entry's downloaded and converted (ts->mp4) chunks are saved in hierarchy combined from the entry Id, the flavor and
day hour that the chunk was saved. Example: entry id="0_abcdef123" flavor="32" path:

/web/content/kLive/live/3/0_abcdef123/32/

Each time the FlavorDownloader finishes to download chunk it calls addNewChunks() that ...

(2) incoming path. Defined by "completedRecordingFolderPath". Current configuration in production:
/web/content/kLive/liveRecorder/recordings
Each time stream ends or at the most every 15 minutes (configuration: recordingUpdateEntryTimeIntervalInMin),
a link is created in incoming path to concat mp4 ???

"recording" : {
       "enable" : false,
       "recordingFolderPath" : "~/kLive_content/recording/recordings",
       "completedRecordingFolderPath" : "~/kLive_content/recording/incoming",
       "recordingTimeIntervalInSec" : 60,
       "recordingMaxDurationInHours" : 24,
       "recordingSessionDurationInSec" : 180,
       "recordingUpdateEntryTimeIntervalInMin" : 15
     }

Recording recovery:
-------------------
1) either use the recording stream content directory or copy the content tree to existing recording entry.
2) rename/ remove playlist.json only if you want it to be recreated.
3) remove done and stamp files
4) run:
node [script path]/RestoreRecordingScript.js -p [source path] -f [flavors list] -u [boolean]

-p the path to stream content root - this parameter is mandatory
-f comma separated list of the flavors to use, in quotes. - this parameter is optional. If omitted all flavors are taken.
-u boolean flag. use -u true to overwrite playlist.json. Use -u false to keep the playlist.json and only add missing chunk files. This is also optional. If not used then playlist.json is kept.
example:
ode lib/recording/RestoreRecordingScript.js -p '/Users/lilach.maliniak/kLive_content/liveRecorder/recordings/append/m/0_3yg8hx0m/0_dzawdis9' -f '32,33,34' -u false