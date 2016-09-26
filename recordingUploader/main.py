from TaskRunner import TaskRunner
from ConcatinationTask import ConcatenationTask
from UploadTask import UploadTask
from config import get_config
from os import path
import recording_logger
# todo fix the issue with the logger
# todo categorize logger between debug and info
# version is 2.7.11
# support upload token change yosi made
# recirdubg should not be than 24 hours - stop recording
# How to recover from case that live-controller crash, when need to cread hard link/Wrote to json- maybe flavor download should send event to all his chunks on disk
# support get source id (especially for audio)
# support create recording entry and set media recording entry
# the recording entry should created after session ended, and the
# recrding limitation - playlist obj should not remore obj q
# change output file name and remove manifest, cause make problem after stream again
# initial logger

recording_logger.init_logger()

max_task_count = get_config("max_task_count", 'int')
ffmpeg_path = get_config('ffmpeg_path')
concat_processors_count = get_config('concat_processors_count', 'int')
uploading_processors_count = get_config('uploading_processors_count', 'int')
base_directory = get_config('recording_base_dir')
tasks_done_directory = path.join(base_directory, 'done')
incoming_upload_directory = path.join(base_directory, UploadTask.__name__, 'incoming')

ConcatenationTaskRunner = TaskRunner(ConcatenationTask, concat_processors_count, incoming_upload_directory,
                                     max_task_count).start()


UploadTaskRunner = TaskRunner(UploadTask, uploading_processors_count, tasks_done_directory, max_task_count).start()


for p in ConcatenationTaskRunner:
    p.join()

for p in UploadTaskRunner:
    p.join()
