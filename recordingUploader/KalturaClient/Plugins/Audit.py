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
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaAuditTrailChangeXmlNodeType(object):
    CHANGED = 1
    ADDED = 2
    REMOVED = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaAuditTrailContext(object):
    CLIENT = -1
    SCRIPT = 0
    PS2 = 1
    API_V3 = 2

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaAuditTrailFileSyncType(object):
    FILE = 1
    LINK = 2
    URL = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaAuditTrailStatus(object):
    PENDING = 1
    READY = 2
    FAILED = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaAuditTrailAction(object):
    CHANGED = "CHANGED"
    CONTENT_VIEWED = "CONTENT_VIEWED"
    COPIED = "COPIED"
    CREATED = "CREATED"
    DELETED = "DELETED"
    FILE_SYNC_CREATED = "FILE_SYNC_CREATED"
    RELATION_ADDED = "RELATION_ADDED"
    RELATION_REMOVED = "RELATION_REMOVED"
    VIEWED = "VIEWED"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaAuditTrailObjectType(object):
    BATCH_JOB = "BatchJob"
    EMAIL_INGESTION_PROFILE = "EmailIngestionProfile"
    FILE_SYNC = "FileSync"
    KSHOW_KUSER = "KshowKuser"
    METADATA = "Metadata"
    METADATA_PROFILE = "MetadataProfile"
    PARTNER = "Partner"
    PERMISSION = "Permission"
    UPLOAD_TOKEN = "UploadToken"
    USER_LOGIN_DATA = "UserLoginData"
    USER_ROLE = "UserRole"
    ACCESS_CONTROL = "accessControl"
    CATEGORY = "category"
    CONVERSION_PROFILE_2 = "conversionProfile2"
    ENTRY = "entry"
    FLAVOR_ASSET = "flavorAsset"
    FLAVOR_PARAMS = "flavorParams"
    FLAVOR_PARAMS_CONVERSION_PROFILE = "flavorParamsConversionProfile"
    FLAVOR_PARAMS_OUTPUT = "flavorParamsOutput"
    KSHOW = "kshow"
    KUSER = "kuser"
    MEDIA_INFO = "mediaInfo"
    MODERATION = "moderation"
    ROUGHCUT = "roughcutEntry"
    SYNDICATION = "syndicationFeed"
    THUMBNAIL_ASSET = "thumbAsset"
    THUMBNAIL_PARAMS = "thumbParams"
    THUMBNAIL_PARAMS_OUTPUT = "thumbParamsOutput"
    UI_CONF = "uiConf"
    WIDGET = "widget"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaAuditTrailOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    PARSED_AT_ASC = "+parsedAt"
    CREATED_AT_DESC = "-createdAt"
    PARSED_AT_DESC = "-parsedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaAuditTrailInfo(KalturaObjectBase):
    def __init__(self):
        KalturaObjectBase.__init__(self)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAuditTrailInfo.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaAuditTrailInfo")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaAuditTrail(KalturaObjectBase):
    def __init__(self,
            id=NotImplemented,
            createdAt=NotImplemented,
            parsedAt=NotImplemented,
            status=NotImplemented,
            auditObjectType=NotImplemented,
            objectId=NotImplemented,
            relatedObjectId=NotImplemented,
            relatedObjectType=NotImplemented,
            entryId=NotImplemented,
            masterPartnerId=NotImplemented,
            partnerId=NotImplemented,
            requestId=NotImplemented,
            userId=NotImplemented,
            action=NotImplemented,
            data=NotImplemented,
            ks=NotImplemented,
            context=NotImplemented,
            entryPoint=NotImplemented,
            serverName=NotImplemented,
            ipAddress=NotImplemented,
            userAgent=NotImplemented,
            clientTag=NotImplemented,
            description=NotImplemented,
            errorDescription=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var int
        # @readonly
        self.id = id

        # @var int
        # @readonly
        self.createdAt = createdAt

        # Indicates when the data was parsed
        # @var int
        # @readonly
        self.parsedAt = parsedAt

        # @var KalturaAuditTrailStatus
        # @readonly
        self.status = status

        # @var KalturaAuditTrailObjectType
        self.auditObjectType = auditObjectType

        # @var string
        self.objectId = objectId

        # @var string
        self.relatedObjectId = relatedObjectId

        # @var KalturaAuditTrailObjectType
        self.relatedObjectType = relatedObjectType

        # @var string
        self.entryId = entryId

        # @var int
        # @readonly
        self.masterPartnerId = masterPartnerId

        # @var int
        # @readonly
        self.partnerId = partnerId

        # @var string
        # @readonly
        self.requestId = requestId

        # @var string
        self.userId = userId

        # @var KalturaAuditTrailAction
        self.action = action

        # @var KalturaAuditTrailInfo
        self.data = data

        # @var string
        # @readonly
        self.ks = ks

        # @var KalturaAuditTrailContext
        # @readonly
        self.context = context

        # The API service and action that called and caused this audit
        # @var string
        # @readonly
        self.entryPoint = entryPoint

        # @var string
        # @readonly
        self.serverName = serverName

        # @var string
        # @readonly
        self.ipAddress = ipAddress

        # @var string
        # @readonly
        self.userAgent = userAgent

        # @var string
        self.clientTag = clientTag

        # @var string
        self.description = description

        # @var string
        # @readonly
        self.errorDescription = errorDescription


    PROPERTY_LOADERS = {
        'id': getXmlNodeInt, 
        'createdAt': getXmlNodeInt, 
        'parsedAt': getXmlNodeInt, 
        'status': (KalturaEnumsFactory.createInt, "KalturaAuditTrailStatus"), 
        'auditObjectType': (KalturaEnumsFactory.createString, "KalturaAuditTrailObjectType"), 
        'objectId': getXmlNodeText, 
        'relatedObjectId': getXmlNodeText, 
        'relatedObjectType': (KalturaEnumsFactory.createString, "KalturaAuditTrailObjectType"), 
        'entryId': getXmlNodeText, 
        'masterPartnerId': getXmlNodeInt, 
        'partnerId': getXmlNodeInt, 
        'requestId': getXmlNodeText, 
        'userId': getXmlNodeText, 
        'action': (KalturaEnumsFactory.createString, "KalturaAuditTrailAction"), 
        'data': (KalturaObjectFactory.create, KalturaAuditTrailInfo), 
        'ks': getXmlNodeText, 
        'context': (KalturaEnumsFactory.createInt, "KalturaAuditTrailContext"), 
        'entryPoint': getXmlNodeText, 
        'serverName': getXmlNodeText, 
        'ipAddress': getXmlNodeText, 
        'userAgent': getXmlNodeText, 
        'clientTag': getXmlNodeText, 
        'description': getXmlNodeText, 
        'errorDescription': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAuditTrail.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaAuditTrail")
        kparams.addStringEnumIfDefined("auditObjectType", self.auditObjectType)
        kparams.addStringIfDefined("objectId", self.objectId)
        kparams.addStringIfDefined("relatedObjectId", self.relatedObjectId)
        kparams.addStringEnumIfDefined("relatedObjectType", self.relatedObjectType)
        kparams.addStringIfDefined("entryId", self.entryId)
        kparams.addStringIfDefined("userId", self.userId)
        kparams.addStringEnumIfDefined("action", self.action)
        kparams.addObjectIfDefined("data", self.data)
        kparams.addStringIfDefined("clientTag", self.clientTag)
        kparams.addStringIfDefined("description", self.description)
        return kparams

    def getId(self):
        return self.id

    def getCreatedAt(self):
        return self.createdAt

    def getParsedAt(self):
        return self.parsedAt

    def getStatus(self):
        return self.status

    def getAuditObjectType(self):
        return self.auditObjectType

    def setAuditObjectType(self, newAuditObjectType):
        self.auditObjectType = newAuditObjectType

    def getObjectId(self):
        return self.objectId

    def setObjectId(self, newObjectId):
        self.objectId = newObjectId

    def getRelatedObjectId(self):
        return self.relatedObjectId

    def setRelatedObjectId(self, newRelatedObjectId):
        self.relatedObjectId = newRelatedObjectId

    def getRelatedObjectType(self):
        return self.relatedObjectType

    def setRelatedObjectType(self, newRelatedObjectType):
        self.relatedObjectType = newRelatedObjectType

    def getEntryId(self):
        return self.entryId

    def setEntryId(self, newEntryId):
        self.entryId = newEntryId

    def getMasterPartnerId(self):
        return self.masterPartnerId

    def getPartnerId(self):
        return self.partnerId

    def getRequestId(self):
        return self.requestId

    def getUserId(self):
        return self.userId

    def setUserId(self, newUserId):
        self.userId = newUserId

    def getAction(self):
        return self.action

    def setAction(self, newAction):
        self.action = newAction

    def getData(self):
        return self.data

    def setData(self, newData):
        self.data = newData

    def getKs(self):
        return self.ks

    def getContext(self):
        return self.context

    def getEntryPoint(self):
        return self.entryPoint

    def getServerName(self):
        return self.serverName

    def getIpAddress(self):
        return self.ipAddress

    def getUserAgent(self):
        return self.userAgent

    def getClientTag(self):
        return self.clientTag

    def setClientTag(self, newClientTag):
        self.clientTag = newClientTag

    def getDescription(self):
        return self.description

    def setDescription(self, newDescription):
        self.description = newDescription

    def getErrorDescription(self):
        return self.errorDescription


# @package Kaltura
# @subpackage Client
class KalturaAuditTrailChangeItem(KalturaObjectBase):
    def __init__(self,
            descriptor=NotImplemented,
            oldValue=NotImplemented,
            newValue=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var string
        self.descriptor = descriptor

        # @var string
        self.oldValue = oldValue

        # @var string
        self.newValue = newValue


    PROPERTY_LOADERS = {
        'descriptor': getXmlNodeText, 
        'oldValue': getXmlNodeText, 
        'newValue': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAuditTrailChangeItem.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaAuditTrailChangeItem")
        kparams.addStringIfDefined("descriptor", self.descriptor)
        kparams.addStringIfDefined("oldValue", self.oldValue)
        kparams.addStringIfDefined("newValue", self.newValue)
        return kparams

    def getDescriptor(self):
        return self.descriptor

    def setDescriptor(self, newDescriptor):
        self.descriptor = newDescriptor

    def getOldValue(self):
        return self.oldValue

    def setOldValue(self, newOldValue):
        self.oldValue = newOldValue

    def getNewValue(self):
        return self.newValue

    def setNewValue(self, newNewValue):
        self.newValue = newNewValue


# @package Kaltura
# @subpackage Client
class KalturaAuditTrailChangeInfo(KalturaAuditTrailInfo):
    def __init__(self,
            changedItems=NotImplemented):
        KalturaAuditTrailInfo.__init__(self)

        # @var array of KalturaAuditTrailChangeItem
        self.changedItems = changedItems


    PROPERTY_LOADERS = {
        'changedItems': (KalturaObjectFactory.createArray, KalturaAuditTrailChangeItem), 
    }

    def fromXml(self, node):
        KalturaAuditTrailInfo.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAuditTrailChangeInfo.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaAuditTrailInfo.toParams(self)
        kparams.put("objectType", "KalturaAuditTrailChangeInfo")
        kparams.addArrayIfDefined("changedItems", self.changedItems)
        return kparams

    def getChangedItems(self):
        return self.changedItems

    def setChangedItems(self, newChangedItems):
        self.changedItems = newChangedItems


# @package Kaltura
# @subpackage Client
class KalturaAuditTrailChangeXmlNode(KalturaAuditTrailChangeItem):
    def __init__(self,
            descriptor=NotImplemented,
            oldValue=NotImplemented,
            newValue=NotImplemented,
            type=NotImplemented):
        KalturaAuditTrailChangeItem.__init__(self,
            descriptor,
            oldValue,
            newValue)

        # @var KalturaAuditTrailChangeXmlNodeType
        self.type = type


    PROPERTY_LOADERS = {
        'type': (KalturaEnumsFactory.createInt, "KalturaAuditTrailChangeXmlNodeType"), 
    }

    def fromXml(self, node):
        KalturaAuditTrailChangeItem.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAuditTrailChangeXmlNode.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaAuditTrailChangeItem.toParams(self)
        kparams.put("objectType", "KalturaAuditTrailChangeXmlNode")
        kparams.addIntEnumIfDefined("type", self.type)
        return kparams

    def getType(self):
        return self.type

    def setType(self, newType):
        self.type = newType


# @package Kaltura
# @subpackage Client
class KalturaAuditTrailFileSyncCreateInfo(KalturaAuditTrailInfo):
    def __init__(self,
            version=NotImplemented,
            objectSubType=NotImplemented,
            dc=NotImplemented,
            original=NotImplemented,
            fileType=NotImplemented):
        KalturaAuditTrailInfo.__init__(self)

        # @var string
        self.version = version

        # @var int
        self.objectSubType = objectSubType

        # @var int
        self.dc = dc

        # @var bool
        self.original = original

        # @var KalturaAuditTrailFileSyncType
        self.fileType = fileType


    PROPERTY_LOADERS = {
        'version': getXmlNodeText, 
        'objectSubType': getXmlNodeInt, 
        'dc': getXmlNodeInt, 
        'original': getXmlNodeBool, 
        'fileType': (KalturaEnumsFactory.createInt, "KalturaAuditTrailFileSyncType"), 
    }

    def fromXml(self, node):
        KalturaAuditTrailInfo.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAuditTrailFileSyncCreateInfo.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaAuditTrailInfo.toParams(self)
        kparams.put("objectType", "KalturaAuditTrailFileSyncCreateInfo")
        kparams.addStringIfDefined("version", self.version)
        kparams.addIntIfDefined("objectSubType", self.objectSubType)
        kparams.addIntIfDefined("dc", self.dc)
        kparams.addBoolIfDefined("original", self.original)
        kparams.addIntEnumIfDefined("fileType", self.fileType)
        return kparams

    def getVersion(self):
        return self.version

    def setVersion(self, newVersion):
        self.version = newVersion

    def getObjectSubType(self):
        return self.objectSubType

    def setObjectSubType(self, newObjectSubType):
        self.objectSubType = newObjectSubType

    def getDc(self):
        return self.dc

    def setDc(self, newDc):
        self.dc = newDc

    def getOriginal(self):
        return self.original

    def setOriginal(self, newOriginal):
        self.original = newOriginal

    def getFileType(self):
        return self.fileType

    def setFileType(self, newFileType):
        self.fileType = newFileType


# @package Kaltura
# @subpackage Client
class KalturaAuditTrailListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaAuditTrail
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaAuditTrail), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAuditTrailListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaAuditTrailListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaAuditTrailTextInfo(KalturaAuditTrailInfo):
    def __init__(self,
            info=NotImplemented):
        KalturaAuditTrailInfo.__init__(self)

        # @var string
        self.info = info


    PROPERTY_LOADERS = {
        'info': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaAuditTrailInfo.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAuditTrailTextInfo.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaAuditTrailInfo.toParams(self)
        kparams.put("objectType", "KalturaAuditTrailTextInfo")
        kparams.addStringIfDefined("info", self.info)
        return kparams

    def getInfo(self):
        return self.info

    def setInfo(self, newInfo):
        self.info = newInfo


# @package Kaltura
# @subpackage Client
class KalturaAuditTrailBaseFilter(KalturaRelatedFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            parsedAtGreaterThanOrEqual=NotImplemented,
            parsedAtLessThanOrEqual=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            auditObjectTypeEqual=NotImplemented,
            auditObjectTypeIn=NotImplemented,
            objectIdEqual=NotImplemented,
            objectIdIn=NotImplemented,
            relatedObjectIdEqual=NotImplemented,
            relatedObjectIdIn=NotImplemented,
            relatedObjectTypeEqual=NotImplemented,
            relatedObjectTypeIn=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented,
            masterPartnerIdEqual=NotImplemented,
            masterPartnerIdIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            requestIdEqual=NotImplemented,
            requestIdIn=NotImplemented,
            userIdEqual=NotImplemented,
            userIdIn=NotImplemented,
            actionEqual=NotImplemented,
            actionIn=NotImplemented,
            ksEqual=NotImplemented,
            contextEqual=NotImplemented,
            contextIn=NotImplemented,
            entryPointEqual=NotImplemented,
            entryPointIn=NotImplemented,
            serverNameEqual=NotImplemented,
            serverNameIn=NotImplemented,
            ipAddressEqual=NotImplemented,
            ipAddressIn=NotImplemented,
            clientTagEqual=NotImplemented):
        KalturaRelatedFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var int
        self.idEqual = idEqual

        # @var int
        self.createdAtGreaterThanOrEqual = createdAtGreaterThanOrEqual

        # @var int
        self.createdAtLessThanOrEqual = createdAtLessThanOrEqual

        # @var int
        self.parsedAtGreaterThanOrEqual = parsedAtGreaterThanOrEqual

        # @var int
        self.parsedAtLessThanOrEqual = parsedAtLessThanOrEqual

        # @var KalturaAuditTrailStatus
        self.statusEqual = statusEqual

        # @var string
        self.statusIn = statusIn

        # @var KalturaAuditTrailObjectType
        self.auditObjectTypeEqual = auditObjectTypeEqual

        # @var string
        self.auditObjectTypeIn = auditObjectTypeIn

        # @var string
        self.objectIdEqual = objectIdEqual

        # @var string
        self.objectIdIn = objectIdIn

        # @var string
        self.relatedObjectIdEqual = relatedObjectIdEqual

        # @var string
        self.relatedObjectIdIn = relatedObjectIdIn

        # @var KalturaAuditTrailObjectType
        self.relatedObjectTypeEqual = relatedObjectTypeEqual

        # @var string
        self.relatedObjectTypeIn = relatedObjectTypeIn

        # @var string
        self.entryIdEqual = entryIdEqual

        # @var string
        self.entryIdIn = entryIdIn

        # @var int
        self.masterPartnerIdEqual = masterPartnerIdEqual

        # @var string
        self.masterPartnerIdIn = masterPartnerIdIn

        # @var int
        self.partnerIdEqual = partnerIdEqual

        # @var string
        self.partnerIdIn = partnerIdIn

        # @var string
        self.requestIdEqual = requestIdEqual

        # @var string
        self.requestIdIn = requestIdIn

        # @var string
        self.userIdEqual = userIdEqual

        # @var string
        self.userIdIn = userIdIn

        # @var KalturaAuditTrailAction
        self.actionEqual = actionEqual

        # @var string
        self.actionIn = actionIn

        # @var string
        self.ksEqual = ksEqual

        # @var KalturaAuditTrailContext
        self.contextEqual = contextEqual

        # @var string
        self.contextIn = contextIn

        # @var string
        self.entryPointEqual = entryPointEqual

        # @var string
        self.entryPointIn = entryPointIn

        # @var string
        self.serverNameEqual = serverNameEqual

        # @var string
        self.serverNameIn = serverNameIn

        # @var string
        self.ipAddressEqual = ipAddressEqual

        # @var string
        self.ipAddressIn = ipAddressIn

        # @var string
        self.clientTagEqual = clientTagEqual


    PROPERTY_LOADERS = {
        'idEqual': getXmlNodeInt, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'parsedAtGreaterThanOrEqual': getXmlNodeInt, 
        'parsedAtLessThanOrEqual': getXmlNodeInt, 
        'statusEqual': (KalturaEnumsFactory.createInt, "KalturaAuditTrailStatus"), 
        'statusIn': getXmlNodeText, 
        'auditObjectTypeEqual': (KalturaEnumsFactory.createString, "KalturaAuditTrailObjectType"), 
        'auditObjectTypeIn': getXmlNodeText, 
        'objectIdEqual': getXmlNodeText, 
        'objectIdIn': getXmlNodeText, 
        'relatedObjectIdEqual': getXmlNodeText, 
        'relatedObjectIdIn': getXmlNodeText, 
        'relatedObjectTypeEqual': (KalturaEnumsFactory.createString, "KalturaAuditTrailObjectType"), 
        'relatedObjectTypeIn': getXmlNodeText, 
        'entryIdEqual': getXmlNodeText, 
        'entryIdIn': getXmlNodeText, 
        'masterPartnerIdEqual': getXmlNodeInt, 
        'masterPartnerIdIn': getXmlNodeText, 
        'partnerIdEqual': getXmlNodeInt, 
        'partnerIdIn': getXmlNodeText, 
        'requestIdEqual': getXmlNodeText, 
        'requestIdIn': getXmlNodeText, 
        'userIdEqual': getXmlNodeText, 
        'userIdIn': getXmlNodeText, 
        'actionEqual': (KalturaEnumsFactory.createString, "KalturaAuditTrailAction"), 
        'actionIn': getXmlNodeText, 
        'ksEqual': getXmlNodeText, 
        'contextEqual': (KalturaEnumsFactory.createInt, "KalturaAuditTrailContext"), 
        'contextIn': getXmlNodeText, 
        'entryPointEqual': getXmlNodeText, 
        'entryPointIn': getXmlNodeText, 
        'serverNameEqual': getXmlNodeText, 
        'serverNameIn': getXmlNodeText, 
        'ipAddressEqual': getXmlNodeText, 
        'ipAddressIn': getXmlNodeText, 
        'clientTagEqual': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaRelatedFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAuditTrailBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaRelatedFilter.toParams(self)
        kparams.put("objectType", "KalturaAuditTrailBaseFilter")
        kparams.addIntIfDefined("idEqual", self.idEqual)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        kparams.addIntIfDefined("parsedAtGreaterThanOrEqual", self.parsedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("parsedAtLessThanOrEqual", self.parsedAtLessThanOrEqual)
        kparams.addIntEnumIfDefined("statusEqual", self.statusEqual)
        kparams.addStringIfDefined("statusIn", self.statusIn)
        kparams.addStringEnumIfDefined("auditObjectTypeEqual", self.auditObjectTypeEqual)
        kparams.addStringIfDefined("auditObjectTypeIn", self.auditObjectTypeIn)
        kparams.addStringIfDefined("objectIdEqual", self.objectIdEqual)
        kparams.addStringIfDefined("objectIdIn", self.objectIdIn)
        kparams.addStringIfDefined("relatedObjectIdEqual", self.relatedObjectIdEqual)
        kparams.addStringIfDefined("relatedObjectIdIn", self.relatedObjectIdIn)
        kparams.addStringEnumIfDefined("relatedObjectTypeEqual", self.relatedObjectTypeEqual)
        kparams.addStringIfDefined("relatedObjectTypeIn", self.relatedObjectTypeIn)
        kparams.addStringIfDefined("entryIdEqual", self.entryIdEqual)
        kparams.addStringIfDefined("entryIdIn", self.entryIdIn)
        kparams.addIntIfDefined("masterPartnerIdEqual", self.masterPartnerIdEqual)
        kparams.addStringIfDefined("masterPartnerIdIn", self.masterPartnerIdIn)
        kparams.addIntIfDefined("partnerIdEqual", self.partnerIdEqual)
        kparams.addStringIfDefined("partnerIdIn", self.partnerIdIn)
        kparams.addStringIfDefined("requestIdEqual", self.requestIdEqual)
        kparams.addStringIfDefined("requestIdIn", self.requestIdIn)
        kparams.addStringIfDefined("userIdEqual", self.userIdEqual)
        kparams.addStringIfDefined("userIdIn", self.userIdIn)
        kparams.addStringEnumIfDefined("actionEqual", self.actionEqual)
        kparams.addStringIfDefined("actionIn", self.actionIn)
        kparams.addStringIfDefined("ksEqual", self.ksEqual)
        kparams.addIntEnumIfDefined("contextEqual", self.contextEqual)
        kparams.addStringIfDefined("contextIn", self.contextIn)
        kparams.addStringIfDefined("entryPointEqual", self.entryPointEqual)
        kparams.addStringIfDefined("entryPointIn", self.entryPointIn)
        kparams.addStringIfDefined("serverNameEqual", self.serverNameEqual)
        kparams.addStringIfDefined("serverNameIn", self.serverNameIn)
        kparams.addStringIfDefined("ipAddressEqual", self.ipAddressEqual)
        kparams.addStringIfDefined("ipAddressIn", self.ipAddressIn)
        kparams.addStringIfDefined("clientTagEqual", self.clientTagEqual)
        return kparams

    def getIdEqual(self):
        return self.idEqual

    def setIdEqual(self, newIdEqual):
        self.idEqual = newIdEqual

    def getCreatedAtGreaterThanOrEqual(self):
        return self.createdAtGreaterThanOrEqual

    def setCreatedAtGreaterThanOrEqual(self, newCreatedAtGreaterThanOrEqual):
        self.createdAtGreaterThanOrEqual = newCreatedAtGreaterThanOrEqual

    def getCreatedAtLessThanOrEqual(self):
        return self.createdAtLessThanOrEqual

    def setCreatedAtLessThanOrEqual(self, newCreatedAtLessThanOrEqual):
        self.createdAtLessThanOrEqual = newCreatedAtLessThanOrEqual

    def getParsedAtGreaterThanOrEqual(self):
        return self.parsedAtGreaterThanOrEqual

    def setParsedAtGreaterThanOrEqual(self, newParsedAtGreaterThanOrEqual):
        self.parsedAtGreaterThanOrEqual = newParsedAtGreaterThanOrEqual

    def getParsedAtLessThanOrEqual(self):
        return self.parsedAtLessThanOrEqual

    def setParsedAtLessThanOrEqual(self, newParsedAtLessThanOrEqual):
        self.parsedAtLessThanOrEqual = newParsedAtLessThanOrEqual

    def getStatusEqual(self):
        return self.statusEqual

    def setStatusEqual(self, newStatusEqual):
        self.statusEqual = newStatusEqual

    def getStatusIn(self):
        return self.statusIn

    def setStatusIn(self, newStatusIn):
        self.statusIn = newStatusIn

    def getAuditObjectTypeEqual(self):
        return self.auditObjectTypeEqual

    def setAuditObjectTypeEqual(self, newAuditObjectTypeEqual):
        self.auditObjectTypeEqual = newAuditObjectTypeEqual

    def getAuditObjectTypeIn(self):
        return self.auditObjectTypeIn

    def setAuditObjectTypeIn(self, newAuditObjectTypeIn):
        self.auditObjectTypeIn = newAuditObjectTypeIn

    def getObjectIdEqual(self):
        return self.objectIdEqual

    def setObjectIdEqual(self, newObjectIdEqual):
        self.objectIdEqual = newObjectIdEqual

    def getObjectIdIn(self):
        return self.objectIdIn

    def setObjectIdIn(self, newObjectIdIn):
        self.objectIdIn = newObjectIdIn

    def getRelatedObjectIdEqual(self):
        return self.relatedObjectIdEqual

    def setRelatedObjectIdEqual(self, newRelatedObjectIdEqual):
        self.relatedObjectIdEqual = newRelatedObjectIdEqual

    def getRelatedObjectIdIn(self):
        return self.relatedObjectIdIn

    def setRelatedObjectIdIn(self, newRelatedObjectIdIn):
        self.relatedObjectIdIn = newRelatedObjectIdIn

    def getRelatedObjectTypeEqual(self):
        return self.relatedObjectTypeEqual

    def setRelatedObjectTypeEqual(self, newRelatedObjectTypeEqual):
        self.relatedObjectTypeEqual = newRelatedObjectTypeEqual

    def getRelatedObjectTypeIn(self):
        return self.relatedObjectTypeIn

    def setRelatedObjectTypeIn(self, newRelatedObjectTypeIn):
        self.relatedObjectTypeIn = newRelatedObjectTypeIn

    def getEntryIdEqual(self):
        return self.entryIdEqual

    def setEntryIdEqual(self, newEntryIdEqual):
        self.entryIdEqual = newEntryIdEqual

    def getEntryIdIn(self):
        return self.entryIdIn

    def setEntryIdIn(self, newEntryIdIn):
        self.entryIdIn = newEntryIdIn

    def getMasterPartnerIdEqual(self):
        return self.masterPartnerIdEqual

    def setMasterPartnerIdEqual(self, newMasterPartnerIdEqual):
        self.masterPartnerIdEqual = newMasterPartnerIdEqual

    def getMasterPartnerIdIn(self):
        return self.masterPartnerIdIn

    def setMasterPartnerIdIn(self, newMasterPartnerIdIn):
        self.masterPartnerIdIn = newMasterPartnerIdIn

    def getPartnerIdEqual(self):
        return self.partnerIdEqual

    def setPartnerIdEqual(self, newPartnerIdEqual):
        self.partnerIdEqual = newPartnerIdEqual

    def getPartnerIdIn(self):
        return self.partnerIdIn

    def setPartnerIdIn(self, newPartnerIdIn):
        self.partnerIdIn = newPartnerIdIn

    def getRequestIdEqual(self):
        return self.requestIdEqual

    def setRequestIdEqual(self, newRequestIdEqual):
        self.requestIdEqual = newRequestIdEqual

    def getRequestIdIn(self):
        return self.requestIdIn

    def setRequestIdIn(self, newRequestIdIn):
        self.requestIdIn = newRequestIdIn

    def getUserIdEqual(self):
        return self.userIdEqual

    def setUserIdEqual(self, newUserIdEqual):
        self.userIdEqual = newUserIdEqual

    def getUserIdIn(self):
        return self.userIdIn

    def setUserIdIn(self, newUserIdIn):
        self.userIdIn = newUserIdIn

    def getActionEqual(self):
        return self.actionEqual

    def setActionEqual(self, newActionEqual):
        self.actionEqual = newActionEqual

    def getActionIn(self):
        return self.actionIn

    def setActionIn(self, newActionIn):
        self.actionIn = newActionIn

    def getKsEqual(self):
        return self.ksEqual

    def setKsEqual(self, newKsEqual):
        self.ksEqual = newKsEqual

    def getContextEqual(self):
        return self.contextEqual

    def setContextEqual(self, newContextEqual):
        self.contextEqual = newContextEqual

    def getContextIn(self):
        return self.contextIn

    def setContextIn(self, newContextIn):
        self.contextIn = newContextIn

    def getEntryPointEqual(self):
        return self.entryPointEqual

    def setEntryPointEqual(self, newEntryPointEqual):
        self.entryPointEqual = newEntryPointEqual

    def getEntryPointIn(self):
        return self.entryPointIn

    def setEntryPointIn(self, newEntryPointIn):
        self.entryPointIn = newEntryPointIn

    def getServerNameEqual(self):
        return self.serverNameEqual

    def setServerNameEqual(self, newServerNameEqual):
        self.serverNameEqual = newServerNameEqual

    def getServerNameIn(self):
        return self.serverNameIn

    def setServerNameIn(self, newServerNameIn):
        self.serverNameIn = newServerNameIn

    def getIpAddressEqual(self):
        return self.ipAddressEqual

    def setIpAddressEqual(self, newIpAddressEqual):
        self.ipAddressEqual = newIpAddressEqual

    def getIpAddressIn(self):
        return self.ipAddressIn

    def setIpAddressIn(self, newIpAddressIn):
        self.ipAddressIn = newIpAddressIn

    def getClientTagEqual(self):
        return self.clientTagEqual

    def setClientTagEqual(self, newClientTagEqual):
        self.clientTagEqual = newClientTagEqual


# @package Kaltura
# @subpackage Client
class KalturaAuditTrailFilter(KalturaAuditTrailBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            parsedAtGreaterThanOrEqual=NotImplemented,
            parsedAtLessThanOrEqual=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            auditObjectTypeEqual=NotImplemented,
            auditObjectTypeIn=NotImplemented,
            objectIdEqual=NotImplemented,
            objectIdIn=NotImplemented,
            relatedObjectIdEqual=NotImplemented,
            relatedObjectIdIn=NotImplemented,
            relatedObjectTypeEqual=NotImplemented,
            relatedObjectTypeIn=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented,
            masterPartnerIdEqual=NotImplemented,
            masterPartnerIdIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            requestIdEqual=NotImplemented,
            requestIdIn=NotImplemented,
            userIdEqual=NotImplemented,
            userIdIn=NotImplemented,
            actionEqual=NotImplemented,
            actionIn=NotImplemented,
            ksEqual=NotImplemented,
            contextEqual=NotImplemented,
            contextIn=NotImplemented,
            entryPointEqual=NotImplemented,
            entryPointIn=NotImplemented,
            serverNameEqual=NotImplemented,
            serverNameIn=NotImplemented,
            ipAddressEqual=NotImplemented,
            ipAddressIn=NotImplemented,
            clientTagEqual=NotImplemented):
        KalturaAuditTrailBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            parsedAtGreaterThanOrEqual,
            parsedAtLessThanOrEqual,
            statusEqual,
            statusIn,
            auditObjectTypeEqual,
            auditObjectTypeIn,
            objectIdEqual,
            objectIdIn,
            relatedObjectIdEqual,
            relatedObjectIdIn,
            relatedObjectTypeEqual,
            relatedObjectTypeIn,
            entryIdEqual,
            entryIdIn,
            masterPartnerIdEqual,
            masterPartnerIdIn,
            partnerIdEqual,
            partnerIdIn,
            requestIdEqual,
            requestIdIn,
            userIdEqual,
            userIdIn,
            actionEqual,
            actionIn,
            ksEqual,
            contextEqual,
            contextIn,
            entryPointEqual,
            entryPointIn,
            serverNameEqual,
            serverNameIn,
            ipAddressEqual,
            ipAddressIn,
            clientTagEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaAuditTrailBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAuditTrailFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaAuditTrailBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaAuditTrailFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaAuditTrailService(KalturaServiceBase):
    """Audit Trail service"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, auditTrail):
        """Allows you to add an audit trail object and audit trail content associated with Kaltura object"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("auditTrail", auditTrail)
        self.client.queueServiceActionCall("audit_audittrail", "add", KalturaAuditTrail, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaAuditTrail)

    def get(self, id):
        """Retrieve an audit trail object by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("audit_audittrail", "get", KalturaAuditTrail, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaAuditTrail)

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List audit trail objects by filter and pager"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("audit_audittrail", "list", KalturaAuditTrailListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaAuditTrailListResponse)

########## main ##########
class KalturaAuditClientPlugin(KalturaClientPlugin):
    # KalturaAuditClientPlugin
    instance = None

    # @return KalturaAuditClientPlugin
    @staticmethod
    def get():
        if KalturaAuditClientPlugin.instance == None:
            KalturaAuditClientPlugin.instance = KalturaAuditClientPlugin()
        return KalturaAuditClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'auditTrail': KalturaAuditTrailService,
        }

    def getEnums(self):
        return {
            'KalturaAuditTrailChangeXmlNodeType': KalturaAuditTrailChangeXmlNodeType,
            'KalturaAuditTrailContext': KalturaAuditTrailContext,
            'KalturaAuditTrailFileSyncType': KalturaAuditTrailFileSyncType,
            'KalturaAuditTrailStatus': KalturaAuditTrailStatus,
            'KalturaAuditTrailAction': KalturaAuditTrailAction,
            'KalturaAuditTrailObjectType': KalturaAuditTrailObjectType,
            'KalturaAuditTrailOrderBy': KalturaAuditTrailOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaAuditTrailInfo': KalturaAuditTrailInfo,
            'KalturaAuditTrail': KalturaAuditTrail,
            'KalturaAuditTrailChangeItem': KalturaAuditTrailChangeItem,
            'KalturaAuditTrailChangeInfo': KalturaAuditTrailChangeInfo,
            'KalturaAuditTrailChangeXmlNode': KalturaAuditTrailChangeXmlNode,
            'KalturaAuditTrailFileSyncCreateInfo': KalturaAuditTrailFileSyncCreateInfo,
            'KalturaAuditTrailListResponse': KalturaAuditTrailListResponse,
            'KalturaAuditTrailTextInfo': KalturaAuditTrailTextInfo,
            'KalturaAuditTrailBaseFilter': KalturaAuditTrailBaseFilter,
            'KalturaAuditTrailFilter': KalturaAuditTrailFilter,
        }

    # @return string
    def getName(self):
        return 'audit'

