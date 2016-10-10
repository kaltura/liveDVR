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
from BulkUpload import *
from ..Base import *

########## enums ##########
########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaBulkUploadXmlJobData(KalturaBulkUploadJobData):
    """Represents the Bulk upload job data for xml bulk upload"""

    def __init__(self,
            userId=NotImplemented,
            uploadedBy=NotImplemented,
            conversionProfileId=NotImplemented,
            resultsFileLocalPath=NotImplemented,
            resultsFileUrl=NotImplemented,
            numOfEntries=NotImplemented,
            numOfObjects=NotImplemented,
            filePath=NotImplemented,
            bulkUploadObjectType=NotImplemented,
            fileName=NotImplemented,
            objectData=NotImplemented,
            type=NotImplemented,
            emailRecipients=NotImplemented,
            numOfErrorObjects=NotImplemented):
        KalturaBulkUploadJobData.__init__(self,
            userId,
            uploadedBy,
            conversionProfileId,
            resultsFileLocalPath,
            resultsFileUrl,
            numOfEntries,
            numOfObjects,
            filePath,
            bulkUploadObjectType,
            fileName,
            objectData,
            type,
            emailRecipients,
            numOfErrorObjects)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaBulkUploadJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaBulkUploadXmlJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaBulkUploadJobData.toParams(self)
        kparams.put("objectType", "KalturaBulkUploadXmlJobData")
        return kparams


########## services ##########
########## main ##########
class KalturaBulkUploadXmlClientPlugin(KalturaClientPlugin):
    # KalturaBulkUploadXmlClientPlugin
    instance = None

    # @return KalturaBulkUploadXmlClientPlugin
    @staticmethod
    def get():
        if KalturaBulkUploadXmlClientPlugin.instance == None:
            KalturaBulkUploadXmlClientPlugin.instance = KalturaBulkUploadXmlClientPlugin()
        return KalturaBulkUploadXmlClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
        }

    def getTypes(self):
        return {
            'KalturaBulkUploadXmlJobData': KalturaBulkUploadXmlJobData,
        }

    # @return string
    def getName(self):
        return 'bulkUploadXml'

