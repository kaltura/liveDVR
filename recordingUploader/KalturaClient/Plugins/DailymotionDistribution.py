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
class KalturaDailymotionDistributionCaptionAction(object):
    UPDATE_ACTION = 1
    SUBMIT_ACTION = 2
    DELETE_ACTION = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDailymotionDistributionCaptionFormat(object):
    SRT = 1
    STL = 2
    TT = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDailymotionGeoBlockingMapping(object):
    DISABLED = 0
    ACCESS_CONTROL = 1
    METADATA = 2

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDailymotionDistributionProfileOrderBy(object):
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
class KalturaDailymotionDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaDailymotionDistributionCaptionInfo(KalturaObjectBase):
    def __init__(self,
            language=NotImplemented,
            filePath=NotImplemented,
            remoteId=NotImplemented,
            action=NotImplemented,
            version=NotImplemented,
            assetId=NotImplemented,
            format=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var string
        self.language = language

        # @var string
        self.filePath = filePath

        # @var string
        self.remoteId = remoteId

        # @var KalturaDailymotionDistributionCaptionAction
        self.action = action

        # @var string
        self.version = version

        # @var string
        self.assetId = assetId

        # @var KalturaDailymotionDistributionCaptionFormat
        self.format = format


    PROPERTY_LOADERS = {
        'language': getXmlNodeText, 
        'filePath': getXmlNodeText, 
        'remoteId': getXmlNodeText, 
        'action': (KalturaEnumsFactory.createInt, "KalturaDailymotionDistributionCaptionAction"), 
        'version': getXmlNodeText, 
        'assetId': getXmlNodeText, 
        'format': (KalturaEnumsFactory.createInt, "KalturaDailymotionDistributionCaptionFormat"), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDailymotionDistributionCaptionInfo.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaDailymotionDistributionCaptionInfo")
        kparams.addStringIfDefined("language", self.language)
        kparams.addStringIfDefined("filePath", self.filePath)
        kparams.addStringIfDefined("remoteId", self.remoteId)
        kparams.addIntEnumIfDefined("action", self.action)
        kparams.addStringIfDefined("version", self.version)
        kparams.addStringIfDefined("assetId", self.assetId)
        kparams.addIntEnumIfDefined("format", self.format)
        return kparams

    def getLanguage(self):
        return self.language

    def setLanguage(self, newLanguage):
        self.language = newLanguage

    def getFilePath(self):
        return self.filePath

    def setFilePath(self, newFilePath):
        self.filePath = newFilePath

    def getRemoteId(self):
        return self.remoteId

    def setRemoteId(self, newRemoteId):
        self.remoteId = newRemoteId

    def getAction(self):
        return self.action

    def setAction(self, newAction):
        self.action = newAction

    def getVersion(self):
        return self.version

    def setVersion(self, newVersion):
        self.version = newVersion

    def getAssetId(self):
        return self.assetId

    def setAssetId(self, newAssetId):
        self.assetId = newAssetId

    def getFormat(self):
        return self.format

    def setFormat(self, newFormat):
        self.format = newFormat


# @package Kaltura
# @subpackage Client
class KalturaDailymotionDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaDailymotionDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaDailymotionDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDailymotionDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            videoAssetFilePath=NotImplemented,
            accessControlGeoBlockingOperation=NotImplemented,
            accessControlGeoBlockingCountryList=NotImplemented,
            captionsInfo=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # @var string
        self.videoAssetFilePath = videoAssetFilePath

        # @var string
        self.accessControlGeoBlockingOperation = accessControlGeoBlockingOperation

        # @var string
        self.accessControlGeoBlockingCountryList = accessControlGeoBlockingCountryList

        # @var array of KalturaDailymotionDistributionCaptionInfo
        self.captionsInfo = captionsInfo


    PROPERTY_LOADERS = {
        'videoAssetFilePath': getXmlNodeText, 
        'accessControlGeoBlockingOperation': getXmlNodeText, 
        'accessControlGeoBlockingCountryList': getXmlNodeText, 
        'captionsInfo': (KalturaObjectFactory.createArray, KalturaDailymotionDistributionCaptionInfo), 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDailymotionDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaDailymotionDistributionJobProviderData")
        kparams.addStringIfDefined("videoAssetFilePath", self.videoAssetFilePath)
        kparams.addStringIfDefined("accessControlGeoBlockingOperation", self.accessControlGeoBlockingOperation)
        kparams.addStringIfDefined("accessControlGeoBlockingCountryList", self.accessControlGeoBlockingCountryList)
        kparams.addArrayIfDefined("captionsInfo", self.captionsInfo)
        return kparams

    def getVideoAssetFilePath(self):
        return self.videoAssetFilePath

    def setVideoAssetFilePath(self, newVideoAssetFilePath):
        self.videoAssetFilePath = newVideoAssetFilePath

    def getAccessControlGeoBlockingOperation(self):
        return self.accessControlGeoBlockingOperation

    def setAccessControlGeoBlockingOperation(self, newAccessControlGeoBlockingOperation):
        self.accessControlGeoBlockingOperation = newAccessControlGeoBlockingOperation

    def getAccessControlGeoBlockingCountryList(self):
        return self.accessControlGeoBlockingCountryList

    def setAccessControlGeoBlockingCountryList(self, newAccessControlGeoBlockingCountryList):
        self.accessControlGeoBlockingCountryList = newAccessControlGeoBlockingCountryList

    def getCaptionsInfo(self):
        return self.captionsInfo

    def setCaptionsInfo(self, newCaptionsInfo):
        self.captionsInfo = newCaptionsInfo


# @package Kaltura
# @subpackage Client
class KalturaDailymotionDistributionProfile(KalturaConfigurableDistributionProfile):
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
            user=NotImplemented,
            password=NotImplemented,
            geoBlockingMapping=NotImplemented):
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
        self.user = user

        # @var string
        self.password = password

        # @var KalturaDailymotionGeoBlockingMapping
        self.geoBlockingMapping = geoBlockingMapping


    PROPERTY_LOADERS = {
        'user': getXmlNodeText, 
        'password': getXmlNodeText, 
        'geoBlockingMapping': (KalturaEnumsFactory.createInt, "KalturaDailymotionGeoBlockingMapping"), 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDailymotionDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaDailymotionDistributionProfile")
        kparams.addStringIfDefined("user", self.user)
        kparams.addStringIfDefined("password", self.password)
        kparams.addIntEnumIfDefined("geoBlockingMapping", self.geoBlockingMapping)
        return kparams

    def getUser(self):
        return self.user

    def setUser(self, newUser):
        self.user = newUser

    def getPassword(self):
        return self.password

    def setPassword(self, newPassword):
        self.password = newPassword

    def getGeoBlockingMapping(self):
        return self.geoBlockingMapping

    def setGeoBlockingMapping(self, newGeoBlockingMapping):
        self.geoBlockingMapping = newGeoBlockingMapping


# @package Kaltura
# @subpackage Client
class KalturaDailymotionDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaDailymotionDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaDailymotionDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDailymotionDistributionProviderFilter(KalturaDailymotionDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaDailymotionDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDailymotionDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDailymotionDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDailymotionDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaDailymotionDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDailymotionDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaDailymotionDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaDailymotionDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDailymotionDistributionProfileFilter(KalturaDailymotionDistributionProfileBaseFilter):
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
        KalturaDailymotionDistributionProfileBaseFilter.__init__(self,
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
        KalturaDailymotionDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDailymotionDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDailymotionDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaDailymotionDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaDailymotionDistributionClientPlugin(KalturaClientPlugin):
    # KalturaDailymotionDistributionClientPlugin
    instance = None

    # @return KalturaDailymotionDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaDailymotionDistributionClientPlugin.instance == None:
            KalturaDailymotionDistributionClientPlugin.instance = KalturaDailymotionDistributionClientPlugin()
        return KalturaDailymotionDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaDailymotionDistributionCaptionAction': KalturaDailymotionDistributionCaptionAction,
            'KalturaDailymotionDistributionCaptionFormat': KalturaDailymotionDistributionCaptionFormat,
            'KalturaDailymotionGeoBlockingMapping': KalturaDailymotionGeoBlockingMapping,
            'KalturaDailymotionDistributionProfileOrderBy': KalturaDailymotionDistributionProfileOrderBy,
            'KalturaDailymotionDistributionProviderOrderBy': KalturaDailymotionDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaDailymotionDistributionCaptionInfo': KalturaDailymotionDistributionCaptionInfo,
            'KalturaDailymotionDistributionProvider': KalturaDailymotionDistributionProvider,
            'KalturaDailymotionDistributionJobProviderData': KalturaDailymotionDistributionJobProviderData,
            'KalturaDailymotionDistributionProfile': KalturaDailymotionDistributionProfile,
            'KalturaDailymotionDistributionProviderBaseFilter': KalturaDailymotionDistributionProviderBaseFilter,
            'KalturaDailymotionDistributionProviderFilter': KalturaDailymotionDistributionProviderFilter,
            'KalturaDailymotionDistributionProfileBaseFilter': KalturaDailymotionDistributionProfileBaseFilter,
            'KalturaDailymotionDistributionProfileFilter': KalturaDailymotionDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'dailymotionDistribution'

