import os
import io
from BackendClient import *
from config import get_config
import Queue
from threading import Thread, Lock
import logging.handlers
from TaskRunner import TaskBase
import traceback
from MockFileObject import MockFileObject
from ThreadWorkers import ThreadWorkers


class UploadChunkJob:
    mutex = Lock()  # mutex for prevent race when reading file todo should verify that mutex is create for each file!

    def __init__(self, upload_session, infile, sequence_number, final_chunk, resume_at, resume):
        self.upload_session = upload_session
        self.infile = infile
        self.sequence_number = sequence_number
        self.final_chunk = final_chunk
        self.resume_at = resume_at
        self.resume = resume

    def upload(self):
        pointer_to_read = self.resume_at
        self.mutex.acquire()
        try:
            self.infile.seek(pointer_to_read)
            data = self.infile.read(ServerUploader.upload_token_buffer_size)
        except IOError as e:
            raise e  # if exception then do not continue
        finally:  # called anyway
            self.mutex.release()
        self.file_obj = MockFileObject(self.infile.name, data)
        result = ServerUploader.backend_client.upload_token_upload(self)


class ServerUploader(TaskBase):
    # Global scope
    backend_client = BackendClient()
    upload_directory = get_config('upload_task_processing')
    logger = logging.getLogger('ServerUploader')

    upload_token_buffer_size = get_config('upload_token_buffer_size', 'int') * 1000000  # buffer is in MB

    def __init__(self, param):
        self.entry_directory = param['directory']
        self.entry_id = param['entry_id']
        self.output_filename = self.entry_directory+'_out.mp4'
        self.output_file = os.path.join(self.upload_directory, self.entry_directory, self.output_filename)
        self.logger.info("init")

    class KalturaUploadSession:
        def __init__(self, file_name, file_size, chunks_to_upload, entry_id):
            self.file_name = file_name
            self.file_size = file_size
            self.chunks_to_upload = chunks_to_upload
            self.partner_id = ServerUploader.backend_client.get_partner_id(entry_id)
            self.upload_entry = ServerUploader.backend_client.create_entry(self.partner_id, "text", "text")
            self.token_id = ServerUploader.backend_client.upload_token_add(self.partner_id, file_name, file_size)

    def upload_file(self, file_name):

        file_size = os.path.getsize(file_name)
        infile = io.open(file_name, 'rb')
        if file_size % self.upload_token_buffer_size == 0:
            chunks_to_upload = int(file_size / self.upload_token_buffer_size)
        else:
            chunks_to_upload = int(file_size / self.upload_token_buffer_size) + 1
        upload_session = ServerUploader.KalturaUploadSession(self.output_filename, file_size, chunks_to_upload,
                                                                 self.entry_id)
        for sequence_number in range(1, chunks_to_upload+1):
            final_chunk = sequence_number == chunks_to_upload
            resume_at = self.upload_token_buffer_size * (sequence_number - 1)
            resume = sequence_number > 1
            chunk = UploadChunkJob(upload_session, infile, sequence_number, final_chunk, resume_at, resume)

            ThreadWorkers().add_job(chunk)

        result = ThreadWorkers().wait_for_all_jobs_done()
        if result == 1:
            self.logger.info("successfully upload all chunks, call append recording")
            ServerUploader.backend_client.set_media_content(upload_session)
        else:
            raise Exception("fail to upload all chunks")

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

