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
class KalturaCodeCuePointOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    DURATION_ASC = "+duration"
    END_TIME_ASC = "+endTime"
    PARTNER_SORT_VALUE_ASC = "+partnerSortValue"
    START_TIME_ASC = "+startTime"
    TRIGGERED_AT_ASC = "+triggeredAt"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    DURATION_DESC = "-duration"
    END_TIME_DESC = "-endTime"
    PARTNER_SORT_VALUE_DESC = "-partnerSortValue"
    START_TIME_DESC = "-startTime"
    TRIGGERED_AT_DESC = "-triggeredAt"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaCodeCuePoint(KalturaCuePoint):
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
            code=NotImplemented,
            description=NotImplemented,
            endTime=NotImplemented,
            duration=NotImplemented):
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
        self.code = code

        # @var string
        self.description = description

        # @var int
        self.endTime = endTime

        # Duration in milliseconds
        # @var int
        # @readonly
        self.duration = duration


    PROPERTY_LOADERS = {
        'code': getXmlNodeText, 
        'description': getXmlNodeText, 
        'endTime': getXmlNodeInt, 
        'duration': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaCuePoint.fromXml(self, node)
        self.fromXmlImpl(node, KalturaCodeCuePoint.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCuePoint.toParams(self)
        kparams.put("objectType", "KalturaCodeCuePoint")
        kparams.addStringIfDefined("code", self.code)
        kparams.addStringIfDefined("description", self.description)
        kparams.addIntIfDefined("endTime", self.endTime)
        return kparams

    def getCode(self):
        return self.code

    def setCode(self, newCode):
        self.code = newCode

    def getDescription(self):
        return self.description

    def setDescription(self, newDescription):
        self.description = newDescription

    def getEndTime(self):
        return self.endTime

    def setEndTime(self, newEndTime):
        self.endTime = newEndTime

    def getDuration(self):
        return self.duration


# @package Kaltura
# @subpackage Client
class KalturaCodeCuePointBaseFilter(KalturaCuePointFilter):
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
            codeLike=NotImplemented,
            codeMultiLikeOr=NotImplemented,
            codeMultiLikeAnd=NotImplemented,
            codeEqual=NotImplemented,
            codeIn=NotImplemented,
            descriptionLike=NotImplemented,
            descriptionMultiLikeOr=NotImplemented,
            descriptionMultiLikeAnd=NotImplemented,
            endTimeGreaterThanOrEqual=NotImplemented,
            endTimeLessThanOrEqual=NotImplemented,
            durationGreaterThanOrEqual=NotImplemented,
            durationLessThanOrEqual=NotImplemented):
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
        self.codeLike = codeLike

        # @var string
        self.codeMultiLikeOr = codeMultiLikeOr

        # @var string
        self.codeMultiLikeAnd = codeMultiLikeAnd

        # @var string
        self.codeEqual = codeEqual

        # @var string
        self.codeIn = codeIn

        # @var string
        self.descriptionLike = descriptionLike

        # @var string
        self.descriptionMultiLikeOr = descriptionMultiLikeOr

        # @var string
        self.descriptionMultiLikeAnd = descriptionMultiLikeAnd

        # @var int
        self.endTimeGreaterThanOrEqual = endTimeGreaterThanOrEqual

        # @var int
        self.endTimeLessThanOrEqual = endTimeLessThanOrEqual

        # @var int
        self.durationGreaterThanOrEqual = durationGreaterThanOrEqual

        # @var int
        self.durationLessThanOrEqual = durationLessThanOrEqual


    PROPERTY_LOADERS = {
        'codeLike': getXmlNodeText, 
        'codeMultiLikeOr': getXmlNodeText, 
        'codeMultiLikeAnd': getXmlNodeText, 
        'codeEqual': getXmlNodeText, 
        'codeIn': getXmlNodeText, 
        'descriptionLike': getXmlNodeText, 
        'descriptionMultiLikeOr': getXmlNodeText, 
        'descriptionMultiLikeAnd': getXmlNodeText, 
        'endTimeGreaterThanOrEqual': getXmlNodeInt, 
        'endTimeLessThanOrEqual': getXmlNodeInt, 
        'durationGreaterThanOrEqual': getXmlNodeInt, 
        'durationLessThanOrEqual': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaCuePointFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaCodeCuePointBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCuePointFilter.toParams(self)
        kparams.put("objectType", "KalturaCodeCuePointBaseFilter")
        kparams.addStringIfDefined("codeLike", self.codeLike)
        kparams.addStringIfDefined("codeMultiLikeOr", self.codeMultiLikeOr)
        kparams.addStringIfDefined("codeMultiLikeAnd", self.codeMultiLikeAnd)
        kparams.addStringIfDefined("codeEqual", self.codeEqual)
        kparams.addStringIfDefined("codeIn", self.codeIn)
        kparams.addStringIfDefined("descriptionLike", self.descriptionLike)
        kparams.addStringIfDefined("descriptionMultiLikeOr", self.descriptionMultiLikeOr)
        kparams.addStringIfDefined("descriptionMultiLikeAnd", self.descriptionMultiLikeAnd)
        kparams.addIntIfDefined("endTimeGreaterThanOrEqual", self.endTimeGreaterThanOrEqual)
        kparams.addIntIfDefined("endTimeLessThanOrEqual", self.endTimeLessThanOrEqual)
        kparams.addIntIfDefined("durationGreaterThanOrEqual", self.durationGreaterThanOrEqual)
        kparams.addIntIfDefined("durationLessThanOrEqual", self.durationLessThanOrEqual)
        return kparams

    def getCodeLike(self):
        return self.codeLike

    def setCodeLike(self, newCodeLike):
        self.codeLike = newCodeLike

    def getCodeMultiLikeOr(self):
        return self.codeMultiLikeOr

    def setCodeMultiLikeOr(self, newCodeMultiLikeOr):
        self.codeMultiLikeOr = newCodeMultiLikeOr

    def getCodeMultiLikeAnd(self):
        return self.codeMultiLikeAnd

    def setCodeMultiLikeAnd(self, newCodeMultiLikeAnd):
        self.codeMultiLikeAnd = newCodeMultiLikeAnd

    def getCodeEqual(self):
        return self.codeEqual

    def setCodeEqual(self, newCodeEqual):
        self.codeEqual = newCodeEqual

    def getCodeIn(self):
        return self.codeIn

    def setCodeIn(self, newCodeIn):
        self.codeIn = newCodeIn

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

    def getEndTimeGreaterThanOrEqual(self):
        return self.endTimeGreaterThanOrEqual

    def setEndTimeGreaterThanOrEqual(self, newEndTimeGreaterThanOrEqual):
        self.endTimeGreaterThanOrEqual = newEndTimeGreaterThanOrEqual

    def getEndTimeLessThanOrEqual(self):
        return self.endTimeLessThanOrEqual

    def setEndTimeLessThanOrEqual(self, newEndTimeLessThanOrEqual):
        self.endTimeLessThanOrEqual = newEndTimeLessThanOrEqual

    def getDurationGreaterThanOrEqual(self):
        return self.durationGreaterThanOrEqual

    def setDurationGreaterThanOrEqual(self, newDurationGreaterThanOrEqual):
        self.durationGreaterThanOrEqual = newDurationGreaterThanOrEqual

    def getDurationLessThanOrEqual(self):
        return self.durationLessThanOrEqual

    def setDurationLessThanOrEqual(self, newDurationLessThanOrEqual):
        self.durationLessThanOrEqual = newDurationLessThanOrEqual


# @package Kaltura
# @subpackage Client
class KalturaCodeCuePointFilter(KalturaCodeCuePointBaseFilter):
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
            codeLike=NotImplemented,
            codeMultiLikeOr=NotImplemented,
            codeMultiLikeAnd=NotImplemented,
            codeEqual=NotImplemented,
            codeIn=NotImplemented,
            descriptionLike=NotImplemented,
            descriptionMultiLikeOr=NotImplemented,
            descriptionMultiLikeAnd=NotImplemented,
            endTimeGreaterThanOrEqual=NotImplemented,
            endTimeLessThanOrEqual=NotImplemented,
            durationGreaterThanOrEqual=NotImplemented,
            durationLessThanOrEqual=NotImplemented):
        KalturaCodeCuePointBaseFilter.__init__(self,
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
            codeLike,
            codeMultiLikeOr,
            codeMultiLikeAnd,
            codeEqual,
            codeIn,
            descriptionLike,
            descriptionMultiLikeOr,
            descriptionMultiLikeAnd,
            endTimeGreaterThanOrEqual,
            endTimeLessThanOrEqual,
            durationGreaterThanOrEqual,
            durationLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaCodeCuePointBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaCodeCuePointFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCodeCuePointBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaCodeCuePointFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaCodeCuePointClientPlugin(KalturaClientPlugin):
    # KalturaCodeCuePointClientPlugin
    instance = None

    # @return KalturaCodeCuePointClientPlugin
    @staticmethod
    def get():
        if KalturaCodeCuePointClientPlugin.instance == None:
            KalturaCodeCuePointClientPlugin.instance = KalturaCodeCuePointClientPlugin()
        return KalturaCodeCuePointClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaCodeCuePointOrderBy': KalturaCodeCuePointOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaCodeCuePoint': KalturaCodeCuePoint,
            'KalturaCodeCuePointBaseFilter': KalturaCodeCuePointBaseFilter,
            'KalturaCodeCuePointFilter': KalturaCodeCuePointFilter,
        }

    # @return string
    def getName(self):
        return 'codeCuePoint'

