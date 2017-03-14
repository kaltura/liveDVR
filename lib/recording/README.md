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