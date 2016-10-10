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
class KalturaTVComDistributionProfileOrderBy(object):
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
class KalturaTVComDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaTVComDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaTVComDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaTVComDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaTVComDistributionProfile(KalturaConfigurableDistributionProfile):
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
            metadataProfileId=NotImplemented,
            feedUrl=NotImplemented,
            feedTitle=NotImplemented,
            feedLink=NotImplemented,
            feedDescription=NotImplemented,
            feedLanguage=NotImplemented,
            feedCopyright=NotImplemented,
            feedImageTitle=NotImplemented,
            feedImageUrl=NotImplemented,
            feedImageLink=NotImplemented,
            feedImageWidth=NotImplemented,
            feedImageHeight=NotImplemented):
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

        # @var int
        self.metadataProfileId = metadataProfileId

        # @var string
        # @readonly
        self.feedUrl = feedUrl

        # @var string
        self.feedTitle = feedTitle

        # @var string
        self.feedLink = feedLink

        # @var string
        self.feedDescription = feedDescription

        # @var string
        self.feedLanguage = feedLanguage

        # @var string
        self.feedCopyright = feedCopyright

        # @var string
        self.feedImageTitle = feedImageTitle

        # @var string
        self.feedImageUrl = feedImageUrl

        # @var string
        self.feedImageLink = feedImageLink

        # @var int
        self.feedImageWidth = feedImageWidth

        # @var int
        self.feedImageHeight = feedImageHeight


    PROPERTY_LOADERS = {
        'metadataProfileId': getXmlNodeInt, 
        'feedUrl': getXmlNodeText, 
        'feedTitle': getXmlNodeText, 
        'feedLink': getXmlNodeText, 
        'feedDescription': getXmlNodeText, 
        'feedLanguage': getXmlNodeText, 
        'feedCopyright': getXmlNodeText, 
        'feedImageTitle': getXmlNodeText, 
        'feedImageUrl': getXmlNodeText, 
        'feedImageLink': getXmlNodeText, 
        'feedImageWidth': getXmlNodeInt, 
        'feedImageHeight': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaTVComDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaTVComDistributionProfile")
        kparams.addIntIfDefined("metadataProfileId", self.metadataProfileId)
        kparams.addStringIfDefined("feedTitle", self.feedTitle)
        kparams.addStringIfDefined("feedLink", self.feedLink)
        kparams.addStringIfDefined("feedDescription", self.feedDescription)
        kparams.addStringIfDefined("feedLanguage", self.feedLanguage)
        kparams.addStringIfDefined("feedCopyright", self.feedCopyright)
        kparams.addStringIfDefined("feedImageTitle", self.feedImageTitle)
        kparams.addStringIfDefined("feedImageUrl", self.feedImageUrl)
        kparams.addStringIfDefined("feedImageLink", self.feedImageLink)
        kparams.addIntIfDefined("feedImageWidth", self.feedImageWidth)
        kparams.addIntIfDefined("feedImageHeight", self.feedImageHeight)
        return kparams

    def getMetadataProfileId(self):
        return self.metadataProfileId

    def setMetadataProfileId(self, newMetadataProfileId):
        self.metadataProfileId = newMetadataProfileId

    def getFeedUrl(self):
        return self.feedUrl

    def getFeedTitle(self):
        return self.feedTitle

    def setFeedTitle(self, newFeedTitle):
        self.feedTitle = newFeedTitle

    def getFeedLink(self):
        return self.feedLink

    def setFeedLink(self, newFeedLink):
        self.feedLink = newFeedLink

    def getFeedDescription(self):
        return self.feedDescription

    def setFeedDescription(self, newFeedDescription):
        self.feedDescription = newFeedDescription

    def getFeedLanguage(self):
        return self.feedLanguage

    def setFeedLanguage(self, newFeedLanguage):
        self.feedLanguage = newFeedLanguage

    def getFeedCopyright(self):
        return self.feedCopyright

    def setFeedCopyright(self, newFeedCopyright):
        self.feedCopyright = newFeedCopyright

    def getFeedImageTitle(self):
        return self.feedImageTitle

    def setFeedImageTitle(self, newFeedImageTitle):
        self.feedImageTitle = newFeedImageTitle

    def getFeedImageUrl(self):
        return self.feedImageUrl

    def setFeedImageUrl(self, newFeedImageUrl):
        self.feedImageUrl = newFeedImageUrl

    def getFeedImageLink(self):
        return self.feedImageLink

    def setFeedImageLink(self, newFeedImageLink):
        self.feedImageLink = newFeedImageLink

    def getFeedImageWidth(self):
        return self.feedImageWidth

    def setFeedImageWidth(self, newFeedImageWidth):
        self.feedImageWidth = newFeedImageWidth

    def getFeedImageHeight(self):
        return self.feedImageHeight

    def setFeedImageHeight(self, newFeedImageHeight):
        self.feedImageHeight = newFeedImageHeight


# @package Kaltura
# @subpackage Client
class KalturaTVComDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaTVComDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaTVComDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaTVComDistributionProviderFilter(KalturaTVComDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaTVComDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaTVComDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaTVComDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaTVComDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaTVComDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaTVComDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaTVComDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaTVComDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaTVComDistributionProfileFilter(KalturaTVComDistributionProfileBaseFilter):
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
        KalturaTVComDistributionProfileBaseFilter.__init__(self,
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
        KalturaTVComDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaTVComDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaTVComDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaTVComDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaTvComDistributionClientPlugin(KalturaClientPlugin):
    # KalturaTvComDistributionClientPlugin
    instance = None

    # @return KalturaTvComDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaTvComDistributionClientPlugin.instance == None:
            KalturaTvComDistributionClientPlugin.instance = KalturaTvComDistributionClientPlugin()
        return KalturaTvComDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaTVComDistributionProfileOrderBy': KalturaTVComDistributionProfileOrderBy,
            'KalturaTVComDistributionProviderOrderBy': KalturaTVComDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaTVComDistributionProvider': KalturaTVComDistributionProvider,
            'KalturaTVComDistributionProfile': KalturaTVComDistributionProfile,
            'KalturaTVComDistributionProviderBaseFilter': KalturaTVComDistributionProviderBaseFilter,
            'KalturaTVComDistributionProviderFilter': KalturaTVComDistributionProviderFilter,
            'KalturaTVComDistributionProfileBaseFilter': KalturaTVComDistributionProfileBaseFilter,
            'KalturaTVComDistributionProfileFilter': KalturaTVComDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'tvComDistribution'

