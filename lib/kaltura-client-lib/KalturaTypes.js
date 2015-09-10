// ===================================================================================================
//                           _  __     _ _
//                          | |/ /__ _| | |_ _  _ _ _ __ _
//                          | ' </ _` | |  _| || | '_/ _` |
//                          |_|\_\__,_|_|\__|\_,_|_| \__,_|
//
// This file is part of the Kaltura Collaborative Media Suite which allows users
// to do with audio, video, and animation what Wiki platfroms allow them to do with
// text.
//
// Copyright (C) 2006-2015  Kaltura Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as
// published by the Free Software Foundation, either version 3 of the
// License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.
//
// @ignore
// ===================================================================================================

var KalturaAppearInListType = module.exports.KalturaAppearInListType = {
PARTNER_ONLY : 1,
CATEGORY_MEMBERS_ONLY : 3,
};

var KalturaAssetParamsDeletePolicy = module.exports.KalturaAssetParamsDeletePolicy = {
KEEP : 0,
DELETE : 1,
};

var KalturaAssetParamsOrigin = module.exports.KalturaAssetParamsOrigin = {
CONVERT : 0,
INGEST : 1,
CONVERT_WHEN_MISSING : 2,
};

var KalturaAssetStatus = module.exports.KalturaAssetStatus = {
ERROR : -1,
QUEUED : 0,
READY : 2,
DELETED : 3,
IMPORTING : 7,
EXPORTING : 9,
};

var KalturaAttachmentAssetStatus = module.exports.KalturaAttachmentAssetStatus = {
ERROR : -1,
QUEUED : 0,
READY : 2,
DELETED : 3,
IMPORTING : 7,
EXPORTING : 9,
};

var KalturaAuditTrailChangeXmlNodeType = module.exports.KalturaAuditTrailChangeXmlNodeType = {
CHANGED : 1,
ADDED : 2,
REMOVED : 3,
};

var KalturaAuditTrailContext = module.exports.KalturaAuditTrailContext = {
CLIENT : -1,
SCRIPT : 0,
PS2 : 1,
API_V3 : 2,
};

var KalturaAuditTrailFileSyncType = module.exports.KalturaAuditTrailFileSyncType = {
FILE : 1,
LINK : 2,
URL : 3,
};

var KalturaAuditTrailStatus = module.exports.KalturaAuditTrailStatus = {
PENDING : 1,
READY : 2,
FAILED : 3,
};

var KalturaBatchJobErrorTypes = module.exports.KalturaBatchJobErrorTypes = {
APP : 0,
RUNTIME : 1,
HTTP : 2,
CURL : 3,
KALTURA_API : 4,
KALTURA_CLIENT : 5,
};

var KalturaBatchJobStatus = module.exports.KalturaBatchJobStatus = {
PENDING : 0,
QUEUED : 1,
PROCESSING : 2,
PROCESSED : 3,
MOVEFILE : 4,
FINISHED : 5,
FAILED : 6,
ABORTED : 7,
ALMOST_DONE : 8,
RETRY : 9,
FATAL : 10,
DONT_PROCESS : 11,
FINISHED_PARTIALLY : 12,
};

var KalturaBitRateMode = module.exports.KalturaBitRateMode = {
CBR : 1,
VBR : 2,
};

var KalturaBulkUploadCsvVersion = module.exports.KalturaBulkUploadCsvVersion = {
V1 : 1,
V2 : 2,
V3 : 3,
};

var KalturaCaptionAssetStatus = module.exports.KalturaCaptionAssetStatus = {
ERROR : -1,
QUEUED : 0,
READY : 2,
DELETED : 3,
IMPORTING : 7,
EXPORTING : 9,
};

var KalturaCategoryEntryStatus = module.exports.KalturaCategoryEntryStatus = {
PENDING : 1,
ACTIVE : 2,
DELETED : 3,
REJECTED : 4,
};

var KalturaCategoryStatus = module.exports.KalturaCategoryStatus = {
UPDATING : 1,
ACTIVE : 2,
DELETED : 3,
PURGED : 4,
};

var KalturaCategoryUserPermissionLevel = module.exports.KalturaCategoryUserPermissionLevel = {
MANAGER : 0,
MODERATOR : 1,
CONTRIBUTOR : 2,
MEMBER : 3,
NONE : 4,
};

var KalturaCategoryUserStatus = module.exports.KalturaCategoryUserStatus = {
ACTIVE : 1,
PENDING : 2,
NOT_ACTIVE : 3,
DELETED : 4,
};

var KalturaCommercialUseType = module.exports.KalturaCommercialUseType = {
NON_COMMERCIAL_USE : 0,
COMMERCIAL_USE : 1,
};

var KalturaContributionPolicyType = module.exports.KalturaContributionPolicyType = {
ALL : 1,
MEMBERS_WITH_CONTRIBUTION_PERMISSION : 2,
};

var KalturaControlPanelCommandStatus = module.exports.KalturaControlPanelCommandStatus = {
PENDING : 1,
HANDLED : 2,
DONE : 3,
FAILED : 4,
};

var KalturaControlPanelCommandTargetType = module.exports.KalturaControlPanelCommandTargetType = {
DATA_CENTER : 1,
SCHEDULER : 2,
JOB_TYPE : 3,
JOB : 4,
BATCH : 5,
};

var KalturaControlPanelCommandType = module.exports.KalturaControlPanelCommandType = {
KILL : 4,
};

var KalturaCountryRestrictionType = module.exports.KalturaCountryRestrictionType = {
RESTRICT_COUNTRY_LIST : 0,
ALLOW_COUNTRY_LIST : 1,
};

var KalturaCuePointStatus = module.exports.KalturaCuePointStatus = {
READY : 1,
DELETED : 2,
HANDLED : 3,
PENDING : 4,
};

var KalturaDVRStatus = module.exports.KalturaDVRStatus = {
DISABLED : 0,
ENABLED : 1,
};

var KalturaDeleteFlavorsLogicType = module.exports.KalturaDeleteFlavorsLogicType = {
KEEP_LIST_DELETE_OTHERS : 1,
DELETE_LIST : 2,
DELETE_KEEP_SMALLEST : 3,
};

var KalturaDeliveryStatus = module.exports.KalturaDeliveryStatus = {
ACTIVE : 0,
DELETED : 1,
STAGING_IN : 2,
STAGING_OUT : 3,
};

var KalturaDirectoryRestrictionType = module.exports.KalturaDirectoryRestrictionType = {
DONT_DISPLAY : 0,
DISPLAY_WITH_LINK : 1,
};

var KalturaDistributionAction = module.exports.KalturaDistributionAction = {
SUBMIT : 1,
UPDATE : 2,
DELETE : 3,
FETCH_REPORT : 4,
};

var KalturaDistributionErrorType = module.exports.KalturaDistributionErrorType = {
MISSING_FLAVOR : 1,
MISSING_THUMBNAIL : 2,
MISSING_METADATA : 3,
INVALID_DATA : 4,
MISSING_ASSET : 5,
CONDITION_NOT_MET : 6,
};

var KalturaDistributionFieldRequiredStatus = module.exports.KalturaDistributionFieldRequiredStatus = {
NOT_REQUIRED : 0,
REQUIRED_BY_PROVIDER : 1,
REQUIRED_BY_PARTNER : 2,
REQUIRED_FOR_AUTOMATIC_DISTRIBUTION : 3,
};

var KalturaDistributionProfileActionStatus = module.exports.KalturaDistributionProfileActionStatus = {
DISABLED : 1,
AUTOMATIC : 2,
MANUAL : 3,
};

var KalturaDistributionProfileStatus = module.exports.KalturaDistributionProfileStatus = {
DISABLED : 1,
ENABLED : 2,
DELETED : 3,
};

var KalturaDistributionProtocol = module.exports.KalturaDistributionProtocol = {
FTP : 1,
SCP : 2,
SFTP : 3,
HTTP : 4,
HTTPS : 5,
ASPERA : 10,
};

var KalturaDistributionValidationErrorType = module.exports.KalturaDistributionValidationErrorType = {
CUSTOM_ERROR : 0,
STRING_EMPTY : 1,
STRING_TOO_LONG : 2,
STRING_TOO_SHORT : 3,
INVALID_FORMAT : 4,
};

var KalturaDocumentType = module.exports.KalturaDocumentType = {
DOCUMENT : 11,
SWF : 12,
PDF : 13,
};

var KalturaDrmLicenseExpirationPolicy = module.exports.KalturaDrmLicenseExpirationPolicy = {
FIXED_DURATION : 1,
ENTRY_SCHEDULING_END : 2,
UNLIMITED : 3,
};

var KalturaDrmPolicyStatus = module.exports.KalturaDrmPolicyStatus = {
ACTIVE : 1,
DELETED : 2,
};

var KalturaDrmProfileStatus = module.exports.KalturaDrmProfileStatus = {
ACTIVE : 1,
DELETED : 2,
};

var KalturaDropFolderContentFileHandlerMatchPolicy = module.exports.KalturaDropFolderContentFileHandlerMatchPolicy = {
ADD_AS_NEW : 1,
MATCH_EXISTING_OR_ADD_AS_NEW : 2,
MATCH_EXISTING_OR_KEEP_IN_FOLDER : 3,
};

var KalturaDropFolderFileDeletePolicy = module.exports.KalturaDropFolderFileDeletePolicy = {
MANUAL_DELETE : 1,
AUTO_DELETE : 2,
AUTO_DELETE_WHEN_ENTRY_IS_READY : 3,
};

var KalturaDropFolderFileStatus = module.exports.KalturaDropFolderFileStatus = {
UPLOADING : 1,
PENDING : 2,
WAITING : 3,
HANDLED : 4,
IGNORE : 5,
DELETED : 6,
PURGED : 7,
NO_MATCH : 8,
ERROR_HANDLING : 9,
ERROR_DELETING : 10,
DOWNLOADING : 11,
ERROR_DOWNLOADING : 12,
PROCESSING : 13,
PARSED : 14,
DETECTED : 15,
};

var KalturaDropFolderStatus = module.exports.KalturaDropFolderStatus = {
DISABLED : 0,
ENABLED : 1,
DELETED : 2,
ERROR : 3,
};

var KalturaEditorType = module.exports.KalturaEditorType = {
SIMPLE : 1,
ADVANCED : 2,
};

var KalturaEmailIngestionProfileStatus = module.exports.KalturaEmailIngestionProfileStatus = {
INACTIVE : 0,
ACTIVE : 1,
};

var KalturaEmailNotificationTemplatePriority = module.exports.KalturaEmailNotificationTemplatePriority = {
HIGH : 1,
NORMAL : 3,
LOW : 5,
};

var KalturaEntryDistributionFlag = module.exports.KalturaEntryDistributionFlag = {
NONE : 0,
SUBMIT_REQUIRED : 1,
DELETE_REQUIRED : 2,
UPDATE_REQUIRED : 3,
ENABLE_REQUIRED : 4,
DISABLE_REQUIRED : 5,
};

var KalturaEntryDistributionStatus = module.exports.KalturaEntryDistributionStatus = {
PENDING : 0,
QUEUED : 1,
READY : 2,
DELETED : 3,
SUBMITTING : 4,
UPDATING : 5,
DELETING : 6,
ERROR_SUBMITTING : 7,
ERROR_UPDATING : 8,
ERROR_DELETING : 9,
REMOVED : 10,
IMPORT_SUBMITTING : 11,
IMPORT_UPDATING : 12,
};

var KalturaEntryDistributionSunStatus = module.exports.KalturaEntryDistributionSunStatus = {
BEFORE_SUNRISE : 1,
AFTER_SUNRISE : 2,
AFTER_SUNSET : 3,
};

var KalturaEntryModerationStatus = module.exports.KalturaEntryModerationStatus = {
PENDING_MODERATION : 1,
APPROVED : 2,
REJECTED : 3,
FLAGGED_FOR_REVIEW : 5,
AUTO_APPROVED : 6,
};

var KalturaEventNotificationTemplateStatus = module.exports.KalturaEventNotificationTemplateStatus = {
DISABLED : 1,
ACTIVE : 2,
DELETED : 3,
};

var KalturaFeatureStatusType = module.exports.KalturaFeatureStatusType = {
LOCK_CATEGORY : 1,
CATEGORY : 2,
CATEGORY_ENTRY : 3,
ENTRY : 4,
CATEGORY_USER : 5,
USER : 6,
};

var KalturaFileSyncStatus = module.exports.KalturaFileSyncStatus = {
ERROR : -1,
PENDING : 1,
READY : 2,
DELETED : 3,
PURGED : 4,
};

var KalturaFileSyncType = module.exports.KalturaFileSyncType = {
FILE : 1,
LINK : 2,
URL : 3,
};

var KalturaFlavorAssetStatus = module.exports.KalturaFlavorAssetStatus = {
ERROR : -1,
QUEUED : 0,
CONVERTING : 1,
READY : 2,
DELETED : 3,
NOT_APPLICABLE : 4,
TEMP : 5,
WAIT_FOR_CONVERT : 6,
IMPORTING : 7,
VALIDATING : 8,
EXPORTING : 9,
};

var KalturaFlavorReadyBehaviorType = module.exports.KalturaFlavorReadyBehaviorType = {
NO_IMPACT : 0,
INHERIT_FLAVOR_PARAMS : 0,
REQUIRED : 1,
OPTIONAL : 2,
};

var KalturaGender = module.exports.KalturaGender = {
UNKNOWN : 0,
MALE : 1,
FEMALE : 2,
};

var KalturaGenericDistributionProviderParser = module.exports.KalturaGenericDistributionProviderParser = {
XSL : 1,
XPATH : 2,
REGEX : 3,
};

var KalturaGenericDistributionProviderStatus = module.exports.KalturaGenericDistributionProviderStatus = {
ACTIVE : 2,
DELETED : 3,
};

var KalturaGroupUserStatus = module.exports.KalturaGroupUserStatus = {
ACTIVE : 0,
DELETED : 1,
};

var KalturaHttpNotificationAuthenticationMethod = module.exports.KalturaHttpNotificationAuthenticationMethod = {
ANYSAFE : -18,
ANY : -17,
BASIC : 1,
DIGEST : 2,
GSSNEGOTIATE : 4,
NTLM : 8,
};

var KalturaHttpNotificationMethod = module.exports.KalturaHttpNotificationMethod = {
GET : 1,
POST : 2,
PUT : 3,
DELETE : 4,
};

var KalturaHttpNotificationSslVersion = module.exports.KalturaHttpNotificationSslVersion = {
V2 : 2,
V3 : 3,
};

var KalturaInheritanceType = module.exports.KalturaInheritanceType = {
INHERIT : 1,
MANUAL : 2,
};

var KalturaIpAddressRestrictionType = module.exports.KalturaIpAddressRestrictionType = {
RESTRICT_LIST : 0,
ALLOW_LIST : 1,
};

var KalturaLicenseType = module.exports.KalturaLicenseType = {
UNKNOWN : -1,
NONE : 0,
COPYRIGHTED : 1,
PUBLIC_DOMAIN : 2,
CREATIVECOMMONS_ATTRIBUTION : 3,
CREATIVECOMMONS_ATTRIBUTION_SHARE_ALIKE : 4,
CREATIVECOMMONS_ATTRIBUTION_NO_DERIVATIVES : 5,
CREATIVECOMMONS_ATTRIBUTION_NON_COMMERCIAL : 6,
CREATIVECOMMONS_ATTRIBUTION_NON_COMMERCIAL_SHARE_ALIKE : 7,
CREATIVECOMMONS_ATTRIBUTION_NON_COMMERCIAL_NO_DERIVATIVES : 8,
GFDL : 9,
GPL : 10,
AFFERO_GPL : 11,
LGPL : 12,
BSD : 13,
APACHE : 14,
MOZILLA : 15,
};

var KalturaLimitFlavorsRestrictionType = module.exports.KalturaLimitFlavorsRestrictionType = {
RESTRICT_LIST : 0,
ALLOW_LIST : 1,
};

var KalturaLivePublishStatus = module.exports.KalturaLivePublishStatus = {
DISABLED : 0,
ENABLED : 1,
};

var KalturaLiveReportExportType = module.exports.KalturaLiveReportExportType = {
PARTNER_TOTAL_ALL : 1,
PARTNER_TOTAL_LIVE : 2,
ENTRY_TIME_LINE_ALL : 11,
ENTRY_TIME_LINE_LIVE : 12,
LOCATION_ALL : 21,
LOCATION_LIVE : 22,
SYNDICATION_ALL : 31,
SYNDICATION_LIVE : 32,
};

var KalturaLiveStatsEventType = module.exports.KalturaLiveStatsEventType = {
LIVE : 1,
DVR : 2,
};

var KalturaMailJobStatus = module.exports.KalturaMailJobStatus = {
PENDING : 1,
SENT : 2,
ERROR : 3,
QUEUED : 4,
};

var KalturaMediaServerIndex = module.exports.KalturaMediaServerIndex = {
PRIMARY : 0,
SECONDARY : 1,
};

var KalturaMediaType = module.exports.KalturaMediaType = {
VIDEO : 1,
IMAGE : 2,
AUDIO : 5,
LIVE_STREAM_FLASH : 201,
LIVE_STREAM_WINDOWS_MEDIA : 202,
LIVE_STREAM_REAL_MEDIA : 203,
LIVE_STREAM_QUICKTIME : 204,
};

