from KalturaClient import *
from KalturaClient.Plugins.Core import KalturaMediaEntry, KalturaParams, KalturaUploadToken, KalturaUploadedFileTokenResource
from config import get_config
import logging.handlers
from threading import Lock
import time

class BackendClient:

    def __init__(self):
        self.admin_secret = get_config('admin_secret')
        self.partner_id = get_config('partner_id')
        self.url = get_config('api_service_url')
        self.session_duration = get_config('ks_session_refresh_interval_minutes')
        self.mode = get_config('mode')
        self.format = get_config('api_format')
        self.request_timeout = 120
        self.expiration_time_ks = -1
        self.logger = logging.getLogger(__name__)
        self.logger.info("initialize Kaltura API")
        self.mutex = Lock()

    def create_new_session(self):  # todo should create new seesion evrey 24 hours
        self.config = KalturaConfiguration(self.url)
        self.client = KalturaClient(self.config)
        self.ks = self.client.session.start(self.admin_secret, None, type, self.partner_id, None, None) #todo have to add it?
        self.client.setPartnerId(self.partner_id)
        self.client.setKs(self.ks)
        self.expiration_time_ks = int(self.session_duration) + int(time.time())
        self.logger.info("Creating new session, KS= %s", self.ks)
        return self.ks

    def get_kaltura_session(self):
        self.mutex.acquire()
        try:
            if (not hasattr(self, 'ks')) or self.expiration_time_ks < int(time.time()):
                self.create_new_session()
        finally:
            self.mutex.release()

    def impersonate_client(self, config, partner_id):  # todo should create new seesion evrey 24 hours

        clone_client = KalturaClient(config)
        clone_client.setPartnerId(partner_id)
        clone_client.setKs(self.ks)
        return clone_client

    def create_entry(self, partner_id, name, description):
        self.get_kaltura_session()
        client = self.impersonate_client(self.config, partner_id)
        entry = KalturaMediaEntry(name, description)
        entry.mediaType = 1
        result = client.media.add(entry)
        return result.id

    def upload_token_add(self, partner_id, file_name, file_size):
        self.get_kaltura_session()
        client = self.impersonate_client(self.config, partner_id)
        upload_token_obj = KalturaUploadToken()
        upload_token_obj.fileName = file_name
        upload_token_obj.fileSize = file_size
        result = client.uploadToken.add(upload_token_obj)
        self.logger.info("File name %s, partnerId %s", file_name, partner_id)
        return result.id

    def upload_token_upload(self, item):    #uploadTokenId, fileData, resume = False, finalChunk = True, resumeAt = -1):
        self.get_kaltura_session()
        client = self.impersonate_client(self.config, item['upload_session'].partner_id)
        token = item['upload_session'].token_id
        resume = item['resume']
        final_chunk = item['is_last_chunk']  # todo change is_last_chunk to finalChunk
        resume_at = item['resumeAt']
        result = client.uploadToken.upload(token, item['data_stream'], resume, final_chunk, resume_at) # todo change data stream name

        return result

    def set_media_content(self, upload_session):
        self.get_kaltura_session()
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

