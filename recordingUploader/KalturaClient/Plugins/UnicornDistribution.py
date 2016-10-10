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
class KalturaUnicornDistributionProfileOrderBy(object):
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
class KalturaUnicornDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaUnicornDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaUnicornDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaUnicornDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaUnicornDistributionJobProviderData(KalturaConfigurableDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented,
            catalogGuid=NotImplemented,
            title=NotImplemented,
            mediaChanged=NotImplemented,
            flavorAssetVersion=NotImplemented,
            notificationBaseUrl=NotImplemented):
        KalturaConfigurableDistributionJobProviderData.__init__(self,
            fieldValues)

        # The Catalog GUID the video is in or will be ingested into.
        # @var string
        self.catalogGuid = catalogGuid

        # The Title assigned to the video. The Foreign Key will be used if no title is provided.
        # @var string
        self.title = title

        # Indicates that the media content changed and therefore the job should wait for HTTP callback notification to be closed.
        # @var bool
        self.mediaChanged = mediaChanged

        # Flavor asset version.
        # @var string
        self.flavorAssetVersion = flavorAssetVersion

        # The schema and host name to the Kaltura server, e.g. http://www.kaltura.com
        # @var string
        self.notificationBaseUrl = notificationBaseUrl


    PROPERTY_LOADERS = {
        'catalogGuid': getXmlNodeText, 
        'title': getXmlNodeText, 
        'mediaChanged': getXmlNodeBool, 
        'flavorAssetVersion': getXmlNodeText, 
        'notificationBaseUrl': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaUnicornDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaUnicornDistributionJobProviderData")
        kparams.addStringIfDefined("catalogGuid", self.catalogGuid)
        kparams.addStringIfDefined("title", self.title)
        kparams.addBoolIfDefined("mediaChanged", self.mediaChanged)
        kparams.addStringIfDefined("flavorAssetVersion", self.flavorAssetVersion)
        kparams.addStringIfDefined("notificationBaseUrl", self.notificationBaseUrl)
        return kparams

    def getCatalogGuid(self):
        return self.catalogGuid

    def setCatalogGuid(self, newCatalogGuid):
        self.catalogGuid = newCatalogGuid

    def getTitle(self):
        return self.title

    def setTitle(self, newTitle):
        self.title = newTitle

    def getMediaChanged(self):
        return self.mediaChanged

    def setMediaChanged(self, newMediaChanged):
        self.mediaChanged = newMediaChanged

    def getFlavorAssetVersion(self):
        return self.flavorAssetVersion

    def setFlavorAssetVersion(self, newFlavorAssetVersion):
        self.flavorAssetVersion = newFlavorAssetVersion

    def getNotificationBaseUrl(self):
        return self.notificationBaseUrl

    def setNotificationBaseUrl(self, newNotificationBaseUrl):
        self.notificationBaseUrl = newNotificationBaseUrl


# @package Kaltura
# @subpackage Client
class KalturaUnicornDistributionProfile(KalturaConfigurableDistributionProfile):
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
            domainName=NotImplemented,
            channelGuid=NotImplemented,
            apiHostUrl=NotImplemented,
            domainGuid=NotImplemented,
            adFreeApplicationGuid=NotImplemented,
            remoteAssetParamsId=NotImplemented,
            storageProfileId=NotImplemented):
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

        # The email address associated with the Upload User, used to authorize the incoming request.
        # @var string
        self.username = username

        # The password used in association with the email to determine if the Upload User is authorized the incoming request.
        # @var string
        self.password = password

        # The name of the Domain that the Upload User should have access to, Used for authentication.
        # @var string
        self.domainName = domainName

        # The Channel GUID assigned to this Publication Rule. Must be a valid Channel in the Domain that was used in authentication.
        # @var string
        self.channelGuid = channelGuid

        # The API host URL that the Upload User should have access to, Used for HTTP content submission.
        # @var string
        self.apiHostUrl = apiHostUrl

        # The GUID of the Customer Domain in the Unicorn system obtained by contacting your Unicorn representative.
        # @var string
        self.domainGuid = domainGuid

        # The GUID for the application in which to record metrics and enforce business rules obtained through your Unicorn representative.
        # @var string
        self.adFreeApplicationGuid = adFreeApplicationGuid

        # The flavor-params that will be used for the remote asset.
        # @var int
        self.remoteAssetParamsId = remoteAssetParamsId

        # The remote storage that should be used for the remote asset.
        # @var string
        self.storageProfileId = storageProfileId


    PROPERTY_LOADERS = {
        'username': getXmlNodeText, 
        'password': getXmlNodeText, 
        'domainName': getXmlNodeText, 
        'channelGuid': getXmlNodeText, 
        'apiHostUrl': getXmlNodeText, 
        'domainGuid': getXmlNodeText, 
        'adFreeApplicationGuid': getXmlNodeText, 
        'remoteAssetParamsId': getXmlNodeInt, 
        'storageProfileId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaConfigurableDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaUnicornDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaUnicornDistributionProfile")
        kparams.addStringIfDefined("username", self.username)
        kparams.addStringIfDefined("password", self.password)
        kparams.addStringIfDefined("domainName", self.domainName)
        kparams.addStringIfDefined("channelGuid", self.channelGuid)
        kparams.addStringIfDefined("apiHostUrl", self.apiHostUrl)
        kparams.addStringIfDefined("domainGuid", self.domainGuid)
        kparams.addStringIfDefined("adFreeApplicationGuid", self.adFreeApplicationGuid)
        kparams.addIntIfDefined("remoteAssetParamsId", self.remoteAssetParamsId)
        kparams.addStringIfDefined("storageProfileId", self.storageProfileId)
        return kparams

    def getUsername(self):
        return self.username

    def setUsername(self, newUsername):
        self.username = newUsername

    def getPassword(self):
        return self.password

    def setPassword(self, newPassword):
        self.password = newPassword

    def getDomainName(self):
        return self.domainName

    def setDomainName(self, newDomainName):
        self.domainName = newDomainName

    def getChannelGuid(self):
        return self.channelGuid

    def setChannelGuid(self, newChannelGuid):
        self.channelGuid = newChannelGuid

    def getApiHostUrl(self):
        return self.apiHostUrl

    def setApiHostUrl(self, newApiHostUrl):
        self.apiHostUrl = newApiHostUrl

    def getDomainGuid(self):
        return self.domainGuid

    def setDomainGuid(self, newDomainGuid):
        self.domainGuid = newDomainGuid

    def getAdFreeApplicationGuid(self):
        return self.adFreeApplicationGuid

    def setAdFreeApplicationGuid(self, newAdFreeApplicationGuid):
        self.adFreeApplicationGuid = newAdFreeApplicationGuid

    def getRemoteAssetParamsId(self):
        return self.remoteAssetParamsId

    def setRemoteAssetParamsId(self, newRemoteAssetParamsId):
        self.remoteAssetParamsId = newRemoteAssetParamsId

    def getStorageProfileId(self):
        return self.storageProfileId

    def setStorageProfileId(self, newStorageProfileId):
        self.storageProfileId = newStorageProfileId


# @package Kaltura
# @subpackage Client
class KalturaUnicornDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaUnicornDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaUnicornDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaUnicornDistributionProviderFilter(KalturaUnicornDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaUnicornDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaUnicornDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaUnicornDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaUnicornDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaUnicornDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaUnicornDistributionProfileBaseFilter(KalturaConfigurableDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaUnicornDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaUnicornDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaUnicornDistributionProfileFilter(KalturaUnicornDistributionProfileBaseFilter):
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
        KalturaUnicornDistributionProfileBaseFilter.__init__(self,
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
        KalturaUnicornDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaUnicornDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaUnicornDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaUnicornDistributionProfileFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaUnicornService(KalturaServiceBase):
    """Unicorn Service"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def notify(self, id):
        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("unicorndistribution_unicorn", "notify", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()

########## main ##########
class KalturaUnicornDistributionClientPlugin(KalturaClientPlugin):
    # KalturaUnicornDistributionClientPlugin
    instance = None

    # @return KalturaUnicornDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaUnicornDistributionClientPlugin.instance == None:
            KalturaUnicornDistributionClientPlugin.instance = KalturaUnicornDistributionClientPlugin()
        return KalturaUnicornDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'unicorn': KalturaUnicornService,
        }

    def getEnums(self):
        return {
            'KalturaUnicornDistributionProfileOrderBy': KalturaUnicornDistributionProfileOrderBy,
            'KalturaUnicornDistributionProviderOrderBy': KalturaUnicornDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaUnicornDistributionProvider': KalturaUnicornDistributionProvider,
            'KalturaUnicornDistributionJobProviderData': KalturaUnicornDistributionJobProviderData,
            'KalturaUnicornDistributionProfile': KalturaUnicornDistributionProfile,
            'KalturaUnicornDistributionProviderBaseFilter': KalturaUnicornDistributionProviderBaseFilter,
            'KalturaUnicornDistributionProviderFilter': KalturaUnicornDistributionProviderFilter,
            'KalturaUnicornDistributionProfileBaseFilter': KalturaUnicornDistributionProfileBaseFilter,
            'KalturaUnicornDistributionProfileFilter': KalturaUnicornDistributionProfileFilter,
        }

    # @return string
    def getName(self):
        return 'unicornDistribution'