var KalturaMetadataProfileCreateMode = module.exports.KalturaMetadataProfileCreateMode = {
API : 1,
KMC : 2,
APP : 3,
};

var KalturaMetadataProfileStatus = module.exports.KalturaMetadataProfileStatus = {
ACTIVE : 1,
DEPRECATED : 2,
TRANSFORMING : 3,
};

var KalturaMetadataStatus = module.exports.KalturaMetadataStatus = {
VALID : 1,
INVALID : 2,
DELETED : 3,
};

var KalturaModerationFlagType = module.exports.KalturaModerationFlagType = {
SEXUAL_CONTENT : 1,
VIOLENT_REPULSIVE : 2,
HARMFUL_DANGEROUS : 3,
SPAM_COMMERCIALS : 4,
COPYRIGHT : 5,
TERMS_OF_USE_VIOLATION : 6,
};

var KalturaMrssExtensionMode = module.exports.KalturaMrssExtensionMode = {
APPEND : 1,
REPLACE : 2,
};

var KalturaNotificationObjectType = module.exports.KalturaNotificationObjectType = {
ENTRY : 1,
KSHOW : 2,
USER : 3,
BATCH_JOB : 4,
};

var KalturaNotificationStatus = module.exports.KalturaNotificationStatus = {
PENDING : 1,
SENT : 2,
ERROR : 3,
SHOULD_RESEND : 4,
ERROR_RESENDING : 5,
SENT_SYNCH : 6,
QUEUED : 7,
};

var KalturaNotificationType = module.exports.KalturaNotificationType = {
ENTRY_ADD : 1,
ENTR_UPDATE_PERMISSIONS : 2,
ENTRY_DELETE : 3,
ENTRY_BLOCK : 4,
ENTRY_UPDATE : 5,
ENTRY_UPDATE_THUMBNAIL : 6,
ENTRY_UPDATE_MODERATION : 7,
USER_ADD : 21,
USER_BANNED : 26,
};

var KalturaNullableBoolean = module.exports.KalturaNullableBoolean = {
NULL_VALUE : -1,
FALSE_VALUE : 0,
TRUE_VALUE : 1,
};

var KalturaPartnerGroupType = module.exports.KalturaPartnerGroupType = {
PUBLISHER : 1,
VAR_GROUP : 2,
GROUP : 3,
TEMPLATE : 4,
};

var KalturaPartnerStatus = module.exports.KalturaPartnerStatus = {
DELETED : 0,
ACTIVE : 1,
BLOCKED : 2,
FULL_BLOCK : 3,
};

var KalturaPartnerType = module.exports.KalturaPartnerType = {
KMC : 1,
WIKI : 100,
WORDPRESS : 101,
DRUPAL : 102,
DEKIWIKI : 103,
MOODLE : 104,
COMMUNITY_EDITION : 105,
JOOMLA : 106,
BLACKBOARD : 107,
SAKAI : 108,
ADMIN_CONSOLE : 109,
};

var KalturaPermissionStatus = module.exports.KalturaPermissionStatus = {
ACTIVE : 1,
BLOCKED : 2,
DELETED : 3,
};

var KalturaPermissionType = module.exports.KalturaPermissionType = {
NORMAL : 1,
SPECIAL_FEATURE : 2,
PLUGIN : 3,
PARTNER_GROUP : 4,
};

var KalturaPlayReadyAnalogVideoOPL = module.exports.KalturaPlayReadyAnalogVideoOPL = {
MIN_100 : 100,
MIN_150 : 150,
MIN_200 : 200,
};

var KalturaPlayReadyCompressedDigitalVideoOPL = module.exports.KalturaPlayReadyCompressedDigitalVideoOPL = {
MIN_400 : 400,
MIN_500 : 500,
};

var KalturaPlayReadyDigitalAudioOPL = module.exports.KalturaPlayReadyDigitalAudioOPL = {
MIN_100 : 100,
MIN_150 : 150,
MIN_200 : 200,
MIN_250 : 250,
MIN_300 : 300,
};

var KalturaPlayReadyLicenseRemovalPolicy = module.exports.KalturaPlayReadyLicenseRemovalPolicy = {
FIXED_FROM_EXPIRATION : 1,
ENTRY_SCHEDULING_END : 2,
NONE : 3,
};

var KalturaPlayReadyMinimumLicenseSecurityLevel = module.exports.KalturaPlayReadyMinimumLicenseSecurityLevel = {
NON_COMMERCIAL_QUALITY : 150,
COMMERCIAL_QUALITY : 2000,
};

var KalturaPlayReadyUncompressedDigitalVideoOPL = module.exports.KalturaPlayReadyUncompressedDigitalVideoOPL = {
MIN_100 : 100,
MIN_250 : 250,
MIN_270 : 270,
MIN_300 : 300,
};

var KalturaPlaylistType = module.exports.KalturaPlaylistType = {
STATIC_LIST : 3,
DYNAMIC : 10,
EXTERNAL : 101,
};

var KalturaPrivacyType = module.exports.KalturaPrivacyType = {
ALL : 1,
AUTHENTICATED_USERS : 2,
MEMBERS_ONLY : 3,
};

var KalturaRecordStatus = module.exports.KalturaRecordStatus = {
DISABLED : 0,
APPENDED : 1,
PER_SESSION : 2,
};

var KalturaReportType = module.exports.KalturaReportType = {
TOP_CONTENT : 1,
CONTENT_DROPOFF : 2,
CONTENT_INTERACTIONS : 3,
MAP_OVERLAY : 4,
TOP_CONTRIBUTORS : 5,
TOP_SYNDICATION : 6,
CONTENT_CONTRIBUTIONS : 7,
USER_ENGAGEMENT : 11,
SPEFICIC_USER_ENGAGEMENT : 12,
USER_TOP_CONTENT : 13,
USER_CONTENT_DROPOFF : 14,
USER_CONTENT_INTERACTIONS : 15,
APPLICATIONS : 16,
USER_USAGE : 17,
SPECIFIC_USER_USAGE : 18,
VAR_USAGE : 19,
TOP_CREATORS : 20,
PLATFORMS : 21,
OPERATION_SYSTEM : 22,
BROWSERS : 23,
LIVE : 24,
TOP_PLAYBACK_CONTEXT : 25,
PARTNER_USAGE : 201,
};

var KalturaResponseProfileStatus = module.exports.KalturaResponseProfileStatus = {
DISABLED : 1,
ENABLED : 2,
DELETED : 3,
};

var KalturaResponseProfileType = module.exports.KalturaResponseProfileType = {
INCLUDE_FIELDS : 1,
EXCLUDE_FIELDS : 2,
};

var KalturaResponseType = module.exports.KalturaResponseType = {
RESPONSE_TYPE_JSON : 1,
RESPONSE_TYPE_XML : 2,
RESPONSE_TYPE_PHP : 3,
RESPONSE_TYPE_PHP_ARRAY : 4,
RESPONSE_TYPE_HTML : 7,
RESPONSE_TYPE_MRSS : 8,
RESPONSE_TYPE_JSONP : 9,
};

var KalturaScheduledTaskAddOrRemoveType = module.exports.KalturaScheduledTaskAddOrRemoveType = {
ADD : 1,
REMOVE : 2,
};

var KalturaScheduledTaskProfileStatus = module.exports.KalturaScheduledTaskProfileStatus = {
DISABLED : 1,
ACTIVE : 2,
DELETED : 3,
SUSPENDED : 4,
DRY_RUN_ONLY : 5,
};

var KalturaSchedulerStatusType = module.exports.KalturaSchedulerStatusType = {
RUNNING_BATCHES_COUNT : 1,
RUNNING_BATCHES_CPU : 2,
RUNNING_BATCHES_MEMORY : 3,
RUNNING_BATCHES_NETWORK : 4,
RUNNING_BATCHES_DISC_IO : 5,
RUNNING_BATCHES_DISC_SPACE : 6,
RUNNING_BATCHES_IS_RUNNING : 7,
};

var KalturaSearchOperatorType = module.exports.KalturaSearchOperatorType = {
SEARCH_AND : 1,
SEARCH_OR : 2,
};

var KalturaSearchProviderType = module.exports.KalturaSearchProviderType = {
FLICKR : 3,
YOUTUBE : 4,
MYSPACE : 7,
PHOTOBUCKET : 8,
JAMENDO : 9,
CCMIXTER : 10,
NYPL : 11,
CURRENT : 12,
MEDIA_COMMONS : 13,
KALTURA : 20,
KALTURA_USER_CLIPS : 21,
ARCHIVE_ORG : 22,
KALTURA_PARTNER : 23,
METACAFE : 24,
SEARCH_PROXY : 28,
PARTNER_SPECIFIC : 100,
};

var KalturaSessionType = module.exports.KalturaSessionType = {
USER : 0,
ADMIN : 2,
};

var KalturaShortLinkStatus = module.exports.KalturaShortLinkStatus = {
DISABLED : 1,
ENABLED : 2,
DELETED : 3,
};

var KalturaSiteRestrictionType = module.exports.KalturaSiteRestrictionType = {
RESTRICT_SITE_LIST : 0,
ALLOW_SITE_LIST : 1,
};

var KalturaStatsEventType = module.exports.KalturaStatsEventType = {
WIDGET_LOADED : 1,
MEDIA_LOADED : 2,
PLAY : 3,
PLAY_REACHED_25 : 4,
PLAY_REACHED_50 : 5,
PLAY_REACHED_75 : 6,
PLAY_REACHED_100 : 7,
OPEN_EDIT : 8,
OPEN_VIRAL : 9,
OPEN_DOWNLOAD : 10,
OPEN_REPORT : 11,
BUFFER_START : 12,
BUFFER_END : 13,
OPEN_FULL_SCREEN : 14,
CLOSE_FULL_SCREEN : 15,
REPLAY : 16,
SEEK : 17,
OPEN_UPLOAD : 18,
SAVE_PUBLISH : 19,
CLOSE_EDITOR : 20,
PRE_BUMPER_PLAYED : 21,
POST_BUMPER_PLAYED : 22,
BUMPER_CLICKED : 23,
PREROLL_STARTED : 24,
MIDROLL_STARTED : 25,
POSTROLL_STARTED : 26,
OVERLAY_STARTED : 27,
PREROLL_CLICKED : 28,
MIDROLL_CLICKED : 29,
POSTROLL_CLICKED : 30,
OVERLAY_CLICKED : 31,
PREROLL_25 : 32,
PREROLL_50 : 33,
PREROLL_75 : 34,
MIDROLL_25 : 35,
MIDROLL_50 : 36,
MIDROLL_75 : 37,
POSTROLL_25 : 38,
POSTROLL_50 : 39,
POSTROLL_75 : 40,
};

var KalturaStatsFeatureType = module.exports.KalturaStatsFeatureType = {
NONE : 0,
RELATED : 1,
};

var KalturaStatsKmcEventType = module.exports.KalturaStatsKmcEventType = {
CONTENT_PAGE_VIEW : 1001,
CONTENT_ADD_PLAYLIST : 1010,
CONTENT_EDIT_PLAYLIST : 1011,
CONTENT_DELETE_PLAYLIST : 1012,
CONTENT_EDIT_ENTRY : 1013,
CONTENT_CHANGE_THUMBNAIL : 1014,
CONTENT_ADD_TAGS : 1015,
CONTENT_REMOVE_TAGS : 1016,
CONTENT_ADD_ADMIN_TAGS : 1017,
CONTENT_REMOVE_ADMIN_TAGS : 1018,
CONTENT_DOWNLOAD : 1019,
CONTENT_APPROVE_MODERATION : 1020,
CONTENT_REJECT_MODERATION : 1021,
CONTENT_BULK_UPLOAD : 1022,
CONTENT_ADMIN_KCW_UPLOAD : 1023,
ACCOUNT_CHANGE_PARTNER_INFO : 1030,
ACCOUNT_CHANGE_LOGIN_INFO : 1031,
ACCOUNT_CONTACT_US_USAGE : 1032,
ACCOUNT_UPDATE_SERVER_SETTINGS : 1033,
ACCOUNT_ACCOUNT_OVERVIEW : 1034,
ACCOUNT_ACCESS_CONTROL : 1035,
ACCOUNT_TRANSCODING_SETTINGS : 1036,
ACCOUNT_ACCOUNT_UPGRADE : 1037,
ACCOUNT_SAVE_SERVER_SETTINGS : 1038,
ACCOUNT_ACCESS_CONTROL_DELETE : 1039,
ACCOUNT_SAVE_TRANSCODING_SETTINGS : 1040,
LOGIN : 1041,
DASHBOARD_IMPORT_CONTENT : 1042,
DASHBOARD_UPDATE_CONTENT : 1043,
DASHBOARD_ACCOUNT_CONTACT_US : 1044,
DASHBOARD_VIEW_REPORTS : 1045,
DASHBOARD_EMBED_PLAYER : 1046,
DASHBOARD_EMBED_PLAYLIST : 1047,
DASHBOARD_CUSTOMIZE_PLAYERS : 1048,
APP_STUDIO_NEW_PLAYER_SINGLE_VIDEO : 1050,
APP_STUDIO_NEW_PLAYER_PLAYLIST : 1051,
APP_STUDIO_NEW_PLAYER_MULTI_TAB_PLAYLIST : 1052,
APP_STUDIO_EDIT_PLAYER_SINGLE_VIDEO : 1053,
APP_STUDIO_EDIT_PLAYER_PLAYLIST : 1054,
APP_STUDIO_EDIT_PLAYER_MULTI_TAB_PLAYLIST : 1055,
APP_STUDIO_DUPLICATE_PLAYER : 1056,
CONTENT_CONTENT_GO_TO_PAGE : 1057,
CONTENT_DELETE_ITEM : 1058,
CONTENT_DELETE_MIX : 1059,
REPORTS_AND_ANALYTICS_BANDWIDTH_USAGE_TAB : 1070,
REPORTS_AND_ANALYTICS_CONTENT_REPORTS_TAB : 1071,
REPORTS_AND_ANALYTICS_USERS_AND_COMMUNITY_REPORTS_TAB : 1072,
REPORTS_AND_ANALYTICS_TOP_CONTRIBUTORS : 1073,
REPORTS_AND_ANALYTICS_MAP_OVERLAYS : 1074,
REPORTS_AND_ANALYTICS_TOP_SYNDICATIONS : 1075,
REPORTS_AND_ANALYTICS_TOP_CONTENT : 1076,
REPORTS_AND_ANALYTICS_CONTENT_DROPOFF : 1077,
REPORTS_AND_ANALYTICS_CONTENT_INTERACTIONS : 1078,
REPORTS_AND_ANALYTICS_CONTENT_CONTRIBUTIONS : 1079,
REPORTS_AND_ANALYTICS_VIDEO_DRILL_DOWN : 1080,
REPORTS_AND_ANALYTICS_CONTENT_DRILL_DOWN_INTERACTION : 1081,
REPORTS_AND_ANALYTICS_CONTENT_CONTRIBUTIONS_DRILLDOWN : 1082,
REPORTS_AND_ANALYTICS_VIDEO_DRILL_DOWN_DROPOFF : 1083,
REPORTS_AND_ANALYTICS_MAP_OVERLAYS_DRILLDOWN : 1084,
REPORTS_AND_ANALYTICS_TOP_SYNDICATIONS_DRILL_DOWN : 1085,
REPORTS_AND_ANALYTICS_BANDWIDTH_USAGE_VIEW_MONTHLY : 1086,
REPORTS_AND_ANALYTICS_BANDWIDTH_USAGE_VIEW_YEARLY : 1087,
CONTENT_ENTRY_DRILLDOWN : 1088,
CONTENT_OPEN_PREVIEW_AND_EMBED : 1089,
};

var KalturaStorageProfileDeliveryStatus = module.exports.KalturaStorageProfileDeliveryStatus = {
ACTIVE : 1,
BLOCKED : 2,
};

var KalturaStorageProfileReadyBehavior = module.exports.KalturaStorageProfileReadyBehavior = {
NO_IMPACT : 0,
REQUIRED : 1,
};

var KalturaStorageProfileStatus = module.exports.KalturaStorageProfileStatus = {
DISABLED : 1,
AUTOMATIC : 2,
MANUAL : 3,
};

var KalturaSyndicationFeedStatus = module.exports.KalturaSyndicationFeedStatus = {
DELETED : -1,
ACTIVE : 1,
};

var KalturaSyndicationFeedType = module.exports.KalturaSyndicationFeedType = {
GOOGLE_VIDEO : 1,
YAHOO : 2,
ITUNES : 3,
TUBE_MOGUL : 4,
KALTURA : 5,
KALTURA_XSLT : 6,
};

var KalturaThumbAssetStatus = module.exports.KalturaThumbAssetStatus = {
ERROR : -1,
QUEUED : 0,
CAPTURING : 1,
READY : 2,
DELETED : 3,
IMPORTING : 7,
EXPORTING : 9,
};

var KalturaThumbCropType = module.exports.KalturaThumbCropType = {
RESIZE : 1,
RESIZE_WITH_PADDING : 2,
CROP : 3,
CROP_FROM_TOP : 4,
RESIZE_WITH_FORCE : 5,
};

var KalturaThumbCuePointSubType = module.exports.KalturaThumbCuePointSubType = {
SLIDE : 1,
CHAPTER : 2,
};

