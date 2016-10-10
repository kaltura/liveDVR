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
class KalturaMetroPcsDistributionProfileOrderBy(object):
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
class KalturaMetroPcsDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaMetroPcsDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaMetroPcsDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaMetroPcsDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaMetroPcsDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            assetLocalPaths=NotImplemented,
            thumbUrls=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # @var string
        self.assetLocalPaths = assetLocalPaths

        # @var string
        self.thumbUrls = thumbUrls


    PROPERTY_LOADERS = {
        'assetLocalPaths': getXmlNodeText, 
        'thumbUrls': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaMetroPcsDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaMetroPcsDistributionJobProviderData")
        kparams.addStringIfDefined("assetLocalPaths", self.assetLocalPaths)
        kparams.addStringIfDefined("thumbUrls", self.thumbUrls)
        return kparams

    def getAssetLocalPaths(self):
        return self.assetLocalPaths

    def setAssetLocalPaths(self, newAssetLocalPaths):
        self.assetLocalPaths = newAssetLocalPaths

    def getThumbUrls(self):
        return self.thumbUrls

    def setThumbUrls(self, newThumbUrls):
        self.thumbUrls = newThumbUrls


# @package Kaltura
# @subpackage Client
class KalturaMetroPcsDistributionProfile(KalturaConfigurableDistributionProfile):
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
            ftpHost=NotImplemented,
            ftpLogin=NotImplemented,
            ftpPass=NotImplemented,
            ftpPath=NotImplemented,
            providerName=NotImplemented,
            providerId=NotImplemented,
            copyright=NotImplemented,
            entitlements=NotImplemented,
            rating=NotImplemented,
            itemType=NotImplemented):
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
        self.ftpHost = ftpHost

        # @var string
        self.ftpLogin = ftpLogin

        # @var string
        self.ftpPass = ftpPass

        # @var string
        self.ftpPath = ftpPath

        # @var string
        self.providerName = providerName

        # @var string
        self.providerId = providerId

        # @var string
        self.copyright = copyright

        # @var string
        self.entitlements = entitlements

        # @var string
        self.rating = rating

        # @var string
        self.itemType = itemType


    PROPERTY_LOADERS = {
        'ftpHost': getXmlNodeText, 
        'ftpLogin': getXmlNodeText, 
        'ftpPass': getXmlNodeText, 
        'ftpPath': getXmlNodeText, 
        'providerName': getXmlNodeText, 
        'providerId': getXmlNodeText, 
        'copyright': getXmlNodeText, 
        'entitlements': getXmlNodeText, 
        'rating': getXmlNodeText, 
        'itemType': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaMetroPcsDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaMetroPcsDistributionProfile")
        kparams.addStringIfDefined("ftpHost", self.ftpHost)
        kparams.addStringIfDefined("ftpLogin", self.ftpLogin)
        kparams.addStringIfDefined("ftpPass", self.ftpPass)
        kparams.addStringIfDefined("ftpPath", self.ftpPath)
        kparams.addStringIfDefined("providerName", self.providerName)
        kparams.addStringIfDefined("providerId", self.providerId)
        kparams.addStringIfDefined("copyright", self.copyright)
        kparams.addStringIfDefined("entitlements", self.entitlements)
        kparams.addStringIfDefined("rating", self.rating)
        kparams.addStringIfDefined("itemType", self.itemType)
        return kparams

    def getFtpHost(self):
        return self.ftpHost

    def setFtpHost(self, newFtpHost):
        self.ftpHost = newFtpHost

    def getFtpLogin(self):
        return self.ftpLogin

    def setFtpLogin(self, newFtpLogin):
        self.ftpLogin = newFtpLogin

    def getFtpPass(self):
        return self.ftpPass

    def setFtpPass(self, newFtpPass):
        self.ftpPass = newFtpPass

    def getFtpPath(self):
        return self.ftpPath

    def setFtpPath(self, newFtpPath):
        self.ftpPath = newFtpPath

    def getProviderName(self):
        return self.providerName

    def setProviderName(self, newProviderName):
        self.providerName = newProviderName

    def getProviderId(self):
        return self.providerId

    def setProviderId(self, newProviderId):
        self.providerId = newProviderId

    def getCopyright(self):
        return self.copyright

    def setCopyright(self, newCopyright):
        self.copyright = newCopyright

    def getEntitlements(self):
        return self.entitlements

    def setEntitlements(self, newEntitlements):
        self.entitlements = newEntitlements

    def getRating(self):
        return self.rating

    def setRating(self, newRating):
        self.rating = newRating

    def getItemType(self):
        return self.itemType

    def setItemType(self, newItemType):
        self.itemType = newItemType


# @package Kaltura
# @subpackage Client
class KalturaMetroPcsDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaMetroPcsDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaMetroPcsDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaMetroPcsDistributionProviderFilter(KalturaMetroPcsDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaMetroPcsDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaMetroPcsDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaMetroPcsDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaMetroPcsDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaMetroPcsDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaMetroPcsDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaMetroPcsDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaMetroPcsDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaMetroPcsDistributionProfileFilter(KalturaMetroPcsDistributionProfileBaseFilter):
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
        KalturaMetroPcsDistributionProfileBaseFilter.__init__(self,
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
        KalturaMetroPcsDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaMetroPcsDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaMetroPcsDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaMetroPcsDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaMetroPcsDistributionClientPlugin(KalturaClientPlugin):
    # KalturaMetroPcsDistributionClientPlugin
    instance = None

    # @return KalturaMetroPcsDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaMetroPcsDistributionClientPlugin.instance == None:
            KalturaMetroPcsDistributionClientPlugin.instance = KalturaMetroPcsDistributionClientPlugin()
        return KalturaMetroPcsDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaMetroPcsDistributionProfileOrderBy': KalturaMetroPcsDistributionProfileOrderBy,
            'KalturaMetroPcsDistributionProviderOrderBy': KalturaMetroPcsDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaMetroPcsDistributionProvider': KalturaMetroPcsDistributionProvider,
            'KalturaMetroPcsDistributionJobProviderData': KalturaMetroPcsDistributionJobProviderData,
            'KalturaMetroPcsDistributionProfile': KalturaMetroPcsDistributionProfile,
            'KalturaMetroPcsDistributionProviderBaseFilter': KalturaMetroPcsDistributionProviderBaseFilter,
            'KalturaMetroPcsDistributionProviderFilter': KalturaMetroPcsDistributionProviderFilter,
            'KalturaMetroPcsDistributionProfileBaseFilter': KalturaMetroPcsDistributionProfileBaseFilter,
            'KalturaMetroPcsDistributionProfileFilter': KalturaMetroPcsDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'metroPcsDistribution'

