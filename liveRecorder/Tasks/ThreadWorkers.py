from BackendClient import *
from Config.config import get_config
import Queue
from threading import Thread, Lock
import logging
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
    num_of_thread = get_config('num_of_upload_thread', 'int')
    logger = logging.getLogger(__name__)

    def __init__(self):
        self.q = Queue.Queue()
        self.generate_upload_thread()
        self.job_failed = []

    def generate_upload_thread(self):
        for i in range(1, self.num_of_thread+1):
            t = Thread(target=self.worker, args=(i,))
            t.setName("UploadTasks-"+str(i))  # note this is not work for multiple uploader process
            t.daemon = True
            t.start()

    def worker(self, index):
        self.logger.info("Thread %d started working", index)
        while True:
            upload_chunk_job = self.q.get()
            if not upload_chunk_job:
                self.logger.warning("Got \'None\' as upload job. Check if it's a bug")
                continue
            try:
                upload_chunk_job.upload()
            except Exception as e:
                self.logger.error("Failed to upload chunk %s from file %s : %s \n %s", upload_chunk_job.chunk_index,
                                  upload_chunk_job.upload_session.file_name,  str(e), traceback.format_exc())
                self.job_failed.append(upload_chunk_job)
            finally:
                self.q.task_done()

    def add_job(self, job):
        self.q.put(job)

    def wait_jobs_done(self):
        self.q.join()  # wait for all task finish
        job_failed_to_return = self.job_failed
        self.job_failed = []    # initial array for the next job
        return job_failed_to_return
