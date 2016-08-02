import os
import io
from KalturaAPI import KalturaAPI
from config import get_config
import Queue
from threading import Thread
import logging.handlers


class RemoteUploader:

    def __init__(self, input_queue):
        self.logger = logging.getLogger('RemoteUploader')
        self.input_queue = input_queue
        self.upload_file_handler()
        self.upload_token_buffer_size = get_config('upload_token_buffer_size', 'int') * 1024  # buffer is in MB
        self.num_of_thread = get_config('num_of_thread', 'int')
        self.q = Queue.Queue()
        self._generate_upload_thread()

    def _generate_upload_thread(self):
        for i in range(1, self.num_of_thread):
            t = Thread(target=self.worker, args=(i,))  # todo change name
            t.daemon = True  # todo check it
            t.start()

    def worker(self, index):
        self.logger.info("Thread %d is start working", index)
        while True:
            item = self.q.get()
            KalturaAPI.upload_token_upload(item)
            self.q.task_done()

    def upload_file_handler(self):
        while True:
            upload_file = self.input_queue.get()
            self.upload_file(upload_file)

    def upload_file(self, file_name):
        try:
            file_size = os.path.getsize(file_name)
            infile = io.open(file_name, 'rb')
            chunks_to_upload = int(file_size/self.upload_token_buffer_size)+1  # todo check buffer_size not null
            token_id = KalturaAPI.upload_token_add()  # todo check succsed

            for sequence_number in range(1, chunks_to_upload):
                data = infile.read(self.upload_token_buffer_size)
                item = {
                    'file_name': file_name,
                    'data_stream': data,
                    'sequence_number': sequence_number,
                    'chunks_to_upload': chunks_to_upload,
                    'token_id': token_id,
                    'is_last_chunk': False
                }
                self.q.put(item)
            data = infile.read(self.upload_token_buffer_size) # todo check how to verify that its the last chunk
            item = {
                'file_name': file_name,
                'data_stream': data,
                'sequence_number': chunks_to_upload,
                'chunks_to_upload': chunks_to_upload, # The last one
                'token_id': token_id,
                'is_last_chunk': True,
            }
            self.q.put(item)
        except IOError as e:
            self.logger.error("Faild to upload file: %s", e.message)
