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
class KalturaFileSyncStatus(object):
    ERROR = -1
    PENDING = 1
    READY = 2
    DELETED = 3
    PURGED = 4

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaFileSyncType(object):
    FILE = 1
    LINK = 2
    URL = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaFileSyncOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    FILE_SIZE_ASC = "+fileSize"
    READY_AT_ASC = "+readyAt"
    SYNC_TIME_ASC = "+syncTime"
    UPDATED_AT_ASC = "+updatedAt"
    VERSION_ASC = "+version"
    CREATED_AT_DESC = "-createdAt"
    FILE_SIZE_DESC = "-fileSize"
    READY_AT_DESC = "-readyAt"
    SYNC_TIME_DESC = "-syncTime"
    UPDATED_AT_DESC = "-updatedAt"
    VERSION_DESC = "-version"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaFileSync(KalturaObjectBase):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            fileObjectType=NotImplemented,
            objectId=NotImplemented,
            version=NotImplemented,
            objectSubType=NotImplemented,
            dc=NotImplemented,
            original=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            readyAt=NotImplemented,
            syncTime=NotImplemented,
            status=NotImplemented,
            fileType=NotImplemented,
            linkedId=NotImplemented,
            linkCount=NotImplemented,
            fileRoot=NotImplemented,
            filePath=NotImplemented,
            fileSize=NotImplemented,
            fileUrl=NotImplemented,
            fileContent=NotImplemented,
            fileDiscSize=NotImplemented,
            isCurrentDc=NotImplemented,
            isDir=NotImplemented,
            originalId=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var int
        # @readonly
        self.id = id

        # @var int
        # @readonly
        self.partnerId = partnerId

        # @var KalturaFileSyncObjectType
        # @readonly
        self.fileObjectType = fileObjectType

        # @var string
        # @readonly
        self.objectId = objectId

        # @var string
        # @readonly
        self.version = version

        # @var int
        # @readonly
        self.objectSubType = objectSubType

        # @var string
        # @readonly
        self.dc = dc

        # @var int
        # @readonly
        self.original = original

        # @var int
        # @readonly
        self.createdAt = createdAt

        # @var int
        # @readonly
        self.updatedAt = updatedAt

        # @var int
        # @readonly
        self.readyAt = readyAt

        # @var int
        # @readonly
        self.syncTime = syncTime

        # @var KalturaFileSyncStatus
        self.status = status

        # @var KalturaFileSyncType
        # @readonly
        self.fileType = fileType

        # @var int
        # @readonly
        self.linkedId = linkedId

        # @var int
        # @readonly
        self.linkCount = linkCount

        # @var string
        self.fileRoot = fileRoot

        # @var string
        self.filePath = filePath

        # @var float
        # @readonly
        self.fileSize = fileSize

        # @var string
        # @readonly
        self.fileUrl = fileUrl

        # @var string
        # @readonly
        self.fileContent = fileContent

        # @var float
        # @readonly
        self.fileDiscSize = fileDiscSize

        # @var bool
        # @readonly
        self.isCurrentDc = isCurrentDc

        # @var bool
        # @readonly
        self.isDir = isDir

        # @var int
        # @readonly
        self.originalId = originalId


    PROPERTY_LOADERS = {
        'id': getXmlNodeInt, 
        'partnerId': getXmlNodeInt, 
        'fileObjectType': (KalturaEnumsFactory.createString, "KalturaFileSyncObjectType"), 
        'objectId': getXmlNodeText, 
        'version': getXmlNodeText, 
        'objectSubType': getXmlNodeInt, 
        'dc': getXmlNodeText, 
        'original': getXmlNodeInt, 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
        'readyAt': getXmlNodeInt, 
        'syncTime': getXmlNodeInt, 
        'status': (KalturaEnumsFactory.createInt, "KalturaFileSyncStatus"), 
        'fileType': (KalturaEnumsFactory.createInt, "KalturaFileSyncType"), 
        'linkedId': getXmlNodeInt, 
        'linkCount': getXmlNodeInt, 
        'fileRoot': getXmlNodeText, 
        'filePath': getXmlNodeText, 
        'fileSize': getXmlNodeFloat, 
        'fileUrl': getXmlNodeText, 
        'fileContent': getXmlNodeText, 
        'fileDiscSize': getXmlNodeFloat, 
        'isCurrentDc': getXmlNodeBool, 
        'isDir': getXmlNodeBool, 
        'originalId': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFileSync.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaFileSync")
        kparams.addIntEnumIfDefined("status", self.status)
        kparams.addStringIfDefined("fileRoot", self.fileRoot)
        kparams.addStringIfDefined("filePath", self.filePath)
        return kparams

    def getId(self):
        return self.id

    def getPartnerId(self):
        return self.partnerId

    def getFileObjectType(self):
        return self.fileObjectType

    def getObjectId(self):
        return self.objectId

    def getVersion(self):
        return self.version

    def getObjectSubType(self):
        return self.objectSubType

    def getDc(self):
        return self.dc

    def getOriginal(self):
        return self.original

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt

    def getReadyAt(self):
        return self.readyAt

    def getSyncTime(self):
        return self.syncTime

    def getStatus(self):
        return self.status

    def setStatus(self, newStatus):
        self.status = newStatus

    def getFileType(self):
        return self.fileType

    def getLinkedId(self):
        return self.linkedId

    def getLinkCount(self):
        return self.linkCount

    def getFileRoot(self):
        return self.fileRoot

    def setFileRoot(self, newFileRoot):
        self.fileRoot = newFileRoot

    def getFilePath(self):
        return self.filePath

    def setFilePath(self, newFilePath):
        self.filePath = newFilePath

    def getFileSize(self):
        return self.fileSize

    def getFileUrl(self):
        return self.fileUrl

    def getFileContent(self):
        return self.fileContent

    def getFileDiscSize(self):
        return self.fileDiscSize

    def getIsCurrentDc(self):
        return self.isCurrentDc

    def getIsDir(self):
        return self.isDir

    def getOriginalId(self):
        return self.originalId


# @package Kaltura
# @subpackage Client
class KalturaFileSyncBaseFilter(KalturaFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            partnerIdEqual=NotImplemented,
            fileObjectTypeEqual=NotImplemented,
            fileObjectTypeIn=NotImplemented,
            objectIdEqual=NotImplemented,
            objectIdIn=NotImplemented,
            versionEqual=NotImplemented,
            versionIn=NotImplemented,
            objectSubTypeEqual=NotImplemented,
            objectSubTypeIn=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            originalEqual=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            readyAtGreaterThanOrEqual=NotImplemented,
            readyAtLessThanOrEqual=NotImplemented,
            syncTimeGreaterThanOrEqual=NotImplemented,
            syncTimeLessThanOrEqual=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            fileTypeEqual=NotImplemented,
            fileTypeIn=NotImplemented,
            linkedIdEqual=NotImplemented,
            linkCountGreaterThanOrEqual=NotImplemented,
            linkCountLessThanOrEqual=NotImplemented,
            fileSizeGreaterThanOrEqual=NotImplemented,
            fileSizeLessThanOrEqual=NotImplemented):
        KalturaFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var int
        self.partnerIdEqual = partnerIdEqual

        # @var KalturaFileSyncObjectType
        self.fileObjectTypeEqual = fileObjectTypeEqual

        # @var string
        self.fileObjectTypeIn = fileObjectTypeIn

        # @var string
        self.objectIdEqual = objectIdEqual

        # @var string
        self.objectIdIn = objectIdIn

        # @var string
        self.versionEqual = versionEqual

        # @var string
        self.versionIn = versionIn

        # @var int
        self.objectSubTypeEqual = objectSubTypeEqual

        # @var string
        self.objectSubTypeIn = objectSubTypeIn

        # @var string
        self.dcEqual = dcEqual

        # @var string
        self.dcIn = dcIn

        # @var int
        self.originalEqual = originalEqual

        # @var int
        self.createdAtGreaterThanOrEqual = createdAtGreaterThanOrEqual

        # @var int
        self.createdAtLessThanOrEqual = createdAtLessThanOrEqual

        # @var int
        self.updatedAtGreaterThanOrEqual = updatedAtGreaterThanOrEqual

        # @var int
        self.updatedAtLessThanOrEqual = updatedAtLessThanOrEqual

        # @var int
        self.readyAtGreaterThanOrEqual = readyAtGreaterThanOrEqual

        # @var int
        self.readyAtLessThanOrEqual = readyAtLessThanOrEqual

        # @var int
        self.syncTimeGreaterThanOrEqual = syncTimeGreaterThanOrEqual

        # @var int
        self.syncTimeLessThanOrEqual = syncTimeLessThanOrEqual

        # @var KalturaFileSyncStatus
        self.statusEqual = statusEqual

        # @var string
        self.statusIn = statusIn

        # @var KalturaFileSyncType
        self.fileTypeEqual = fileTypeEqual

        # @var string
        self.fileTypeIn = fileTypeIn

        # @var int
        self.linkedIdEqual = linkedIdEqual

        # @var int
        self.linkCountGreaterThanOrEqual = linkCountGreaterThanOrEqual

        # @var int
        self.linkCountLessThanOrEqual = linkCountLessThanOrEqual

        # @var float
        self.fileSizeGreaterThanOrEqual = fileSizeGreaterThanOrEqual

        # @var float
        self.fileSizeLessThanOrEqual = fileSizeLessThanOrEqual


    PROPERTY_LOADERS = {
        'partnerIdEqual': getXmlNodeInt, 
        'fileObjectTypeEqual': (KalturaEnumsFactory.createString, "KalturaFileSyncObjectType"), 
        'fileObjectTypeIn': getXmlNodeText, 
        'objectIdEqual': getXmlNodeText, 
        'objectIdIn': getXmlNodeText, 
        'versionEqual': getXmlNodeText, 
        'versionIn': getXmlNodeText, 
        'objectSubTypeEqual': getXmlNodeInt, 
        'objectSubTypeIn': getXmlNodeText, 
        'dcEqual': getXmlNodeText, 
        'dcIn': getXmlNodeText, 
        'originalEqual': getXmlNodeInt, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'updatedAtGreaterThanOrEqual': getXmlNodeInt, 
        'updatedAtLessThanOrEqual': getXmlNodeInt, 
        'readyAtGreaterThanOrEqual': getXmlNodeInt, 
        'readyAtLessThanOrEqual': getXmlNodeInt, 
        'syncTimeGreaterThanOrEqual': getXmlNodeInt, 
        'syncTimeLessThanOrEqual': getXmlNodeInt, 
        'statusEqual': (KalturaEnumsFactory.createInt, "KalturaFileSyncStatus"), 
        'statusIn': getXmlNodeText, 
        'fileTypeEqual': (KalturaEnumsFactory.createInt, "KalturaFileSyncType"), 
        'fileTypeIn': getXmlNodeText, 
        'linkedIdEqual': getXmlNodeInt, 
        'linkCountGreaterThanOrEqual': getXmlNodeInt, 
        'linkCountLessThanOrEqual': getXmlNodeInt, 
        'fileSizeGreaterThanOrEqual': getXmlNodeFloat, 
        'fileSizeLessThanOrEqual': getXmlNodeFloat, 
    }

    def fromXml(self, node):
        KalturaFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFileSyncBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFilter.toParams(self)
        kparams.put("objectType", "KalturaFileSyncBaseFilter")
        kparams.addIntIfDefined("partnerIdEqual", self.partnerIdEqual)
        kparams.addStringEnumIfDefined("fileObjectTypeEqual", self.fileObjectTypeEqual)
        kparams.addStringIfDefined("fileObjectTypeIn", self.fileObjectTypeIn)
        kparams.addStringIfDefined("objectIdEqual", self.objectIdEqual)
        kparams.addStringIfDefined("objectIdIn", self.objectIdIn)
        kparams.addStringIfDefined("versionEqual", self.versionEqual)
        kparams.addStringIfDefined("versionIn", self.versionIn)
        kparams.addIntIfDefined("objectSubTypeEqual", self.objectSubTypeEqual)
        kparams.addStringIfDefined("objectSubTypeIn", self.objectSubTypeIn)
        kparams.addStringIfDefined("dcEqual", self.dcEqual)
        kparams.addStringIfDefined("dcIn", self.dcIn)
        kparams.addIntIfDefined("originalEqual", self.originalEqual)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        kparams.addIntIfDefined("updatedAtGreaterThanOrEqual", self.updatedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("updatedAtLessThanOrEqual", self.updatedAtLessThanOrEqual)
        kparams.addIntIfDefined("readyAtGreaterThanOrEqual", self.readyAtGreaterThanOrEqual)
        kparams.addIntIfDefined("readyAtLessThanOrEqual", self.readyAtLessThanOrEqual)
        kparams.addIntIfDefined("syncTimeGreaterThanOrEqual", self.syncTimeGreaterThanOrEqual)
        kparams.addIntIfDefined("syncTimeLessThanOrEqual", self.syncTimeLessThanOrEqual)
        kparams.addIntEnumIfDefined("statusEqual", self.statusEqual)
        kparams.addStringIfDefined("statusIn", self.statusIn)
        kparams.addIntEnumIfDefined("fileTypeEqual", self.fileTypeEqual)
        kparams.addStringIfDefined("fileTypeIn", self.fileTypeIn)
        kparams.addIntIfDefined("linkedIdEqual", self.linkedIdEqual)
        kparams.addIntIfDefined("linkCountGreaterThanOrEqual", self.linkCountGreaterThanOrEqual)
        kparams.addIntIfDefined("linkCountLessThanOrEqual", self.linkCountLessThanOrEqual)
        kparams.addFloatIfDefined("fileSizeGreaterThanOrEqual", self.fileSizeGreaterThanOrEqual)
        kparams.addFloatIfDefined("fileSizeLessThanOrEqual", self.fileSizeLessThanOrEqual)
        return kparams

    def getPartnerIdEqual(self):
        return self.partnerIdEqual

    def setPartnerIdEqual(self, newPartnerIdEqual):
        self.partnerIdEqual = newPartnerIdEqual

    def getFileObjectTypeEqual(self):
        return self.fileObjectTypeEqual

    def setFileObjectTypeEqual(self, newFileObjectTypeEqual):
        self.fileObjectTypeEqual = newFileObjectTypeEqual

    def getFileObjectTypeIn(self):
        return self.fileObjectTypeIn

    def setFileObjectTypeIn(self, newFileObjectTypeIn):
        self.fileObjectTypeIn = newFileObjectTypeIn

    def getObjectIdEqual(self):
        return self.objectIdEqual

    def setObjectIdEqual(self, newObjectIdEqual):
        self.objectIdEqual = newObjectIdEqual

    def getObjectIdIn(self):
        return self.objectIdIn

    def setObjectIdIn(self, newObjectIdIn):
        self.objectIdIn = newObjectIdIn

    def getVersionEqual(self):
        return self.versionEqual

    def setVersionEqual(self, newVersionEqual):
        self.versionEqual = newVersionEqual

    def getVersionIn(self):
        return self.versionIn

    def setVersionIn(self, newVersionIn):
        self.versionIn = newVersionIn

    def getObjectSubTypeEqual(self):
        return self.objectSubTypeEqual

    def setObjectSubTypeEqual(self, newObjectSubTypeEqual):
        self.objectSubTypeEqual = newObjectSubTypeEqual

    def getObjectSubTypeIn(self):
        return self.objectSubTypeIn

    def setObjectSubTypeIn(self, newObjectSubTypeIn):
        self.objectSubTypeIn = newObjectSubTypeIn

    def getDcEqual(self):
        return self.dcEqual

    def setDcEqual(self, newDcEqual):
        self.dcEqual = newDcEqual

    def getDcIn(self):
        return self.dcIn

    def setDcIn(self, newDcIn):
        self.dcIn = newDcIn

    def getOriginalEqual(self):
        return self.originalEqual

    def setOriginalEqual(self, newOriginalEqual):
        self.originalEqual = newOriginalEqual

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

    def getReadyAtGreaterThanOrEqual(self):
        return self.readyAtGreaterThanOrEqual

    def setReadyAtGreaterThanOrEqual(self, newReadyAtGreaterThanOrEqual):
        self.readyAtGreaterThanOrEqual = newReadyAtGreaterThanOrEqual

    def getReadyAtLessThanOrEqual(self):
        return self.readyAtLessThanOrEqual

    def setReadyAtLessThanOrEqual(self, newReadyAtLessThanOrEqual):
        self.readyAtLessThanOrEqual = newReadyAtLessThanOrEqual

    def getSyncTimeGreaterThanOrEqual(self):
        return self.syncTimeGreaterThanOrEqual

    def setSyncTimeGreaterThanOrEqual(self, newSyncTimeGreaterThanOrEqual):
        self.syncTimeGreaterThanOrEqual = newSyncTimeGreaterThanOrEqual

    def getSyncTimeLessThanOrEqual(self):
        return self.syncTimeLessThanOrEqual

    def setSyncTimeLessThanOrEqual(self, newSyncTimeLessThanOrEqual):
        self.syncTimeLessThanOrEqual = newSyncTimeLessThanOrEqual

    def getStatusEqual(self):
        return self.statusEqual

    def setStatusEqual(self, newStatusEqual):
        self.statusEqual = newStatusEqual

    def getStatusIn(self):
        return self.statusIn

    def setStatusIn(self, newStatusIn):
        self.statusIn = newStatusIn

    def getFileTypeEqual(self):
        return self.fileTypeEqual

    def setFileTypeEqual(self, newFileTypeEqual):
        self.fileTypeEqual = newFileTypeEqual

    def getFileTypeIn(self):
        return self.fileTypeIn

    def setFileTypeIn(self, newFileTypeIn):
        self.fileTypeIn = newFileTypeIn

    def getLinkedIdEqual(self):
        return self.linkedIdEqual

    def setLinkedIdEqual(self, newLinkedIdEqual):
        self.linkedIdEqual = newLinkedIdEqual

    def getLinkCountGreaterThanOrEqual(self):
        return self.linkCountGreaterThanOrEqual

    def setLinkCountGreaterThanOrEqual(self, newLinkCountGreaterThanOrEqual):
        self.linkCountGreaterThanOrEqual = newLinkCountGreaterThanOrEqual

    def getLinkCountLessThanOrEqual(self):
        return self.linkCountLessThanOrEqual

    def setLinkCountLessThanOrEqual(self, newLinkCountLessThanOrEqual):
        self.linkCountLessThanOrEqual = newLinkCountLessThanOrEqual

    def getFileSizeGreaterThanOrEqual(self):
        return self.fileSizeGreaterThanOrEqual

    def setFileSizeGreaterThanOrEqual(self, newFileSizeGreaterThanOrEqual):
        self.fileSizeGreaterThanOrEqual = newFileSizeGreaterThanOrEqual

    def getFileSizeLessThanOrEqual(self):
        return self.fileSizeLessThanOrEqual

    def setFileSizeLessThanOrEqual(self, newFileSizeLessThanOrEqual):
        self.fileSizeLessThanOrEqual = newFileSizeLessThanOrEqual


# @package Kaltura
# @subpackage Client
class KalturaFileSyncListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaFileSync
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaFileSync), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFileSyncListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaFileSyncListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaFileSyncFilter(KalturaFileSyncBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            partnerIdEqual=NotImplemented,
            fileObjectTypeEqual=NotImplemented,
            fileObjectTypeIn=NotImplemented,
            objectIdEqual=NotImplemented,
            objectIdIn=NotImplemented,
            versionEqual=NotImplemented,
            versionIn=NotImplemented,
            objectSubTypeEqual=NotImplemented,
            objectSubTypeIn=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            originalEqual=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            readyAtGreaterThanOrEqual=NotImplemented,
            readyAtLessThanOrEqual=NotImplemented,
            syncTimeGreaterThanOrEqual=NotImplemented,
            syncTimeLessThanOrEqual=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            fileTypeEqual=NotImplemented,
            fileTypeIn=NotImplemented,
            linkedIdEqual=NotImplemented,
            linkCountGreaterThanOrEqual=NotImplemented,
            linkCountLessThanOrEqual=NotImplemented,
            fileSizeGreaterThanOrEqual=NotImplemented,
            fileSizeLessThanOrEqual=NotImplemented,
            currentDc=NotImplemented):
        KalturaFileSyncBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            partnerIdEqual,
            fileObjectTypeEqual,
            fileObjectTypeIn,
            objectIdEqual,
            objectIdIn,
            versionEqual,
            versionIn,
            objectSubTypeEqual,
            objectSubTypeIn,
            dcEqual,
            dcIn,
            originalEqual,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            readyAtGreaterThanOrEqual,
            readyAtLessThanOrEqual,
            syncTimeGreaterThanOrEqual,
            syncTimeLessThanOrEqual,
            statusEqual,
            statusIn,
            fileTypeEqual,
            fileTypeIn,
            linkedIdEqual,
            linkCountGreaterThanOrEqual,
            linkCountLessThanOrEqual,
            fileSizeGreaterThanOrEqual,
            fileSizeLessThanOrEqual)

        # @var KalturaNullableBoolean
        self.currentDc = currentDc


    PROPERTY_LOADERS = {
        'currentDc': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
    }

    def fromXml(self, node):
        KalturaFileSyncBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFileSyncFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFileSyncBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaFileSyncFilter")
        kparams.addIntEnumIfDefined("currentDc", self.currentDc)
        return kparams

    def getCurrentDc(self):
        return self.currentDc

    def setCurrentDc(self, newCurrentDc):
        self.currentDc = newCurrentDc


########## services ##########
########## main ##########
class KalturaFileSyncClientPlugin(KalturaClientPlugin):
    # KalturaFileSyncClientPlugin
    instance = None

    # @return KalturaFileSyncClientPlugin
    @staticmethod
    def get():
        if KalturaFileSyncClientPlugin.instance == None:
            KalturaFileSyncClientPlugin.instance = KalturaFileSyncClientPlugin()
        return KalturaFileSyncClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaFileSyncStatus': KalturaFileSyncStatus,
            'KalturaFileSyncType': KalturaFileSyncType,
            'KalturaFileSyncOrderBy': KalturaFileSyncOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaFileSync': KalturaFileSync,
            'KalturaFileSyncBaseFilter': KalturaFileSyncBaseFilter,
            'KalturaFileSyncListResponse': KalturaFileSyncListResponse,
            'KalturaFileSyncFilter': KalturaFileSyncFilter,
        }

    # @return string
    def getName(self):
        return 'fileSync'

