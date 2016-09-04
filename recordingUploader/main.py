import recording_logger
from TaskRunner import TaskRunner
from ConcatinationTask import ConcatenationTask
from ServerUploader import ServerUploader
from config import get_config
# todo fix the issue with the logger
recording_logger.init_logger()

max_jobs_count = get_config("max_jobs_count", 'int')
ffmpeg_path = get_config('ffmpeg_path')
output_file_name = get_config('output_file_name')
polling_interval = get_config('polling_interval', 'float')
concat_processors_count = get_config('concat_processors_count', 'int')
uploading_processors_count = get_config('uploading_processors_count', 'int')
recording_archive = get_config('recording_archive')
concat_task = get_config('concat_task')
concat_task_processing = get_config('concat_task_processing')
concat_task_done = get_config('concat_task_done')
upload_task_processing = get_config('upload_task_processing')
upload_task_done = get_config('upload_task_done')
# todo make ConcatinationTask ServerUploader inherit from some abstract class, implement run !
ConcatenationRunnerTask = TaskRunner(ConcatenationTask, concat_processors_count, concat_task,
                                     concat_task_processing, concat_task_done, max_jobs_count).start()

ServerUploaderRunner = TaskRunner(ServerUploader, uploading_processors_count, concat_task_done,
                                  upload_task_processing, upload_task_done, max_jobs_count).start()

for p in ConcatenationRunnerTask:
    p.join()

for p in ServerUploaderRunner:
    p.join()
