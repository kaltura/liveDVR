from config import get_config
import os
import logging.handlers
import time
import recording_logger
import shutil
import json
from threading import Timer
import gzip
from StringIO import StringIO
import socket
from poster.streaminghttp import register_openers
from poster.encode import *
import urllib2
from xml.parsers.expat import ExpatError
from xml.dom import minidom



# TODO this model should be not block if two thread want to access it, second parterId should be always initalize to -5, and crate seessiiion should create once

class KalturaUploadedFileTokenResource():
    def __init__(self, token):
        self.token = token
        self.objectType = 'KalturaUploadedFileTokenResource'

    def to_dict(self):
        return self.__dict__


class KalturaUploadToken():
    def __init__(self, file_name, file_size):
        self.objectType = 'KalturaUploadedToken'
        self.fileName = file_name
        self.fileSize = file_size

    def to_dict(self):
        return self.__dict__


class KalturaMediaEntry():
    def __init__(self, name, description):
        self.name = name
        self.description = description
        self.mediaType = 1  # video
        self.objectType = 'KalturaMediaEntry'

    def to_dict(self):
        return self.__dict__


class KalturaParams(object):
    def __init__(self):
        self.params = {}

    def get(self):
        return self.params

    def put(self, key, value=None):
        if value is None:
            self.params[key + '__null'] = ''
        elif isinstance(value, unicode):
            self.params[key] = value.encode('utf8')
        else:
            self.params[key] = str(value)

    def update(self, props):
        self.params.update(props)

    def add(self, key, object_props):
        self.params[key] = object_props

    def add_bool(self, key, value):

        if value:
            self.put(key, '1')
        else:
            self.put(key, '0')

    def add_object_if_defined(self, key, obj):
        if obj == NotImplemented:
            return
        if obj is None:
            self.put(key)
            return
        self.add(key, obj.toParams().get())

    def to_json(self):
        return json.dumps(self.params)


# Request files container
class KalturaFiles(object):
    def __init__(self):
        self.params = {}

    def get(self):
        return self.params

    def put(self, key, value):
        self.params[key] = value

    def update(self, props):
        self.params.update(props)


# Exception class for server errors
class KalturaException(Exception):
    def __init__(self, message, code):
        self.code = code
        self.message = message

    def __str__(self):
        return "%s (%s)" % (self.message, self.code)


# Exception class for client errors
class KalturaClientException(Exception):
    ERROR_GENERIC = -1
    ERROR_INVALID_XML = -2
    ERROR_FORMAT_NOT_SUPPORTED = -3
    ERROR_CONNECTION_FAILED = -4
    ERROR_READ_FAILED = -5
    ERROR_INVALID_PARTNER_ID = -6
    ERROR_INVALID_OBJECT_TYPE = -7
    ERROR_RESULT_NOT_FOUND = -8
    ERROR_READ_TIMEOUT = -9
    ERROR_READ_GZIP_FAILED = -10

    def __init__(self, message, code):
        self.code = code
        self.message = message

    def __str__(self):
        return "%s (%s)" % (self.message, self.code)


class Singleton(object):
    """ A pythonic singleton"""
    def __new__(cls, *args, **kwargs):
        if '_inst' not in vars(cls):
            cls._inst = super(Singleton, cls).__new__(cls, *args, **kwargs)
        return cls._inst


