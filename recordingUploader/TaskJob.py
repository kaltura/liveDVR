from multiprocessing import Process
import logging.handlers
import time


class TaskJob:

    def __init__(self, task_job, number_of_processes, polling_interval, input_queue, output_queue):
        self.logger = logging.getLogger('TaskJob')
        self.number_of_processes = number_of_processes
        self.task_job = task_job
        self.polling_interval = polling_interval
        self.input_queue = input_queue
        self.output_queue = output_queue

    def work(self, id, input_queue, output_queue):
        while True:
            task_parameters = input_queue.get()
            if self.task_job is None:
                break
            self.logger.info("Task is performed by %d", id)
            job = self.task_job(task_parameters)  #operate the function task_job, with argumet task_parameters
            job.start(output_queue)
            time.sleep(self.polling_interval)


    def start(self):
        self.logger.info("starting %d workers", self.number_of_processes)
        self.workers = [Process(target=self.work, args=(i, self.input_queue, self.output_queue,))
                        for i in xrange(self.number_of_processes)]
        for w in self.workers:
            w.start()
