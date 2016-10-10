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
from CuePoint import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaThumbCuePointOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    PARTNER_SORT_VALUE_ASC = "+partnerSortValue"
    START_TIME_ASC = "+startTime"
    TRIGGERED_AT_ASC = "+triggeredAt"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    PARTNER_SORT_VALUE_DESC = "-partnerSortValue"
    START_TIME_DESC = "-startTime"
    TRIGGERED_AT_DESC = "-triggeredAt"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaTimedThumbAssetOrderBy(object):
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
class KalturaThumbCuePoint(KalturaCuePoint):
    def __init__(self,
            id=NotImplemented,
            cuePointType=NotImplemented,
            status=NotImplemented,
            entryId=NotImplemented,
            partnerId=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            triggeredAt=NotImplemented,
            tags=NotImplemented,
            startTime=NotImplemented,
            userId=NotImplemented,
            partnerData=NotImplemented,
            partnerSortValue=NotImplemented,
            forceStop=NotImplemented,
            thumbOffset=NotImplemented,
            systemName=NotImplemented,
            assetId=NotImplemented,
            description=NotImplemented,
            title=NotImplemented,
            subType=NotImplemented):
        KalturaCuePoint.__init__(self,
            id,
            cuePointType,
            status,
            entryId,
            partnerId,
            createdAt,
            updatedAt,
            triggeredAt,
            tags,
            startTime,
            userId,
            partnerData,
            partnerSortValue,
            forceStop,
            thumbOffset,
            systemName)

        # @var string
        self.assetId = assetId

        # @var string
        self.description = description

        # @var string
        self.title = title

        # The sub type of the ThumbCuePoint
        # @var KalturaThumbCuePointSubType
        self.subType = subType


    PROPERTY_LOADERS = {
        'assetId': getXmlNodeText, 
        'description': getXmlNodeText, 
        'title': getXmlNodeText, 
        'subType': (KalturaEnumsFactory.createInt, "KalturaThumbCuePointSubType"), 
    }

    def fromXml(self, node):
        KalturaCuePoint.fromXml(self, node)
        self.fromXmlImpl(node, KalturaThumbCuePoint.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCuePoint.toParams(self)
        kparams.put("objectType", "KalturaThumbCuePoint")
        kparams.addStringIfDefined("assetId", self.assetId)
        kparams.addStringIfDefined("description", self.description)
        kparams.addStringIfDefined("title", self.title)
        kparams.addIntEnumIfDefined("subType", self.subType)
        return kparams

    def getAssetId(self):
        return self.assetId

    def setAssetId(self, newAssetId):
        self.assetId = newAssetId

    def getDescription(self):
        return self.description

    def setDescription(self, newDescription):
        self.description = newDescription

    def getTitle(self):
        return self.title

    def setTitle(self, newTitle):
        self.title = newTitle

    def getSubType(self):
        return self.subType

    def setSubType(self, newSubType):
        self.subType = newSubType


# @package Kaltura
# @subpackage Client
class KalturaTimedThumbAsset(KalturaThumbAsset):
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
            thumbParamsId=NotImplemented,
            width=NotImplemented,
            height=NotImplemented,
            status=NotImplemented,
            cuePointId=NotImplemented):
        KalturaThumbAsset.__init__(self,
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
            thumbParamsId,
            width,
            height,
            status)

        # Associated thumb cue point ID
        # @var string
        # @insertonly
        self.cuePointId = cuePointId


    PROPERTY_LOADERS = {
        'cuePointId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaThumbAsset.fromXml(self, node)
        self.fromXmlImpl(node, KalturaTimedThumbAsset.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaThumbAsset.toParams(self)
        kparams.put("objectType", "KalturaTimedThumbAsset")
        kparams.addStringIfDefined("cuePointId", self.cuePointId)
        return kparams

    def getCuePointId(self):
        return self.cuePointId

    def setCuePointId(self, newCuePointId):
        self.cuePointId = newCuePointId


# @package Kaltura
# @subpackage Client
class KalturaThumbCuePointBaseFilter(KalturaCuePointFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            cuePointTypeEqual=NotImplemented,
            cuePointTypeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            triggeredAtGreaterThanOrEqual=NotImplemented,
            triggeredAtLessThanOrEqual=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            startTimeGreaterThanOrEqual=NotImplemented,
            startTimeLessThanOrEqual=NotImplemented,
            userIdEqual=NotImplemented,
            userIdIn=NotImplemented,
            partnerSortValueEqual=NotImplemented,
            partnerSortValueIn=NotImplemented,
            partnerSortValueGreaterThanOrEqual=NotImplemented,
            partnerSortValueLessThanOrEqual=NotImplemented,
            forceStopEqual=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            freeText=NotImplemented,
            userIdEqualCurrent=NotImplemented,
            userIdCurrent=NotImplemented,
            descriptionLike=NotImplemented,
            descriptionMultiLikeOr=NotImplemented,
            descriptionMultiLikeAnd=NotImplemented,
            titleLike=NotImplemented,
            titleMultiLikeOr=NotImplemented,
            titleMultiLikeAnd=NotImplemented,
            subTypeEqual=NotImplemented,
            subTypeIn=NotImplemented):
        KalturaCuePointFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            cuePointTypeEqual,
            cuePointTypeIn,
            statusEqual,
            statusIn,
            entryIdEqual,
            entryIdIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            triggeredAtGreaterThanOrEqual,
            triggeredAtLessThanOrEqual,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            startTimeGreaterThanOrEqual,
            startTimeLessThanOrEqual,
            userIdEqual,
            userIdIn,
            partnerSortValueEqual,
            partnerSortValueIn,
            partnerSortValueGreaterThanOrEqual,
            partnerSortValueLessThanOrEqual,
            forceStopEqual,
            systemNameEqual,
            systemNameIn,
            freeText,
            userIdEqualCurrent,
            userIdCurrent)

        # @var string
        self.descriptionLike = descriptionLike

        # @var string
        self.descriptionMultiLikeOr = descriptionMultiLikeOr

        # @var string
        self.descriptionMultiLikeAnd = descriptionMultiLikeAnd

        # @var string
        self.titleLike = titleLike

        # @var string
        self.titleMultiLikeOr = titleMultiLikeOr

        # @var string
        self.titleMultiLikeAnd = titleMultiLikeAnd

        # @var KalturaThumbCuePointSubType
        self.subTypeEqual = subTypeEqual

        # @var string
        self.subTypeIn = subTypeIn


    PROPERTY_LOADERS = {
        'descriptionLike': getXmlNodeText, 
        'descriptionMultiLikeOr': getXmlNodeText, 
        'descriptionMultiLikeAnd': getXmlNodeText, 
        'titleLike': getXmlNodeText, 
        'titleMultiLikeOr': getXmlNodeText, 
        'titleMultiLikeAnd': getXmlNodeText, 
        'subTypeEqual': (KalturaEnumsFactory.createInt, "KalturaThumbCuePointSubType"), 
        'subTypeIn': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaCuePointFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaThumbCuePointBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCuePointFilter.toParams(self)
        kparams.put("objectType", "KalturaThumbCuePointBaseFilter")
        kparams.addStringIfDefined("descriptionLike", self.descriptionLike)
        kparams.addStringIfDefined("descriptionMultiLikeOr", self.descriptionMultiLikeOr)
        kparams.addStringIfDefined("descriptionMultiLikeAnd", self.descriptionMultiLikeAnd)
        kparams.addStringIfDefined("titleLike", self.titleLike)
        kparams.addStringIfDefined("titleMultiLikeOr", self.titleMultiLikeOr)
        kparams.addStringIfDefined("titleMultiLikeAnd", self.titleMultiLikeAnd)
        kparams.addIntEnumIfDefined("subTypeEqual", self.subTypeEqual)
        kparams.addStringIfDefined("subTypeIn", self.subTypeIn)
        return kparams

    def getDescriptionLike(self):
        return self.descriptionLike

    def setDescriptionLike(self, newDescriptionLike):
        self.descriptionLike = newDescriptionLike

    def getDescriptionMultiLikeOr(self):
        return self.descriptionMultiLikeOr

    def setDescriptionMultiLikeOr(self, newDescriptionMultiLikeOr):
        self.descriptionMultiLikeOr = newDescriptionMultiLikeOr

    def getDescriptionMultiLikeAnd(self):
        return self.descriptionMultiLikeAnd

    def setDescriptionMultiLikeAnd(self, newDescriptionMultiLikeAnd):
        self.descriptionMultiLikeAnd = newDescriptionMultiLikeAnd

    def getTitleLike(self):
        return self.titleLike

    def setTitleLike(self, newTitleLike):
        self.titleLike = newTitleLike

    def getTitleMultiLikeOr(self):
        return self.titleMultiLikeOr

    def setTitleMultiLikeOr(self, newTitleMultiLikeOr):
        self.titleMultiLikeOr = newTitleMultiLikeOr

    def getTitleMultiLikeAnd(self):
        return self.titleMultiLikeAnd

    def setTitleMultiLikeAnd(self, newTitleMultiLikeAnd):
        self.titleMultiLikeAnd = newTitleMultiLikeAnd

    def getSubTypeEqual(self):
        return self.subTypeEqual

    def setSubTypeEqual(self, newSubTypeEqual):
        self.subTypeEqual = newSubTypeEqual

    def getSubTypeIn(self):
        return self.subTypeIn

    def setSubTypeIn(self, newSubTypeIn):
        self.subTypeIn = newSubTypeIn


# @package Kaltura
# @subpackage Client
class KalturaThumbCuePointFilter(KalturaThumbCuePointBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            cuePointTypeEqual=NotImplemented,
            cuePointTypeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            triggeredAtGreaterThanOrEqual=NotImplemented,
            triggeredAtLessThanOrEqual=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            startTimeGreaterThanOrEqual=NotImplemented,
            startTimeLessThanOrEqual=NotImplemented,
            userIdEqual=NotImplemented,
            userIdIn=NotImplemented,
            partnerSortValueEqual=NotImplemented,
            partnerSortValueIn=NotImplemented,
            partnerSortValueGreaterThanOrEqual=NotImplemented,
            partnerSortValueLessThanOrEqual=NotImplemented,
            forceStopEqual=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            freeText=NotImplemented,
            userIdEqualCurrent=NotImplemented,
            userIdCurrent=NotImplemented,
            descriptionLike=NotImplemented,
            descriptionMultiLikeOr=NotImplemented,
            descriptionMultiLikeAnd=NotImplemented,
            titleLike=NotImplemented,
            titleMultiLikeOr=NotImplemented,
            titleMultiLikeAnd=NotImplemented,
            subTypeEqual=NotImplemented,
            subTypeIn=NotImplemented):
        KalturaThumbCuePointBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            cuePointTypeEqual,
            cuePointTypeIn,
            statusEqual,
            statusIn,
            entryIdEqual,
            entryIdIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            triggeredAtGreaterThanOrEqual,
            triggeredAtLessThanOrEqual,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            startTimeGreaterThanOrEqual,
            startTimeLessThanOrEqual,
            userIdEqual,
            userIdIn,
            partnerSortValueEqual,
            partnerSortValueIn,
            partnerSortValueGreaterThanOrEqual,
            partnerSortValueLessThanOrEqual,
            forceStopEqual,
            systemNameEqual,
            systemNameIn,
            freeText,
            userIdEqualCurrent,
            userIdCurrent,
            descriptionLike,
            descriptionMultiLikeOr,
            descriptionMultiLikeAnd,
            titleLike,
            titleMultiLikeOr,
            titleMultiLikeAnd,
            subTypeEqual,
            subTypeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaThumbCuePointBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaThumbCuePointFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaThumbCuePointBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaThumbCuePointFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaTimedThumbAssetBaseFilter(KalturaThumbAssetFilter):
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
            thumbParamsIdEqual=NotImplemented,
            thumbParamsIdIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            statusNotIn=NotImplemented,
            typeIn=NotImplemented):
        KalturaThumbAssetFilter.__init__(self,
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
            thumbParamsIdEqual,
            thumbParamsIdIn,
            statusEqual,
            statusIn,
            statusNotIn,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaThumbAssetFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaTimedThumbAssetBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaThumbAssetFilter.toParams(self)
        kparams.put("objectType", "KalturaTimedThumbAssetBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaTimedThumbAssetFilter(KalturaTimedThumbAssetBaseFilter):
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
            thumbParamsIdEqual=NotImplemented,
            thumbParamsIdIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            statusNotIn=NotImplemented,
            typeIn=NotImplemented):
        KalturaTimedThumbAssetBaseFilter.__init__(self,
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
            thumbParamsIdEqual,
            thumbParamsIdIn,
            statusEqual,
            statusIn,
            statusNotIn,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaTimedThumbAssetBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaTimedThumbAssetFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaTimedThumbAssetBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaTimedThumbAssetFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaThumbCuePointClientPlugin(KalturaClientPlugin):
    # KalturaThumbCuePointClientPlugin
    instance = None

    # @return KalturaThumbCuePointClientPlugin
    @staticmethod
    def get():
        if KalturaThumbCuePointClientPlugin.instance == None:
            KalturaThumbCuePointClientPlugin.instance = KalturaThumbCuePointClientPlugin()
        return KalturaThumbCuePointClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaThumbCuePointOrderBy': KalturaThumbCuePointOrderBy,
            'KalturaTimedThumbAssetOrderBy': KalturaTimedThumbAssetOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaThumbCuePoint': KalturaThumbCuePoint,
            'KalturaTimedThumbAsset': KalturaTimedThumbAsset,
            'KalturaThumbCuePointBaseFilter': KalturaThumbCuePointBaseFilter,
            'KalturaThumbCuePointFilter': KalturaThumbCuePointFilter,
            'KalturaTimedThumbAssetBaseFilter': KalturaTimedThumbAssetBaseFilter,
            'KalturaTimedThumbAssetFilter': KalturaTimedThumbAssetFilter,
        }

    # @return string
    def getName(self):
        return 'thumbCuePoint'

