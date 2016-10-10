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
from ..Base import *

########## enums ##########
########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaABCScreenersWatermarkCondition(KalturaCondition):
    def __init__(self,
            type=NotImplemented,
            description=NotImplemented,
            not_=NotImplemented):
        KalturaCondition.__init__(self,
            type,
            description,
            not_)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaCondition.fromXml(self, node)
        self.fromXmlImpl(node, KalturaABCScreenersWatermarkCondition.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCondition.toParams(self)
        kparams.put("objectType", "KalturaABCScreenersWatermarkCondition")
        return kparams


########## services ##########
########## main ##########
class KalturaAbcScreenersWatermarkAccessControlClientPlugin(KalturaClientPlugin):
    # KalturaAbcScreenersWatermarkAccessControlClientPlugin
    instance = None

    # @return KalturaAbcScreenersWatermarkAccessControlClientPlugin
    @staticmethod
    def get():
        if KalturaAbcScreenersWatermarkAccessControlClientPlugin.instance == None:
            KalturaAbcScreenersWatermarkAccessControlClientPlugin.instance = KalturaAbcScreenersWatermarkAccessControlClientPlugin()
        return KalturaAbcScreenersWatermarkAccessControlClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
        }

    def getTypes(self):
        return {
            'KalturaABCScreenersWatermarkCondition': KalturaABCScreenersWatermarkCondition,
        }

    # @return string
    def getName(self):
        return 'abcScreenersWatermarkAccessControl'

