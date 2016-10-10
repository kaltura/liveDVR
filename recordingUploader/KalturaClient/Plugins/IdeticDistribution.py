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
class KalturaIdeticDistributionProfileOrderBy(object):
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
class KalturaIdeticDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaIdeticDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaIdeticDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaIdeticDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaIdeticDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            thumbnailUrl=NotImplemented,
            flavorAssetUrl=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # @var string
        self.thumbnailUrl = thumbnailUrl

        # @var string
        self.flavorAssetUrl = flavorAssetUrl


    PROPERTY_LOADERS = {
        'thumbnailUrl': getXmlNodeText, 
        'flavorAssetUrl': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaIdeticDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaIdeticDistributionJobProviderData")
        kparams.addStringIfDefined("thumbnailUrl", self.thumbnailUrl)
        kparams.addStringIfDefined("flavorAssetUrl", self.flavorAssetUrl)
        return kparams

    def getThumbnailUrl(self):
        return self.thumbnailUrl

    def setThumbnailUrl(self, newThumbnailUrl):
        self.thumbnailUrl = newThumbnailUrl

    def getFlavorAssetUrl(self):
        return self.flavorAssetUrl

    def setFlavorAssetUrl(self, newFlavorAssetUrl):
        self.flavorAssetUrl = newFlavorAssetUrl


# @package Kaltura
# @subpackage Client
class KalturaIdeticDistributionProfile(KalturaConfigurableDistributionProfile):
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
            ftpPath=NotImplemented,
            username=NotImplemented,
            password=NotImplemented,
            domain=NotImplemented):
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
        self.ftpPath = ftpPath

        # @var string
        self.username = username

        # @var string
        self.password = password

        # @var string
        self.domain = domain


    PROPERTY_LOADERS = {
        'ftpPath': getXmlNodeText, 
        'username': getXmlNodeText, 
        'password': getXmlNodeText, 
        'domain': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaIdeticDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaIdeticDistributionProfile")
        kparams.addStringIfDefined("ftpPath", self.ftpPath)
        kparams.addStringIfDefined("username", self.username)
        kparams.addStringIfDefined("password", self.password)
        kparams.addStringIfDefined("domain", self.domain)
        return kparams

    def getFtpPath(self):
        return self.ftpPath

    def setFtpPath(self, newFtpPath):
        self.ftpPath = newFtpPath

    def getUsername(self):
        return self.username

    def setUsername(self, newUsername):
        self.username = newUsername

    def getPassword(self):
        return self.password

    def setPassword(self, newPassword):
        self.password = newPassword

    def getDomain(self):
        return self.domain

    def setDomain(self, newDomain):
        self.domain = newDomain


# @package Kaltura
# @subpackage Client
class KalturaIdeticDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaIdeticDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaIdeticDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaIdeticDistributionProviderFilter(KalturaIdeticDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaIdeticDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaIdeticDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaIdeticDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaIdeticDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaIdeticDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaIdeticDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaIdeticDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaIdeticDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaIdeticDistributionProfileFilter(KalturaIdeticDistributionProfileBaseFilter):
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
        KalturaIdeticDistributionProfileBaseFilter.__init__(self,
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
        KalturaIdeticDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaIdeticDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaIdeticDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaIdeticDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaIdeticDistributionClientPlugin(KalturaClientPlugin):
    # KalturaIdeticDistributionClientPlugin
    instance = None

    # @return KalturaIdeticDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaIdeticDistributionClientPlugin.instance == None:
            KalturaIdeticDistributionClientPlugin.instance = KalturaIdeticDistributionClientPlugin()
        return KalturaIdeticDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaIdeticDistributionProfileOrderBy': KalturaIdeticDistributionProfileOrderBy,
            'KalturaIdeticDistributionProviderOrderBy': KalturaIdeticDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaIdeticDistributionProvider': KalturaIdeticDistributionProvider,
            'KalturaIdeticDistributionJobProviderData': KalturaIdeticDistributionJobProviderData,
            'KalturaIdeticDistributionProfile': KalturaIdeticDistributionProfile,
            'KalturaIdeticDistributionProviderBaseFilter': KalturaIdeticDistributionProviderBaseFilter,
            'KalturaIdeticDistributionProviderFilter': KalturaIdeticDistributionProviderFilter,
            'KalturaIdeticDistributionProfileBaseFilter': KalturaIdeticDistributionProfileBaseFilter,
            'KalturaIdeticDistributionProfileFilter': KalturaIdeticDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'ideticDistribution'

