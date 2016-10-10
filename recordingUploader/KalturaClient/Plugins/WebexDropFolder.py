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
from DropFolder import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaWebexDropFolderFileOrderBy(object):
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
class KalturaWebexDropFolderOrderBy(object):
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
class KalturaWebexDropFolder(KalturaDropFolder):
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
            webexUserId=NotImplemented,
            webexPassword=NotImplemented,
            webexSiteId=NotImplemented,
            webexPartnerId=NotImplemented,
            webexServiceUrl=NotImplemented,
            webexHostIdMetadataFieldName=NotImplemented):
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

        # @var string
        self.webexUserId = webexUserId

        # @var string
        self.webexPassword = webexPassword

        # @var int
        self.webexSiteId = webexSiteId

        # @var string
        self.webexPartnerId = webexPartnerId

        # @var string
        self.webexServiceUrl = webexServiceUrl

        # @var string
        self.webexHostIdMetadataFieldName = webexHostIdMetadataFieldName


    PROPERTY_LOADERS = {
        'webexUserId': getXmlNodeText, 
        'webexPassword': getXmlNodeText, 
        'webexSiteId': getXmlNodeInt, 
        'webexPartnerId': getXmlNodeText, 
        'webexServiceUrl': getXmlNodeText, 
        'webexHostIdMetadataFieldName': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDropFolder.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWebexDropFolder.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDropFolder.toParams(self)
        kparams.put("objectType", "KalturaWebexDropFolder")
        kparams.addStringIfDefined("webexUserId", self.webexUserId)
        kparams.addStringIfDefined("webexPassword", self.webexPassword)
        kparams.addIntIfDefined("webexSiteId", self.webexSiteId)
        kparams.addStringIfDefined("webexPartnerId", self.webexPartnerId)
        kparams.addStringIfDefined("webexServiceUrl", self.webexServiceUrl)
        kparams.addStringIfDefined("webexHostIdMetadataFieldName", self.webexHostIdMetadataFieldName)
        return kparams

    def getWebexUserId(self):
        return self.webexUserId

    def setWebexUserId(self, newWebexUserId):
        self.webexUserId = newWebexUserId

    def getWebexPassword(self):
        return self.webexPassword

    def setWebexPassword(self, newWebexPassword):
        self.webexPassword = newWebexPassword

    def getWebexSiteId(self):
        return self.webexSiteId

    def setWebexSiteId(self, newWebexSiteId):
        self.webexSiteId = newWebexSiteId

    def getWebexPartnerId(self):
        return self.webexPartnerId

    def setWebexPartnerId(self, newWebexPartnerId):
        self.webexPartnerId = newWebexPartnerId

    def getWebexServiceUrl(self):
        return self.webexServiceUrl

    def setWebexServiceUrl(self, newWebexServiceUrl):
        self.webexServiceUrl = newWebexServiceUrl

    def getWebexHostIdMetadataFieldName(self):
        return self.webexHostIdMetadataFieldName

    def setWebexHostIdMetadataFieldName(self, newWebexHostIdMetadataFieldName):
        self.webexHostIdMetadataFieldName = newWebexHostIdMetadataFieldName


# @package Kaltura
# @subpackage Client
class KalturaWebexDropFolderFile(KalturaDropFolderFile):
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
            batchJobId=NotImplemented,
            recordingId=NotImplemented,
            webexHostId=NotImplemented,
            description=NotImplemented,
            confId=NotImplemented,
            contentUrl=NotImplemented):
        KalturaDropFolderFile.__init__(self,
            id,
            partnerId,
            dropFolderId,
            fileName,
            fileSize,
            fileSizeLastSetAt,
            status,
            type,
            parsedSlug,
            parsedFlavor,
            parsedUserId,
            leadDropFolderFileId,
            deletedDropFolderFileId,
            entryId,
            errorCode,
            errorDescription,
            lastModificationTime,
            createdAt,
            updatedAt,
            uploadStartDetectedAt,
            uploadEndDetectedAt,
            importStartedAt,
            importEndedAt,
            batchJobId)

        # @var int
        self.recordingId = recordingId

        # @var string
        self.webexHostId = webexHostId

        # @var string
        self.description = description

        # @var string
        self.confId = confId

        # @var string
        self.contentUrl = contentUrl


    PROPERTY_LOADERS = {
        'recordingId': getXmlNodeInt, 
        'webexHostId': getXmlNodeText, 
        'description': getXmlNodeText, 
        'confId': getXmlNodeText, 
        'contentUrl': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDropFolderFile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWebexDropFolderFile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDropFolderFile.toParams(self)
        kparams.put("objectType", "KalturaWebexDropFolderFile")
        kparams.addIntIfDefined("recordingId", self.recordingId)
        kparams.addStringIfDefined("webexHostId", self.webexHostId)
        kparams.addStringIfDefined("description", self.description)
        kparams.addStringIfDefined("confId", self.confId)
        kparams.addStringIfDefined("contentUrl", self.contentUrl)
        return kparams

    def getRecordingId(self):
        return self.recordingId

    def setRecordingId(self, newRecordingId):
        self.recordingId = newRecordingId

    def getWebexHostId(self):
        return self.webexHostId

    def setWebexHostId(self, newWebexHostId):
        self.webexHostId = newWebexHostId

    def getDescription(self):
        return self.description

    def setDescription(self, newDescription):
        self.description = newDescription

    def getConfId(self):
        return self.confId

    def setConfId(self, newConfId):
        self.confId = newConfId

    def getContentUrl(self):
        return self.contentUrl

    def setContentUrl(self, newContentUrl):
        self.contentUrl = newContentUrl


# @package Kaltura
# @subpackage Client
class KalturaWebexDropFolderContentProcessorJobData(KalturaDropFolderContentProcessorJobData):
    def __init__(self,
            dropFolderId=NotImplemented,
            dropFolderFileIds=NotImplemented,
            parsedSlug=NotImplemented,
            contentMatchPolicy=NotImplemented,
            conversionProfileId=NotImplemented,
            parsedUserId=NotImplemented,
            description=NotImplemented,
            webexHostId=NotImplemented):
        KalturaDropFolderContentProcessorJobData.__init__(self,
            dropFolderId,
            dropFolderFileIds,
            parsedSlug,
            contentMatchPolicy,
            conversionProfileId,
            parsedUserId)

        # @var string
        self.description = description

        # @var string
        self.webexHostId = webexHostId


    PROPERTY_LOADERS = {
        'description': getXmlNodeText, 
        'webexHostId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDropFolderContentProcessorJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWebexDropFolderContentProcessorJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDropFolderContentProcessorJobData.toParams(self)
        kparams.put("objectType", "KalturaWebexDropFolderContentProcessorJobData")
        kparams.addStringIfDefined("description", self.description)
        kparams.addStringIfDefined("webexHostId", self.webexHostId)
        return kparams

    def getDescription(self):
        return self.description

    def setDescription(self, newDescription):
        self.description = newDescription

    def getWebexHostId(self):
        return self.webexHostId

    def setWebexHostId(self, newWebexHostId):
        self.webexHostId = newWebexHostId


# @package Kaltura
# @subpackage Client
class KalturaWebexDropFolderBaseFilter(KalturaDropFolderFilter):
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
        self.fromXmlImpl(node, KalturaWebexDropFolderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDropFolderFilter.toParams(self)
        kparams.put("objectType", "KalturaWebexDropFolderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaWebexDropFolderFileBaseFilter(KalturaDropFolderFileFilter):
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
        KalturaDropFolderFileFilter.__init__(self,
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
        KalturaDropFolderFileFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWebexDropFolderFileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDropFolderFileFilter.toParams(self)
        kparams.put("objectType", "KalturaWebexDropFolderFileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaWebexDropFolderFileFilter(KalturaWebexDropFolderFileBaseFilter):
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
        KalturaWebexDropFolderFileBaseFilter.__init__(self,
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
        KalturaWebexDropFolderFileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWebexDropFolderFileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaWebexDropFolderFileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaWebexDropFolderFileFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaWebexDropFolderFilter(KalturaWebexDropFolderBaseFilter):
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
        KalturaWebexDropFolderBaseFilter.__init__(self,
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
        KalturaWebexDropFolderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWebexDropFolderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaWebexDropFolderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaWebexDropFolderFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaWebexDropFolderClientPlugin(KalturaClientPlugin):
    # KalturaWebexDropFolderClientPlugin
    instance = None

    # @return KalturaWebexDropFolderClientPlugin
    @staticmethod
    def get():
        if KalturaWebexDropFolderClientPlugin.instance == None:
            KalturaWebexDropFolderClientPlugin.instance = KalturaWebexDropFolderClientPlugin()
        return KalturaWebexDropFolderClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaWebexDropFolderFileOrderBy': KalturaWebexDropFolderFileOrderBy,
            'KalturaWebexDropFolderOrderBy': KalturaWebexDropFolderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaWebexDropFolder': KalturaWebexDropFolder,
            'KalturaWebexDropFolderFile': KalturaWebexDropFolderFile,
            'KalturaWebexDropFolderContentProcessorJobData': KalturaWebexDropFolderContentProcessorJobData,
            'KalturaWebexDropFolderBaseFilter': KalturaWebexDropFolderBaseFilter,
            'KalturaWebexDropFolderFileBaseFilter': KalturaWebexDropFolderFileBaseFilter,
            'KalturaWebexDropFolderFileFilter': KalturaWebexDropFolderFileFilter,
            'KalturaWebexDropFolderFilter': KalturaWebexDropFolderFilter,
        }

    # @return string
    def getName(self):
        return 'WebexDropFolder'

