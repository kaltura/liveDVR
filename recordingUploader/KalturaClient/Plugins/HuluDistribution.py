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
from CuePoint import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaHuluDistributionProfileOrderBy(object):
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
class KalturaHuluDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaHuluDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaHuluDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaHuluDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaHuluDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            videoAssetFilePath=NotImplemented,
            thumbAssetFilePath=NotImplemented,
            cuePoints=NotImplemented,
            fileBaseName=NotImplemented,
            captionLocalPaths=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # @var string
        self.videoAssetFilePath = videoAssetFilePath

        # @var string
        self.thumbAssetFilePath = thumbAssetFilePath

        # @var array of KalturaCuePoint
        self.cuePoints = cuePoints

        # @var string
        self.fileBaseName = fileBaseName

        # @var array of KalturaString
        self.captionLocalPaths = captionLocalPaths


    PROPERTY_LOADERS = {
        'videoAssetFilePath': getXmlNodeText, 
        'thumbAssetFilePath': getXmlNodeText, 
        'cuePoints': (KalturaObjectFactory.createArray, KalturaCuePoint), 
        'fileBaseName': getXmlNodeText, 
        'captionLocalPaths': (KalturaObjectFactory.createArray, KalturaString), 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaHuluDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaHuluDistributionJobProviderData")
        kparams.addStringIfDefined("videoAssetFilePath", self.videoAssetFilePath)
        kparams.addStringIfDefined("thumbAssetFilePath", self.thumbAssetFilePath)
        kparams.addArrayIfDefined("cuePoints", self.cuePoints)
        kparams.addStringIfDefined("fileBaseName", self.fileBaseName)
        kparams.addArrayIfDefined("captionLocalPaths", self.captionLocalPaths)
        return kparams

    def getVideoAssetFilePath(self):
        return self.videoAssetFilePath

    def setVideoAssetFilePath(self, newVideoAssetFilePath):
        self.videoAssetFilePath = newVideoAssetFilePath

    def getThumbAssetFilePath(self):
        return self.thumbAssetFilePath

    def setThumbAssetFilePath(self, newThumbAssetFilePath):
        self.thumbAssetFilePath = newThumbAssetFilePath

    def getCuePoints(self):
        return self.cuePoints

    def setCuePoints(self, newCuePoints):
        self.cuePoints = newCuePoints

    def getFileBaseName(self):
        return self.fileBaseName

    def setFileBaseName(self, newFileBaseName):
        self.fileBaseName = newFileBaseName

    def getCaptionLocalPaths(self):
        return self.captionLocalPaths

    def setCaptionLocalPaths(self, newCaptionLocalPaths):
        self.captionLocalPaths = newCaptionLocalPaths


# @package Kaltura
# @subpackage Client
class KalturaHuluDistributionProfile(KalturaConfigurableDistributionProfile):
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
            sftpHost=NotImplemented,
            sftpLogin=NotImplemented,
            sftpPass=NotImplemented,
            seriesChannel=NotImplemented,
            seriesPrimaryCategory=NotImplemented,
            seriesAdditionalCategories=NotImplemented,
            seasonNumber=NotImplemented,
            seasonSynopsis=NotImplemented,
            seasonTuneInInformation=NotImplemented,
            videoMediaType=NotImplemented,
            disableEpisodeNumberCustomValidation=NotImplemented,
            protocol=NotImplemented,
            asperaHost=NotImplemented,
            asperaLogin=NotImplemented,
            asperaPass=NotImplemented,
            port=NotImplemented,
            passphrase=NotImplemented,
            asperaPublicKey=NotImplemented,
            asperaPrivateKey=NotImplemented):
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

        # @var string
        self.sftpHost = sftpHost

        # @var string
        self.sftpLogin = sftpLogin

        # @var string
        self.sftpPass = sftpPass

        # @var string
        self.seriesChannel = seriesChannel

        # @var string
        self.seriesPrimaryCategory = seriesPrimaryCategory

        # @var array of KalturaString
        self.seriesAdditionalCategories = seriesAdditionalCategories

        # @var string
        self.seasonNumber = seasonNumber

        # @var string
        self.seasonSynopsis = seasonSynopsis

        # @var string
        self.seasonTuneInInformation = seasonTuneInInformation

        # @var string
        self.videoMediaType = videoMediaType

        # @var bool
        self.disableEpisodeNumberCustomValidation = disableEpisodeNumberCustomValidation

        # @var KalturaDistributionProtocol
        self.protocol = protocol

        # @var string
        self.asperaHost = asperaHost

        # @var string
        self.asperaLogin = asperaLogin

        # @var string
        self.asperaPass = asperaPass

        # @var int
        self.port = port

        # @var string
        self.passphrase = passphrase

        # @var string
        self.asperaPublicKey = asperaPublicKey

        # @var string
        self.asperaPrivateKey = asperaPrivateKey


    PROPERTY_LOADERS = {
        'sftpHost': getXmlNodeText, 
        'sftpLogin': getXmlNodeText, 
        'sftpPass': getXmlNodeText, 
        'seriesChannel': getXmlNodeText, 
        'seriesPrimaryCategory': getXmlNodeText, 
        'seriesAdditionalCategories': (KalturaObjectFactory.createArray, KalturaString), 
        'seasonNumber': getXmlNodeText, 
        'seasonSynopsis': getXmlNodeText, 
        'seasonTuneInInformation': getXmlNodeText, 
        'videoMediaType': getXmlNodeText, 
        'disableEpisodeNumberCustomValidation': getXmlNodeBool, 
        'protocol': (KalturaEnumsFactory.createInt, "KalturaDistributionProtocol"), 
        'asperaHost': getXmlNodeText, 
        'asperaLogin': getXmlNodeText, 
        'asperaPass': getXmlNodeText, 
        'port': getXmlNodeInt, 
        'passphrase': getXmlNodeText, 
        'asperaPublicKey': getXmlNodeText, 
        'asperaPrivateKey': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaHuluDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaHuluDistributionProfile")
        kparams.addStringIfDefined("sftpHost", self.sftpHost)
        kparams.addStringIfDefined("sftpLogin", self.sftpLogin)
        kparams.addStringIfDefined("sftpPass", self.sftpPass)
        kparams.addStringIfDefined("seriesChannel", self.seriesChannel)
        kparams.addStringIfDefined("seriesPrimaryCategory", self.seriesPrimaryCategory)
        kparams.addArrayIfDefined("seriesAdditionalCategories", self.seriesAdditionalCategories)
        kparams.addStringIfDefined("seasonNumber", self.seasonNumber)
        kparams.addStringIfDefined("seasonSynopsis", self.seasonSynopsis)
        kparams.addStringIfDefined("seasonTuneInInformation", self.seasonTuneInInformation)
        kparams.addStringIfDefined("videoMediaType", self.videoMediaType)
        kparams.addBoolIfDefined("disableEpisodeNumberCustomValidation", self.disableEpisodeNumberCustomValidation)
        kparams.addIntEnumIfDefined("protocol", self.protocol)
        kparams.addStringIfDefined("asperaHost", self.asperaHost)
        kparams.addStringIfDefined("asperaLogin", self.asperaLogin)
        kparams.addStringIfDefined("asperaPass", self.asperaPass)
        kparams.addIntIfDefined("port", self.port)
        kparams.addStringIfDefined("passphrase", self.passphrase)
        kparams.addStringIfDefined("asperaPublicKey", self.asperaPublicKey)
        kparams.addStringIfDefined("asperaPrivateKey", self.asperaPrivateKey)
        return kparams

    def getSftpHost(self):
        return self.sftpHost

    def setSftpHost(self, newSftpHost):
        self.sftpHost = newSftpHost

    def getSftpLogin(self):
        return self.sftpLogin

    def setSftpLogin(self, newSftpLogin):
        self.sftpLogin = newSftpLogin

    def getSftpPass(self):
        return self.sftpPass

    def setSftpPass(self, newSftpPass):
        self.sftpPass = newSftpPass

    def getSeriesChannel(self):
        return self.seriesChannel

    def setSeriesChannel(self, newSeriesChannel):
        self.seriesChannel = newSeriesChannel

    def getSeriesPrimaryCategory(self):
        return self.seriesPrimaryCategory

    def setSeriesPrimaryCategory(self, newSeriesPrimaryCategory):
        self.seriesPrimaryCategory = newSeriesPrimaryCategory

    def getSeriesAdditionalCategories(self):
        return self.seriesAdditionalCategories

    def setSeriesAdditionalCategories(self, newSeriesAdditionalCategories):
        self.seriesAdditionalCategories = newSeriesAdditionalCategories

    def getSeasonNumber(self):
        return self.seasonNumber

    def setSeasonNumber(self, newSeasonNumber):
        self.seasonNumber = newSeasonNumber

    def getSeasonSynopsis(self):
        return self.seasonSynopsis

    def setSeasonSynopsis(self, newSeasonSynopsis):
        self.seasonSynopsis = newSeasonSynopsis

    def getSeasonTuneInInformation(self):
        return self.seasonTuneInInformation

    def setSeasonTuneInInformation(self, newSeasonTuneInInformation):
        self.seasonTuneInInformation = newSeasonTuneInInformation

    def getVideoMediaType(self):
        return self.videoMediaType

    def setVideoMediaType(self, newVideoMediaType):
        self.videoMediaType = newVideoMediaType

    def getDisableEpisodeNumberCustomValidation(self):
        return self.disableEpisodeNumberCustomValidation

    def setDisableEpisodeNumberCustomValidation(self, newDisableEpisodeNumberCustomValidation):
        self.disableEpisodeNumberCustomValidation = newDisableEpisodeNumberCustomValidation

    def getProtocol(self):
        return self.protocol

    def setProtocol(self, newProtocol):
        self.protocol = newProtocol

    def getAsperaHost(self):
        return self.asperaHost

    def setAsperaHost(self, newAsperaHost):
        self.asperaHost = newAsperaHost

    def getAsperaLogin(self):
        return self.asperaLogin

    def setAsperaLogin(self, newAsperaLogin):
        self.asperaLogin = newAsperaLogin

    def getAsperaPass(self):
        return self.asperaPass

    def setAsperaPass(self, newAsperaPass):
        self.asperaPass = newAsperaPass

    def getPort(self):
        return self.port

    def setPort(self, newPort):
        self.port = newPort

    def getPassphrase(self):
        return self.passphrase

    def setPassphrase(self, newPassphrase):
        self.passphrase = newPassphrase

    def getAsperaPublicKey(self):
        return self.asperaPublicKey

    def setAsperaPublicKey(self, newAsperaPublicKey):
        self.asperaPublicKey = newAsperaPublicKey

    def getAsperaPrivateKey(self):
        return self.asperaPrivateKey

    def setAsperaPrivateKey(self, newAsperaPrivateKey):
        self.asperaPrivateKey = newAsperaPrivateKey


# @package Kaltura
# @subpackage Client
class KalturaHuluDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaHuluDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaHuluDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaHuluDistributionProviderFilter(KalturaHuluDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaHuluDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaHuluDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaHuluDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaHuluDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaHuluDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaHuluDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaHuluDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaHuluDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaHuluDistributionProfileFilter(KalturaHuluDistributionProfileBaseFilter):
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
        KalturaHuluDistributionProfileBaseFilter.__init__(self,
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
        KalturaHuluDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaHuluDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaHuluDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaHuluDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaHuluDistributionClientPlugin(KalturaClientPlugin):
    # KalturaHuluDistributionClientPlugin
    instance = None

    # @return KalturaHuluDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaHuluDistributionClientPlugin.instance == None:
            KalturaHuluDistributionClientPlugin.instance = KalturaHuluDistributionClientPlugin()
        return KalturaHuluDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaHuluDistributionProfileOrderBy': KalturaHuluDistributionProfileOrderBy,
            'KalturaHuluDistributionProviderOrderBy': KalturaHuluDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaHuluDistributionProvider': KalturaHuluDistributionProvider,
            'KalturaHuluDistributionJobProviderData': KalturaHuluDistributionJobProviderData,
            'KalturaHuluDistributionProfile': KalturaHuluDistributionProfile,
            'KalturaHuluDistributionProviderBaseFilter': KalturaHuluDistributionProviderBaseFilter,
            'KalturaHuluDistributionProviderFilter': KalturaHuluDistributionProviderFilter,
            'KalturaHuluDistributionProfileBaseFilter': KalturaHuluDistributionProfileBaseFilter,
            'KalturaHuluDistributionProfileFilter': KalturaHuluDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'huluDistribution'

