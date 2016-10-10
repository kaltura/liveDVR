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
from BulkUpload import *
from Schedule import *
from ..Base import *

########## enums ##########
########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaBulkUploadResultScheduleEvent(KalturaBulkUploadResult):
    def __init__(self,
            id=NotImplemented,
            bulkUploadJobId=NotImplemented,
            lineIndex=NotImplemented,
            partnerId=NotImplemented,
            status=NotImplemented,
            action=NotImplemented,
            objectId=NotImplemented,
            objectStatus=NotImplemented,
            bulkUploadResultObjectType=NotImplemented,
            rowData=NotImplemented,
            partnerData=NotImplemented,
            objectErrorDescription=NotImplemented,
            pluginsData=NotImplemented,
            errorDescription=NotImplemented,
            errorCode=NotImplemented,
            errorType=NotImplemented,
            referenceId=NotImplemented):
        KalturaBulkUploadResult.__init__(self,
            id,
            bulkUploadJobId,
            lineIndex,
            partnerId,
            status,
            action,
            objectId,
            objectStatus,
            bulkUploadResultObjectType,
            rowData,
            partnerData,
            objectErrorDescription,
            pluginsData,
            errorDescription,
            errorCode,
            errorType)

        # @var string
        self.referenceId = referenceId


    PROPERTY_LOADERS = {
        'referenceId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaBulkUploadResult.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBulkUploadResultScheduleEvent.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBulkUploadResult.toParams(self)
        kparams.put("objectType", "KalturaBulkUploadResultScheduleEvent")
        kparams.addStringIfDefined("referenceId", self.referenceId)
        return kparams

    def getReferenceId(self):
        return self.referenceId

    def setReferenceId(self, newReferenceId):
        self.referenceId = newReferenceId


# @package Kaltura
# @subpackage Client
class KalturaBulkUploadResultScheduleResource(KalturaBulkUploadResult):
    def __init__(self,
            id=NotImplemented,
            bulkUploadJobId=NotImplemented,
            lineIndex=NotImplemented,
            partnerId=NotImplemented,
            status=NotImplemented,
            action=NotImplemented,
            objectId=NotImplemented,
            objectStatus=NotImplemented,
            bulkUploadResultObjectType=NotImplemented,
            rowData=NotImplemented,
            partnerData=NotImplemented,
            objectErrorDescription=NotImplemented,
            pluginsData=NotImplemented,
            errorDescription=NotImplemented,
            errorCode=NotImplemented,
            errorType=NotImplemented,
            resourceId=NotImplemented,
            name=NotImplemented,
            type=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            tags=NotImplemented,
            parentType=NotImplemented,
            parentSystemName=NotImplemented):
        KalturaBulkUploadResult.__init__(self,
            id,
            bulkUploadJobId,
            lineIndex,
            partnerId,
            status,
            action,
            objectId,
            objectStatus,
            bulkUploadResultObjectType,
            rowData,
            partnerData,
            objectErrorDescription,
            pluginsData,
            errorDescription,
            errorCode,
            errorType)

        # @var string
        self.resourceId = resourceId

        # @var string
        self.name = name

        # @var string
        self.type = type

        # @var string
        self.systemName = systemName

        # @var string
        self.description = description

        # @var string
        self.tags = tags

        # @var string
        self.parentType = parentType

        # @var string
        self.parentSystemName = parentSystemName


    PROPERTY_LOADERS = {
        'resourceId': getXmlNodeText, 
        'name': getXmlNodeText, 
        'type': getXmlNodeText, 
        'systemName': getXmlNodeText, 
        'description': getXmlNodeText, 
        'tags': getXmlNodeText, 
        'parentType': getXmlNodeText, 
        'parentSystemName': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaBulkUploadResult.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBulkUploadResultScheduleResource.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBulkUploadResult.toParams(self)
        kparams.put("objectType", "KalturaBulkUploadResultScheduleResource")
        kparams.addStringIfDefined("resourceId", self.resourceId)
        kparams.addStringIfDefined("name", self.name)
        kparams.addStringIfDefined("type", self.type)
        kparams.addStringIfDefined("systemName", self.systemName)
        kparams.addStringIfDefined("description", self.description)
        kparams.addStringIfDefined("tags", self.tags)
        kparams.addStringIfDefined("parentType", self.parentType)
        kparams.addStringIfDefined("parentSystemName", self.parentSystemName)
        return kparams

    def getResourceId(self):
        return self.resourceId

    def setResourceId(self, newResourceId):
        self.resourceId = newResourceId

    def getName(self):
        return self.name

    def setName(self, newName):
        self.name = newName

    def getType(self):
        return self.type

    def setType(self, newType):
        self.type = newType

    def getSystemName(self):
        return self.systemName

    def setSystemName(self, newSystemName):
        self.systemName = newSystemName

    def getDescription(self):
        return self.description

    def setDescription(self, newDescription):
        self.description = newDescription

    def getTags(self):
        return self.tags

    def setTags(self, newTags):
        self.tags = newTags

    def getParentType(self):
        return self.parentType

    def setParentType(self, newParentType):
        self.parentType = newParentType

    def getParentSystemName(self):
        return self.parentSystemName

    def setParentSystemName(self, newParentSystemName):
        self.parentSystemName = newParentSystemName


# @package Kaltura
# @subpackage Client
class KalturaBulkUploadICalJobData(KalturaBulkUploadJobData):
    """Represents the Bulk upload job data for iCal bulk upload"""

    def __init__(self,
            userId=NotImplemented,
            uploadedBy=NotImplemented,
            conversionProfileId=NotImplemented,
            resultsFileLocalPath=NotImplemented,
            resultsFileUrl=NotImplemented,
            numOfEntries=NotImplemented,
            numOfObjects=NotImplemented,
            filePath=NotImplemented,
            bulkUploadObjectType=NotImplemented,
            fileName=NotImplemented,
            objectData=NotImplemented,
            type=NotImplemented,
            emailRecipients=NotImplemented,
            numOfErrorObjects=NotImplemented,
            eventsType=NotImplemented):
        KalturaBulkUploadJobData.__init__(self,
            userId,
            uploadedBy,
            conversionProfileId,
            resultsFileLocalPath,
            resultsFileUrl,
            numOfEntries,
            numOfObjects,
            filePath,
            bulkUploadObjectType,
            fileName,
            objectData,
            type,
            emailRecipients,
            numOfErrorObjects)

        # The type of the events that ill be created by this upload
        # @var KalturaScheduleEventType
        self.eventsType = eventsType


    PROPERTY_LOADERS = {
        'eventsType': (KalturaEnumsFactory.createInt, "KalturaScheduleEventType"), 
    }

    def fromXml(self, node):
        KalturaBulkUploadJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBulkUploadICalJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBulkUploadJobData.toParams(self)
        kparams.put("objectType", "KalturaBulkUploadICalJobData")
        kparams.addIntEnumIfDefined("eventsType", self.eventsType)
        return kparams

    def getEventsType(self):
        return self.eventsType

    def setEventsType(self, newEventsType):
        self.eventsType = newEventsType


########## services ##########
########## main ##########
class KalturaScheduleBulkUploadClientPlugin(KalturaClientPlugin):
    # KalturaScheduleBulkUploadClientPlugin
    instance = None

    # @return KalturaScheduleBulkUploadClientPlugin
    @staticmethod
    def get():
        if KalturaScheduleBulkUploadClientPlugin.instance == None:
            KalturaScheduleBulkUploadClientPlugin.instance = KalturaScheduleBulkUploadClientPlugin()
        return KalturaScheduleBulkUploadClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
        }

    def getTypes(self):
        return {
            'KalturaBulkUploadResultScheduleEvent': KalturaBulkUploadResultScheduleEvent,
            'KalturaBulkUploadResultScheduleResource': KalturaBulkUploadResultScheduleResource,
            'KalturaBulkUploadICalJobData': KalturaBulkUploadICalJobData,
        }

    # @return string
    def getName(self):
        return 'scheduleBulkUpload'

