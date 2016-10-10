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
class KalturaScheduleEventClassificationType(object):
    PUBLIC_EVENT = 1
    PRIVATE_EVENT = 2
    CONFIDENTIAL_EVENT = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaScheduleEventRecurrenceType(object):
    NONE = 0
    RECURRING = 1
    RECURRENCE = 2

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaScheduleEventStatus(object):
    CANCELLED = 1
    ACTIVE = 2
    DELETED = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaScheduleEventType(object):
    RECORD = 1
    LIVE_STREAM = 2

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaScheduleResourceStatus(object):
    DISABLED = 1
    ACTIVE = 2
    DELETED = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaCameraScheduleResourceOrderBy(object):
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
class KalturaEntryScheduleEventOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    END_DATE_ASC = "+endDate"
    PRIORITY_ASC = "+priority"
    START_DATE_ASC = "+startDate"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    END_DATE_DESC = "-endDate"
    PRIORITY_DESC = "-priority"
    START_DATE_DESC = "-startDate"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaLiveEntryScheduleResourceOrderBy(object):
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
class KalturaLiveStreamScheduleEventOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    END_DATE_ASC = "+endDate"
    PRIORITY_ASC = "+priority"
    START_DATE_ASC = "+startDate"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    END_DATE_DESC = "-endDate"
    PRIORITY_DESC = "-priority"
    START_DATE_DESC = "-startDate"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaLocationScheduleResourceOrderBy(object):
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
class KalturaRecordScheduleEventOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    END_DATE_ASC = "+endDate"
    PRIORITY_ASC = "+priority"
    START_DATE_ASC = "+startDate"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    END_DATE_DESC = "-endDate"
    PRIORITY_DESC = "-priority"
    START_DATE_DESC = "-startDate"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaScheduleEventOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    END_DATE_ASC = "+endDate"
    PRIORITY_ASC = "+priority"
    START_DATE_ASC = "+startDate"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    END_DATE_DESC = "-endDate"
    PRIORITY_DESC = "-priority"
    START_DATE_DESC = "-startDate"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaScheduleEventRecurrenceDay(object):
    FRIDAY = "FR"
    MONDAY = "MO"
    SATURDAY = "SA"
    SUNDAY = "SU"
    THURSDAY = "TH"
    TUESDAY = "TU"
    WEDNESDAY = "WE"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaScheduleEventRecurrenceFrequency(object):
    DAILY = "days"
    HOURLY = "hours"
    MINUTELY = "minutes"
    MONTHLY = "months"
    SECONDLY = "seconds"
    WEEKLY = "weeks"
    YEARLY = "years"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaScheduleEventResourceOrderBy(object):
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
class KalturaScheduleResourceOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaScheduleEventRecurrence(KalturaObjectBase):
    def __init__(self,
            name=NotImplemented,
            frequency=NotImplemented,
            until=NotImplemented,
            count=NotImplemented,
            interval=NotImplemented,
            bySecond=NotImplemented,
            byMinute=NotImplemented,
            byHour=NotImplemented,
            byDay=NotImplemented,
            byMonthDay=NotImplemented,
            byYearDay=NotImplemented,
            byWeekNumber=NotImplemented,
            byMonth=NotImplemented,
            byOffset=NotImplemented,
            weekStartDay=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var string
        self.name = name

        # @var KalturaScheduleEventRecurrenceFrequency
        self.frequency = frequency

        # @var int
        self.until = until

        # @var int
        self.count = count

        # @var int
        self.interval = interval

        # Comma separated numbers between 0 to 59
        # @var string
        self.bySecond = bySecond

        # Comma separated numbers between 0 to 59
        # @var string
        self.byMinute = byMinute

        # Comma separated numbers between 0 to 23
        # @var string
        self.byHour = byHour

        # Comma separated of KalturaScheduleEventRecurrenceDay
        # 	 Each byDay value can also be preceded by a positive (+n) or negative (-n) integer.
        # 	 If present, this indicates the nth occurrence of the specific day within the MONTHLY or YEARLY RRULE.
        # 	 For example, within a MONTHLY rule, +1MO (or simply 1MO) represents the first Monday within the month, whereas -1MO represents the last Monday of the month.
        # 	 If an integer modifier is not present, it means all days of this type within the specified frequency.
        # 	 For example, within a MONTHLY rule, MO represents all Mondays within the month.
        # @var string
        self.byDay = byDay

        # Comma separated of numbers between -31 to 31, excluding 0.
        # 	 For example, -10 represents the tenth to the last day of the month.
        # @var string
        self.byMonthDay = byMonthDay

        # Comma separated of numbers between -366 to 366, excluding 0.
        # 	 For example, -1 represents the last day of the year (December 31st) and -306 represents the 306th to the last day of the year (March 1st).
        # @var string
        self.byYearDay = byYearDay

        # Comma separated of numbers between -53 to 53, excluding 0.
        # 	 This corresponds to weeks according to week numbering.
        # 	 A week is defined as a seven day period, starting on the day of the week defined to be the week start.
        # 	 Week number one of the calendar year is the first week which contains at least four (4) days in that calendar year.
        # 	 This rule part is only valid for YEARLY frequency.
        # 	 For example, 3 represents the third week of the year.
        # @var string
        self.byWeekNumber = byWeekNumber

        # Comma separated numbers between 1 to 12
        # @var string
        self.byMonth = byMonth

        # Comma separated of numbers between -366 to 366, excluding 0.
        # 	 Corresponds to the nth occurrence within the set of events specified by the rule.
        # 	 It must only be used in conjunction with another byrule part.
        # 	 For example "the last work day of the month" could be represented as: frequency=MONTHLY;byDay=MO,TU,WE,TH,FR;byOffset=-1
        # 	 Each byOffset value can include a positive (+n) or negative (-n) integer.
        # 	 If present, this indicates the nth occurrence of the specific occurrence within the set of events specified by the rule.
        # @var string
        self.byOffset = byOffset

        # @var KalturaScheduleEventRecurrenceDay
        self.weekStartDay = weekStartDay


    PROPERTY_LOADERS = {
        'name': getXmlNodeText, 
        'frequency': (KalturaEnumsFactory.createString, "KalturaScheduleEventRecurrenceFrequency"), 
        'until': getXmlNodeInt, 
        'count': getXmlNodeInt, 
        'interval': getXmlNodeInt, 
        'bySecond': getXmlNodeText, 
        'byMinute': getXmlNodeText, 
        'byHour': getXmlNodeText, 
        'byDay': getXmlNodeText, 
        'byMonthDay': getXmlNodeText, 
        'byYearDay': getXmlNodeText, 
        'byWeekNumber': getXmlNodeText, 
        'byMonth': getXmlNodeText, 
        'byOffset': getXmlNodeText, 
        'weekStartDay': (KalturaEnumsFactory.createString, "KalturaScheduleEventRecurrenceDay"), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduleEventRecurrence.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaScheduleEventRecurrence")
        kparams.addStringIfDefined("name", self.name)
        kparams.addStringEnumIfDefined("frequency", self.frequency)
        kparams.addIntIfDefined("until", self.until)
        kparams.addIntIfDefined("count", self.count)
        kparams.addIntIfDefined("interval", self.interval)
        kparams.addStringIfDefined("bySecond", self.bySecond)
        kparams.addStringIfDefined("byMinute", self.byMinute)
        kparams.addStringIfDefined("byHour", self.byHour)
        kparams.addStringIfDefined("byDay", self.byDay)
        kparams.addStringIfDefined("byMonthDay", self.byMonthDay)
        kparams.addStringIfDefined("byYearDay", self.byYearDay)
        kparams.addStringIfDefined("byWeekNumber", self.byWeekNumber)
        kparams.addStringIfDefined("byMonth", self.byMonth)
        kparams.addStringIfDefined("byOffset", self.byOffset)
        kparams.addStringEnumIfDefined("weekStartDay", self.weekStartDay)
        return kparams

    def getName(self):
        return self.name

    def setName(self, newName):
        self.name = newName

    def getFrequency(self):
        return self.frequency

    def setFrequency(self, newFrequency):
        self.frequency = newFrequency

    def getUntil(self):
        return self.until

    def setUntil(self, newUntil):
        self.until = newUntil

    def getCount(self):
        return self.count

    def setCount(self, newCount):
        self.count = newCount

    def getInterval(self):
        return self.interval

    def setInterval(self, newInterval):
        self.interval = newInterval

    def getBySecond(self):
        return self.bySecond

    def setBySecond(self, newBySecond):
        self.bySecond = newBySecond

    def getByMinute(self):
        return self.byMinute

    def setByMinute(self, newByMinute):
        self.byMinute = newByMinute

    def getByHour(self):
        return self.byHour

    def setByHour(self, newByHour):
        self.byHour = newByHour

    def getByDay(self):
        return self.byDay

    def setByDay(self, newByDay):
        self.byDay = newByDay

    def getByMonthDay(self):
        return self.byMonthDay

    def setByMonthDay(self, newByMonthDay):
        self.byMonthDay = newByMonthDay

    def getByYearDay(self):
        return self.byYearDay

    def setByYearDay(self, newByYearDay):
        self.byYearDay = newByYearDay

    def getByWeekNumber(self):
        return self.byWeekNumber

    def setByWeekNumber(self, newByWeekNumber):
        self.byWeekNumber = newByWeekNumber

    def getByMonth(self):
        return self.byMonth

    def setByMonth(self, newByMonth):
        self.byMonth = newByMonth

    def getByOffset(self):
        return self.byOffset

    def setByOffset(self, newByOffset):
        self.byOffset = newByOffset

    def getWeekStartDay(self):
        return self.weekStartDay

    def setWeekStartDay(self, newWeekStartDay):
        self.weekStartDay = newWeekStartDay


# @package Kaltura
# @subpackage Client
class KalturaScheduleEvent(KalturaObjectBase):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            parentId=NotImplemented,
            summary=NotImplemented,
            description=NotImplemented,
            status=NotImplemented,
            startDate=NotImplemented,
            endDate=NotImplemented,
            referenceId=NotImplemented,
            classificationType=NotImplemented,
            geoLatitude=NotImplemented,
            geoLongitude=NotImplemented,
            location=NotImplemented,
            organizer=NotImplemented,
            ownerId=NotImplemented,
            priority=NotImplemented,
            sequence=NotImplemented,
            recurrenceType=NotImplemented,
            duration=NotImplemented,
            contact=NotImplemented,
            comment=NotImplemented,
            tags=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            recurrence=NotImplemented):
        KalturaObjectBase.__init__(self)

        # Auto-generated unique identifier
        # @var int
        # @readonly
        self.id = id

        # @var int
        # @readonly
        self.partnerId = partnerId

        # @var int
        # @readonly
        self.parentId = parentId

        # Defines a short summary or subject for the event
        # @var string
        self.summary = summary

        # @var string
        self.description = description

        # @var KalturaScheduleEventStatus
        # @readonly
        self.status = status

        # @var int
        self.startDate = startDate

        # @var int
        self.endDate = endDate

        # @var string
        self.referenceId = referenceId

        # @var KalturaScheduleEventClassificationType
        self.classificationType = classificationType

        # Specifies the global position for the activity
        # @var float
        self.geoLatitude = geoLatitude

        # Specifies the global position for the activity
        # @var float
        self.geoLongitude = geoLongitude

        # Defines the intended venue for the activity
        # @var string
        self.location = location

        # @var string
        self.organizer = organizer

        # @var string
        self.ownerId = ownerId

        # The value for the priority field.
        # @var int
        self.priority = priority

        # Defines the revision sequence number.
        # @var int
        self.sequence = sequence

        # @var KalturaScheduleEventRecurrenceType
        # @insertonly
        self.recurrenceType = recurrenceType

        # Duration in seconds
        # @var int
        self.duration = duration

        # Used to represent contact information or alternately a reference to contact information.
        # @var string
        self.contact = contact

        # Specifies non-processing information intended to provide a comment to the calendar user.
        # @var string
        self.comment = comment

        # @var string
        self.tags = tags

        # Creation date as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.createdAt = createdAt

        # Last update as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.updatedAt = updatedAt

        # @var KalturaScheduleEventRecurrence
        self.recurrence = recurrence


    PROPERTY_LOADERS = {
        'id': getXmlNodeInt, 
        'partnerId': getXmlNodeInt, 
        'parentId': getXmlNodeInt, 
        'summary': getXmlNodeText, 
        'description': getXmlNodeText, 
        'status': (KalturaEnumsFactory.createInt, "KalturaScheduleEventStatus"), 
        'startDate': getXmlNodeInt, 
        'endDate': getXmlNodeInt, 
        'referenceId': getXmlNodeText, 
        'classificationType': (KalturaEnumsFactory.createInt, "KalturaScheduleEventClassificationType"), 
        'geoLatitude': getXmlNodeFloat, 
        'geoLongitude': getXmlNodeFloat, 
        'location': getXmlNodeText, 
        'organizer': getXmlNodeText, 
        'ownerId': getXmlNodeText, 
        'priority': getXmlNodeInt, 
        'sequence': getXmlNodeInt, 
        'recurrenceType': (KalturaEnumsFactory.createInt, "KalturaScheduleEventRecurrenceType"), 
        'duration': getXmlNodeInt, 
        'contact': getXmlNodeText, 
        'comment': getXmlNodeText, 
        'tags': getXmlNodeText, 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
        'recurrence': (KalturaObjectFactory.create, KalturaScheduleEventRecurrence), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduleEvent.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaScheduleEvent")
        kparams.addStringIfDefined("summary", self.summary)
        kparams.addStringIfDefined("description", self.description)
        kparams.addIntIfDefined("startDate", self.startDate)
        kparams.addIntIfDefined("endDate", self.endDate)
        kparams.addStringIfDefined("referenceId", self.referenceId)
        kparams.addIntEnumIfDefined("classificationType", self.classificationType)
        kparams.addFloatIfDefined("geoLatitude", self.geoLatitude)
        kparams.addFloatIfDefined("geoLongitude", self.geoLongitude)
        kparams.addStringIfDefined("location", self.location)
        kparams.addStringIfDefined("organizer", self.organizer)
        kparams.addStringIfDefined("ownerId", self.ownerId)
        kparams.addIntIfDefined("priority", self.priority)
        kparams.addIntIfDefined("sequence", self.sequence)
        kparams.addIntEnumIfDefined("recurrenceType", self.recurrenceType)
        kparams.addIntIfDefined("duration", self.duration)
        kparams.addStringIfDefined("contact", self.contact)
        kparams.addStringIfDefined("comment", self.comment)
        kparams.addStringIfDefined("tags", self.tags)
        kparams.addObjectIfDefined("recurrence", self.recurrence)
        return kparams

    def getId(self):
        return self.id

    def getPartnerId(self):
        return self.partnerId

    def getParentId(self):
        return self.parentId

    def getSummary(self):
        return self.summary

    def setSummary(self, newSummary):
        self.summary = newSummary

    def getDescription(self):
        return self.description

    def setDescription(self, newDescription):
        self.description = newDescription

    def getStatus(self):
        return self.status

    def getStartDate(self):
        return self.startDate

    def setStartDate(self, newStartDate):
        self.startDate = newStartDate

    def getEndDate(self):
        return self.endDate

    def setEndDate(self, newEndDate):
        self.endDate = newEndDate

    def getReferenceId(self):
        return self.referenceId

    def setReferenceId(self, newReferenceId):
        self.referenceId = newReferenceId

    def getClassificationType(self):
        return self.classificationType

    def setClassificationType(self, newClassificationType):
        self.classificationType = newClassificationType

    def getGeoLatitude(self):
        return self.geoLatitude

    def setGeoLatitude(self, newGeoLatitude):
        self.geoLatitude = newGeoLatitude

    def getGeoLongitude(self):
        return self.geoLongitude

    def setGeoLongitude(self, newGeoLongitude):
        self.geoLongitude = newGeoLongitude

    def getLocation(self):
        return self.location

    def setLocation(self, newLocation):
        self.location = newLocation

    def getOrganizer(self):
        return self.organizer

    def setOrganizer(self, newOrganizer):
        self.organizer = newOrganizer

    def getOwnerId(self):
        return self.ownerId

    def setOwnerId(self, newOwnerId):
        self.ownerId = newOwnerId

    def getPriority(self):
        return self.priority

    def setPriority(self, newPriority):
        self.priority = newPriority

    def getSequence(self):
        return self.sequence

    def setSequence(self, newSequence):
        self.sequence = newSequence

    def getRecurrenceType(self):
        return self.recurrenceType

    def setRecurrenceType(self, newRecurrenceType):
        self.recurrenceType = newRecurrenceType

    def getDuration(self):
        return self.duration

    def setDuration(self, newDuration):
        self.duration = newDuration

    def getContact(self):
        return self.contact

    def setContact(self, newContact):
        self.contact = newContact

    def getComment(self):
        return self.comment

    def setComment(self, newComment):
        self.comment = newComment

    def getTags(self):
        return self.tags

    def setTags(self, newTags):
        self.tags = newTags

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt

    def getRecurrence(self):
        return self.recurrence

    def setRecurrence(self, newRecurrence):
        self.recurrence = newRecurrence


# @package Kaltura
# @subpackage Client
class KalturaScheduleEventResource(KalturaObjectBase):
    def __init__(self,
            eventId=NotImplemented,
            resourceId=NotImplemented,
            partnerId=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var int
        # @insertonly
        self.eventId = eventId

        # @var int
        # @insertonly
        self.resourceId = resourceId

        # @var int
        # @readonly
        self.partnerId = partnerId

        # Creation date as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.createdAt = createdAt

        # Last update as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.updatedAt = updatedAt


    PROPERTY_LOADERS = {
        'eventId': getXmlNodeInt, 
        'resourceId': getXmlNodeInt, 
        'partnerId': getXmlNodeInt, 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduleEventResource.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaScheduleEventResource")
        kparams.addIntIfDefined("eventId", self.eventId)
        kparams.addIntIfDefined("resourceId", self.resourceId)
        return kparams

    def getEventId(self):
        return self.eventId

    def setEventId(self, newEventId):
        self.eventId = newEventId

    def getResourceId(self):
        return self.resourceId

    def setResourceId(self, newResourceId):
        self.resourceId = newResourceId

    def getPartnerId(self):
        return self.partnerId

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt


# @package Kaltura
# @subpackage Client
class KalturaScheduleResource(KalturaObjectBase):
    def __init__(self,
            id=NotImplemented,
            parentId=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            status=NotImplemented,
            tags=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented):
        KalturaObjectBase.__init__(self)

        # Auto-generated unique identifier
        # @var int
        # @readonly
        self.id = id

        # @var int
        self.parentId = parentId

        # @var int
        # @readonly
        self.partnerId = partnerId

        # Defines a short name
        # @var string
        self.name = name

        # Defines a unique system-name
        # @var string
        self.systemName = systemName

        # @var string
        self.description = description

        # @var KalturaScheduleResourceStatus
        # @readonly
        self.status = status

        # @var string
        self.tags = tags

        # Creation date as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.createdAt = createdAt

        # Last update as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.updatedAt = updatedAt


    PROPERTY_LOADERS = {
        'id': getXmlNodeInt, 
        'parentId': getXmlNodeInt, 
        'partnerId': getXmlNodeInt, 
        'name': getXmlNodeText, 
        'systemName': getXmlNodeText, 
        'description': getXmlNodeText, 
        'status': (KalturaEnumsFactory.createInt, "KalturaScheduleResourceStatus"), 
        'tags': getXmlNodeText, 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduleResource.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaScheduleResource")
        kparams.addIntIfDefined("parentId", self.parentId)
        kparams.addStringIfDefined("name", self.name)
        kparams.addStringIfDefined("systemName", self.systemName)
        kparams.addStringIfDefined("description", self.description)
        kparams.addStringIfDefined("tags", self.tags)
        return kparams

    def getId(self):
        return self.id

    def getParentId(self):
        return self.parentId

    def setParentId(self, newParentId):
        self.parentId = newParentId

    def getPartnerId(self):
        return self.partnerId

    def getName(self):
        return self.name

    def setName(self, newName):
        self.name = newName

    def getSystemName(self):
        return self.systemName

    def setSystemName(self, newSystemName):
        self.systemName = newSystemName

    def getDescription(self):
        return self.description

    def setDescription(self, newDescription):
        self.description = newDescription

    def getStatus(self):
        return self.status

    def getTags(self):
        return self.tags

    def setTags(self, newTags):
        self.tags = newTags

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt


# @package Kaltura
# @subpackage Client
class KalturaCameraScheduleResource(KalturaScheduleResource):
    def __init__(self,
            id=NotImplemented,
            parentId=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            status=NotImplemented,
            tags=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            streamUrl=NotImplemented):
        KalturaScheduleResource.__init__(self,
            id,
            parentId,
            partnerId,
            name,
            systemName,
            description,
            status,
            tags,
            createdAt,
            updatedAt)

        # URL of the stream
        # @var string
        self.streamUrl = streamUrl


    PROPERTY_LOADERS = {
        'streamUrl': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaScheduleResource.fromXml(self, node)
        self.fromXmlImpl(node, KalturaCameraScheduleResource.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaScheduleResource.toParams(self)
        kparams.put("objectType", "KalturaCameraScheduleResource")
        kparams.addStringIfDefined("streamUrl", self.streamUrl)
        return kparams

    def getStreamUrl(self):
        return self.streamUrl

    def setStreamUrl(self, newStreamUrl):
        self.streamUrl = newStreamUrl


# @package Kaltura
# @subpackage Client
class KalturaEntryScheduleEvent(KalturaScheduleEvent):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            parentId=NotImplemented,
            summary=NotImplemented,
            description=NotImplemented,
            status=NotImplemented,
            startDate=NotImplemented,
            endDate=NotImplemented,
            referenceId=NotImplemented,
            classificationType=NotImplemented,
            geoLatitude=NotImplemented,
            geoLongitude=NotImplemented,
            location=NotImplemented,
            organizer=NotImplemented,
            ownerId=NotImplemented,
            priority=NotImplemented,
            sequence=NotImplemented,
            recurrenceType=NotImplemented,
            duration=NotImplemented,
            contact=NotImplemented,
            comment=NotImplemented,
            tags=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            recurrence=NotImplemented,
            templateEntryId=NotImplemented,
            entryIds=NotImplemented,
            categoryIds=NotImplemented):
        KalturaScheduleEvent.__init__(self,
            id,
            partnerId,
            parentId,
            summary,
            description,
            status,
            startDate,
            endDate,
            referenceId,
            classificationType,
            geoLatitude,
            geoLongitude,
            location,
            organizer,
            ownerId,
            priority,
            sequence,
            recurrenceType,
            duration,
            contact,
            comment,
            tags,
            createdAt,
            updatedAt,
            recurrence)

        # Entry to be used as template during content ingestion
        # @var string
        self.templateEntryId = templateEntryId

        # Entries that associated with this event
        # @var string
        self.entryIds = entryIds

        # Categories that associated with this event
        # @var string
        self.categoryIds = categoryIds


    PROPERTY_LOADERS = {
        'templateEntryId': getXmlNodeText, 
        'entryIds': getXmlNodeText, 
        'categoryIds': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaScheduleEvent.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEntryScheduleEvent.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaScheduleEvent.toParams(self)
        kparams.put("objectType", "KalturaEntryScheduleEvent")
        kparams.addStringIfDefined("templateEntryId", self.templateEntryId)
        kparams.addStringIfDefined("entryIds", self.entryIds)
        kparams.addStringIfDefined("categoryIds", self.categoryIds)
        return kparams

    def getTemplateEntryId(self):
        return self.templateEntryId

    def setTemplateEntryId(self, newTemplateEntryId):
        self.templateEntryId = newTemplateEntryId

    def getEntryIds(self):
        return self.entryIds

    def setEntryIds(self, newEntryIds):
        self.entryIds = newEntryIds

    def getCategoryIds(self):
        return self.categoryIds

    def setCategoryIds(self, newCategoryIds):
        self.categoryIds = newCategoryIds


# @package Kaltura
# @subpackage Client
class KalturaLiveEntryScheduleResource(KalturaScheduleResource):
    def __init__(self,
            id=NotImplemented,
            parentId=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            status=NotImplemented,
            tags=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            entryId=NotImplemented):
        KalturaScheduleResource.__init__(self,
            id,
            parentId,
            partnerId,
            name,
            systemName,
            description,
            status,
            tags,
            createdAt,
            updatedAt)

        # @var string
        self.entryId = entryId


    PROPERTY_LOADERS = {
        'entryId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaScheduleResource.fromXml(self, node)
        self.fromXmlImpl(node, KalturaLiveEntryScheduleResource.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaScheduleResource.toParams(self)
        kparams.put("objectType", "KalturaLiveEntryScheduleResource")
        kparams.addStringIfDefined("entryId", self.entryId)
        return kparams

    def getEntryId(self):
        return self.entryId

    def setEntryId(self, newEntryId):
        self.entryId = newEntryId


# @package Kaltura
# @subpackage Client
class KalturaLocationScheduleResource(KalturaScheduleResource):
    def __init__(self,
            id=NotImplemented,
            parentId=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            status=NotImplemented,
            tags=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented):
        KalturaScheduleResource.__init__(self,
            id,
            parentId,
            partnerId,
            name,
            systemName,
            description,
            status,
            tags,
            createdAt,
            updatedAt)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaScheduleResource.fromXml(self, node)
        self.fromXmlImpl(node, KalturaLocationScheduleResource.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaScheduleResource.toParams(self)
        kparams.put("objectType", "KalturaLocationScheduleResource")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaScheduleEventListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaScheduleEvent
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaScheduleEvent), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduleEventListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaScheduleEventListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaScheduleEventResourceListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaScheduleEventResource
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaScheduleEventResource), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduleEventResourceListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaScheduleEventResourceListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaScheduleResourceListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaScheduleResource
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaScheduleResource), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduleResourceListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaScheduleResourceListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaLiveStreamScheduleEvent(KalturaEntryScheduleEvent):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            parentId=NotImplemented,
            summary=NotImplemented,
            description=NotImplemented,
            status=NotImplemented,
            startDate=NotImplemented,
            endDate=NotImplemented,
            referenceId=NotImplemented,
            classificationType=NotImplemented,
            geoLatitude=NotImplemented,
            geoLongitude=NotImplemented,
            location=NotImplemented,
            organizer=NotImplemented,
            ownerId=NotImplemented,
            priority=NotImplemented,
            sequence=NotImplemented,
            recurrenceType=NotImplemented,
            duration=NotImplemented,
            contact=NotImplemented,
            comment=NotImplemented,
            tags=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            recurrence=NotImplemented,
            templateEntryId=NotImplemented,
            entryIds=NotImplemented,
            categoryIds=NotImplemented):
        KalturaEntryScheduleEvent.__init__(self,
            id,
            partnerId,
            parentId,
            summary,
            description,
            status,
            startDate,
            endDate,
            referenceId,
            classificationType,
            geoLatitude,
            geoLongitude,
            location,
            organizer,
            ownerId,
            priority,
            sequence,
            recurrenceType,
            duration,
            contact,
            comment,
            tags,
            createdAt,
            updatedAt,
            recurrence,
            templateEntryId,
            entryIds,
            categoryIds)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaEntryScheduleEvent.fromXml(self, node)
        self.fromXmlImpl(node, KalturaLiveStreamScheduleEvent.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEntryScheduleEvent.toParams(self)
        kparams.put("objectType", "KalturaLiveStreamScheduleEvent")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaRecordScheduleEvent(KalturaEntryScheduleEvent):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            parentId=NotImplemented,
            summary=NotImplemented,
            description=NotImplemented,
            status=NotImplemented,
            startDate=NotImplemented,
            endDate=NotImplemented,
            referenceId=NotImplemented,
            classificationType=NotImplemented,
            geoLatitude=NotImplemented,
            geoLongitude=NotImplemented,
            location=NotImplemented,
            organizer=NotImplemented,
            ownerId=NotImplemented,
            priority=NotImplemented,
            sequence=NotImplemented,
            recurrenceType=NotImplemented,
            duration=NotImplemented,
            contact=NotImplemented,
            comment=NotImplemented,
            tags=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            recurrence=NotImplemented,
            templateEntryId=NotImplemented,
            entryIds=NotImplemented,
            categoryIds=NotImplemented):
        KalturaEntryScheduleEvent.__init__(self,
            id,
            partnerId,
            parentId,
            summary,
            description,
            status,
            startDate,
            endDate,
            referenceId,
            classificationType,
            geoLatitude,
            geoLongitude,
            location,
            organizer,
            ownerId,
            priority,
            sequence,
            recurrenceType,
            duration,
            contact,
            comment,
            tags,
            createdAt,
            updatedAt,
            recurrence,
            templateEntryId,
            entryIds,
            categoryIds)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaEntryScheduleEvent.fromXml(self, node)
        self.fromXmlImpl(node, KalturaRecordScheduleEvent.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEntryScheduleEvent.toParams(self)
        kparams.put("objectType", "KalturaRecordScheduleEvent")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaScheduleEventBaseFilter(KalturaRelatedFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            parentIdNotIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            startDateGreaterThanOrEqual=NotImplemented,
            startDateLessThanOrEqual=NotImplemented,
            endDateGreaterThanOrEqual=NotImplemented,
            endDateLessThanOrEqual=NotImplemented,
            referenceIdEqual=NotImplemented,
            referenceIdIn=NotImplemented,
            ownerIdEqual=NotImplemented,
            ownerIdIn=NotImplemented,
            priorityEqual=NotImplemented,
            priorityIn=NotImplemented,
            priorityGreaterThanOrEqual=NotImplemented,
            priorityLessThanOrEqual=NotImplemented,
            recurrenceTypeEqual=NotImplemented,
            recurrenceTypeIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaRelatedFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var int
        self.idEqual = idEqual

        # @var string
        self.idIn = idIn

        # @var string
        self.idNotIn = idNotIn

        # @var int
        self.parentIdEqual = parentIdEqual

        # @var string
        self.parentIdIn = parentIdIn

        # @var string
        self.parentIdNotIn = parentIdNotIn

        # @var KalturaScheduleEventStatus
        self.statusEqual = statusEqual

        # @var string
        self.statusIn = statusIn

        # @var int
        self.startDateGreaterThanOrEqual = startDateGreaterThanOrEqual

        # @var int
        self.startDateLessThanOrEqual = startDateLessThanOrEqual

        # @var int
        self.endDateGreaterThanOrEqual = endDateGreaterThanOrEqual

        # @var int
        self.endDateLessThanOrEqual = endDateLessThanOrEqual

        # @var string
        self.referenceIdEqual = referenceIdEqual

        # @var string
        self.referenceIdIn = referenceIdIn

        # @var string
        self.ownerIdEqual = ownerIdEqual

        # @var string
        self.ownerIdIn = ownerIdIn

        # @var int
        self.priorityEqual = priorityEqual

        # @var string
        self.priorityIn = priorityIn

        # @var int
        self.priorityGreaterThanOrEqual = priorityGreaterThanOrEqual

        # @var int
        self.priorityLessThanOrEqual = priorityLessThanOrEqual

        # @var KalturaScheduleEventRecurrenceType
        self.recurrenceTypeEqual = recurrenceTypeEqual

        # @var string
        self.recurrenceTypeIn = recurrenceTypeIn

        # @var string
        self.tagsLike = tagsLike

        # @var string
        self.tagsMultiLikeOr = tagsMultiLikeOr

        # @var string
        self.tagsMultiLikeAnd = tagsMultiLikeAnd

        # @var int
        self.createdAtGreaterThanOrEqual = createdAtGreaterThanOrEqual

        # @var int
        self.createdAtLessThanOrEqual = createdAtLessThanOrEqual

        # @var int
        self.updatedAtGreaterThanOrEqual = updatedAtGreaterThanOrEqual

        # @var int
        self.updatedAtLessThanOrEqual = updatedAtLessThanOrEqual


    PROPERTY_LOADERS = {
        'idEqual': getXmlNodeInt, 
        'idIn': getXmlNodeText, 
        'idNotIn': getXmlNodeText, 
        'parentIdEqual': getXmlNodeInt, 
        'parentIdIn': getXmlNodeText, 
        'parentIdNotIn': getXmlNodeText, 
        'statusEqual': (KalturaEnumsFactory.createInt, "KalturaScheduleEventStatus"), 
        'statusIn': getXmlNodeText, 
        'startDateGreaterThanOrEqual': getXmlNodeInt, 
        'startDateLessThanOrEqual': getXmlNodeInt, 
        'endDateGreaterThanOrEqual': getXmlNodeInt, 
        'endDateLessThanOrEqual': getXmlNodeInt, 
        'referenceIdEqual': getXmlNodeText, 
        'referenceIdIn': getXmlNodeText, 
        'ownerIdEqual': getXmlNodeText, 
        'ownerIdIn': getXmlNodeText, 
        'priorityEqual': getXmlNodeInt, 
        'priorityIn': getXmlNodeText, 
        'priorityGreaterThanOrEqual': getXmlNodeInt, 
        'priorityLessThanOrEqual': getXmlNodeInt, 
        'recurrenceTypeEqual': (KalturaEnumsFactory.createInt, "KalturaScheduleEventRecurrenceType"), 
        'recurrenceTypeIn': getXmlNodeText, 
        'tagsLike': getXmlNodeText, 
        'tagsMultiLikeOr': getXmlNodeText, 
        'tagsMultiLikeAnd': getXmlNodeText, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'updatedAtGreaterThanOrEqual': getXmlNodeInt, 
        'updatedAtLessThanOrEqual': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaRelatedFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduleEventBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaRelatedFilter.toParams(self)
        kparams.put("objectType", "KalturaScheduleEventBaseFilter")
        kparams.addIntIfDefined("idEqual", self.idEqual)
        kparams.addStringIfDefined("idIn", self.idIn)
        kparams.addStringIfDefined("idNotIn", self.idNotIn)
        kparams.addIntIfDefined("parentIdEqual", self.parentIdEqual)
        kparams.addStringIfDefined("parentIdIn", self.parentIdIn)
        kparams.addStringIfDefined("parentIdNotIn", self.parentIdNotIn)
        kparams.addIntEnumIfDefined("statusEqual", self.statusEqual)
        kparams.addStringIfDefined("statusIn", self.statusIn)
        kparams.addIntIfDefined("startDateGreaterThanOrEqual", self.startDateGreaterThanOrEqual)
        kparams.addIntIfDefined("startDateLessThanOrEqual", self.startDateLessThanOrEqual)
        kparams.addIntIfDefined("endDateGreaterThanOrEqual", self.endDateGreaterThanOrEqual)
        kparams.addIntIfDefined("endDateLessThanOrEqual", self.endDateLessThanOrEqual)
        kparams.addStringIfDefined("referenceIdEqual", self.referenceIdEqual)
        kparams.addStringIfDefined("referenceIdIn", self.referenceIdIn)
        kparams.addStringIfDefined("ownerIdEqual", self.ownerIdEqual)
        kparams.addStringIfDefined("ownerIdIn", self.ownerIdIn)
        kparams.addIntIfDefined("priorityEqual", self.priorityEqual)
        kparams.addStringIfDefined("priorityIn", self.priorityIn)
        kparams.addIntIfDefined("priorityGreaterThanOrEqual", self.priorityGreaterThanOrEqual)
        kparams.addIntIfDefined("priorityLessThanOrEqual", self.priorityLessThanOrEqual)
        kparams.addIntEnumIfDefined("recurrenceTypeEqual", self.recurrenceTypeEqual)
        kparams.addStringIfDefined("recurrenceTypeIn", self.recurrenceTypeIn)
        kparams.addStringIfDefined("tagsLike", self.tagsLike)
        kparams.addStringIfDefined("tagsMultiLikeOr", self.tagsMultiLikeOr)
        kparams.addStringIfDefined("tagsMultiLikeAnd", self.tagsMultiLikeAnd)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        kparams.addIntIfDefined("updatedAtGreaterThanOrEqual", self.updatedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("updatedAtLessThanOrEqual", self.updatedAtLessThanOrEqual)
        return kparams

    def getIdEqual(self):
        return self.idEqual

    def setIdEqual(self, newIdEqual):
        self.idEqual = newIdEqual

    def getIdIn(self):
        return self.idIn

    def setIdIn(self, newIdIn):
        self.idIn = newIdIn

    def getIdNotIn(self):
        return self.idNotIn

    def setIdNotIn(self, newIdNotIn):
        self.idNotIn = newIdNotIn

    def getParentIdEqual(self):
        return self.parentIdEqual

    def setParentIdEqual(self, newParentIdEqual):
        self.parentIdEqual = newParentIdEqual

    def getParentIdIn(self):
        return self.parentIdIn

    def setParentIdIn(self, newParentIdIn):
        self.parentIdIn = newParentIdIn

    def getParentIdNotIn(self):
        return self.parentIdNotIn

    def setParentIdNotIn(self, newParentIdNotIn):
        self.parentIdNotIn = newParentIdNotIn

    def getStatusEqual(self):
        return self.statusEqual

    def setStatusEqual(self, newStatusEqual):
        self.statusEqual = newStatusEqual

    def getStatusIn(self):
        return self.statusIn

    def setStatusIn(self, newStatusIn):
        self.statusIn = newStatusIn

    def getStartDateGreaterThanOrEqual(self):
        return self.startDateGreaterThanOrEqual

    def setStartDateGreaterThanOrEqual(self, newStartDateGreaterThanOrEqual):
        self.startDateGreaterThanOrEqual = newStartDateGreaterThanOrEqual

    def getStartDateLessThanOrEqual(self):
        return self.startDateLessThanOrEqual

    def setStartDateLessThanOrEqual(self, newStartDateLessThanOrEqual):
        self.startDateLessThanOrEqual = newStartDateLessThanOrEqual

    def getEndDateGreaterThanOrEqual(self):
        return self.endDateGreaterThanOrEqual

    def setEndDateGreaterThanOrEqual(self, newEndDateGreaterThanOrEqual):
        self.endDateGreaterThanOrEqual = newEndDateGreaterThanOrEqual

    def getEndDateLessThanOrEqual(self):
        return self.endDateLessThanOrEqual

    def setEndDateLessThanOrEqual(self, newEndDateLessThanOrEqual):
        self.endDateLessThanOrEqual = newEndDateLessThanOrEqual

    def getReferenceIdEqual(self):
        return self.referenceIdEqual

    def setReferenceIdEqual(self, newReferenceIdEqual):
        self.referenceIdEqual = newReferenceIdEqual

    def getReferenceIdIn(self):
        return self.referenceIdIn

    def setReferenceIdIn(self, newReferenceIdIn):
        self.referenceIdIn = newReferenceIdIn

    def getOwnerIdEqual(self):
        return self.ownerIdEqual

    def setOwnerIdEqual(self, newOwnerIdEqual):
        self.ownerIdEqual = newOwnerIdEqual

    def getOwnerIdIn(self):
        return self.ownerIdIn

    def setOwnerIdIn(self, newOwnerIdIn):
        self.ownerIdIn = newOwnerIdIn

    def getPriorityEqual(self):
        return self.priorityEqual

    def setPriorityEqual(self, newPriorityEqual):
        self.priorityEqual = newPriorityEqual

    def getPriorityIn(self):
        return self.priorityIn

    def setPriorityIn(self, newPriorityIn):
        self.priorityIn = newPriorityIn

    def getPriorityGreaterThanOrEqual(self):
        return self.priorityGreaterThanOrEqual

    def setPriorityGreaterThanOrEqual(self, newPriorityGreaterThanOrEqual):
        self.priorityGreaterThanOrEqual = newPriorityGreaterThanOrEqual

    def getPriorityLessThanOrEqual(self):
        return self.priorityLessThanOrEqual

    def setPriorityLessThanOrEqual(self, newPriorityLessThanOrEqual):
        self.priorityLessThanOrEqual = newPriorityLessThanOrEqual

    def getRecurrenceTypeEqual(self):
        return self.recurrenceTypeEqual

    def setRecurrenceTypeEqual(self, newRecurrenceTypeEqual):
        self.recurrenceTypeEqual = newRecurrenceTypeEqual

    def getRecurrenceTypeIn(self):
        return self.recurrenceTypeIn

    def setRecurrenceTypeIn(self, newRecurrenceTypeIn):
        self.recurrenceTypeIn = newRecurrenceTypeIn

    def getTagsLike(self):
        return self.tagsLike

    def setTagsLike(self, newTagsLike):
        self.tagsLike = newTagsLike

    def getTagsMultiLikeOr(self):
        return self.tagsMultiLikeOr

    def setTagsMultiLikeOr(self, newTagsMultiLikeOr):
        self.tagsMultiLikeOr = newTagsMultiLikeOr

    def getTagsMultiLikeAnd(self):
        return self.tagsMultiLikeAnd

    def setTagsMultiLikeAnd(self, newTagsMultiLikeAnd):
        self.tagsMultiLikeAnd = newTagsMultiLikeAnd

    def getCreatedAtGreaterThanOrEqual(self):
        return self.createdAtGreaterThanOrEqual

    def setCreatedAtGreaterThanOrEqual(self, newCreatedAtGreaterThanOrEqual):
        self.createdAtGreaterThanOrEqual = newCreatedAtGreaterThanOrEqual

    def getCreatedAtLessThanOrEqual(self):
        return self.createdAtLessThanOrEqual

    def setCreatedAtLessThanOrEqual(self, newCreatedAtLessThanOrEqual):
        self.createdAtLessThanOrEqual = newCreatedAtLessThanOrEqual

    def getUpdatedAtGreaterThanOrEqual(self):
        return self.updatedAtGreaterThanOrEqual

    def setUpdatedAtGreaterThanOrEqual(self, newUpdatedAtGreaterThanOrEqual):
        self.updatedAtGreaterThanOrEqual = newUpdatedAtGreaterThanOrEqual

    def getUpdatedAtLessThanOrEqual(self):
        return self.updatedAtLessThanOrEqual

    def setUpdatedAtLessThanOrEqual(self, newUpdatedAtLessThanOrEqual):
        self.updatedAtLessThanOrEqual = newUpdatedAtLessThanOrEqual


# @package Kaltura
# @subpackage Client
class KalturaScheduleEventResourceBaseFilter(KalturaRelatedFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            eventIdEqual=NotImplemented,
            eventIdIn=NotImplemented,
            resourceIdEqual=NotImplemented,
            resourceIdIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaRelatedFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var int
        self.eventIdEqual = eventIdEqual

        # @var string
        self.eventIdIn = eventIdIn

        # @var int
        self.resourceIdEqual = resourceIdEqual

        # @var string
        self.resourceIdIn = resourceIdIn

        # @var int
        self.createdAtGreaterThanOrEqual = createdAtGreaterThanOrEqual

        # @var int
        self.createdAtLessThanOrEqual = createdAtLessThanOrEqual

        # @var int
        self.updatedAtGreaterThanOrEqual = updatedAtGreaterThanOrEqual

        # @var int
        self.updatedAtLessThanOrEqual = updatedAtLessThanOrEqual


    PROPERTY_LOADERS = {
        'eventIdEqual': getXmlNodeInt, 
        'eventIdIn': getXmlNodeText, 
        'resourceIdEqual': getXmlNodeInt, 
        'resourceIdIn': getXmlNodeText, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'updatedAtGreaterThanOrEqual': getXmlNodeInt, 
        'updatedAtLessThanOrEqual': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaRelatedFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduleEventResourceBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaRelatedFilter.toParams(self)
        kparams.put("objectType", "KalturaScheduleEventResourceBaseFilter")
        kparams.addIntIfDefined("eventIdEqual", self.eventIdEqual)
        kparams.addStringIfDefined("eventIdIn", self.eventIdIn)
        kparams.addIntIfDefined("resourceIdEqual", self.resourceIdEqual)
        kparams.addStringIfDefined("resourceIdIn", self.resourceIdIn)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        kparams.addIntIfDefined("updatedAtGreaterThanOrEqual", self.updatedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("updatedAtLessThanOrEqual", self.updatedAtLessThanOrEqual)
        return kparams

    def getEventIdEqual(self):
        return self.eventIdEqual

    def setEventIdEqual(self, newEventIdEqual):
        self.eventIdEqual = newEventIdEqual

    def getEventIdIn(self):
        return self.eventIdIn

    def setEventIdIn(self, newEventIdIn):
        self.eventIdIn = newEventIdIn

    def getResourceIdEqual(self):
        return self.resourceIdEqual

    def setResourceIdEqual(self, newResourceIdEqual):
        self.resourceIdEqual = newResourceIdEqual

    def getResourceIdIn(self):
        return self.resourceIdIn

    def setResourceIdIn(self, newResourceIdIn):
        self.resourceIdIn = newResourceIdIn

    def getCreatedAtGreaterThanOrEqual(self):
        return self.createdAtGreaterThanOrEqual

    def setCreatedAtGreaterThanOrEqual(self, newCreatedAtGreaterThanOrEqual):
        self.createdAtGreaterThanOrEqual = newCreatedAtGreaterThanOrEqual

    def getCreatedAtLessThanOrEqual(self):
        return self.createdAtLessThanOrEqual

    def setCreatedAtLessThanOrEqual(self, newCreatedAtLessThanOrEqual):
        self.createdAtLessThanOrEqual = newCreatedAtLessThanOrEqual

    def getUpdatedAtGreaterThanOrEqual(self):
        return self.updatedAtGreaterThanOrEqual

    def setUpdatedAtGreaterThanOrEqual(self, newUpdatedAtGreaterThanOrEqual):
        self.updatedAtGreaterThanOrEqual = newUpdatedAtGreaterThanOrEqual

    def getUpdatedAtLessThanOrEqual(self):
        return self.updatedAtLessThanOrEqual

    def setUpdatedAtLessThanOrEqual(self, newUpdatedAtLessThanOrEqual):
        self.updatedAtLessThanOrEqual = newUpdatedAtLessThanOrEqual


# @package Kaltura
# @subpackage Client
class KalturaScheduleResourceBaseFilter(KalturaRelatedFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaRelatedFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var int
        self.idEqual = idEqual

        # @var string
        self.idIn = idIn

        # @var string
        self.idNotIn = idNotIn

        # @var int
        self.parentIdEqual = parentIdEqual

        # @var string
        self.parentIdIn = parentIdIn

        # @var string
        self.systemNameEqual = systemNameEqual

        # @var string
        self.systemNameIn = systemNameIn

        # @var KalturaScheduleResourceStatus
        self.statusEqual = statusEqual

        # @var string
        self.statusIn = statusIn

        # @var string
        self.tagsLike = tagsLike

        # @var string
        self.tagsMultiLikeOr = tagsMultiLikeOr

        # @var string
        self.tagsMultiLikeAnd = tagsMultiLikeAnd

        # @var int
        self.createdAtGreaterThanOrEqual = createdAtGreaterThanOrEqual

        # @var int
        self.createdAtLessThanOrEqual = createdAtLessThanOrEqual

        # @var int
        self.updatedAtGreaterThanOrEqual = updatedAtGreaterThanOrEqual

        # @var int
        self.updatedAtLessThanOrEqual = updatedAtLessThanOrEqual


    PROPERTY_LOADERS = {
        'idEqual': getXmlNodeInt, 
        'idIn': getXmlNodeText, 
        'idNotIn': getXmlNodeText, 
        'parentIdEqual': getXmlNodeInt, 
        'parentIdIn': getXmlNodeText, 
        'systemNameEqual': getXmlNodeText, 
        'systemNameIn': getXmlNodeText, 
        'statusEqual': (KalturaEnumsFactory.createInt, "KalturaScheduleResourceStatus"), 
        'statusIn': getXmlNodeText, 
        'tagsLike': getXmlNodeText, 
        'tagsMultiLikeOr': getXmlNodeText, 
        'tagsMultiLikeAnd': getXmlNodeText, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'updatedAtGreaterThanOrEqual': getXmlNodeInt, 
        'updatedAtLessThanOrEqual': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaRelatedFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduleResourceBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaRelatedFilter.toParams(self)
        kparams.put("objectType", "KalturaScheduleResourceBaseFilter")
        kparams.addIntIfDefined("idEqual", self.idEqual)
        kparams.addStringIfDefined("idIn", self.idIn)
        kparams.addStringIfDefined("idNotIn", self.idNotIn)
        kparams.addIntIfDefined("parentIdEqual", self.parentIdEqual)
        kparams.addStringIfDefined("parentIdIn", self.parentIdIn)
        kparams.addStringIfDefined("systemNameEqual", self.systemNameEqual)
        kparams.addStringIfDefined("systemNameIn", self.systemNameIn)
        kparams.addIntEnumIfDefined("statusEqual", self.statusEqual)
        kparams.addStringIfDefined("statusIn", self.statusIn)
        kparams.addStringIfDefined("tagsLike", self.tagsLike)
        kparams.addStringIfDefined("tagsMultiLikeOr", self.tagsMultiLikeOr)
        kparams.addStringIfDefined("tagsMultiLikeAnd", self.tagsMultiLikeAnd)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        kparams.addIntIfDefined("updatedAtGreaterThanOrEqual", self.updatedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("updatedAtLessThanOrEqual", self.updatedAtLessThanOrEqual)
        return kparams

    def getIdEqual(self):
        return self.idEqual

    def setIdEqual(self, newIdEqual):
        self.idEqual = newIdEqual

    def getIdIn(self):
        return self.idIn

    def setIdIn(self, newIdIn):
        self.idIn = newIdIn

    def getIdNotIn(self):
        return self.idNotIn

    def setIdNotIn(self, newIdNotIn):
        self.idNotIn = newIdNotIn

    def getParentIdEqual(self):
        return self.parentIdEqual

    def setParentIdEqual(self, newParentIdEqual):
        self.parentIdEqual = newParentIdEqual

    def getParentIdIn(self):
        return self.parentIdIn

    def setParentIdIn(self, newParentIdIn):
        self.parentIdIn = newParentIdIn

    def getSystemNameEqual(self):
        return self.systemNameEqual

    def setSystemNameEqual(self, newSystemNameEqual):
        self.systemNameEqual = newSystemNameEqual

    def getSystemNameIn(self):
        return self.systemNameIn

    def setSystemNameIn(self, newSystemNameIn):
        self.systemNameIn = newSystemNameIn

    def getStatusEqual(self):
        return self.statusEqual

    def setStatusEqual(self, newStatusEqual):
        self.statusEqual = newStatusEqual

    def getStatusIn(self):
        return self.statusIn

    def setStatusIn(self, newStatusIn):
        self.statusIn = newStatusIn

    def getTagsLike(self):
        return self.tagsLike

    def setTagsLike(self, newTagsLike):
        self.tagsLike = newTagsLike

    def getTagsMultiLikeOr(self):
        return self.tagsMultiLikeOr

    def setTagsMultiLikeOr(self, newTagsMultiLikeOr):
        self.tagsMultiLikeOr = newTagsMultiLikeOr

    def getTagsMultiLikeAnd(self):
        return self.tagsMultiLikeAnd

    def setTagsMultiLikeAnd(self, newTagsMultiLikeAnd):
        self.tagsMultiLikeAnd = newTagsMultiLikeAnd

    def getCreatedAtGreaterThanOrEqual(self):
        return self.createdAtGreaterThanOrEqual

    def setCreatedAtGreaterThanOrEqual(self, newCreatedAtGreaterThanOrEqual):
        self.createdAtGreaterThanOrEqual = newCreatedAtGreaterThanOrEqual

    def getCreatedAtLessThanOrEqual(self):
        return self.createdAtLessThanOrEqual

    def setCreatedAtLessThanOrEqual(self, newCreatedAtLessThanOrEqual):
        self.createdAtLessThanOrEqual = newCreatedAtLessThanOrEqual

    def getUpdatedAtGreaterThanOrEqual(self):
        return self.updatedAtGreaterThanOrEqual

    def setUpdatedAtGreaterThanOrEqual(self, newUpdatedAtGreaterThanOrEqual):
        self.updatedAtGreaterThanOrEqual = newUpdatedAtGreaterThanOrEqual

    def getUpdatedAtLessThanOrEqual(self):
        return self.updatedAtLessThanOrEqual

    def setUpdatedAtLessThanOrEqual(self, newUpdatedAtLessThanOrEqual):
        self.updatedAtLessThanOrEqual = newUpdatedAtLessThanOrEqual


# @package Kaltura
# @subpackage Client
class KalturaScheduleEventFilter(KalturaScheduleEventBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            parentIdNotIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            startDateGreaterThanOrEqual=NotImplemented,
            startDateLessThanOrEqual=NotImplemented,
            endDateGreaterThanOrEqual=NotImplemented,
            endDateLessThanOrEqual=NotImplemented,
            referenceIdEqual=NotImplemented,
            referenceIdIn=NotImplemented,
            ownerIdEqual=NotImplemented,
            ownerIdIn=NotImplemented,
            priorityEqual=NotImplemented,
            priorityIn=NotImplemented,
            priorityGreaterThanOrEqual=NotImplemented,
            priorityLessThanOrEqual=NotImplemented,
            recurrenceTypeEqual=NotImplemented,
            recurrenceTypeIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            resourceIdsLike=NotImplemented,
            resourceIdsMultiLikeOr=NotImplemented,
            resourceIdsMultiLikeAnd=NotImplemented,
            parentResourceIdsLike=NotImplemented,
            parentResourceIdsMultiLikeOr=NotImplemented,
            parentResourceIdsMultiLikeAnd=NotImplemented,
            templateEntryCategoriesIdsMultiLikeAnd=NotImplemented,
            templateEntryCategoriesIdsMultiLikeOr=NotImplemented,
            resourceSystemNamesMultiLikeOr=NotImplemented,
            templateEntryCategoriesIdsLike=NotImplemented,
            resourceSystemNamesMultiLikeAnd=NotImplemented,
            resourceSystemNamesLike=NotImplemented):
        KalturaScheduleEventBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            parentIdEqual,
            parentIdIn,
            parentIdNotIn,
            statusEqual,
            statusIn,
            startDateGreaterThanOrEqual,
            startDateLessThanOrEqual,
            endDateGreaterThanOrEqual,
            endDateLessThanOrEqual,
            referenceIdEqual,
            referenceIdIn,
            ownerIdEqual,
            ownerIdIn,
            priorityEqual,
            priorityIn,
            priorityGreaterThanOrEqual,
            priorityLessThanOrEqual,
            recurrenceTypeEqual,
            recurrenceTypeIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)

        # @var string
        self.resourceIdsLike = resourceIdsLike

        # @var string
        self.resourceIdsMultiLikeOr = resourceIdsMultiLikeOr

        # @var string
        self.resourceIdsMultiLikeAnd = resourceIdsMultiLikeAnd

        # @var string
        self.parentResourceIdsLike = parentResourceIdsLike

        # @var string
        self.parentResourceIdsMultiLikeOr = parentResourceIdsMultiLikeOr

        # @var string
        self.parentResourceIdsMultiLikeAnd = parentResourceIdsMultiLikeAnd

        # @var string
        self.templateEntryCategoriesIdsMultiLikeAnd = templateEntryCategoriesIdsMultiLikeAnd

        # @var string
        self.templateEntryCategoriesIdsMultiLikeOr = templateEntryCategoriesIdsMultiLikeOr

        # @var string
        self.resourceSystemNamesMultiLikeOr = resourceSystemNamesMultiLikeOr

        # @var string
        self.templateEntryCategoriesIdsLike = templateEntryCategoriesIdsLike

        # @var string
        self.resourceSystemNamesMultiLikeAnd = resourceSystemNamesMultiLikeAnd

        # @var string
        self.resourceSystemNamesLike = resourceSystemNamesLike


    PROPERTY_LOADERS = {
        'resourceIdsLike': getXmlNodeText, 
        'resourceIdsMultiLikeOr': getXmlNodeText, 
        'resourceIdsMultiLikeAnd': getXmlNodeText, 
        'parentResourceIdsLike': getXmlNodeText, 
        'parentResourceIdsMultiLikeOr': getXmlNodeText, 
        'parentResourceIdsMultiLikeAnd': getXmlNodeText, 
        'templateEntryCategoriesIdsMultiLikeAnd': getXmlNodeText, 
        'templateEntryCategoriesIdsMultiLikeOr': getXmlNodeText, 
        'resourceSystemNamesMultiLikeOr': getXmlNodeText, 
        'templateEntryCategoriesIdsLike': getXmlNodeText, 
        'resourceSystemNamesMultiLikeAnd': getXmlNodeText, 
        'resourceSystemNamesLike': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaScheduleEventBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduleEventFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaScheduleEventBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaScheduleEventFilter")
        kparams.addStringIfDefined("resourceIdsLike", self.resourceIdsLike)
        kparams.addStringIfDefined("resourceIdsMultiLikeOr", self.resourceIdsMultiLikeOr)
        kparams.addStringIfDefined("resourceIdsMultiLikeAnd", self.resourceIdsMultiLikeAnd)
        kparams.addStringIfDefined("parentResourceIdsLike", self.parentResourceIdsLike)
        kparams.addStringIfDefined("parentResourceIdsMultiLikeOr", self.parentResourceIdsMultiLikeOr)
        kparams.addStringIfDefined("parentResourceIdsMultiLikeAnd", self.parentResourceIdsMultiLikeAnd)
        kparams.addStringIfDefined("templateEntryCategoriesIdsMultiLikeAnd", self.templateEntryCategoriesIdsMultiLikeAnd)
        kparams.addStringIfDefined("templateEntryCategoriesIdsMultiLikeOr", self.templateEntryCategoriesIdsMultiLikeOr)
        kparams.addStringIfDefined("resourceSystemNamesMultiLikeOr", self.resourceSystemNamesMultiLikeOr)
        kparams.addStringIfDefined("templateEntryCategoriesIdsLike", self.templateEntryCategoriesIdsLike)
        kparams.addStringIfDefined("resourceSystemNamesMultiLikeAnd", self.resourceSystemNamesMultiLikeAnd)
        kparams.addStringIfDefined("resourceSystemNamesLike", self.resourceSystemNamesLike)
        return kparams

    def getResourceIdsLike(self):
        return self.resourceIdsLike

    def setResourceIdsLike(self, newResourceIdsLike):
        self.resourceIdsLike = newResourceIdsLike

    def getResourceIdsMultiLikeOr(self):
        return self.resourceIdsMultiLikeOr

    def setResourceIdsMultiLikeOr(self, newResourceIdsMultiLikeOr):
        self.resourceIdsMultiLikeOr = newResourceIdsMultiLikeOr

    def getResourceIdsMultiLikeAnd(self):
        return self.resourceIdsMultiLikeAnd

    def setResourceIdsMultiLikeAnd(self, newResourceIdsMultiLikeAnd):
        self.resourceIdsMultiLikeAnd = newResourceIdsMultiLikeAnd

    def getParentResourceIdsLike(self):
        return self.parentResourceIdsLike

    def setParentResourceIdsLike(self, newParentResourceIdsLike):
        self.parentResourceIdsLike = newParentResourceIdsLike

    def getParentResourceIdsMultiLikeOr(self):
        return self.parentResourceIdsMultiLikeOr

    def setParentResourceIdsMultiLikeOr(self, newParentResourceIdsMultiLikeOr):
        self.parentResourceIdsMultiLikeOr = newParentResourceIdsMultiLikeOr

    def getParentResourceIdsMultiLikeAnd(self):
        return self.parentResourceIdsMultiLikeAnd

    def setParentResourceIdsMultiLikeAnd(self, newParentResourceIdsMultiLikeAnd):
        self.parentResourceIdsMultiLikeAnd = newParentResourceIdsMultiLikeAnd

    def getTemplateEntryCategoriesIdsMultiLikeAnd(self):
        return self.templateEntryCategoriesIdsMultiLikeAnd

    def setTemplateEntryCategoriesIdsMultiLikeAnd(self, newTemplateEntryCategoriesIdsMultiLikeAnd):
        self.templateEntryCategoriesIdsMultiLikeAnd = newTemplateEntryCategoriesIdsMultiLikeAnd

    def getTemplateEntryCategoriesIdsMultiLikeOr(self):
        return self.templateEntryCategoriesIdsMultiLikeOr

    def setTemplateEntryCategoriesIdsMultiLikeOr(self, newTemplateEntryCategoriesIdsMultiLikeOr):
        self.templateEntryCategoriesIdsMultiLikeOr = newTemplateEntryCategoriesIdsMultiLikeOr

    def getResourceSystemNamesMultiLikeOr(self):
        return self.resourceSystemNamesMultiLikeOr

    def setResourceSystemNamesMultiLikeOr(self, newResourceSystemNamesMultiLikeOr):
        self.resourceSystemNamesMultiLikeOr = newResourceSystemNamesMultiLikeOr

    def getTemplateEntryCategoriesIdsLike(self):
        return self.templateEntryCategoriesIdsLike

    def setTemplateEntryCategoriesIdsLike(self, newTemplateEntryCategoriesIdsLike):
        self.templateEntryCategoriesIdsLike = newTemplateEntryCategoriesIdsLike

    def getResourceSystemNamesMultiLikeAnd(self):
        return self.resourceSystemNamesMultiLikeAnd

    def setResourceSystemNamesMultiLikeAnd(self, newResourceSystemNamesMultiLikeAnd):
        self.resourceSystemNamesMultiLikeAnd = newResourceSystemNamesMultiLikeAnd

    def getResourceSystemNamesLike(self):
        return self.resourceSystemNamesLike

    def setResourceSystemNamesLike(self, newResourceSystemNamesLike):
        self.resourceSystemNamesLike = newResourceSystemNamesLike


# @package Kaltura
# @subpackage Client
class KalturaScheduleEventResourceFilter(KalturaScheduleEventResourceBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            eventIdEqual=NotImplemented,
            eventIdIn=NotImplemented,
            resourceIdEqual=NotImplemented,
            resourceIdIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaScheduleEventResourceBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            eventIdEqual,
            eventIdIn,
            resourceIdEqual,
            resourceIdIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaScheduleEventResourceBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduleEventResourceFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaScheduleEventResourceBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaScheduleEventResourceFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaScheduleResourceFilter(KalturaScheduleResourceBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaScheduleResourceBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            parentIdEqual,
            parentIdIn,
            systemNameEqual,
            systemNameIn,
            statusEqual,
            statusIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaScheduleResourceBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduleResourceFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaScheduleResourceBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaScheduleResourceFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaCameraScheduleResourceBaseFilter(KalturaScheduleResourceFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaScheduleResourceFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            parentIdEqual,
            parentIdIn,
            systemNameEqual,
            systemNameIn,
            statusEqual,
            statusIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaScheduleResourceFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaCameraScheduleResourceBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaScheduleResourceFilter.toParams(self)
        kparams.put("objectType", "KalturaCameraScheduleResourceBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaEntryScheduleEventBaseFilter(KalturaScheduleEventFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            parentIdNotIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            startDateGreaterThanOrEqual=NotImplemented,
            startDateLessThanOrEqual=NotImplemented,
            endDateGreaterThanOrEqual=NotImplemented,
            endDateLessThanOrEqual=NotImplemented,
            referenceIdEqual=NotImplemented,
            referenceIdIn=NotImplemented,
            ownerIdEqual=NotImplemented,
            ownerIdIn=NotImplemented,
            priorityEqual=NotImplemented,
            priorityIn=NotImplemented,
            priorityGreaterThanOrEqual=NotImplemented,
            priorityLessThanOrEqual=NotImplemented,
            recurrenceTypeEqual=NotImplemented,
            recurrenceTypeIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            resourceIdsLike=NotImplemented,
            resourceIdsMultiLikeOr=NotImplemented,
            resourceIdsMultiLikeAnd=NotImplemented,
            parentResourceIdsLike=NotImplemented,
            parentResourceIdsMultiLikeOr=NotImplemented,
            parentResourceIdsMultiLikeAnd=NotImplemented,
            templateEntryCategoriesIdsMultiLikeAnd=NotImplemented,
            templateEntryCategoriesIdsMultiLikeOr=NotImplemented,
            resourceSystemNamesMultiLikeOr=NotImplemented,
            templateEntryCategoriesIdsLike=NotImplemented,
            resourceSystemNamesMultiLikeAnd=NotImplemented,
            resourceSystemNamesLike=NotImplemented,
            templateEntryIdEqual=NotImplemented,
            entryIdsLike=NotImplemented,
            entryIdsMultiLikeOr=NotImplemented,
            entryIdsMultiLikeAnd=NotImplemented,
            categoryIdsLike=NotImplemented,
            categoryIdsMultiLikeOr=NotImplemented,
            categoryIdsMultiLikeAnd=NotImplemented):
        KalturaScheduleEventFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            parentIdEqual,
            parentIdIn,
            parentIdNotIn,
            statusEqual,
            statusIn,
            startDateGreaterThanOrEqual,
            startDateLessThanOrEqual,
            endDateGreaterThanOrEqual,
            endDateLessThanOrEqual,
            referenceIdEqual,
            referenceIdIn,
            ownerIdEqual,
            ownerIdIn,
            priorityEqual,
            priorityIn,
            priorityGreaterThanOrEqual,
            priorityLessThanOrEqual,
            recurrenceTypeEqual,
            recurrenceTypeIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            resourceIdsLike,
            resourceIdsMultiLikeOr,
            resourceIdsMultiLikeAnd,
            parentResourceIdsLike,
            parentResourceIdsMultiLikeOr,
            parentResourceIdsMultiLikeAnd,
            templateEntryCategoriesIdsMultiLikeAnd,
            templateEntryCategoriesIdsMultiLikeOr,
            resourceSystemNamesMultiLikeOr,
            templateEntryCategoriesIdsLike,
            resourceSystemNamesMultiLikeAnd,
            resourceSystemNamesLike)

        # @var string
        self.templateEntryIdEqual = templateEntryIdEqual

        # @var string
        self.entryIdsLike = entryIdsLike

        # @var string
        self.entryIdsMultiLikeOr = entryIdsMultiLikeOr

        # @var string
        self.entryIdsMultiLikeAnd = entryIdsMultiLikeAnd

        # @var string
        self.categoryIdsLike = categoryIdsLike

        # @var string
        self.categoryIdsMultiLikeOr = categoryIdsMultiLikeOr

        # @var string
        self.categoryIdsMultiLikeAnd = categoryIdsMultiLikeAnd


    PROPERTY_LOADERS = {
        'templateEntryIdEqual': getXmlNodeText, 
        'entryIdsLike': getXmlNodeText, 
        'entryIdsMultiLikeOr': getXmlNodeText, 
        'entryIdsMultiLikeAnd': getXmlNodeText, 
        'categoryIdsLike': getXmlNodeText, 
        'categoryIdsMultiLikeOr': getXmlNodeText, 
        'categoryIdsMultiLikeAnd': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaScheduleEventFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEntryScheduleEventBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaScheduleEventFilter.toParams(self)
        kparams.put("objectType", "KalturaEntryScheduleEventBaseFilter")
        kparams.addStringIfDefined("templateEntryIdEqual", self.templateEntryIdEqual)
        kparams.addStringIfDefined("entryIdsLike", self.entryIdsLike)
        kparams.addStringIfDefined("entryIdsMultiLikeOr", self.entryIdsMultiLikeOr)
        kparams.addStringIfDefined("entryIdsMultiLikeAnd", self.entryIdsMultiLikeAnd)
        kparams.addStringIfDefined("categoryIdsLike", self.categoryIdsLike)
        kparams.addStringIfDefined("categoryIdsMultiLikeOr", self.categoryIdsMultiLikeOr)
        kparams.addStringIfDefined("categoryIdsMultiLikeAnd", self.categoryIdsMultiLikeAnd)
        return kparams

    def getTemplateEntryIdEqual(self):
        return self.templateEntryIdEqual

    def setTemplateEntryIdEqual(self, newTemplateEntryIdEqual):
        self.templateEntryIdEqual = newTemplateEntryIdEqual

    def getEntryIdsLike(self):
        return self.entryIdsLike

    def setEntryIdsLike(self, newEntryIdsLike):
        self.entryIdsLike = newEntryIdsLike

    def getEntryIdsMultiLikeOr(self):
        return self.entryIdsMultiLikeOr

    def setEntryIdsMultiLikeOr(self, newEntryIdsMultiLikeOr):
        self.entryIdsMultiLikeOr = newEntryIdsMultiLikeOr

    def getEntryIdsMultiLikeAnd(self):
        return self.entryIdsMultiLikeAnd

    def setEntryIdsMultiLikeAnd(self, newEntryIdsMultiLikeAnd):
        self.entryIdsMultiLikeAnd = newEntryIdsMultiLikeAnd

    def getCategoryIdsLike(self):
        return self.categoryIdsLike

    def setCategoryIdsLike(self, newCategoryIdsLike):
        self.categoryIdsLike = newCategoryIdsLike

    def getCategoryIdsMultiLikeOr(self):
        return self.categoryIdsMultiLikeOr

    def setCategoryIdsMultiLikeOr(self, newCategoryIdsMultiLikeOr):
        self.categoryIdsMultiLikeOr = newCategoryIdsMultiLikeOr

    def getCategoryIdsMultiLikeAnd(self):
        return self.categoryIdsMultiLikeAnd

    def setCategoryIdsMultiLikeAnd(self, newCategoryIdsMultiLikeAnd):
        self.categoryIdsMultiLikeAnd = newCategoryIdsMultiLikeAnd


# @package Kaltura
# @subpackage Client
class KalturaLiveEntryScheduleResourceBaseFilter(KalturaScheduleResourceFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaScheduleResourceFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            parentIdEqual,
            parentIdIn,
            systemNameEqual,
            systemNameIn,
            statusEqual,
            statusIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaScheduleResourceFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaLiveEntryScheduleResourceBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaScheduleResourceFilter.toParams(self)
        kparams.put("objectType", "KalturaLiveEntryScheduleResourceBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaLocationScheduleResourceBaseFilter(KalturaScheduleResourceFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaScheduleResourceFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            parentIdEqual,
            parentIdIn,
            systemNameEqual,
            systemNameIn,
            statusEqual,
            statusIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaScheduleResourceFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaLocationScheduleResourceBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaScheduleResourceFilter.toParams(self)
        kparams.put("objectType", "KalturaLocationScheduleResourceBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaCameraScheduleResourceFilter(KalturaCameraScheduleResourceBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaCameraScheduleResourceBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            parentIdEqual,
            parentIdIn,
            systemNameEqual,
            systemNameIn,
            statusEqual,
            statusIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaCameraScheduleResourceBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaCameraScheduleResourceFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCameraScheduleResourceBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaCameraScheduleResourceFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaEntryScheduleEventFilter(KalturaEntryScheduleEventBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            parentIdNotIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            startDateGreaterThanOrEqual=NotImplemented,
            startDateLessThanOrEqual=NotImplemented,
            endDateGreaterThanOrEqual=NotImplemented,
            endDateLessThanOrEqual=NotImplemented,
            referenceIdEqual=NotImplemented,
            referenceIdIn=NotImplemented,
            ownerIdEqual=NotImplemented,
            ownerIdIn=NotImplemented,
            priorityEqual=NotImplemented,
            priorityIn=NotImplemented,
            priorityGreaterThanOrEqual=NotImplemented,
            priorityLessThanOrEqual=NotImplemented,
            recurrenceTypeEqual=NotImplemented,
            recurrenceTypeIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            resourceIdsLike=NotImplemented,
            resourceIdsMultiLikeOr=NotImplemented,
            resourceIdsMultiLikeAnd=NotImplemented,
            parentResourceIdsLike=NotImplemented,
            parentResourceIdsMultiLikeOr=NotImplemented,
            parentResourceIdsMultiLikeAnd=NotImplemented,
            templateEntryCategoriesIdsMultiLikeAnd=NotImplemented,
            templateEntryCategoriesIdsMultiLikeOr=NotImplemented,
            resourceSystemNamesMultiLikeOr=NotImplemented,
            templateEntryCategoriesIdsLike=NotImplemented,
            resourceSystemNamesMultiLikeAnd=NotImplemented,
            resourceSystemNamesLike=NotImplemented,
            templateEntryIdEqual=NotImplemented,
            entryIdsLike=NotImplemented,
            entryIdsMultiLikeOr=NotImplemented,
            entryIdsMultiLikeAnd=NotImplemented,
            categoryIdsLike=NotImplemented,
            categoryIdsMultiLikeOr=NotImplemented,
            categoryIdsMultiLikeAnd=NotImplemented,
            parentCategoryIdsLike=NotImplemented,
            parentCategoryIdsMultiLikeOr=NotImplemented,
            parentCategoryIdsMultiLikeAnd=NotImplemented):
        KalturaEntryScheduleEventBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            parentIdEqual,
            parentIdIn,
            parentIdNotIn,
            statusEqual,
            statusIn,
            startDateGreaterThanOrEqual,
            startDateLessThanOrEqual,
            endDateGreaterThanOrEqual,
            endDateLessThanOrEqual,
            referenceIdEqual,
            referenceIdIn,
            ownerIdEqual,
            ownerIdIn,
            priorityEqual,
            priorityIn,
            priorityGreaterThanOrEqual,
            priorityLessThanOrEqual,
            recurrenceTypeEqual,
            recurrenceTypeIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            resourceIdsLike,
            resourceIdsMultiLikeOr,
            resourceIdsMultiLikeAnd,
            parentResourceIdsLike,
            parentResourceIdsMultiLikeOr,
            parentResourceIdsMultiLikeAnd,
            templateEntryCategoriesIdsMultiLikeAnd,
            templateEntryCategoriesIdsMultiLikeOr,
            resourceSystemNamesMultiLikeOr,
            templateEntryCategoriesIdsLike,
            resourceSystemNamesMultiLikeAnd,
            resourceSystemNamesLike,
            templateEntryIdEqual,
            entryIdsLike,
            entryIdsMultiLikeOr,
            entryIdsMultiLikeAnd,
            categoryIdsLike,
            categoryIdsMultiLikeOr,
            categoryIdsMultiLikeAnd)

        # @var string
        self.parentCategoryIdsLike = parentCategoryIdsLike

        # @var string
        self.parentCategoryIdsMultiLikeOr = parentCategoryIdsMultiLikeOr

        # @var string
        self.parentCategoryIdsMultiLikeAnd = parentCategoryIdsMultiLikeAnd


    PROPERTY_LOADERS = {
        'parentCategoryIdsLike': getXmlNodeText, 
        'parentCategoryIdsMultiLikeOr': getXmlNodeText, 
        'parentCategoryIdsMultiLikeAnd': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaEntryScheduleEventBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEntryScheduleEventFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEntryScheduleEventBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaEntryScheduleEventFilter")
        kparams.addStringIfDefined("parentCategoryIdsLike", self.parentCategoryIdsLike)
        kparams.addStringIfDefined("parentCategoryIdsMultiLikeOr", self.parentCategoryIdsMultiLikeOr)
        kparams.addStringIfDefined("parentCategoryIdsMultiLikeAnd", self.parentCategoryIdsMultiLikeAnd)
        return kparams

    def getParentCategoryIdsLike(self):
        return self.parentCategoryIdsLike

    def setParentCategoryIdsLike(self, newParentCategoryIdsLike):
        self.parentCategoryIdsLike = newParentCategoryIdsLike

    def getParentCategoryIdsMultiLikeOr(self):
        return self.parentCategoryIdsMultiLikeOr

    def setParentCategoryIdsMultiLikeOr(self, newParentCategoryIdsMultiLikeOr):
        self.parentCategoryIdsMultiLikeOr = newParentCategoryIdsMultiLikeOr

    def getParentCategoryIdsMultiLikeAnd(self):
        return self.parentCategoryIdsMultiLikeAnd

    def setParentCategoryIdsMultiLikeAnd(self, newParentCategoryIdsMultiLikeAnd):
        self.parentCategoryIdsMultiLikeAnd = newParentCategoryIdsMultiLikeAnd


# @package Kaltura
# @subpackage Client
class KalturaLiveEntryScheduleResourceFilter(KalturaLiveEntryScheduleResourceBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaLiveEntryScheduleResourceBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            parentIdEqual,
            parentIdIn,
            systemNameEqual,
            systemNameIn,
            statusEqual,
            statusIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaLiveEntryScheduleResourceBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaLiveEntryScheduleResourceFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaLiveEntryScheduleResourceBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaLiveEntryScheduleResourceFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaLocationScheduleResourceFilter(KalturaLocationScheduleResourceBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaLocationScheduleResourceBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            parentIdEqual,
            parentIdIn,
            systemNameEqual,
            systemNameIn,
            statusEqual,
            statusIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaLocationScheduleResourceBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaLocationScheduleResourceFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaLocationScheduleResourceBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaLocationScheduleResourceFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaLiveStreamScheduleEventBaseFilter(KalturaEntryScheduleEventFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            parentIdNotIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            startDateGreaterThanOrEqual=NotImplemented,
            startDateLessThanOrEqual=NotImplemented,
            endDateGreaterThanOrEqual=NotImplemented,
            endDateLessThanOrEqual=NotImplemented,
            referenceIdEqual=NotImplemented,
            referenceIdIn=NotImplemented,
            ownerIdEqual=NotImplemented,
            ownerIdIn=NotImplemented,
            priorityEqual=NotImplemented,
            priorityIn=NotImplemented,
            priorityGreaterThanOrEqual=NotImplemented,
            priorityLessThanOrEqual=NotImplemented,
            recurrenceTypeEqual=NotImplemented,
            recurrenceTypeIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            resourceIdsLike=NotImplemented,
            resourceIdsMultiLikeOr=NotImplemented,
            resourceIdsMultiLikeAnd=NotImplemented,
            parentResourceIdsLike=NotImplemented,
            parentResourceIdsMultiLikeOr=NotImplemented,
            parentResourceIdsMultiLikeAnd=NotImplemented,
            templateEntryCategoriesIdsMultiLikeAnd=NotImplemented,
            templateEntryCategoriesIdsMultiLikeOr=NotImplemented,
            resourceSystemNamesMultiLikeOr=NotImplemented,
            templateEntryCategoriesIdsLike=NotImplemented,
            resourceSystemNamesMultiLikeAnd=NotImplemented,
            resourceSystemNamesLike=NotImplemented,
            templateEntryIdEqual=NotImplemented,
            entryIdsLike=NotImplemented,
            entryIdsMultiLikeOr=NotImplemented,
            entryIdsMultiLikeAnd=NotImplemented,
            categoryIdsLike=NotImplemented,
            categoryIdsMultiLikeOr=NotImplemented,
            categoryIdsMultiLikeAnd=NotImplemented,
            parentCategoryIdsLike=NotImplemented,
            parentCategoryIdsMultiLikeOr=NotImplemented,
            parentCategoryIdsMultiLikeAnd=NotImplemented):
        KalturaEntryScheduleEventFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            parentIdEqual,
            parentIdIn,
            parentIdNotIn,
            statusEqual,
            statusIn,
            startDateGreaterThanOrEqual,
            startDateLessThanOrEqual,
            endDateGreaterThanOrEqual,
            endDateLessThanOrEqual,
            referenceIdEqual,
            referenceIdIn,
            ownerIdEqual,
            ownerIdIn,
            priorityEqual,
            priorityIn,
            priorityGreaterThanOrEqual,
            priorityLessThanOrEqual,
            recurrenceTypeEqual,
            recurrenceTypeIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            resourceIdsLike,
            resourceIdsMultiLikeOr,
            resourceIdsMultiLikeAnd,
            parentResourceIdsLike,
            parentResourceIdsMultiLikeOr,
            parentResourceIdsMultiLikeAnd,
            templateEntryCategoriesIdsMultiLikeAnd,
            templateEntryCategoriesIdsMultiLikeOr,
            resourceSystemNamesMultiLikeOr,
            templateEntryCategoriesIdsLike,
            resourceSystemNamesMultiLikeAnd,
            resourceSystemNamesLike,
            templateEntryIdEqual,
            entryIdsLike,
            entryIdsMultiLikeOr,
            entryIdsMultiLikeAnd,
            categoryIdsLike,
            categoryIdsMultiLikeOr,
            categoryIdsMultiLikeAnd,
            parentCategoryIdsLike,
            parentCategoryIdsMultiLikeOr,
            parentCategoryIdsMultiLikeAnd)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaEntryScheduleEventFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaLiveStreamScheduleEventBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEntryScheduleEventFilter.toParams(self)
        kparams.put("objectType", "KalturaLiveStreamScheduleEventBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaRecordScheduleEventBaseFilter(KalturaEntryScheduleEventFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            parentIdNotIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            startDateGreaterThanOrEqual=NotImplemented,
            startDateLessThanOrEqual=NotImplemented,
            endDateGreaterThanOrEqual=NotImplemented,
            endDateLessThanOrEqual=NotImplemented,
            referenceIdEqual=NotImplemented,
            referenceIdIn=NotImplemented,
            ownerIdEqual=NotImplemented,
            ownerIdIn=NotImplemented,
            priorityEqual=NotImplemented,
            priorityIn=NotImplemented,
            priorityGreaterThanOrEqual=NotImplemented,
            priorityLessThanOrEqual=NotImplemented,
            recurrenceTypeEqual=NotImplemented,
            recurrenceTypeIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            resourceIdsLike=NotImplemented,
            resourceIdsMultiLikeOr=NotImplemented,
            resourceIdsMultiLikeAnd=NotImplemented,
            parentResourceIdsLike=NotImplemented,
            parentResourceIdsMultiLikeOr=NotImplemented,
            parentResourceIdsMultiLikeAnd=NotImplemented,
            templateEntryCategoriesIdsMultiLikeAnd=NotImplemented,
            templateEntryCategoriesIdsMultiLikeOr=NotImplemented,
            resourceSystemNamesMultiLikeOr=NotImplemented,
            templateEntryCategoriesIdsLike=NotImplemented,
            resourceSystemNamesMultiLikeAnd=NotImplemented,
            resourceSystemNamesLike=NotImplemented,
            templateEntryIdEqual=NotImplemented,
            entryIdsLike=NotImplemented,
            entryIdsMultiLikeOr=NotImplemented,
            entryIdsMultiLikeAnd=NotImplemented,
            categoryIdsLike=NotImplemented,
            categoryIdsMultiLikeOr=NotImplemented,
            categoryIdsMultiLikeAnd=NotImplemented,
            parentCategoryIdsLike=NotImplemented,
            parentCategoryIdsMultiLikeOr=NotImplemented,
            parentCategoryIdsMultiLikeAnd=NotImplemented):
        KalturaEntryScheduleEventFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            parentIdEqual,
            parentIdIn,
            parentIdNotIn,
            statusEqual,
            statusIn,
            startDateGreaterThanOrEqual,
            startDateLessThanOrEqual,
            endDateGreaterThanOrEqual,
            endDateLessThanOrEqual,
            referenceIdEqual,
            referenceIdIn,
            ownerIdEqual,
            ownerIdIn,
            priorityEqual,
            priorityIn,
            priorityGreaterThanOrEqual,
            priorityLessThanOrEqual,
            recurrenceTypeEqual,
            recurrenceTypeIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            resourceIdsLike,
            resourceIdsMultiLikeOr,
            resourceIdsMultiLikeAnd,
            parentResourceIdsLike,
            parentResourceIdsMultiLikeOr,
            parentResourceIdsMultiLikeAnd,
            templateEntryCategoriesIdsMultiLikeAnd,
            templateEntryCategoriesIdsMultiLikeOr,
            resourceSystemNamesMultiLikeOr,
            templateEntryCategoriesIdsLike,
            resourceSystemNamesMultiLikeAnd,
            resourceSystemNamesLike,
            templateEntryIdEqual,
            entryIdsLike,
            entryIdsMultiLikeOr,
            entryIdsMultiLikeAnd,
            categoryIdsLike,
            categoryIdsMultiLikeOr,
            categoryIdsMultiLikeAnd,
            parentCategoryIdsLike,
            parentCategoryIdsMultiLikeOr,
            parentCategoryIdsMultiLikeAnd)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaEntryScheduleEventFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaRecordScheduleEventBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEntryScheduleEventFilter.toParams(self)
        kparams.put("objectType", "KalturaRecordScheduleEventBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaLiveStreamScheduleEventFilter(KalturaLiveStreamScheduleEventBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            parentIdNotIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            startDateGreaterThanOrEqual=NotImplemented,
            startDateLessThanOrEqual=NotImplemented,
            endDateGreaterThanOrEqual=NotImplemented,
            endDateLessThanOrEqual=NotImplemented,
            referenceIdEqual=NotImplemented,
            referenceIdIn=NotImplemented,
            ownerIdEqual=NotImplemented,
            ownerIdIn=NotImplemented,
            priorityEqual=NotImplemented,
            priorityIn=NotImplemented,
            priorityGreaterThanOrEqual=NotImplemented,
            priorityLessThanOrEqual=NotImplemented,
            recurrenceTypeEqual=NotImplemented,
            recurrenceTypeIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            resourceIdsLike=NotImplemented,
            resourceIdsMultiLikeOr=NotImplemented,
            resourceIdsMultiLikeAnd=NotImplemented,
            parentResourceIdsLike=NotImplemented,
            parentResourceIdsMultiLikeOr=NotImplemented,
            parentResourceIdsMultiLikeAnd=NotImplemented,
            templateEntryCategoriesIdsMultiLikeAnd=NotImplemented,
            templateEntryCategoriesIdsMultiLikeOr=NotImplemented,
            resourceSystemNamesMultiLikeOr=NotImplemented,
            templateEntryCategoriesIdsLike=NotImplemented,
            resourceSystemNamesMultiLikeAnd=NotImplemented,
            resourceSystemNamesLike=NotImplemented,
            templateEntryIdEqual=NotImplemented,
            entryIdsLike=NotImplemented,
            entryIdsMultiLikeOr=NotImplemented,
            entryIdsMultiLikeAnd=NotImplemented,
            categoryIdsLike=NotImplemented,
            categoryIdsMultiLikeOr=NotImplemented,
            categoryIdsMultiLikeAnd=NotImplemented,
            parentCategoryIdsLike=NotImplemented,
            parentCategoryIdsMultiLikeOr=NotImplemented,
            parentCategoryIdsMultiLikeAnd=NotImplemented):
        KalturaLiveStreamScheduleEventBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            parentIdEqual,
            parentIdIn,
            parentIdNotIn,
            statusEqual,
            statusIn,
            startDateGreaterThanOrEqual,
            startDateLessThanOrEqual,
            endDateGreaterThanOrEqual,
            endDateLessThanOrEqual,
            referenceIdEqual,
            referenceIdIn,
            ownerIdEqual,
            ownerIdIn,
            priorityEqual,
            priorityIn,
            priorityGreaterThanOrEqual,
            priorityLessThanOrEqual,
            recurrenceTypeEqual,
            recurrenceTypeIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            resourceIdsLike,
            resourceIdsMultiLikeOr,
            resourceIdsMultiLikeAnd,
            parentResourceIdsLike,
            parentResourceIdsMultiLikeOr,
            parentResourceIdsMultiLikeAnd,
            templateEntryCategoriesIdsMultiLikeAnd,
            templateEntryCategoriesIdsMultiLikeOr,
            resourceSystemNamesMultiLikeOr,
            templateEntryCategoriesIdsLike,
            resourceSystemNamesMultiLikeAnd,
            resourceSystemNamesLike,
            templateEntryIdEqual,
            entryIdsLike,
            entryIdsMultiLikeOr,
            entryIdsMultiLikeAnd,
            categoryIdsLike,
            categoryIdsMultiLikeOr,
            categoryIdsMultiLikeAnd,
            parentCategoryIdsLike,
            parentCategoryIdsMultiLikeOr,
            parentCategoryIdsMultiLikeAnd)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaLiveStreamScheduleEventBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaLiveStreamScheduleEventFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaLiveStreamScheduleEventBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaLiveStreamScheduleEventFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaRecordScheduleEventFilter(KalturaRecordScheduleEventBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            parentIdNotIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            startDateGreaterThanOrEqual=NotImplemented,
            startDateLessThanOrEqual=NotImplemented,
            endDateGreaterThanOrEqual=NotImplemented,
            endDateLessThanOrEqual=NotImplemented,
            referenceIdEqual=NotImplemented,
            referenceIdIn=NotImplemented,
            ownerIdEqual=NotImplemented,
            ownerIdIn=NotImplemented,
            priorityEqual=NotImplemented,
            priorityIn=NotImplemented,
            priorityGreaterThanOrEqual=NotImplemented,
            priorityLessThanOrEqual=NotImplemented,
            recurrenceTypeEqual=NotImplemented,
            recurrenceTypeIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            resourceIdsLike=NotImplemented,
            resourceIdsMultiLikeOr=NotImplemented,
            resourceIdsMultiLikeAnd=NotImplemented,
            parentResourceIdsLike=NotImplemented,
            parentResourceIdsMultiLikeOr=NotImplemented,
            parentResourceIdsMultiLikeAnd=NotImplemented,
            templateEntryCategoriesIdsMultiLikeAnd=NotImplemented,
            templateEntryCategoriesIdsMultiLikeOr=NotImplemented,
            resourceSystemNamesMultiLikeOr=NotImplemented,
            templateEntryCategoriesIdsLike=NotImplemented,
            resourceSystemNamesMultiLikeAnd=NotImplemented,
            resourceSystemNamesLike=NotImplemented,
            templateEntryIdEqual=NotImplemented,
            entryIdsLike=NotImplemented,
            entryIdsMultiLikeOr=NotImplemented,
            entryIdsMultiLikeAnd=NotImplemented,
            categoryIdsLike=NotImplemented,
            categoryIdsMultiLikeOr=NotImplemented,
            categoryIdsMultiLikeAnd=NotImplemented,
            parentCategoryIdsLike=NotImplemented,
            parentCategoryIdsMultiLikeOr=NotImplemented,
            parentCategoryIdsMultiLikeAnd=NotImplemented):
        KalturaRecordScheduleEventBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            parentIdEqual,
            parentIdIn,
            parentIdNotIn,
            statusEqual,
            statusIn,
            startDateGreaterThanOrEqual,
            startDateLessThanOrEqual,
            endDateGreaterThanOrEqual,
            endDateLessThanOrEqual,
            referenceIdEqual,
            referenceIdIn,
            ownerIdEqual,
            ownerIdIn,
            priorityEqual,
            priorityIn,
            priorityGreaterThanOrEqual,
            priorityLessThanOrEqual,
            recurrenceTypeEqual,
            recurrenceTypeIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            resourceIdsLike,
            resourceIdsMultiLikeOr,
            resourceIdsMultiLikeAnd,
            parentResourceIdsLike,
            parentResourceIdsMultiLikeOr,
            parentResourceIdsMultiLikeAnd,
            templateEntryCategoriesIdsMultiLikeAnd,
            templateEntryCategoriesIdsMultiLikeOr,
            resourceSystemNamesMultiLikeOr,
            templateEntryCategoriesIdsLike,
            resourceSystemNamesMultiLikeAnd,
            resourceSystemNamesLike,
            templateEntryIdEqual,
            entryIdsLike,
            entryIdsMultiLikeOr,
            entryIdsMultiLikeAnd,
            categoryIdsLike,
            categoryIdsMultiLikeOr,
            categoryIdsMultiLikeAnd,
            parentCategoryIdsLike,
            parentCategoryIdsMultiLikeOr,
            parentCategoryIdsMultiLikeAnd)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaRecordScheduleEventBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaRecordScheduleEventFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaRecordScheduleEventBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaRecordScheduleEventFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaScheduleEventService(KalturaServiceBase):
    """ScheduleEvent service lets you create and manage schedule events"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, scheduleEvent):
        """Allows you to add a new KalturaScheduleEvent object"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("scheduleEvent", scheduleEvent)
        self.client.queueServiceActionCall("schedule_scheduleevent", "add", KalturaScheduleEvent, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduleEvent)

    def get(self, scheduleEventId):
        """Retrieve a KalturaScheduleEvent object by ID"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("scheduleEventId", scheduleEventId);
        self.client.queueServiceActionCall("schedule_scheduleevent", "get", KalturaScheduleEvent, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduleEvent)

    def update(self, scheduleEventId, scheduleEvent):
        """Update an existing KalturaScheduleEvent object"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("scheduleEventId", scheduleEventId);
        kparams.addObjectIfDefined("scheduleEvent", scheduleEvent)
        self.client.queueServiceActionCall("schedule_scheduleevent", "update", KalturaScheduleEvent, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduleEvent)

    def delete(self, scheduleEventId):
        """Mark the KalturaScheduleEvent object as deleted"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("scheduleEventId", scheduleEventId);
        self.client.queueServiceActionCall("schedule_scheduleevent", "delete", KalturaScheduleEvent, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduleEvent)

    def cancel(self, scheduleEventId):
        """Mark the KalturaScheduleEvent object as cancelled"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("scheduleEventId", scheduleEventId);
        self.client.queueServiceActionCall("schedule_scheduleevent", "cancel", KalturaScheduleEvent, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduleEvent)

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List KalturaScheduleEvent objects"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("schedule_scheduleevent", "list", KalturaScheduleEventListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduleEventListResponse)

    def addFromBulkUpload(self, fileData, bulkUploadData = NotImplemented):
        """Add new bulk upload batch job"""

        kparams = KalturaParams()
        kfiles = KalturaFiles()
        kfiles.put("fileData", fileData);
        kparams.addObjectIfDefined("bulkUploadData", bulkUploadData)
        self.client.queueServiceActionCall("schedule_scheduleevent", "addFromBulkUpload", KalturaBulkUpload, kparams, kfiles)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaBulkUpload)


# @package Kaltura
# @subpackage Client
class KalturaScheduleResourceService(KalturaServiceBase):
    """ScheduleResource service lets you create and manage schedule events"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, scheduleResource):
        """Allows you to add a new KalturaScheduleResource object"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("scheduleResource", scheduleResource)
        self.client.queueServiceActionCall("schedule_scheduleresource", "add", KalturaScheduleResource, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduleResource)

    def get(self, scheduleResourceId):
        """Retrieve a KalturaScheduleResource object by ID"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("scheduleResourceId", scheduleResourceId);
        self.client.queueServiceActionCall("schedule_scheduleresource", "get", KalturaScheduleResource, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduleResource)

    def update(self, scheduleResourceId, scheduleResource):
        """Update an existing KalturaScheduleResource object"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("scheduleResourceId", scheduleResourceId);
        kparams.addObjectIfDefined("scheduleResource", scheduleResource)
        self.client.queueServiceActionCall("schedule_scheduleresource", "update", KalturaScheduleResource, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduleResource)

    def delete(self, scheduleResourceId):
        """Mark the KalturaScheduleResource object as deleted"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("scheduleResourceId", scheduleResourceId);
        self.client.queueServiceActionCall("schedule_scheduleresource", "delete", KalturaScheduleResource, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduleResource)

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List KalturaScheduleResource objects"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("schedule_scheduleresource", "list", KalturaScheduleResourceListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduleResourceListResponse)

    def addFromBulkUpload(self, fileData, bulkUploadData = NotImplemented):
        """Add new bulk upload batch job"""

        kparams = KalturaParams()
        kfiles = KalturaFiles()
        kfiles.put("fileData", fileData);
        kparams.addObjectIfDefined("bulkUploadData", bulkUploadData)
        self.client.queueServiceActionCall("schedule_scheduleresource", "addFromBulkUpload", KalturaBulkUpload, kparams, kfiles)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaBulkUpload)


# @package Kaltura
# @subpackage Client
class KalturaScheduleEventResourceService(KalturaServiceBase):
    """ScheduleEventResource service lets you create and manage connections between events and resources"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, scheduleEventResource):
        """Allows you to add a new KalturaScheduleEventResource object"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("scheduleEventResource", scheduleEventResource)
        self.client.queueServiceActionCall("schedule_scheduleeventresource", "add", KalturaScheduleEventResource, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduleEventResource)

    def get(self, scheduleEventId, scheduleResourceId):
        """Retrieve a KalturaScheduleEventResource object by ID"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("scheduleEventId", scheduleEventId);
        kparams.addIntIfDefined("scheduleResourceId", scheduleResourceId);
        self.client.queueServiceActionCall("schedule_scheduleeventresource", "get", KalturaScheduleEventResource, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduleEventResource)

    def update(self, scheduleEventId, scheduleResourceId, scheduleEventResource):
        """Update an existing KalturaScheduleEventResource object"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("scheduleEventId", scheduleEventId);
        kparams.addIntIfDefined("scheduleResourceId", scheduleResourceId);
        kparams.addObjectIfDefined("scheduleEventResource", scheduleEventResource)
        self.client.queueServiceActionCall("schedule_scheduleeventresource", "update", KalturaScheduleEventResource, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduleEventResource)

    def delete(self, scheduleEventId, scheduleResourceId):
        """Mark the KalturaScheduleEventResource object as deleted"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("scheduleEventId", scheduleEventId);
        kparams.addIntIfDefined("scheduleResourceId", scheduleResourceId);
        self.client.queueServiceActionCall("schedule_scheduleeventresource", "delete", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List KalturaScheduleEventResource objects"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("schedule_scheduleeventresource", "list", KalturaScheduleEventResourceListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduleEventResourceListResponse)

########## main ##########
class KalturaScheduleClientPlugin(KalturaClientPlugin):
    # KalturaScheduleClientPlugin
    instance = None

    # @return KalturaScheduleClientPlugin
    @staticmethod
    def get():
        if KalturaScheduleClientPlugin.instance == None:
            KalturaScheduleClientPlugin.instance = KalturaScheduleClientPlugin()
        return KalturaScheduleClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'scheduleEvent': KalturaScheduleEventService,
            'scheduleResource': KalturaScheduleResourceService,
            'scheduleEventResource': KalturaScheduleEventResourceService,
        }

    def getEnums(self):
        return {
            'KalturaScheduleEventClassificationType': KalturaScheduleEventClassificationType,
            'KalturaScheduleEventRecurrenceType': KalturaScheduleEventRecurrenceType,
            'KalturaScheduleEventStatus': KalturaScheduleEventStatus,
            'KalturaScheduleEventType': KalturaScheduleEventType,
            'KalturaScheduleResourceStatus': KalturaScheduleResourceStatus,
            'KalturaCameraScheduleResourceOrderBy': KalturaCameraScheduleResourceOrderBy,
            'KalturaEntryScheduleEventOrderBy': KalturaEntryScheduleEventOrderBy,
            'KalturaLiveEntryScheduleResourceOrderBy': KalturaLiveEntryScheduleResourceOrderBy,
            'KalturaLiveStreamScheduleEventOrderBy': KalturaLiveStreamScheduleEventOrderBy,
            'KalturaLocationScheduleResourceOrderBy': KalturaLocationScheduleResourceOrderBy,
            'KalturaRecordScheduleEventOrderBy': KalturaRecordScheduleEventOrderBy,
            'KalturaScheduleEventOrderBy': KalturaScheduleEventOrderBy,
            'KalturaScheduleEventRecurrenceDay': KalturaScheduleEventRecurrenceDay,
            'KalturaScheduleEventRecurrenceFrequency': KalturaScheduleEventRecurrenceFrequency,
            'KalturaScheduleEventResourceOrderBy': KalturaScheduleEventResourceOrderBy,
            'KalturaScheduleResourceOrderBy': KalturaScheduleResourceOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaScheduleEventRecurrence': KalturaScheduleEventRecurrence,
            'KalturaScheduleEvent': KalturaScheduleEvent,
            'KalturaScheduleEventResource': KalturaScheduleEventResource,
            'KalturaScheduleResource': KalturaScheduleResource,
            'KalturaCameraScheduleResource': KalturaCameraScheduleResource,
            'KalturaEntryScheduleEvent': KalturaEntryScheduleEvent,
            'KalturaLiveEntryScheduleResource': KalturaLiveEntryScheduleResource,
            'KalturaLocationScheduleResource': KalturaLocationScheduleResource,
            'KalturaScheduleEventListResponse': KalturaScheduleEventListResponse,
            'KalturaScheduleEventResourceListResponse': KalturaScheduleEventResourceListResponse,
            'KalturaScheduleResourceListResponse': KalturaScheduleResourceListResponse,
            'KalturaLiveStreamScheduleEvent': KalturaLiveStreamScheduleEvent,
            'KalturaRecordScheduleEvent': KalturaRecordScheduleEvent,
            'KalturaScheduleEventBaseFilter': KalturaScheduleEventBaseFilter,
            'KalturaScheduleEventResourceBaseFilter': KalturaScheduleEventResourceBaseFilter,
            'KalturaScheduleResourceBaseFilter': KalturaScheduleResourceBaseFilter,
            'KalturaScheduleEventFilter': KalturaScheduleEventFilter,
            'KalturaScheduleEventResourceFilter': KalturaScheduleEventResourceFilter,
            'KalturaScheduleResourceFilter': KalturaScheduleResourceFilter,
            'KalturaCameraScheduleResourceBaseFilter': KalturaCameraScheduleResourceBaseFilter,
            'KalturaEntryScheduleEventBaseFilter': KalturaEntryScheduleEventBaseFilter,
            'KalturaLiveEntryScheduleResourceBaseFilter': KalturaLiveEntryScheduleResourceBaseFilter,
            'KalturaLocationScheduleResourceBaseFilter': KalturaLocationScheduleResourceBaseFilter,
            'KalturaCameraScheduleResourceFilter': KalturaCameraScheduleResourceFilter,
            'KalturaEntryScheduleEventFilter': KalturaEntryScheduleEventFilter,
            'KalturaLiveEntryScheduleResourceFilter': KalturaLiveEntryScheduleResourceFilter,
            'KalturaLocationScheduleResourceFilter': KalturaLocationScheduleResourceFilter,
            'KalturaLiveStreamScheduleEventBaseFilter': KalturaLiveStreamScheduleEventBaseFilter,
            'KalturaRecordScheduleEventBaseFilter': KalturaRecordScheduleEventBaseFilter,
            'KalturaLiveStreamScheduleEventFilter': KalturaLiveStreamScheduleEventFilter,
            'KalturaRecordScheduleEventFilter': KalturaRecordScheduleEventFilter,
        }

    # @return string
    def getName(self):
        return 'schedule'

