import os
import io
from BackendClient import *
from Config.config import get_config
from TaskBase import TaskBase
from ThreadWorkers import ThreadWorkers
from KalturaUploadSession import KalturaUploadSession
from KalturaClient.Plugins.Core import  KalturaEntryReplacementStatus, KalturaEntryServerNodeRecordingStatus
from KalturaClient.Base import KalturaException
import glob
import re
import errno

class UploadTask(TaskBase):
    # Global scope
    #global backend_client

    upload_token_buffer_size = get_config('upload_token_buffer_size_mb', 'int') * 1000000  # buffer is in MB

    def __init__(self, param, logger_info):
        TaskBase.__init__(self, param, logger_info)
        session_id = self.entry_id + '-' + self.recorded_id
        self.backend_client = BackendClient(session_id)
        mp4_filename_pattern = param['directory'] + '_f*_out.mp4'
        self.mp4_files_list = glob.glob1(self.recording_path, mp4_filename_pattern)
        self.mp4_filename_pattern = "[0,1]_.+_[0,1]_.+_\d+(.\d+)?_f(?P<flavor_id>\d+)_out[.]mp4"


    def get_chunks_to_upload(self, file_size):
        if file_size % self.upload_token_buffer_size == 0:
            return int(file_size / self.upload_token_buffer_size)

        return int(file_size / self.upload_token_buffer_size) + 1

    # todo: handle errors while upload and after retries ended on failure change recording status to DISMISSED
    def upload_file(self, file_name, flavor_id, is_first_flavor):

        threadWorkers = ThreadWorkers()
        file_size = os.path.getsize(file_name)
        chunks_to_upload = self.get_chunks_to_upload(file_size)
        with io.open(file_name, 'rb') as infile:

            upload_session = KalturaUploadSession(file_name, file_size, chunks_to_upload, self.entry_id,
                                                  self.recorded_id, self.backend_client, self.logger, infile)
            if chunks_to_upload > 2:
                chunk = upload_session.get_next_chunk()
                if chunk is not None:
                    threadWorkers.add_job(chunk)
                    failed_jobs = threadWorkers.wait_jobs_done()
                    if len(failed_jobs) != 0:
                        raise Exception("Failed to upload first chunk")
                    self.logger.debug("Finish to upload first chunks")
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
                if is_first_flavor:
                    self.check_replacement_status(upload_session.partner_id)
                self.update_recording_status(KalturaEntryServerNodeRecordingStatus.DONE)
                self.backend_client.set_recorded_content_remote(upload_session, str(float(self.duration)/1000), flavor_id)
                os.rename(file_name, file_name + '.done')
            else:
                raise Exception("Failed to upload file, "+str(len(failed_jobs))+" chunks from "+str(chunks_to_upload)+ " where failed:"
                                + upload_session_json)

    def check_replacement_status(self, partner_id):
        self.logger.debug("About to check replacement status for [%s]", self.recorded_id)
        recorded_obj = self.backend_client.get_recorded_entry(partner_id, self.recorded_id)
        self.logger.debug("Got replacement Status: %s", recorded_obj.replacementStatus.value)
        if recorded_obj.replacementStatus.value != KalturaEntryReplacementStatus.NONE:
            self.logger.info("entry %s has replacementStatus %s, calling cancel_replace", self.recorded_id,
                             recorded_obj.replacementStatus)
            self.backend_client.cancel_replace(partner_id, self.recorded_id)

    # todo: handle errors while upload and after retries ended on failure change recording status to DISMISSED
    def append_recording_handler(self, file_full_path, flavor_id, is_first_flavor):
        partner_id = self.backend_client.get_live_entry(self.entry_id).partnerId
        if is_first_flavor:
            self.check_replacement_status(partner_id)
        self.update_recording_status(KalturaEntryServerNodeRecordingStatus.DONE)
        self.backend_client.set_recorded_content_local(partner_id, self.entry_id, file_full_path,
                                                       str(float(self.duration)/1000), self.recorded_id, flavor_id)

    def update_recording_status(self, status):
        try:
            with open(self.metadata_full_path, "r") as metadata_file:
                data = metadata_file.read()
                if data:
                    metadata = json.loads(data)
                    entry_server_node_id = -1
                    try:
                        entry_server_node_id = int(metadata['entryServerNodeId'])
                        self.logger.debug(
                            'successfully read metadata.json. Entry server node id [{}]'.format(entry_server_node_id))
                    except ValueError as e:
                        self.logger.fatal("invalid content in [{}]: {}".format(self.metadata_full_path, str(e)))
                        #raise e
                    except Exception as e:
                        self.logger.fatal("Error extracting [{}]: {}".format(self.metadata_full_path, str(e)))
                        #raise e

                    ''' set recording status to DONE'''
                    self.backend_client.set_recording_status(self.entry_id,
                                                             status,
                                                             entry_server_node_id)
                else:
                    self.logger("could not update recording status to DONE. Metadata file not found.")

        # FileNotFoundError does not exist on Python < 3.3
        except (OSError, IOError) as e:
            if getattr(e, 'errno', 0) == errno.ENOENT:
                self.logger.warn("file {} doesn't exit!!! processing concatenation task (default decision)".format(
                    self.metadata_full_path))
            else:
                self.logger.fatal("failed to open {} file. {}".format(self.metadata_full_path, str(e)))
                #raise e
        except Exception as e:
            self.logger.fatal("update recording status to DONE failed. Error: {}".format(str(e)))
            #raise e

    def run(self):
        try:
            mode = get_config('mode')
            is_first_flavor = True
            for mp4 in self.mp4_files_list:
                result = re.search(self.mp4_filename_pattern, mp4)
                if not result or not result.group('flavor_id'):
                    error = "Error running upload task, failed to parse flavor id from filename: [{0}]".format(mp4)
                    self.logger.error(error)
                    raise ValueError(error)
                flavor_id = result.group('flavor_id')
                file_full_path = os.path.join(self.recording_path, mp4)
                if mode == 'remote':
                    self.upload_file(file_full_path, flavor_id, is_first_flavor)
                if mode == 'local':
                    self.append_recording_handler(file_full_path, flavor_id, is_first_flavor)
                is_first_flavor = False

        except KalturaException as e:
            if e.code == 'KALTURA_RECORDING_DISABLED':
                self.logger.warn("%s, move it to done directory", e.message)
            elif e.code == 'ENTRY_ID_NOT_FOUND':
                self.logger.warn("%s, move it to done directory", e.message)
            else:
                raise e


