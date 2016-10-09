from TaskRunner import TaskRunner
from ConcatinationTask import ConcatenationTask
from UploadTask import UploadTask
from config import get_config
from os import path, kill
import recording_logger
import sys
import signal
import psutil
import socket
# todo categorize logger between debug and info
# version is 2.7.11
# install psutil
# support upload token change yosi made
# How to recover from case that live-controller crash, when need to cread hard link/Wrote to json- maybe flavor download should send event to all his chunks on disk
# the recording entry should created after session ended, and the
# recrding limitation - playlist obj should not remore obj q
# change output file name and remove manifest, cause make problem after stream again
# initial logger

recording_logger.init_logger()
processes = []
max_task_count = get_config("max_task_count", 'int')
ffmpeg_path = get_config('ffmpeg_path')
concat_processors_count = get_config('concat_processors_count', 'int')
uploading_processors_count = get_config('uploading_processors_count', 'int')
base_directory = get_config('recording_base_dir')
tasks_done_directory = path.join(base_directory, 'done')
incoming_upload_directory = path.join(base_directory, socket.gethostname(), UploadTask.__name__, 'incoming')

ConcatenationTaskRunner = TaskRunner(ConcatenationTask, concat_processors_count, incoming_upload_directory,
                                     max_task_count).start()


UploadTaskRunner = TaskRunner(UploadTask, uploading_processors_count, tasks_done_directory, max_task_count).start()



def signal_term_handler(signal, frame):
    print 'got SIGTERM'
    for my_process in processes:
        print ("kill process "+str(my_process.pid))
        try:
            parent = psutil.Process(my_process.pid)
        except psutil.NoSuchProcess:
            print ("Not child process for " + str(my_process.pid))
        children = parent.children(recursive=True)
        for child_process in children:
            print ("Found child process " + str(child_process.pid)+ ", send SIGTERM")
            child_process.kill()

        my_process.terminate()
    sys.exit(0)

signal.signal(signal.SIGTERM, signal_term_handler)
signal.signal(signal.SIGINT, signal_term_handler)

for p in ConcatenationTaskRunner:
    processes.append(p)

for p in UploadTaskRunner:
    processes.append(p)

for process in processes:
    process.join()

# gitodo should add p.join?