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
class KalturaUverseDistributionProfileOrderBy(object):
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
class KalturaUverseDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaUverseDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaUverseDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaUverseDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaUverseDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            localAssetFilePath=NotImplemented,
            remoteAssetUrl=NotImplemented,
            remoteAssetFileName=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # The local file path of the video asset that needs to be distributed
        # @var string
        self.localAssetFilePath = localAssetFilePath

        # The remote URL of the video asset that was distributed
        # @var string
        self.remoteAssetUrl = remoteAssetUrl

        # The file name of the remote video asset that was distributed
        # @var string
        self.remoteAssetFileName = remoteAssetFileName


    PROPERTY_LOADERS = {
        'localAssetFilePath': getXmlNodeText, 
        'remoteAssetUrl': getXmlNodeText, 
        'remoteAssetFileName': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaUverseDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaUverseDistributionJobProviderData")
        kparams.addStringIfDefined("localAssetFilePath", self.localAssetFilePath)
        kparams.addStringIfDefined("remoteAssetUrl", self.remoteAssetUrl)
        kparams.addStringIfDefined("remoteAssetFileName", self.remoteAssetFileName)
        return kparams

    def getLocalAssetFilePath(self):
        return self.localAssetFilePath

    def setLocalAssetFilePath(self, newLocalAssetFilePath):
        self.localAssetFilePath = newLocalAssetFilePath

    def getRemoteAssetUrl(self):
        return self.remoteAssetUrl

    def setRemoteAssetUrl(self, newRemoteAssetUrl):
        self.remoteAssetUrl = newRemoteAssetUrl

    def getRemoteAssetFileName(self):
        return self.remoteAssetFileName

    def setRemoteAssetFileName(self, newRemoteAssetFileName):
        self.remoteAssetFileName = newRemoteAssetFileName


# @package Kaltura
# @subpackage Client
class KalturaUverseDistributionProfile(KalturaConfigurableDistributionProfile):
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
            channelTitle=NotImplemented,
            channelLink=NotImplemented,
            channelDescription=NotImplemented,
            channelLanguage=NotImplemented,
            channelCopyright=NotImplemented,
            channelImageTitle=NotImplemented,
            channelImageUrl=NotImplemented,
            channelImageLink=NotImplemented,
            ftpHost=NotImplemented,
            ftpLogin=NotImplemented,
            ftpPassword=NotImplemented):
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
        self.channelTitle = channelTitle

        # @var string
        self.channelLink = channelLink

        # @var string
        self.channelDescription = channelDescription

        # @var string
        self.channelLanguage = channelLanguage

        # @var string
        self.channelCopyright = channelCopyright

        # @var string
        self.channelImageTitle = channelImageTitle

        # @var string
        self.channelImageUrl = channelImageUrl

        # @var string
        self.channelImageLink = channelImageLink

        # @var string
        self.ftpHost = ftpHost

        # @var string
        self.ftpLogin = ftpLogin

        # @var string
        self.ftpPassword = ftpPassword


    PROPERTY_LOADERS = {
        'feedUrl': getXmlNodeText, 
        'channelTitle': getXmlNodeText, 
        'channelLink': getXmlNodeText, 
        'channelDescription': getXmlNodeText, 
        'channelLanguage': getXmlNodeText, 
        'channelCopyright': getXmlNodeText, 
        'channelImageTitle': getXmlNodeText, 
        'channelImageUrl': getXmlNodeText, 
        'channelImageLink': getXmlNodeText, 
        'ftpHost': getXmlNodeText, 
        'ftpLogin': getXmlNodeText, 
        'ftpPassword': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaUverseDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaUverseDistributionProfile")
        kparams.addStringIfDefined("channelTitle", self.channelTitle)
        kparams.addStringIfDefined("channelLink", self.channelLink)
        kparams.addStringIfDefined("channelDescription", self.channelDescription)
        kparams.addStringIfDefined("channelLanguage", self.channelLanguage)
        kparams.addStringIfDefined("channelCopyright", self.channelCopyright)
        kparams.addStringIfDefined("channelImageTitle", self.channelImageTitle)
        kparams.addStringIfDefined("channelImageUrl", self.channelImageUrl)
        kparams.addStringIfDefined("channelImageLink", self.channelImageLink)
        kparams.addStringIfDefined("ftpHost", self.ftpHost)
        kparams.addStringIfDefined("ftpLogin", self.ftpLogin)
        kparams.addStringIfDefined("ftpPassword", self.ftpPassword)
        return kparams

    def getFeedUrl(self):
        return self.feedUrl

    def getChannelTitle(self):
        return self.channelTitle

    def setChannelTitle(self, newChannelTitle):
        self.channelTitle = newChannelTitle

    def getChannelLink(self):
        return self.channelLink

    def setChannelLink(self, newChannelLink):
        self.channelLink = newChannelLink

    def getChannelDescription(self):
        return self.channelDescription

    def setChannelDescription(self, newChannelDescription):
        self.channelDescription = newChannelDescription

    def getChannelLanguage(self):
        return self.channelLanguage

    def setChannelLanguage(self, newChannelLanguage):
        self.channelLanguage = newChannelLanguage

    def getChannelCopyright(self):
        return self.channelCopyright

    def setChannelCopyright(self, newChannelCopyright):
        self.channelCopyright = newChannelCopyright

    def getChannelImageTitle(self):
        return self.channelImageTitle

    def setChannelImageTitle(self, newChannelImageTitle):
        self.channelImageTitle = newChannelImageTitle

    def getChannelImageUrl(self):
        return self.channelImageUrl

    def setChannelImageUrl(self, newChannelImageUrl):
        self.channelImageUrl = newChannelImageUrl

    def getChannelImageLink(self):
        return self.channelImageLink

    def setChannelImageLink(self, newChannelImageLink):
        self.channelImageLink = newChannelImageLink

    def getFtpHost(self):
        return self.ftpHost

    def setFtpHost(self, newFtpHost):
        self.ftpHost = newFtpHost

    def getFtpLogin(self):
        return self.ftpLogin

    def setFtpLogin(self, newFtpLogin):
        self.ftpLogin = newFtpLogin

    def getFtpPassword(self):
        return self.ftpPassword

    def setFtpPassword(self, newFtpPassword):
        self.ftpPassword = newFtpPassword


# @package Kaltura
# @subpackage Client
class KalturaUverseDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaUverseDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaUverseDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaUverseDistributionProviderFilter(KalturaUverseDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaUverseDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaUverseDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaUverseDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaUverseDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaUverseDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaUverseDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaUverseDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaUverseDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaUverseDistributionProfileFilter(KalturaUverseDistributionProfileBaseFilter):
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
        KalturaUverseDistributionProfileBaseFilter.__init__(self,
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
        KalturaUverseDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaUverseDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaUverseDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaUverseDistributionProfileFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaUverseService(KalturaServiceBase):
    """Uverse Service"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def getFeed(self, distributionProfileId, hash):
        kparams = KalturaParams()
        kparams.addIntIfDefined("distributionProfileId", distributionProfileId);
        kparams.addStringIfDefined("hash", hash)
        self.client.queueServiceActionCall('uversedistribution_uverse', 'getFeed', None ,kparams)
        return self.client.getServeUrl()

########## main ##########
class KalturaUverseDistributionClientPlugin(KalturaClientPlugin):
    # KalturaUverseDistributionClientPlugin
    instance = None

    # @return KalturaUverseDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaUverseDistributionClientPlugin.instance == None:
            KalturaUverseDistributionClientPlugin.instance = KalturaUverseDistributionClientPlugin()
        return KalturaUverseDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'uverse': KalturaUverseService,
        }

    def getEnums(self):
        return {
            'KalturaUverseDistributionProfileOrderBy': KalturaUverseDistributionProfileOrderBy,
            'KalturaUverseDistributionProviderOrderBy': KalturaUverseDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaUverseDistributionProvider': KalturaUverseDistributionProvider,
            'KalturaUverseDistributionJobProviderData': KalturaUverseDistributionJobProviderData,
            'KalturaUverseDistributionProfile': KalturaUverseDistributionProfile,
            'KalturaUverseDistributionProviderBaseFilter': KalturaUverseDistributionProviderBaseFilter,
            'KalturaUverseDistributionProviderFilter': KalturaUverseDistributionProviderFilter,
            'KalturaUverseDistributionProfileBaseFilter': KalturaUverseDistributionProfileBaseFilter,
            'KalturaUverseDistributionProfileFilter': KalturaUverseDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'uverseDistribution'

