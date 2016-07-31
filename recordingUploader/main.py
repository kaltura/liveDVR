import os
import re
import shutil
import logging.handlers
from multiprocessing import Queue
from TaskJob import TaskJob
import time
from concatination import Concatination
from config import get_config
# todo fix the issue with the logger

queue_size = get_config("queue_size", 'int')
recording_uploader_path = get_config('recording_uploader_path')
recording_uploader_path_processing = get_config('recording_uploader_path_processing')
ffmpeg_path = get_config('ffmpeg_path')
output_file_name = get_config('output_file_name')
polling_interval = get_config('polling_interval', 'float')
concat_processors = get_config('concat_processors', 'int')
logger = logging.getLogger('main')
recording_archive = get_config('recording_archive')


def add_new_tasks():

    global recording_uploader_path_processing, recording_uploader_path
    logger.info("starting cron job")
    for file_name in os.listdir(recording_uploader_path):
        if not queue.full():
            regex = '^([01]_\w{8})_(\d+)'
            m = re.search(regex, file_name)
            try:
                entry_id = m.group(1)
                time = m.group(2)
                src = os.path.join(recording_uploader_path, file_name)
                shutil.move(src, recording_uploader_path_processing)  # todo check it works for diffrent disk-isilon
                task = [entry_id, os.path.join(recording_uploader_path_processing, file_name), ffmpeg_path,
                        output_file_name]

                queue.put(task)
            except IOError, e:
                logger.error(e)
            except AttributeError, e:
                logger.warn(e)
        else:
            break


def on_startup():
    logger.info("onStartUp")
    if not os.path.exists(recording_uploader_path_processing):
        os.makedirs(recording_uploader_path_processing)
    for file_name in os.listdir(recording_uploader_path_processing):
        src = os.path.join(recording_uploader_path_processing, file_name)
        try:
            shutil.move(src, recording_archive)  # if any file are in procceing dir, move to archive
            logger.info("Move %s to archive", src)
        except shutil.Error, e:
            logger.error("Error while try to remove %s into %s: %s", src, recording_archive, e.message)



def recording_handler():
    while True:
        time.sleep(1)
        add_new_tasks()


on_startup()
queue = Queue(queue_size)
TaskJob(Concatination, concat_processors, polling_interval, queue).start()
recording_handler()
