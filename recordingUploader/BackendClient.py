from KalturaClient import *
from KalturaClient.Plugins.Core import KalturaMediaEntry, KalturaParams, KalturaUploadToken, KalturaUploadedFileTokenResource
from config import get_config
import logging.handlers
from threading import Lock
import time
import json

class BackendClient:

    def __init__(self):
        self.admin_secret = get_config('admin_secret')
        self.partner_id = get_config('partner_id')
        self.url = get_config('api_service_url')
        self.session_duration = get_config('session_duration')
        self.mode = get_config('mode')
        self.format = get_config('api_format')
        self.request_timeout = 120
        self.expiration_time_ks = -1
        self.logger = logging.getLogger(__name__)
        self.logger.info("initialize Kaltura API")
        self.mutex = Lock()

    def create_new_session(self):
        self.config = KalturaConfiguration(self.url)
        self.client = KalturaClient(self.config)
        self.ks = self.client.session.start(self.admin_secret, None, type, self.partner_id, self.session_duration, None)
        self.client.setPartnerId(self.partner_id)
        self.client.setKs(self.ks)
        self.expiration_time_ks = int(self.session_duration) + int(time.time()) - 3600  # confidence interval
        self.logger.info("Creating new session, KS= %s", self.ks)
        return self.ks

    def get_kaltura_session(self):
        self.mutex.acquire()
        try:
            if (not hasattr(self, 'ks')) or self.expiration_time_ks < int(time.time()):
                self.create_new_session()
        finally:
            self.mutex.release()

    def impersonate_client(self, config, partner_id):

        clone_client = KalturaClient(config)
        clone_client.setPartnerId(partner_id)
        self.get_kaltura_session()  # generate KS in case that not existed or expired
        clone_client.setKs(self.ks)
        return clone_client

    def create_entry(self, partner_id, name, description):

        client = self.impersonate_client(self.config, partner_id)
        entry = KalturaMediaEntry(name, description)
        entry.mediaType = 1
        result = client.media.add(entry)
        return result.id

    def upload_token_add(self, partner_id, file_name, file_size):

        client = self.impersonate_client(self.config, partner_id)
        upload_token_obj = KalturaUploadToken()
        upload_token_obj.fileName = file_name
        upload_token_obj.fileSize = file_size
        result = client.uploadToken.add(upload_token_obj)
        self.logger.info("Token id : %s, file name: %s, partnerId: %s", result.id, file_name, partner_id)
        return result.id

    def upload_token_upload(self, upload_chunk_obj):

        client = self.impersonate_client(self.config, upload_chunk_obj.upload_session.partner_id)
        token = upload_chunk_obj.upload_session.token_id
        file_name = upload_chunk_obj.upload_session.file_name
        chunks_to_upload = upload_chunk_obj.upload_session.chunks_to_upload
        sequence_number = upload_chunk_obj.sequence_number
        entry_id = upload_chunk_obj.upload_session.upload_entry
        resume = upload_chunk_obj.resume
        final_chunk = upload_chunk_obj.final_chunk
        resume_at = upload_chunk_obj.resume_at
        self.logger.info("About to upload chunk %s from %s in file %s for recorded entry %s token:%s, resume:%s, "
                         "final_chunk %s, resume_at: %s", sequence_number, chunks_to_upload, file_name, entry_id, token,
                         resume, final_chunk, resume_at)
        result = client.uploadToken.upload(token,  upload_chunk_obj.file_obj, resume, final_chunk, resume_at)
        self.logger.info("Finish to upload, result: %s", self.upload_token_result_to_json(result))
        return result

    @staticmethod
    def upload_token_result_to_json(result):  # wrapped by try catch in order to prevent upload token to be failed.
        try:
            result_dictionary = {
                "fileName": result.fileName,
                "fileSize": result.fileSize,
                "token": result.id,
                "partnerId": result.partnerId,
                "status": result.status.value,
                "uploadFileSize": result.uploadedFileSize
            }
            return json.dumps(result_dictionary, ensure_ascii=False)
        except Exception:
            return result.toParams().toJson()

    def set_media_content(self, upload_session):

        token_id = upload_session.token_id
        upload_entry = upload_session.upload_entry
        partner_id = upload_session.partner_id
        resource = KalturaUploadedFileTokenResource(token_id)
        client = self.impersonate_client(self.config, partner_id)
        client.media.addContent(upload_entry, resource)
        self.logger.info("Set media content with entryId %s and token %s", upload_entry, token_id)

    def get_partner_id(self, entry_id):
        self.get_kaltura_session()
        result = self.client.liveStream.get(entry_id)
        return result.partnerId

