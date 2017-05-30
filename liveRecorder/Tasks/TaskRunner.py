from multiprocessing import Process, Queue
import logging.handlers
import os
from Config.config import get_config
from threading import Timer
import shutil
import re
import traceback
from socket import gethostname
import time, threading
import Queue as Q
from RecordingException import UnequallStampException
import schedule

#  Currently not support multiple machine pulling from one incoming dir.
# If need, just add incoming dir in the constructor


class TaskRunner:

    entry_regex = '^([01]_\w{8})_([01]_\w{8})_(\d+)'
    pattern = re.compile(entry_regex)

    @staticmethod
    def match(directory_name):
        return TaskRunner.pattern.match(directory_name)

    @staticmethod
    def get_param(directory_name):
        m = re.search(TaskRunner.entry_regex, directory_name)
        entry_id = m.group(1)
        recorded_id = m.group(2)
        duration = m.group(3)
        param = {'entry_id': entry_id, 'directory': directory_name, 'recorded_id': recorded_id,
                 'duration': duration}

        return param

    def __init__(self, task, number_of_processes, output_directory, max_task_count):
        self.number_of_processes = number_of_processes
        self.task = task
        self.task_name = task.__name__
        self.polling_interval = get_config('polling_interval_sec', 'int')
        base_directory = get_config('recording_base_dir')
        hostname = gethostname()
        self.failed_tasks_handling_interval = get_config('failed_tasks_handling_interval', 'int')*60  # in minutes
        self.failed_tasks_max_retries = get_config('failed_tasks_max_retries')
        self.task_directory = os.path.join(base_directory, hostname, self.task_name)
        self.error_directory = os.path.join(base_directory, 'error')
        self.failed_tasks_directory = os.path.join(base_directory, hostname, self.task_name, 'failed')
        self.input_directory = os.path.join(base_directory, hostname, self.task_name, 'incoming')
        self.working_directory = os.path.join(base_directory, hostname, self.task_name, 'processing')
        self.output_directory = output_directory
        self.task_queue_size = max_task_count
        self.task_queue = Queue(max_task_count)
        self.logger = logging.getLogger(__name__+'-'+self.task_name)
        self.on_startup()

    def on_startup(self):

        self.logger.info("onStartUp: %s", self.task_name)
        try:
            if not os.path.exists(self.task_directory):  # In case directory not exist
                os.makedirs(self.task_directory)

            if not os.path.exists(self.failed_tasks_directory):  # In case directory not exist
                os.makedirs(self.failed_tasks_directory)

            if not os.path.exists(self.input_directory):  # In case directory not exist
                os.makedirs(self.input_directory)

            if not os.path.exists(self.working_directory):  # In case directory not exist
                os.makedirs(self.working_directory)

            if not os.path.exists(self.output_directory):  # In case directory not exist
                os.makedirs(self.output_directory)

            t = threading.Thread(target=self.schedule_job)
            t.daemon = True
            t.start()

        except os.error as e:
            self.logger.fatal("Error %s \n %s", str(e), traceback.format_exc())

    def keep_alive_message(self):
        self.logger.info("Keep alive")

    def schedule_job(self):
        schedule.every().day.at("00:01").do(self.keep_alive_message)

        while 1:
            schedule.run_pending()
            time.sleep(1)

    def move_and_add_to_queue(self, src_dir):

        for directory_name in os.listdir(src_dir):
            if self.task_queue.full():
                self.logger.warn(
                    'cannot add tasks to queue. Queue is full!!! (max size {}, num processes {})'.format(
                        self.task_queue_size, self.number_of_processes))
                return
            directory_path = os.path.join(src_dir, directory_name)
            if self.match(directory_name) is not None:
                try:
                    if os.path.isdir(directory_path):
                        param = self.get_param(directory_name)
                        if src_dir != self.working_directory:   # if its not the same directory
                            shutil.move(directory_path, self.working_directory)
                        self.task_queue.put(param, block=False)
                        self.logger.info("[%s-%s] Add unhanded directory %s from %s to the task queue", param['entry_id'],
                                         param['recorded_id'], directory_name, src_dir)
                    else:
                        self.logger.warn("Can't find the content of %s, move it to %s", directory_path,
                                         self.error_directory)
                        self.safe_move(directory_path, self.error_directory)

                except Q.Full:
                        self.logger.warn("Failed to add new task, queue is full!")

                except Exception as e:
                        self.logger.error("[%s-%s] Error while try to add task:%s \n %s", param['entry_id'], param['recorded_id'],
                                          str(e), traceback.format_exc())

    def work(self, index):
        self.logger.info("Worker %s start working", index)
        while True:
            task_parameter = self.task_queue.get()
            logger_info = task_parameter['entry_id'] + '-' + task_parameter['recorded_id']
            self.logger.info("[%s] Task is performed by %d", logger_info, index)
            try:
                src = os.path.join(self.working_directory, task_parameter['directory'])

                job = self.task(task_parameter, logger_info)  # operate the function task_job, with argument task_parameters
                job.check_stamp()  # raise error if stamp is not valid
                job.run()
                job.check_stamp()
                shutil.move(src, self.output_directory)
                self.logger.info("[%s] Task %s completed, Move %s to %s", logger_info, self.task_name, src,
                                 self.output_directory)
            except UnequallStampException as e:
                    self.logger.error("[%s] %s \n %s", logger_info, str(e), traceback.format_exc())
                    self.safe_move(src, self.error_directory)
            except Exception as e:
                self.logger.error("[%s] Failed to perform task :%s \n %s", logger_info, str(e), traceback.format_exc())
                retries = self.get_retry_count(src)
                try:
                    if retries > 0:
                        self.logger.info("[%s] Job %s on entry %s has %s retries, move it to failed task directory ",
                                         logger_info, self.task_name, task_parameter['directory'], retries)
                        self.safe_move(src, self.failed_tasks_directory)
                    else:
                        self.logger.fatal("[%s] Job %s on entry %s has no more retries or failed to get it, move entry to "
                                      "failed task directory ", logger_info, self.task_name, task_parameter['directory'])
                        self.safe_move(src, self.error_directory)
                except Exception as e:
                    self.logger.fatal("[%s]  Failed to handle failure task %s \n %s", logger_info, str(e)
                                    , traceback.format_exc())


    def get_retry_count(self, src):
        try:
            retries_file_path = os.path.join(src, 'retries')
            if not os.path.exists(retries_file_path):
                with open(retries_file_path, "w") as retries_file:
                    retries_file.write(self.failed_tasks_max_retries)
                return self.failed_tasks_max_retries
            else:
                with open(retries_file_path, "r+") as retries_file:
                    retries = retries_file.read()
                    retries = int(retries) - 1
                    retries_file.seek(0)
                    retries_file.truncate()
                    retries_file.write(str(retries))

                return retries
        except Exception as e:
            self.logger.error("Failed to get retry count for %s: %s \n %s", src, str(e), traceback.format_exc())
            return 0

    def add_new_task_handler(self):
        thread = Timer(self.polling_interval, self.add_new_task_handler)
        thread.daemon = True
        thread.start()
        self.move_and_add_to_queue(self.input_directory)

    def failed_task_handler(self):
        thread = Timer(self.failed_tasks_handling_interval, self.failed_task_handler)
        thread.daemon = True
        thread.start()
        self.move_and_add_to_queue(self.failed_tasks_directory)

    def start(self):
        try:
            self.logger.info("Starting %d workers", self.number_of_processes)
            workers = [Process(target=self.work, args=(i,)) for i in xrange(1, self.number_of_processes+1)]
            for w in workers:
                w.start()
            self.move_and_add_to_queue(self.working_directory)
            self.add_new_task_handler()
            self.failed_task_handler()

        except Exception as e:
            self.logger.fatal("Failed to start task runner: %s  \n %s ", str(e), traceback.format_exc())
        finally:
            return workers

    def safe_move(self, src, dst):
        try:
            try:
                shutil.move(src, dst)
            except shutil.Error as e:
                file_name = os.path.basename(src)
                new_file_name = ''.join([file_name, '_', str(time.time())])
                new_dest = os.path.join(dst, new_file_name)
                self.logger.error("Failed to move %s into %s, try to move it as %s", src, dst, new_dest)
                shutil.move(src, new_dest)
            except IOError as e:
                if e.errno == 2:  # no such file or directory
                    self.logger.warn("No such file or directory: maybe job was taken by other machine")
                else:
                    raise e

        except Exception as e:
            self.logger.error("Failed to move %s to %s : %s \n %s", src, dst, str(e), traceback.format_exc())
