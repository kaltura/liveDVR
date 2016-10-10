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
class KalturaLikeOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaLike(KalturaObjectBase):
    def __init__(self,
            entryId=NotImplemented,
            userId=NotImplemented,
            createdAt=NotImplemented):
        KalturaObjectBase.__init__(self)

        # The id of the entry that the like belongs to
        # @var string
        self.entryId = entryId

        # The id of user that the like belongs to
        # @var string
        self.userId = userId

        # The date of the like's creation
        # @var int
        self.createdAt = createdAt


    PROPERTY_LOADERS = {
        'entryId': getXmlNodeText, 
        'userId': getXmlNodeText, 
        'createdAt': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaLike.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaLike")
        kparams.addStringIfDefined("entryId", self.entryId)
        kparams.addStringIfDefined("userId", self.userId)
        kparams.addIntIfDefined("createdAt", self.createdAt)
        return kparams

    def getEntryId(self):
        return self.entryId

    def setEntryId(self, newEntryId):
        self.entryId = newEntryId

    def getUserId(self):
        return self.userId

    def setUserId(self, newUserId):
        self.userId = newUserId

    def getCreatedAt(self):
        return self.createdAt

    def setCreatedAt(self, newCreatedAt):
        self.createdAt = newCreatedAt


# @package Kaltura
# @subpackage Client
class KalturaLikeListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaLike
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaLike), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaLikeListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaLikeListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaLikeBaseFilter(KalturaRelatedFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented,
            userIdEqual=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented):
        KalturaRelatedFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var string
        self.entryIdEqual = entryIdEqual

        # @var string
        self.entryIdIn = entryIdIn

        # @var string
        self.userIdEqual = userIdEqual

        # @var int
        self.createdAtGreaterThanOrEqual = createdAtGreaterThanOrEqual

        # @var int
        self.createdAtLessThanOrEqual = createdAtLessThanOrEqual


    PROPERTY_LOADERS = {
        'entryIdEqual': getXmlNodeText, 
        'entryIdIn': getXmlNodeText, 
        'userIdEqual': getXmlNodeText, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaRelatedFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaLikeBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaRelatedFilter.toParams(self)
        kparams.put("objectType", "KalturaLikeBaseFilter")
        kparams.addStringIfDefined("entryIdEqual", self.entryIdEqual)
        kparams.addStringIfDefined("entryIdIn", self.entryIdIn)
        kparams.addStringIfDefined("userIdEqual", self.userIdEqual)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        return kparams

    def getEntryIdEqual(self):
        return self.entryIdEqual

    def setEntryIdEqual(self, newEntryIdEqual):
        self.entryIdEqual = newEntryIdEqual

    def getEntryIdIn(self):
        return self.entryIdIn

    def setEntryIdIn(self, newEntryIdIn):
        self.entryIdIn = newEntryIdIn

    def getUserIdEqual(self):
        return self.userIdEqual

    def setUserIdEqual(self, newUserIdEqual):
        self.userIdEqual = newUserIdEqual

    def getCreatedAtGreaterThanOrEqual(self):
        return self.createdAtGreaterThanOrEqual

    def setCreatedAtGreaterThanOrEqual(self, newCreatedAtGreaterThanOrEqual):
        self.createdAtGreaterThanOrEqual = newCreatedAtGreaterThanOrEqual

    def getCreatedAtLessThanOrEqual(self):
        return self.createdAtLessThanOrEqual

    def setCreatedAtLessThanOrEqual(self, newCreatedAtLessThanOrEqual):
        self.createdAtLessThanOrEqual = newCreatedAtLessThanOrEqual


# @package Kaltura
# @subpackage Client
class KalturaLikeFilter(KalturaLikeBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented,
            userIdEqual=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented):
        KalturaLikeBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            entryIdEqual,
            entryIdIn,
            userIdEqual,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaLikeBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaLikeFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaLikeBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaLikeFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaLikeService(KalturaServiceBase):
    """Allows user to 'like' or 'unlike' and entry"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def like(self, entryId):
        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        self.client.queueServiceActionCall("like_like", "like", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return getXmlNodeBool(resultNode)

    def unlike(self, entryId):
        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        self.client.queueServiceActionCall("like_like", "unlike", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return getXmlNodeBool(resultNode)

    def checkLikeExists(self, entryId, userId = NotImplemented):
        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        kparams.addStringIfDefined("userId", userId)
        self.client.queueServiceActionCall("like_like", "checkLikeExists", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return getXmlNodeBool(resultNode)

    def list(self, filter = NotImplemented, pager = NotImplemented):
        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("like_like", "list", KalturaLikeListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaLikeListResponse)

########## main ##########
class KalturaLikeClientPlugin(KalturaClientPlugin):
    # KalturaLikeClientPlugin
    instance = None

    # @return KalturaLikeClientPlugin
    @staticmethod
    def get():
        if KalturaLikeClientPlugin.instance == None:
            KalturaLikeClientPlugin.instance = KalturaLikeClientPlugin()
        return KalturaLikeClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'like': KalturaLikeService,
        }

    def getEnums(self):
        return {
            'KalturaLikeOrderBy': KalturaLikeOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaLike': KalturaLike,
            'KalturaLikeListResponse': KalturaLikeListResponse,
            'KalturaLikeBaseFilter': KalturaLikeBaseFilter,
            'KalturaLikeFilter': KalturaLikeFilter,
        }

    # @return string
    def getName(self):
        return 'like'

