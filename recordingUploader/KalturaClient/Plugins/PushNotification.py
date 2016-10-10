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
class KalturaPushNotificationTemplateOrderBy(object):
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
class KalturaPushNotificationData(KalturaObjectBase):
    def __init__(self,
            key=NotImplemented,
            url=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var string
        # @readonly
        self.key = key

        # @var string
        # @readonly
        self.url = url


    PROPERTY_LOADERS = {
        'key': getXmlNodeText, 
        'url': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPushNotificationData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaPushNotificationData")
        return kparams

    def getKey(self):
        return self.key

    def getUrl(self):
        return self.url


# @package Kaltura
# @subpackage Client
class KalturaPushNotificationTemplate(KalturaEventNotificationTemplate):
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
            apiObjectType=NotImplemented,
            objectFormat=NotImplemented,
            responseProfileId=NotImplemented):
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

        # Kaltura API object type
        # @var string
        self.apiObjectType = apiObjectType

        # Kaltura Object format
        # @var KalturaResponseType
        self.objectFormat = objectFormat

        # Kaltura response-profile id
        # @var int
        self.responseProfileId = responseProfileId


    PROPERTY_LOADERS = {
        'apiObjectType': getXmlNodeText, 
        'objectFormat': (KalturaEnumsFactory.createInt, "KalturaResponseType"), 
        'responseProfileId': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaEventNotificationTemplate.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPushNotificationTemplate.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEventNotificationTemplate.toParams(self)
        kparams.put("objectType", "KalturaPushNotificationTemplate")
        kparams.addStringIfDefined("apiObjectType", self.apiObjectType)
        kparams.addIntEnumIfDefined("objectFormat", self.objectFormat)
        kparams.addIntIfDefined("responseProfileId", self.responseProfileId)
        return kparams

    def getApiObjectType(self):
        return self.apiObjectType

    def setApiObjectType(self, newApiObjectType):
        self.apiObjectType = newApiObjectType

    def getObjectFormat(self):
        return self.objectFormat

    def setObjectFormat(self, newObjectFormat):
        self.objectFormat = newObjectFormat

    def getResponseProfileId(self):
        return self.responseProfileId

    def setResponseProfileId(self, newResponseProfileId):
        self.responseProfileId = newResponseProfileId


# @package Kaltura
# @subpackage Client
class KalturaPushNotificationTemplateBaseFilter(KalturaEventNotificationTemplateFilter):
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
        self.fromXmlImpl(node, KalturaPushNotificationTemplateBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEventNotificationTemplateFilter.toParams(self)
        kparams.put("objectType", "KalturaPushNotificationTemplateBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaPushNotificationTemplateFilter(KalturaPushNotificationTemplateBaseFilter):
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
        KalturaPushNotificationTemplateBaseFilter.__init__(self,
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
        KalturaPushNotificationTemplateBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPushNotificationTemplateFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaPushNotificationTemplateBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaPushNotificationTemplateFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaPushNotificationClientPlugin(KalturaClientPlugin):
    # KalturaPushNotificationClientPlugin
    instance = None

    # @return KalturaPushNotificationClientPlugin
    @staticmethod
    def get():
        if KalturaPushNotificationClientPlugin.instance == None:
            KalturaPushNotificationClientPlugin.instance = KalturaPushNotificationClientPlugin()
        return KalturaPushNotificationClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaPushNotificationTemplateOrderBy': KalturaPushNotificationTemplateOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaPushNotificationData': KalturaPushNotificationData,
            'KalturaPushNotificationTemplate': KalturaPushNotificationTemplate,
            'KalturaPushNotificationTemplateBaseFilter': KalturaPushNotificationTemplateBaseFilter,
            'KalturaPushNotificationTemplateFilter': KalturaPushNotificationTemplateFilter,
        }

    # @return string
    def getName(self):
        return 'pushNotification'

