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
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaDocumentType(object):
    DOCUMENT = 11
    SWF = 12
    PDF = 13

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDocumentEntryOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    END_DATE_ASC = "+endDate"
    MODERATION_COUNT_ASC = "+moderationCount"
    NAME_ASC = "+name"
    PARTNER_SORT_VALUE_ASC = "+partnerSortValue"
    RANK_ASC = "+rank"
    RECENT_ASC = "+recent"
    START_DATE_ASC = "+startDate"
    TOTAL_RANK_ASC = "+totalRank"
    UPDATED_AT_ASC = "+updatedAt"
    WEIGHT_ASC = "+weight"
    CREATED_AT_DESC = "-createdAt"
    END_DATE_DESC = "-endDate"
    MODERATION_COUNT_DESC = "-moderationCount"
    NAME_DESC = "-name"
    PARTNER_SORT_VALUE_DESC = "-partnerSortValue"
    RANK_DESC = "-rank"
    RECENT_DESC = "-recent"
    START_DATE_DESC = "-startDate"
    TOTAL_RANK_DESC = "-totalRank"
    UPDATED_AT_DESC = "-updatedAt"
    WEIGHT_DESC = "-weight"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDocumentFlavorParamsOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDocumentFlavorParamsOutputOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaImageFlavorParamsOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaImageFlavorParamsOutputOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaPdfFlavorParamsOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaPdfFlavorParamsOutputOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaSwfFlavorParamsOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaSwfFlavorParamsOutputOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaDocumentEntry(KalturaBaseEntry):
    def __init__(self,
            id=NotImplemented,
            name=NotImplemented,
            description=NotImplemented,
            partnerId=NotImplemented,
            userId=NotImplemented,
            creatorId=NotImplemented,
            tags=NotImplemented,
            adminTags=NotImplemented,
            categories=NotImplemented,
            categoriesIds=NotImplemented,
            status=NotImplemented,
            moderationStatus=NotImplemented,
            moderationCount=NotImplemented,
            type=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            rank=NotImplemented,
            totalRank=NotImplemented,
            votes=NotImplemented,
            groupId=NotImplemented,
            partnerData=NotImplemented,
            downloadUrl=NotImplemented,
            searchText=NotImplemented,
            licenseType=NotImplemented,
            version=NotImplemented,
            thumbnailUrl=NotImplemented,
            accessControlId=NotImplemented,
            startDate=NotImplemented,
            endDate=NotImplemented,
            referenceId=NotImplemented,
            replacingEntryId=NotImplemented,
            replacedEntryId=NotImplemented,
            replacementStatus=NotImplemented,
            partnerSortValue=NotImplemented,
            conversionProfileId=NotImplemented,
            redirectEntryId=NotImplemented,
            rootEntryId=NotImplemented,
            parentEntryId=NotImplemented,
            operationAttributes=NotImplemented,
            entitledUsersEdit=NotImplemented,
            entitledUsersPublish=NotImplemented,
            capabilities=NotImplemented,
            templateEntryId=NotImplemented,
            documentType=NotImplemented,
            assetParamsIds=NotImplemented):
        KalturaBaseEntry.__init__(self,
            id,
            name,
            description,
            partnerId,
            userId,
            creatorId,
            tags,
            adminTags,
            categories,
            categoriesIds,
            status,
            moderationStatus,
            moderationCount,
            type,
            createdAt,
            updatedAt,
            rank,
            totalRank,
            votes,
            groupId,
            partnerData,
            downloadUrl,
            searchText,
            licenseType,
            version,
            thumbnailUrl,
            accessControlId,
            startDate,
            endDate,
            referenceId,
            replacingEntryId,
            replacedEntryId,
            replacementStatus,
            partnerSortValue,
            conversionProfileId,
            redirectEntryId,
            rootEntryId,
            parentEntryId,
            operationAttributes,
            entitledUsersEdit,
            entitledUsersPublish,
            capabilities,
            templateEntryId)

        # The type of the document
        # @var KalturaDocumentType
        # @insertonly
        self.documentType = documentType

        # Comma separated asset params ids that exists for this media entry
        # @var string
        # @readonly
        self.assetParamsIds = assetParamsIds


    PROPERTY_LOADERS = {
        'documentType': (KalturaEnumsFactory.createInt, "KalturaDocumentType"), 
        'assetParamsIds': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaBaseEntry.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDocumentEntry.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBaseEntry.toParams(self)
        kparams.put("objectType", "KalturaDocumentEntry")
        kparams.addIntEnumIfDefined("documentType", self.documentType)
        return kparams

    def getDocumentType(self):
        return self.documentType

    def setDocumentType(self, newDocumentType):
        self.documentType = newDocumentType

    def getAssetParamsIds(self):
        return self.assetParamsIds


# @package Kaltura
# @subpackage Client
class KalturaDocumentListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaDocumentEntry
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaDocumentEntry), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDocumentListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaDocumentListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaDocumentFlavorParams(KalturaFlavorParams):
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
        self.fromXmlImpl(node, KalturaDocumentFlavorParams.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParams.toParams(self)
        kparams.put("objectType", "KalturaDocumentFlavorParams")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaImageFlavorParams(KalturaFlavorParams):
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
            densityWidth=NotImplemented,
            densityHeight=NotImplemented,
            sizeWidth=NotImplemented,
            sizeHeight=NotImplemented,
            depth=NotImplemented):
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

        # @var int
        self.densityWidth = densityWidth

        # @var int
        self.densityHeight = densityHeight

        # @var int
        self.sizeWidth = sizeWidth

        # @var int
        self.sizeHeight = sizeHeight

        # @var int
        self.depth = depth


    PROPERTY_LOADERS = {
        'densityWidth': getXmlNodeInt, 
        'densityHeight': getXmlNodeInt, 
        'sizeWidth': getXmlNodeInt, 
        'sizeHeight': getXmlNodeInt, 
        'depth': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaFlavorParams.fromXml(self, node)
        self.fromXmlImpl(node, KalturaImageFlavorParams.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParams.toParams(self)
        kparams.put("objectType", "KalturaImageFlavorParams")
        kparams.addIntIfDefined("densityWidth", self.densityWidth)
        kparams.addIntIfDefined("densityHeight", self.densityHeight)
        kparams.addIntIfDefined("sizeWidth", self.sizeWidth)
        kparams.addIntIfDefined("sizeHeight", self.sizeHeight)
        kparams.addIntIfDefined("depth", self.depth)
        return kparams

    def getDensityWidth(self):
        return self.densityWidth

    def setDensityWidth(self, newDensityWidth):
        self.densityWidth = newDensityWidth

    def getDensityHeight(self):
        return self.densityHeight

    def setDensityHeight(self, newDensityHeight):
        self.densityHeight = newDensityHeight

    def getSizeWidth(self):
        return self.sizeWidth

    def setSizeWidth(self, newSizeWidth):
        self.sizeWidth = newSizeWidth

    def getSizeHeight(self):
        return self.sizeHeight

    def setSizeHeight(self, newSizeHeight):
        self.sizeHeight = newSizeHeight

    def getDepth(self):
        return self.depth

    def setDepth(self, newDepth):
        self.depth = newDepth


# @package Kaltura
# @subpackage Client
class KalturaPdfFlavorParams(KalturaFlavorParams):
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
            readonly=NotImplemented):
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

        # @var bool
        self.readonly = readonly


    PROPERTY_LOADERS = {
        'readonly': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaFlavorParams.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPdfFlavorParams.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParams.toParams(self)
        kparams.put("objectType", "KalturaPdfFlavorParams")
        kparams.addBoolIfDefined("readonly", self.readonly)
        return kparams

    def getReadonly(self):
        return self.readonly

    def setReadonly(self, newReadonly):
        self.readonly = newReadonly


# @package Kaltura
# @subpackage Client
class KalturaSwfFlavorParams(KalturaFlavorParams):
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
            flashVersion=NotImplemented,
            poly2Bitmap=NotImplemented):
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

        # @var int
        self.flashVersion = flashVersion

        # @var bool
        self.poly2Bitmap = poly2Bitmap


    PROPERTY_LOADERS = {
        'flashVersion': getXmlNodeInt, 
        'poly2Bitmap': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaFlavorParams.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSwfFlavorParams.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParams.toParams(self)
        kparams.put("objectType", "KalturaSwfFlavorParams")
        kparams.addIntIfDefined("flashVersion", self.flashVersion)
        kparams.addBoolIfDefined("poly2Bitmap", self.poly2Bitmap)
        return kparams

    def getFlashVersion(self):
        return self.flashVersion

    def setFlashVersion(self, newFlashVersion):
        self.flashVersion = newFlashVersion

    def getPoly2Bitmap(self):
        return self.poly2Bitmap

    def setPoly2Bitmap(self, newPoly2Bitmap):
        self.poly2Bitmap = newPoly2Bitmap


# @package Kaltura
# @subpackage Client
class KalturaDocumentFlavorParamsOutput(KalturaFlavorParamsOutput):
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
            readyBehavior=NotImplemented):
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


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaFlavorParamsOutput.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDocumentFlavorParamsOutput.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParamsOutput.toParams(self)
        kparams.put("objectType", "KalturaDocumentFlavorParamsOutput")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaImageFlavorParamsOutput(KalturaFlavorParamsOutput):
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
            densityWidth=NotImplemented,
            densityHeight=NotImplemented,
            sizeWidth=NotImplemented,
            sizeHeight=NotImplemented,
            depth=NotImplemented):
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

        # @var int
        self.densityWidth = densityWidth

        # @var int
        self.densityHeight = densityHeight

        # @var int
        self.sizeWidth = sizeWidth

        # @var int
        self.sizeHeight = sizeHeight

        # @var int
        self.depth = depth


    PROPERTY_LOADERS = {
        'densityWidth': getXmlNodeInt, 
        'densityHeight': getXmlNodeInt, 
        'sizeWidth': getXmlNodeInt, 
        'sizeHeight': getXmlNodeInt, 
        'depth': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaFlavorParamsOutput.fromXml(self, node)
        self.fromXmlImpl(node, KalturaImageFlavorParamsOutput.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParamsOutput.toParams(self)
        kparams.put("objectType", "KalturaImageFlavorParamsOutput")
        kparams.addIntIfDefined("densityWidth", self.densityWidth)
        kparams.addIntIfDefined("densityHeight", self.densityHeight)
        kparams.addIntIfDefined("sizeWidth", self.sizeWidth)
        kparams.addIntIfDefined("sizeHeight", self.sizeHeight)
        kparams.addIntIfDefined("depth", self.depth)
        return kparams

    def getDensityWidth(self):
        return self.densityWidth

    def setDensityWidth(self, newDensityWidth):
        self.densityWidth = newDensityWidth

    def getDensityHeight(self):
        return self.densityHeight

    def setDensityHeight(self, newDensityHeight):
        self.densityHeight = newDensityHeight

    def getSizeWidth(self):
        return self.sizeWidth

    def setSizeWidth(self, newSizeWidth):
        self.sizeWidth = newSizeWidth

    def getSizeHeight(self):
        return self.sizeHeight

    def setSizeHeight(self, newSizeHeight):
        self.sizeHeight = newSizeHeight

    def getDepth(self):
        return self.depth

    def setDepth(self, newDepth):
        self.depth = newDepth


# @package Kaltura
# @subpackage Client
class KalturaPdfFlavorParamsOutput(KalturaFlavorParamsOutput):
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
            readonly=NotImplemented):
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

        # @var bool
        self.readonly = readonly


    PROPERTY_LOADERS = {
        'readonly': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaFlavorParamsOutput.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPdfFlavorParamsOutput.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParamsOutput.toParams(self)
        kparams.put("objectType", "KalturaPdfFlavorParamsOutput")
        kparams.addBoolIfDefined("readonly", self.readonly)
        return kparams

    def getReadonly(self):
        return self.readonly

    def setReadonly(self, newReadonly):
        self.readonly = newReadonly


# @package Kaltura
# @subpackage Client
class KalturaSwfFlavorParamsOutput(KalturaFlavorParamsOutput):
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
            flashVersion=NotImplemented,
            poly2Bitmap=NotImplemented):
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

        # @var int
        self.flashVersion = flashVersion

        # @var bool
        self.poly2Bitmap = poly2Bitmap


    PROPERTY_LOADERS = {
        'flashVersion': getXmlNodeInt, 
        'poly2Bitmap': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaFlavorParamsOutput.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSwfFlavorParamsOutput.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParamsOutput.toParams(self)
        kparams.put("objectType", "KalturaSwfFlavorParamsOutput")
        kparams.addIntIfDefined("flashVersion", self.flashVersion)
        kparams.addBoolIfDefined("poly2Bitmap", self.poly2Bitmap)
        return kparams

    def getFlashVersion(self):
        return self.flashVersion

    def setFlashVersion(self, newFlashVersion):
        self.flashVersion = newFlashVersion

    def getPoly2Bitmap(self):
        return self.poly2Bitmap

    def setPoly2Bitmap(self, newPoly2Bitmap):
        self.poly2Bitmap = newPoly2Bitmap


# @package Kaltura
# @subpackage Client
class KalturaDocumentEntryBaseFilter(KalturaBaseEntryFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            nameLike=NotImplemented,
            nameMultiLikeOr=NotImplemented,
            nameMultiLikeAnd=NotImplemented,
            nameEqual=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            userIdEqual=NotImplemented,
            userIdIn=NotImplemented,
            creatorIdEqual=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            adminTagsLike=NotImplemented,
            adminTagsMultiLikeOr=NotImplemented,
            adminTagsMultiLikeAnd=NotImplemented,
            categoriesMatchAnd=NotImplemented,
            categoriesMatchOr=NotImplemented,
            categoriesNotContains=NotImplemented,
            categoriesIdsMatchAnd=NotImplemented,
            categoriesIdsMatchOr=NotImplemented,
            categoriesIdsNotContains=NotImplemented,
            categoriesIdsEmpty=NotImplemented,
            statusEqual=NotImplemented,
            statusNotEqual=NotImplemented,
            statusIn=NotImplemented,
            statusNotIn=NotImplemented,
            moderationStatusEqual=NotImplemented,
            moderationStatusNotEqual=NotImplemented,
            moderationStatusIn=NotImplemented,
            moderationStatusNotIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            totalRankLessThanOrEqual=NotImplemented,
            totalRankGreaterThanOrEqual=NotImplemented,
            groupIdEqual=NotImplemented,
            searchTextMatchAnd=NotImplemented,
            searchTextMatchOr=NotImplemented,
            accessControlIdEqual=NotImplemented,
            accessControlIdIn=NotImplemented,
            startDateGreaterThanOrEqual=NotImplemented,
            startDateLessThanOrEqual=NotImplemented,
            startDateGreaterThanOrEqualOrNull=NotImplemented,
            startDateLessThanOrEqualOrNull=NotImplemented,
            endDateGreaterThanOrEqual=NotImplemented,
            endDateLessThanOrEqual=NotImplemented,
            endDateGreaterThanOrEqualOrNull=NotImplemented,
            endDateLessThanOrEqualOrNull=NotImplemented,
            referenceIdEqual=NotImplemented,
            referenceIdIn=NotImplemented,
            replacingEntryIdEqual=NotImplemented,
            replacingEntryIdIn=NotImplemented,
            replacedEntryIdEqual=NotImplemented,
            replacedEntryIdIn=NotImplemented,
            replacementStatusEqual=NotImplemented,
            replacementStatusIn=NotImplemented,
            partnerSortValueGreaterThanOrEqual=NotImplemented,
            partnerSortValueLessThanOrEqual=NotImplemented,
            rootEntryIdEqual=NotImplemented,
            rootEntryIdIn=NotImplemented,
            parentEntryIdEqual=NotImplemented,
            entitledUsersEditMatchAnd=NotImplemented,
            entitledUsersEditMatchOr=NotImplemented,
            entitledUsersPublishMatchAnd=NotImplemented,
            entitledUsersPublishMatchOr=NotImplemented,
            tagsNameMultiLikeOr=NotImplemented,
            tagsAdminTagsMultiLikeOr=NotImplemented,
            tagsAdminTagsNameMultiLikeOr=NotImplemented,
            tagsNameMultiLikeAnd=NotImplemented,
            tagsAdminTagsMultiLikeAnd=NotImplemented,
            tagsAdminTagsNameMultiLikeAnd=NotImplemented,
            freeText=NotImplemented,
            isRoot=NotImplemented,
            categoriesFullNameIn=NotImplemented,
            categoryAncestorIdIn=NotImplemented,
            redirectFromEntryId=NotImplemented,
            documentTypeEqual=NotImplemented,
            documentTypeIn=NotImplemented,
            assetParamsIdsMatchOr=NotImplemented,
            assetParamsIdsMatchAnd=NotImplemented):
        KalturaBaseEntryFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            nameLike,
            nameMultiLikeOr,
            nameMultiLikeAnd,
            nameEqual,
            partnerIdEqual,
            partnerIdIn,
            userIdEqual,
            userIdIn,
            creatorIdEqual,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            adminTagsLike,
            adminTagsMultiLikeOr,
            adminTagsMultiLikeAnd,
            categoriesMatchAnd,
            categoriesMatchOr,
            categoriesNotContains,
            categoriesIdsMatchAnd,
            categoriesIdsMatchOr,
            categoriesIdsNotContains,
            categoriesIdsEmpty,
            statusEqual,
            statusNotEqual,
            statusIn,
            statusNotIn,
            moderationStatusEqual,
            moderationStatusNotEqual,
            moderationStatusIn,
            moderationStatusNotIn,
            typeEqual,
            typeIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            totalRankLessThanOrEqual,
            totalRankGreaterThanOrEqual,
            groupIdEqual,
            searchTextMatchAnd,
            searchTextMatchOr,
            accessControlIdEqual,
            accessControlIdIn,
            startDateGreaterThanOrEqual,
            startDateLessThanOrEqual,
            startDateGreaterThanOrEqualOrNull,
            startDateLessThanOrEqualOrNull,
            endDateGreaterThanOrEqual,
            endDateLessThanOrEqual,
            endDateGreaterThanOrEqualOrNull,
            endDateLessThanOrEqualOrNull,
            referenceIdEqual,
            referenceIdIn,
            replacingEntryIdEqual,
            replacingEntryIdIn,
            replacedEntryIdEqual,
            replacedEntryIdIn,
            replacementStatusEqual,
            replacementStatusIn,
            partnerSortValueGreaterThanOrEqual,
            partnerSortValueLessThanOrEqual,
            rootEntryIdEqual,
            rootEntryIdIn,
            parentEntryIdEqual,
            entitledUsersEditMatchAnd,
            entitledUsersEditMatchOr,
            entitledUsersPublishMatchAnd,
            entitledUsersPublishMatchOr,
            tagsNameMultiLikeOr,
            tagsAdminTagsMultiLikeOr,
            tagsAdminTagsNameMultiLikeOr,
            tagsNameMultiLikeAnd,
            tagsAdminTagsMultiLikeAnd,
            tagsAdminTagsNameMultiLikeAnd,
            freeText,
            isRoot,
            categoriesFullNameIn,
            categoryAncestorIdIn,
            redirectFromEntryId)

        # @var KalturaDocumentType
        self.documentTypeEqual = documentTypeEqual

        # @var string
        self.documentTypeIn = documentTypeIn

        # @var string
        self.assetParamsIdsMatchOr = assetParamsIdsMatchOr

        # @var string
        self.assetParamsIdsMatchAnd = assetParamsIdsMatchAnd


    PROPERTY_LOADERS = {
        'documentTypeEqual': (KalturaEnumsFactory.createInt, "KalturaDocumentType"), 
        'documentTypeIn': getXmlNodeText, 
        'assetParamsIdsMatchOr': getXmlNodeText, 
        'assetParamsIdsMatchAnd': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaBaseEntryFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDocumentEntryBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBaseEntryFilter.toParams(self)
        kparams.put("objectType", "KalturaDocumentEntryBaseFilter")
        kparams.addIntEnumIfDefined("documentTypeEqual", self.documentTypeEqual)
        kparams.addStringIfDefined("documentTypeIn", self.documentTypeIn)
        kparams.addStringIfDefined("assetParamsIdsMatchOr", self.assetParamsIdsMatchOr)
        kparams.addStringIfDefined("assetParamsIdsMatchAnd", self.assetParamsIdsMatchAnd)
        return kparams

    def getDocumentTypeEqual(self):
        return self.documentTypeEqual

    def setDocumentTypeEqual(self, newDocumentTypeEqual):
        self.documentTypeEqual = newDocumentTypeEqual

    def getDocumentTypeIn(self):
        return self.documentTypeIn

    def setDocumentTypeIn(self, newDocumentTypeIn):
        self.documentTypeIn = newDocumentTypeIn

    def getAssetParamsIdsMatchOr(self):
        return self.assetParamsIdsMatchOr

    def setAssetParamsIdsMatchOr(self, newAssetParamsIdsMatchOr):
        self.assetParamsIdsMatchOr = newAssetParamsIdsMatchOr

    def getAssetParamsIdsMatchAnd(self):
        return self.assetParamsIdsMatchAnd

    def setAssetParamsIdsMatchAnd(self, newAssetParamsIdsMatchAnd):
        self.assetParamsIdsMatchAnd = newAssetParamsIdsMatchAnd


# @package Kaltura
# @subpackage Client
class KalturaDocumentEntryFilter(KalturaDocumentEntryBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            nameLike=NotImplemented,
            nameMultiLikeOr=NotImplemented,
            nameMultiLikeAnd=NotImplemented,
            nameEqual=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            userIdEqual=NotImplemented,
            userIdIn=NotImplemented,
            creatorIdEqual=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            adminTagsLike=NotImplemented,
            adminTagsMultiLikeOr=NotImplemented,
            adminTagsMultiLikeAnd=NotImplemented,
            categoriesMatchAnd=NotImplemented,
            categoriesMatchOr=NotImplemented,
            categoriesNotContains=NotImplemented,
            categoriesIdsMatchAnd=NotImplemented,
            categoriesIdsMatchOr=NotImplemented,
            categoriesIdsNotContains=NotImplemented,
            categoriesIdsEmpty=NotImplemented,
            statusEqual=NotImplemented,
            statusNotEqual=NotImplemented,
            statusIn=NotImplemented,
            statusNotIn=NotImplemented,
            moderationStatusEqual=NotImplemented,
            moderationStatusNotEqual=NotImplemented,
            moderationStatusIn=NotImplemented,
            moderationStatusNotIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            totalRankLessThanOrEqual=NotImplemented,
            totalRankGreaterThanOrEqual=NotImplemented,
            groupIdEqual=NotImplemented,
            searchTextMatchAnd=NotImplemented,
            searchTextMatchOr=NotImplemented,
            accessControlIdEqual=NotImplemented,
            accessControlIdIn=NotImplemented,
            startDateGreaterThanOrEqual=NotImplemented,
            startDateLessThanOrEqual=NotImplemented,
            startDateGreaterThanOrEqualOrNull=NotImplemented,
            startDateLessThanOrEqualOrNull=NotImplemented,
            endDateGreaterThanOrEqual=NotImplemented,
            endDateLessThanOrEqual=NotImplemented,
            endDateGreaterThanOrEqualOrNull=NotImplemented,
            endDateLessThanOrEqualOrNull=NotImplemented,
            referenceIdEqual=NotImplemented,
            referenceIdIn=NotImplemented,
            replacingEntryIdEqual=NotImplemented,
            replacingEntryIdIn=NotImplemented,
            replacedEntryIdEqual=NotImplemented,
            replacedEntryIdIn=NotImplemented,
            replacementStatusEqual=NotImplemented,
            replacementStatusIn=NotImplemented,
            partnerSortValueGreaterThanOrEqual=NotImplemented,
            partnerSortValueLessThanOrEqual=NotImplemented,
            rootEntryIdEqual=NotImplemented,
            rootEntryIdIn=NotImplemented,
            parentEntryIdEqual=NotImplemented,
            entitledUsersEditMatchAnd=NotImplemented,
            entitledUsersEditMatchOr=NotImplemented,
            entitledUsersPublishMatchAnd=NotImplemented,
            entitledUsersPublishMatchOr=NotImplemented,
            tagsNameMultiLikeOr=NotImplemented,
            tagsAdminTagsMultiLikeOr=NotImplemented,
            tagsAdminTagsNameMultiLikeOr=NotImplemented,
            tagsNameMultiLikeAnd=NotImplemented,
            tagsAdminTagsMultiLikeAnd=NotImplemented,
            tagsAdminTagsNameMultiLikeAnd=NotImplemented,
            freeText=NotImplemented,
            isRoot=NotImplemented,
            categoriesFullNameIn=NotImplemented,
            categoryAncestorIdIn=NotImplemented,
            redirectFromEntryId=NotImplemented,
            documentTypeEqual=NotImplemented,
            documentTypeIn=NotImplemented,
            assetParamsIdsMatchOr=NotImplemented,
            assetParamsIdsMatchAnd=NotImplemented):
        KalturaDocumentEntryBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            nameLike,
            nameMultiLikeOr,
            nameMultiLikeAnd,
            nameEqual,
            partnerIdEqual,
            partnerIdIn,
            userIdEqual,
            userIdIn,
            creatorIdEqual,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            adminTagsLike,
            adminTagsMultiLikeOr,
            adminTagsMultiLikeAnd,
            categoriesMatchAnd,
            categoriesMatchOr,
            categoriesNotContains,
            categoriesIdsMatchAnd,
            categoriesIdsMatchOr,
            categoriesIdsNotContains,
            categoriesIdsEmpty,
            statusEqual,
            statusNotEqual,
            statusIn,
            statusNotIn,
            moderationStatusEqual,
            moderationStatusNotEqual,
            moderationStatusIn,
            moderationStatusNotIn,
            typeEqual,
            typeIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            totalRankLessThanOrEqual,
            totalRankGreaterThanOrEqual,
            groupIdEqual,
            searchTextMatchAnd,
            searchTextMatchOr,
            accessControlIdEqual,
            accessControlIdIn,
            startDateGreaterThanOrEqual,
            startDateLessThanOrEqual,
            startDateGreaterThanOrEqualOrNull,
            startDateLessThanOrEqualOrNull,
            endDateGreaterThanOrEqual,
            endDateLessThanOrEqual,
            endDateGreaterThanOrEqualOrNull,
            endDateLessThanOrEqualOrNull,
            referenceIdEqual,
            referenceIdIn,
            replacingEntryIdEqual,
            replacingEntryIdIn,
            replacedEntryIdEqual,
            replacedEntryIdIn,
            replacementStatusEqual,
            replacementStatusIn,
            partnerSortValueGreaterThanOrEqual,
            partnerSortValueLessThanOrEqual,
            rootEntryIdEqual,
            rootEntryIdIn,
            parentEntryIdEqual,
            entitledUsersEditMatchAnd,
            entitledUsersEditMatchOr,
            entitledUsersPublishMatchAnd,
            entitledUsersPublishMatchOr,
            tagsNameMultiLikeOr,
            tagsAdminTagsMultiLikeOr,
            tagsAdminTagsNameMultiLikeOr,
            tagsNameMultiLikeAnd,
            tagsAdminTagsMultiLikeAnd,
            tagsAdminTagsNameMultiLikeAnd,
            freeText,
            isRoot,
            categoriesFullNameIn,
            categoryAncestorIdIn,
            redirectFromEntryId,
            documentTypeEqual,
            documentTypeIn,
            assetParamsIdsMatchOr,
            assetParamsIdsMatchAnd)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDocumentEntryBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDocumentEntryFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDocumentEntryBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaDocumentEntryFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDocumentFlavorParamsBaseFilter(KalturaFlavorParamsFilter):
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
        self.fromXmlImpl(node, KalturaDocumentFlavorParamsBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParamsFilter.toParams(self)
        kparams.put("objectType", "KalturaDocumentFlavorParamsBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaImageFlavorParamsBaseFilter(KalturaFlavorParamsFilter):
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
        self.fromXmlImpl(node, KalturaImageFlavorParamsBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParamsFilter.toParams(self)
        kparams.put("objectType", "KalturaImageFlavorParamsBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaPdfFlavorParamsBaseFilter(KalturaFlavorParamsFilter):
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
        self.fromXmlImpl(node, KalturaPdfFlavorParamsBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParamsFilter.toParams(self)
        kparams.put("objectType", "KalturaPdfFlavorParamsBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSwfFlavorParamsBaseFilter(KalturaFlavorParamsFilter):
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
        self.fromXmlImpl(node, KalturaSwfFlavorParamsBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParamsFilter.toParams(self)
        kparams.put("objectType", "KalturaSwfFlavorParamsBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDocumentFlavorParamsFilter(KalturaDocumentFlavorParamsBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            isSystemDefaultEqual=NotImplemented,
            tagsEqual=NotImplemented,
            formatEqual=NotImplemented):
        KalturaDocumentFlavorParamsBaseFilter.__init__(self,
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
        KalturaDocumentFlavorParamsBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDocumentFlavorParamsFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDocumentFlavorParamsBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaDocumentFlavorParamsFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaImageFlavorParamsFilter(KalturaImageFlavorParamsBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            isSystemDefaultEqual=NotImplemented,
            tagsEqual=NotImplemented,
            formatEqual=NotImplemented):
        KalturaImageFlavorParamsBaseFilter.__init__(self,
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
        KalturaImageFlavorParamsBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaImageFlavorParamsFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaImageFlavorParamsBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaImageFlavorParamsFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaPdfFlavorParamsFilter(KalturaPdfFlavorParamsBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            isSystemDefaultEqual=NotImplemented,
            tagsEqual=NotImplemented,
            formatEqual=NotImplemented):
        KalturaPdfFlavorParamsBaseFilter.__init__(self,
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
        KalturaPdfFlavorParamsBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPdfFlavorParamsFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaPdfFlavorParamsBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaPdfFlavorParamsFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSwfFlavorParamsFilter(KalturaSwfFlavorParamsBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            isSystemDefaultEqual=NotImplemented,
            tagsEqual=NotImplemented,
            formatEqual=NotImplemented):
        KalturaSwfFlavorParamsBaseFilter.__init__(self,
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
        KalturaSwfFlavorParamsBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSwfFlavorParamsFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSwfFlavorParamsBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaSwfFlavorParamsFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDocumentFlavorParamsOutputBaseFilter(KalturaFlavorParamsOutputFilter):
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
        self.fromXmlImpl(node, KalturaDocumentFlavorParamsOutputBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParamsOutputFilter.toParams(self)
        kparams.put("objectType", "KalturaDocumentFlavorParamsOutputBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaImageFlavorParamsOutputBaseFilter(KalturaFlavorParamsOutputFilter):
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
        self.fromXmlImpl(node, KalturaImageFlavorParamsOutputBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParamsOutputFilter.toParams(self)
        kparams.put("objectType", "KalturaImageFlavorParamsOutputBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaPdfFlavorParamsOutputBaseFilter(KalturaFlavorParamsOutputFilter):
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
        self.fromXmlImpl(node, KalturaPdfFlavorParamsOutputBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParamsOutputFilter.toParams(self)
        kparams.put("objectType", "KalturaPdfFlavorParamsOutputBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSwfFlavorParamsOutputBaseFilter(KalturaFlavorParamsOutputFilter):
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
        self.fromXmlImpl(node, KalturaSwfFlavorParamsOutputBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFlavorParamsOutputFilter.toParams(self)
        kparams.put("objectType", "KalturaSwfFlavorParamsOutputBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDocumentFlavorParamsOutputFilter(KalturaDocumentFlavorParamsOutputBaseFilter):
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
        KalturaDocumentFlavorParamsOutputBaseFilter.__init__(self,
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
        KalturaDocumentFlavorParamsOutputBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDocumentFlavorParamsOutputFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDocumentFlavorParamsOutputBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaDocumentFlavorParamsOutputFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaImageFlavorParamsOutputFilter(KalturaImageFlavorParamsOutputBaseFilter):
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
        KalturaImageFlavorParamsOutputBaseFilter.__init__(self,
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
        KalturaImageFlavorParamsOutputBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaImageFlavorParamsOutputFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaImageFlavorParamsOutputBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaImageFlavorParamsOutputFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaPdfFlavorParamsOutputFilter(KalturaPdfFlavorParamsOutputBaseFilter):
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
        KalturaPdfFlavorParamsOutputBaseFilter.__init__(self,
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
        KalturaPdfFlavorParamsOutputBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPdfFlavorParamsOutputFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaPdfFlavorParamsOutputBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaPdfFlavorParamsOutputFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSwfFlavorParamsOutputFilter(KalturaSwfFlavorParamsOutputBaseFilter):
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
        KalturaSwfFlavorParamsOutputBaseFilter.__init__(self,
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
        KalturaSwfFlavorParamsOutputBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSwfFlavorParamsOutputFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSwfFlavorParamsOutputBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaSwfFlavorParamsOutputFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaDocumentsService(KalturaServiceBase):
    """Document service lets you upload and manage document files"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def addFromUploadedFile(self, documentEntry, uploadTokenId):
        """Add new document entry after the specific document file was uploaded and the upload token id exists"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("documentEntry", documentEntry)
        kparams.addStringIfDefined("uploadTokenId", uploadTokenId)
        self.client.queueServiceActionCall("document_documents", "addFromUploadedFile", KalturaDocumentEntry, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDocumentEntry)

    def addFromEntry(self, sourceEntryId, documentEntry = NotImplemented, sourceFlavorParamsId = NotImplemented):
        """Copy entry into new entry"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("sourceEntryId", sourceEntryId)
        kparams.addObjectIfDefined("documentEntry", documentEntry)
        kparams.addIntIfDefined("sourceFlavorParamsId", sourceFlavorParamsId);
        self.client.queueServiceActionCall("document_documents", "addFromEntry", KalturaDocumentEntry, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDocumentEntry)

    def addFromFlavorAsset(self, sourceFlavorAssetId, documentEntry = NotImplemented):
        """Copy flavor asset into new entry"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("sourceFlavorAssetId", sourceFlavorAssetId)
        kparams.addObjectIfDefined("documentEntry", documentEntry)
        self.client.queueServiceActionCall("document_documents", "addFromFlavorAsset", KalturaDocumentEntry, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDocumentEntry)

    def convert(self, entryId, conversionProfileId = NotImplemented, dynamicConversionAttributes = NotImplemented):
        """Convert entry"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        kparams.addIntIfDefined("conversionProfileId", conversionProfileId);
        kparams.addArrayIfDefined("dynamicConversionAttributes", dynamicConversionAttributes)
        self.client.queueServiceActionCall("document_documents", "convert", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return getXmlNodeInt(resultNode)

    def get(self, entryId, version = -1):
        """Get document entry by ID."""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        kparams.addIntIfDefined("version", version);
        self.client.queueServiceActionCall("document_documents", "get", KalturaDocumentEntry, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDocumentEntry)

    def update(self, entryId, documentEntry):
        """Update document entry. Only the properties that were set will be updated."""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        kparams.addObjectIfDefined("documentEntry", documentEntry)
        self.client.queueServiceActionCall("document_documents", "update", KalturaDocumentEntry, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDocumentEntry)

    def delete(self, entryId):
        """Delete a document entry."""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        self.client.queueServiceActionCall("document_documents", "delete", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List document entries by filter with paging support."""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("document_documents", "list", KalturaDocumentListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDocumentListResponse)

    def upload(self, fileData):
        """Upload a document file to Kaltura, then the file can be used to create a document entry."""

        kparams = KalturaParams()
        kfiles = KalturaFiles()
        kfiles.put("fileData", fileData);
        self.client.queueServiceActionCall("document_documents", "upload", None, kparams, kfiles)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return getXmlNodeText(resultNode)

    def convertPptToSwf(self, entryId):
        """This will queue a batch job for converting the document file to swf
        	 Returns the URL where the new swf will be available"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        self.client.queueServiceActionCall("document_documents", "convertPptToSwf", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return getXmlNodeText(resultNode)

    def serve(self, entryId, flavorAssetId = NotImplemented, forceProxy = False):
        """Serves the file content"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        kparams.addStringIfDefined("flavorAssetId", flavorAssetId)
        kparams.addBoolIfDefined("forceProxy", forceProxy);
        self.client.queueServiceActionCall('document_documents', 'serve', None ,kparams)
        return self.client.getServeUrl()

    def serveByFlavorParamsId(self, entryId, flavorParamsId = NotImplemented, forceProxy = False):
        """Serves the file content"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        kparams.addStringIfDefined("flavorParamsId", flavorParamsId)
        kparams.addBoolIfDefined("forceProxy", forceProxy);
        self.client.queueServiceActionCall('document_documents', 'serveByFlavorParamsId', None ,kparams)
        return self.client.getServeUrl()

    def updateContent(self, entryId, resource, conversionProfileId = NotImplemented):
        """Replace content associated with the given document entry."""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        kparams.addObjectIfDefined("resource", resource)
        kparams.addIntIfDefined("conversionProfileId", conversionProfileId);
        self.client.queueServiceActionCall("document_documents", "updateContent", KalturaDocumentEntry, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDocumentEntry)

    def approveReplace(self, entryId):
        """Approves document replacement"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        self.client.queueServiceActionCall("document_documents", "approveReplace", KalturaDocumentEntry, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDocumentEntry)

    def cancelReplace(self, entryId):
        """Cancels document replacement"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        self.client.queueServiceActionCall("document_documents", "cancelReplace", KalturaDocumentEntry, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDocumentEntry)

########## main ##########
class KalturaDocumentClientPlugin(KalturaClientPlugin):
    # KalturaDocumentClientPlugin
    instance = None

    # @return KalturaDocumentClientPlugin
    @staticmethod
    def get():
        if KalturaDocumentClientPlugin.instance == None:
            KalturaDocumentClientPlugin.instance = KalturaDocumentClientPlugin()
        return KalturaDocumentClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'documents': KalturaDocumentsService,
        }

    def getEnums(self):
        return {
            'KalturaDocumentType': KalturaDocumentType,
            'KalturaDocumentEntryOrderBy': KalturaDocumentEntryOrderBy,
            'KalturaDocumentFlavorParamsOrderBy': KalturaDocumentFlavorParamsOrderBy,
            'KalturaDocumentFlavorParamsOutputOrderBy': KalturaDocumentFlavorParamsOutputOrderBy,
            'KalturaImageFlavorParamsOrderBy': KalturaImageFlavorParamsOrderBy,
            'KalturaImageFlavorParamsOutputOrderBy': KalturaImageFlavorParamsOutputOrderBy,
            'KalturaPdfFlavorParamsOrderBy': KalturaPdfFlavorParamsOrderBy,
            'KalturaPdfFlavorParamsOutputOrderBy': KalturaPdfFlavorParamsOutputOrderBy,
            'KalturaSwfFlavorParamsOrderBy': KalturaSwfFlavorParamsOrderBy,
            'KalturaSwfFlavorParamsOutputOrderBy': KalturaSwfFlavorParamsOutputOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaDocumentEntry': KalturaDocumentEntry,
            'KalturaDocumentListResponse': KalturaDocumentListResponse,
            'KalturaDocumentFlavorParams': KalturaDocumentFlavorParams,
            'KalturaImageFlavorParams': KalturaImageFlavorParams,
            'KalturaPdfFlavorParams': KalturaPdfFlavorParams,
            'KalturaSwfFlavorParams': KalturaSwfFlavorParams,
            'KalturaDocumentFlavorParamsOutput': KalturaDocumentFlavorParamsOutput,
            'KalturaImageFlavorParamsOutput': KalturaImageFlavorParamsOutput,
            'KalturaPdfFlavorParamsOutput': KalturaPdfFlavorParamsOutput,
            'KalturaSwfFlavorParamsOutput': KalturaSwfFlavorParamsOutput,
            'KalturaDocumentEntryBaseFilter': KalturaDocumentEntryBaseFilter,
            'KalturaDocumentEntryFilter': KalturaDocumentEntryFilter,
            'KalturaDocumentFlavorParamsBaseFilter': KalturaDocumentFlavorParamsBaseFilter,
            'KalturaImageFlavorParamsBaseFilter': KalturaImageFlavorParamsBaseFilter,
            'KalturaPdfFlavorParamsBaseFilter': KalturaPdfFlavorParamsBaseFilter,
            'KalturaSwfFlavorParamsBaseFilter': KalturaSwfFlavorParamsBaseFilter,
            'KalturaDocumentFlavorParamsFilter': KalturaDocumentFlavorParamsFilter,
            'KalturaImageFlavorParamsFilter': KalturaImageFlavorParamsFilter,
            'KalturaPdfFlavorParamsFilter': KalturaPdfFlavorParamsFilter,
            'KalturaSwfFlavorParamsFilter': KalturaSwfFlavorParamsFilter,
            'KalturaDocumentFlavorParamsOutputBaseFilter': KalturaDocumentFlavorParamsOutputBaseFilter,
            'KalturaImageFlavorParamsOutputBaseFilter': KalturaImageFlavorParamsOutputBaseFilter,
            'KalturaPdfFlavorParamsOutputBaseFilter': KalturaPdfFlavorParamsOutputBaseFilter,
            'KalturaSwfFlavorParamsOutputBaseFilter': KalturaSwfFlavorParamsOutputBaseFilter,
            'KalturaDocumentFlavorParamsOutputFilter': KalturaDocumentFlavorParamsOutputFilter,
            'KalturaImageFlavorParamsOutputFilter': KalturaImageFlavorParamsOutputFilter,
            'KalturaPdfFlavorParamsOutputFilter': KalturaPdfFlavorParamsOutputFilter,
            'KalturaSwfFlavorParamsOutputFilter': KalturaSwfFlavorParamsOutputFilter,
        }

    # @return string
    def getName(self):
        return 'document'

