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
class KalturaYahooDistributionProcessFeedActionStatus(object):
    MANUAL = 0
    AUTOMATIC = 1

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaYahooDistributionProfileOrderBy(object):
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
class KalturaYahooDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaYahooDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaYahooDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaYahooDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaYahooDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            smallThumbPath=NotImplemented,
            largeThumbPath=NotImplemented,
            videoAssetFilePath=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # @var string
        self.smallThumbPath = smallThumbPath

        # @var string
        self.largeThumbPath = largeThumbPath

        # @var string
        self.videoAssetFilePath = videoAssetFilePath


    PROPERTY_LOADERS = {
        'smallThumbPath': getXmlNodeText, 
        'largeThumbPath': getXmlNodeText, 
        'videoAssetFilePath': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaYahooDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaYahooDistributionJobProviderData")
        kparams.addStringIfDefined("smallThumbPath", self.smallThumbPath)
        kparams.addStringIfDefined("largeThumbPath", self.largeThumbPath)
        kparams.addStringIfDefined("videoAssetFilePath", self.videoAssetFilePath)
        return kparams

    def getSmallThumbPath(self):
        return self.smallThumbPath

    def setSmallThumbPath(self, newSmallThumbPath):
        self.smallThumbPath = newSmallThumbPath

    def getLargeThumbPath(self):
        return self.largeThumbPath

    def setLargeThumbPath(self, newLargeThumbPath):
        self.largeThumbPath = newLargeThumbPath

    def getVideoAssetFilePath(self):
        return self.videoAssetFilePath

    def setVideoAssetFilePath(self, newVideoAssetFilePath):
        self.videoAssetFilePath = newVideoAssetFilePath


# @package Kaltura
# @subpackage Client
class KalturaYahooDistributionProfile(KalturaConfigurableDistributionProfile):
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
            ftpPath=NotImplemented,
            ftpUsername=NotImplemented,
            ftpPassword=NotImplemented,
            ftpHost=NotImplemented,
            contactTelephone=NotImplemented,
            contactEmail=NotImplemented,
            processFeed=NotImplemented):
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
        self.ftpPath = ftpPath

        # @var string
        self.ftpUsername = ftpUsername

        # @var string
        self.ftpPassword = ftpPassword

        # @var string
        self.ftpHost = ftpHost

        # @var string
        self.contactTelephone = contactTelephone

        # @var string
        self.contactEmail = contactEmail

        # @var KalturaYahooDistributionProcessFeedActionStatus
        self.processFeed = processFeed


    PROPERTY_LOADERS = {
        'ftpPath': getXmlNodeText, 
        'ftpUsername': getXmlNodeText, 
        'ftpPassword': getXmlNodeText, 
        'ftpHost': getXmlNodeText, 
        'contactTelephone': getXmlNodeText, 
        'contactEmail': getXmlNodeText, 
        'processFeed': (KalturaEnumsFactory.createInt, "KalturaYahooDistributionProcessFeedActionStatus"), 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaYahooDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaYahooDistributionProfile")
        kparams.addStringIfDefined("ftpPath", self.ftpPath)
        kparams.addStringIfDefined("ftpUsername", self.ftpUsername)
        kparams.addStringIfDefined("ftpPassword", self.ftpPassword)
        kparams.addStringIfDefined("ftpHost", self.ftpHost)
        kparams.addStringIfDefined("contactTelephone", self.contactTelephone)
        kparams.addStringIfDefined("contactEmail", self.contactEmail)
        kparams.addIntEnumIfDefined("processFeed", self.processFeed)
        return kparams

    def getFtpPath(self):
        return self.ftpPath

    def setFtpPath(self, newFtpPath):
        self.ftpPath = newFtpPath

    def getFtpUsername(self):
        return self.ftpUsername

    def setFtpUsername(self, newFtpUsername):
        self.ftpUsername = newFtpUsername

    def getFtpPassword(self):
        return self.ftpPassword

    def setFtpPassword(self, newFtpPassword):
        self.ftpPassword = newFtpPassword

    def getFtpHost(self):
        return self.ftpHost

    def setFtpHost(self, newFtpHost):
        self.ftpHost = newFtpHost

    def getContactTelephone(self):
        return self.contactTelephone

    def setContactTelephone(self, newContactTelephone):
        self.contactTelephone = newContactTelephone

    def getContactEmail(self):
        return self.contactEmail

    def setContactEmail(self, newContactEmail):
        self.contactEmail = newContactEmail

    def getProcessFeed(self):
        return self.processFeed

    def setProcessFeed(self, newProcessFeed):
        self.processFeed = newProcessFeed


# @package Kaltura
# @subpackage Client
class KalturaYahooDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaYahooDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaYahooDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaYahooDistributionProviderFilter(KalturaYahooDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaYahooDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaYahooDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaYahooDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaYahooDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaYahooDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaYahooDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaYahooDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaYahooDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaYahooDistributionProfileFilter(KalturaYahooDistributionProfileBaseFilter):
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
        KalturaYahooDistributionProfileBaseFilter.__init__(self,
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
        KalturaYahooDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaYahooDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaYahooDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaYahooDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaYahooDistributionClientPlugin(KalturaClientPlugin):
    # KalturaYahooDistributionClientPlugin
    instance = None

    # @return KalturaYahooDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaYahooDistributionClientPlugin.instance == None:
            KalturaYahooDistributionClientPlugin.instance = KalturaYahooDistributionClientPlugin()
        return KalturaYahooDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaYahooDistributionProcessFeedActionStatus': KalturaYahooDistributionProcessFeedActionStatus,
            'KalturaYahooDistributionProfileOrderBy': KalturaYahooDistributionProfileOrderBy,
            'KalturaYahooDistributionProviderOrderBy': KalturaYahooDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaYahooDistributionProvider': KalturaYahooDistributionProvider,
            'KalturaYahooDistributionJobProviderData': KalturaYahooDistributionJobProviderData,
            'KalturaYahooDistributionProfile': KalturaYahooDistributionProfile,
            'KalturaYahooDistributionProviderBaseFilter': KalturaYahooDistributionProviderBaseFilter,
            'KalturaYahooDistributionProviderFilter': KalturaYahooDistributionProviderFilter,
            'KalturaYahooDistributionProfileBaseFilter': KalturaYahooDistributionProfileBaseFilter,
            'KalturaYahooDistributionProfileFilter': KalturaYahooDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'yahooDistribution'

