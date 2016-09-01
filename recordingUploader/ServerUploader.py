import os
import io
from BackendClient import *
from config import get_config
import Queue
from threading import Thread, Lock
import logging.handlers
from TaskRunner import TaskBase
import traceback

class ImpersonateFile: #
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


class ServerUploader(TaskBase):
    # Global scope
    backend_client = BackendClient()
    upload_directory = get_config('upload_task_processing')
    logger = logging.getLogger('ServerUploader')
    num_of_thread = get_config('num_of_thread', 'int')
    upload_token_buffer_size = get_config('upload_token_buffer_size', 'int') * 1000000  # buffer is in MB

    class KalturaUploadSession:  # todo check it maybe should be inheritance from object
        def __init__(self, file_name, file_size, chunks_to_upload, entry_id):
            self.file_name = file_name
            self.file_size = file_size
            self.chunks_to_upload = chunks_to_upload
            self.partner_id = ServerUploader.backend_client.get_partner_id(entry_id)
            self.upload_entry = ServerUploader.backend_client.create_entry(self.partner_id, "text", "text")
            self.token_id = ServerUploader.backend_client.upload_token_add(self.partner_id, file_name, file_size)

    # todo ask Guy, if we want that the thread will be for each task, or it will be shared between all task!
    def __init__(self, param):
        self.entry_directory = param['directory']
        self.entry_id = param['entry_id']
        self.output_filename = self.entry_directory+'_out.mp4'
        self.output_file = os.path.join(self.upload_directory, self.entry_directory, self.output_filename)
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
                mutex = item['mutex']
                infile = item['file_obj']
                pointer_to_read = item['resumeAt']
                mutex.acquire()  # lock in order to preventing  race conditions while reading
                try:
                    infile.seek(pointer_to_read)
                    data = infile.read(self.upload_token_buffer_size)
                except IOError as e:
                    raise e  # if exception then do not continue
                finally:    # called anyway 
                    mutex.release()
                item['data_stream'] = ImpersonateFile(infile.name, data)
                result = self.backend_client.upload_token_upload(item)
                if result.status.value == 2:
                    self.backend_client.set_media_content(item['upload_session'])
            except Exception as e:  # todo which kind of excepotion? what to do then? verify that no more try is wrapped
                self.logger.error("Failed to upload file: %s\n %s", str(e), traceback.format_exc())
            self.q.task_done()

    def upload_file(self, file_name):
        try:
            file_size = os.path.getsize(file_name)
            infile = io.open(file_name, 'rb')
            if file_size % self.upload_token_buffer_size == 0:
                chunks_to_upload = int(file_size / self.upload_token_buffer_size)
            else:
                chunks_to_upload = int(file_size / self.upload_token_buffer_size) + 1
            upload_session = ServerUploader.KalturaUploadSession(self.output_filename, file_size, chunks_to_upload, self.entry_id)
            mutex = Lock()  # mutex is a resource allocated for each file object
            for sequence_number in range(1, chunks_to_upload+1):
                item = {
                    'upload_session': upload_session,
                    'file_obj': infile,
                    'mutex': mutex,
                    'sequence_number': sequence_number,
                    'is_last_chunk': sequence_number == chunks_to_upload,
                    "resumeAt": self.upload_token_buffer_size * (sequence_number - 1),
                    'resume': sequence_number > 1
                }
                self.q.put(item)

        except Exception as e:
            self.logger.error("Failed to upload file: %s \n %s", str(e), traceback.format_exc())



    def append_recording_handler(self):
        try:
            self.backend_client.append_recording(self.output_file)
        except Exception, e:
            self.logger.error("Failed to append recording : %s\n %s", str(e), traceback.format_exc())

    def run(self):
        if get_config('mode') == 'ecdn':
            self.upload_file(self.output_file)
        else:
            self.append_recording_handler()