var KalturaUiConfCreationMode = module.exports.KalturaUiConfCreationMode = {
WIZARD : 2,
ADVANCED : 3,
};

var KalturaUiConfObjType = module.exports.KalturaUiConfObjType = {
PLAYER : 1,
CONTRIBUTION_WIZARD : 2,
SIMPLE_EDITOR : 3,
ADVANCED_EDITOR : 4,
PLAYLIST : 5,
APP_STUDIO : 6,
KRECORD : 7,
PLAYER_V3 : 8,
KMC_ACCOUNT : 9,
KMC_ANALYTICS : 10,
KMC_CONTENT : 11,
KMC_DASHBOARD : 12,
KMC_LOGIN : 13,
PLAYER_SL : 14,
CLIENTSIDE_ENCODER : 15,
KMC_GENERAL : 16,
KMC_ROLES_AND_PERMISSIONS : 17,
CLIPPER : 18,
KSR : 19,
KUPLOAD : 20,
WEBCASTING : 21,
};

var KalturaUpdateMethodType = module.exports.KalturaUpdateMethodType = {
MANUAL : 0,
AUTOMATIC : 1,
};

var KalturaUploadErrorCode = module.exports.KalturaUploadErrorCode = {
NO_ERROR : 0,
GENERAL_ERROR : 1,
PARTIAL_UPLOAD : 2,
};

var KalturaUploadTokenStatus = module.exports.KalturaUploadTokenStatus = {
PENDING : 0,
PARTIAL_UPLOAD : 1,
FULL_UPLOAD : 2,
CLOSED : 3,
TIMED_OUT : 4,
DELETED : 5,
};

var KalturaUserAgentRestrictionType = module.exports.KalturaUserAgentRestrictionType = {
RESTRICT_LIST : 0,
ALLOW_LIST : 1,
};

var KalturaUserJoinPolicyType = module.exports.KalturaUserJoinPolicyType = {
AUTO_JOIN : 1,
REQUEST_TO_JOIN : 2,
NOT_ALLOWED : 3,
};

var KalturaUserRoleStatus = module.exports.KalturaUserRoleStatus = {
ACTIVE : 1,
BLOCKED : 2,
DELETED : 3,
};

var KalturaUserStatus = module.exports.KalturaUserStatus = {
BLOCKED : 0,
ACTIVE : 1,
DELETED : 2,
};

var KalturaUserType = module.exports.KalturaUserType = {
USER : 0,
GROUP : 1,
};

var KalturaVirusFoundAction = module.exports.KalturaVirusFoundAction = {
NONE : 0,
DELETE : 1,
CLEAN_NONE : 2,
CLEAN_DELETE : 3,
};

var KalturaVirusScanJobResult = module.exports.KalturaVirusScanJobResult = {
SCAN_ERROR : 1,
FILE_IS_CLEAN : 2,
FILE_WAS_CLEANED : 3,
FILE_INFECTED : 4,
};

var KalturaVirusScanProfileStatus = module.exports.KalturaVirusScanProfileStatus = {
DISABLED : 1,
ENABLED : 2,
DELETED : 3,
};

var KalturaWidevineRepositorySyncMode = module.exports.KalturaWidevineRepositorySyncMode = {
MODIFY : 0,
};

var KalturaWidgetSecurityType = module.exports.KalturaWidgetSecurityType = {
NONE : 1,
TIMEHASH : 2,
};

var KalturaAccessControlOrderBy = module.exports.KalturaAccessControlOrderBy = {
CREATED_AT_ASC : '+createdAt',
CREATED_AT_DESC : '-createdAt',
};

var KalturaAccessControlProfileOrderBy = module.exports.KalturaAccessControlProfileOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaActivitiBusinessProcessServerOrderBy = module.exports.KalturaActivitiBusinessProcessServerOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaActivitiBusinessProcessServerProtocol = module.exports.KalturaActivitiBusinessProcessServerProtocol = {
HTTP : 'http',
HTTPS : 'https',
};

var KalturaAdCuePointOrderBy = module.exports.KalturaAdCuePointOrderBy = {
CREATED_AT_ASC : '+createdAt',
DURATION_ASC : '+duration',
END_TIME_ASC : '+endTime',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
START_TIME_ASC : '+startTime',
TRIGGERED_AT_ASC : '+triggeredAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
DURATION_DESC : '-duration',
END_TIME_DESC : '-endTime',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
START_TIME_DESC : '-startTime',
TRIGGERED_AT_DESC : '-triggeredAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaAdProtocolType = module.exports.KalturaAdProtocolType = {
CUSTOM : '0',
VAST : '1',
VAST_2_0 : '2',
VPAID : '3',
};

var KalturaAdType = module.exports.KalturaAdType = {
VIDEO : '1',
OVERLAY : '2',
};

var KalturaAdminUserOrderBy = module.exports.KalturaAdminUserOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
};

var KalturaAkamaiUniversalStreamType = module.exports.KalturaAkamaiUniversalStreamType = {
HD_IPHONE_IPAD_LIVE : 'HD iPhone/iPad Live',
UNIVERSAL_STREAMING_LIVE : 'Universal Streaming Live',
};

var KalturaAmazonS3StorageProfileFilesPermissionLevel = module.exports.KalturaAmazonS3StorageProfileFilesPermissionLevel = {
ACL_AUTHENTICATED_READ : 'authenticated-read',
ACL_PRIVATE : 'private',
ACL_PUBLIC_READ : 'public-read',
ACL_PUBLIC_READ_WRITE : 'public-read-write',
};

var KalturaAmazonS3StorageProfileOrderBy = module.exports.KalturaAmazonS3StorageProfileOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaAnnotationOrderBy = module.exports.KalturaAnnotationOrderBy = {
CREATED_AT_ASC : '+createdAt',
DURATION_ASC : '+duration',
END_TIME_ASC : '+endTime',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
START_TIME_ASC : '+startTime',
TRIGGERED_AT_ASC : '+triggeredAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
DURATION_DESC : '-duration',
END_TIME_DESC : '-endTime',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
START_TIME_DESC : '-startTime',
TRIGGERED_AT_DESC : '-triggeredAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaApiActionPermissionItemOrderBy = module.exports.KalturaApiActionPermissionItemOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaApiParameterPermissionItemAction = module.exports.KalturaApiParameterPermissionItemAction = {
USAGE : 'all',
INSERT : 'insert',
READ : 'read',
UPDATE : 'update',
};

