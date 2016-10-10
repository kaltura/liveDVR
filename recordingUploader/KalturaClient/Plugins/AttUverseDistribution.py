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
from ContentDistribution import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaAttUverseDistributionProfileOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaAttUverseDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaAttUverseDistributionFile(KalturaObjectBase):
    def __init__(self,
            remoteFilename=NotImplemented,
            localFilePath=NotImplemented,
            assetType=NotImplemented,
            assetId=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var string
        self.remoteFilename = remoteFilename

        # @var string
        self.localFilePath = localFilePath

        # @var KalturaAssetType
        self.assetType = assetType

        # @var string
        self.assetId = assetId


    PROPERTY_LOADERS = {
        'remoteFilename': getXmlNodeText, 
        'localFilePath': getXmlNodeText, 
        'assetType': (KalturaEnumsFactory.createString, "KalturaAssetType"), 
        'assetId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAttUverseDistributionFile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaAttUverseDistributionFile")
        kparams.addStringIfDefined("remoteFilename", self.remoteFilename)
        kparams.addStringIfDefined("localFilePath", self.localFilePath)
        kparams.addStringEnumIfDefined("assetType", self.assetType)
        kparams.addStringIfDefined("assetId", self.assetId)
        return kparams

    def getRemoteFilename(self):
        return self.remoteFilename

    def setRemoteFilename(self, newRemoteFilename):
        self.remoteFilename = newRemoteFilename

    def getLocalFilePath(self):
        return self.localFilePath

    def setLocalFilePath(self, newLocalFilePath):
        self.localFilePath = newLocalFilePath

    def getAssetType(self):
        return self.assetType

    def setAssetType(self, newAssetType):
        self.assetType = newAssetType

    def getAssetId(self):
        return self.assetId

    def setAssetId(self, newAssetId):
        self.assetId = newAssetId


# @package Kaltura
# @subpackage Client
class KalturaAttUverseDistributionProvider(KalturaDistributionProvider):
    def __init__(self,
            type=NotImplemented,
            name=NotImplemented,
            scheduleUpdateEnabled=NotImplemented,
            availabilityUpdateEnabled=NotImplemented,
            deleteInsteadUpdate=NotImplemented,
            intervalBeforeSunrise=NotImplemented,
            intervalBeforeSunset=NotImplemented,
            updateRequiredEntryFields=NotImplemented,
            updateRequiredMetadataXPaths=NotImplemented):
        KalturaDistributionProvider.__init__(self,
            type,
            name,
            scheduleUpdateEnabled,
            availabilityUpdateEnabled,
            deleteInsteadUpdate,
            intervalBeforeSunrise,
            intervalBeforeSunset,
            updateRequiredEntryFields,
            updateRequiredMetadataXPaths)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDistributionProvider.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAttUverseDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaAttUverseDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaAttUverseDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            filesForDistribution=NotImplemented,
            remoteAssetFileUrls=NotImplemented,
            remoteThumbnailFileUrls=NotImplemented,
            remoteCaptionFileUrls=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # @var array of KalturaAttUverseDistributionFile
        self.filesForDistribution = filesForDistribution

        # The remote URL of the video asset that was distributed
        # @var string
        self.remoteAssetFileUrls = remoteAssetFileUrls

        # The remote URL of the thumbnail asset that was distributed
        # @var string
        self.remoteThumbnailFileUrls = remoteThumbnailFileUrls

        # The remote URL of the caption asset that was distributed
        # @var string
        self.remoteCaptionFileUrls = remoteCaptionFileUrls


    PROPERTY_LOADERS = {
        'filesForDistribution': (KalturaObjectFactory.createArray, KalturaAttUverseDistributionFile), 
        'remoteAssetFileUrls': getXmlNodeText, 
        'remoteThumbnailFileUrls': getXmlNodeText, 
        'remoteCaptionFileUrls': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAttUverseDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaAttUverseDistributionJobProviderData")
        kparams.addArrayIfDefined("filesForDistribution", self.filesForDistribution)
        kparams.addStringIfDefined("remoteAssetFileUrls", self.remoteAssetFileUrls)
        kparams.addStringIfDefined("remoteThumbnailFileUrls", self.remoteThumbnailFileUrls)
        kparams.addStringIfDefined("remoteCaptionFileUrls", self.remoteCaptionFileUrls)
        return kparams

    def getFilesForDistribution(self):
        return self.filesForDistribution

    def setFilesForDistribution(self, newFilesForDistribution):
        self.filesForDistribution = newFilesForDistribution

    def getRemoteAssetFileUrls(self):
        return self.remoteAssetFileUrls

    def setRemoteAssetFileUrls(self, newRemoteAssetFileUrls):
        self.remoteAssetFileUrls = newRemoteAssetFileUrls

    def getRemoteThumbnailFileUrls(self):
        return self.remoteThumbnailFileUrls

    def setRemoteThumbnailFileUrls(self, newRemoteThumbnailFileUrls):
        self.remoteThumbnailFileUrls = newRemoteThumbnailFileUrls

    def getRemoteCaptionFileUrls(self):
        return self.remoteCaptionFileUrls

    def setRemoteCaptionFileUrls(self, newRemoteCaptionFileUrls):
        self.remoteCaptionFileUrls = newRemoteCaptionFileUrls


# @package Kaltura
# @subpackage Client
class KalturaAttUverseDistributionProfile(KalturaConfigurableDistributionProfile):
    def __init__(self,
            id=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            partnerId=NotImplemented,
            providerType=NotImplemented,
            name=NotImplemented,
            status=NotImplemented,
            submitEnabled=NotImplemented,
            updateEnabled=NotImplemented,
            deleteEnabled=NotImplemented,
            reportEnabled=NotImplemented,
            autoCreateFlavors=NotImplemented,
            autoCreateThumb=NotImplemented,
            optionalFlavorParamsIds=NotImplemented,
            requiredFlavorParamsIds=NotImplemented,
            optionalThumbDimensions=NotImplemented,
            requiredThumbDimensions=NotImplemented,
            optionalAssetDistributionRules=NotImplemented,
            requiredAssetDistributionRules=NotImplemented,
            sunriseDefaultOffset=NotImplemented,
            sunsetDefaultOffset=NotImplemented,
            recommendedStorageProfileForDownload=NotImplemented,
            recommendedDcForDownload=NotImplemented,
            recommendedDcForExecute=NotImplemented,
            fieldConfigArray=NotImplemented,
            itemXpathsToExtend=NotImplemented,
            useCategoryEntries=NotImplemented,
            feedUrl=NotImplemented,
            ftpHost=NotImplemented,
            ftpUsername=NotImplemented,
            ftpPassword=NotImplemented,
            ftpPath=NotImplemented,
            channelTitle=NotImplemented,
            flavorAssetFilenameXslt=NotImplemented,
            thumbnailAssetFilenameXslt=NotImplemented,
            assetFilenameXslt=NotImplemented):
        KalturaConfigurableDistributionProfile.__init__(self,
            id,
            createdAt,
            updatedAt,
            partnerId,
            providerType,
            name,
            status,
            submitEnabled,
            updateEnabled,
            deleteEnabled,
            reportEnabled,
            autoCreateFlavors,
            autoCreateThumb,
            optionalFlavorParamsIds,
            requiredFlavorParamsIds,
            optionalThumbDimensions,
            requiredThumbDimensions,
            optionalAssetDistributionRules,
            requiredAssetDistributionRules,
            sunriseDefaultOffset,
            sunsetDefaultOffset,
            recommendedStorageProfileForDownload,
            recommendedDcForDownload,
            recommendedDcForExecute,
            fieldConfigArray,
            itemXpathsToExtend,
            useCategoryEntries)

        # @var string
        # @readonly
        self.feedUrl = feedUrl

        # @var string
        self.ftpHost = ftpHost

        # @var string
        self.ftpUsername = ftpUsername

        # @var string
        self.ftpPassword = ftpPassword

        # @var string
        self.ftpPath = ftpPath

        # @var string
        self.channelTitle = channelTitle

        # @var string
        self.flavorAssetFilenameXslt = flavorAssetFilenameXslt

        # @var string
        self.thumbnailAssetFilenameXslt = thumbnailAssetFilenameXslt

        # @var string
        self.assetFilenameXslt = assetFilenameXslt


    PROPERTY_LOADERS = {
        'feedUrl': getXmlNodeText, 
        'ftpHost': getXmlNodeText, 
        'ftpUsername': getXmlNodeText, 
        'ftpPassword': getXmlNodeText, 
        'ftpPath': getXmlNodeText, 
        'channelTitle': getXmlNodeText, 
        'flavorAssetFilenameXslt': getXmlNodeText, 
        'thumbnailAssetFilenameXslt': getXmlNodeText, 
        'assetFilenameXslt': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAttUverseDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaAttUverseDistributionProfile")
        kparams.addStringIfDefined("ftpHost", self.ftpHost)
        kparams.addStringIfDefined("ftpUsername", self.ftpUsername)
        kparams.addStringIfDefined("ftpPassword", self.ftpPassword)
        kparams.addStringIfDefined("ftpPath", self.ftpPath)
        kparams.addStringIfDefined("channelTitle", self.channelTitle)
        kparams.addStringIfDefined("flavorAssetFilenameXslt", self.flavorAssetFilenameXslt)
        kparams.addStringIfDefined("thumbnailAssetFilenameXslt", self.thumbnailAssetFilenameXslt)
        kparams.addStringIfDefined("assetFilenameXslt", self.assetFilenameXslt)
        return kparams

    def getFeedUrl(self):
        return self.feedUrl

    def getFtpHost(self):
        return self.ftpHost

    def setFtpHost(self, newFtpHost):
        self.ftpHost = newFtpHost

    def getFtpUsername(self):
        return self.ftpUsername

    def setFtpUsername(self, newFtpUsername):
        self.ftpUsername = newFtpUsername

    def getFtpPassword(self):
        return self.ftpPassword

    def setFtpPassword(self, newFtpPassword):
        self.ftpPassword = newFtpPassword

    def getFtpPath(self):
        return self.ftpPath

    def setFtpPath(self, newFtpPath):
        self.ftpPath = newFtpPath

    def getChannelTitle(self):
        return self.channelTitle

    def setChannelTitle(self, newChannelTitle):
        self.channelTitle = newChannelTitle

    def getFlavorAssetFilenameXslt(self):
        return self.flavorAssetFilenameXslt

    def setFlavorAssetFilenameXslt(self, newFlavorAssetFilenameXslt):
        self.flavorAssetFilenameXslt = newFlavorAssetFilenameXslt

    def getThumbnailAssetFilenameXslt(self):
        return self.thumbnailAssetFilenameXslt

    def setThumbnailAssetFilenameXslt(self, newThumbnailAssetFilenameXslt):
        self.thumbnailAssetFilenameXslt = newThumbnailAssetFilenameXslt

    def getAssetFilenameXslt(self):
        return self.assetFilenameXslt

    def setAssetFilenameXslt(self, newAssetFilenameXslt):
        self.assetFilenameXslt = newAssetFilenameXslt


# @package Kaltura
# @subpackage Client
class KalturaAttUverseDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaDistributionProviderFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDistributionProviderFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAttUverseDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaAttUverseDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaAttUverseDistributionProviderFilter(KalturaAttUverseDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaAttUverseDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaAttUverseDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAttUverseDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaAttUverseDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaAttUverseDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaAttUverseDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented):
        KalturaConfigurableDistributionProfileFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            statusEqual,
            statusIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfileFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAttUverseDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaAttUverseDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaAttUverseDistributionProfileFilter(KalturaAttUverseDistributionProfileBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented):
        KalturaAttUverseDistributionProfileBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            statusEqual,
            statusIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaAttUverseDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAttUverseDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaAttUverseDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaAttUverseDistributionProfileFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaAttUverseService(KalturaServiceBase):
    """Att Uverse Service"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def getFeed(self, distributionProfileId, hash):
        kparams = KalturaParams()
        kparams.addIntIfDefined("distributionProfileId", distributionProfileId);
        kparams.addStringIfDefined("hash", hash)
        self.client.queueServiceActionCall('attuversedistribution_attuverse', 'getFeed', None ,kparams)
        return self.client.getServeUrl()

########## main ##########
class KalturaAttUverseDistributionClientPlugin(KalturaClientPlugin):
    # KalturaAttUverseDistributionClientPlugin
    instance = None

    # @return KalturaAttUverseDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaAttUverseDistributionClientPlugin.instance == None:
            KalturaAttUverseDistributionClientPlugin.instance = KalturaAttUverseDistributionClientPlugin()
        return KalturaAttUverseDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'attUverse': KalturaAttUverseService,
        }

    def getEnums(self):
        return {
            'KalturaAttUverseDistributionProfileOrderBy': KalturaAttUverseDistributionProfileOrderBy,
            'KalturaAttUverseDistributionProviderOrderBy': KalturaAttUverseDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaAttUverseDistributionFile': KalturaAttUverseDistributionFile,
            'KalturaAttUverseDistributionProvider': KalturaAttUverseDistributionProvider,
            'KalturaAttUverseDistributionJobProviderData': KalturaAttUverseDistributionJobProviderData,
            'KalturaAttUverseDistributionProfile': KalturaAttUverseDistributionProfile,
            'KalturaAttUverseDistributionProviderBaseFilter': KalturaAttUverseDistributionProviderBaseFilter,
            'KalturaAttUverseDistributionProviderFilter': KalturaAttUverseDistributionProviderFilter,
            'KalturaAttUverseDistributionProfileBaseFilter': KalturaAttUverseDistributionProfileBaseFilter,
            'KalturaAttUverseDistributionProfileFilter': KalturaAttUverseDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'attUverseDistribution'

