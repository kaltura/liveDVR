from config import get_config
import os
import requests
from lxml import objectify
import logging.handlers
import time
import recording_logger
import shutil


class Singleton(object):
    """ A pythonic singleton"""
    def __new__(cls, *args, **kwargs):
        if '_inst' not in vars(cls):
            cls._inst = super(Singleton, cls).__new__(cls, *args, **kwargs)
        return cls._inst


class KalturaAPI(Singleton):

    def __init__(self):
        recording_logger.init_logger()
        self.admin_secret = get_config('admin_secret')
        self.partner_id = get_config('partner_id')
        self.url = os.path.join(get_config('api_service_url'), 'api_v3', 'index.php')
        self.session_duration = get_config('ks_session_refresh_interval_minutes')
        self.logger = logging.getLogger(__name__)
        self.mode = get_config('mode')

    def append_recoridng(self, file_path):
        shutil.move(file_path,
                    '/Users/ron.yadgar/dvr/isilon')  # if any file are in procceing dir, move to archive



    def _print_error(self, result, headers):
        try:
            self.logger.error("%s: objectType: %s, message: %s \n Headers: %s", result.error.code.text, result.error.objectType, result.error.message.text,  headers._store)
        except AttributeError:
            self.logger.error("API request failed: unknown error occurred")


    def _create_new_session(self):
        data = {
            'service': 'session',
            'action': 'start',
            'secret': self.admin_secret,
            'partnerId': self.partner_id,
            'expiry': self.session_duration,
            'format': 2   #json
        }
        try:
            r = requests.post(self.url, data=data)  # todo check for error-KALTURAAPI exception status code is not 200
            result = objectify.fromstring(r.content).result
            if result.text:
                self.ks = result.text
                self.logger.info("Kaltura client session id: " + self.ks)
                self.expiration_time_ks = int(self.session_duration)*0.95 + int(time.time())
            else:
                self._print_error(result, r.headers)
        except requests.exceptions.RequestException as e:
            self.logger.error("API request failed: %s", e.message)

    def _get_kaltura_session(self):
        if (not hasattr(self, 'ks')) or self.expiration_time_ks > int(time.time()):
            self._create_new_session()
        return self.ks

    def upload_token_add(self):
        data = {
            'service': 'uploadToken',
            'action': 'add',
            'ks': self._get_kaltura_session(),
            'format': 2  # xml
        }
        r = requests.post(self.url, data=data)  # todo check for error-KALTURAAPI exception
        result = objectify.fromstring(r.content).result
        return result.id.text

    def upload_token_upload(self, item):
        resume = not item['chunks_to_upload'] == 1
        data = {
            'partnerId': self.partner_id,
            'service': 'uploadToken',
            'action': 'upload',
            'ks': self._get_kaltura_session(),
            'uploadTokenId': item['token_id'],
            'format': 2,   #xml,
            'resume': resume,
            'fileData': item['data_stream']
        }
        if resume:
            data['resumeAt'] = self.upload_token_buffer_size * (item['sequence_number']-1)
            data['finalChunk'] = item['is_last_chunk']
        r = requests.post(self.url, data=data)  # todo check for error-KALTURAAPI exception
        result = objectify.fromstring(r.content).result
        self.logger(result)
