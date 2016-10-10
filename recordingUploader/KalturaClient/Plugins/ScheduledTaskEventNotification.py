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
from ScheduledTask import *
from EventNotification import *
from ..Base import *

########## enums ##########
########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaDispatchEventNotificationObjectTask(KalturaObjectTask):
    def __init__(self,
            type=NotImplemented,
            stopProcessingOnError=NotImplemented,
            eventNotificationTemplateId=NotImplemented):
        KalturaObjectTask.__init__(self,
            type,
            stopProcessingOnError)

        # The event notification template id to dispatch
        # @var int
        self.eventNotificationTemplateId = eventNotificationTemplateId


    PROPERTY_LOADERS = {
        'eventNotificationTemplateId': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaObjectTask.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDispatchEventNotificationObjectTask.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectTask.toParams(self)
        kparams.put("objectType", "KalturaDispatchEventNotificationObjectTask")
        kparams.addIntIfDefined("eventNotificationTemplateId", self.eventNotificationTemplateId)
        return kparams

    def getEventNotificationTemplateId(self):
        return self.eventNotificationTemplateId

    def setEventNotificationTemplateId(self, newEventNotificationTemplateId):
        self.eventNotificationTemplateId = newEventNotificationTemplateId


########## services ##########
########## main ##########
class KalturaScheduledTaskEventNotificationClientPlugin(KalturaClientPlugin):
    # KalturaScheduledTaskEventNotificationClientPlugin
    instance = None

    # @return KalturaScheduledTaskEventNotificationClientPlugin
    @staticmethod
    def get():
        if KalturaScheduledTaskEventNotificationClientPlugin.instance == None:
            KalturaScheduledTaskEventNotificationClientPlugin.instance = KalturaScheduledTaskEventNotificationClientPlugin()
        return KalturaScheduledTaskEventNotificationClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
        }

    def getTypes(self):
        return {
            'KalturaDispatchEventNotificationObjectTask': KalturaDispatchEventNotificationObjectTask,
        }

    # @return string
    def getName(self):
        return 'scheduledTaskEventNotification'