var KalturaApiParameterPermissionItemOrderBy = module.exports.KalturaApiParameterPermissionItemOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaAssetOrderBy = module.exports.KalturaAssetOrderBy = {
CREATED_AT_ASC : '+createdAt',
DELETED_AT_ASC : '+deletedAt',
SIZE_ASC : '+size',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
DELETED_AT_DESC : '-deletedAt',
SIZE_DESC : '-size',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaAssetParamsOrderBy = module.exports.KalturaAssetParamsOrderBy = {
};

var KalturaAssetParamsOutputOrderBy = module.exports.KalturaAssetParamsOutputOrderBy = {
};

var KalturaAssetType = module.exports.KalturaAssetType = {
ATTACHMENT : 'attachment.Attachment',
CAPTION : 'caption.Caption',
DOCUMENT : 'document.Document',
IMAGE : 'document.Image',
PDF : 'document.PDF',
SWF : 'document.SWF',
TIMED_THUMB_ASSET : 'thumbCuePoint.timedThumb',
WIDEVINE_FLAVOR : 'widevine.WidevineFlavor',
FLAVOR : '1',
THUMBNAIL : '2',
LIVE : '3',
};

var KalturaAttachmentAssetOrderBy = module.exports.KalturaAttachmentAssetOrderBy = {
CREATED_AT_ASC : '+createdAt',
DELETED_AT_ASC : '+deletedAt',
SIZE_ASC : '+size',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
DELETED_AT_DESC : '-deletedAt',
SIZE_DESC : '-size',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaAttachmentType = module.exports.KalturaAttachmentType = {
TEXT : '1',
MEDIA : '2',
DOCUMENT : '3',
};

var KalturaAudioCodec = module.exports.KalturaAudioCodec = {
NONE : '',
AAC : 'aac',
AACHE : 'aache',
AC3 : 'ac3',
AMRNB : 'amrnb',
COPY : 'copy',
MP3 : 'mp3',
MPEG2 : 'mpeg2',
PCM : 'pcm',
VORBIS : 'vorbis',
WMA : 'wma',
WMAPRO : 'wmapro',
};

var KalturaAuditTrailAction = module.exports.KalturaAuditTrailAction = {
CHANGED : 'CHANGED',
CONTENT_VIEWED : 'CONTENT_VIEWED',
COPIED : 'COPIED',
CREATED : 'CREATED',
DELETED : 'DELETED',
FILE_SYNC_CREATED : 'FILE_SYNC_CREATED',
RELATION_ADDED : 'RELATION_ADDED',
RELATION_REMOVED : 'RELATION_REMOVED',
VIEWED : 'VIEWED',
};

var KalturaAuditTrailObjectType = module.exports.KalturaAuditTrailObjectType = {
BATCH_JOB : 'BatchJob',
EMAIL_INGESTION_PROFILE : 'EmailIngestionProfile',
FILE_SYNC : 'FileSync',
KSHOW_KUSER : 'KshowKuser',
METADATA : 'Metadata',
METADATA_PROFILE : 'MetadataProfile',
PARTNER : 'Partner',
PERMISSION : 'Permission',
UPLOAD_TOKEN : 'UploadToken',
USER_LOGIN_DATA : 'UserLoginData',
USER_ROLE : 'UserRole',
ACCESS_CONTROL : 'accessControl',
CATEGORY : 'category',
CONVERSION_PROFILE_2 : 'conversionProfile2',
ENTRY : 'entry',
FLAVOR_ASSET : 'flavorAsset',
FLAVOR_PARAMS : 'flavorParams',
FLAVOR_PARAMS_CONVERSION_PROFILE : 'flavorParamsConversionProfile',
FLAVOR_PARAMS_OUTPUT : 'flavorParamsOutput',
KSHOW : 'kshow',
KUSER : 'kuser',
MEDIA_INFO : 'mediaInfo',
MODERATION : 'moderation',
ROUGHCUT : 'roughcutEntry',
SYNDICATION : 'syndicationFeed',
THUMBNAIL_ASSET : 'thumbAsset',
THUMBNAIL_PARAMS : 'thumbParams',
THUMBNAIL_PARAMS_OUTPUT : 'thumbParamsOutput',
UI_CONF : 'uiConf',
WIDGET : 'widget',
};

var KalturaAuditTrailOrderBy = module.exports.KalturaAuditTrailOrderBy = {
CREATED_AT_ASC : '+createdAt',
PARSED_AT_ASC : '+parsedAt',
CREATED_AT_DESC : '-createdAt',
PARSED_AT_DESC : '-parsedAt',
};

var KalturaBaseEntryOrderBy = module.exports.KalturaBaseEntryOrderBy = {
CREATED_AT_ASC : '+createdAt',
END_DATE_ASC : '+endDate',
MODERATION_COUNT_ASC : '+moderationCount',
NAME_ASC : '+name',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
RANK_ASC : '+rank',
RECENT_ASC : '+recent',
START_DATE_ASC : '+startDate',
TOTAL_RANK_ASC : '+totalRank',
UPDATED_AT_ASC : '+updatedAt',
WEIGHT_ASC : '+weight',
CREATED_AT_DESC : '-createdAt',
END_DATE_DESC : '-endDate',
MODERATION_COUNT_DESC : '-moderationCount',
NAME_DESC : '-name',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
RANK_DESC : '-rank',
RECENT_DESC : '-recent',
START_DATE_DESC : '-startDate',
TOTAL_RANK_DESC : '-totalRank',
UPDATED_AT_DESC : '-updatedAt',
WEIGHT_DESC : '-weight',
};

var KalturaBaseSyndicationFeedOrderBy = module.exports.KalturaBaseSyndicationFeedOrderBy = {
CREATED_AT_ASC : '+createdAt',
NAME_ASC : '+name',
PLAYLIST_ID_ASC : '+playlistId',
TYPE_ASC : '+type',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
NAME_DESC : '-name',
PLAYLIST_ID_DESC : '-playlistId',
TYPE_DESC : '-type',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaBatchJobObjectType = module.exports.KalturaBatchJobObjectType = {
ENTRY_DISTRIBUTION : 'contentDistribution.EntryDistribution',
DROP_FOLDER_FILE : 'dropFolderXmlBulkUpload.DropFolderFile',
METADATA : 'metadata.Metadata',
METADATA_PROFILE : 'metadata.MetadataProfile',
SCHEDULED_TASK_PROFILE : 'scheduledTask.ScheduledTaskProfile',
ENTRY : '1',
CATEGORY : '2',
FILE_SYNC : '3',
ASSET : '4',
};

var KalturaBatchJobOrderBy = module.exports.KalturaBatchJobOrderBy = {
CREATED_AT_ASC : '+createdAt',
ESTIMATED_EFFORT_ASC : '+estimatedEffort',
EXECUTION_ATTEMPTS_ASC : '+executionAttempts',
FINISH_TIME_ASC : '+finishTime',
LOCK_VERSION_ASC : '+lockVersion',
PRIORITY_ASC : '+priority',
QUEUE_TIME_ASC : '+queueTime',
STATUS_ASC : '+status',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ESTIMATED_EFFORT_DESC : '-estimatedEffort',
EXECUTION_ATTEMPTS_DESC : '-executionAttempts',
FINISH_TIME_DESC : '-finishTime',
LOCK_VERSION_DESC : '-lockVersion',
PRIORITY_DESC : '-priority',
QUEUE_TIME_DESC : '-queueTime',
STATUS_DESC : '-status',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaBatchJobType = module.exports.KalturaBatchJobType = {
PARSE_CAPTION_ASSET : 'captionSearch.parseCaptionAsset',
DISTRIBUTION_DELETE : 'contentDistribution.DistributionDelete',
DISTRIBUTION_DISABLE : 'contentDistribution.DistributionDisable',
DISTRIBUTION_ENABLE : 'contentDistribution.DistributionEnable',
DISTRIBUTION_FETCH_REPORT : 'contentDistribution.DistributionFetchReport',
CONVERT : '0',
DISTRIBUTION_SUBMIT : 'contentDistribution.DistributionSubmit',
DISTRIBUTION_SYNC : 'contentDistribution.DistributionSync',
DISTRIBUTION_UPDATE : 'contentDistribution.DistributionUpdate',
DROP_FOLDER_CONTENT_PROCESSOR : 'dropFolder.DropFolderContentProcessor',
DROP_FOLDER_WATCHER : 'dropFolder.DropFolderWatcher',
EVENT_NOTIFICATION_HANDLER : 'eventNotification.EventNotificationHandler',
INTEGRATION : 'integration.Integration',
SCHEDULED_TASK : 'scheduledTask.ScheduledTask',
INDEX_TAGS : 'tagSearch.IndexTagsByPrivacyContext',
TAG_RESOLVE : 'tagSearch.TagResolve',
VIRUS_SCAN : 'virusScan.VirusScan',
WIDEVINE_REPOSITORY_SYNC : 'widevine.WidevineRepositorySync',
IMPORT : '1',
DELETE : '2',
FLATTEN : '3',
BULKUPLOAD : '4',
DVDCREATOR : '5',
DOWNLOAD : '6',
OOCONVERT : '7',
CONVERT_PROFILE : '10',
POSTCONVERT : '11',
EXTRACT_MEDIA : '14',
MAIL : '15',
NOTIFICATION : '16',
CLEANUP : '17',
SCHEDULER_HELPER : '18',
BULKDOWNLOAD : '19',
DB_CLEANUP : '20',
PROVISION_PROVIDE : '21',
CONVERT_COLLECTION : '22',
STORAGE_EXPORT : '23',
PROVISION_DELETE : '24',
STORAGE_DELETE : '25',
EMAIL_INGESTION : '26',
METADATA_IMPORT : '27',
METADATA_TRANSFORM : '28',
FILESYNC_IMPORT : '29',
CAPTURE_THUMB : '30',
DELETE_FILE : '31',
INDEX : '32',
MOVE_CATEGORY_ENTRIES : '33',
COPY : '34',
CONCAT : '35',
CONVERT_LIVE_SEGMENT : '36',
COPY_PARTNER : '37',
VALIDATE_LIVE_MEDIA_SERVERS : '38',
SYNC_CATEGORY_PRIVACY_CONTEXT : '39',
LIVE_REPORT_EXPORT : '40',
};

var KalturaBulkUploadAction = module.exports.KalturaBulkUploadAction = {
ADD : '1',
UPDATE : '2',
DELETE : '3',
REPLACE : '4',
TRANSFORM_XSLT : '5',
ADD_OR_UPDATE : '6',
};

var KalturaBulkUploadObjectType = module.exports.KalturaBulkUploadObjectType = {
ENTRY : '1',
CATEGORY : '2',
USER : '3',
CATEGORY_USER : '4',
CATEGORY_ENTRY : '5',
};

var KalturaBulkUploadOrderBy = module.exports.KalturaBulkUploadOrderBy = {
};

var KalturaBulkUploadResultObjectType = module.exports.KalturaBulkUploadResultObjectType = {
ENTRY : '1',
CATEGORY : '2',
USER : '3',
CATEGORY_USER : '4',
CATEGORY_ENTRY : '5',
};

var KalturaBulkUploadResultStatus = module.exports.KalturaBulkUploadResultStatus = {
ERROR : '1',
OK : '2',
IN_PROGRESS : '3',
};

var KalturaBulkUploadType = module.exports.KalturaBulkUploadType = {
CSV : 'bulkUploadCsv.CSV',
FILTER : 'bulkUploadFilter.FILTER',
XML : 'bulkUploadXml.XML',
DROP_FOLDER_XML : 'dropFolderXmlBulkUpload.DROP_FOLDER_XML',
};

var KalturaBusinessProcessAbortNotificationTemplateOrderBy = module.exports.KalturaBusinessProcessAbortNotificationTemplateOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaBusinessProcessNotificationTemplateOrderBy = module.exports.KalturaBusinessProcessNotificationTemplateOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaBusinessProcessProvider = module.exports.KalturaBusinessProcessProvider = {
ACTIVITI : 'activitiBusinessProcessNotification.Activiti',
};

var KalturaBusinessProcessServerOrderBy = module.exports.KalturaBusinessProcessServerOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaBusinessProcessServerStatus = module.exports.KalturaBusinessProcessServerStatus = {
DISABLED : '1',
ENABLED : '2',
DELETED : '3',
};

var KalturaBusinessProcessSignalNotificationTemplateOrderBy = module.exports.KalturaBusinessProcessSignalNotificationTemplateOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaBusinessProcessStartNotificationTemplateOrderBy = module.exports.KalturaBusinessProcessStartNotificationTemplateOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaCaptionAssetOrderBy = module.exports.KalturaCaptionAssetOrderBy = {
CREATED_AT_ASC : '+createdAt',
DELETED_AT_ASC : '+deletedAt',
SIZE_ASC : '+size',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
DELETED_AT_DESC : '-deletedAt',
SIZE_DESC : '-size',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaCaptionParamsOrderBy = module.exports.KalturaCaptionParamsOrderBy = {
};

var KalturaCaptionType = module.exports.KalturaCaptionType = {
SRT : '1',
DFXP : '2',
WEBVTT : '3',
};

var KalturaCategoryEntryAdvancedOrderBy = module.exports.KalturaCategoryEntryAdvancedOrderBy = {
CREATED_AT_ASC : '+createdAt',
CREATED_AT_DESC : '-createdAt',
};

var KalturaCategoryEntryOrderBy = module.exports.KalturaCategoryEntryOrderBy = {
CREATED_AT_ASC : '+createdAt',
CREATED_AT_DESC : '-createdAt',
};

var KalturaCategoryIdentifierField = module.exports.KalturaCategoryIdentifierField = {
FULL_NAME : 'fullName',
ID : 'id',
REFERENCE_ID : 'referenceId',
};

var KalturaCategoryOrderBy = module.exports.KalturaCategoryOrderBy = {
CREATED_AT_ASC : '+createdAt',
DEPTH_ASC : '+depth',
DIRECT_ENTRIES_COUNT_ASC : '+directEntriesCount',
DIRECT_SUB_CATEGORIES_COUNT_ASC : '+directSubCategoriesCount',
ENTRIES_COUNT_ASC : '+entriesCount',
FULL_NAME_ASC : '+fullName',
MEMBERS_COUNT_ASC : '+membersCount',
NAME_ASC : '+name',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
DEPTH_DESC : '-depth',
DIRECT_ENTRIES_COUNT_DESC : '-directEntriesCount',
DIRECT_SUB_CATEGORIES_COUNT_DESC : '-directSubCategoriesCount',
ENTRIES_COUNT_DESC : '-entriesCount',
FULL_NAME_DESC : '-fullName',
MEMBERS_COUNT_DESC : '-membersCount',
NAME_DESC : '-name',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaCategoryUserOrderBy = module.exports.KalturaCategoryUserOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaCodeCuePointOrderBy = module.exports.KalturaCodeCuePointOrderBy = {
CREATED_AT_ASC : '+createdAt',
DURATION_ASC : '+duration',
END_TIME_ASC : '+endTime',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
START_TIME_ASC : '+startTime',
TRIGGERED_AT_ASC : '+triggeredAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
DURATION_DESC : '-duration',
END_TIME_DESC : '-endTime',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
START_TIME_DESC : '-startTime',
TRIGGERED_AT_DESC : '-triggeredAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaConditionType = module.exports.KalturaConditionType = {
ABC_WATERMARK : 'abcScreenersWatermarkAccessControl.abcWatermark',
EVENT_NOTIFICATION_FIELD : 'eventNotification.BooleanField',
EVENT_NOTIFICATION_OBJECT_CHANGED : 'eventNotification.ObjectChanged',
METADATA_FIELD_CHANGED : 'metadata.FieldChanged',
METADATA_FIELD_COMPARE : 'metadata.FieldCompare',
METADATA_FIELD_MATCH : 'metadata.FieldMatch',
AUTHENTICATED : '1',
COUNTRY : '2',
IP_ADDRESS : '3',
SITE : '4',
USER_AGENT : '5',
FIELD_MATCH : '6',
FIELD_COMPARE : '7',
ASSET_PROPERTIES_COMPARE : '8',
USER_ROLE : '9',
GEO_DISTANCE : '10',
OR_OPERATOR : '11',
};

var KalturaConfigurableDistributionProfileOrderBy = module.exports.KalturaConfigurableDistributionProfileOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaContainerFormat = module.exports.KalturaContainerFormat = {
_3GP : '3gp',
APPLEHTTP : 'applehttp',
AVI : 'avi',
BMP : 'bmp',
COPY : 'copy',
FLV : 'flv',
HLS : 'hls',
ISMV : 'ismv',
JPG : 'jpg',
M2TS : 'm2ts',
M4V : 'm4v',
MKV : 'mkv',
MOV : 'mov',
MP3 : 'mp3',
MP4 : 'mp4',
MPEG : 'mpeg',
MPEGTS : 'mpegts',
MXF : 'mxf',
OGG : 'ogg',
OGV : 'ogv',
PDF : 'pdf',
PNG : 'png',
SWF : 'swf',
WAV : 'wav',
WEBM : 'webm',
WMA : 'wma',
WMV : 'wmv',
WVM : 'wvm',
};

var KalturaContextType = module.exports.KalturaContextType = {
PLAY : '1',
DOWNLOAD : '2',
THUMBNAIL : '3',
METADATA : '4',
EXPORT : '5',
};

var KalturaControlPanelCommandOrderBy = module.exports.KalturaControlPanelCommandOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaConversionProfileAssetParamsOrderBy = module.exports.KalturaConversionProfileAssetParamsOrderBy = {
};

var KalturaConversionProfileOrderBy = module.exports.KalturaConversionProfileOrderBy = {
CREATED_AT_ASC : '+createdAt',
CREATED_AT_DESC : '-createdAt',
};

var KalturaConversionProfileStatus = module.exports.KalturaConversionProfileStatus = {
DISABLED : '1',
ENABLED : '2',
DELETED : '3',
};

var KalturaConversionProfileType = module.exports.KalturaConversionProfileType = {
MEDIA : '1',
LIVE_STREAM : '2',
};

var KalturaCuePointOrderBy = module.exports.KalturaCuePointOrderBy = {
CREATED_AT_ASC : '+createdAt',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
START_TIME_ASC : '+startTime',
TRIGGERED_AT_ASC : '+triggeredAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
START_TIME_DESC : '-startTime',
TRIGGERED_AT_DESC : '-triggeredAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaCuePointType = module.exports.KalturaCuePointType = {
AD : 'adCuePoint.Ad',
ANNOTATION : 'annotation.Annotation',
CODE : 'codeCuePoint.Code',
EVENT : 'eventCuePoint.Event',
THUMB : 'thumbCuePoint.Thumb',
};

var KalturaDataEntryOrderBy = module.exports.KalturaDataEntryOrderBy = {
CREATED_AT_ASC : '+createdAt',
END_DATE_ASC : '+endDate',
MODERATION_COUNT_ASC : '+moderationCount',
NAME_ASC : '+name',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
RANK_ASC : '+rank',
RECENT_ASC : '+recent',
START_DATE_ASC : '+startDate',
TOTAL_RANK_ASC : '+totalRank',
UPDATED_AT_ASC : '+updatedAt',
WEIGHT_ASC : '+weight',
CREATED_AT_DESC : '-createdAt',
END_DATE_DESC : '-endDate',
MODERATION_COUNT_DESC : '-moderationCount',
NAME_DESC : '-name',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
RANK_DESC : '-rank',
RECENT_DESC : '-recent',
START_DATE_DESC : '-startDate',
TOTAL_RANK_DESC : '-totalRank',
UPDATED_AT_DESC : '-updatedAt',
WEIGHT_DESC : '-weight',
};

var KalturaDeliveryProfileAkamaiAppleHttpManifestOrderBy = module.exports.KalturaDeliveryProfileAkamaiAppleHttpManifestOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaDeliveryProfileAkamaiHdsOrderBy = module.exports.KalturaDeliveryProfileAkamaiHdsOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaDeliveryProfileAkamaiHttpOrderBy = module.exports.KalturaDeliveryProfileAkamaiHttpOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaDeliveryProfileGenericAppleHttpOrderBy = module.exports.KalturaDeliveryProfileGenericAppleHttpOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaDeliveryProfileGenericHdsOrderBy = module.exports.KalturaDeliveryProfileGenericHdsOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaDeliveryProfileGenericHttpOrderBy = module.exports.KalturaDeliveryProfileGenericHttpOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaDeliveryProfileGenericRtmpOrderBy = module.exports.KalturaDeliveryProfileGenericRtmpOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaDeliveryProfileGenericSilverLightOrderBy = module.exports.KalturaDeliveryProfileGenericSilverLightOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaDeliveryProfileLiveAppleHttpOrderBy = module.exports.KalturaDeliveryProfileLiveAppleHttpOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaDeliveryProfileOrderBy = module.exports.KalturaDeliveryProfileOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaDeliveryProfileRtmpOrderBy = module.exports.KalturaDeliveryProfileRtmpOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaDeliveryProfileType = module.exports.KalturaDeliveryProfileType = {
EDGE_CAST_HTTP : 'edgeCast.EDGE_CAST_HTTP',
EDGE_CAST_RTMP : 'edgeCast.EDGE_CAST_RTMP',
KONTIKI_HTTP : 'kontiki.KONTIKI_HTTP',
UPLYNK_HTTP : 'uplynk.UPLYNK_HTTP',
UPLYNK_RTMP : 'uplynk.UPLYNK_RTMP',
VELOCIX_HDS : 'velocix.VELOCIX_HDS',
VELOCIX_HLS : 'velocix.VELOCIX_HLS',
APPLE_HTTP : '1',
HDS : '3',
HTTP : '4',
RTMP : '5',
RTSP : '6',
SILVER_LIGHT : '7',
AKAMAI_HLS_DIRECT : '10',
AKAMAI_HLS_MANIFEST : '11',
AKAMAI_HD : '12',
AKAMAI_HDS : '13',
AKAMAI_HTTP : '14',
AKAMAI_RTMP : '15',
AKAMAI_RTSP : '16',
AKAMAI_SS : '17',
GENERIC_HLS : '21',
GENERIC_HDS : '23',
GENERIC_HTTP : '24',
GENERIC_HLS_MANIFEST : '25',
GENERIC_HDS_MANIFEST : '26',
GENERIC_SS : '27',
GENERIC_RTMP : '28',
LEVEL3_HLS : '31',
LEVEL3_HTTP : '34',
LEVEL3_RTMP : '35',
LIMELIGHT_HTTP : '44',
LIMELIGHT_RTMP : '45',
LOCAL_PATH_APPLE_HTTP : '51',
LOCAL_PATH_HDS : '53',
LOCAL_PATH_HTTP : '54',
LOCAL_PATH_RTMP : '55',
VOD_PACKAGER_HLS : '61',
VOD_PACKAGER_HDS : '63',
VOD_PACKAGER_MSS : '67',
VOD_PACKAGER_DASH : '68',
LIVE_HLS : '1001',
LIVE_HDS : '1002',
LIVE_DASH : '1003',
LIVE_RTMP : '1005',
LIVE_AKAMAI_HDS : '1013',
};

var KalturaDistributionProfileOrderBy = module.exports.KalturaDistributionProfileOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaDistributionProviderOrderBy = module.exports.KalturaDistributionProviderOrderBy = {
};

var KalturaDistributionProviderType = module.exports.KalturaDistributionProviderType = {
ATT_UVERSE : 'attUverseDistribution.ATT_UVERSE',
AVN : 'avnDistribution.AVN',
COMCAST_MRSS : 'comcastMrssDistribution.COMCAST_MRSS',
CROSS_KALTURA : 'crossKalturaDistribution.CROSS_KALTURA',
DAILYMOTION : 'dailymotionDistribution.DAILYMOTION',
DOUBLECLICK : 'doubleClickDistribution.DOUBLECLICK',
FREEWHEEL : 'freewheelDistribution.FREEWHEEL',
FREEWHEEL_GENERIC : 'freewheelGenericDistribution.FREEWHEEL_GENERIC',
FTP : 'ftpDistribution.FTP',
FTP_SCHEDULED : 'ftpDistribution.FTP_SCHEDULED',
HULU : 'huluDistribution.HULU',
IDETIC : 'ideticDistribution.IDETIC',
METRO_PCS : 'metroPcsDistribution.METRO_PCS',
MSN : 'msnDistribution.MSN',
NDN : 'ndnDistribution.NDN',
PODCAST : 'podcastDistribution.PODCAST',
QUICKPLAY : 'quickPlayDistribution.QUICKPLAY',
SYNACOR_HBO : 'synacorHboDistribution.SYNACOR_HBO',
TIME_WARNER : 'timeWarnerDistribution.TIME_WARNER',
TVCOM : 'tvComDistribution.TVCOM',
TVINCI : 'tvinciDistribution.TVINCI',
UNICORN : 'unicornDistribution.UNICORN',
UVERSE_CLICK_TO_ORDER : 'uverseClickToOrderDistribution.UVERSE_CLICK_TO_ORDER',
UVERSE : 'uverseDistribution.UVERSE',
VERIZON_VCAST : 'verizonVcastDistribution.VERIZON_VCAST',
YAHOO : 'yahooDistribution.YAHOO',
YOUTUBE : 'youTubeDistribution.YOUTUBE',
YOUTUBE_API : 'youtubeApiDistribution.YOUTUBE_API',
GENERIC : '1',
SYNDICATION : '2',
};

var KalturaDocumentEntryOrderBy = module.exports.KalturaDocumentEntryOrderBy = {
CREATED_AT_ASC : '+createdAt',
END_DATE_ASC : '+endDate',
MODERATION_COUNT_ASC : '+moderationCount',
NAME_ASC : '+name',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
RANK_ASC : '+rank',
RECENT_ASC : '+recent',
START_DATE_ASC : '+startDate',
TOTAL_RANK_ASC : '+totalRank',
UPDATED_AT_ASC : '+updatedAt',
WEIGHT_ASC : '+weight',
CREATED_AT_DESC : '-createdAt',
END_DATE_DESC : '-endDate',
MODERATION_COUNT_DESC : '-moderationCount',
NAME_DESC : '-name',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
RANK_DESC : '-rank',
RECENT_DESC : '-recent',
START_DATE_DESC : '-startDate',
TOTAL_RANK_DESC : '-totalRank',
UPDATED_AT_DESC : '-updatedAt',
WEIGHT_DESC : '-weight',
};

var KalturaDocumentFlavorParamsOrderBy = module.exports.KalturaDocumentFlavorParamsOrderBy = {
};

var KalturaDocumentFlavorParamsOutputOrderBy = module.exports.KalturaDocumentFlavorParamsOutputOrderBy = {
};

var KalturaDrmDeviceOrderBy = module.exports.KalturaDrmDeviceOrderBy = {
CREATED_AT_ASC : '+createdAt',
CREATED_AT_DESC : '-createdAt',
};

var KalturaDrmLicenseScenario = module.exports.KalturaDrmLicenseScenario = {
PROTECTION : 'playReady.PROTECTION',
PURCHASE : 'playReady.PURCHASE',
RENTAL : 'playReady.RENTAL',
SUBSCRIPTION : 'playReady.SUBSCRIPTION',
};

var KalturaDrmLicenseType = module.exports.KalturaDrmLicenseType = {
NON_PERSISTENT : 'playReady.NON_PERSISTENT',
PERSISTENT : 'playReady.PERSISTENT',
};

var KalturaDrmPolicyOrderBy = module.exports.KalturaDrmPolicyOrderBy = {
};

var KalturaDrmProfileOrderBy = module.exports.KalturaDrmProfileOrderBy = {
ID_ASC : '+id',
NAME_ASC : '+name',
ID_DESC : '-id',
NAME_DESC : '-name',
};

var KalturaDrmProviderType = module.exports.KalturaDrmProviderType = {
PLAY_READY : 'playReady.PLAY_READY',
WIDEVINE : 'widevine.WIDEVINE',
};

var KalturaDropFolderErrorCode = module.exports.KalturaDropFolderErrorCode = {
ERROR_CONNECT : '1',
ERROR_AUTENTICATE : '2',
ERROR_GET_PHISICAL_FILE_LIST : '3',
ERROR_GET_DB_FILE_LIST : '4',
DROP_FOLDER_APP_ERROR : '5',
CONTENT_MATCH_POLICY_UNDEFINED : '6',
};

var KalturaDropFolderFileErrorCode = module.exports.KalturaDropFolderFileErrorCode = {
ERROR_ADDING_BULK_UPLOAD : 'dropFolderXmlBulkUpload.ERROR_ADDING_BULK_UPLOAD',
ERROR_ADD_CONTENT_RESOURCE : 'dropFolderXmlBulkUpload.ERROR_ADD_CONTENT_RESOURCE',
ERROR_IN_BULK_UPLOAD : 'dropFolderXmlBulkUpload.ERROR_IN_BULK_UPLOAD',
ERROR_WRITING_TEMP_FILE : 'dropFolderXmlBulkUpload.ERROR_WRITING_TEMP_FILE',
LOCAL_FILE_WRONG_CHECKSUM : 'dropFolderXmlBulkUpload.LOCAL_FILE_WRONG_CHECKSUM',
LOCAL_FILE_WRONG_SIZE : 'dropFolderXmlBulkUpload.LOCAL_FILE_WRONG_SIZE',
MALFORMED_XML_FILE : 'dropFolderXmlBulkUpload.MALFORMED_XML_FILE',
XML_FILE_SIZE_EXCEED_LIMIT : 'dropFolderXmlBulkUpload.XML_FILE_SIZE_EXCEED_LIMIT',
ERROR_UPDATE_ENTRY : '1',
ERROR_ADD_ENTRY : '2',
FLAVOR_NOT_FOUND : '3',
FLAVOR_MISSING_IN_FILE_NAME : '4',
SLUG_REGEX_NO_MATCH : '5',
ERROR_READING_FILE : '6',
ERROR_DOWNLOADING_FILE : '7',
ERROR_UPDATE_FILE : '8',
ERROR_ADDING_CONTENT_PROCESSOR : '10',
ERROR_IN_CONTENT_PROCESSOR : '11',
ERROR_DELETING_FILE : '12',
FILE_NO_MATCH : '13',
};

var KalturaDropFolderFileHandlerType = module.exports.KalturaDropFolderFileHandlerType = {
XML : 'dropFolderXmlBulkUpload.XML',
CONTENT : '1',
};

var KalturaDropFolderFileOrderBy = module.exports.KalturaDropFolderFileOrderBy = {
CREATED_AT_ASC : '+createdAt',
FILE_NAME_ASC : '+fileName',
FILE_SIZE_ASC : '+fileSize',
FILE_SIZE_LAST_SET_AT_ASC : '+fileSizeLastSetAt',
ID_ASC : '+id',
PARSED_FLAVOR_ASC : '+parsedFlavor',
PARSED_SLUG_ASC : '+parsedSlug',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
FILE_NAME_DESC : '-fileName',
FILE_SIZE_DESC : '-fileSize',
FILE_SIZE_LAST_SET_AT_DESC : '-fileSizeLastSetAt',
ID_DESC : '-id',
PARSED_FLAVOR_DESC : '-parsedFlavor',
PARSED_SLUG_DESC : '-parsedSlug',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaDropFolderOrderBy = module.exports.KalturaDropFolderOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
NAME_ASC : '+name',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
NAME_DESC : '-name',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaDropFolderType = module.exports.KalturaDropFolderType = {
FEED : 'FeedDropFolder.FEED',
WEBEX : 'WebexDropFolder.WEBEX',
LOCAL : '1',
FTP : '2',
SCP : '3',
SFTP : '4',
S3 : '6',
};

var KalturaDurationType = module.exports.KalturaDurationType = {
LONG : 'long',
MEDIUM : 'medium',
NOT_AVAILABLE : 'notavailable',
SHORT : 'short',
};

var KalturaDynamicEnum = module.exports.KalturaDynamicEnum = {
};

var KalturaEmailNotificationFormat = module.exports.KalturaEmailNotificationFormat = {
HTML : '1',
TEXT : '2',
};

var KalturaEmailNotificationRecipientProviderType = module.exports.KalturaEmailNotificationRecipientProviderType = {
STATIC_LIST : '1',
CATEGORY : '2',
USER : '3',
};

var KalturaEmailNotificationTemplateOrderBy = module.exports.KalturaEmailNotificationTemplateOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaEntryDistributionOrderBy = module.exports.KalturaEntryDistributionOrderBy = {
CREATED_AT_ASC : '+createdAt',
SUBMITTED_AT_ASC : '+submittedAt',
SUNRISE_ASC : '+sunrise',
SUNSET_ASC : '+sunset',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
SUBMITTED_AT_DESC : '-submittedAt',
SUNRISE_DESC : '-sunrise',
SUNSET_DESC : '-sunset',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaEntryIdentifierField = module.exports.KalturaEntryIdentifierField = {
ID : 'id',
REFERENCE_ID : 'referenceId',
};

var KalturaEntryReplacementStatus = module.exports.KalturaEntryReplacementStatus = {
NONE : '0',
APPROVED_BUT_NOT_READY : '1',
READY_BUT_NOT_APPROVED : '2',
NOT_READY_AND_NOT_APPROVED : '3',
FAILED : '4',
};

var KalturaEntryStatus = module.exports.KalturaEntryStatus = {
ERROR_IMPORTING : '-2',
ERROR_CONVERTING : '-1',
SCAN_FAILURE : 'virusScan.ScanFailure',
IMPORT : '0',
INFECTED : 'virusScan.Infected',
PRECONVERT : '1',
READY : '2',
DELETED : '3',
PENDING : '4',
MODERATE : '5',
BLOCKED : '6',
NO_CONTENT : '7',
};

var KalturaEntryType = module.exports.KalturaEntryType = {
AUTOMATIC : '-1',
EXTERNAL_MEDIA : 'externalMedia.externalMedia',
MEDIA_CLIP : '1',
MIX : '2',
PLAYLIST : '5',
DATA : '6',
LIVE_STREAM : '7',
LIVE_CHANNEL : '8',
DOCUMENT : '10',
};

var KalturaEventCuePointOrderBy = module.exports.KalturaEventCuePointOrderBy = {
CREATED_AT_ASC : '+createdAt',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
START_TIME_ASC : '+startTime',
TRIGGERED_AT_ASC : '+triggeredAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
START_TIME_DESC : '-startTime',
TRIGGERED_AT_DESC : '-triggeredAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaEventNotificationEventObjectType = module.exports.KalturaEventNotificationEventObjectType = {
AD_CUE_POINT : 'adCuePointEventNotifications.AdCuePoint',
ANNOTATION : 'annotationEventNotifications.Annotation',
CAPTION_ASSET : 'captionAssetEventNotifications.CaptionAsset',
CODE_CUE_POINT : 'codeCuePointEventNotifications.CodeCuePoint',
DISTRIBUTION_PROFILE : 'contentDistributionEventNotifications.DistributionProfile',
ENTRY_DISTRIBUTION : 'contentDistributionEventNotifications.EntryDistribution',
CUE_POINT : 'cuePointEventNotifications.CuePoint',
DROP_FOLDER : 'dropFolderEventNotifications.DropFolder',
DROP_FOLDER_FILE : 'dropFolderEventNotifications.DropFolderFile',
METADATA : 'metadataEventNotifications.Metadata',
ENTRY : '1',
CATEGORY : '2',
ASSET : '3',
FLAVORASSET : '4',
THUMBASSET : '5',
KUSER : '8',
ACCESSCONTROL : '9',
BATCHJOB : '10',
BULKUPLOADRESULT : '11',
CATEGORYKUSER : '12',
CONVERSIONPROFILE2 : '14',
FLAVORPARAMS : '15',
FLAVORPARAMSCONVERSIONPROFILE : '16',
FLAVORPARAMSOUTPUT : '17',
GENERICSYNDICATIONFEED : '18',
KUSERTOUSERROLE : '19',
PARTNER : '20',
PERMISSION : '21',
PERMISSIONITEM : '22',
PERMISSIONTOPERMISSIONITEM : '23',
SCHEDULER : '24',
SCHEDULERCONFIG : '25',
SCHEDULERSTATUS : '26',
SCHEDULERWORKER : '27',
STORAGEPROFILE : '28',
SYNDICATIONFEED : '29',
THUMBPARAMS : '31',
THUMBPARAMSOUTPUT : '32',
UPLOADTOKEN : '33',
USERLOGINDATA : '34',
USERROLE : '35',
WIDGET : '36',
CATEGORYENTRY : '37',
};

var KalturaEventNotificationEventType = module.exports.KalturaEventNotificationEventType = {
INTEGRATION_JOB_CLOSED : 'integrationEventNotifications.INTEGRATION_JOB_CLOSED',
BATCH_JOB_STATUS : '1',
OBJECT_ADDED : '2',
OBJECT_CHANGED : '3',
OBJECT_COPIED : '4',
OBJECT_CREATED : '5',
OBJECT_DATA_CHANGED : '6',
OBJECT_DELETED : '7',
OBJECT_ERASED : '8',
OBJECT_READY_FOR_REPLACMENT : '9',
OBJECT_SAVED : '10',
OBJECT_UPDATED : '11',
OBJECT_REPLACED : '12',
OBJECT_READY_FOR_INDEX : '13',
};

var KalturaEventNotificationTemplateOrderBy = module.exports.KalturaEventNotificationTemplateOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaEventNotificationTemplateType = module.exports.KalturaEventNotificationTemplateType = {
BPM_ABORT : 'businessProcessNotification.BusinessProcessAbort',
BPM_SIGNAL : 'businessProcessNotification.BusinessProcessSignal',
BPM_START : 'businessProcessNotification.BusinessProcessStart',
EMAIL : 'emailNotification.Email',
HTTP : 'httpNotification.Http',
};

var KalturaEventType = module.exports.KalturaEventType = {
BROADCAST_START : '1',
BROADCAST_END : '2',
};

var KalturaExternalMediaEntryOrderBy = module.exports.KalturaExternalMediaEntryOrderBy = {
CREATED_AT_ASC : '+createdAt',
DURATION_ASC : '+duration',
END_DATE_ASC : '+endDate',
LAST_PLAYED_AT_ASC : '+lastPlayedAt',
MEDIA_TYPE_ASC : '+mediaType',
MODERATION_COUNT_ASC : '+moderationCount',
NAME_ASC : '+name',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
PLAYS_ASC : '+plays',
RANK_ASC : '+rank',
RECENT_ASC : '+recent',
START_DATE_ASC : '+startDate',
TOTAL_RANK_ASC : '+totalRank',
UPDATED_AT_ASC : '+updatedAt',
VIEWS_ASC : '+views',
WEIGHT_ASC : '+weight',
CREATED_AT_DESC : '-createdAt',
DURATION_DESC : '-duration',
END_DATE_DESC : '-endDate',
LAST_PLAYED_AT_DESC : '-lastPlayedAt',
MEDIA_TYPE_DESC : '-mediaType',
MODERATION_COUNT_DESC : '-moderationCount',
NAME_DESC : '-name',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
PLAYS_DESC : '-plays',
RANK_DESC : '-rank',
RECENT_DESC : '-recent',
START_DATE_DESC : '-startDate',
TOTAL_RANK_DESC : '-totalRank',
UPDATED_AT_DESC : '-updatedAt',
VIEWS_DESC : '-views',
WEIGHT_DESC : '-weight',
};

var KalturaExternalMediaSourceType = module.exports.KalturaExternalMediaSourceType = {
INTERCALL : 'InterCall',
YOUTUBE : 'YouTube',
};

var KalturaFileAssetObjectType = module.exports.KalturaFileAssetObjectType = {
UI_CONF : '2',
};

var KalturaFileAssetOrderBy = module.exports.KalturaFileAssetOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaFileAssetStatus = module.exports.KalturaFileAssetStatus = {
PENDING : '0',
UPLOADING : '1',
READY : '2',
DELETED : '3',
ERROR : '4',
};

var KalturaFileSyncObjectType = module.exports.KalturaFileSyncObjectType = {
DISTRIBUTION_PROFILE : 'contentDistribution.DistributionProfile',
ENTRY_DISTRIBUTION : 'contentDistribution.EntryDistribution',
GENERIC_DISTRIBUTION_ACTION : 'contentDistribution.GenericDistributionAction',
EMAIL_NOTIFICATION_TEMPLATE : 'emailNotification.EmailNotificationTemplate',
HTTP_NOTIFICATION_TEMPLATE : 'httpNotification.HttpNotificationTemplate',
ENTRY : '1',
UICONF : '2',
BATCHJOB : '3',
ASSET : '4',
FLAVOR_ASSET : '4',
METADATA : '5',
METADATA_PROFILE : '6',
SYNDICATION_FEED : '7',
CONVERSION_PROFILE : '8',
FILE_ASSET : '9',
};

var KalturaFileSyncOrderBy = module.exports.KalturaFileSyncOrderBy = {
CREATED_AT_ASC : '+createdAt',
FILE_SIZE_ASC : '+fileSize',
READY_AT_ASC : '+readyAt',
SYNC_TIME_ASC : '+syncTime',
UPDATED_AT_ASC : '+updatedAt',
VERSION_ASC : '+version',
CREATED_AT_DESC : '-createdAt',
FILE_SIZE_DESC : '-fileSize',
READY_AT_DESC : '-readyAt',
SYNC_TIME_DESC : '-syncTime',
UPDATED_AT_DESC : '-updatedAt',
VERSION_DESC : '-version',
};

var KalturaFlavorAssetOrderBy = module.exports.KalturaFlavorAssetOrderBy = {
CREATED_AT_ASC : '+createdAt',
DELETED_AT_ASC : '+deletedAt',
SIZE_ASC : '+size',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
DELETED_AT_DESC : '-deletedAt',
SIZE_DESC : '-size',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaFlavorParamsOrderBy = module.exports.KalturaFlavorParamsOrderBy = {
};

var KalturaFlavorParamsOutputOrderBy = module.exports.KalturaFlavorParamsOutputOrderBy = {
};

var KalturaFtpDropFolderOrderBy = module.exports.KalturaFtpDropFolderOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
NAME_ASC : '+name',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
NAME_DESC : '-name',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaGenericDistributionProfileOrderBy = module.exports.KalturaGenericDistributionProfileOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaGenericDistributionProviderActionOrderBy = module.exports.KalturaGenericDistributionProviderActionOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaGenericDistributionProviderOrderBy = module.exports.KalturaGenericDistributionProviderOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaGenericSyndicationFeedOrderBy = module.exports.KalturaGenericSyndicationFeedOrderBy = {
CREATED_AT_ASC : '+createdAt',
NAME_ASC : '+name',
PLAYLIST_ID_ASC : '+playlistId',
TYPE_ASC : '+type',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
NAME_DESC : '-name',
PLAYLIST_ID_DESC : '-playlistId',
TYPE_DESC : '-type',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaGenericXsltSyndicationFeedOrderBy = module.exports.KalturaGenericXsltSyndicationFeedOrderBy = {
CREATED_AT_ASC : '+createdAt',
NAME_ASC : '+name',
PLAYLIST_ID_ASC : '+playlistId',
TYPE_ASC : '+type',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
NAME_DESC : '-name',
PLAYLIST_ID_DESC : '-playlistId',
TYPE_DESC : '-type',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaGeoCoderType = module.exports.KalturaGeoCoderType = {
KALTURA : '1',
};

var KalturaGoogleSyndicationFeedAdultValues = module.exports.KalturaGoogleSyndicationFeedAdultValues = {
NO : 'No',
YES : 'Yes',
};

var KalturaGoogleVideoSyndicationFeedOrderBy = module.exports.KalturaGoogleVideoSyndicationFeedOrderBy = {
CREATED_AT_ASC : '+createdAt',
NAME_ASC : '+name',
PLAYLIST_ID_ASC : '+playlistId',
TYPE_ASC : '+type',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
NAME_DESC : '-name',
PLAYLIST_ID_DESC : '-playlistId',
TYPE_DESC : '-type',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaGroupUserOrderBy = module.exports.KalturaGroupUserOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaHttpNotificationCertificateType = module.exports.KalturaHttpNotificationCertificateType = {
DER : 'DER',
ENG : 'ENG',
PEM : 'PEM',
};

var KalturaHttpNotificationSslKeyType = module.exports.KalturaHttpNotificationSslKeyType = {
DER : 'DER',
ENG : 'ENG',
PEM : 'PEM',
};

var KalturaHttpNotificationTemplateOrderBy = module.exports.KalturaHttpNotificationTemplateOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaITunesSyndicationFeedAdultValues = module.exports.KalturaITunesSyndicationFeedAdultValues = {
CLEAN : 'clean',
NO : 'no',
YES : 'yes',
};

var KalturaITunesSyndicationFeedCategories = module.exports.KalturaITunesSyndicationFeedCategories = {
ARTS : 'Arts',
ARTS_DESIGN : 'Arts/Design',
ARTS_FASHION_BEAUTY : 'Arts/Fashion &amp; Beauty',
ARTS_FOOD : 'Arts/Food',
ARTS_LITERATURE : 'Arts/Literature',
ARTS_PERFORMING_ARTS : 'Arts/Performing Arts',
ARTS_VISUAL_ARTS : 'Arts/Visual Arts',
BUSINESS : 'Business',
BUSINESS_BUSINESS_NEWS : 'Business/Business News',
BUSINESS_CAREERS : 'Business/Careers',
BUSINESS_INVESTING : 'Business/Investing',
BUSINESS_MANAGEMENT_MARKETING : 'Business/Management &amp; Marketing',
BUSINESS_SHOPPING : 'Business/Shopping',
COMEDY : 'Comedy',
EDUCATION : 'Education',
EDUCATION_TECHNOLOGY : 'Education/Education Technology',
EDUCATION_HIGHER_EDUCATION : 'Education/Higher Education',
EDUCATION_K_12 : 'Education/K-12',
EDUCATION_LANGUAGE_COURSES : 'Education/Language Courses',
EDUCATION_TRAINING : 'Education/Training',
GAMES_HOBBIES : 'Games &amp; Hobbies',
GAMES_HOBBIES_AUTOMOTIVE : 'Games &amp; Hobbies/Automotive',
GAMES_HOBBIES_AVIATION : 'Games &amp; Hobbies/Aviation',
GAMES_HOBBIES_HOBBIES : 'Games &amp; Hobbies/Hobbies',
GAMES_HOBBIES_OTHER_GAMES : 'Games &amp; Hobbies/Other Games',
GAMES_HOBBIES_VIDEO_GAMES : 'Games &amp; Hobbies/Video Games',
GOVERNMENT_ORGANIZATIONS : 'Government &amp; Organizations',
GOVERNMENT_ORGANIZATIONS_LOCAL : 'Government &amp; Organizations/Local',
GOVERNMENT_ORGANIZATIONS_NATIONAL : 'Government &amp; Organizations/National',
GOVERNMENT_ORGANIZATIONS_NON_PROFIT : 'Government &amp; Organizations/Non-Profit',
GOVERNMENT_ORGANIZATIONS_REGIONAL : 'Government &amp; Organizations/Regional',
HEALTH : 'Health',
HEALTH_ALTERNATIVE_HEALTH : 'Health/Alternative Health',
HEALTH_FITNESS_NUTRITION : 'Health/Fitness &amp; Nutrition',
HEALTH_SELF_HELP : 'Health/Self-Help',
HEALTH_SEXUALITY : 'Health/Sexuality',
KIDS_FAMILY : 'Kids &amp; Family',
MUSIC : 'Music',
NEWS_POLITICS : 'News &amp; Politics',
RELIGION_SPIRITUALITY : 'Religion &amp; Spirituality',
RELIGION_SPIRITUALITY_BUDDHISM : 'Religion &amp; Spirituality/Buddhism',
RELIGION_SPIRITUALITY_CHRISTIANITY : 'Religion &amp; Spirituality/Christianity',
RELIGION_SPIRITUALITY_HINDUISM : 'Religion &amp; Spirituality/Hinduism',
RELIGION_SPIRITUALITY_ISLAM : 'Religion &amp; Spirituality/Islam',
RELIGION_SPIRITUALITY_JUDAISM : 'Religion &amp; Spirituality/Judaism',
RELIGION_SPIRITUALITY_OTHER : 'Religion &amp; Spirituality/Other',
RELIGION_SPIRITUALITY_SPIRITUALITY : 'Religion &amp; Spirituality/Spirituality',
SCIENCE_MEDICINE : 'Science &amp; Medicine',
SCIENCE_MEDICINE_MEDICINE : 'Science &amp; Medicine/Medicine',
SCIENCE_MEDICINE_NATURAL_SCIENCES : 'Science &amp; Medicine/Natural Sciences',
SCIENCE_MEDICINE_SOCIAL_SCIENCES : 'Science &amp; Medicine/Social Sciences',
SOCIETY_CULTURE : 'Society &amp; Culture',
SOCIETY_CULTURE_HISTORY : 'Society &amp; Culture/History',
SOCIETY_CULTURE_PERSONAL_JOURNALS : 'Society &amp; Culture/Personal Journals',
SOCIETY_CULTURE_PHILOSOPHY : 'Society &amp; Culture/Philosophy',
SOCIETY_CULTURE_PLACES_TRAVEL : 'Society &amp; Culture/Places &amp; Travel',
SPORTS_RECREATION : 'Sports &amp; Recreation',
SPORTS_RECREATION_AMATEUR : 'Sports &amp; Recreation/Amateur',
SPORTS_RECREATION_COLLEGE_HIGH_SCHOOL : 'Sports &amp; Recreation/College &amp; High School',
SPORTS_RECREATION_OUTDOOR : 'Sports &amp; Recreation/Outdoor',
SPORTS_RECREATION_PROFESSIONAL : 'Sports &amp; Recreation/Professional',
TV_FILM : 'TV &amp; Film',
TECHNOLOGY : 'Technology',
TECHNOLOGY_GADGETS : 'Technology/Gadgets',
TECHNOLOGY_PODCASTING : 'Technology/Podcasting',
TECHNOLOGY_SOFTWARE_HOW_TO : 'Technology/Software How-To',
TECHNOLOGY_TECH_NEWS : 'Technology/Tech News',
};

var KalturaITunesSyndicationFeedOrderBy = module.exports.KalturaITunesSyndicationFeedOrderBy = {
CREATED_AT_ASC : '+createdAt',
NAME_ASC : '+name',
PLAYLIST_ID_ASC : '+playlistId',
TYPE_ASC : '+type',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
NAME_DESC : '-name',
PLAYLIST_ID_DESC : '-playlistId',
TYPE_DESC : '-type',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaImageFlavorParamsOrderBy = module.exports.KalturaImageFlavorParamsOrderBy = {
};

var KalturaImageFlavorParamsOutputOrderBy = module.exports.KalturaImageFlavorParamsOutputOrderBy = {
};

var KalturaIntegrationProviderType = module.exports.KalturaIntegrationProviderType = {
};

var KalturaIntegrationTriggerType = module.exports.KalturaIntegrationTriggerType = {
BPM_EVENT_NOTIFICATION : 'bpmEventNotificationIntegration.BpmEventNotification',
};

var KalturaKontikiStorageProfileOrderBy = module.exports.KalturaKontikiStorageProfileOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaLanguage = module.exports.KalturaLanguage = {
AB : 'Abkhazian',
AA : 'Afar',
AF : 'Afrikaans',
SQ : 'Albanian',
AM : 'Amharic',
AR : 'Arabic',
HY : 'Armenian',
AS_ : 'Assamese',
AY : 'Aymara',
AZ : 'Azerbaijani',
BA : 'Bashkir',
EU : 'Basque',
BN : 'Bengali (Bangla)',
DZ : 'Bhutani',
BH : 'Bihari',
BI : 'Bislama',
BR : 'Breton',
BG : 'Bulgarian',
MY : 'Burmese',
BE : 'Byelorussian (Belarusian)',
KM : 'Cambodian',
CA : 'Catalan',
ZH : 'Chinese',
CO : 'Corsican',
HR : 'Croatian',
CS : 'Czech',
DA : 'Danish',
NL : 'Dutch',
EN : 'English',
EO : 'Esperanto',
ET : 'Estonian',
FO : 'Faeroese',
FA : 'Farsi',
FJ : 'Fiji',
FI : 'Finnish',
FR : 'French',
FY : 'Frisian',
GV : 'Gaelic (Manx)',
GD : 'Gaelic (Scottish)',
GL : 'Galician',
KA : 'Georgian',
DE : 'German',
EL : 'Greek',
KL : 'Greenlandic',
GN : 'Guarani',
GU : 'Gujarati',
HA : 'Hausa',
IW : 'Hebrew',
HE : 'Hebrew',
HI : 'Hindi',
HU : 'Hungarian',
IS : 'Icelandic',
IN : 'Indonesian',
ID : 'Indonesian',
IA : 'Interlingua',
IE : 'Interlingue',
IU : 'Inuktitut',
IK : 'Inupiak',
GA : 'Irish',
IT : 'Italian',
JA : 'Japanese',
JV : 'Javanese',
KN : 'Kannada',
KS : 'Kashmiri',
KK : 'Kazakh',
RW : 'Kinyarwanda (Ruanda)',
KY : 'Kirghiz',
RN : 'Kirundi (Rundi)',
KO : 'Korean',
KU : 'Kurdish',
LO : 'Laothian',
LA : 'Latin',
LV : 'Latvian (Lettish)',
LI : 'Limburgish ( Limburger)',
LN : 'Lingala',
LT : 'Lithuanian',
MK : 'Macedonian',
MG : 'Malagasy',
MS : 'Malay',
ML : 'Malayalam',
MT : 'Maltese',
MI : 'Maori',
MR : 'Marathi',
MO : 'Moldavian',
MN : 'Mongolian',
NA : 'Nauru',
NE : 'Nepali',
NO : 'Norwegian',
OC : 'Occitan',
OR_ : 'Oriya',
OM : 'Oromo (Afan, Galla)',
PS : 'Pashto (Pushto)',
PL : 'Polish',
PT : 'Portuguese',
PA : 'Punjabi',
QU : 'Quechua',
RM : 'Rhaeto-Romance',
RO : 'Romanian',
RU : 'Russian',
SM : 'Samoan',
SG : 'Sangro',
SA : 'Sanskrit',
SR : 'Serbian',
SH : 'Serbo-Croatian',
ST : 'Sesotho',
TN : 'Setswana',
SN : 'Shona',
SD : 'Sindhi',
SI : 'Sinhalese',
SS : 'Siswati',
SK : 'Slovak',
SL : 'Slovenian',
SO : 'Somali',
ES : 'Spanish',
SU : 'Sundanese',
SW : 'Swahili (Kiswahili)',
SV : 'Swedish',
TL : 'Tagalog',
TG : 'Tajik',
TA : 'Tamil',
TT : 'Tatar',
TE : 'Telugu',
TH : 'Thai',
BO : 'Tibetan',
TI : 'Tigrinya',
TO : 'Tonga',
TS : 'Tsonga',
TR : 'Turkish',
TK : 'Turkmen',
TW : 'Twi',
UG : 'Uighur',
UK : 'Ukrainian',
UR : 'Urdu',
UZ : 'Uzbek',
VI : 'Vietnamese',
VO : 'Volapuk',
CY : 'Welsh',
WO : 'Wolof',
XH : 'Xhosa',
YI : 'Yiddish',
JI : 'Yiddish',
YO : 'Yoruba',
ZU : 'Zulu',
};

var KalturaLanguageCode = module.exports.KalturaLanguageCode = {
AA : 'aa',
AB : 'ab',
AF : 'af',
AM : 'am',
AR : 'ar',
AS_ : 'as',
AY : 'ay',
AZ : 'az',
BA : 'ba',
BE : 'be',
BG : 'bg',
BH : 'bh',
BI : 'bi',
BN : 'bn',
BO : 'bo',
BR : 'br',
CA : 'ca',
CO : 'co',
CS : 'cs',
CY : 'cy',
DA : 'da',
DE : 'de',
DZ : 'dz',
EL : 'el',
EN : 'en',
EO : 'eo',
ES : 'es',
ET : 'et',
EU : 'eu',
FA : 'fa',
FI : 'fi',
FJ : 'fj',
FO : 'fo',
FR : 'fr',
FY : 'fy',
GA : 'ga',
GD : 'gd',
GL : 'gl',
GN : 'gn',
GU : 'gu',
GV : 'gv',
HA : 'ha',
HE : 'he',
HI : 'hi',
HR : 'hr',
HU : 'hu',
HY : 'hy',
IA : 'ia',
ID : 'id',
IE : 'ie',
IK : 'ik',
IN : 'in',
IS : 'is',
IT : 'it',
IU : 'iu',
IW : 'iw',
JA : 'ja',
JI : 'ji',
JV : 'jv',
KA : 'ka',
KK : 'kk',
KL : 'kl',
KM : 'km',
KN : 'kn',
KO : 'ko',
KS : 'ks',
KU : 'ku',
KY : 'ky',
LA : 'la',
LI : 'li',
LN : 'ln',
LO : 'lo',
LT : 'lt',
LV : 'lv',
MG : 'mg',
MI : 'mi',
MK : 'mk',
ML : 'ml',
MN : 'mn',
MO : 'mo',
MR : 'mr',
MS : 'ms',
MT : 'mt',
MY : 'my',
NA : 'na',
NE : 'ne',
NL : 'nl',
NO : 'no',
OC : 'oc',
OM : 'om',
OR_ : 'or',
PA : 'pa',
PL : 'pl',
PS : 'ps',
PT : 'pt',
QU : 'qu',
RM : 'rm',
RN : 'rn',
RO : 'ro',
RU : 'ru',
RW : 'rw',
SA : 'sa',
SD : 'sd',
SG : 'sg',
SH : 'sh',
SI : 'si',
SK : 'sk',
SL : 'sl',
SM : 'sm',
SN : 'sn',
SO : 'so',
SQ : 'sq',
SR : 'sr',
SS : 'ss',
ST : 'st',
SU : 'su',
SV : 'sv',
SW : 'sw',
TA : 'ta',
TE : 'te',
TG : 'tg',
TH : 'th',
TI : 'ti',
TK : 'tk',
TL : 'tl',
TN : 'tn',
TO : 'to',
TR : 'tr',
TS : 'ts',
TT : 'tt',
TW : 'tw',
UG : 'ug',
UK : 'uk',
UR : 'ur',
UZ : 'uz',
VI : 'vi',
VO : 'vo',
WO : 'wo',
XH : 'xh',
YI : 'yi',
YO : 'yo',
ZH : 'zh',
ZU : 'zu',
};

var KalturaLiveAssetOrderBy = module.exports.KalturaLiveAssetOrderBy = {
CREATED_AT_ASC : '+createdAt',
DELETED_AT_ASC : '+deletedAt',
SIZE_ASC : '+size',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
DELETED_AT_DESC : '-deletedAt',
SIZE_DESC : '-size',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaLiveChannelOrderBy = module.exports.KalturaLiveChannelOrderBy = {
CREATED_AT_ASC : '+createdAt',
DURATION_ASC : '+duration',
END_DATE_ASC : '+endDate',
FIRST_BROADCAST_ASC : '+firstBroadcast',
LAST_BROADCAST_ASC : '+lastBroadcast',
LAST_PLAYED_AT_ASC : '+lastPlayedAt',
MEDIA_TYPE_ASC : '+mediaType',
MODERATION_COUNT_ASC : '+moderationCount',
NAME_ASC : '+name',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
PLAYS_ASC : '+plays',
RANK_ASC : '+rank',
RECENT_ASC : '+recent',
START_DATE_ASC : '+startDate',
TOTAL_RANK_ASC : '+totalRank',
UPDATED_AT_ASC : '+updatedAt',
VIEWS_ASC : '+views',
WEIGHT_ASC : '+weight',
CREATED_AT_DESC : '-createdAt',
DURATION_DESC : '-duration',
END_DATE_DESC : '-endDate',
FIRST_BROADCAST_DESC : '-firstBroadcast',
LAST_BROADCAST_DESC : '-lastBroadcast',
LAST_PLAYED_AT_DESC : '-lastPlayedAt',
MEDIA_TYPE_DESC : '-mediaType',
MODERATION_COUNT_DESC : '-moderationCount',
NAME_DESC : '-name',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
PLAYS_DESC : '-plays',
RANK_DESC : '-rank',
RECENT_DESC : '-recent',
START_DATE_DESC : '-startDate',
TOTAL_RANK_DESC : '-totalRank',
UPDATED_AT_DESC : '-updatedAt',
VIEWS_DESC : '-views',
WEIGHT_DESC : '-weight',
};

var KalturaLiveChannelSegmentOrderBy = module.exports.KalturaLiveChannelSegmentOrderBy = {
CREATED_AT_ASC : '+createdAt',
START_TIME_ASC : '+startTime',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
START_TIME_DESC : '-startTime',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaLiveChannelSegmentStatus = module.exports.KalturaLiveChannelSegmentStatus = {
ACTIVE : '2',
DELETED : '3',
};

var KalturaLiveChannelSegmentTriggerType = module.exports.KalturaLiveChannelSegmentTriggerType = {
CHANNEL_RELATIVE : '1',
ABSOLUTE_TIME : '2',
SEGMENT_START_RELATIVE : '3',
SEGMENT_END_RELATIVE : '4',
};

var KalturaLiveChannelSegmentType = module.exports.KalturaLiveChannelSegmentType = {
VIDEO_AND_AUDIO : '1',
};

var KalturaLiveEntryOrderBy = module.exports.KalturaLiveEntryOrderBy = {
CREATED_AT_ASC : '+createdAt',
DURATION_ASC : '+duration',
END_DATE_ASC : '+endDate',
FIRST_BROADCAST_ASC : '+firstBroadcast',
LAST_BROADCAST_ASC : '+lastBroadcast',
LAST_PLAYED_AT_ASC : '+lastPlayedAt',
MEDIA_TYPE_ASC : '+mediaType',
MODERATION_COUNT_ASC : '+moderationCount',
NAME_ASC : '+name',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
PLAYS_ASC : '+plays',
RANK_ASC : '+rank',
RECENT_ASC : '+recent',
START_DATE_ASC : '+startDate',
TOTAL_RANK_ASC : '+totalRank',
UPDATED_AT_ASC : '+updatedAt',
VIEWS_ASC : '+views',
WEIGHT_ASC : '+weight',
CREATED_AT_DESC : '-createdAt',
DURATION_DESC : '-duration',
END_DATE_DESC : '-endDate',
FIRST_BROADCAST_DESC : '-firstBroadcast',
LAST_BROADCAST_DESC : '-lastBroadcast',
LAST_PLAYED_AT_DESC : '-lastPlayedAt',
MEDIA_TYPE_DESC : '-mediaType',
MODERATION_COUNT_DESC : '-moderationCount',
NAME_DESC : '-name',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
PLAYS_DESC : '-plays',
RANK_DESC : '-rank',
RECENT_DESC : '-recent',
START_DATE_DESC : '-startDate',
TOTAL_RANK_DESC : '-totalRank',
UPDATED_AT_DESC : '-updatedAt',
VIEWS_DESC : '-views',
WEIGHT_DESC : '-weight',
};

var KalturaLiveParamsOrderBy = module.exports.KalturaLiveParamsOrderBy = {
};

var KalturaLiveReportOrderBy = module.exports.KalturaLiveReportOrderBy = {
NAME_ASC : '+name',
AUDIENCE_DESC : '-audience',
EVENT_TIME_DESC : '-eventTime',
PLAYS_DESC : '-plays',
};

var KalturaLiveReportType = module.exports.KalturaLiveReportType = {
ENTRY_GEO_TIME_LINE : 'ENTRY_GEO_TIME_LINE',
ENTRY_SYNDICATION_TOTAL : 'ENTRY_SYNDICATION_TOTAL',
ENTRY_TIME_LINE : 'ENTRY_TIME_LINE',
ENTRY_TOTAL : 'ENTRY_TOTAL',
PARTNER_TOTAL : 'PARTNER_TOTAL',
};

var KalturaLiveStreamAdminEntryOrderBy = module.exports.KalturaLiveStreamAdminEntryOrderBy = {
CREATED_AT_ASC : '+createdAt',
DURATION_ASC : '+duration',
END_DATE_ASC : '+endDate',
FIRST_BROADCAST_ASC : '+firstBroadcast',
LAST_BROADCAST_ASC : '+lastBroadcast',
LAST_PLAYED_AT_ASC : '+lastPlayedAt',
MEDIA_TYPE_ASC : '+mediaType',
MODERATION_COUNT_ASC : '+moderationCount',
NAME_ASC : '+name',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
PLAYS_ASC : '+plays',
RANK_ASC : '+rank',
RECENT_ASC : '+recent',
START_DATE_ASC : '+startDate',
TOTAL_RANK_ASC : '+totalRank',
UPDATED_AT_ASC : '+updatedAt',
VIEWS_ASC : '+views',
WEIGHT_ASC : '+weight',
CREATED_AT_DESC : '-createdAt',
DURATION_DESC : '-duration',
END_DATE_DESC : '-endDate',
FIRST_BROADCAST_DESC : '-firstBroadcast',
LAST_BROADCAST_DESC : '-lastBroadcast',
LAST_PLAYED_AT_DESC : '-lastPlayedAt',
MEDIA_TYPE_DESC : '-mediaType',
MODERATION_COUNT_DESC : '-moderationCount',
NAME_DESC : '-name',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
PLAYS_DESC : '-plays',
RANK_DESC : '-rank',
RECENT_DESC : '-recent',
START_DATE_DESC : '-startDate',
TOTAL_RANK_DESC : '-totalRank',
UPDATED_AT_DESC : '-updatedAt',
VIEWS_DESC : '-views',
WEIGHT_DESC : '-weight',
};

var KalturaLiveStreamEntryOrderBy = module.exports.KalturaLiveStreamEntryOrderBy = {
CREATED_AT_ASC : '+createdAt',
DURATION_ASC : '+duration',
END_DATE_ASC : '+endDate',
FIRST_BROADCAST_ASC : '+firstBroadcast',
LAST_BROADCAST_ASC : '+lastBroadcast',
LAST_PLAYED_AT_ASC : '+lastPlayedAt',
MEDIA_TYPE_ASC : '+mediaType',
MODERATION_COUNT_ASC : '+moderationCount',
NAME_ASC : '+name',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
PLAYS_ASC : '+plays',
RANK_ASC : '+rank',
RECENT_ASC : '+recent',
START_DATE_ASC : '+startDate',
TOTAL_RANK_ASC : '+totalRank',
UPDATED_AT_ASC : '+updatedAt',
VIEWS_ASC : '+views',
WEIGHT_ASC : '+weight',
CREATED_AT_DESC : '-createdAt',
DURATION_DESC : '-duration',
END_DATE_DESC : '-endDate',
FIRST_BROADCAST_DESC : '-firstBroadcast',
LAST_BROADCAST_DESC : '-lastBroadcast',
LAST_PLAYED_AT_DESC : '-lastPlayedAt',
MEDIA_TYPE_DESC : '-mediaType',
MODERATION_COUNT_DESC : '-moderationCount',
NAME_DESC : '-name',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
PLAYS_DESC : '-plays',
RANK_DESC : '-rank',
RECENT_DESC : '-recent',
START_DATE_DESC : '-startDate',
TOTAL_RANK_DESC : '-totalRank',
UPDATED_AT_DESC : '-updatedAt',
VIEWS_DESC : '-views',
WEIGHT_DESC : '-weight',
};

var KalturaMailType = module.exports.KalturaMailType = {
MAIL_TYPE_KALTURA_NEWSLETTER : '10',
MAIL_TYPE_ADDED_TO_FAVORITES : '11',
MAIL_TYPE_ADDED_TO_CLIP_FAVORITES : '12',
MAIL_TYPE_NEW_COMMENT_IN_PROFILE : '13',
MAIL_TYPE_CLIP_ADDED_YOUR_KALTURA : '20',
MAIL_TYPE_VIDEO_ADDED : '21',
MAIL_TYPE_ROUGHCUT_CREATED : '22',
MAIL_TYPE_ADDED_KALTURA_TO_YOUR_FAVORITES : '23',
MAIL_TYPE_NEW_COMMENT_IN_KALTURA : '24',
MAIL_TYPE_CLIP_ADDED : '30',
MAIL_TYPE_VIDEO_CREATED : '31',
MAIL_TYPE_ADDED_KALTURA_TO_HIS_FAVORITES : '32',
MAIL_TYPE_NEW_COMMENT_IN_KALTURA_YOU_CONTRIBUTED : '33',
MAIL_TYPE_CLIP_CONTRIBUTED : '40',
MAIL_TYPE_ROUGHCUT_CREATED_SUBSCRIBED : '41',
MAIL_TYPE_ADDED_KALTURA_TO_HIS_FAVORITES_SUBSCRIBED : '42',
MAIL_TYPE_NEW_COMMENT_IN_KALTURA_YOU_SUBSCRIBED : '43',
MAIL_TYPE_REGISTER_CONFIRM : '50',
MAIL_TYPE_PASSWORD_RESET : '51',
MAIL_TYPE_LOGIN_MAIL_RESET : '52',
MAIL_TYPE_REGISTER_CONFIRM_VIDEO_SERVICE : '54',
MAIL_TYPE_VIDEO_READY : '60',
MAIL_TYPE_VIDEO_IS_READY : '62',
MAIL_TYPE_BULK_DOWNLOAD_READY : '63',
MAIL_TYPE_BULKUPLOAD_FINISHED : '64',
MAIL_TYPE_BULKUPLOAD_FAILED : '65',
MAIL_TYPE_BULKUPLOAD_ABORTED : '66',
MAIL_TYPE_NOTIFY_ERR : '70',
MAIL_TYPE_ACCOUNT_UPGRADE_CONFIRM : '80',
MAIL_TYPE_VIDEO_SERVICE_NOTICE : '81',
MAIL_TYPE_VIDEO_SERVICE_NOTICE_LIMIT_REACHED : '82',
MAIL_TYPE_VIDEO_SERVICE_NOTICE_ACCOUNT_LOCKED : '83',
MAIL_TYPE_VIDEO_SERVICE_NOTICE_ACCOUNT_DELETED : '84',
MAIL_TYPE_VIDEO_SERVICE_NOTICE_UPGRADE_OFFER : '85',
MAIL_TYPE_ACCOUNT_REACTIVE_CONFIRM : '86',
MAIL_TYPE_SYSTEM_USER_RESET_PASSWORD : '110',
MAIL_TYPE_SYSTEM_USER_RESET_PASSWORD_SUCCESS : '111',
MAIL_TYPE_SYSTEM_USER_NEW_PASSWORD : '112',
MAIL_TYPE_SYSTEM_USER_CREDENTIALS_SAVED : '113',
MAIL_TYPE_LIVE_REPORT_EXPORT_SUCCESS : '130',
MAIL_TYPE_LIVE_REPORT_EXPORT_FAILURE : '131',
MAIL_TYPE_LIVE_REPORT_EXPORT_ABORT : '132',
};

var KalturaMediaEntryOrderBy = module.exports.KalturaMediaEntryOrderBy = {
CREATED_AT_ASC : '+createdAt',
DURATION_ASC : '+duration',
END_DATE_ASC : '+endDate',
LAST_PLAYED_AT_ASC : '+lastPlayedAt',
MEDIA_TYPE_ASC : '+mediaType',
MODERATION_COUNT_ASC : '+moderationCount',
NAME_ASC : '+name',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
PLAYS_ASC : '+plays',
RANK_ASC : '+rank',
RECENT_ASC : '+recent',
START_DATE_ASC : '+startDate',
TOTAL_RANK_ASC : '+totalRank',
UPDATED_AT_ASC : '+updatedAt',
VIEWS_ASC : '+views',
WEIGHT_ASC : '+weight',
CREATED_AT_DESC : '-createdAt',
DURATION_DESC : '-duration',
END_DATE_DESC : '-endDate',
LAST_PLAYED_AT_DESC : '-lastPlayedAt',
MEDIA_TYPE_DESC : '-mediaType',
MODERATION_COUNT_DESC : '-moderationCount',
NAME_DESC : '-name',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
PLAYS_DESC : '-plays',
RANK_DESC : '-rank',
RECENT_DESC : '-recent',
START_DATE_DESC : '-startDate',
TOTAL_RANK_DESC : '-totalRank',
UPDATED_AT_DESC : '-updatedAt',
VIEWS_DESC : '-views',
WEIGHT_DESC : '-weight',
};

var KalturaMediaFlavorParamsOrderBy = module.exports.KalturaMediaFlavorParamsOrderBy = {
};

var KalturaMediaFlavorParamsOutputOrderBy = module.exports.KalturaMediaFlavorParamsOutputOrderBy = {
};

var KalturaMediaInfoOrderBy = module.exports.KalturaMediaInfoOrderBy = {
};

var KalturaMediaParserType = module.exports.KalturaMediaParserType = {
MEDIAINFO : '0',
REMOTE_MEDIAINFO : 'remoteMediaInfo.RemoteMediaInfo',
FFMPEG : '1',
};

var KalturaMetadataObjectType = module.exports.KalturaMetadataObjectType = {
AD_CUE_POINT : 'adCuePointMetadata.AdCuePoint',
ANNOTATION : 'annotationMetadata.Annotation',
CODE_CUE_POINT : 'codeCuePointMetadata.CodeCuePoint',
THUMB_CUE_POINT : 'thumbCuePointMetadata.thumbCuePoint',
ENTRY : '1',
CATEGORY : '2',
USER : '3',
PARTNER : '4',
DYNAMIC_OBJECT : '5',
};

var KalturaMetadataOrderBy = module.exports.KalturaMetadataOrderBy = {
CREATED_AT_ASC : '+createdAt',
METADATA_PROFILE_VERSION_ASC : '+metadataProfileVersion',
UPDATED_AT_ASC : '+updatedAt',
VERSION_ASC : '+version',
CREATED_AT_DESC : '-createdAt',
METADATA_PROFILE_VERSION_DESC : '-metadataProfileVersion',
UPDATED_AT_DESC : '-updatedAt',
VERSION_DESC : '-version',
};

var KalturaMetadataProfileOrderBy = module.exports.KalturaMetadataProfileOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaMixEntryOrderBy = module.exports.KalturaMixEntryOrderBy = {
CREATED_AT_ASC : '+createdAt',
DURATION_ASC : '+duration',
END_DATE_ASC : '+endDate',
LAST_PLAYED_AT_ASC : '+lastPlayedAt',
MODERATION_COUNT_ASC : '+moderationCount',
NAME_ASC : '+name',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
PLAYS_ASC : '+plays',
RANK_ASC : '+rank',
RECENT_ASC : '+recent',
START_DATE_ASC : '+startDate',
TOTAL_RANK_ASC : '+totalRank',
UPDATED_AT_ASC : '+updatedAt',
VIEWS_ASC : '+views',
WEIGHT_ASC : '+weight',
CREATED_AT_DESC : '-createdAt',
DURATION_DESC : '-duration',
END_DATE_DESC : '-endDate',
LAST_PLAYED_AT_DESC : '-lastPlayedAt',
MODERATION_COUNT_DESC : '-moderationCount',
NAME_DESC : '-name',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
PLAYS_DESC : '-plays',
RANK_DESC : '-rank',
RECENT_DESC : '-recent',
START_DATE_DESC : '-startDate',
TOTAL_RANK_DESC : '-totalRank',
UPDATED_AT_DESC : '-updatedAt',
VIEWS_DESC : '-views',
WEIGHT_DESC : '-weight',
};

var KalturaModerationFlagStatus = module.exports.KalturaModerationFlagStatus = {
PENDING : '1',
MODERATED : '2',
};

var KalturaModerationObjectType = module.exports.KalturaModerationObjectType = {
ENTRY : '2',
USER : '3',
};

var KalturaObjectFilterEngineType = module.exports.KalturaObjectFilterEngineType = {
ENTRY : '1',
};

var KalturaObjectTaskType = module.exports.KalturaObjectTaskType = {
DISTRIBUTE : 'scheduledTaskContentDistribution.Distribute',
DISPATCH_EVENT_NOTIFICATION : 'scheduledTaskEventNotification.DispatchEventNotification',
EXECUTE_METADATA_XSLT : 'scheduledTaskMetadata.ExecuteMetadataXslt',
DELETE_ENTRY : '1',
MODIFY_CATEGORIES : '2',
DELETE_ENTRY_FLAVORS : '3',
CONVERT_ENTRY_FLAVORS : '4',
DELETE_LOCAL_CONTENT : '5',
STORAGE_EXPORT : '6',
};

var KalturaPartnerOrderBy = module.exports.KalturaPartnerOrderBy = {
ADMIN_EMAIL_ASC : '+adminEmail',
ADMIN_NAME_ASC : '+adminName',
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
NAME_ASC : '+name',
STATUS_ASC : '+status',
WEBSITE_ASC : '+website',
ADMIN_EMAIL_DESC : '-adminEmail',
ADMIN_NAME_DESC : '-adminName',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
NAME_DESC : '-name',
STATUS_DESC : '-status',
WEBSITE_DESC : '-website',
};

var KalturaPdfFlavorParamsOrderBy = module.exports.KalturaPdfFlavorParamsOrderBy = {
};

var KalturaPdfFlavorParamsOutputOrderBy = module.exports.KalturaPdfFlavorParamsOutputOrderBy = {
};

var KalturaPermissionItemOrderBy = module.exports.KalturaPermissionItemOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaPermissionItemType = module.exports.KalturaPermissionItemType = {
API_ACTION_ITEM : 'kApiActionPermissionItem',
API_PARAMETER_ITEM : 'kApiParameterPermissionItem',
};

var KalturaPermissionOrderBy = module.exports.KalturaPermissionOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
NAME_ASC : '+name',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
NAME_DESC : '-name',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaPlayReadyAnalogVideoOPId = module.exports.KalturaPlayReadyAnalogVideoOPId = {
EXPLICIT_ANALOG_TV : '2098DE8D-7DDD-4BAB-96C6-32EBB6FABEA3',
BEST_EFFORT_EXPLICIT_ANALOG_TV : '225CD36F-F132-49EF-BA8C-C91EA28E4369',
IMAGE_CONSTRAINT_VIDEO : '811C5110-46C8-4C6E-8163-C0482A15D47E',
AGC_AND_COLOR_STRIPE : 'C3FD11C6-F8B7-4D20-B008-1DB17D61F2DA',
IMAGE_CONSTRAINT_MONITOR : 'D783A191-E083-4BAF-B2DA-E69F910B3772',
};

var KalturaPlayReadyCopyEnablerType = module.exports.KalturaPlayReadyCopyEnablerType = {
CSS : '3CAF2814-A7AB-467C-B4DF-54ACC56C66DC',
PRINTER : '3CF2E054-F4D5-46cd-85A6-FCD152AD5FBE',
DEVICE : '6848955D-516B-4EB0-90E8-8F6D5A77B85F',
CLIPBOARD : '6E76C588-C3A9-47ea-A875-546D5209FF38',
SDC : '79F78A0D-0B69-401e-8A90-8BEF30BCE192',
SDC_PREVIEW : '81BD9AD4-A720-4ea1-B510-5D4E6FFB6A4D',
AACS : 'C3CF56E0-7FF2-4491-809F-53E21D3ABF07',
HELIX : 'CCB0B4E3-8B46-409e-A998-82556E3F5AF4',
CPRM : 'CDD801AD-A577-48DB-950E-46D5F1592FAE',
PC : 'CE480EDE-516B-40B3-90E1-D6CFC47630C5',
SDC_LIMITED : 'E6785609-64CC-4bfa-B82D-6B619733B746',
ORANGE_BOOK_CD : 'EC930B7D-1F2D-4682-A38B-8AB977721D0D',
};

var KalturaPlayReadyDigitalAudioOPId = module.exports.KalturaPlayReadyDigitalAudioOPId = {
SCMS : '6D5CFA59-C250-4426-930E-FAC72C8FCFA6',
};

var KalturaPlayReadyPlayEnablerType = module.exports.KalturaPlayReadyPlayEnablerType = {
HELIX : '002F9772-38A0-43E5-9F79-0F6361DCC62A',
HDCP_WIVU : '1B4542E3-B5CF-4C99-B3BA-829AF46C92F8',
AIRPLAY : '5ABF0F0D-DC29-4B82-9982-FD8E57525BFC',
UNKNOWN : '786627D8-C2A6-44BE-8F88-08AE255B01A',
HDCP_MIRACAST : 'A340C256-0941-4D4C-AD1D-0B6735C0CB24',
UNKNOWN_520 : 'B621D91F-EDCC-4035-8D4B-DC71760D43E9',
DTCP : 'D685030B-0F4F-43A6-BBAD-356F1EA0049A',
};

var KalturaPlayReadyPolicyOrderBy = module.exports.KalturaPlayReadyPolicyOrderBy = {
};

var KalturaPlayReadyProfileOrderBy = module.exports.KalturaPlayReadyProfileOrderBy = {
ID_ASC : '+id',
NAME_ASC : '+name',
ID_DESC : '-id',
NAME_DESC : '-name',
};

var KalturaPlayableEntryOrderBy = module.exports.KalturaPlayableEntryOrderBy = {
CREATED_AT_ASC : '+createdAt',
DURATION_ASC : '+duration',
END_DATE_ASC : '+endDate',
LAST_PLAYED_AT_ASC : '+lastPlayedAt',
MODERATION_COUNT_ASC : '+moderationCount',
NAME_ASC : '+name',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
PLAYS_ASC : '+plays',
RANK_ASC : '+rank',
RECENT_ASC : '+recent',
START_DATE_ASC : '+startDate',
TOTAL_RANK_ASC : '+totalRank',
UPDATED_AT_ASC : '+updatedAt',
VIEWS_ASC : '+views',
WEIGHT_ASC : '+weight',
CREATED_AT_DESC : '-createdAt',
DURATION_DESC : '-duration',
END_DATE_DESC : '-endDate',
LAST_PLAYED_AT_DESC : '-lastPlayedAt',
MODERATION_COUNT_DESC : '-moderationCount',
NAME_DESC : '-name',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
PLAYS_DESC : '-plays',
RANK_DESC : '-rank',
RECENT_DESC : '-recent',
START_DATE_DESC : '-startDate',
TOTAL_RANK_DESC : '-totalRank',
UPDATED_AT_DESC : '-updatedAt',
VIEWS_DESC : '-views',
WEIGHT_DESC : '-weight',
};

var KalturaPlaybackProtocol = module.exports.KalturaPlaybackProtocol = {
APPLE_HTTP : 'applehttp',
AUTO : 'auto',
AKAMAI_HD : 'hdnetwork',
AKAMAI_HDS : 'hdnetworkmanifest',
HDS : 'hds',
HLS : 'hls',
HTTP : 'http',
MPEG_DASH : 'mpegdash',
MULTICAST_SL : 'multicast_silverlight',
RTMP : 'rtmp',
RTSP : 'rtsp',
SILVER_LIGHT : 'sl',
};

var KalturaPlaylistOrderBy = module.exports.KalturaPlaylistOrderBy = {
CREATED_AT_ASC : '+createdAt',
END_DATE_ASC : '+endDate',
MODERATION_COUNT_ASC : '+moderationCount',
NAME_ASC : '+name',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
RANK_ASC : '+rank',
RECENT_ASC : '+recent',
START_DATE_ASC : '+startDate',
TOTAL_RANK_ASC : '+totalRank',
UPDATED_AT_ASC : '+updatedAt',
WEIGHT_ASC : '+weight',
CREATED_AT_DESC : '-createdAt',
END_DATE_DESC : '-endDate',
MODERATION_COUNT_DESC : '-moderationCount',
NAME_DESC : '-name',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
RANK_DESC : '-rank',
RECENT_DESC : '-recent',
START_DATE_DESC : '-startDate',
TOTAL_RANK_DESC : '-totalRank',
UPDATED_AT_DESC : '-updatedAt',
WEIGHT_DESC : '-weight',
};

var KalturaRemoteDropFolderOrderBy = module.exports.KalturaRemoteDropFolderOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
NAME_ASC : '+name',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
NAME_DESC : '-name',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaReportInterval = module.exports.KalturaReportInterval = {
DAYS : 'days',
MONTHS : 'months',
};

var KalturaReportOrderBy = module.exports.KalturaReportOrderBy = {
CREATED_AT_ASC : '+createdAt',
CREATED_AT_DESC : '-createdAt',
};

var KalturaResponseProfileOrderBy = module.exports.KalturaResponseProfileOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaRuleActionType = module.exports.KalturaRuleActionType = {
DRM_POLICY : 'playReady.DRM_POLICY',
BLOCK : '1',
PREVIEW : '2',
LIMIT_FLAVORS : '3',
ADD_TO_STORAGE : '4',
};

var KalturaScheduledTaskProfileOrderBy = module.exports.KalturaScheduledTaskProfileOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
LAST_EXECUTION_STARTED_AT_ASC : '+lastExecutionStartedAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
LAST_EXECUTION_STARTED_AT_DESC : '-lastExecutionStartedAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaSchemaType = module.exports.KalturaSchemaType = {
BULK_UPLOAD_RESULT_XML : 'bulkUploadXml.bulkUploadResultXML',
BULK_UPLOAD_XML : 'bulkUploadXml.bulkUploadXML',
INGEST_API : 'cuePoint.ingestAPI',
SERVE_API : 'cuePoint.serveAPI',
DROP_FOLDER_XML : 'dropFolderXmlBulkUpload.dropFolderXml',
SYNDICATION : 'syndication',
};

var KalturaScpDropFolderOrderBy = module.exports.KalturaScpDropFolderOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
NAME_ASC : '+name',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
NAME_DESC : '-name',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaSearchConditionComparison = module.exports.KalturaSearchConditionComparison = {
EQUAL : '1',
GREATER_THAN : '2',
GREATER_THAN_OR_EQUAL : '3',
LESS_THAN : '4',
LESS_THAN_OR_EQUAL : '5',
};

var KalturaSftpDropFolderOrderBy = module.exports.KalturaSftpDropFolderOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
NAME_ASC : '+name',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
NAME_DESC : '-name',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaShortLinkOrderBy = module.exports.KalturaShortLinkOrderBy = {
CREATED_AT_ASC : '+createdAt',
EXPIRES_AT_ASC : '+expiresAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
EXPIRES_AT_DESC : '-expiresAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaSourceType = module.exports.KalturaSourceType = {
LIMELIGHT_LIVE : 'limeLight.LIVE_STREAM',
VELOCIX_LIVE : 'velocix.VELOCIX_LIVE',
FILE : '1',
WEBCAM : '2',
URL : '5',
SEARCH_PROVIDER : '6',
AKAMAI_LIVE : '29',
MANUAL_LIVE_STREAM : '30',
AKAMAI_UNIVERSAL_LIVE : '31',
LIVE_STREAM : '32',
LIVE_CHANNEL : '33',
RECORDED_LIVE : '34',
CLIP : '35',
LIVE_STREAM_ONTEXTDATA_CAPTIONS : '42',
};

var KalturaSshDropFolderOrderBy = module.exports.KalturaSshDropFolderOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
NAME_ASC : '+name',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
NAME_DESC : '-name',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaStorageProfileOrderBy = module.exports.KalturaStorageProfileOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaStorageProfileProtocol = module.exports.KalturaStorageProfileProtocol = {
KONTIKI : 'kontiki.KONTIKI',
KALTURA_DC : '0',
FTP : '1',
SCP : '2',
SFTP : '3',
S3 : '6',
LOCAL : '7',
};

var KalturaSwfFlavorParamsOrderBy = module.exports.KalturaSwfFlavorParamsOrderBy = {
};

var KalturaSwfFlavorParamsOutputOrderBy = module.exports.KalturaSwfFlavorParamsOutputOrderBy = {
};

var KalturaSyndicationDistributionProfileOrderBy = module.exports.KalturaSyndicationDistributionProfileOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaSyndicationFeedEntriesOrderBy = module.exports.KalturaSyndicationFeedEntriesOrderBy = {
CREATED_AT_DESC : '-createdAt',
RECENT : 'recent',
};

var KalturaTaggedObjectType = module.exports.KalturaTaggedObjectType = {
ENTRY : '1',
CATEGORY : '2',
};

var KalturaThumbAssetOrderBy = module.exports.KalturaThumbAssetOrderBy = {
CREATED_AT_ASC : '+createdAt',
DELETED_AT_ASC : '+deletedAt',
SIZE_ASC : '+size',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
DELETED_AT_DESC : '-deletedAt',
SIZE_DESC : '-size',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaThumbCuePointOrderBy = module.exports.KalturaThumbCuePointOrderBy = {
CREATED_AT_ASC : '+createdAt',
PARTNER_SORT_VALUE_ASC : '+partnerSortValue',
START_TIME_ASC : '+startTime',
TRIGGERED_AT_ASC : '+triggeredAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
PARTNER_SORT_VALUE_DESC : '-partnerSortValue',
START_TIME_DESC : '-startTime',
TRIGGERED_AT_DESC : '-triggeredAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaThumbParamsOrderBy = module.exports.KalturaThumbParamsOrderBy = {
};

var KalturaThumbParamsOutputOrderBy = module.exports.KalturaThumbParamsOutputOrderBy = {
};

var KalturaTimedThumbAssetOrderBy = module.exports.KalturaTimedThumbAssetOrderBy = {
CREATED_AT_ASC : '+createdAt',
DELETED_AT_ASC : '+deletedAt',
SIZE_ASC : '+size',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
DELETED_AT_DESC : '-deletedAt',
SIZE_DESC : '-size',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaTubeMogulSyndicationFeedCategories = module.exports.KalturaTubeMogulSyndicationFeedCategories = {
ANIMALS_AND_PETS : 'Animals &amp; Pets',
ARTS_AND_ANIMATION : 'Arts &amp; Animation',
AUTOS : 'Autos',
COMEDY : 'Comedy',
COMMERCIALS_PROMOTIONAL : 'Commercials/Promotional',
ENTERTAINMENT : 'Entertainment',
FAMILY_AND_KIDS : 'Family &amp; Kids',
HOW_TO_INSTRUCTIONAL_DIY : 'How To/Instructional/DIY',
MUSIC : 'Music',
NEWS_AND_BLOGS : 'News &amp; Blogs',
SCIENCE_AND_TECHNOLOGY : 'Science &amp; Technology',
SPORTS : 'Sports',
TRAVEL_AND_PLACES : 'Travel &amp; Places',
VIDEO_GAMES : 'Video Games',
VLOGS_PEOPLE : 'Vlogs &amp; People',
};

var KalturaTubeMogulSyndicationFeedOrderBy = module.exports.KalturaTubeMogulSyndicationFeedOrderBy = {
CREATED_AT_ASC : '+createdAt',
NAME_ASC : '+name',
PLAYLIST_ID_ASC : '+playlistId',
TYPE_ASC : '+type',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
NAME_DESC : '-name',
PLAYLIST_ID_DESC : '-playlistId',
TYPE_DESC : '-type',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaUiConfOrderBy = module.exports.KalturaUiConfOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaUploadTokenOrderBy = module.exports.KalturaUploadTokenOrderBy = {
CREATED_AT_ASC : '+createdAt',
CREATED_AT_DESC : '-createdAt',
};

var KalturaUserLoginDataOrderBy = module.exports.KalturaUserLoginDataOrderBy = {
};

var KalturaUserOrderBy = module.exports.KalturaUserOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
};

var KalturaUserRoleOrderBy = module.exports.KalturaUserRoleOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
NAME_ASC : '+name',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
NAME_DESC : '-name',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaVideoCodec = module.exports.KalturaVideoCodec = {
NONE : '',
APCH : 'apch',
APCN : 'apcn',
APCO : 'apco',
APCS : 'apcs',
COPY : 'copy',
DNXHD : 'dnxhd',
DV : 'dv',
FLV : 'flv',
H263 : 'h263',
H264 : 'h264',
H264B : 'h264b',
H264H : 'h264h',
H264M : 'h264m',
H265 : 'h265',
MPEG2 : 'mpeg2',
MPEG4 : 'mpeg4',
THEORA : 'theora',
VP6 : 'vp6',
VP8 : 'vp8',
VP9 : 'vp9',
WMV2 : 'wmv2',
WMV3 : 'wmv3',
WVC1A : 'wvc1a',
};

var KalturaVirusScanEngineType = module.exports.KalturaVirusScanEngineType = {
CLAMAV_SCAN_ENGINE : 'clamAVScanEngine.ClamAV',
SYMANTEC_SCAN_DIRECT_ENGINE : 'symantecScanEngine.SymantecScanDirectEngine',
SYMANTEC_SCAN_ENGINE : 'symantecScanEngine.SymantecScanEngine',
SYMANTEC_SCAN_JAVA_ENGINE : 'symantecScanEngine.SymantecScanJavaEngine',
};

var KalturaVirusScanProfileOrderBy = module.exports.KalturaVirusScanProfileOrderBy = {
CREATED_AT_ASC : '+createdAt',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaWebexDropFolderFileOrderBy = module.exports.KalturaWebexDropFolderFileOrderBy = {
CREATED_AT_ASC : '+createdAt',
FILE_NAME_ASC : '+fileName',
FILE_SIZE_ASC : '+fileSize',
FILE_SIZE_LAST_SET_AT_ASC : '+fileSizeLastSetAt',
ID_ASC : '+id',
PARSED_FLAVOR_ASC : '+parsedFlavor',
PARSED_SLUG_ASC : '+parsedSlug',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
FILE_NAME_DESC : '-fileName',
FILE_SIZE_DESC : '-fileSize',
FILE_SIZE_LAST_SET_AT_DESC : '-fileSizeLastSetAt',
ID_DESC : '-id',
PARSED_FLAVOR_DESC : '-parsedFlavor',
PARSED_SLUG_DESC : '-parsedSlug',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaWebexDropFolderOrderBy = module.exports.KalturaWebexDropFolderOrderBy = {
CREATED_AT_ASC : '+createdAt',
ID_ASC : '+id',
NAME_ASC : '+name',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
ID_DESC : '-id',
NAME_DESC : '-name',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaWidevineFlavorAssetOrderBy = module.exports.KalturaWidevineFlavorAssetOrderBy = {
CREATED_AT_ASC : '+createdAt',
DELETED_AT_ASC : '+deletedAt',
SIZE_ASC : '+size',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
DELETED_AT_DESC : '-deletedAt',
SIZE_DESC : '-size',
UPDATED_AT_DESC : '-updatedAt',
};

var KalturaWidevineFlavorParamsOrderBy = module.exports.KalturaWidevineFlavorParamsOrderBy = {
};

var KalturaWidevineFlavorParamsOutputOrderBy = module.exports.KalturaWidevineFlavorParamsOutputOrderBy = {
};

var KalturaWidevineProfileOrderBy = module.exports.KalturaWidevineProfileOrderBy = {
ID_ASC : '+id',
NAME_ASC : '+name',
ID_DESC : '-id',
NAME_DESC : '-name',
};

var KalturaWidgetOrderBy = module.exports.KalturaWidgetOrderBy = {
CREATED_AT_ASC : '+createdAt',
CREATED_AT_DESC : '-createdAt',
};

var KalturaYahooSyndicationFeedAdultValues = module.exports.KalturaYahooSyndicationFeedAdultValues = {
ADULT : 'adult',
NON_ADULT : 'nonadult',
};

var KalturaYahooSyndicationFeedCategories = module.exports.KalturaYahooSyndicationFeedCategories = {
ACTION : 'Action',
ANIMALS : 'Animals',
ART_AND_ANIMATION : 'Art &amp; Animation',
COMMERCIALS : 'Commercials',
ENTERTAINMENT_AND_TV : 'Entertainment &amp; TV',
FAMILY : 'Family',
FOOD : 'Food',
FUNNY_VIDEOS : 'Funny Videos',
GAMES : 'Games',
HEALTH_AND_BEAUTY : 'Health &amp; Beauty',
HOW_TO : 'How-To',
MOVIES_AND_SHORTS : 'Movies &amp; Shorts',
MUSIC : 'Music',
NEWS_AND_POLITICS : 'News &amp; Politics',
PEOPLE_AND_VLOGS : 'People &amp; Vlogs',
PRODUCTS_AND_TECH : 'Products &amp; Tech.',
SCIENCE_AND_ENVIRONMENT : 'Science &amp; Environment',
SPORTS : 'Sports',
TRANSPORTATION : 'Transportation',
TRAVEL : 'Travel',
};

var KalturaYahooSyndicationFeedOrderBy = module.exports.KalturaYahooSyndicationFeedOrderBy = {
CREATED_AT_ASC : '+createdAt',
NAME_ASC : '+name',
PLAYLIST_ID_ASC : '+playlistId',
TYPE_ASC : '+type',
UPDATED_AT_ASC : '+updatedAt',
CREATED_AT_DESC : '-createdAt',
NAME_DESC : '-name',
PLAYLIST_ID_DESC : '-playlistId',
TYPE_DESC : '-type',
UPDATED_AT_DESC : '-updatedAt',
};
