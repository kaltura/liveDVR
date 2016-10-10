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
class KalturaDeleteFlavorsLogicType(object):
    KEEP_LIST_DELETE_OTHERS = 1
    DELETE_LIST = 2
    DELETE_KEEP_SMALLEST = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaScheduledTaskAddOrRemoveType(object):
    ADD = 1
    REMOVE = 2

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaScheduledTaskProfileStatus(object):
    DISABLED = 1
    ACTIVE = 2
    DELETED = 3
    SUSPENDED = 4
    DRY_RUN_ONLY = 5

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaObjectFilterEngineType(object):
    ENTRY = "1"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaObjectTaskType(object):
    DISTRIBUTE = "scheduledTaskContentDistribution.Distribute"
    DISPATCH_EVENT_NOTIFICATION = "scheduledTaskEventNotification.DispatchEventNotification"
    EXECUTE_METADATA_XSLT = "scheduledTaskMetadata.ExecuteMetadataXslt"
    DELETE_ENTRY = "1"
    MODIFY_CATEGORIES = "2"
    DELETE_ENTRY_FLAVORS = "3"
    CONVERT_ENTRY_FLAVORS = "4"
    DELETE_LOCAL_CONTENT = "5"
    STORAGE_EXPORT = "6"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaScheduledTaskProfileOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    ID_ASC = "+id"
    LAST_EXECUTION_STARTED_AT_ASC = "+lastExecutionStartedAt"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    ID_DESC = "-id"
    LAST_EXECUTION_STARTED_AT_DESC = "-lastExecutionStartedAt"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaObjectTask(KalturaObjectBase):
    def __init__(self,
            type=NotImplemented,
            stopProcessingOnError=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var KalturaObjectTaskType
        # @readonly
        self.type = type

        # @var bool
        self.stopProcessingOnError = stopProcessingOnError


    PROPERTY_LOADERS = {
        'type': (KalturaEnumsFactory.createString, "KalturaObjectTaskType"), 
        'stopProcessingOnError': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaObjectTask.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaObjectTask")
        kparams.addBoolIfDefined("stopProcessingOnError", self.stopProcessingOnError)
        return kparams

    def getType(self):
        return self.type

    def getStopProcessingOnError(self):
        return self.stopProcessingOnError

    def setStopProcessingOnError(self, newStopProcessingOnError):
        self.stopProcessingOnError = newStopProcessingOnError


# @package Kaltura
# @subpackage Client
class KalturaScheduledTaskProfile(KalturaObjectBase):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            status=NotImplemented,
            objectFilterEngineType=NotImplemented,
            objectFilter=NotImplemented,
            objectTasks=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            lastExecutionStartedAt=NotImplemented,
            maxTotalCountAllowed=NotImplemented):
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

        # @var KalturaScheduledTaskProfileStatus
        self.status = status

        # The type of engine to use to list objects using the given "objectFilter"
        # @var KalturaObjectFilterEngineType
        self.objectFilterEngineType = objectFilterEngineType

        # A filter object (inherits KalturaFilter) that is used to list objects for scheduled tasks
        # @var KalturaFilter
        self.objectFilter = objectFilter

        # A list of tasks to execute on the founded objects
        # @var array of KalturaObjectTask
        self.objectTasks = objectTasks

        # @var int
        # @readonly
        self.createdAt = createdAt

        # @var int
        # @readonly
        self.updatedAt = updatedAt

        # @var int
        self.lastExecutionStartedAt = lastExecutionStartedAt

        # The maximum number of result count allowed to be processed by this profile per execution
        # @var int
        self.maxTotalCountAllowed = maxTotalCountAllowed


    PROPERTY_LOADERS = {
        'id': getXmlNodeInt, 
        'partnerId': getXmlNodeInt, 
        'name': getXmlNodeText, 
        'systemName': getXmlNodeText, 
        'description': getXmlNodeText, 
        'status': (KalturaEnumsFactory.createInt, "KalturaScheduledTaskProfileStatus"), 
        'objectFilterEngineType': (KalturaEnumsFactory.createString, "KalturaObjectFilterEngineType"), 
        'objectFilter': (KalturaObjectFactory.create, KalturaFilter), 
        'objectTasks': (KalturaObjectFactory.createArray, KalturaObjectTask), 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
        'lastExecutionStartedAt': getXmlNodeInt, 
        'maxTotalCountAllowed': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduledTaskProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaScheduledTaskProfile")
        kparams.addStringIfDefined("name", self.name)
        kparams.addStringIfDefined("systemName", self.systemName)
        kparams.addStringIfDefined("description", self.description)
        kparams.addIntEnumIfDefined("status", self.status)
        kparams.addStringEnumIfDefined("objectFilterEngineType", self.objectFilterEngineType)
        kparams.addObjectIfDefined("objectFilter", self.objectFilter)
        kparams.addArrayIfDefined("objectTasks", self.objectTasks)
        kparams.addIntIfDefined("lastExecutionStartedAt", self.lastExecutionStartedAt)
        kparams.addIntIfDefined("maxTotalCountAllowed", self.maxTotalCountAllowed)
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

    def getStatus(self):
        return self.status

    def setStatus(self, newStatus):
        self.status = newStatus

    def getObjectFilterEngineType(self):
        return self.objectFilterEngineType

    def setObjectFilterEngineType(self, newObjectFilterEngineType):
        self.objectFilterEngineType = newObjectFilterEngineType

    def getObjectFilter(self):
        return self.objectFilter

    def setObjectFilter(self, newObjectFilter):
        self.objectFilter = newObjectFilter

    def getObjectTasks(self):
        return self.objectTasks

    def setObjectTasks(self, newObjectTasks):
        self.objectTasks = newObjectTasks

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt

    def getLastExecutionStartedAt(self):
        return self.lastExecutionStartedAt

    def setLastExecutionStartedAt(self, newLastExecutionStartedAt):
        self.lastExecutionStartedAt = newLastExecutionStartedAt

    def getMaxTotalCountAllowed(self):
        return self.maxTotalCountAllowed

    def setMaxTotalCountAllowed(self, newMaxTotalCountAllowed):
        self.maxTotalCountAllowed = newMaxTotalCountAllowed


# @package Kaltura
# @subpackage Client
class KalturaConvertEntryFlavorsObjectTask(KalturaObjectTask):
    def __init__(self,
            type=NotImplemented,
            stopProcessingOnError=NotImplemented,
            flavorParamsIds=NotImplemented,
            reconvert=NotImplemented):
        KalturaObjectTask.__init__(self,
            type,
            stopProcessingOnError)

        # Comma separated list of flavor param ids to convert
        # @var string
        self.flavorParamsIds = flavorParamsIds

        # Should reconvert when flavor already exists?
        # @var bool
        self.reconvert = reconvert


    PROPERTY_LOADERS = {
        'flavorParamsIds': getXmlNodeText, 
        'reconvert': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaObjectTask.fromXml(self, node)
        self.fromXmlImpl(node, KalturaConvertEntryFlavorsObjectTask.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectTask.toParams(self)
        kparams.put("objectType", "KalturaConvertEntryFlavorsObjectTask")
        kparams.addStringIfDefined("flavorParamsIds", self.flavorParamsIds)
        kparams.addBoolIfDefined("reconvert", self.reconvert)
        return kparams

    def getFlavorParamsIds(self):
        return self.flavorParamsIds

    def setFlavorParamsIds(self, newFlavorParamsIds):
        self.flavorParamsIds = newFlavorParamsIds

    def getReconvert(self):
        return self.reconvert

    def setReconvert(self, newReconvert):
        self.reconvert = newReconvert


# @package Kaltura
# @subpackage Client
class KalturaDeleteEntryFlavorsObjectTask(KalturaObjectTask):
    def __init__(self,
            type=NotImplemented,
            stopProcessingOnError=NotImplemented,
            deleteType=NotImplemented,
            flavorParamsIds=NotImplemented):
        KalturaObjectTask.__init__(self,
            type,
            stopProcessingOnError)

        # The logic to use to choose the flavors for deletion
        # @var KalturaDeleteFlavorsLogicType
        self.deleteType = deleteType

        # Comma separated list of flavor param ids to delete or keep
        # @var string
        self.flavorParamsIds = flavorParamsIds


    PROPERTY_LOADERS = {
        'deleteType': (KalturaEnumsFactory.createInt, "KalturaDeleteFlavorsLogicType"), 
        'flavorParamsIds': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectTask.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDeleteEntryFlavorsObjectTask.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectTask.toParams(self)
        kparams.put("objectType", "KalturaDeleteEntryFlavorsObjectTask")
        kparams.addIntEnumIfDefined("deleteType", self.deleteType)
        kparams.addStringIfDefined("flavorParamsIds", self.flavorParamsIds)
        return kparams

    def getDeleteType(self):
        return self.deleteType

    def setDeleteType(self, newDeleteType):
        self.deleteType = newDeleteType

    def getFlavorParamsIds(self):
        return self.flavorParamsIds

    def setFlavorParamsIds(self, newFlavorParamsIds):
        self.flavorParamsIds = newFlavorParamsIds


# @package Kaltura
# @subpackage Client
class KalturaDeleteEntryObjectTask(KalturaObjectTask):
    def __init__(self,
            type=NotImplemented,
            stopProcessingOnError=NotImplemented):
        KalturaObjectTask.__init__(self,
            type,
            stopProcessingOnError)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaObjectTask.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDeleteEntryObjectTask.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectTask.toParams(self)
        kparams.put("objectType", "KalturaDeleteEntryObjectTask")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDeleteLocalContentObjectTask(KalturaObjectTask):
    def __init__(self,
            type=NotImplemented,
            stopProcessingOnError=NotImplemented):
        KalturaObjectTask.__init__(self,
            type,
            stopProcessingOnError)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaObjectTask.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDeleteLocalContentObjectTask.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectTask.toParams(self)
        kparams.put("objectType", "KalturaDeleteLocalContentObjectTask")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaModifyCategoriesObjectTask(KalturaObjectTask):
    def __init__(self,
            type=NotImplemented,
            stopProcessingOnError=NotImplemented,
            addRemoveType=NotImplemented,
            categoryIds=NotImplemented):
        KalturaObjectTask.__init__(self,
            type,
            stopProcessingOnError)

        # Should the object task add or remove categories?
        # @var KalturaScheduledTaskAddOrRemoveType
        self.addRemoveType = addRemoveType

        # The list of category ids to add or remove
        # @var array of KalturaIntegerValue
        self.categoryIds = categoryIds


    PROPERTY_LOADERS = {
        'addRemoveType': (KalturaEnumsFactory.createInt, "KalturaScheduledTaskAddOrRemoveType"), 
        'categoryIds': (KalturaObjectFactory.createArray, KalturaIntegerValue), 
    }

    def fromXml(self, node):
        KalturaObjectTask.fromXml(self, node)
        self.fromXmlImpl(node, KalturaModifyCategoriesObjectTask.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectTask.toParams(self)
        kparams.put("objectType", "KalturaModifyCategoriesObjectTask")
        kparams.addIntEnumIfDefined("addRemoveType", self.addRemoveType)
        kparams.addArrayIfDefined("categoryIds", self.categoryIds)
        return kparams

    def getAddRemoveType(self):
        return self.addRemoveType

    def setAddRemoveType(self, newAddRemoveType):
        self.addRemoveType = newAddRemoveType

    def getCategoryIds(self):
        return self.categoryIds

    def setCategoryIds(self, newCategoryIds):
        self.categoryIds = newCategoryIds


# @package Kaltura
# @subpackage Client
class KalturaScheduledTaskJobData(KalturaJobData):
    def __init__(self,
            maxResults=NotImplemented,
            resultsFilePath=NotImplemented,
            referenceTime=NotImplemented):
        KalturaJobData.__init__(self)

        # @var int
        self.maxResults = maxResults

        # @var string
        self.resultsFilePath = resultsFilePath

        # @var int
        self.referenceTime = referenceTime


    PROPERTY_LOADERS = {
        'maxResults': getXmlNodeInt, 
        'resultsFilePath': getXmlNodeText, 
        'referenceTime': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduledTaskJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaJobData.toParams(self)
        kparams.put("objectType", "KalturaScheduledTaskJobData")
        kparams.addIntIfDefined("maxResults", self.maxResults)
        kparams.addStringIfDefined("resultsFilePath", self.resultsFilePath)
        kparams.addIntIfDefined("referenceTime", self.referenceTime)
        return kparams

    def getMaxResults(self):
        return self.maxResults

    def setMaxResults(self, newMaxResults):
        self.maxResults = newMaxResults

    def getResultsFilePath(self):
        return self.resultsFilePath

    def setResultsFilePath(self, newResultsFilePath):
        self.resultsFilePath = newResultsFilePath

    def getReferenceTime(self):
        return self.referenceTime

    def setReferenceTime(self, newReferenceTime):
        self.referenceTime = newReferenceTime


# @package Kaltura
# @subpackage Client
class KalturaScheduledTaskProfileBaseFilter(KalturaFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            lastExecutionStartedAtGreaterThanOrEqual=NotImplemented,
            lastExecutionStartedAtLessThanOrEqual=NotImplemented):
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

        # @var KalturaScheduledTaskProfileStatus
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

        # @var int
        self.lastExecutionStartedAtGreaterThanOrEqual = lastExecutionStartedAtGreaterThanOrEqual

        # @var int
        self.lastExecutionStartedAtLessThanOrEqual = lastExecutionStartedAtLessThanOrEqual


    PROPERTY_LOADERS = {
        'idEqual': getXmlNodeInt, 
        'idIn': getXmlNodeText, 
        'partnerIdEqual': getXmlNodeInt, 
        'partnerIdIn': getXmlNodeText, 
        'systemNameEqual': getXmlNodeText, 
        'systemNameIn': getXmlNodeText, 
        'statusEqual': (KalturaEnumsFactory.createInt, "KalturaScheduledTaskProfileStatus"), 
        'statusIn': getXmlNodeText, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'updatedAtGreaterThanOrEqual': getXmlNodeInt, 
        'updatedAtLessThanOrEqual': getXmlNodeInt, 
        'lastExecutionStartedAtGreaterThanOrEqual': getXmlNodeInt, 
        'lastExecutionStartedAtLessThanOrEqual': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduledTaskProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFilter.toParams(self)
        kparams.put("objectType", "KalturaScheduledTaskProfileBaseFilter")
        kparams.addIntIfDefined("idEqual", self.idEqual)
        kparams.addStringIfDefined("idIn", self.idIn)
        kparams.addIntIfDefined("partnerIdEqual", self.partnerIdEqual)
        kparams.addStringIfDefined("partnerIdIn", self.partnerIdIn)
        kparams.addStringIfDefined("systemNameEqual", self.systemNameEqual)
        kparams.addStringIfDefined("systemNameIn", self.systemNameIn)
        kparams.addIntEnumIfDefined("statusEqual", self.statusEqual)
        kparams.addStringIfDefined("statusIn", self.statusIn)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        kparams.addIntIfDefined("updatedAtGreaterThanOrEqual", self.updatedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("updatedAtLessThanOrEqual", self.updatedAtLessThanOrEqual)
        kparams.addIntIfDefined("lastExecutionStartedAtGreaterThanOrEqual", self.lastExecutionStartedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("lastExecutionStartedAtLessThanOrEqual", self.lastExecutionStartedAtLessThanOrEqual)
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

    def getLastExecutionStartedAtGreaterThanOrEqual(self):
        return self.lastExecutionStartedAtGreaterThanOrEqual

    def setLastExecutionStartedAtGreaterThanOrEqual(self, newLastExecutionStartedAtGreaterThanOrEqual):
        self.lastExecutionStartedAtGreaterThanOrEqual = newLastExecutionStartedAtGreaterThanOrEqual

    def getLastExecutionStartedAtLessThanOrEqual(self):
        return self.lastExecutionStartedAtLessThanOrEqual

    def setLastExecutionStartedAtLessThanOrEqual(self, newLastExecutionStartedAtLessThanOrEqual):
        self.lastExecutionStartedAtLessThanOrEqual = newLastExecutionStartedAtLessThanOrEqual


# @package Kaltura
# @subpackage Client
class KalturaScheduledTaskProfileListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaScheduledTaskProfile
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaScheduledTaskProfile), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduledTaskProfileListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaScheduledTaskProfileListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaStorageExportObjectTask(KalturaObjectTask):
    def __init__(self,
            type=NotImplemented,
            stopProcessingOnError=NotImplemented,
            storageId=NotImplemented):
        KalturaObjectTask.__init__(self,
            type,
            stopProcessingOnError)

        # Storage profile id
        # @var string
        self.storageId = storageId


    PROPERTY_LOADERS = {
        'storageId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectTask.fromXml(self, node)
        self.fromXmlImpl(node, KalturaStorageExportObjectTask.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectTask.toParams(self)
        kparams.put("objectType", "KalturaStorageExportObjectTask")
        kparams.addStringIfDefined("storageId", self.storageId)
        return kparams

    def getStorageId(self):
        return self.storageId

    def setStorageId(self, newStorageId):
        self.storageId = newStorageId


# @package Kaltura
# @subpackage Client
class KalturaScheduledTaskProfileFilter(KalturaScheduledTaskProfileBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            lastExecutionStartedAtGreaterThanOrEqual=NotImplemented,
            lastExecutionStartedAtLessThanOrEqual=NotImplemented):
        KalturaScheduledTaskProfileBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            systemNameEqual,
            systemNameIn,
            statusEqual,
            statusIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            lastExecutionStartedAtGreaterThanOrEqual,
            lastExecutionStartedAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaScheduledTaskProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaScheduledTaskProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaScheduledTaskProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaScheduledTaskProfileFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaScheduledTaskProfileService(KalturaServiceBase):
    """Schedule task service lets you create and manage scheduled task profiles"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, scheduledTaskProfile):
        """Add a new scheduled task profile"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("scheduledTaskProfile", scheduledTaskProfile)
        self.client.queueServiceActionCall("scheduledtask_scheduledtaskprofile", "add", KalturaScheduledTaskProfile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduledTaskProfile)

    def get(self, id):
        """Retrieve a scheduled task profile by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("scheduledtask_scheduledtaskprofile", "get", KalturaScheduledTaskProfile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduledTaskProfile)

    def update(self, id, scheduledTaskProfile):
        """Update an existing scheduled task profile"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addObjectIfDefined("scheduledTaskProfile", scheduledTaskProfile)
        self.client.queueServiceActionCall("scheduledtask_scheduledtaskprofile", "update", KalturaScheduledTaskProfile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduledTaskProfile)

    def delete(self, id):
        """Delete a scheduled task profile"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("scheduledtask_scheduledtaskprofile", "delete", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List scheduled task profiles"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("scheduledtask_scheduledtaskprofile", "list", KalturaScheduledTaskProfileListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaScheduledTaskProfileListResponse)

    def requestDryRun(self, scheduledTaskProfileId, maxResults = 500):
        kparams = KalturaParams()
        kparams.addIntIfDefined("scheduledTaskProfileId", scheduledTaskProfileId);
        kparams.addIntIfDefined("maxResults", maxResults);
        self.client.queueServiceActionCall("scheduledtask_scheduledtaskprofile", "requestDryRun", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return getXmlNodeInt(resultNode)

    def getDryRunResults(self, requestId):
        kparams = KalturaParams()
        kparams.addIntIfDefined("requestId", requestId);
        self.client.queueServiceActionCall("scheduledtask_scheduledtaskprofile", "getDryRunResults", KalturaObjectListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaObjectListResponse)

########## main ##########
class KalturaScheduledTaskClientPlugin(KalturaClientPlugin):
    # KalturaScheduledTaskClientPlugin
    instance = None

    # @return KalturaScheduledTaskClientPlugin
    @staticmethod
    def get():
        if KalturaScheduledTaskClientPlugin.instance == None:
            KalturaScheduledTaskClientPlugin.instance = KalturaScheduledTaskClientPlugin()
        return KalturaScheduledTaskClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'scheduledTaskProfile': KalturaScheduledTaskProfileService,
        }

    def getEnums(self):
        return {
            'KalturaDeleteFlavorsLogicType': KalturaDeleteFlavorsLogicType,
            'KalturaScheduledTaskAddOrRemoveType': KalturaScheduledTaskAddOrRemoveType,
            'KalturaScheduledTaskProfileStatus': KalturaScheduledTaskProfileStatus,
            'KalturaObjectFilterEngineType': KalturaObjectFilterEngineType,
            'KalturaObjectTaskType': KalturaObjectTaskType,
            'KalturaScheduledTaskProfileOrderBy': KalturaScheduledTaskProfileOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaObjectTask': KalturaObjectTask,
            'KalturaScheduledTaskProfile': KalturaScheduledTaskProfile,
            'KalturaConvertEntryFlavorsObjectTask': KalturaConvertEntryFlavorsObjectTask,
            'KalturaDeleteEntryFlavorsObjectTask': KalturaDeleteEntryFlavorsObjectTask,
            'KalturaDeleteEntryObjectTask': KalturaDeleteEntryObjectTask,
            'KalturaDeleteLocalContentObjectTask': KalturaDeleteLocalContentObjectTask,
            'KalturaModifyCategoriesObjectTask': KalturaModifyCategoriesObjectTask,
            'KalturaScheduledTaskJobData': KalturaScheduledTaskJobData,
            'KalturaScheduledTaskProfileBaseFilter': KalturaScheduledTaskProfileBaseFilter,
            'KalturaScheduledTaskProfileListResponse': KalturaScheduledTaskProfileListResponse,
            'KalturaStorageExportObjectTask': KalturaStorageExportObjectTask,
            'KalturaScheduledTaskProfileFilter': KalturaScheduledTaskProfileFilter,
        }

    # @return string
    def getName(self):
        return 'scheduledTask'

