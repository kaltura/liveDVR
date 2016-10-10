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
class KalturaYouTubeDistributionFeedSpecVersion(object):
    VERSION_1 = "1"
    VERSION_2 = "2"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaYouTubeDistributionProfileOrderBy(object):
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
class KalturaYouTubeDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaYouTubeDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaYouTubeDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaYouTubeDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaYouTubeDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            videoAssetFilePath=NotImplemented,
            thumbAssetFilePath=NotImplemented,
            captionAssetIds=NotImplemented,
            sftpDirectory=NotImplemented,
            sftpMetadataFilename=NotImplemented,
            currentPlaylists=NotImplemented,
            newPlaylists=NotImplemented,
            submitXml=NotImplemented,
            updateXml=NotImplemented,
            deleteXml=NotImplemented,
            googleClientId=NotImplemented,
            googleClientSecret=NotImplemented,
            googleTokenData=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # @var string
        self.videoAssetFilePath = videoAssetFilePath

        # @var string
        self.thumbAssetFilePath = thumbAssetFilePath

        # @var string
        self.captionAssetIds = captionAssetIds

        # @var string
        self.sftpDirectory = sftpDirectory

        # @var string
        self.sftpMetadataFilename = sftpMetadataFilename

        # @var string
        self.currentPlaylists = currentPlaylists

        # @var string
        self.newPlaylists = newPlaylists

        # @var string
        self.submitXml = submitXml

        # @var string
        self.updateXml = updateXml

        # @var string
        self.deleteXml = deleteXml

        # @var string
        self.googleClientId = googleClientId

        # @var string
        self.googleClientSecret = googleClientSecret

        # @var string
        self.googleTokenData = googleTokenData


    PROPERTY_LOADERS = {
        'videoAssetFilePath': getXmlNodeText, 
        'thumbAssetFilePath': getXmlNodeText, 
        'captionAssetIds': getXmlNodeText, 
        'sftpDirectory': getXmlNodeText, 
        'sftpMetadataFilename': getXmlNodeText, 
        'currentPlaylists': getXmlNodeText, 
        'newPlaylists': getXmlNodeText, 
        'submitXml': getXmlNodeText, 
        'updateXml': getXmlNodeText, 
        'deleteXml': getXmlNodeText, 
        'googleClientId': getXmlNodeText, 
        'googleClientSecret': getXmlNodeText, 
        'googleTokenData': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaYouTubeDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaYouTubeDistributionJobProviderData")
        kparams.addStringIfDefined("videoAssetFilePath", self.videoAssetFilePath)
        kparams.addStringIfDefined("thumbAssetFilePath", self.thumbAssetFilePath)
        kparams.addStringIfDefined("captionAssetIds", self.captionAssetIds)
        kparams.addStringIfDefined("sftpDirectory", self.sftpDirectory)
        kparams.addStringIfDefined("sftpMetadataFilename", self.sftpMetadataFilename)
        kparams.addStringIfDefined("currentPlaylists", self.currentPlaylists)
        kparams.addStringIfDefined("newPlaylists", self.newPlaylists)
        kparams.addStringIfDefined("submitXml", self.submitXml)
        kparams.addStringIfDefined("updateXml", self.updateXml)
        kparams.addStringIfDefined("deleteXml", self.deleteXml)
        kparams.addStringIfDefined("googleClientId", self.googleClientId)
        kparams.addStringIfDefined("googleClientSecret", self.googleClientSecret)
        kparams.addStringIfDefined("googleTokenData", self.googleTokenData)
        return kparams

    def getVideoAssetFilePath(self):
        return self.videoAssetFilePath

    def setVideoAssetFilePath(self, newVideoAssetFilePath):
        self.videoAssetFilePath = newVideoAssetFilePath

    def getThumbAssetFilePath(self):
        return self.thumbAssetFilePath

    def setThumbAssetFilePath(self, newThumbAssetFilePath):
        self.thumbAssetFilePath = newThumbAssetFilePath

    def getCaptionAssetIds(self):
        return self.captionAssetIds

    def setCaptionAssetIds(self, newCaptionAssetIds):
        self.captionAssetIds = newCaptionAssetIds

    def getSftpDirectory(self):
        return self.sftpDirectory

    def setSftpDirectory(self, newSftpDirectory):
        self.sftpDirectory = newSftpDirectory

    def getSftpMetadataFilename(self):
        return self.sftpMetadataFilename

    def setSftpMetadataFilename(self, newSftpMetadataFilename):
        self.sftpMetadataFilename = newSftpMetadataFilename

    def getCurrentPlaylists(self):
        return self.currentPlaylists

    def setCurrentPlaylists(self, newCurrentPlaylists):
        self.currentPlaylists = newCurrentPlaylists

    def getNewPlaylists(self):
        return self.newPlaylists

    def setNewPlaylists(self, newNewPlaylists):
        self.newPlaylists = newNewPlaylists

    def getSubmitXml(self):
        return self.submitXml

    def setSubmitXml(self, newSubmitXml):
        self.submitXml = newSubmitXml

    def getUpdateXml(self):
        return self.updateXml

    def setUpdateXml(self, newUpdateXml):
        self.updateXml = newUpdateXml

    def getDeleteXml(self):
        return self.deleteXml

    def setDeleteXml(self, newDeleteXml):
        self.deleteXml = newDeleteXml

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


# @package Kaltura
# @subpackage Client
class KalturaYouTubeDistributionProfile(KalturaConfigurableDistributionProfile):
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
            feedSpecVersion=NotImplemented,
            username=NotImplemented,
            notificationEmail=NotImplemented,
            sftpHost=NotImplemented,
            sftpPort=NotImplemented,
            sftpLogin=NotImplemented,
            sftpPublicKey=NotImplemented,
            sftpPrivateKey=NotImplemented,
            sftpBaseDir=NotImplemented,
            ownerName=NotImplemented,
            defaultCategory=NotImplemented,
            allowComments=NotImplemented,
            allowEmbedding=NotImplemented,
            allowRatings=NotImplemented,
            allowResponses=NotImplemented,
            commercialPolicy=NotImplemented,
            ugcPolicy=NotImplemented,
            target=NotImplemented,
            adServerPartnerId=NotImplemented,
            enableAdServer=NotImplemented,
            allowPreRollAds=NotImplemented,
            allowPostRollAds=NotImplemented,
            strict=NotImplemented,
            overrideManualEdits=NotImplemented,
            urgentReference=NotImplemented,
            allowSyndication=NotImplemented,
            hideViewCount=NotImplemented,
            allowAdsenseForVideo=NotImplemented,
            allowInvideo=NotImplemented,
            allowMidRollAds=NotImplemented,
            instreamStandard=NotImplemented,
            instreamTrueview=NotImplemented,
            claimType=NotImplemented,
            blockOutsideOwnership=NotImplemented,
            captionAutosync=NotImplemented,
            deleteReference=NotImplemented,
            releaseClaims=NotImplemented,
            apiAuthorizeUrl=NotImplemented):
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

        # @var KalturaYouTubeDistributionFeedSpecVersion
        self.feedSpecVersion = feedSpecVersion

        # @var string
        self.username = username

        # @var string
        self.notificationEmail = notificationEmail

        # @var string
        self.sftpHost = sftpHost

        # @var int
        self.sftpPort = sftpPort

        # @var string
        self.sftpLogin = sftpLogin

        # @var string
        self.sftpPublicKey = sftpPublicKey

        # @var string
        self.sftpPrivateKey = sftpPrivateKey

        # @var string
        self.sftpBaseDir = sftpBaseDir

        # @var string
        self.ownerName = ownerName

        # @var string
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
        self.commercialPolicy = commercialPolicy

        # @var string
        self.ugcPolicy = ugcPolicy

        # @var string
        self.target = target

        # @var string
        self.adServerPartnerId = adServerPartnerId

        # @var bool
        self.enableAdServer = enableAdServer

        # @var bool
        self.allowPreRollAds = allowPreRollAds

        # @var bool
        self.allowPostRollAds = allowPostRollAds

        # @var string
        self.strict = strict

        # @var string
        self.overrideManualEdits = overrideManualEdits

        # @var string
        self.urgentReference = urgentReference

        # @var string
        self.allowSyndication = allowSyndication

        # @var string
        self.hideViewCount = hideViewCount

        # @var string
        self.allowAdsenseForVideo = allowAdsenseForVideo

        # @var string
        self.allowInvideo = allowInvideo

        # @var bool
        self.allowMidRollAds = allowMidRollAds

        # @var string
        self.instreamStandard = instreamStandard

        # @var string
        self.instreamTrueview = instreamTrueview

        # @var string
        self.claimType = claimType

        # @var string
        self.blockOutsideOwnership = blockOutsideOwnership

        # @var string
        self.captionAutosync = captionAutosync

        # @var bool
        self.deleteReference = deleteReference

        # @var bool
        self.releaseClaims = releaseClaims

        # @var string
        self.apiAuthorizeUrl = apiAuthorizeUrl


    PROPERTY_LOADERS = {
        'feedSpecVersion': (KalturaEnumsFactory.createString, "KalturaYouTubeDistributionFeedSpecVersion"), 
        'username': getXmlNodeText, 
        'notificationEmail': getXmlNodeText, 
        'sftpHost': getXmlNodeText, 
        'sftpPort': getXmlNodeInt, 
        'sftpLogin': getXmlNodeText, 
        'sftpPublicKey': getXmlNodeText, 
        'sftpPrivateKey': getXmlNodeText, 
        'sftpBaseDir': getXmlNodeText, 
        'ownerName': getXmlNodeText, 
        'defaultCategory': getXmlNodeText, 
        'allowComments': getXmlNodeText, 
        'allowEmbedding': getXmlNodeText, 
        'allowRatings': getXmlNodeText, 
        'allowResponses': getXmlNodeText, 
        'commercialPolicy': getXmlNodeText, 
        'ugcPolicy': getXmlNodeText, 
        'target': getXmlNodeText, 
        'adServerPartnerId': getXmlNodeText, 
        'enableAdServer': getXmlNodeBool, 
        'allowPreRollAds': getXmlNodeBool, 
        'allowPostRollAds': getXmlNodeBool, 
        'strict': getXmlNodeText, 
        'overrideManualEdits': getXmlNodeText, 
        'urgentReference': getXmlNodeText, 
        'allowSyndication': getXmlNodeText, 
        'hideViewCount': getXmlNodeText, 
        'allowAdsenseForVideo': getXmlNodeText, 
        'allowInvideo': getXmlNodeText, 
        'allowMidRollAds': getXmlNodeBool, 
        'instreamStandard': getXmlNodeText, 
        'instreamTrueview': getXmlNodeText, 
        'claimType': getXmlNodeText, 
        'blockOutsideOwnership': getXmlNodeText, 
        'captionAutosync': getXmlNodeText, 
        'deleteReference': getXmlNodeBool, 
        'releaseClaims': getXmlNodeBool, 
        'apiAuthorizeUrl': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaYouTubeDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaYouTubeDistributionProfile")
        kparams.addStringEnumIfDefined("feedSpecVersion", self.feedSpecVersion)
        kparams.addStringIfDefined("username", self.username)
        kparams.addStringIfDefined("notificationEmail", self.notificationEmail)
        kparams.addStringIfDefined("sftpHost", self.sftpHost)
        kparams.addIntIfDefined("sftpPort", self.sftpPort)
        kparams.addStringIfDefined("sftpLogin", self.sftpLogin)
        kparams.addStringIfDefined("sftpPublicKey", self.sftpPublicKey)
        kparams.addStringIfDefined("sftpPrivateKey", self.sftpPrivateKey)
        kparams.addStringIfDefined("sftpBaseDir", self.sftpBaseDir)
        kparams.addStringIfDefined("ownerName", self.ownerName)
        kparams.addStringIfDefined("defaultCategory", self.defaultCategory)
        kparams.addStringIfDefined("allowComments", self.allowComments)
        kparams.addStringIfDefined("allowEmbedding", self.allowEmbedding)
        kparams.addStringIfDefined("allowRatings", self.allowRatings)
        kparams.addStringIfDefined("allowResponses", self.allowResponses)
        kparams.addStringIfDefined("commercialPolicy", self.commercialPolicy)
        kparams.addStringIfDefined("ugcPolicy", self.ugcPolicy)
        kparams.addStringIfDefined("target", self.target)
        kparams.addStringIfDefined("adServerPartnerId", self.adServerPartnerId)
        kparams.addBoolIfDefined("enableAdServer", self.enableAdServer)
        kparams.addBoolIfDefined("allowPreRollAds", self.allowPreRollAds)
        kparams.addBoolIfDefined("allowPostRollAds", self.allowPostRollAds)
        kparams.addStringIfDefined("strict", self.strict)
        kparams.addStringIfDefined("overrideManualEdits", self.overrideManualEdits)
        kparams.addStringIfDefined("urgentReference", self.urgentReference)
        kparams.addStringIfDefined("allowSyndication", self.allowSyndication)
        kparams.addStringIfDefined("hideViewCount", self.hideViewCount)
        kparams.addStringIfDefined("allowAdsenseForVideo", self.allowAdsenseForVideo)
        kparams.addStringIfDefined("allowInvideo", self.allowInvideo)
        kparams.addBoolIfDefined("allowMidRollAds", self.allowMidRollAds)
        kparams.addStringIfDefined("instreamStandard", self.instreamStandard)
        kparams.addStringIfDefined("instreamTrueview", self.instreamTrueview)
        kparams.addStringIfDefined("claimType", self.claimType)
        kparams.addStringIfDefined("blockOutsideOwnership", self.blockOutsideOwnership)
        kparams.addStringIfDefined("captionAutosync", self.captionAutosync)
        kparams.addBoolIfDefined("deleteReference", self.deleteReference)
        kparams.addBoolIfDefined("releaseClaims", self.releaseClaims)
        kparams.addStringIfDefined("apiAuthorizeUrl", self.apiAuthorizeUrl)
        return kparams

    def getFeedSpecVersion(self):
        return self.feedSpecVersion

    def setFeedSpecVersion(self, newFeedSpecVersion):
        self.feedSpecVersion = newFeedSpecVersion

    def getUsername(self):
        return self.username

    def setUsername(self, newUsername):
        self.username = newUsername

    def getNotificationEmail(self):
        return self.notificationEmail

    def setNotificationEmail(self, newNotificationEmail):
        self.notificationEmail = newNotificationEmail

    def getSftpHost(self):
        return self.sftpHost

    def setSftpHost(self, newSftpHost):
        self.sftpHost = newSftpHost

    def getSftpPort(self):
        return self.sftpPort

    def setSftpPort(self, newSftpPort):
        self.sftpPort = newSftpPort

    def getSftpLogin(self):
        return self.sftpLogin

    def setSftpLogin(self, newSftpLogin):
        self.sftpLogin = newSftpLogin

    def getSftpPublicKey(self):
        return self.sftpPublicKey

    def setSftpPublicKey(self, newSftpPublicKey):
        self.sftpPublicKey = newSftpPublicKey

    def getSftpPrivateKey(self):
        return self.sftpPrivateKey

    def setSftpPrivateKey(self, newSftpPrivateKey):
        self.sftpPrivateKey = newSftpPrivateKey

    def getSftpBaseDir(self):
        return self.sftpBaseDir

    def setSftpBaseDir(self, newSftpBaseDir):
        self.sftpBaseDir = newSftpBaseDir

    def getOwnerName(self):
        return self.ownerName

    def setOwnerName(self, newOwnerName):
        self.ownerName = newOwnerName

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

    def getCommercialPolicy(self):
        return self.commercialPolicy

    def setCommercialPolicy(self, newCommercialPolicy):
        self.commercialPolicy = newCommercialPolicy

    def getUgcPolicy(self):
        return self.ugcPolicy

    def setUgcPolicy(self, newUgcPolicy):
        self.ugcPolicy = newUgcPolicy

    def getTarget(self):
        return self.target

    def setTarget(self, newTarget):
        self.target = newTarget

    def getAdServerPartnerId(self):
        return self.adServerPartnerId

    def setAdServerPartnerId(self, newAdServerPartnerId):
        self.adServerPartnerId = newAdServerPartnerId

    def getEnableAdServer(self):
        return self.enableAdServer

    def setEnableAdServer(self, newEnableAdServer):
        self.enableAdServer = newEnableAdServer

    def getAllowPreRollAds(self):
        return self.allowPreRollAds

    def setAllowPreRollAds(self, newAllowPreRollAds):
        self.allowPreRollAds = newAllowPreRollAds

    def getAllowPostRollAds(self):
        return self.allowPostRollAds

    def setAllowPostRollAds(self, newAllowPostRollAds):
        self.allowPostRollAds = newAllowPostRollAds

    def getStrict(self):
        return self.strict

    def setStrict(self, newStrict):
        self.strict = newStrict

    def getOverrideManualEdits(self):
        return self.overrideManualEdits

    def setOverrideManualEdits(self, newOverrideManualEdits):
        self.overrideManualEdits = newOverrideManualEdits

    def getUrgentReference(self):
        return self.urgentReference

    def setUrgentReference(self, newUrgentReference):
        self.urgentReference = newUrgentReference

    def getAllowSyndication(self):
        return self.allowSyndication

    def setAllowSyndication(self, newAllowSyndication):
        self.allowSyndication = newAllowSyndication

    def getHideViewCount(self):
        return self.hideViewCount

    def setHideViewCount(self, newHideViewCount):
        self.hideViewCount = newHideViewCount

    def getAllowAdsenseForVideo(self):
        return self.allowAdsenseForVideo

    def setAllowAdsenseForVideo(self, newAllowAdsenseForVideo):
        self.allowAdsenseForVideo = newAllowAdsenseForVideo

    def getAllowInvideo(self):
        return self.allowInvideo

    def setAllowInvideo(self, newAllowInvideo):
        self.allowInvideo = newAllowInvideo

    def getAllowMidRollAds(self):
        return self.allowMidRollAds

    def setAllowMidRollAds(self, newAllowMidRollAds):
        self.allowMidRollAds = newAllowMidRollAds

    def getInstreamStandard(self):
        return self.instreamStandard

    def setInstreamStandard(self, newInstreamStandard):
        self.instreamStandard = newInstreamStandard

    def getInstreamTrueview(self):
        return self.instreamTrueview

    def setInstreamTrueview(self, newInstreamTrueview):
        self.instreamTrueview = newInstreamTrueview

    def getClaimType(self):
        return self.claimType

    def setClaimType(self, newClaimType):
        self.claimType = newClaimType

    def getBlockOutsideOwnership(self):
        return self.blockOutsideOwnership

    def setBlockOutsideOwnership(self, newBlockOutsideOwnership):
        self.blockOutsideOwnership = newBlockOutsideOwnership

    def getCaptionAutosync(self):
        return self.captionAutosync

    def setCaptionAutosync(self, newCaptionAutosync):
        self.captionAutosync = newCaptionAutosync

    def getDeleteReference(self):
        return self.deleteReference

    def setDeleteReference(self, newDeleteReference):
        self.deleteReference = newDeleteReference

    def getReleaseClaims(self):
        return self.releaseClaims

    def setReleaseClaims(self, newReleaseClaims):
        self.releaseClaims = newReleaseClaims

    def getApiAuthorizeUrl(self):
        return self.apiAuthorizeUrl

    def setApiAuthorizeUrl(self, newApiAuthorizeUrl):
        self.apiAuthorizeUrl = newApiAuthorizeUrl


# @package Kaltura
# @subpackage Client
class KalturaYouTubeDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaYouTubeDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaYouTubeDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaYouTubeDistributionProviderFilter(KalturaYouTubeDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaYouTubeDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaYouTubeDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaYouTubeDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaYouTubeDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaYouTubeDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaYouTubeDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaYouTubeDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaYouTubeDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaYouTubeDistributionProfileFilter(KalturaYouTubeDistributionProfileBaseFilter):
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
        KalturaYouTubeDistributionProfileBaseFilter.__init__(self,
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
        KalturaYouTubeDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaYouTubeDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaYouTubeDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaYouTubeDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaYouTubeDistributionClientPlugin(KalturaClientPlugin):
    # KalturaYouTubeDistributionClientPlugin
    instance = None

    # @return KalturaYouTubeDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaYouTubeDistributionClientPlugin.instance == None:
            KalturaYouTubeDistributionClientPlugin.instance = KalturaYouTubeDistributionClientPlugin()
        return KalturaYouTubeDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaYouTubeDistributionFeedSpecVersion': KalturaYouTubeDistributionFeedSpecVersion,
            'KalturaYouTubeDistributionProfileOrderBy': KalturaYouTubeDistributionProfileOrderBy,
            'KalturaYouTubeDistributionProviderOrderBy': KalturaYouTubeDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaYouTubeDistributionProvider': KalturaYouTubeDistributionProvider,
            'KalturaYouTubeDistributionJobProviderData': KalturaYouTubeDistributionJobProviderData,
            'KalturaYouTubeDistributionProfile': KalturaYouTubeDistributionProfile,
            'KalturaYouTubeDistributionProviderBaseFilter': KalturaYouTubeDistributionProviderBaseFilter,
            'KalturaYouTubeDistributionProviderFilter': KalturaYouTubeDistributionProviderFilter,
            'KalturaYouTubeDistributionProfileBaseFilter': KalturaYouTubeDistributionProfileBaseFilter,
            'KalturaYouTubeDistributionProfileFilter': KalturaYouTubeDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'youTubeDistribution'

