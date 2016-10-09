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
import random
from KalturaClient.Plugins.Core import KalturaEntryStatus, KalturaEntryReplacementStatus

backend_client = BackendClient()


class UploadChunkJob:
    global backend_client
    mutex = Lock()  # mutex for prevent race when reading file

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
            data = self.infile.read(UploadTask.upload_token_buffer_size)
        except IOError as e:
            raise e  # if exception then do not continue
        finally:  # called anyway
            self.mutex.release()
        self.file_obj = MockFileObject(self.infile.name, data)
        result = backend_client.upload_token_upload(self)


class UploadTask(TaskBase):
    # Global scope
    global backend_client

    upload_token_buffer_size = get_config('upload_token_buffer_size', 'int') * 1000000  # buffer is in MB

    def __init__(self, param, logger_info):
        TaskBase.__init__(self, param, logger_info)
        self.output_file_path = os.path.join(self.recording_path, self.output_filename)

    class KalturaUploadSession:
        global backend_client

        def __init__(self, file_name, file_size, chunks_to_upload, entry_id, recorded_id):
            self.file_name = file_name
            self.file_size = file_size
            self.chunks_to_upload = chunks_to_upload
            self.partner_id = backend_client.get_live_entry(entry_id).partnerId
            self.recorded_id = recorded_id
            #self.token_id,self.start_from = ServerUploader.backend_client.get_token(self.partner_id,file_name)
            #if !self.token_id:
            upload_token_list_response = backend_client.upload_token_list(self.partner_id, file_name)
            if upload_token_list_response.totalCount == 0:
                self.token_id = backend_client.upload_token_add(self.partner_id, file_name, file_size)
                self.uploaded_file_size = 0
                return
            if upload_token_list_response.totalCount == 1:  # if token is exist
                self.token_id = upload_token_list_response.objects[0].id
                self.uploaded_file_size = upload_token_list_response.objects[0].uploadedFileSize
                UploadTask.logger.info("Found token exist for %s, token: %s, stating from %s", self.file_name, self.token_id,
                                 self.uploaded_file_size)
                return
            if upload_token_list_response.totalCount > 1:  # if more then one result, throw exption
                raise Exception('file '+file_name+' has '+upload_token_list_response.totalCount
                                + '(more then one) KalturaUploadToken')

    def upload_file(self, file_name):

        self.check_stamp()
        file_size = os.path.getsize(file_name)
        infile = io.open(file_name, 'rb')
        if file_size % self.upload_token_buffer_size == 0:
            chunks_to_upload = int(file_size / self.upload_token_buffer_size)
        else:
            chunks_to_upload = int(file_size / self.upload_token_buffer_size) + 1
        upload_session = UploadTask.KalturaUploadSession(self.output_filename, file_size, chunks_to_upload,
                                                         self.entry_id, self.recorded_id)
        for sequence_number in range(1, chunks_to_upload+1):
            resume_at = self.upload_token_buffer_size * (sequence_number - 1)
            if resume_at < upload_session.uploaded_file_size:
                self.logger.info('Chunk %s of %s has already upload skipped it (stating from %s bytes), ',
                                 sequence_number, file_name, upload_session.uploaded_file_size)
                continue
            final_chunk = sequence_number == chunks_to_upload
            resume = sequence_number > 1
            if random.uniform(0, 1) > -1:
                chunk = UploadChunkJob(upload_session, infile, sequence_number, final_chunk, resume_at, resume)
            else:
                chunk = UploadChunkJob(upload_session, None, sequence_number, final_chunk, resume_at, resume)

            ThreadWorkers().add_job(chunk)

        result = ThreadWorkers().wait_for_all_jobs_done()
        self.check_stamp() # todo check it
        upload_session_json = str(vars(upload_session))
        if len(result) == 0:
            self.logger.info("successfully upload all chunks, call append recording")

            #Check if need to call cancel_replace
            recorded_obj = backend_client.get_recorded_entry(upload_session.partner_id, self.recorded_id)
            #if (recorded_obj.status.value == KalturaEntryStatus.PENDING):
             #   self.logger.info("entry %s has pending status, calling set media content add", self.recorded_id)
             #   backend_client.set_media_content_add(upload_session)
            #else:
            if (recorded_obj.replacementStatus.value != KalturaEntryReplacementStatus.NONE):
                self.logger.info("entry %s has replacementStatus %s, calling cancel_replace", self.recorded_id,
                                recorded_obj.replacementStatus)
                backend_client.cancel_replace(upload_session.partner_id, self.recorded_id)
            backend_client.set_media_content_update(upload_session)
            os.rename(self.output_file_path, self.output_file_path + '.done')
        else:
            raise Exception("Failed to upload file, "+str(len(result))+" chunks from "+str(chunks_to_upload)+ " where failed:"
                            + upload_session_json)

    def append_recording_handler(self):
        try:
            backend_client.append_recording(self.recorded_id, self.output_file_path) # todo check it full path
        except Exception, e:
            self.logger.error("Failed to append recording : %s\n %s", str(e), traceback.format_exc())

    def run(self):
        if get_config('mode') == 'remote':
            self.upload_file(self.output_file_path)
        else:
            self.append_recording_handler()
