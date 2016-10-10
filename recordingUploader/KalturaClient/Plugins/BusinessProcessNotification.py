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
from EventNotification import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessAbortNotificationTemplateOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    ID_ASC = "+id"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    ID_DESC = "-id"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessNotificationTemplateOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    ID_ASC = "+id"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    ID_DESC = "-id"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessProvider(object):
    ACTIVITI = "activitiBusinessProcessNotification.Activiti"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessServerOrderBy(object):
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
class KalturaBusinessProcessServerStatus(object):
    DISABLED = "1"
    ENABLED = "2"
    DELETED = "3"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessSignalNotificationTemplateOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    ID_ASC = "+id"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    ID_DESC = "-id"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessStartNotificationTemplateOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    ID_ASC = "+id"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    ID_DESC = "-id"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessCase(KalturaObjectBase):
    def __init__(self,
            id=NotImplemented,
            businessProcessId=NotImplemented,
            businessProcessStartNotificationTemplateId=NotImplemented,
            suspended=NotImplemented,
            activityId=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var string
        self.id = id

        # @var string
        self.businessProcessId = businessProcessId

        # @var int
        self.businessProcessStartNotificationTemplateId = businessProcessStartNotificationTemplateId

        # @var bool
        self.suspended = suspended

        # @var string
        self.activityId = activityId


    PROPERTY_LOADERS = {
        'id': getXmlNodeText, 
        'businessProcessId': getXmlNodeText, 
        'businessProcessStartNotificationTemplateId': getXmlNodeInt, 
        'suspended': getXmlNodeBool, 
        'activityId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessCase.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessCase")
        kparams.addStringIfDefined("id", self.id)
        kparams.addStringIfDefined("businessProcessId", self.businessProcessId)
        kparams.addIntIfDefined("businessProcessStartNotificationTemplateId", self.businessProcessStartNotificationTemplateId)
        kparams.addBoolIfDefined("suspended", self.suspended)
        kparams.addStringIfDefined("activityId", self.activityId)
        return kparams

    def getId(self):
        return self.id

    def setId(self, newId):
        self.id = newId

    def getBusinessProcessId(self):
        return self.businessProcessId

    def setBusinessProcessId(self, newBusinessProcessId):
        self.businessProcessId = newBusinessProcessId

    def getBusinessProcessStartNotificationTemplateId(self):
        return self.businessProcessStartNotificationTemplateId

    def setBusinessProcessStartNotificationTemplateId(self, newBusinessProcessStartNotificationTemplateId):
        self.businessProcessStartNotificationTemplateId = newBusinessProcessStartNotificationTemplateId

    def getSuspended(self):
        return self.suspended

    def setSuspended(self, newSuspended):
        self.suspended = newSuspended

    def getActivityId(self):
        return self.activityId

    def setActivityId(self, newActivityId):
        self.activityId = newActivityId


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessServer(KalturaObjectBase):
    def __init__(self,
            id=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            status=NotImplemented,
            type=NotImplemented):
        KalturaObjectBase.__init__(self)

        # Auto generated identifier
        # @var int
        # @readonly
        self.id = id

        # Server creation date as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.createdAt = createdAt

        # Server update date as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.updatedAt = updatedAt

        # @var int
        # @readonly
        self.partnerId = partnerId

        # @var string
        self.name = name

        # @var string
        self.systemName = systemName

        # @var string
        self.description = description

        # @var KalturaBusinessProcessServerStatus
        # @readonly
        self.status = status

        # The type of the server, this is auto filled by the derived server object
        # @var KalturaBusinessProcessProvider
        # @readonly
        self.type = type


    PROPERTY_LOADERS = {
        'id': getXmlNodeInt, 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
        'partnerId': getXmlNodeInt, 
        'name': getXmlNodeText, 
        'systemName': getXmlNodeText, 
        'description': getXmlNodeText, 
        'status': (KalturaEnumsFactory.createString, "KalturaBusinessProcessServerStatus"), 
        'type': (KalturaEnumsFactory.createString, "KalturaBusinessProcessProvider"), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessServer.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessServer")
        kparams.addStringIfDefined("name", self.name)
        kparams.addStringIfDefined("systemName", self.systemName)
        kparams.addStringIfDefined("description", self.description)
        return kparams

    def getId(self):
        return self.id

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt

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

    def getType(self):
        return self.type


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessNotificationTemplate(KalturaEventNotificationTemplate):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            type=NotImplemented,
            status=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            manualDispatchEnabled=NotImplemented,
            automaticDispatchEnabled=NotImplemented,
            eventType=NotImplemented,
            eventObjectType=NotImplemented,
            eventConditions=NotImplemented,
            contentParameters=NotImplemented,
            userParameters=NotImplemented,
            serverId=NotImplemented,
            processId=NotImplemented,
            mainObjectCode=NotImplemented):
        KalturaEventNotificationTemplate.__init__(self,
            id,
            partnerId,
            name,
            systemName,
            description,
            type,
            status,
            createdAt,
            updatedAt,
            manualDispatchEnabled,
            automaticDispatchEnabled,
            eventType,
            eventObjectType,
            eventConditions,
            contentParameters,
            userParameters)

        # Define the integrated BPM server id
        # @var int
        self.serverId = serverId

        # Define the integrated BPM process id
        # @var string
        self.processId = processId

        # Code to load the main triggering object
        # @var string
        self.mainObjectCode = mainObjectCode


    PROPERTY_LOADERS = {
        'serverId': getXmlNodeInt, 
        'processId': getXmlNodeText, 
        'mainObjectCode': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaEventNotificationTemplate.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessNotificationTemplate.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEventNotificationTemplate.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessNotificationTemplate")
        kparams.addIntIfDefined("serverId", self.serverId)
        kparams.addStringIfDefined("processId", self.processId)
        kparams.addStringIfDefined("mainObjectCode", self.mainObjectCode)
        return kparams

    def getServerId(self):
        return self.serverId

    def setServerId(self, newServerId):
        self.serverId = newServerId

    def getProcessId(self):
        return self.processId

    def setProcessId(self, newProcessId):
        self.processId = newProcessId

    def getMainObjectCode(self):
        return self.mainObjectCode

    def setMainObjectCode(self, newMainObjectCode):
        self.mainObjectCode = newMainObjectCode


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessServerBaseFilter(KalturaFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            statusEqual=NotImplemented,
            statusNotEqual=NotImplemented,
            statusIn=NotImplemented,
            statusNotIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var int
        self.idEqual = idEqual

        # @var string
        self.idIn = idIn

        # @var string
        self.idNotIn = idNotIn

        # @var int
        self.createdAtGreaterThanOrEqual = createdAtGreaterThanOrEqual

        # @var int
        self.createdAtLessThanOrEqual = createdAtLessThanOrEqual

        # @var int
        self.updatedAtGreaterThanOrEqual = updatedAtGreaterThanOrEqual

        # @var int
        self.updatedAtLessThanOrEqual = updatedAtLessThanOrEqual

        # @var int
        self.partnerIdEqual = partnerIdEqual

        # @var string
        self.partnerIdIn = partnerIdIn

        # @var KalturaBusinessProcessServerStatus
        self.statusEqual = statusEqual

        # @var KalturaBusinessProcessServerStatus
        self.statusNotEqual = statusNotEqual

        # @var string
        self.statusIn = statusIn

        # @var string
        self.statusNotIn = statusNotIn

        # @var KalturaBusinessProcessProvider
        self.typeEqual = typeEqual

        # @var string
        self.typeIn = typeIn


    PROPERTY_LOADERS = {
        'idEqual': getXmlNodeInt, 
        'idIn': getXmlNodeText, 
        'idNotIn': getXmlNodeText, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'updatedAtGreaterThanOrEqual': getXmlNodeInt, 
        'updatedAtLessThanOrEqual': getXmlNodeInt, 
        'partnerIdEqual': getXmlNodeInt, 
        'partnerIdIn': getXmlNodeText, 
        'statusEqual': (KalturaEnumsFactory.createString, "KalturaBusinessProcessServerStatus"), 
        'statusNotEqual': (KalturaEnumsFactory.createString, "KalturaBusinessProcessServerStatus"), 
        'statusIn': getXmlNodeText, 
        'statusNotIn': getXmlNodeText, 
        'typeEqual': (KalturaEnumsFactory.createString, "KalturaBusinessProcessProvider"), 
        'typeIn': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessServerBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFilter.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessServerBaseFilter")
        kparams.addIntIfDefined("idEqual", self.idEqual)
        kparams.addStringIfDefined("idIn", self.idIn)
        kparams.addStringIfDefined("idNotIn", self.idNotIn)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        kparams.addIntIfDefined("updatedAtGreaterThanOrEqual", self.updatedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("updatedAtLessThanOrEqual", self.updatedAtLessThanOrEqual)
        kparams.addIntIfDefined("partnerIdEqual", self.partnerIdEqual)
        kparams.addStringIfDefined("partnerIdIn", self.partnerIdIn)
        kparams.addStringEnumIfDefined("statusEqual", self.statusEqual)
        kparams.addStringEnumIfDefined("statusNotEqual", self.statusNotEqual)
        kparams.addStringIfDefined("statusIn", self.statusIn)
        kparams.addStringIfDefined("statusNotIn", self.statusNotIn)
        kparams.addStringEnumIfDefined("typeEqual", self.typeEqual)
        kparams.addStringIfDefined("typeIn", self.typeIn)
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

    def getPartnerIdEqual(self):
        return self.partnerIdEqual

    def setPartnerIdEqual(self, newPartnerIdEqual):
        self.partnerIdEqual = newPartnerIdEqual

    def getPartnerIdIn(self):
        return self.partnerIdIn

    def setPartnerIdIn(self, newPartnerIdIn):
        self.partnerIdIn = newPartnerIdIn

    def getStatusEqual(self):
        return self.statusEqual

    def setStatusEqual(self, newStatusEqual):
        self.statusEqual = newStatusEqual

    def getStatusNotEqual(self):
        return self.statusNotEqual

    def setStatusNotEqual(self, newStatusNotEqual):
        self.statusNotEqual = newStatusNotEqual

    def getStatusIn(self):
        return self.statusIn

    def setStatusIn(self, newStatusIn):
        self.statusIn = newStatusIn

    def getStatusNotIn(self):
        return self.statusNotIn

    def setStatusNotIn(self, newStatusNotIn):
        self.statusNotIn = newStatusNotIn

    def getTypeEqual(self):
        return self.typeEqual

    def setTypeEqual(self, newTypeEqual):
        self.typeEqual = newTypeEqual

    def getTypeIn(self):
        return self.typeIn

    def setTypeIn(self, newTypeIn):
        self.typeIn = newTypeIn


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessServerListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaBusinessProcessServer
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaBusinessProcessServer), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessServerListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessServerListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessAbortNotificationTemplate(KalturaBusinessProcessNotificationTemplate):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            type=NotImplemented,
            status=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            manualDispatchEnabled=NotImplemented,
            automaticDispatchEnabled=NotImplemented,
            eventType=NotImplemented,
            eventObjectType=NotImplemented,
            eventConditions=NotImplemented,
            contentParameters=NotImplemented,
            userParameters=NotImplemented,
            serverId=NotImplemented,
            processId=NotImplemented,
            mainObjectCode=NotImplemented):
        KalturaBusinessProcessNotificationTemplate.__init__(self,
            id,
            partnerId,
            name,
            systemName,
            description,
            type,
            status,
            createdAt,
            updatedAt,
            manualDispatchEnabled,
            automaticDispatchEnabled,
            eventType,
            eventObjectType,
            eventConditions,
            contentParameters,
            userParameters,
            serverId,
            processId,
            mainObjectCode)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaBusinessProcessNotificationTemplate.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessAbortNotificationTemplate.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBusinessProcessNotificationTemplate.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessAbortNotificationTemplate")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessNotificationDispatchJobData(KalturaEventNotificationDispatchJobData):
    def __init__(self,
            templateId=NotImplemented,
            contentParameters=NotImplemented,
            server=NotImplemented,
            caseId=NotImplemented):
        KalturaEventNotificationDispatchJobData.__init__(self,
            templateId,
            contentParameters)

        # @var KalturaBusinessProcessServer
        self.server = server

        # @var string
        self.caseId = caseId


    PROPERTY_LOADERS = {
        'server': (KalturaObjectFactory.create, KalturaBusinessProcessServer), 
        'caseId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaEventNotificationDispatchJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessNotificationDispatchJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEventNotificationDispatchJobData.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessNotificationDispatchJobData")
        kparams.addObjectIfDefined("server", self.server)
        kparams.addStringIfDefined("caseId", self.caseId)
        return kparams

    def getServer(self):
        return self.server

    def setServer(self, newServer):
        self.server = newServer

    def getCaseId(self):
        return self.caseId

    def setCaseId(self, newCaseId):
        self.caseId = newCaseId


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessServerFilter(KalturaBusinessProcessServerBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            idNotIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            statusEqual=NotImplemented,
            statusNotEqual=NotImplemented,
            statusIn=NotImplemented,
            statusNotIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaBusinessProcessServerBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            idNotIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            partnerIdEqual,
            partnerIdIn,
            statusEqual,
            statusNotEqual,
            statusIn,
            statusNotIn,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaBusinessProcessServerBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessServerFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBusinessProcessServerBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessServerFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessSignalNotificationTemplate(KalturaBusinessProcessNotificationTemplate):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            type=NotImplemented,
            status=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            manualDispatchEnabled=NotImplemented,
            automaticDispatchEnabled=NotImplemented,
            eventType=NotImplemented,
            eventObjectType=NotImplemented,
            eventConditions=NotImplemented,
            contentParameters=NotImplemented,
            userParameters=NotImplemented,
            serverId=NotImplemented,
            processId=NotImplemented,
            mainObjectCode=NotImplemented,
            message=NotImplemented,
            eventId=NotImplemented):
        KalturaBusinessProcessNotificationTemplate.__init__(self,
            id,
            partnerId,
            name,
            systemName,
            description,
            type,
            status,
            createdAt,
            updatedAt,
            manualDispatchEnabled,
            automaticDispatchEnabled,
            eventType,
            eventObjectType,
            eventConditions,
            contentParameters,
            userParameters,
            serverId,
            processId,
            mainObjectCode)

        # Define the message to be sent
        # @var string
        self.message = message

        # Define the event that waiting to the signal
        # @var string
        self.eventId = eventId


    PROPERTY_LOADERS = {
        'message': getXmlNodeText, 
        'eventId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaBusinessProcessNotificationTemplate.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessSignalNotificationTemplate.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBusinessProcessNotificationTemplate.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessSignalNotificationTemplate")
        kparams.addStringIfDefined("message", self.message)
        kparams.addStringIfDefined("eventId", self.eventId)
        return kparams

    def getMessage(self):
        return self.message

    def setMessage(self, newMessage):
        self.message = newMessage

    def getEventId(self):
        return self.eventId

    def setEventId(self, newEventId):
        self.eventId = newEventId


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessStartNotificationTemplate(KalturaBusinessProcessNotificationTemplate):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            type=NotImplemented,
            status=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            manualDispatchEnabled=NotImplemented,
            automaticDispatchEnabled=NotImplemented,
            eventType=NotImplemented,
            eventObjectType=NotImplemented,
            eventConditions=NotImplemented,
            contentParameters=NotImplemented,
            userParameters=NotImplemented,
            serverId=NotImplemented,
            processId=NotImplemented,
            mainObjectCode=NotImplemented,
            abortOnDeletion=NotImplemented):
        KalturaBusinessProcessNotificationTemplate.__init__(self,
            id,
            partnerId,
            name,
            systemName,
            description,
            type,
            status,
            createdAt,
            updatedAt,
            manualDispatchEnabled,
            automaticDispatchEnabled,
            eventType,
            eventObjectType,
            eventConditions,
            contentParameters,
            userParameters,
            serverId,
            processId,
            mainObjectCode)

        # Abort the process automatically if the triggering object deleted
        # @var bool
        self.abortOnDeletion = abortOnDeletion


    PROPERTY_LOADERS = {
        'abortOnDeletion': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaBusinessProcessNotificationTemplate.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessStartNotificationTemplate.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBusinessProcessNotificationTemplate.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessStartNotificationTemplate")
        kparams.addBoolIfDefined("abortOnDeletion", self.abortOnDeletion)
        return kparams

    def getAbortOnDeletion(self):
        return self.abortOnDeletion

    def setAbortOnDeletion(self, newAbortOnDeletion):
        self.abortOnDeletion = newAbortOnDeletion


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessNotificationTemplateBaseFilter(KalturaEventNotificationTemplateFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaEventNotificationTemplateFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            systemNameEqual,
            systemNameIn,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaEventNotificationTemplateFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessNotificationTemplateBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEventNotificationTemplateFilter.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessNotificationTemplateBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessNotificationTemplateFilter(KalturaBusinessProcessNotificationTemplateBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaBusinessProcessNotificationTemplateBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            systemNameEqual,
            systemNameIn,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaBusinessProcessNotificationTemplateBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessNotificationTemplateFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBusinessProcessNotificationTemplateBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessNotificationTemplateFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessAbortNotificationTemplateBaseFilter(KalturaBusinessProcessNotificationTemplateFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaBusinessProcessNotificationTemplateFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            systemNameEqual,
            systemNameIn,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaBusinessProcessNotificationTemplateFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessAbortNotificationTemplateBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBusinessProcessNotificationTemplateFilter.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessAbortNotificationTemplateBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessSignalNotificationTemplateBaseFilter(KalturaBusinessProcessNotificationTemplateFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaBusinessProcessNotificationTemplateFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            systemNameEqual,
            systemNameIn,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaBusinessProcessNotificationTemplateFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessSignalNotificationTemplateBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBusinessProcessNotificationTemplateFilter.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessSignalNotificationTemplateBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessStartNotificationTemplateBaseFilter(KalturaBusinessProcessNotificationTemplateFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaBusinessProcessNotificationTemplateFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            systemNameEqual,
            systemNameIn,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaBusinessProcessNotificationTemplateFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessStartNotificationTemplateBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBusinessProcessNotificationTemplateFilter.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessStartNotificationTemplateBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessAbortNotificationTemplateFilter(KalturaBusinessProcessAbortNotificationTemplateBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaBusinessProcessAbortNotificationTemplateBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            systemNameEqual,
            systemNameIn,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaBusinessProcessAbortNotificationTemplateBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessAbortNotificationTemplateFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBusinessProcessAbortNotificationTemplateBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessAbortNotificationTemplateFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessSignalNotificationTemplateFilter(KalturaBusinessProcessSignalNotificationTemplateBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaBusinessProcessSignalNotificationTemplateBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            systemNameEqual,
            systemNameIn,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaBusinessProcessSignalNotificationTemplateBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessSignalNotificationTemplateFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBusinessProcessSignalNotificationTemplateBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessSignalNotificationTemplateFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessStartNotificationTemplateFilter(KalturaBusinessProcessStartNotificationTemplateBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented):
        KalturaBusinessProcessStartNotificationTemplateBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            systemNameEqual,
            systemNameIn,
            typeEqual,
            typeIn,
            statusEqual,
            statusIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaBusinessProcessStartNotificationTemplateBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBusinessProcessStartNotificationTemplateFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBusinessProcessStartNotificationTemplateBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaBusinessProcessStartNotificationTemplateFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaBusinessProcessCaseService(KalturaServiceBase):
    """Business-process case service lets you get information about processes"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def abort(self, objectType, objectId, businessProcessStartNotificationTemplateId):
        """Abort business-process case"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("objectType", objectType)
        kparams.addStringIfDefined("objectId", objectId)
        kparams.addIntIfDefined("businessProcessStartNotificationTemplateId", businessProcessStartNotificationTemplateId);
        self.client.queueServiceActionCall("businessprocessnotification_businessprocesscase", "abort", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()

    def serveDiagram(self, objectType, objectId, businessProcessStartNotificationTemplateId):
        """Server business-process case diagram"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("objectType", objectType)
        kparams.addStringIfDefined("objectId", objectId)
        kparams.addIntIfDefined("businessProcessStartNotificationTemplateId", businessProcessStartNotificationTemplateId);
        self.client.queueServiceActionCall('businessprocessnotification_businessprocesscase', 'serveDiagram', None ,kparams)
        return self.client.getServeUrl()

    def list(self, objectType, objectId):
        """list business-process cases"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("objectType", objectType)
        kparams.addStringIfDefined("objectId", objectId)
        self.client.queueServiceActionCall("businessprocessnotification_businessprocesscase", "list", KalturaBusinessProcessCase, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.createArray(resultNode, KalturaBusinessProcessCase)

########## main ##########
class KalturaBusinessProcessNotificationClientPlugin(KalturaClientPlugin):
    # KalturaBusinessProcessNotificationClientPlugin
    instance = None

    # @return KalturaBusinessProcessNotificationClientPlugin
    @staticmethod
    def get():
        if KalturaBusinessProcessNotificationClientPlugin.instance == None:
            KalturaBusinessProcessNotificationClientPlugin.instance = KalturaBusinessProcessNotificationClientPlugin()
        return KalturaBusinessProcessNotificationClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'businessProcessCase': KalturaBusinessProcessCaseService,
        }

    def getEnums(self):
        return {
            'KalturaBusinessProcessAbortNotificationTemplateOrderBy': KalturaBusinessProcessAbortNotificationTemplateOrderBy,
            'KalturaBusinessProcessNotificationTemplateOrderBy': KalturaBusinessProcessNotificationTemplateOrderBy,
            'KalturaBusinessProcessProvider': KalturaBusinessProcessProvider,
            'KalturaBusinessProcessServerOrderBy': KalturaBusinessProcessServerOrderBy,
            'KalturaBusinessProcessServerStatus': KalturaBusinessProcessServerStatus,
            'KalturaBusinessProcessSignalNotificationTemplateOrderBy': KalturaBusinessProcessSignalNotificationTemplateOrderBy,
            'KalturaBusinessProcessStartNotificationTemplateOrderBy': KalturaBusinessProcessStartNotificationTemplateOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaBusinessProcessCase': KalturaBusinessProcessCase,
            'KalturaBusinessProcessServer': KalturaBusinessProcessServer,
            'KalturaBusinessProcessNotificationTemplate': KalturaBusinessProcessNotificationTemplate,
            'KalturaBusinessProcessServerBaseFilter': KalturaBusinessProcessServerBaseFilter,
            'KalturaBusinessProcessServerListResponse': KalturaBusinessProcessServerListResponse,
            'KalturaBusinessProcessAbortNotificationTemplate': KalturaBusinessProcessAbortNotificationTemplate,
            'KalturaBusinessProcessNotificationDispatchJobData': KalturaBusinessProcessNotificationDispatchJobData,
            'KalturaBusinessProcessServerFilter': KalturaBusinessProcessServerFilter,
            'KalturaBusinessProcessSignalNotificationTemplate': KalturaBusinessProcessSignalNotificationTemplate,
            'KalturaBusinessProcessStartNotificationTemplate': KalturaBusinessProcessStartNotificationTemplate,
            'KalturaBusinessProcessNotificationTemplateBaseFilter': KalturaBusinessProcessNotificationTemplateBaseFilter,
            'KalturaBusinessProcessNotificationTemplateFilter': KalturaBusinessProcessNotificationTemplateFilter,
            'KalturaBusinessProcessAbortNotificationTemplateBaseFilter': KalturaBusinessProcessAbortNotificationTemplateBaseFilter,
            'KalturaBusinessProcessSignalNotificationTemplateBaseFilter': KalturaBusinessProcessSignalNotificationTemplateBaseFilter,
            'KalturaBusinessProcessStartNotificationTemplateBaseFilter': KalturaBusinessProcessStartNotificationTemplateBaseFilter,
            'KalturaBusinessProcessAbortNotificationTemplateFilter': KalturaBusinessProcessAbortNotificationTemplateFilter,
            'KalturaBusinessProcessSignalNotificationTemplateFilter': KalturaBusinessProcessSignalNotificationTemplateFilter,
            'KalturaBusinessProcessStartNotificationTemplateFilter': KalturaBusinessProcessStartNotificationTemplateFilter,
        }

    # @return string
    def getName(self):
        return 'businessProcessNotification'

