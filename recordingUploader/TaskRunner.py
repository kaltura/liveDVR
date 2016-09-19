from multiprocessing import Process
import logging.handlers
import os
from config import get_config
from multiprocessing import Queue
from threading import Timer
import shutil
import re
import abc
import traceback

#  Currently not support multiple machine pulling from one incoming dir.
# If need, just add incoming dir in the constructor


class TaskRunner:

    def __init__(self, task, number_of_processes, output_directory, max_task_count):
        self.number_of_processes = number_of_processes
        self.task = task
        self.task_name = task.__name__
        self.polling_interval = get_config('polling_interval', 'int')
        base_directory = get_config('recording_base_dir')
        self.failed_tasks_handling_interval = get_config('failed_tasks_handling_interval', 'int')*60  # in minutes
        self.failed_tasks_max_retries = get_config('failed_tasks_max_retries')
        self.task_directory = os.path.join(base_directory, self.task_name)
        self.error_directory = os.path.join(base_directory, 'error')
        self.failed_tasks_directory = os.path.join(base_directory, self.task_name, 'failed')
        self.input_directory = os.path.join(base_directory, self.task_name, 'incoming')
        self.working_directory = os.path.join(base_directory, self.task_name, 'processing')
        self.output_directory = output_directory
        self.task_queue = Queue(max_task_count)
        self.logger = logging.getLogger(__name__+'-'+self.task_name)  # todo should decorate with task name
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

            self.move_and_add_to_queue(self.working_directory)
        except os.error as e:
            self.logger.fatal("Error %s \n %s", str(e), traceback.format_exc())

    def move_and_add_to_queue(self, src_dir):
        entry_regex = '^([01]_\w{8})_'
        pattern = re.compile(entry_regex)
        for directory_name in os.listdir(src_dir):
            directory_path = os.path.join(src_dir, directory_name)
            if os.path.isdir(directory_path) and pattern.match(directory_name) is not None:
                try:
                    if src_dir != self.working_directory:   # if its not the same directory
                        shutil.move(directory_path, self.working_directory)
                    m = re.search(entry_regex, directory_name)
                    entry_id = m.group(1)
                    param = {'entry_id': entry_id, 'directory': directory_name}
                    self.task_queue.put(param)
                    self.logger.info("Add unhanded directory %s from %s to the task queue", directory_name, src_dir)
                except Exception as e:
                    self.logger.error("Error while try to add task:%s \n %s", str(e), traceback.format_exc())

    def work(self, index):
        self.logger.info("Worker %s start working", index)
        while True:
            task_parameter = self.task_queue.get()
            self.logger.info("Task is performed by %d", index)
            try:
                src = os.path.join(self.working_directory, task_parameter['directory'])
                job = self.task(task_parameter)  # operate the function task_job, with argument task_parameters
                job.run()
                shutil.move(src, self.output_directory)
                self.logger.info("Task %s completed, Move %s to %s", self.task_name, src, self.output_directory)
            except Exception as e: # todo shutil.move should wrapped by try catch?
                self.logger.error("Failed to perform task :%s \n %s", str(e), traceback.format_exc())
                retries = self.get_retry_count(src)
                if retries > 0:
                    self.logger.info("Job %s on entry %s has %s retries, move it to failed task directory ",
                                     self.task_name, task_parameter['directory'], retries)
                    shutil.move(src, self.failed_tasks_directory)
                else:
                    self.logger.fatal("Job %s on entry %s has no more retries or failed to get it, move entry to "
                                      "failed task directory ", self.task_name, task_parameter['directory'])
                    shutil.move(src, self.error_directory)

    def get_retry_count(self, src):
        try:
            retries_file_path = os.path.join(src, 'retries')
            if not os.path.exists(retries_file_path):
                retries_file = open(retries_file_path, "w")
                retries_file.write(self.failed_tasks_max_retries)
                retries_file.close()
                return self.failed_tasks_max_retries
            else:
                retries_file = open(retries_file_path, "r+")
                retries = retries_file.read()
                retries = int(retries) - 1
                retries_file.seek(0) # todo tix it!
                retries_file.write(str(retries))
                retries_file.close()
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

            self.add_new_task_handler()
            self.failed_task_handler()
            self.logger.info("starting %d workers", self.number_of_processes)
            workers = [Process(target=self.work, args=(i,)) for i in xrange(1, self.number_of_processes+1)]
            for w in workers:
                w.start()
            return workers
        except Exception as e:
            self.logger.fatal("Failed to start task runner: %s  \n %s ", str(e), traceback.format_exc())


class TaskBase(object):
    __metaclass__ = abc.ABCMeta

    @abc.abstractmethod
    def run(self):
        """running the task"""
        return
