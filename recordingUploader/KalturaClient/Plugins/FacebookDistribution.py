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
class KalturaFacebookDistributionProfileOrderBy(object):
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
class KalturaFacebookDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaFacebookCaptionDistributionInfo(KalturaObjectBase):
    def __init__(self,
            language=NotImplemented,
            label=NotImplemented,
            filePath=NotImplemented,
            remoteId=NotImplemented,
            version=NotImplemented,
            assetId=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var string
        self.language = language

        # @var string
        self.label = label

        # @var string
        self.filePath = filePath

        # @var string
        self.remoteId = remoteId

        # @var string
        self.version = version

        # @var string
        self.assetId = assetId


    PROPERTY_LOADERS = {
        'language': getXmlNodeText, 
        'label': getXmlNodeText, 
        'filePath': getXmlNodeText, 
        'remoteId': getXmlNodeText, 
        'version': getXmlNodeText, 
        'assetId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFacebookCaptionDistributionInfo.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaFacebookCaptionDistributionInfo")
        kparams.addStringIfDefined("language", self.language)
        kparams.addStringIfDefined("label", self.label)
        kparams.addStringIfDefined("filePath", self.filePath)
        kparams.addStringIfDefined("remoteId", self.remoteId)
        kparams.addStringIfDefined("version", self.version)
        kparams.addStringIfDefined("assetId", self.assetId)
        return kparams

    def getLanguage(self):
        return self.language

    def setLanguage(self, newLanguage):
        self.language = newLanguage

    def getLabel(self):
        return self.label

    def setLabel(self, newLabel):
        self.label = newLabel

    def getFilePath(self):
        return self.filePath

    def setFilePath(self, newFilePath):
        self.filePath = newFilePath

    def getRemoteId(self):
        return self.remoteId

    def setRemoteId(self, newRemoteId):
        self.remoteId = newRemoteId

    def getVersion(self):
        return self.version

    def setVersion(self, newVersion):
        self.version = newVersion

    def getAssetId(self):
        return self.assetId

    def setAssetId(self, newAssetId):
        self.assetId = newAssetId


# @package Kaltura
# @subpackage Client
class KalturaFacebookDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaFacebookDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaFacebookDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFacebookDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            videoAssetFilePath=NotImplemented,
            thumbAssetFilePath=NotImplemented,
            captionsInfo=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # @var string
        self.videoAssetFilePath = videoAssetFilePath

        # @var string
        self.thumbAssetFilePath = thumbAssetFilePath

        # @var array of KalturaFacebookCaptionDistributionInfo
        self.captionsInfo = captionsInfo


    PROPERTY_LOADERS = {
        'videoAssetFilePath': getXmlNodeText, 
        'thumbAssetFilePath': getXmlNodeText, 
        'captionsInfo': (KalturaObjectFactory.createArray, KalturaFacebookCaptionDistributionInfo), 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFacebookDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaFacebookDistributionJobProviderData")
        kparams.addStringIfDefined("videoAssetFilePath", self.videoAssetFilePath)
        kparams.addStringIfDefined("thumbAssetFilePath", self.thumbAssetFilePath)
        kparams.addArrayIfDefined("captionsInfo", self.captionsInfo)
        return kparams

    def getVideoAssetFilePath(self):
        return self.videoAssetFilePath

    def setVideoAssetFilePath(self, newVideoAssetFilePath):
        self.videoAssetFilePath = newVideoAssetFilePath

    def getThumbAssetFilePath(self):
        return self.thumbAssetFilePath

    def setThumbAssetFilePath(self, newThumbAssetFilePath):
        self.thumbAssetFilePath = newThumbAssetFilePath

    def getCaptionsInfo(self):
        return self.captionsInfo

    def setCaptionsInfo(self, newCaptionsInfo):
        self.captionsInfo = newCaptionsInfo


# @package Kaltura
# @subpackage Client
class KalturaFacebookDistributionProfile(KalturaConfigurableDistributionProfile):
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
            apiAuthorizeUrl=NotImplemented,
            pageId=NotImplemented,
            pageAccessToken=NotImplemented,
            userAccessToken=NotImplemented,
            state=NotImplemented,
            permissions=NotImplemented,
            reRequestPermissions=NotImplemented):
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
        self.apiAuthorizeUrl = apiAuthorizeUrl

        # @var string
        self.pageId = pageId

        # @var string
        self.pageAccessToken = pageAccessToken

        # @var string
        self.userAccessToken = userAccessToken

        # @var string
        self.state = state

        # @var string
        self.permissions = permissions

        # @var int
        self.reRequestPermissions = reRequestPermissions


    PROPERTY_LOADERS = {
        'apiAuthorizeUrl': getXmlNodeText, 
        'pageId': getXmlNodeText, 
        'pageAccessToken': getXmlNodeText, 
        'userAccessToken': getXmlNodeText, 
        'state': getXmlNodeText, 
        'permissions': getXmlNodeText, 
        'reRequestPermissions': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFacebookDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaFacebookDistributionProfile")
        kparams.addStringIfDefined("apiAuthorizeUrl", self.apiAuthorizeUrl)
        kparams.addStringIfDefined("pageId", self.pageId)
        kparams.addStringIfDefined("pageAccessToken", self.pageAccessToken)
        kparams.addStringIfDefined("userAccessToken", self.userAccessToken)
        kparams.addStringIfDefined("state", self.state)
        kparams.addStringIfDefined("permissions", self.permissions)
        kparams.addIntIfDefined("reRequestPermissions", self.reRequestPermissions)
        return kparams

    def getApiAuthorizeUrl(self):
        return self.apiAuthorizeUrl

    def setApiAuthorizeUrl(self, newApiAuthorizeUrl):
        self.apiAuthorizeUrl = newApiAuthorizeUrl

    def getPageId(self):
        return self.pageId

    def setPageId(self, newPageId):
        self.pageId = newPageId

    def getPageAccessToken(self):
        return self.pageAccessToken

    def setPageAccessToken(self, newPageAccessToken):
        self.pageAccessToken = newPageAccessToken

    def getUserAccessToken(self):
        return self.userAccessToken

    def setUserAccessToken(self, newUserAccessToken):
        self.userAccessToken = newUserAccessToken

    def getState(self):
        return self.state

    def setState(self, newState):
        self.state = newState

    def getPermissions(self):
        return self.permissions

    def setPermissions(self, newPermissions):
        self.permissions = newPermissions

    def getReRequestPermissions(self):
        return self.reRequestPermissions

    def setReRequestPermissions(self, newReRequestPermissions):
        self.reRequestPermissions = newReRequestPermissions


# @package Kaltura
# @subpackage Client
class KalturaFacebookDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaFacebookDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaFacebookDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFacebookDistributionProviderFilter(KalturaFacebookDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaFacebookDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaFacebookDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFacebookDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFacebookDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaFacebookDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFacebookDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaFacebookDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaFacebookDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFacebookDistributionProfileFilter(KalturaFacebookDistributionProfileBaseFilter):
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
        KalturaFacebookDistributionProfileBaseFilter.__init__(self,
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
        KalturaFacebookDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFacebookDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFacebookDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaFacebookDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaFacebookDistributionClientPlugin(KalturaClientPlugin):
    # KalturaFacebookDistributionClientPlugin
    instance = None

    # @return KalturaFacebookDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaFacebookDistributionClientPlugin.instance == None:
            KalturaFacebookDistributionClientPlugin.instance = KalturaFacebookDistributionClientPlugin()
        return KalturaFacebookDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaFacebookDistributionProfileOrderBy': KalturaFacebookDistributionProfileOrderBy,
            'KalturaFacebookDistributionProviderOrderBy': KalturaFacebookDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaFacebookCaptionDistributionInfo': KalturaFacebookCaptionDistributionInfo,
            'KalturaFacebookDistributionProvider': KalturaFacebookDistributionProvider,
            'KalturaFacebookDistributionJobProviderData': KalturaFacebookDistributionJobProviderData,
            'KalturaFacebookDistributionProfile': KalturaFacebookDistributionProfile,
            'KalturaFacebookDistributionProviderBaseFilter': KalturaFacebookDistributionProviderBaseFilter,
            'KalturaFacebookDistributionProviderFilter': KalturaFacebookDistributionProviderFilter,
            'KalturaFacebookDistributionProfileBaseFilter': KalturaFacebookDistributionProfileBaseFilter,
            'KalturaFacebookDistributionProfileFilter': KalturaFacebookDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'facebookDistribution'

