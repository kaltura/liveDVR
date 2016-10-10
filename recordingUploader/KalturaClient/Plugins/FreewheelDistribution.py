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
from ContentDistribution import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaFreewheelDistributionProfileOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaFreewheelDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaFreewheelDistributionAssetPath(KalturaDistributionJobProviderData):
    def __init__(self,
            path=NotImplemented):
        KalturaDistributionJobProviderData.__init__(self)

        # @var string
        self.path = path


    PROPERTY_LOADERS = {
        'path': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFreewheelDistributionAssetPath.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaFreewheelDistributionAssetPath")
        kparams.addStringIfDefined("path", self.path)
        return kparams

    def getPath(self):
        return self.path

    def setPath(self, newPath):
        self.path = newPath


# @package Kaltura
# @subpackage Client
class KalturaFreewheelDistributionJobProviderData(KalturaDistributionJobProviderData):
    def __init__(self,
            videoAssetFilePaths=NotImplemented,
            thumbAssetFilePath=NotImplemented):
        KalturaDistributionJobProviderData.__init__(self)

        # Demonstrate passing array of paths to the job
        # @var array of KalturaFreewheelDistributionAssetPath
        self.videoAssetFilePaths = videoAssetFilePaths

        # Demonstrate passing single path to the job
        # @var string
        self.thumbAssetFilePath = thumbAssetFilePath


    PROPERTY_LOADERS = {
        'videoAssetFilePaths': (KalturaObjectFactory.createArray, KalturaFreewheelDistributionAssetPath), 
        'thumbAssetFilePath': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFreewheelDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaFreewheelDistributionJobProviderData")
        kparams.addArrayIfDefined("videoAssetFilePaths", self.videoAssetFilePaths)
        kparams.addStringIfDefined("thumbAssetFilePath", self.thumbAssetFilePath)
        return kparams

    def getVideoAssetFilePaths(self):
        return self.videoAssetFilePaths

    def setVideoAssetFilePaths(self, newVideoAssetFilePaths):
        self.videoAssetFilePaths = newVideoAssetFilePaths

    def getThumbAssetFilePath(self):
        return self.thumbAssetFilePath

    def setThumbAssetFilePath(self, newThumbAssetFilePath):
        self.thumbAssetFilePath = newThumbAssetFilePath


# @package Kaltura
# @subpackage Client
class KalturaFreewheelDistributionProfile(KalturaDistributionProfile):
    def __init__(self,
            id=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            partnerId=NotImplemented,
            providerType=NotImplemented,
            name=NotImplemented,
            status=NotImplemented,
            submitEnabled=NotImplemented,
            updateEnabled=NotImplemented,
            deleteEnabled=NotImplemented,
            reportEnabled=NotImplemented,
            autoCreateFlavors=NotImplemented,
            autoCreateThumb=NotImplemented,
            optionalFlavorParamsIds=NotImplemented,
            requiredFlavorParamsIds=NotImplemented,
            optionalThumbDimensions=NotImplemented,
            requiredThumbDimensions=NotImplemented,
            optionalAssetDistributionRules=NotImplemented,
            requiredAssetDistributionRules=NotImplemented,
            sunriseDefaultOffset=NotImplemented,
            sunsetDefaultOffset=NotImplemented,
            recommendedStorageProfileForDownload=NotImplemented,
            recommendedDcForDownload=NotImplemented,
            recommendedDcForExecute=NotImplemented,
            apikey=NotImplemented,
            email=NotImplemented,
            sftpPass=NotImplemented,
            sftpLogin=NotImplemented,
            accountId=NotImplemented,
            metadataProfileId=NotImplemented):
        KalturaDistributionProfile.__init__(self,
            id,
            createdAt,
            updatedAt,
            partnerId,
            providerType,
            name,
            status,
            submitEnabled,
            updateEnabled,
            deleteEnabled,
            reportEnabled,
            autoCreateFlavors,
            autoCreateThumb,
            optionalFlavorParamsIds,
            requiredFlavorParamsIds,
            optionalThumbDimensions,
            requiredThumbDimensions,
            optionalAssetDistributionRules,
            requiredAssetDistributionRules,
            sunriseDefaultOffset,
            sunsetDefaultOffset,
            recommendedStorageProfileForDownload,
            recommendedDcForDownload,
            recommendedDcForExecute)

        # @var string
        self.apikey = apikey

        # @var string
        self.email = email

        # @var string
        self.sftpPass = sftpPass

        # @var string
        self.sftpLogin = sftpLogin

        # @var string
        self.accountId = accountId

        # @var int
        self.metadataProfileId = metadataProfileId


    PROPERTY_LOADERS = {
        'apikey': getXmlNodeText, 
        'email': getXmlNodeText, 
        'sftpPass': getXmlNodeText, 
        'sftpLogin': getXmlNodeText, 
        'accountId': getXmlNodeText, 
        'metadataProfileId': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFreewheelDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaFreewheelDistributionProfile")
        kparams.addStringIfDefined("apikey", self.apikey)
        kparams.addStringIfDefined("email", self.email)
        kparams.addStringIfDefined("sftpPass", self.sftpPass)
        kparams.addStringIfDefined("sftpLogin", self.sftpLogin)
        kparams.addStringIfDefined("accountId", self.accountId)
        kparams.addIntIfDefined("metadataProfileId", self.metadataProfileId)
        return kparams

    def getApikey(self):
        return self.apikey

    def setApikey(self, newApikey):
        self.apikey = newApikey

    def getEmail(self):
        return self.email

    def setEmail(self, newEmail):
        self.email = newEmail

    def getSftpPass(self):
        return self.sftpPass

    def setSftpPass(self, newSftpPass):
        self.sftpPass = newSftpPass

    def getSftpLogin(self):
        return self.sftpLogin

    def setSftpLogin(self, newSftpLogin):
        self.sftpLogin = newSftpLogin

    def getAccountId(self):
        return self.accountId

    def setAccountId(self, newAccountId):
        self.accountId = newAccountId

    def getMetadataProfileId(self):
        return self.metadataProfileId

    def setMetadataProfileId(self, newMetadataProfileId):
        self.metadataProfileId = newMetadataProfileId


# @package Kaltura
# @subpackage Client
class KalturaFreewheelDistributionProvider(KalturaDistributionProvider):
    def __init__(self,
            type=NotImplemented,
            name=NotImplemented,
            scheduleUpdateEnabled=NotImplemented,
            availabilityUpdateEnabled=NotImplemented,
            deleteInsteadUpdate=NotImplemented,
            intervalBeforeSunrise=NotImplemented,
            intervalBeforeSunset=NotImplemented,
            updateRequiredEntryFields=NotImplemented,
            updateRequiredMetadataXPaths=NotImplemented):
        KalturaDistributionProvider.__init__(self,
            type,
            name,
            scheduleUpdateEnabled,
            availabilityUpdateEnabled,
            deleteInsteadUpdate,
            intervalBeforeSunrise,
            intervalBeforeSunset,
            updateRequiredEntryFields,
            updateRequiredMetadataXPaths)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDistributionProvider.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFreewheelDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaFreewheelDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFreewheelDistributionProfileBaseFilter(KalturaDistributionProfileFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented):
        KalturaDistributionProfileFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            statusEqual,
            statusIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDistributionProfileFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFreewheelDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaFreewheelDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFreewheelDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaDistributionProviderFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDistributionProviderFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFreewheelDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaFreewheelDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFreewheelDistributionProfileFilter(KalturaFreewheelDistributionProfileBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented):
        KalturaFreewheelDistributionProfileBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            statusEqual,
            statusIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaFreewheelDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFreewheelDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFreewheelDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaFreewheelDistributionProfileFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFreewheelDistributionProviderFilter(KalturaFreewheelDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaFreewheelDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaFreewheelDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFreewheelDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFreewheelDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaFreewheelDistributionProviderFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaFreewheelDistributionClientPlugin(KalturaClientPlugin):
    # KalturaFreewheelDistributionClientPlugin
    instance = None

    # @return KalturaFreewheelDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaFreewheelDistributionClientPlugin.instance == None:
            KalturaFreewheelDistributionClientPlugin.instance = KalturaFreewheelDistributionClientPlugin()
        return KalturaFreewheelDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaFreewheelDistributionProfileOrderBy': KalturaFreewheelDistributionProfileOrderBy,
            'KalturaFreewheelDistributionProviderOrderBy': KalturaFreewheelDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaFreewheelDistributionAssetPath': KalturaFreewheelDistributionAssetPath,
            'KalturaFreewheelDistributionJobProviderData': KalturaFreewheelDistributionJobProviderData,
            'KalturaFreewheelDistributionProfile': KalturaFreewheelDistributionProfile,
            'KalturaFreewheelDistributionProvider': KalturaFreewheelDistributionProvider,
            'KalturaFreewheelDistributionProfileBaseFilter': KalturaFreewheelDistributionProfileBaseFilter,
            'KalturaFreewheelDistributionProviderBaseFilter': KalturaFreewheelDistributionProviderBaseFilter,
            'KalturaFreewheelDistributionProfileFilter': KalturaFreewheelDistributionProfileFilter,
            'KalturaFreewheelDistributionProviderFilter': KalturaFreewheelDistributionProviderFilter,
        }

    # @return string
    def getName(self):
        return 'freewheelDistribution'

