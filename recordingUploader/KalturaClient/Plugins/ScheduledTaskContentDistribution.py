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
from ContentDistribution import *
from ..Base import *

########## enums ##########
########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaDistributeObjectTask(KalturaObjectTask):
    def __init__(self,
            type=NotImplemented,
            stopProcessingOnError=NotImplemented,
            distributionProfileId=NotImplemented):
        KalturaObjectTask.__init__(self,
            type,
            stopProcessingOnError)

        # Distribution profile id
        # @var string
        self.distributionProfileId = distributionProfileId


    PROPERTY_LOADERS = {
        'distributionProfileId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectTask.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributeObjectTask.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectTask.toParams(self)
        kparams.put("objectType", "KalturaDistributeObjectTask")
        kparams.addStringIfDefined("distributionProfileId", self.distributionProfileId)
        return kparams

    def getDistributionProfileId(self):
        return self.distributionProfileId

    def setDistributionProfileId(self, newDistributionProfileId):
        self.distributionProfileId = newDistributionProfileId


########## services ##########
########## main ##########
class KalturaScheduledTaskContentDistributionClientPlugin(KalturaClientPlugin):
    # KalturaScheduledTaskContentDistributionClientPlugin
    instance = None

    # @return KalturaScheduledTaskContentDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaScheduledTaskContentDistributionClientPlugin.instance == None:
            KalturaScheduledTaskContentDistributionClientPlugin.instance = KalturaScheduledTaskContentDistributionClientPlugin()
        return KalturaScheduledTaskContentDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
        }

    def getTypes(self):
        return {
            'KalturaDistributeObjectTask': KalturaDistributeObjectTask,
        }

    # @return string
    def getName(self):
        return 'scheduledTaskContentDistribution'

