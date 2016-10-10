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
class KalturaNdnDistributionProfileOrderBy(object):
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
class KalturaNdnDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaNdnDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaNdnDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaNdnDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaNdnDistributionProfile(KalturaConfigurableDistributionProfile):
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
            itemMediaRating=NotImplemented):
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
        self.itemMediaRating = itemMediaRating


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
        'itemMediaRating': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaNdnDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaNdnDistributionProfile")
        kparams.addStringIfDefined("channelTitle", self.channelTitle)
        kparams.addStringIfDefined("channelLink", self.channelLink)
        kparams.addStringIfDefined("channelDescription", self.channelDescription)
        kparams.addStringIfDefined("channelLanguage", self.channelLanguage)
        kparams.addStringIfDefined("channelCopyright", self.channelCopyright)
        kparams.addStringIfDefined("channelImageTitle", self.channelImageTitle)
        kparams.addStringIfDefined("channelImageUrl", self.channelImageUrl)
        kparams.addStringIfDefined("channelImageLink", self.channelImageLink)
        kparams.addStringIfDefined("itemMediaRating", self.itemMediaRating)
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

    def getItemMediaRating(self):
        return self.itemMediaRating

    def setItemMediaRating(self, newItemMediaRating):
        self.itemMediaRating = newItemMediaRating


# @package Kaltura
# @subpackage Client
class KalturaNdnDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaNdnDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaNdnDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaNdnDistributionProviderFilter(KalturaNdnDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaNdnDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaNdnDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaNdnDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaNdnDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaNdnDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaNdnDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaNdnDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaNdnDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaNdnDistributionProfileFilter(KalturaNdnDistributionProfileBaseFilter):
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
        KalturaNdnDistributionProfileBaseFilter.__init__(self,
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
        KalturaNdnDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaNdnDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaNdnDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaNdnDistributionProfileFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaNdnService(KalturaServiceBase):
    """Ndn Service"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def getFeed(self, distributionProfileId, hash):
        kparams = KalturaParams()
        kparams.addIntIfDefined("distributionProfileId", distributionProfileId);
        kparams.addStringIfDefined("hash", hash)
        self.client.queueServiceActionCall('ndndistribution_ndn', 'getFeed', None ,kparams)
        return self.client.getServeUrl()

########## main ##########
class KalturaNdnDistributionClientPlugin(KalturaClientPlugin):
    # KalturaNdnDistributionClientPlugin
    instance = None

    # @return KalturaNdnDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaNdnDistributionClientPlugin.instance == None:
            KalturaNdnDistributionClientPlugin.instance = KalturaNdnDistributionClientPlugin()
        return KalturaNdnDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'ndn': KalturaNdnService,
        }

    def getEnums(self):
        return {
            'KalturaNdnDistributionProfileOrderBy': KalturaNdnDistributionProfileOrderBy,
            'KalturaNdnDistributionProviderOrderBy': KalturaNdnDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaNdnDistributionProvider': KalturaNdnDistributionProvider,
            'KalturaNdnDistributionProfile': KalturaNdnDistributionProfile,
            'KalturaNdnDistributionProviderBaseFilter': KalturaNdnDistributionProviderBaseFilter,
            'KalturaNdnDistributionProviderFilter': KalturaNdnDistributionProviderFilter,
            'KalturaNdnDistributionProfileBaseFilter': KalturaNdnDistributionProfileBaseFilter,
            'KalturaNdnDistributionProfileFilter': KalturaNdnDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'ndnDistribution'

