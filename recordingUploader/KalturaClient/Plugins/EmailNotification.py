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
class KalturaEmailNotificationTemplatePriority(object):
    HIGH = 1
    NORMAL = 3
    LOW = 5

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationFormat(object):
    HTML = "1"
    TEXT = "2"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationRecipientProviderType(object):
    STATIC_LIST = "1"
    CATEGORY = "2"
    USER = "3"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationTemplateOrderBy(object):
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
class KalturaEmailNotificationRecipient(KalturaObjectBase):
    def __init__(self,
            email=NotImplemented,
            name=NotImplemented):
        KalturaObjectBase.__init__(self)

        # Recipient e-mail address
        # @var KalturaStringValue
        self.email = email

        # Recipient name
        # @var KalturaStringValue
        self.name = name


    PROPERTY_LOADERS = {
        'email': (KalturaObjectFactory.create, KalturaStringValue), 
        'name': (KalturaObjectFactory.create, KalturaStringValue), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEmailNotificationRecipient.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaEmailNotificationRecipient")
        kparams.addObjectIfDefined("email", self.email)
        kparams.addObjectIfDefined("name", self.name)
        return kparams

    def getEmail(self):
        return self.email

    def setEmail(self, newEmail):
        self.email = newEmail

    def getName(self):
        return self.name

    def setName(self, newName):
        self.name = newName


# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationRecipientJobData(KalturaObjectBase):
    """Abstract class representing the final output recipients going into the batch mechanism"""

    def __init__(self,
            providerType=NotImplemented):
        KalturaObjectBase.__init__(self)

        # Provider type of the job data.
        # @var KalturaEmailNotificationRecipientProviderType
        # @readonly
        self.providerType = providerType


    PROPERTY_LOADERS = {
        'providerType': (KalturaEnumsFactory.createString, "KalturaEmailNotificationRecipientProviderType"), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEmailNotificationRecipientJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaEmailNotificationRecipientJobData")
        return kparams

    def getProviderType(self):
        return self.providerType


# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationRecipientProvider(KalturaObjectBase):
    """Abstract core class  which provides the recipients (to, CC, BCC) for an email notification"""

    def __init__(self):
        KalturaObjectBase.__init__(self)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEmailNotificationRecipientProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaEmailNotificationRecipientProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaCategoryUserProviderFilter(KalturaFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            userIdEqual=NotImplemented,
            userIdIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            updateMethodEqual=NotImplemented,
            updateMethodIn=NotImplemented,
            permissionNamesMatchAnd=NotImplemented,
            permissionNamesMatchOr=NotImplemented):
        KalturaFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var string
        self.userIdEqual = userIdEqual

        # @var string
        self.userIdIn = userIdIn

        # @var KalturaCategoryUserStatus
        self.statusEqual = statusEqual

        # @var string
        self.statusIn = statusIn

        # @var int
        self.createdAtGreaterThanOrEqual = createdAtGreaterThanOrEqual

        # @var int
        self.createdAtLessThanOrEqual = createdAtLessThanOrEqual

        # @var int
        self.updatedAtGreaterThanOrEqual = updatedAtGreaterThanOrEqual

        # @var int
        self.updatedAtLessThanOrEqual = updatedAtLessThanOrEqual

        # @var KalturaUpdateMethodType
        self.updateMethodEqual = updateMethodEqual

        # @var string
        self.updateMethodIn = updateMethodIn

        # @var string
        self.permissionNamesMatchAnd = permissionNamesMatchAnd

        # @var string
        self.permissionNamesMatchOr = permissionNamesMatchOr


    PROPERTY_LOADERS = {
        'userIdEqual': getXmlNodeText, 
        'userIdIn': getXmlNodeText, 
        'statusEqual': (KalturaEnumsFactory.createInt, "KalturaCategoryUserStatus"), 
        'statusIn': getXmlNodeText, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'updatedAtGreaterThanOrEqual': getXmlNodeInt, 
        'updatedAtLessThanOrEqual': getXmlNodeInt, 
        'updateMethodEqual': (KalturaEnumsFactory.createInt, "KalturaUpdateMethodType"), 
        'updateMethodIn': getXmlNodeText, 
        'permissionNamesMatchAnd': getXmlNodeText, 
        'permissionNamesMatchOr': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaCategoryUserProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFilter.toParams(self)
        kparams.put("objectType", "KalturaCategoryUserProviderFilter")
        kparams.addStringIfDefined("userIdEqual", self.userIdEqual)
        kparams.addStringIfDefined("userIdIn", self.userIdIn)
        kparams.addIntEnumIfDefined("statusEqual", self.statusEqual)
        kparams.addStringIfDefined("statusIn", self.statusIn)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        kparams.addIntIfDefined("updatedAtGreaterThanOrEqual", self.updatedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("updatedAtLessThanOrEqual", self.updatedAtLessThanOrEqual)
        kparams.addIntEnumIfDefined("updateMethodEqual", self.updateMethodEqual)
        kparams.addStringIfDefined("updateMethodIn", self.updateMethodIn)
        kparams.addStringIfDefined("permissionNamesMatchAnd", self.permissionNamesMatchAnd)
        kparams.addStringIfDefined("permissionNamesMatchOr", self.permissionNamesMatchOr)
        return kparams

    def getUserIdEqual(self):
        return self.userIdEqual

    def setUserIdEqual(self, newUserIdEqual):
        self.userIdEqual = newUserIdEqual

    def getUserIdIn(self):
        return self.userIdIn

    def setUserIdIn(self, newUserIdIn):
        self.userIdIn = newUserIdIn

    def getStatusEqual(self):
        return self.statusEqual

    def setStatusEqual(self, newStatusEqual):
        self.statusEqual = newStatusEqual

    def getStatusIn(self):
        return self.statusIn

    def setStatusIn(self, newStatusIn):
        self.statusIn = newStatusIn

    def getCreatedAtGreaterThanOrEqual(self):
        return self.createdAtGreaterThanOrEqual

    def setCreatedAtGreaterThanOrEqual(self, newCreatedAtGreaterThanOrEqual):
        self.createdAtGreaterThanOrEqual = newCreatedAtGreaterThanOrEqual

    def getCreatedAtLessThanOrEqual(self):
        return self.createdAtLessThanOrEqual

    def setCreatedAtLessThanOrEqual(self, newCreatedAtLessThanOrEqual):
        self.createdAtLessThanOrEqual = newCreatedAtLessThanOrEqual

    def getUpdatedAtGreaterThanOrEqual(self):
        return self.updatedAtGreaterThanOrEqual

    def setUpdatedAtGreaterThanOrEqual(self, newUpdatedAtGreaterThanOrEqual):
        self.updatedAtGreaterThanOrEqual = newUpdatedAtGreaterThanOrEqual

    def getUpdatedAtLessThanOrEqual(self):
        return self.updatedAtLessThanOrEqual

    def setUpdatedAtLessThanOrEqual(self, newUpdatedAtLessThanOrEqual):
        self.updatedAtLessThanOrEqual = newUpdatedAtLessThanOrEqual

    def getUpdateMethodEqual(self):
        return self.updateMethodEqual

    def setUpdateMethodEqual(self, newUpdateMethodEqual):
        self.updateMethodEqual = newUpdateMethodEqual

    def getUpdateMethodIn(self):
        return self.updateMethodIn

    def setUpdateMethodIn(self, newUpdateMethodIn):
        self.updateMethodIn = newUpdateMethodIn

    def getPermissionNamesMatchAnd(self):
        return self.permissionNamesMatchAnd

    def setPermissionNamesMatchAnd(self, newPermissionNamesMatchAnd):
        self.permissionNamesMatchAnd = newPermissionNamesMatchAnd

    def getPermissionNamesMatchOr(self):
        return self.permissionNamesMatchOr

    def setPermissionNamesMatchOr(self, newPermissionNamesMatchOr):
        self.permissionNamesMatchOr = newPermissionNamesMatchOr


# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationCategoryRecipientJobData(KalturaEmailNotificationRecipientJobData):
    """Job Data representing the provider of recipients for a single categoryId"""

    def __init__(self,
            providerType=NotImplemented,
            categoryUserFilter=NotImplemented):
        KalturaEmailNotificationRecipientJobData.__init__(self,
            providerType)

        # @var KalturaCategoryUserFilter
        self.categoryUserFilter = categoryUserFilter


    PROPERTY_LOADERS = {
        'categoryUserFilter': (KalturaObjectFactory.create, KalturaCategoryUserFilter), 
    }

    def fromXml(self, node):
        KalturaEmailNotificationRecipientJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEmailNotificationCategoryRecipientJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEmailNotificationRecipientJobData.toParams(self)
        kparams.put("objectType", "KalturaEmailNotificationCategoryRecipientJobData")
        kparams.addObjectIfDefined("categoryUserFilter", self.categoryUserFilter)
        return kparams

    def getCategoryUserFilter(self):
        return self.categoryUserFilter

    def setCategoryUserFilter(self, newCategoryUserFilter):
        self.categoryUserFilter = newCategoryUserFilter


# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationCategoryRecipientProvider(KalturaEmailNotificationRecipientProvider):
    """API object which provides the recipients of category related notifications."""

    def __init__(self,
            categoryId=NotImplemented,
            categoryUserFilter=NotImplemented):
        KalturaEmailNotificationRecipientProvider.__init__(self)

        # The ID of the category whose subscribers should receive the email notification.
        # @var KalturaStringValue
        self.categoryId = categoryId

        # @var KalturaCategoryUserProviderFilter
        self.categoryUserFilter = categoryUserFilter


    PROPERTY_LOADERS = {
        'categoryId': (KalturaObjectFactory.create, KalturaStringValue), 
        'categoryUserFilter': (KalturaObjectFactory.create, KalturaCategoryUserProviderFilter), 
    }

    def fromXml(self, node):
        KalturaEmailNotificationRecipientProvider.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEmailNotificationCategoryRecipientProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEmailNotificationRecipientProvider.toParams(self)
        kparams.put("objectType", "KalturaEmailNotificationCategoryRecipientProvider")
        kparams.addObjectIfDefined("categoryId", self.categoryId)
        kparams.addObjectIfDefined("categoryUserFilter", self.categoryUserFilter)
        return kparams

    def getCategoryId(self):
        return self.categoryId

    def setCategoryId(self, newCategoryId):
        self.categoryId = newCategoryId

    def getCategoryUserFilter(self):
        return self.categoryUserFilter

    def setCategoryUserFilter(self, newCategoryUserFilter):
        self.categoryUserFilter = newCategoryUserFilter


# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationParameter(KalturaEventNotificationParameter):
    def __init__(self,
            key=NotImplemented,
            description=NotImplemented,
            value=NotImplemented):
        KalturaEventNotificationParameter.__init__(self,
            key,
            description,
            value)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaEventNotificationParameter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEmailNotificationParameter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEventNotificationParameter.toParams(self)
        kparams.put("objectType", "KalturaEmailNotificationParameter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationStaticRecipientJobData(KalturaEmailNotificationRecipientJobData):
    """JobData representing the static receipient array"""

    def __init__(self,
            providerType=NotImplemented,
            emailRecipients=NotImplemented):
        KalturaEmailNotificationRecipientJobData.__init__(self,
            providerType)

        # Email to emails and names
        # @var array of KalturaKeyValue
        self.emailRecipients = emailRecipients


    PROPERTY_LOADERS = {
        'emailRecipients': (KalturaObjectFactory.createArray, KalturaKeyValue), 
    }

    def fromXml(self, node):
        KalturaEmailNotificationRecipientJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEmailNotificationStaticRecipientJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEmailNotificationRecipientJobData.toParams(self)
        kparams.put("objectType", "KalturaEmailNotificationStaticRecipientJobData")
        kparams.addArrayIfDefined("emailRecipients", self.emailRecipients)
        return kparams

    def getEmailRecipients(self):
        return self.emailRecipients

    def setEmailRecipients(self, newEmailRecipients):
        self.emailRecipients = newEmailRecipients


# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationStaticRecipientProvider(KalturaEmailNotificationRecipientProvider):
    """API class for recipient provider containing a static list of email recipients."""

    def __init__(self,
            emailRecipients=NotImplemented):
        KalturaEmailNotificationRecipientProvider.__init__(self)

        # Email to emails and names
        # @var array of KalturaEmailNotificationRecipient
        self.emailRecipients = emailRecipients


    PROPERTY_LOADERS = {
        'emailRecipients': (KalturaObjectFactory.createArray, KalturaEmailNotificationRecipient), 
    }

    def fromXml(self, node):
        KalturaEmailNotificationRecipientProvider.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEmailNotificationStaticRecipientProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEmailNotificationRecipientProvider.toParams(self)
        kparams.put("objectType", "KalturaEmailNotificationStaticRecipientProvider")
        kparams.addArrayIfDefined("emailRecipients", self.emailRecipients)
        return kparams

    def getEmailRecipients(self):
        return self.emailRecipients

    def setEmailRecipients(self, newEmailRecipients):
        self.emailRecipients = newEmailRecipients


# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationTemplate(KalturaEventNotificationTemplate):
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
            format=NotImplemented,
            subject=NotImplemented,
            body=NotImplemented,
            fromEmail=NotImplemented,
            fromName=NotImplemented,
            to=NotImplemented,
            cc=NotImplemented,
            bcc=NotImplemented,
            replyTo=NotImplemented,
            priority=NotImplemented,
            confirmReadingTo=NotImplemented,
            hostname=NotImplemented,
            messageID=NotImplemented,
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

        # Define the email body format
        # @var KalturaEmailNotificationFormat
        self.format = format

        # Define the email subject
        # @var string
        self.subject = subject

        # Define the email body content
        # @var string
        self.body = body

        # Define the email sender email
        # @var string
        self.fromEmail = fromEmail

        # Define the email sender name
        # @var string
        self.fromName = fromName

        # Email recipient emails and names
        # @var KalturaEmailNotificationRecipientProvider
        self.to = to

        # Email recipient emails and names
        # @var KalturaEmailNotificationRecipientProvider
        self.cc = cc

        # Email recipient emails and names
        # @var KalturaEmailNotificationRecipientProvider
        self.bcc = bcc

        # Default email addresses to whom the reply should be sent.
        # @var KalturaEmailNotificationRecipientProvider
        self.replyTo = replyTo

        # Define the email priority
        # @var KalturaEmailNotificationTemplatePriority
        self.priority = priority

        # Email address that a reading confirmation will be sent
        # @var string
        self.confirmReadingTo = confirmReadingTo

        # Hostname to use in Message-Id and Received headers and as default HELLO string. 
        # 	 If empty, the value returned by SERVER_NAME is used or 'localhost.localdomain'.
        # @var string
        self.hostname = hostname

        # Sets the message ID to be used in the Message-Id header.
        # 	 If empty, a unique id will be generated.
        # @var string
        self.messageID = messageID

        # Adds a e-mail custom header
        # @var array of KalturaKeyValue
        self.customHeaders = customHeaders


    PROPERTY_LOADERS = {
        'format': (KalturaEnumsFactory.createString, "KalturaEmailNotificationFormat"), 
        'subject': getXmlNodeText, 
        'body': getXmlNodeText, 
        'fromEmail': getXmlNodeText, 
        'fromName': getXmlNodeText, 
        'to': (KalturaObjectFactory.create, KalturaEmailNotificationRecipientProvider), 
        'cc': (KalturaObjectFactory.create, KalturaEmailNotificationRecipientProvider), 
        'bcc': (KalturaObjectFactory.create, KalturaEmailNotificationRecipientProvider), 
        'replyTo': (KalturaObjectFactory.create, KalturaEmailNotificationRecipientProvider), 
        'priority': (KalturaEnumsFactory.createInt, "KalturaEmailNotificationTemplatePriority"), 
        'confirmReadingTo': getXmlNodeText, 
        'hostname': getXmlNodeText, 
        'messageID': getXmlNodeText, 
        'customHeaders': (KalturaObjectFactory.createArray, KalturaKeyValue), 
    }

    def fromXml(self, node):
        KalturaEventNotificationTemplate.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEmailNotificationTemplate.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEventNotificationTemplate.toParams(self)
        kparams.put("objectType", "KalturaEmailNotificationTemplate")
        kparams.addStringEnumIfDefined("format", self.format)
        kparams.addStringIfDefined("subject", self.subject)
        kparams.addStringIfDefined("body", self.body)
        kparams.addStringIfDefined("fromEmail", self.fromEmail)
        kparams.addStringIfDefined("fromName", self.fromName)
        kparams.addObjectIfDefined("to", self.to)
        kparams.addObjectIfDefined("cc", self.cc)
        kparams.addObjectIfDefined("bcc", self.bcc)
        kparams.addObjectIfDefined("replyTo", self.replyTo)
        kparams.addIntEnumIfDefined("priority", self.priority)
        kparams.addStringIfDefined("confirmReadingTo", self.confirmReadingTo)
        kparams.addStringIfDefined("hostname", self.hostname)
        kparams.addStringIfDefined("messageID", self.messageID)
        kparams.addArrayIfDefined("customHeaders", self.customHeaders)
        return kparams

    def getFormat(self):
        return self.format

    def setFormat(self, newFormat):
        self.format = newFormat

    def getSubject(self):
        return self.subject

    def setSubject(self, newSubject):
        self.subject = newSubject

    def getBody(self):
        return self.body

    def setBody(self, newBody):
        self.body = newBody

    def getFromEmail(self):
        return self.fromEmail

    def setFromEmail(self, newFromEmail):
        self.fromEmail = newFromEmail

    def getFromName(self):
        return self.fromName

    def setFromName(self, newFromName):
        self.fromName = newFromName

    def getTo(self):
        return self.to

    def setTo(self, newTo):
        self.to = newTo

    def getCc(self):
        return self.cc

    def setCc(self, newCc):
        self.cc = newCc

    def getBcc(self):
        return self.bcc

    def setBcc(self, newBcc):
        self.bcc = newBcc

    def getReplyTo(self):
        return self.replyTo

    def setReplyTo(self, newReplyTo):
        self.replyTo = newReplyTo

    def getPriority(self):
        return self.priority

    def setPriority(self, newPriority):
        self.priority = newPriority

    def getConfirmReadingTo(self):
        return self.confirmReadingTo

    def setConfirmReadingTo(self, newConfirmReadingTo):
        self.confirmReadingTo = newConfirmReadingTo

    def getHostname(self):
        return self.hostname

    def setHostname(self, newHostname):
        self.hostname = newHostname

    def getMessageID(self):
        return self.messageID

    def setMessageID(self, newMessageID):
        self.messageID = newMessageID

    def getCustomHeaders(self):
        return self.customHeaders

    def setCustomHeaders(self, newCustomHeaders):
        self.customHeaders = newCustomHeaders


# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationUserRecipientJobData(KalturaEmailNotificationRecipientJobData):
    """JobData representing the dynamic user receipient array"""

    def __init__(self,
            providerType=NotImplemented,
            filter=NotImplemented):
        KalturaEmailNotificationRecipientJobData.__init__(self,
            providerType)

        # @var KalturaUserFilter
        self.filter = filter


    PROPERTY_LOADERS = {
        'filter': (KalturaObjectFactory.create, KalturaUserFilter), 
    }

    def fromXml(self, node):
        KalturaEmailNotificationRecipientJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEmailNotificationUserRecipientJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEmailNotificationRecipientJobData.toParams(self)
        kparams.put("objectType", "KalturaEmailNotificationUserRecipientJobData")
        kparams.addObjectIfDefined("filter", self.filter)
        return kparams

    def getFilter(self):
        return self.filter

    def setFilter(self, newFilter):
        self.filter = newFilter


# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationUserRecipientProvider(KalturaEmailNotificationRecipientProvider):
    """API class for recipient provider which constructs a dynamic list of recipients according to a user filter"""

    def __init__(self,
            filter=NotImplemented):
        KalturaEmailNotificationRecipientProvider.__init__(self)

        # @var KalturaUserFilter
        self.filter = filter


    PROPERTY_LOADERS = {
        'filter': (KalturaObjectFactory.create, KalturaUserFilter), 
    }

    def fromXml(self, node):
        KalturaEmailNotificationRecipientProvider.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEmailNotificationUserRecipientProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEmailNotificationRecipientProvider.toParams(self)
        kparams.put("objectType", "KalturaEmailNotificationUserRecipientProvider")
        kparams.addObjectIfDefined("filter", self.filter)
        return kparams

    def getFilter(self):
        return self.filter

    def setFilter(self, newFilter):
        self.filter = newFilter


# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationDispatchJobData(KalturaEventNotificationDispatchJobData):
    def __init__(self,
            templateId=NotImplemented,
            contentParameters=NotImplemented,
            fromEmail=NotImplemented,
            fromName=NotImplemented,
            to=NotImplemented,
            cc=NotImplemented,
            bcc=NotImplemented,
            replyTo=NotImplemented,
            priority=NotImplemented,
            confirmReadingTo=NotImplemented,
            hostname=NotImplemented,
            messageID=NotImplemented,
            customHeaders=NotImplemented):
        KalturaEventNotificationDispatchJobData.__init__(self,
            templateId,
            contentParameters)

        # Define the email sender email
        # @var string
        self.fromEmail = fromEmail

        # Define the email sender name
        # @var string
        self.fromName = fromName

        # Email recipient emails and names, key is mail address and value is the name
        # @var KalturaEmailNotificationRecipientJobData
        self.to = to

        # Email cc emails and names, key is mail address and value is the name
        # @var KalturaEmailNotificationRecipientJobData
        self.cc = cc

        # Email bcc emails and names, key is mail address and value is the name
        # @var KalturaEmailNotificationRecipientJobData
        self.bcc = bcc

        # Email addresses that a replies should be sent to, key is mail address and value is the name
        # @var KalturaEmailNotificationRecipientJobData
        self.replyTo = replyTo

        # Define the email priority
        # @var KalturaEmailNotificationTemplatePriority
        self.priority = priority

        # Email address that a reading confirmation will be sent to
        # @var string
        self.confirmReadingTo = confirmReadingTo

        # Hostname to use in Message-Id and Received headers and as default HELO string. 
        # 	 If empty, the value returned by SERVER_NAME is used or 'localhost.localdomain'.
        # @var string
        self.hostname = hostname

        # Sets the message ID to be used in the Message-Id header.
        # 	 If empty, a unique id will be generated.
        # @var string
        self.messageID = messageID

        # Adds a e-mail custom header
        # @var array of KalturaKeyValue
        self.customHeaders = customHeaders


    PROPERTY_LOADERS = {
        'fromEmail': getXmlNodeText, 
        'fromName': getXmlNodeText, 
        'to': (KalturaObjectFactory.create, KalturaEmailNotificationRecipientJobData), 
        'cc': (KalturaObjectFactory.create, KalturaEmailNotificationRecipientJobData), 
        'bcc': (KalturaObjectFactory.create, KalturaEmailNotificationRecipientJobData), 
        'replyTo': (KalturaObjectFactory.create, KalturaEmailNotificationRecipientJobData), 
        'priority': (KalturaEnumsFactory.createInt, "KalturaEmailNotificationTemplatePriority"), 
        'confirmReadingTo': getXmlNodeText, 
        'hostname': getXmlNodeText, 
        'messageID': getXmlNodeText, 
        'customHeaders': (KalturaObjectFactory.createArray, KalturaKeyValue), 
    }

    def fromXml(self, node):
        KalturaEventNotificationDispatchJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEmailNotificationDispatchJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEventNotificationDispatchJobData.toParams(self)
        kparams.put("objectType", "KalturaEmailNotificationDispatchJobData")
        kparams.addStringIfDefined("fromEmail", self.fromEmail)
        kparams.addStringIfDefined("fromName", self.fromName)
        kparams.addObjectIfDefined("to", self.to)
        kparams.addObjectIfDefined("cc", self.cc)
        kparams.addObjectIfDefined("bcc", self.bcc)
        kparams.addObjectIfDefined("replyTo", self.replyTo)
        kparams.addIntEnumIfDefined("priority", self.priority)
        kparams.addStringIfDefined("confirmReadingTo", self.confirmReadingTo)
        kparams.addStringIfDefined("hostname", self.hostname)
        kparams.addStringIfDefined("messageID", self.messageID)
        kparams.addArrayIfDefined("customHeaders", self.customHeaders)
        return kparams

    def getFromEmail(self):
        return self.fromEmail

    def setFromEmail(self, newFromEmail):
        self.fromEmail = newFromEmail

    def getFromName(self):
        return self.fromName

    def setFromName(self, newFromName):
        self.fromName = newFromName

    def getTo(self):
        return self.to

    def setTo(self, newTo):
        self.to = newTo

    def getCc(self):
        return self.cc

    def setCc(self, newCc):
        self.cc = newCc

    def getBcc(self):
        return self.bcc

    def setBcc(self, newBcc):
        self.bcc = newBcc

    def getReplyTo(self):
        return self.replyTo

    def setReplyTo(self, newReplyTo):
        self.replyTo = newReplyTo

    def getPriority(self):
        return self.priority

    def setPriority(self, newPriority):
        self.priority = newPriority

    def getConfirmReadingTo(self):
        return self.confirmReadingTo

    def setConfirmReadingTo(self, newConfirmReadingTo):
        self.confirmReadingTo = newConfirmReadingTo

    def getHostname(self):
        return self.hostname

    def setHostname(self, newHostname):
        self.hostname = newHostname

    def getMessageID(self):
        return self.messageID

    def setMessageID(self, newMessageID):
        self.messageID = newMessageID

    def getCustomHeaders(self):
        return self.customHeaders

    def setCustomHeaders(self, newCustomHeaders):
        self.customHeaders = newCustomHeaders


# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationTemplateBaseFilter(KalturaEventNotificationTemplateFilter):
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
        self.fromXmlImpl(node, KalturaEmailNotificationTemplateBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEventNotificationTemplateFilter.toParams(self)
        kparams.put("objectType", "KalturaEmailNotificationTemplateBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaEmailNotificationTemplateFilter(KalturaEmailNotificationTemplateBaseFilter):
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
        KalturaEmailNotificationTemplateBaseFilter.__init__(self,
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
        KalturaEmailNotificationTemplateBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEmailNotificationTemplateFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEmailNotificationTemplateBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaEmailNotificationTemplateFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaEmailNotificationClientPlugin(KalturaClientPlugin):
    # KalturaEmailNotificationClientPlugin
    instance = None

    # @return KalturaEmailNotificationClientPlugin
    @staticmethod
    def get():
        if KalturaEmailNotificationClientPlugin.instance == None:
            KalturaEmailNotificationClientPlugin.instance = KalturaEmailNotificationClientPlugin()
        return KalturaEmailNotificationClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaEmailNotificationTemplatePriority': KalturaEmailNotificationTemplatePriority,
            'KalturaEmailNotificationFormat': KalturaEmailNotificationFormat,
            'KalturaEmailNotificationRecipientProviderType': KalturaEmailNotificationRecipientProviderType,
            'KalturaEmailNotificationTemplateOrderBy': KalturaEmailNotificationTemplateOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaEmailNotificationRecipient': KalturaEmailNotificationRecipient,
            'KalturaEmailNotificationRecipientJobData': KalturaEmailNotificationRecipientJobData,
            'KalturaEmailNotificationRecipientProvider': KalturaEmailNotificationRecipientProvider,
            'KalturaCategoryUserProviderFilter': KalturaCategoryUserProviderFilter,
            'KalturaEmailNotificationCategoryRecipientJobData': KalturaEmailNotificationCategoryRecipientJobData,
            'KalturaEmailNotificationCategoryRecipientProvider': KalturaEmailNotificationCategoryRecipientProvider,
            'KalturaEmailNotificationParameter': KalturaEmailNotificationParameter,
            'KalturaEmailNotificationStaticRecipientJobData': KalturaEmailNotificationStaticRecipientJobData,
            'KalturaEmailNotificationStaticRecipientProvider': KalturaEmailNotificationStaticRecipientProvider,
            'KalturaEmailNotificationTemplate': KalturaEmailNotificationTemplate,
            'KalturaEmailNotificationUserRecipientJobData': KalturaEmailNotificationUserRecipientJobData,
            'KalturaEmailNotificationUserRecipientProvider': KalturaEmailNotificationUserRecipientProvider,
            'KalturaEmailNotificationDispatchJobData': KalturaEmailNotificationDispatchJobData,
            'KalturaEmailNotificationTemplateBaseFilter': KalturaEmailNotificationTemplateBaseFilter,
            'KalturaEmailNotificationTemplateFilter': KalturaEmailNotificationTemplateFilter,
        }

    # @return string
    def getName(self):
        return 'emailNotification'

