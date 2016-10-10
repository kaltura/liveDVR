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
from Attachment import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaTranscriptAssetOrderBy(object):
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

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaTranscriptAsset(KalturaAttachmentAsset):
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
            filename=NotImplemented,
            title=NotImplemented,
            format=NotImplemented,
            status=NotImplemented,
            accuracy=NotImplemented,
            humanVerified=NotImplemented,
            language=NotImplemented):
        KalturaAttachmentAsset.__init__(self,
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
            filename,
            title,
            format,
            status)

        # The accuracy of the transcript - values between 0 and 1
        # @var float
        self.accuracy = accuracy

        # Was verified by human or machine
        # @var KalturaNullableBoolean
        self.humanVerified = humanVerified

        # The language of the transcript
        # @var KalturaLanguage
        self.language = language


    PROPERTY_LOADERS = {
        'accuracy': getXmlNodeFloat, 
        'humanVerified': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
        'language': (KalturaEnumsFactory.createString, "KalturaLanguage"), 
    }

    def fromXml(self, node):
        KalturaAttachmentAsset.fromXml(self, node)
        self.fromXmlImpl(node, KalturaTranscriptAsset.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaAttachmentAsset.toParams(self)
        kparams.put("objectType", "KalturaTranscriptAsset")
        kparams.addFloatIfDefined("accuracy", self.accuracy)
        kparams.addIntEnumIfDefined("humanVerified", self.humanVerified)
        kparams.addStringEnumIfDefined("language", self.language)
        return kparams

    def getAccuracy(self):
        return self.accuracy

    def setAccuracy(self, newAccuracy):
        self.accuracy = newAccuracy

    def getHumanVerified(self):
        return self.humanVerified

    def setHumanVerified(self, newHumanVerified):
        self.humanVerified = newHumanVerified

    def getLanguage(self):
        return self.language

    def setLanguage(self, newLanguage):
        self.language = newLanguage


# @package Kaltura
# @subpackage Client
class KalturaEntryTranscriptAssetSearchItem(KalturaSearchItem):
    def __init__(self,
            contentLike=NotImplemented,
            contentMultiLikeOr=NotImplemented,
            contentMultiLikeAnd=NotImplemented):
        KalturaSearchItem.__init__(self)

        # @var string
        self.contentLike = contentLike

        # @var string
        self.contentMultiLikeOr = contentMultiLikeOr

        # @var string
        self.contentMultiLikeAnd = contentMultiLikeAnd


    PROPERTY_LOADERS = {
        'contentLike': getXmlNodeText, 
        'contentMultiLikeOr': getXmlNodeText, 
        'contentMultiLikeAnd': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaSearchItem.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEntryTranscriptAssetSearchItem.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSearchItem.toParams(self)
        kparams.put("objectType", "KalturaEntryTranscriptAssetSearchItem")
        kparams.addStringIfDefined("contentLike", self.contentLike)
        kparams.addStringIfDefined("contentMultiLikeOr", self.contentMultiLikeOr)
        kparams.addStringIfDefined("contentMultiLikeAnd", self.contentMultiLikeAnd)
        return kparams

    def getContentLike(self):
        return self.contentLike

    def setContentLike(self, newContentLike):
        self.contentLike = newContentLike

    def getContentMultiLikeOr(self):
        return self.contentMultiLikeOr

    def setContentMultiLikeOr(self, newContentMultiLikeOr):
        self.contentMultiLikeOr = newContentMultiLikeOr

    def getContentMultiLikeAnd(self):
        return self.contentMultiLikeAnd

    def setContentMultiLikeAnd(self, newContentMultiLikeAnd):
        self.contentMultiLikeAnd = newContentMultiLikeAnd


# @package Kaltura
# @subpackage Client
class KalturaTranscriptAssetListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaTranscriptAsset
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaTranscriptAsset), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaTranscriptAssetListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaTranscriptAssetListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaTranscriptAssetBaseFilter(KalturaAttachmentAssetFilter):
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
            formatEqual=NotImplemented,
            formatIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            statusNotIn=NotImplemented):
        KalturaAttachmentAssetFilter.__init__(self,
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
            formatEqual,
            formatIn,
            statusEqual,
            statusIn,
            statusNotIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaAttachmentAssetFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaTranscriptAssetBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaAttachmentAssetFilter.toParams(self)
        kparams.put("objectType", "KalturaTranscriptAssetBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaTranscriptAssetFilter(KalturaTranscriptAssetBaseFilter):
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
            formatEqual=NotImplemented,
            formatIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            statusNotIn=NotImplemented):
        KalturaTranscriptAssetBaseFilter.__init__(self,
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
            formatEqual,
            formatIn,
            statusEqual,
            statusIn,
            statusNotIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaTranscriptAssetBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaTranscriptAssetFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaTranscriptAssetBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaTranscriptAssetFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaTranscriptClientPlugin(KalturaClientPlugin):
    # KalturaTranscriptClientPlugin
    instance = None

    # @return KalturaTranscriptClientPlugin
    @staticmethod
    def get():
        if KalturaTranscriptClientPlugin.instance == None:
            KalturaTranscriptClientPlugin.instance = KalturaTranscriptClientPlugin()
        return KalturaTranscriptClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaTranscriptAssetOrderBy': KalturaTranscriptAssetOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaTranscriptAsset': KalturaTranscriptAsset,
            'KalturaEntryTranscriptAssetSearchItem': KalturaEntryTranscriptAssetSearchItem,
            'KalturaTranscriptAssetListResponse': KalturaTranscriptAssetListResponse,
            'KalturaTranscriptAssetBaseFilter': KalturaTranscriptAssetBaseFilter,
            'KalturaTranscriptAssetFilter': KalturaTranscriptAssetFilter,
        }

    # @return string
    def getName(self):
        return 'transcript'

