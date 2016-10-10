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
class KalturaMsnDistributionProfileOrderBy(object):
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
class KalturaMsnDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaMsnDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaMsnDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaMsnDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaMsnDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            xml=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # @var string
        self.xml = xml


    PROPERTY_LOADERS = {
        'xml': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaMsnDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaMsnDistributionJobProviderData")
        kparams.addStringIfDefined("xml", self.xml)
        return kparams

    def getXml(self):
        return self.xml

    def setXml(self, newXml):
        self.xml = newXml


# @package Kaltura
# @subpackage Client
class KalturaMsnDistributionProfile(KalturaConfigurableDistributionProfile):
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
            username=NotImplemented,
            password=NotImplemented,
            domain=NotImplemented,
            csId=NotImplemented,
            source=NotImplemented,
            sourceFriendlyName=NotImplemented,
            pageGroup=NotImplemented,
            sourceFlavorParamsId=NotImplemented,
            wmvFlavorParamsId=NotImplemented,
            flvFlavorParamsId=NotImplemented,
            slFlavorParamsId=NotImplemented,
            slHdFlavorParamsId=NotImplemented,
            msnvideoCat=NotImplemented,
            msnvideoTop=NotImplemented,
            msnvideoTopCat=NotImplemented):
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
        self.username = username

        # @var string
        self.password = password

        # @var string
        self.domain = domain

        # @var string
        self.csId = csId

        # @var string
        self.source = source

        # @var string
        self.sourceFriendlyName = sourceFriendlyName

        # @var string
        self.pageGroup = pageGroup

        # @var int
        self.sourceFlavorParamsId = sourceFlavorParamsId

        # @var int
        self.wmvFlavorParamsId = wmvFlavorParamsId

        # @var int
        self.flvFlavorParamsId = flvFlavorParamsId

        # @var int
        self.slFlavorParamsId = slFlavorParamsId

        # @var int
        self.slHdFlavorParamsId = slHdFlavorParamsId

        # @var string
        self.msnvideoCat = msnvideoCat

        # @var string
        self.msnvideoTop = msnvideoTop

        # @var string
        self.msnvideoTopCat = msnvideoTopCat


    PROPERTY_LOADERS = {
        'username': getXmlNodeText, 
        'password': getXmlNodeText, 
        'domain': getXmlNodeText, 
        'csId': getXmlNodeText, 
        'source': getXmlNodeText, 
        'sourceFriendlyName': getXmlNodeText, 
        'pageGroup': getXmlNodeText, 
        'sourceFlavorParamsId': getXmlNodeInt, 
        'wmvFlavorParamsId': getXmlNodeInt, 
        'flvFlavorParamsId': getXmlNodeInt, 
        'slFlavorParamsId': getXmlNodeInt, 
        'slHdFlavorParamsId': getXmlNodeInt, 
        'msnvideoCat': getXmlNodeText, 
        'msnvideoTop': getXmlNodeText, 
        'msnvideoTopCat': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaMsnDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaMsnDistributionProfile")
        kparams.addStringIfDefined("username", self.username)
        kparams.addStringIfDefined("password", self.password)
        kparams.addStringIfDefined("domain", self.domain)
        kparams.addStringIfDefined("csId", self.csId)
        kparams.addStringIfDefined("source", self.source)
        kparams.addStringIfDefined("sourceFriendlyName", self.sourceFriendlyName)
        kparams.addStringIfDefined("pageGroup", self.pageGroup)
        kparams.addIntIfDefined("sourceFlavorParamsId", self.sourceFlavorParamsId)
        kparams.addIntIfDefined("wmvFlavorParamsId", self.wmvFlavorParamsId)
        kparams.addIntIfDefined("flvFlavorParamsId", self.flvFlavorParamsId)
        kparams.addIntIfDefined("slFlavorParamsId", self.slFlavorParamsId)
        kparams.addIntIfDefined("slHdFlavorParamsId", self.slHdFlavorParamsId)
        kparams.addStringIfDefined("msnvideoCat", self.msnvideoCat)
        kparams.addStringIfDefined("msnvideoTop", self.msnvideoTop)
        kparams.addStringIfDefined("msnvideoTopCat", self.msnvideoTopCat)
        return kparams

    def getUsername(self):
        return self.username

    def setUsername(self, newUsername):
        self.username = newUsername

    def getPassword(self):
        return self.password

    def setPassword(self, newPassword):
        self.password = newPassword

    def getDomain(self):
        return self.domain

    def setDomain(self, newDomain):
        self.domain = newDomain

    def getCsId(self):
        return self.csId

    def setCsId(self, newCsId):
        self.csId = newCsId

    def getSource(self):
        return self.source

    def setSource(self, newSource):
        self.source = newSource

    def getSourceFriendlyName(self):
        return self.sourceFriendlyName

    def setSourceFriendlyName(self, newSourceFriendlyName):
        self.sourceFriendlyName = newSourceFriendlyName

    def getPageGroup(self):
        return self.pageGroup

    def setPageGroup(self, newPageGroup):
        self.pageGroup = newPageGroup

    def getSourceFlavorParamsId(self):
        return self.sourceFlavorParamsId

    def setSourceFlavorParamsId(self, newSourceFlavorParamsId):
        self.sourceFlavorParamsId = newSourceFlavorParamsId

    def getWmvFlavorParamsId(self):
        return self.wmvFlavorParamsId

    def setWmvFlavorParamsId(self, newWmvFlavorParamsId):
        self.wmvFlavorParamsId = newWmvFlavorParamsId

    def getFlvFlavorParamsId(self):
        return self.flvFlavorParamsId

    def setFlvFlavorParamsId(self, newFlvFlavorParamsId):
        self.flvFlavorParamsId = newFlvFlavorParamsId

    def getSlFlavorParamsId(self):
        return self.slFlavorParamsId

    def setSlFlavorParamsId(self, newSlFlavorParamsId):
        self.slFlavorParamsId = newSlFlavorParamsId

    def getSlHdFlavorParamsId(self):
        return self.slHdFlavorParamsId

    def setSlHdFlavorParamsId(self, newSlHdFlavorParamsId):
        self.slHdFlavorParamsId = newSlHdFlavorParamsId

    def getMsnvideoCat(self):
        return self.msnvideoCat

    def setMsnvideoCat(self, newMsnvideoCat):
        self.msnvideoCat = newMsnvideoCat

    def getMsnvideoTop(self):
        return self.msnvideoTop

    def setMsnvideoTop(self, newMsnvideoTop):
        self.msnvideoTop = newMsnvideoTop

    def getMsnvideoTopCat(self):
        return self.msnvideoTopCat

    def setMsnvideoTopCat(self, newMsnvideoTopCat):
        self.msnvideoTopCat = newMsnvideoTopCat


# @package Kaltura
# @subpackage Client
class KalturaMsnDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaMsnDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaMsnDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaMsnDistributionProviderFilter(KalturaMsnDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaMsnDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaMsnDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaMsnDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaMsnDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaMsnDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaMsnDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaMsnDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaMsnDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaMsnDistributionProfileFilter(KalturaMsnDistributionProfileBaseFilter):
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
        KalturaMsnDistributionProfileBaseFilter.__init__(self,
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
        KalturaMsnDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaMsnDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaMsnDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaMsnDistributionProfileFilter")
        return kparams


########## services ##########
########## main ##########
class KalturaMsnDistributionClientPlugin(KalturaClientPlugin):
    # KalturaMsnDistributionClientPlugin
    instance = None

    # @return KalturaMsnDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaMsnDistributionClientPlugin.instance == None:
            KalturaMsnDistributionClientPlugin.instance = KalturaMsnDistributionClientPlugin()
        return KalturaMsnDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
        }

    def getEnums(self):
        return {
            'KalturaMsnDistributionProfileOrderBy': KalturaMsnDistributionProfileOrderBy,
            'KalturaMsnDistributionProviderOrderBy': KalturaMsnDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaMsnDistributionProvider': KalturaMsnDistributionProvider,
            'KalturaMsnDistributionJobProviderData': KalturaMsnDistributionJobProviderData,
            'KalturaMsnDistributionProfile': KalturaMsnDistributionProfile,
            'KalturaMsnDistributionProviderBaseFilter': KalturaMsnDistributionProviderBaseFilter,
            'KalturaMsnDistributionProviderFilter': KalturaMsnDistributionProviderFilter,
            'KalturaMsnDistributionProfileBaseFilter': KalturaMsnDistributionProfileBaseFilter,
            'KalturaMsnDistributionProfileFilter': KalturaMsnDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'msnDistribution'

