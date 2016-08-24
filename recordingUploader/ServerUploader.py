import os
import io
from KalturaAPI import KalturaAPI
from config import get_config
import Queue
from threading import Thread
import logging.handlers


class ImpersonateFile:
    def __init__(self, file_name, _buffer):
        self.length = len(_buffer)
        self.buffer = _buffer
        self.name = file_name
        self.offset = 0

    def read(self, index=-1):
        if index < 0:
            result = self.buffer[self.offset:]
            self.offset = self.length
            return result
        result = self.buffer[self.offset:self.offset+index]
        self.offset += index
        if self.offset > self.length:
            self.offset = self.length
        return result

    def seek(self, offset, whence = 0):
        if whence == 0:
            self.offset = offset
        if whence == 1:
            self.offset = self.offset - offset # todo check if its plus 0r minus
        if whence == 2:
            self.offset = self.length - offset
        if self.offset > self.length:
            self.offset = self.length

    def tell(self):
        return self.offset


class ServerUploader:
    # Global scope
    kaltura_api = KalturaAPI()
    upload_directory = get_config('upload_task_processing')
    logger = logging.getLogger('ServerUploader')
    num_of_thread = get_config('num_of_thread', 'int')
    upload_token_buffer_size = get_config('upload_token_buffer_size', 'int') * 1000000  # buffer is in MB

    # todo ask Guy, if we want that the thread will be for each task, or it will be shared between all task!
    def __init__(self, param):
        self.entry_directory = param['directory']
        self.entry_id = param['entry_id']
        self.output_file = os.path.join(self.upload_directory, self.entry_directory, self.entry_directory+'_out.mp4')
        self.q = Queue.Queue()
        self._generate_upload_thread()

    def _generate_upload_thread(self):
        for i in range(1, self.num_of_thread+1):
            t = Thread(target=self.worker, args=(i,))  # todo change name
            t.daemon = True  # todo check it
            t.start()

    def worker(self, index):
        self.logger.info("Thread %d is start working", index)
        while True:
            item = self.q.get()
            try:
                status = self.kaltura_api.upload_token_upload(item)
                if status == '2':
                    self.kaltura_api.set_media_content(item['upload_session'])
            except IOError as e:  # todo which kind of excepotion? what to do then? verify that no more try is wrapped
                self.logger.error("Failed to upload file: %s", e.message)
            self.q.task_done()

    def upload_file(self, file_name):
        try:
            file_size = os.path.getsize(file_name)
            infile = io.open(file_name, 'rb')
            chunks_to_upload = int(file_size / self.upload_token_buffer_size) + 1
            upload_session = self.kaltura_api.KalturaUploadSession("0_yo7ohrxo.0_2nijzf3v.0_2016-08-10-15.31.58.407-IDT_0.mp4", file_size, chunks_to_upload, self.entry_id)

            for sequence_number in range(1, chunks_to_upload+1):
                data = infile.read(self.upload_token_buffer_size)
                item = {
                    'upload_session': upload_session,
                    'data_stream': ImpersonateFile(file_name, data),
                    'sequence_number': sequence_number,
                    'is_last_chunk': sequence_number == chunks_to_upload,
                    "resumeAt": self.upload_token_buffer_size * (sequence_number - 1),
                    'resume': chunks_to_upload is not 1 and sequence_number is not 1
                }
                self.q.put(item)

        except Exception as e:
            self.logger.error("Failed to upload file: %s", e.message)

    def append_recording_handler(self):
        try:
            self.kaltura_api.append_recording(self.output_file)
        except Exception, e:
            self.logger.error(e)

    def run(self):
        if get_config('mode') == 'ecdn':
            self.upload_file(self.output_file)
        else:
            self.append_recording_handler()


#a=ServerUploader("/tmp/")
#b= a.upload_file("/tmp/1.txt")
#b= a.upload_file("/Users/ron.yadgar/Desktop/0_yo7ohrxo.0_2nijzf3v.0_2016-08-10-15.31.58.407-IDT_0.mp4")
#a.worker(2)
