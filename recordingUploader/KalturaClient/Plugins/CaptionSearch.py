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
from Caption import *
from ..Base import *

########## enums ##########
########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaCaptionAssetItem(KalturaObjectBase):
    def __init__(self,
            asset=NotImplemented,
            entry=NotImplemented,
            startTime=NotImplemented,
            endTime=NotImplemented,
            content=NotImplemented):
        KalturaObjectBase.__init__(self)

        # The Caption Asset object
        # @var KalturaCaptionAsset
        self.asset = asset

        # The entry object
        # @var KalturaBaseEntry
        self.entry = entry

        # @var int
        self.startTime = startTime

        # @var int
        self.endTime = endTime

        # @var string
        self.content = content


    PROPERTY_LOADERS = {
        'asset': (KalturaObjectFactory.create, KalturaCaptionAsset), 
        'entry': (KalturaObjectFactory.create, KalturaBaseEntry), 
        'startTime': getXmlNodeInt, 
        'endTime': getXmlNodeInt, 
        'content': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaCaptionAssetItem.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaCaptionAssetItem")
        kparams.addObjectIfDefined("asset", self.asset)
        kparams.addObjectIfDefined("entry", self.entry)
        kparams.addIntIfDefined("startTime", self.startTime)
        kparams.addIntIfDefined("endTime", self.endTime)
        kparams.addStringIfDefined("content", self.content)
        return kparams

    def getAsset(self):
        return self.asset

    def setAsset(self, newAsset):
        self.asset = newAsset

    def getEntry(self):
        return self.entry

    def setEntry(self, newEntry):
        self.entry = newEntry

    def getStartTime(self):
        return self.startTime

    def setStartTime(self, newStartTime):
        self.startTime = newStartTime

    def getEndTime(self):
        return self.endTime

    def setEndTime(self, newEndTime):
        self.endTime = newEndTime

    def getContent(self):
        return self.content

    def setContent(self, newContent):
        self.content = newContent


# @package Kaltura
# @subpackage Client
class KalturaCaptionAssetItemListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaCaptionAssetItem
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaCaptionAssetItem), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaCaptionAssetItemListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaCaptionAssetItemListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaEntryCaptionAssetSearchItem(KalturaSearchItem):
    def __init__(self,
            contentLike=NotImplemented,
            contentMultiLikeOr=NotImplemented,
            contentMultiLikeAnd=NotImplemented):
        KalturaSearchItem.__init__(self)

        # @var string
        self.contentLike = contentLike

        # @var string
        self.contentMultiLikeOr = contentMultiLikeOr

        # @var string
        self.contentMultiLikeAnd = contentMultiLikeAnd


    PROPERTY_LOADERS = {
        'contentLike': getXmlNodeText, 
        'contentMultiLikeOr': getXmlNodeText, 
        'contentMultiLikeAnd': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaSearchItem.fromXml(self, node)
        self.fromXmlImpl(node, KalturaEntryCaptionAssetSearchItem.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSearchItem.toParams(self)
        kparams.put("objectType", "KalturaEntryCaptionAssetSearchItem")
        kparams.addStringIfDefined("contentLike", self.contentLike)
        kparams.addStringIfDefined("contentMultiLikeOr", self.contentMultiLikeOr)
        kparams.addStringIfDefined("contentMultiLikeAnd", self.contentMultiLikeAnd)
        return kparams

    def getContentLike(self):
        return self.contentLike

    def setContentLike(self, newContentLike):
        self.contentLike = newContentLike

    def getContentMultiLikeOr(self):
        return self.contentMultiLikeOr

    def setContentMultiLikeOr(self, newContentMultiLikeOr):
        self.contentMultiLikeOr = newContentMultiLikeOr

    def getContentMultiLikeAnd(self):
        return self.contentMultiLikeAnd

    def setContentMultiLikeAnd(self, newContentMultiLikeAnd):
        self.contentMultiLikeAnd = newContentMultiLikeAnd


# @package Kaltura
# @subpackage Client
class KalturaCaptionAssetItemFilter(KalturaCaptionAssetFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented,
            partnerIdEqual=NotImplemented,
            partnerIdIn=NotImplemented,
            sizeGreaterThanOrEqual=NotImplemented,
            sizeLessThanOrEqual=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            deletedAtGreaterThanOrEqual=NotImplemented,
            deletedAtLessThanOrEqual=NotImplemented,
            captionParamsIdEqual=NotImplemented,
            captionParamsIdIn=NotImplemented,
            formatEqual=NotImplemented,
            formatIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            statusNotIn=NotImplemented,
            contentLike=NotImplemented,
            contentMultiLikeOr=NotImplemented,
            contentMultiLikeAnd=NotImplemented,
            partnerDescriptionLike=NotImplemented,
            partnerDescriptionMultiLikeOr=NotImplemented,
            partnerDescriptionMultiLikeAnd=NotImplemented,
            languageEqual=NotImplemented,
            languageIn=NotImplemented,
            labelEqual=NotImplemented,
            labelIn=NotImplemented,
            startTimeGreaterThanOrEqual=NotImplemented,
            startTimeLessThanOrEqual=NotImplemented,
            endTimeGreaterThanOrEqual=NotImplemented,
            endTimeLessThanOrEqual=NotImplemented):
        KalturaCaptionAssetFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            entryIdEqual,
            entryIdIn,
            partnerIdEqual,
            partnerIdIn,
            sizeGreaterThanOrEqual,
            sizeLessThanOrEqual,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            deletedAtGreaterThanOrEqual,
            deletedAtLessThanOrEqual,
            captionParamsIdEqual,
            captionParamsIdIn,
            formatEqual,
            formatIn,
            statusEqual,
            statusIn,
            statusNotIn)

        # @var string
        self.contentLike = contentLike

        # @var string
        self.contentMultiLikeOr = contentMultiLikeOr

        # @var string
        self.contentMultiLikeAnd = contentMultiLikeAnd

        # @var string
        self.partnerDescriptionLike = partnerDescriptionLike

        # @var string
        self.partnerDescriptionMultiLikeOr = partnerDescriptionMultiLikeOr

        # @var string
        self.partnerDescriptionMultiLikeAnd = partnerDescriptionMultiLikeAnd

        # @var KalturaLanguage
        self.languageEqual = languageEqual

        # @var string
        self.languageIn = languageIn

        # @var string
        self.labelEqual = labelEqual

        # @var string
        self.labelIn = labelIn

        # @var int
        self.startTimeGreaterThanOrEqual = startTimeGreaterThanOrEqual

        # @var int
        self.startTimeLessThanOrEqual = startTimeLessThanOrEqual

        # @var int
        self.endTimeGreaterThanOrEqual = endTimeGreaterThanOrEqual

        # @var int
        self.endTimeLessThanOrEqual = endTimeLessThanOrEqual


    PROPERTY_LOADERS = {
        'contentLike': getXmlNodeText, 
        'contentMultiLikeOr': getXmlNodeText, 
        'contentMultiLikeAnd': getXmlNodeText, 
        'partnerDescriptionLike': getXmlNodeText, 
        'partnerDescriptionMultiLikeOr': getXmlNodeText, 
        'partnerDescriptionMultiLikeAnd': getXmlNodeText, 
        'languageEqual': (KalturaEnumsFactory.createString, "KalturaLanguage"), 
        'languageIn': getXmlNodeText, 
        'labelEqual': getXmlNodeText, 
        'labelIn': getXmlNodeText, 
        'startTimeGreaterThanOrEqual': getXmlNodeInt, 
        'startTimeLessThanOrEqual': getXmlNodeInt, 
        'endTimeGreaterThanOrEqual': getXmlNodeInt, 
        'endTimeLessThanOrEqual': getXmlNodeInt, 
    }

    def fromXml(self, node):
        KalturaCaptionAssetFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaCaptionAssetItemFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCaptionAssetFilter.toParams(self)
        kparams.put("objectType", "KalturaCaptionAssetItemFilter")
        kparams.addStringIfDefined("contentLike", self.contentLike)
        kparams.addStringIfDefined("contentMultiLikeOr", self.contentMultiLikeOr)
        kparams.addStringIfDefined("contentMultiLikeAnd", self.contentMultiLikeAnd)
        kparams.addStringIfDefined("partnerDescriptionLike", self.partnerDescriptionLike)
        kparams.addStringIfDefined("partnerDescriptionMultiLikeOr", self.partnerDescriptionMultiLikeOr)
        kparams.addStringIfDefined("partnerDescriptionMultiLikeAnd", self.partnerDescriptionMultiLikeAnd)
        kparams.addStringEnumIfDefined("languageEqual", self.languageEqual)
        kparams.addStringIfDefined("languageIn", self.languageIn)
        kparams.addStringIfDefined("labelEqual", self.labelEqual)
        kparams.addStringIfDefined("labelIn", self.labelIn)
        kparams.addIntIfDefined("startTimeGreaterThanOrEqual", self.startTimeGreaterThanOrEqual)
        kparams.addIntIfDefined("startTimeLessThanOrEqual", self.startTimeLessThanOrEqual)
        kparams.addIntIfDefined("endTimeGreaterThanOrEqual", self.endTimeGreaterThanOrEqual)
        kparams.addIntIfDefined("endTimeLessThanOrEqual", self.endTimeLessThanOrEqual)
        return kparams

    def getContentLike(self):
        return self.contentLike

    def setContentLike(self, newContentLike):
        self.contentLike = newContentLike

    def getContentMultiLikeOr(self):
        return self.contentMultiLikeOr

    def setContentMultiLikeOr(self, newContentMultiLikeOr):
        self.contentMultiLikeOr = newContentMultiLikeOr

    def getContentMultiLikeAnd(self):
        return self.contentMultiLikeAnd

    def setContentMultiLikeAnd(self, newContentMultiLikeAnd):
        self.contentMultiLikeAnd = newContentMultiLikeAnd

    def getPartnerDescriptionLike(self):
        return self.partnerDescriptionLike

    def setPartnerDescriptionLike(self, newPartnerDescriptionLike):
        self.partnerDescriptionLike = newPartnerDescriptionLike

    def getPartnerDescriptionMultiLikeOr(self):
        return self.partnerDescriptionMultiLikeOr

    def setPartnerDescriptionMultiLikeOr(self, newPartnerDescriptionMultiLikeOr):
        self.partnerDescriptionMultiLikeOr = newPartnerDescriptionMultiLikeOr

    def getPartnerDescriptionMultiLikeAnd(self):
        return self.partnerDescriptionMultiLikeAnd

    def setPartnerDescriptionMultiLikeAnd(self, newPartnerDescriptionMultiLikeAnd):
        self.partnerDescriptionMultiLikeAnd = newPartnerDescriptionMultiLikeAnd

    def getLanguageEqual(self):
        return self.languageEqual

    def setLanguageEqual(self, newLanguageEqual):
        self.languageEqual = newLanguageEqual

    def getLanguageIn(self):
        return self.languageIn

    def setLanguageIn(self, newLanguageIn):
        self.languageIn = newLanguageIn

    def getLabelEqual(self):
        return self.labelEqual

    def setLabelEqual(self, newLabelEqual):
        self.labelEqual = newLabelEqual

    def getLabelIn(self):
        return self.labelIn

    def setLabelIn(self, newLabelIn):
        self.labelIn = newLabelIn

    def getStartTimeGreaterThanOrEqual(self):
        return self.startTimeGreaterThanOrEqual

    def setStartTimeGreaterThanOrEqual(self, newStartTimeGreaterThanOrEqual):
        self.startTimeGreaterThanOrEqual = newStartTimeGreaterThanOrEqual

    def getStartTimeLessThanOrEqual(self):
        return self.startTimeLessThanOrEqual

    def setStartTimeLessThanOrEqual(self, newStartTimeLessThanOrEqual):
        self.startTimeLessThanOrEqual = newStartTimeLessThanOrEqual

    def getEndTimeGreaterThanOrEqual(self):
        return self.endTimeGreaterThanOrEqual

    def setEndTimeGreaterThanOrEqual(self, newEndTimeGreaterThanOrEqual):
        self.endTimeGreaterThanOrEqual = newEndTimeGreaterThanOrEqual

    def getEndTimeLessThanOrEqual(self):
        return self.endTimeLessThanOrEqual

    def setEndTimeLessThanOrEqual(self, newEndTimeLessThanOrEqual):
        self.endTimeLessThanOrEqual = newEndTimeLessThanOrEqual


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaCaptionAssetItemService(KalturaServiceBase):
    """Search caption asset items"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def search(self, entryFilter = NotImplemented, captionAssetItemFilter = NotImplemented, captionAssetItemPager = NotImplemented):
        """Search caption asset items by filter, pager and free text"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("entryFilter", entryFilter)
        kparams.addObjectIfDefined("captionAssetItemFilter", captionAssetItemFilter)
        kparams.addObjectIfDefined("captionAssetItemPager", captionAssetItemPager)
        self.client.queueServiceActionCall("captionsearch_captionassetitem", "search", KalturaCaptionAssetItemListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaCaptionAssetItemListResponse)

    def searchEntries(self, entryFilter = NotImplemented, captionAssetItemFilter = NotImplemented, captionAssetItemPager = NotImplemented):
        """Search caption asset items by filter, pager and free text"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("entryFilter", entryFilter)
        kparams.addObjectIfDefined("captionAssetItemFilter", captionAssetItemFilter)
        kparams.addObjectIfDefined("captionAssetItemPager", captionAssetItemPager)
        self.client.queueServiceActionCall("captionsearch_captionassetitem", "searchEntries", KalturaBaseEntryListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaBaseEntryListResponse)

########## main ##########
class KalturaCaptionSearchClientPlugin(KalturaClientPlugin):
    # KalturaCaptionSearchClientPlugin
    instance = None

    # @return KalturaCaptionSearchClientPlugin
    @staticmethod
    def get():
        if KalturaCaptionSearchClientPlugin.instance == None:
            KalturaCaptionSearchClientPlugin.instance = KalturaCaptionSearchClientPlugin()
        return KalturaCaptionSearchClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'captionAssetItem': KalturaCaptionAssetItemService,
        }

    def getEnums(self):
        return {
        }

    def getTypes(self):
        return {
            'KalturaCaptionAssetItem': KalturaCaptionAssetItem,
            'KalturaCaptionAssetItemListResponse': KalturaCaptionAssetItemListResponse,
            'KalturaEntryCaptionAssetSearchItem': KalturaEntryCaptionAssetSearchItem,
            'KalturaCaptionAssetItemFilter': KalturaCaptionAssetItemFilter,
        }

    # @return string
    def getName(self):
        return 'captionSearch'

