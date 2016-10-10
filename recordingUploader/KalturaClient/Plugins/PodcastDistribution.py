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
class KalturaPodcastDistributionProfileOrderBy(object):
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
class KalturaPodcastDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaPodcastDistributionJobProviderData(KalturaDistributionJobProviderData):
    def __init__(self,
            xml=NotImplemented,
            metadataProfileId=NotImplemented,
            distributionProfileId=NotImplemented):
        KalturaDistributionJobProviderData.__init__(self)

        # @var string
        self.xml = xml

        # @var int
        self.metadataProfileId = metadataProfileId

        # @var int
        self.distributionProfileId = distributionProfileId


    PROPERTY_LOADERS = {
        'xml': getXmlNodeText, 
        'metadataProfileId': getXmlNodeInt, 
        'distributionProfileId': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPodcastDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaPodcastDistributionJobProviderData")
        kparams.addStringIfDefined("xml", self.xml)
        kparams.addIntIfDefined("metadataProfileId", self.metadataProfileId)
        kparams.addIntIfDefined("distributionProfileId", self.distributionProfileId)
        return kparams

    def getXml(self):
        return self.xml

    def setXml(self, newXml):
        self.xml = newXml

    def getMetadataProfileId(self):
        return self.metadataProfileId

    def setMetadataProfileId(self, newMetadataProfileId):
        self.metadataProfileId = newMetadataProfileId

    def getDistributionProfileId(self):
        return self.distributionProfileId

    def setDistributionProfileId(self, newDistributionProfileId):
        self.distributionProfileId = newDistributionProfileId


# @package Kaltura
# @subpackage Client
class KalturaPodcastDistributionProfile(KalturaDistributionProfile):
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
            xsl=NotImplemented,
            feedId=NotImplemented,
            metadataProfileId=NotImplemented):
        KalturaDistributionProfile.__init__(self,
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
            recommendedDcForExecute)

        # @var string
        self.xsl = xsl

        # @var string
        # @readonly
        self.feedId = feedId

        # @var int
        self.metadataProfileId = metadataProfileId


    PROPERTY_LOADERS = {
        'xsl': getXmlNodeText, 
        'feedId': getXmlNodeText, 
        'metadataProfileId': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPodcastDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaPodcastDistributionProfile")
        kparams.addStringIfDefined("xsl", self.xsl)
        kparams.addIntIfDefined("metadataProfileId", self.metadataProfileId)
        return kparams

    def getXsl(self):
        return self.xsl

    def setXsl(self, newXsl):
        self.xsl = newXsl

    def getFeedId(self):
        return self.feedId

    def getMetadataProfileId(self):
        return self.metadataProfileId

    def setMetadataProfileId(self, newMetadataProfileId):
        self.metadataProfileId = newMetadataProfileId


# @package Kaltura
# @subpackage Client
class KalturaPodcastDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaPodcastDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaPodcastDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaPodcastDistributionProfileBaseFilter(KalturaDistributionProfileFilter):
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
        KalturaDistributionProfileFilter.__init__(self,
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
        KalturaDistributionProfileFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPodcastDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaPodcastDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaPodcastDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaPodcastDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaPodcastDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaPodcastDistributionProfileFilter(KalturaPodcastDistributionProfileBaseFilter):
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
        KalturaPodcastDistributionProfileBaseFilter.__init__(self,
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
        KalturaPodcastDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPodcastDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaPodcastDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaPodcastDistributionProfileFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaPodcastDistributionProviderFilter(KalturaPodcastDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaPodcastDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaPodcastDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPodcastDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaPodcastDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaPodcastDistributionProviderFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaPodcastDistributionClientPlugin(KalturaClientPlugin):
    # KalturaPodcastDistributionClientPlugin
    instance = None

    # @return KalturaPodcastDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaPodcastDistributionClientPlugin.instance == None:
            KalturaPodcastDistributionClientPlugin.instance = KalturaPodcastDistributionClientPlugin()
        return KalturaPodcastDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaPodcastDistributionProfileOrderBy': KalturaPodcastDistributionProfileOrderBy,
            'KalturaPodcastDistributionProviderOrderBy': KalturaPodcastDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaPodcastDistributionJobProviderData': KalturaPodcastDistributionJobProviderData,
            'KalturaPodcastDistributionProfile': KalturaPodcastDistributionProfile,
            'KalturaPodcastDistributionProvider': KalturaPodcastDistributionProvider,
            'KalturaPodcastDistributionProfileBaseFilter': KalturaPodcastDistributionProfileBaseFilter,
            'KalturaPodcastDistributionProviderBaseFilter': KalturaPodcastDistributionProviderBaseFilter,
            'KalturaPodcastDistributionProfileFilter': KalturaPodcastDistributionProfileFilter,
            'KalturaPodcastDistributionProviderFilter': KalturaPodcastDistributionProviderFilter,
        }

    # @return string
    def getName(self):
        return 'podcastDistribution'

