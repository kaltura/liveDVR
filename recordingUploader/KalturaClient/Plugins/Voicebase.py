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
########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaVoicebaseJobProviderData(KalturaIntegrationJobProviderData):
    def __init__(self,
            entryId=NotImplemented,
            flavorAssetId=NotImplemented,
            transcriptId=NotImplemented,
            captionAssetFormats=NotImplemented,
            apiKey=NotImplemented,
            apiPassword=NotImplemented,
            spokenLanguage=NotImplemented,
            fileLocation=NotImplemented,
            replaceMediaContent=NotImplemented):
        KalturaIntegrationJobProviderData.__init__(self)

        # Entry ID
        # @var string
        self.entryId = entryId

        # Flavor ID
        # @var string
        self.flavorAssetId = flavorAssetId

        # input Transcript-asset ID
        # @var string
        self.transcriptId = transcriptId

        # Caption formats
        # @var string
        self.captionAssetFormats = captionAssetFormats

        # Api key for service provider
        # @var string
        # @readonly
        self.apiKey = apiKey

        # Api key for service provider
        # @var string
        # @readonly
        self.apiPassword = apiPassword

        # Transcript content language
        # @var KalturaLanguage
        self.spokenLanguage = spokenLanguage

        # Transcript Content location
        # @var string
        # @readonly
        self.fileLocation = fileLocation

        # should replace remote media content
        # @var bool
        self.replaceMediaContent = replaceMediaContent


    PROPERTY_LOADERS = {
        'entryId': getXmlNodeText, 
        'flavorAssetId': getXmlNodeText, 
        'transcriptId': getXmlNodeText, 
        'captionAssetFormats': getXmlNodeText, 
        'apiKey': getXmlNodeText, 
        'apiPassword': getXmlNodeText, 
        'spokenLanguage': (KalturaEnumsFactory.createString, "KalturaLanguage"), 
        'fileLocation': getXmlNodeText, 
        'replaceMediaContent': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaIntegrationJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaVoicebaseJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaIntegrationJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaVoicebaseJobProviderData")
        kparams.addStringIfDefined("entryId", self.entryId)
        kparams.addStringIfDefined("flavorAssetId", self.flavorAssetId)
        kparams.addStringIfDefined("transcriptId", self.transcriptId)
        kparams.addStringIfDefined("captionAssetFormats", self.captionAssetFormats)
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

    def getTranscriptId(self):
        return self.transcriptId

    def setTranscriptId(self, newTranscriptId):
        self.transcriptId = newTranscriptId

    def getCaptionAssetFormats(self):
        return self.captionAssetFormats

    def setCaptionAssetFormats(self, newCaptionAssetFormats):
        self.captionAssetFormats = newCaptionAssetFormats

    def getApiKey(self):
        return self.apiKey

    def getApiPassword(self):
        return self.apiPassword

    def getSpokenLanguage(self):
        return self.spokenLanguage

    def setSpokenLanguage(self, newSpokenLanguage):
        self.spokenLanguage = newSpokenLanguage

    def getFileLocation(self):
        return self.fileLocation

    def getReplaceMediaContent(self):
        return self.replaceMediaContent

    def setReplaceMediaContent(self, newReplaceMediaContent):
        self.replaceMediaContent = newReplaceMediaContent


########## services ##########
########## main ##########
class KalturaVoicebaseClientPlugin(KalturaClientPlugin):
    # KalturaVoicebaseClientPlugin
    instance = None

    # @return KalturaVoicebaseClientPlugin
    @staticmethod
    def get():
        if KalturaVoicebaseClientPlugin.instance == None:
            KalturaVoicebaseClientPlugin.instance = KalturaVoicebaseClientPlugin()
        return KalturaVoicebaseClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
        }

    def getTypes(self):
        return {
            'KalturaVoicebaseJobProviderData': KalturaVoicebaseJobProviderData,
        }

    # @return string
    def getName(self):
        return 'voicebase'

