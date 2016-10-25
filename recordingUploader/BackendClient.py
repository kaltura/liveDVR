from KalturaClient import *
from KalturaClient.Plugins.Core import KalturaSessionType, KalturaUploadToken, KalturaUploadedFileTokenResource, \
    KalturaUploadTokenFilter, KalturaServerFileResource, KalturaUploadTokenStatus
from Config.config import get_config
import logging.handlers
from Logger.LoggerDecorator import logger_decorator
from threading import Lock
import time
import json
# todo add timer to renew ks insted of check each time
# todo maybe add partner Id to init
class BackendClient:

    admin_secret = get_config('admin_secret')
    partner_id = get_config('partner_id')
    url = get_config('api_service_url')
    session_duration = get_config('session_duration')
    mode = get_config('mode')
    format = get_config('api_format')
    request_timeout = 120
    expiration_time_ks = -1
    mutex = Lock()
    config = KalturaConfiguration(url)
    client = KalturaClient(config)
    client.setPartnerId(partner_id)
    ks = None
    type = KalturaSessionType.ADMIN

    def __init__(self, session_id):
        self.logger = logger_decorator(self.__class__.__name__, session_id)

    def create_new_session(self):
        result = self.client.session.start(self.admin_secret, None, self.type, self.partner_id, None, None)
        BackendClient.ks = result[0]
        BackendClient.expiration_time_ks = int(self.session_duration) + int(time.time()) - 3600  # confidence interval
        self.client.setKs(self.ks)
        self.logger.info("Creating a new session, KS= %s \n Header: %s", self.ks, result[1])

    def get_kaltura_session(self):
        self.mutex.acquire()
        try:
            if (self.ks is None) or self.expiration_time_ks < int(time.time()):
                self.create_new_session()
        finally:
            self.mutex.release()

    def impersonate_client(self, partner_id):
        global ks
        self.get_kaltura_session()  # generate KS in case that not existed or expired
        clone_client = KalturaClient(self.config)
        clone_client.setPartnerId(partner_id)
        clone_client.setKs(self.ks)
        return clone_client

    def handle_request(self, partner_id, service, action, *parameters):

        client = self.impersonate_client(partner_id)
        service_attribute = getattr(client, service)
        action_attribute = getattr(service_attribute, action)
        self.logger.debug("[%s][%s] About to call", service, action)
        (result, header) = action_attribute(*parameters)
        self.logger.debug("[%s][%s] API result's header : %s  ", service, action, header)
        return result

    def cancel_replace(self, partner_id, entry_id):
        return self.handle_request(partner_id, 'media', 'cancelReplace', entry_id)

    def get_recorded_entry(self, partner_id, entry_id):
        return self.handle_request(partner_id, 'media', 'get', entry_id)

    def get_live_entry(self, entry_id):
        self.get_kaltura_session()  # generate KS in case that not existed or expired
        result = self.client.liveStream.get(entry_id)
        self.logger.info("Header :%s ", result[1])
        return result[0]

    def upload_token_add(self, partner_id, file_name, file_size):

        upload_token_obj = KalturaUploadToken()
        upload_token_obj.fileName = file_name
        upload_token_obj.fileSize = file_size

        result = self.handle_request(partner_id, 'uploadToken', 'add', upload_token_obj)
        self.logger.info("Token id : [%s], file name: [%s], partnerId: [%s]", result.id, file_name, partner_id)
        return result.id

    def upload_token_list(self, partner_id, file_name):

        upload_token_filter = KalturaUploadTokenFilter()
        upload_token_filter.fileNameEqual = file_name
        upload_token_filter.statusIn = KalturaUploadTokenStatus.PENDING, KalturaUploadTokenStatus.PARTIAL_UPLOAD, KalturaUploadTokenStatus.FULL_UPLOAD
        return self.handle_request(partner_id, 'uploadToken', 'list', upload_token_filter)

    def upload_token_upload(self, upload_chunk_obj):

        token = upload_chunk_obj.upload_session.token_id
        file_name = upload_chunk_obj.upload_session.file_name
        chunks_to_upload = upload_chunk_obj.upload_session.chunks_to_upload
        sequence_number = upload_chunk_obj.sequence_number
        resume = upload_chunk_obj.resume
        final_chunk = upload_chunk_obj.final_chunk
        resume_at = upload_chunk_obj.resume_at
        self.logger.info("About to upload chunk [%s] from [%s] in file [%s] token:[%s], resume:[%s], "
                         "final_chunk [%s], resume_at: [%s]", sequence_number, chunks_to_upload, file_name, token,
                         resume, final_chunk, resume_at)

        result = self.handle_request(upload_chunk_obj.upload_session.partner_id, 'uploadToken', 'upload', token,
                                     upload_chunk_obj.file_obj, resume, final_chunk, resume_at)

        self.logger.info("Finish to upload, result: %s", self.upload_token_result_to_json(result))
        return result

    @staticmethod
    def upload_token_result_to_json(result):  # wrapped by try catch in order to prevent upload token to be failed.
        result_dictionary = {
            "fileName": result.fileName,
            "fileSize": result.fileSize,
            "token": result.id,
            "partnerId": result.partnerId,
            "status": result.status.value,
            "uploadFileSize": result.uploadedFileSize
        }
        return json.dumps(result_dictionary, ensure_ascii=False)

    def set_media_content_add(self, upload_session):
        token_id = upload_session.token_id
        recorded_id = upload_session.recorded_id
        partner_id = upload_session.partner_id
        resource = KalturaUploadedFileTokenResource(token_id)
        self.handle_request(partner_id, 'media', 'addContent', recorded_id, resource)
        self.logger.info("Set media content add with entryId [%s] and token [%s]", recorded_id, token_id)

    def set_media_content_update(self, upload_session):
        token_id = upload_session.token_id
        recorded_id = upload_session.recorded_id
        partner_id = upload_session.partner_id
        resource = KalturaUploadedFileTokenResource(token_id)
        self.handle_request(partner_id, 'media', 'updateContent', recorded_id, resource)
        self.logger.info("Set media content with update entryId [%s] and token [%s]", recorded_id, token_id)

    def set_recorded_content(self, upload_session):
        token_id = upload_session.token_id
        recorded_id = upload_session.recorded_id
        entry_id = upload_session.entry_id
        self.logger.info("set_recorded_content entryId [%s] recorded_id [%s]", entry_id, recorded_id)
        partner_id = upload_session.partner_id
        resource = KalturaUploadedFileTokenResource(token_id)
        self.logger.info("set_recorded_content partner_id [%s]", partner_id)
        self.handle_request(partner_id, 'liveStream', 'setRecordedContent', entry_id, 0, resource, 30)
        self.logger.info("Set recorded content, entryId [%s] and token [%s] mediaServerIndex [%s] duration [%s]",
                         entry_id, token_id, 1, 30)

    def append_recording(self, partner_id, recorded_id, output_file): # todo check it
        resource = KalturaServerFileResource()
        resource.localFilePath = output_file
        self.handle_request(partner_id, 'media', 'updateContent', resource)
        self.logger.info("Append recording for content %s recorded entryId %s.", output_file, recorded_id)



