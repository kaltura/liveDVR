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
from Metadata import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaIntegrationProviderType(object):
    CIELO24 = "cielo24.Cielo24"
    DEXTER = "dexterIntegration.Dexter"
    EXAMPLE = "exampleIntegration.Example"
    VOICEBASE = "voicebase.Voicebase"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaIntegrationTriggerType(object):
    BPM_EVENT_NOTIFICATION = "bpmEventNotificationIntegration.BpmEventNotification"
    MANUAL = "1"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaIntegrationJobProviderData(KalturaObjectBase):
    def __init__(self):
        KalturaObjectBase.__init__(self)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaIntegrationJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaIntegrationJobProviderData")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaIntegrationJobTriggerData(KalturaObjectBase):
    def __init__(self):
        KalturaObjectBase.__init__(self)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaIntegrationJobTriggerData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaIntegrationJobTriggerData")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaIntegrationJobData(KalturaJobData):
    def __init__(self,
            callbackNotificationUrl=NotImplemented,
            providerType=NotImplemented,
            providerData=NotImplemented,
            triggerType=NotImplemented,
            triggerData=NotImplemented):
        KalturaJobData.__init__(self)

        # @var string
        # @readonly
        self.callbackNotificationUrl = callbackNotificationUrl

        # @var KalturaIntegrationProviderType
        self.providerType = providerType

        # Additional data that relevant for the provider only
        # @var KalturaIntegrationJobProviderData
        self.providerData = providerData

        # @var KalturaIntegrationTriggerType
        self.triggerType = triggerType

        # Additional data that relevant for the trigger only
        # @var KalturaIntegrationJobTriggerData
        self.triggerData = triggerData


    PROPERTY_LOADERS = {
        'callbackNotificationUrl': getXmlNodeText, 
        'providerType': (KalturaEnumsFactory.createString, "KalturaIntegrationProviderType"), 
        'providerData': (KalturaObjectFactory.create, KalturaIntegrationJobProviderData), 
        'triggerType': (KalturaEnumsFactory.createString, "KalturaIntegrationTriggerType"), 
        'triggerData': (KalturaObjectFactory.create, KalturaIntegrationJobTriggerData), 
    }

    def fromXml(self, node):
        KalturaJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaIntegrationJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaJobData.toParams(self)
        kparams.put("objectType", "KalturaIntegrationJobData")
        kparams.addStringEnumIfDefined("providerType", self.providerType)
        kparams.addObjectIfDefined("providerData", self.providerData)
        kparams.addStringEnumIfDefined("triggerType", self.triggerType)
        kparams.addObjectIfDefined("triggerData", self.triggerData)
        return kparams

    def getCallbackNotificationUrl(self):
        return self.callbackNotificationUrl

    def getProviderType(self):
        return self.providerType

    def setProviderType(self, newProviderType):
        self.providerType = newProviderType

    def getProviderData(self):
        return self.providerData

    def setProviderData(self, newProviderData):
        self.providerData = newProviderData

    def getTriggerType(self):
        return self.triggerType

    def setTriggerType(self, newTriggerType):
        self.triggerType = newTriggerType

    def getTriggerData(self):
        return self.triggerData

    def setTriggerData(self, newTriggerData):
        self.triggerData = newTriggerData


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaIntegrationService(KalturaServiceBase):
    """Integration service lets you dispatch integration tasks"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def dispatch(self, data, objectType, objectId):
        """Dispatch integration task"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("data", data)
        kparams.addStringIfDefined("objectType", objectType)
        kparams.addStringIfDefined("objectId", objectId)
        self.client.queueServiceActionCall("integration_integration", "dispatch", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return getXmlNodeInt(resultNode)

    def notify(self, id):
        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("integration_integration", "notify", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()

########## main ##########
class KalturaIntegrationClientPlugin(KalturaClientPlugin):
    # KalturaIntegrationClientPlugin
    instance = None

    # @return KalturaIntegrationClientPlugin
    @staticmethod
    def get():
        if KalturaIntegrationClientPlugin.instance == None:
            KalturaIntegrationClientPlugin.instance = KalturaIntegrationClientPlugin()
        return KalturaIntegrationClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'integration': KalturaIntegrationService,
        }

    def getEnums(self):
        return {
            'KalturaIntegrationProviderType': KalturaIntegrationProviderType,
            'KalturaIntegrationTriggerType': KalturaIntegrationTriggerType,
        }

    def getTypes(self):
        return {
            'KalturaIntegrationJobProviderData': KalturaIntegrationJobProviderData,
            'KalturaIntegrationJobTriggerData': KalturaIntegrationJobTriggerData,
            'KalturaIntegrationJobData': KalturaIntegrationJobData,
        }

    # @return string
    def getName(self):
        return 'integration'

