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
class KalturaQuickPlayDistributionProfileOrderBy(object):
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
class KalturaQuickPlayDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaQuickPlayDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaQuickPlayDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaQuickPlayDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaQuickPlayDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            xml=NotImplemented,
            videoFilePaths=NotImplemented,
            thumbnailFilePaths=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # @var string
        self.xml = xml

        # @var array of KalturaString
        self.videoFilePaths = videoFilePaths

        # @var array of KalturaString
        self.thumbnailFilePaths = thumbnailFilePaths


    PROPERTY_LOADERS = {
        'xml': getXmlNodeText, 
        'videoFilePaths': (KalturaObjectFactory.createArray, KalturaString), 
        'thumbnailFilePaths': (KalturaObjectFactory.createArray, KalturaString), 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaQuickPlayDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaQuickPlayDistributionJobProviderData")
        kparams.addStringIfDefined("xml", self.xml)
        kparams.addArrayIfDefined("videoFilePaths", self.videoFilePaths)
        kparams.addArrayIfDefined("thumbnailFilePaths", self.thumbnailFilePaths)
        return kparams

    def getXml(self):
        return self.xml

    def setXml(self, newXml):
        self.xml = newXml

    def getVideoFilePaths(self):
        return self.videoFilePaths

    def setVideoFilePaths(self, newVideoFilePaths):
        self.videoFilePaths = newVideoFilePaths

    def getThumbnailFilePaths(self):
        return self.thumbnailFilePaths

    def setThumbnailFilePaths(self, newThumbnailFilePaths):
        self.thumbnailFilePaths = newThumbnailFilePaths


# @package Kaltura
# @subpackage Client
class KalturaQuickPlayDistributionProfile(KalturaConfigurableDistributionProfile):
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
            sftpBasePath=NotImplemented,
            channelTitle=NotImplemented,
            channelLink=NotImplemented,
            channelDescription=NotImplemented,
            channelManagingEditor=NotImplemented,
            channelLanguage=NotImplemented,
            channelImageTitle=NotImplemented,
            channelImageWidth=NotImplemented,
            channelImageHeight=NotImplemented,
            channelImageLink=NotImplemented,
            channelImageUrl=NotImplemented,
            channelCopyright=NotImplemented,
            channelGenerator=NotImplemented,
            channelRating=NotImplemented):
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
        self.sftpBasePath = sftpBasePath

        # @var string
        self.channelTitle = channelTitle

        # @var string
        self.channelLink = channelLink

        # @var string
        self.channelDescription = channelDescription

        # @var string
        self.channelManagingEditor = channelManagingEditor

        # @var string
        self.channelLanguage = channelLanguage

        # @var string
        self.channelImageTitle = channelImageTitle

        # @var string
        self.channelImageWidth = channelImageWidth

        # @var string
        self.channelImageHeight = channelImageHeight

        # @var string
        self.channelImageLink = channelImageLink

        # @var string
        self.channelImageUrl = channelImageUrl

        # @var string
        self.channelCopyright = channelCopyright

        # @var string
        self.channelGenerator = channelGenerator

        # @var string
        self.channelRating = channelRating


    PROPERTY_LOADERS = {
        'sftpHost': getXmlNodeText, 
        'sftpLogin': getXmlNodeText, 
        'sftpPass': getXmlNodeText, 
        'sftpBasePath': getXmlNodeText, 
        'channelTitle': getXmlNodeText, 
        'channelLink': getXmlNodeText, 
        'channelDescription': getXmlNodeText, 
        'channelManagingEditor': getXmlNodeText, 
        'channelLanguage': getXmlNodeText, 
        'channelImageTitle': getXmlNodeText, 
        'channelImageWidth': getXmlNodeText, 
        'channelImageHeight': getXmlNodeText, 
        'channelImageLink': getXmlNodeText, 
        'channelImageUrl': getXmlNodeText, 
        'channelCopyright': getXmlNodeText, 
        'channelGenerator': getXmlNodeText, 
        'channelRating': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaQuickPlayDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaQuickPlayDistributionProfile")
        kparams.addStringIfDefined("sftpHost", self.sftpHost)
        kparams.addStringIfDefined("sftpLogin", self.sftpLogin)
        kparams.addStringIfDefined("sftpPass", self.sftpPass)
        kparams.addStringIfDefined("sftpBasePath", self.sftpBasePath)
        kparams.addStringIfDefined("channelTitle", self.channelTitle)
        kparams.addStringIfDefined("channelLink", self.channelLink)
        kparams.addStringIfDefined("channelDescription", self.channelDescription)
        kparams.addStringIfDefined("channelManagingEditor", self.channelManagingEditor)
        kparams.addStringIfDefined("channelLanguage", self.channelLanguage)
        kparams.addStringIfDefined("channelImageTitle", self.channelImageTitle)
        kparams.addStringIfDefined("channelImageWidth", self.channelImageWidth)
        kparams.addStringIfDefined("channelImageHeight", self.channelImageHeight)
        kparams.addStringIfDefined("channelImageLink", self.channelImageLink)
        kparams.addStringIfDefined("channelImageUrl", self.channelImageUrl)
        kparams.addStringIfDefined("channelCopyright", self.channelCopyright)
        kparams.addStringIfDefined("channelGenerator", self.channelGenerator)
        kparams.addStringIfDefined("channelRating", self.channelRating)
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

    def getSftpBasePath(self):
        return self.sftpBasePath

    def setSftpBasePath(self, newSftpBasePath):
        self.sftpBasePath = newSftpBasePath

    def getChannelTitle(self):
        return self.channelTitle

    def setChannelTitle(self, newChannelTitle):
        self.channelTitle = newChannelTitle

    def getChannelLink(self):
        return self.channelLink

    def setChannelLink(self, newChannelLink):
        self.channelLink = newChannelLink

    def getChannelDescription(self):
        return self.channelDescription

    def setChannelDescription(self, newChannelDescription):
        self.channelDescription = newChannelDescription

    def getChannelManagingEditor(self):
        return self.channelManagingEditor

    def setChannelManagingEditor(self, newChannelManagingEditor):
        self.channelManagingEditor = newChannelManagingEditor

    def getChannelLanguage(self):
        return self.channelLanguage

    def setChannelLanguage(self, newChannelLanguage):
        self.channelLanguage = newChannelLanguage

    def getChannelImageTitle(self):
        return self.channelImageTitle

    def setChannelImageTitle(self, newChannelImageTitle):
        self.channelImageTitle = newChannelImageTitle

    def getChannelImageWidth(self):
        return self.channelImageWidth

    def setChannelImageWidth(self, newChannelImageWidth):
        self.channelImageWidth = newChannelImageWidth

    def getChannelImageHeight(self):
        return self.channelImageHeight

    def setChannelImageHeight(self, newChannelImageHeight):
        self.channelImageHeight = newChannelImageHeight

    def getChannelImageLink(self):
        return self.channelImageLink

    def setChannelImageLink(self, newChannelImageLink):
        self.channelImageLink = newChannelImageLink

    def getChannelImageUrl(self):
        return self.channelImageUrl

    def setChannelImageUrl(self, newChannelImageUrl):
        self.channelImageUrl = newChannelImageUrl

    def getChannelCopyright(self):
        return self.channelCopyright

    def setChannelCopyright(self, newChannelCopyright):
        self.channelCopyright = newChannelCopyright

    def getChannelGenerator(self):
        return self.channelGenerator

    def setChannelGenerator(self, newChannelGenerator):
        self.channelGenerator = newChannelGenerator

    def getChannelRating(self):
        return self.channelRating

    def setChannelRating(self, newChannelRating):
        self.channelRating = newChannelRating


# @package Kaltura
# @subpackage Client
class KalturaQuickPlayDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaQuickPlayDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaQuickPlayDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaQuickPlayDistributionProviderFilter(KalturaQuickPlayDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaQuickPlayDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaQuickPlayDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaQuickPlayDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaQuickPlayDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaQuickPlayDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaQuickPlayDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaQuickPlayDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaQuickPlayDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaQuickPlayDistributionProfileFilter(KalturaQuickPlayDistributionProfileBaseFilter):
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
        KalturaQuickPlayDistributionProfileBaseFilter.__init__(self,
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
        KalturaQuickPlayDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaQuickPlayDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaQuickPlayDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaQuickPlayDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaQuickPlayDistributionClientPlugin(KalturaClientPlugin):
    # KalturaQuickPlayDistributionClientPlugin
    instance = None

    # @return KalturaQuickPlayDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaQuickPlayDistributionClientPlugin.instance == None:
            KalturaQuickPlayDistributionClientPlugin.instance = KalturaQuickPlayDistributionClientPlugin()
        return KalturaQuickPlayDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaQuickPlayDistributionProfileOrderBy': KalturaQuickPlayDistributionProfileOrderBy,
            'KalturaQuickPlayDistributionProviderOrderBy': KalturaQuickPlayDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaQuickPlayDistributionProvider': KalturaQuickPlayDistributionProvider,
            'KalturaQuickPlayDistributionJobProviderData': KalturaQuickPlayDistributionJobProviderData,
            'KalturaQuickPlayDistributionProfile': KalturaQuickPlayDistributionProfile,
            'KalturaQuickPlayDistributionProviderBaseFilter': KalturaQuickPlayDistributionProviderBaseFilter,
            'KalturaQuickPlayDistributionProviderFilter': KalturaQuickPlayDistributionProviderFilter,
            'KalturaQuickPlayDistributionProfileBaseFilter': KalturaQuickPlayDistributionProfileBaseFilter,
            'KalturaQuickPlayDistributionProfileFilter': KalturaQuickPlayDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'quickPlayDistribution'

