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
class KalturaVarPartnerUsageItem(KalturaObjectBase):
    def __init__(self,
            partnerId=NotImplemented,
            partnerName=NotImplemented,
            partnerStatus=NotImplemented,
            partnerPackage=NotImplemented,
            partnerCreatedAt=NotImplemented,
            views=NotImplemented,
            plays=NotImplemented,
            entriesCount=NotImplemented,
            totalEntriesCount=NotImplemented,
            videoEntriesCount=NotImplemented,
            imageEntriesCount=NotImplemented,
            audioEntriesCount=NotImplemented,
            mixEntriesCount=NotImplemented,
            bandwidth=NotImplemented,
            totalStorage=NotImplemented,
            storage=NotImplemented,
            deletedStorage=NotImplemented,
            peakStorage=NotImplemented,
            avgStorage=NotImplemented,
            combinedStorageBandwidth=NotImplemented,
            transcodingUsage=NotImplemented,
            dateId=NotImplemented):
        KalturaObjectBase.__init__(self)

        # Partner ID
        # @var int
        self.partnerId = partnerId

        # Partner name
        # @var string
        self.partnerName = partnerName

        # Partner status
        # @var KalturaPartnerStatus
        self.partnerStatus = partnerStatus

        # Partner package
        # @var int
        self.partnerPackage = partnerPackage

        # Partner creation date (Unix timestamp)
        # @var int
        self.partnerCreatedAt = partnerCreatedAt

        # Number of player loads in the specific date range
        # @var int
        self.views = views

        # Number of plays in the specific date range
        # @var int
        self.plays = plays

        # Number of new entries created during specific date range
        # @var int
        self.entriesCount = entriesCount

        # Total number of entries
        # @var int
        self.totalEntriesCount = totalEntriesCount

        # Number of new video entries created during specific date range
        # @var int
        self.videoEntriesCount = videoEntriesCount

        # Number of new image entries created during specific date range
        # @var int
        self.imageEntriesCount = imageEntriesCount

        # Number of new audio entries created during specific date range
        # @var int
        self.audioEntriesCount = audioEntriesCount

        # Number of new mix entries created during specific date range
        # @var int
        self.mixEntriesCount = mixEntriesCount

        # The total bandwidth usage during the given date range (in MB)
        # @var float
        self.bandwidth = bandwidth

        # The total storage consumption (in MB)
        # @var float
        self.totalStorage = totalStorage

        # The added storage consumption (new uploads) during the given date range (in MB)
        # @var float
        self.storage = storage

        # The deleted storage consumption (new uploads) during the given date range (in MB)
        # @var float
        self.deletedStorage = deletedStorage

        # The peak amount of storage consumption during the given date range for the specific publisher
        # @var float
        self.peakStorage = peakStorage

        # The average amount of storage consumption during the given date range for the specific publisher
        # @var float
        self.avgStorage = avgStorage

        # The combined amount of bandwidth and storage consumed during the given date range for the specific publisher
        # @var float
        self.combinedStorageBandwidth = combinedStorageBandwidth

        # Amount of transcoding usage in MB
        # @var float
        self.transcodingUsage = transcodingUsage

        # TGhe date at which the report was taken - Unix Timestamp
        # @var string
        self.dateId = dateId


    PROPERTY_LOADERS = {
        'partnerId': getXmlNodeInt, 
        'partnerName': getXmlNodeText, 
        'partnerStatus': (KalturaEnumsFactory.createInt, "KalturaPartnerStatus"), 
        'partnerPackage': getXmlNodeInt, 
        'partnerCreatedAt': getXmlNodeInt, 
        'views': getXmlNodeInt, 
        'plays': getXmlNodeInt, 
        'entriesCount': getXmlNodeInt, 
        'totalEntriesCount': getXmlNodeInt, 
        'videoEntriesCount': getXmlNodeInt, 
        'imageEntriesCount': getXmlNodeInt, 
        'audioEntriesCount': getXmlNodeInt, 
        'mixEntriesCount': getXmlNodeInt, 
        'bandwidth': getXmlNodeFloat, 
        'totalStorage': getXmlNodeFloat, 
        'storage': getXmlNodeFloat, 
        'deletedStorage': getXmlNodeFloat, 
        'peakStorage': getXmlNodeFloat, 
        'avgStorage': getXmlNodeFloat, 
        'combinedStorageBandwidth': getXmlNodeFloat, 
        'transcodingUsage': getXmlNodeFloat, 
        'dateId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaVarPartnerUsageItem.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaVarPartnerUsageItem")
        kparams.addIntIfDefined("partnerId", self.partnerId)
        kparams.addStringIfDefined("partnerName", self.partnerName)
        kparams.addIntEnumIfDefined("partnerStatus", self.partnerStatus)
        kparams.addIntIfDefined("partnerPackage", self.partnerPackage)
        kparams.addIntIfDefined("partnerCreatedAt", self.partnerCreatedAt)
        kparams.addIntIfDefined("views", self.views)
        kparams.addIntIfDefined("plays", self.plays)
        kparams.addIntIfDefined("entriesCount", self.entriesCount)
        kparams.addIntIfDefined("totalEntriesCount", self.totalEntriesCount)
        kparams.addIntIfDefined("videoEntriesCount", self.videoEntriesCount)
        kparams.addIntIfDefined("imageEntriesCount", self.imageEntriesCount)
        kparams.addIntIfDefined("audioEntriesCount", self.audioEntriesCount)
        kparams.addIntIfDefined("mixEntriesCount", self.mixEntriesCount)
        kparams.addFloatIfDefined("bandwidth", self.bandwidth)
        kparams.addFloatIfDefined("totalStorage", self.totalStorage)
        kparams.addFloatIfDefined("storage", self.storage)
        kparams.addFloatIfDefined("deletedStorage", self.deletedStorage)
        kparams.addFloatIfDefined("peakStorage", self.peakStorage)
        kparams.addFloatIfDefined("avgStorage", self.avgStorage)
        kparams.addFloatIfDefined("combinedStorageBandwidth", self.combinedStorageBandwidth)
        kparams.addFloatIfDefined("transcodingUsage", self.transcodingUsage)
        kparams.addStringIfDefined("dateId", self.dateId)
        return kparams

    def getPartnerId(self):
        return self.partnerId

    def setPartnerId(self, newPartnerId):
        self.partnerId = newPartnerId

    def getPartnerName(self):
        return self.partnerName

    def setPartnerName(self, newPartnerName):
        self.partnerName = newPartnerName

    def getPartnerStatus(self):
        return self.partnerStatus

    def setPartnerStatus(self, newPartnerStatus):
        self.partnerStatus = newPartnerStatus

    def getPartnerPackage(self):
        return self.partnerPackage

    def setPartnerPackage(self, newPartnerPackage):
        self.partnerPackage = newPartnerPackage

    def getPartnerCreatedAt(self):
        return self.partnerCreatedAt

    def setPartnerCreatedAt(self, newPartnerCreatedAt):
        self.partnerCreatedAt = newPartnerCreatedAt

    def getViews(self):
        return self.views

    def setViews(self, newViews):
        self.views = newViews

    def getPlays(self):
        return self.plays

    def setPlays(self, newPlays):
        self.plays = newPlays

    def getEntriesCount(self):
        return self.entriesCount

    def setEntriesCount(self, newEntriesCount):
        self.entriesCount = newEntriesCount

    def getTotalEntriesCount(self):
        return self.totalEntriesCount

    def setTotalEntriesCount(self, newTotalEntriesCount):
        self.totalEntriesCount = newTotalEntriesCount

    def getVideoEntriesCount(self):
        return self.videoEntriesCount

    def setVideoEntriesCount(self, newVideoEntriesCount):
        self.videoEntriesCount = newVideoEntriesCount

    def getImageEntriesCount(self):
        return self.imageEntriesCount

    def setImageEntriesCount(self, newImageEntriesCount):
        self.imageEntriesCount = newImageEntriesCount

    def getAudioEntriesCount(self):
        return self.audioEntriesCount

    def setAudioEntriesCount(self, newAudioEntriesCount):
        self.audioEntriesCount = newAudioEntriesCount

    def getMixEntriesCount(self):
        return self.mixEntriesCount

    def setMixEntriesCount(self, newMixEntriesCount):
        self.mixEntriesCount = newMixEntriesCount

    def getBandwidth(self):
        return self.bandwidth

    def setBandwidth(self, newBandwidth):
        self.bandwidth = newBandwidth

    def getTotalStorage(self):
        return self.totalStorage

    def setTotalStorage(self, newTotalStorage):
        self.totalStorage = newTotalStorage

    def getStorage(self):
        return self.storage

    def setStorage(self, newStorage):
        self.storage = newStorage

    def getDeletedStorage(self):
        return self.deletedStorage

    def setDeletedStorage(self, newDeletedStorage):
        self.deletedStorage = newDeletedStorage

    def getPeakStorage(self):
        return self.peakStorage

    def setPeakStorage(self, newPeakStorage):
        self.peakStorage = newPeakStorage

    def getAvgStorage(self):
        return self.avgStorage

    def setAvgStorage(self, newAvgStorage):
        self.avgStorage = newAvgStorage

    def getCombinedStorageBandwidth(self):
        return self.combinedStorageBandwidth

    def setCombinedStorageBandwidth(self, newCombinedStorageBandwidth):
        self.combinedStorageBandwidth = newCombinedStorageBandwidth

    def getTranscodingUsage(self):
        return self.transcodingUsage

    def setTranscodingUsage(self, newTranscodingUsage):
        self.transcodingUsage = newTranscodingUsage

    def getDateId(self):
        return self.dateId

    def setDateId(self, newDateId):
        self.dateId = newDateId


# @package Kaltura
# @subpackage Client
class KalturaPartnerUsageListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            total=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var KalturaVarPartnerUsageItem
        self.total = total

        # @var array of KalturaVarPartnerUsageItem
        self.objects = objects


    PROPERTY_LOADERS = {
        'total': (KalturaObjectFactory.create, KalturaVarPartnerUsageItem), 
        'objects': (KalturaObjectFactory.createArray, KalturaVarPartnerUsageItem), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPartnerUsageListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaPartnerUsageListResponse")
        kparams.addObjectIfDefined("total", self.total)
        kparams.addArrayIfDefined("objects", self.objects)
        return kparams

    def getTotal(self):
        return self.total

    def setTotal(self, newTotal):
        self.total = newTotal

    def getObjects(self):
        return self.objects

    def setObjects(self, newObjects):
        self.objects = newObjects


# @package Kaltura
# @subpackage Client
class KalturaVarPartnerUsageTotalItem(KalturaVarPartnerUsageItem):
    def __init__(self,
            partnerId=NotImplemented,
            partnerName=NotImplemented,
            partnerStatus=NotImplemented,
            partnerPackage=NotImplemented,
            partnerCreatedAt=NotImplemented,
            views=NotImplemented,
            plays=NotImplemented,
            entriesCount=NotImplemented,
            totalEntriesCount=NotImplemented,
            videoEntriesCount=NotImplemented,
            imageEntriesCount=NotImplemented,
            audioEntriesCount=NotImplemented,
            mixEntriesCount=NotImplemented,
            bandwidth=NotImplemented,
            totalStorage=NotImplemented,
            storage=NotImplemented,
            deletedStorage=NotImplemented,
            peakStorage=NotImplemented,
            avgStorage=NotImplemented,
            combinedStorageBandwidth=NotImplemented,
            transcodingUsage=NotImplemented,
            dateId=NotImplemented):
        KalturaVarPartnerUsageItem.__init__(self,
            partnerId,
            partnerName,
            partnerStatus,
            partnerPackage,
            partnerCreatedAt,
            views,
            plays,
            entriesCount,
            totalEntriesCount,
            videoEntriesCount,
            imageEntriesCount,
            audioEntriesCount,
            mixEntriesCount,
            bandwidth,
            totalStorage,
            storage,
            deletedStorage,
            peakStorage,
            avgStorage,
            combinedStorageBandwidth,
            transcodingUsage,
            dateId)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaVarPartnerUsageItem.fromXml(self, node)
        self.fromXmlImpl(node, KalturaVarPartnerUsageTotalItem.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaVarPartnerUsageItem.toParams(self)
        kparams.put("objectType", "KalturaVarPartnerUsageTotalItem")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaVarConsoleService(KalturaServiceBase):
    """Utility service for the Multi-publishers console"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def getPartnerUsage(self, partnerFilter = NotImplemented, usageFilter = NotImplemented, pager = NotImplemented):
        """Function which calulates partner usage of a group of a VAR's sub-publishers"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("partnerFilter", partnerFilter)
        kparams.addObjectIfDefined("usageFilter", usageFilter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("varconsole_varconsole", "getPartnerUsage", KalturaPartnerUsageListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaPartnerUsageListResponse)

    def updateStatus(self, id, status):
        """Function to change a sub-publisher's status"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addIntIfDefined("status", status);
        self.client.queueServiceActionCall("varconsole_varconsole", "updateStatus", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()

########## main ##########
class KalturaVarConsoleClientPlugin(KalturaClientPlugin):
    # KalturaVarConsoleClientPlugin
    instance = None

    # @return KalturaVarConsoleClientPlugin
    @staticmethod
    def get():
        if KalturaVarConsoleClientPlugin.instance == None:
            KalturaVarConsoleClientPlugin.instance = KalturaVarConsoleClientPlugin()
        return KalturaVarConsoleClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'varConsole': KalturaVarConsoleService,
        }

    def getEnums(self):
        return {
        }

    def getTypes(self):
        return {
            'KalturaVarPartnerUsageItem': KalturaVarPartnerUsageItem,
            'KalturaPartnerUsageListResponse': KalturaPartnerUsageListResponse,
            'KalturaVarPartnerUsageTotalItem': KalturaVarPartnerUsageTotalItem,
        }

    # @return string
    def getName(self):
        return 'varConsole'

