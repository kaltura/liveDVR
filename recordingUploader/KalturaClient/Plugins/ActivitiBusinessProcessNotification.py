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
from BusinessProcessNotification import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaActivitiBusinessProcessServerOrderBy(object):
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
class KalturaActivitiBusinessProcessServerProtocol(object):
    HTTP = "http"
    HTTPS = "https"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaActivitiBusinessProcessServer(KalturaBusinessProcessServer):
    def __init__(self,
            id=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            status=NotImplemented,
            type=NotImplemented,
            host=NotImplemented,
            port=NotImplemented,
            protocol=NotImplemented,
            username=NotImplemented,
            password=NotImplemented):
        KalturaBusinessProcessServer.__init__(self,
            id,
            createdAt,
            updatedAt,
            partnerId,
            name,
            systemName,
            description,
            status,
            type)

        # @var string
        self.host = host

        # @var int
        self.port = port

        # @var KalturaActivitiBusinessProcessServerProtocol
        self.protocol = protocol

        # @var string
        self.username = username

        # @var string
        self.password = password


    PROPERTY_LOADERS = {
        'host': getXmlNodeText, 
        'port': getXmlNodeInt, 
        'protocol': (KalturaEnumsFactory.createString, "KalturaActivitiBusinessProcessServerProtocol"), 
        'username': getXmlNodeText, 
        'password': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaBusinessProcessServer.fromXml(self, node)
        self.fromXmlImpl(node, KalturaActivitiBusinessProcessServer.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBusinessProcessServer.toParams(self)
        kparams.put("objectType", "KalturaActivitiBusinessProcessServer")
        kparams.addStringIfDefined("host", self.host)
        kparams.addIntIfDefined("port", self.port)
        kparams.addStringEnumIfDefined("protocol", self.protocol)
        kparams.addStringIfDefined("username", self.username)
        kparams.addStringIfDefined("password", self.password)
        return kparams

    def getHost(self):
        return self.host

    def setHost(self, newHost):
        self.host = newHost

    def getPort(self):
        return self.port

    def setPort(self, newPort):
        self.port = newPort

    def getProtocol(self):
        return self.protocol

    def setProtocol(self, newProtocol):
        self.protocol = newProtocol

    def getUsername(self):
        return self.username

    def setUsername(self, newUsername):
        self.username = newUsername

    def getPassword(self):
        return self.password

    def setPassword(self, newPassword):
        self.password = newPassword


# @package Kaltura
# @subpackage Client
class KalturaActivitiBusinessProcessServerBaseFilter(KalturaBusinessProcessServerFilter):
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
        KalturaBusinessProcessServerFilter.__init__(self,
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
        KalturaBusinessProcessServerFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaActivitiBusinessProcessServerBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBusinessProcessServerFilter.toParams(self)
        kparams.put("objectType", "KalturaActivitiBusinessProcessServerBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaActivitiBusinessProcessServerFilter(KalturaActivitiBusinessProcessServerBaseFilter):
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
        KalturaActivitiBusinessProcessServerBaseFilter.__init__(self,
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
        KalturaActivitiBusinessProcessServerBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaActivitiBusinessProcessServerFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaActivitiBusinessProcessServerBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaActivitiBusinessProcessServerFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaActivitiBusinessProcessNotificationClientPlugin(KalturaClientPlugin):
    # KalturaActivitiBusinessProcessNotificationClientPlugin
    instance = None

    # @return KalturaActivitiBusinessProcessNotificationClientPlugin
    @staticmethod
    def get():
        if KalturaActivitiBusinessProcessNotificationClientPlugin.instance == None:
            KalturaActivitiBusinessProcessNotificationClientPlugin.instance = KalturaActivitiBusinessProcessNotificationClientPlugin()
        return KalturaActivitiBusinessProcessNotificationClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaActivitiBusinessProcessServerOrderBy': KalturaActivitiBusinessProcessServerOrderBy,
            'KalturaActivitiBusinessProcessServerProtocol': KalturaActivitiBusinessProcessServerProtocol,
        }

    def getTypes(self):
        return {
            'KalturaActivitiBusinessProcessServer': KalturaActivitiBusinessProcessServer,
            'KalturaActivitiBusinessProcessServerBaseFilter': KalturaActivitiBusinessProcessServerBaseFilter,
            'KalturaActivitiBusinessProcessServerFilter': KalturaActivitiBusinessProcessServerFilter,
        }

    # @return string
    def getName(self):
        return 'activitiBusinessProcessNotification'

