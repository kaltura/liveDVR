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
from CuePoint import *
from ..Base import *

########## enums ##########
# @package Kaltura
# @subpackage Client
class KalturaAnswerCuePointOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    PARTNER_SORT_VALUE_ASC = "+partnerSortValue"
    START_TIME_ASC = "+startTime"
    TRIGGERED_AT_ASC = "+triggeredAt"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    PARTNER_SORT_VALUE_DESC = "-partnerSortValue"
    START_TIME_DESC = "-startTime"
    TRIGGERED_AT_DESC = "-triggeredAt"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

# @package Kaltura
# @subpackage Client
class KalturaQuestionCuePointOrderBy(object):
    CREATED_AT_ASC = "+createdAt"
    PARTNER_SORT_VALUE_ASC = "+partnerSortValue"
    START_TIME_ASC = "+startTime"
    TRIGGERED_AT_ASC = "+triggeredAt"
    UPDATED_AT_ASC = "+updatedAt"
    CREATED_AT_DESC = "-createdAt"
    PARTNER_SORT_VALUE_DESC = "-partnerSortValue"
    START_TIME_DESC = "-startTime"
    TRIGGERED_AT_DESC = "-triggeredAt"
    UPDATED_AT_DESC = "-updatedAt"

    def __init__(self, value):
        self.value = value

    def getValue(self):
        return self.value

