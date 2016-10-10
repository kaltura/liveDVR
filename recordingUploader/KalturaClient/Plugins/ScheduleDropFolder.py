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
from ScheduleBulkUpload import *
from DropFolder import *
from ..Base import *

########## enums ##########
########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaDropFolderICalBulkUploadFileHandlerConfig(KalturaDropFolderFileHandlerConfig):
    def __init__(self,
            handlerType=NotImplemented,
            eventsType=NotImplemented):
        KalturaDropFolderFileHandlerConfig.__init__(self,
            handlerType)

        # The type of the events that ill be created by this upload
        # @var KalturaScheduleEventType
        self.eventsType = eventsType


    PROPERTY_LOADERS = {
        'eventsType': (KalturaEnumsFactory.createInt, "KalturaScheduleEventType"), 
    }

    def fromXml(self, node):
        KalturaDropFolderFileHandlerConfig.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDropFolderICalBulkUploadFileHandlerConfig.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDropFolderFileHandlerConfig.toParams(self)
        kparams.put("objectType", "KalturaDropFolderICalBulkUploadFileHandlerConfig")
        kparams.addIntEnumIfDefined("eventsType", self.eventsType)
        return kparams

    def getEventsType(self):
        return self.eventsType

    def setEventsType(self, newEventsType):
        self.eventsType = newEventsType


########## services ##########
########## main ##########
class KalturaScheduleDropFolderClientPlugin(KalturaClientPlugin):
    # KalturaScheduleDropFolderClientPlugin
    instance = None

    # @return KalturaScheduleDropFolderClientPlugin
    @staticmethod
    def get():
        if KalturaScheduleDropFolderClientPlugin.instance == None:
            KalturaScheduleDropFolderClientPlugin.instance = KalturaScheduleDropFolderClientPlugin()
        return KalturaScheduleDropFolderClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
        }

    def getTypes(self):
        return {
            'KalturaDropFolderICalBulkUploadFileHandlerConfig': KalturaDropFolderICalBulkUploadFileHandlerConfig,
        }

    # @return string
    def getName(self):
        return 'scheduleDropFolder'

