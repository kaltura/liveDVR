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
# @package Kaltura
# @subpackage Client
class KalturaWowzaMediaServerNodeOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    HEARTBEAT_TIME_ASC = "+heartbeatTime"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    HEARTBEAT_TIME_DESC = "-heartbeatTime"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaWowzaMediaServerNode(KalturaMediaServerNode):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            heartbeatTime=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            hostName=NotImplemented,
            status=NotImplemented,
            type=NotImplemented,
            tags=NotImplemented,
            dc=NotImplemented,
            parentId=NotImplemented,
            playbackDomain=NotImplemented,
            applicationName=NotImplemented,
            mediaServerPortConfig=NotImplemented,
            mediaServerPlaybackDomainConfig=NotImplemented,
            appPrefix=NotImplemented,
            transcoder=NotImplemented,
            GPUID=NotImplemented,
            liveServicePort=NotImplemented,
            liveServiceProtocol=NotImplemented,
            liveServiceInternalDomain=NotImplemented):
        KalturaMediaServerNode.__init__(self,
            id,
            partnerId,
            createdAt,
            updatedAt,
            heartbeatTime,
            name,
            systemName,
            description,
            hostName,
            status,
            type,
            tags,
            dc,
            parentId,
            playbackDomain,
            applicationName,
            mediaServerPortConfig,
            mediaServerPlaybackDomainConfig)

        # Wowza Media server app prefix
        # @var string
        self.appPrefix = appPrefix

        # Wowza Media server transcoder configuration overide
        # @var string
        self.transcoder = transcoder

        # Wowza Media server GPU index id
        # @var int
        self.GPUID = GPUID

        # Live service port
        # @var int
        self.liveServicePort = liveServicePort

        # Live service protocol
        # @var string
        self.liveServiceProtocol = liveServiceProtocol

        # Wowza media server live service internal domain
        # @var string
        self.liveServiceInternalDomain = liveServiceInternalDomain


    PROPERTY_LOADERS = {
        'appPrefix': getXmlNodeText, 
        'transcoder': getXmlNodeText, 
        'GPUID': getXmlNodeInt, 
        'liveServicePort': getXmlNodeInt, 
        'liveServiceProtocol': getXmlNodeText, 
        'liveServiceInternalDomain': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaMediaServerNode.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWowzaMediaServerNode.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaMediaServerNode.toParams(self)
        kparams.put("objectType", "KalturaWowzaMediaServerNode")
        kparams.addStringIfDefined("appPrefix", self.appPrefix)
        kparams.addStringIfDefined("transcoder", self.transcoder)
        kparams.addIntIfDefined("GPUID", self.GPUID)
        kparams.addIntIfDefined("liveServicePort", self.liveServicePort)
        kparams.addStringIfDefined("liveServiceProtocol", self.liveServiceProtocol)
        kparams.addStringIfDefined("liveServiceInternalDomain", self.liveServiceInternalDomain)
        return kparams

    def getAppPrefix(self):
        return self.appPrefix

    def setAppPrefix(self, newAppPrefix):
        self.appPrefix = newAppPrefix

    def getTranscoder(self):
        return self.transcoder

    def setTranscoder(self, newTranscoder):
        self.transcoder = newTranscoder

    def getGPUID(self):
        return self.GPUID

    def setGPUID(self, newGPUID):
        self.GPUID = newGPUID

    def getLiveServicePort(self):
        return self.liveServicePort

    def setLiveServicePort(self, newLiveServicePort):
        self.liveServicePort = newLiveServicePort

    def getLiveServiceProtocol(self):
        return self.liveServiceProtocol

    def setLiveServiceProtocol(self, newLiveServiceProtocol):
        self.liveServiceProtocol = newLiveServiceProtocol

    def getLiveServiceInternalDomain(self):
        return self.liveServiceInternalDomain

    def setLiveServiceInternalDomain(self, newLiveServiceInternalDomain):
        self.liveServiceInternalDomain = newLiveServiceInternalDomain


# @package Kaltura
# @subpackage Client
class KalturaWowzaMediaServerNodeBaseFilter(KalturaMediaServerNodeFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            heartbeatTimeGreaterThanOrEqual=NotImplemented,
            heartbeatTimeLessThanOrEqual=NotImplemented,
            nameEqual=NotImplemented,
            nameIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            hostNameLike=NotImplemented,
            hostNameMultiLikeOr=NotImplemented,
            hostNameMultiLikeAnd=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            playbackDomainLike=NotImplemented,
            playbackDomainMultiLikeOr=NotImplemented,
            playbackDomainMultiLikeAnd=NotImplemented):
        KalturaMediaServerNodeFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            heartbeatTimeGreaterThanOrEqual,
            heartbeatTimeLessThanOrEqual,
            nameEqual,
            nameIn,
            systemNameEqual,
            systemNameIn,
            hostNameLike,
            hostNameMultiLikeOr,
            hostNameMultiLikeAnd,
            statusEqual,
            statusIn,
            typeEqual,
            typeIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            dcEqual,
            dcIn,
            parentIdEqual,
            parentIdIn,
            playbackDomainLike,
            playbackDomainMultiLikeOr,
            playbackDomainMultiLikeAnd)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaMediaServerNodeFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWowzaMediaServerNodeBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaMediaServerNodeFilter.toParams(self)
        kparams.put("objectType", "KalturaWowzaMediaServerNodeBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaWowzaMediaServerNodeFilter(KalturaWowzaMediaServerNodeBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            heartbeatTimeGreaterThanOrEqual=NotImplemented,
            heartbeatTimeLessThanOrEqual=NotImplemented,
            nameEqual=NotImplemented,
            nameIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            hostNameLike=NotImplemented,
            hostNameMultiLikeOr=NotImplemented,
            hostNameMultiLikeAnd=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            dcEqual=NotImplemented,
            dcIn=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            playbackDomainLike=NotImplemented,
            playbackDomainMultiLikeOr=NotImplemented,
            playbackDomainMultiLikeAnd=NotImplemented):
        KalturaWowzaMediaServerNodeBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            heartbeatTimeGreaterThanOrEqual,
            heartbeatTimeLessThanOrEqual,
            nameEqual,
            nameIn,
            systemNameEqual,
            systemNameIn,
            hostNameLike,
            hostNameMultiLikeOr,
            hostNameMultiLikeAnd,
            statusEqual,
            statusIn,
            typeEqual,
            typeIn,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            dcEqual,
            dcIn,
            parentIdEqual,
            parentIdIn,
            playbackDomainLike,
            playbackDomainMultiLikeOr,
            playbackDomainMultiLikeAnd)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaWowzaMediaServerNodeBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaWowzaMediaServerNodeFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaWowzaMediaServerNodeBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaWowzaMediaServerNodeFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaWowzaClientPlugin(KalturaClientPlugin):
    # KalturaWowzaClientPlugin
    instance = None

    # @return KalturaWowzaClientPlugin
    @staticmethod
    def get():
        if KalturaWowzaClientPlugin.instance == None:
            KalturaWowzaClientPlugin.instance = KalturaWowzaClientPlugin()
        return KalturaWowzaClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaWowzaMediaServerNodeOrderBy': KalturaWowzaMediaServerNodeOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaWowzaMediaServerNode': KalturaWowzaMediaServerNode,
            'KalturaWowzaMediaServerNodeBaseFilter': KalturaWowzaMediaServerNodeBaseFilter,
            'KalturaWowzaMediaServerNodeFilter': KalturaWowzaMediaServerNodeFilter,
        }

    # @return string
    def getName(self):
        return 'wowza'

