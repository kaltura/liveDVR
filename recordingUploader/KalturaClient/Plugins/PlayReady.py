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
class KalturaPlayReadyAnalogVideoOPL(object):
    MIN_100 = 100
    MIN_150 = 150
    MIN_200 = 200

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaPlayReadyCompressedDigitalVideoOPL(object):
    MIN_400 = 400
    MIN_500 = 500

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaPlayReadyDigitalAudioOPL(object):
    MIN_100 = 100
    MIN_150 = 150
    MIN_200 = 200
    MIN_250 = 250
    MIN_300 = 300

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaPlayReadyLicenseRemovalPolicy(object):
    FIXED_FROM_EXPIRATION = 1
    ENTRY_SCHEDULING_END = 2
    NONE = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaPlayReadyMinimumLicenseSecurityLevel(object):
    NON_COMMERCIAL_QUALITY = 150
    COMMERCIAL_QUALITY = 2000

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaPlayReadyUncompressedDigitalVideoOPL(object):
    MIN_100 = 100
    MIN_250 = 250
    MIN_270 = 270
    MIN_300 = 300

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaPlayReadyAnalogVideoOPId(object):
    EXPLICIT_ANALOG_TV = "2098DE8D-7DDD-4BAB-96C6-32EBB6FABEA3"
    BEST_EFFORT_EXPLICIT_ANALOG_TV = "225CD36F-F132-49EF-BA8C-C91EA28E4369"
    IMAGE_CONSTRAINT_VIDEO = "811C5110-46C8-4C6E-8163-C0482A15D47E"
    AGC_AND_COLOR_STRIPE = "C3FD11C6-F8B7-4D20-B008-1DB17D61F2DA"
    IMAGE_CONSTRAINT_MONITOR = "D783A191-E083-4BAF-B2DA-E69F910B3772"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaPlayReadyCopyEnablerType(object):
    CSS = "3CAF2814-A7AB-467C-B4DF-54ACC56C66DC"
    PRINTER = "3CF2E054-F4D5-46cd-85A6-FCD152AD5FBE"
    DEVICE = "6848955D-516B-4EB0-90E8-8F6D5A77B85F"
    CLIPBOARD = "6E76C588-C3A9-47ea-A875-546D5209FF38"
    SDC = "79F78A0D-0B69-401e-8A90-8BEF30BCE192"
    SDC_PREVIEW = "81BD9AD4-A720-4ea1-B510-5D4E6FFB6A4D"
    AACS = "C3CF56E0-7FF2-4491-809F-53E21D3ABF07"
    HELIX = "CCB0B4E3-8B46-409e-A998-82556E3F5AF4"
    CPRM = "CDD801AD-A577-48DB-950E-46D5F1592FAE"
    PC = "CE480EDE-516B-40B3-90E1-D6CFC47630C5"
    SDC_LIMITED = "E6785609-64CC-4bfa-B82D-6B619733B746"
    ORANGE_BOOK_CD = "EC930B7D-1F2D-4682-A38B-8AB977721D0D"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaPlayReadyDigitalAudioOPId(object):
    SCMS = "6D5CFA59-C250-4426-930E-FAC72C8FCFA6"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaPlayReadyPlayEnablerType(object):
    HELIX = "002F9772-38A0-43E5-9F79-0F6361DCC62A"
    HDCP_WIVU = "1B4542E3-B5CF-4C99-B3BA-829AF46C92F8"
    AIRPLAY = "5ABF0F0D-DC29-4B82-9982-FD8E57525BFC"
    UNKNOWN = "786627D8-C2A6-44BE-8F88-08AE255B01A"
    HDCP_MIRACAST = "A340C256-0941-4D4C-AD1D-0B6735C0CB24"
    UNKNOWN_520 = "B621D91F-EDCC-4035-8D4B-DC71760D43E9"
    DTCP = "D685030B-0F4F-43A6-BBAD-356F1EA0049A"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaPlayReadyPolicyOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaPlayReadyProfileOrderBy(object):
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
class KalturaPlayReadyAnalogVideoOPIdHolder(KalturaObjectBase):
    def __init__(self,
            type=NotImplemented):
        KalturaObjectBase.__init__(self)

        # The type of the play enabler
        # @var KalturaPlayReadyAnalogVideoOPId
        self.type = type


    PROPERTY_LOADERS = {
        'type': (KalturaEnumsFactory.createString, "KalturaPlayReadyAnalogVideoOPId"), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPlayReadyAnalogVideoOPIdHolder.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaPlayReadyAnalogVideoOPIdHolder")
        kparams.addStringEnumIfDefined("type", self.type)
        return kparams

    def getType(self):
        return self.type

    def setType(self, newType):
        self.type = newType


# @package Kaltura
# @subpackage Client
class KalturaPlayReadyContentKey(KalturaObjectBase):
    def __init__(self,
            keyId=NotImplemented,
            contentKey=NotImplemented):
        KalturaObjectBase.__init__(self)

        # Guid - key id of the specific content
        # @var string
        self.keyId = keyId

        # License content key 64 bit encoded
        # @var string
        self.contentKey = contentKey


    PROPERTY_LOADERS = {
        'keyId': getXmlNodeText, 
        'contentKey': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPlayReadyContentKey.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaPlayReadyContentKey")
        kparams.addStringIfDefined("keyId", self.keyId)
        kparams.addStringIfDefined("contentKey", self.contentKey)
        return kparams

    def getKeyId(self):
        return self.keyId

    def setKeyId(self, newKeyId):
        self.keyId = newKeyId

    def getContentKey(self):
        return self.contentKey

    def setContentKey(self, newContentKey):
        self.contentKey = newContentKey


# @package Kaltura
# @subpackage Client
class KalturaPlayReadyCopyEnablerHolder(KalturaObjectBase):
    def __init__(self,
            type=NotImplemented):
        KalturaObjectBase.__init__(self)

        # The type of the copy enabler
        # @var KalturaPlayReadyCopyEnablerType
        self.type = type


    PROPERTY_LOADERS = {
        'type': (KalturaEnumsFactory.createString, "KalturaPlayReadyCopyEnablerType"), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPlayReadyCopyEnablerHolder.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaPlayReadyCopyEnablerHolder")
        kparams.addStringEnumIfDefined("type", self.type)
        return kparams

    def getType(self):
        return self.type

    def setType(self, newType):
        self.type = newType


# @package Kaltura
# @subpackage Client
class KalturaPlayReadyDigitalAudioOPIdHolder(KalturaObjectBase):
    def __init__(self,
            type=NotImplemented):
        KalturaObjectBase.__init__(self)

        # The type of the play enabler
        # @var KalturaPlayReadyDigitalAudioOPId
        self.type = type


    PROPERTY_LOADERS = {
        'type': (KalturaEnumsFactory.createString, "KalturaPlayReadyDigitalAudioOPId"), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPlayReadyDigitalAudioOPIdHolder.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaPlayReadyDigitalAudioOPIdHolder")
        kparams.addStringEnumIfDefined("type", self.type)
        return kparams

    def getType(self):
        return self.type

    def setType(self, newType):
        self.type = newType


# @package Kaltura
# @subpackage Client
class KalturaPlayReadyRight(KalturaObjectBase):
    def __init__(self):
        KalturaObjectBase.__init__(self)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPlayReadyRight.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaPlayReadyRight")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaPlayReadyPolicy(KalturaDrmPolicy):
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
            updatedAt=NotImplemented,
            gracePeriod=NotImplemented,
            licenseRemovalPolicy=NotImplemented,
            licenseRemovalDuration=NotImplemented,
            minSecurityLevel=NotImplemented,
            rights=NotImplemented):
        KalturaDrmPolicy.__init__(self,
            id,
            partnerId,
            name,
            systemName,
            description,
            provider,
            status,
            scenario,
            licenseType,
            licenseExpirationPolicy,
            duration,
            createdAt,
            updatedAt)

        # @var int
        self.gracePeriod = gracePeriod

        # @var KalturaPlayReadyLicenseRemovalPolicy
        self.licenseRemovalPolicy = licenseRemovalPolicy

        # @var int
        self.licenseRemovalDuration = licenseRemovalDuration

        # @var KalturaPlayReadyMinimumLicenseSecurityLevel
        self.minSecurityLevel = minSecurityLevel

        # @var array of KalturaPlayReadyRight
        self.rights = rights


    PROPERTY_LOADERS = {
        'gracePeriod': getXmlNodeInt, 
        'licenseRemovalPolicy': (KalturaEnumsFactory.createInt, "KalturaPlayReadyLicenseRemovalPolicy"), 
        'licenseRemovalDuration': getXmlNodeInt, 
        'minSecurityLevel': (KalturaEnumsFactory.createInt, "KalturaPlayReadyMinimumLicenseSecurityLevel"), 
        'rights': (KalturaObjectFactory.createArray, KalturaPlayReadyRight), 
    }

    def fromXml(self, node):
        KalturaDrmPolicy.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPlayReadyPolicy.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDrmPolicy.toParams(self)
        kparams.put("objectType", "KalturaPlayReadyPolicy")
        kparams.addIntIfDefined("gracePeriod", self.gracePeriod)
        kparams.addIntEnumIfDefined("licenseRemovalPolicy", self.licenseRemovalPolicy)
        kparams.addIntIfDefined("licenseRemovalDuration", self.licenseRemovalDuration)
        kparams.addIntEnumIfDefined("minSecurityLevel", self.minSecurityLevel)
        kparams.addArrayIfDefined("rights", self.rights)
        return kparams

    def getGracePeriod(self):
        return self.gracePeriod

    def setGracePeriod(self, newGracePeriod):
        self.gracePeriod = newGracePeriod

    def getLicenseRemovalPolicy(self):
        return self.licenseRemovalPolicy

    def setLicenseRemovalPolicy(self, newLicenseRemovalPolicy):
        self.licenseRemovalPolicy = newLicenseRemovalPolicy

    def getLicenseRemovalDuration(self):
        return self.licenseRemovalDuration

    def setLicenseRemovalDuration(self, newLicenseRemovalDuration):
        self.licenseRemovalDuration = newLicenseRemovalDuration

    def getMinSecurityLevel(self):
        return self.minSecurityLevel

    def setMinSecurityLevel(self, newMinSecurityLevel):
        self.minSecurityLevel = newMinSecurityLevel

    def getRights(self):
        return self.rights

    def setRights(self, newRights):
        self.rights = newRights


# @package Kaltura
# @subpackage Client
class KalturaPlayReadyLicenseDetails(KalturaObjectBase):
    def __init__(self,
            policy=NotImplemented,
            beginDate=NotImplemented,
            expirationDate=NotImplemented,
            removalDate=NotImplemented):
        KalturaObjectBase.__init__(self)

        # PlayReady policy object
        # @var KalturaPlayReadyPolicy
        self.policy = policy

        # License begin date
        # @var int
        self.beginDate = beginDate

        # License expiration date
        # @var int
        self.expirationDate = expirationDate

        # License removal date
        # @var int
        self.removalDate = removalDate


    PROPERTY_LOADERS = {
        'policy': (KalturaObjectFactory.create, KalturaPlayReadyPolicy), 
        'beginDate': getXmlNodeInt, 
        'expirationDate': getXmlNodeInt, 
        'removalDate': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPlayReadyLicenseDetails.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaPlayReadyLicenseDetails")
        kparams.addObjectIfDefined("policy", self.policy)
        kparams.addIntIfDefined("beginDate", self.beginDate)
        kparams.addIntIfDefined("expirationDate", self.expirationDate)
        kparams.addIntIfDefined("removalDate", self.removalDate)
        return kparams

    def getPolicy(self):
        return self.policy

    def setPolicy(self, newPolicy):
        self.policy = newPolicy

    def getBeginDate(self):
        return self.beginDate

    def setBeginDate(self, newBeginDate):
        self.beginDate = newBeginDate

    def getExpirationDate(self):
        return self.expirationDate

    def setExpirationDate(self, newExpirationDate):
        self.expirationDate = newExpirationDate

    def getRemovalDate(self):
        return self.removalDate

    def setRemovalDate(self, newRemovalDate):
        self.removalDate = newRemovalDate


# @package Kaltura
# @subpackage Client
class KalturaPlayReadyPlayEnablerHolder(KalturaObjectBase):
    def __init__(self,
            type=NotImplemented):
        KalturaObjectBase.__init__(self)

        # The type of the play enabler
        # @var KalturaPlayReadyPlayEnablerType
        self.type = type


    PROPERTY_LOADERS = {
        'type': (KalturaEnumsFactory.createString, "KalturaPlayReadyPlayEnablerType"), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPlayReadyPlayEnablerHolder.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaPlayReadyPlayEnablerHolder")
        kparams.addStringEnumIfDefined("type", self.type)
        return kparams

    def getType(self):
        return self.type

    def setType(self, newType):
        self.type = newType


# @package Kaltura
# @subpackage Client
class KalturaPlayReadyCopyRight(KalturaPlayReadyRight):
    def __init__(self,
            copyCount=NotImplemented,
            copyEnablers=NotImplemented):
        KalturaPlayReadyRight.__init__(self)

        # @var int
        self.copyCount = copyCount

        # @var array of KalturaPlayReadyCopyEnablerHolder
        self.copyEnablers = copyEnablers


    PROPERTY_LOADERS = {
        'copyCount': getXmlNodeInt, 
        'copyEnablers': (KalturaObjectFactory.createArray, KalturaPlayReadyCopyEnablerHolder), 
    }

    def fromXml(self, node):
        KalturaPlayReadyRight.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPlayReadyCopyRight.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaPlayReadyRight.toParams(self)
        kparams.put("objectType", "KalturaPlayReadyCopyRight")
        kparams.addIntIfDefined("copyCount", self.copyCount)
        kparams.addArrayIfDefined("copyEnablers", self.copyEnablers)
        return kparams

    def getCopyCount(self):
        return self.copyCount

    def setCopyCount(self, newCopyCount):
        self.copyCount = newCopyCount

    def getCopyEnablers(self):
        return self.copyEnablers

    def setCopyEnablers(self, newCopyEnablers):
        self.copyEnablers = newCopyEnablers


# @package Kaltura
# @subpackage Client
class KalturaPlayReadyPlayRight(KalturaPlayReadyRight):
    def __init__(self,
            analogVideoOPL=NotImplemented,
            analogVideoOutputProtectionList=NotImplemented,
            compressedDigitalAudioOPL=NotImplemented,
            compressedDigitalVideoOPL=NotImplemented,
            digitalAudioOutputProtectionList=NotImplemented,
            uncompressedDigitalAudioOPL=NotImplemented,
            uncompressedDigitalVideoOPL=NotImplemented,
            firstPlayExpiration=NotImplemented,
            playEnablers=NotImplemented):
        KalturaPlayReadyRight.__init__(self)

        # @var KalturaPlayReadyAnalogVideoOPL
        self.analogVideoOPL = analogVideoOPL

        # @var array of KalturaPlayReadyAnalogVideoOPIdHolder
        self.analogVideoOutputProtectionList = analogVideoOutputProtectionList

        # @var KalturaPlayReadyDigitalAudioOPL
        self.compressedDigitalAudioOPL = compressedDigitalAudioOPL

        # @var KalturaPlayReadyCompressedDigitalVideoOPL
        self.compressedDigitalVideoOPL = compressedDigitalVideoOPL

        # @var array of KalturaPlayReadyDigitalAudioOPIdHolder
        self.digitalAudioOutputProtectionList = digitalAudioOutputProtectionList

        # @var KalturaPlayReadyDigitalAudioOPL
        self.uncompressedDigitalAudioOPL = uncompressedDigitalAudioOPL

        # @var KalturaPlayReadyUncompressedDigitalVideoOPL
        self.uncompressedDigitalVideoOPL = uncompressedDigitalVideoOPL

        # @var int
        self.firstPlayExpiration = firstPlayExpiration

        # @var array of KalturaPlayReadyPlayEnablerHolder
        self.playEnablers = playEnablers


    PROPERTY_LOADERS = {
        'analogVideoOPL': (KalturaEnumsFactory.createInt, "KalturaPlayReadyAnalogVideoOPL"), 
        'analogVideoOutputProtectionList': (KalturaObjectFactory.createArray, KalturaPlayReadyAnalogVideoOPIdHolder), 
        'compressedDigitalAudioOPL': (KalturaEnumsFactory.createInt, "KalturaPlayReadyDigitalAudioOPL"), 
        'compressedDigitalVideoOPL': (KalturaEnumsFactory.createInt, "KalturaPlayReadyCompressedDigitalVideoOPL"), 
        'digitalAudioOutputProtectionList': (KalturaObjectFactory.createArray, KalturaPlayReadyDigitalAudioOPIdHolder), 
        'uncompressedDigitalAudioOPL': (KalturaEnumsFactory.createInt, "KalturaPlayReadyDigitalAudioOPL"), 
        'uncompressedDigitalVideoOPL': (KalturaEnumsFactory.createInt, "KalturaPlayReadyUncompressedDigitalVideoOPL"), 
        'firstPlayExpiration': getXmlNodeInt, 
        'playEnablers': (KalturaObjectFactory.createArray, KalturaPlayReadyPlayEnablerHolder), 
    }

    def fromXml(self, node):
        KalturaPlayReadyRight.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPlayReadyPlayRight.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaPlayReadyRight.toParams(self)
        kparams.put("objectType", "KalturaPlayReadyPlayRight")
        kparams.addIntEnumIfDefined("analogVideoOPL", self.analogVideoOPL)
        kparams.addArrayIfDefined("analogVideoOutputProtectionList", self.analogVideoOutputProtectionList)
        kparams.addIntEnumIfDefined("compressedDigitalAudioOPL", self.compressedDigitalAudioOPL)
        kparams.addIntEnumIfDefined("compressedDigitalVideoOPL", self.compressedDigitalVideoOPL)
        kparams.addArrayIfDefined("digitalAudioOutputProtectionList", self.digitalAudioOutputProtectionList)
        kparams.addIntEnumIfDefined("uncompressedDigitalAudioOPL", self.uncompressedDigitalAudioOPL)
        kparams.addIntEnumIfDefined("uncompressedDigitalVideoOPL", self.uncompressedDigitalVideoOPL)
        kparams.addIntIfDefined("firstPlayExpiration", self.firstPlayExpiration)
        kparams.addArrayIfDefined("playEnablers", self.playEnablers)
        return kparams

    def getAnalogVideoOPL(self):
        return self.analogVideoOPL

    def setAnalogVideoOPL(self, newAnalogVideoOPL):
        self.analogVideoOPL = newAnalogVideoOPL

    def getAnalogVideoOutputProtectionList(self):
        return self.analogVideoOutputProtectionList

    def setAnalogVideoOutputProtectionList(self, newAnalogVideoOutputProtectionList):
        self.analogVideoOutputProtectionList = newAnalogVideoOutputProtectionList

    def getCompressedDigitalAudioOPL(self):
        return self.compressedDigitalAudioOPL

    def setCompressedDigitalAudioOPL(self, newCompressedDigitalAudioOPL):
        self.compressedDigitalAudioOPL = newCompressedDigitalAudioOPL

    def getCompressedDigitalVideoOPL(self):
        return self.compressedDigitalVideoOPL

    def setCompressedDigitalVideoOPL(self, newCompressedDigitalVideoOPL):
        self.compressedDigitalVideoOPL = newCompressedDigitalVideoOPL

    def getDigitalAudioOutputProtectionList(self):
        return self.digitalAudioOutputProtectionList

    def setDigitalAudioOutputProtectionList(self, newDigitalAudioOutputProtectionList):
        self.digitalAudioOutputProtectionList = newDigitalAudioOutputProtectionList

    def getUncompressedDigitalAudioOPL(self):
        return self.uncompressedDigitalAudioOPL

    def setUncompressedDigitalAudioOPL(self, newUncompressedDigitalAudioOPL):
        self.uncompressedDigitalAudioOPL = newUncompressedDigitalAudioOPL

    def getUncompressedDigitalVideoOPL(self):
        return self.uncompressedDigitalVideoOPL

    def setUncompressedDigitalVideoOPL(self, newUncompressedDigitalVideoOPL):
        self.uncompressedDigitalVideoOPL = newUncompressedDigitalVideoOPL

    def getFirstPlayExpiration(self):
        return self.firstPlayExpiration

    def setFirstPlayExpiration(self, newFirstPlayExpiration):
        self.firstPlayExpiration = newFirstPlayExpiration

    def getPlayEnablers(self):
        return self.playEnablers

    def setPlayEnablers(self, newPlayEnablers):
        self.playEnablers = newPlayEnablers


# @package Kaltura
# @subpackage Client
class KalturaPlayReadyProfile(KalturaDrmProfile):
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
            keySeed=NotImplemented):
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
        self.keySeed = keySeed


    PROPERTY_LOADERS = {
        'keySeed': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDrmProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPlayReadyProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDrmProfile.toParams(self)
        kparams.put("objectType", "KalturaPlayReadyProfile")
        kparams.addStringIfDefined("keySeed", self.keySeed)
        return kparams

    def getKeySeed(self):
        return self.keySeed

    def setKeySeed(self, newKeySeed):
        self.keySeed = newKeySeed


# @package Kaltura
# @subpackage Client
class KalturaPlayReadyPolicyBaseFilter(KalturaDrmPolicyFilter):
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
        KalturaDrmPolicyFilter.__init__(self,
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
        KalturaDrmPolicyFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPlayReadyPolicyBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDrmPolicyFilter.toParams(self)
        kparams.put("objectType", "KalturaPlayReadyPolicyBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaPlayReadyProfileBaseFilter(KalturaDrmProfileFilter):
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
        self.fromXmlImpl(node, KalturaPlayReadyProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDrmProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaPlayReadyProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaPlayReadyPolicyFilter(KalturaPlayReadyPolicyBaseFilter):
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
        KalturaPlayReadyPolicyBaseFilter.__init__(self,
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
        KalturaPlayReadyPolicyBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPlayReadyPolicyFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaPlayReadyPolicyBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaPlayReadyPolicyFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaPlayReadyProfileFilter(KalturaPlayReadyProfileBaseFilter):
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
        KalturaPlayReadyProfileBaseFilter.__init__(self,
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
        KalturaPlayReadyProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaPlayReadyProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaPlayReadyProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaPlayReadyProfileFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaPlayReadyDrmService(KalturaServiceBase):
    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def generateKey(self):
        """Generate key id and content key for PlayReady encryption"""

        kparams = KalturaParams()
        self.client.queueServiceActionCall("playready_playreadydrm", "generateKey", KalturaPlayReadyContentKey, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaPlayReadyContentKey)

    def getContentKeys(self, keyIds):
        """Get content keys for input key ids"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("keyIds", keyIds)
        self.client.queueServiceActionCall("playready_playreadydrm", "getContentKeys", KalturaPlayReadyContentKey, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.createArray(resultNode, KalturaPlayReadyContentKey)

    def getEntryContentKey(self, entryId, createIfMissing = False):
        """Get content key and key id for the given entry"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        kparams.addBoolIfDefined("createIfMissing", createIfMissing);
        self.client.queueServiceActionCall("playready_playreadydrm", "getEntryContentKey", KalturaPlayReadyContentKey, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaPlayReadyContentKey)

    def getLicenseDetails(self, keyId, deviceId, deviceType, entryId = NotImplemented, referrer = NotImplemented):
        """Get Play Ready policy and dates for license creation"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("keyId", keyId)
        kparams.addStringIfDefined("deviceId", deviceId)
        kparams.addIntIfDefined("deviceType", deviceType);
        kparams.addStringIfDefined("entryId", entryId)
        kparams.addStringIfDefined("referrer", referrer)
        self.client.queueServiceActionCall("playready_playreadydrm", "getLicenseDetails", KalturaPlayReadyLicenseDetails, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaPlayReadyLicenseDetails)

########## main ##########
class KalturaPlayReadyClientPlugin(KalturaClientPlugin):
    # KalturaPlayReadyClientPlugin
    instance = None

    # @return KalturaPlayReadyClientPlugin
    @staticmethod
    def get():
        if KalturaPlayReadyClientPlugin.instance == None:
            KalturaPlayReadyClientPlugin.instance = KalturaPlayReadyClientPlugin()
        return KalturaPlayReadyClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'playReadyDrm': KalturaPlayReadyDrmService,
        }

    def getEnums(self):
        return {
            'KalturaPlayReadyAnalogVideoOPL': KalturaPlayReadyAnalogVideoOPL,
            'KalturaPlayReadyCompressedDigitalVideoOPL': KalturaPlayReadyCompressedDigitalVideoOPL,
            'KalturaPlayReadyDigitalAudioOPL': KalturaPlayReadyDigitalAudioOPL,
            'KalturaPlayReadyLicenseRemovalPolicy': KalturaPlayReadyLicenseRemovalPolicy,
            'KalturaPlayReadyMinimumLicenseSecurityLevel': KalturaPlayReadyMinimumLicenseSecurityLevel,
            'KalturaPlayReadyUncompressedDigitalVideoOPL': KalturaPlayReadyUncompressedDigitalVideoOPL,
            'KalturaPlayReadyAnalogVideoOPId': KalturaPlayReadyAnalogVideoOPId,
            'KalturaPlayReadyCopyEnablerType': KalturaPlayReadyCopyEnablerType,
            'KalturaPlayReadyDigitalAudioOPId': KalturaPlayReadyDigitalAudioOPId,
            'KalturaPlayReadyPlayEnablerType': KalturaPlayReadyPlayEnablerType,
            'KalturaPlayReadyPolicyOrderBy': KalturaPlayReadyPolicyOrderBy,
            'KalturaPlayReadyProfileOrderBy': KalturaPlayReadyProfileOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaPlayReadyAnalogVideoOPIdHolder': KalturaPlayReadyAnalogVideoOPIdHolder,
            'KalturaPlayReadyContentKey': KalturaPlayReadyContentKey,
            'KalturaPlayReadyCopyEnablerHolder': KalturaPlayReadyCopyEnablerHolder,
            'KalturaPlayReadyDigitalAudioOPIdHolder': KalturaPlayReadyDigitalAudioOPIdHolder,
            'KalturaPlayReadyRight': KalturaPlayReadyRight,
            'KalturaPlayReadyPolicy': KalturaPlayReadyPolicy,
            'KalturaPlayReadyLicenseDetails': KalturaPlayReadyLicenseDetails,
            'KalturaPlayReadyPlayEnablerHolder': KalturaPlayReadyPlayEnablerHolder,
            'KalturaPlayReadyCopyRight': KalturaPlayReadyCopyRight,
            'KalturaPlayReadyPlayRight': KalturaPlayReadyPlayRight,
            'KalturaPlayReadyProfile': KalturaPlayReadyProfile,
            'KalturaPlayReadyPolicyBaseFilter': KalturaPlayReadyPolicyBaseFilter,
            'KalturaPlayReadyProfileBaseFilter': KalturaPlayReadyProfileBaseFilter,
            'KalturaPlayReadyPolicyFilter': KalturaPlayReadyPolicyFilter,
            'KalturaPlayReadyProfileFilter': KalturaPlayReadyProfileFilter,
        }

    # @return string
    def getName(self):
        return 'playReady'

