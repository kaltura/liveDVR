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
class KalturaDrmLicenseExpirationPolicy(object):
    FIXED_DURATION = 1
    ENTRY_SCHEDULING_END = 2
    UNLIMITED = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDrmPolicyStatus(object):
    ACTIVE = 1
    DELETED = 2

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDrmProfileStatus(object):
    ACTIVE = 1
    DELETED = 2

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDrmDeviceOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    CREATED_AT_DESC = "-createdAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDrmLicenseScenario(object):
    PROTECTION = "playReady.PROTECTION"
    PURCHASE = "playReady.PURCHASE"
    RENTAL = "playReady.RENTAL"
    SUBSCRIPTION = "playReady.SUBSCRIPTION"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDrmLicenseType(object):
    NON_PERSISTENT = "playReady.NON_PERSISTENT"
    PERSISTENT = "playReady.PERSISTENT"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDrmPolicyOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDrmProfileOrderBy(object):
    ID_ASC = "+id"
    NAME_ASC = "+name"
    ID_DESC = "-id"
    NAME_DESC = "-name"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDrmProviderType(object):
    FAIRPLAY = "fairplay.FAIRPLAY"
    PLAY_READY = "playReady.PLAY_READY"
    WIDEVINE = "widevine.WIDEVINE"
    CENC = "1"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaDrmLicenseAccessDetails(KalturaObjectBase):
    def __init__(self,
            policy=NotImplemented,
            duration=NotImplemented,
            absolute_duration=NotImplemented):
        KalturaObjectBase.__init__(self)

        # Drm policy name
        # @var string
        self.policy = policy

        # movie duration in seconds
        # @var int
        self.duration = duration

        # playback window in seconds
        # @var int
        self.absolute_duration = absolute_duration


    PROPERTY_LOADERS = {
        'policy': getXmlNodeText, 
        'duration': getXmlNodeInt, 
        'absolute_duration': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDrmLicenseAccessDetails.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaDrmLicenseAccessDetails")
        kparams.addStringIfDefined("policy", self.policy)
        kparams.addIntIfDefined("duration", self.duration)
        kparams.addIntIfDefined("absolute_duration", self.absolute_duration)
        return kparams

    def getPolicy(self):
        return self.policy

    def setPolicy(self, newPolicy):
        self.policy = newPolicy

    def getDuration(self):
        return self.duration

    def setDuration(self, newDuration):
        self.duration = newDuration

    def getAbsolute_duration(self):
        return self.absolute_duration

    def setAbsolute_duration(self, newAbsolute_duration):
        self.absolute_duration = newAbsolute_duration


# @package Kaltura
# @subpackage Client
class KalturaDrmPolicy(KalturaObjectBase):
    def __init__(self,
            id=NotImplemented,
            partnerId=NotImplemented,
            name=NotImplemented,
            systemName=NotImplemented,
            description=NotImplemented,
            provider=NotImplemented,
            status=NotImplemented,
            scenario=NotImplemented,
            licenseType=NotImplemented,
            licenseExpirationPolicy=NotImplemented,
            duration=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var int
        # @readonly
        self.id = id

        # @var int
        # @insertonly
        self.partnerId = partnerId

        # @var string
        self.name = name

        # @var string
        self.systemName = systemName

        # @var string
        self.description = description

        # @var KalturaDrmProviderType
        self.provider = provider

        # @var KalturaDrmPolicyStatus
        self.status = status

        # @var KalturaDrmLicenseScenario
        self.scenario = scenario

        # @var KalturaDrmLicenseType
        self.licenseType = licenseType

        # @var KalturaDrmLicenseExpirationPolicy
        self.licenseExpirationPolicy = licenseExpirationPolicy

        # Duration in days the license is effective
        # @var int
        self.duration = duration

        # @var int
        # @readonly
        self.createdAt = createdAt

        # @var int
        # @readonly
        self.updatedAt = updatedAt


    PROPERTY_LOADERS = {
        'id': getXmlNodeInt, 
        'partnerId': getXmlNodeInt, 
        'name': getXmlNodeText, 
        'systemName': getXmlNodeText, 
        'description': getXmlNodeText, 
        'provider': (KalturaEnumsFactory.createString, "KalturaDrmProviderType"), 
        'status': (KalturaEnumsFactory.createInt, "KalturaDrmPolicyStatus"), 
        'scenario': (KalturaEnumsFactory.createString, "KalturaDrmLicenseScenario"), 
        'licenseType': (KalturaEnumsFactory.createString, "KalturaDrmLicenseType"), 
        'licenseExpirationPolicy': (KalturaEnumsFactory.createInt, "KalturaDrmLicenseExpirationPolicy"), 
        'duration': getXmlNodeInt, 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDrmPolicy.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaDrmPolicy")
        kparams.addIntIfDefined("partnerId", self.partnerId)
        kparams.addStringIfDefined("name", self.name)
        kparams.addStringIfDefined("systemName", self.systemName)
        kparams.addStringIfDefined("description", self.description)
        kparams.addStringEnumIfDefined("provider", self.provider)
        kparams.addIntEnumIfDefined("status", self.status)
        kparams.addStringEnumIfDefined("scenario", self.scenario)
        kparams.addStringEnumIfDefined("licenseType", self.licenseType)
        kparams.addIntEnumIfDefined("licenseExpirationPolicy", self.licenseExpirationPolicy)
        kparams.addIntIfDefined("duration", self.duration)
        return kparams

    def getId(self):
        return self.id

    def getPartnerId(self):
        return self.partnerId

    def setPartnerId(self, newPartnerId):
        self.partnerId = newPartnerId

    def getName(self):
        return self.name

    def setName(self, newName):
        self.name = newName

    def getSystemName(self):
        return self.systemName

    def setSystemName(self, newSystemName):
        self.systemName = newSystemName

    def getDescription(self):
        return self.description

    def setDescription(self, newDescription):
        self.description = newDescription

    def getProvider(self):
        return self.provider

    def setProvider(self, newProvider):
        self.provider = newProvider

    def getStatus(self):
        return self.status

    def setStatus(self, newStatus):
        self.status = newStatus

    def getScenario(self):
        return self.scenario

    def setScenario(self, newScenario):
        self.scenario = newScenario

    def getLicenseType(self):
        return self.licenseType

    def setLicenseType(self, newLicenseType):
        self.licenseType = newLicenseType

    def getLicenseExpirationPolicy(self):
        return self.licenseExpirationPolicy

    def setLicenseExpirationPolicy(self, newLicenseExpirationPolicy):
        self.licenseExpirationPolicy = newLicenseExpirationPolicy

    def getDuration(self):
        return self.duration

    def setDuration(self, newDuration):
        self.duration = newDuration

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt


# @package Kaltura
# @subpackage Client
class KalturaDrmProfile(KalturaObjectBase):
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
            signingKey=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var int
        # @readonly
        self.id = id

        # @var int
        # @insertonly
        self.partnerId = partnerId

        # @var string
        self.name = name

        # @var string
        self.description = description

        # @var KalturaDrmProviderType
        self.provider = provider

        # @var KalturaDrmProfileStatus
        self.status = status

        # @var string
        self.licenseServerUrl = licenseServerUrl

        # @var string
        self.defaultPolicy = defaultPolicy

        # @var int
        # @readonly
        self.createdAt = createdAt

        # @var int
        # @readonly
        self.updatedAt = updatedAt

        # @var string
        self.signingKey = signingKey


    PROPERTY_LOADERS = {
        'id': getXmlNodeInt, 
        'partnerId': getXmlNodeInt, 
        'name': getXmlNodeText, 
        'description': getXmlNodeText, 
        'provider': (KalturaEnumsFactory.createString, "KalturaDrmProviderType"), 
        'status': (KalturaEnumsFactory.createInt, "KalturaDrmProfileStatus"), 
        'licenseServerUrl': getXmlNodeText, 
        'defaultPolicy': getXmlNodeText, 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
        'signingKey': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDrmProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaDrmProfile")
        kparams.addIntIfDefined("partnerId", self.partnerId)
        kparams.addStringIfDefined("name", self.name)
        kparams.addStringIfDefined("description", self.description)
        kparams.addStringEnumIfDefined("provider", self.provider)
        kparams.addIntEnumIfDefined("status", self.status)
        kparams.addStringIfDefined("licenseServerUrl", self.licenseServerUrl)
        kparams.addStringIfDefined("defaultPolicy", self.defaultPolicy)
        kparams.addStringIfDefined("signingKey", self.signingKey)
        return kparams

    def getId(self):
        return self.id

    def getPartnerId(self):
        return self.partnerId

    def setPartnerId(self, newPartnerId):
        self.partnerId = newPartnerId

    def getName(self):
        return self.name

    def setName(self, newName):
        self.name = newName

    def getDescription(self):
        return self.description

    def setDescription(self, newDescription):
        self.description = newDescription

    def getProvider(self):
        return self.provider

    def setProvider(self, newProvider):
        self.provider = newProvider

    def getStatus(self):
        return self.status

    def setStatus(self, newStatus):
        self.status = newStatus

    def getLicenseServerUrl(self):
        return self.licenseServerUrl

    def setLicenseServerUrl(self, newLicenseServerUrl):
        self.licenseServerUrl = newLicenseServerUrl

    def getDefaultPolicy(self):
        return self.defaultPolicy

    def setDefaultPolicy(self, newDefaultPolicy):
        self.defaultPolicy = newDefaultPolicy

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt

    def getSigningKey(self):
        return self.signingKey

    def setSigningKey(self, newSigningKey):
        self.signingKey = newSigningKey


# @package Kaltura
# @subpackage Client
class KalturaAccessControlDrmPolicyAction(KalturaRuleAction):
    def __init__(self,
            type=NotImplemented,
            policyId=NotImplemented):
        KalturaRuleAction.__init__(self,
            type)

        # Drm policy id
        # @var int
        self.policyId = policyId


    PROPERTY_LOADERS = {
        'policyId': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaRuleAction.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAccessControlDrmPolicyAction.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaRuleAction.toParams(self)
        kparams.put("objectType", "KalturaAccessControlDrmPolicyAction")
        kparams.addIntIfDefined("policyId", self.policyId)
        return kparams

    def getPolicyId(self):
        return self.policyId

    def setPolicyId(self, newPolicyId):
        self.policyId = newPolicyId


# @package Kaltura
# @subpackage Client
class KalturaDrmDeviceBaseFilter(KalturaFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            deviceIdLike=NotImplemented,
            providerEqual=NotImplemented,
            providerIn=NotImplemented):
        KalturaFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var int
        self.partnerIdEqual = partnerIdEqual

        # @var string
        self.partnerIdIn = partnerIdIn

        # @var string
        self.deviceIdLike = deviceIdLike

        # @var KalturaDrmProviderType
        self.providerEqual = providerEqual

        # @var string
        self.providerIn = providerIn


    PROPERTY_LOADERS = {
        'partnerIdEqual': getXmlNodeInt, 
        'partnerIdIn': getXmlNodeText, 
        'deviceIdLike': getXmlNodeText, 
        'providerEqual': (KalturaEnumsFactory.createString, "KalturaDrmProviderType"), 
        'providerIn': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDrmDeviceBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFilter.toParams(self)
        kparams.put("objectType", "KalturaDrmDeviceBaseFilter")
        kparams.addIntIfDefined("partnerIdEqual", self.partnerIdEqual)
        kparams.addStringIfDefined("partnerIdIn", self.partnerIdIn)
        kparams.addStringIfDefined("deviceIdLike", self.deviceIdLike)
        kparams.addStringEnumIfDefined("providerEqual", self.providerEqual)
        kparams.addStringIfDefined("providerIn", self.providerIn)
        return kparams

    def getPartnerIdEqual(self):
        return self.partnerIdEqual

    def setPartnerIdEqual(self, newPartnerIdEqual):
        self.partnerIdEqual = newPartnerIdEqual

    def getPartnerIdIn(self):
        return self.partnerIdIn

    def setPartnerIdIn(self, newPartnerIdIn):
        self.partnerIdIn = newPartnerIdIn

    def getDeviceIdLike(self):
        return self.deviceIdLike

    def setDeviceIdLike(self, newDeviceIdLike):
        self.deviceIdLike = newDeviceIdLike

    def getProviderEqual(self):
        return self.providerEqual

    def setProviderEqual(self, newProviderEqual):
        self.providerEqual = newProviderEqual

    def getProviderIn(self):
        return self.providerIn

    def setProviderIn(self, newProviderIn):
        self.providerIn = newProviderIn


# @package Kaltura
# @subpackage Client
class KalturaDrmPolicyBaseFilter(KalturaFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            systemNameLike=NotImplemented,
            providerEqual=NotImplemented,
            providerIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            scenarioEqual=NotImplemented,
            scenarioIn=NotImplemented):
        KalturaFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var int
        self.partnerIdEqual = partnerIdEqual

        # @var string
        self.partnerIdIn = partnerIdIn

        # @var string
        self.nameLike = nameLike

        # @var string
        self.systemNameLike = systemNameLike

        # @var KalturaDrmProviderType
        self.providerEqual = providerEqual

        # @var string
        self.providerIn = providerIn

        # @var KalturaDrmPolicyStatus
        self.statusEqual = statusEqual

        # @var string
        self.statusIn = statusIn

        # @var KalturaDrmLicenseScenario
        self.scenarioEqual = scenarioEqual

        # @var string
        self.scenarioIn = scenarioIn


    PROPERTY_LOADERS = {
        'partnerIdEqual': getXmlNodeInt, 
        'partnerIdIn': getXmlNodeText, 
        'nameLike': getXmlNodeText, 
        'systemNameLike': getXmlNodeText, 
        'providerEqual': (KalturaEnumsFactory.createString, "KalturaDrmProviderType"), 
        'providerIn': getXmlNodeText, 
        'statusEqual': (KalturaEnumsFactory.createInt, "KalturaDrmPolicyStatus"), 
        'statusIn': getXmlNodeText, 
        'scenarioEqual': (KalturaEnumsFactory.createString, "KalturaDrmLicenseScenario"), 
        'scenarioIn': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDrmPolicyBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFilter.toParams(self)
        kparams.put("objectType", "KalturaDrmPolicyBaseFilter")
        kparams.addIntIfDefined("partnerIdEqual", self.partnerIdEqual)
        kparams.addStringIfDefined("partnerIdIn", self.partnerIdIn)
        kparams.addStringIfDefined("nameLike", self.nameLike)
        kparams.addStringIfDefined("systemNameLike", self.systemNameLike)
        kparams.addStringEnumIfDefined("providerEqual", self.providerEqual)
        kparams.addStringIfDefined("providerIn", self.providerIn)
        kparams.addIntEnumIfDefined("statusEqual", self.statusEqual)
        kparams.addStringIfDefined("statusIn", self.statusIn)
        kparams.addStringEnumIfDefined("scenarioEqual", self.scenarioEqual)
        kparams.addStringIfDefined("scenarioIn", self.scenarioIn)
        return kparams

    def getPartnerIdEqual(self):
        return self.partnerIdEqual

    def setPartnerIdEqual(self, newPartnerIdEqual):
        self.partnerIdEqual = newPartnerIdEqual

    def getPartnerIdIn(self):
        return self.partnerIdIn

    def setPartnerIdIn(self, newPartnerIdIn):
        self.partnerIdIn = newPartnerIdIn

    def getNameLike(self):
        return self.nameLike

    def setNameLike(self, newNameLike):
        self.nameLike = newNameLike

    def getSystemNameLike(self):
        return self.systemNameLike

    def setSystemNameLike(self, newSystemNameLike):
        self.systemNameLike = newSystemNameLike

    def getProviderEqual(self):
        return self.providerEqual

    def setProviderEqual(self, newProviderEqual):
        self.providerEqual = newProviderEqual

    def getProviderIn(self):
        return self.providerIn

    def setProviderIn(self, newProviderIn):
        self.providerIn = newProviderIn

    def getStatusEqual(self):
        return self.statusEqual

    def setStatusEqual(self, newStatusEqual):
        self.statusEqual = newStatusEqual

    def getStatusIn(self):
        return self.statusIn

    def setStatusIn(self, newStatusIn):
        self.statusIn = newStatusIn

    def getScenarioEqual(self):
        return self.scenarioEqual

    def setScenarioEqual(self, newScenarioEqual):
        self.scenarioEqual = newScenarioEqual

    def getScenarioIn(self):
        return self.scenarioIn

    def setScenarioIn(self, newScenarioIn):
        self.scenarioIn = newScenarioIn


# @package Kaltura
# @subpackage Client
class KalturaDrmPolicyListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaDrmPolicy
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaDrmPolicy), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDrmPolicyListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaDrmPolicyListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaDrmProfileBaseFilter(KalturaFilter):
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
        KalturaFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var int
        self.idEqual = idEqual

        # @var string
        self.idIn = idIn

        # @var int
        self.partnerIdEqual = partnerIdEqual

        # @var string
        self.partnerIdIn = partnerIdIn

        # @var string
        self.nameLike = nameLike

        # @var KalturaDrmProviderType
        self.providerEqual = providerEqual

        # @var string
        self.providerIn = providerIn

        # @var KalturaDrmProfileStatus
        self.statusEqual = statusEqual

        # @var string
        self.statusIn = statusIn


    PROPERTY_LOADERS = {
        'idEqual': getXmlNodeInt, 
        'idIn': getXmlNodeText, 
        'partnerIdEqual': getXmlNodeInt, 
        'partnerIdIn': getXmlNodeText, 
        'nameLike': getXmlNodeText, 
        'providerEqual': (KalturaEnumsFactory.createString, "KalturaDrmProviderType"), 
        'providerIn': getXmlNodeText, 
        'statusEqual': (KalturaEnumsFactory.createInt, "KalturaDrmProfileStatus"), 
        'statusIn': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDrmProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFilter.toParams(self)
        kparams.put("objectType", "KalturaDrmProfileBaseFilter")
        kparams.addIntIfDefined("idEqual", self.idEqual)
        kparams.addStringIfDefined("idIn", self.idIn)
        kparams.addIntIfDefined("partnerIdEqual", self.partnerIdEqual)
        kparams.addStringIfDefined("partnerIdIn", self.partnerIdIn)
        kparams.addStringIfDefined("nameLike", self.nameLike)
        kparams.addStringEnumIfDefined("providerEqual", self.providerEqual)
        kparams.addStringIfDefined("providerIn", self.providerIn)
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

    def getPartnerIdEqual(self):
        return self.partnerIdEqual

    def setPartnerIdEqual(self, newPartnerIdEqual):
        self.partnerIdEqual = newPartnerIdEqual

    def getPartnerIdIn(self):
        return self.partnerIdIn

    def setPartnerIdIn(self, newPartnerIdIn):
        self.partnerIdIn = newPartnerIdIn

    def getNameLike(self):
        return self.nameLike

    def setNameLike(self, newNameLike):
        self.nameLike = newNameLike

    def getProviderEqual(self):
        return self.providerEqual

    def setProviderEqual(self, newProviderEqual):
        self.providerEqual = newProviderEqual

    def getProviderIn(self):
        return self.providerIn

    def setProviderIn(self, newProviderIn):
        self.providerIn = newProviderIn

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
class KalturaDrmProfileListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaDrmProfile
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaDrmProfile), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDrmProfileListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaDrmProfileListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaDrmDeviceFilter(KalturaDrmDeviceBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            deviceIdLike=NotImplemented,
            providerEqual=NotImplemented,
            providerIn=NotImplemented):
        KalturaDrmDeviceBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            partnerIdEqual,
            partnerIdIn,
            deviceIdLike,
            providerEqual,
            providerIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDrmDeviceBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDrmDeviceFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDrmDeviceBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaDrmDeviceFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDrmPolicyFilter(KalturaDrmPolicyBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            nameLike=NotImplemented,
            systemNameLike=NotImplemented,
            providerEqual=NotImplemented,
            providerIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            scenarioEqual=NotImplemented,
            scenarioIn=NotImplemented):
        KalturaDrmPolicyBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            partnerIdEqual,
            partnerIdIn,
            nameLike,
            systemNameLike,
            providerEqual,
            providerIn,
            statusEqual,
            statusIn,
            scenarioEqual,
            scenarioIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDrmPolicyBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDrmPolicyFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDrmPolicyBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaDrmPolicyFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDrmProfileFilter(KalturaDrmProfileBaseFilter):
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
        KalturaDrmProfileBaseFilter.__init__(self,
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
        KalturaDrmProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDrmProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDrmProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaDrmProfileFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaDrmPolicyService(KalturaServiceBase):
    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, drmPolicy):
        """Allows you to add a new DrmPolicy object"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("drmPolicy", drmPolicy)
        self.client.queueServiceActionCall("drm_drmpolicy", "add", KalturaDrmPolicy, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDrmPolicy)

    def get(self, drmPolicyId):
        """Retrieve a KalturaDrmPolicy object by ID"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("drmPolicyId", drmPolicyId);
        self.client.queueServiceActionCall("drm_drmpolicy", "get", KalturaDrmPolicy, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDrmPolicy)

    def update(self, drmPolicyId, drmPolicy):
        """Update an existing KalturaDrmPolicy object"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("drmPolicyId", drmPolicyId);
        kparams.addObjectIfDefined("drmPolicy", drmPolicy)
        self.client.queueServiceActionCall("drm_drmpolicy", "update", KalturaDrmPolicy, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDrmPolicy)

    def delete(self, drmPolicyId):
        """Mark the KalturaDrmPolicy object as deleted"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("drmPolicyId", drmPolicyId);
        self.client.queueServiceActionCall("drm_drmpolicy", "delete", KalturaDrmPolicy, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDrmPolicy)

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List KalturaDrmPolicy objects"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("drm_drmpolicy", "list", KalturaDrmPolicyListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDrmPolicyListResponse)


# @package Kaltura
# @subpackage Client
class KalturaDrmProfileService(KalturaServiceBase):
    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, drmProfile):
        """Allows you to add a new DrmProfile object"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("drmProfile", drmProfile)
        self.client.queueServiceActionCall("drm_drmprofile", "add", KalturaDrmProfile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDrmProfile)

    def get(self, drmProfileId):
        """Retrieve a KalturaDrmProfile object by ID"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("drmProfileId", drmProfileId);
        self.client.queueServiceActionCall("drm_drmprofile", "get", KalturaDrmProfile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDrmProfile)

    def update(self, drmProfileId, drmProfile):
        """Update an existing KalturaDrmProfile object"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("drmProfileId", drmProfileId);
        kparams.addObjectIfDefined("drmProfile", drmProfile)
        self.client.queueServiceActionCall("drm_drmprofile", "update", KalturaDrmProfile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDrmProfile)

    def delete(self, drmProfileId):
        """Mark the KalturaDrmProfile object as deleted"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("drmProfileId", drmProfileId);
        self.client.queueServiceActionCall("drm_drmprofile", "delete", KalturaDrmProfile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDrmProfile)

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List KalturaDrmProfile objects"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("drm_drmprofile", "list", KalturaDrmProfileListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDrmProfileListResponse)

    def getByProvider(self, provider):
        """Retrieve a KalturaDrmProfile object by provider, if no specific profile defined return default profile"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("provider", provider)
        self.client.queueServiceActionCall("drm_drmprofile", "getByProvider", KalturaDrmProfile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDrmProfile)


# @package Kaltura
# @subpackage Client
class KalturaDrmLicenseAccessService(KalturaServiceBase):
    """Retrieve information and invoke actions on Flavor Asset"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def getAccess(self, entryId, flavorIds, referrer):
        """getAccessAction
             input: flavor ids, drmProvider
             Get Access Action"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        kparams.addStringIfDefined("flavorIds", flavorIds)
        kparams.addStringIfDefined("referrer", referrer)
        self.client.queueServiceActionCall("drm_drmlicenseaccess", "getAccess", KalturaDrmLicenseAccessDetails, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDrmLicenseAccessDetails)

########## main ##########
class KalturaDrmClientPlugin(KalturaClientPlugin):
    # KalturaDrmClientPlugin
    instance = None

    # @return KalturaDrmClientPlugin
    @staticmethod
    def get():
        if KalturaDrmClientPlugin.instance == None:
            KalturaDrmClientPlugin.instance = KalturaDrmClientPlugin()
        return KalturaDrmClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'drmPolicy': KalturaDrmPolicyService,
            'drmProfile': KalturaDrmProfileService,
            'drmLicenseAccess': KalturaDrmLicenseAccessService,
        }

    def getEnums(self):
        return {
            'KalturaDrmLicenseExpirationPolicy': KalturaDrmLicenseExpirationPolicy,
            'KalturaDrmPolicyStatus': KalturaDrmPolicyStatus,
            'KalturaDrmProfileStatus': KalturaDrmProfileStatus,
            'KalturaDrmDeviceOrderBy': KalturaDrmDeviceOrderBy,
            'KalturaDrmLicenseScenario': KalturaDrmLicenseScenario,
            'KalturaDrmLicenseType': KalturaDrmLicenseType,
            'KalturaDrmPolicyOrderBy': KalturaDrmPolicyOrderBy,
            'KalturaDrmProfileOrderBy': KalturaDrmProfileOrderBy,
            'KalturaDrmProviderType': KalturaDrmProviderType,
        }

    def getTypes(self):
        return {
            'KalturaDrmLicenseAccessDetails': KalturaDrmLicenseAccessDetails,
            'KalturaDrmPolicy': KalturaDrmPolicy,
            'KalturaDrmProfile': KalturaDrmProfile,
            'KalturaAccessControlDrmPolicyAction': KalturaAccessControlDrmPolicyAction,
            'KalturaDrmDeviceBaseFilter': KalturaDrmDeviceBaseFilter,
            'KalturaDrmPolicyBaseFilter': KalturaDrmPolicyBaseFilter,
            'KalturaDrmPolicyListResponse': KalturaDrmPolicyListResponse,
            'KalturaDrmProfileBaseFilter': KalturaDrmProfileBaseFilter,
            'KalturaDrmProfileListResponse': KalturaDrmProfileListResponse,
            'KalturaDrmDeviceFilter': KalturaDrmDeviceFilter,
            'KalturaDrmPolicyFilter': KalturaDrmPolicyFilter,
            'KalturaDrmProfileFilter': KalturaDrmProfileFilter,
        }

    # @return string
    def getName(self):
        return 'drm'

