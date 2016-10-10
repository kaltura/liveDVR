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
class KalturaVelocixProvisionJobData(KalturaProvisionJobData):
    def __init__(self,
            streamID=NotImplemented,
            backupStreamID=NotImplemented,
            rtmp=NotImplemented,
            encoderIP=NotImplemented,
            backupEncoderIP=NotImplemented,
            encoderPassword=NotImplemented,
            encoderUsername=NotImplemented,
            endDate=NotImplemented,
            returnVal=NotImplemented,
            mediaType=NotImplemented,
            primaryBroadcastingUrl=NotImplemented,
            secondaryBroadcastingUrl=NotImplemented,
            streamName=NotImplemented,
            provisioningParams=NotImplemented,
            userName=NotImplemented,
            password=NotImplemented):
        KalturaProvisionJobData.__init__(self,
            streamID,
            backupStreamID,
            rtmp,
            encoderIP,
            backupEncoderIP,
            encoderPassword,
            encoderUsername,
            endDate,
            returnVal,
            mediaType,
            primaryBroadcastingUrl,
            secondaryBroadcastingUrl,
            streamName)

        # @var array of KalturaKeyValue
        self.provisioningParams = provisioningParams

        # @var string
        self.userName = userName

        # @var string
        self.password = password


    PROPERTY_LOADERS = {
        'provisioningParams': (KalturaObjectFactory.createArray, KalturaKeyValue), 
        'userName': getXmlNodeText, 
        'password': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaProvisionJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaVelocixProvisionJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaProvisionJobData.toParams(self)
        kparams.put("objectType", "KalturaVelocixProvisionJobData")
        kparams.addArrayIfDefined("provisioningParams", self.provisioningParams)
        kparams.addStringIfDefined("userName", self.userName)
        kparams.addStringIfDefined("password", self.password)
        return kparams

    def getProvisioningParams(self):
        return self.provisioningParams

    def setProvisioningParams(self, newProvisioningParams):
        self.provisioningParams = newProvisioningParams

    def getUserName(self):
        return self.userName

    def setUserName(self, newUserName):
        self.userName = newUserName

    def getPassword(self):
        return self.password

    def setPassword(self, newPassword):
        self.password = newPassword


########## services ##########
########## main ##########
class KalturaVelocixClientPlugin(KalturaClientPlugin):
    # KalturaVelocixClientPlugin
    instance = None

    # @return KalturaVelocixClientPlugin
    @staticmethod
    def get():
        if KalturaVelocixClientPlugin.instance == None:
            KalturaVelocixClientPlugin.instance = KalturaVelocixClientPlugin()
        return KalturaVelocixClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
        }

    def getTypes(self):
        return {
            'KalturaVelocixProvisionJobData': KalturaVelocixProvisionJobData,
        }

    # @return string
    def getName(self):
        return 'velocix'

