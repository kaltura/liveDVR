from multiprocessing import Process, Queue
import logging
import logging.handlers
import time


class TaskJob:

    def __init__(self, task_job, number_of_processes, polling_interval, input_queue, output_queue):
        self.logger = logging.getLogger('TaskJob')
        self.queue = Queue()
        self.number_of_processes = number_of_processes
        self.task_job = task_job
        self.polling_interval = polling_interval
        self.input_queue = input_queue
        self.output_queue = output_queue

    def work(self, id, queue, queue2):
        while True:
            task_parameters = queue.get()
            if self.task_job is None:
                break
            self.logger.info("Task is performed by %d", id)
            job = self.task_job(task_parameters)  #operate the function task_job, with argumet task_parameters
            job.start(queue2)
            time.sleep(self.polling_interval)

        queue.put(None)

    def start(self):
        print "starting %d workers" % self.number_of_processes
        self.workers = [Process(target=self.work, args=(i, self.input_queue, self.output_queue,))
                        for i in xrange(self.number_of_processes)]
        for w in self.workers:
            w.start()
