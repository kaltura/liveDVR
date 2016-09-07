import recording_logger
from TaskRunner import TaskRunner
from ConcatinationTask import ConcatenationTask
from UploadTask import UploadTask
from config import get_config
from os import path
# todo fix the issue with the logger
# todo categorize logger between debug and info
recording_logger.init_logger()

max_jobs_count = get_config("max_jobs_count", 'int')
ffmpeg_path = get_config('ffmpeg_path')
output_file_name = get_config('output_file_name')
polling_interval = get_config('polling_interval', 'float')
concat_processors_count = get_config('concat_processors_count', 'int')
uploading_processors_count = get_config('uploading_processors_count', 'int')
base_directory = get_config('recording_base_dir')
jobs_done_directory = path.join(base_directory, 'done')
incoming_upload_directory = path.join(base_directory, UploadTask.__name__, 'incoming')

ConcatenationRunnerTask = TaskRunner(ConcatenationTask, concat_processors_count,
                                      incoming_upload_directory, max_jobs_count).start()

UploadTaskRunner = TaskRunner(UploadTask, uploading_processors_count,
                                  jobs_done_directory, max_jobs_count).start()

for p in ConcatenationRunnerTask:
    p.join()

for p in UploadTaskRunner:
    p.join()
