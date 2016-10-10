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
class KalturaCrossKalturaDistributionProfileOrderBy(object):
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
class KalturaCrossKalturaDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaCrossKalturaDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaCrossKalturaDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaCrossKalturaDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaCrossKalturaDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            distributedFlavorAssets=NotImplemented,
            distributedThumbAssets=NotImplemented,
            distributedMetadata=NotImplemented,
            distributedCaptionAssets=NotImplemented,
            distributedCuePoints=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # Key-value array where the keys are IDs of distributed flavor assets in the source account and the values are the matching IDs in the target account
        # @var string
        self.distributedFlavorAssets = distributedFlavorAssets

        # Key-value array where the keys are IDs of distributed thumb assets in the source account and the values are the matching IDs in the target account
        # @var string
        self.distributedThumbAssets = distributedThumbAssets

        # Key-value array where the keys are IDs of distributed metadata objects in the source account and the values are the matching IDs in the target account
        # @var string
        self.distributedMetadata = distributedMetadata

        # Key-value array where the keys are IDs of distributed caption assets in the source account and the values are the matching IDs in the target account
        # @var string
        self.distributedCaptionAssets = distributedCaptionAssets

        # Key-value array where the keys are IDs of distributed cue points in the source account and the values are the matching IDs in the target account
        # @var string
        self.distributedCuePoints = distributedCuePoints


    PROPERTY_LOADERS = {
        'distributedFlavorAssets': getXmlNodeText, 
        'distributedThumbAssets': getXmlNodeText, 
        'distributedMetadata': getXmlNodeText, 
        'distributedCaptionAssets': getXmlNodeText, 
        'distributedCuePoints': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaCrossKalturaDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaCrossKalturaDistributionJobProviderData")
        kparams.addStringIfDefined("distributedFlavorAssets", self.distributedFlavorAssets)
        kparams.addStringIfDefined("distributedThumbAssets", self.distributedThumbAssets)
        kparams.addStringIfDefined("distributedMetadata", self.distributedMetadata)
        kparams.addStringIfDefined("distributedCaptionAssets", self.distributedCaptionAssets)
        kparams.addStringIfDefined("distributedCuePoints", self.distributedCuePoints)
        return kparams

    def getDistributedFlavorAssets(self):
        return self.distributedFlavorAssets

    def setDistributedFlavorAssets(self, newDistributedFlavorAssets):
        self.distributedFlavorAssets = newDistributedFlavorAssets

    def getDistributedThumbAssets(self):
        return self.distributedThumbAssets

    def setDistributedThumbAssets(self, newDistributedThumbAssets):
        self.distributedThumbAssets = newDistributedThumbAssets

    def getDistributedMetadata(self):
        return self.distributedMetadata

    def setDistributedMetadata(self, newDistributedMetadata):
        self.distributedMetadata = newDistributedMetadata

    def getDistributedCaptionAssets(self):
        return self.distributedCaptionAssets

    def setDistributedCaptionAssets(self, newDistributedCaptionAssets):
        self.distributedCaptionAssets = newDistributedCaptionAssets

    def getDistributedCuePoints(self):
        return self.distributedCuePoints

    def setDistributedCuePoints(self, newDistributedCuePoints):
        self.distributedCuePoints = newDistributedCuePoints


# @package Kaltura
# @subpackage Client
class KalturaCrossKalturaDistributionProfile(KalturaConfigurableDistributionProfile):
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
            targetServiceUrl=NotImplemented,
            targetAccountId=NotImplemented,
            targetLoginId=NotImplemented,
            targetLoginPassword=NotImplemented,
            metadataXslt=NotImplemented,
            metadataXpathsTriggerUpdate=NotImplemented,
            distributeCaptions=NotImplemented,
            distributeCuePoints=NotImplemented,
            distributeRemoteFlavorAssetContent=NotImplemented,
            distributeRemoteThumbAssetContent=NotImplemented,
            distributeRemoteCaptionAssetContent=NotImplemented,
            mapAccessControlProfileIds=NotImplemented,
            mapConversionProfileIds=NotImplemented,
            mapMetadataProfileIds=NotImplemented,
            mapStorageProfileIds=NotImplemented,
            mapFlavorParamsIds=NotImplemented,
            mapThumbParamsIds=NotImplemented,
            mapCaptionParamsIds=NotImplemented):
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
        self.targetServiceUrl = targetServiceUrl

        # @var int
        self.targetAccountId = targetAccountId

        # @var string
        self.targetLoginId = targetLoginId

        # @var string
        self.targetLoginPassword = targetLoginPassword

        # @var string
        self.metadataXslt = metadataXslt

        # @var array of KalturaStringValue
        self.metadataXpathsTriggerUpdate = metadataXpathsTriggerUpdate

        # @var bool
        self.distributeCaptions = distributeCaptions

        # @var bool
        self.distributeCuePoints = distributeCuePoints

        # @var bool
        self.distributeRemoteFlavorAssetContent = distributeRemoteFlavorAssetContent

        # @var bool
        self.distributeRemoteThumbAssetContent = distributeRemoteThumbAssetContent

        # @var bool
        self.distributeRemoteCaptionAssetContent = distributeRemoteCaptionAssetContent

        # @var array of KalturaKeyValue
        self.mapAccessControlProfileIds = mapAccessControlProfileIds

        # @var array of KalturaKeyValue
        self.mapConversionProfileIds = mapConversionProfileIds

        # @var array of KalturaKeyValue
        self.mapMetadataProfileIds = mapMetadataProfileIds

        # @var array of KalturaKeyValue
        self.mapStorageProfileIds = mapStorageProfileIds

        # @var array of KalturaKeyValue
        self.mapFlavorParamsIds = mapFlavorParamsIds

        # @var array of KalturaKeyValue
        self.mapThumbParamsIds = mapThumbParamsIds

        # @var array of KalturaKeyValue
        self.mapCaptionParamsIds = mapCaptionParamsIds


    PROPERTY_LOADERS = {
        'targetServiceUrl': getXmlNodeText, 
        'targetAccountId': getXmlNodeInt, 
        'targetLoginId': getXmlNodeText, 
        'targetLoginPassword': getXmlNodeText, 
        'metadataXslt': getXmlNodeText, 
        'metadataXpathsTriggerUpdate': (KalturaObjectFactory.createArray, KalturaStringValue), 
        'distributeCaptions': getXmlNodeBool, 
        'distributeCuePoints': getXmlNodeBool, 
        'distributeRemoteFlavorAssetContent': getXmlNodeBool, 
        'distributeRemoteThumbAssetContent': getXmlNodeBool, 
        'distributeRemoteCaptionAssetContent': getXmlNodeBool, 
        'mapAccessControlProfileIds': (KalturaObjectFactory.createArray, KalturaKeyValue), 
        'mapConversionProfileIds': (KalturaObjectFactory.createArray, KalturaKeyValue), 
        'mapMetadataProfileIds': (KalturaObjectFactory.createArray, KalturaKeyValue), 
        'mapStorageProfileIds': (KalturaObjectFactory.createArray, KalturaKeyValue), 
        'mapFlavorParamsIds': (KalturaObjectFactory.createArray, KalturaKeyValue), 
        'mapThumbParamsIds': (KalturaObjectFactory.createArray, KalturaKeyValue), 
        'mapCaptionParamsIds': (KalturaObjectFactory.createArray, KalturaKeyValue), 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaCrossKalturaDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaCrossKalturaDistributionProfile")
        kparams.addStringIfDefined("targetServiceUrl", self.targetServiceUrl)
        kparams.addIntIfDefined("targetAccountId", self.targetAccountId)
        kparams.addStringIfDefined("targetLoginId", self.targetLoginId)
        kparams.addStringIfDefined("targetLoginPassword", self.targetLoginPassword)
        kparams.addStringIfDefined("metadataXslt", self.metadataXslt)
        kparams.addArrayIfDefined("metadataXpathsTriggerUpdate", self.metadataXpathsTriggerUpdate)
        kparams.addBoolIfDefined("distributeCaptions", self.distributeCaptions)
        kparams.addBoolIfDefined("distributeCuePoints", self.distributeCuePoints)
        kparams.addBoolIfDefined("distributeRemoteFlavorAssetContent", self.distributeRemoteFlavorAssetContent)
        kparams.addBoolIfDefined("distributeRemoteThumbAssetContent", self.distributeRemoteThumbAssetContent)
        kparams.addBoolIfDefined("distributeRemoteCaptionAssetContent", self.distributeRemoteCaptionAssetContent)
        kparams.addArrayIfDefined("mapAccessControlProfileIds", self.mapAccessControlProfileIds)
        kparams.addArrayIfDefined("mapConversionProfileIds", self.mapConversionProfileIds)
        kparams.addArrayIfDefined("mapMetadataProfileIds", self.mapMetadataProfileIds)
        kparams.addArrayIfDefined("mapStorageProfileIds", self.mapStorageProfileIds)
        kparams.addArrayIfDefined("mapFlavorParamsIds", self.mapFlavorParamsIds)
        kparams.addArrayIfDefined("mapThumbParamsIds", self.mapThumbParamsIds)
        kparams.addArrayIfDefined("mapCaptionParamsIds", self.mapCaptionParamsIds)
        return kparams

    def getTargetServiceUrl(self):
        return self.targetServiceUrl

    def setTargetServiceUrl(self, newTargetServiceUrl):
        self.targetServiceUrl = newTargetServiceUrl

    def getTargetAccountId(self):
        return self.targetAccountId

    def setTargetAccountId(self, newTargetAccountId):
        self.targetAccountId = newTargetAccountId

    def getTargetLoginId(self):
        return self.targetLoginId

    def setTargetLoginId(self, newTargetLoginId):
        self.targetLoginId = newTargetLoginId

    def getTargetLoginPassword(self):
        return self.targetLoginPassword

    def setTargetLoginPassword(self, newTargetLoginPassword):
        self.targetLoginPassword = newTargetLoginPassword

    def getMetadataXslt(self):
        return self.metadataXslt

    def setMetadataXslt(self, newMetadataXslt):
        self.metadataXslt = newMetadataXslt

    def getMetadataXpathsTriggerUpdate(self):
        return self.metadataXpathsTriggerUpdate

    def setMetadataXpathsTriggerUpdate(self, newMetadataXpathsTriggerUpdate):
        self.metadataXpathsTriggerUpdate = newMetadataXpathsTriggerUpdate

    def getDistributeCaptions(self):
        return self.distributeCaptions

    def setDistributeCaptions(self, newDistributeCaptions):
        self.distributeCaptions = newDistributeCaptions

    def getDistributeCuePoints(self):
        return self.distributeCuePoints

    def setDistributeCuePoints(self, newDistributeCuePoints):
        self.distributeCuePoints = newDistributeCuePoints

    def getDistributeRemoteFlavorAssetContent(self):
        return self.distributeRemoteFlavorAssetContent

    def setDistributeRemoteFlavorAssetContent(self, newDistributeRemoteFlavorAssetContent):
        self.distributeRemoteFlavorAssetContent = newDistributeRemoteFlavorAssetContent

    def getDistributeRemoteThumbAssetContent(self):
        return self.distributeRemoteThumbAssetContent

    def setDistributeRemoteThumbAssetContent(self, newDistributeRemoteThumbAssetContent):
        self.distributeRemoteThumbAssetContent = newDistributeRemoteThumbAssetContent

    def getDistributeRemoteCaptionAssetContent(self):
        return self.distributeRemoteCaptionAssetContent

    def setDistributeRemoteCaptionAssetContent(self, newDistributeRemoteCaptionAssetContent):
        self.distributeRemoteCaptionAssetContent = newDistributeRemoteCaptionAssetContent

    def getMapAccessControlProfileIds(self):
        return self.mapAccessControlProfileIds

    def setMapAccessControlProfileIds(self, newMapAccessControlProfileIds):
        self.mapAccessControlProfileIds = newMapAccessControlProfileIds

    def getMapConversionProfileIds(self):
        return self.mapConversionProfileIds

    def setMapConversionProfileIds(self, newMapConversionProfileIds):
        self.mapConversionProfileIds = newMapConversionProfileIds

    def getMapMetadataProfileIds(self):
        return self.mapMetadataProfileIds

    def setMapMetadataProfileIds(self, newMapMetadataProfileIds):
        self.mapMetadataProfileIds = newMapMetadataProfileIds

    def getMapStorageProfileIds(self):
        return self.mapStorageProfileIds

    def setMapStorageProfileIds(self, newMapStorageProfileIds):
        self.mapStorageProfileIds = newMapStorageProfileIds

    def getMapFlavorParamsIds(self):
        return self.mapFlavorParamsIds

    def setMapFlavorParamsIds(self, newMapFlavorParamsIds):
        self.mapFlavorParamsIds = newMapFlavorParamsIds

    def getMapThumbParamsIds(self):
        return self.mapThumbParamsIds

    def setMapThumbParamsIds(self, newMapThumbParamsIds):
        self.mapThumbParamsIds = newMapThumbParamsIds

    def getMapCaptionParamsIds(self):
        return self.mapCaptionParamsIds

    def setMapCaptionParamsIds(self, newMapCaptionParamsIds):
        self.mapCaptionParamsIds = newMapCaptionParamsIds


# @package Kaltura
# @subpackage Client
class KalturaCrossKalturaDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaCrossKalturaDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaCrossKalturaDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaCrossKalturaDistributionProviderFilter(KalturaCrossKalturaDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaCrossKalturaDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaCrossKalturaDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaCrossKalturaDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCrossKalturaDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaCrossKalturaDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaCrossKalturaDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaCrossKalturaDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaCrossKalturaDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaCrossKalturaDistributionProfileFilter(KalturaCrossKalturaDistributionProfileBaseFilter):
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
        KalturaCrossKalturaDistributionProfileBaseFilter.__init__(self,
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
        KalturaCrossKalturaDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaCrossKalturaDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCrossKalturaDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaCrossKalturaDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaCrossKalturaDistributionClientPlugin(KalturaClientPlugin):
    # KalturaCrossKalturaDistributionClientPlugin
    instance = None

    # @return KalturaCrossKalturaDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaCrossKalturaDistributionClientPlugin.instance == None:
            KalturaCrossKalturaDistributionClientPlugin.instance = KalturaCrossKalturaDistributionClientPlugin()
        return KalturaCrossKalturaDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaCrossKalturaDistributionProfileOrderBy': KalturaCrossKalturaDistributionProfileOrderBy,
            'KalturaCrossKalturaDistributionProviderOrderBy': KalturaCrossKalturaDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaCrossKalturaDistributionProvider': KalturaCrossKalturaDistributionProvider,
            'KalturaCrossKalturaDistributionJobProviderData': KalturaCrossKalturaDistributionJobProviderData,
            'KalturaCrossKalturaDistributionProfile': KalturaCrossKalturaDistributionProfile,
            'KalturaCrossKalturaDistributionProviderBaseFilter': KalturaCrossKalturaDistributionProviderBaseFilter,
            'KalturaCrossKalturaDistributionProviderFilter': KalturaCrossKalturaDistributionProviderFilter,
            'KalturaCrossKalturaDistributionProfileBaseFilter': KalturaCrossKalturaDistributionProfileBaseFilter,
            'KalturaCrossKalturaDistributionProfileFilter': KalturaCrossKalturaDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'crossKalturaDistribution'

