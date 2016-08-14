from config import get_config
import os
import requests
from lxml import objectify
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
from poster.encode import multipart_encode
import urllib2
from xml.parsers.expat import ExpatError
from xml.dom import minidom


# Register the streaming http handlers with urllib2
register_openers()


# Exception class for server errors
class KalturaException(Exception):
    def __init__(self, message, code):
        self.code = code
        self.message = message

    def __str__(self):
        return "%s (%s)" % (self.message, self.code)


class KalturaParams(object):   # todo check if all method are necessary
    def __init__(self):
        self.params = {}

    def get(self):
        return self.params

    def put(self, key, value=None):
        if value == None:
            self.params[key + '__null'] = ''
        elif isinstance(value, unicode):
            self.params[key] = value.encode('utf8')
        else:
            self.params[key] = str(value)

    def update(self, props):
        self.params.update(props)

    def add(self, key, objectProps):
        self.params[key] = objectProps

    def addObjectIfDefined(self, key, obj):
        if obj == NotImplemented:
            return
        if obj == None:
            self.put(key)
            return
        self.add(key, obj.toParams().get())

    def addArrayIfDefined(self, key, array):
        if array == NotImplemented:
            return
        if array == None:
            self.put(key)
            return
        if len(array) == 0:
            self.params[key] = {'-': ''}
        else:
            arr = []
            for curIndex in xrange(len(array)):
                arr.append(array[curIndex].toParams().get())
            self.params[key] = arr

    def addStringIfDefined(self, key, value):
        if value != NotImplemented:
            self.put(key, value)

    def addIntIfDefined(self, key, value):
        if value != NotImplemented:
            self.put(key, value)

    def addStringEnumIfDefined(self, key, value):
        if value == NotImplemented:
            return
        if value == None:
            self.put(key)
            return
        if type(value) == str:
            self.addStringIfDefined(key, value)
        else:
            self.addStringIfDefined(key, value.getValue())

    def addIntEnumIfDefined(self, key, value):
        if value == NotImplemented:
            return
        if value == None:
            self.put(key)
            return
        if type(value) == int:
            self.addIntIfDefined(key, value)
        else:
            self.addIntIfDefined(key, value.getValue())

    def addFloatIfDefined(self, key, value):
        if value != NotImplemented:
            self.put(key, value)

    def addBoolIfDefined(self, key, value):
        if value == NotImplemented:
            return
        if value == None:
            self.put(key)
            return
        if value:
            self.put(key, '1')
        else:
            self.put(key, '0')

    def sort(self, params):
        for key in params:
            if isinstance(params[key], dict):
                params[key] = self.sort(params[key])

        sortedKeys = sorted(params.keys())
        sortedDict = {}
        for key in sortedKeys:
            sortedDict[key] = params[key]

        return sortedDict

    def toJson(self):
        return json.dumps(self.params)

    def signature(self, params=None):
        if params == None:
            params = self.params
        params = self.sort(params)
        return self.md5(self.toJson())


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
        self.requestHeaders = {}
        self.admin_secret = get_config('admin_secret')
        self.partner_id = get_config('partner_id')
        self.url = os.path.join(get_config('api_service_url'))
        self.session_duration = get_config('ks_session_refresh_interval_minutes')
        self.logger = logging.getLogger(__name__)
        self.mode = get_config('mode')
        self.format = 2 # todo add it to config
        self.request_timeout = 120
        self.expiration_time_ks = -1

    def append_recording(self, file_path):
        shutil.move(file_path,
                    '/Users/ron.yadgar/dvr/isilon')  # if any file are in procceing dir, move to archive



    def _print_error(self, result, headers):
        try:
            self.logger.error("%s: objectType: %s, message: %s \n Headers: %s", result.error.code.text, result.error.objectType, result.error.message.text,  headers._store)
        except AttributeError:
            self.logger.error("API request failed: unknown error occurred")

    # todo check the cdde of api of that !
    def _create_new_session(self):
        kparams = KalturaParams()
        kparams.addStringIfDefined("secret", self.admin_secret)
        kparams.addIntIfDefined("partnerId", self.partner_id)
        kparams.addIntIfDefined("expiry", self.session_duration)
        kparams.put("format", self.format)
        url = os.path.join(self.url, "api_v3", "service", 'session', "action", 'start')

        resultNode = self.doQueue(url, kparams) # todo modularity is not good!
        self.ks = self.getXmlNodeText(resultNode) # todo should be static
        self.expiration_time_ks = int(self.session_duration) * 0.95 + int(time.time())


    def _get_kaltura_session(self):
        if (not hasattr(self, 'ks')) or self.expiration_time_ks > int(time.time()):
            self._create_new_session()
        return self.ks

    def upload_token_add(self):

        (url, params, files) = self.getRequestParams('uploadToken', 'add')
        resultNode = self.doQueue(url, params, files)
        objTypeNode = self.getChildNodeByXPath(resultNode, 'id')
        if objTypeNode == None:
            raise KalturaClientException('Could not find id node in response xml',
                                         KalturaClientException.ERROR_RESULT_NOT_FOUND)
        result = self.getXmlNodeText(objTypeNode)
        return result
    #@staticmethod
    def readHttpResponse(self, f, requestTimeout):    #todo check all comment and static method
    #    if requestTimeout != None:
    #        readTimer = Timer(requestTimeout, KalturaClient.closeHandle, [f])
    #        readTimer.start()
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
            print 'readHttpResponse'
    #        if requestTimeout != None:
    #            readTimer.cancel()
        return data


    # Send http request
    def do_http_request(self, url, params=KalturaParams(), files=KalturaFiles()):
        if len(files.get()) == 0:   # if there is files
            request_timeout = self.request_timeout # todo why? ask yossi
        else:
            request_timeout = None

        if request_timeout != None: # todo if needed, why not move it to the if
            origSocketTimeout = socket.getdefaulttimeout()
            socket.setdefaulttimeout(request_timeout)
        try:
            f = self.openRequestUrl(url, params, files, self.requestHeaders)
            data = self.readHttpResponse(f, request_timeout)
            responseHeaders = f.info().headers
        finally:
            if request_timeout != None:
                socket.setdefaulttimeout(origSocketTimeout)
        return (data, responseHeaders)

    @staticmethod
    def openRequestUrl(url, params, files, requestHeaders):
        requestHeaders['Accept'] = 'text/xml'
        requestHeaders['Accept-encoding'] = 'gzip'
        if len(files.get()) == 0:
            requestHeaders['Content-Type'] = 'application/json'
            request = urllib2.Request(url, params.toJson(), requestHeaders)
        else:
            if 'Content-Type' in requestHeaders:
                del requestHeaders['Content-Type']
            fullParams = KalturaParams()
            fullParams.put('json', params.toJson())
            fullParams.update(files.get())
            datagen, headers = multipart_encode(fullParams.get())
            headers.update(requestHeaders)
            request = urllib2.Request(url, datagen, headers)

        try:
            f = urllib2.urlopen(request)
        except Exception, e:
            raise KalturaClientException(e, KalturaClientException.ERROR_CONNECTION_FAILED)
        return f

    # Xml utility functions
    #todo all these are functios from  core, if decieeded to use them, check if better to use static
    @staticmethod
    def getXmlNodeText(xmlNode):
        if xmlNode.firstChild == None:
            return ''
        return xmlNode.firstChild.nodeValue


    def getXmlNodeFloat(self, xmlNode):
        text = self.getXmlNodeText(xmlNode)
        if text == '':
            return None
        try:
            return float(text)
        except ValueError:
            return None
    @staticmethod
    def getChildNodeByXPath(node, nodePath):
        for curName in nodePath.split('/'):
            nextChild = None
            for childNode in node.childNodes:
                if childNode.nodeName == curName:
                    nextChild = childNode
                    break
            if nextChild == None:
                return None
            node = nextChild
        return node

    def getExceptionIfError(self, resultNode):
        errorNode = self.getChildNodeByXPath(resultNode, 'error')
        if errorNode == None:
            return None
        messageNode = self.getChildNodeByXPath(errorNode, 'message')
        codeNode = self.getChildNodeByXPath(errorNode, 'code')
        if messageNode == None or codeNode == None:
            return None
        return KalturaException(self.getXmlNodeText(messageNode), self.getXmlNodeText(codeNode))

    # Validate the result xml node and raise exception if its an error
    def throwExceptionIfError(self, resultNode):
        exceptionObj = self.getExceptionIfError(resultNode)
        if exceptionObj == None:
            return
        raise exceptionObj


    def parsePostResult(self, postResult):
        if len(postResult) > 1024:
            self.logger.debug("result (xml): %s bytes" % len(postResult))
        else:
            self.logger.debug("result (xml): %s" % postResult)

        try:
            resultXml = minidom.parseString(postResult)
        except ExpatError, e:
            raise KalturaClientException(e, KalturaClientException.ERROR_INVALID_XML)

        resultNode = self.getChildNodeByXPath(resultXml, 'xml/result')
        if resultNode == None:
            raise KalturaClientException('Could not find result node in response xml',
                                         KalturaClientException.ERROR_RESULT_NOT_FOUND)

        execTime = self.getChildNodeByXPath(resultXml, 'xml/executionTime')
        if execTime != None: # todo why we need self.executionTime?
            self.executionTime = self.getXmlNodeFloat(execTime)

        self.throwExceptionIfError(resultNode)  # todo who catch it
        return resultNode

    def upload_token_upload(self, item):
        resume = not item['chunks_to_upload'] == 1
        kparams = KalturaParams()
        kparams.addStringIfDefined("uploadTokenId",  item['token_id'])
        kparams.addBoolIfDefined("resume", resume)
        kparams.addBoolIfDefined("finalChunk", item['is_last_chunk'])
        if resume:
            kparams.addFloatIfDefined("resumeAt", self.upload_token_buffer_size * (item['sequence_number']-1)) # todo check why float
            kparams.addBoolIfDefined("finalChunk", item['is_last_chunk'])
        kfiles = KalturaFiles()
        fule =open('/tmp/1.txt', 'rb')
        fule.seek(4)
        kfiles.put("fileData", fule)

        # get request params
        (url, params, files) = self.getRequestParams('uploadToken', 'upload', kparams, kfiles)
        self.doQueue(url, params, files)

    def getRequestParams(self, service, action, kparams =KalturaParams(), kfiles =KalturaFiles()):

        kparams.put("format", self.format)
        kparams.put("ks", self._get_kaltura_session())
        url = os.path.join(self.url, "api_v3", "service", service, "action", action)

        # todo check if we need it
        #signature = kparams.signature()
        #kparams.put("kalsig", signature)

        return (url, kparams, kfiles)

            # Call all API services that are in queue
    # todo change function name
    def doQueue(self, url, params, files =KalturaFiles()):
        response_headers = None # todo why self?
        self.executionTime = None
        self.logger.debug("request url: [%s]" % url)
        self.logger.debug("request json: [%s]" % params.toJson())

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
        if server_name != None or server_session != None:
            self.logger.debug("server: [%s], session [%s]" % (server_name, server_session))

        # parse the result
        resultNode = self.parsePostResult(post_result)

        return resultNode