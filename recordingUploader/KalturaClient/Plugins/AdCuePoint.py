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
class KalturaAdCuePointOrderBy(object):
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

# @package Kaltura
# @subpackage Client
class KalturaAdProtocolType(object):
    CUSTOM = "0"
    VAST = "1"
    VAST_2_0 = "2"
    VPAID = "3"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaAdType(object):
    VIDEO = "1"
    OVERLAY = "2"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaAdCuePoint(KalturaCuePoint):
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
            protocolType=NotImplemented,
            sourceUrl=NotImplemented,
            adType=NotImplemented,
            title=NotImplemented,
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

        # @var KalturaAdProtocolType
        # @insertonly
        self.protocolType = protocolType

        # @var string
        self.sourceUrl = sourceUrl

        # @var KalturaAdType
        self.adType = adType

        # @var string
        self.title = title

        # @var int
        self.endTime = endTime

        # Duration in milliseconds
        # @var int
        self.duration = duration


    PROPERTY_LOADERS = {
        'protocolType': (KalturaEnumsFactory.createString, "KalturaAdProtocolType"), 
        'sourceUrl': getXmlNodeText, 
        'adType': (KalturaEnumsFactory.createString, "KalturaAdType"), 
        'title': getXmlNodeText, 
        'endTime': getXmlNodeInt, 
        'duration': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaCuePoint.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAdCuePoint.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCuePoint.toParams(self)
        kparams.put("objectType", "KalturaAdCuePoint")
        kparams.addStringEnumIfDefined("protocolType", self.protocolType)
        kparams.addStringIfDefined("sourceUrl", self.sourceUrl)
        kparams.addStringEnumIfDefined("adType", self.adType)
        kparams.addStringIfDefined("title", self.title)
        kparams.addIntIfDefined("endTime", self.endTime)
        kparams.addIntIfDefined("duration", self.duration)
        return kparams

    def getProtocolType(self):
        return self.protocolType

    def setProtocolType(self, newProtocolType):
        self.protocolType = newProtocolType

    def getSourceUrl(self):
        return self.sourceUrl

    def setSourceUrl(self, newSourceUrl):
        self.sourceUrl = newSourceUrl

    def getAdType(self):
        return self.adType

    def setAdType(self, newAdType):
        self.adType = newAdType

    def getTitle(self):
        return self.title

    def setTitle(self, newTitle):
        self.title = newTitle

    def getEndTime(self):
        return self.endTime

    def setEndTime(self, newEndTime):
        self.endTime = newEndTime

    def getDuration(self):
        return self.duration

    def setDuration(self, newDuration):
        self.duration = newDuration


# @package Kaltura
# @subpackage Client
class KalturaAdCuePointBaseFilter(KalturaCuePointFilter):
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
            protocolTypeEqual=NotImplemented,
            protocolTypeIn=NotImplemented,
            titleLike=NotImplemented,
            titleMultiLikeOr=NotImplemented,
            titleMultiLikeAnd=NotImplemented,
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

        # @var KalturaAdProtocolType
        self.protocolTypeEqual = protocolTypeEqual

        # @var string
        self.protocolTypeIn = protocolTypeIn

        # @var string
        self.titleLike = titleLike

        # @var string
        self.titleMultiLikeOr = titleMultiLikeOr

        # @var string
        self.titleMultiLikeAnd = titleMultiLikeAnd

        # @var int
        self.endTimeGreaterThanOrEqual = endTimeGreaterThanOrEqual

        # @var int
        self.endTimeLessThanOrEqual = endTimeLessThanOrEqual

        # @var int
        self.durationGreaterThanOrEqual = durationGreaterThanOrEqual

        # @var int
        self.durationLessThanOrEqual = durationLessThanOrEqual


    PROPERTY_LOADERS = {
        'protocolTypeEqual': (KalturaEnumsFactory.createString, "KalturaAdProtocolType"), 
        'protocolTypeIn': getXmlNodeText, 
        'titleLike': getXmlNodeText, 
        'titleMultiLikeOr': getXmlNodeText, 
        'titleMultiLikeAnd': getXmlNodeText, 
        'endTimeGreaterThanOrEqual': getXmlNodeInt, 
        'endTimeLessThanOrEqual': getXmlNodeInt, 
        'durationGreaterThanOrEqual': getXmlNodeInt, 
        'durationLessThanOrEqual': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaCuePointFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAdCuePointBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCuePointFilter.toParams(self)
        kparams.put("objectType", "KalturaAdCuePointBaseFilter")
        kparams.addStringEnumIfDefined("protocolTypeEqual", self.protocolTypeEqual)
        kparams.addStringIfDefined("protocolTypeIn", self.protocolTypeIn)
        kparams.addStringIfDefined("titleLike", self.titleLike)
        kparams.addStringIfDefined("titleMultiLikeOr", self.titleMultiLikeOr)
        kparams.addStringIfDefined("titleMultiLikeAnd", self.titleMultiLikeAnd)
        kparams.addIntIfDefined("endTimeGreaterThanOrEqual", self.endTimeGreaterThanOrEqual)
        kparams.addIntIfDefined("endTimeLessThanOrEqual", self.endTimeLessThanOrEqual)
        kparams.addIntIfDefined("durationGreaterThanOrEqual", self.durationGreaterThanOrEqual)
        kparams.addIntIfDefined("durationLessThanOrEqual", self.durationLessThanOrEqual)
        return kparams

    def getProtocolTypeEqual(self):
        return self.protocolTypeEqual

    def setProtocolTypeEqual(self, newProtocolTypeEqual):
        self.protocolTypeEqual = newProtocolTypeEqual

    def getProtocolTypeIn(self):
        return self.protocolTypeIn

    def setProtocolTypeIn(self, newProtocolTypeIn):
        self.protocolTypeIn = newProtocolTypeIn

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
class KalturaAdCuePointFilter(KalturaAdCuePointBaseFilter):
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
            protocolTypeEqual=NotImplemented,
            protocolTypeIn=NotImplemented,
            titleLike=NotImplemented,
            titleMultiLikeOr=NotImplemented,
            titleMultiLikeAnd=NotImplemented,
            endTimeGreaterThanOrEqual=NotImplemented,
            endTimeLessThanOrEqual=NotImplemented,
            durationGreaterThanOrEqual=NotImplemented,
            durationLessThanOrEqual=NotImplemented):
        KalturaAdCuePointBaseFilter.__init__(self,
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
            protocolTypeEqual,
            protocolTypeIn,
            titleLike,
            titleMultiLikeOr,
            titleMultiLikeAnd,
            endTimeGreaterThanOrEqual,
            endTimeLessThanOrEqual,
            durationGreaterThanOrEqual,
            durationLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaAdCuePointBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAdCuePointFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaAdCuePointBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaAdCuePointFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaAdCuePointClientPlugin(KalturaClientPlugin):
    # KalturaAdCuePointClientPlugin
    instance = None

    # @return KalturaAdCuePointClientPlugin
    @staticmethod
    def get():
        if KalturaAdCuePointClientPlugin.instance == None:
            KalturaAdCuePointClientPlugin.instance = KalturaAdCuePointClientPlugin()
        return KalturaAdCuePointClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaAdCuePointOrderBy': KalturaAdCuePointOrderBy,
            'KalturaAdProtocolType': KalturaAdProtocolType,
            'KalturaAdType': KalturaAdType,
        }

    def getTypes(self):
        return {
            'KalturaAdCuePoint': KalturaAdCuePoint,
            'KalturaAdCuePointBaseFilter': KalturaAdCuePointBaseFilter,
            'KalturaAdCuePointFilter': KalturaAdCuePointFilter,
        }

    # @return string
    def getName(self):
        return 'adCuePoint'