class KalturaAPI(Singleton):
# todo init should not called each time!
    def __init__(self):
        self.admin_secret = get_config('admin_secret')
        self.partner_id = get_config('partner_id')
        self.url = os.path.join(get_config('api_service_url'))
        self.session_duration = get_config('ks_session_refresh_interval_minutes')
        self.logger = logging.getLogger(__name__)
        self.mode = get_config('mode')
        self.format = get_config('api_format')
        self.request_timeout = 120
        self.expiration_time_ks = -1
        register_openers()  # register the new streaming http handlers

    @staticmethod
    def append_recording(file_path):
        shutil.move(file_path,
                    '/Users/ron.yadgar/dvr/isilon')  # if any file are in procceing dir, move to archive


    # todo should be impersonate
    def _create_new_session(self):  #todo impersonate
        kparams = KalturaParams()
        kparams.put("secret", self.admin_secret)
        kparams.put("partnerId", self.partner_id)
        kparams.put("expiry", self.session_duration)
        kparams.put("format", self.format)
        url = os.path.join(self.url, "api_v3", "service", 'session', "action", 'start')

        result_node = self.do_queue(url, kparams)
        self.ks = self.get_xml_node_text(result_node)
        self.expiration_time_ks = int(self.session_duration) + int(time.time())

    def _get_kaltura_session(self):
        if (not hasattr(self, 'ks')) or self.expiration_time_ks < int(time.time()):
            self._create_new_session()
        return self.ks

    def create_entry(self, partner_id, name, description):
        kparams = KalturaParams()
        entry = KalturaMediaEntry(name, description)
        kparams.add('entry', entry.to_dict())
        (url, params, files) = self.get_request_params('media', 'add', kparams)
        self.impersonate(partner_id)
        result_node = self.do_queue(url, params, files)
        obj_type_node = self.get_child_node_by_path(result_node, 'id')
        if obj_type_node is None:
            raise KalturaClientException('Could not find id node in response xml',  KalturaClientException
                                         .ERROR_RESULT_NOT_FOUND)
        result = self.get_xml_node_text(obj_type_node)
        return result

    def set_media_content(self, entry_id, token_id):
        kparams = KalturaParams()
        resource = KalturaUploadedFileTokenResource(token_id)
        kparams.add('entryId', entry_id)
        kparams.add('resource', resource.to_dict())
        (url, params, files) = self.get_request_params('media', 'addContent', kparams)
        result_node = self.do_queue(url, params, files)
        obj_type_node = self.get_child_node_by_path(result_node, 'id')

    def get_partner_id(self, entry_id):
        kparams = KalturaParams()
        kparams.add('entryId', entry_id)
        (url, params, files) = self.get_request_params('liveStream', 'get', kparams)
        result_node = self.do_queue(url, params, files)
        obj_type_node = self.get_child_node_by_path(result_node, 'partnerId')
        if obj_type_node is None:
            raise KalturaClientException('Could not find id node in response xml',
                                         KalturaClientException.ERROR_RESULT_NOT_FOUND)
        result = self.get_xml_node_text(obj_type_node)
        return result

    def upload_token_add(self, entry_id, file_name, file_size):
        kparams = KalturaParams()
        upload_token_obj = KalturaUploadToken(file_name, file_size)
        kparams.add('uploadToken', upload_token_obj.to_dict())
        partner_id = self.get_partner_id(entry_id)
        #self.impersonate(partner_id)
        (url, params, files) = self.get_request_params('uploadToken', 'add', kparams)
        self.partner_id = partner_id
        result_node = self.do_queue(url, params, files)
        obj_type_node = self.get_child_node_by_path(result_node, 'id')
        if obj_type_node is None:
            raise KalturaClientException('Could not find id node in response xml',
                                         KalturaClientException.ERROR_RESULT_NOT_FOUND)
        result = self.get_xml_node_text(obj_type_node)
        return result

    def upload_token_upload(self, item, entry_id):
        partner_id = self.get_partner_id(entry_id)
        self.impersonate(partner_id)
        (kparams, kfiles) = self.get_request_params_for_upload_token(item)
        (url, params, files) = self.get_request_params('uploadToken', 'upload', kparams, kfiles)
        self.do_queue(url, params, files)

    def get_request_params_for_upload_token(self, item):
        kparams = KalturaParams()
        kparams.put("uploadTokenId", item['token_id'])
        kparams.add_bool("resume", item['resume'])
        kparams.add_bool("finalChunk", item['is_last_chunk'])
        if item['resume']:
            kparams.put("resumeAt", item['resumeAt'])
            kparams.add_bool("finalChunk", item['is_last_chunk'])
        kfiles = KalturaFiles()
        kfiles.put("fileData", item['data_stream'])
        return kparams,kfiles

    @staticmethod
    def close_handle(fh):
        fh.close()

    def read_http_response(self, f, request_timeout):
        if request_timeout is not None:
            read_timer = Timer(request_timeout, self.close_handle, [f])
            read_timer.start()
        try:
            try:
                data = f.read()
            except AttributeError, e:      # socket was closed while reading
                raise KalturaClientException(e, KalturaClientException.ERROR_READ_TIMEOUT)
            except Exception, e:
                raise KalturaClientException(e, KalturaClientException.ERROR_READ_FAILED)
            if f.info().get('Content-Encoding') == 'gzip':
                gzipFile = gzip.GzipFile(fileobj=StringIO(data))
                try:
                    data = gzipFile.read()
                except IOError, e:
                    raise KalturaClientException(e, KalturaClientException.ERROR_READ_GZIP_FAILED)
        finally:
            if request_timeout is not None:
                read_timer.cancel()
        return data

    # Send http request
    def do_http_request(self, url, params=KalturaParams(), files=KalturaFiles()):
        if len(files.get()) == 0:   # if there is files
            request_timeout = self.request_timeout # todo why? ask yossi
        else:
            request_timeout = None

        if request_timeout is not None: # todo if needed, why not move it to the if
            orig_socket_timeout = socket.getdefaulttimeout()
            socket.setdefaulttimeout(request_timeout)
        try:
            f = self.open_request_url(url, params, files)
            data = self.read_http_response(f, request_timeout)
            response_headers = f.info().headers
        finally:
            if request_timeout is not None:
                socket.setdefaulttimeout(orig_socket_timeout)
        return data, response_headers

    @staticmethod
    def open_request_url(url, params, files):
        request_headers = {}
        request_headers['Accept-encoding'] = 'gzip'
        if len(files.get()) == 0:
            request_headers['Content-Type'] = 'application/json'
            request = urllib2.Request(url, params.to_json(), request_headers)
        else:
            full_params = KalturaParams()
            full_params.put('json', params.to_json())
            full_params.update(files.get())
            datagen, headers = multipart_encode(full_params.get())
            headers.update(request_headers)
            request = urllib2.Request(url, datagen, headers)

        try:
            f = urllib2.urlopen(request)
        except Exception, e:
            raise KalturaClientException(e, KalturaClientException.ERROR_CONNECTION_FAILED)
        return f

    # Xml utility functions
    @staticmethod
    def get_xml_node_text(xml_node):
        if xml_node.firstChild is None:
            return ''
        return xml_node.firstChild.nodeValue

    def get_xml_node(self, xml_node):
        text = self.get_xml_node_text(xml_node)
        if text == '':
            return None
        try:
            return float(text)
        except ValueError:
            return None

    @staticmethod
    def get_child_node_by_path(node, node_path):
        for curName in node_path.split('/'):
            next_child = None
            for childNode in node.childNodes:
                if childNode.nodeName == curName:
                    next_child = childNode
                    break
            if next_child is None:
                return None
            node = next_child
        return node

    def impersonate(self, partner_id):
        self.partner_id = 102


    def unimpersonate(self):
        self.partner_id = -5

    def get_exception_if_error(self, result_node):
        error_node = self.get_child_node_by_path(result_node, 'error')
        if error_node is None:
            return None
        message_node = self.get_child_node_by_path(error_node, 'message')
        code_node = self.get_child_node_by_path(error_node, 'code')
        if message_node is None or code_node is None:
            return None
        return KalturaException(self.get_xml_node_text(message_node), self.get_xml_node_text(code_node))

    # Validate the result xml node and raise exception if its an error
    def throw_exception_if_error(self, result_node):
        exception_obj = self.get_exception_if_error(result_node)
        if exception_obj is None:
            return
        raise exception_obj

    def parse_post_result(self, post_result):
        if len(post_result) > 1024:
            self.logger.debug("result (xml): %s bytes" % len(post_result))
        else:
            self.logger.debug("result (xml): %s" % post_result)

        try:
            result_xml = minidom.parseString(post_result)
        except ExpatError, e:
            raise KalturaClientException(e, KalturaClientException.ERROR_INVALID_XML)

        result_node = self.get_child_node_by_path(result_xml, 'xml/result')
        if result_node is None:
            raise KalturaClientException('Could not find result node in response xml',
                                         KalturaClientException.ERROR_RESULT_NOT_FOUND)

        self.throw_exception_if_error(result_node)
        return result_node

    def get_request_params(self, service, action, kparams =KalturaParams(), kfiles =KalturaFiles()):

        kparams.put("format", self.format)
        kparams.put("ks", self._get_kaltura_session())
        kparams.put("partnerId", 102)
        print self.partner_id
        url = os.path.join(self.url, "api_v3", "service", service, "action", action)
        return url, kparams, kfiles

            # Call all API services that are in queue

    def do_queue(self, url, params, files=KalturaFiles()):
        self.logger.debug("request url: [%s]" % url)
        self.logger.debug("request json: [%s]" % params.to_json())

        start_time = time.time()

        # issue the request
        (post_result, response_headers) = self.do_http_request(url, params, files)

        end_time = time.time()
        self.logger.debug("execution time for [%s]: [%s]" % (url, end_time - start_time))

        # print server debug info to log
        server_name = None
        server_session = None
        for curHeader in response_headers:
            if curHeader.startswith('X-Me:'):
                server_name = curHeader.split(':', 1)[1].strip()
            elif curHeader.startswith('X-Kaltura-Session:'):
                server_name = curHeader.split(':', 1)[1].strip()
        if server_name is not None or server_session is not None:
            self.logger.debug("server: [%s], session [%s]" % (server_name, server_session))

        # parse the result
        result_node = self.parse_post_result(post_result)
        return result_node