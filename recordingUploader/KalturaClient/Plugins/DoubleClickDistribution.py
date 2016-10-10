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
from CuePoint import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaDoubleClickDistributionProfileOrderBy(object):
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
class KalturaDoubleClickDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaDoubleClickDistributionJobProviderData(KalturaDistributionJobProviderData):
    def __init__(self):
        KalturaDistributionJobProviderData.__init__(self)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDoubleClickDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaDoubleClickDistributionJobProviderData")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDoubleClickDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaDoubleClickDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaDoubleClickDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDoubleClickDistributionProfile(KalturaConfigurableDistributionProfile):
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
            channelTitle=NotImplemented,
            channelLink=NotImplemented,
            channelDescription=NotImplemented,
            feedUrl=NotImplemented,
            cuePointsProvider=NotImplemented,
            itemsPerPage=NotImplemented,
            ignoreSchedulingInFeed=NotImplemented):
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
        self.channelTitle = channelTitle

        # @var string
        self.channelLink = channelLink

        # @var string
        self.channelDescription = channelDescription

        # @var string
        # @readonly
        self.feedUrl = feedUrl

        # @var string
        self.cuePointsProvider = cuePointsProvider

        # @var string
        self.itemsPerPage = itemsPerPage

        # @var bool
        self.ignoreSchedulingInFeed = ignoreSchedulingInFeed


    PROPERTY_LOADERS = {
        'channelTitle': getXmlNodeText, 
        'channelLink': getXmlNodeText, 
        'channelDescription': getXmlNodeText, 
        'feedUrl': getXmlNodeText, 
        'cuePointsProvider': getXmlNodeText, 
        'itemsPerPage': getXmlNodeText, 
        'ignoreSchedulingInFeed': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDoubleClickDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaDoubleClickDistributionProfile")
        kparams.addStringIfDefined("channelTitle", self.channelTitle)
        kparams.addStringIfDefined("channelLink", self.channelLink)
        kparams.addStringIfDefined("channelDescription", self.channelDescription)
        kparams.addStringIfDefined("cuePointsProvider", self.cuePointsProvider)
        kparams.addStringIfDefined("itemsPerPage", self.itemsPerPage)
        kparams.addBoolIfDefined("ignoreSchedulingInFeed", self.ignoreSchedulingInFeed)
        return kparams

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

    def getFeedUrl(self):
        return self.feedUrl

    def getCuePointsProvider(self):
        return self.cuePointsProvider

    def setCuePointsProvider(self, newCuePointsProvider):
        self.cuePointsProvider = newCuePointsProvider

    def getItemsPerPage(self):
        return self.itemsPerPage

    def setItemsPerPage(self, newItemsPerPage):
        self.itemsPerPage = newItemsPerPage

    def getIgnoreSchedulingInFeed(self):
        return self.ignoreSchedulingInFeed

    def setIgnoreSchedulingInFeed(self, newIgnoreSchedulingInFeed):
        self.ignoreSchedulingInFeed = newIgnoreSchedulingInFeed


# @package Kaltura
# @subpackage Client
class KalturaDoubleClickDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaDoubleClickDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaDoubleClickDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDoubleClickDistributionProviderFilter(KalturaDoubleClickDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaDoubleClickDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDoubleClickDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDoubleClickDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDoubleClickDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaDoubleClickDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDoubleClickDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaDoubleClickDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaDoubleClickDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDoubleClickDistributionProfileFilter(KalturaDoubleClickDistributionProfileBaseFilter):
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
        KalturaDoubleClickDistributionProfileBaseFilter.__init__(self,
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
        KalturaDoubleClickDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDoubleClickDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDoubleClickDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaDoubleClickDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaDoubleClickDistributionClientPlugin(KalturaClientPlugin):
    # KalturaDoubleClickDistributionClientPlugin
    instance = None

    # @return KalturaDoubleClickDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaDoubleClickDistributionClientPlugin.instance == None:
            KalturaDoubleClickDistributionClientPlugin.instance = KalturaDoubleClickDistributionClientPlugin()
        return KalturaDoubleClickDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaDoubleClickDistributionProfileOrderBy': KalturaDoubleClickDistributionProfileOrderBy,
            'KalturaDoubleClickDistributionProviderOrderBy': KalturaDoubleClickDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaDoubleClickDistributionJobProviderData': KalturaDoubleClickDistributionJobProviderData,
            'KalturaDoubleClickDistributionProvider': KalturaDoubleClickDistributionProvider,
            'KalturaDoubleClickDistributionProfile': KalturaDoubleClickDistributionProfile,
            'KalturaDoubleClickDistributionProviderBaseFilter': KalturaDoubleClickDistributionProviderBaseFilter,
            'KalturaDoubleClickDistributionProviderFilter': KalturaDoubleClickDistributionProviderFilter,
            'KalturaDoubleClickDistributionProfileBaseFilter': KalturaDoubleClickDistributionProfileBaseFilter,
            'KalturaDoubleClickDistributionProfileFilter': KalturaDoubleClickDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'doubleClickDistribution'

