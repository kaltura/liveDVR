from BackendClient import *
from config import get_config
import Queue
from threading import Thread, Lock
import logging.handlers
import traceback

'''
This class is a singleton class for each  upload process.
However, the job (upload) is done one by one,
'''


class Singleton(type):
    _instances = {}
    _lock = Lock()

    def __call__(cls, *args, **kwargs):
        with Singleton._lock:
            if cls not in cls._instances:
                cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
            return cls._instances[cls]


class ThreadWorkers:  # singleton object,
    __metaclass__ = Singleton

    def __init__(self):
        self.num_of_thread = get_config('num_of_thread', 'int')
        self.logger = logging.getLogger('TreadWorkers')
        self.q = Queue.Queue()
        self.generate_upload_thread()
        self.logger.info("init")
        self.job_failed = []

    def generate_upload_thread(self):
        for i in range(1, self.num_of_thread+1):
            t = Thread(target=self.worker, args=(i,))  # todo change name
            t.daemon = True  # todo check it
            t.start()

    def worker(self, index):
        self.logger.info("Thread %d is start working", index)
        while True:
            upload_chunk_job = self.q.get()
            try:
                upload_chunk_job.upload()
            except Exception as e:
                self.logger.error("Failed to upload chunk %s from file %s : %s \n %s", upload_chunk_job.sequence_number,
                                  upload_chunk_job.infile.name,  str(e), traceback.format_exc())
                self.job_failed.append(upload_chunk_job)
            finally:
                self.q.task_done()

    def add_job(self, job):
        self.q.put(job)

    def wait_for_all_jobs_done(self):
        self.q.join()
        if len(self.job_failed) == 0:
            return 1
        else: # if at least one of the chunks failed, then returm 0, and clear array, for the next job
            self.job_failed = []
            return 0