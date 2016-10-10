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
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaCielo24Fidelity(object):
    MECHANICAL = "MECHANICAL"
    PREMIUM = "PREMIUM"
    PROFESSIONAL = "PROFESSIONAL"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaCielo24Priority(object):
    PRIORITY = "PRIORITY"
    STANDARD = "STANDARD"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaCielo24JobProviderData(KalturaIntegrationJobProviderData):
    def __init__(self,
            entryId=NotImplemented,
            flavorAssetId=NotImplemented,
            captionAssetFormats=NotImplemented,
            priority=NotImplemented,
            fidelity=NotImplemented,
            username=NotImplemented,
            password=NotImplemented,
            baseUrl=NotImplemented,
            spokenLanguage=NotImplemented,
            replaceMediaContent=NotImplemented):
        KalturaIntegrationJobProviderData.__init__(self)

        # Entry ID
        # @var string
        self.entryId = entryId

        # Flavor ID
        # @var string
        self.flavorAssetId = flavorAssetId

        # Caption formats
        # @var string
        self.captionAssetFormats = captionAssetFormats

        # @var KalturaCielo24Priority
        self.priority = priority

        # @var KalturaCielo24Fidelity
        self.fidelity = fidelity

        # Api key for service provider
        # @var string
        # @readonly
        self.username = username

        # Api key for service provider
        # @var string
        # @readonly
        self.password = password

        # Base url for service provider
        # @var string
        # @readonly
        self.baseUrl = baseUrl

        # Transcript content language
        # @var KalturaLanguage
        self.spokenLanguage = spokenLanguage

        # should replace remote media content
        # @var bool
        self.replaceMediaContent = replaceMediaContent


    PROPERTY_LOADERS = {
        'entryId': getXmlNodeText, 
        'flavorAssetId': getXmlNodeText, 
        'captionAssetFormats': getXmlNodeText, 
        'priority': (KalturaEnumsFactory.createString, "KalturaCielo24Priority"), 
        'fidelity': (KalturaEnumsFactory.createString, "KalturaCielo24Fidelity"), 
        'username': getXmlNodeText, 
        'password': getXmlNodeText, 
        'baseUrl': getXmlNodeText, 
        'spokenLanguage': (KalturaEnumsFactory.createString, "KalturaLanguage"), 
        'replaceMediaContent': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaIntegrationJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaCielo24JobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaIntegrationJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaCielo24JobProviderData")
        kparams.addStringIfDefined("entryId", self.entryId)
        kparams.addStringIfDefined("flavorAssetId", self.flavorAssetId)
        kparams.addStringIfDefined("captionAssetFormats", self.captionAssetFormats)
        kparams.addStringEnumIfDefined("priority", self.priority)
        kparams.addStringEnumIfDefined("fidelity", self.fidelity)
        kparams.addStringEnumIfDefined("spokenLanguage", self.spokenLanguage)
        kparams.addBoolIfDefined("replaceMediaContent", self.replaceMediaContent)
        return kparams

    def getEntryId(self):
        return self.entryId

    def setEntryId(self, newEntryId):
        self.entryId = newEntryId

    def getFlavorAssetId(self):
        return self.flavorAssetId

    def setFlavorAssetId(self, newFlavorAssetId):
        self.flavorAssetId = newFlavorAssetId

    def getCaptionAssetFormats(self):
        return self.captionAssetFormats

    def setCaptionAssetFormats(self, newCaptionAssetFormats):
        self.captionAssetFormats = newCaptionAssetFormats

    def getPriority(self):
        return self.priority

    def setPriority(self, newPriority):
        self.priority = newPriority

    def getFidelity(self):
        return self.fidelity

    def setFidelity(self, newFidelity):
        self.fidelity = newFidelity

    def getUsername(self):
        return self.username

    def getPassword(self):
        return self.password

    def getBaseUrl(self):
        return self.baseUrl

    def getSpokenLanguage(self):
        return self.spokenLanguage

    def setSpokenLanguage(self, newSpokenLanguage):
        self.spokenLanguage = newSpokenLanguage

    def getReplaceMediaContent(self):
        return self.replaceMediaContent

    def setReplaceMediaContent(self, newReplaceMediaContent):
        self.replaceMediaContent = newReplaceMediaContent


########## services ##########
########## main ##########
class KalturaCielo24ClientPlugin(KalturaClientPlugin):
    # KalturaCielo24ClientPlugin
    instance = None

    # @return KalturaCielo24ClientPlugin
    @staticmethod
    def get():
        if KalturaCielo24ClientPlugin.instance == None:
            KalturaCielo24ClientPlugin.instance = KalturaCielo24ClientPlugin()
        return KalturaCielo24ClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaCielo24Fidelity': KalturaCielo24Fidelity,
            'KalturaCielo24Priority': KalturaCielo24Priority,
        }

    def getTypes(self):
        return {
            'KalturaCielo24JobProviderData': KalturaCielo24JobProviderData,
        }

    # @return string
    def getName(self):
        return 'cielo24'

