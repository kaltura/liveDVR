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
class KalturaDexterIntegrationJobProviderData(KalturaIntegrationJobProviderData):
    def __init__(self,
            metadataProfileId=NotImplemented,
            transcriptAssetId=NotImplemented,
            entryId=NotImplemented):
        KalturaIntegrationJobProviderData.__init__(self)

        # ID of the metadata profile for the extracted term metadata
        # @var int
        self.metadataProfileId = metadataProfileId

        # ID of the transcript asset
        # @var string
        self.transcriptAssetId = transcriptAssetId

        # ID of the entry
        # @var string
        self.entryId = entryId


    PROPERTY_LOADERS = {
        'metadataProfileId': getXmlNodeInt, 
        'transcriptAssetId': getXmlNodeText, 
        'entryId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaIntegrationJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDexterIntegrationJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaIntegrationJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaDexterIntegrationJobProviderData")
        kparams.addIntIfDefined("metadataProfileId", self.metadataProfileId)
        kparams.addStringIfDefined("transcriptAssetId", self.transcriptAssetId)
        kparams.addStringIfDefined("entryId", self.entryId)
        return kparams

    def getMetadataProfileId(self):
        return self.metadataProfileId

    def setMetadataProfileId(self, newMetadataProfileId):
        self.metadataProfileId = newMetadataProfileId

    def getTranscriptAssetId(self):
        return self.transcriptAssetId

    def setTranscriptAssetId(self, newTranscriptAssetId):
        self.transcriptAssetId = newTranscriptAssetId

    def getEntryId(self):
        return self.entryId

    def setEntryId(self, newEntryId):
        self.entryId = newEntryId


########## services ##########
########## main ##########
class KalturaDexterIntegrationClientPlugin(KalturaClientPlugin):
    # KalturaDexterIntegrationClientPlugin
    instance = None

    # @return KalturaDexterIntegrationClientPlugin
    @staticmethod
    def get():
        if KalturaDexterIntegrationClientPlugin.instance == None:
            KalturaDexterIntegrationClientPlugin.instance = KalturaDexterIntegrationClientPlugin()
        return KalturaDexterIntegrationClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
        }

    def getTypes(self):
        return {
            'KalturaDexterIntegrationJobProviderData': KalturaDexterIntegrationJobProviderData,
        }

    # @return string
    def getName(self):
        return 'dexterIntegration'

