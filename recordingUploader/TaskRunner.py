from multiprocessing import Process
import logging.handlers
import time
import os
from config import get_config
from multiprocessing import Queue
from threading import Thread
import shutil

class TaskRunner:  # todo change name : maybe runner...

    def __init__(self, task_job, number_of_processes, input_directory, working_directory, output_directory, max_task_count):
        self.logger = logging.getLogger('TaskRunner')
        self.number_of_processes = number_of_processes
        self.task_job = task_job
        self.polling_interval = get_config('polling_interval')
        self.input_directory = input_directory
        self.working_directory = working_directory
        self.output_directory = output_directory
        self.task_queue = Queue(max_task_count)
        self.on_startup()

    def on_startup(self):
        self.logger.info("onStartUp")
        try:
            if not os.path.exists(self.working_directory): # In case directory not exist
                os.makedirs(self.working_directory)
            if not os.path.exists(self.output_directory):  # In case directory not exist
                os.makedirs(self.output_directory)
            for unhandled_directory in os.listdir(self.working_directory):
                if os.path.isdir(unhandled_directory) and not self.task_queue.full():
                    self.task_queue.put(unhandled_directory)
                    self.logger.info("Add unhanded directory %s to the task queue", unhandled_directory)
                else:
                    self.logger.error("Failed to add %s to queue task", unhandled_directory)
        except os.error as e:
            self.error.fatal("Error %s", e) # todo should exit program

    def add_new_task(self):
        while True:
            for unhandled_directory in os.listdir(self.input_directory):
                src = os.path.join(self.input_directory, unhandled_directory)
                if os.path.isdir(src):
                    try:
                        shutil.move(src, self.working_directory)  # todo check it works for diffrent disk-isilon
                        self.logger.info("Add unhanded directory %s to the task queue", unhandled_directory)
                        self.task_queue.put(unhandled_directory)
                    except OSError as e:
                        self.logger.error(e)  # Catch error in case that the job is already taken by other machine
            time.sleep(float(self.polling_interval))

    def work(self, index):
        while True:
            task = self.task_queue.get()
            if self.task_job is None:   #todo checkit
                break
            self.logger.info("Task is performed by %d", index)
            try:
                job = self.task_job(task)  # operate the function task_job, with argumet task_parameters
                job.run()
                src = os.path.join(self.working_directory, task)
                shutil.move(src, self.output_directory)
                self.logger.info("Move %s to %s", src, self.output_directory)
            except shutil.Error, e:
                self.logger.error("Error while try to move %s into %s: %s", src, self.output_directory, e.message)
            except Exception as e:
                self.logger.error("Error: %s", e.message)

    def start(self):
        try:
            t = Thread(target=self.add_new_task)
            t.daemon = True
            t.start()
            self.logger.info("starting %d workers", self.number_of_processes)
            self.workers = [Process(target=self.work, args=(i,)) # //todo self it is neccesarry to pass  self.input_queue, self.output_queue
                            for i in xrange(self.number_of_processes)]
            for w in self.workers:
                w.start()
            return self.workers
        except Exception as e:
            self.logger.fatal("Failed to start task runner: %s", e)
