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
from Metadata import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaDropFolderContentFileHandlerMatchPolicy(object):
    ADD_AS_NEW = 1
    MATCH_EXISTING_OR_ADD_AS_NEW = 2
    MATCH_EXISTING_OR_KEEP_IN_FOLDER = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDropFolderFileDeletePolicy(object):
    MANUAL_DELETE = 1
    AUTO_DELETE = 2
    AUTO_DELETE_WHEN_ENTRY_IS_READY = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDropFolderFileStatus(object):
    UPLOADING = 1
    PENDING = 2
    WAITING = 3
    HANDLED = 4
    IGNORE = 5
    DELETED = 6
    PURGED = 7
    NO_MATCH = 8
    ERROR_HANDLING = 9
    ERROR_DELETING = 10
    DOWNLOADING = 11
    ERROR_DOWNLOADING = 12
    PROCESSING = 13
    PARSED = 14
    DETECTED = 15

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDropFolderStatus(object):
    DISABLED = 0
    ENABLED = 1
    DELETED = 2
    ERROR = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDropFolderErrorCode(object):
    ERROR_CONNECT = "1"
    ERROR_AUTENTICATE = "2"
    ERROR_GET_PHISICAL_FILE_LIST = "3"
    ERROR_GET_DB_FILE_LIST = "4"
    DROP_FOLDER_APP_ERROR = "5"
    CONTENT_MATCH_POLICY_UNDEFINED = "6"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDropFolderFileErrorCode(object):
    ERROR_ADDING_BULK_UPLOAD = "dropFolderXmlBulkUpload.ERROR_ADDING_BULK_UPLOAD"
    ERROR_ADD_CONTENT_RESOURCE = "dropFolderXmlBulkUpload.ERROR_ADD_CONTENT_RESOURCE"
    ERROR_IN_BULK_UPLOAD = "dropFolderXmlBulkUpload.ERROR_IN_BULK_UPLOAD"
    ERROR_WRITING_TEMP_FILE = "dropFolderXmlBulkUpload.ERROR_WRITING_TEMP_FILE"
    LOCAL_FILE_WRONG_CHECKSUM = "dropFolderXmlBulkUpload.LOCAL_FILE_WRONG_CHECKSUM"
    LOCAL_FILE_WRONG_SIZE = "dropFolderXmlBulkUpload.LOCAL_FILE_WRONG_SIZE"
    MALFORMED_XML_FILE = "dropFolderXmlBulkUpload.MALFORMED_XML_FILE"
    XML_FILE_SIZE_EXCEED_LIMIT = "dropFolderXmlBulkUpload.XML_FILE_SIZE_EXCEED_LIMIT"
    ERROR_UPDATE_ENTRY = "1"
    ERROR_ADD_ENTRY = "2"
    FLAVOR_NOT_FOUND = "3"
    FLAVOR_MISSING_IN_FILE_NAME = "4"
    SLUG_REGEX_NO_MATCH = "5"
    ERROR_READING_FILE = "6"
    ERROR_DOWNLOADING_FILE = "7"
    ERROR_UPDATE_FILE = "8"
    ERROR_ADDING_CONTENT_PROCESSOR = "10"
    ERROR_IN_CONTENT_PROCESSOR = "11"
    ERROR_DELETING_FILE = "12"
    FILE_NO_MATCH = "13"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDropFolderFileHandlerType(object):
    XML = "dropFolderXmlBulkUpload.XML"
    ICAL = "scheduleDropFolder.ICAL"
    CONTENT = "1"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDropFolderFileOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    FILE_NAME_ASC = "+fileName"
    FILE_SIZE_ASC = "+fileSize"
    FILE_SIZE_LAST_SET_AT_ASC = "+fileSizeLastSetAt"
    ID_ASC = "+id"
    PARSED_FLAVOR_ASC = "+parsedFlavor"
    PARSED_SLUG_ASC = "+parsedSlug"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    FILE_NAME_DESC = "-fileName"
    FILE_SIZE_DESC = "-fileSize"
    FILE_SIZE_LAST_SET_AT_DESC = "-fileSizeLastSetAt"
    ID_DESC = "-id"
    PARSED_FLAVOR_DESC = "-parsedFlavor"
    PARSED_SLUG_DESC = "-parsedSlug"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDropFolderOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    ID_ASC = "+id"
    NAME_ASC = "+name"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    ID_DESC = "-id"
    NAME_DESC = "-name"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDropFolderType(object):
    FEED = "FeedDropFolder.FEED"
    WEBEX = "WebexDropFolder.WEBEX"
    LOCAL = "1"
    FTP = "2"
    SCP = "3"
    SFTP = "4"
    S3 = "6"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaFtpDropFolderOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    ID_ASC = "+id"
    NAME_ASC = "+name"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    ID_DESC = "-id"
    NAME_DESC = "-name"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaRemoteDropFolderOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    ID_ASC = "+id"
    NAME_ASC = "+name"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    ID_DESC = "-id"
    NAME_DESC = "-name"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaScpDropFolderOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    ID_ASC = "+id"
    NAME_ASC = "+name"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    ID_DESC = "-id"
    NAME_DESC = "-name"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaSftpDropFolderOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    ID_ASC = "+id"
    NAME_ASC = "+name"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    ID_DESC = "-id"
    NAME_DESC = "-name"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaSshDropFolderOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    ID_ASC = "+id"
    NAME_ASC = "+name"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    ID_DESC = "-id"
    NAME_DESC = "-name"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaDropFolderFileHandlerConfig(KalturaObjectBase):
    def __init__(self,
            handlerType=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var KalturaDropFolderFileHandlerType
        # @readonly
        self.handlerType = handlerType


    PROPERTY_LOADERS = {
        'handlerType': (KalturaEnumsFactory.createString, "KalturaDropFolderFileHandlerType"), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDropFolderFileHandlerConfig.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaDropFolderFileHandlerConfig")
        return kparams

    def getHandlerType(self):
        return self.handlerType


# @package Kaltura
# @subpackage Client
class KalturaDropFolder(KalturaObjectBase):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            description=NotImplemented,
            type=NotImplemented,
            status=NotImplemented,
            conversionProfileId=NotImplemented,
            dc=NotImplemented,
            path=NotImplemented,
            fileSizeCheckInterval=NotImplemented,
            fileDeletePolicy=NotImplemented,
            autoFileDeleteDays=NotImplemented,
            fileHandlerType=NotImplemented,
            fileNamePatterns=NotImplemented,
            fileHandlerConfig=NotImplemented,
            tags=NotImplemented,
            errorCode=NotImplemented,
            errorDescription=NotImplemented,
            ignoreFileNamePatterns=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            lastAccessedAt=NotImplemented,
            incremental=NotImplemented,
            lastFileTimestamp=NotImplemented,
            metadataProfileId=NotImplemented,
            categoriesMetadataFieldName=NotImplemented,
            enforceEntitlement=NotImplemented,
            shouldValidateKS=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var int
        # @readonly
        self.id = id

        # @var int
        # @insertonly
        self.partnerId = partnerId

        # @var string
        self.name = name

        # @var string
        self.description = description

        # @var KalturaDropFolderType
        self.type = type

        # @var KalturaDropFolderStatus
        self.status = status

        # @var int
        self.conversionProfileId = conversionProfileId

        # @var int
        self.dc = dc

        # @var string
        self.path = path

        # The ammount of time, in seconds, that should pass so that a file with no change in size we'll be treated as "finished uploading to folder"
        # @var int
        self.fileSizeCheckInterval = fileSizeCheckInterval

        # @var KalturaDropFolderFileDeletePolicy
        self.fileDeletePolicy = fileDeletePolicy

        # @var int
        self.autoFileDeleteDays = autoFileDeleteDays

        # @var KalturaDropFolderFileHandlerType
        self.fileHandlerType = fileHandlerType

        # @var string
        self.fileNamePatterns = fileNamePatterns

        # @var KalturaDropFolderFileHandlerConfig
        self.fileHandlerConfig = fileHandlerConfig

        # @var string
        self.tags = tags

        # @var KalturaDropFolderErrorCode
        self.errorCode = errorCode

        # @var string
        self.errorDescription = errorDescription

        # @var string
        self.ignoreFileNamePatterns = ignoreFileNamePatterns

        # @var int
        # @readonly
        self.createdAt = createdAt

        # @var int
        # @readonly
        self.updatedAt = updatedAt

        # @var int
        self.lastAccessedAt = lastAccessedAt

        # @var bool
        self.incremental = incremental

        # @var int
        self.lastFileTimestamp = lastFileTimestamp

        # @var int
        self.metadataProfileId = metadataProfileId

        # @var string
        self.categoriesMetadataFieldName = categoriesMetadataFieldName

        # @var bool
        self.enforceEntitlement = enforceEntitlement

        # @var bool
        self.shouldValidateKS = shouldValidateKS


    PROPERTY_LOADERS = {
        'id': getXmlNodeInt, 
        'partnerId': getXmlNodeInt, 
        'name': getXmlNodeText, 
        'description': getXmlNodeText, 
        'type': (KalturaEnumsFactory.createString, "KalturaDropFolderType"), 
        'status': (KalturaEnumsFactory.createInt, "KalturaDropFolderStatus"), 
        'conversionProfileId': getXmlNodeInt, 
        'dc': getXmlNodeInt, 
        'path': getXmlNodeText, 
        'fileSizeCheckInterval': getXmlNodeInt, 
        'fileDeletePolicy': (KalturaEnumsFactory.createInt, "KalturaDropFolderFileDeletePolicy"), 
        'autoFileDeleteDays': getXmlNodeInt, 
        'fileHandlerType': (KalturaEnumsFactory.createString, "KalturaDropFolderFileHandlerType"), 
        'fileNamePatterns': getXmlNodeText, 
        'fileHandlerConfig': (KalturaObjectFactory.create, KalturaDropFolderFileHandlerConfig), 
        'tags': getXmlNodeText, 
        'errorCode': (KalturaEnumsFactory.createString, "KalturaDropFolderErrorCode"), 
        'errorDescription': getXmlNodeText, 
        'ignoreFileNamePatterns': getXmlNodeText, 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
        'lastAccessedAt': getXmlNodeInt, 
        'incremental': getXmlNodeBool, 
        'lastFileTimestamp': getXmlNodeInt, 
        'metadataProfileId': getXmlNodeInt, 
        'categoriesMetadataFieldName': getXmlNodeText, 
        'enforceEntitlement': getXmlNodeBool, 
        'shouldValidateKS': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDropFolder.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaDropFolder")
        kparams.addIntIfDefined("partnerId", self.partnerId)
        kparams.addStringIfDefined("name", self.name)
        kparams.addStringIfDefined("description", self.description)
        kparams.addStringEnumIfDefined("type", self.type)
        kparams.addIntEnumIfDefined("status", self.status)
        kparams.addIntIfDefined("conversionProfileId", self.conversionProfileId)
        kparams.addIntIfDefined("dc", self.dc)
        kparams.addStringIfDefined("path", self.path)
        kparams.addIntIfDefined("fileSizeCheckInterval", self.fileSizeCheckInterval)
        kparams.addIntEnumIfDefined("fileDeletePolicy", self.fileDeletePolicy)
        kparams.addIntIfDefined("autoFileDeleteDays", self.autoFileDeleteDays)
        kparams.addStringEnumIfDefined("fileHandlerType", self.fileHandlerType)
        kparams.addStringIfDefined("fileNamePatterns", self.fileNamePatterns)
        kparams.addObjectIfDefined("fileHandlerConfig", self.fileHandlerConfig)
        kparams.addStringIfDefined("tags", self.tags)
        kparams.addStringEnumIfDefined("errorCode", self.errorCode)
        kparams.addStringIfDefined("errorDescription", self.errorDescription)
        kparams.addStringIfDefined("ignoreFileNamePatterns", self.ignoreFileNamePatterns)
        kparams.addIntIfDefined("lastAccessedAt", self.lastAccessedAt)
        kparams.addBoolIfDefined("incremental", self.incremental)
        kparams.addIntIfDefined("lastFileTimestamp", self.lastFileTimestamp)
        kparams.addIntIfDefined("metadataProfileId", self.metadataProfileId)
        kparams.addStringIfDefined("categoriesMetadataFieldName", self.categoriesMetadataFieldName)
        kparams.addBoolIfDefined("enforceEntitlement", self.enforceEntitlement)
        kparams.addBoolIfDefined("shouldValidateKS", self.shouldValidateKS)
        return kparams

    def getId(self):
        return self.id

    def getPartnerId(self):
        return self.partnerId

    def setPartnerId(self, newPartnerId):
        self.partnerId = newPartnerId

    def getName(self):
        return self.name

    def setName(self, newName):
        self.name = newName

    def getDescription(self):
        return self.description

    def setDescription(self, newDescription):
        self.description = newDescription

    def getType(self):
        return self.type

    def setType(self, newType):
        self.type = newType

    def getStatus(self):
        return self.status

    def setStatus(self, newStatus):
        self.status = newStatus

    def getConversionProfileId(self):
        return self.conversionProfileId

    def setConversionProfileId(self, newConversionProfileId):
        self.conversionProfileId = newConversionProfileId

    def getDc(self):
        return self.dc

    def setDc(self, newDc):
        self.dc = newDc

    def getPath(self):
        return self.path

    def setPath(self, newPath):
        self.path = newPath

    def getFileSizeCheckInterval(self):
        return self.fileSizeCheckInterval

    def setFileSizeCheckInterval(self, newFileSizeCheckInterval):
        self.fileSizeCheckInterval = newFileSizeCheckInterval

    def getFileDeletePolicy(self):
        return self.fileDeletePolicy

    def setFileDeletePolicy(self, newFileDeletePolicy):
        self.fileDeletePolicy = newFileDeletePolicy

    def getAutoFileDeleteDays(self):
        return self.autoFileDeleteDays

    def setAutoFileDeleteDays(self, newAutoFileDeleteDays):
        self.autoFileDeleteDays = newAutoFileDeleteDays

    def getFileHandlerType(self):
        return self.fileHandlerType

    def setFileHandlerType(self, newFileHandlerType):
        self.fileHandlerType = newFileHandlerType

    def getFileNamePatterns(self):
        return self.fileNamePatterns

    def setFileNamePatterns(self, newFileNamePatterns):
        self.fileNamePatterns = newFileNamePatterns

    def getFileHandlerConfig(self):
        return self.fileHandlerConfig

    def setFileHandlerConfig(self, newFileHandlerConfig):
        self.fileHandlerConfig = newFileHandlerConfig

    def getTags(self):
        return self.tags

    def setTags(self, newTags):
        self.tags = newTags

    def getErrorCode(self):
        return self.errorCode

    def setErrorCode(self, newErrorCode):
        self.errorCode = newErrorCode

    def getErrorDescription(self):
        return self.errorDescription

    def setErrorDescription(self, newErrorDescription):
        self.errorDescription = newErrorDescription

    def getIgnoreFileNamePatterns(self):
        return self.ignoreFileNamePatterns

    def setIgnoreFileNamePatterns(self, newIgnoreFileNamePatterns):
        self.ignoreFileNamePatterns = newIgnoreFileNamePatterns

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt

    def getLastAccessedAt(self):
        return self.lastAccessedAt

    def setLastAccessedAt(self, newLastAccessedAt):
        self.lastAccessedAt = newLastAccessedAt

    def getIncremental(self):
        return self.incremental

    def setIncremental(self, newIncremental):
        self.incremental = newIncremental

    def getLastFileTimestamp(self):
        return self.lastFileTimestamp

    def setLastFileTimestamp(self, newLastFileTimestamp):
        self.lastFileTimestamp = newLastFileTimestamp

    def getMetadataProfileId(self):
        return self.metadataProfileId

    def setMetadataProfileId(self, newMetadataProfileId):
        self.metadataProfileId = newMetadataProfileId

    def getCategoriesMetadataFieldName(self):
        return self.categoriesMetadataFieldName

    def setCategoriesMetadataFieldName(self, newCategoriesMetadataFieldName):
        self.categoriesMetadataFieldName = newCategoriesMetadataFieldName

    def getEnforceEntitlement(self):
        return self.enforceEntitlement

    def setEnforceEntitlement(self, newEnforceEntitlement):
        self.enforceEntitlement = newEnforceEntitlement

    def getShouldValidateKS(self):
        return self.shouldValidateKS

    def setShouldValidateKS(self, newShouldValidateKS):
        self.shouldValidateKS = newShouldValidateKS


# @package Kaltura
# @subpackage Client
class KalturaDropFolderFile(KalturaObjectBase):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            dropFolderId=NotImplemented,
            fileName=NotImplemented,
            fileSize=NotImplemented,
            fileSizeLastSetAt=NotImplemented,
            status=NotImplemented,
            type=NotImplemented,
            parsedSlug=NotImplemented,
            parsedFlavor=NotImplemented,
            parsedUserId=NotImplemented,
            leadDropFolderFileId=NotImplemented,
            deletedDropFolderFileId=NotImplemented,
            entryId=NotImplemented,
            errorCode=NotImplemented,
            errorDescription=NotImplemented,
            lastModificationTime=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            uploadStartDetectedAt=NotImplemented,
            uploadEndDetectedAt=NotImplemented,
            importStartedAt=NotImplemented,
            importEndedAt=NotImplemented,
            batchJobId=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var int
        # @readonly
        self.id = id

        # @var int
        # @readonly
        self.partnerId = partnerId

        # @var int
        # @insertonly
        self.dropFolderId = dropFolderId

        # @var string
        # @insertonly
        self.fileName = fileName

        # @var float
        self.fileSize = fileSize

        # @var int
        # @readonly
        self.fileSizeLastSetAt = fileSizeLastSetAt

        # @var KalturaDropFolderFileStatus
        # @readonly
        self.status = status

        # @var KalturaDropFolderType
        # @readonly
        self.type = type

        # @var string
        self.parsedSlug = parsedSlug

        # @var string
        self.parsedFlavor = parsedFlavor

        # @var string
        self.parsedUserId = parsedUserId

        # @var int
        self.leadDropFolderFileId = leadDropFolderFileId

        # @var int
        self.deletedDropFolderFileId = deletedDropFolderFileId

        # @var string
        self.entryId = entryId

        # @var KalturaDropFolderFileErrorCode
        self.errorCode = errorCode

        # @var string
        self.errorDescription = errorDescription

        # @var string
        self.lastModificationTime = lastModificationTime

        # @var int
        # @readonly
        self.createdAt = createdAt

        # @var int
        # @readonly
        self.updatedAt = updatedAt

        # @var int
        self.uploadStartDetectedAt = uploadStartDetectedAt

        # @var int
        self.uploadEndDetectedAt = uploadEndDetectedAt

        # @var int
        self.importStartedAt = importStartedAt

        # @var int
        self.importEndedAt = importEndedAt

        # @var int
        # @readonly
        self.batchJobId = batchJobId


    PROPERTY_LOADERS = {
        'id': getXmlNodeInt, 
        'partnerId': getXmlNodeInt, 
        'dropFolderId': getXmlNodeInt, 
        'fileName': getXmlNodeText, 
        'fileSize': getXmlNodeFloat, 
        'fileSizeLastSetAt': getXmlNodeInt, 
        'status': (KalturaEnumsFactory.createInt, "KalturaDropFolderFileStatus"), 
        'type': (KalturaEnumsFactory.createString, "KalturaDropFolderType"), 
        'parsedSlug': getXmlNodeText, 
        'parsedFlavor': getXmlNodeText, 
        'parsedUserId': getXmlNodeText, 
        'leadDropFolderFileId': getXmlNodeInt, 
        'deletedDropFolderFileId': getXmlNodeInt, 
        'entryId': getXmlNodeText, 
        'errorCode': (KalturaEnumsFactory.createString, "KalturaDropFolderFileErrorCode"), 
        'errorDescription': getXmlNodeText, 
        'lastModificationTime': getXmlNodeText, 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
        'uploadStartDetectedAt': getXmlNodeInt, 
        'uploadEndDetectedAt': getXmlNodeInt, 
        'importStartedAt': getXmlNodeInt, 
        'importEndedAt': getXmlNodeInt, 
        'batchJobId': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDropFolderFile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaDropFolderFile")
        kparams.addIntIfDefined("dropFolderId", self.dropFolderId)
        kparams.addStringIfDefined("fileName", self.fileName)
        kparams.addFloatIfDefined("fileSize", self.fileSize)
        kparams.addStringIfDefined("parsedSlug", self.parsedSlug)
        kparams.addStringIfDefined("parsedFlavor", self.parsedFlavor)
        kparams.addStringIfDefined("parsedUserId", self.parsedUserId)
        kparams.addIntIfDefined("leadDropFolderFileId", self.leadDropFolderFileId)
        kparams.addIntIfDefined("deletedDropFolderFileId", self.deletedDropFolderFileId)
        kparams.addStringIfDefined("entryId", self.entryId)
        kparams.addStringEnumIfDefined("errorCode", self.errorCode)
        kparams.addStringIfDefined("errorDescription", self.errorDescription)
        kparams.addStringIfDefined("lastModificationTime", self.lastModificationTime)
        kparams.addIntIfDefined("uploadStartDetectedAt", self.uploadStartDetectedAt)
        kparams.addIntIfDefined("uploadEndDetectedAt", self.uploadEndDetectedAt)
        kparams.addIntIfDefined("importStartedAt", self.importStartedAt)
        kparams.addIntIfDefined("importEndedAt", self.importEndedAt)
        return kparams

    def getId(self):
        return self.id

    def getPartnerId(self):
        return self.partnerId

    def getDropFolderId(self):
        return self.dropFolderId

    def setDropFolderId(self, newDropFolderId):
        self.dropFolderId = newDropFolderId

    def getFileName(self):
        return self.fileName

    def setFileName(self, newFileName):
        self.fileName = newFileName

    def getFileSize(self):
        return self.fileSize

    def setFileSize(self, newFileSize):
        self.fileSize = newFileSize

    def getFileSizeLastSetAt(self):
        return self.fileSizeLastSetAt

    def getStatus(self):
        return self.status

    def getType(self):
        return self.type

    def getParsedSlug(self):
        return self.parsedSlug

    def setParsedSlug(self, newParsedSlug):
        self.parsedSlug = newParsedSlug

    def getParsedFlavor(self):
        return self.parsedFlavor

    def setParsedFlavor(self, newParsedFlavor):
        self.parsedFlavor = newParsedFlavor

    def getParsedUserId(self):
        return self.parsedUserId

    def setParsedUserId(self, newParsedUserId):
        self.parsedUserId = newParsedUserId

    def getLeadDropFolderFileId(self):
        return self.leadDropFolderFileId

    def setLeadDropFolderFileId(self, newLeadDropFolderFileId):
        self.leadDropFolderFileId = newLeadDropFolderFileId

    def getDeletedDropFolderFileId(self):
        return self.deletedDropFolderFileId

    def setDeletedDropFolderFileId(self, newDeletedDropFolderFileId):
        self.deletedDropFolderFileId = newDeletedDropFolderFileId

    def getEntryId(self):
        return self.entryId

    def setEntryId(self, newEntryId):
        self.entryId = newEntryId

    def getErrorCode(self):
        return self.errorCode

    def setErrorCode(self, newErrorCode):
        self.errorCode = newErrorCode

    def getErrorDescription(self):
        return self.errorDescription

    def setErrorDescription(self, newErrorDescription):
        self.errorDescription = newErrorDescription

    def getLastModificationTime(self):
        return self.lastModificationTime

    def setLastModificationTime(self, newLastModificationTime):
        self.lastModificationTime = newLastModificationTime

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt

    def getUploadStartDetectedAt(self):
        return self.uploadStartDetectedAt

    def setUploadStartDetectedAt(self, newUploadStartDetectedAt):
        self.uploadStartDetectedAt = newUploadStartDetectedAt

    def getUploadEndDetectedAt(self):
        return self.uploadEndDetectedAt

    def setUploadEndDetectedAt(self, newUploadEndDetectedAt):
        self.uploadEndDetectedAt = newUploadEndDetectedAt

    def getImportStartedAt(self):
        return self.importStartedAt

    def setImportStartedAt(self, newImportStartedAt):
        self.importStartedAt = newImportStartedAt

    def getImportEndedAt(self):
        return self.importEndedAt

    def setImportEndedAt(self, newImportEndedAt):
        self.importEndedAt = newImportEndedAt

    def getBatchJobId(self):
        return self.batchJobId


# @package Kaltura
# @subpackage Client
class KalturaDropFolderBaseFilter(KalturaFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            conversionProfileIdEqual=NotImplemented,
            conversionProfileIdIn=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            pathEqual=NotImplemented,
            pathLike=NotImplemented,
            fileHandlerTypeEqual=NotImplemented,
            fileHandlerTypeIn=NotImplemented,
            fileNamePatternsLike=NotImplemented,
            fileNamePatternsMultiLikeOr=NotImplemented,
            fileNamePatternsMultiLikeAnd=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            errorCodeEqual=NotImplemented,
            errorCodeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var int
        self.idEqual = idEqual

        # @var string
        self.idIn = idIn

        # @var int
        self.partnerIdEqual = partnerIdEqual

        # @var string
        self.partnerIdIn = partnerIdIn

        # @var string
        self.nameLike = nameLike

        # @var KalturaDropFolderType
        self.typeEqual = typeEqual

        # @var string
        self.typeIn = typeIn

        # @var KalturaDropFolderStatus
        self.statusEqual = statusEqual

        # @var string
        self.statusIn = statusIn

        # @var int
        self.conversionProfileIdEqual = conversionProfileIdEqual

        # @var string
        self.conversionProfileIdIn = conversionProfileIdIn

        # @var int
        self.dcEqual = dcEqual

        # @var string
        self.dcIn = dcIn

        # @var string
        self.pathEqual = pathEqual

        # @var string
        self.pathLike = pathLike

        # @var KalturaDropFolderFileHandlerType
        self.fileHandlerTypeEqual = fileHandlerTypeEqual

        # @var string
        self.fileHandlerTypeIn = fileHandlerTypeIn

        # @var string
        self.fileNamePatternsLike = fileNamePatternsLike

        # @var string
        self.fileNamePatternsMultiLikeOr = fileNamePatternsMultiLikeOr

        # @var string
        self.fileNamePatternsMultiLikeAnd = fileNamePatternsMultiLikeAnd

        # @var string
        self.tagsLike = tagsLike

        # @var string
        self.tagsMultiLikeOr = tagsMultiLikeOr

        # @var string
        self.tagsMultiLikeAnd = tagsMultiLikeAnd

        # @var KalturaDropFolderErrorCode
        self.errorCodeEqual = errorCodeEqual

        # @var string
        self.errorCodeIn = errorCodeIn

        # @var int
        self.createdAtGreaterThanOrEqual = createdAtGreaterThanOrEqual

        # @var int
        self.createdAtLessThanOrEqual = createdAtLessThanOrEqual

        # @var int
        self.updatedAtGreaterThanOrEqual = updatedAtGreaterThanOrEqual

        # @var int
        self.updatedAtLessThanOrEqual = updatedAtLessThanOrEqual


    PROPERTY_LOADERS = {
        'idEqual': getXmlNodeInt, 
        'idIn': getXmlNodeText, 
        'partnerIdEqual': getXmlNodeInt, 
        'partnerIdIn': getXmlNodeText, 
        'nameLike': getXmlNodeText, 
        'typeEqual': (KalturaEnumsFactory.createString, "KalturaDropFolderType"), 
        'typeIn': getXmlNodeText, 
        'statusEqual': (KalturaEnumsFactory.createInt, "KalturaDropFolderStatus"), 
        'statusIn': getXmlNodeText, 
        'conversionProfileIdEqual': getXmlNodeInt, 
        'conversionProfileIdIn': getXmlNodeText, 
        'dcEqual': getXmlNodeInt, 
        'dcIn': getXmlNodeText, 
        'pathEqual': getXmlNodeText, 
        'pathLike': getXmlNodeText, 
        'fileHandlerTypeEqual': (KalturaEnumsFactory.createString, "KalturaDropFolderFileHandlerType"), 
        'fileHandlerTypeIn': getXmlNodeText, 
        'fileNamePatternsLike': getXmlNodeText, 
        'fileNamePatternsMultiLikeOr': getXmlNodeText, 
        'fileNamePatternsMultiLikeAnd': getXmlNodeText, 
        'tagsLike': getXmlNodeText, 
        'tagsMultiLikeOr': getXmlNodeText, 
        'tagsMultiLikeAnd': getXmlNodeText, 
        'errorCodeEqual': (KalturaEnumsFactory.createString, "KalturaDropFolderErrorCode"), 
        'errorCodeIn': getXmlNodeText, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'updatedAtGreaterThanOrEqual': getXmlNodeInt, 
        'updatedAtLessThanOrEqual': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDropFolderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFilter.toParams(self)
        kparams.put("objectType", "KalturaDropFolderBaseFilter")
        kparams.addIntIfDefined("idEqual", self.idEqual)
        kparams.addStringIfDefined("idIn", self.idIn)
        kparams.addIntIfDefined("partnerIdEqual", self.partnerIdEqual)
        kparams.addStringIfDefined("partnerIdIn", self.partnerIdIn)
        kparams.addStringIfDefined("nameLike", self.nameLike)
        kparams.addStringEnumIfDefined("typeEqual", self.typeEqual)
        kparams.addStringIfDefined("typeIn", self.typeIn)
        kparams.addIntEnumIfDefined("statusEqual", self.statusEqual)
        kparams.addStringIfDefined("statusIn", self.statusIn)
        kparams.addIntIfDefined("conversionProfileIdEqual", self.conversionProfileIdEqual)
        kparams.addStringIfDefined("conversionProfileIdIn", self.conversionProfileIdIn)
        kparams.addIntIfDefined("dcEqual", self.dcEqual)
        kparams.addStringIfDefined("dcIn", self.dcIn)
        kparams.addStringIfDefined("pathEqual", self.pathEqual)
        kparams.addStringIfDefined("pathLike", self.pathLike)
        kparams.addStringEnumIfDefined("fileHandlerTypeEqual", self.fileHandlerTypeEqual)
        kparams.addStringIfDefined("fileHandlerTypeIn", self.fileHandlerTypeIn)
        kparams.addStringIfDefined("fileNamePatternsLike", self.fileNamePatternsLike)
        kparams.addStringIfDefined("fileNamePatternsMultiLikeOr", self.fileNamePatternsMultiLikeOr)
        kparams.addStringIfDefined("fileNamePatternsMultiLikeAnd", self.fileNamePatternsMultiLikeAnd)
        kparams.addStringIfDefined("tagsLike", self.tagsLike)
        kparams.addStringIfDefined("tagsMultiLikeOr", self.tagsMultiLikeOr)
        kparams.addStringIfDefined("tagsMultiLikeAnd", self.tagsMultiLikeAnd)
        kparams.addStringEnumIfDefined("errorCodeEqual", self.errorCodeEqual)
        kparams.addStringIfDefined("errorCodeIn", self.errorCodeIn)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        kparams.addIntIfDefined("updatedAtGreaterThanOrEqual", self.updatedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("updatedAtLessThanOrEqual", self.updatedAtLessThanOrEqual)
        return kparams

    def getIdEqual(self):
        return self.idEqual

    def setIdEqual(self, newIdEqual):
        self.idEqual = newIdEqual

    def getIdIn(self):
        return self.idIn

    def setIdIn(self, newIdIn):
        self.idIn = newIdIn

    def getPartnerIdEqual(self):
        return self.partnerIdEqual

    def setPartnerIdEqual(self, newPartnerIdEqual):
        self.partnerIdEqual = newPartnerIdEqual

    def getPartnerIdIn(self):
        return self.partnerIdIn

    def setPartnerIdIn(self, newPartnerIdIn):
        self.partnerIdIn = newPartnerIdIn

    def getNameLike(self):
        return self.nameLike

    def setNameLike(self, newNameLike):
        self.nameLike = newNameLike

    def getTypeEqual(self):
        return self.typeEqual

    def setTypeEqual(self, newTypeEqual):
        self.typeEqual = newTypeEqual

    def getTypeIn(self):
        return self.typeIn

    def setTypeIn(self, newTypeIn):
        self.typeIn = newTypeIn

    def getStatusEqual(self):
        return self.statusEqual

    def setStatusEqual(self, newStatusEqual):
        self.statusEqual = newStatusEqual

    def getStatusIn(self):
        return self.statusIn

    def setStatusIn(self, newStatusIn):
        self.statusIn = newStatusIn

    def getConversionProfileIdEqual(self):
        return self.conversionProfileIdEqual

    def setConversionProfileIdEqual(self, newConversionProfileIdEqual):
        self.conversionProfileIdEqual = newConversionProfileIdEqual

    def getConversionProfileIdIn(self):
        return self.conversionProfileIdIn

    def setConversionProfileIdIn(self, newConversionProfileIdIn):
        self.conversionProfileIdIn = newConversionProfileIdIn

    def getDcEqual(self):
        return self.dcEqual

    def setDcEqual(self, newDcEqual):
        self.dcEqual = newDcEqual

    def getDcIn(self):
        return self.dcIn

    def setDcIn(self, newDcIn):
        self.dcIn = newDcIn

    def getPathEqual(self):
        return self.pathEqual

    def setPathEqual(self, newPathEqual):
        self.pathEqual = newPathEqual

    def getPathLike(self):
        return self.pathLike

    def setPathLike(self, newPathLike):
        self.pathLike = newPathLike

    def getFileHandlerTypeEqual(self):
        return self.fileHandlerTypeEqual

    def setFileHandlerTypeEqual(self, newFileHandlerTypeEqual):
        self.fileHandlerTypeEqual = newFileHandlerTypeEqual

    def getFileHandlerTypeIn(self):
        return self.fileHandlerTypeIn

    def setFileHandlerTypeIn(self, newFileHandlerTypeIn):
        self.fileHandlerTypeIn = newFileHandlerTypeIn

    def getFileNamePatternsLike(self):
        return self.fileNamePatternsLike

    def setFileNamePatternsLike(self, newFileNamePatternsLike):
        self.fileNamePatternsLike = newFileNamePatternsLike

    def getFileNamePatternsMultiLikeOr(self):
        return self.fileNamePatternsMultiLikeOr

    def setFileNamePatternsMultiLikeOr(self, newFileNamePatternsMultiLikeOr):
        self.fileNamePatternsMultiLikeOr = newFileNamePatternsMultiLikeOr

    def getFileNamePatternsMultiLikeAnd(self):
        return self.fileNamePatternsMultiLikeAnd

    def setFileNamePatternsMultiLikeAnd(self, newFileNamePatternsMultiLikeAnd):
        self.fileNamePatternsMultiLikeAnd = newFileNamePatternsMultiLikeAnd

    def getTagsLike(self):
        return self.tagsLike

    def setTagsLike(self, newTagsLike):
        self.tagsLike = newTagsLike

    def getTagsMultiLikeOr(self):
        return self.tagsMultiLikeOr

    def setTagsMultiLikeOr(self, newTagsMultiLikeOr):
        self.tagsMultiLikeOr = newTagsMultiLikeOr

    def getTagsMultiLikeAnd(self):
        return self.tagsMultiLikeAnd

    def setTagsMultiLikeAnd(self, newTagsMultiLikeAnd):
        self.tagsMultiLikeAnd = newTagsMultiLikeAnd

    def getErrorCodeEqual(self):
        return self.errorCodeEqual

    def setErrorCodeEqual(self, newErrorCodeEqual):
        self.errorCodeEqual = newErrorCodeEqual

    def getErrorCodeIn(self):
        return self.errorCodeIn

    def setErrorCodeIn(self, newErrorCodeIn):
        self.errorCodeIn = newErrorCodeIn

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


# @package Kaltura
# @subpackage Client
class KalturaDropFolderContentFileHandlerConfig(KalturaDropFolderFileHandlerConfig):
    def __init__(self,
            handlerType=NotImplemented,
            contentMatchPolicy=NotImplemented,
            slugRegex=NotImplemented):
        KalturaDropFolderFileHandlerConfig.__init__(self,
            handlerType)

        # @var KalturaDropFolderContentFileHandlerMatchPolicy
        self.contentMatchPolicy = contentMatchPolicy

        # Regular expression that defines valid file names to be handled.
        # 	 The following might be extracted from the file name and used if defined:
        # 	 - (?P<referenceId>\w+) - will be used as the drop folder file's parsed slug.
        # 	 - (?P<flavorName>\w+)  - will be used as the drop folder file's parsed flavor.
        # @var string
        self.slugRegex = slugRegex


    PROPERTY_LOADERS = {
        'contentMatchPolicy': (KalturaEnumsFactory.createInt, "KalturaDropFolderContentFileHandlerMatchPolicy"), 
        'slugRegex': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDropFolderFileHandlerConfig.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDropFolderContentFileHandlerConfig.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDropFolderFileHandlerConfig.toParams(self)
        kparams.put("objectType", "KalturaDropFolderContentFileHandlerConfig")
        kparams.addIntEnumIfDefined("contentMatchPolicy", self.contentMatchPolicy)
        kparams.addStringIfDefined("slugRegex", self.slugRegex)
        return kparams

    def getContentMatchPolicy(self):
        return self.contentMatchPolicy

    def setContentMatchPolicy(self, newContentMatchPolicy):
        self.contentMatchPolicy = newContentMatchPolicy

    def getSlugRegex(self):
        return self.slugRegex

    def setSlugRegex(self, newSlugRegex):
        self.slugRegex = newSlugRegex


# @package Kaltura
# @subpackage Client
class KalturaDropFolderContentProcessorJobData(KalturaJobData):
    def __init__(self,
            dropFolderId=NotImplemented,
            dropFolderFileIds=NotImplemented,
            parsedSlug=NotImplemented,
            contentMatchPolicy=NotImplemented,
            conversionProfileId=NotImplemented,
            parsedUserId=NotImplemented):
        KalturaJobData.__init__(self)

        # @var int
        self.dropFolderId = dropFolderId

        # @var string
        self.dropFolderFileIds = dropFolderFileIds

        # @var string
        self.parsedSlug = parsedSlug

        # @var KalturaDropFolderContentFileHandlerMatchPolicy
        self.contentMatchPolicy = contentMatchPolicy

        # @var int
        self.conversionProfileId = conversionProfileId

        # @var string
        self.parsedUserId = parsedUserId


    PROPERTY_LOADERS = {
        'dropFolderId': getXmlNodeInt, 
        'dropFolderFileIds': getXmlNodeText, 
        'parsedSlug': getXmlNodeText, 
        'contentMatchPolicy': (KalturaEnumsFactory.createInt, "KalturaDropFolderContentFileHandlerMatchPolicy"), 
        'conversionProfileId': getXmlNodeInt, 
        'parsedUserId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDropFolderContentProcessorJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaJobData.toParams(self)
        kparams.put("objectType", "KalturaDropFolderContentProcessorJobData")
        kparams.addIntIfDefined("dropFolderId", self.dropFolderId)
        kparams.addStringIfDefined("dropFolderFileIds", self.dropFolderFileIds)
        kparams.addStringIfDefined("parsedSlug", self.parsedSlug)
        kparams.addIntEnumIfDefined("contentMatchPolicy", self.contentMatchPolicy)
        kparams.addIntIfDefined("conversionProfileId", self.conversionProfileId)
        kparams.addStringIfDefined("parsedUserId", self.parsedUserId)
        return kparams

    def getDropFolderId(self):
        return self.dropFolderId

    def setDropFolderId(self, newDropFolderId):
        self.dropFolderId = newDropFolderId

    def getDropFolderFileIds(self):
        return self.dropFolderFileIds

    def setDropFolderFileIds(self, newDropFolderFileIds):
        self.dropFolderFileIds = newDropFolderFileIds

    def getParsedSlug(self):
        return self.parsedSlug

    def setParsedSlug(self, newParsedSlug):
        self.parsedSlug = newParsedSlug

    def getContentMatchPolicy(self):
        return self.contentMatchPolicy

    def setContentMatchPolicy(self, newContentMatchPolicy):
        self.contentMatchPolicy = newContentMatchPolicy

    def getConversionProfileId(self):
        return self.conversionProfileId

    def setConversionProfileId(self, newConversionProfileId):
        self.conversionProfileId = newConversionProfileId

    def getParsedUserId(self):
        return self.parsedUserId

    def setParsedUserId(self, newParsedUserId):
        self.parsedUserId = newParsedUserId


# @package Kaltura
# @subpackage Client
class KalturaDropFolderFileBaseFilter(KalturaFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            dropFolderIdEqual=NotImplemented,
            dropFolderIdIn=NotImplemented,
            fileNameEqual=NotImplemented,
            fileNameIn=NotImplemented,
            fileNameLike=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            statusNotIn=NotImplemented,
            parsedSlugEqual=NotImplemented,
            parsedSlugIn=NotImplemented,
            parsedSlugLike=NotImplemented,
            parsedFlavorEqual=NotImplemented,
            parsedFlavorIn=NotImplemented,
            parsedFlavorLike=NotImplemented,
            leadDropFolderFileIdEqual=NotImplemented,
            deletedDropFolderFileIdEqual=NotImplemented,
            entryIdEqual=NotImplemented,
            errorCodeEqual=NotImplemented,
            errorCodeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var int
        self.idEqual = idEqual

        # @var string
        self.idIn = idIn

        # @var int
        self.partnerIdEqual = partnerIdEqual

        # @var string
        self.partnerIdIn = partnerIdIn

        # @var int
        self.dropFolderIdEqual = dropFolderIdEqual

        # @var string
        self.dropFolderIdIn = dropFolderIdIn

        # @var string
        self.fileNameEqual = fileNameEqual

        # @var string
        self.fileNameIn = fileNameIn

        # @var string
        self.fileNameLike = fileNameLike

        # @var KalturaDropFolderFileStatus
        self.statusEqual = statusEqual

        # @var string
        self.statusIn = statusIn

        # @var string
        self.statusNotIn = statusNotIn

        # @var string
        self.parsedSlugEqual = parsedSlugEqual

        # @var string
        self.parsedSlugIn = parsedSlugIn

        # @var string
        self.parsedSlugLike = parsedSlugLike

        # @var string
        self.parsedFlavorEqual = parsedFlavorEqual

        # @var string
        self.parsedFlavorIn = parsedFlavorIn

        # @var string
        self.parsedFlavorLike = parsedFlavorLike

        # @var int
        self.leadDropFolderFileIdEqual = leadDropFolderFileIdEqual

        # @var int
        self.deletedDropFolderFileIdEqual = deletedDropFolderFileIdEqual

        # @var string
        self.entryIdEqual = entryIdEqual

        # @var KalturaDropFolderFileErrorCode
        self.errorCodeEqual = errorCodeEqual

        # @var string
        self.errorCodeIn = errorCodeIn

        # @var int
        self.createdAtGreaterThanOrEqual = createdAtGreaterThanOrEqual

        # @var int
        self.createdAtLessThanOrEqual = createdAtLessThanOrEqual

        # @var int
        self.updatedAtGreaterThanOrEqual = updatedAtGreaterThanOrEqual

        # @var int
        self.updatedAtLessThanOrEqual = updatedAtLessThanOrEqual


    PROPERTY_LOADERS = {
        'idEqual': getXmlNodeInt, 
        'idIn': getXmlNodeText, 
        'partnerIdEqual': getXmlNodeInt, 
        'partnerIdIn': getXmlNodeText, 
        'dropFolderIdEqual': getXmlNodeInt, 
        'dropFolderIdIn': getXmlNodeText, 
        'fileNameEqual': getXmlNodeText, 
        'fileNameIn': getXmlNodeText, 
        'fileNameLike': getXmlNodeText, 
        'statusEqual': (KalturaEnumsFactory.createInt, "KalturaDropFolderFileStatus"), 
        'statusIn': getXmlNodeText, 
        'statusNotIn': getXmlNodeText, 
        'parsedSlugEqual': getXmlNodeText, 
        'parsedSlugIn': getXmlNodeText, 
        'parsedSlugLike': getXmlNodeText, 
        'parsedFlavorEqual': getXmlNodeText, 
        'parsedFlavorIn': getXmlNodeText, 
        'parsedFlavorLike': getXmlNodeText, 
        'leadDropFolderFileIdEqual': getXmlNodeInt, 
        'deletedDropFolderFileIdEqual': getXmlNodeInt, 
        'entryIdEqual': getXmlNodeText, 
        'errorCodeEqual': (KalturaEnumsFactory.createString, "KalturaDropFolderFileErrorCode"), 
        'errorCodeIn': getXmlNodeText, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'updatedAtGreaterThanOrEqual': getXmlNodeInt, 
        'updatedAtLessThanOrEqual': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDropFolderFileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFilter.toParams(self)
        kparams.put("objectType", "KalturaDropFolderFileBaseFilter")
        kparams.addIntIfDefined("idEqual", self.idEqual)
        kparams.addStringIfDefined("idIn", self.idIn)
        kparams.addIntIfDefined("partnerIdEqual", self.partnerIdEqual)
        kparams.addStringIfDefined("partnerIdIn", self.partnerIdIn)
        kparams.addIntIfDefined("dropFolderIdEqual", self.dropFolderIdEqual)
        kparams.addStringIfDefined("dropFolderIdIn", self.dropFolderIdIn)
        kparams.addStringIfDefined("fileNameEqual", self.fileNameEqual)
        kparams.addStringIfDefined("fileNameIn", self.fileNameIn)
        kparams.addStringIfDefined("fileNameLike", self.fileNameLike)
        kparams.addIntEnumIfDefined("statusEqual", self.statusEqual)
        kparams.addStringIfDefined("statusIn", self.statusIn)
        kparams.addStringIfDefined("statusNotIn", self.statusNotIn)
        kparams.addStringIfDefined("parsedSlugEqual", self.parsedSlugEqual)
        kparams.addStringIfDefined("parsedSlugIn", self.parsedSlugIn)
        kparams.addStringIfDefined("parsedSlugLike", self.parsedSlugLike)
        kparams.addStringIfDefined("parsedFlavorEqual", self.parsedFlavorEqual)
        kparams.addStringIfDefined("parsedFlavorIn", self.parsedFlavorIn)
        kparams.addStringIfDefined("parsedFlavorLike", self.parsedFlavorLike)
        kparams.addIntIfDefined("leadDropFolderFileIdEqual", self.leadDropFolderFileIdEqual)
        kparams.addIntIfDefined("deletedDropFolderFileIdEqual", self.deletedDropFolderFileIdEqual)
        kparams.addStringIfDefined("entryIdEqual", self.entryIdEqual)
        kparams.addStringEnumIfDefined("errorCodeEqual", self.errorCodeEqual)
        kparams.addStringIfDefined("errorCodeIn", self.errorCodeIn)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        kparams.addIntIfDefined("updatedAtGreaterThanOrEqual", self.updatedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("updatedAtLessThanOrEqual", self.updatedAtLessThanOrEqual)
        return kparams

    def getIdEqual(self):
        return self.idEqual

    def setIdEqual(self, newIdEqual):
        self.idEqual = newIdEqual

    def getIdIn(self):
        return self.idIn

    def setIdIn(self, newIdIn):
        self.idIn = newIdIn

    def getPartnerIdEqual(self):
        return self.partnerIdEqual

    def setPartnerIdEqual(self, newPartnerIdEqual):
        self.partnerIdEqual = newPartnerIdEqual

    def getPartnerIdIn(self):
        return self.partnerIdIn

    def setPartnerIdIn(self, newPartnerIdIn):
        self.partnerIdIn = newPartnerIdIn

    def getDropFolderIdEqual(self):
        return self.dropFolderIdEqual

    def setDropFolderIdEqual(self, newDropFolderIdEqual):
        self.dropFolderIdEqual = newDropFolderIdEqual

    def getDropFolderIdIn(self):
        return self.dropFolderIdIn

    def setDropFolderIdIn(self, newDropFolderIdIn):
        self.dropFolderIdIn = newDropFolderIdIn

    def getFileNameEqual(self):
        return self.fileNameEqual

    def setFileNameEqual(self, newFileNameEqual):
        self.fileNameEqual = newFileNameEqual

    def getFileNameIn(self):
        return self.fileNameIn

    def setFileNameIn(self, newFileNameIn):
        self.fileNameIn = newFileNameIn

    def getFileNameLike(self):
        return self.fileNameLike

    def setFileNameLike(self, newFileNameLike):
        self.fileNameLike = newFileNameLike

    def getStatusEqual(self):
        return self.statusEqual

    def setStatusEqual(self, newStatusEqual):
        self.statusEqual = newStatusEqual

    def getStatusIn(self):
        return self.statusIn

    def setStatusIn(self, newStatusIn):
        self.statusIn = newStatusIn

    def getStatusNotIn(self):
        return self.statusNotIn

    def setStatusNotIn(self, newStatusNotIn):
        self.statusNotIn = newStatusNotIn

    def getParsedSlugEqual(self):
        return self.parsedSlugEqual

    def setParsedSlugEqual(self, newParsedSlugEqual):
        self.parsedSlugEqual = newParsedSlugEqual

    def getParsedSlugIn(self):
        return self.parsedSlugIn

    def setParsedSlugIn(self, newParsedSlugIn):
        self.parsedSlugIn = newParsedSlugIn

    def getParsedSlugLike(self):
        return self.parsedSlugLike

    def setParsedSlugLike(self, newParsedSlugLike):
        self.parsedSlugLike = newParsedSlugLike

    def getParsedFlavorEqual(self):
        return self.parsedFlavorEqual

    def setParsedFlavorEqual(self, newParsedFlavorEqual):
        self.parsedFlavorEqual = newParsedFlavorEqual

    def getParsedFlavorIn(self):
        return self.parsedFlavorIn

    def setParsedFlavorIn(self, newParsedFlavorIn):
        self.parsedFlavorIn = newParsedFlavorIn

    def getParsedFlavorLike(self):
        return self.parsedFlavorLike

    def setParsedFlavorLike(self, newParsedFlavorLike):
        self.parsedFlavorLike = newParsedFlavorLike

    def getLeadDropFolderFileIdEqual(self):
        return self.leadDropFolderFileIdEqual

    def setLeadDropFolderFileIdEqual(self, newLeadDropFolderFileIdEqual):
        self.leadDropFolderFileIdEqual = newLeadDropFolderFileIdEqual

    def getDeletedDropFolderFileIdEqual(self):
        return self.deletedDropFolderFileIdEqual

    def setDeletedDropFolderFileIdEqual(self, newDeletedDropFolderFileIdEqual):
        self.deletedDropFolderFileIdEqual = newDeletedDropFolderFileIdEqual

    def getEntryIdEqual(self):
        return self.entryIdEqual

    def setEntryIdEqual(self, newEntryIdEqual):
        self.entryIdEqual = newEntryIdEqual

    def getErrorCodeEqual(self):
        return self.errorCodeEqual

    def setErrorCodeEqual(self, newErrorCodeEqual):
        self.errorCodeEqual = newErrorCodeEqual

    def getErrorCodeIn(self):
        return self.errorCodeIn

    def setErrorCodeIn(self, newErrorCodeIn):
        self.errorCodeIn = newErrorCodeIn

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


# @package Kaltura
# @subpackage Client
class KalturaDropFolderFileListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaDropFolderFile
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaDropFolderFile), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDropFolderFileListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaDropFolderFileListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaDropFolderListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaDropFolder
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaDropFolder), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDropFolderListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaDropFolderListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaRemoteDropFolder(KalturaDropFolder):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            description=NotImplemented,
            type=NotImplemented,
            status=NotImplemented,
            conversionProfileId=NotImplemented,
            dc=NotImplemented,
            path=NotImplemented,
            fileSizeCheckInterval=NotImplemented,
            fileDeletePolicy=NotImplemented,
            autoFileDeleteDays=NotImplemented,
            fileHandlerType=NotImplemented,
            fileNamePatterns=NotImplemented,
            fileHandlerConfig=NotImplemented,
            tags=NotImplemented,
            errorCode=NotImplemented,
            errorDescription=NotImplemented,
            ignoreFileNamePatterns=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            lastAccessedAt=NotImplemented,
            incremental=NotImplemented,
            lastFileTimestamp=NotImplemented,
            metadataProfileId=NotImplemented,
            categoriesMetadataFieldName=NotImplemented,
            enforceEntitlement=NotImplemented,
            shouldValidateKS=NotImplemented):
        KalturaDropFolder.__init__(self,
            id,
            partnerId,
            name,
            description,
            type,
            status,
            conversionProfileId,
            dc,
            path,
            fileSizeCheckInterval,
            fileDeletePolicy,
            autoFileDeleteDays,
            fileHandlerType,
            fileNamePatterns,
            fileHandlerConfig,
            tags,
            errorCode,
            errorDescription,
            ignoreFileNamePatterns,
            createdAt,
            updatedAt,
            lastAccessedAt,
            incremental,
            lastFileTimestamp,
            metadataProfileId,
            categoriesMetadataFieldName,
            enforceEntitlement,
            shouldValidateKS)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDropFolder.fromXml(self, node)
        self.fromXmlImpl(node, KalturaRemoteDropFolder.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDropFolder.toParams(self)
        kparams.put("objectType", "KalturaRemoteDropFolder")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDropFolderFileFilter(KalturaDropFolderFileBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            dropFolderIdEqual=NotImplemented,
            dropFolderIdIn=NotImplemented,
            fileNameEqual=NotImplemented,
            fileNameIn=NotImplemented,
            fileNameLike=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            statusNotIn=NotImplemented,
            parsedSlugEqual=NotImplemented,
            parsedSlugIn=NotImplemented,
            parsedSlugLike=NotImplemented,
            parsedFlavorEqual=NotImplemented,
            parsedFlavorIn=NotImplemented,
            parsedFlavorLike=NotImplemented,
            leadDropFolderFileIdEqual=NotImplemented,
            deletedDropFolderFileIdEqual=NotImplemented,
            entryIdEqual=NotImplemented,
            errorCodeEqual=NotImplemented,
            errorCodeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaDropFolderFileBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            dropFolderIdEqual,
            dropFolderIdIn,
            fileNameEqual,
            fileNameIn,
            fileNameLike,
            statusEqual,
            statusIn,
            statusNotIn,
            parsedSlugEqual,
            parsedSlugIn,
            parsedSlugLike,
            parsedFlavorEqual,
            parsedFlavorIn,
            parsedFlavorLike,
            leadDropFolderFileIdEqual,
            deletedDropFolderFileIdEqual,
            entryIdEqual,
            errorCodeEqual,
            errorCodeIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDropFolderFileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDropFolderFileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDropFolderFileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaDropFolderFileFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDropFolderFilter(KalturaDropFolderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            conversionProfileIdEqual=NotImplemented,
            conversionProfileIdIn=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            pathEqual=NotImplemented,
            pathLike=NotImplemented,
            fileHandlerTypeEqual=NotImplemented,
            fileHandlerTypeIn=NotImplemented,
            fileNamePatternsLike=NotImplemented,
            fileNamePatternsMultiLikeOr=NotImplemented,
            fileNamePatternsMultiLikeAnd=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            errorCodeEqual=NotImplemented,
            errorCodeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            currentDc=NotImplemented):
        KalturaDropFolderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            conversionProfileIdEqual,
            conversionProfileIdIn,
            dcEqual,
            dcIn,
            pathEqual,
            pathLike,
            fileHandlerTypeEqual,
            fileHandlerTypeIn,
            fileNamePatternsLike,
            fileNamePatternsMultiLikeOr,
            fileNamePatternsMultiLikeAnd,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            errorCodeEqual,
            errorCodeIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)

        # @var KalturaNullableBoolean
        self.currentDc = currentDc


    PROPERTY_LOADERS = {
        'currentDc': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
    }

    def fromXml(self, node):
        KalturaDropFolderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDropFolderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDropFolderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaDropFolderFilter")
        kparams.addIntEnumIfDefined("currentDc", self.currentDc)
        return kparams

    def getCurrentDc(self):
        return self.currentDc

    def setCurrentDc(self, newCurrentDc):
        self.currentDc = newCurrentDc


# @package Kaltura
# @subpackage Client
class KalturaFtpDropFolder(KalturaRemoteDropFolder):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            description=NotImplemented,
            type=NotImplemented,
            status=NotImplemented,
            conversionProfileId=NotImplemented,
            dc=NotImplemented,
            path=NotImplemented,
            fileSizeCheckInterval=NotImplemented,
            fileDeletePolicy=NotImplemented,
            autoFileDeleteDays=NotImplemented,
            fileHandlerType=NotImplemented,
            fileNamePatterns=NotImplemented,
            fileHandlerConfig=NotImplemented,
            tags=NotImplemented,
            errorCode=NotImplemented,
            errorDescription=NotImplemented,
            ignoreFileNamePatterns=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            lastAccessedAt=NotImplemented,
            incremental=NotImplemented,
            lastFileTimestamp=NotImplemented,
            metadataProfileId=NotImplemented,
            categoriesMetadataFieldName=NotImplemented,
            enforceEntitlement=NotImplemented,
            shouldValidateKS=NotImplemented,
            host=NotImplemented,
            port=NotImplemented,
            username=NotImplemented,
            password=NotImplemented):
        KalturaRemoteDropFolder.__init__(self,
            id,
            partnerId,
            name,
            description,
            type,
            status,
            conversionProfileId,
            dc,
            path,
            fileSizeCheckInterval,
            fileDeletePolicy,
            autoFileDeleteDays,
            fileHandlerType,
            fileNamePatterns,
            fileHandlerConfig,
            tags,
            errorCode,
            errorDescription,
            ignoreFileNamePatterns,
            createdAt,
            updatedAt,
            lastAccessedAt,
            incremental,
            lastFileTimestamp,
            metadataProfileId,
            categoriesMetadataFieldName,
            enforceEntitlement,
            shouldValidateKS)

        # @var string
        self.host = host

        # @var int
        self.port = port

        # @var string
        self.username = username

        # @var string
        self.password = password


    PROPERTY_LOADERS = {
        'host': getXmlNodeText, 
        'port': getXmlNodeInt, 
        'username': getXmlNodeText, 
        'password': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaRemoteDropFolder.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFtpDropFolder.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaRemoteDropFolder.toParams(self)
        kparams.put("objectType", "KalturaFtpDropFolder")
        kparams.addStringIfDefined("host", self.host)
        kparams.addIntIfDefined("port", self.port)
        kparams.addStringIfDefined("username", self.username)
        kparams.addStringIfDefined("password", self.password)
        return kparams

    def getHost(self):
        return self.host

    def setHost(self, newHost):
        self.host = newHost

    def getPort(self):
        return self.port

    def setPort(self, newPort):
        self.port = newPort

    def getUsername(self):
        return self.username

    def setUsername(self, newUsername):
        self.username = newUsername

    def getPassword(self):
        return self.password

    def setPassword(self, newPassword):
        self.password = newPassword


# @package Kaltura
# @subpackage Client
class KalturaSshDropFolder(KalturaRemoteDropFolder):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            description=NotImplemented,
            type=NotImplemented,
            status=NotImplemented,
            conversionProfileId=NotImplemented,
            dc=NotImplemented,
            path=NotImplemented,
            fileSizeCheckInterval=NotImplemented,
            fileDeletePolicy=NotImplemented,
            autoFileDeleteDays=NotImplemented,
            fileHandlerType=NotImplemented,
            fileNamePatterns=NotImplemented,
            fileHandlerConfig=NotImplemented,
            tags=NotImplemented,
            errorCode=NotImplemented,
            errorDescription=NotImplemented,
            ignoreFileNamePatterns=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            lastAccessedAt=NotImplemented,
            incremental=NotImplemented,
            lastFileTimestamp=NotImplemented,
            metadataProfileId=NotImplemented,
            categoriesMetadataFieldName=NotImplemented,
            enforceEntitlement=NotImplemented,
            shouldValidateKS=NotImplemented,
            host=NotImplemented,
            port=NotImplemented,
            username=NotImplemented,
            password=NotImplemented,
            privateKey=NotImplemented,
            publicKey=NotImplemented,
            passPhrase=NotImplemented):
        KalturaRemoteDropFolder.__init__(self,
            id,
            partnerId,
            name,
            description,
            type,
            status,
            conversionProfileId,
            dc,
            path,
            fileSizeCheckInterval,
            fileDeletePolicy,
            autoFileDeleteDays,
            fileHandlerType,
            fileNamePatterns,
            fileHandlerConfig,
            tags,
            errorCode,
            errorDescription,
            ignoreFileNamePatterns,
            createdAt,
            updatedAt,
            lastAccessedAt,
            incremental,
            lastFileTimestamp,
            metadataProfileId,
            categoriesMetadataFieldName,
            enforceEntitlement,
            shouldValidateKS)

        # @var string
        self.host = host

        # @var int
        self.port = port

        # @var string
        self.username = username

        # @var string
        self.password = password

        # @var string
        self.privateKey = privateKey

        # @var string
        self.publicKey = publicKey

        # @var string
        self.passPhrase = passPhrase


    PROPERTY_LOADERS = {
        'host': getXmlNodeText, 
        'port': getXmlNodeInt, 
        'username': getXmlNodeText, 
        'password': getXmlNodeText, 
        'privateKey': getXmlNodeText, 
        'publicKey': getXmlNodeText, 
        'passPhrase': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaRemoteDropFolder.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSshDropFolder.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaRemoteDropFolder.toParams(self)
        kparams.put("objectType", "KalturaSshDropFolder")
        kparams.addStringIfDefined("host", self.host)
        kparams.addIntIfDefined("port", self.port)
        kparams.addStringIfDefined("username", self.username)
        kparams.addStringIfDefined("password", self.password)
        kparams.addStringIfDefined("privateKey", self.privateKey)
        kparams.addStringIfDefined("publicKey", self.publicKey)
        kparams.addStringIfDefined("passPhrase", self.passPhrase)
        return kparams

    def getHost(self):
        return self.host

    def setHost(self, newHost):
        self.host = newHost

    def getPort(self):
        return self.port

    def setPort(self, newPort):
        self.port = newPort

    def getUsername(self):
        return self.username

    def setUsername(self, newUsername):
        self.username = newUsername

    def getPassword(self):
        return self.password

    def setPassword(self, newPassword):
        self.password = newPassword

    def getPrivateKey(self):
        return self.privateKey

    def setPrivateKey(self, newPrivateKey):
        self.privateKey = newPrivateKey

    def getPublicKey(self):
        return self.publicKey

    def setPublicKey(self, newPublicKey):
        self.publicKey = newPublicKey

    def getPassPhrase(self):
        return self.passPhrase

    def setPassPhrase(self, newPassPhrase):
        self.passPhrase = newPassPhrase


# @package Kaltura
# @subpackage Client
class KalturaDropFolderFileResource(KalturaDataCenterContentResource):
    """Used to ingest media that dropped through drop folder"""

    def __init__(self,
            dropFolderFileId=NotImplemented):
        KalturaDataCenterContentResource.__init__(self)

        # Id of the drop folder file object
        # @var int
        self.dropFolderFileId = dropFolderFileId


    PROPERTY_LOADERS = {
        'dropFolderFileId': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaDataCenterContentResource.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDropFolderFileResource.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDataCenterContentResource.toParams(self)
        kparams.put("objectType", "KalturaDropFolderFileResource")
        kparams.addIntIfDefined("dropFolderFileId", self.dropFolderFileId)
        return kparams

    def getDropFolderFileId(self):
        return self.dropFolderFileId

    def setDropFolderFileId(self, newDropFolderFileId):
        self.dropFolderFileId = newDropFolderFileId


# @package Kaltura
# @subpackage Client
class KalturaDropFolderImportJobData(KalturaSshImportJobData):
    def __init__(self,
            srcFileUrl=NotImplemented,
            destFileLocalPath=NotImplemented,
            flavorAssetId=NotImplemented,
            fileSize=NotImplemented,
            privateKey=NotImplemented,
            publicKey=NotImplemented,
            passPhrase=NotImplemented,
            dropFolderFileId=NotImplemented):
        KalturaSshImportJobData.__init__(self,
            srcFileUrl,
            destFileLocalPath,
            flavorAssetId,
            fileSize,
            privateKey,
            publicKey,
            passPhrase)

        # @var int
        self.dropFolderFileId = dropFolderFileId


    PROPERTY_LOADERS = {
        'dropFolderFileId': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaSshImportJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDropFolderImportJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSshImportJobData.toParams(self)
        kparams.put("objectType", "KalturaDropFolderImportJobData")
        kparams.addIntIfDefined("dropFolderFileId", self.dropFolderFileId)
        return kparams

    def getDropFolderFileId(self):
        return self.dropFolderFileId

    def setDropFolderFileId(self, newDropFolderFileId):
        self.dropFolderFileId = newDropFolderFileId


# @package Kaltura
# @subpackage Client
class KalturaRemoteDropFolderBaseFilter(KalturaDropFolderFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            conversionProfileIdEqual=NotImplemented,
            conversionProfileIdIn=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            pathEqual=NotImplemented,
            pathLike=NotImplemented,
            fileHandlerTypeEqual=NotImplemented,
            fileHandlerTypeIn=NotImplemented,
            fileNamePatternsLike=NotImplemented,
            fileNamePatternsMultiLikeOr=NotImplemented,
            fileNamePatternsMultiLikeAnd=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            errorCodeEqual=NotImplemented,
            errorCodeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            currentDc=NotImplemented):
        KalturaDropFolderFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            conversionProfileIdEqual,
            conversionProfileIdIn,
            dcEqual,
            dcIn,
            pathEqual,
            pathLike,
            fileHandlerTypeEqual,
            fileHandlerTypeIn,
            fileNamePatternsLike,
            fileNamePatternsMultiLikeOr,
            fileNamePatternsMultiLikeAnd,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            errorCodeEqual,
            errorCodeIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            currentDc)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDropFolderFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaRemoteDropFolderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDropFolderFilter.toParams(self)
        kparams.put("objectType", "KalturaRemoteDropFolderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaScpDropFolder(KalturaSshDropFolder):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            description=NotImplemented,
            type=NotImplemented,
            status=NotImplemented,
            conversionProfileId=NotImplemented,
            dc=NotImplemented,
            path=NotImplemented,
            fileSizeCheckInterval=NotImplemented,
            fileDeletePolicy=NotImplemented,
            autoFileDeleteDays=NotImplemented,
            fileHandlerType=NotImplemented,
            fileNamePatterns=NotImplemented,
            fileHandlerConfig=NotImplemented,
            tags=NotImplemented,
            errorCode=NotImplemented,
            errorDescription=NotImplemented,
            ignoreFileNamePatterns=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            lastAccessedAt=NotImplemented,
            incremental=NotImplemented,
            lastFileTimestamp=NotImplemented,
            metadataProfileId=NotImplemented,
            categoriesMetadataFieldName=NotImplemented,
            enforceEntitlement=NotImplemented,
            shouldValidateKS=NotImplemented,
            host=NotImplemented,
            port=NotImplemented,
            username=NotImplemented,
            password=NotImplemented,
            privateKey=NotImplemented,
            publicKey=NotImplemented,
            passPhrase=NotImplemented):
        KalturaSshDropFolder.__init__(self,
            id,
            partnerId,
            name,
            description,
            type,
            status,
            conversionProfileId,
            dc,
            path,
            fileSizeCheckInterval,
            fileDeletePolicy,
            autoFileDeleteDays,
            fileHandlerType,
            fileNamePatterns,
            fileHandlerConfig,
            tags,
            errorCode,
            errorDescription,
            ignoreFileNamePatterns,
            createdAt,
            updatedAt,
            lastAccessedAt,
            incremental,
            lastFileTimestamp,
            metadataProfileId,
            categoriesMetadataFieldName,
            enforceEntitlement,
            shouldValidateKS,
            host,
            port,
            username,
            password,
            privateKey,
            publicKey,
            passPhrase)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaSshDropFolder.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScpDropFolder.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSshDropFolder.toParams(self)
        kparams.put("objectType", "KalturaScpDropFolder")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSftpDropFolder(KalturaSshDropFolder):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            description=NotImplemented,
            type=NotImplemented,
            status=NotImplemented,
            conversionProfileId=NotImplemented,
            dc=NotImplemented,
            path=NotImplemented,
            fileSizeCheckInterval=NotImplemented,
            fileDeletePolicy=NotImplemented,
            autoFileDeleteDays=NotImplemented,
            fileHandlerType=NotImplemented,
            fileNamePatterns=NotImplemented,
            fileHandlerConfig=NotImplemented,
            tags=NotImplemented,
            errorCode=NotImplemented,
            errorDescription=NotImplemented,
            ignoreFileNamePatterns=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            lastAccessedAt=NotImplemented,
            incremental=NotImplemented,
            lastFileTimestamp=NotImplemented,
            metadataProfileId=NotImplemented,
            categoriesMetadataFieldName=NotImplemented,
            enforceEntitlement=NotImplemented,
            shouldValidateKS=NotImplemented,
            host=NotImplemented,
            port=NotImplemented,
            username=NotImplemented,
            password=NotImplemented,
            privateKey=NotImplemented,
            publicKey=NotImplemented,
            passPhrase=NotImplemented):
        KalturaSshDropFolder.__init__(self,
            id,
            partnerId,
            name,
            description,
            type,
            status,
            conversionProfileId,
            dc,
            path,
            fileSizeCheckInterval,
            fileDeletePolicy,
            autoFileDeleteDays,
            fileHandlerType,
            fileNamePatterns,
            fileHandlerConfig,
            tags,
            errorCode,
            errorDescription,
            ignoreFileNamePatterns,
            createdAt,
            updatedAt,
            lastAccessedAt,
            incremental,
            lastFileTimestamp,
            metadataProfileId,
            categoriesMetadataFieldName,
            enforceEntitlement,
            shouldValidateKS,
            host,
            port,
            username,
            password,
            privateKey,
            publicKey,
            passPhrase)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaSshDropFolder.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSftpDropFolder.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSshDropFolder.toParams(self)
        kparams.put("objectType", "KalturaSftpDropFolder")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaRemoteDropFolderFilter(KalturaRemoteDropFolderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            conversionProfileIdEqual=NotImplemented,
            conversionProfileIdIn=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            pathEqual=NotImplemented,
            pathLike=NotImplemented,
            fileHandlerTypeEqual=NotImplemented,
            fileHandlerTypeIn=NotImplemented,
            fileNamePatternsLike=NotImplemented,
            fileNamePatternsMultiLikeOr=NotImplemented,
            fileNamePatternsMultiLikeAnd=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            errorCodeEqual=NotImplemented,
            errorCodeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            currentDc=NotImplemented):
        KalturaRemoteDropFolderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            conversionProfileIdEqual,
            conversionProfileIdIn,
            dcEqual,
            dcIn,
            pathEqual,
            pathLike,
            fileHandlerTypeEqual,
            fileHandlerTypeIn,
            fileNamePatternsLike,
            fileNamePatternsMultiLikeOr,
            fileNamePatternsMultiLikeAnd,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            errorCodeEqual,
            errorCodeIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            currentDc)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaRemoteDropFolderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaRemoteDropFolderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaRemoteDropFolderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaRemoteDropFolderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFtpDropFolderBaseFilter(KalturaRemoteDropFolderFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            conversionProfileIdEqual=NotImplemented,
            conversionProfileIdIn=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            pathEqual=NotImplemented,
            pathLike=NotImplemented,
            fileHandlerTypeEqual=NotImplemented,
            fileHandlerTypeIn=NotImplemented,
            fileNamePatternsLike=NotImplemented,
            fileNamePatternsMultiLikeOr=NotImplemented,
            fileNamePatternsMultiLikeAnd=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            errorCodeEqual=NotImplemented,
            errorCodeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            currentDc=NotImplemented):
        KalturaRemoteDropFolderFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            conversionProfileIdEqual,
            conversionProfileIdIn,
            dcEqual,
            dcIn,
            pathEqual,
            pathLike,
            fileHandlerTypeEqual,
            fileHandlerTypeIn,
            fileNamePatternsLike,
            fileNamePatternsMultiLikeOr,
            fileNamePatternsMultiLikeAnd,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            errorCodeEqual,
            errorCodeIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            currentDc)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaRemoteDropFolderFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFtpDropFolderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaRemoteDropFolderFilter.toParams(self)
        kparams.put("objectType", "KalturaFtpDropFolderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSshDropFolderBaseFilter(KalturaRemoteDropFolderFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            conversionProfileIdEqual=NotImplemented,
            conversionProfileIdIn=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            pathEqual=NotImplemented,
            pathLike=NotImplemented,
            fileHandlerTypeEqual=NotImplemented,
            fileHandlerTypeIn=NotImplemented,
            fileNamePatternsLike=NotImplemented,
            fileNamePatternsMultiLikeOr=NotImplemented,
            fileNamePatternsMultiLikeAnd=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            errorCodeEqual=NotImplemented,
            errorCodeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            currentDc=NotImplemented):
        KalturaRemoteDropFolderFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            conversionProfileIdEqual,
            conversionProfileIdIn,
            dcEqual,
            dcIn,
            pathEqual,
            pathLike,
            fileHandlerTypeEqual,
            fileHandlerTypeIn,
            fileNamePatternsLike,
            fileNamePatternsMultiLikeOr,
            fileNamePatternsMultiLikeAnd,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            errorCodeEqual,
            errorCodeIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            currentDc)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaRemoteDropFolderFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSshDropFolderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaRemoteDropFolderFilter.toParams(self)
        kparams.put("objectType", "KalturaSshDropFolderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFtpDropFolderFilter(KalturaFtpDropFolderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            conversionProfileIdEqual=NotImplemented,
            conversionProfileIdIn=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            pathEqual=NotImplemented,
            pathLike=NotImplemented,
            fileHandlerTypeEqual=NotImplemented,
            fileHandlerTypeIn=NotImplemented,
            fileNamePatternsLike=NotImplemented,
            fileNamePatternsMultiLikeOr=NotImplemented,
            fileNamePatternsMultiLikeAnd=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            errorCodeEqual=NotImplemented,
            errorCodeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            currentDc=NotImplemented):
        KalturaFtpDropFolderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            conversionProfileIdEqual,
            conversionProfileIdIn,
            dcEqual,
            dcIn,
            pathEqual,
            pathLike,
            fileHandlerTypeEqual,
            fileHandlerTypeIn,
            fileNamePatternsLike,
            fileNamePatternsMultiLikeOr,
            fileNamePatternsMultiLikeAnd,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            errorCodeEqual,
            errorCodeIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            currentDc)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaFtpDropFolderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFtpDropFolderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFtpDropFolderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaFtpDropFolderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSshDropFolderFilter(KalturaSshDropFolderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            conversionProfileIdEqual=NotImplemented,
            conversionProfileIdIn=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            pathEqual=NotImplemented,
            pathLike=NotImplemented,
            fileHandlerTypeEqual=NotImplemented,
            fileHandlerTypeIn=NotImplemented,
            fileNamePatternsLike=NotImplemented,
            fileNamePatternsMultiLikeOr=NotImplemented,
            fileNamePatternsMultiLikeAnd=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            errorCodeEqual=NotImplemented,
            errorCodeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            currentDc=NotImplemented):
        KalturaSshDropFolderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            conversionProfileIdEqual,
            conversionProfileIdIn,
            dcEqual,
            dcIn,
            pathEqual,
            pathLike,
            fileHandlerTypeEqual,
            fileHandlerTypeIn,
            fileNamePatternsLike,
            fileNamePatternsMultiLikeOr,
            fileNamePatternsMultiLikeAnd,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            errorCodeEqual,
            errorCodeIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            currentDc)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaSshDropFolderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSshDropFolderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSshDropFolderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaSshDropFolderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaScpDropFolderBaseFilter(KalturaSshDropFolderFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            conversionProfileIdEqual=NotImplemented,
            conversionProfileIdIn=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            pathEqual=NotImplemented,
            pathLike=NotImplemented,
            fileHandlerTypeEqual=NotImplemented,
            fileHandlerTypeIn=NotImplemented,
            fileNamePatternsLike=NotImplemented,
            fileNamePatternsMultiLikeOr=NotImplemented,
            fileNamePatternsMultiLikeAnd=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            errorCodeEqual=NotImplemented,
            errorCodeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            currentDc=NotImplemented):
        KalturaSshDropFolderFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            conversionProfileIdEqual,
            conversionProfileIdIn,
            dcEqual,
            dcIn,
            pathEqual,
            pathLike,
            fileHandlerTypeEqual,
            fileHandlerTypeIn,
            fileNamePatternsLike,
            fileNamePatternsMultiLikeOr,
            fileNamePatternsMultiLikeAnd,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            errorCodeEqual,
            errorCodeIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            currentDc)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaSshDropFolderFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScpDropFolderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSshDropFolderFilter.toParams(self)
        kparams.put("objectType", "KalturaScpDropFolderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSftpDropFolderBaseFilter(KalturaSshDropFolderFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            conversionProfileIdEqual=NotImplemented,
            conversionProfileIdIn=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            pathEqual=NotImplemented,
            pathLike=NotImplemented,
            fileHandlerTypeEqual=NotImplemented,
            fileHandlerTypeIn=NotImplemented,
            fileNamePatternsLike=NotImplemented,
            fileNamePatternsMultiLikeOr=NotImplemented,
            fileNamePatternsMultiLikeAnd=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            errorCodeEqual=NotImplemented,
            errorCodeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            currentDc=NotImplemented):
        KalturaSshDropFolderFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            conversionProfileIdEqual,
            conversionProfileIdIn,
            dcEqual,
            dcIn,
            pathEqual,
            pathLike,
            fileHandlerTypeEqual,
            fileHandlerTypeIn,
            fileNamePatternsLike,
            fileNamePatternsMultiLikeOr,
            fileNamePatternsMultiLikeAnd,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            errorCodeEqual,
            errorCodeIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            currentDc)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaSshDropFolderFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSftpDropFolderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSshDropFolderFilter.toParams(self)
        kparams.put("objectType", "KalturaSftpDropFolderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaScpDropFolderFilter(KalturaScpDropFolderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            conversionProfileIdEqual=NotImplemented,
            conversionProfileIdIn=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            pathEqual=NotImplemented,
            pathLike=NotImplemented,
            fileHandlerTypeEqual=NotImplemented,
            fileHandlerTypeIn=NotImplemented,
            fileNamePatternsLike=NotImplemented,
            fileNamePatternsMultiLikeOr=NotImplemented,
            fileNamePatternsMultiLikeAnd=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            errorCodeEqual=NotImplemented,
            errorCodeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            currentDc=NotImplemented):
        KalturaScpDropFolderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            conversionProfileIdEqual,
            conversionProfileIdIn,
            dcEqual,
            dcIn,
            pathEqual,
            pathLike,
            fileHandlerTypeEqual,
            fileHandlerTypeIn,
            fileNamePatternsLike,
            fileNamePatternsMultiLikeOr,
            fileNamePatternsMultiLikeAnd,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            errorCodeEqual,
            errorCodeIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            currentDc)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaScpDropFolderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScpDropFolderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaScpDropFolderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaScpDropFolderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSftpDropFolderFilter(KalturaSftpDropFolderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            conversionProfileIdEqual=NotImplemented,
            conversionProfileIdIn=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            pathEqual=NotImplemented,
            pathLike=NotImplemented,
            fileHandlerTypeEqual=NotImplemented,
            fileHandlerTypeIn=NotImplemented,
            fileNamePatternsLike=NotImplemented,
            fileNamePatternsMultiLikeOr=NotImplemented,
            fileNamePatternsMultiLikeAnd=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            errorCodeEqual=NotImplemented,
            errorCodeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            currentDc=NotImplemented):
        KalturaSftpDropFolderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            conversionProfileIdEqual,
            conversionProfileIdIn,
            dcEqual,
            dcIn,
            pathEqual,
            pathLike,
            fileHandlerTypeEqual,
            fileHandlerTypeIn,
            fileNamePatternsLike,
            fileNamePatternsMultiLikeOr,
            fileNamePatternsMultiLikeAnd,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            errorCodeEqual,
            errorCodeIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            currentDc)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaSftpDropFolderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSftpDropFolderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSftpDropFolderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaSftpDropFolderFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaDropFolderService(KalturaServiceBase):
    """DropFolder service lets you create and manage drop folders"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, dropFolder):
        """Allows you to add a new KalturaDropFolder object"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("dropFolder", dropFolder)
        self.client.queueServiceActionCall("dropfolder_dropfolder", "add", KalturaDropFolder, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDropFolder)

    def get(self, dropFolderId):
        """Retrieve a KalturaDropFolder object by ID"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("dropFolderId", dropFolderId);
        self.client.queueServiceActionCall("dropfolder_dropfolder", "get", KalturaDropFolder, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDropFolder)

    def update(self, dropFolderId, dropFolder):
        """Update an existing KalturaDropFolder object"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("dropFolderId", dropFolderId);
        kparams.addObjectIfDefined("dropFolder", dropFolder)
        self.client.queueServiceActionCall("dropfolder_dropfolder", "update", KalturaDropFolder, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDropFolder)

    def delete(self, dropFolderId):
        """Mark the KalturaDropFolder object as deleted"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("dropFolderId", dropFolderId);
        self.client.queueServiceActionCall("dropfolder_dropfolder", "delete", KalturaDropFolder, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDropFolder)

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List KalturaDropFolder objects"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("dropfolder_dropfolder", "list", KalturaDropFolderListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDropFolderListResponse)


# @package Kaltura
# @subpackage Client
class KalturaDropFolderFileService(KalturaServiceBase):
    """DropFolderFile service lets you create and manage drop folder files"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, dropFolderFile):
        """Allows you to add a new KalturaDropFolderFile object"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("dropFolderFile", dropFolderFile)
        self.client.queueServiceActionCall("dropfolder_dropfolderfile", "add", KalturaDropFolderFile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDropFolderFile)

    def get(self, dropFolderFileId):
        """Retrieve a KalturaDropFolderFile object by ID"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("dropFolderFileId", dropFolderFileId);
        self.client.queueServiceActionCall("dropfolder_dropfolderfile", "get", KalturaDropFolderFile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDropFolderFile)

    def update(self, dropFolderFileId, dropFolderFile):
        """Update an existing KalturaDropFolderFile object"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("dropFolderFileId", dropFolderFileId);
        kparams.addObjectIfDefined("dropFolderFile", dropFolderFile)
        self.client.queueServiceActionCall("dropfolder_dropfolderfile", "update", KalturaDropFolderFile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDropFolderFile)

    def updateStatus(self, dropFolderFileId, status):
        """Update status of KalturaDropFolderFile"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("dropFolderFileId", dropFolderFileId);
        kparams.addIntIfDefined("status", status);
        self.client.queueServiceActionCall("dropfolder_dropfolderfile", "updateStatus", KalturaDropFolderFile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDropFolderFile)

    def delete(self, dropFolderFileId):
        """Mark the KalturaDropFolderFile object as deleted"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("dropFolderFileId", dropFolderFileId);
        self.client.queueServiceActionCall("dropfolder_dropfolderfile", "delete", KalturaDropFolderFile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDropFolderFile)

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List KalturaDropFolderFile objects"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("dropfolder_dropfolderfile", "list", KalturaDropFolderFileListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDropFolderFileListResponse)

    def ignore(self, dropFolderFileId):
        """Set the KalturaDropFolderFile status to ignore (KalturaDropFolderFileStatus::IGNORE)"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("dropFolderFileId", dropFolderFileId);
        self.client.queueServiceActionCall("dropfolder_dropfolderfile", "ignore", KalturaDropFolderFile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDropFolderFile)

########## main ##########
class KalturaDropFolderClientPlugin(KalturaClientPlugin):
    # KalturaDropFolderClientPlugin
    instance = None

    # @return KalturaDropFolderClientPlugin
    @staticmethod
    def get():
        if KalturaDropFolderClientPlugin.instance == None:
            KalturaDropFolderClientPlugin.instance = KalturaDropFolderClientPlugin()
        return KalturaDropFolderClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'dropFolder': KalturaDropFolderService,
            'dropFolderFile': KalturaDropFolderFileService,
        }

    def getEnums(self):
        return {
            'KalturaDropFolderContentFileHandlerMatchPolicy': KalturaDropFolderContentFileHandlerMatchPolicy,
            'KalturaDropFolderFileDeletePolicy': KalturaDropFolderFileDeletePolicy,
            'KalturaDropFolderFileStatus': KalturaDropFolderFileStatus,
            'KalturaDropFolderStatus': KalturaDropFolderStatus,
            'KalturaDropFolderErrorCode': KalturaDropFolderErrorCode,
            'KalturaDropFolderFileErrorCode': KalturaDropFolderFileErrorCode,
            'KalturaDropFolderFileHandlerType': KalturaDropFolderFileHandlerType,
            'KalturaDropFolderFileOrderBy': KalturaDropFolderFileOrderBy,
            'KalturaDropFolderOrderBy': KalturaDropFolderOrderBy,
            'KalturaDropFolderType': KalturaDropFolderType,
            'KalturaFtpDropFolderOrderBy': KalturaFtpDropFolderOrderBy,
            'KalturaRemoteDropFolderOrderBy': KalturaRemoteDropFolderOrderBy,
            'KalturaScpDropFolderOrderBy': KalturaScpDropFolderOrderBy,
            'KalturaSftpDropFolderOrderBy': KalturaSftpDropFolderOrderBy,
            'KalturaSshDropFolderOrderBy': KalturaSshDropFolderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaDropFolderFileHandlerConfig': KalturaDropFolderFileHandlerConfig,
            'KalturaDropFolder': KalturaDropFolder,
            'KalturaDropFolderFile': KalturaDropFolderFile,
            'KalturaDropFolderBaseFilter': KalturaDropFolderBaseFilter,
            'KalturaDropFolderContentFileHandlerConfig': KalturaDropFolderContentFileHandlerConfig,
            'KalturaDropFolderContentProcessorJobData': KalturaDropFolderContentProcessorJobData,
            'KalturaDropFolderFileBaseFilter': KalturaDropFolderFileBaseFilter,
            'KalturaDropFolderFileListResponse': KalturaDropFolderFileListResponse,
            'KalturaDropFolderListResponse': KalturaDropFolderListResponse,
            'KalturaRemoteDropFolder': KalturaRemoteDropFolder,
            'KalturaDropFolderFileFilter': KalturaDropFolderFileFilter,
            'KalturaDropFolderFilter': KalturaDropFolderFilter,
            'KalturaFtpDropFolder': KalturaFtpDropFolder,
            'KalturaSshDropFolder': KalturaSshDropFolder,
            'KalturaDropFolderFileResource': KalturaDropFolderFileResource,
            'KalturaDropFolderImportJobData': KalturaDropFolderImportJobData,
            'KalturaRemoteDropFolderBaseFilter': KalturaRemoteDropFolderBaseFilter,
            'KalturaScpDropFolder': KalturaScpDropFolder,
            'KalturaSftpDropFolder': KalturaSftpDropFolder,
            'KalturaRemoteDropFolderFilter': KalturaRemoteDropFolderFilter,
            'KalturaFtpDropFolderBaseFilter': KalturaFtpDropFolderBaseFilter,
            'KalturaSshDropFolderBaseFilter': KalturaSshDropFolderBaseFilter,
            'KalturaFtpDropFolderFilter': KalturaFtpDropFolderFilter,
            'KalturaSshDropFolderFilter': KalturaSshDropFolderFilter,
            'KalturaScpDropFolderBaseFilter': KalturaScpDropFolderBaseFilter,
            'KalturaSftpDropFolderBaseFilter': KalturaSftpDropFolderBaseFilter,
            'KalturaScpDropFolderFilter': KalturaScpDropFolderFilter,
            'KalturaSftpDropFolderFilter': KalturaSftpDropFolderFilter,
        }

    # @return string
    def getName(self):
        return 'dropFolder'

