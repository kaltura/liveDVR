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
from Integration import *
from BusinessProcessNotification import *
from ..Base import *

########## enums ##########
########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaBpmEventNotificationIntegrationJobTriggerData(KalturaIntegrationJobTriggerData):
    def __init__(self,
            templateId=NotImplemented,
            businessProcessId=NotImplemented,
            caseId=NotImplemented):
        KalturaIntegrationJobTriggerData.__init__(self)

        # KalturaBusinessProcessNotificationTemplate id
        # @var int
        self.templateId = templateId

        # @var string
        self.businessProcessId = businessProcessId

        # Execution unique id
        # @var string
        self.caseId = caseId


    PROPERTY_LOADERS = {
        'templateId': getXmlNodeInt, 
        'businessProcessId': getXmlNodeText, 
        'caseId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaIntegrationJobTriggerData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBpmEventNotificationIntegrationJobTriggerData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaIntegrationJobTriggerData.toParams(self)
        kparams.put("objectType", "KalturaBpmEventNotificationIntegrationJobTriggerData")
        kparams.addIntIfDefined("templateId", self.templateId)
        kparams.addStringIfDefined("businessProcessId", self.businessProcessId)
        kparams.addStringIfDefined("caseId", self.caseId)
        return kparams

    def getTemplateId(self):
        return self.templateId

    def setTemplateId(self, newTemplateId):
        self.templateId = newTemplateId

    def getBusinessProcessId(self):
        return self.businessProcessId

    def setBusinessProcessId(self, newBusinessProcessId):
        self.businessProcessId = newBusinessProcessId

    def getCaseId(self):
        return self.caseId

    def setCaseId(self, newCaseId):
        self.caseId = newCaseId


########## services ##########
########## main ##########
class KalturaBpmEventNotificationIntegrationClientPlugin(KalturaClientPlugin):
    # KalturaBpmEventNotificationIntegrationClientPlugin
    instance = None

    # @return KalturaBpmEventNotificationIntegrationClientPlugin
    @staticmethod
    def get():
        if KalturaBpmEventNotificationIntegrationClientPlugin.instance == None:
            KalturaBpmEventNotificationIntegrationClientPlugin.instance = KalturaBpmEventNotificationIntegrationClientPlugin()
        return KalturaBpmEventNotificationIntegrationClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
        }

    def getTypes(self):
        return {
            'KalturaBpmEventNotificationIntegrationJobTriggerData': KalturaBpmEventNotificationIntegrationJobTriggerData,
        }

    # @return string
    def getName(self):
        return 'bpmEventNotificationIntegration'

