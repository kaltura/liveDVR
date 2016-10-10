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
from Metadata import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaDistributionAction(object):
    SUBMIT = 1
    UPDATE = 2
    DELETE = 3
    FETCH_REPORT = 4

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDistributionErrorType(object):
    MISSING_FLAVOR = 1
    MISSING_THUMBNAIL = 2
    MISSING_METADATA = 3
    INVALID_DATA = 4
    MISSING_ASSET = 5
    CONDITION_NOT_MET = 6

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDistributionFieldRequiredStatus(object):
    NOT_REQUIRED = 0
    REQUIRED_BY_PROVIDER = 1
    REQUIRED_BY_PARTNER = 2
    REQUIRED_FOR_AUTOMATIC_DISTRIBUTION = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDistributionProfileActionStatus(object):
    DISABLED = 1
    AUTOMATIC = 2
    MANUAL = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDistributionProfileStatus(object):
    DISABLED = 1
    ENABLED = 2
    DELETED = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDistributionProtocol(object):
    FTP = 1
    SCP = 2
    SFTP = 3
    HTTP = 4
    HTTPS = 5
    ASPERA = 10

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDistributionValidationErrorType(object):
    CUSTOM_ERROR = 0
    STRING_EMPTY = 1
    STRING_TOO_LONG = 2
    STRING_TOO_SHORT = 3
    INVALID_FORMAT = 4

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaEntryDistributionFlag(object):
    NONE = 0
    SUBMIT_REQUIRED = 1
    DELETE_REQUIRED = 2
    UPDATE_REQUIRED = 3
    ENABLE_REQUIRED = 4
    DISABLE_REQUIRED = 5

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaEntryDistributionStatus(object):
    PENDING = 0
    QUEUED = 1
    READY = 2
    DELETED = 3
    SUBMITTING = 4
    UPDATING = 5
    DELETING = 6
    ERROR_SUBMITTING = 7
    ERROR_UPDATING = 8
    ERROR_DELETING = 9
    REMOVED = 10
    IMPORT_SUBMITTING = 11
    IMPORT_UPDATING = 12

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaEntryDistributionSunStatus(object):
    BEFORE_SUNRISE = 1
    AFTER_SUNRISE = 2
    AFTER_SUNSET = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProviderParser(object):
    XSL = 1
    XPATH = 2
    REGEX = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProviderStatus(object):
    ACTIVE = 2
    DELETED = 3

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaConfigurableDistributionProfileOrderBy(object):
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
class KalturaDistributionProfileOrderBy(object):
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
class KalturaDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaDistributionProviderType(object):
    ATT_UVERSE = "attUverseDistribution.ATT_UVERSE"
    AVN = "avnDistribution.AVN"
    COMCAST_MRSS = "comcastMrssDistribution.COMCAST_MRSS"
    CROSS_KALTURA = "crossKalturaDistribution.CROSS_KALTURA"
    DAILYMOTION = "dailymotionDistribution.DAILYMOTION"
    DOUBLECLICK = "doubleClickDistribution.DOUBLECLICK"
    FACEBOOK = "facebookDistribution.FACEBOOK"
    FREEWHEEL = "freewheelDistribution.FREEWHEEL"
    FREEWHEEL_GENERIC = "freewheelGenericDistribution.FREEWHEEL_GENERIC"
    FTP = "ftpDistribution.FTP"
    FTP_SCHEDULED = "ftpDistribution.FTP_SCHEDULED"
    HULU = "huluDistribution.HULU"
    IDETIC = "ideticDistribution.IDETIC"
    METRO_PCS = "metroPcsDistribution.METRO_PCS"
    MSN = "msnDistribution.MSN"
    NDN = "ndnDistribution.NDN"
    PODCAST = "podcastDistribution.PODCAST"
    QUICKPLAY = "quickPlayDistribution.QUICKPLAY"
    SYNACOR_HBO = "synacorHboDistribution.SYNACOR_HBO"
    TIME_WARNER = "timeWarnerDistribution.TIME_WARNER"
    TVCOM = "tvComDistribution.TVCOM"
    TVINCI = "tvinciDistribution.TVINCI"
    UNICORN = "unicornDistribution.UNICORN"
    UVERSE_CLICK_TO_ORDER = "uverseClickToOrderDistribution.UVERSE_CLICK_TO_ORDER"
    UVERSE = "uverseDistribution.UVERSE"
    VERIZON_VCAST = "verizonVcastDistribution.VERIZON_VCAST"
    YAHOO = "yahooDistribution.YAHOO"
    YOUTUBE = "youTubeDistribution.YOUTUBE"
    YOUTUBE_API = "youtubeApiDistribution.YOUTUBE_API"
    GENERIC = "1"
    SYNDICATION = "2"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaEntryDistributionOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    SUBMITTED_AT_ASC = "+submittedAt"
    SUNRISE_ASC = "+sunrise"
    SUNSET_ASC = "+sunset"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    SUBMITTED_AT_DESC = "-submittedAt"
    SUNRISE_DESC = "-sunrise"
    SUNSET_DESC = "-sunset"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProfileOrderBy(object):
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
class KalturaGenericDistributionProviderActionOrderBy(object):
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
class KalturaGenericDistributionProviderOrderBy(object):
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
class KalturaSyndicationDistributionProfileOrderBy(object):
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
class KalturaSyndicationDistributionProviderOrderBy(object):

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaAssetDistributionCondition(KalturaObjectBase):
    """Abstract class for asset distribution condition"""

    def __init__(self):
        KalturaObjectBase.__init__(self)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAssetDistributionCondition.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaAssetDistributionCondition")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaAssetDistributionRule(KalturaObjectBase):
    def __init__(self,
            validationError=NotImplemented,
            assetDistributionConditions=NotImplemented):
        KalturaObjectBase.__init__(self)

        # The validation error description that will be set on the "data" property on KalturaDistributionValidationErrorMissingAsset if rule was not fulfilled
        # @var string
        self.validationError = validationError

        # An array of asset distribution conditions
        # @var array of KalturaAssetDistributionCondition
        self.assetDistributionConditions = assetDistributionConditions


    PROPERTY_LOADERS = {
        'validationError': getXmlNodeText, 
        'assetDistributionConditions': (KalturaObjectFactory.createArray, KalturaAssetDistributionCondition), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAssetDistributionRule.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaAssetDistributionRule")
        kparams.addStringIfDefined("validationError", self.validationError)
        kparams.addArrayIfDefined("assetDistributionConditions", self.assetDistributionConditions)
        return kparams

    def getValidationError(self):
        return self.validationError

    def setValidationError(self, newValidationError):
        self.validationError = newValidationError

    def getAssetDistributionConditions(self):
        return self.assetDistributionConditions

    def setAssetDistributionConditions(self, newAssetDistributionConditions):
        self.assetDistributionConditions = newAssetDistributionConditions


# @package Kaltura
# @subpackage Client
class KalturaDistributionFieldConfig(KalturaObjectBase):
    def __init__(self,
            fieldName=NotImplemented,
            userFriendlyFieldName=NotImplemented,
            entryMrssXslt=NotImplemented,
            isRequired=NotImplemented,
            updateOnChange=NotImplemented,
            updateParams=NotImplemented,
            isDefault=NotImplemented,
            triggerDeleteOnError=NotImplemented):
        KalturaObjectBase.__init__(self)

        # A value taken from a connector field enum which associates the current configuration to that connector field
        #      Field enum class should be returned by the provider's getFieldEnumClass function.
        # @var string
        self.fieldName = fieldName

        # A string that will be shown to the user as the field name in error messages related to the current field
        # @var string
        self.userFriendlyFieldName = userFriendlyFieldName

        # An XSLT string that extracts the right value from the Kaltura entry MRSS XML.
        #      The value of the current connector field will be the one that is returned from transforming the Kaltura entry MRSS XML using this XSLT string.
        # @var string
        self.entryMrssXslt = entryMrssXslt

        # Is the field required to have a value for submission ?
        # @var KalturaDistributionFieldRequiredStatus
        self.isRequired = isRequired

        # Trigger distribution update when this field changes or not ?
        # @var bool
        self.updateOnChange = updateOnChange

        # Entry column or metadata xpath that should trigger an update
        # @var array of KalturaString
        self.updateParams = updateParams

        # Is this field config is the default for the distribution provider?
        # @var bool
        # @readonly
        self.isDefault = isDefault

        # Is an error on this field going to trigger deletion of distributed content?
        # @var bool
        self.triggerDeleteOnError = triggerDeleteOnError


    PROPERTY_LOADERS = {
        'fieldName': getXmlNodeText, 
        'userFriendlyFieldName': getXmlNodeText, 
        'entryMrssXslt': getXmlNodeText, 
        'isRequired': (KalturaEnumsFactory.createInt, "KalturaDistributionFieldRequiredStatus"), 
        'updateOnChange': getXmlNodeBool, 
        'updateParams': (KalturaObjectFactory.createArray, KalturaString), 
        'isDefault': getXmlNodeBool, 
        'triggerDeleteOnError': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionFieldConfig.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaDistributionFieldConfig")
        kparams.addStringIfDefined("fieldName", self.fieldName)
        kparams.addStringIfDefined("userFriendlyFieldName", self.userFriendlyFieldName)
        kparams.addStringIfDefined("entryMrssXslt", self.entryMrssXslt)
        kparams.addIntEnumIfDefined("isRequired", self.isRequired)
        kparams.addBoolIfDefined("updateOnChange", self.updateOnChange)
        kparams.addArrayIfDefined("updateParams", self.updateParams)
        kparams.addBoolIfDefined("triggerDeleteOnError", self.triggerDeleteOnError)
        return kparams

    def getFieldName(self):
        return self.fieldName

    def setFieldName(self, newFieldName):
        self.fieldName = newFieldName

    def getUserFriendlyFieldName(self):
        return self.userFriendlyFieldName

    def setUserFriendlyFieldName(self, newUserFriendlyFieldName):
        self.userFriendlyFieldName = newUserFriendlyFieldName

    def getEntryMrssXslt(self):
        return self.entryMrssXslt

    def setEntryMrssXslt(self, newEntryMrssXslt):
        self.entryMrssXslt = newEntryMrssXslt

    def getIsRequired(self):
        return self.isRequired

    def setIsRequired(self, newIsRequired):
        self.isRequired = newIsRequired

    def getUpdateOnChange(self):
        return self.updateOnChange

    def setUpdateOnChange(self, newUpdateOnChange):
        self.updateOnChange = newUpdateOnChange

    def getUpdateParams(self):
        return self.updateParams

    def setUpdateParams(self, newUpdateParams):
        self.updateParams = newUpdateParams

    def getIsDefault(self):
        return self.isDefault

    def getTriggerDeleteOnError(self):
        return self.triggerDeleteOnError

    def setTriggerDeleteOnError(self, newTriggerDeleteOnError):
        self.triggerDeleteOnError = newTriggerDeleteOnError


# @package Kaltura
# @subpackage Client
class KalturaDistributionJobProviderData(KalturaObjectBase):
    def __init__(self):
        KalturaObjectBase.__init__(self)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaDistributionJobProviderData")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDistributionThumbDimensions(KalturaObjectBase):
    def __init__(self,
            width=NotImplemented,
            height=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var int
        self.width = width

        # @var int
        self.height = height


    PROPERTY_LOADERS = {
        'width': getXmlNodeInt, 
        'height': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionThumbDimensions.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaDistributionThumbDimensions")
        kparams.addIntIfDefined("width", self.width)
        kparams.addIntIfDefined("height", self.height)
        return kparams

    def getWidth(self):
        return self.width

    def setWidth(self, newWidth):
        self.width = newWidth

    def getHeight(self):
        return self.height

    def setHeight(self, newHeight):
        self.height = newHeight


# @package Kaltura
# @subpackage Client
class KalturaDistributionProfile(KalturaObjectBase):
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
            recommendedDcForExecute=NotImplemented):
        KalturaObjectBase.__init__(self)

        # Auto generated unique id
        # @var int
        # @readonly
        self.id = id

        # Profile creation date as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.createdAt = createdAt

        # Profile last update date as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.updatedAt = updatedAt

        # @var int
        # @readonly
        self.partnerId = partnerId

        # @var KalturaDistributionProviderType
        # @insertonly
        self.providerType = providerType

        # @var string
        self.name = name

        # @var KalturaDistributionProfileStatus
        self.status = status

        # @var KalturaDistributionProfileActionStatus
        self.submitEnabled = submitEnabled

        # @var KalturaDistributionProfileActionStatus
        self.updateEnabled = updateEnabled

        # @var KalturaDistributionProfileActionStatus
        self.deleteEnabled = deleteEnabled

        # @var KalturaDistributionProfileActionStatus
        self.reportEnabled = reportEnabled

        # Comma separated flavor params ids that should be auto converted
        # @var string
        self.autoCreateFlavors = autoCreateFlavors

        # Comma separated thumbnail params ids that should be auto generated
        # @var string
        self.autoCreateThumb = autoCreateThumb

        # Comma separated flavor params ids that should be submitted if ready
        # @var string
        self.optionalFlavorParamsIds = optionalFlavorParamsIds

        # Comma separated flavor params ids that required to be ready before submission
        # @var string
        self.requiredFlavorParamsIds = requiredFlavorParamsIds

        # Thumbnail dimensions that should be submitted if ready
        # @var array of KalturaDistributionThumbDimensions
        self.optionalThumbDimensions = optionalThumbDimensions

        # Thumbnail dimensions that required to be readt before submission
        # @var array of KalturaDistributionThumbDimensions
        self.requiredThumbDimensions = requiredThumbDimensions

        # Asset Distribution Rules for assets that should be submitted if ready
        # @var array of KalturaAssetDistributionRule
        self.optionalAssetDistributionRules = optionalAssetDistributionRules

        # Assets Asset Distribution Rules for assets that are required to be ready before submission
        # @var array of KalturaAssetDistributionRule
        self.requiredAssetDistributionRules = requiredAssetDistributionRules

        # If entry distribution sunrise not specified that will be the default since entry creation time, in seconds
        # @var int
        self.sunriseDefaultOffset = sunriseDefaultOffset

        # If entry distribution sunset not specified that will be the default since entry creation time, in seconds
        # @var int
        self.sunsetDefaultOffset = sunsetDefaultOffset

        # The best external storage to be used to download the asset files from
        # @var int
        self.recommendedStorageProfileForDownload = recommendedStorageProfileForDownload

        # The best Kaltura data center to be used to download the asset files to
        # @var int
        self.recommendedDcForDownload = recommendedDcForDownload

        # The best Kaltura data center to be used to execute the distribution job
        # @var int
        self.recommendedDcForExecute = recommendedDcForExecute


    PROPERTY_LOADERS = {
        'id': getXmlNodeInt, 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
        'partnerId': getXmlNodeInt, 
        'providerType': (KalturaEnumsFactory.createString, "KalturaDistributionProviderType"), 
        'name': getXmlNodeText, 
        'status': (KalturaEnumsFactory.createInt, "KalturaDistributionProfileStatus"), 
        'submitEnabled': (KalturaEnumsFactory.createInt, "KalturaDistributionProfileActionStatus"), 
        'updateEnabled': (KalturaEnumsFactory.createInt, "KalturaDistributionProfileActionStatus"), 
        'deleteEnabled': (KalturaEnumsFactory.createInt, "KalturaDistributionProfileActionStatus"), 
        'reportEnabled': (KalturaEnumsFactory.createInt, "KalturaDistributionProfileActionStatus"), 
        'autoCreateFlavors': getXmlNodeText, 
        'autoCreateThumb': getXmlNodeText, 
        'optionalFlavorParamsIds': getXmlNodeText, 
        'requiredFlavorParamsIds': getXmlNodeText, 
        'optionalThumbDimensions': (KalturaObjectFactory.createArray, KalturaDistributionThumbDimensions), 
        'requiredThumbDimensions': (KalturaObjectFactory.createArray, KalturaDistributionThumbDimensions), 
        'optionalAssetDistributionRules': (KalturaObjectFactory.createArray, KalturaAssetDistributionRule), 
        'requiredAssetDistributionRules': (KalturaObjectFactory.createArray, KalturaAssetDistributionRule), 
        'sunriseDefaultOffset': getXmlNodeInt, 
        'sunsetDefaultOffset': getXmlNodeInt, 
        'recommendedStorageProfileForDownload': getXmlNodeInt, 
        'recommendedDcForDownload': getXmlNodeInt, 
        'recommendedDcForExecute': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaDistributionProfile")
        kparams.addStringEnumIfDefined("providerType", self.providerType)
        kparams.addStringIfDefined("name", self.name)
        kparams.addIntEnumIfDefined("status", self.status)
        kparams.addIntEnumIfDefined("submitEnabled", self.submitEnabled)
        kparams.addIntEnumIfDefined("updateEnabled", self.updateEnabled)
        kparams.addIntEnumIfDefined("deleteEnabled", self.deleteEnabled)
        kparams.addIntEnumIfDefined("reportEnabled", self.reportEnabled)
        kparams.addStringIfDefined("autoCreateFlavors", self.autoCreateFlavors)
        kparams.addStringIfDefined("autoCreateThumb", self.autoCreateThumb)
        kparams.addStringIfDefined("optionalFlavorParamsIds", self.optionalFlavorParamsIds)
        kparams.addStringIfDefined("requiredFlavorParamsIds", self.requiredFlavorParamsIds)
        kparams.addArrayIfDefined("optionalThumbDimensions", self.optionalThumbDimensions)
        kparams.addArrayIfDefined("requiredThumbDimensions", self.requiredThumbDimensions)
        kparams.addArrayIfDefined("optionalAssetDistributionRules", self.optionalAssetDistributionRules)
        kparams.addArrayIfDefined("requiredAssetDistributionRules", self.requiredAssetDistributionRules)
        kparams.addIntIfDefined("sunriseDefaultOffset", self.sunriseDefaultOffset)
        kparams.addIntIfDefined("sunsetDefaultOffset", self.sunsetDefaultOffset)
        kparams.addIntIfDefined("recommendedStorageProfileForDownload", self.recommendedStorageProfileForDownload)
        kparams.addIntIfDefined("recommendedDcForDownload", self.recommendedDcForDownload)
        kparams.addIntIfDefined("recommendedDcForExecute", self.recommendedDcForExecute)
        return kparams

    def getId(self):
        return self.id

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt

    def getPartnerId(self):
        return self.partnerId

    def getProviderType(self):
        return self.providerType

    def setProviderType(self, newProviderType):
        self.providerType = newProviderType

    def getName(self):
        return self.name

    def setName(self, newName):
        self.name = newName

    def getStatus(self):
        return self.status

    def setStatus(self, newStatus):
        self.status = newStatus

    def getSubmitEnabled(self):
        return self.submitEnabled

    def setSubmitEnabled(self, newSubmitEnabled):
        self.submitEnabled = newSubmitEnabled

    def getUpdateEnabled(self):
        return self.updateEnabled

    def setUpdateEnabled(self, newUpdateEnabled):
        self.updateEnabled = newUpdateEnabled

    def getDeleteEnabled(self):
        return self.deleteEnabled

    def setDeleteEnabled(self, newDeleteEnabled):
        self.deleteEnabled = newDeleteEnabled

    def getReportEnabled(self):
        return self.reportEnabled

    def setReportEnabled(self, newReportEnabled):
        self.reportEnabled = newReportEnabled

    def getAutoCreateFlavors(self):
        return self.autoCreateFlavors

    def setAutoCreateFlavors(self, newAutoCreateFlavors):
        self.autoCreateFlavors = newAutoCreateFlavors

    def getAutoCreateThumb(self):
        return self.autoCreateThumb

    def setAutoCreateThumb(self, newAutoCreateThumb):
        self.autoCreateThumb = newAutoCreateThumb

    def getOptionalFlavorParamsIds(self):
        return self.optionalFlavorParamsIds

    def setOptionalFlavorParamsIds(self, newOptionalFlavorParamsIds):
        self.optionalFlavorParamsIds = newOptionalFlavorParamsIds

    def getRequiredFlavorParamsIds(self):
        return self.requiredFlavorParamsIds

    def setRequiredFlavorParamsIds(self, newRequiredFlavorParamsIds):
        self.requiredFlavorParamsIds = newRequiredFlavorParamsIds

    def getOptionalThumbDimensions(self):
        return self.optionalThumbDimensions

    def setOptionalThumbDimensions(self, newOptionalThumbDimensions):
        self.optionalThumbDimensions = newOptionalThumbDimensions

    def getRequiredThumbDimensions(self):
        return self.requiredThumbDimensions

    def setRequiredThumbDimensions(self, newRequiredThumbDimensions):
        self.requiredThumbDimensions = newRequiredThumbDimensions

    def getOptionalAssetDistributionRules(self):
        return self.optionalAssetDistributionRules

    def setOptionalAssetDistributionRules(self, newOptionalAssetDistributionRules):
        self.optionalAssetDistributionRules = newOptionalAssetDistributionRules

    def getRequiredAssetDistributionRules(self):
        return self.requiredAssetDistributionRules

    def setRequiredAssetDistributionRules(self, newRequiredAssetDistributionRules):
        self.requiredAssetDistributionRules = newRequiredAssetDistributionRules

    def getSunriseDefaultOffset(self):
        return self.sunriseDefaultOffset

    def setSunriseDefaultOffset(self, newSunriseDefaultOffset):
        self.sunriseDefaultOffset = newSunriseDefaultOffset

    def getSunsetDefaultOffset(self):
        return self.sunsetDefaultOffset

    def setSunsetDefaultOffset(self, newSunsetDefaultOffset):
        self.sunsetDefaultOffset = newSunsetDefaultOffset

    def getRecommendedStorageProfileForDownload(self):
        return self.recommendedStorageProfileForDownload

    def setRecommendedStorageProfileForDownload(self, newRecommendedStorageProfileForDownload):
        self.recommendedStorageProfileForDownload = newRecommendedStorageProfileForDownload

    def getRecommendedDcForDownload(self):
        return self.recommendedDcForDownload

    def setRecommendedDcForDownload(self, newRecommendedDcForDownload):
        self.recommendedDcForDownload = newRecommendedDcForDownload

    def getRecommendedDcForExecute(self):
        return self.recommendedDcForExecute

    def setRecommendedDcForExecute(self, newRecommendedDcForExecute):
        self.recommendedDcForExecute = newRecommendedDcForExecute


# @package Kaltura
# @subpackage Client
class KalturaDistributionProvider(KalturaObjectBase):
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
        KalturaObjectBase.__init__(self)

        # @var KalturaDistributionProviderType
        # @readonly
        self.type = type

        # @var string
        self.name = name

        # @var bool
        self.scheduleUpdateEnabled = scheduleUpdateEnabled

        # @var bool
        self.availabilityUpdateEnabled = availabilityUpdateEnabled

        # @var bool
        self.deleteInsteadUpdate = deleteInsteadUpdate

        # @var int
        self.intervalBeforeSunrise = intervalBeforeSunrise

        # @var int
        self.intervalBeforeSunset = intervalBeforeSunset

        # @var string
        self.updateRequiredEntryFields = updateRequiredEntryFields

        # @var string
        self.updateRequiredMetadataXPaths = updateRequiredMetadataXPaths


    PROPERTY_LOADERS = {
        'type': (KalturaEnumsFactory.createString, "KalturaDistributionProviderType"), 
        'name': getXmlNodeText, 
        'scheduleUpdateEnabled': getXmlNodeBool, 
        'availabilityUpdateEnabled': getXmlNodeBool, 
        'deleteInsteadUpdate': getXmlNodeBool, 
        'intervalBeforeSunrise': getXmlNodeInt, 
        'intervalBeforeSunset': getXmlNodeInt, 
        'updateRequiredEntryFields': getXmlNodeText, 
        'updateRequiredMetadataXPaths': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaDistributionProvider")
        kparams.addStringIfDefined("name", self.name)
        kparams.addBoolIfDefined("scheduleUpdateEnabled", self.scheduleUpdateEnabled)
        kparams.addBoolIfDefined("availabilityUpdateEnabled", self.availabilityUpdateEnabled)
        kparams.addBoolIfDefined("deleteInsteadUpdate", self.deleteInsteadUpdate)
        kparams.addIntIfDefined("intervalBeforeSunrise", self.intervalBeforeSunrise)
        kparams.addIntIfDefined("intervalBeforeSunset", self.intervalBeforeSunset)
        kparams.addStringIfDefined("updateRequiredEntryFields", self.updateRequiredEntryFields)
        kparams.addStringIfDefined("updateRequiredMetadataXPaths", self.updateRequiredMetadataXPaths)
        return kparams

    def getType(self):
        return self.type

    def getName(self):
        return self.name

    def setName(self, newName):
        self.name = newName

    def getScheduleUpdateEnabled(self):
        return self.scheduleUpdateEnabled

    def setScheduleUpdateEnabled(self, newScheduleUpdateEnabled):
        self.scheduleUpdateEnabled = newScheduleUpdateEnabled

    def getAvailabilityUpdateEnabled(self):
        return self.availabilityUpdateEnabled

    def setAvailabilityUpdateEnabled(self, newAvailabilityUpdateEnabled):
        self.availabilityUpdateEnabled = newAvailabilityUpdateEnabled

    def getDeleteInsteadUpdate(self):
        return self.deleteInsteadUpdate

    def setDeleteInsteadUpdate(self, newDeleteInsteadUpdate):
        self.deleteInsteadUpdate = newDeleteInsteadUpdate

    def getIntervalBeforeSunrise(self):
        return self.intervalBeforeSunrise

    def setIntervalBeforeSunrise(self, newIntervalBeforeSunrise):
        self.intervalBeforeSunrise = newIntervalBeforeSunrise

    def getIntervalBeforeSunset(self):
        return self.intervalBeforeSunset

    def setIntervalBeforeSunset(self, newIntervalBeforeSunset):
        self.intervalBeforeSunset = newIntervalBeforeSunset

    def getUpdateRequiredEntryFields(self):
        return self.updateRequiredEntryFields

    def setUpdateRequiredEntryFields(self, newUpdateRequiredEntryFields):
        self.updateRequiredEntryFields = newUpdateRequiredEntryFields

    def getUpdateRequiredMetadataXPaths(self):
        return self.updateRequiredMetadataXPaths

    def setUpdateRequiredMetadataXPaths(self, newUpdateRequiredMetadataXPaths):
        self.updateRequiredMetadataXPaths = newUpdateRequiredMetadataXPaths


# @package Kaltura
# @subpackage Client
class KalturaDistributionRemoteMediaFile(KalturaObjectBase):
    def __init__(self,
            version=NotImplemented,
            assetId=NotImplemented,
            remoteId=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var string
        self.version = version

        # @var string
        self.assetId = assetId

        # @var string
        self.remoteId = remoteId


    PROPERTY_LOADERS = {
        'version': getXmlNodeText, 
        'assetId': getXmlNodeText, 
        'remoteId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionRemoteMediaFile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaDistributionRemoteMediaFile")
        kparams.addStringIfDefined("version", self.version)
        kparams.addStringIfDefined("assetId", self.assetId)
        kparams.addStringIfDefined("remoteId", self.remoteId)
        return kparams

    def getVersion(self):
        return self.version

    def setVersion(self, newVersion):
        self.version = newVersion

    def getAssetId(self):
        return self.assetId

    def setAssetId(self, newAssetId):
        self.assetId = newAssetId

    def getRemoteId(self):
        return self.remoteId

    def setRemoteId(self, newRemoteId):
        self.remoteId = newRemoteId


# @package Kaltura
# @subpackage Client
class KalturaDistributionValidationError(KalturaObjectBase):
    def __init__(self,
            action=NotImplemented,
            errorType=NotImplemented,
            description=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var KalturaDistributionAction
        self.action = action

        # @var KalturaDistributionErrorType
        self.errorType = errorType

        # @var string
        self.description = description


    PROPERTY_LOADERS = {
        'action': (KalturaEnumsFactory.createInt, "KalturaDistributionAction"), 
        'errorType': (KalturaEnumsFactory.createInt, "KalturaDistributionErrorType"), 
        'description': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionValidationError.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaDistributionValidationError")
        kparams.addIntEnumIfDefined("action", self.action)
        kparams.addIntEnumIfDefined("errorType", self.errorType)
        kparams.addStringIfDefined("description", self.description)
        return kparams

    def getAction(self):
        return self.action

    def setAction(self, newAction):
        self.action = newAction

    def getErrorType(self):
        return self.errorType

    def setErrorType(self, newErrorType):
        self.errorType = newErrorType

    def getDescription(self):
        return self.description

    def setDescription(self, newDescription):
        self.description = newDescription


# @package Kaltura
# @subpackage Client
class KalturaEntryDistribution(KalturaObjectBase):
    def __init__(self,
            id=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            submittedAt=NotImplemented,
            entryId=NotImplemented,
            partnerId=NotImplemented,
            distributionProfileId=NotImplemented,
            status=NotImplemented,
            sunStatus=NotImplemented,
            dirtyStatus=NotImplemented,
            thumbAssetIds=NotImplemented,
            flavorAssetIds=NotImplemented,
            assetIds=NotImplemented,
            sunrise=NotImplemented,
            sunset=NotImplemented,
            remoteId=NotImplemented,
            plays=NotImplemented,
            views=NotImplemented,
            validationErrors=NotImplemented,
            errorType=NotImplemented,
            errorNumber=NotImplemented,
            errorDescription=NotImplemented,
            hasSubmitResultsLog=NotImplemented,
            hasSubmitSentDataLog=NotImplemented,
            hasUpdateResultsLog=NotImplemented,
            hasUpdateSentDataLog=NotImplemented,
            hasDeleteResultsLog=NotImplemented,
            hasDeleteSentDataLog=NotImplemented):
        KalturaObjectBase.__init__(self)

        # Auto generated unique id
        # @var int
        # @readonly
        self.id = id

        # Entry distribution creation date as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.createdAt = createdAt

        # Entry distribution last update date as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.updatedAt = updatedAt

        # Entry distribution submission date as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.submittedAt = submittedAt

        # @var string
        # @insertonly
        self.entryId = entryId

        # @var int
        # @readonly
        self.partnerId = partnerId

        # @var int
        # @insertonly
        self.distributionProfileId = distributionProfileId

        # @var KalturaEntryDistributionStatus
        # @readonly
        self.status = status

        # @var KalturaEntryDistributionSunStatus
        # @readonly
        self.sunStatus = sunStatus

        # @var KalturaEntryDistributionFlag
        # @readonly
        self.dirtyStatus = dirtyStatus

        # Comma separated thumbnail asset ids
        # @var string
        self.thumbAssetIds = thumbAssetIds

        # Comma separated flavor asset ids
        # @var string
        self.flavorAssetIds = flavorAssetIds

        # Comma separated asset ids
        # @var string
        self.assetIds = assetIds

        # Entry distribution publish time as Unix timestamp (In seconds)
        # @var int
        self.sunrise = sunrise

        # Entry distribution un-publish time as Unix timestamp (In seconds)
        # @var int
        self.sunset = sunset

        # The id as returned from the distributed destination
        # @var string
        # @readonly
        self.remoteId = remoteId

        # The plays as retrieved from the remote destination reports
        # @var int
        # @readonly
        self.plays = plays

        # The views as retrieved from the remote destination reports
        # @var int
        # @readonly
        self.views = views

        # @var array of KalturaDistributionValidationError
        self.validationErrors = validationErrors

        # @var KalturaBatchJobErrorTypes
        # @readonly
        self.errorType = errorType

        # @var int
        # @readonly
        self.errorNumber = errorNumber

        # @var string
        # @readonly
        self.errorDescription = errorDescription

        # @var KalturaNullableBoolean
        # @readonly
        self.hasSubmitResultsLog = hasSubmitResultsLog

        # @var KalturaNullableBoolean
        # @readonly
        self.hasSubmitSentDataLog = hasSubmitSentDataLog

        # @var KalturaNullableBoolean
        # @readonly
        self.hasUpdateResultsLog = hasUpdateResultsLog

        # @var KalturaNullableBoolean
        # @readonly
        self.hasUpdateSentDataLog = hasUpdateSentDataLog

        # @var KalturaNullableBoolean
        # @readonly
        self.hasDeleteResultsLog = hasDeleteResultsLog

        # @var KalturaNullableBoolean
        # @readonly
        self.hasDeleteSentDataLog = hasDeleteSentDataLog


    PROPERTY_LOADERS = {
        'id': getXmlNodeInt, 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
        'submittedAt': getXmlNodeInt, 
        'entryId': getXmlNodeText, 
        'partnerId': getXmlNodeInt, 
        'distributionProfileId': getXmlNodeInt, 
        'status': (KalturaEnumsFactory.createInt, "KalturaEntryDistributionStatus"), 
        'sunStatus': (KalturaEnumsFactory.createInt, "KalturaEntryDistributionSunStatus"), 
        'dirtyStatus': (KalturaEnumsFactory.createInt, "KalturaEntryDistributionFlag"), 
        'thumbAssetIds': getXmlNodeText, 
        'flavorAssetIds': getXmlNodeText, 
        'assetIds': getXmlNodeText, 
        'sunrise': getXmlNodeInt, 
        'sunset': getXmlNodeInt, 
        'remoteId': getXmlNodeText, 
        'plays': getXmlNodeInt, 
        'views': getXmlNodeInt, 
        'validationErrors': (KalturaObjectFactory.createArray, KalturaDistributionValidationError), 
        'errorType': (KalturaEnumsFactory.createInt, "KalturaBatchJobErrorTypes"), 
        'errorNumber': getXmlNodeInt, 
        'errorDescription': getXmlNodeText, 
        'hasSubmitResultsLog': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
        'hasSubmitSentDataLog': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
        'hasUpdateResultsLog': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
        'hasUpdateSentDataLog': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
        'hasDeleteResultsLog': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
        'hasDeleteSentDataLog': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEntryDistribution.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaEntryDistribution")
        kparams.addStringIfDefined("entryId", self.entryId)
        kparams.addIntIfDefined("distributionProfileId", self.distributionProfileId)
        kparams.addStringIfDefined("thumbAssetIds", self.thumbAssetIds)
        kparams.addStringIfDefined("flavorAssetIds", self.flavorAssetIds)
        kparams.addStringIfDefined("assetIds", self.assetIds)
        kparams.addIntIfDefined("sunrise", self.sunrise)
        kparams.addIntIfDefined("sunset", self.sunset)
        kparams.addArrayIfDefined("validationErrors", self.validationErrors)
        return kparams

    def getId(self):
        return self.id

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt

    def getSubmittedAt(self):
        return self.submittedAt

    def getEntryId(self):
        return self.entryId

    def setEntryId(self, newEntryId):
        self.entryId = newEntryId

    def getPartnerId(self):
        return self.partnerId

    def getDistributionProfileId(self):
        return self.distributionProfileId

    def setDistributionProfileId(self, newDistributionProfileId):
        self.distributionProfileId = newDistributionProfileId

    def getStatus(self):
        return self.status

    def getSunStatus(self):
        return self.sunStatus

    def getDirtyStatus(self):
        return self.dirtyStatus

    def getThumbAssetIds(self):
        return self.thumbAssetIds

    def setThumbAssetIds(self, newThumbAssetIds):
        self.thumbAssetIds = newThumbAssetIds

    def getFlavorAssetIds(self):
        return self.flavorAssetIds

    def setFlavorAssetIds(self, newFlavorAssetIds):
        self.flavorAssetIds = newFlavorAssetIds

    def getAssetIds(self):
        return self.assetIds

    def setAssetIds(self, newAssetIds):
        self.assetIds = newAssetIds

    def getSunrise(self):
        return self.sunrise

    def setSunrise(self, newSunrise):
        self.sunrise = newSunrise

    def getSunset(self):
        return self.sunset

    def setSunset(self, newSunset):
        self.sunset = newSunset

    def getRemoteId(self):
        return self.remoteId

    def getPlays(self):
        return self.plays

    def getViews(self):
        return self.views

    def getValidationErrors(self):
        return self.validationErrors

    def setValidationErrors(self, newValidationErrors):
        self.validationErrors = newValidationErrors

    def getErrorType(self):
        return self.errorType

    def getErrorNumber(self):
        return self.errorNumber

    def getErrorDescription(self):
        return self.errorDescription

    def getHasSubmitResultsLog(self):
        return self.hasSubmitResultsLog

    def getHasSubmitSentDataLog(self):
        return self.hasSubmitSentDataLog

    def getHasUpdateResultsLog(self):
        return self.hasUpdateResultsLog

    def getHasUpdateSentDataLog(self):
        return self.hasUpdateSentDataLog

    def getHasDeleteResultsLog(self):
        return self.hasDeleteResultsLog

    def getHasDeleteSentDataLog(self):
        return self.hasDeleteSentDataLog


# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProfileAction(KalturaObjectBase):
    def __init__(self,
            protocol=NotImplemented,
            serverUrl=NotImplemented,
            serverPath=NotImplemented,
            username=NotImplemented,
            password=NotImplemented,
            ftpPassiveMode=NotImplemented,
            httpFieldName=NotImplemented,
            httpFileName=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var KalturaDistributionProtocol
        self.protocol = protocol

        # @var string
        self.serverUrl = serverUrl

        # @var string
        self.serverPath = serverPath

        # @var string
        self.username = username

        # @var string
        self.password = password

        # @var bool
        self.ftpPassiveMode = ftpPassiveMode

        # @var string
        self.httpFieldName = httpFieldName

        # @var string
        self.httpFileName = httpFileName


    PROPERTY_LOADERS = {
        'protocol': (KalturaEnumsFactory.createInt, "KalturaDistributionProtocol"), 
        'serverUrl': getXmlNodeText, 
        'serverPath': getXmlNodeText, 
        'username': getXmlNodeText, 
        'password': getXmlNodeText, 
        'ftpPassiveMode': getXmlNodeBool, 
        'httpFieldName': getXmlNodeText, 
        'httpFileName': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaGenericDistributionProfileAction.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaGenericDistributionProfileAction")
        kparams.addIntEnumIfDefined("protocol", self.protocol)
        kparams.addStringIfDefined("serverUrl", self.serverUrl)
        kparams.addStringIfDefined("serverPath", self.serverPath)
        kparams.addStringIfDefined("username", self.username)
        kparams.addStringIfDefined("password", self.password)
        kparams.addBoolIfDefined("ftpPassiveMode", self.ftpPassiveMode)
        kparams.addStringIfDefined("httpFieldName", self.httpFieldName)
        kparams.addStringIfDefined("httpFileName", self.httpFileName)
        return kparams

    def getProtocol(self):
        return self.protocol

    def setProtocol(self, newProtocol):
        self.protocol = newProtocol

    def getServerUrl(self):
        return self.serverUrl

    def setServerUrl(self, newServerUrl):
        self.serverUrl = newServerUrl

    def getServerPath(self):
        return self.serverPath

    def setServerPath(self, newServerPath):
        self.serverPath = newServerPath

    def getUsername(self):
        return self.username

    def setUsername(self, newUsername):
        self.username = newUsername

    def getPassword(self):
        return self.password

    def setPassword(self, newPassword):
        self.password = newPassword

    def getFtpPassiveMode(self):
        return self.ftpPassiveMode

    def setFtpPassiveMode(self, newFtpPassiveMode):
        self.ftpPassiveMode = newFtpPassiveMode

    def getHttpFieldName(self):
        return self.httpFieldName

    def setHttpFieldName(self, newHttpFieldName):
        self.httpFieldName = newHttpFieldName

    def getHttpFileName(self):
        return self.httpFileName

    def setHttpFileName(self, newHttpFileName):
        self.httpFileName = newHttpFileName


# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProviderAction(KalturaObjectBase):
    def __init__(self,
            id=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            genericDistributionProviderId=NotImplemented,
            action=NotImplemented,
            status=NotImplemented,
            resultsParser=NotImplemented,
            protocol=NotImplemented,
            serverAddress=NotImplemented,
            remotePath=NotImplemented,
            remoteUsername=NotImplemented,
            remotePassword=NotImplemented,
            editableFields=NotImplemented,
            mandatoryFields=NotImplemented,
            mrssTransformer=NotImplemented,
            mrssValidator=NotImplemented,
            resultsTransformer=NotImplemented):
        KalturaObjectBase.__init__(self)

        # Auto generated
        # @var int
        # @readonly
        self.id = id

        # Generic distribution provider action creation date as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.createdAt = createdAt

        # Generic distribution provider action last update date as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.updatedAt = updatedAt

        # @var int
        # @insertonly
        self.genericDistributionProviderId = genericDistributionProviderId

        # @var KalturaDistributionAction
        # @insertonly
        self.action = action

        # @var KalturaGenericDistributionProviderStatus
        # @readonly
        self.status = status

        # @var KalturaGenericDistributionProviderParser
        self.resultsParser = resultsParser

        # @var KalturaDistributionProtocol
        self.protocol = protocol

        # @var string
        self.serverAddress = serverAddress

        # @var string
        self.remotePath = remotePath

        # @var string
        self.remoteUsername = remoteUsername

        # @var string
        self.remotePassword = remotePassword

        # @var string
        self.editableFields = editableFields

        # @var string
        self.mandatoryFields = mandatoryFields

        # @var string
        # @readonly
        self.mrssTransformer = mrssTransformer

        # @var string
        # @readonly
        self.mrssValidator = mrssValidator

        # @var string
        # @readonly
        self.resultsTransformer = resultsTransformer


    PROPERTY_LOADERS = {
        'id': getXmlNodeInt, 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
        'genericDistributionProviderId': getXmlNodeInt, 
        'action': (KalturaEnumsFactory.createInt, "KalturaDistributionAction"), 
        'status': (KalturaEnumsFactory.createInt, "KalturaGenericDistributionProviderStatus"), 
        'resultsParser': (KalturaEnumsFactory.createInt, "KalturaGenericDistributionProviderParser"), 
        'protocol': (KalturaEnumsFactory.createInt, "KalturaDistributionProtocol"), 
        'serverAddress': getXmlNodeText, 
        'remotePath': getXmlNodeText, 
        'remoteUsername': getXmlNodeText, 
        'remotePassword': getXmlNodeText, 
        'editableFields': getXmlNodeText, 
        'mandatoryFields': getXmlNodeText, 
        'mrssTransformer': getXmlNodeText, 
        'mrssValidator': getXmlNodeText, 
        'resultsTransformer': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaGenericDistributionProviderAction.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaGenericDistributionProviderAction")
        kparams.addIntIfDefined("genericDistributionProviderId", self.genericDistributionProviderId)
        kparams.addIntEnumIfDefined("action", self.action)
        kparams.addIntEnumIfDefined("resultsParser", self.resultsParser)
        kparams.addIntEnumIfDefined("protocol", self.protocol)
        kparams.addStringIfDefined("serverAddress", self.serverAddress)
        kparams.addStringIfDefined("remotePath", self.remotePath)
        kparams.addStringIfDefined("remoteUsername", self.remoteUsername)
        kparams.addStringIfDefined("remotePassword", self.remotePassword)
        kparams.addStringIfDefined("editableFields", self.editableFields)
        kparams.addStringIfDefined("mandatoryFields", self.mandatoryFields)
        return kparams

    def getId(self):
        return self.id

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt

    def getGenericDistributionProviderId(self):
        return self.genericDistributionProviderId

    def setGenericDistributionProviderId(self, newGenericDistributionProviderId):
        self.genericDistributionProviderId = newGenericDistributionProviderId

    def getAction(self):
        return self.action

    def setAction(self, newAction):
        self.action = newAction

    def getStatus(self):
        return self.status

    def getResultsParser(self):
        return self.resultsParser

    def setResultsParser(self, newResultsParser):
        self.resultsParser = newResultsParser

    def getProtocol(self):
        return self.protocol

    def setProtocol(self, newProtocol):
        self.protocol = newProtocol

    def getServerAddress(self):
        return self.serverAddress

    def setServerAddress(self, newServerAddress):
        self.serverAddress = newServerAddress

    def getRemotePath(self):
        return self.remotePath

    def setRemotePath(self, newRemotePath):
        self.remotePath = newRemotePath

    def getRemoteUsername(self):
        return self.remoteUsername

    def setRemoteUsername(self, newRemoteUsername):
        self.remoteUsername = newRemoteUsername

    def getRemotePassword(self):
        return self.remotePassword

    def setRemotePassword(self, newRemotePassword):
        self.remotePassword = newRemotePassword

    def getEditableFields(self):
        return self.editableFields

    def setEditableFields(self, newEditableFields):
        self.editableFields = newEditableFields

    def getMandatoryFields(self):
        return self.mandatoryFields

    def setMandatoryFields(self, newMandatoryFields):
        self.mandatoryFields = newMandatoryFields

    def getMrssTransformer(self):
        return self.mrssTransformer

    def getMrssValidator(self):
        return self.mrssValidator

    def getResultsTransformer(self):
        return self.resultsTransformer


# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProvider(KalturaDistributionProvider):
    def __init__(self,
            type=NotImplemented,
            name=NotImplemented,
            scheduleUpdateEnabled=NotImplemented,
            availabilityUpdateEnabled=NotImplemented,
            deleteInsteadUpdate=NotImplemented,
            intervalBeforeSunrise=NotImplemented,
            intervalBeforeSunset=NotImplemented,
            updateRequiredEntryFields=NotImplemented,
            updateRequiredMetadataXPaths=NotImplemented,
            id=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            partnerId=NotImplemented,
            isDefault=NotImplemented,
            status=NotImplemented,
            optionalFlavorParamsIds=NotImplemented,
            requiredFlavorParamsIds=NotImplemented,
            optionalThumbDimensions=NotImplemented,
            requiredThumbDimensions=NotImplemented,
            editableFields=NotImplemented,
            mandatoryFields=NotImplemented):
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

        # Auto generated
        # @var int
        # @readonly
        self.id = id

        # Generic distribution provider creation date as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.createdAt = createdAt

        # Generic distribution provider last update date as Unix timestamp (In seconds)
        # @var int
        # @readonly
        self.updatedAt = updatedAt

        # @var int
        # @readonly
        self.partnerId = partnerId

        # @var bool
        self.isDefault = isDefault

        # @var KalturaGenericDistributionProviderStatus
        # @readonly
        self.status = status

        # @var string
        self.optionalFlavorParamsIds = optionalFlavorParamsIds

        # @var string
        self.requiredFlavorParamsIds = requiredFlavorParamsIds

        # @var array of KalturaDistributionThumbDimensions
        self.optionalThumbDimensions = optionalThumbDimensions

        # @var array of KalturaDistributionThumbDimensions
        self.requiredThumbDimensions = requiredThumbDimensions

        # @var string
        self.editableFields = editableFields

        # @var string
        self.mandatoryFields = mandatoryFields


    PROPERTY_LOADERS = {
        'id': getXmlNodeInt, 
        'createdAt': getXmlNodeInt, 
        'updatedAt': getXmlNodeInt, 
        'partnerId': getXmlNodeInt, 
        'isDefault': getXmlNodeBool, 
        'status': (KalturaEnumsFactory.createInt, "KalturaGenericDistributionProviderStatus"), 
        'optionalFlavorParamsIds': getXmlNodeText, 
        'requiredFlavorParamsIds': getXmlNodeText, 
        'optionalThumbDimensions': (KalturaObjectFactory.createArray, KalturaDistributionThumbDimensions), 
        'requiredThumbDimensions': (KalturaObjectFactory.createArray, KalturaDistributionThumbDimensions), 
        'editableFields': getXmlNodeText, 
        'mandatoryFields': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDistributionProvider.fromXml(self, node)
        self.fromXmlImpl(node, KalturaGenericDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaGenericDistributionProvider")
        kparams.addBoolIfDefined("isDefault", self.isDefault)
        kparams.addStringIfDefined("optionalFlavorParamsIds", self.optionalFlavorParamsIds)
        kparams.addStringIfDefined("requiredFlavorParamsIds", self.requiredFlavorParamsIds)
        kparams.addArrayIfDefined("optionalThumbDimensions", self.optionalThumbDimensions)
        kparams.addArrayIfDefined("requiredThumbDimensions", self.requiredThumbDimensions)
        kparams.addStringIfDefined("editableFields", self.editableFields)
        kparams.addStringIfDefined("mandatoryFields", self.mandatoryFields)
        return kparams

    def getId(self):
        return self.id

    def getCreatedAt(self):
        return self.createdAt

    def getUpdatedAt(self):
        return self.updatedAt

    def getPartnerId(self):
        return self.partnerId

    def getIsDefault(self):
        return self.isDefault

    def setIsDefault(self, newIsDefault):
        self.isDefault = newIsDefault

    def getStatus(self):
        return self.status

    def getOptionalFlavorParamsIds(self):
        return self.optionalFlavorParamsIds

    def setOptionalFlavorParamsIds(self, newOptionalFlavorParamsIds):
        self.optionalFlavorParamsIds = newOptionalFlavorParamsIds

    def getRequiredFlavorParamsIds(self):
        return self.requiredFlavorParamsIds

    def setRequiredFlavorParamsIds(self, newRequiredFlavorParamsIds):
        self.requiredFlavorParamsIds = newRequiredFlavorParamsIds

    def getOptionalThumbDimensions(self):
        return self.optionalThumbDimensions

    def setOptionalThumbDimensions(self, newOptionalThumbDimensions):
        self.optionalThumbDimensions = newOptionalThumbDimensions

    def getRequiredThumbDimensions(self):
        return self.requiredThumbDimensions

    def setRequiredThumbDimensions(self, newRequiredThumbDimensions):
        self.requiredThumbDimensions = newRequiredThumbDimensions

    def getEditableFields(self):
        return self.editableFields

    def setEditableFields(self, newEditableFields):
        self.editableFields = newEditableFields

    def getMandatoryFields(self):
        return self.mandatoryFields

    def setMandatoryFields(self, newMandatoryFields):
        self.mandatoryFields = newMandatoryFields


# @package Kaltura
# @subpackage Client
class KalturaAssetDistributionPropertyCondition(KalturaAssetDistributionCondition):
    """Defines the condition to match a property and value on core asset object (or one if its inherited objects)"""

    def __init__(self,
            propertyName=NotImplemented,
            propertyValue=NotImplemented):
        KalturaAssetDistributionCondition.__init__(self)

        # The property name to look for, this will match to a getter on the asset object.
        # 	 Should be camelCase naming convention (defining "myPropertyName" will look for getMyPropertyName())
        # @var string
        self.propertyName = propertyName

        # The value to compare
        # @var string
        self.propertyValue = propertyValue


    PROPERTY_LOADERS = {
        'propertyName': getXmlNodeText, 
        'propertyValue': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaAssetDistributionCondition.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAssetDistributionPropertyCondition.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaAssetDistributionCondition.toParams(self)
        kparams.put("objectType", "KalturaAssetDistributionPropertyCondition")
        kparams.addStringIfDefined("propertyName", self.propertyName)
        kparams.addStringIfDefined("propertyValue", self.propertyValue)
        return kparams

    def getPropertyName(self):
        return self.propertyName

    def setPropertyName(self, newPropertyName):
        self.propertyName = newPropertyName

    def getPropertyValue(self):
        return self.propertyValue

    def setPropertyValue(self, newPropertyValue):
        self.propertyValue = newPropertyValue


# @package Kaltura
# @subpackage Client
class KalturaConfigurableDistributionJobProviderData(KalturaDistributionJobProviderData):
    def __init__(self,
            fieldValues=NotImplemented):
        KalturaDistributionJobProviderData.__init__(self)

        # @var string
        self.fieldValues = fieldValues


    PROPERTY_LOADERS = {
        'fieldValues': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaConfigurableDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaConfigurableDistributionJobProviderData")
        kparams.addStringIfDefined("fieldValues", self.fieldValues)
        return kparams

    def getFieldValues(self):
        return self.fieldValues

    def setFieldValues(self, newFieldValues):
        self.fieldValues = newFieldValues


# @package Kaltura
# @subpackage Client
class KalturaConfigurableDistributionProfile(KalturaDistributionProfile):
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
            useCategoryEntries=NotImplemented):
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

        # @var array of KalturaDistributionFieldConfig
        self.fieldConfigArray = fieldConfigArray

        # @var array of KalturaExtendingItemMrssParameter
        self.itemXpathsToExtend = itemXpathsToExtend

        # When checking custom XSLT conditions using the fieldConfigArray - address only categories associated with the entry via the categoryEntry object
        # @var bool
        self.useCategoryEntries = useCategoryEntries


    PROPERTY_LOADERS = {
        'fieldConfigArray': (KalturaObjectFactory.createArray, KalturaDistributionFieldConfig), 
        'itemXpathsToExtend': (KalturaObjectFactory.createArray, KalturaExtendingItemMrssParameter), 
        'useCategoryEntries': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaConfigurableDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaConfigurableDistributionProfile")
        kparams.addArrayIfDefined("fieldConfigArray", self.fieldConfigArray)
        kparams.addArrayIfDefined("itemXpathsToExtend", self.itemXpathsToExtend)
        kparams.addBoolIfDefined("useCategoryEntries", self.useCategoryEntries)
        return kparams

    def getFieldConfigArray(self):
        return self.fieldConfigArray

    def setFieldConfigArray(self, newFieldConfigArray):
        self.fieldConfigArray = newFieldConfigArray

    def getItemXpathsToExtend(self):
        return self.itemXpathsToExtend

    def setItemXpathsToExtend(self, newItemXpathsToExtend):
        self.itemXpathsToExtend = newItemXpathsToExtend

    def getUseCategoryEntries(self):
        return self.useCategoryEntries

    def setUseCategoryEntries(self, newUseCategoryEntries):
        self.useCategoryEntries = newUseCategoryEntries


# @package Kaltura
# @subpackage Client
class KalturaContentDistributionSearchItem(KalturaSearchItem):
    def __init__(self,
            noDistributionProfiles=NotImplemented,
            distributionProfileId=NotImplemented,
            distributionSunStatus=NotImplemented,
            entryDistributionFlag=NotImplemented,
            entryDistributionStatus=NotImplemented,
            hasEntryDistributionValidationErrors=NotImplemented,
            entryDistributionValidationErrors=NotImplemented):
        KalturaSearchItem.__init__(self)

        # @var bool
        self.noDistributionProfiles = noDistributionProfiles

        # @var int
        self.distributionProfileId = distributionProfileId

        # @var KalturaEntryDistributionSunStatus
        self.distributionSunStatus = distributionSunStatus

        # @var KalturaEntryDistributionFlag
        self.entryDistributionFlag = entryDistributionFlag

        # @var KalturaEntryDistributionStatus
        self.entryDistributionStatus = entryDistributionStatus

        # @var bool
        self.hasEntryDistributionValidationErrors = hasEntryDistributionValidationErrors

        # Comma seperated validation error types
        # @var string
        self.entryDistributionValidationErrors = entryDistributionValidationErrors


    PROPERTY_LOADERS = {
        'noDistributionProfiles': getXmlNodeBool, 
        'distributionProfileId': getXmlNodeInt, 
        'distributionSunStatus': (KalturaEnumsFactory.createInt, "KalturaEntryDistributionSunStatus"), 
        'entryDistributionFlag': (KalturaEnumsFactory.createInt, "KalturaEntryDistributionFlag"), 
        'entryDistributionStatus': (KalturaEnumsFactory.createInt, "KalturaEntryDistributionStatus"), 
        'hasEntryDistributionValidationErrors': getXmlNodeBool, 
        'entryDistributionValidationErrors': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaSearchItem.fromXml(self, node)
        self.fromXmlImpl(node, KalturaContentDistributionSearchItem.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSearchItem.toParams(self)
        kparams.put("objectType", "KalturaContentDistributionSearchItem")
        kparams.addBoolIfDefined("noDistributionProfiles", self.noDistributionProfiles)
        kparams.addIntIfDefined("distributionProfileId", self.distributionProfileId)
        kparams.addIntEnumIfDefined("distributionSunStatus", self.distributionSunStatus)
        kparams.addIntEnumIfDefined("entryDistributionFlag", self.entryDistributionFlag)
        kparams.addIntEnumIfDefined("entryDistributionStatus", self.entryDistributionStatus)
        kparams.addBoolIfDefined("hasEntryDistributionValidationErrors", self.hasEntryDistributionValidationErrors)
        kparams.addStringIfDefined("entryDistributionValidationErrors", self.entryDistributionValidationErrors)
        return kparams

    def getNoDistributionProfiles(self):
        return self.noDistributionProfiles

    def setNoDistributionProfiles(self, newNoDistributionProfiles):
        self.noDistributionProfiles = newNoDistributionProfiles

    def getDistributionProfileId(self):
        return self.distributionProfileId

    def setDistributionProfileId(self, newDistributionProfileId):
        self.distributionProfileId = newDistributionProfileId

    def getDistributionSunStatus(self):
        return self.distributionSunStatus

    def setDistributionSunStatus(self, newDistributionSunStatus):
        self.distributionSunStatus = newDistributionSunStatus

    def getEntryDistributionFlag(self):
        return self.entryDistributionFlag

    def setEntryDistributionFlag(self, newEntryDistributionFlag):
        self.entryDistributionFlag = newEntryDistributionFlag

    def getEntryDistributionStatus(self):
        return self.entryDistributionStatus

    def setEntryDistributionStatus(self, newEntryDistributionStatus):
        self.entryDistributionStatus = newEntryDistributionStatus

    def getHasEntryDistributionValidationErrors(self):
        return self.hasEntryDistributionValidationErrors

    def setHasEntryDistributionValidationErrors(self, newHasEntryDistributionValidationErrors):
        self.hasEntryDistributionValidationErrors = newHasEntryDistributionValidationErrors

    def getEntryDistributionValidationErrors(self):
        return self.entryDistributionValidationErrors

    def setEntryDistributionValidationErrors(self, newEntryDistributionValidationErrors):
        self.entryDistributionValidationErrors = newEntryDistributionValidationErrors


# @package Kaltura
# @subpackage Client
class KalturaDistributionJobData(KalturaJobData):
    def __init__(self,
            distributionProfileId=NotImplemented,
            distributionProfile=NotImplemented,
            entryDistributionId=NotImplemented,
            entryDistribution=NotImplemented,
            remoteId=NotImplemented,
            providerType=NotImplemented,
            providerData=NotImplemented,
            results=NotImplemented,
            sentData=NotImplemented,
            mediaFiles=NotImplemented):
        KalturaJobData.__init__(self)

        # @var int
        self.distributionProfileId = distributionProfileId

        # @var KalturaDistributionProfile
        self.distributionProfile = distributionProfile

        # @var int
        self.entryDistributionId = entryDistributionId

        # @var KalturaEntryDistribution
        self.entryDistribution = entryDistribution

        # Id of the media in the remote system
        # @var string
        self.remoteId = remoteId

        # @var KalturaDistributionProviderType
        self.providerType = providerType

        # Additional data that relevant for the provider only
        # @var KalturaDistributionJobProviderData
        self.providerData = providerData

        # The results as returned from the remote destination
        # @var string
        self.results = results

        # The data as sent to the remote destination
        # @var string
        self.sentData = sentData

        # Stores array of media files that submitted to the destination site
        # 	 Could be used later for media update
        # @var array of KalturaDistributionRemoteMediaFile
        self.mediaFiles = mediaFiles


    PROPERTY_LOADERS = {
        'distributionProfileId': getXmlNodeInt, 
        'distributionProfile': (KalturaObjectFactory.create, KalturaDistributionProfile), 
        'entryDistributionId': getXmlNodeInt, 
        'entryDistribution': (KalturaObjectFactory.create, KalturaEntryDistribution), 
        'remoteId': getXmlNodeText, 
        'providerType': (KalturaEnumsFactory.createString, "KalturaDistributionProviderType"), 
        'providerData': (KalturaObjectFactory.create, KalturaDistributionJobProviderData), 
        'results': getXmlNodeText, 
        'sentData': getXmlNodeText, 
        'mediaFiles': (KalturaObjectFactory.createArray, KalturaDistributionRemoteMediaFile), 
    }

    def fromXml(self, node):
        KalturaJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaJobData.toParams(self)
        kparams.put("objectType", "KalturaDistributionJobData")
        kparams.addIntIfDefined("distributionProfileId", self.distributionProfileId)
        kparams.addObjectIfDefined("distributionProfile", self.distributionProfile)
        kparams.addIntIfDefined("entryDistributionId", self.entryDistributionId)
        kparams.addObjectIfDefined("entryDistribution", self.entryDistribution)
        kparams.addStringIfDefined("remoteId", self.remoteId)
        kparams.addStringEnumIfDefined("providerType", self.providerType)
        kparams.addObjectIfDefined("providerData", self.providerData)
        kparams.addStringIfDefined("results", self.results)
        kparams.addStringIfDefined("sentData", self.sentData)
        kparams.addArrayIfDefined("mediaFiles", self.mediaFiles)
        return kparams

    def getDistributionProfileId(self):
        return self.distributionProfileId

    def setDistributionProfileId(self, newDistributionProfileId):
        self.distributionProfileId = newDistributionProfileId

    def getDistributionProfile(self):
        return self.distributionProfile

    def setDistributionProfile(self, newDistributionProfile):
        self.distributionProfile = newDistributionProfile

    def getEntryDistributionId(self):
        return self.entryDistributionId

    def setEntryDistributionId(self, newEntryDistributionId):
        self.entryDistributionId = newEntryDistributionId

    def getEntryDistribution(self):
        return self.entryDistribution

    def setEntryDistribution(self, newEntryDistribution):
        self.entryDistribution = newEntryDistribution

    def getRemoteId(self):
        return self.remoteId

    def setRemoteId(self, newRemoteId):
        self.remoteId = newRemoteId

    def getProviderType(self):
        return self.providerType

    def setProviderType(self, newProviderType):
        self.providerType = newProviderType

    def getProviderData(self):
        return self.providerData

    def setProviderData(self, newProviderData):
        self.providerData = newProviderData

    def getResults(self):
        return self.results

    def setResults(self, newResults):
        self.results = newResults

    def getSentData(self):
        return self.sentData

    def setSentData(self, newSentData):
        self.sentData = newSentData

    def getMediaFiles(self):
        return self.mediaFiles

    def setMediaFiles(self, newMediaFiles):
        self.mediaFiles = newMediaFiles


# @package Kaltura
# @subpackage Client
class KalturaDistributionProfileBaseFilter(KalturaFilter):
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
        KalturaFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var int
        self.idEqual = idEqual

        # @var string
        self.idIn = idIn

        # @var int
        self.createdAtGreaterThanOrEqual = createdAtGreaterThanOrEqual

        # @var int
        self.createdAtLessThanOrEqual = createdAtLessThanOrEqual

        # @var int
        self.updatedAtGreaterThanOrEqual = updatedAtGreaterThanOrEqual

        # @var int
        self.updatedAtLessThanOrEqual = updatedAtLessThanOrEqual

        # @var KalturaDistributionProfileStatus
        self.statusEqual = statusEqual

        # @var string
        self.statusIn = statusIn


    PROPERTY_LOADERS = {
        'idEqual': getXmlNodeInt, 
        'idIn': getXmlNodeText, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'updatedAtGreaterThanOrEqual': getXmlNodeInt, 
        'updatedAtLessThanOrEqual': getXmlNodeInt, 
        'statusEqual': (KalturaEnumsFactory.createInt, "KalturaDistributionProfileStatus"), 
        'statusIn': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFilter.toParams(self)
        kparams.put("objectType", "KalturaDistributionProfileBaseFilter")
        kparams.addIntIfDefined("idEqual", self.idEqual)
        kparams.addStringIfDefined("idIn", self.idIn)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        kparams.addIntIfDefined("updatedAtGreaterThanOrEqual", self.updatedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("updatedAtLessThanOrEqual", self.updatedAtLessThanOrEqual)
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

    def getCreatedAtGreaterThanOrEqual(self):
        return self.createdAtGreaterThanOrEqual

    def setCreatedAtGreaterThanOrEqual(self, newCreatedAtGreaterThanOrEqual):
        self.createdAtGreaterThanOrEqual = newCreatedAtGreaterThanOrEqual

    def getCreatedAtLessThanOrEqual(self):
        return self.createdAtLessThanOrEqual

    def setCreatedAtLessThanOrEqual(self, newCreatedAtLessThanOrEqual):
        self.createdAtLessThanOrEqual = newCreatedAtLessThanOrEqual

    def getUpdatedAtGreaterThanOrEqual(self):
        return self.updatedAtGreaterThanOrEqual

    def setUpdatedAtGreaterThanOrEqual(self, newUpdatedAtGreaterThanOrEqual):
        self.updatedAtGreaterThanOrEqual = newUpdatedAtGreaterThanOrEqual

    def getUpdatedAtLessThanOrEqual(self):
        return self.updatedAtLessThanOrEqual

    def setUpdatedAtLessThanOrEqual(self, newUpdatedAtLessThanOrEqual):
        self.updatedAtLessThanOrEqual = newUpdatedAtLessThanOrEqual

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
class KalturaDistributionProfileListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaDistributionProfile
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaDistributionProfile), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionProfileListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaDistributionProfileListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaDistributionProviderBaseFilter(KalturaFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var KalturaDistributionProviderType
        self.typeEqual = typeEqual

        # @var string
        self.typeIn = typeIn


    PROPERTY_LOADERS = {
        'typeEqual': (KalturaEnumsFactory.createString, "KalturaDistributionProviderType"), 
        'typeIn': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFilter.toParams(self)
        kparams.put("objectType", "KalturaDistributionProviderBaseFilter")
        kparams.addStringEnumIfDefined("typeEqual", self.typeEqual)
        kparams.addStringIfDefined("typeIn", self.typeIn)
        return kparams

    def getTypeEqual(self):
        return self.typeEqual

    def setTypeEqual(self, newTypeEqual):
        self.typeEqual = newTypeEqual

    def getTypeIn(self):
        return self.typeIn

    def setTypeIn(self, newTypeIn):
        self.typeIn = newTypeIn


# @package Kaltura
# @subpackage Client
class KalturaDistributionProviderListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaDistributionProvider
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaDistributionProvider), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionProviderListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaDistributionProviderListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaDistributionValidationErrorConditionNotMet(KalturaDistributionValidationError):
    def __init__(self,
            action=NotImplemented,
            errorType=NotImplemented,
            description=NotImplemented,
            conditionName=NotImplemented):
        KalturaDistributionValidationError.__init__(self,
            action,
            errorType,
            description)

        # @var string
        self.conditionName = conditionName


    PROPERTY_LOADERS = {
        'conditionName': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDistributionValidationError.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionValidationErrorConditionNotMet.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionValidationError.toParams(self)
        kparams.put("objectType", "KalturaDistributionValidationErrorConditionNotMet")
        kparams.addStringIfDefined("conditionName", self.conditionName)
        return kparams

    def getConditionName(self):
        return self.conditionName

    def setConditionName(self, newConditionName):
        self.conditionName = newConditionName


# @package Kaltura
# @subpackage Client
class KalturaDistributionValidationErrorInvalidData(KalturaDistributionValidationError):
    def __init__(self,
            action=NotImplemented,
            errorType=NotImplemented,
            description=NotImplemented,
            fieldName=NotImplemented,
            validationErrorType=NotImplemented,
            validationErrorParam=NotImplemented):
        KalturaDistributionValidationError.__init__(self,
            action,
            errorType,
            description)

        # @var string
        self.fieldName = fieldName

        # @var KalturaDistributionValidationErrorType
        self.validationErrorType = validationErrorType

        # Parameter of the validation error
        # 	 For example, minimum value for KalturaDistributionValidationErrorType::STRING_TOO_SHORT validation error
        # @var string
        self.validationErrorParam = validationErrorParam


    PROPERTY_LOADERS = {
        'fieldName': getXmlNodeText, 
        'validationErrorType': (KalturaEnumsFactory.createInt, "KalturaDistributionValidationErrorType"), 
        'validationErrorParam': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDistributionValidationError.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionValidationErrorInvalidData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionValidationError.toParams(self)
        kparams.put("objectType", "KalturaDistributionValidationErrorInvalidData")
        kparams.addStringIfDefined("fieldName", self.fieldName)
        kparams.addIntEnumIfDefined("validationErrorType", self.validationErrorType)
        kparams.addStringIfDefined("validationErrorParam", self.validationErrorParam)
        return kparams

    def getFieldName(self):
        return self.fieldName

    def setFieldName(self, newFieldName):
        self.fieldName = newFieldName

    def getValidationErrorType(self):
        return self.validationErrorType

    def setValidationErrorType(self, newValidationErrorType):
        self.validationErrorType = newValidationErrorType

    def getValidationErrorParam(self):
        return self.validationErrorParam

    def setValidationErrorParam(self, newValidationErrorParam):
        self.validationErrorParam = newValidationErrorParam


# @package Kaltura
# @subpackage Client
class KalturaDistributionValidationErrorMissingAsset(KalturaDistributionValidationError):
    def __init__(self,
            action=NotImplemented,
            errorType=NotImplemented,
            description=NotImplemented,
            data=NotImplemented):
        KalturaDistributionValidationError.__init__(self,
            action,
            errorType,
            description)

        # @var string
        self.data = data


    PROPERTY_LOADERS = {
        'data': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDistributionValidationError.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionValidationErrorMissingAsset.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionValidationError.toParams(self)
        kparams.put("objectType", "KalturaDistributionValidationErrorMissingAsset")
        kparams.addStringIfDefined("data", self.data)
        return kparams

    def getData(self):
        return self.data

    def setData(self, newData):
        self.data = newData


# @package Kaltura
# @subpackage Client
class KalturaDistributionValidationErrorMissingFlavor(KalturaDistributionValidationError):
    def __init__(self,
            action=NotImplemented,
            errorType=NotImplemented,
            description=NotImplemented,
            flavorParamsId=NotImplemented):
        KalturaDistributionValidationError.__init__(self,
            action,
            errorType,
            description)

        # @var string
        self.flavorParamsId = flavorParamsId


    PROPERTY_LOADERS = {
        'flavorParamsId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDistributionValidationError.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionValidationErrorMissingFlavor.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionValidationError.toParams(self)
        kparams.put("objectType", "KalturaDistributionValidationErrorMissingFlavor")
        kparams.addStringIfDefined("flavorParamsId", self.flavorParamsId)
        return kparams

    def getFlavorParamsId(self):
        return self.flavorParamsId

    def setFlavorParamsId(self, newFlavorParamsId):
        self.flavorParamsId = newFlavorParamsId


# @package Kaltura
# @subpackage Client
class KalturaDistributionValidationErrorMissingMetadata(KalturaDistributionValidationError):
    def __init__(self,
            action=NotImplemented,
            errorType=NotImplemented,
            description=NotImplemented,
            fieldName=NotImplemented):
        KalturaDistributionValidationError.__init__(self,
            action,
            errorType,
            description)

        # @var string
        self.fieldName = fieldName


    PROPERTY_LOADERS = {
        'fieldName': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDistributionValidationError.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionValidationErrorMissingMetadata.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionValidationError.toParams(self)
        kparams.put("objectType", "KalturaDistributionValidationErrorMissingMetadata")
        kparams.addStringIfDefined("fieldName", self.fieldName)
        return kparams

    def getFieldName(self):
        return self.fieldName

    def setFieldName(self, newFieldName):
        self.fieldName = newFieldName


# @package Kaltura
# @subpackage Client
class KalturaDistributionValidationErrorMissingThumbnail(KalturaDistributionValidationError):
    def __init__(self,
            action=NotImplemented,
            errorType=NotImplemented,
            description=NotImplemented,
            dimensions=NotImplemented):
        KalturaDistributionValidationError.__init__(self,
            action,
            errorType,
            description)

        # @var KalturaDistributionThumbDimensions
        self.dimensions = dimensions


    PROPERTY_LOADERS = {
        'dimensions': (KalturaObjectFactory.create, KalturaDistributionThumbDimensions), 
    }

    def fromXml(self, node):
        KalturaDistributionValidationError.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionValidationErrorMissingThumbnail.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionValidationError.toParams(self)
        kparams.put("objectType", "KalturaDistributionValidationErrorMissingThumbnail")
        kparams.addObjectIfDefined("dimensions", self.dimensions)
        return kparams

    def getDimensions(self):
        return self.dimensions

    def setDimensions(self, newDimensions):
        self.dimensions = newDimensions


# @package Kaltura
# @subpackage Client
class KalturaEntryDistributionListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaEntryDistribution
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaEntryDistribution), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEntryDistributionListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaEntryDistributionListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionJobProviderData(KalturaDistributionJobProviderData):
    def __init__(self,
            xml=NotImplemented,
            resultParseData=NotImplemented,
            resultParserType=NotImplemented):
        KalturaDistributionJobProviderData.__init__(self)

        # @var string
        self.xml = xml

        # @var string
        self.resultParseData = resultParseData

        # @var KalturaGenericDistributionProviderParser
        self.resultParserType = resultParserType


    PROPERTY_LOADERS = {
        'xml': getXmlNodeText, 
        'resultParseData': getXmlNodeText, 
        'resultParserType': (KalturaEnumsFactory.createInt, "KalturaGenericDistributionProviderParser"), 
    }

    def fromXml(self, node):
        KalturaDistributionJobProviderData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaGenericDistributionJobProviderData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionJobProviderData.toParams(self)
        kparams.put("objectType", "KalturaGenericDistributionJobProviderData")
        kparams.addStringIfDefined("xml", self.xml)
        kparams.addStringIfDefined("resultParseData", self.resultParseData)
        kparams.addIntEnumIfDefined("resultParserType", self.resultParserType)
        return kparams

    def getXml(self):
        return self.xml

    def setXml(self, newXml):
        self.xml = newXml

    def getResultParseData(self):
        return self.resultParseData

    def setResultParseData(self, newResultParseData):
        self.resultParseData = newResultParseData

    def getResultParserType(self):
        return self.resultParserType

    def setResultParserType(self, newResultParserType):
        self.resultParserType = newResultParserType


# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProfile(KalturaDistributionProfile):
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
            genericProviderId=NotImplemented,
            submitAction=NotImplemented,
            updateAction=NotImplemented,
            deleteAction=NotImplemented,
            fetchReportAction=NotImplemented,
            updateRequiredEntryFields=NotImplemented,
            updateRequiredMetadataXPaths=NotImplemented):
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

        # @var int
        # @insertonly
        self.genericProviderId = genericProviderId

        # @var KalturaGenericDistributionProfileAction
        self.submitAction = submitAction

        # @var KalturaGenericDistributionProfileAction
        self.updateAction = updateAction

        # @var KalturaGenericDistributionProfileAction
        self.deleteAction = deleteAction

        # @var KalturaGenericDistributionProfileAction
        self.fetchReportAction = fetchReportAction

        # @var string
        self.updateRequiredEntryFields = updateRequiredEntryFields

        # @var string
        self.updateRequiredMetadataXPaths = updateRequiredMetadataXPaths


    PROPERTY_LOADERS = {
        'genericProviderId': getXmlNodeInt, 
        'submitAction': (KalturaObjectFactory.create, KalturaGenericDistributionProfileAction), 
        'updateAction': (KalturaObjectFactory.create, KalturaGenericDistributionProfileAction), 
        'deleteAction': (KalturaObjectFactory.create, KalturaGenericDistributionProfileAction), 
        'fetchReportAction': (KalturaObjectFactory.create, KalturaGenericDistributionProfileAction), 
        'updateRequiredEntryFields': getXmlNodeText, 
        'updateRequiredMetadataXPaths': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaGenericDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaGenericDistributionProfile")
        kparams.addIntIfDefined("genericProviderId", self.genericProviderId)
        kparams.addObjectIfDefined("submitAction", self.submitAction)
        kparams.addObjectIfDefined("updateAction", self.updateAction)
        kparams.addObjectIfDefined("deleteAction", self.deleteAction)
        kparams.addObjectIfDefined("fetchReportAction", self.fetchReportAction)
        kparams.addStringIfDefined("updateRequiredEntryFields", self.updateRequiredEntryFields)
        kparams.addStringIfDefined("updateRequiredMetadataXPaths", self.updateRequiredMetadataXPaths)
        return kparams

    def getGenericProviderId(self):
        return self.genericProviderId

    def setGenericProviderId(self, newGenericProviderId):
        self.genericProviderId = newGenericProviderId

    def getSubmitAction(self):
        return self.submitAction

    def setSubmitAction(self, newSubmitAction):
        self.submitAction = newSubmitAction

    def getUpdateAction(self):
        return self.updateAction

    def setUpdateAction(self, newUpdateAction):
        self.updateAction = newUpdateAction

    def getDeleteAction(self):
        return self.deleteAction

    def setDeleteAction(self, newDeleteAction):
        self.deleteAction = newDeleteAction

    def getFetchReportAction(self):
        return self.fetchReportAction

    def setFetchReportAction(self, newFetchReportAction):
        self.fetchReportAction = newFetchReportAction

    def getUpdateRequiredEntryFields(self):
        return self.updateRequiredEntryFields

    def setUpdateRequiredEntryFields(self, newUpdateRequiredEntryFields):
        self.updateRequiredEntryFields = newUpdateRequiredEntryFields

    def getUpdateRequiredMetadataXPaths(self):
        return self.updateRequiredMetadataXPaths

    def setUpdateRequiredMetadataXPaths(self, newUpdateRequiredMetadataXPaths):
        self.updateRequiredMetadataXPaths = newUpdateRequiredMetadataXPaths


# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProviderActionBaseFilter(KalturaFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            genericDistributionProviderIdEqual=NotImplemented,
            genericDistributionProviderIdIn=NotImplemented,
            actionEqual=NotImplemented,
            actionIn=NotImplemented):
        KalturaFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var int
        self.idEqual = idEqual

        # @var string
        self.idIn = idIn

        # @var int
        self.createdAtGreaterThanOrEqual = createdAtGreaterThanOrEqual

        # @var int
        self.createdAtLessThanOrEqual = createdAtLessThanOrEqual

        # @var int
        self.updatedAtGreaterThanOrEqual = updatedAtGreaterThanOrEqual

        # @var int
        self.updatedAtLessThanOrEqual = updatedAtLessThanOrEqual

        # @var int
        self.genericDistributionProviderIdEqual = genericDistributionProviderIdEqual

        # @var string
        self.genericDistributionProviderIdIn = genericDistributionProviderIdIn

        # @var KalturaDistributionAction
        self.actionEqual = actionEqual

        # @var string
        self.actionIn = actionIn


    PROPERTY_LOADERS = {
        'idEqual': getXmlNodeInt, 
        'idIn': getXmlNodeText, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'updatedAtGreaterThanOrEqual': getXmlNodeInt, 
        'updatedAtLessThanOrEqual': getXmlNodeInt, 
        'genericDistributionProviderIdEqual': getXmlNodeInt, 
        'genericDistributionProviderIdIn': getXmlNodeText, 
        'actionEqual': (KalturaEnumsFactory.createInt, "KalturaDistributionAction"), 
        'actionIn': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaGenericDistributionProviderActionBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaFilter.toParams(self)
        kparams.put("objectType", "KalturaGenericDistributionProviderActionBaseFilter")
        kparams.addIntIfDefined("idEqual", self.idEqual)
        kparams.addStringIfDefined("idIn", self.idIn)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        kparams.addIntIfDefined("updatedAtGreaterThanOrEqual", self.updatedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("updatedAtLessThanOrEqual", self.updatedAtLessThanOrEqual)
        kparams.addIntIfDefined("genericDistributionProviderIdEqual", self.genericDistributionProviderIdEqual)
        kparams.addStringIfDefined("genericDistributionProviderIdIn", self.genericDistributionProviderIdIn)
        kparams.addIntEnumIfDefined("actionEqual", self.actionEqual)
        kparams.addStringIfDefined("actionIn", self.actionIn)
        return kparams

    def getIdEqual(self):
        return self.idEqual

    def setIdEqual(self, newIdEqual):
        self.idEqual = newIdEqual

    def getIdIn(self):
        return self.idIn

    def setIdIn(self, newIdIn):
        self.idIn = newIdIn

    def getCreatedAtGreaterThanOrEqual(self):
        return self.createdAtGreaterThanOrEqual

    def setCreatedAtGreaterThanOrEqual(self, newCreatedAtGreaterThanOrEqual):
        self.createdAtGreaterThanOrEqual = newCreatedAtGreaterThanOrEqual

    def getCreatedAtLessThanOrEqual(self):
        return self.createdAtLessThanOrEqual

    def setCreatedAtLessThanOrEqual(self, newCreatedAtLessThanOrEqual):
        self.createdAtLessThanOrEqual = newCreatedAtLessThanOrEqual

    def getUpdatedAtGreaterThanOrEqual(self):
        return self.updatedAtGreaterThanOrEqual

    def setUpdatedAtGreaterThanOrEqual(self, newUpdatedAtGreaterThanOrEqual):
        self.updatedAtGreaterThanOrEqual = newUpdatedAtGreaterThanOrEqual

    def getUpdatedAtLessThanOrEqual(self):
        return self.updatedAtLessThanOrEqual

    def setUpdatedAtLessThanOrEqual(self, newUpdatedAtLessThanOrEqual):
        self.updatedAtLessThanOrEqual = newUpdatedAtLessThanOrEqual

    def getGenericDistributionProviderIdEqual(self):
        return self.genericDistributionProviderIdEqual

    def setGenericDistributionProviderIdEqual(self, newGenericDistributionProviderIdEqual):
        self.genericDistributionProviderIdEqual = newGenericDistributionProviderIdEqual

    def getGenericDistributionProviderIdIn(self):
        return self.genericDistributionProviderIdIn

    def setGenericDistributionProviderIdIn(self, newGenericDistributionProviderIdIn):
        self.genericDistributionProviderIdIn = newGenericDistributionProviderIdIn

    def getActionEqual(self):
        return self.actionEqual

    def setActionEqual(self, newActionEqual):
        self.actionEqual = newActionEqual

    def getActionIn(self):
        return self.actionIn

    def setActionIn(self, newActionIn):
        self.actionIn = newActionIn


# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProviderActionListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaGenericDistributionProviderAction
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaGenericDistributionProviderAction), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaGenericDistributionProviderActionListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaGenericDistributionProviderActionListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProviderListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaGenericDistributionProvider
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaGenericDistributionProvider), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaGenericDistributionProviderListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaGenericDistributionProviderListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaSyndicationDistributionProfile(KalturaDistributionProfile):
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
            xsl=NotImplemented,
            feedId=NotImplemented):
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
        self.xsl = xsl

        # @var string
        # @readonly
        self.feedId = feedId


    PROPERTY_LOADERS = {
        'xsl': getXmlNodeText, 
        'feedId': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDistributionProfile.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSyndicationDistributionProfile.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProfile.toParams(self)
        kparams.put("objectType", "KalturaSyndicationDistributionProfile")
        kparams.addStringIfDefined("xsl", self.xsl)
        return kparams

    def getXsl(self):
        return self.xsl

    def setXsl(self, newXsl):
        self.xsl = newXsl

    def getFeedId(self):
        return self.feedId


# @package Kaltura
# @subpackage Client
class KalturaSyndicationDistributionProvider(KalturaDistributionProvider):
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
        self.fromXmlImpl(node, KalturaSyndicationDistributionProvider.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProvider.toParams(self)
        kparams.put("objectType", "KalturaSyndicationDistributionProvider")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDistributionDeleteJobData(KalturaDistributionJobData):
    def __init__(self,
            distributionProfileId=NotImplemented,
            distributionProfile=NotImplemented,
            entryDistributionId=NotImplemented,
            entryDistribution=NotImplemented,
            remoteId=NotImplemented,
            providerType=NotImplemented,
            providerData=NotImplemented,
            results=NotImplemented,
            sentData=NotImplemented,
            mediaFiles=NotImplemented,
            keepDistributionItem=NotImplemented):
        KalturaDistributionJobData.__init__(self,
            distributionProfileId,
            distributionProfile,
            entryDistributionId,
            entryDistribution,
            remoteId,
            providerType,
            providerData,
            results,
            sentData,
            mediaFiles)

        # Flag signifying that the associated distribution item should not be moved to 'removed' status
        # @var bool
        self.keepDistributionItem = keepDistributionItem


    PROPERTY_LOADERS = {
        'keepDistributionItem': getXmlNodeBool, 
    }

    def fromXml(self, node):
        KalturaDistributionJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionDeleteJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionJobData.toParams(self)
        kparams.put("objectType", "KalturaDistributionDeleteJobData")
        kparams.addBoolIfDefined("keepDistributionItem", self.keepDistributionItem)
        return kparams

    def getKeepDistributionItem(self):
        return self.keepDistributionItem

    def setKeepDistributionItem(self, newKeepDistributionItem):
        self.keepDistributionItem = newKeepDistributionItem


# @package Kaltura
# @subpackage Client
class KalturaDistributionFetchReportJobData(KalturaDistributionJobData):
    def __init__(self,
            distributionProfileId=NotImplemented,
            distributionProfile=NotImplemented,
            entryDistributionId=NotImplemented,
            entryDistribution=NotImplemented,
            remoteId=NotImplemented,
            providerType=NotImplemented,
            providerData=NotImplemented,
            results=NotImplemented,
            sentData=NotImplemented,
            mediaFiles=NotImplemented,
            plays=NotImplemented,
            views=NotImplemented):
        KalturaDistributionJobData.__init__(self,
            distributionProfileId,
            distributionProfile,
            entryDistributionId,
            entryDistribution,
            remoteId,
            providerType,
            providerData,
            results,
            sentData,
            mediaFiles)

        # @var int
        self.plays = plays

        # @var int
        self.views = views


    PROPERTY_LOADERS = {
        'plays': getXmlNodeInt, 
        'views': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaDistributionJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionFetchReportJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionJobData.toParams(self)
        kparams.put("objectType", "KalturaDistributionFetchReportJobData")
        kparams.addIntIfDefined("plays", self.plays)
        kparams.addIntIfDefined("views", self.views)
        return kparams

    def getPlays(self):
        return self.plays

    def setPlays(self, newPlays):
        self.plays = newPlays

    def getViews(self):
        return self.views

    def setViews(self, newViews):
        self.views = newViews


# @package Kaltura
# @subpackage Client
class KalturaDistributionProfileFilter(KalturaDistributionProfileBaseFilter):
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
        KalturaDistributionProfileBaseFilter.__init__(self,
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
        KalturaDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaDistributionProfileFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDistributionProviderFilter(KalturaDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDistributionSubmitJobData(KalturaDistributionJobData):
    def __init__(self,
            distributionProfileId=NotImplemented,
            distributionProfile=NotImplemented,
            entryDistributionId=NotImplemented,
            entryDistribution=NotImplemented,
            remoteId=NotImplemented,
            providerType=NotImplemented,
            providerData=NotImplemented,
            results=NotImplemented,
            sentData=NotImplemented,
            mediaFiles=NotImplemented):
        KalturaDistributionJobData.__init__(self,
            distributionProfileId,
            distributionProfile,
            entryDistributionId,
            entryDistribution,
            remoteId,
            providerType,
            providerData,
            results,
            sentData,
            mediaFiles)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDistributionJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionSubmitJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionJobData.toParams(self)
        kparams.put("objectType", "KalturaDistributionSubmitJobData")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDistributionUpdateJobData(KalturaDistributionJobData):
    def __init__(self,
            distributionProfileId=NotImplemented,
            distributionProfile=NotImplemented,
            entryDistributionId=NotImplemented,
            entryDistribution=NotImplemented,
            remoteId=NotImplemented,
            providerType=NotImplemented,
            providerData=NotImplemented,
            results=NotImplemented,
            sentData=NotImplemented,
            mediaFiles=NotImplemented):
        KalturaDistributionJobData.__init__(self,
            distributionProfileId,
            distributionProfile,
            entryDistributionId,
            entryDistribution,
            remoteId,
            providerType,
            providerData,
            results,
            sentData,
            mediaFiles)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDistributionJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionUpdateJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionJobData.toParams(self)
        kparams.put("objectType", "KalturaDistributionUpdateJobData")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDistributionValidationErrorInvalidMetadata(KalturaDistributionValidationErrorInvalidData):
    def __init__(self,
            action=NotImplemented,
            errorType=NotImplemented,
            description=NotImplemented,
            fieldName=NotImplemented,
            validationErrorType=NotImplemented,
            validationErrorParam=NotImplemented,
            metadataProfileId=NotImplemented):
        KalturaDistributionValidationErrorInvalidData.__init__(self,
            action,
            errorType,
            description,
            fieldName,
            validationErrorType,
            validationErrorParam)

        # @var int
        self.metadataProfileId = metadataProfileId


    PROPERTY_LOADERS = {
        'metadataProfileId': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaDistributionValidationErrorInvalidData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionValidationErrorInvalidMetadata.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionValidationErrorInvalidData.toParams(self)
        kparams.put("objectType", "KalturaDistributionValidationErrorInvalidMetadata")
        kparams.addIntIfDefined("metadataProfileId", self.metadataProfileId)
        return kparams

    def getMetadataProfileId(self):
        return self.metadataProfileId

    def setMetadataProfileId(self, newMetadataProfileId):
        self.metadataProfileId = newMetadataProfileId


# @package Kaltura
# @subpackage Client
class KalturaEntryDistributionBaseFilter(KalturaRelatedFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            submittedAtGreaterThanOrEqual=NotImplemented,
            submittedAtLessThanOrEqual=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented,
            distributionProfileIdEqual=NotImplemented,
            distributionProfileIdIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            dirtyStatusEqual=NotImplemented,
            dirtyStatusIn=NotImplemented,
            sunriseGreaterThanOrEqual=NotImplemented,
            sunriseLessThanOrEqual=NotImplemented,
            sunsetGreaterThanOrEqual=NotImplemented,
            sunsetLessThanOrEqual=NotImplemented):
        KalturaRelatedFilter.__init__(self,
            orderBy,
            advancedSearch)

        # @var int
        self.idEqual = idEqual

        # @var string
        self.idIn = idIn

        # @var int
        self.createdAtGreaterThanOrEqual = createdAtGreaterThanOrEqual

        # @var int
        self.createdAtLessThanOrEqual = createdAtLessThanOrEqual

        # @var int
        self.updatedAtGreaterThanOrEqual = updatedAtGreaterThanOrEqual

        # @var int
        self.updatedAtLessThanOrEqual = updatedAtLessThanOrEqual

        # @var int
        self.submittedAtGreaterThanOrEqual = submittedAtGreaterThanOrEqual

        # @var int
        self.submittedAtLessThanOrEqual = submittedAtLessThanOrEqual

        # @var string
        self.entryIdEqual = entryIdEqual

        # @var string
        self.entryIdIn = entryIdIn

        # @var int
        self.distributionProfileIdEqual = distributionProfileIdEqual

        # @var string
        self.distributionProfileIdIn = distributionProfileIdIn

        # @var KalturaEntryDistributionStatus
        self.statusEqual = statusEqual

        # @var string
        self.statusIn = statusIn

        # @var KalturaEntryDistributionFlag
        self.dirtyStatusEqual = dirtyStatusEqual

        # @var string
        self.dirtyStatusIn = dirtyStatusIn

        # @var int
        self.sunriseGreaterThanOrEqual = sunriseGreaterThanOrEqual

        # @var int
        self.sunriseLessThanOrEqual = sunriseLessThanOrEqual

        # @var int
        self.sunsetGreaterThanOrEqual = sunsetGreaterThanOrEqual

        # @var int
        self.sunsetLessThanOrEqual = sunsetLessThanOrEqual


    PROPERTY_LOADERS = {
        'idEqual': getXmlNodeInt, 
        'idIn': getXmlNodeText, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'updatedAtGreaterThanOrEqual': getXmlNodeInt, 
        'updatedAtLessThanOrEqual': getXmlNodeInt, 
        'submittedAtGreaterThanOrEqual': getXmlNodeInt, 
        'submittedAtLessThanOrEqual': getXmlNodeInt, 
        'entryIdEqual': getXmlNodeText, 
        'entryIdIn': getXmlNodeText, 
        'distributionProfileIdEqual': getXmlNodeInt, 
        'distributionProfileIdIn': getXmlNodeText, 
        'statusEqual': (KalturaEnumsFactory.createInt, "KalturaEntryDistributionStatus"), 
        'statusIn': getXmlNodeText, 
        'dirtyStatusEqual': (KalturaEnumsFactory.createInt, "KalturaEntryDistributionFlag"), 
        'dirtyStatusIn': getXmlNodeText, 
        'sunriseGreaterThanOrEqual': getXmlNodeInt, 
        'sunriseLessThanOrEqual': getXmlNodeInt, 
        'sunsetGreaterThanOrEqual': getXmlNodeInt, 
        'sunsetLessThanOrEqual': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaRelatedFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEntryDistributionBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaRelatedFilter.toParams(self)
        kparams.put("objectType", "KalturaEntryDistributionBaseFilter")
        kparams.addIntIfDefined("idEqual", self.idEqual)
        kparams.addStringIfDefined("idIn", self.idIn)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        kparams.addIntIfDefined("updatedAtGreaterThanOrEqual", self.updatedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("updatedAtLessThanOrEqual", self.updatedAtLessThanOrEqual)
        kparams.addIntIfDefined("submittedAtGreaterThanOrEqual", self.submittedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("submittedAtLessThanOrEqual", self.submittedAtLessThanOrEqual)
        kparams.addStringIfDefined("entryIdEqual", self.entryIdEqual)
        kparams.addStringIfDefined("entryIdIn", self.entryIdIn)
        kparams.addIntIfDefined("distributionProfileIdEqual", self.distributionProfileIdEqual)
        kparams.addStringIfDefined("distributionProfileIdIn", self.distributionProfileIdIn)
        kparams.addIntEnumIfDefined("statusEqual", self.statusEqual)
        kparams.addStringIfDefined("statusIn", self.statusIn)
        kparams.addIntEnumIfDefined("dirtyStatusEqual", self.dirtyStatusEqual)
        kparams.addStringIfDefined("dirtyStatusIn", self.dirtyStatusIn)
        kparams.addIntIfDefined("sunriseGreaterThanOrEqual", self.sunriseGreaterThanOrEqual)
        kparams.addIntIfDefined("sunriseLessThanOrEqual", self.sunriseLessThanOrEqual)
        kparams.addIntIfDefined("sunsetGreaterThanOrEqual", self.sunsetGreaterThanOrEqual)
        kparams.addIntIfDefined("sunsetLessThanOrEqual", self.sunsetLessThanOrEqual)
        return kparams

    def getIdEqual(self):
        return self.idEqual

    def setIdEqual(self, newIdEqual):
        self.idEqual = newIdEqual

    def getIdIn(self):
        return self.idIn

    def setIdIn(self, newIdIn):
        self.idIn = newIdIn

    def getCreatedAtGreaterThanOrEqual(self):
        return self.createdAtGreaterThanOrEqual

    def setCreatedAtGreaterThanOrEqual(self, newCreatedAtGreaterThanOrEqual):
        self.createdAtGreaterThanOrEqual = newCreatedAtGreaterThanOrEqual

    def getCreatedAtLessThanOrEqual(self):
        return self.createdAtLessThanOrEqual

    def setCreatedAtLessThanOrEqual(self, newCreatedAtLessThanOrEqual):
        self.createdAtLessThanOrEqual = newCreatedAtLessThanOrEqual

    def getUpdatedAtGreaterThanOrEqual(self):
        return self.updatedAtGreaterThanOrEqual

    def setUpdatedAtGreaterThanOrEqual(self, newUpdatedAtGreaterThanOrEqual):
        self.updatedAtGreaterThanOrEqual = newUpdatedAtGreaterThanOrEqual

    def getUpdatedAtLessThanOrEqual(self):
        return self.updatedAtLessThanOrEqual

    def setUpdatedAtLessThanOrEqual(self, newUpdatedAtLessThanOrEqual):
        self.updatedAtLessThanOrEqual = newUpdatedAtLessThanOrEqual

    def getSubmittedAtGreaterThanOrEqual(self):
        return self.submittedAtGreaterThanOrEqual

    def setSubmittedAtGreaterThanOrEqual(self, newSubmittedAtGreaterThanOrEqual):
        self.submittedAtGreaterThanOrEqual = newSubmittedAtGreaterThanOrEqual

    def getSubmittedAtLessThanOrEqual(self):
        return self.submittedAtLessThanOrEqual

    def setSubmittedAtLessThanOrEqual(self, newSubmittedAtLessThanOrEqual):
        self.submittedAtLessThanOrEqual = newSubmittedAtLessThanOrEqual

    def getEntryIdEqual(self):
        return self.entryIdEqual

    def setEntryIdEqual(self, newEntryIdEqual):
        self.entryIdEqual = newEntryIdEqual

    def getEntryIdIn(self):
        return self.entryIdIn

    def setEntryIdIn(self, newEntryIdIn):
        self.entryIdIn = newEntryIdIn

    def getDistributionProfileIdEqual(self):
        return self.distributionProfileIdEqual

    def setDistributionProfileIdEqual(self, newDistributionProfileIdEqual):
        self.distributionProfileIdEqual = newDistributionProfileIdEqual

    def getDistributionProfileIdIn(self):
        return self.distributionProfileIdIn

    def setDistributionProfileIdIn(self, newDistributionProfileIdIn):
        self.distributionProfileIdIn = newDistributionProfileIdIn

    def getStatusEqual(self):
        return self.statusEqual

    def setStatusEqual(self, newStatusEqual):
        self.statusEqual = newStatusEqual

    def getStatusIn(self):
        return self.statusIn

    def setStatusIn(self, newStatusIn):
        self.statusIn = newStatusIn

    def getDirtyStatusEqual(self):
        return self.dirtyStatusEqual

    def setDirtyStatusEqual(self, newDirtyStatusEqual):
        self.dirtyStatusEqual = newDirtyStatusEqual

    def getDirtyStatusIn(self):
        return self.dirtyStatusIn

    def setDirtyStatusIn(self, newDirtyStatusIn):
        self.dirtyStatusIn = newDirtyStatusIn

    def getSunriseGreaterThanOrEqual(self):
        return self.sunriseGreaterThanOrEqual

    def setSunriseGreaterThanOrEqual(self, newSunriseGreaterThanOrEqual):
        self.sunriseGreaterThanOrEqual = newSunriseGreaterThanOrEqual

    def getSunriseLessThanOrEqual(self):
        return self.sunriseLessThanOrEqual

    def setSunriseLessThanOrEqual(self, newSunriseLessThanOrEqual):
        self.sunriseLessThanOrEqual = newSunriseLessThanOrEqual

    def getSunsetGreaterThanOrEqual(self):
        return self.sunsetGreaterThanOrEqual

    def setSunsetGreaterThanOrEqual(self, newSunsetGreaterThanOrEqual):
        self.sunsetGreaterThanOrEqual = newSunsetGreaterThanOrEqual

    def getSunsetLessThanOrEqual(self):
        return self.sunsetLessThanOrEqual

    def setSunsetLessThanOrEqual(self, newSunsetLessThanOrEqual):
        self.sunsetLessThanOrEqual = newSunsetLessThanOrEqual


# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProviderActionFilter(KalturaGenericDistributionProviderActionBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            genericDistributionProviderIdEqual=NotImplemented,
            genericDistributionProviderIdIn=NotImplemented,
            actionEqual=NotImplemented,
            actionIn=NotImplemented):
        KalturaGenericDistributionProviderActionBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            genericDistributionProviderIdEqual,
            genericDistributionProviderIdIn,
            actionEqual,
            actionIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaGenericDistributionProviderActionBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaGenericDistributionProviderActionFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaGenericDistributionProviderActionBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaGenericDistributionProviderActionFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaConfigurableDistributionProfileBaseFilter(KalturaDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaConfigurableDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaConfigurableDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDistributionDisableJobData(KalturaDistributionUpdateJobData):
    def __init__(self,
            distributionProfileId=NotImplemented,
            distributionProfile=NotImplemented,
            entryDistributionId=NotImplemented,
            entryDistribution=NotImplemented,
            remoteId=NotImplemented,
            providerType=NotImplemented,
            providerData=NotImplemented,
            results=NotImplemented,
            sentData=NotImplemented,
            mediaFiles=NotImplemented):
        KalturaDistributionUpdateJobData.__init__(self,
            distributionProfileId,
            distributionProfile,
            entryDistributionId,
            entryDistribution,
            remoteId,
            providerType,
            providerData,
            results,
            sentData,
            mediaFiles)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDistributionUpdateJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionDisableJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionUpdateJobData.toParams(self)
        kparams.put("objectType", "KalturaDistributionDisableJobData")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaDistributionEnableJobData(KalturaDistributionUpdateJobData):
    def __init__(self,
            distributionProfileId=NotImplemented,
            distributionProfile=NotImplemented,
            entryDistributionId=NotImplemented,
            entryDistribution=NotImplemented,
            remoteId=NotImplemented,
            providerType=NotImplemented,
            providerData=NotImplemented,
            results=NotImplemented,
            sentData=NotImplemented,
            mediaFiles=NotImplemented):
        KalturaDistributionUpdateJobData.__init__(self,
            distributionProfileId,
            distributionProfile,
            entryDistributionId,
            entryDistribution,
            remoteId,
            providerType,
            providerData,
            results,
            sentData,
            mediaFiles)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaDistributionUpdateJobData.fromXml(self, node)
        self.fromXmlImpl(node, KalturaDistributionEnableJobData.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionUpdateJobData.toParams(self)
        kparams.put("objectType", "KalturaDistributionEnableJobData")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaEntryDistributionFilter(KalturaEntryDistributionBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            submittedAtGreaterThanOrEqual=NotImplemented,
            submittedAtLessThanOrEqual=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented,
            distributionProfileIdEqual=NotImplemented,
            distributionProfileIdIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            dirtyStatusEqual=NotImplemented,
            dirtyStatusIn=NotImplemented,
            sunriseGreaterThanOrEqual=NotImplemented,
            sunriseLessThanOrEqual=NotImplemented,
            sunsetGreaterThanOrEqual=NotImplemented,
            sunsetLessThanOrEqual=NotImplemented):
        KalturaEntryDistributionBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            submittedAtGreaterThanOrEqual,
            submittedAtLessThanOrEqual,
            entryIdEqual,
            entryIdIn,
            distributionProfileIdEqual,
            distributionProfileIdIn,
            statusEqual,
            statusIn,
            dirtyStatusEqual,
            dirtyStatusIn,
            sunriseGreaterThanOrEqual,
            sunriseLessThanOrEqual,
            sunsetGreaterThanOrEqual,
            sunsetLessThanOrEqual)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaEntryDistributionBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEntryDistributionFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaEntryDistributionBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaEntryDistributionFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProfileBaseFilter(KalturaDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaGenericDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaGenericDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            isDefaultEqual=NotImplemented,
            isDefaultIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented):
        KalturaDistributionProviderFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)

        # @var int
        self.idEqual = idEqual

        # @var string
        self.idIn = idIn

        # @var int
        self.createdAtGreaterThanOrEqual = createdAtGreaterThanOrEqual

        # @var int
        self.createdAtLessThanOrEqual = createdAtLessThanOrEqual

        # @var int
        self.updatedAtGreaterThanOrEqual = updatedAtGreaterThanOrEqual

        # @var int
        self.updatedAtLessThanOrEqual = updatedAtLessThanOrEqual

        # @var int
        self.partnerIdEqual = partnerIdEqual

        # @var string
        self.partnerIdIn = partnerIdIn

        # @var KalturaNullableBoolean
        self.isDefaultEqual = isDefaultEqual

        # @var string
        self.isDefaultIn = isDefaultIn

        # @var KalturaGenericDistributionProviderStatus
        self.statusEqual = statusEqual

        # @var string
        self.statusIn = statusIn


    PROPERTY_LOADERS = {
        'idEqual': getXmlNodeInt, 
        'idIn': getXmlNodeText, 
        'createdAtGreaterThanOrEqual': getXmlNodeInt, 
        'createdAtLessThanOrEqual': getXmlNodeInt, 
        'updatedAtGreaterThanOrEqual': getXmlNodeInt, 
        'updatedAtLessThanOrEqual': getXmlNodeInt, 
        'partnerIdEqual': getXmlNodeInt, 
        'partnerIdIn': getXmlNodeText, 
        'isDefaultEqual': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
        'isDefaultIn': getXmlNodeText, 
        'statusEqual': (KalturaEnumsFactory.createInt, "KalturaGenericDistributionProviderStatus"), 
        'statusIn': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaDistributionProviderFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaGenericDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaGenericDistributionProviderBaseFilter")
        kparams.addIntIfDefined("idEqual", self.idEqual)
        kparams.addStringIfDefined("idIn", self.idIn)
        kparams.addIntIfDefined("createdAtGreaterThanOrEqual", self.createdAtGreaterThanOrEqual)
        kparams.addIntIfDefined("createdAtLessThanOrEqual", self.createdAtLessThanOrEqual)
        kparams.addIntIfDefined("updatedAtGreaterThanOrEqual", self.updatedAtGreaterThanOrEqual)
        kparams.addIntIfDefined("updatedAtLessThanOrEqual", self.updatedAtLessThanOrEqual)
        kparams.addIntIfDefined("partnerIdEqual", self.partnerIdEqual)
        kparams.addStringIfDefined("partnerIdIn", self.partnerIdIn)
        kparams.addIntEnumIfDefined("isDefaultEqual", self.isDefaultEqual)
        kparams.addStringIfDefined("isDefaultIn", self.isDefaultIn)
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

    def getCreatedAtGreaterThanOrEqual(self):
        return self.createdAtGreaterThanOrEqual

    def setCreatedAtGreaterThanOrEqual(self, newCreatedAtGreaterThanOrEqual):
        self.createdAtGreaterThanOrEqual = newCreatedAtGreaterThanOrEqual

    def getCreatedAtLessThanOrEqual(self):
        return self.createdAtLessThanOrEqual

    def setCreatedAtLessThanOrEqual(self, newCreatedAtLessThanOrEqual):
        self.createdAtLessThanOrEqual = newCreatedAtLessThanOrEqual

    def getUpdatedAtGreaterThanOrEqual(self):
        return self.updatedAtGreaterThanOrEqual

    def setUpdatedAtGreaterThanOrEqual(self, newUpdatedAtGreaterThanOrEqual):
        self.updatedAtGreaterThanOrEqual = newUpdatedAtGreaterThanOrEqual

    def getUpdatedAtLessThanOrEqual(self):
        return self.updatedAtLessThanOrEqual

    def setUpdatedAtLessThanOrEqual(self, newUpdatedAtLessThanOrEqual):
        self.updatedAtLessThanOrEqual = newUpdatedAtLessThanOrEqual

    def getPartnerIdEqual(self):
        return self.partnerIdEqual

    def setPartnerIdEqual(self, newPartnerIdEqual):
        self.partnerIdEqual = newPartnerIdEqual

    def getPartnerIdIn(self):
        return self.partnerIdIn

    def setPartnerIdIn(self, newPartnerIdIn):
        self.partnerIdIn = newPartnerIdIn

    def getIsDefaultEqual(self):
        return self.isDefaultEqual

    def setIsDefaultEqual(self, newIsDefaultEqual):
        self.isDefaultEqual = newIsDefaultEqual

    def getIsDefaultIn(self):
        return self.isDefaultIn

    def setIsDefaultIn(self, newIsDefaultIn):
        self.isDefaultIn = newIsDefaultIn

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
class KalturaSyndicationDistributionProfileBaseFilter(KalturaDistributionProfileFilter):
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
        self.fromXmlImpl(node, KalturaSyndicationDistributionProfileBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProfileFilter.toParams(self)
        kparams.put("objectType", "KalturaSyndicationDistributionProfileBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSyndicationDistributionProviderBaseFilter(KalturaDistributionProviderFilter):
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
        self.fromXmlImpl(node, KalturaSyndicationDistributionProviderBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaDistributionProviderFilter.toParams(self)
        kparams.put("objectType", "KalturaSyndicationDistributionProviderBaseFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaConfigurableDistributionProfileFilter(KalturaConfigurableDistributionProfileBaseFilter):
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
        KalturaConfigurableDistributionProfileBaseFilter.__init__(self,
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
        KalturaConfigurableDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaConfigurableDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaConfigurableDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaConfigurableDistributionProfileFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProfileFilter(KalturaGenericDistributionProfileBaseFilter):
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
        KalturaGenericDistributionProfileBaseFilter.__init__(self,
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
        KalturaGenericDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaGenericDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaGenericDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaGenericDistributionProfileFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProviderFilter(KalturaGenericDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            isDefaultEqual=NotImplemented,
            isDefaultIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented):
        KalturaGenericDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn,
            idEqual,
            idIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            partnerIdEqual,
            partnerIdIn,
            isDefaultEqual,
            isDefaultIn,
            statusEqual,
            statusIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaGenericDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaGenericDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaGenericDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaGenericDistributionProviderFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSyndicationDistributionProfileFilter(KalturaSyndicationDistributionProfileBaseFilter):
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
        KalturaSyndicationDistributionProfileBaseFilter.__init__(self,
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
        KalturaSyndicationDistributionProfileBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSyndicationDistributionProfileFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSyndicationDistributionProfileBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaSyndicationDistributionProfileFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaSyndicationDistributionProviderFilter(KalturaSyndicationDistributionProviderBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            typeEqual=NotImplemented,
            typeIn=NotImplemented):
        KalturaSyndicationDistributionProviderBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            typeEqual,
            typeIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaSyndicationDistributionProviderBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaSyndicationDistributionProviderFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSyndicationDistributionProviderBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaSyndicationDistributionProviderFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaDistributionProfileService(KalturaServiceBase):
    """Distribution Profile service"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, distributionProfile):
        """Add new Distribution Profile"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("distributionProfile", distributionProfile)
        self.client.queueServiceActionCall("contentdistribution_distributionprofile", "add", KalturaDistributionProfile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDistributionProfile)

    def get(self, id):
        """Get Distribution Profile by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("contentdistribution_distributionprofile", "get", KalturaDistributionProfile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDistributionProfile)

    def update(self, id, distributionProfile):
        """Update Distribution Profile by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addObjectIfDefined("distributionProfile", distributionProfile)
        self.client.queueServiceActionCall("contentdistribution_distributionprofile", "update", KalturaDistributionProfile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDistributionProfile)

    def updateStatus(self, id, status):
        """Update Distribution Profile status by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addIntIfDefined("status", status);
        self.client.queueServiceActionCall("contentdistribution_distributionprofile", "updateStatus", KalturaDistributionProfile, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDistributionProfile)

    def delete(self, id):
        """Delete Distribution Profile by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("contentdistribution_distributionprofile", "delete", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List all distribution providers"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("contentdistribution_distributionprofile", "list", KalturaDistributionProfileListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDistributionProfileListResponse)

    def listByPartner(self, filter = NotImplemented, pager = NotImplemented):
        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("contentdistribution_distributionprofile", "listByPartner", KalturaDistributionProfileListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDistributionProfileListResponse)


# @package Kaltura
# @subpackage Client
class KalturaEntryDistributionService(KalturaServiceBase):
    """Entry Distribution service"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, entryDistribution):
        """Add new Entry Distribution"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("entryDistribution", entryDistribution)
        self.client.queueServiceActionCall("contentdistribution_entrydistribution", "add", KalturaEntryDistribution, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEntryDistribution)

    def get(self, id):
        """Get Entry Distribution by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("contentdistribution_entrydistribution", "get", KalturaEntryDistribution, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEntryDistribution)

    def validate(self, id):
        """Validates Entry Distribution by id for submission"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("contentdistribution_entrydistribution", "validate", KalturaEntryDistribution, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEntryDistribution)

    def update(self, id, entryDistribution):
        """Update Entry Distribution by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addObjectIfDefined("entryDistribution", entryDistribution)
        self.client.queueServiceActionCall("contentdistribution_entrydistribution", "update", KalturaEntryDistribution, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEntryDistribution)

    def delete(self, id):
        """Delete Entry Distribution by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("contentdistribution_entrydistribution", "delete", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List all distribution providers"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("contentdistribution_entrydistribution", "list", KalturaEntryDistributionListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEntryDistributionListResponse)

    def submitAdd(self, id, submitWhenReady = False):
        """Submits Entry Distribution to the remote destination"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addBoolIfDefined("submitWhenReady", submitWhenReady);
        self.client.queueServiceActionCall("contentdistribution_entrydistribution", "submitAdd", KalturaEntryDistribution, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEntryDistribution)

    def submitUpdate(self, id):
        """Submits Entry Distribution changes to the remote destination"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("contentdistribution_entrydistribution", "submitUpdate", KalturaEntryDistribution, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEntryDistribution)

    def submitFetchReport(self, id):
        """Submits Entry Distribution report request"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("contentdistribution_entrydistribution", "submitFetchReport", KalturaEntryDistribution, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEntryDistribution)

    def submitDelete(self, id):
        """Deletes Entry Distribution from the remote destination"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("contentdistribution_entrydistribution", "submitDelete", KalturaEntryDistribution, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEntryDistribution)

    def retrySubmit(self, id):
        """Retries last submit action"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("contentdistribution_entrydistribution", "retrySubmit", KalturaEntryDistribution, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaEntryDistribution)

    def serveSentData(self, id, actionType):
        """Serves entry distribution sent data"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addIntIfDefined("actionType", actionType);
        self.client.queueServiceActionCall('contentdistribution_entrydistribution', 'serveSentData', None ,kparams)
        return self.client.getServeUrl()

    def serveReturnedData(self, id, actionType):
        """Serves entry distribution returned data"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addIntIfDefined("actionType", actionType);
        self.client.queueServiceActionCall('contentdistribution_entrydistribution', 'serveReturnedData', None ,kparams)
        return self.client.getServeUrl()


# @package Kaltura
# @subpackage Client
class KalturaDistributionProviderService(KalturaServiceBase):
    """Distribution Provider service"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List all distribution providers"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("contentdistribution_distributionprovider", "list", KalturaDistributionProviderListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaDistributionProviderListResponse)


# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProviderService(KalturaServiceBase):
    """Generic Distribution Provider service"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, genericDistributionProvider):
        """Add new Generic Distribution Provider"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("genericDistributionProvider", genericDistributionProvider)
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovider", "add", KalturaGenericDistributionProvider, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProvider)

    def get(self, id):
        """Get Generic Distribution Provider by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovider", "get", KalturaGenericDistributionProvider, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProvider)

    def update(self, id, genericDistributionProvider):
        """Update Generic Distribution Provider by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addObjectIfDefined("genericDistributionProvider", genericDistributionProvider)
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovider", "update", KalturaGenericDistributionProvider, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProvider)

    def delete(self, id):
        """Delete Generic Distribution Provider by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovider", "delete", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List all distribution providers"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovider", "list", KalturaGenericDistributionProviderListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProviderListResponse)


# @package Kaltura
# @subpackage Client
class KalturaGenericDistributionProviderActionService(KalturaServiceBase):
    """Generic Distribution Provider Actions service"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, genericDistributionProviderAction):
        """Add new Generic Distribution Provider Action"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("genericDistributionProviderAction", genericDistributionProviderAction)
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovideraction", "add", KalturaGenericDistributionProviderAction, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProviderAction)

    def addMrssTransform(self, id, xslData):
        """Add MRSS transform file to generic distribution provider action"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addStringIfDefined("xslData", xslData)
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovideraction", "addMrssTransform", KalturaGenericDistributionProviderAction, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProviderAction)

    def addMrssTransformFromFile(self, id, xslFile):
        """Add MRSS transform file to generic distribution provider action"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kfiles = KalturaFiles()
        kfiles.put("xslFile", xslFile);
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovideraction", "addMrssTransformFromFile", KalturaGenericDistributionProviderAction, kparams, kfiles)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProviderAction)

    def addMrssValidate(self, id, xsdData):
        """Add MRSS validate file to generic distribution provider action"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addStringIfDefined("xsdData", xsdData)
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovideraction", "addMrssValidate", KalturaGenericDistributionProviderAction, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProviderAction)

    def addMrssValidateFromFile(self, id, xsdFile):
        """Add MRSS validate file to generic distribution provider action"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kfiles = KalturaFiles()
        kfiles.put("xsdFile", xsdFile);
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovideraction", "addMrssValidateFromFile", KalturaGenericDistributionProviderAction, kparams, kfiles)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProviderAction)

    def addResultsTransform(self, id, transformData):
        """Add results transform file to generic distribution provider action"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addStringIfDefined("transformData", transformData)
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovideraction", "addResultsTransform", KalturaGenericDistributionProviderAction, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProviderAction)

    def addResultsTransformFromFile(self, id, transformFile):
        """Add MRSS transform file to generic distribution provider action"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kfiles = KalturaFiles()
        kfiles.put("transformFile", transformFile);
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovideraction", "addResultsTransformFromFile", KalturaGenericDistributionProviderAction, kparams, kfiles)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProviderAction)

    def get(self, id):
        """Get Generic Distribution Provider Action by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovideraction", "get", KalturaGenericDistributionProviderAction, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProviderAction)

    def getByProviderId(self, genericDistributionProviderId, actionType):
        """Get Generic Distribution Provider Action by provider id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("genericDistributionProviderId", genericDistributionProviderId);
        kparams.addIntIfDefined("actionType", actionType);
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovideraction", "getByProviderId", KalturaGenericDistributionProviderAction, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProviderAction)

    def updateByProviderId(self, genericDistributionProviderId, actionType, genericDistributionProviderAction):
        """Update Generic Distribution Provider Action by provider id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("genericDistributionProviderId", genericDistributionProviderId);
        kparams.addIntIfDefined("actionType", actionType);
        kparams.addObjectIfDefined("genericDistributionProviderAction", genericDistributionProviderAction)
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovideraction", "updateByProviderId", KalturaGenericDistributionProviderAction, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProviderAction)

    def update(self, id, genericDistributionProviderAction):
        """Update Generic Distribution Provider Action by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        kparams.addObjectIfDefined("genericDistributionProviderAction", genericDistributionProviderAction)
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovideraction", "update", KalturaGenericDistributionProviderAction, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProviderAction)

    def delete(self, id):
        """Delete Generic Distribution Provider Action by id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("id", id);
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovideraction", "delete", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()

    def deleteByProviderId(self, genericDistributionProviderId, actionType):
        """Delete Generic Distribution Provider Action by provider id"""

        kparams = KalturaParams()
        kparams.addIntIfDefined("genericDistributionProviderId", genericDistributionProviderId);
        kparams.addIntIfDefined("actionType", actionType);
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovideraction", "deleteByProviderId", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List all distribution providers"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("contentdistribution_genericdistributionprovideraction", "list", KalturaGenericDistributionProviderActionListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaGenericDistributionProviderActionListResponse)

########## main ##########
class KalturaContentDistributionClientPlugin(KalturaClientPlugin):
    # KalturaContentDistributionClientPlugin
    instance = None

    # @return KalturaContentDistributionClientPlugin
    @staticmethod
    def get():
        if KalturaContentDistributionClientPlugin.instance == None:
            KalturaContentDistributionClientPlugin.instance = KalturaContentDistributionClientPlugin()
        return KalturaContentDistributionClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'distributionProfile': KalturaDistributionProfileService,
            'entryDistribution': KalturaEntryDistributionService,
            'distributionProvider': KalturaDistributionProviderService,
            'genericDistributionProvider': KalturaGenericDistributionProviderService,
            'genericDistributionProviderAction': KalturaGenericDistributionProviderActionService,
        }

    def getEnums(self):
        return {
            'KalturaDistributionAction': KalturaDistributionAction,
            'KalturaDistributionErrorType': KalturaDistributionErrorType,
            'KalturaDistributionFieldRequiredStatus': KalturaDistributionFieldRequiredStatus,
            'KalturaDistributionProfileActionStatus': KalturaDistributionProfileActionStatus,
            'KalturaDistributionProfileStatus': KalturaDistributionProfileStatus,
            'KalturaDistributionProtocol': KalturaDistributionProtocol,
            'KalturaDistributionValidationErrorType': KalturaDistributionValidationErrorType,
            'KalturaEntryDistributionFlag': KalturaEntryDistributionFlag,
            'KalturaEntryDistributionStatus': KalturaEntryDistributionStatus,
            'KalturaEntryDistributionSunStatus': KalturaEntryDistributionSunStatus,
            'KalturaGenericDistributionProviderParser': KalturaGenericDistributionProviderParser,
            'KalturaGenericDistributionProviderStatus': KalturaGenericDistributionProviderStatus,
            'KalturaConfigurableDistributionProfileOrderBy': KalturaConfigurableDistributionProfileOrderBy,
            'KalturaDistributionProfileOrderBy': KalturaDistributionProfileOrderBy,
            'KalturaDistributionProviderOrderBy': KalturaDistributionProviderOrderBy,
            'KalturaDistributionProviderType': KalturaDistributionProviderType,
            'KalturaEntryDistributionOrderBy': KalturaEntryDistributionOrderBy,
            'KalturaGenericDistributionProfileOrderBy': KalturaGenericDistributionProfileOrderBy,
            'KalturaGenericDistributionProviderActionOrderBy': KalturaGenericDistributionProviderActionOrderBy,
            'KalturaGenericDistributionProviderOrderBy': KalturaGenericDistributionProviderOrderBy,
            'KalturaSyndicationDistributionProfileOrderBy': KalturaSyndicationDistributionProfileOrderBy,
            'KalturaSyndicationDistributionProviderOrderBy': KalturaSyndicationDistributionProviderOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaAssetDistributionCondition': KalturaAssetDistributionCondition,
            'KalturaAssetDistributionRule': KalturaAssetDistributionRule,
            'KalturaDistributionFieldConfig': KalturaDistributionFieldConfig,
            'KalturaDistributionJobProviderData': KalturaDistributionJobProviderData,
            'KalturaDistributionThumbDimensions': KalturaDistributionThumbDimensions,
            'KalturaDistributionProfile': KalturaDistributionProfile,
            'KalturaDistributionProvider': KalturaDistributionProvider,
            'KalturaDistributionRemoteMediaFile': KalturaDistributionRemoteMediaFile,
            'KalturaDistributionValidationError': KalturaDistributionValidationError,
            'KalturaEntryDistribution': KalturaEntryDistribution,
            'KalturaGenericDistributionProfileAction': KalturaGenericDistributionProfileAction,
            'KalturaGenericDistributionProviderAction': KalturaGenericDistributionProviderAction,
            'KalturaGenericDistributionProvider': KalturaGenericDistributionProvider,
            'KalturaAssetDistributionPropertyCondition': KalturaAssetDistributionPropertyCondition,
            'KalturaConfigurableDistributionJobProviderData': KalturaConfigurableDistributionJobProviderData,
            'KalturaConfigurableDistributionProfile': KalturaConfigurableDistributionProfile,
            'KalturaContentDistributionSearchItem': KalturaContentDistributionSearchItem,
            'KalturaDistributionJobData': KalturaDistributionJobData,
            'KalturaDistributionProfileBaseFilter': KalturaDistributionProfileBaseFilter,
            'KalturaDistributionProfileListResponse': KalturaDistributionProfileListResponse,
            'KalturaDistributionProviderBaseFilter': KalturaDistributionProviderBaseFilter,
            'KalturaDistributionProviderListResponse': KalturaDistributionProviderListResponse,
            'KalturaDistributionValidationErrorConditionNotMet': KalturaDistributionValidationErrorConditionNotMet,
            'KalturaDistributionValidationErrorInvalidData': KalturaDistributionValidationErrorInvalidData,
            'KalturaDistributionValidationErrorMissingAsset': KalturaDistributionValidationErrorMissingAsset,
            'KalturaDistributionValidationErrorMissingFlavor': KalturaDistributionValidationErrorMissingFlavor,
            'KalturaDistributionValidationErrorMissingMetadata': KalturaDistributionValidationErrorMissingMetadata,
            'KalturaDistributionValidationErrorMissingThumbnail': KalturaDistributionValidationErrorMissingThumbnail,
            'KalturaEntryDistributionListResponse': KalturaEntryDistributionListResponse,
            'KalturaGenericDistributionJobProviderData': KalturaGenericDistributionJobProviderData,
            'KalturaGenericDistributionProfile': KalturaGenericDistributionProfile,
            'KalturaGenericDistributionProviderActionBaseFilter': KalturaGenericDistributionProviderActionBaseFilter,
            'KalturaGenericDistributionProviderActionListResponse': KalturaGenericDistributionProviderActionListResponse,
            'KalturaGenericDistributionProviderListResponse': KalturaGenericDistributionProviderListResponse,
            'KalturaSyndicationDistributionProfile': KalturaSyndicationDistributionProfile,
            'KalturaSyndicationDistributionProvider': KalturaSyndicationDistributionProvider,
            'KalturaDistributionDeleteJobData': KalturaDistributionDeleteJobData,
            'KalturaDistributionFetchReportJobData': KalturaDistributionFetchReportJobData,
            'KalturaDistributionProfileFilter': KalturaDistributionProfileFilter,
            'KalturaDistributionProviderFilter': KalturaDistributionProviderFilter,
            'KalturaDistributionSubmitJobData': KalturaDistributionSubmitJobData,
            'KalturaDistributionUpdateJobData': KalturaDistributionUpdateJobData,
            'KalturaDistributionValidationErrorInvalidMetadata': KalturaDistributionValidationErrorInvalidMetadata,
            'KalturaEntryDistributionBaseFilter': KalturaEntryDistributionBaseFilter,
            'KalturaGenericDistributionProviderActionFilter': KalturaGenericDistributionProviderActionFilter,
            'KalturaConfigurableDistributionProfileBaseFilter': KalturaConfigurableDistributionProfileBaseFilter,
            'KalturaDistributionDisableJobData': KalturaDistributionDisableJobData,
            'KalturaDistributionEnableJobData': KalturaDistributionEnableJobData,
            'KalturaEntryDistributionFilter': KalturaEntryDistributionFilter,
            'KalturaGenericDistributionProfileBaseFilter': KalturaGenericDistributionProfileBaseFilter,
            'KalturaGenericDistributionProviderBaseFilter': KalturaGenericDistributionProviderBaseFilter,
            'KalturaSyndicationDistributionProfileBaseFilter': KalturaSyndicationDistributionProfileBaseFilter,
            'KalturaSyndicationDistributionProviderBaseFilter': KalturaSyndicationDistributionProviderBaseFilter,
            'KalturaConfigurableDistributionProfileFilter': KalturaConfigurableDistributionProfileFilter,
            'KalturaGenericDistributionProfileFilter': KalturaGenericDistributionProfileFilter,
            'KalturaGenericDistributionProviderFilter': KalturaGenericDistributionProviderFilter,
            'KalturaSyndicationDistributionProfileFilter': KalturaSyndicationDistributionProfileFilter,
            'KalturaSyndicationDistributionProviderFilter': KalturaSyndicationDistributionProviderFilter,
        }

    # @return string
    def getName(self):
        return 'contentDistribution'

