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
from Metadata import *
from ..Base import *

########## enums ##########
########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaExecuteMetadataXsltObjectTask(KalturaObjectTask):
    def __init__(self,
            type=NotImplemented,
            stopProcessingOnError=NotImplemented,
            metadataProfileId=NotImplemented,
            metadataObjectType=NotImplemented,
            xslt=NotImplemented):
        KalturaObjectTask.__init__(self,
            type,
            stopProcessingOnError)

        # Metadata profile id to lookup the metadata object
        # @var int
        self.metadataProfileId = metadataProfileId

        # Metadata object type to lookup the metadata object
        # @var KalturaMetadataObjectType
        self.metadataObjectType = metadataObjectType

        # The XSLT to execute
        # @var string
        self.xslt = xslt


    PROPERTY_LOADERS = {
        'metadataProfileId': getXmlNodeInt, 
        'metadataObjectType': (KalturaEnumsFactory.createString, "KalturaMetadataObjectType"), 
        'xslt': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectTask.fromXml(self, node)
        self.fromXmlImpl(node, KalturaExecuteMetadataXsltObjectTask.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectTask.toParams(self)
        kparams.put("objectType", "KalturaExecuteMetadataXsltObjectTask")
        kparams.addIntIfDefined("metadataProfileId", self.metadataProfileId)
        kparams.addStringEnumIfDefined("metadataObjectType", self.metadataObjectType)
        kparams.addStringIfDefined("xslt", self.xslt)
        return kparams

    def getMetadataProfileId(self):
        return self.metadataProfileId

    def setMetadataProfileId(self, newMetadataProfileId):
        self.metadataProfileId = newMetadataProfileId

    def getMetadataObjectType(self):
        return self.metadataObjectType

    def setMetadataObjectType(self, newMetadataObjectType):
        self.metadataObjectType = newMetadataObjectType

    def getXslt(self):
        return self.xslt

    def setXslt(self, newXslt):
        self.xslt = newXslt


########## services ##########
########## main ##########
class KalturaScheduledTaskMetadataClientPlugin(KalturaClientPlugin):
    # KalturaScheduledTaskMetadataClientPlugin
    instance = None

    # @return KalturaScheduledTaskMetadataClientPlugin
    @staticmethod
    def get():
        if KalturaScheduledTaskMetadataClientPlugin.instance == None:
            KalturaScheduledTaskMetadataClientPlugin.instance = KalturaScheduledTaskMetadataClientPlugin()
        return KalturaScheduledTaskMetadataClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
        }

    def getTypes(self):
        return {
            'KalturaExecuteMetadataXsltObjectTask': KalturaExecuteMetadataXsltObjectTask,
        }

    # @return string
    def getName(self):
        return 'scheduledTaskMetadata'

