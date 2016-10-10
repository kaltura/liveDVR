# ===================================================================================================
#                           _  __     _ _
#                          | |/ /__ _| | |_ _  _ _ _ __ _
#                          | ' </ _` | |  _| || | '_/ _` |
#                          |_|\_\__,_|_|\__|\_,_|_| \__,_|
#
# This file is part of the Kaltura Collaborative Media Suite which allows users
# to do with audio, video, and animation what Wiki platfroms allow them to do with
# text.
#
# Copyright (C) 2006-2016  Kaltura Inc.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http:#www.gnu.org/licenses/>.
#
# @ignore
# ===================================================================================================
# @package Kaltura
# @subpackage Client
from Core import *
from EventNotification import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaHttpNotificationAuthenticationMethod(object):
    ANYSAFE = -18
    ANY = -17
    BASIC = 1
    DIGEST = 2
    GSSNEGOTIATE = 4
    NTLM = 8

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaHttpNotificationMethod(object):
    GET = 1
    POST = 2
    PUT = 3
    DELETE = 4

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaHttpNotificationSslVersion(object):
    V2 = 2
    V3 = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaHttpNotificationCertificateType(object):
    DER = "DER"
    ENG = "ENG"
    PEM = "PEM"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaHttpNotificationSslKeyType(object):
    DER = "DER"
    ENG = "ENG"
    PEM = "PEM"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaHttpNotificationTemplateOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    ID_ASC = "+id"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    ID_DESC = "-id"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaHttpNotification(KalturaObjectBase):
    """Wrapper for sent notifications"""

    def __init__(self,
            object=NotImplemented,
            eventObjectType=NotImplemented,
            eventNotificationJobId=NotImplemented,
            templateId=NotImplemented,
            templateName=NotImplemented,
            templateSystemName=NotImplemented,
            eventType=NotImplemented):
        KalturaObjectBase.__init__(self)

        # Object that triggered the notification
        # @var KalturaObjectBase
        self.object = object

        # Object type that triggered the notification
        # @var KalturaEventNotificationEventObjectType
        self.eventObjectType = eventObjectType

        # ID of the batch job that execute the notification
        # @var int
        self.eventNotificationJobId = eventNotificationJobId

        # ID of the template that triggered the notification
        # @var int
        self.templateId = templateId

        # Name of the template that triggered the notification
        # @var string
        self.templateName = templateName

        # System name of the template that triggered the notification
        # @var string
        self.templateSystemName = templateSystemName

        # Ecent type that triggered the notification
        # @var KalturaEventNotificationEventType
        self.eventType = eventType


    PROPERTY_LOADERS = {
        'object': (KalturaObjectFactory.create, KalturaObjectBase), 
        'eventObjectType': (KalturaEnumsFactory.createString, "KalturaEventNotificationEventObjectType"), 
        'eventNotificationJobId': getXmlNodeInt, 
        'templateId': getXmlNodeInt, 
        'templateName': getXmlNodeText, 
        'templateSystemName': getXmlNodeText, 
        'eventType': (KalturaEnumsFactory.createString, "KalturaEventNotificationEventType"), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaHttpNotification.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaHttpNotification")
        kparams.addObjectIfDefined("object", self.object)
        kparams.addStringEnumIfDefined("eventObjectType", self.eventObjectType)
        kparams.addIntIfDefined("eventNotificationJobId", self.eventNotificationJobId)
        kparams.addIntIfDefined("templateId", self.templateId)
        kparams.addStringIfDefined("templateName", self.templateName)
        kparams.addStringIfDefined("templateSystemName", self.templateSystemName)
        kparams.addStringEnumIfDefined("eventType", self.eventType)
        return kparams

    def getObject(self):
        return self.object

    def setObject(self, newObject):
        self.object = newObject

    def getEventObjectType(self):
        return self.eventObjectType

    def setEventObjectType(self, newEventObjectType):
        self.eventObjectType = newEventObjectType

    def getEventNotificationJobId(self):
        return self.eventNotificationJobId

    def setEventNotificationJobId(self, newEventNotificationJobId):
        self.eventNotificationJobId = newEventNotificationJobId

    def getTemplateId(self):
        return self.templateId

    def setTemplateId(self, newTemplateId):
        self.templateId = newTemplateId

    def getTemplateName(self):
        return self.templateName

    def setTemplateName(self, newTemplateName):
        self.templateName = newTemplateName

    def getTemplateSystemName(self):
        return self.templateSystemName

    def setTemplateSystemName(self, newTemplateSystemName):
        self.templateSystemName = newTemplateSystemName

    def getEventType(self):
        return self.eventType

    def setEventType(self, newEventType):
        self.eventType = newEventType


# @package Kaltura
# @subpackage Client
class KalturaHttpNotificationData(KalturaObjectBase):
    def __init__(self):
        KalturaObjectBase.__init__(self)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaHttpNotificationData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaHttpNotificationData")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaHttpNotificationDataFields(KalturaHttpNotificationData):
    """If this class used as the template data, the fields will be taken from the content parameters"""

    def __init__(self):
        KalturaHttpNotificationData.__init__(self)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaHttpNotificationData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaHttpNotificationDataFields.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaHttpNotificationData.toParams(self)
        kparams.put("objectType", "KalturaHttpNotificationDataFields")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaHttpNotificationDataText(KalturaHttpNotificationData):
    def __init__(self,
            content=NotImplemented):
        KalturaHttpNotificationData.__init__(self)

        # @var KalturaStringValue
        self.content = content


    PROPERTY_LOADERS = {
        'content': (KalturaObjectFactory.create, KalturaStringValue), 
    }

    def fromXml(self, node):
        KalturaHttpNotificationData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaHttpNotificationDataText.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaHttpNotificationData.toParams(self)
        kparams.put("objectType", "KalturaHttpNotificationDataText")
        kparams.addObjectIfDefined("content", self.content)
        return kparams

    def getContent(self):
        return self.content

    def setContent(self, newContent):
        self.content = newContent


# @package Kaltura
# @subpackage Client
class KalturaHttpNotificationObjectData(KalturaHttpNotificationData):
    """Evaluates PHP statement, depends on the execution context"""

    def __init__(self,
            apiObjectType=NotImplemented,
            format=NotImplemented,
            ignoreNull=NotImplemented,
            code=NotImplemented):
        KalturaHttpNotificationData.__init__(self)

        # Kaltura API object type
        # @var string
        self.apiObjectType = apiObjectType

        # Data format
        # @var KalturaResponseType
        self.format = format

        # Ignore null attributes during serialization
        # @var bool
        self.ignoreNull = ignoreNull

        # PHP code
        # @var string
        self.code = code


    PROPERTY_LOADERS = {
        'apiObjectType': getXmlNodeText, 
        'format': (KalturaEnumsFactory.createInt, "KalturaResponseType"), 
        'ignoreNull': getXmlNodeBool, 
        'code': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaHttpNotificationData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaHttpNotificationObjectData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaHttpNotificationData.toParams(self)
        kparams.put("objectType", "KalturaHttpNotificationObjectData")
        kparams.addStringIfDefined("apiObjectType", self.apiObjectType)
        kparams.addIntEnumIfDefined("format", self.format)
        kparams.addBoolIfDefined("ignoreNull", self.ignoreNull)
        kparams.addStringIfDefined("code", self.code)
        return kparams

    def getApiObjectType(self):
        return self.apiObjectType

    def setApiObjectType(self, newApiObjectType):
        self.apiObjectType = newApiObjectType

    def getFormat(self):
        return self.format

    def setFormat(self, newFormat):
        self.format = newFormat

    def getIgnoreNull(self):
        return self.ignoreNull

    def setIgnoreNull(self, newIgnoreNull):
        self.ignoreNull = newIgnoreNull

    def getCode(self):
        return self.code

    def setCode(self, newCode):
        self.code = newCode


# @package Kaltura
# @subpackage Client
class KalturaHttpNotificationTemplate(KalturaEventNotificationTemplate):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            type=NotImplemented,
            status=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            manualDispatchEnabled=NotImplemented,
            automaticDispatchEnabled=NotImplemented,
            eventType=NotImplemented,
            eventObjectType=NotImplemented,
            eventConditions=NotImplemented,
            contentParameters=NotImplemented,
            userParameters=NotImplemented,
            url=NotImplemented,
            method=NotImplemented,
            data=NotImplemented,
            timeout=NotImplemented,
            connectTimeout=NotImplemented,
            username=NotImplemented,
            password=NotImplemented,
            authenticationMethod=NotImplemented,
            sslVersion=NotImplemented,
            sslCertificate=NotImplemented,
            sslCertificateType=NotImplemented,
            sslCertificatePassword=NotImplemented,
            sslEngine=NotImplemented,
            sslEngineDefault=NotImplemented,
            sslKeyType=NotImplemented,
            sslKey=NotImplemented,
            sslKeyPassword=NotImplemented,
            customHeaders=NotImplemented):
        KalturaEventNotificationTemplate.__init__(self,
            id,
            partnerId,
            name,
            systemName,
            description,
            type,
            status,
            createdAt,
            updatedAt,
            manualDispatchEnabled,
            automaticDispatchEnabled,
            eventType,
            eventObjectType,
            eventConditions,
            contentParameters,
            userParameters)

        # Remote server URL
        # @var string
        self.url = url

        # Request method.
        # @var KalturaHttpNotificationMethod
        self.method = method

        # Data to send.
        # @var KalturaHttpNotificationData
        self.data = data

        # The maximum number of seconds to allow cURL functions to execute.
        # @var int
        self.timeout = timeout

        # The number of seconds to wait while trying to connect.
        # 	 Must be larger than zero.
        # @var int
        self.connectTimeout = connectTimeout

        # A username to use for the connection.
        # @var string
        self.username = username

        # A password to use for the connection.
        # @var string
        self.password = password

        # The HTTP authentication method to use.
        # @var KalturaHttpNotificationAuthenticationMethod
        self.authenticationMethod = authenticationMethod

        # The SSL version (2 or 3) to use.
        # 	 By default PHP will try to determine this itself, although in some cases this must be set manually.
        # @var KalturaHttpNotificationSslVersion
        self.sslVersion = sslVersion

        # SSL certificate to verify the peer with.
        # @var string
        self.sslCertificate = sslCertificate

        # The format of the certificate.
        # @var KalturaHttpNotificationCertificateType
        self.sslCertificateType = sslCertificateType

        # The password required to use the certificate.
        # @var string
        self.sslCertificatePassword = sslCertificatePassword

        # The identifier for the crypto engine of the private SSL key specified in ssl key.
        # @var string
        self.sslEngine = sslEngine

        # The identifier for the crypto engine used for asymmetric crypto operations.
        # @var string
        self.sslEngineDefault = sslEngineDefault

        # The key type of the private SSL key specified in ssl key - PEM / DER / ENG.
        # @var KalturaHttpNotificationSslKeyType
        self.sslKeyType = sslKeyType

        # Private SSL key.
        # @var string
        self.sslKey = sslKey

        # The secret password needed to use the private SSL key specified in ssl key.
        # @var string
        self.sslKeyPassword = sslKeyPassword

        # Adds a e-mail custom header
        # @var array of KalturaKeyValue
        self.customHeaders = customHeaders


    PROPERTY_LOADERS = {
        'url': getXmlNodeText, 
        'method': (KalturaEnumsFactory.createInt, "KalturaHttpNotificationMethod"), 
        'data': (KalturaObjectFactory.create, KalturaHttpNotificationData), 
        'timeout': getXmlNodeInt, 
        'connectTimeout': getXmlNodeInt, 
        'username': getXmlNodeText, 
        'password': getXmlNodeText, 
        'authenticationMethod': (KalturaEnumsFactory.createInt, "KalturaHttpNotificationAuthenticationMethod"), 
        'sslVersion': (KalturaEnumsFactory.createInt, "KalturaHttpNotificationSslVersion"), 
        'sslCertificate': getXmlNodeText, 
        'sslCertificateType': (KalturaEnumsFactory.createString, "KalturaHttpNotificationCertificateType"), 
        'sslCertificatePassword': getXmlNodeText, 
        'sslEngine': getXmlNodeText, 
        'sslEngineDefault': getXmlNodeText, 
        'sslKeyType': (KalturaEnumsFactory.createString, "KalturaHttpNotificationSslKeyType"), 
        'sslKey': getXmlNodeText, 
        'sslKeyPassword': getXmlNodeText, 
        'customHeaders': (KalturaObjectFactory.createArray, KalturaKeyValue), 
    }

    def fromXml(self, node):
        KalturaEventNotificationTemplate.fromXml(self, node)
        self.fromXmlImpl(node, KalturaHttpNotificationTemplate.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEventNotificationTemplate.toParams(self)
        kparams.put("objectType", "KalturaHttpNotificationTemplate")
        kparams.addStringIfDefined("url", self.url)
        kparams.addIntEnumIfDefined("method", self.method)
        kparams.addObjectIfDefined("data", self.data)
        kparams.addIntIfDefined("timeout", self.timeout)
        kparams.addIntIfDefined("connectTimeout", self.connectTimeout)
        kparams.addStringIfDefined("username", self.username)
        kparams.addStringIfDefined("password", self.password)
        kparams.addIntEnumIfDefined("authenticationMethod", self.authenticationMethod)
        kparams.addIntEnumIfDefined("sslVersion", self.sslVersion)
        kparams.addStringIfDefined("sslCertificate", self.sslCertificate)
        kparams.addStringEnumIfDefined("sslCertificateType", self.sslCertificateType)
        kparams.addStringIfDefined("sslCertificatePassword", self.sslCertificatePassword)
        kparams.addStringIfDefined("sslEngine", self.sslEngine)
        kparams.addStringIfDefined("sslEngineDefault", self.sslEngineDefault)
        kparams.addStringEnumIfDefined("sslKeyType", self.sslKeyType)
        kparams.addStringIfDefined("sslKey", self.sslKey)
        kparams.addStringIfDefined("sslKeyPassword", self.sslKeyPassword)
        kparams.addArrayIfDefined("customHeaders", self.customHeaders)
        return kparams

    def getUrl(self):
        return self.url

    def setUrl(self, newUrl):
        self.url = newUrl

    def getMethod(self):
        return self.method

    def setMethod(self, newMethod):
        self.method = newMethod

    def getData(self):
        return self.data

    def setData(self, newData):
        self.data = newData

    def getTimeout(self):
        return self.timeout

    def setTimeout(self, newTimeout):
        self.timeout = newTimeout

    def getConnectTimeout(self):
        return self.connectTimeout

    def setConnectTimeout(self, newConnectTimeout):
        self.connectTimeout = newConnectTimeout

    def getUsername(self):
        return self.username

    def setUsername(self, newUsername):
        self.username = newUsername

    def getPassword(self):
        return self.password

    def setPassword(self, newPassword):
        self.password = newPassword

    def getAuthenticationMethod(self):
        return self.authenticationMethod

    def setAuthenticationMethod(self, newAuthenticationMethod):
        self.authenticationMethod = newAuthenticationMethod

    def getSslVersion(self):
        return self.sslVersion

    def setSslVersion(self, newSslVersion):
        self.sslVersion = newSslVersion

    def getSslCertificate(self):
        return self.sslCertificate

    def setSslCertificate(self, newSslCertificate):
        self.sslCertificate = newSslCertificate

    def getSslCertificateType(self):
        return self.sslCertificateType

    def setSslCertificateType(self, newSslCertificateType):
        self.sslCertificateType = newSslCertificateType

    def getSslCertificatePassword(self):
        return self.sslCertificatePassword

    def setSslCertificatePassword(self, newSslCertificatePassword):
        self.sslCertificatePassword = newSslCertificatePassword

    def getSslEngine(self):
        return self.sslEngine

    def setSslEngine(self, newSslEngine):
        self.sslEngine = newSslEngine

    def getSslEngineDefault(self):
        return self.sslEngineDefault

    def setSslEngineDefault(self, newSslEngineDefault):
        self.sslEngineDefault = newSslEngineDefault

    def getSslKeyType(self):
        return self.sslKeyType

    def setSslKeyType(self, newSslKeyType):
        self.sslKeyType = newSslKeyType

    def getSslKey(self):
        return self.sslKey

    def setSslKey(self, newSslKey):
        self.sslKey = newSslKey

    def getSslKeyPassword(self):
        return self.sslKeyPassword

    def setSslKeyPassword(self, newSslKeyPassword):
        self.sslKeyPassword = newSslKeyPassword

    def getCustomHeaders(self):
        return self.customHeaders

    def setCustomHeaders(self, newCustomHeaders):
        self.customHeaders = newCustomHeaders


# @package Kaltura
# @subpackage Client
class KalturaHttpNotificationDispatchJobData(KalturaEventNotificationDispatchJobData):
    def __init__(self,
            templateId=NotImplemented,
            contentParameters=NotImplemented,
            url=NotImplemented,
            method=NotImplemented,
            data=NotImplemented,
            timeout=NotImplemented,
            connectTimeout=NotImplemented,
            username=NotImplemented,
            password=NotImplemented,
            authenticationMethod=NotImplemented,
            sslVersion=NotImplemented,
            sslCertificate=NotImplemented,
            sslCertificateType=NotImplemented,
            sslCertificatePassword=NotImplemented,
            sslEngine=NotImplemented,
            sslEngineDefault=NotImplemented,
            sslKeyType=NotImplemented,
            sslKey=NotImplemented,
            sslKeyPassword=NotImplemented,
            customHeaders=NotImplemented,
            signSecret=NotImplemented):
        KalturaEventNotificationDispatchJobData.__init__(self,
            templateId,
            contentParameters)

        # Remote server URL
        # @var string
        self.url = url

        # Request method.
        # @var KalturaHttpNotificationMethod
        self.method = method

        # Data to send.
        # @var string
        self.data = data

        # The maximum number of seconds to allow cURL functions to execute.
        # @var int
        self.timeout = timeout

        # The number of seconds to wait while trying to connect.
        # 	 Must be larger than zero.
        # @var int
        self.connectTimeout = connectTimeout

        # A username to use for the connection.
        # @var string
        self.username = username

        # A password to use for the connection.
        # @var string
        self.password = password

        # The HTTP authentication method to use.
        # @var KalturaHttpNotificationAuthenticationMethod
        self.authenticationMethod = authenticationMethod

        # The SSL version (2 or 3) to use.
        # 	 By default PHP will try to determine this itself, although in some cases this must be set manually.
        # @var KalturaHttpNotificationSslVersion
        self.sslVersion = sslVersion

        # SSL certificate to verify the peer with.
        # @var string
        self.sslCertificate = sslCertificate

        # The format of the certificate.
        # @var KalturaHttpNotificationCertificateType
        self.sslCertificateType = sslCertificateType

        # The password required to use the certificate.
        # @var string
        self.sslCertificatePassword = sslCertificatePassword

        # The identifier for the crypto engine of the private SSL key specified in ssl key.
        # @var string
        self.sslEngine = sslEngine

        # The identifier for the crypto engine used for asymmetric crypto operations.
        # @var string
        self.sslEngineDefault = sslEngineDefault

        # The key type of the private SSL key specified in ssl key - PEM / DER / ENG.
        # @var KalturaHttpNotificationSslKeyType
        self.sslKeyType = sslKeyType

        # Private SSL key.
        # @var string
        self.sslKey = sslKey

        # The secret password needed to use the private SSL key specified in ssl key.
        # @var string
        self.sslKeyPassword = sslKeyPassword

        # Adds a e-mail custom header
        # @var array of KalturaKeyValue
        self.customHeaders = customHeaders

        # The secret to sign the notification with
        # @var string
        self.signSecret = signSecret


    PROPERTY_LOADERS = {
        'url': getXmlNodeText, 
        'method': (KalturaEnumsFactory.createInt, "KalturaHttpNotificationMethod"), 
        'data': getXmlNodeText, 
        'timeout': getXmlNodeInt, 
        'connectTimeout': getXmlNodeInt, 
        'username': getXmlNodeText, 
        'password': getXmlNodeText, 
        'authenticationMethod': (KalturaEnumsFactory.createInt, "KalturaHttpNotificationAuthenticationMethod"), 
        'sslVersion': (KalturaEnumsFactory.createInt, "KalturaHttpNotificationSslVersion"), 
        'sslCertificate': getXmlNodeText, 
        'sslCertificateType': (KalturaEnumsFactory.createString, "KalturaHttpNotificationCertificateType"), 
        'sslCertificatePassword': getXmlNodeText, 
        'sslEngine': getXmlNodeText, 
        'sslEngineDefault': getXmlNodeText, 
        'sslKeyType': (KalturaEnumsFactory.createString, "KalturaHttpNotificationSslKeyType"), 
        'sslKey': getXmlNodeText, 
        'sslKeyPassword': getXmlNodeText, 
        'customHeaders': (KalturaObjectFactory.createArray, KalturaKeyValue), 
        'signSecret': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaEventNotificationDispatchJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaHttpNotificationDispatchJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEventNotificationDispatchJobData.toParams(self)
        kparams.put("objectType", "KalturaHttpNotificationDispatchJobData")
        kparams.addStringIfDefined("url", self.url)
        kparams.addIntEnumIfDefined("method", self.method)
        kparams.addStringIfDefined("data", self.data)
        kparams.addIntIfDefined("timeout", self.timeout)
        kparams.addIntIfDefined("connectTimeout", self.connectTimeout)
        kparams.addStringIfDefined("username", self.username)
        kparams.addStringIfDefined("password", self.password)
        kparams.addIntEnumIfDefined("authenticationMethod", self.authenticationMethod)
        kparams.addIntEnumIfDefined("sslVersion", self.sslVersion)
        kparams.addStringIfDefined("sslCertificate", self.sslCertificate)
        kparams.addStringEnumIfDefined("sslCertificateType", self.sslCertificateType)
        kparams.addStringIfDefined("sslCertificatePassword", self.sslCertificatePassword)
        kparams.addStringIfDefined("sslEngine", self.sslEngine)
        kparams.addStringIfDefined("sslEngineDefault", self.sslEngineDefault)
        kparams.addStringEnumIfDefined("sslKeyType", self.sslKeyType)
        kparams.addStringIfDefined("sslKey", self.sslKey)
        kparams.addStringIfDefined("sslKeyPassword", self.sslKeyPassword)
        kparams.addArrayIfDefined("customHeaders", self.customHeaders)
        kparams.addStringIfDefined("signSecret", self.signSecret)
        return kparams

    def getUrl(self):
        return self.url

    def setUrl(self, newUrl):
        self.url = newUrl

    def getMethod(self):
        return self.method

    def setMethod(self, newMethod):
        self.method = newMethod

    def getData(self):
        return self.data

    def setData(self, newData):
        self.data = newData

    def getTimeout(self):
        return self.timeout

    def setTimeout(self, newTimeout):
        self.timeout = newTimeout

    def getConnectTimeout(self):
        return self.connectTimeout

    def setConnectTimeout(self, newConnectTimeout):
        self.connectTimeout = newConnectTimeout

    def getUsername(self):
        return self.username

    def setUsername(self, newUsername):
        self.username = newUsername

    def getPassword(self):
        return self.password

    def setPassword(self, newPassword):
        self.password = newPassword

    def getAuthenticationMethod(self):
        return self.authenticationMethod

    def setAuthenticationMethod(self, newAuthenticationMethod):
        self.authenticationMethod = newAuthenticationMethod

    def getSslVersion(self):
        return self.sslVersion

    def setSslVersion(self, newSslVersion):
        self.sslVersion = newSslVersion

    def getSslCertificate(self):
        return self.sslCertificate

    def setSslCertificate(self, newSslCertificate):
        self.sslCertificate = newSslCertificate

    def getSslCertificateType(self):
        return self.sslCertificateType

    def setSslCertificateType(self, newSslCertificateType):
        self.sslCertificateType = newSslCertificateType

    def getSslCertificatePassword(self):
        return self.sslCertificatePassword

    def setSslCertificatePassword(self, newSslCertificatePassword):
        self.sslCertificatePassword = newSslCertificatePassword

    def getSslEngine(self):
        return self.sslEngine

    def setSslEngine(self, newSslEngine):
        self.sslEngine = newSslEngine

    def getSslEngineDefault(self):
        return self.sslEngineDefault

    def setSslEngineDefault(self, newSslEngineDefault):
        self.sslEngineDefault = newSslEngineDefault

    def getSslKeyType(self):
        return self.sslKeyType

    def setSslKeyType(self, newSslKeyType):
        self.sslKeyType = newSslKeyType

    def getSslKey(self):
        return self.sslKey

    def setSslKey(self, newSslKey):
        self.sslKey = newSslKey

    def getSslKeyPassword(self):
        return self.sslKeyPassword

    def setSslKeyPassword(self, newSslKeyPassword):
        self.sslKeyPassword = newSslKeyPassword

    def getCustomHeaders(self):
        return self.customHeaders

    def setCustomHeaders(self, newCustomHeaders):
        self.customHeaders = newCustomHeaders

    def getSignSecret(self):
        return self.signSecret

    def setSignSecret(self, newSignSecret):
        self.signSecret = newSignSecret


# @package Kaltura
# @subpackage Client
class KalturaHttpNotificationTemplateBaseFilter(KalturaEventNotificationTemplateFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaEventNotificationTemplateFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            systemNameEqual,
            systemNameIn,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaEventNotificationTemplateFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaHttpNotificationTemplateBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEventNotificationTemplateFilter.toParams(self)
        kparams.put("objectType", "KalturaHttpNotificationTemplateBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaHttpNotificationTemplateFilter(KalturaHttpNotificationTemplateBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaHttpNotificationTemplateBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            systemNameEqual,
            systemNameIn,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaHttpNotificationTemplateBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaHttpNotificationTemplateFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaHttpNotificationTemplateBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaHttpNotificationTemplateFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaHttpNotificationClientPlugin(KalturaClientPlugin):
    # KalturaHttpNotificationClientPlugin
    instance = None

    # @return KalturaHttpNotificationClientPlugin
    @staticmethod
    def get():
        if KalturaHttpNotificationClientPlugin.instance == None:
            KalturaHttpNotificationClientPlugin.instance = KalturaHttpNotificationClientPlugin()
        return KalturaHttpNotificationClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaHttpNotificationAuthenticationMethod': KalturaHttpNotificationAuthenticationMethod,
            'KalturaHttpNotificationMethod': KalturaHttpNotificationMethod,
            'KalturaHttpNotificationSslVersion': KalturaHttpNotificationSslVersion,
            'KalturaHttpNotificationCertificateType': KalturaHttpNotificationCertificateType,
            'KalturaHttpNotificationSslKeyType': KalturaHttpNotificationSslKeyType,
            'KalturaHttpNotificationTemplateOrderBy': KalturaHttpNotificationTemplateOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaHttpNotification': KalturaHttpNotification,
            'KalturaHttpNotificationData': KalturaHttpNotificationData,
            'KalturaHttpNotificationDataFields': KalturaHttpNotificationDataFields,
            'KalturaHttpNotificationDataText': KalturaHttpNotificationDataText,
            'KalturaHttpNotificationObjectData': KalturaHttpNotificationObjectData,
            'KalturaHttpNotificationTemplate': KalturaHttpNotificationTemplate,
            'KalturaHttpNotificationDispatchJobData': KalturaHttpNotificationDispatchJobData,
            'KalturaHttpNotificationTemplateBaseFilter': KalturaHttpNotificationTemplateBaseFilter,
            'KalturaHttpNotificationTemplateFilter': KalturaHttpNotificationTemplateFilter,
        }

    # @return string
    def getName(self):
        return 'httpNotification'

