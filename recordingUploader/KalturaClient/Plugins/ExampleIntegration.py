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
class KalturaExampleIntegrationJobProviderData(KalturaIntegrationJobProviderData):
    def __init__(self,
            exampleUrl=NotImplemented):
        KalturaIntegrationJobProviderData.__init__(self)

        # Just an example
        # @var string
        self.exampleUrl = exampleUrl


    PROPERTY_LOADERS = {
        'exampleUrl': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaIntegrationJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaExampleIntegrationJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaIntegrationJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaExampleIntegrationJobProviderData")
        kparams.addStringIfDefined("exampleUrl", self.exampleUrl)
        return kparams

    def getExampleUrl(self):
        return self.exampleUrl

    def setExampleUrl(self, newExampleUrl):
        self.exampleUrl = newExampleUrl


########## services ##########
########## main ##########
class KalturaExampleIntegrationClientPlugin(KalturaClientPlugin):
    # KalturaExampleIntegrationClientPlugin
    instance = None

    # @return KalturaExampleIntegrationClientPlugin
    @staticmethod
    def get():
        if KalturaExampleIntegrationClientPlugin.instance == None:
            KalturaExampleIntegrationClientPlugin.instance = KalturaExampleIntegrationClientPlugin()
        return KalturaExampleIntegrationClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
        }

    def getTypes(self):
        return {
            'KalturaExampleIntegrationJobProviderData': KalturaExampleIntegrationJobProviderData,
        }

    # @return string
    def getName(self):
        return 'exampleIntegration'

