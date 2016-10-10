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
class KalturaShortLinkStatus(object):
    DISABLED = 1
    ENABLED = 2
    DELETED = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaShortLinkOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    EXPIRES_AT_ASC = "+expiresAt"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    EXPIRES_AT_DESC = "-expiresAt"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaShortLink(KalturaObjectBase):
    def __init__(self,
            id=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            expiresAt=NotImplemented,
            partnerId=NotImplemented,
            userId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            fullUrl=NotImplemented,
            status=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var string
        # @readonly
        self.id = id

        # @var int
        # @readonly
        self.createdAt = createdAt

        # @var int
        # @readonly
        self.updatedAt = updatedAt

        # @var int
        self.expiresAt = expiresAt

        # @var int
        # @readonly
        self.partnerId = partnerId

        # @var string
        self.userId = userId

        # @var string
        self.name = name

        # @var string
        self.systemName = systemName

        # @var string
        self.fullUrl = fullUrl

        # @var KalturaShortLinkStatus
        self.status = status


    PROPERTY_LOADERS = {
        'id': getXmlNodeText, 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
        'expiresAt': getXmlNodeInt, 
        'partnerId': getXmlNodeInt, 
        'userId': getXmlNodeText, 
        'name': getXmlNodeText, 
        'systemName': getXmlNodeText, 
        'fullUrl': getXmlNodeText, 
        'status': (KalturaEnumsFactory.createInt, "KalturaShortLinkStatus"), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaShortLink.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaShortLink")
        kparams.addIntIfDefined("expiresAt", self.expiresAt)
        kparams.addStringIfDefined("userId", self.userId)
        kparams.addStringIfDefined("name", self.name)
        kparams.addStringIfDefined("systemName", self.systemName)
        kparams.addStringIfDefined("fullUrl", self.fullUrl)
        kparams.addIntEnumIfDefined("status", self.status)
        return kparams

    def getId(self):
        return self.id

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt

    def getExpiresAt(self):
        return self.expiresAt

    def setExpiresAt(self, newExpiresAt):
        self.expiresAt = newExpiresAt

    def getPartnerId(self):
        return self.partnerId

    def getUserId(self):
        return self.userId

    def setUserId(self, newUserId):
        self.userId = newUserId

    def getName(self):
        return self.name

    def setName(self, newName):
        self.name = newName

    def getSystemName(self):
        return self.systemName

    def setSystemName(self, newSystemName):
        self.systemName = newSystemName

    def getFullUrl(self):
        return self.fullUrl

    def setFullUrl(self, newFullUrl):
        self.fullUrl = newFullUrl

    def getStatus(self):
        return self.status

    def setStatus(self, newStatus):
        self.status = newStatus


# @package Kaltura
# @subpackage Client
class KalturaShortLinkBaseFilter(KalturaFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            expiresAtGreaterThanOrEqual=NotImplemented,
            expiresAtLessThanOrEqual=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            userIdEqual=NotImplemented,
            userIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented):
        KalturaFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var string
        self.idEqual = idEqual

        # @var string
        self.idIn = idIn

        # @var int
        self.createdAtGreaterThanOrEqual = createdAtGreaterThanOrEqual

        # @var int
        self.createdAtLessThanOrEqual = createdAtLessThanOrEqual

        # @var int
        self.updatedAtGreaterThanOrEqual = updatedAtGreaterThanOrEqual

        # @var int
        self.updatedAtLessThanOrEqual = updatedAtLessThanOrEqual

        # @var int
        self.expiresAtGreaterThanOrEqual = expiresAtGreaterThanOrEqual

        # @var int
        self.expiresAtLessThanOrEqual = expiresAtLessThanOrEqual

        # @var int
        self.partnerIdEqual = partnerIdEqual

        # @var string
        self.partnerIdIn = partnerIdIn

        # @var string
        self.userIdEqual = userIdEqual

        # @var string
        self.userIdIn = userIdIn

        # @var string
        self.systemNameEqual = systemNameEqual

        # @var string
        self.systemNameIn = systemNameIn

        # @var KalturaShortLinkStatus
        self.statusEqual = statusEqual

        # @var string
        self.statusIn = statusIn


    PROPERTY_LOADERS = {
        'idEqual': getXmlNodeText, 
        'idIn': getXmlNodeText, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'updatedAtGreaterThanOrEqual': getXmlNodeInt, 
        'updatedAtLessThanOrEqual': getXmlNodeInt, 
        'expiresAtGreaterThanOrEqual': getXmlNodeInt, 
        'expiresAtLessThanOrEqual': getXmlNodeInt, 
        'partnerIdEqual': getXmlNodeInt, 
        'partnerIdIn': getXmlNodeText, 
        'userIdEqual': getXmlNodeText, 
        'userIdIn': getXmlNodeText, 
        'systemNameEqual': getXmlNodeText, 
        'systemNameIn': getXmlNodeText, 
        'statusEqual': (KalturaEnumsFactory.createInt, "KalturaShortLinkStatus"), 
        'statusIn': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaShortLinkBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFilter.toParams(self)
        kparams.put("objectType", "KalturaShortLinkBaseFilter")
        kparams.addStringIfDefined("idEqual", self.idEqual)
        kparams.addStringIfDefined("idIn", self.idIn)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        kparams.addIntIfDefined("updatedAtGreaterThanOrEqual", self.updatedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("updatedAtLessThanOrEqual", self.updatedAtLessThanOrEqual)
        kparams.addIntIfDefined("expiresAtGreaterThanOrEqual", self.expiresAtGreaterThanOrEqual)
        kparams.addIntIfDefined("expiresAtLessThanOrEqual", self.expiresAtLessThanOrEqual)
        kparams.addIntIfDefined("partnerIdEqual", self.partnerIdEqual)
        kparams.addStringIfDefined("partnerIdIn", self.partnerIdIn)
        kparams.addStringIfDefined("userIdEqual", self.userIdEqual)
        kparams.addStringIfDefined("userIdIn", self.userIdIn)
        kparams.addStringIfDefined("systemNameEqual", self.systemNameEqual)
        kparams.addStringIfDefined("systemNameIn", self.systemNameIn)
        kparams.addIntEnumIfDefined("statusEqual", self.statusEqual)
        kparams.addStringIfDefined("statusIn", self.statusIn)
        return kparams

    def getIdEqual(self):
        return self.idEqual

    def setIdEqual(self, newIdEqual):
        self.idEqual = newIdEqual

    def getIdIn(self):
        return self.idIn

    def setIdIn(self, newIdIn):
        self.idIn = newIdIn

    def getCreatedAtGreaterThanOrEqual(self):
        return self.createdAtGreaterThanOrEqual

    def setCreatedAtGreaterThanOrEqual(self, newCreatedAtGreaterThanOrEqual):
        self.createdAtGreaterThanOrEqual = newCreatedAtGreaterThanOrEqual

    def getCreatedAtLessThanOrEqual(self):
        return self.createdAtLessThanOrEqual

    def setCreatedAtLessThanOrEqual(self, newCreatedAtLessThanOrEqual):
        self.createdAtLessThanOrEqual = newCreatedAtLessThanOrEqual

    def getUpdatedAtGreaterThanOrEqual(self):
        return self.updatedAtGreaterThanOrEqual

    def setUpdatedAtGreaterThanOrEqual(self, newUpdatedAtGreaterThanOrEqual):
        self.updatedAtGreaterThanOrEqual = newUpdatedAtGreaterThanOrEqual

    def getUpdatedAtLessThanOrEqual(self):
        return self.updatedAtLessThanOrEqual

    def setUpdatedAtLessThanOrEqual(self, newUpdatedAtLessThanOrEqual):
        self.updatedAtLessThanOrEqual = newUpdatedAtLessThanOrEqual

    def getExpiresAtGreaterThanOrEqual(self):
        return self.expiresAtGreaterThanOrEqual

    def setExpiresAtGreaterThanOrEqual(self, newExpiresAtGreaterThanOrEqual):
        self.expiresAtGreaterThanOrEqual = newExpiresAtGreaterThanOrEqual

    def getExpiresAtLessThanOrEqual(self):
        return self.expiresAtLessThanOrEqual

    def setExpiresAtLessThanOrEqual(self, newExpiresAtLessThanOrEqual):
        self.expiresAtLessThanOrEqual = newExpiresAtLessThanOrEqual

    def getPartnerIdEqual(self):
        return self.partnerIdEqual

    def setPartnerIdEqual(self, newPartnerIdEqual):
        self.partnerIdEqual = newPartnerIdEqual

    def getPartnerIdIn(self):
        return self.partnerIdIn

    def setPartnerIdIn(self, newPartnerIdIn):
        self.partnerIdIn = newPartnerIdIn

    def getUserIdEqual(self):
        return self.userIdEqual

    def setUserIdEqual(self, newUserIdEqual):
        self.userIdEqual = newUserIdEqual

    def getUserIdIn(self):
        return self.userIdIn

    def setUserIdIn(self, newUserIdIn):
        self.userIdIn = newUserIdIn

    def getSystemNameEqual(self):
        return self.systemNameEqual

    def setSystemNameEqual(self, newSystemNameEqual):
        self.systemNameEqual = newSystemNameEqual

    def getSystemNameIn(self):
        return self.systemNameIn

    def setSystemNameIn(self, newSystemNameIn):
        self.systemNameIn = newSystemNameIn

    def getStatusEqual(self):
        return self.statusEqual

    def setStatusEqual(self, newStatusEqual):
        self.statusEqual = newStatusEqual

    def getStatusIn(self):
        return self.statusIn

    def setStatusIn(self, newStatusIn):
        self.statusIn = newStatusIn


# @package Kaltura
# @subpackage Client
class KalturaShortLinkListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaShortLink
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaShortLink), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaShortLinkListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaShortLinkListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaShortLinkFilter(KalturaShortLinkBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            expiresAtGreaterThanOrEqual=NotImplemented,
            expiresAtLessThanOrEqual=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            userIdEqual=NotImplemented,
            userIdIn=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented):
        KalturaShortLinkBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            expiresAtGreaterThanOrEqual,
            expiresAtLessThanOrEqual,
            partnerIdEqual,
            partnerIdIn,
            userIdEqual,
            userIdIn,
            systemNameEqual,
            systemNameIn,
            statusEqual,
            statusIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaShortLinkBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaShortLinkFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaShortLinkBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaShortLinkFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaShortLinkService(KalturaServiceBase):
    """Short link service"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List short link objects by filter and pager"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("shortlink_shortlink", "list", KalturaShortLinkListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaShortLinkListResponse)

    def add(self, shortLink):
        """Allows you to add a short link object"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("shortLink", shortLink)
        self.client.queueServiceActionCall("shortlink_shortlink", "add", KalturaShortLink, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaShortLink)

    def get(self, id):
        """Retrieve an short link object by id"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("id", id)
        self.client.queueServiceActionCall("shortlink_shortlink", "get", KalturaShortLink, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaShortLink)

    def update(self, id, shortLink):
        """Update exisitng short link"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("id", id)
        kparams.addObjectIfDefined("shortLink", shortLink)
        self.client.queueServiceActionCall("shortlink_shortlink", "update", KalturaShortLink, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaShortLink)

    def delete(self, id):
        """Mark the short link as deleted"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("id", id)
        self.client.queueServiceActionCall("shortlink_shortlink", "delete", KalturaShortLink, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaShortLink)

    def goto(self, id, proxy = False):
        """Serves short link"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("id", id)
        kparams.addBoolIfDefined("proxy", proxy);
        self.client.queueServiceActionCall('shortlink_shortlink', 'goto', None ,kparams)
        return self.client.getServeUrl()

########## main ##########
class KalturaShortLinkClientPlugin(KalturaClientPlugin):
    # KalturaShortLinkClientPlugin
    instance = None

    # @return KalturaShortLinkClientPlugin
    @staticmethod
    def get():
        if KalturaShortLinkClientPlugin.instance == None:
            KalturaShortLinkClientPlugin.instance = KalturaShortLinkClientPlugin()
        return KalturaShortLinkClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'shortLink': KalturaShortLinkService,
        }

    def getEnums(self):
        return {
            'KalturaShortLinkStatus': KalturaShortLinkStatus,
            'KalturaShortLinkOrderBy': KalturaShortLinkOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaShortLink': KalturaShortLink,
            'KalturaShortLinkBaseFilter': KalturaShortLinkBaseFilter,
            'KalturaShortLinkListResponse': KalturaShortLinkListResponse,
            'KalturaShortLinkFilter': KalturaShortLinkFilter,
        }

    # @return string
    def getName(self):
        return 'shortLink'

