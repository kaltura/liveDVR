from multiprocessing import Process, Queue
import logging
import logging.handlers
import time

class TaskJob:
    def __init__(self, task_job, NUMBER_OF_PROCESSES, polling_interval, queue):
        self.logger = logging.getLogger('TaskJob')
        self.queue = Queue()
        self.NUMBER_OF_PROCESSES = NUMBER_OF_PROCESSES
        self.task_job = task_job
        self.polling_interval = polling_interval
        self.queue = queue

    def work(self, id, queue):
        while True:
            task_parameters = queue.get()
            if self.task_job is None:
                break
            self.logger.info("Task is performed by %d", id)
            self.task_job(task_parameters)  #operate the function task_job, with argumet task_parameters
            time.sleep(self.polling_interval)

        queue.put(None)

    def start(self):
        print "starting %d workers" % self.NUMBER_OF_PROCESSES
        self.workers = [Process(target=self.work, args=(i, self.queue,))
                        for i in xrange(self.NUMBER_OF_PROCESSES)]
        for w in self.workers:
            w.start()
