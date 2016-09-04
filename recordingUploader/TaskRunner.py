from multiprocessing import Process
import logging.handlers
import time
import os
from config import get_config
from multiprocessing import Queue
from threading import Thread
import shutil
import re
import abc
import traceback

class TaskRunner:

    def __init__(self, task, number_of_processes, input_directory, working_directory, output_directory, max_task_count):
        self.number_of_processes = number_of_processes
        self.task = task
        self.task_name = task.__name__
        self.polling_interval = get_config('polling_interval')
        self.input_directory = input_directory
        self.working_directory = working_directory
        self.output_directory = output_directory
        self.task_queue = Queue(max_task_count)
        self.logger = logging.getLogger(self.task_name)  # todo should decorate with task name
        self.on_startup()

    def on_startup(self):
        self.logger.info("onStartUp: %s", self.task_name)
        try:
            if not os.path.exists(self.working_directory):  # In case directory not exist
                os.makedirs(self.working_directory)
            self.move_and_add_to_queue(self.working_directory)
        except os.error as e:
            self.logger.fatal("Error %s \n %s", str(e), traceback.format_exc())

    def add_new_task_handler(self):

        while True:
            self.move_and_add_to_queue(self.input_directory)
            time.sleep(float(self.polling_interval))

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
                    self.logger.info("Add unhanded directory %s to the task queue", directory_name)
                except Exception as e:
                    self.logger.error("Error while try to add task:%s \n %s", str(e), traceback.format_exc())

    def work(self, index):
        while True:
            task_parameter = self.task_queue.get()
            if self.task is None:   # todo checkit
                break
            self.logger.info("Task is performed by %d", index)
            try:
                src = os.path.join(self.working_directory, task_parameter['directory'])
                job = self.task(task_parameter)  # operate the function task_job, with argument task_parameters
                job.run()
                shutil.move(src, self.output_directory)
                self.logger.info("Task %s completed, Move %s to %s", self.task_name, src, self.output_directory)
            except shutil.Error, e:
                self.logger.error("Error while try to move directory into %s: %s \n %s",  self.output_directory, str(e), traceback.format_exc())
            except Exception as e:
                self.logger.error("Error: %s \n %s", str(e), traceback.format_exc())

    def start(self):
        try:
            t = Thread(target=self.add_new_task_handler)
            t.daemon = True
            t.start()
            self.logger.info("starting %d workers", self.number_of_processes)
            workers = [Process(target=self.work, args=(i,)) for i in xrange(self.number_of_processes)]
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
