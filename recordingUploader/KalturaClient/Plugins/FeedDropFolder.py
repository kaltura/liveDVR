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
class KalturaFeedDropFolderFileOrderBy(object):
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
class KalturaFeedDropFolderOrderBy(object):
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
class KalturaFeedItemInfo(KalturaObjectBase):
    def __init__(self,
            itemXPath=NotImplemented,
            itemPublishDateXPath=NotImplemented,
            itemUniqueIdentifierXPath=NotImplemented,
            itemContentFileSizeXPath=NotImplemented,
            itemContentUrlXPath=NotImplemented,
            itemContentBitrateXPath=NotImplemented,
            itemHashXPath=NotImplemented,
            itemContentXpath=NotImplemented,
            contentBitrateAttributeName=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var string
        self.itemXPath = itemXPath

        # @var string
        self.itemPublishDateXPath = itemPublishDateXPath

        # @var string
        self.itemUniqueIdentifierXPath = itemUniqueIdentifierXPath

        # @var string
        self.itemContentFileSizeXPath = itemContentFileSizeXPath

        # @var string
        self.itemContentUrlXPath = itemContentUrlXPath

        # @var string
        self.itemContentBitrateXPath = itemContentBitrateXPath

        # @var string
        self.itemHashXPath = itemHashXPath

        # @var string
        self.itemContentXpath = itemContentXpath

        # @var string
        self.contentBitrateAttributeName = contentBitrateAttributeName


    PROPERTY_LOADERS = {
        'itemXPath': getXmlNodeText, 
        'itemPublishDateXPath': getXmlNodeText, 
        'itemUniqueIdentifierXPath': getXmlNodeText, 
        'itemContentFileSizeXPath': getXmlNodeText, 
        'itemContentUrlXPath': getXmlNodeText, 
        'itemContentBitrateXPath': getXmlNodeText, 
        'itemHashXPath': getXmlNodeText, 
        'itemContentXpath': getXmlNodeText, 
        'contentBitrateAttributeName': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFeedItemInfo.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaFeedItemInfo")
        kparams.addStringIfDefined("itemXPath", self.itemXPath)
        kparams.addStringIfDefined("itemPublishDateXPath", self.itemPublishDateXPath)
        kparams.addStringIfDefined("itemUniqueIdentifierXPath", self.itemUniqueIdentifierXPath)
        kparams.addStringIfDefined("itemContentFileSizeXPath", self.itemContentFileSizeXPath)
        kparams.addStringIfDefined("itemContentUrlXPath", self.itemContentUrlXPath)
        kparams.addStringIfDefined("itemContentBitrateXPath", self.itemContentBitrateXPath)
        kparams.addStringIfDefined("itemHashXPath", self.itemHashXPath)
        kparams.addStringIfDefined("itemContentXpath", self.itemContentXpath)
        kparams.addStringIfDefined("contentBitrateAttributeName", self.contentBitrateAttributeName)
        return kparams

    def getItemXPath(self):
        return self.itemXPath

    def setItemXPath(self, newItemXPath):
        self.itemXPath = newItemXPath

    def getItemPublishDateXPath(self):
        return self.itemPublishDateXPath

    def setItemPublishDateXPath(self, newItemPublishDateXPath):
        self.itemPublishDateXPath = newItemPublishDateXPath

    def getItemUniqueIdentifierXPath(self):
        return self.itemUniqueIdentifierXPath

    def setItemUniqueIdentifierXPath(self, newItemUniqueIdentifierXPath):
        self.itemUniqueIdentifierXPath = newItemUniqueIdentifierXPath

    def getItemContentFileSizeXPath(self):
        return self.itemContentFileSizeXPath

    def setItemContentFileSizeXPath(self, newItemContentFileSizeXPath):
        self.itemContentFileSizeXPath = newItemContentFileSizeXPath

    def getItemContentUrlXPath(self):
        return self.itemContentUrlXPath

    def setItemContentUrlXPath(self, newItemContentUrlXPath):
        self.itemContentUrlXPath = newItemContentUrlXPath

    def getItemContentBitrateXPath(self):
        return self.itemContentBitrateXPath

    def setItemContentBitrateXPath(self, newItemContentBitrateXPath):
        self.itemContentBitrateXPath = newItemContentBitrateXPath

    def getItemHashXPath(self):
        return self.itemHashXPath

    def setItemHashXPath(self, newItemHashXPath):
        self.itemHashXPath = newItemHashXPath

    def getItemContentXpath(self):
        return self.itemContentXpath

    def setItemContentXpath(self, newItemContentXpath):
        self.itemContentXpath = newItemContentXpath

    def getContentBitrateAttributeName(self):
        return self.contentBitrateAttributeName

    def setContentBitrateAttributeName(self, newContentBitrateAttributeName):
        self.contentBitrateAttributeName = newContentBitrateAttributeName


# @package Kaltura
# @subpackage Client
class KalturaFeedDropFolder(KalturaDropFolder):
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
            itemHandlingLimit=NotImplemented,
            feedItemInfo=NotImplemented):
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

        # @var int
        self.itemHandlingLimit = itemHandlingLimit

        # @var KalturaFeedItemInfo
        self.feedItemInfo = feedItemInfo


    PROPERTY_LOADERS = {
        'itemHandlingLimit': getXmlNodeInt, 
        'feedItemInfo': (KalturaObjectFactory.create, KalturaFeedItemInfo), 
    }

    def fromXml(self, node):
        KalturaDropFolder.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFeedDropFolder.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDropFolder.toParams(self)
        kparams.put("objectType", "KalturaFeedDropFolder")
        kparams.addIntIfDefined("itemHandlingLimit", self.itemHandlingLimit)
        kparams.addObjectIfDefined("feedItemInfo", self.feedItemInfo)
        return kparams

    def getItemHandlingLimit(self):
        return self.itemHandlingLimit

    def setItemHandlingLimit(self, newItemHandlingLimit):
        self.itemHandlingLimit = newItemHandlingLimit

    def getFeedItemInfo(self):
        return self.feedItemInfo

    def setFeedItemInfo(self, newFeedItemInfo):
        self.feedItemInfo = newFeedItemInfo


# @package Kaltura
# @subpackage Client
class KalturaFeedDropFolderFile(KalturaDropFolderFile):
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
            hash=NotImplemented,
            feedXmlPath=NotImplemented):
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

        # MD5 or Sha1 encrypted string
        # @var string
        self.hash = hash

        # Path of the original Feed content XML
        # @var string
        self.feedXmlPath = feedXmlPath


    PROPERTY_LOADERS = {
        'hash': getXmlNodeText, 
        'feedXmlPath': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDropFolderFile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFeedDropFolderFile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDropFolderFile.toParams(self)
        kparams.put("objectType", "KalturaFeedDropFolderFile")
        kparams.addStringIfDefined("hash", self.hash)
        kparams.addStringIfDefined("feedXmlPath", self.feedXmlPath)
        return kparams

    def getHash(self):
        return self.hash

    def setHash(self, newHash):
        self.hash = newHash

    def getFeedXmlPath(self):
        return self.feedXmlPath

    def setFeedXmlPath(self, newFeedXmlPath):
        self.feedXmlPath = newFeedXmlPath


# @package Kaltura
# @subpackage Client
class KalturaFeedDropFolderBaseFilter(KalturaDropFolderFilter):
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
        self.fromXmlImpl(node, KalturaFeedDropFolderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDropFolderFilter.toParams(self)
        kparams.put("objectType", "KalturaFeedDropFolderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFeedDropFolderFileBaseFilter(KalturaDropFolderFileFilter):
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
        self.fromXmlImpl(node, KalturaFeedDropFolderFileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDropFolderFileFilter.toParams(self)
        kparams.put("objectType", "KalturaFeedDropFolderFileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFeedDropFolderFileFilter(KalturaFeedDropFolderFileBaseFilter):
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
        KalturaFeedDropFolderFileBaseFilter.__init__(self,
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
        KalturaFeedDropFolderFileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFeedDropFolderFileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFeedDropFolderFileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaFeedDropFolderFileFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFeedDropFolderFilter(KalturaFeedDropFolderBaseFilter):
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
        KalturaFeedDropFolderBaseFilter.__init__(self,
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
        KalturaFeedDropFolderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFeedDropFolderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFeedDropFolderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaFeedDropFolderFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaFeedDropFolderClientPlugin(KalturaClientPlugin):
    # KalturaFeedDropFolderClientPlugin
    instance = None

    # @return KalturaFeedDropFolderClientPlugin
    @staticmethod
    def get():
        if KalturaFeedDropFolderClientPlugin.instance == None:
            KalturaFeedDropFolderClientPlugin.instance = KalturaFeedDropFolderClientPlugin()
        return KalturaFeedDropFolderClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaFeedDropFolderFileOrderBy': KalturaFeedDropFolderFileOrderBy,
            'KalturaFeedDropFolderOrderBy': KalturaFeedDropFolderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaFeedItemInfo': KalturaFeedItemInfo,
            'KalturaFeedDropFolder': KalturaFeedDropFolder,
            'KalturaFeedDropFolderFile': KalturaFeedDropFolderFile,
            'KalturaFeedDropFolderBaseFilter': KalturaFeedDropFolderBaseFilter,
            'KalturaFeedDropFolderFileBaseFilter': KalturaFeedDropFolderFileBaseFilter,
            'KalturaFeedDropFolderFileFilter': KalturaFeedDropFolderFileFilter,
            'KalturaFeedDropFolderFilter': KalturaFeedDropFolderFilter,
        }

    # @return string
    def getName(self):
        return 'FeedDropFolder'

