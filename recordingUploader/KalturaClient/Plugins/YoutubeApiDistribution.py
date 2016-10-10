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
class KalturaYouTubeApiDistributionCaptionAction(object):
    UPDATE_ACTION = 1
    SUBMIT_ACTION = 2
    DELETE_ACTION = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaYoutubeApiDistributionProfileOrderBy(object):
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
class KalturaYoutubeApiDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaYouTubeApiCaptionDistributionInfo(KalturaObjectBase):
    def __init__(self,
            language=NotImplemented,
            label=NotImplemented,
            filePath=NotImplemented,
            remoteId=NotImplemented,
            action=NotImplemented,
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

        # @var KalturaYouTubeApiDistributionCaptionAction
        self.action = action

        # @var string
        self.version = version

        # @var string
        self.assetId = assetId


    PROPERTY_LOADERS = {
        'language': getXmlNodeText, 
        'label': getXmlNodeText, 
        'filePath': getXmlNodeText, 
        'remoteId': getXmlNodeText, 
        'action': (KalturaEnumsFactory.createInt, "KalturaYouTubeApiDistributionCaptionAction"), 
        'version': getXmlNodeText, 
        'assetId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaYouTubeApiCaptionDistributionInfo.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaYouTubeApiCaptionDistributionInfo")
        kparams.addStringIfDefined("language", self.language)
        kparams.addStringIfDefined("label", self.label)
        kparams.addStringIfDefined("filePath", self.filePath)
        kparams.addStringIfDefined("remoteId", self.remoteId)
        kparams.addIntEnumIfDefined("action", self.action)
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


# @package Kaltura
# @subpackage Client
class KalturaYoutubeApiDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaYoutubeApiDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaYoutubeApiDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaYoutubeApiDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
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

        # @var array of KalturaYouTubeApiCaptionDistributionInfo
        self.captionsInfo = captionsInfo


    PROPERTY_LOADERS = {
        'videoAssetFilePath': getXmlNodeText, 
        'thumbAssetFilePath': getXmlNodeText, 
        'captionsInfo': (KalturaObjectFactory.createArray, KalturaYouTubeApiCaptionDistributionInfo), 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaYoutubeApiDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaYoutubeApiDistributionJobProviderData")
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
class KalturaYoutubeApiDistributionProfile(KalturaConfigurableDistributionProfile):
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
            username=NotImplemented,
            defaultCategory=NotImplemented,
            allowComments=NotImplemented,
            allowEmbedding=NotImplemented,
            allowRatings=NotImplemented,
            allowResponses=NotImplemented,
            apiAuthorizeUrl=NotImplemented,
            googleClientId=NotImplemented,
            googleClientSecret=NotImplemented,
            googleTokenData=NotImplemented,
            assumeSuccess=NotImplemented,
            privacyStatus=NotImplemented):
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
        self.username = username

        # @var int
        self.defaultCategory = defaultCategory

        # @var string
        self.allowComments = allowComments

        # @var string
        self.allowEmbedding = allowEmbedding

        # @var string
        self.allowRatings = allowRatings

        # @var string
        self.allowResponses = allowResponses

        # @var string
        self.apiAuthorizeUrl = apiAuthorizeUrl

        # @var string
        self.googleClientId = googleClientId

        # @var string
        self.googleClientSecret = googleClientSecret

        # @var string
        self.googleTokenData = googleTokenData

        # @var bool
        self.assumeSuccess = assumeSuccess

        # @var string
        self.privacyStatus = privacyStatus


    PROPERTY_LOADERS = {
        'username': getXmlNodeText, 
        'defaultCategory': getXmlNodeInt, 
        'allowComments': getXmlNodeText, 
        'allowEmbedding': getXmlNodeText, 
        'allowRatings': getXmlNodeText, 
        'allowResponses': getXmlNodeText, 
        'apiAuthorizeUrl': getXmlNodeText, 
        'googleClientId': getXmlNodeText, 
        'googleClientSecret': getXmlNodeText, 
        'googleTokenData': getXmlNodeText, 
        'assumeSuccess': getXmlNodeBool, 
        'privacyStatus': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaYoutubeApiDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaYoutubeApiDistributionProfile")
        kparams.addStringIfDefined("username", self.username)
        kparams.addIntIfDefined("defaultCategory", self.defaultCategory)
        kparams.addStringIfDefined("allowComments", self.allowComments)
        kparams.addStringIfDefined("allowEmbedding", self.allowEmbedding)
        kparams.addStringIfDefined("allowRatings", self.allowRatings)
        kparams.addStringIfDefined("allowResponses", self.allowResponses)
        kparams.addStringIfDefined("apiAuthorizeUrl", self.apiAuthorizeUrl)
        kparams.addStringIfDefined("googleClientId", self.googleClientId)
        kparams.addStringIfDefined("googleClientSecret", self.googleClientSecret)
        kparams.addStringIfDefined("googleTokenData", self.googleTokenData)
        kparams.addBoolIfDefined("assumeSuccess", self.assumeSuccess)
        kparams.addStringIfDefined("privacyStatus", self.privacyStatus)
        return kparams

    def getUsername(self):
        return self.username

    def setUsername(self, newUsername):
        self.username = newUsername

    def getDefaultCategory(self):
        return self.defaultCategory

    def setDefaultCategory(self, newDefaultCategory):
        self.defaultCategory = newDefaultCategory

    def getAllowComments(self):
        return self.allowComments

    def setAllowComments(self, newAllowComments):
        self.allowComments = newAllowComments

    def getAllowEmbedding(self):
        return self.allowEmbedding

    def setAllowEmbedding(self, newAllowEmbedding):
        self.allowEmbedding = newAllowEmbedding

    def getAllowRatings(self):
        return self.allowRatings

    def setAllowRatings(self, newAllowRatings):
        self.allowRatings = newAllowRatings

    def getAllowResponses(self):
        return self.allowResponses

    def setAllowResponses(self, newAllowResponses):
        self.allowResponses = newAllowResponses

    def getApiAuthorizeUrl(self):
        return self.apiAuthorizeUrl

    def setApiAuthorizeUrl(self, newApiAuthorizeUrl):
        self.apiAuthorizeUrl = newApiAuthorizeUrl

    def getGoogleClientId(self):
        return self.googleClientId

    def setGoogleClientId(self, newGoogleClientId):
        self.googleClientId = newGoogleClientId

    def getGoogleClientSecret(self):
        return self.googleClientSecret

    def setGoogleClientSecret(self, newGoogleClientSecret):
        self.googleClientSecret = newGoogleClientSecret

    def getGoogleTokenData(self):
        return self.googleTokenData

    def setGoogleTokenData(self, newGoogleTokenData):
        self.googleTokenData = newGoogleTokenData

    def getAssumeSuccess(self):
        return self.assumeSuccess

    def setAssumeSuccess(self, newAssumeSuccess):
        self.assumeSuccess = newAssumeSuccess

    def getPrivacyStatus(self):
        return self.privacyStatus

    def setPrivacyStatus(self, newPrivacyStatus):
        self.privacyStatus = newPrivacyStatus


# @package Kaltura
# @subpackage Client
class KalturaYoutubeApiDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaYoutubeApiDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaYoutubeApiDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaYoutubeApiDistributionProviderFilter(KalturaYoutubeApiDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaYoutubeApiDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaYoutubeApiDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaYoutubeApiDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaYoutubeApiDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaYoutubeApiDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaYoutubeApiDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaYoutubeApiDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaYoutubeApiDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaYoutubeApiDistributionProfileFilter(KalturaYoutubeApiDistributionProfileBaseFilter):
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
        KalturaYoutubeApiDistributionProfileBaseFilter.__init__(self,
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
        KalturaYoutubeApiDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaYoutubeApiDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaYoutubeApiDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaYoutubeApiDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaYoutubeApiDistributionClientPlugin(KalturaClientPlugin):
    # KalturaYoutubeApiDistributionClientPlugin
    instance = None

    # @return KalturaYoutubeApiDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaYoutubeApiDistributionClientPlugin.instance == None:
            KalturaYoutubeApiDistributionClientPlugin.instance = KalturaYoutubeApiDistributionClientPlugin()
        return KalturaYoutubeApiDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaYouTubeApiDistributionCaptionAction': KalturaYouTubeApiDistributionCaptionAction,
            'KalturaYoutubeApiDistributionProfileOrderBy': KalturaYoutubeApiDistributionProfileOrderBy,
            'KalturaYoutubeApiDistributionProviderOrderBy': KalturaYoutubeApiDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaYouTubeApiCaptionDistributionInfo': KalturaYouTubeApiCaptionDistributionInfo,
            'KalturaYoutubeApiDistributionProvider': KalturaYoutubeApiDistributionProvider,
            'KalturaYoutubeApiDistributionJobProviderData': KalturaYoutubeApiDistributionJobProviderData,
            'KalturaYoutubeApiDistributionProfile': KalturaYoutubeApiDistributionProfile,
            'KalturaYoutubeApiDistributionProviderBaseFilter': KalturaYoutubeApiDistributionProviderBaseFilter,
            'KalturaYoutubeApiDistributionProviderFilter': KalturaYoutubeApiDistributionProviderFilter,
            'KalturaYoutubeApiDistributionProfileBaseFilter': KalturaYoutubeApiDistributionProfileBaseFilter,
            'KalturaYoutubeApiDistributionProfileFilter': KalturaYoutubeApiDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'youtubeApiDistribution'

