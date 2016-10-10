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
class KalturaSynacorHboDistributionProfileOrderBy(object):
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
class KalturaSynacorHboDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaSynacorHboDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaSynacorHboDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaSynacorHboDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSynacorHboDistributionProfile(KalturaConfigurableDistributionProfile):
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
            feedTitle=NotImplemented,
            feedSubtitle=NotImplemented,
            feedLink=NotImplemented,
            feedAuthorName=NotImplemented):
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
        self.feedTitle = feedTitle

        # @var string
        self.feedSubtitle = feedSubtitle

        # @var string
        self.feedLink = feedLink

        # @var string
        self.feedAuthorName = feedAuthorName


    PROPERTY_LOADERS = {
        'feedUrl': getXmlNodeText, 
        'feedTitle': getXmlNodeText, 
        'feedSubtitle': getXmlNodeText, 
        'feedLink': getXmlNodeText, 
        'feedAuthorName': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSynacorHboDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaSynacorHboDistributionProfile")
        kparams.addStringIfDefined("feedTitle", self.feedTitle)
        kparams.addStringIfDefined("feedSubtitle", self.feedSubtitle)
        kparams.addStringIfDefined("feedLink", self.feedLink)
        kparams.addStringIfDefined("feedAuthorName", self.feedAuthorName)
        return kparams

    def getFeedUrl(self):
        return self.feedUrl

    def getFeedTitle(self):
        return self.feedTitle

    def setFeedTitle(self, newFeedTitle):
        self.feedTitle = newFeedTitle

    def getFeedSubtitle(self):
        return self.feedSubtitle

    def setFeedSubtitle(self, newFeedSubtitle):
        self.feedSubtitle = newFeedSubtitle

    def getFeedLink(self):
        return self.feedLink

    def setFeedLink(self, newFeedLink):
        self.feedLink = newFeedLink

    def getFeedAuthorName(self):
        return self.feedAuthorName

    def setFeedAuthorName(self, newFeedAuthorName):
        self.feedAuthorName = newFeedAuthorName


# @package Kaltura
# @subpackage Client
class KalturaSynacorHboDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaSynacorHboDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaSynacorHboDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSynacorHboDistributionProviderFilter(KalturaSynacorHboDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaSynacorHboDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaSynacorHboDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSynacorHboDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSynacorHboDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaSynacorHboDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSynacorHboDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaSynacorHboDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaSynacorHboDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSynacorHboDistributionProfileFilter(KalturaSynacorHboDistributionProfileBaseFilter):
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
        KalturaSynacorHboDistributionProfileBaseFilter.__init__(self,
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
        KalturaSynacorHboDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSynacorHboDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSynacorHboDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaSynacorHboDistributionProfileFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaSynacorHboService(KalturaServiceBase):
    """Synacor HBO Service"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def getFeed(self, distributionProfileId, hash):
        kparams = KalturaParams()
        kparams.addIntIfDefined("distributionProfileId", distributionProfileId);
        kparams.addStringIfDefined("hash", hash)
        self.client.queueServiceActionCall('synacorhbodistribution_synacorhbo', 'getFeed', None ,kparams)
        return self.client.getServeUrl()

########## main ##########
class KalturaSynacorHboDistributionClientPlugin(KalturaClientPlugin):
    # KalturaSynacorHboDistributionClientPlugin
    instance = None

    # @return KalturaSynacorHboDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaSynacorHboDistributionClientPlugin.instance == None:
            KalturaSynacorHboDistributionClientPlugin.instance = KalturaSynacorHboDistributionClientPlugin()
        return KalturaSynacorHboDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'synacorHbo': KalturaSynacorHboService,
        }

    def getEnums(self):
        return {
            'KalturaSynacorHboDistributionProfileOrderBy': KalturaSynacorHboDistributionProfileOrderBy,
            'KalturaSynacorHboDistributionProviderOrderBy': KalturaSynacorHboDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaSynacorHboDistributionProvider': KalturaSynacorHboDistributionProvider,
            'KalturaSynacorHboDistributionProfile': KalturaSynacorHboDistributionProfile,
            'KalturaSynacorHboDistributionProviderBaseFilter': KalturaSynacorHboDistributionProviderBaseFilter,
            'KalturaSynacorHboDistributionProviderFilter': KalturaSynacorHboDistributionProviderFilter,
            'KalturaSynacorHboDistributionProfileBaseFilter': KalturaSynacorHboDistributionProfileBaseFilter,
            'KalturaSynacorHboDistributionProfileFilter': KalturaSynacorHboDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'synacorHboDistribution'

