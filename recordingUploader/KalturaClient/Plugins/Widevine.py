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
from Drm import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaWidevineRepositorySyncMode(object):
    MODIFY = 0

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaWidevineFlavorAssetOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    DELETED_AT_ASC = "+deletedAt"
    SIZE_ASC = "+size"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    DELETED_AT_DESC = "-deletedAt"
    SIZE_DESC = "-size"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaWidevineFlavorParamsOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaWidevineFlavorParamsOutputOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaWidevineProfileOrderBy(object):
    ID_ASC = "+id"
    NAME_ASC = "+name"
    ID_DESC = "-id"
    NAME_DESC = "-name"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaWidevineProfile(KalturaDrmProfile):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            description=NotImplemented,
            provider=NotImplemented,
            status=NotImplemented,
            licenseServerUrl=NotImplemented,
            defaultPolicy=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            signingKey=NotImplemented,
            key=NotImplemented,
            iv=NotImplemented,
            owner=NotImplemented,
            portal=NotImplemented,
            maxGop=NotImplemented,
            regServerHost=NotImplemented):
        KalturaDrmProfile.__init__(self,
            id,
            partnerId,
            name,
            description,
            provider,
            status,
            licenseServerUrl,
            defaultPolicy,
            createdAt,
            updatedAt,
            signingKey)

        # @var string
        self.key = key

        # @var string
        self.iv = iv

        # @var string
        self.owner = owner

        # @var string
        self.portal = portal

        # @var int
        self.maxGop = maxGop

        # @var string
        self.regServerHost = regServerHost


    PROPERTY_LOADERS = {
        'key': getXmlNodeText, 
        'iv': getXmlNodeText, 
        'owner': getXmlNodeText, 
        'portal': getXmlNodeText, 
        'maxGop': getXmlNodeInt, 
        'regServerHost': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDrmProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWidevineProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDrmProfile.toParams(self)
        kparams.put("objectType", "KalturaWidevineProfile")
        kparams.addStringIfDefined("key", self.key)
        kparams.addStringIfDefined("iv", self.iv)
        kparams.addStringIfDefined("owner", self.owner)
        kparams.addStringIfDefined("portal", self.portal)
        kparams.addIntIfDefined("maxGop", self.maxGop)
        kparams.addStringIfDefined("regServerHost", self.regServerHost)
        return kparams

    def getKey(self):
        return self.key

    def setKey(self, newKey):
        self.key = newKey

    def getIv(self):
        return self.iv

    def setIv(self, newIv):
        self.iv = newIv

    def getOwner(self):
        return self.owner

    def setOwner(self, newOwner):
        self.owner = newOwner

    def getPortal(self):
        return self.portal

    def setPortal(self, newPortal):
        self.portal = newPortal

    def getMaxGop(self):
        return self.maxGop

    def setMaxGop(self, newMaxGop):
        self.maxGop = newMaxGop

    def getRegServerHost(self):
        return self.regServerHost

    def setRegServerHost(self, newRegServerHost):
        self.regServerHost = newRegServerHost


# @package Kaltura
# @subpackage Client
class KalturaWidevineRepositorySyncJobData(KalturaJobData):
    def __init__(self,
            syncMode=NotImplemented,
            wvAssetIds=NotImplemented,
            modifiedAttributes=NotImplemented,
            monitorSyncCompletion=NotImplemented):
        KalturaJobData.__init__(self)

        # @var KalturaWidevineRepositorySyncMode
        self.syncMode = syncMode

        # @var string
        self.wvAssetIds = wvAssetIds

        # @var string
        self.modifiedAttributes = modifiedAttributes

        # @var int
        self.monitorSyncCompletion = monitorSyncCompletion


    PROPERTY_LOADERS = {
        'syncMode': (KalturaEnumsFactory.createInt, "KalturaWidevineRepositorySyncMode"), 
        'wvAssetIds': getXmlNodeText, 
        'modifiedAttributes': getXmlNodeText, 
        'monitorSyncCompletion': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWidevineRepositorySyncJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaJobData.toParams(self)
        kparams.put("objectType", "KalturaWidevineRepositorySyncJobData")
        kparams.addIntEnumIfDefined("syncMode", self.syncMode)
        kparams.addStringIfDefined("wvAssetIds", self.wvAssetIds)
        kparams.addStringIfDefined("modifiedAttributes", self.modifiedAttributes)
        kparams.addIntIfDefined("monitorSyncCompletion", self.monitorSyncCompletion)
        return kparams

    def getSyncMode(self):
        return self.syncMode

    def setSyncMode(self, newSyncMode):
        self.syncMode = newSyncMode

    def getWvAssetIds(self):
        return self.wvAssetIds

    def setWvAssetIds(self, newWvAssetIds):
        self.wvAssetIds = newWvAssetIds

    def getModifiedAttributes(self):
        return self.modifiedAttributes

    def setModifiedAttributes(self, newModifiedAttributes):
        self.modifiedAttributes = newModifiedAttributes

    def getMonitorSyncCompletion(self):
        return self.monitorSyncCompletion

    def setMonitorSyncCompletion(self, newMonitorSyncCompletion):
        self.monitorSyncCompletion = newMonitorSyncCompletion


# @package Kaltura
# @subpackage Client
class KalturaWidevineFlavorAsset(KalturaFlavorAsset):
    def __init__(self,
            id=NotImplemented,
            entryId=NotImplemented,
            partnerId=NotImplemented,
            version=NotImplemented,
            size=NotImplemented,
            tags=NotImplemented,
            fileExt=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            deletedAt=NotImplemented,
            description=NotImplemented,
            partnerData=NotImplemented,
            partnerDescription=NotImplemented,
            actualSourceAssetParamsIds=NotImplemented,
            flavorParamsId=NotImplemented,
            width=NotImplemented,
            height=NotImplemented,
            bitrate=NotImplemented,
            frameRate=NotImplemented,
            isOriginal=NotImplemented,
            isWeb=NotImplemented,
            containerFormat=NotImplemented,
            videoCodecId=NotImplemented,
            status=NotImplemented,
            language=NotImplemented,
            widevineDistributionStartDate=NotImplemented,
            widevineDistributionEndDate=NotImplemented,
            widevineAssetId=NotImplemented):
        KalturaFlavorAsset.__init__(self,
            id,
            entryId,
            partnerId,
            version,
            size,
            tags,
            fileExt,
            createdAt,
            updatedAt,
            deletedAt,
            description,
            partnerData,
            partnerDescription,
            actualSourceAssetParamsIds,
            flavorParamsId,
            width,
            height,
            bitrate,
            frameRate,
            isOriginal,
            isWeb,
            containerFormat,
            videoCodecId,
            status,
            language)

        # License distribution window start date
        # @var int
        self.widevineDistributionStartDate = widevineDistributionStartDate

        # License distribution window end date
        # @var int
        self.widevineDistributionEndDate = widevineDistributionEndDate

        # Widevine unique asset id
        # @var int
        self.widevineAssetId = widevineAssetId


    PROPERTY_LOADERS = {
        'widevineDistributionStartDate': getXmlNodeInt, 
        'widevineDistributionEndDate': getXmlNodeInt, 
        'widevineAssetId': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaFlavorAsset.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWidevineFlavorAsset.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorAsset.toParams(self)
        kparams.put("objectType", "KalturaWidevineFlavorAsset")
        kparams.addIntIfDefined("widevineDistributionStartDate", self.widevineDistributionStartDate)
        kparams.addIntIfDefined("widevineDistributionEndDate", self.widevineDistributionEndDate)
        kparams.addIntIfDefined("widevineAssetId", self.widevineAssetId)
        return kparams

    def getWidevineDistributionStartDate(self):
        return self.widevineDistributionStartDate

    def setWidevineDistributionStartDate(self, newWidevineDistributionStartDate):
        self.widevineDistributionStartDate = newWidevineDistributionStartDate

    def getWidevineDistributionEndDate(self):
        return self.widevineDistributionEndDate

    def setWidevineDistributionEndDate(self, newWidevineDistributionEndDate):
        self.widevineDistributionEndDate = newWidevineDistributionEndDate

    def getWidevineAssetId(self):
        return self.widevineAssetId

    def setWidevineAssetId(self, newWidevineAssetId):
        self.widevineAssetId = newWidevineAssetId


# @package Kaltura
# @subpackage Client
class KalturaWidevineFlavorParams(KalturaFlavorParams):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            createdAt=NotImplemented,
            isSystemDefault=NotImplemented,
            tags=NotImplemented,
            requiredPermissions=NotImplemented,
            sourceRemoteStorageProfileId=NotImplemented,
            remoteStorageProfileIds=NotImplemented,
            mediaParserType=NotImplemented,
            sourceAssetParamsIds=NotImplemented,
            videoCodec=NotImplemented,
            videoBitrate=NotImplemented,
            audioCodec=NotImplemented,
            audioBitrate=NotImplemented,
            audioChannels=NotImplemented,
            audioSampleRate=NotImplemented,
            width=NotImplemented,
            height=NotImplemented,
            frameRate=NotImplemented,
            gopSize=NotImplemented,
            conversionEngines=NotImplemented,
            conversionEnginesExtraParams=NotImplemented,
            twoPass=NotImplemented,
            deinterlice=NotImplemented,
            rotate=NotImplemented,
            operators=NotImplemented,
            engineVersion=NotImplemented,
            format=NotImplemented,
            aspectRatioProcessingMode=NotImplemented,
            forceFrameToMultiplication16=NotImplemented,
            isGopInSec=NotImplemented,
            isAvoidVideoShrinkFramesizeToSource=NotImplemented,
            isAvoidVideoShrinkBitrateToSource=NotImplemented,
            isVideoFrameRateForLowBrAppleHls=NotImplemented,
            multiStream=NotImplemented,
            anamorphicPixels=NotImplemented,
            isAvoidForcedKeyFrames=NotImplemented,
            isCropIMX=NotImplemented,
            optimizationPolicy=NotImplemented,
            maxFrameRate=NotImplemented,
            videoConstantBitrate=NotImplemented,
            videoBitrateTolerance=NotImplemented,
            watermarkData=NotImplemented,
            subtitlesData=NotImplemented,
            isEncrypted=NotImplemented,
            contentAwareness=NotImplemented,
            clipOffset=NotImplemented,
            clipDuration=NotImplemented):
        KalturaFlavorParams.__init__(self,
            id,
            partnerId,
            name,
            systemName,
            description,
            createdAt,
            isSystemDefault,
            tags,
            requiredPermissions,
            sourceRemoteStorageProfileId,
            remoteStorageProfileIds,
            mediaParserType,
            sourceAssetParamsIds,
            videoCodec,
            videoBitrate,
            audioCodec,
            audioBitrate,
            audioChannels,
            audioSampleRate,
            width,
            height,
            frameRate,
            gopSize,
            conversionEngines,
            conversionEnginesExtraParams,
            twoPass,
            deinterlice,
            rotate,
            operators,
            engineVersion,
            format,
            aspectRatioProcessingMode,
            forceFrameToMultiplication16,
            isGopInSec,
            isAvoidVideoShrinkFramesizeToSource,
            isAvoidVideoShrinkBitrateToSource,
            isVideoFrameRateForLowBrAppleHls,
            multiStream,
            anamorphicPixels,
            isAvoidForcedKeyFrames,
            isCropIMX,
            optimizationPolicy,
            maxFrameRate,
            videoConstantBitrate,
            videoBitrateTolerance,
            watermarkData,
            subtitlesData,
            isEncrypted,
            contentAwareness,
            clipOffset,
            clipDuration)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaFlavorParams.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWidevineFlavorParams.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParams.toParams(self)
        kparams.put("objectType", "KalturaWidevineFlavorParams")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaWidevineFlavorParamsOutput(KalturaFlavorParamsOutput):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            createdAt=NotImplemented,
            isSystemDefault=NotImplemented,
            tags=NotImplemented,
            requiredPermissions=NotImplemented,
            sourceRemoteStorageProfileId=NotImplemented,
            remoteStorageProfileIds=NotImplemented,
            mediaParserType=NotImplemented,
            sourceAssetParamsIds=NotImplemented,
            videoCodec=NotImplemented,
            videoBitrate=NotImplemented,
            audioCodec=NotImplemented,
            audioBitrate=NotImplemented,
            audioChannels=NotImplemented,
            audioSampleRate=NotImplemented,
            width=NotImplemented,
            height=NotImplemented,
            frameRate=NotImplemented,
            gopSize=NotImplemented,
            conversionEngines=NotImplemented,
            conversionEnginesExtraParams=NotImplemented,
            twoPass=NotImplemented,
            deinterlice=NotImplemented,
            rotate=NotImplemented,
            operators=NotImplemented,
            engineVersion=NotImplemented,
            format=NotImplemented,
            aspectRatioProcessingMode=NotImplemented,
            forceFrameToMultiplication16=NotImplemented,
            isGopInSec=NotImplemented,
            isAvoidVideoShrinkFramesizeToSource=NotImplemented,
            isAvoidVideoShrinkBitrateToSource=NotImplemented,
            isVideoFrameRateForLowBrAppleHls=NotImplemented,
            multiStream=NotImplemented,
            anamorphicPixels=NotImplemented,
            isAvoidForcedKeyFrames=NotImplemented,
            isCropIMX=NotImplemented,
            optimizationPolicy=NotImplemented,
            maxFrameRate=NotImplemented,
            videoConstantBitrate=NotImplemented,
            videoBitrateTolerance=NotImplemented,
            watermarkData=NotImplemented,
            subtitlesData=NotImplemented,
            isEncrypted=NotImplemented,
            contentAwareness=NotImplemented,
            clipOffset=NotImplemented,
            clipDuration=NotImplemented,
            flavorParamsId=NotImplemented,
            commandLinesStr=NotImplemented,
            flavorParamsVersion=NotImplemented,
            flavorAssetId=NotImplemented,
            flavorAssetVersion=NotImplemented,
            readyBehavior=NotImplemented,
            widevineDistributionStartDate=NotImplemented,
            widevineDistributionEndDate=NotImplemented):
        KalturaFlavorParamsOutput.__init__(self,
            id,
            partnerId,
            name,
            systemName,
            description,
            createdAt,
            isSystemDefault,
            tags,
            requiredPermissions,
            sourceRemoteStorageProfileId,
            remoteStorageProfileIds,
            mediaParserType,
            sourceAssetParamsIds,
            videoCodec,
            videoBitrate,
            audioCodec,
            audioBitrate,
            audioChannels,
            audioSampleRate,
            width,
            height,
            frameRate,
            gopSize,
            conversionEngines,
            conversionEnginesExtraParams,
            twoPass,
            deinterlice,
            rotate,
            operators,
            engineVersion,
            format,
            aspectRatioProcessingMode,
            forceFrameToMultiplication16,
            isGopInSec,
            isAvoidVideoShrinkFramesizeToSource,
            isAvoidVideoShrinkBitrateToSource,
            isVideoFrameRateForLowBrAppleHls,
            multiStream,
            anamorphicPixels,
            isAvoidForcedKeyFrames,
            isCropIMX,
            optimizationPolicy,
            maxFrameRate,
            videoConstantBitrate,
            videoBitrateTolerance,
            watermarkData,
            subtitlesData,
            isEncrypted,
            contentAwareness,
            clipOffset,
            clipDuration,
            flavorParamsId,
            commandLinesStr,
            flavorParamsVersion,
            flavorAssetId,
            flavorAssetVersion,
            readyBehavior)

        # License distribution window start date
        # @var int
        self.widevineDistributionStartDate = widevineDistributionStartDate

        # License distribution window end date
        # @var int
        self.widevineDistributionEndDate = widevineDistributionEndDate


    PROPERTY_LOADERS = {
        'widevineDistributionStartDate': getXmlNodeInt, 
        'widevineDistributionEndDate': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaFlavorParamsOutput.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWidevineFlavorParamsOutput.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParamsOutput.toParams(self)
        kparams.put("objectType", "KalturaWidevineFlavorParamsOutput")
        kparams.addIntIfDefined("widevineDistributionStartDate", self.widevineDistributionStartDate)
        kparams.addIntIfDefined("widevineDistributionEndDate", self.widevineDistributionEndDate)
        return kparams

    def getWidevineDistributionStartDate(self):
        return self.widevineDistributionStartDate

    def setWidevineDistributionStartDate(self, newWidevineDistributionStartDate):
        self.widevineDistributionStartDate = newWidevineDistributionStartDate

    def getWidevineDistributionEndDate(self):
        return self.widevineDistributionEndDate

    def setWidevineDistributionEndDate(self, newWidevineDistributionEndDate):
        self.widevineDistributionEndDate = newWidevineDistributionEndDate


# @package Kaltura
# @subpackage Client
class KalturaWidevineProfileBaseFilter(KalturaDrmProfileFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            providerEqual=NotImplemented,
            providerIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented):
        KalturaDrmProfileFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            providerEqual,
            providerIn,
            statusEqual,
            statusIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDrmProfileFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWidevineProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDrmProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaWidevineProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaWidevineProfileFilter(KalturaWidevineProfileBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            providerEqual=NotImplemented,
            providerIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented):
        KalturaWidevineProfileBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            providerEqual,
            providerIn,
            statusEqual,
            statusIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaWidevineProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWidevineProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaWidevineProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaWidevineProfileFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaWidevineFlavorAssetBaseFilter(KalturaFlavorAssetFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            sizeGreaterThanOrEqual=NotImplemented,
            sizeLessThanOrEqual=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            deletedAtGreaterThanOrEqual=NotImplemented,
            deletedAtLessThanOrEqual=NotImplemented,
            flavorParamsIdEqual=NotImplemented,
            flavorParamsIdIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            statusNotIn=NotImplemented):
        KalturaFlavorAssetFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            entryIdEqual,
            entryIdIn,
            partnerIdEqual,
            partnerIdIn,
            sizeGreaterThanOrEqual,
            sizeLessThanOrEqual,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            deletedAtGreaterThanOrEqual,
            deletedAtLessThanOrEqual,
            flavorParamsIdEqual,
            flavorParamsIdIn,
            statusEqual,
            statusIn,
            statusNotIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaFlavorAssetFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWidevineFlavorAssetBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorAssetFilter.toParams(self)
        kparams.put("objectType", "KalturaWidevineFlavorAssetBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaWidevineFlavorParamsBaseFilter(KalturaFlavorParamsFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            isSystemDefaultEqual=NotImplemented,
            tagsEqual=NotImplemented,
            formatEqual=NotImplemented):
        KalturaFlavorParamsFilter.__init__(self,
            orderBy,
            advancedSearch,
            systemNameEqual,
            systemNameIn,
            isSystemDefaultEqual,
            tagsEqual,
            formatEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaFlavorParamsFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWidevineFlavorParamsBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParamsFilter.toParams(self)
        kparams.put("objectType", "KalturaWidevineFlavorParamsBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaWidevineFlavorAssetFilter(KalturaWidevineFlavorAssetBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            sizeGreaterThanOrEqual=NotImplemented,
            sizeLessThanOrEqual=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            deletedAtGreaterThanOrEqual=NotImplemented,
            deletedAtLessThanOrEqual=NotImplemented,
            flavorParamsIdEqual=NotImplemented,
            flavorParamsIdIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            statusNotIn=NotImplemented):
        KalturaWidevineFlavorAssetBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            entryIdEqual,
            entryIdIn,
            partnerIdEqual,
            partnerIdIn,
            sizeGreaterThanOrEqual,
            sizeLessThanOrEqual,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            deletedAtGreaterThanOrEqual,
            deletedAtLessThanOrEqual,
            flavorParamsIdEqual,
            flavorParamsIdIn,
            statusEqual,
            statusIn,
            statusNotIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaWidevineFlavorAssetBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWidevineFlavorAssetFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaWidevineFlavorAssetBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaWidevineFlavorAssetFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaWidevineFlavorParamsFilter(KalturaWidevineFlavorParamsBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            isSystemDefaultEqual=NotImplemented,
            tagsEqual=NotImplemented,
            formatEqual=NotImplemented):
        KalturaWidevineFlavorParamsBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            systemNameEqual,
            systemNameIn,
            isSystemDefaultEqual,
            tagsEqual,
            formatEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaWidevineFlavorParamsBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWidevineFlavorParamsFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaWidevineFlavorParamsBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaWidevineFlavorParamsFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaWidevineFlavorParamsOutputBaseFilter(KalturaFlavorParamsOutputFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            isSystemDefaultEqual=NotImplemented,
            tagsEqual=NotImplemented,
            formatEqual=NotImplemented,
            flavorParamsIdEqual=NotImplemented,
            flavorParamsVersionEqual=NotImplemented,
            flavorAssetIdEqual=NotImplemented,
            flavorAssetVersionEqual=NotImplemented):
        KalturaFlavorParamsOutputFilter.__init__(self,
            orderBy,
            advancedSearch,
            systemNameEqual,
            systemNameIn,
            isSystemDefaultEqual,
            tagsEqual,
            formatEqual,
            flavorParamsIdEqual,
            flavorParamsVersionEqual,
            flavorAssetIdEqual,
            flavorAssetVersionEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaFlavorParamsOutputFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWidevineFlavorParamsOutputBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParamsOutputFilter.toParams(self)
        kparams.put("objectType", "KalturaWidevineFlavorParamsOutputBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaWidevineFlavorParamsOutputFilter(KalturaWidevineFlavorParamsOutputBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            isSystemDefaultEqual=NotImplemented,
            tagsEqual=NotImplemented,
            formatEqual=NotImplemented,
            flavorParamsIdEqual=NotImplemented,
            flavorParamsVersionEqual=NotImplemented,
            flavorAssetIdEqual=NotImplemented,
            flavorAssetVersionEqual=NotImplemented):
        KalturaWidevineFlavorParamsOutputBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            systemNameEqual,
            systemNameIn,
            isSystemDefaultEqual,
            tagsEqual,
            formatEqual,
            flavorParamsIdEqual,
            flavorParamsVersionEqual,
            flavorAssetIdEqual,
            flavorAssetVersionEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaWidevineFlavorParamsOutputBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWidevineFlavorParamsOutputFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaWidevineFlavorParamsOutputBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaWidevineFlavorParamsOutputFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaWidevineDrmService(KalturaServiceBase):
    """WidevineDrmService serves as a license proxy to a Widevine license server"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def getLicense(self, flavorAssetId, referrer = NotImplemented):
        """Get license for encrypted content playback"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("flavorAssetId", flavorAssetId)
        kparams.addStringIfDefined("referrer", referrer)
        self.client.queueServiceActionCall("widevine_widevinedrm", "getLicense", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return getXmlNodeText(resultNode)

########## main ##########
class KalturaWidevineClientPlugin(KalturaClientPlugin):
    # KalturaWidevineClientPlugin
    instance = None

    # @return KalturaWidevineClientPlugin
    @staticmethod
    def get():
        if KalturaWidevineClientPlugin.instance == None:
            KalturaWidevineClientPlugin.instance = KalturaWidevineClientPlugin()
        return KalturaWidevineClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'widevineDrm': KalturaWidevineDrmService,
        }

    def getEnums(self):
        return {
            'KalturaWidevineRepositorySyncMode': KalturaWidevineRepositorySyncMode,
            'KalturaWidevineFlavorAssetOrderBy': KalturaWidevineFlavorAssetOrderBy,
            'KalturaWidevineFlavorParamsOrderBy': KalturaWidevineFlavorParamsOrderBy,
            'KalturaWidevineFlavorParamsOutputOrderBy': KalturaWidevineFlavorParamsOutputOrderBy,
            'KalturaWidevineProfileOrderBy': KalturaWidevineProfileOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaWidevineProfile': KalturaWidevineProfile,
            'KalturaWidevineRepositorySyncJobData': KalturaWidevineRepositorySyncJobData,
            'KalturaWidevineFlavorAsset': KalturaWidevineFlavorAsset,
            'KalturaWidevineFlavorParams': KalturaWidevineFlavorParams,
            'KalturaWidevineFlavorParamsOutput': KalturaWidevineFlavorParamsOutput,
            'KalturaWidevineProfileBaseFilter': KalturaWidevineProfileBaseFilter,
            'KalturaWidevineProfileFilter': KalturaWidevineProfileFilter,
            'KalturaWidevineFlavorAssetBaseFilter': KalturaWidevineFlavorAssetBaseFilter,
            'KalturaWidevineFlavorParamsBaseFilter': KalturaWidevineFlavorParamsBaseFilter,
            'KalturaWidevineFlavorAssetFilter': KalturaWidevineFlavorAssetFilter,
            'KalturaWidevineFlavorParamsFilter': KalturaWidevineFlavorParamsFilter,
            'KalturaWidevineFlavorParamsOutputBaseFilter': KalturaWidevineFlavorParamsOutputBaseFilter,
            'KalturaWidevineFlavorParamsOutputFilter': KalturaWidevineFlavorParamsOutputFilter,
        }

    # @return string
    def getName(self):
        return 'widevine'

