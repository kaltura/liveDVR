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
class KalturaEventNotificationTemplateStatus(object):
    DISABLED = 1
    ACTIVE = 2
    DELETED = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaEventNotificationEventObjectType(object):
    AD_CUE_POINT = "adCuePointEventNotifications.AdCuePoint"
    ANNOTATION = "annotationEventNotifications.Annotation"
    ATTACHMENT_ASSET = "attachmentAssetEventNotifications.AttachmentAsset"
    CAPTION_ASSET = "captionAssetEventNotifications.CaptionAsset"
    CODE_CUE_POINT = "codeCuePointEventNotifications.CodeCuePoint"
    DISTRIBUTION_PROFILE = "contentDistributionEventNotifications.DistributionProfile"
    ENTRY_DISTRIBUTION = "contentDistributionEventNotifications.EntryDistribution"
    CUE_POINT = "cuePointEventNotifications.CuePoint"
    DROP_FOLDER = "dropFolderEventNotifications.DropFolder"
    DROP_FOLDER_FILE = "dropFolderEventNotifications.DropFolderFile"
    METADATA = "metadataEventNotifications.Metadata"
    TRANSCRIPT_ASSET = "transcriptAssetEventNotifications.TranscriptAsset"
    ENTRY = "1"
    CATEGORY = "2"
    ASSET = "3"
    FLAVORASSET = "4"
    THUMBASSET = "5"
    KUSER = "8"
    ACCESSCONTROL = "9"
    BATCHJOB = "10"
    BULKUPLOADRESULT = "11"
    CATEGORYKUSER = "12"
    CONVERSIONPROFILE2 = "14"
    FLAVORPARAMS = "15"
    FLAVORPARAMSCONVERSIONPROFILE = "16"
    FLAVORPARAMSOUTPUT = "17"
    GENERICSYNDICATIONFEED = "18"
    KUSERTOUSERROLE = "19"
    PARTNER = "20"
    PERMISSION = "21"
    PERMISSIONITEM = "22"
    PERMISSIONTOPERMISSIONITEM = "23"
    SCHEDULER = "24"
    SCHEDULERCONFIG = "25"
    SCHEDULERSTATUS = "26"
    SCHEDULERWORKER = "27"
    STORAGEPROFILE = "28"
    SYNDICATIONFEED = "29"
    THUMBPARAMS = "31"
    THUMBPARAMSOUTPUT = "32"
    UPLOADTOKEN = "33"
    USERLOGINDATA = "34"
    USERROLE = "35"
    WIDGET = "36"
    CATEGORYENTRY = "37"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaEventNotificationEventType(object):
    INTEGRATION_JOB_CLOSED = "integrationEventNotifications.INTEGRATION_JOB_CLOSED"
    BATCH_JOB_STATUS = "1"
    OBJECT_ADDED = "2"
    OBJECT_CHANGED = "3"
    OBJECT_COPIED = "4"
    OBJECT_CREATED = "5"
    OBJECT_DATA_CHANGED = "6"
    OBJECT_DELETED = "7"
    OBJECT_ERASED = "8"
    OBJECT_READY_FOR_REPLACMENT = "9"
    OBJECT_SAVED = "10"
    OBJECT_UPDATED = "11"
    OBJECT_REPLACED = "12"
    OBJECT_READY_FOR_INDEX = "13"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaEventNotificationTemplateOrderBy(object):
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
class KalturaEventNotificationTemplateType(object):
    BPM_ABORT = "businessProcessNotification.BusinessProcessAbort"
    BPM_SIGNAL = "businessProcessNotification.BusinessProcessSignal"
    BPM_START = "businessProcessNotification.BusinessProcessStart"
    EMAIL = "emailNotification.Email"
    HTTP = "httpNotification.Http"
    PUSH = "pushNotification.Push"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaEventNotificationParameter(KalturaObjectBase):
    def __init__(self,
            key=NotImplemented,
            description=NotImplemented,
            value=NotImplemented):
        KalturaObjectBase.__init__(self)

        # The key in the subject and body to be replaced with the dynamic value
        # @var string
        self.key = key

        # @var string
        self.description = description

        # The dynamic value to be placed in the final output
        # @var KalturaStringValue
        self.value = value


    PROPERTY_LOADERS = {
        'key': getXmlNodeText, 
        'description': getXmlNodeText, 
        'value': (KalturaObjectFactory.create, KalturaStringValue), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEventNotificationParameter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaEventNotificationParameter")
        kparams.addStringIfDefined("key", self.key)
        kparams.addStringIfDefined("description", self.description)
        kparams.addObjectIfDefined("value", self.value)
        return kparams

    def getKey(self):
        return self.key

    def setKey(self, newKey):
        self.key = newKey

    def getDescription(self):
        return self.description

    def setDescription(self, newDescription):
        self.description = newDescription

    def getValue(self):
        return self.value

    def setValue(self, newValue):
        self.value = newValue


# @package Kaltura
# @subpackage Client
class KalturaEventNotificationTemplate(KalturaObjectBase):
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
            userParameters=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var int
        # @readonly
        self.id = id

        # @var int
        # @readonly
        self.partnerId = partnerId

        # @var string
        self.name = name

        # @var string
        self.systemName = systemName

        # @var string
        self.description = description

        # @var KalturaEventNotificationTemplateType
        # @insertonly
        self.type = type

        # @var KalturaEventNotificationTemplateStatus
        # @readonly
        self.status = status

        # @var int
        # @readonly
        self.createdAt = createdAt

        # @var int
        # @readonly
        self.updatedAt = updatedAt

        # Define that the template could be dispatched manually from the API
        # @var bool
        self.manualDispatchEnabled = manualDispatchEnabled

        # Define that the template could be dispatched automatically by the system
        # @var bool
        self.automaticDispatchEnabled = automaticDispatchEnabled

        # Define the event that should trigger this notification
        # @var KalturaEventNotificationEventType
        self.eventType = eventType

        # Define the object that raied the event that should trigger this notification
        # @var KalturaEventNotificationEventObjectType
        self.eventObjectType = eventObjectType

        # Define the conditions that cause this notification to be triggered
        # @var array of KalturaCondition
        self.eventConditions = eventConditions

        # Define the content dynamic parameters
        # @var array of KalturaEventNotificationParameter
        self.contentParameters = contentParameters

        # Define the content dynamic parameters
        # @var array of KalturaEventNotificationParameter
        self.userParameters = userParameters


    PROPERTY_LOADERS = {
        'id': getXmlNodeInt, 
        'partnerId': getXmlNodeInt, 
        'name': getXmlNodeText, 
        'systemName': getXmlNodeText, 
        'description': getXmlNodeText, 
        'type': (KalturaEnumsFactory.createString, "KalturaEventNotificationTemplateType"), 
        'status': (KalturaEnumsFactory.createInt, "KalturaEventNotificationTemplateStatus"), 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
        'manualDispatchEnabled': getXmlNodeBool, 
        'automaticDispatchEnabled': getXmlNodeBool, 
        'eventType': (KalturaEnumsFactory.createString, "KalturaEventNotificationEventType"), 
        'eventObjectType': (KalturaEnumsFactory.createString, "KalturaEventNotificationEventObjectType"), 
        'eventConditions': (KalturaObjectFactory.createArray, KalturaCondition), 
        'contentParameters': (KalturaObjectFactory.createArray, KalturaEventNotificationParameter), 
        'userParameters': (KalturaObjectFactory.createArray, KalturaEventNotificationParameter), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEventNotificationTemplate.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaEventNotificationTemplate")
        kparams.addStringIfDefined("name", self.name)
        kparams.addStringIfDefined("systemName", self.systemName)
        kparams.addStringIfDefined("description", self.description)
        kparams.addStringEnumIfDefined("type", self.type)
        kparams.addBoolIfDefined("manualDispatchEnabled", self.manualDispatchEnabled)
        kparams.addBoolIfDefined("automaticDispatchEnabled", self.automaticDispatchEnabled)
        kparams.addStringEnumIfDefined("eventType", self.eventType)
        kparams.addStringEnumIfDefined("eventObjectType", self.eventObjectType)
        kparams.addArrayIfDefined("eventConditions", self.eventConditions)
        kparams.addArrayIfDefined("contentParameters", self.contentParameters)
        kparams.addArrayIfDefined("userParameters", self.userParameters)
        return kparams

    def getId(self):
        return self.id

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

    def getType(self):
        return self.type

    def setType(self, newType):
        self.type = newType

    def getStatus(self):
        return self.status

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt

    def getManualDispatchEnabled(self):
        return self.manualDispatchEnabled

    def setManualDispatchEnabled(self, newManualDispatchEnabled):
        self.manualDispatchEnabled = newManualDispatchEnabled

    def getAutomaticDispatchEnabled(self):
        return self.automaticDispatchEnabled

    def setAutomaticDispatchEnabled(self, newAutomaticDispatchEnabled):
        self.automaticDispatchEnabled = newAutomaticDispatchEnabled

    def getEventType(self):
        return self.eventType

    def setEventType(self, newEventType):
        self.eventType = newEventType

    def getEventObjectType(self):
        return self.eventObjectType

    def setEventObjectType(self, newEventObjectType):
        self.eventObjectType = newEventObjectType

    def getEventConditions(self):
        return self.eventConditions

    def setEventConditions(self, newEventConditions):
        self.eventConditions = newEventConditions

    def getContentParameters(self):
        return self.contentParameters

    def setContentParameters(self, newContentParameters):
        self.contentParameters = newContentParameters

    def getUserParameters(self):
        return self.userParameters

    def setUserParameters(self, newUserParameters):
        self.userParameters = newUserParameters


# @package Kaltura
# @subpackage Client
class KalturaEventFieldCondition(KalturaCondition):
    def __init__(self,
            type=NotImplemented,
            description=NotImplemented,
            not_=NotImplemented,
            field=NotImplemented):
        KalturaCondition.__init__(self,
            type,
            description,
            not_)

        # The field to be evaluated at runtime
        # @var KalturaBooleanField
        self.field = field


    PROPERTY_LOADERS = {
        'field': (KalturaObjectFactory.create, KalturaBooleanField), 
    }

    def fromXml(self, node):
        KalturaCondition.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEventFieldCondition.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCondition.toParams(self)
        kparams.put("objectType", "KalturaEventFieldCondition")
        kparams.addObjectIfDefined("field", self.field)
        return kparams

    def getField(self):
        return self.field

    def setField(self, newField):
        self.field = newField


# @package Kaltura
# @subpackage Client
class KalturaEventNotificationArrayParameter(KalturaEventNotificationParameter):
    def __init__(self,
            key=NotImplemented,
            description=NotImplemented,
            value=NotImplemented,
            values=NotImplemented,
            allowedValues=NotImplemented):
        KalturaEventNotificationParameter.__init__(self,
            key,
            description,
            value)

        # @var array of KalturaString
        self.values = values

        # Used to restrict the values to close list
        # @var array of KalturaStringValue
        self.allowedValues = allowedValues


    PROPERTY_LOADERS = {
        'values': (KalturaObjectFactory.createArray, KalturaString), 
        'allowedValues': (KalturaObjectFactory.createArray, KalturaStringValue), 
    }

    def fromXml(self, node):
        KalturaEventNotificationParameter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEventNotificationArrayParameter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEventNotificationParameter.toParams(self)
        kparams.put("objectType", "KalturaEventNotificationArrayParameter")
        kparams.addArrayIfDefined("values", self.values)
        kparams.addArrayIfDefined("allowedValues", self.allowedValues)
        return kparams

    def getValues(self):
        return self.values

    def setValues(self, newValues):
        self.values = newValues

    def getAllowedValues(self):
        return self.allowedValues

    def setAllowedValues(self, newAllowedValues):
        self.allowedValues = newAllowedValues


# @package Kaltura
# @subpackage Client
class KalturaEventNotificationDispatchJobData(KalturaJobData):
    def __init__(self,
            templateId=NotImplemented,
            contentParameters=NotImplemented):
        KalturaJobData.__init__(self)

        # @var int
        self.templateId = templateId

        # Define the content dynamic parameters
        # @var array of KalturaKeyValue
        self.contentParameters = contentParameters


    PROPERTY_LOADERS = {
        'templateId': getXmlNodeInt, 
        'contentParameters': (KalturaObjectFactory.createArray, KalturaKeyValue), 
    }

    def fromXml(self, node):
        KalturaJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEventNotificationDispatchJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaJobData.toParams(self)
        kparams.put("objectType", "KalturaEventNotificationDispatchJobData")
        kparams.addIntIfDefined("templateId", self.templateId)
        kparams.addArrayIfDefined("contentParameters", self.contentParameters)
        return kparams

    def getTemplateId(self):
        return self.templateId

    def setTemplateId(self, newTemplateId):
        self.templateId = newTemplateId

    def getContentParameters(self):
        return self.contentParameters

    def setContentParameters(self, newContentParameters):
        self.contentParameters = newContentParameters


# @package Kaltura
# @subpackage Client
class KalturaEventNotificationScope(KalturaScope):
    def __init__(self,
            objectId=NotImplemented,
            scopeObjectType=NotImplemented):
        KalturaScope.__init__(self)

        # @var string
        self.objectId = objectId

        # @var KalturaEventNotificationEventObjectType
        self.scopeObjectType = scopeObjectType


    PROPERTY_LOADERS = {
        'objectId': getXmlNodeText, 
        'scopeObjectType': (KalturaEnumsFactory.createString, "KalturaEventNotificationEventObjectType"), 
    }

    def fromXml(self, node):
        KalturaScope.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEventNotificationScope.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaScope.toParams(self)
        kparams.put("objectType", "KalturaEventNotificationScope")
        kparams.addStringIfDefined("objectId", self.objectId)
        kparams.addStringEnumIfDefined("scopeObjectType", self.scopeObjectType)
        return kparams

    def getObjectId(self):
        return self.objectId

    def setObjectId(self, newObjectId):
        self.objectId = newObjectId

    def getScopeObjectType(self):
        return self.scopeObjectType

    def setScopeObjectType(self, newScopeObjectType):
        self.scopeObjectType = newScopeObjectType


# @package Kaltura
# @subpackage Client
class KalturaEventNotificationTemplateBaseFilter(KalturaFilter):
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
        KalturaFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var int
        self.idEqual = idEqual

        # @var string
        self.idIn = idIn

        # @var int
        self.partnerIdEqual = partnerIdEqual

        # @var string
        self.partnerIdIn = partnerIdIn

        # @var string
        self.systemNameEqual = systemNameEqual

        # @var string
        self.systemNameIn = systemNameIn

        # @var KalturaEventNotificationTemplateType
        self.typeEqual = typeEqual

        # @var string
        self.typeIn = typeIn

        # @var KalturaEventNotificationTemplateStatus
        self.statusEqual = statusEqual

        # @var string
        self.statusIn = statusIn

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
        'partnerIdEqual': getXmlNodeInt, 
        'partnerIdIn': getXmlNodeText, 
        'systemNameEqual': getXmlNodeText, 
        'systemNameIn': getXmlNodeText, 
        'typeEqual': (KalturaEnumsFactory.createString, "KalturaEventNotificationTemplateType"), 
        'typeIn': getXmlNodeText, 
        'statusEqual': (KalturaEnumsFactory.createInt, "KalturaEventNotificationTemplateStatus"), 
        'statusIn': getXmlNodeText, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'updatedAtGreaterThanOrEqual': getXmlNodeInt, 
        'updatedAtLessThanOrEqual': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEventNotificationTemplateBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFilter.toParams(self)
        kparams.put("objectType", "KalturaEventNotificationTemplateBaseFilter")
        kparams.addIntIfDefined("idEqual", self.idEqual)
        kparams.addStringIfDefined("idIn", self.idIn)
        kparams.addIntIfDefined("partnerIdEqual", self.partnerIdEqual)
        kparams.addStringIfDefined("partnerIdIn", self.partnerIdIn)
        kparams.addStringIfDefined("systemNameEqual", self.systemNameEqual)
        kparams.addStringIfDefined("systemNameIn", self.systemNameIn)
        kparams.addStringEnumIfDefined("typeEqual", self.typeEqual)
        kparams.addStringIfDefined("typeIn", self.typeIn)
        kparams.addIntEnumIfDefined("statusEqual", self.statusEqual)
        kparams.addStringIfDefined("statusIn", self.statusIn)
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

    def getPartnerIdEqual(self):
        return self.partnerIdEqual

    def setPartnerIdEqual(self, newPartnerIdEqual):
        self.partnerIdEqual = newPartnerIdEqual

    def getPartnerIdIn(self):
        return self.partnerIdIn

    def setPartnerIdIn(self, newPartnerIdIn):
        self.partnerIdIn = newPartnerIdIn

    def getSystemNameEqual(self):
        return self.systemNameEqual

    def setSystemNameEqual(self, newSystemNameEqual):
        self.systemNameEqual = newSystemNameEqual

    def getSystemNameIn(self):
        return self.systemNameIn

    def setSystemNameIn(self, newSystemNameIn):
        self.systemNameIn = newSystemNameIn

    def getTypeEqual(self):
        return self.typeEqual

    def setTypeEqual(self, newTypeEqual):
        self.typeEqual = newTypeEqual

    def getTypeIn(self):
        return self.typeIn

    def setTypeIn(self, newTypeIn):
        self.typeIn = newTypeIn

    def getStatusEqual(self):
        return self.statusEqual

    def setStatusEqual(self, newStatusEqual):
        self.statusEqual = newStatusEqual

    def getStatusIn(self):
        return self.statusIn

    def setStatusIn(self, newStatusIn):
        self.statusIn = newStatusIn

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
class KalturaEventNotificationTemplateListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaEventNotificationTemplate
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaEventNotificationTemplate), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEventNotificationTemplateListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaEventNotificationTemplateListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaEventObjectChangedCondition(KalturaCondition):
    def __init__(self,
            type=NotImplemented,
            description=NotImplemented,
            not_=NotImplemented,
            modifiedColumns=NotImplemented):
        KalturaCondition.__init__(self,
            type,
            description,
            not_)

        # Comma seperated column names to be tested
        # @var string
        self.modifiedColumns = modifiedColumns


    PROPERTY_LOADERS = {
        'modifiedColumns': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaCondition.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEventObjectChangedCondition.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCondition.toParams(self)
        kparams.put("objectType", "KalturaEventObjectChangedCondition")
        kparams.addStringIfDefined("modifiedColumns", self.modifiedColumns)
        return kparams

    def getModifiedColumns(self):
        return self.modifiedColumns

    def setModifiedColumns(self, newModifiedColumns):
        self.modifiedColumns = newModifiedColumns


# @package Kaltura
# @subpackage Client
class KalturaEventNotificationTemplateFilter(KalturaEventNotificationTemplateBaseFilter):
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
        KalturaEventNotificationTemplateBaseFilter.__init__(self,
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
        KalturaEventNotificationTemplateBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEventNotificationTemplateFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEventNotificationTemplateBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaEventNotificationTemplateFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaEventNotificationTemplateService(KalturaServiceBase):
    """Event notification template service lets you create and manage event notification templates"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, eventNotificationTemplate):
        """This action allows for the creation of new backend event types in the system. This action requires access to the Kaltura server Admin Console. If you're looking to register to existing event types, please use the clone action instead."""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("eventNotificationTemplate", eventNotificationTemplate)
        self.client.queueServiceActionCall("eventnotification_eventnotificationtemplate", "add", KalturaEventNotificationTemplate, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEventNotificationTemplate)

    def clone(self, id, eventNotificationTemplate = NotImplemented):
        """This action allows registering to various backend event. Use this action to create notifications that will react to events such as new video was uploaded or metadata field was updated. To see the list of available event types, call the listTemplates action."""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addObjectIfDefined("eventNotificationTemplate", eventNotificationTemplate)
        self.client.queueServiceActionCall("eventnotification_eventnotificationtemplate", "clone", KalturaEventNotificationTemplate, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEventNotificationTemplate)

    def get(self, id):
        """Retrieve an event notification template object by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("eventnotification_eventnotificationtemplate", "get", KalturaEventNotificationTemplate, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEventNotificationTemplate)

    def update(self, id, eventNotificationTemplate):
        """Update an existing event notification template object"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addObjectIfDefined("eventNotificationTemplate", eventNotificationTemplate)
        self.client.queueServiceActionCall("eventnotification_eventnotificationtemplate", "update", KalturaEventNotificationTemplate, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEventNotificationTemplate)

    def updateStatus(self, id, status):
        """Update event notification template status by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addIntIfDefined("status", status);
        self.client.queueServiceActionCall("eventnotification_eventnotificationtemplate", "updateStatus", KalturaEventNotificationTemplate, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEventNotificationTemplate)

    def delete(self, id):
        """Delete an event notification template object"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("eventnotification_eventnotificationtemplate", "delete", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """list event notification template objects"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("eventnotification_eventnotificationtemplate", "list", KalturaEventNotificationTemplateListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEventNotificationTemplateListResponse)

    def listByPartner(self, filter = NotImplemented, pager = NotImplemented):
        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("eventnotification_eventnotificationtemplate", "listByPartner", KalturaEventNotificationTemplateListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEventNotificationTemplateListResponse)

    def dispatch(self, id, scope):
        """Dispatch event notification object by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addObjectIfDefined("scope", scope)
        self.client.queueServiceActionCall("eventnotification_eventnotificationtemplate", "dispatch", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return getXmlNodeInt(resultNode)

    def listTemplates(self, filter = NotImplemented, pager = NotImplemented):
        """Action lists the template partner event notification templates."""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("eventnotification_eventnotificationtemplate", "listTemplates", KalturaEventNotificationTemplateListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEventNotificationTemplateListResponse)

    def register(self, notificationTemplateSystemName, userParamsArray):
        """Register to a queue from which event messages will be provided according to given template. Queue will be created if not already exists"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("notificationTemplateSystemName", notificationTemplateSystemName)
        kparams.addArrayIfDefined("userParamsArray", userParamsArray)
        self.client.queueServiceActionCall("eventnotification_eventnotificationtemplate", "register", KalturaPushNotificationData, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaPushNotificationData)

########## main ##########
class KalturaEventNotificationClientPlugin(KalturaClientPlugin):
    # KalturaEventNotificationClientPlugin
    instance = None

    # @return KalturaEventNotificationClientPlugin
    @staticmethod
    def get():
        if KalturaEventNotificationClientPlugin.instance == None:
            KalturaEventNotificationClientPlugin.instance = KalturaEventNotificationClientPlugin()
        return KalturaEventNotificationClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'eventNotificationTemplate': KalturaEventNotificationTemplateService,
        }

    def getEnums(self):
        return {
            'KalturaEventNotificationTemplateStatus': KalturaEventNotificationTemplateStatus,
            'KalturaEventNotificationEventObjectType': KalturaEventNotificationEventObjectType,
            'KalturaEventNotificationEventType': KalturaEventNotificationEventType,
            'KalturaEventNotificationTemplateOrderBy': KalturaEventNotificationTemplateOrderBy,
            'KalturaEventNotificationTemplateType': KalturaEventNotificationTemplateType,
        }

    def getTypes(self):
        return {
            'KalturaEventNotificationParameter': KalturaEventNotificationParameter,
            'KalturaEventNotificationTemplate': KalturaEventNotificationTemplate,
            'KalturaEventFieldCondition': KalturaEventFieldCondition,
            'KalturaEventNotificationArrayParameter': KalturaEventNotificationArrayParameter,
            'KalturaEventNotificationDispatchJobData': KalturaEventNotificationDispatchJobData,
            'KalturaEventNotificationScope': KalturaEventNotificationScope,
            'KalturaEventNotificationTemplateBaseFilter': KalturaEventNotificationTemplateBaseFilter,
            'KalturaEventNotificationTemplateListResponse': KalturaEventNotificationTemplateListResponse,
            'KalturaEventObjectChangedCondition': KalturaEventObjectChangedCondition,
            'KalturaEventNotificationTemplateFilter': KalturaEventNotificationTemplateFilter,
        }

    # @return string
    def getName(self):
        return 'eventNotification'

