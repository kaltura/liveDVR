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
class KalturaFtpDistributionProfileOrderBy(object):
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
class KalturaFtpDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaFtpScheduledDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaFtpDistributionFile(KalturaObjectBase):
    def __init__(self,
            assetId=NotImplemented,
            filename=NotImplemented,
            contents=NotImplemented,
            localFilePath=NotImplemented,
            version=NotImplemented,
            hash=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var string
        self.assetId = assetId

        # @var string
        self.filename = filename

        # @var string
        self.contents = contents

        # @var string
        self.localFilePath = localFilePath

        # @var string
        self.version = version

        # @var string
        self.hash = hash


    PROPERTY_LOADERS = {
        'assetId': getXmlNodeText, 
        'filename': getXmlNodeText, 
        'contents': getXmlNodeText, 
        'localFilePath': getXmlNodeText, 
        'version': getXmlNodeText, 
        'hash': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFtpDistributionFile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaFtpDistributionFile")
        kparams.addStringIfDefined("assetId", self.assetId)
        kparams.addStringIfDefined("filename", self.filename)
        kparams.addStringIfDefined("contents", self.contents)
        kparams.addStringIfDefined("localFilePath", self.localFilePath)
        kparams.addStringIfDefined("version", self.version)
        kparams.addStringIfDefined("hash", self.hash)
        return kparams

    def getAssetId(self):
        return self.assetId

    def setAssetId(self, newAssetId):
        self.assetId = newAssetId

    def getFilename(self):
        return self.filename

    def setFilename(self, newFilename):
        self.filename = newFilename

    def getContents(self):
        return self.contents

    def setContents(self, newContents):
        self.contents = newContents

    def getLocalFilePath(self):
        return self.localFilePath

    def setLocalFilePath(self, newLocalFilePath):
        self.localFilePath = newLocalFilePath

    def getVersion(self):
        return self.version

    def setVersion(self, newVersion):
        self.version = newVersion

    def getHash(self):
        return self.hash

    def setHash(self, newHash):
        self.hash = newHash


# @package Kaltura
# @subpackage Client
class KalturaFtpDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaFtpDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaFtpDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFtpDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            filesForDistribution=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # @var array of KalturaFtpDistributionFile
        self.filesForDistribution = filesForDistribution


    PROPERTY_LOADERS = {
        'filesForDistribution': (KalturaObjectFactory.createArray, KalturaFtpDistributionFile), 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFtpDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaFtpDistributionJobProviderData")
        kparams.addArrayIfDefined("filesForDistribution", self.filesForDistribution)
        return kparams

    def getFilesForDistribution(self):
        return self.filesForDistribution

    def setFilesForDistribution(self, newFilesForDistribution):
        self.filesForDistribution = newFilesForDistribution


# @package Kaltura
# @subpackage Client
class KalturaFtpDistributionProfile(KalturaConfigurableDistributionProfile):
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
            fieldConfigArray=NotImplemented,
            itemXpathsToExtend=NotImplemented,
            useCategoryEntries=NotImplemented,
            protocol=NotImplemented,
            host=NotImplemented,
            port=NotImplemented,
            basePath=NotImplemented,
            username=NotImplemented,
            password=NotImplemented,
            passphrase=NotImplemented,
            sftpPublicKey=NotImplemented,
            sftpPrivateKey=NotImplemented,
            disableMetadata=NotImplemented,
            metadataXslt=NotImplemented,
            metadataFilenameXslt=NotImplemented,
            flavorAssetFilenameXslt=NotImplemented,
            thumbnailAssetFilenameXslt=NotImplemented,
            assetFilenameXslt=NotImplemented,
            asperaPublicKey=NotImplemented,
            asperaPrivateKey=NotImplemented,
            sendMetadataAfterAssets=NotImplemented):
        KalturaConfigurableDistributionProfile.__init__(self,
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
            recommendedDcForExecute,
            fieldConfigArray,
            itemXpathsToExtend,
            useCategoryEntries)

        # @var KalturaDistributionProtocol
        # @insertonly
        self.protocol = protocol

        # @var string
        self.host = host

        # @var int
        self.port = port

        # @var string
        self.basePath = basePath

        # @var string
        self.username = username

        # @var string
        self.password = password

        # @var string
        self.passphrase = passphrase

        # @var string
        self.sftpPublicKey = sftpPublicKey

        # @var string
        self.sftpPrivateKey = sftpPrivateKey

        # @var bool
        self.disableMetadata = disableMetadata

        # @var string
        self.metadataXslt = metadataXslt

        # @var string
        self.metadataFilenameXslt = metadataFilenameXslt

        # @var string
        self.flavorAssetFilenameXslt = flavorAssetFilenameXslt

        # @var string
        self.thumbnailAssetFilenameXslt = thumbnailAssetFilenameXslt

        # @var string
        self.assetFilenameXslt = assetFilenameXslt

        # @var string
        self.asperaPublicKey = asperaPublicKey

        # @var string
        self.asperaPrivateKey = asperaPrivateKey

        # @var bool
        self.sendMetadataAfterAssets = sendMetadataAfterAssets


    PROPERTY_LOADERS = {
        'protocol': (KalturaEnumsFactory.createInt, "KalturaDistributionProtocol"), 
        'host': getXmlNodeText, 
        'port': getXmlNodeInt, 
        'basePath': getXmlNodeText, 
        'username': getXmlNodeText, 
        'password': getXmlNodeText, 
        'passphrase': getXmlNodeText, 
        'sftpPublicKey': getXmlNodeText, 
        'sftpPrivateKey': getXmlNodeText, 
        'disableMetadata': getXmlNodeBool, 
        'metadataXslt': getXmlNodeText, 
        'metadataFilenameXslt': getXmlNodeText, 
        'flavorAssetFilenameXslt': getXmlNodeText, 
        'thumbnailAssetFilenameXslt': getXmlNodeText, 
        'assetFilenameXslt': getXmlNodeText, 
        'asperaPublicKey': getXmlNodeText, 
        'asperaPrivateKey': getXmlNodeText, 
        'sendMetadataAfterAssets': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFtpDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaFtpDistributionProfile")
        kparams.addIntEnumIfDefined("protocol", self.protocol)
        kparams.addStringIfDefined("host", self.host)
        kparams.addIntIfDefined("port", self.port)
        kparams.addStringIfDefined("basePath", self.basePath)
        kparams.addStringIfDefined("username", self.username)
        kparams.addStringIfDefined("password", self.password)
        kparams.addStringIfDefined("passphrase", self.passphrase)
        kparams.addStringIfDefined("sftpPublicKey", self.sftpPublicKey)
        kparams.addStringIfDefined("sftpPrivateKey", self.sftpPrivateKey)
        kparams.addBoolIfDefined("disableMetadata", self.disableMetadata)
        kparams.addStringIfDefined("metadataXslt", self.metadataXslt)
        kparams.addStringIfDefined("metadataFilenameXslt", self.metadataFilenameXslt)
        kparams.addStringIfDefined("flavorAssetFilenameXslt", self.flavorAssetFilenameXslt)
        kparams.addStringIfDefined("thumbnailAssetFilenameXslt", self.thumbnailAssetFilenameXslt)
        kparams.addStringIfDefined("assetFilenameXslt", self.assetFilenameXslt)
        kparams.addStringIfDefined("asperaPublicKey", self.asperaPublicKey)
        kparams.addStringIfDefined("asperaPrivateKey", self.asperaPrivateKey)
        kparams.addBoolIfDefined("sendMetadataAfterAssets", self.sendMetadataAfterAssets)
        return kparams

    def getProtocol(self):
        return self.protocol

    def setProtocol(self, newProtocol):
        self.protocol = newProtocol

    def getHost(self):
        return self.host

    def setHost(self, newHost):
        self.host = newHost

    def getPort(self):
        return self.port

    def setPort(self, newPort):
        self.port = newPort

    def getBasePath(self):
        return self.basePath

    def setBasePath(self, newBasePath):
        self.basePath = newBasePath

    def getUsername(self):
        return self.username

    def setUsername(self, newUsername):
        self.username = newUsername

    def getPassword(self):
        return self.password

    def setPassword(self, newPassword):
        self.password = newPassword

    def getPassphrase(self):
        return self.passphrase

    def setPassphrase(self, newPassphrase):
        self.passphrase = newPassphrase

    def getSftpPublicKey(self):
        return self.sftpPublicKey

    def setSftpPublicKey(self, newSftpPublicKey):
        self.sftpPublicKey = newSftpPublicKey

    def getSftpPrivateKey(self):
        return self.sftpPrivateKey

    def setSftpPrivateKey(self, newSftpPrivateKey):
        self.sftpPrivateKey = newSftpPrivateKey

    def getDisableMetadata(self):
        return self.disableMetadata

    def setDisableMetadata(self, newDisableMetadata):
        self.disableMetadata = newDisableMetadata

    def getMetadataXslt(self):
        return self.metadataXslt

    def setMetadataXslt(self, newMetadataXslt):
        self.metadataXslt = newMetadataXslt

    def getMetadataFilenameXslt(self):
        return self.metadataFilenameXslt

    def setMetadataFilenameXslt(self, newMetadataFilenameXslt):
        self.metadataFilenameXslt = newMetadataFilenameXslt

    def getFlavorAssetFilenameXslt(self):
        return self.flavorAssetFilenameXslt

    def setFlavorAssetFilenameXslt(self, newFlavorAssetFilenameXslt):
        self.flavorAssetFilenameXslt = newFlavorAssetFilenameXslt

    def getThumbnailAssetFilenameXslt(self):
        return self.thumbnailAssetFilenameXslt

    def setThumbnailAssetFilenameXslt(self, newThumbnailAssetFilenameXslt):
        self.thumbnailAssetFilenameXslt = newThumbnailAssetFilenameXslt

    def getAssetFilenameXslt(self):
        return self.assetFilenameXslt

    def setAssetFilenameXslt(self, newAssetFilenameXslt):
        self.assetFilenameXslt = newAssetFilenameXslt

    def getAsperaPublicKey(self):
        return self.asperaPublicKey

    def setAsperaPublicKey(self, newAsperaPublicKey):
        self.asperaPublicKey = newAsperaPublicKey

    def getAsperaPrivateKey(self):
        return self.asperaPrivateKey

    def setAsperaPrivateKey(self, newAsperaPrivateKey):
        self.asperaPrivateKey = newAsperaPrivateKey

    def getSendMetadataAfterAssets(self):
        return self.sendMetadataAfterAssets

    def setSendMetadataAfterAssets(self, newSendMetadataAfterAssets):
        self.sendMetadataAfterAssets = newSendMetadataAfterAssets


# @package Kaltura
# @subpackage Client
class KalturaFtpScheduledDistributionProvider(KalturaFtpDistributionProvider):
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
        KalturaFtpDistributionProvider.__init__(self,
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
        KalturaFtpDistributionProvider.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFtpScheduledDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFtpDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaFtpScheduledDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFtpDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaFtpDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaFtpDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFtpDistributionProviderFilter(KalturaFtpDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaFtpDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaFtpDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFtpDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFtpDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaFtpDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFtpDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        KalturaConfigurableDistributionProfileFilter.__init__(self,
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
        KalturaConfigurableDistributionProfileFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFtpDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaFtpDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFtpScheduledDistributionProviderBaseFilter(KalturaFtpDistributionProviderFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaFtpDistributionProviderFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaFtpDistributionProviderFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFtpScheduledDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFtpDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaFtpScheduledDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFtpDistributionProfileFilter(KalturaFtpDistributionProfileBaseFilter):
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
        KalturaFtpDistributionProfileBaseFilter.__init__(self,
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
        KalturaFtpDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFtpDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFtpDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaFtpDistributionProfileFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaFtpScheduledDistributionProviderFilter(KalturaFtpScheduledDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaFtpScheduledDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaFtpScheduledDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaFtpScheduledDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFtpScheduledDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaFtpScheduledDistributionProviderFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaFtpDistributionClientPlugin(KalturaClientPlugin):
    # KalturaFtpDistributionClientPlugin
    instance = None

    # @return KalturaFtpDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaFtpDistributionClientPlugin.instance == None:
            KalturaFtpDistributionClientPlugin.instance = KalturaFtpDistributionClientPlugin()
        return KalturaFtpDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaFtpDistributionProfileOrderBy': KalturaFtpDistributionProfileOrderBy,
            'KalturaFtpDistributionProviderOrderBy': KalturaFtpDistributionProviderOrderBy,
            'KalturaFtpScheduledDistributionProviderOrderBy': KalturaFtpScheduledDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaFtpDistributionFile': KalturaFtpDistributionFile,
            'KalturaFtpDistributionProvider': KalturaFtpDistributionProvider,
            'KalturaFtpDistributionJobProviderData': KalturaFtpDistributionJobProviderData,
            'KalturaFtpDistributionProfile': KalturaFtpDistributionProfile,
            'KalturaFtpScheduledDistributionProvider': KalturaFtpScheduledDistributionProvider,
            'KalturaFtpDistributionProviderBaseFilter': KalturaFtpDistributionProviderBaseFilter,
            'KalturaFtpDistributionProviderFilter': KalturaFtpDistributionProviderFilter,
            'KalturaFtpDistributionProfileBaseFilter': KalturaFtpDistributionProfileBaseFilter,
            'KalturaFtpScheduledDistributionProviderBaseFilter': KalturaFtpScheduledDistributionProviderBaseFilter,
            'KalturaFtpDistributionProfileFilter': KalturaFtpDistributionProfileFilter,
            'KalturaFtpScheduledDistributionProviderFilter': KalturaFtpScheduledDistributionProviderFilter,
        }

    # @return string
    def getName(self):
        return 'ftpDistribution'

