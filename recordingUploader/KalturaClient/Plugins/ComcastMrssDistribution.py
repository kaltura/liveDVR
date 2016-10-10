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
from Caption import *
from CuePoint import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaComcastMrssDistributionProfileOrderBy(object):
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
class KalturaComcastMrssDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaComcastMrssDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaComcastMrssDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaComcastMrssDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaComcastMrssDistributionProfile(KalturaConfigurableDistributionProfile):
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
            feedLastBuildDate=NotImplemented,
            itemLink=NotImplemented,
            cPlatformTvSeries=NotImplemented,
            cPlatformTvSeriesField=NotImplemented,
            shouldIncludeCuePoints=NotImplemented,
            shouldIncludeCaptions=NotImplemented,
            shouldAddThumbExtension=NotImplemented):
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
        self.feedLastBuildDate = feedLastBuildDate

        # @var string
        self.itemLink = itemLink

        # @var array of KalturaKeyValue
        self.cPlatformTvSeries = cPlatformTvSeries

        # @var string
        self.cPlatformTvSeriesField = cPlatformTvSeriesField

        # @var bool
        self.shouldIncludeCuePoints = shouldIncludeCuePoints

        # @var bool
        self.shouldIncludeCaptions = shouldIncludeCaptions

        # @var bool
        self.shouldAddThumbExtension = shouldAddThumbExtension


    PROPERTY_LOADERS = {
        'metadataProfileId': getXmlNodeInt, 
        'feedUrl': getXmlNodeText, 
        'feedTitle': getXmlNodeText, 
        'feedLink': getXmlNodeText, 
        'feedDescription': getXmlNodeText, 
        'feedLastBuildDate': getXmlNodeText, 
        'itemLink': getXmlNodeText, 
        'cPlatformTvSeries': (KalturaObjectFactory.createArray, KalturaKeyValue), 
        'cPlatformTvSeriesField': getXmlNodeText, 
        'shouldIncludeCuePoints': getXmlNodeBool, 
        'shouldIncludeCaptions': getXmlNodeBool, 
        'shouldAddThumbExtension': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaComcastMrssDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaComcastMrssDistributionProfile")
        kparams.addIntIfDefined("metadataProfileId", self.metadataProfileId)
        kparams.addStringIfDefined("feedTitle", self.feedTitle)
        kparams.addStringIfDefined("feedLink", self.feedLink)
        kparams.addStringIfDefined("feedDescription", self.feedDescription)
        kparams.addStringIfDefined("feedLastBuildDate", self.feedLastBuildDate)
        kparams.addStringIfDefined("itemLink", self.itemLink)
        kparams.addArrayIfDefined("cPlatformTvSeries", self.cPlatformTvSeries)
        kparams.addStringIfDefined("cPlatformTvSeriesField", self.cPlatformTvSeriesField)
        kparams.addBoolIfDefined("shouldIncludeCuePoints", self.shouldIncludeCuePoints)
        kparams.addBoolIfDefined("shouldIncludeCaptions", self.shouldIncludeCaptions)
        kparams.addBoolIfDefined("shouldAddThumbExtension", self.shouldAddThumbExtension)
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

    def getFeedLastBuildDate(self):
        return self.feedLastBuildDate

    def setFeedLastBuildDate(self, newFeedLastBuildDate):
        self.feedLastBuildDate = newFeedLastBuildDate

    def getItemLink(self):
        return self.itemLink

    def setItemLink(self, newItemLink):
        self.itemLink = newItemLink

    def getCPlatformTvSeries(self):
        return self.cPlatformTvSeries

    def setCPlatformTvSeries(self, newCPlatformTvSeries):
        self.cPlatformTvSeries = newCPlatformTvSeries

    def getCPlatformTvSeriesField(self):
        return self.cPlatformTvSeriesField

    def setCPlatformTvSeriesField(self, newCPlatformTvSeriesField):
        self.cPlatformTvSeriesField = newCPlatformTvSeriesField

    def getShouldIncludeCuePoints(self):
        return self.shouldIncludeCuePoints

    def setShouldIncludeCuePoints(self, newShouldIncludeCuePoints):
        self.shouldIncludeCuePoints = newShouldIncludeCuePoints

    def getShouldIncludeCaptions(self):
        return self.shouldIncludeCaptions

    def setShouldIncludeCaptions(self, newShouldIncludeCaptions):
        self.shouldIncludeCaptions = newShouldIncludeCaptions

    def getShouldAddThumbExtension(self):
        return self.shouldAddThumbExtension

    def setShouldAddThumbExtension(self, newShouldAddThumbExtension):
        self.shouldAddThumbExtension = newShouldAddThumbExtension


# @package Kaltura
# @subpackage Client
class KalturaComcastMrssDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaComcastMrssDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaComcastMrssDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaComcastMrssDistributionProviderFilter(KalturaComcastMrssDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaComcastMrssDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaComcastMrssDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaComcastMrssDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaComcastMrssDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaComcastMrssDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaComcastMrssDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaComcastMrssDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaComcastMrssDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaComcastMrssDistributionProfileFilter(KalturaComcastMrssDistributionProfileBaseFilter):
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
        KalturaComcastMrssDistributionProfileBaseFilter.__init__(self,
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
        KalturaComcastMrssDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaComcastMrssDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaComcastMrssDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaComcastMrssDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaComcastMrssDistributionClientPlugin(KalturaClientPlugin):
    # KalturaComcastMrssDistributionClientPlugin
    instance = None

    # @return KalturaComcastMrssDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaComcastMrssDistributionClientPlugin.instance == None:
            KalturaComcastMrssDistributionClientPlugin.instance = KalturaComcastMrssDistributionClientPlugin()
        return KalturaComcastMrssDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaComcastMrssDistributionProfileOrderBy': KalturaComcastMrssDistributionProfileOrderBy,
            'KalturaComcastMrssDistributionProviderOrderBy': KalturaComcastMrssDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaComcastMrssDistributionProvider': KalturaComcastMrssDistributionProvider,
            'KalturaComcastMrssDistributionProfile': KalturaComcastMrssDistributionProfile,
            'KalturaComcastMrssDistributionProviderBaseFilter': KalturaComcastMrssDistributionProviderBaseFilter,
            'KalturaComcastMrssDistributionProviderFilter': KalturaComcastMrssDistributionProviderFilter,
            'KalturaComcastMrssDistributionProfileBaseFilter': KalturaComcastMrssDistributionProfileBaseFilter,
            'KalturaComcastMrssDistributionProfileFilter': KalturaComcastMrssDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'comcastMrssDistribution'

