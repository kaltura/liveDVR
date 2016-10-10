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
class KalturaVerizonVcastDistributionProfileOrderBy(object):
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
class KalturaVerizonVcastDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaVerizonVcastDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaVerizonVcastDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaVerizonVcastDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaVerizonVcastDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            xml=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # @var string
        self.xml = xml


    PROPERTY_LOADERS = {
        'xml': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaVerizonVcastDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaVerizonVcastDistributionJobProviderData")
        kparams.addStringIfDefined("xml", self.xml)
        return kparams

    def getXml(self):
        return self.xml

    def setXml(self, newXml):
        self.xml = newXml


# @package Kaltura
# @subpackage Client
class KalturaVerizonVcastDistributionProfile(KalturaConfigurableDistributionProfile):
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
            providerName=NotImplemented,
            providerId=NotImplemented,
            entitlement=NotImplemented,
            priority=NotImplemented,
            allowStreaming=NotImplemented,
            streamingPriceCode=NotImplemented,
            allowDownload=NotImplemented,
            downloadPriceCode=NotImplemented):
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
        self.providerName = providerName

        # @var string
        self.providerId = providerId

        # @var string
        self.entitlement = entitlement

        # @var string
        self.priority = priority

        # @var string
        self.allowStreaming = allowStreaming

        # @var string
        self.streamingPriceCode = streamingPriceCode

        # @var string
        self.allowDownload = allowDownload

        # @var string
        self.downloadPriceCode = downloadPriceCode


    PROPERTY_LOADERS = {
        'ftpHost': getXmlNodeText, 
        'ftpLogin': getXmlNodeText, 
        'ftpPass': getXmlNodeText, 
        'providerName': getXmlNodeText, 
        'providerId': getXmlNodeText, 
        'entitlement': getXmlNodeText, 
        'priority': getXmlNodeText, 
        'allowStreaming': getXmlNodeText, 
        'streamingPriceCode': getXmlNodeText, 
        'allowDownload': getXmlNodeText, 
        'downloadPriceCode': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaVerizonVcastDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaVerizonVcastDistributionProfile")
        kparams.addStringIfDefined("ftpHost", self.ftpHost)
        kparams.addStringIfDefined("ftpLogin", self.ftpLogin)
        kparams.addStringIfDefined("ftpPass", self.ftpPass)
        kparams.addStringIfDefined("providerName", self.providerName)
        kparams.addStringIfDefined("providerId", self.providerId)
        kparams.addStringIfDefined("entitlement", self.entitlement)
        kparams.addStringIfDefined("priority", self.priority)
        kparams.addStringIfDefined("allowStreaming", self.allowStreaming)
        kparams.addStringIfDefined("streamingPriceCode", self.streamingPriceCode)
        kparams.addStringIfDefined("allowDownload", self.allowDownload)
        kparams.addStringIfDefined("downloadPriceCode", self.downloadPriceCode)
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

    def getProviderName(self):
        return self.providerName

    def setProviderName(self, newProviderName):
        self.providerName = newProviderName

    def getProviderId(self):
        return self.providerId

    def setProviderId(self, newProviderId):
        self.providerId = newProviderId

    def getEntitlement(self):
        return self.entitlement

    def setEntitlement(self, newEntitlement):
        self.entitlement = newEntitlement

    def getPriority(self):
        return self.priority

    def setPriority(self, newPriority):
        self.priority = newPriority

    def getAllowStreaming(self):
        return self.allowStreaming

    def setAllowStreaming(self, newAllowStreaming):
        self.allowStreaming = newAllowStreaming

    def getStreamingPriceCode(self):
        return self.streamingPriceCode

    def setStreamingPriceCode(self, newStreamingPriceCode):
        self.streamingPriceCode = newStreamingPriceCode

    def getAllowDownload(self):
        return self.allowDownload

    def setAllowDownload(self, newAllowDownload):
        self.allowDownload = newAllowDownload

    def getDownloadPriceCode(self):
        return self.downloadPriceCode

    def setDownloadPriceCode(self, newDownloadPriceCode):
        self.downloadPriceCode = newDownloadPriceCode


# @package Kaltura
# @subpackage Client
class KalturaVerizonVcastDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaVerizonVcastDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaVerizonVcastDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaVerizonVcastDistributionProviderFilter(KalturaVerizonVcastDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaVerizonVcastDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaVerizonVcastDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaVerizonVcastDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaVerizonVcastDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaVerizonVcastDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaVerizonVcastDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaVerizonVcastDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaVerizonVcastDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaVerizonVcastDistributionProfileFilter(KalturaVerizonVcastDistributionProfileBaseFilter):
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
        KalturaVerizonVcastDistributionProfileBaseFilter.__init__(self,
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
        KalturaVerizonVcastDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaVerizonVcastDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaVerizonVcastDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaVerizonVcastDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaVerizonVcastDistributionClientPlugin(KalturaClientPlugin):
    # KalturaVerizonVcastDistributionClientPlugin
    instance = None

    # @return KalturaVerizonVcastDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaVerizonVcastDistributionClientPlugin.instance == None:
            KalturaVerizonVcastDistributionClientPlugin.instance = KalturaVerizonVcastDistributionClientPlugin()
        return KalturaVerizonVcastDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaVerizonVcastDistributionProfileOrderBy': KalturaVerizonVcastDistributionProfileOrderBy,
            'KalturaVerizonVcastDistributionProviderOrderBy': KalturaVerizonVcastDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaVerizonVcastDistributionProvider': KalturaVerizonVcastDistributionProvider,
            'KalturaVerizonVcastDistributionJobProviderData': KalturaVerizonVcastDistributionJobProviderData,
            'KalturaVerizonVcastDistributionProfile': KalturaVerizonVcastDistributionProfile,
            'KalturaVerizonVcastDistributionProviderBaseFilter': KalturaVerizonVcastDistributionProviderBaseFilter,
            'KalturaVerizonVcastDistributionProviderFilter': KalturaVerizonVcastDistributionProviderFilter,
            'KalturaVerizonVcastDistributionProfileBaseFilter': KalturaVerizonVcastDistributionProfileBaseFilter,
            'KalturaVerizonVcastDistributionProfileFilter': KalturaVerizonVcastDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'verizonVcastDistribution'

