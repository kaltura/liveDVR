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
from Drm import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaFairplayDrmProfileOrderBy(object):
    ID_ASC = "+id"
    NAME_ASC = "+name"
    ID_DESC = "-id"
    NAME_DESC = "-name"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaFairplayDrmProfile(KalturaDrmProfile):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            description=NotImplemented,
            provider=NotImplemented,
            status=NotImplemented,
            licenseServerUrl=NotImplemented,
            defaultPolicy=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            signingKey=NotImplemented,
            publicCertificate=NotImplemented):
        KalturaDrmProfile.__init__(self,
            id,
            partnerId,
            name,
            description,
            provider,
            status,
            licenseServerUrl,
            defaultPolicy,
            createdAt,
            updatedAt,
            signingKey)

        # @var string
        self.publicCertificate = publicCertificate


    PROPERTY_LOADERS = {
        'publicCertificate': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDrmProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFairplayDrmProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDrmProfile.toParams(self)
        kparams.put("objectType", "KalturaFairplayDrmProfile")
        kparams.addStringIfDefined("publicCertificate", self.publicCertificate)
        return kparams

    def getPublicCertificate(self):
        return self.publicCertificate

    def setPublicCertificate(self, newPublicCertificate):
        self.publicCertificate = newPublicCertificate


# @package Kaltura
# @subpackage Client
class KalturaFairplayEntryContextPluginData(KalturaPluginData):
    def __init__(self,
            publicCertificate=NotImplemented):
        KalturaPluginData.__init__(self)

        # For fairplay (and maybe in the future other drm providers) we need to return a public certificate to encrypt
        # 	 the request from the player to the server.
        # @var string
        self.publicCertificate = publicCertificate


    PROPERTY_LOADERS = {
        'publicCertificate': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaPluginData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFairplayEntryContextPluginData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaPluginData.toParams(self)
        kparams.put("objectType", "KalturaFairplayEntryContextPluginData")
        kparams.addStringIfDefined("publicCertificate", self.publicCertificate)
        return kparams

    def getPublicCertificate(self):
        return self.publicCertificate

    def setPublicCertificate(self, newPublicCertificate):
        self.publicCertificate = newPublicCertificate


# @package Kaltura
# @subpackage Client
class KalturaFairplayDrmProfileBaseFilter(KalturaDrmProfileFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            providerEqual=NotImplemented,
            providerIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented):
        KalturaDrmProfileFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            providerEqual,
            providerIn,
            statusEqual,
            statusIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDrmProfileFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFairplayDrmProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDrmProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaFairplayDrmProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFairplayDrmProfileFilter(KalturaFairplayDrmProfileBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            providerEqual=NotImplemented,
            providerIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented):
        KalturaFairplayDrmProfileBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            providerEqual,
            providerIn,
            statusEqual,
            statusIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaFairplayDrmProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFairplayDrmProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFairplayDrmProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaFairplayDrmProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaFairplayClientPlugin(KalturaClientPlugin):
    # KalturaFairplayClientPlugin
    instance = None

    # @return KalturaFairplayClientPlugin
    @staticmethod
    def get():
        if KalturaFairplayClientPlugin.instance == None:
            KalturaFairplayClientPlugin.instance = KalturaFairplayClientPlugin()
        return KalturaFairplayClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaFairplayDrmProfileOrderBy': KalturaFairplayDrmProfileOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaFairplayDrmProfile': KalturaFairplayDrmProfile,
            'KalturaFairplayEntryContextPluginData': KalturaFairplayEntryContextPluginData,
            'KalturaFairplayDrmProfileBaseFilter': KalturaFairplayDrmProfileBaseFilter,
            'KalturaFairplayDrmProfileFilter': KalturaFairplayDrmProfileFilter,
        }

    # @return string
    def getName(self):
        return 'fairplay'

