import os
import io
from BackendClient import *
from Config.config import get_config
from TaskBase import TaskBase
import traceback
from UploadChunkJob import UploadChunkJob
from ThreadWorkers import ThreadWorkers
from KalturaUploadSession import KalturaUploadSession
from KalturaClient.Plugins.Core import KalturaEntryStatus, KalturaEntryReplacementStatus

#backend_client = BackendClient()


class UploadTask(TaskBase):
    # Global scope
    #global backend_client

    upload_token_buffer_size = get_config('upload_token_buffer_size_mb', 'int') * 1000000  # buffer is in MB

    def __init__(self, param, logger_info):
        TaskBase.__init__(self, param, logger_info)
        self.output_file_path = os.path.join(self.recording_path, self.output_filename)
        session_id = self.entry_id + '-' + self.recorded_id
        self.backend_client = BackendClient(session_id)
        self.chunk_index = 0

    def get_chunks_to_upload(self, file_size):
        if file_size % self.upload_token_buffer_size == 0:
            return int(file_size / self.upload_token_buffer_size)

        return int(file_size / self.upload_token_buffer_size) + 1



    def upload_file(self, file_name):

        threadWorkers = ThreadWorkers()
        file_size = os.path.getsize(file_name)
        chunks_to_upload = self.get_chunks_to_upload(file_size)
        with io.open(file_name, 'rb') as infile:

            upload_session = KalturaUploadSession(self.output_filename, file_size, chunks_to_upload, self.entry_id,
                                                  self.recorded_id, self.backend_client, self.logger, infile)
            # todo checkuse case of
            while upload_session.chunk_index <= chunks_to_upload-1:
                chunk = upload_session.get_next_chunk()
                if chunk is None:
                    break
                threadWorkers.add_job(chunk)

            failed_jobs = threadWorkers.wait_jobs_done()
            self.logger.info('Finish to upload [%s chunks], about to upload last chunk', chunks_to_upload-1)

            # last chunk
            chunk = upload_session.get_next_chunk(last_chunk = True)
            if chunk is not None:
                threadWorkers.add_job(chunk)
                job_result = threadWorkers.wait_jobs_done()
                failed_jobs.extend(job_result)
            self.check_stamp()
            upload_session_json = str(vars(upload_session))

            if len(failed_jobs) == 0:
                self.logger.info("successfully upload all chunks, call append recording")

                #Check if need to call cancel_replace
                recorded_obj = self.backend_client.get_recorded_entry(upload_session.partner_id, self.recorded_id)
                if recorded_obj.replacementStatus.value != KalturaEntryReplacementStatus.NONE:
                    self.logger.info("entry %s has replacementStatus %s, calling cancel_replace", self.recorded_id,
                                    recorded_obj.replacementStatus)
                    self.backend_client.cancel_replace(upload_session.partner_id, self.recorded_id)
                self.backend_client.set_recorded_content_remote(upload_session, str(float(self.duration)/1000))
                os.rename(self.output_file_path, self.output_file_path + '.done')
            else:
                raise Exception("Failed to upload file, "+str(len(failed_jobs))+" chunks from "+str(chunks_to_upload)+ " where failed:"
                                + upload_session_json)

    def append_recording_handler(self):
        partner_id = self.backend_client.get_live_entry(self.entry_id).partnerId
        self.backend_client.set_recorded_content_local(partner_id, self.entry_id, self.output_file_path,
                                                       str(float(self.duration)/1000))  # todo check it full path

    def run(self):
        if get_config('mode') == 'remote':
            self.upload_file(self.output_file_path)
        else:
            self.append_recording_handler()