########## classes ##########
# @package Kaltura
# @subpackage Client
class KalturaOptionalAnswer(KalturaObjectBase):
    """A representation of an optional answer for question cue point"""

    def __init__(self,
            key=NotImplemented,
            text=NotImplemented,
            weight=NotImplemented,
            isCorrect=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var string
        self.key = key

        # @var string
        self.text = text

        # @var float
        self.weight = weight

        # @var KalturaNullableBoolean
        self.isCorrect = isCorrect


    PROPERTY_LOADERS = {
        'key': getXmlNodeText, 
        'text': getXmlNodeText, 
        'weight': getXmlNodeFloat, 
        'isCorrect': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaOptionalAnswer.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaOptionalAnswer")
        kparams.addStringIfDefined("key", self.key)
        kparams.addStringIfDefined("text", self.text)
        kparams.addFloatIfDefined("weight", self.weight)
        kparams.addIntEnumIfDefined("isCorrect", self.isCorrect)
        return kparams

    def getKey(self):
        return self.key

    def setKey(self, newKey):
        self.key = newKey

    def getText(self):
        return self.text

    def setText(self, newText):
        self.text = newText

    def getWeight(self):
        return self.weight

    def setWeight(self, newWeight):
        self.weight = newWeight

    def getIsCorrect(self):
        return self.isCorrect

    def setIsCorrect(self, newIsCorrect):
        self.isCorrect = newIsCorrect


# @package Kaltura
# @subpackage Client
class KalturaQuiz(KalturaObjectBase):
    def __init__(self,
            version=NotImplemented,
            uiAttributes=NotImplemented,
            showResultOnAnswer=NotImplemented,
            showCorrectKeyOnAnswer=NotImplemented,
            allowAnswerUpdate=NotImplemented,
            showCorrectAfterSubmission=NotImplemented,
            allowDownload=NotImplemented,
            showGradeAfterSubmission=NotImplemented):
        KalturaObjectBase.__init__(self)

        # @var int
        # @readonly
        self.version = version

        # Array of key value ui related objects
        # @var array of KalturaKeyValue
        self.uiAttributes = uiAttributes

        # @var KalturaNullableBoolean
        self.showResultOnAnswer = showResultOnAnswer

        # @var KalturaNullableBoolean
        self.showCorrectKeyOnAnswer = showCorrectKeyOnAnswer

        # @var KalturaNullableBoolean
        self.allowAnswerUpdate = allowAnswerUpdate

        # @var KalturaNullableBoolean
        self.showCorrectAfterSubmission = showCorrectAfterSubmission

        # @var KalturaNullableBoolean
        self.allowDownload = allowDownload

        # @var KalturaNullableBoolean
        self.showGradeAfterSubmission = showGradeAfterSubmission


    PROPERTY_LOADERS = {
        'version': getXmlNodeInt, 
        'uiAttributes': (KalturaObjectFactory.createArray, KalturaKeyValue), 
        'showResultOnAnswer': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
        'showCorrectKeyOnAnswer': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
        'allowAnswerUpdate': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
        'showCorrectAfterSubmission': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
        'allowDownload': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
        'showGradeAfterSubmission': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
    }

    def fromXml(self, node):
        KalturaObjectBase.fromXml(self, node)
        self.fromXmlImpl(node, KalturaQuiz.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaObjectBase.toParams(self)
        kparams.put("objectType", "KalturaQuiz")
        kparams.addArrayIfDefined("uiAttributes", self.uiAttributes)
        kparams.addIntEnumIfDefined("showResultOnAnswer", self.showResultOnAnswer)
        kparams.addIntEnumIfDefined("showCorrectKeyOnAnswer", self.showCorrectKeyOnAnswer)
        kparams.addIntEnumIfDefined("allowAnswerUpdate", self.allowAnswerUpdate)
        kparams.addIntEnumIfDefined("showCorrectAfterSubmission", self.showCorrectAfterSubmission)
        kparams.addIntEnumIfDefined("allowDownload", self.allowDownload)
        kparams.addIntEnumIfDefined("showGradeAfterSubmission", self.showGradeAfterSubmission)
        return kparams

    def getVersion(self):
        return self.version

    def getUiAttributes(self):
        return self.uiAttributes

    def setUiAttributes(self, newUiAttributes):
        self.uiAttributes = newUiAttributes

    def getShowResultOnAnswer(self):
        return self.showResultOnAnswer

    def setShowResultOnAnswer(self, newShowResultOnAnswer):
        self.showResultOnAnswer = newShowResultOnAnswer

    def getShowCorrectKeyOnAnswer(self):
        return self.showCorrectKeyOnAnswer

    def setShowCorrectKeyOnAnswer(self, newShowCorrectKeyOnAnswer):
        self.showCorrectKeyOnAnswer = newShowCorrectKeyOnAnswer

    def getAllowAnswerUpdate(self):
        return self.allowAnswerUpdate

    def setAllowAnswerUpdate(self, newAllowAnswerUpdate):
        self.allowAnswerUpdate = newAllowAnswerUpdate

    def getShowCorrectAfterSubmission(self):
        return self.showCorrectAfterSubmission

    def setShowCorrectAfterSubmission(self, newShowCorrectAfterSubmission):
        self.showCorrectAfterSubmission = newShowCorrectAfterSubmission

    def getAllowDownload(self):
        return self.allowDownload

    def setAllowDownload(self, newAllowDownload):
        self.allowDownload = newAllowDownload

    def getShowGradeAfterSubmission(self):
        return self.showGradeAfterSubmission

    def setShowGradeAfterSubmission(self, newShowGradeAfterSubmission):
        self.showGradeAfterSubmission = newShowGradeAfterSubmission


# @package Kaltura
# @subpackage Client
class KalturaAnswerCuePoint(KalturaCuePoint):
    def __init__(self,
            id=NotImplemented,
            cuePointType=NotImplemented,
            status=NotImplemented,
            entryId=NotImplemented,
            partnerId=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            triggeredAt=NotImplemented,
            tags=NotImplemented,
            startTime=NotImplemented,
            userId=NotImplemented,
            partnerData=NotImplemented,
            partnerSortValue=NotImplemented,
            forceStop=NotImplemented,
            thumbOffset=NotImplemented,
            systemName=NotImplemented,
            parentId=NotImplemented,
            quizUserEntryId=NotImplemented,
            answerKey=NotImplemented,
            isCorrect=NotImplemented,
            correctAnswerKeys=NotImplemented,
            explanation=NotImplemented):
        KalturaCuePoint.__init__(self,
            id,
            cuePointType,
            status,
            entryId,
            partnerId,
            createdAt,
            updatedAt,
            triggeredAt,
            tags,
            startTime,
            userId,
            partnerData,
            partnerSortValue,
            forceStop,
            thumbOffset,
            systemName)

        # @var string
        # @insertonly
        self.parentId = parentId

        # @var string
        # @insertonly
        self.quizUserEntryId = quizUserEntryId

        # @var string
        self.answerKey = answerKey

        # @var KalturaNullableBoolean
        # @readonly
        self.isCorrect = isCorrect

        # Array of string
        # @var array of KalturaString
        # @readonly
        self.correctAnswerKeys = correctAnswerKeys

        # @var string
        # @readonly
        self.explanation = explanation


    PROPERTY_LOADERS = {
        'parentId': getXmlNodeText, 
        'quizUserEntryId': getXmlNodeText, 
        'answerKey': getXmlNodeText, 
        'isCorrect': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
        'correctAnswerKeys': (KalturaObjectFactory.createArray, KalturaString), 
        'explanation': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaCuePoint.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAnswerCuePoint.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCuePoint.toParams(self)
        kparams.put("objectType", "KalturaAnswerCuePoint")
        kparams.addStringIfDefined("parentId", self.parentId)
        kparams.addStringIfDefined("quizUserEntryId", self.quizUserEntryId)
        kparams.addStringIfDefined("answerKey", self.answerKey)
        return kparams

    def getParentId(self):
        return self.parentId

    def setParentId(self, newParentId):
        self.parentId = newParentId

    def getQuizUserEntryId(self):
        return self.quizUserEntryId

    def setQuizUserEntryId(self, newQuizUserEntryId):
        self.quizUserEntryId = newQuizUserEntryId

    def getAnswerKey(self):
        return self.answerKey

    def setAnswerKey(self, newAnswerKey):
        self.answerKey = newAnswerKey

    def getIsCorrect(self):
        return self.isCorrect

    def getCorrectAnswerKeys(self):
        return self.correctAnswerKeys

    def getExplanation(self):
        return self.explanation


# @package Kaltura
# @subpackage Client
class KalturaQuestionCuePoint(KalturaCuePoint):
    def __init__(self,
            id=NotImplemented,
            cuePointType=NotImplemented,
            status=NotImplemented,
            entryId=NotImplemented,
            partnerId=NotImplemented,
            createdAt=NotImplemented,
            updatedAt=NotImplemented,
            triggeredAt=NotImplemented,
            tags=NotImplemented,
            startTime=NotImplemented,
            userId=NotImplemented,
            partnerData=NotImplemented,
            partnerSortValue=NotImplemented,
            forceStop=NotImplemented,
            thumbOffset=NotImplemented,
            systemName=NotImplemented,
            optionalAnswers=NotImplemented,
            hint=NotImplemented,
            question=NotImplemented,
            explanation=NotImplemented):
        KalturaCuePoint.__init__(self,
            id,
            cuePointType,
            status,
            entryId,
            partnerId,
            createdAt,
            updatedAt,
            triggeredAt,
            tags,
            startTime,
            userId,
            partnerData,
            partnerSortValue,
            forceStop,
            thumbOffset,
            systemName)

        # Array of key value answerKey->optionAnswer objects
        # @var map
        self.optionalAnswers = optionalAnswers

        # @var string
        self.hint = hint

        # @var string
        self.question = question

        # @var string
        self.explanation = explanation


    PROPERTY_LOADERS = {
        'optionalAnswers': (KalturaObjectFactory.create, map), 
        'hint': getXmlNodeText, 
        'question': getXmlNodeText, 
        'explanation': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaCuePoint.fromXml(self, node)
        self.fromXmlImpl(node, KalturaQuestionCuePoint.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCuePoint.toParams(self)
        kparams.put("objectType", "KalturaQuestionCuePoint")
        kparams.addObjectIfDefined("optionalAnswers", self.optionalAnswers)
        kparams.addStringIfDefined("hint", self.hint)
        kparams.addStringIfDefined("question", self.question)
        kparams.addStringIfDefined("explanation", self.explanation)
        return kparams

    def getOptionalAnswers(self):
        return self.optionalAnswers

    def setOptionalAnswers(self, newOptionalAnswers):
        self.optionalAnswers = newOptionalAnswers

    def getHint(self):
        return self.hint

    def setHint(self, newHint):
        self.hint = newHint

    def getQuestion(self):
        return self.question

    def setQuestion(self, newQuestion):
        self.question = newQuestion

    def getExplanation(self):
        return self.explanation

    def setExplanation(self, newExplanation):
        self.explanation = newExplanation


# @package Kaltura
# @subpackage Client
class KalturaQuizAdvancedFilter(KalturaSearchItem):
    def __init__(self,
            isQuiz=NotImplemented):
        KalturaSearchItem.__init__(self)

        # @var KalturaNullableBoolean
        self.isQuiz = isQuiz


    PROPERTY_LOADERS = {
        'isQuiz': (KalturaEnumsFactory.createInt, "KalturaNullableBoolean"), 
    }

    def fromXml(self, node):
        KalturaSearchItem.fromXml(self, node)
        self.fromXmlImpl(node, KalturaQuizAdvancedFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaSearchItem.toParams(self)
        kparams.put("objectType", "KalturaQuizAdvancedFilter")
        kparams.addIntEnumIfDefined("isQuiz", self.isQuiz)
        return kparams

    def getIsQuiz(self):
        return self.isQuiz

    def setIsQuiz(self, newIsQuiz):
        self.isQuiz = newIsQuiz


# @package Kaltura
# @subpackage Client
class KalturaQuizListResponse(KalturaListResponse):
    def __init__(self,
            totalCount=NotImplemented,
            objects=NotImplemented):
        KalturaListResponse.__init__(self,
            totalCount)

        # @var array of KalturaQuiz
        # @readonly
        self.objects = objects


    PROPERTY_LOADERS = {
        'objects': (KalturaObjectFactory.createArray, KalturaQuiz), 
    }

    def fromXml(self, node):
        KalturaListResponse.fromXml(self, node)
        self.fromXmlImpl(node, KalturaQuizListResponse.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaListResponse.toParams(self)
        kparams.put("objectType", "KalturaQuizListResponse")
        return kparams

    def getObjects(self):
        return self.objects


# @package Kaltura
# @subpackage Client
class KalturaQuizFilter(KalturaRelatedFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented):
        KalturaRelatedFilter.__init__(self,
            orderBy,
            advancedSearch)

        # This filter should be in use for retrieving only a specific quiz entry (identified by its entryId).
        # @var string
        self.entryIdEqual = entryIdEqual

        # This filter should be in use for retrieving few specific quiz entries (string should include comma separated list of entryId strings).
        # @var string
        self.entryIdIn = entryIdIn


    PROPERTY_LOADERS = {
        'entryIdEqual': getXmlNodeText, 
        'entryIdIn': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaRelatedFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaQuizFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaRelatedFilter.toParams(self)
        kparams.put("objectType", "KalturaQuizFilter")
        kparams.addStringIfDefined("entryIdEqual", self.entryIdEqual)
        kparams.addStringIfDefined("entryIdIn", self.entryIdIn)
        return kparams

    def getEntryIdEqual(self):
        return self.entryIdEqual

    def setEntryIdEqual(self, newEntryIdEqual):
        self.entryIdEqual = newEntryIdEqual

    def getEntryIdIn(self):
        return self.entryIdIn

    def setEntryIdIn(self, newEntryIdIn):
        self.entryIdIn = newEntryIdIn


# @package Kaltura
# @subpackage Client
class KalturaAnswerCuePointBaseFilter(KalturaCuePointFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            cuePointTypeEqual=NotImplemented,
            cuePointTypeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            triggeredAtGreaterThanOrEqual=NotImplemented,
            triggeredAtLessThanOrEqual=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            startTimeGreaterThanOrEqual=NotImplemented,
            startTimeLessThanOrEqual=NotImplemented,
            userIdEqual=NotImplemented,
            userIdIn=NotImplemented,
            partnerSortValueEqual=NotImplemented,
            partnerSortValueIn=NotImplemented,
            partnerSortValueGreaterThanOrEqual=NotImplemented,
            partnerSortValueLessThanOrEqual=NotImplemented,
            forceStopEqual=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            freeText=NotImplemented,
            userIdEqualCurrent=NotImplemented,
            userIdCurrent=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            quizUserEntryIdEqual=NotImplemented,
            quizUserEntryIdIn=NotImplemented):
        KalturaCuePointFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            cuePointTypeEqual,
            cuePointTypeIn,
            statusEqual,
            statusIn,
            entryIdEqual,
            entryIdIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            triggeredAtGreaterThanOrEqual,
            triggeredAtLessThanOrEqual,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            startTimeGreaterThanOrEqual,
            startTimeLessThanOrEqual,
            userIdEqual,
            userIdIn,
            partnerSortValueEqual,
            partnerSortValueIn,
            partnerSortValueGreaterThanOrEqual,
            partnerSortValueLessThanOrEqual,
            forceStopEqual,
            systemNameEqual,
            systemNameIn,
            freeText,
            userIdEqualCurrent,
            userIdCurrent)

        # @var string
        self.parentIdEqual = parentIdEqual

        # @var string
        self.parentIdIn = parentIdIn

        # @var string
        self.quizUserEntryIdEqual = quizUserEntryIdEqual

        # @var string
        self.quizUserEntryIdIn = quizUserEntryIdIn


    PROPERTY_LOADERS = {
        'parentIdEqual': getXmlNodeText, 
        'parentIdIn': getXmlNodeText, 
        'quizUserEntryIdEqual': getXmlNodeText, 
        'quizUserEntryIdIn': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaCuePointFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAnswerCuePointBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCuePointFilter.toParams(self)
        kparams.put("objectType", "KalturaAnswerCuePointBaseFilter")
        kparams.addStringIfDefined("parentIdEqual", self.parentIdEqual)
        kparams.addStringIfDefined("parentIdIn", self.parentIdIn)
        kparams.addStringIfDefined("quizUserEntryIdEqual", self.quizUserEntryIdEqual)
        kparams.addStringIfDefined("quizUserEntryIdIn", self.quizUserEntryIdIn)
        return kparams

    def getParentIdEqual(self):
        return self.parentIdEqual

    def setParentIdEqual(self, newParentIdEqual):
        self.parentIdEqual = newParentIdEqual

    def getParentIdIn(self):
        return self.parentIdIn

    def setParentIdIn(self, newParentIdIn):
        self.parentIdIn = newParentIdIn

    def getQuizUserEntryIdEqual(self):
        return self.quizUserEntryIdEqual

    def setQuizUserEntryIdEqual(self, newQuizUserEntryIdEqual):
        self.quizUserEntryIdEqual = newQuizUserEntryIdEqual

    def getQuizUserEntryIdIn(self):
        return self.quizUserEntryIdIn

    def setQuizUserEntryIdIn(self, newQuizUserEntryIdIn):
        self.quizUserEntryIdIn = newQuizUserEntryIdIn


# @package Kaltura
# @subpackage Client
class KalturaQuestionCuePointBaseFilter(KalturaCuePointFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            cuePointTypeEqual=NotImplemented,
            cuePointTypeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            triggeredAtGreaterThanOrEqual=NotImplemented,
            triggeredAtLessThanOrEqual=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            startTimeGreaterThanOrEqual=NotImplemented,
            startTimeLessThanOrEqual=NotImplemented,
            userIdEqual=NotImplemented,
            userIdIn=NotImplemented,
            partnerSortValueEqual=NotImplemented,
            partnerSortValueIn=NotImplemented,
            partnerSortValueGreaterThanOrEqual=NotImplemented,
            partnerSortValueLessThanOrEqual=NotImplemented,
            forceStopEqual=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            freeText=NotImplemented,
            userIdEqualCurrent=NotImplemented,
            userIdCurrent=NotImplemented,
            questionLike=NotImplemented,
            questionMultiLikeOr=NotImplemented,
            questionMultiLikeAnd=NotImplemented):
        KalturaCuePointFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            cuePointTypeEqual,
            cuePointTypeIn,
            statusEqual,
            statusIn,
            entryIdEqual,
            entryIdIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            triggeredAtGreaterThanOrEqual,
            triggeredAtLessThanOrEqual,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            startTimeGreaterThanOrEqual,
            startTimeLessThanOrEqual,
            userIdEqual,
            userIdIn,
            partnerSortValueEqual,
            partnerSortValueIn,
            partnerSortValueGreaterThanOrEqual,
            partnerSortValueLessThanOrEqual,
            forceStopEqual,
            systemNameEqual,
            systemNameIn,
            freeText,
            userIdEqualCurrent,
            userIdCurrent)

        # @var string
        self.questionLike = questionLike

        # @var string
        self.questionMultiLikeOr = questionMultiLikeOr

        # @var string
        self.questionMultiLikeAnd = questionMultiLikeAnd


    PROPERTY_LOADERS = {
        'questionLike': getXmlNodeText, 
        'questionMultiLikeOr': getXmlNodeText, 
        'questionMultiLikeAnd': getXmlNodeText, 
    }

    def fromXml(self, node):
        KalturaCuePointFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaQuestionCuePointBaseFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaCuePointFilter.toParams(self)
        kparams.put("objectType", "KalturaQuestionCuePointBaseFilter")
        kparams.addStringIfDefined("questionLike", self.questionLike)
        kparams.addStringIfDefined("questionMultiLikeOr", self.questionMultiLikeOr)
        kparams.addStringIfDefined("questionMultiLikeAnd", self.questionMultiLikeAnd)
        return kparams

    def getQuestionLike(self):
        return self.questionLike

    def setQuestionLike(self, newQuestionLike):
        self.questionLike = newQuestionLike

    def getQuestionMultiLikeOr(self):
        return self.questionMultiLikeOr

    def setQuestionMultiLikeOr(self, newQuestionMultiLikeOr):
        self.questionMultiLikeOr = newQuestionMultiLikeOr

    def getQuestionMultiLikeAnd(self):
        return self.questionMultiLikeAnd

    def setQuestionMultiLikeAnd(self, newQuestionMultiLikeAnd):
        self.questionMultiLikeAnd = newQuestionMultiLikeAnd


# @package Kaltura
# @subpackage Client
class KalturaAnswerCuePointFilter(KalturaAnswerCuePointBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            cuePointTypeEqual=NotImplemented,
            cuePointTypeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            triggeredAtGreaterThanOrEqual=NotImplemented,
            triggeredAtLessThanOrEqual=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            startTimeGreaterThanOrEqual=NotImplemented,
            startTimeLessThanOrEqual=NotImplemented,
            userIdEqual=NotImplemented,
            userIdIn=NotImplemented,
            partnerSortValueEqual=NotImplemented,
            partnerSortValueIn=NotImplemented,
            partnerSortValueGreaterThanOrEqual=NotImplemented,
            partnerSortValueLessThanOrEqual=NotImplemented,
            forceStopEqual=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            freeText=NotImplemented,
            userIdEqualCurrent=NotImplemented,
            userIdCurrent=NotImplemented,
            parentIdEqual=NotImplemented,
            parentIdIn=NotImplemented,
            quizUserEntryIdEqual=NotImplemented,
            quizUserEntryIdIn=NotImplemented):
        KalturaAnswerCuePointBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            cuePointTypeEqual,
            cuePointTypeIn,
            statusEqual,
            statusIn,
            entryIdEqual,
            entryIdIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            triggeredAtGreaterThanOrEqual,
            triggeredAtLessThanOrEqual,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            startTimeGreaterThanOrEqual,
            startTimeLessThanOrEqual,
            userIdEqual,
            userIdIn,
            partnerSortValueEqual,
            partnerSortValueIn,
            partnerSortValueGreaterThanOrEqual,
            partnerSortValueLessThanOrEqual,
            forceStopEqual,
            systemNameEqual,
            systemNameIn,
            freeText,
            userIdEqualCurrent,
            userIdCurrent,
            parentIdEqual,
            parentIdIn,
            quizUserEntryIdEqual,
            quizUserEntryIdIn)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaAnswerCuePointBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaAnswerCuePointFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaAnswerCuePointBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaAnswerCuePointFilter")
        return kparams


# @package Kaltura
# @subpackage Client
class KalturaQuestionCuePointFilter(KalturaQuestionCuePointBaseFilter):
    def __init__(self,
            orderBy=NotImplemented,
            advancedSearch=NotImplemented,
            idEqual=NotImplemented,
            idIn=NotImplemented,
            cuePointTypeEqual=NotImplemented,
            cuePointTypeIn=NotImplemented,
            statusEqual=NotImplemented,
            statusIn=NotImplemented,
            entryIdEqual=NotImplemented,
            entryIdIn=NotImplemented,
            createdAtGreaterThanOrEqual=NotImplemented,
            createdAtLessThanOrEqual=NotImplemented,
            updatedAtGreaterThanOrEqual=NotImplemented,
            updatedAtLessThanOrEqual=NotImplemented,
            triggeredAtGreaterThanOrEqual=NotImplemented,
            triggeredAtLessThanOrEqual=NotImplemented,
            tagsLike=NotImplemented,
            tagsMultiLikeOr=NotImplemented,
            tagsMultiLikeAnd=NotImplemented,
            startTimeGreaterThanOrEqual=NotImplemented,
            startTimeLessThanOrEqual=NotImplemented,
            userIdEqual=NotImplemented,
            userIdIn=NotImplemented,
            partnerSortValueEqual=NotImplemented,
            partnerSortValueIn=NotImplemented,
            partnerSortValueGreaterThanOrEqual=NotImplemented,
            partnerSortValueLessThanOrEqual=NotImplemented,
            forceStopEqual=NotImplemented,
            systemNameEqual=NotImplemented,
            systemNameIn=NotImplemented,
            freeText=NotImplemented,
            userIdEqualCurrent=NotImplemented,
            userIdCurrent=NotImplemented,
            questionLike=NotImplemented,
            questionMultiLikeOr=NotImplemented,
            questionMultiLikeAnd=NotImplemented):
        KalturaQuestionCuePointBaseFilter.__init__(self,
            orderBy,
            advancedSearch,
            idEqual,
            idIn,
            cuePointTypeEqual,
            cuePointTypeIn,
            statusEqual,
            statusIn,
            entryIdEqual,
            entryIdIn,
            createdAtGreaterThanOrEqual,
            createdAtLessThanOrEqual,
            updatedAtGreaterThanOrEqual,
            updatedAtLessThanOrEqual,
            triggeredAtGreaterThanOrEqual,
            triggeredAtLessThanOrEqual,
            tagsLike,
            tagsMultiLikeOr,
            tagsMultiLikeAnd,
            startTimeGreaterThanOrEqual,
            startTimeLessThanOrEqual,
            userIdEqual,
            userIdIn,
            partnerSortValueEqual,
            partnerSortValueIn,
            partnerSortValueGreaterThanOrEqual,
            partnerSortValueLessThanOrEqual,
            forceStopEqual,
            systemNameEqual,
            systemNameIn,
            freeText,
            userIdEqualCurrent,
            userIdCurrent,
            questionLike,
            questionMultiLikeOr,
            questionMultiLikeAnd)


    PROPERTY_LOADERS = {
    }

    def fromXml(self, node):
        KalturaQuestionCuePointBaseFilter.fromXml(self, node)
        self.fromXmlImpl(node, KalturaQuestionCuePointFilter.PROPERTY_LOADERS)

    def toParams(self):
        kparams = KalturaQuestionCuePointBaseFilter.toParams(self)
        kparams.put("objectType", "KalturaQuestionCuePointFilter")
        return kparams


########## services ##########

# @package Kaltura
# @subpackage Client
class KalturaQuizService(KalturaServiceBase):
    """Allows user to handle quizzes"""

    def __init__(self, client = None):
        KalturaServiceBase.__init__(self, client)

    def add(self, entryId, quiz):
        """Allows to add a quiz to an entry"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        kparams.addObjectIfDefined("quiz", quiz)
        self.client.queueServiceActionCall("quiz_quiz", "add", KalturaQuiz, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaQuiz)

    def update(self, entryId, quiz):
        """Allows to update a quiz"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        kparams.addObjectIfDefined("quiz", quiz)
        self.client.queueServiceActionCall("quiz_quiz", "update", KalturaQuiz, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaQuiz)

    def get(self, entryId):
        """Allows to get a quiz"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        self.client.queueServiceActionCall("quiz_quiz", "get", KalturaQuiz, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaQuiz)

    def list(self, filter = NotImplemented, pager = NotImplemented):
        """List quiz objects by filter and pager"""

        kparams = KalturaParams()
        kparams.addObjectIfDefined("filter", filter)
        kparams.addObjectIfDefined("pager", pager)
        self.client.queueServiceActionCall("quiz_quiz", "list", KalturaQuizListResponse, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return KalturaObjectFactory.create(resultNode, KalturaQuizListResponse)

    def serve(self, entryId, quizOutputType):
        """creates a pdf from quiz object
        	 The Output type defines the file format in which the quiz will be generated
        	 Currently only PDF files are supported"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        kparams.addIntIfDefined("quizOutputType", quizOutputType);
        self.client.queueServiceActionCall('quiz_quiz', 'serve', None ,kparams)
        return self.client.getServeUrl()

    def getUrl(self, entryId, quizOutputType):
        """sends a with an api request for pdf from quiz object"""

        kparams = KalturaParams()
        kparams.addStringIfDefined("entryId", entryId)
        kparams.addIntIfDefined("quizOutputType", quizOutputType);
        self.client.queueServiceActionCall("quiz_quiz", "getUrl", None, kparams)
        if self.client.isMultiRequest():
            return self.client.getMultiRequestResult()
        resultNode = self.client.doQueue()
        return getXmlNodeText(resultNode)

########## main ##########
class KalturaQuizClientPlugin(KalturaClientPlugin):
    # KalturaQuizClientPlugin
    instance = None

    # @return KalturaQuizClientPlugin
    @staticmethod
    def get():
        if KalturaQuizClientPlugin.instance == None:
            KalturaQuizClientPlugin.instance = KalturaQuizClientPlugin()
        return KalturaQuizClientPlugin.instance

    # @return array<KalturaServiceBase>
    def getServices(self):
        return {
            'quiz': KalturaQuizService,
        }

    def getEnums(self):
        return {
            'KalturaAnswerCuePointOrderBy': KalturaAnswerCuePointOrderBy,
            'KalturaQuestionCuePointOrderBy': KalturaQuestionCuePointOrderBy,
        }

    def getTypes(self):
        return {
            'KalturaOptionalAnswer': KalturaOptionalAnswer,
            'KalturaQuiz': KalturaQuiz,
            'KalturaAnswerCuePoint': KalturaAnswerCuePoint,
            'KalturaQuestionCuePoint': KalturaQuestionCuePoint,
            'KalturaQuizAdvancedFilter': KalturaQuizAdvancedFilter,
            'KalturaQuizListResponse': KalturaQuizListResponse,
            'KalturaQuizFilter': KalturaQuizFilter,
            'KalturaAnswerCuePointBaseFilter': KalturaAnswerCuePointBaseFilter,
            'KalturaQuestionCuePointBaseFilter': KalturaQuestionCuePointBaseFilter,
            'KalturaAnswerCuePointFilter': KalturaAnswerCuePointFilter,
            'KalturaQuestionCuePointFilter': KalturaQuestionCuePointFilter,
        }

    # @return string
    def getName(self):
        return 'quiz'

