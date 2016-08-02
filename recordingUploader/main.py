import os
import re
import shutil
import logging.handlers
from multiprocessing import Queue
from TaskJob import TaskJob
import time
from Concatination import Concatination
from KalturaAPI import KalturaAPI
from RemoteUploader import RemoteUploader
from config import get_config
import threading
import KalturaAPI
# todo fix the issue with the logger

max_jobs_count = get_config("max_jobs_count", 'int')
recording_uploader_path = get_config('recording_uploader_path')
recording_uploader_path_processing = get_config('recording_uploader_path_processing')
ffmpeg_path = get_config('ffmpeg_path')
output_file_name = get_config('output_file_name')
polling_interval = get_config('polling_interval', 'float')
concat_processors_count = get_config('concat_processors_count', 'int')
logger = logging.getLogger('main')
recording_archive = get_config('recording_archive')

queue_first_stage = Queue(max_jobs_count)
queue_second_stage = Queue()


def add_new_tasks():
    for file_name in os.listdir(recording_uploader_path):
        if not queue_first_stage.full():
            regex = '^([01]_\w{8})_(\d+)'
            m = re.search(regex, file_name)
            try:
                entry_id = m.group(1)
                time = m.group(2)
                src = os.path.join(recording_uploader_path, file_name)
                shutil.move(src, recording_uploader_path_processing)  # todo check it works for diffrent disk-isilon
                output_file = file_name +'.mp4'
                task = [entry_id, os.path.join(recording_uploader_path_processing, file_name), ffmpeg_path, output_file]

                queue_first_stage.put(task)
            except IOError, e:
                logger.error(e) # Catch error in case that the job is already taken by other machine
            except AttributeError, e:
                logger.warn("%s: file name %s has not the form entryId_timestamp", e, file_name)
        else:
            break


def on_startup():
    logger.info("onStartUp")
    if not os.path.exists(recording_uploader_path_processing):
        os.makedirs(recording_uploader_path_processing)
    for file_name in os.listdir(recording_uploader_path_processing):
        src = os.path.join(recording_uploader_path_processing, file_name)
        dst = os.path.join(recording_archive, ''.join([file_name, '_', str(time.time())]))
        try:
            shutil.move(src, dst)  # if any file are in procceing dir, move to archive
            logger.info("Move %s to archive", src)
        except shutil.Error, e:
            logger.error("Error while try to remove %s into %s: %s", src, recording_archive, e.message)


def new_tasks_handler():
    while True:
        time.sleep(polling_interval)
        logger.info("Check for new jobs")
        add_new_tasks()


def uploading_handler():
    if get_config('mode') == 'ecdn':
        RemoteUploader(queue_second_stage)
    else:
        append_recording_handler()


def append_recording_handler():
    while True:
        output_file = queue_second_stage.get()
        try:
            KalturaAPI.append_recording(output_file)
        except Exception, e:
            logger.error(e)

on_startup()
TaskJob(Concatination, concat_processors_count, polling_interval, queue_first_stage, queue_second_stage).start()
t1 = threading.Thread(target=new_tasks_handler)
t2 = threading.Thread(target=uploading_handler)
t1.start()
t1.join()
t2.start()
t2.join()

