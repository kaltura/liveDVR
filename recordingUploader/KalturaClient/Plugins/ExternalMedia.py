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
class KalturaExternalMediaEntryOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    DURATION_ASC = "+duration"
    END_DATE_ASC = "+endDate"
    LAST_PLAYED_AT_ASC = "+lastPlayedAt"
    MEDIA_TYPE_ASC = "+mediaType"
    MODERATION_COUNT_ASC = "+moderationCount"
    NAME_ASC = "+name"
    PARTNER_SORT_VALUE_ASC = "+partnerSortValue"
    PLAYS_ASC = "+plays"
    RANK_ASC = "+rank"
    RECENT_ASC = "+recent"
    START_DATE_ASC = "+startDate"
    TOTAL_RANK_ASC = "+totalRank"
    UPDATED_AT_ASC = "+updatedAt"
    VIEWS_ASC = "+views"
    WEIGHT_ASC = "+weight"
    CREATED_AT_DESC = "-createdAt"
    DURATION_DESC = "-duration"
    END_DATE_DESC = "-endDate"
    LAST_PLAYED_AT_DESC = "-lastPlayedAt"
    MEDIA_TYPE_DESC = "-mediaType"
    MODERATION_COUNT_DESC = "-moderationCount"
    NAME_DESC = "-name"
    PARTNER_SORT_VALUE_DESC = "-partnerSortValue"
    PLAYS_DESC = "-plays"
    RANK_DESC = "-rank"
    RECENT_DESC = "-recent"
    START_DATE_DESC = "-startDate"
    TOTAL_RANK_DESC = "-totalRank"
    UPDATED_AT_DESC = "-updatedAt"
    VIEWS_DESC = "-views"
    WEIGHT_DESC = "-weight"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaExternalMediaSourceType(object):
    INTERCALL = "InterCall"
    YOUTUBE = "YouTube"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaExternalMediaEntry(KalturaMediaEntry):
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
            plays=NotImplemented,
            views=NotImplemented,
            lastPlayedAt=NotImplemented,
            width=NotImplemented,
            height=NotImplemented,
            duration=NotImplemented,
            msDuration=NotImplemented,
            durationType=NotImplemented,
            mediaType=NotImplemented,
            conversionQuality=NotImplemented,
            sourceType=NotImplemented,
            searchProviderType=NotImplemented,
            searchProviderId=NotImplemented,
            creditUserName=NotImplemented,
            creditUrl=NotImplemented,
            mediaDate=NotImplemented,
            dataUrl=NotImplemented,
            flavorParamsIds=NotImplemented,
            isTrimDisabled=NotImplemented,
            externalSourceType=NotImplemented,
            assetParamsIds=NotImplemented):
        KalturaMediaEntry.__init__(self,
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
            templateEntryId,
            plays,
            views,
            lastPlayedAt,
            width,
            height,
            duration,
            msDuration,
            durationType,
            mediaType,
            conversionQuality,
            sourceType,
            searchProviderType,
            searchProviderId,
            creditUserName,
            creditUrl,
            mediaDate,
            dataUrl,
            flavorParamsIds,
            isTrimDisabled)

        # The source type of the external media
        # @var KalturaExternalMediaSourceType
        # @insertonly
        self.externalSourceType = externalSourceType

        # Comma separated asset params ids that exists for this external media entry
        # @var string
        # @readonly
        self.assetParamsIds = assetParamsIds


    PROPERTY_LOADERS = {
        'externalSourceType': (KalturaEnumsFactory.createString, "KalturaExternalMediaSourceType"), 
        'assetParamsIds': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaMediaEntry.fromXml(self, node)
        self.fromXmlImpl(node, KalturaExternalMediaEntry.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaMediaEntry.toParams(self)
        kparams.put("objectType", "KalturaExternalMediaEntry")
        kparams.addStringEnumIfDefined("externalSourceType", self.externalSourceType)
        return kparams

    def getExternalSourceType(self):
        return self.externalSourceType

    def setExternalSourceType(self, newExternalSourceType):
        self.externalSourceType = newExternalSourceType

    def getAssetParamsIds(self):
        return self.assetParamsIds


# @package Kaltura
# @subpackage Client
class KalturaExternalMediaEntryListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaExternalMediaEntry
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaExternalMediaEntry), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaExternalMediaEntryListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaExternalMediaEntryListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaExternalMediaEntryBaseFilter(KalturaMediaEntryFilter):
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
            lastPlayedAtGreaterThanOrEqual=NotImplemented,
            lastPlayedAtLessThanOrEqual=NotImplemented,
            durationLessThan=NotImplemented,
            durationGreaterThan=NotImplemented,
            durationLessThanOrEqual=NotImplemented,
            durationGreaterThanOrEqual=NotImplemented,
            durationTypeMatchOr=NotImplemented,
            mediaTypeEqual=NotImplemented,
            mediaTypeIn=NotImplemented,
            sourceTypeEqual=NotImplemented,
            sourceTypeNotEqual=NotImplemented,
            sourceTypeIn=NotImplemented,
            sourceTypeNotIn=NotImplemented,
            mediaDateGreaterThanOrEqual=NotImplemented,
            mediaDateLessThanOrEqual=NotImplemented,
            flavorParamsIdsMatchOr=NotImplemented,
            flavorParamsIdsMatchAnd=NotImplemented,
            externalSourceTypeEqual=NotImplemented,
            externalSourceTypeIn=NotImplemented,
            assetParamsIdsMatchOr=NotImplemented,
            assetParamsIdsMatchAnd=NotImplemented):
        KalturaMediaEntryFilter.__init__(self,
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
            lastPlayedAtGreaterThanOrEqual,
            lastPlayedAtLessThanOrEqual,
            durationLessThan,
            durationGreaterThan,
            durationLessThanOrEqual,
            durationGreaterThanOrEqual,
            durationTypeMatchOr,
            mediaTypeEqual,
            mediaTypeIn,
            sourceTypeEqual,
            sourceTypeNotEqual,
            sourceTypeIn,
            sourceTypeNotIn,
            mediaDateGreaterThanOrEqual,
            mediaDateLessThanOrEqual,
            flavorParamsIdsMatchOr,
            flavorParamsIdsMatchAnd)

        # @var KalturaExternalMediaSourceType
        self.externalSourceTypeEqual = externalSourceTypeEqual

        # @var string
        self.externalSourceTypeIn = externalSourceTypeIn

        # @var string
        self.assetParamsIdsMatchOr = assetParamsIdsMatchOr

        # @var string
        self.assetParamsIdsMatchAnd = assetParamsIdsMatchAnd


    PROPERTY_LOADERS = {
        'externalSourceTypeEqual': (KalturaEnumsFactory.createString, "KalturaExternalMediaSourceType"), 
        'externalSourceTypeIn': getXmlNodeText, 
        'assetParamsIdsMatchOr': getXmlNodeText, 
        'assetParamsIdsMatchAnd': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaMediaEntryFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaExternalMediaEntryBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaMediaEntryFilter.toParams(self)
        kparams.put("objectType", "KalturaExternalMediaEntryBaseFilter")
        kparams.addStringEnumIfDefined("externalSourceTypeEqual", self.externalSourceTypeEqual)
        kparams.addStringIfDefined("externalSourceTypeIn", self.externalSourceTypeIn)
        kparams.addStringIfDefined("assetParamsIdsMatchOr", self.assetParamsIdsMatchOr)
        kparams.addStringIfDefined("assetParamsIdsMatchAnd", self.assetParamsIdsMatchAnd)
        return kparams

    def getExternalSourceTypeEqual(self):
        return self.externalSourceTypeEqual

    def setExternalSourceTypeEqual(self, newExternalSourceTypeEqual):
        self.externalSourceTypeEqual = newExternalSourceTypeEqual

    def getExternalSourceTypeIn(self):
        return self.externalSourceTypeIn

    def setExternalSourceTypeIn(self, newExternalSourceTypeIn):
        self.externalSourceTypeIn = newExternalSourceTypeIn

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
class KalturaExternalMediaEntryFilter(KalturaExternalMediaEntryBaseFilter):
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
            lastPlayedAtGreaterThanOrEqual=NotImplemented,
            lastPlayedAtLessThanOrEqual=NotImplemented,
            durationLessThan=NotImplemented,
            durationGreaterThan=NotImplemented,
            durationLessThanOrEqual=NotImplemented,
            durationGreaterThanOrEqual=NotImplemented,
            durationTypeMatchOr=NotImplemented,
            mediaTypeEqual=NotImplemented,
            mediaTypeIn=NotImplemented,
            sourceTypeEqual=NotImplemented,
            sourceTypeNotEqual=NotImplemented,
            sourceTypeIn=NotImplemented,
            sourceTypeNotIn=NotImplemented,
            mediaDateGreaterThanOrEqual=NotImplemented,
            mediaDateLessThanOrEqual=NotImplemented,
            flavorParamsIdsMatchOr=NotImplemented,
            flavorParamsIdsMatchAnd=NotImplemented,
            externalSourceTypeEqual=NotImplemented,
            externalSourceTypeIn=NotImplemented,
            assetParamsIdsMatchOr=NotImplemented,
            assetParamsIdsMatchAnd=NotImplemented):
        KalturaExternalMediaEntryBaseFilter.__init__(self,
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
            lastPlayedAtGreaterThanOrEqual,
            lastPlayedAtLessThanOrEqual,
            durationLessThan,
            durationGreaterThan,
            durationLessThanOrEqual,
            durationGreaterThanOrEqual,
            durationTypeMatchOr,
            mediaTypeEqual,
            mediaTypeIn,
            sourceTypeEqual,
            sourceTypeNotEqual,
            sourceTypeIn,
            sourceTypeNotIn,
            mediaDateGreaterThanOrEqual,
            mediaDateLessThanOrEqual,
            flavorParamsIdsMatchOr,
            flavorParamsIdsMatchAnd,
            externalSourceTypeEqual,
            externalSourceTypeIn,
            assetParamsIdsMatchOr,
            assetParamsIdsMatchAnd)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaExternalMediaEntryBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaExternalMediaEntryFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaExternalMediaEntryBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaExternalMediaEntryFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaExternalMediaService(KalturaServiceBase):
    """External media service lets you upload and manage embed codes and external playable content"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, entry):
        """Add external media entry"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("entry", entry)
        self.client.queueServiceActionCall("externalmedia_externalmedia", "add", KalturaExternalMediaEntry, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaExternalMediaEntry)

    def get(self, id):
        """Get external media entry by ID."""

        kparams = KalturaParams()
        kparams.addStringIfDefined("id", id)
        self.client.queueServiceActionCall("externalmedia_externalmedia", "get", KalturaExternalMediaEntry, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaExternalMediaEntry)

    def update(self, id, entry):
        """Update external media entry. Only the properties that were set will be updated."""

        kparams = KalturaParams()
        kparams.addStringIfDefined("id", id)
        kparams.addObjectIfDefined("entry", entry)
        self.client.queueServiceActionCall("externalmedia_externalmedia", "update", KalturaExternalMediaEntry, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaExternalMediaEntry)

    def delete(self, id):
        """Delete a external media entry."""

        kparams = KalturaParams()
        kparams.addStringIfDefined("id", id)
        self.client.queueServiceActionCall("externalmedia_externalmedia", "delete", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List media entries by filter with paging support."""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("externalmedia_externalmedia", "list", KalturaExternalMediaEntryListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaExternalMediaEntryListResponse)

    def count(self, filter = NotImplemented):
        """Count media entries by filter."""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        self.client.queueServiceActionCall("externalmedia_externalmedia", "count", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return getXmlNodeInt(resultNode)

########## main ##########
class KalturaExternalMediaClientPlugin(KalturaClientPlugin):
    # KalturaExternalMediaClientPlugin
    instance = None

    # @return KalturaExternalMediaClientPlugin
    @staticmethod
    def get():
        if KalturaExternalMediaClientPlugin.instance == None:
            KalturaExternalMediaClientPlugin.instance = KalturaExternalMediaClientPlugin()
        return KalturaExternalMediaClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'externalMedia': KalturaExternalMediaService,
        }

    def getEnums(self):
        return {
            'KalturaExternalMediaEntryOrderBy': KalturaExternalMediaEntryOrderBy,
            'KalturaExternalMediaSourceType': KalturaExternalMediaSourceType,
        }

    def getTypes(self):
        return {
            'KalturaExternalMediaEntry': KalturaExternalMediaEntry,
            'KalturaExternalMediaEntryListResponse': KalturaExternalMediaEntryListResponse,
            'KalturaExternalMediaEntryBaseFilter': KalturaExternalMediaEntryBaseFilter,
            'KalturaExternalMediaEntryFilter': KalturaExternalMediaEntryFilter,
        }

    # @return string
    def getName(self):
        return 'externalMedia'

