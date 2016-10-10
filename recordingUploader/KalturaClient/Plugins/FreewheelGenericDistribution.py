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
class KalturaFreewheelGenericDistributionProfileOrderBy(object):
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
class KalturaFreewheelGenericDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaFreewheelGenericDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaFreewheelGenericDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaFreewheelGenericDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFreewheelGenericDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            videoAssetFilePaths=NotImplemented,
            thumbAssetFilePath=NotImplemented,
            cuePoints=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # Demonstrate passing array of paths to the job
        # @var array of KalturaString
        self.videoAssetFilePaths = videoAssetFilePaths

        # Demonstrate passing single path to the job
        # @var string
        self.thumbAssetFilePath = thumbAssetFilePath

        # @var array of KalturaCuePoint
        self.cuePoints = cuePoints


    PROPERTY_LOADERS = {
        'videoAssetFilePaths': (KalturaObjectFactory.createArray, KalturaString), 
        'thumbAssetFilePath': getXmlNodeText, 
        'cuePoints': (KalturaObjectFactory.createArray, KalturaCuePoint), 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFreewheelGenericDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaFreewheelGenericDistributionJobProviderData")
        kparams.addArrayIfDefined("videoAssetFilePaths", self.videoAssetFilePaths)
        kparams.addStringIfDefined("thumbAssetFilePath", self.thumbAssetFilePath)
        kparams.addArrayIfDefined("cuePoints", self.cuePoints)
        return kparams

    def getVideoAssetFilePaths(self):
        return self.videoAssetFilePaths

    def setVideoAssetFilePaths(self, newVideoAssetFilePaths):
        self.videoAssetFilePaths = newVideoAssetFilePaths

    def getThumbAssetFilePath(self):
        return self.thumbAssetFilePath

    def setThumbAssetFilePath(self, newThumbAssetFilePath):
        self.thumbAssetFilePath = newThumbAssetFilePath

    def getCuePoints(self):
        return self.cuePoints

    def setCuePoints(self, newCuePoints):
        self.cuePoints = newCuePoints


# @package Kaltura
# @subpackage Client
class KalturaFreewheelGenericDistributionProfile(KalturaConfigurableDistributionProfile):
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
            apikey=NotImplemented,
            email=NotImplemented,
            sftpPass=NotImplemented,
            sftpLogin=NotImplemented,
            contentOwner=NotImplemented,
            upstreamVideoId=NotImplemented,
            upstreamNetworkName=NotImplemented,
            upstreamNetworkId=NotImplemented,
            categoryId=NotImplemented,
            replaceGroup=NotImplemented,
            replaceAirDates=NotImplemented):
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
        self.apikey = apikey

        # @var string
        self.email = email

        # @var string
        self.sftpPass = sftpPass

        # @var string
        self.sftpLogin = sftpLogin

        # @var string
        self.contentOwner = contentOwner

        # @var string
        self.upstreamVideoId = upstreamVideoId

        # @var string
        self.upstreamNetworkName = upstreamNetworkName

        # @var string
        self.upstreamNetworkId = upstreamNetworkId

        # @var string
        self.categoryId = categoryId

        # @var bool
        self.replaceGroup = replaceGroup

        # @var bool
        self.replaceAirDates = replaceAirDates


    PROPERTY_LOADERS = {
        'apikey': getXmlNodeText, 
        'email': getXmlNodeText, 
        'sftpPass': getXmlNodeText, 
        'sftpLogin': getXmlNodeText, 
        'contentOwner': getXmlNodeText, 
        'upstreamVideoId': getXmlNodeText, 
        'upstreamNetworkName': getXmlNodeText, 
        'upstreamNetworkId': getXmlNodeText, 
        'categoryId': getXmlNodeText, 
        'replaceGroup': getXmlNodeBool, 
        'replaceAirDates': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFreewheelGenericDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaFreewheelGenericDistributionProfile")
        kparams.addStringIfDefined("apikey", self.apikey)
        kparams.addStringIfDefined("email", self.email)
        kparams.addStringIfDefined("sftpPass", self.sftpPass)
        kparams.addStringIfDefined("sftpLogin", self.sftpLogin)
        kparams.addStringIfDefined("contentOwner", self.contentOwner)
        kparams.addStringIfDefined("upstreamVideoId", self.upstreamVideoId)
        kparams.addStringIfDefined("upstreamNetworkName", self.upstreamNetworkName)
        kparams.addStringIfDefined("upstreamNetworkId", self.upstreamNetworkId)
        kparams.addStringIfDefined("categoryId", self.categoryId)
        kparams.addBoolIfDefined("replaceGroup", self.replaceGroup)
        kparams.addBoolIfDefined("replaceAirDates", self.replaceAirDates)
        return kparams

    def getApikey(self):
        return self.apikey

    def setApikey(self, newApikey):
        self.apikey = newApikey

    def getEmail(self):
        return self.email

    def setEmail(self, newEmail):
        self.email = newEmail

    def getSftpPass(self):
        return self.sftpPass

    def setSftpPass(self, newSftpPass):
        self.sftpPass = newSftpPass

    def getSftpLogin(self):
        return self.sftpLogin

    def setSftpLogin(self, newSftpLogin):
        self.sftpLogin = newSftpLogin

    def getContentOwner(self):
        return self.contentOwner

    def setContentOwner(self, newContentOwner):
        self.contentOwner = newContentOwner

    def getUpstreamVideoId(self):
        return self.upstreamVideoId

    def setUpstreamVideoId(self, newUpstreamVideoId):
        self.upstreamVideoId = newUpstreamVideoId

    def getUpstreamNetworkName(self):
        return self.upstreamNetworkName

    def setUpstreamNetworkName(self, newUpstreamNetworkName):
        self.upstreamNetworkName = newUpstreamNetworkName

    def getUpstreamNetworkId(self):
        return self.upstreamNetworkId

    def setUpstreamNetworkId(self, newUpstreamNetworkId):
        self.upstreamNetworkId = newUpstreamNetworkId

    def getCategoryId(self):
        return self.categoryId

    def setCategoryId(self, newCategoryId):
        self.categoryId = newCategoryId

    def getReplaceGroup(self):
        return self.replaceGroup

    def setReplaceGroup(self, newReplaceGroup):
        self.replaceGroup = newReplaceGroup

    def getReplaceAirDates(self):
        return self.replaceAirDates

    def setReplaceAirDates(self, newReplaceAirDates):
        self.replaceAirDates = newReplaceAirDates


# @package Kaltura
# @subpackage Client
class KalturaFreewheelGenericDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaFreewheelGenericDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaFreewheelGenericDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFreewheelGenericDistributionProviderFilter(KalturaFreewheelGenericDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaFreewheelGenericDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaFreewheelGenericDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFreewheelGenericDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFreewheelGenericDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaFreewheelGenericDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFreewheelGenericDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaFreewheelGenericDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaFreewheelGenericDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFreewheelGenericDistributionProfileFilter(KalturaFreewheelGenericDistributionProfileBaseFilter):
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
        KalturaFreewheelGenericDistributionProfileBaseFilter.__init__(self,
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
        KalturaFreewheelGenericDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFreewheelGenericDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFreewheelGenericDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaFreewheelGenericDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaFreewheelGenericDistributionClientPlugin(KalturaClientPlugin):
    # KalturaFreewheelGenericDistributionClientPlugin
    instance = None

    # @return KalturaFreewheelGenericDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaFreewheelGenericDistributionClientPlugin.instance == None:
            KalturaFreewheelGenericDistributionClientPlugin.instance = KalturaFreewheelGenericDistributionClientPlugin()
        return KalturaFreewheelGenericDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaFreewheelGenericDistributionProfileOrderBy': KalturaFreewheelGenericDistributionProfileOrderBy,
            'KalturaFreewheelGenericDistributionProviderOrderBy': KalturaFreewheelGenericDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaFreewheelGenericDistributionProvider': KalturaFreewheelGenericDistributionProvider,
            'KalturaFreewheelGenericDistributionJobProviderData': KalturaFreewheelGenericDistributionJobProviderData,
            'KalturaFreewheelGenericDistributionProfile': KalturaFreewheelGenericDistributionProfile,
            'KalturaFreewheelGenericDistributionProviderBaseFilter': KalturaFreewheelGenericDistributionProviderBaseFilter,
            'KalturaFreewheelGenericDistributionProviderFilter': KalturaFreewheelGenericDistributionProviderFilter,
            'KalturaFreewheelGenericDistributionProfileBaseFilter': KalturaFreewheelGenericDistributionProfileBaseFilter,
            'KalturaFreewheelGenericDistributionProfileFilter': KalturaFreewheelGenericDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'freewheelGenericDistribution'

