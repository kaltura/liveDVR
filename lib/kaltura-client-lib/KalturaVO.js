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
var util = require('util');
var kaltura = require('./KalturaClientBase');

/**
 * @param totalCount int  (readOnly).
 */
function KalturaListResponse(){
	KalturaListResponse.super_.call(this);
	this.totalCount = null;
}
module.exports.KalturaListResponse = KalturaListResponse;

util.inherits(KalturaListResponse, kaltura.KalturaObjectBase);


/**
 */
function KalturaBaseRestriction(){
	KalturaBaseRestriction.super_.call(this);
}
module.exports.KalturaBaseRestriction = KalturaBaseRestriction;

util.inherits(KalturaBaseRestriction, kaltura.KalturaObjectBase);


/**
 * @param id int The id of the Access Control Profile (readOnly).
 * @param partnerId int  (readOnly).
 * @param name string The name of the Access Control Profile.
 * @param systemName string System name of the Access Control Profile.
 * @param description string The description of the Access Control Profile.
 * @param createdAt int Creation date as Unix timestamp (In seconds) (readOnly).
 * @param isDefault int True if this Conversion Profile is the default.
 * @param restrictions array Array of Access Control Restrictions.
 * @param containsUnsuportedRestrictions bool Indicates that the access control profile is new and should be handled using KalturaAccessControlProfile object and accessControlProfile service (readOnly).
 */
function KalturaAccessControl(){
	KalturaAccessControl.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.name = null;
	this.systemName = null;
	this.description = null;
	this.createdAt = null;
	this.isDefault = null;
	this.restrictions = null;
	this.containsUnsuportedRestrictions = null;
}
module.exports.KalturaAccessControl = KalturaAccessControl;

util.inherits(KalturaAccessControl, kaltura.KalturaObjectBase);


/**
 * @param type string The type of the condition context.
 */
function KalturaContextTypeHolder(){
	KalturaContextTypeHolder.super_.call(this);
	this.type = null;
}
module.exports.KalturaContextTypeHolder = KalturaContextTypeHolder;

util.inherits(KalturaContextTypeHolder, kaltura.KalturaObjectBase);


/**
 */
function KalturaAccessControlContextTypeHolder(){
	KalturaAccessControlContextTypeHolder.super_.call(this);
}
module.exports.KalturaAccessControlContextTypeHolder = KalturaAccessControlContextTypeHolder;

util.inherits(KalturaAccessControlContextTypeHolder, KalturaContextTypeHolder);


/**
 * @param type string The type of the action (readOnly).
 */
function KalturaRuleAction(){
	KalturaRuleAction.super_.call(this);
	this.type = null;
}
module.exports.KalturaRuleAction = KalturaRuleAction;

util.inherits(KalturaRuleAction, kaltura.KalturaObjectBase);


/**
 * @param type string The type of the access control condition (readOnly).
 * @param description string .
 * @param not bool .
 */
function KalturaCondition(){
	KalturaCondition.super_.call(this);
	this.type = null;
	this.description = null;
	this.not = null;
}
module.exports.KalturaCondition = KalturaCondition;

util.inherits(KalturaCondition, kaltura.KalturaObjectBase);


/**
 * @param message string Message to be thrown to the player in case the rule is fulfilled.
 * @param actions array Actions to be performed by the player in case the rule is fulfilled.
 * @param conditions array Conditions to validate the rule.
 * @param contexts array Indicates what contexts should be tested by this rule.
 * @param stopProcessing bool Indicates that this rule is enough and no need to continue checking the rest of the rules.
 */
function KalturaRule(){
	KalturaRule.super_.call(this);
	this.message = null;
	this.actions = null;
	this.conditions = null;
	this.contexts = null;
	this.stopProcessing = null;
}
module.exports.KalturaRule = KalturaRule;

util.inherits(KalturaRule, kaltura.KalturaObjectBase);


/**
 * @param id int The id of the Access Control Profile (readOnly).
 * @param partnerId int  (readOnly).
 * @param name string The name of the Access Control Profile.
 * @param systemName string System name of the Access Control Profile.
 * @param description string The description of the Access Control Profile.
 * @param createdAt int Creation time as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Update time as Unix timestamp (In seconds) (readOnly).
 * @param isDefault int True if this access control profile is the partner default.
 * @param rules array Array of access control rules.
 */
function KalturaAccessControlProfile(){
	KalturaAccessControlProfile.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.name = null;
	this.systemName = null;
	this.description = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.isDefault = null;
	this.rules = null;
}
module.exports.KalturaAccessControlProfile = KalturaAccessControlProfile;

util.inherits(KalturaAccessControlProfile, kaltura.KalturaObjectBase);


/**
 * @param key string .
 * @param value string .
 */
function KalturaKeyValue(){
	KalturaKeyValue.super_.call(this);
	this.key = null;
	this.value = null;
}
module.exports.KalturaKeyValue = KalturaKeyValue;

util.inherits(KalturaKeyValue, kaltura.KalturaObjectBase);


/**
 * @param referrer string URL to be used to test domain conditions.
 * @param ip string IP to be used to test geographic location conditions.
 * @param ks string Kaltura session to be used to test session and user conditions.
 * @param userAgent string Browser or client application to be used to test agent conditions.
 * @param time int Unix timestamp (In seconds) to be used to test entry scheduling, keep null to use now.
 * @param contexts array Indicates what contexts should be tested. No contexts means any context.
 * @param hashes array Array of hashes to pass to the access control profile scope.
 */
function KalturaAccessControlScope(){
	KalturaAccessControlScope.super_.call(this);
	this.referrer = null;
	this.ip = null;
	this.ks = null;
	this.userAgent = null;
	this.time = null;
	this.contexts = null;
	this.hashes = null;
}
module.exports.KalturaAccessControlScope = KalturaAccessControlScope;

util.inherits(KalturaAccessControlScope, kaltura.KalturaObjectBase);


/**
 * @param id string  (readOnly).
 * @param cuePointType string  (readOnly).
 * @param status int  (readOnly).
 * @param entryId string  (insertOnly).
 * @param partnerId int  (readOnly).
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param triggeredAt int .
 * @param tags string .
 * @param startTime int Start time in milliseconds.
 * @param userId string  (readOnly).
 * @param partnerData string .
 * @param partnerSortValue int .
 * @param forceStop int .
 * @param thumbOffset int .
 * @param systemName string .
 */
function KalturaCuePoint(){
	KalturaCuePoint.super_.call(this);
	this.id = null;
	this.cuePointType = null;
	this.status = null;
	this.entryId = null;
	this.partnerId = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.triggeredAt = null;
	this.tags = null;
	this.startTime = null;
	this.userId = null;
	this.partnerData = null;
	this.partnerSortValue = null;
	this.forceStop = null;
	this.thumbOffset = null;
	this.systemName = null;
}
module.exports.KalturaCuePoint = KalturaCuePoint;

util.inherits(KalturaCuePoint, kaltura.KalturaObjectBase);


/**
 * @param parentId string  (insertOnly).
 * @param text string .
 * @param endTime int End time in milliseconds.
 * @param duration int Duration in milliseconds (readOnly).
 * @param depth int Depth in the tree (readOnly).
 * @param childrenCount int Number of all descendants (readOnly).
 * @param directChildrenCount int Number of children, first generation only (readOnly).
 * @param isPublic int Is the annotation public.
 * @param searchableOnEntry int Should the cue point get indexed on the entry.
 */
function KalturaAnnotation(){
	KalturaAnnotation.super_.call(this);
	this.parentId = null;
	this.text = null;
	this.endTime = null;
	this.duration = null;
	this.depth = null;
	this.childrenCount = null;
	this.directChildrenCount = null;
	this.isPublic = null;
	this.searchableOnEntry = null;
}
module.exports.KalturaAnnotation = KalturaAnnotation;

util.inherits(KalturaAnnotation, KalturaCuePoint);


/**
 * @param id string The ID of the Flavor Asset (readOnly).
 * @param entryId string The entry ID of the Flavor Asset (readOnly).
 * @param partnerId int  (readOnly).
 * @param version int The version of the Flavor Asset (readOnly).
 * @param size int The size (in KBytes) of the Flavor Asset (readOnly).
 * @param tags string Tags used to identify the Flavor Asset in various scenarios.
 * @param fileExt string The file extension (insertOnly).
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param deletedAt int  (readOnly).
 * @param description string System description, error message, warnings and failure cause (readOnly).
 * @param partnerData string Partner private data.
 * @param partnerDescription string Partner friendly description.
 * @param actualSourceAssetParamsIds string Comma separated list of source flavor params ids.
 */
function KalturaAsset(){
	KalturaAsset.super_.call(this);
	this.id = null;
	this.entryId = null;
	this.partnerId = null;
	this.version = null;
	this.size = null;
	this.tags = null;
	this.fileExt = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.deletedAt = null;
	this.description = null;
	this.partnerData = null;
	this.partnerDescription = null;
	this.actualSourceAssetParamsIds = null;
}
module.exports.KalturaAsset = KalturaAsset;

util.inherits(KalturaAsset, kaltura.KalturaObjectBase);


/**
 */
function KalturaAssetDistributionCondition(){
	KalturaAssetDistributionCondition.super_.call(this);
}
module.exports.KalturaAssetDistributionCondition = KalturaAssetDistributionCondition;

util.inherits(KalturaAssetDistributionCondition, kaltura.KalturaObjectBase);


/**
 * @param validationError string The validation error description that will be set on the "data" property on KalturaDistributionValidationErrorMissingAsset if rule was not fulfilled.
 * @param assetDistributionConditions array An array of asset distribution conditions.
 */
function KalturaAssetDistributionRule(){
	KalturaAssetDistributionRule.super_.call(this);
	this.validationError = null;
	this.assetDistributionConditions = null;
}
module.exports.KalturaAssetDistributionRule = KalturaAssetDistributionRule;

util.inherits(KalturaAssetDistributionRule, kaltura.KalturaObjectBase);


/**
 * @param value string .
 */
function KalturaString(){
	KalturaString.super_.call(this);
	this.value = null;
}
module.exports.KalturaString = KalturaString;

util.inherits(KalturaString, kaltura.KalturaObjectBase);


/**
 * @param id int The id of the Flavor Params (readOnly).
 * @param partnerId int .
 * @param name string The name of the Flavor Params.
 * @param systemName string System name of the Flavor Params.
 * @param description string The description of the Flavor Params.
 * @param createdAt int Creation date as Unix timestamp (In seconds) (readOnly).
 * @param isSystemDefault int True if those Flavor Params are part of system defaults (readOnly).
 * @param tags string The Flavor Params tags are used to identify the flavor for different usage (e.g. web, hd, mobile).
 * @param requiredPermissions array Array of partner permisison names that required for using this asset params.
 * @param sourceRemoteStorageProfileId int Id of remote storage profile that used to get the source, zero indicates Kaltura data center.
 * @param remoteStorageProfileIds int Comma seperated ids of remote storage profiles that the flavor distributed to, the distribution done by the conversion engine.
 * @param mediaParserType string Media parser type to be used for post-conversion validation.
 * @param sourceAssetParamsIds string Comma seperated ids of source flavor params this flavor is created from.
 */
function KalturaAssetParams(){
	KalturaAssetParams.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.name = null;
	this.systemName = null;
	this.description = null;
	this.createdAt = null;
	this.isSystemDefault = null;
	this.tags = null;
	this.requiredPermissions = null;
	this.sourceRemoteStorageProfileId = null;
	this.remoteStorageProfileIds = null;
	this.mediaParserType = null;
	this.sourceAssetParamsIds = null;
}
module.exports.KalturaAssetParams = KalturaAssetParams;

util.inherits(KalturaAssetParams, kaltura.KalturaObjectBase);


/**
 */
function KalturaResource(){
	KalturaResource.super_.call(this);
}
module.exports.KalturaResource = KalturaResource;

util.inherits(KalturaResource, kaltura.KalturaObjectBase);


/**
 */
function KalturaContentResource(){
	KalturaContentResource.super_.call(this);
}
module.exports.KalturaContentResource = KalturaContentResource;

util.inherits(KalturaContentResource, KalturaResource);


/**
 * @param resource KalturaContentResource The content resource to associate with asset params.
 * @param assetParamsId int The asset params to associate with the reaource.
 */
function KalturaAssetParamsResourceContainer(){
	KalturaAssetParamsResourceContainer.super_.call(this);
	this.resource = null;
	this.assetParamsId = null;
}
module.exports.KalturaAssetParamsResourceContainer = KalturaAssetParamsResourceContainer;

util.inherits(KalturaAssetParamsResourceContainer, KalturaResource);


/**
 * @param filename string The filename of the attachment asset content.
 * @param title string Attachment asset title.
 * @param format string The attachment format.
 * @param status int The status of the asset (readOnly).
 */
function KalturaAttachmentAsset(){
	KalturaAttachmentAsset.super_.call(this);
	this.filename = null;
	this.title = null;
	this.format = null;
	this.status = null;
}
module.exports.KalturaAttachmentAsset = KalturaAttachmentAsset;

util.inherits(KalturaAttachmentAsset, KalturaAsset);


/**
 */
function KalturaAuditTrailInfo(){
	KalturaAuditTrailInfo.super_.call(this);
}
module.exports.KalturaAuditTrailInfo = KalturaAuditTrailInfo;

util.inherits(KalturaAuditTrailInfo, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param createdAt int  (readOnly).
 * @param parsedAt int Indicates when the data was parsed (readOnly).
 * @param status int  (readOnly).
 * @param auditObjectType string .
 * @param objectId string .
 * @param relatedObjectId string .
 * @param relatedObjectType string .
 * @param entryId string .
 * @param masterPartnerId int  (readOnly).
 * @param partnerId int  (readOnly).
 * @param requestId string  (readOnly).
 * @param userId string .
 * @param action string .
 * @param data KalturaAuditTrailInfo .
 * @param ks string  (readOnly).
 * @param context int  (readOnly).
 * @param entryPoint string The API service and action that called and caused this audit (readOnly).
 * @param serverName string  (readOnly).
 * @param ipAddress string  (readOnly).
 * @param userAgent string  (readOnly).
 * @param clientTag string .
 * @param description string .
 * @param errorDescription string  (readOnly).
 */
function KalturaAuditTrail(){
	KalturaAuditTrail.super_.call(this);
	this.id = null;
	this.createdAt = null;
	this.parsedAt = null;
	this.status = null;
	this.auditObjectType = null;
	this.objectId = null;
	this.relatedObjectId = null;
	this.relatedObjectType = null;
	this.entryId = null;
	this.masterPartnerId = null;
	this.partnerId = null;
	this.requestId = null;
	this.userId = null;
	this.action = null;
	this.data = null;
	this.ks = null;
	this.context = null;
	this.entryPoint = null;
	this.serverName = null;
	this.ipAddress = null;
	this.userAgent = null;
	this.clientTag = null;
	this.description = null;
	this.errorDescription = null;
}
module.exports.KalturaAuditTrail = KalturaAuditTrail;

util.inherits(KalturaAuditTrail, kaltura.KalturaObjectBase);


/**
 * @param descriptor string .
 * @param oldValue string .
 * @param newValue string .
 */
function KalturaAuditTrailChangeItem(){
	KalturaAuditTrailChangeItem.super_.call(this);
	this.descriptor = null;
	this.oldValue = null;
	this.newValue = null;
}
module.exports.KalturaAuditTrailChangeItem = KalturaAuditTrailChangeItem;

util.inherits(KalturaAuditTrailChangeItem, kaltura.KalturaObjectBase);


/**
 */
function KalturaOperationAttributes(){
	KalturaOperationAttributes.super_.call(this);
}
module.exports.KalturaOperationAttributes = KalturaOperationAttributes;

util.inherits(KalturaOperationAttributes, kaltura.KalturaObjectBase);


/**
 * @param id string Auto generated 10 characters alphanumeric string (readOnly).
 * @param name string Entry name (Min 1 chars).
 * @param description string Entry description.
 * @param partnerId int  (readOnly).
 * @param userId string The ID of the user who is the owner of this entry.
 * @param creatorId string The ID of the user who created this entry (insertOnly).
 * @param tags string Entry tags.
 * @param adminTags string Entry admin tags can be updated only by administrators.
 * @param categories string Comma separated list of full names of categories to which this entry belongs. Only categories that don't have entitlement (privacy context) are listed, to retrieve the full list of categories, use the categoryEntry.list action.
 * @param categoriesIds string Comma separated list of ids of categories to which this entry belongs. Only categories that don't have entitlement (privacy context) are listed, to retrieve the full list of categories, use the categoryEntry.list action.
 * @param status string  (readOnly).
 * @param moderationStatus int Entry moderation status (readOnly).
 * @param moderationCount int Number of moderation requests waiting for this entry (readOnly).
 * @param type string The type of the entry, this is auto filled by the derived entry object.
 * @param createdAt int Entry creation date as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Entry update date as Unix timestamp (In seconds) (readOnly).
 * @param rank float The calculated average rank. rank = totalRank / votes (readOnly).
 * @param totalRank int The sum of all rank values submitted to the baseEntry.anonymousRank action (readOnly).
 * @param votes int A count of all requests made to the baseEntry.anonymousRank action (readOnly).
 * @param groupId int .
 * @param partnerData string Can be used to store various partner related data as a string.
 * @param downloadUrl string Download URL for the entry (readOnly).
 * @param searchText string Indexed search text for full text search (readOnly).
 * @param licenseType int License type used for this entry.
 * @param version int Version of the entry data (readOnly).
 * @param thumbnailUrl string Thumbnail URL (insertOnly).
 * @param accessControlId int The Access Control ID assigned to this entry (null when not set, send -1 to remove).
 * @param startDate int Entry scheduling start date (null when not set, send -1 to remove).
 * @param endDate int Entry scheduling end date (null when not set, send -1 to remove).
 * @param referenceId string Entry external reference id.
 * @param replacingEntryId string ID of temporary entry that will replace this entry when it's approved and ready for replacement (readOnly).
 * @param replacedEntryId string ID of the entry that will be replaced when the replacement approved and this entry is ready (readOnly).
 * @param replacementStatus string Status of the replacement readiness and approval (readOnly).
 * @param partnerSortValue int Can be used to store various partner related data as a numeric value.
 * @param conversionProfileId int Override the default ingestion profile.
 * @param redirectEntryId string IF not empty, points to an entry ID the should replace this current entry's id.
 * @param rootEntryId string ID of source root entry, used for clipped, skipped and cropped entries that created from another entry (readOnly).
 * @param parentEntryId string ID of source root entry, used for defining entires association.
 * @param operationAttributes array clipping, skipping and cropping attributes that used to create this entry.
 * @param entitledUsersEdit string list of user ids that are entitled to edit the entry (no server enforcement) The difference between entitledUsersEdit and entitledUsersPublish is applicative only.
 * @param entitledUsersPublish string list of user ids that are entitled to publish the entry (no server enforcement) The difference between entitledUsersEdit and entitledUsersPublish is applicative only.
 */
function KalturaBaseEntry(){
	KalturaBaseEntry.super_.call(this);
	this.id = null;
	this.name = null;
	this.description = null;
	this.partnerId = null;
	this.userId = null;
	this.creatorId = null;
	this.tags = null;
	this.adminTags = null;
	this.categories = null;
	this.categoriesIds = null;
	this.status = null;
	this.moderationStatus = null;
	this.moderationCount = null;
	this.type = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.rank = null;
	this.totalRank = null;
	this.votes = null;
	this.groupId = null;
	this.partnerData = null;
	this.downloadUrl = null;
	this.searchText = null;
	this.licenseType = null;
	this.version = null;
	this.thumbnailUrl = null;
	this.accessControlId = null;
	this.startDate = null;
	this.endDate = null;
	this.referenceId = null;
	this.replacingEntryId = null;
	this.replacedEntryId = null;
	this.replacementStatus = null;
	this.partnerSortValue = null;
	this.conversionProfileId = null;
	this.redirectEntryId = null;
	this.rootEntryId = null;
	this.parentEntryId = null;
	this.operationAttributes = null;
	this.entitledUsersEdit = null;
	this.entitledUsersPublish = null;
}
module.exports.KalturaBaseEntry = KalturaBaseEntry;

util.inherits(KalturaBaseEntry, kaltura.KalturaObjectBase);


/**
 */
function KalturaBaseResponseProfile(){
	KalturaBaseResponseProfile.super_.call(this);
}
module.exports.KalturaBaseResponseProfile = KalturaBaseResponseProfile;

util.inherits(KalturaBaseResponseProfile, kaltura.KalturaObjectBase);


/**
 * @param id string  (readOnly).
 * @param feedUrl string  (readOnly).
 * @param partnerId int  (readOnly).
 * @param playlistId string link a playlist that will set what content the feed will include
 * if empty, all content will be included in feed.
 * @param name string feed name.
 * @param status int feed status (readOnly).
 * @param type int feed type (insertOnly).
 * @param landingPage string Base URL for each video, on the partners site
 * This is required by all syndication types.
 * @param createdAt int Creation date as Unix timestamp (In seconds) (readOnly).
 * @param allowEmbed bool allow_embed tells google OR yahoo weather to allow embedding the video on google OR yahoo video results
 * or just to provide a link to the landing page.
 * it is applied on the video-player_loc property in the XML (google)
 * and addes media-player tag (yahoo).
 * @param playerUiconfId int Select a uiconf ID as player skin to include in the kwidget url.
 * @param flavorParamId int .
 * @param transcodeExistingContent bool .
 * @param addToDefaultConversionProfile bool .
 * @param categories string .
 * @param storageId int .
 * @param entriesOrderBy string .
 * @param enforceEntitlement bool Should enforce entitlement on feed entries.
 * @param privacyContext string Set privacy context for search entries that assiged to private and public categories within a category privacy context.
 * @param updatedAt int Update date as Unix timestamp (In seconds) (readOnly).
 */
function KalturaBaseSyndicationFeed(){
	KalturaBaseSyndicationFeed.super_.call(this);
	this.id = null;
	this.feedUrl = null;
	this.partnerId = null;
	this.playlistId = null;
	this.name = null;
	this.status = null;
	this.type = null;
	this.landingPage = null;
	this.createdAt = null;
	this.allowEmbed = null;
	this.playerUiconfId = null;
	this.flavorParamId = null;
	this.transcodeExistingContent = null;
	this.addToDefaultConversionProfile = null;
	this.categories = null;
	this.storageId = null;
	this.entriesOrderBy = null;
	this.enforceEntitlement = null;
	this.privacyContext = null;
	this.updatedAt = null;
}
module.exports.KalturaBaseSyndicationFeed = KalturaBaseSyndicationFeed;

util.inherits(KalturaBaseSyndicationFeed, kaltura.KalturaObjectBase);


/**
 * @param schedulerId int .
 * @param workerId int .
 * @param batchIndex int .
 * @param timeStamp int .
 * @param message string .
 * @param errType int .
 * @param errNumber int .
 * @param hostName string .
 * @param sessionId string .
 */
function KalturaBatchHistoryData(){
	KalturaBatchHistoryData.super_.call(this);
	this.schedulerId = null;
	this.workerId = null;
	this.batchIndex = null;
	this.timeStamp = null;
	this.message = null;
	this.errType = null;
	this.errNumber = null;
	this.hostName = null;
	this.sessionId = null;
}
module.exports.KalturaBatchHistoryData = KalturaBatchHistoryData;

util.inherits(KalturaBatchHistoryData, kaltura.KalturaObjectBase);


/**
 */
function KalturaJobData(){
	KalturaJobData.super_.call(this);
}
module.exports.KalturaJobData = KalturaJobData;

util.inherits(KalturaJobData, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param partnerId int  (readOnly).
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param deletedAt int  (readOnly).
 * @param lockExpiration int  (readOnly).
 * @param executionAttempts int  (readOnly).
 * @param lockVersion int  (readOnly).
 * @param entryId string .
 * @param entryName string .
 * @param jobType string  (readOnly).
 * @param jobSubType int .
 * @param data KalturaJobData .
 * @param status int .
 * @param abort int .
 * @param checkAgainTimeout int .
 * @param message string .
 * @param description string .
 * @param priority int .
 * @param history array .
 * @param bulkJobId int The id of the bulk upload job that initiated this job.
 * @param batchVersion int .
 * @param parentJobId int When one job creates another - the parent should set this parentJobId to be its own id.
 * @param rootJobId int The id of the root parent job.
 * @param queueTime int The time that the job was pulled from the queue.
 * @param finishTime int The time that the job was finished or closed as failed.
 * @param errType int .
 * @param errNumber int .
 * @param estimatedEffort int .
 * @param urgency int .
 * @param schedulerId int .
 * @param workerId int .
 * @param batchIndex int .
 * @param lastSchedulerId int .
 * @param lastWorkerId int .
 * @param dc int .
 * @param jobObjectId string .
 * @param jobObjectType int .
 */
function KalturaBatchJob(){
	KalturaBatchJob.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.deletedAt = null;
	this.lockExpiration = null;
	this.executionAttempts = null;
	this.lockVersion = null;
	this.entryId = null;
	this.entryName = null;
	this.jobType = null;
	this.jobSubType = null;
	this.data = null;
	this.status = null;
	this.abort = null;
	this.checkAgainTimeout = null;
	this.message = null;
	this.description = null;
	this.priority = null;
	this.history = null;
	this.bulkJobId = null;
	this.batchVersion = null;
	this.parentJobId = null;
	this.rootJobId = null;
	this.queueTime = null;
	this.finishTime = null;
	this.errType = null;
	this.errNumber = null;
	this.estimatedEffort = null;
	this.urgency = null;
	this.schedulerId = null;
	this.workerId = null;
	this.batchIndex = null;
	this.lastSchedulerId = null;
	this.lastWorkerId = null;
	this.dc = null;
	this.jobObjectId = null;
	this.jobObjectType = null;
}
module.exports.KalturaBatchJob = KalturaBatchJob;

util.inherits(KalturaBatchJob, kaltura.KalturaObjectBase);


/**
 */
function KalturaBulkServiceData(){
	KalturaBulkServiceData.super_.call(this);
}
module.exports.KalturaBulkServiceData = KalturaBulkServiceData;

util.inherits(KalturaBulkServiceData, kaltura.KalturaObjectBase);


/**
 * @param field string .
 * @param value string .
 */
function KalturaBulkUploadPluginData(){
	KalturaBulkUploadPluginData.super_.call(this);
	this.field = null;
	this.value = null;
}
module.exports.KalturaBulkUploadPluginData = KalturaBulkUploadPluginData;

util.inherits(KalturaBulkUploadPluginData, kaltura.KalturaObjectBase);


/**
 * @param id int The id of the result (readOnly).
 * @param bulkUploadJobId int The id of the parent job.
 * @param lineIndex int The index of the line in the CSV.
 * @param partnerId int .
 * @param status string .
 * @param action string .
 * @param objectId string .
 * @param objectStatus int .
 * @param bulkUploadResultObjectType string .
 * @param rowData string The data as recieved in the csv.
 * @param partnerData string .
 * @param objectErrorDescription string .
 * @param pluginsData array .
 * @param errorDescription string .
 * @param errorCode string .
 * @param errorType int .
 */
function KalturaBulkUploadResult(){
	KalturaBulkUploadResult.super_.call(this);
	this.id = null;
	this.bulkUploadJobId = null;
	this.lineIndex = null;
	this.partnerId = null;
	this.status = null;
	this.action = null;
	this.objectId = null;
	this.objectStatus = null;
	this.bulkUploadResultObjectType = null;
	this.rowData = null;
	this.partnerData = null;
	this.objectErrorDescription = null;
	this.pluginsData = null;
	this.errorDescription = null;
	this.errorCode = null;
	this.errorType = null;
}
module.exports.KalturaBulkUploadResult = KalturaBulkUploadResult;

util.inherits(KalturaBulkUploadResult, kaltura.KalturaObjectBase);


/**
 * @param id int .
 * @param uploadedBy string .
 * @param uploadedByUserId string .
 * @param uploadedOn int .
 * @param numOfEntries int .
 * @param status int .
 * @param logFileUrl string .
 * @param csvFileUrl string .
 * @param bulkFileUrl string .
 * @param bulkUploadType string .
 * @param results array .
 * @param error string .
 * @param errorType int .
 * @param errorNumber int .
 * @param fileName string .
 * @param description string .
 * @param numOfObjects int .
 * @param bulkUploadObjectType string .
 */
function KalturaBulkUpload(){
	KalturaBulkUpload.super_.call(this);
	this.id = null;
	this.uploadedBy = null;
	this.uploadedByUserId = null;
	this.uploadedOn = null;
	this.numOfEntries = null;
	this.status = null;
	this.logFileUrl = null;
	this.csvFileUrl = null;
	this.bulkFileUrl = null;
	this.bulkUploadType = null;
	this.results = null;
	this.error = null;
	this.errorType = null;
	this.errorNumber = null;
	this.fileName = null;
	this.description = null;
	this.numOfObjects = null;
	this.bulkUploadObjectType = null;
}
module.exports.KalturaBulkUpload = KalturaBulkUpload;

util.inherits(KalturaBulkUpload, kaltura.KalturaObjectBase);


/**
 */
function KalturaBulkUploadObjectData(){
	KalturaBulkUploadObjectData.super_.call(this);
}
module.exports.KalturaBulkUploadObjectData = KalturaBulkUploadObjectData;

util.inherits(KalturaBulkUploadObjectData, kaltura.KalturaObjectBase);


/**
 * @param id string .
 * @param businessProcessId string .
 * @param businessProcessStartNotificationTemplateId int .
 * @param suspended bool .
 * @param activityId string .
 */
function KalturaBusinessProcessCase(){
	KalturaBusinessProcessCase.super_.call(this);
	this.id = null;
	this.businessProcessId = null;
	this.businessProcessStartNotificationTemplateId = null;
	this.suspended = null;
	this.activityId = null;
}
module.exports.KalturaBusinessProcessCase = KalturaBusinessProcessCase;

util.inherits(KalturaBusinessProcessCase, kaltura.KalturaObjectBase);


/**
 * @param id int Auto generated identifier (readOnly).
 * @param createdAt int Server creation date as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Server update date as Unix timestamp (In seconds) (readOnly).
 * @param partnerId int  (readOnly).
 * @param name string .
 * @param systemName string .
 * @param description string .
 * @param status string  (readOnly).
 * @param type string The type of the server, this is auto filled by the derived server object (readOnly).
 */
function KalturaBusinessProcessServer(){
	KalturaBusinessProcessServer.super_.call(this);
	this.id = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.partnerId = null;
	this.name = null;
	this.systemName = null;
	this.description = null;
	this.status = null;
	this.type = null;
}
module.exports.KalturaBusinessProcessServer = KalturaBusinessProcessServer;

util.inherits(KalturaBusinessProcessServer, kaltura.KalturaObjectBase);


/**
 * @param id string  (readOnly).
 * @param partnerId int .
 * @param browser string .
 * @param serverIp string .
 * @param serverOs string .
 * @param phpVersion string .
 * @param ceAdminEmail string .
 * @param type string .
 * @param description string .
 * @param data string .
 */
function KalturaCEError(){
	KalturaCEError.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.browser = null;
	this.serverIp = null;
	this.serverOs = null;
	this.phpVersion = null;
	this.ceAdminEmail = null;
	this.type = null;
	this.description = null;
	this.data = null;
}
module.exports.KalturaCEError = KalturaCEError;

util.inherits(KalturaCEError, kaltura.KalturaObjectBase);


/**
 * @param captionParamsId int The Caption Params used to create this Caption Asset (insertOnly).
 * @param language string The language of the caption asset content.
 * @param languageCode string The language of the caption asset content (readOnly).
 * @param isDefault int Is default caption asset of the entry.
 * @param label string Friendly label.
 * @param format string The caption format (insertOnly).
 * @param status int The status of the asset (readOnly).
 */
function KalturaCaptionAsset(){
	KalturaCaptionAsset.super_.call(this);
	this.captionParamsId = null;
	this.language = null;
	this.languageCode = null;
	this.isDefault = null;
	this.label = null;
	this.format = null;
	this.status = null;
}
module.exports.KalturaCaptionAsset = KalturaCaptionAsset;

util.inherits(KalturaCaptionAsset, KalturaAsset);


/**
 * @param asset KalturaCaptionAsset The Caption Asset object.
 * @param entry KalturaBaseEntry The entry object.
 * @param startTime int .
 * @param endTime int .
 * @param content string .
 */
function KalturaCaptionAssetItem(){
	KalturaCaptionAssetItem.super_.call(this);
	this.asset = null;
	this.entry = null;
	this.startTime = null;
	this.endTime = null;
	this.content = null;
}
module.exports.KalturaCaptionAssetItem = KalturaCaptionAssetItem;

util.inherits(KalturaCaptionAssetItem, kaltura.KalturaObjectBase);


/**
 * @param language string The language of the caption content (insertOnly).
 * @param isDefault int Is default caption asset of the entry.
 * @param label string Friendly label.
 * @param format string The caption format (insertOnly).
 * @param sourceParamsId int Id of the caption params or the flavor params to be used as source for the caption creation.
 */
function KalturaCaptionParams(){
	KalturaCaptionParams.super_.call(this);
	this.language = null;
	this.isDefault = null;
	this.label = null;
	this.format = null;
	this.sourceParamsId = null;
}
module.exports.KalturaCaptionParams = KalturaCaptionParams;

util.inherits(KalturaCaptionParams, KalturaAssetParams);


/**
 * @param id int The id of the Category (readOnly).
 * @param parentId int .
 * @param depth int  (readOnly).
 * @param partnerId int  (readOnly).
 * @param name string The name of the Category.
 * The following characters are not allowed: '<', '>', ','.
 * @param fullName string The full name of the Category (readOnly).
 * @param fullIds string The full ids of the Category (readOnly).
 * @param entriesCount int Number of entries in this Category (including child categories) (readOnly).
 * @param createdAt int Creation date as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Update date as Unix timestamp (In seconds) (readOnly).
 * @param description string Category description.
 * @param tags string Category tags.
 * @param appearInList int If category will be returned for list action.
 * @param privacy int defines the privacy of the entries that assigned to this category.
 * @param inheritanceType int If Category members are inherited from parent category or set manualy.
 * @param userJoinPolicy int Who can ask to join this category (readOnly).
 * @param defaultPermissionLevel int Default permissionLevel for new users.
 * @param owner string Category Owner (User id).
 * @param directEntriesCount int Number of entries that belong to this category directly (readOnly).
 * @param referenceId string Category external id, controlled and managed by the partner.
 * @param contributionPolicy int who can assign entries to this category.
 * @param membersCount int Number of active members for this category (readOnly).
 * @param pendingMembersCount int Number of pending members for this category (readOnly).
 * @param privacyContext string Set privacy context for search entries that assiged to private and public categories. the entries will be private if the search context is set with those categories.
 * @param privacyContexts string comma separated parents that defines a privacyContext for search (readOnly).
 * @param status int Status (readOnly).
 * @param inheritedParentId int The category id that this category inherit its members and members permission (for contribution and join) (readOnly).
 * @param partnerSortValue int Can be used to store various partner related data as a numeric value.
 * @param partnerData string Can be used to store various partner related data as a string.
 * @param defaultOrderBy string Enable client side applications to define how to sort the category child categories.
 * @param directSubCategoriesCount int Number of direct children categories (readOnly).
 * @param moderation int Moderation to add entries to this category by users that are not of permission level Manager or Moderator.
 * @param pendingEntriesCount int Nunber of pending moderation entries (readOnly).
 */
function KalturaCategory(){
	KalturaCategory.super_.call(this);
	this.id = null;
	this.parentId = null;
	this.depth = null;
	this.partnerId = null;
	this.name = null;
	this.fullName = null;
	this.fullIds = null;
	this.entriesCount = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.description = null;
	this.tags = null;
	this.appearInList = null;
	this.privacy = null;
	this.inheritanceType = null;
	this.userJoinPolicy = null;
	this.defaultPermissionLevel = null;
	this.owner = null;
	this.directEntriesCount = null;
	this.referenceId = null;
	this.contributionPolicy = null;
	this.membersCount = null;
	this.pendingMembersCount = null;
	this.privacyContext = null;
	this.privacyContexts = null;
	this.status = null;
	this.inheritedParentId = null;
	this.partnerSortValue = null;
	this.partnerData = null;
	this.defaultOrderBy = null;
	this.directSubCategoriesCount = null;
	this.moderation = null;
	this.pendingEntriesCount = null;
}
module.exports.KalturaCategory = KalturaCategory;

util.inherits(KalturaCategory, kaltura.KalturaObjectBase);


/**
 * @param categoryId int .
 * @param entryId string entry id.
 * @param createdAt int Creation date as Unix timestamp (In seconds) (readOnly).
 * @param categoryFullIds string The full ids of the Category (readOnly).
 * @param status int CategroyEntry status (readOnly).
 */
function KalturaCategoryEntry(){
	KalturaCategoryEntry.super_.call(this);
	this.categoryId = null;
	this.entryId = null;
	this.createdAt = null;
	this.categoryFullIds = null;
	this.status = null;
}
module.exports.KalturaCategoryEntry = KalturaCategoryEntry;

util.inherits(KalturaCategoryEntry, kaltura.KalturaObjectBase);


/**
 * @param categoryId int  (insertOnly).
 * @param userId string User id (insertOnly).
 * @param partnerId int Partner id (readOnly).
 * @param permissionLevel int Permission level.
 * @param status int Status (readOnly).
 * @param createdAt int CategoryUser creation date as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int CategoryUser update date as Unix timestamp (In seconds) (readOnly).
 * @param updateMethod int Update method can be either manual or automatic to distinguish between manual operations (for example in KMC) on automatic - using bulk upload.
 * @param categoryFullIds string The full ids of the Category (readOnly).
 * @param permissionNames string Set of category-related permissions for the current category user.
 */
function KalturaCategoryUser(){
	KalturaCategoryUser.super_.call(this);
	this.categoryId = null;
	this.userId = null;
	this.partnerId = null;
	this.permissionLevel = null;
	this.status = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.updateMethod = null;
	this.categoryFullIds = null;
	this.permissionNames = null;
}
module.exports.KalturaCategoryUser = KalturaCategoryUser;

util.inherits(KalturaCategoryUser, kaltura.KalturaObjectBase);


/**
 * @param clientTag string .
 * @param apiVersion string .
 */
function KalturaClientConfiguration(){
	KalturaClientConfiguration.super_.call(this);
	this.clientTag = null;
	this.apiVersion = null;
}
module.exports.KalturaClientConfiguration = KalturaClientConfiguration;

util.inherits(KalturaClientConfiguration, kaltura.KalturaObjectBase);


/**
 * @param url string The URL where the notification should be sent to.
 * @param data string The serialized notification data to send.
 */
function KalturaClientNotification(){
	KalturaClientNotification.super_.call(this);
	this.url = null;
	this.data = null;
}
module.exports.KalturaClientNotification = KalturaClientNotification;

util.inherits(KalturaClientNotification, kaltura.KalturaObjectBase);


/**
 */
function KalturaContext(){
	KalturaContext.super_.call(this);
}
module.exports.KalturaContext = KalturaContext;

util.inherits(KalturaContext, kaltura.KalturaObjectBase);


/**
 * @param messages array Array of messages as received from the rules that invalidated.
 * @param actions array Array of actions as received from the rules that invalidated.
 */
function KalturaContextDataResult(){
	KalturaContextDataResult.super_.call(this);
	this.messages = null;
	this.actions = null;
}
module.exports.KalturaContextDataResult = KalturaContextDataResult;

util.inherits(KalturaContextDataResult, kaltura.KalturaObjectBase);


/**
 * @param id int The id of the Category (readOnly).
 * @param createdAt int Creation date as Unix timestamp (In seconds) (readOnly).
 * @param createdBy string Creator name.
 * @param updatedAt int Update date as Unix timestamp (In seconds) (readOnly).
 * @param updatedBy string Updater name.
 * @param createdById int Creator id.
 * @param schedulerId int The id of the scheduler that the command refers to.
 * @param workerId int The id of the scheduler worker that the command refers to.
 * @param workerConfiguredId int The id of the scheduler worker as configured in the ini file.
 * @param workerName int The name of the scheduler worker that the command refers to.
 * @param batchIndex int The index of the batch process that the command refers to.
 * @param type int The command type - stop / start / config.
 * @param targetType int The command target type - data center / scheduler / job / job type.
 * @param status int The command status.
 * @param cause string The reason for the command.
 * @param description string Command description.
 * @param errorDescription string Error description.
 */
function KalturaControlPanelCommand(){
	KalturaControlPanelCommand.super_.call(this);
	this.id = null;
	this.createdAt = null;
	this.createdBy = null;
	this.updatedAt = null;
	this.updatedBy = null;
	this.createdById = null;
	this.schedulerId = null;
	this.workerId = null;
	this.workerConfiguredId = null;
	this.workerName = null;
	this.batchIndex = null;
	this.type = null;
	this.targetType = null;
	this.status = null;
	this.cause = null;
	this.description = null;
	this.errorDescription = null;
}
module.exports.KalturaControlPanelCommand = KalturaControlPanelCommand;

util.inherits(KalturaControlPanelCommand, kaltura.KalturaObjectBase);


/**
 * @param flavorParamsId int The id of the flavor params, set to null for source flavor.
 * @param name string Attribute name.
 * @param value string Attribute value.
 */
function KalturaConversionAttribute(){
	KalturaConversionAttribute.super_.call(this);
	this.flavorParamsId = null;
	this.name = null;
	this.value = null;
}
module.exports.KalturaConversionAttribute = KalturaConversionAttribute;

util.inherits(KalturaConversionAttribute, kaltura.KalturaObjectBase);


/**
 * @param left int Crop left point.
 * @param top int Crop top point.
 * @param width int Crop width.
 * @param height int Crop height.
 */
function KalturaCropDimensions(){
	KalturaCropDimensions.super_.call(this);
	this.left = null;
	this.top = null;
	this.width = null;
	this.height = null;
}
module.exports.KalturaCropDimensions = KalturaCropDimensions;

util.inherits(KalturaCropDimensions, kaltura.KalturaObjectBase);


/**
 * @param id int The id of the Conversion Profile (readOnly).
 * @param partnerId int  (readOnly).
 * @param status string .
 * @param type string  (insertOnly).
 * @param name string The name of the Conversion Profile.
 * @param systemName string System name of the Conversion Profile.
 * @param tags string Comma separated tags.
 * @param description string The description of the Conversion Profile.
 * @param defaultEntryId string ID of the default entry to be used for template data.
 * @param createdAt int Creation date as Unix timestamp (In seconds) (readOnly).
 * @param flavorParamsIds string List of included flavor ids (comma separated).
 * @param isDefault int Indicates that this conversion profile is system default.
 * @param isPartnerDefault bool Indicates that this conversion profile is partner default (readOnly).
 * @param cropDimensions KalturaCropDimensions Cropping dimensions.
 * @param clipStart int Clipping start position (in miliseconds).
 * @param clipDuration int Clipping duration (in miliseconds).
 * @param xslTransformation string XSL to transform ingestion MRSS XML.
 * @param storageProfileId int ID of default storage profile to be used for linked net-storage file syncs.
 * @param mediaParserType string Media parser type to be used for extract media.
 */
function KalturaConversionProfile(){
	KalturaConversionProfile.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.status = null;
	this.type = null;
	this.name = null;
	this.systemName = null;
	this.tags = null;
	this.description = null;
	this.defaultEntryId = null;
	this.createdAt = null;
	this.flavorParamsIds = null;
	this.isDefault = null;
	this.isPartnerDefault = null;
	this.cropDimensions = null;
	this.clipStart = null;
	this.clipDuration = null;
	this.xslTransformation = null;
	this.storageProfileId = null;
	this.mediaParserType = null;
}
module.exports.KalturaConversionProfile = KalturaConversionProfile;

util.inherits(KalturaConversionProfile, kaltura.KalturaObjectBase);


/**
 * @param conversionProfileId int The id of the conversion profile (readOnly).
 * @param assetParamsId int The id of the asset params (readOnly).
 * @param readyBehavior int The ingestion origin of the asset params.
 * @param origin int The ingestion origin of the asset params.
 * @param systemName string Asset params system name.
 * @param forceNoneComplied int Starts conversion even if the decision layer reduced the configuration to comply with the source.
 * @param deletePolicy int Specifies how to treat the flavor after conversion is finished.
 */
function KalturaConversionProfileAssetParams(){
	KalturaConversionProfileAssetParams.super_.call(this);
	this.conversionProfileId = null;
	this.assetParamsId = null;
	this.readyBehavior = null;
	this.origin = null;
	this.systemName = null;
	this.forceNoneComplied = null;
	this.deletePolicy = null;
}
module.exports.KalturaConversionProfileAssetParams = KalturaConversionProfileAssetParams;

util.inherits(KalturaConversionProfileAssetParams, kaltura.KalturaObjectBase);


/**
 * @param flavorAssetId string .
 * @param flavorParamsOutputId int .
 * @param readyBehavior int .
 * @param videoBitrate int .
 * @param audioBitrate int .
 * @param destFileSyncLocalPath string .
 * @param destFileSyncRemoteUrl string .
 */
function KalturaConvertCollectionFlavorData(){
	KalturaConvertCollectionFlavorData.super_.call(this);
	this.flavorAssetId = null;
	this.flavorParamsOutputId = null;
	this.readyBehavior = null;
	this.videoBitrate = null;
	this.audioBitrate = null;
	this.destFileSyncLocalPath = null;
	this.destFileSyncRemoteUrl = null;
}
module.exports.KalturaConvertCollectionFlavorData = KalturaConvertCollectionFlavorData;

util.inherits(KalturaConvertCollectionFlavorData, kaltura.KalturaObjectBase);


/**
 * @param latitude float .
 * @param longitude float .
 * @param name string .
 */
function KalturaCoordinate(){
	KalturaCoordinate.super_.call(this);
	this.latitude = null;
	this.longitude = null;
	this.name = null;
}
module.exports.KalturaCoordinate = KalturaCoordinate;

util.inherits(KalturaCoordinate, kaltura.KalturaObjectBase);


/**
 * @param dataContent string The data of the entry.
 * @param retrieveDataContentByGet bool indicator whether to return the object for get action with the dataContent field (insertOnly).
 */
function KalturaDataEntry(){
	KalturaDataEntry.super_.call(this);
	this.dataContent = null;
	this.retrieveDataContentByGet = null;
}
module.exports.KalturaDataEntry = KalturaDataEntry;

util.inherits(KalturaDataEntry, KalturaBaseEntry);


/**
 * @param hosts string The hosts that are recognized.
 * @param uriPrefix string The URI prefix we use for security.
 */
function KalturaUrlRecognizer(){
	KalturaUrlRecognizer.super_.call(this);
	this.hosts = null;
	this.uriPrefix = null;
}
module.exports.KalturaUrlRecognizer = KalturaUrlRecognizer;

util.inherits(KalturaUrlRecognizer, kaltura.KalturaObjectBase);


/**
 * @param window int Window.
 * @param key string key.
 */
function KalturaUrlTokenizer(){
	KalturaUrlTokenizer.super_.call(this);
	this.window = null;
	this.key = null;
}
module.exports.KalturaUrlTokenizer = KalturaUrlTokenizer;

util.inherits(KalturaUrlTokenizer, kaltura.KalturaObjectBase);


/**
 * @param id int The id of the Delivery (readOnly).
 * @param partnerId int  (readOnly).
 * @param name string The name of the Delivery.
 * @param type string Delivery type.
 * @param systemName string System name of the delivery.
 * @param description string The description of the Delivery.
 * @param createdAt int Creation time as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Update time as Unix timestamp (In seconds) (readOnly).
 * @param streamerType string .
 * @param url string .
 * @param hostName string the host part of the url (readOnly).
 * @param status int .
 * @param recognizer KalturaUrlRecognizer .
 * @param tokenizer KalturaUrlTokenizer .
 * @param isDefault int True if this is the systemwide default for the protocol (readOnly).
 * @param parentId int the object from which this object was cloned (or 0) (readOnly).
 * @param mediaProtocols string Comma separated list of supported media protocols. f.i. rtmpe.
 * @param priority int priority used for ordering similar delivery profiles.
 */
function KalturaDeliveryProfile(){
	KalturaDeliveryProfile.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.name = null;
	this.type = null;
	this.systemName = null;
	this.description = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.streamerType = null;
	this.url = null;
	this.hostName = null;
	this.status = null;
	this.recognizer = null;
	this.tokenizer = null;
	this.isDefault = null;
	this.parentId = null;
	this.mediaProtocols = null;
	this.priority = null;
}
module.exports.KalturaDeliveryProfile = KalturaDeliveryProfile;

util.inherits(KalturaDeliveryProfile, kaltura.KalturaObjectBase);


/**
 * @param fileSyncLocalPath string .
 * @param fileSyncRemoteUrl string The translated path as used by the scheduler.
 * @param fileSyncObjectSubType int .
 */
function KalturaFileSyncDescriptor(){
	KalturaFileSyncDescriptor.super_.call(this);
	this.fileSyncLocalPath = null;
	this.fileSyncRemoteUrl = null;
	this.fileSyncObjectSubType = null;
}
module.exports.KalturaFileSyncDescriptor = KalturaFileSyncDescriptor;

util.inherits(KalturaFileSyncDescriptor, kaltura.KalturaObjectBase);


/**
 */
function KalturaDestFileSyncDescriptor(){
	KalturaDestFileSyncDescriptor.super_.call(this);
}
module.exports.KalturaDestFileSyncDescriptor = KalturaDestFileSyncDescriptor;

util.inherits(KalturaDestFileSyncDescriptor, KalturaFileSyncDescriptor);


/**
 */
function KalturaSearchItem(){
	KalturaSearchItem.super_.call(this);
}
module.exports.KalturaSearchItem = KalturaSearchItem;

util.inherits(KalturaSearchItem, kaltura.KalturaObjectBase);


/**
 * @param orderBy string .
 * @param advancedSearch KalturaSearchItem .
 */
function KalturaFilter(){
	KalturaFilter.super_.call(this);
	this.orderBy = null;
	this.advancedSearch = null;
}
module.exports.KalturaFilter = KalturaFilter;

util.inherits(KalturaFilter, kaltura.KalturaObjectBase);


/**
 */
function KalturaRelatedFilter(){
	KalturaRelatedFilter.super_.call(this);
}
module.exports.KalturaRelatedFilter = KalturaRelatedFilter;

util.inherits(KalturaRelatedFilter, KalturaFilter);


/**
 * @param pageSize int The number of objects to retrieve. (Default is 30, maximum page size is 500).
 * @param pageIndex int The page number for which {pageSize} of objects should be retrieved (Default is 1).
 */
function KalturaFilterPager(){
	KalturaFilterPager.super_.call(this);
	this.pageSize = null;
	this.pageIndex = null;
}
module.exports.KalturaFilterPager = KalturaFilterPager;

util.inherits(KalturaFilterPager, kaltura.KalturaObjectBase);


/**
 * @param parentProperty string .
 * @param filterProperty string .
 * @param allowNull bool .
 */
function KalturaResponseProfileMapping(){
	KalturaResponseProfileMapping.super_.call(this);
	this.parentProperty = null;
	this.filterProperty = null;
	this.allowNull = null;
}
module.exports.KalturaResponseProfileMapping = KalturaResponseProfileMapping;

util.inherits(KalturaResponseProfileMapping, kaltura.KalturaObjectBase);


/**
 * @param name string Friendly name.
 * @param type int .
 * @param fields string Comma separated fields list to be included or excluded.
 * @param filter KalturaRelatedFilter .
 * @param pager KalturaFilterPager .
 * @param relatedProfiles array .
 * @param mappings array .
 */
function KalturaDetachedResponseProfile(){
	KalturaDetachedResponseProfile.super_.call(this);
	this.name = null;
	this.type = null;
	this.fields = null;
	this.filter = null;
	this.pager = null;
	this.relatedProfiles = null;
	this.mappings = null;
}
module.exports.KalturaDetachedResponseProfile = KalturaDetachedResponseProfile;

util.inherits(KalturaDetachedResponseProfile, KalturaBaseResponseProfile);


/**
 * @param fieldName string A value taken from a connector field enum which associates the current configuration to that connector field
 * Field enum class should be returned by the provider's getFieldEnumClass function.
 * @param userFriendlyFieldName string A string that will be shown to the user as the field name in error messages related to the current field.
 * @param entryMrssXslt string An XSLT string that extracts the right value from the Kaltura entry MRSS XML.
 * The value of the current connector field will be the one that is returned from transforming the Kaltura entry MRSS XML using this XSLT string.
 * @param isRequired int Is the field required to have a value for submission ?.
 * @param updateOnChange bool Trigger distribution update when this field changes or not ?.
 * @param updateParams array Entry column or metadata xpath that should trigger an update.
 * @param isDefault bool Is this field config is the default for the distribution provider? (readOnly).
 */
function KalturaDistributionFieldConfig(){
	KalturaDistributionFieldConfig.super_.call(this);
	this.fieldName = null;
	this.userFriendlyFieldName = null;
	this.entryMrssXslt = null;
	this.isRequired = null;
	this.updateOnChange = null;
	this.updateParams = null;
	this.isDefault = null;
}
module.exports.KalturaDistributionFieldConfig = KalturaDistributionFieldConfig;

util.inherits(KalturaDistributionFieldConfig, kaltura.KalturaObjectBase);


/**
 */
function KalturaDistributionJobProviderData(){
	KalturaDistributionJobProviderData.super_.call(this);
}
module.exports.KalturaDistributionJobProviderData = KalturaDistributionJobProviderData;

util.inherits(KalturaDistributionJobProviderData, kaltura.KalturaObjectBase);


/**
 * @param width int .
 * @param height int .
 */
function KalturaDistributionThumbDimensions(){
	KalturaDistributionThumbDimensions.super_.call(this);
	this.width = null;
	this.height = null;
}
module.exports.KalturaDistributionThumbDimensions = KalturaDistributionThumbDimensions;

util.inherits(KalturaDistributionThumbDimensions, kaltura.KalturaObjectBase);


/**
 * @param id int Auto generated unique id (readOnly).
 * @param createdAt int Profile creation date as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Profile last update date as Unix timestamp (In seconds) (readOnly).
 * @param partnerId int  (readOnly).
 * @param providerType string  (insertOnly).
 * @param name string .
 * @param status int .
 * @param submitEnabled int .
 * @param updateEnabled int .
 * @param deleteEnabled int .
 * @param reportEnabled int .
 * @param autoCreateFlavors string Comma separated flavor params ids that should be auto converted.
 * @param autoCreateThumb string Comma separated thumbnail params ids that should be auto generated.
 * @param optionalFlavorParamsIds string Comma separated flavor params ids that should be submitted if ready.
 * @param requiredFlavorParamsIds string Comma separated flavor params ids that required to be ready before submission.
 * @param optionalThumbDimensions array Thumbnail dimensions that should be submitted if ready.
 * @param requiredThumbDimensions array Thumbnail dimensions that required to be readt before submission.
 * @param optionalAssetDistributionRules array Asset Distribution Rules for assets that should be submitted if ready.
 * @param requiredAssetDistributionRules array Assets Asset Distribution Rules for assets that are required to be ready before submission.
 * @param sunriseDefaultOffset int If entry distribution sunrise not specified that will be the default since entry creation time, in seconds.
 * @param sunsetDefaultOffset int If entry distribution sunset not specified that will be the default since entry creation time, in seconds.
 * @param recommendedStorageProfileForDownload int The best external storage to be used to download the asset files from.
 * @param recommendedDcForDownload int The best Kaltura data center to be used to download the asset files to.
 * @param recommendedDcForExecute int The best Kaltura data center to be used to execute the distribution job.
 */
function KalturaDistributionProfile(){
	KalturaDistributionProfile.super_.call(this);
	this.id = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.partnerId = null;
	this.providerType = null;
	this.name = null;
	this.status = null;
	this.submitEnabled = null;
	this.updateEnabled = null;
	this.deleteEnabled = null;
	this.reportEnabled = null;
	this.autoCreateFlavors = null;
	this.autoCreateThumb = null;
	this.optionalFlavorParamsIds = null;
	this.requiredFlavorParamsIds = null;
	this.optionalThumbDimensions = null;
	this.requiredThumbDimensions = null;
	this.optionalAssetDistributionRules = null;
	this.requiredAssetDistributionRules = null;
	this.sunriseDefaultOffset = null;
	this.sunsetDefaultOffset = null;
	this.recommendedStorageProfileForDownload = null;
	this.recommendedDcForDownload = null;
	this.recommendedDcForExecute = null;
}
module.exports.KalturaDistributionProfile = KalturaDistributionProfile;

util.inherits(KalturaDistributionProfile, kaltura.KalturaObjectBase);


/**
 * @param type string  (readOnly).
 * @param name string .
 * @param scheduleUpdateEnabled bool .
 * @param availabilityUpdateEnabled bool .
 * @param deleteInsteadUpdate bool .
 * @param intervalBeforeSunrise int .
 * @param intervalBeforeSunset int .
 * @param updateRequiredEntryFields string .
 * @param updateRequiredMetadataXPaths string .
 */
function KalturaDistributionProvider(){
	KalturaDistributionProvider.super_.call(this);
	this.type = null;
	this.name = null;
	this.scheduleUpdateEnabled = null;
	this.availabilityUpdateEnabled = null;
	this.deleteInsteadUpdate = null;
	this.intervalBeforeSunrise = null;
	this.intervalBeforeSunset = null;
	this.updateRequiredEntryFields = null;
	this.updateRequiredMetadataXPaths = null;
}
module.exports.KalturaDistributionProvider = KalturaDistributionProvider;

util.inherits(KalturaDistributionProvider, kaltura.KalturaObjectBase);


/**
 * @param version string .
 * @param assetId string .
 * @param remoteId string .
 */
function KalturaDistributionRemoteMediaFile(){
	KalturaDistributionRemoteMediaFile.super_.call(this);
	this.version = null;
	this.assetId = null;
	this.remoteId = null;
}
module.exports.KalturaDistributionRemoteMediaFile = KalturaDistributionRemoteMediaFile;

util.inherits(KalturaDistributionRemoteMediaFile, kaltura.KalturaObjectBase);


/**
 * @param action int .
 * @param errorType int .
 * @param description string .
 */
function KalturaDistributionValidationError(){
	KalturaDistributionValidationError.super_.call(this);
	this.action = null;
	this.errorType = null;
	this.description = null;
}
module.exports.KalturaDistributionValidationError = KalturaDistributionValidationError;

util.inherits(KalturaDistributionValidationError, kaltura.KalturaObjectBase);


/**
 * @param documentType int The type of the document (insertOnly).
 * @param assetParamsIds string Comma separated asset params ids that exists for this media entry (readOnly).
 */
function KalturaDocumentEntry(){
	KalturaDocumentEntry.super_.call(this);
	this.documentType = null;
	this.assetParamsIds = null;
}
module.exports.KalturaDocumentEntry = KalturaDocumentEntry;

util.inherits(KalturaDocumentEntry, KalturaBaseEntry);


/**
 * @param id int  (readOnly).
 * @param partnerId int  (insertOnly).
 * @param name string .
 * @param systemName string .
 * @param description string .
 * @param provider string .
 * @param status int .
 * @param scenario string .
 * @param licenseType string .
 * @param licenseExpirationPolicy int .
 * @param duration int Duration in days the license is effective.
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 */
function KalturaDrmPolicy(){
	KalturaDrmPolicy.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.name = null;
	this.systemName = null;
	this.description = null;
	this.provider = null;
	this.status = null;
	this.scenario = null;
	this.licenseType = null;
	this.licenseExpirationPolicy = null;
	this.duration = null;
	this.createdAt = null;
	this.updatedAt = null;
}
module.exports.KalturaDrmPolicy = KalturaDrmPolicy;

util.inherits(KalturaDrmPolicy, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param partnerId int  (insertOnly).
 * @param name string .
 * @param description string .
 * @param provider string .
 * @param status int .
 * @param licenseServerUrl string .
 * @param defaultPolicy string .
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 */
function KalturaDrmProfile(){
	KalturaDrmProfile.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.name = null;
	this.description = null;
	this.provider = null;
	this.status = null;
	this.licenseServerUrl = null;
	this.defaultPolicy = null;
	this.createdAt = null;
	this.updatedAt = null;
}
module.exports.KalturaDrmProfile = KalturaDrmProfile;

util.inherits(KalturaDrmProfile, kaltura.KalturaObjectBase);


/**
 * @param handlerType string  (readOnly).
 */
function KalturaDropFolderFileHandlerConfig(){
	KalturaDropFolderFileHandlerConfig.super_.call(this);
	this.handlerType = null;
}
module.exports.KalturaDropFolderFileHandlerConfig = KalturaDropFolderFileHandlerConfig;

util.inherits(KalturaDropFolderFileHandlerConfig, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param partnerId int  (insertOnly).
 * @param name string .
 * @param description string .
 * @param type string .
 * @param status int .
 * @param conversionProfileId int .
 * @param dc int .
 * @param path string .
 * @param fileSizeCheckInterval int The ammount of time, in seconds, that should pass so that a file with no change in size we'll be treated as "finished uploading to folder".
 * @param fileDeletePolicy int .
 * @param autoFileDeleteDays int .
 * @param fileHandlerType string .
 * @param fileNamePatterns string .
 * @param fileHandlerConfig KalturaDropFolderFileHandlerConfig .
 * @param tags string .
 * @param errorCode string .
 * @param errorDescription string .
 * @param ignoreFileNamePatterns string .
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param lastAccessedAt int .
 * @param incremental bool .
 * @param lastFileTimestamp int .
 * @param metadataProfileId int .
 * @param categoriesMetadataFieldName string .
 * @param enforceEntitlement bool .
 * @param shouldValidateKS bool .
 */
function KalturaDropFolder(){
	KalturaDropFolder.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.name = null;
	this.description = null;
	this.type = null;
	this.status = null;
	this.conversionProfileId = null;
	this.dc = null;
	this.path = null;
	this.fileSizeCheckInterval = null;
	this.fileDeletePolicy = null;
	this.autoFileDeleteDays = null;
	this.fileHandlerType = null;
	this.fileNamePatterns = null;
	this.fileHandlerConfig = null;
	this.tags = null;
	this.errorCode = null;
	this.errorDescription = null;
	this.ignoreFileNamePatterns = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.lastAccessedAt = null;
	this.incremental = null;
	this.lastFileTimestamp = null;
	this.metadataProfileId = null;
	this.categoriesMetadataFieldName = null;
	this.enforceEntitlement = null;
	this.shouldValidateKS = null;
}
module.exports.KalturaDropFolder = KalturaDropFolder;

util.inherits(KalturaDropFolder, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param partnerId int  (readOnly).
 * @param dropFolderId int  (insertOnly).
 * @param fileName string  (insertOnly).
 * @param fileSize float .
 * @param fileSizeLastSetAt int  (readOnly).
 * @param status int  (readOnly).
 * @param type string  (readOnly).
 * @param parsedSlug string .
 * @param parsedFlavor string .
 * @param parsedUserId string .
 * @param leadDropFolderFileId int .
 * @param deletedDropFolderFileId int .
 * @param entryId string .
 * @param errorCode string .
 * @param errorDescription string .
 * @param lastModificationTime string .
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param uploadStartDetectedAt int .
 * @param uploadEndDetectedAt int .
 * @param importStartedAt int .
 * @param importEndedAt int .
 * @param batchJobId int  (readOnly).
 */
function KalturaDropFolderFile(){
	KalturaDropFolderFile.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.dropFolderId = null;
	this.fileName = null;
	this.fileSize = null;
	this.fileSizeLastSetAt = null;
	this.status = null;
	this.type = null;
	this.parsedSlug = null;
	this.parsedFlavor = null;
	this.parsedUserId = null;
	this.leadDropFolderFileId = null;
	this.deletedDropFolderFileId = null;
	this.entryId = null;
	this.errorCode = null;
	this.errorDescription = null;
	this.lastModificationTime = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.uploadStartDetectedAt = null;
	this.uploadEndDetectedAt = null;
	this.importStartedAt = null;
	this.importEndedAt = null;
	this.batchJobId = null;
}
module.exports.KalturaDropFolderFile = KalturaDropFolderFile;

util.inherits(KalturaDropFolderFile, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param name string .
 * @param description string .
 * @param emailAddress string .
 * @param mailboxId string .
 * @param partnerId int  (readOnly).
 * @param conversionProfile2Id int .
 * @param moderationStatus int .
 * @param status int  (readOnly).
 * @param createdAt string  (readOnly).
 * @param defaultCategory string .
 * @param defaultUserId string .
 * @param defaultTags string .
 * @param defaultAdminTags string .
 * @param maxAttachmentSizeKbytes int .
 * @param maxAttachmentsPerMail int .
 */
function KalturaEmailIngestionProfile(){
	KalturaEmailIngestionProfile.super_.call(this);
	this.id = null;
	this.name = null;
	this.description = null;
	this.emailAddress = null;
	this.mailboxId = null;
	this.partnerId = null;
	this.conversionProfile2Id = null;
	this.moderationStatus = null;
	this.status = null;
	this.createdAt = null;
	this.defaultCategory = null;
	this.defaultUserId = null;
	this.defaultTags = null;
	this.defaultAdminTags = null;
	this.maxAttachmentSizeKbytes = null;
	this.maxAttachmentsPerMail = null;
}
module.exports.KalturaEmailIngestionProfile = KalturaEmailIngestionProfile;

util.inherits(KalturaEmailIngestionProfile, kaltura.KalturaObjectBase);


/**
 * @param description string .
 */
function KalturaValue(){
	KalturaValue.super_.call(this);
	this.description = null;
}
module.exports.KalturaValue = KalturaValue;

util.inherits(KalturaValue, kaltura.KalturaObjectBase);


/**
 * @param value string .
 */
function KalturaStringValue(){
	KalturaStringValue.super_.call(this);
	this.value = null;
}
module.exports.KalturaStringValue = KalturaStringValue;

util.inherits(KalturaStringValue, KalturaValue);


/**
 * @param email KalturaStringValue Recipient e-mail address.
 * @param name KalturaStringValue Recipient name.
 */
function KalturaEmailNotificationRecipient(){
	KalturaEmailNotificationRecipient.super_.call(this);
	this.email = null;
	this.name = null;
}
module.exports.KalturaEmailNotificationRecipient = KalturaEmailNotificationRecipient;

util.inherits(KalturaEmailNotificationRecipient, kaltura.KalturaObjectBase);


/**
 * @param providerType string Provider type of the job data (readOnly).
 */
function KalturaEmailNotificationRecipientJobData(){
	KalturaEmailNotificationRecipientJobData.super_.call(this);
	this.providerType = null;
}
module.exports.KalturaEmailNotificationRecipientJobData = KalturaEmailNotificationRecipientJobData;

util.inherits(KalturaEmailNotificationRecipientJobData, kaltura.KalturaObjectBase);


/**
 */
function KalturaEmailNotificationRecipientProvider(){
	KalturaEmailNotificationRecipientProvider.super_.call(this);
}
module.exports.KalturaEmailNotificationRecipientProvider = KalturaEmailNotificationRecipientProvider;

util.inherits(KalturaEmailNotificationRecipientProvider, kaltura.KalturaObjectBase);


/**
 * @param id int Auto generated unique id (readOnly).
 * @param createdAt int Entry distribution creation date as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Entry distribution last update date as Unix timestamp (In seconds) (readOnly).
 * @param submittedAt int Entry distribution submission date as Unix timestamp (In seconds) (readOnly).
 * @param entryId string  (insertOnly).
 * @param partnerId int  (readOnly).
 * @param distributionProfileId int  (insertOnly).
 * @param status int  (readOnly).
 * @param sunStatus int  (readOnly).
 * @param dirtyStatus int  (readOnly).
 * @param thumbAssetIds string Comma separated thumbnail asset ids.
 * @param flavorAssetIds string Comma separated flavor asset ids.
 * @param assetIds string Comma separated asset ids.
 * @param sunrise int Entry distribution publish time as Unix timestamp (In seconds).
 * @param sunset int Entry distribution un-publish time as Unix timestamp (In seconds).
 * @param remoteId string The id as returned from the distributed destination (readOnly).
 * @param plays int The plays as retrieved from the remote destination reports (readOnly).
 * @param views int The views as retrieved from the remote destination reports (readOnly).
 * @param validationErrors array .
 * @param errorType int  (readOnly).
 * @param errorNumber int  (readOnly).
 * @param errorDescription string  (readOnly).
 * @param hasSubmitResultsLog int  (readOnly).
 * @param hasSubmitSentDataLog int  (readOnly).
 * @param hasUpdateResultsLog int  (readOnly).
 * @param hasUpdateSentDataLog int  (readOnly).
 * @param hasDeleteResultsLog int  (readOnly).
 * @param hasDeleteSentDataLog int  (readOnly).
 */
function KalturaEntryDistribution(){
	KalturaEntryDistribution.super_.call(this);
	this.id = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.submittedAt = null;
	this.entryId = null;
	this.partnerId = null;
	this.distributionProfileId = null;
	this.status = null;
	this.sunStatus = null;
	this.dirtyStatus = null;
	this.thumbAssetIds = null;
	this.flavorAssetIds = null;
	this.assetIds = null;
	this.sunrise = null;
	this.sunset = null;
	this.remoteId = null;
	this.plays = null;
	this.views = null;
	this.validationErrors = null;
	this.errorType = null;
	this.errorNumber = null;
	this.errorDescription = null;
	this.hasSubmitResultsLog = null;
	this.hasSubmitSentDataLog = null;
	this.hasUpdateResultsLog = null;
	this.hasUpdateSentDataLog = null;
	this.hasDeleteResultsLog = null;
	this.hasDeleteSentDataLog = null;
}
module.exports.KalturaEntryDistribution = KalturaEntryDistribution;

util.inherits(KalturaEntryDistribution, kaltura.KalturaObjectBase);


/**
 * @param keepManualThumbnails int If true manually created thumbnails will not be deleted on entry replacement.
 */
function KalturaEntryReplacementOptions(){
	KalturaEntryReplacementOptions.super_.call(this);
	this.keepManualThumbnails = null;
}
module.exports.KalturaEntryReplacementOptions = KalturaEntryReplacementOptions;

util.inherits(KalturaEntryReplacementOptions, kaltura.KalturaObjectBase);


/**
 * @param key string The key in the subject and body to be replaced with the dynamic value.
 * @param description string .
 * @param value KalturaStringValue The dynamic value to be placed in the final output.
 */
function KalturaEventNotificationParameter(){
	KalturaEventNotificationParameter.super_.call(this);
	this.key = null;
	this.description = null;
	this.value = null;
}
module.exports.KalturaEventNotificationParameter = KalturaEventNotificationParameter;

util.inherits(KalturaEventNotificationParameter, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param partnerId int  (readOnly).
 * @param name string .
 * @param systemName string .
 * @param description string .
 * @param type string  (insertOnly).
 * @param status int  (readOnly).
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param manualDispatchEnabled bool Define that the template could be dispatched manually from the API.
 * @param automaticDispatchEnabled bool Define that the template could be dispatched automatically by the system.
 * @param eventType string Define the event that should trigger this notification.
 * @param eventObjectType string Define the object that raied the event that should trigger this notification.
 * @param eventConditions array Define the conditions that cause this notification to be triggered.
 * @param contentParameters array Define the content dynamic parameters.
 * @param userParameters array Define the content dynamic parameters.
 */
function KalturaEventNotificationTemplate(){
	KalturaEventNotificationTemplate.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.name = null;
	this.systemName = null;
	this.description = null;
	this.type = null;
	this.status = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.manualDispatchEnabled = null;
	this.automaticDispatchEnabled = null;
	this.eventType = null;
	this.eventObjectType = null;
	this.eventConditions = null;
	this.contentParameters = null;
	this.userParameters = null;
}
module.exports.KalturaEventNotificationTemplate = KalturaEventNotificationTemplate;

util.inherits(KalturaEventNotificationTemplate, kaltura.KalturaObjectBase);


/**
 * @param schedulerId int .
 * @param workerId int .
 * @param batchIndex int .
 */
function KalturaExclusiveLockKey(){
	KalturaExclusiveLockKey.super_.call(this);
	this.schedulerId = null;
	this.workerId = null;
	this.batchIndex = null;
}
module.exports.KalturaExclusiveLockKey = KalturaExclusiveLockKey;

util.inherits(KalturaExclusiveLockKey, kaltura.KalturaObjectBase);


/**
 * @param extendedFeatures string Comma separated string of enum values denoting which features of the item need to be included in the MRSS.
 */
function KalturaObjectIdentifier(){
	KalturaObjectIdentifier.super_.call(this);
	this.extendedFeatures = null;
}
module.exports.KalturaObjectIdentifier = KalturaObjectIdentifier;

util.inherits(KalturaObjectIdentifier, kaltura.KalturaObjectBase);


/**
 * @param xpath string XPath for the extending item.
 * @param identifier KalturaObjectIdentifier Object identifier.
 * @param extensionMode int Mode of extension - append to MRSS or replace the xpath content.
 */
function KalturaExtendingItemMrssParameter(){
	KalturaExtendingItemMrssParameter.super_.call(this);
	this.xpath = null;
	this.identifier = null;
	this.extensionMode = null;
}
module.exports.KalturaExtendingItemMrssParameter = KalturaExtendingItemMrssParameter;

util.inherits(KalturaExtendingItemMrssParameter, kaltura.KalturaObjectBase);


/**
 * @param plays int Number of plays (readOnly).
 * @param views int Number of views (readOnly).
 * @param lastPlayedAt int The last time the entry was played (readOnly).
 * @param width int The width in pixels (readOnly).
 * @param height int The height in pixels (readOnly).
 * @param duration int The duration in seconds (readOnly).
 * @param msDuration int The duration in miliseconds.
 * @param durationType string The duration type (short for 0-4 mins, medium for 4-20 mins, long for 20+ mins) (readOnly).
 */
function KalturaPlayableEntry(){
	KalturaPlayableEntry.super_.call(this);
	this.plays = null;
	this.views = null;
	this.lastPlayedAt = null;
	this.width = null;
	this.height = null;
	this.duration = null;
	this.msDuration = null;
	this.durationType = null;
}
module.exports.KalturaPlayableEntry = KalturaPlayableEntry;

util.inherits(KalturaPlayableEntry, KalturaBaseEntry);


/**
 * @param mediaType int The media type of the entry (insertOnly).
 * @param conversionQuality string Override the default conversion quality (insertOnly).
 * @param sourceType string The source type of the entry (insertOnly).
 * @param searchProviderType int The search provider type used to import this entry (insertOnly).
 * @param searchProviderId string The ID of the media in the importing site (insertOnly).
 * @param creditUserName string The user name used for credits.
 * @param creditUrl string The URL for credits.
 * @param mediaDate int The media date extracted from EXIF data (For images) as Unix timestamp (In seconds) (readOnly).
 * @param dataUrl string The URL used for playback. This is not the download URL (readOnly).
 * @param flavorParamsIds string Comma separated flavor params ids that exists for this media entry (readOnly).
 */
function KalturaMediaEntry(){
	KalturaMediaEntry.super_.call(this);
	this.mediaType = null;
	this.conversionQuality = null;
	this.sourceType = null;
	this.searchProviderType = null;
	this.searchProviderId = null;
	this.creditUserName = null;
	this.creditUrl = null;
	this.mediaDate = null;
	this.dataUrl = null;
	this.flavorParamsIds = null;
}
module.exports.KalturaMediaEntry = KalturaMediaEntry;

util.inherits(KalturaMediaEntry, KalturaPlayableEntry);


/**
 * @param externalSourceType string The source type of the external media (insertOnly).
 * @param assetParamsIds string Comma separated asset params ids that exists for this external media entry (readOnly).
 */
function KalturaExternalMediaEntry(){
	KalturaExternalMediaEntry.super_.call(this);
	this.externalSourceType = null;
	this.assetParamsIds = null;
}
module.exports.KalturaExternalMediaEntry = KalturaExternalMediaEntry;

util.inherits(KalturaExternalMediaEntry, KalturaMediaEntry);


/**
 * @param type int .
 * @param value int .
 */
function KalturaFeatureStatus(){
	KalturaFeatureStatus.super_.call(this);
	this.type = null;
	this.value = null;
}
module.exports.KalturaFeatureStatus = KalturaFeatureStatus;

util.inherits(KalturaFeatureStatus, kaltura.KalturaObjectBase);


/**
 * @param itemXPath string .
 * @param itemPublishDateXPath string .
 * @param itemUniqueIdentifierXPath string .
 * @param itemContentFileSizeXPath string .
 * @param itemContentUrlXPath string .
 * @param itemContentBitrateXPath string .
 * @param itemHashXPath string .
 * @param itemContentXpath string .
 * @param contentBitrateAttributeName string .
 */
function KalturaFeedItemInfo(){
	KalturaFeedItemInfo.super_.call(this);
	this.itemXPath = null;
	this.itemPublishDateXPath = null;
	this.itemUniqueIdentifierXPath = null;
	this.itemContentFileSizeXPath = null;
	this.itemContentUrlXPath = null;
	this.itemContentBitrateXPath = null;
	this.itemHashXPath = null;
	this.itemContentXpath = null;
	this.contentBitrateAttributeName = null;
}
module.exports.KalturaFeedItemInfo = KalturaFeedItemInfo;

util.inherits(KalturaFeedItemInfo, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param partnerId int  (readOnly).
 * @param fileAssetObjectType string  (insertOnly).
 * @param objectId string  (insertOnly).
 * @param name string .
 * @param systemName string .
 * @param fileExt string .
 * @param version int  (readOnly).
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param status string  (readOnly).
 */
function KalturaFileAsset(){
	KalturaFileAsset.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.fileAssetObjectType = null;
	this.objectId = null;
	this.name = null;
	this.systemName = null;
	this.fileExt = null;
	this.version = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.status = null;
}
module.exports.KalturaFileAsset = KalturaFileAsset;

util.inherits(KalturaFileAsset, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param partnerId int  (readOnly).
 * @param fileObjectType string  (readOnly).
 * @param objectId string  (readOnly).
 * @param version string  (readOnly).
 * @param objectSubType int  (readOnly).
 * @param dc string  (readOnly).
 * @param original int  (readOnly).
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param readyAt int  (readOnly).
 * @param syncTime int  (readOnly).
 * @param status int  (readOnly).
 * @param fileType int  (readOnly).
 * @param linkedId int  (readOnly).
 * @param linkCount int  (readOnly).
 * @param fileRoot string  (readOnly).
 * @param filePath string  (readOnly).
 * @param fileSize float  (readOnly).
 * @param fileUrl string  (readOnly).
 * @param fileContent string  (readOnly).
 * @param fileDiscSize float  (readOnly).
 * @param isCurrentDc bool  (readOnly).
 */
function KalturaFileSync(){
	KalturaFileSync.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.fileObjectType = null;
	this.objectId = null;
	this.version = null;
	this.objectSubType = null;
	this.dc = null;
	this.original = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.readyAt = null;
	this.syncTime = null;
	this.status = null;
	this.fileType = null;
	this.linkedId = null;
	this.linkCount = null;
	this.fileRoot = null;
	this.filePath = null;
	this.fileSize = null;
	this.fileUrl = null;
	this.fileContent = null;
	this.fileDiscSize = null;
	this.isCurrentDc = null;
}
module.exports.KalturaFileSync = KalturaFileSync;

util.inherits(KalturaFileSync, kaltura.KalturaObjectBase);


/**
 * @param flavorParamsId int The Flavor Params used to create this Flavor Asset (insertOnly).
 * @param width int The width of the Flavor Asset (readOnly).
 * @param height int The height of the Flavor Asset (readOnly).
 * @param bitrate int The overall bitrate (in KBits) of the Flavor Asset (readOnly).
 * @param frameRate float The frame rate (in FPS) of the Flavor Asset (readOnly).
 * @param isOriginal bool True if this Flavor Asset is the original source (readOnly).
 * @param isWeb bool True if this Flavor Asset is playable in KDP (readOnly).
 * @param containerFormat string The container format (readOnly).
 * @param videoCodecId string The video codec (readOnly).
 * @param status int The status of the Flavor Asset (readOnly).
 */
function KalturaFlavorAsset(){
	KalturaFlavorAsset.super_.call(this);
	this.flavorParamsId = null;
	this.width = null;
	this.height = null;
	this.bitrate = null;
	this.frameRate = null;
	this.isOriginal = null;
	this.isWeb = null;
	this.containerFormat = null;
	this.videoCodecId = null;
	this.status = null;
}
module.exports.KalturaFlavorAsset = KalturaFlavorAsset;

util.inherits(KalturaFlavorAsset, KalturaAsset);


/**
 * @param fileName string The name of the downloaded file.
 */
function KalturaFlavorAssetUrlOptions(){
	KalturaFlavorAssetUrlOptions.super_.call(this);
	this.fileName = null;
}
module.exports.KalturaFlavorAssetUrlOptions = KalturaFlavorAssetUrlOptions;

util.inherits(KalturaFlavorAssetUrlOptions, kaltura.KalturaObjectBase);


/**
 * @param videoCodec string The video codec of the Flavor Params.
 * @param videoBitrate int The video bitrate (in KBits) of the Flavor Params.
 * @param audioCodec string The audio codec of the Flavor Params.
 * @param audioBitrate int The audio bitrate (in KBits) of the Flavor Params.
 * @param audioChannels int The number of audio channels for "downmixing".
 * @param audioSampleRate int The audio sample rate of the Flavor Params.
 * @param width int The desired width of the Flavor Params.
 * @param height int The desired height of the Flavor Params.
 * @param frameRate int The frame rate of the Flavor Params.
 * @param gopSize int The gop size of the Flavor Params.
 * @param conversionEngines string The list of conversion engines (comma separated).
 * @param conversionEnginesExtraParams string The list of conversion engines extra params (separated with "|").
 * @param twoPass bool .
 * @param deinterlice int .
 * @param rotate int .
 * @param operators string .
 * @param engineVersion int .
 * @param format string The container format of the Flavor Params.
 * @param aspectRatioProcessingMode int .
 * @param forceFrameToMultiplication16 int .
 * @param isGopInSec int .
 * @param isAvoidVideoShrinkFramesizeToSource int .
 * @param isAvoidVideoShrinkBitrateToSource int .
 * @param isVideoFrameRateForLowBrAppleHls int .
 * @param multiStream string .
 * @param anamorphicPixels float .
 * @param isAvoidForcedKeyFrames int .
 * @param isCropIMX int .
 * @param optimizationPolicy int .
 * @param maxFrameRate int .
 * @param videoConstantBitrate int .
 * @param videoBitrateTolerance int .
 * @param watermarkData string .
 * @param clipOffset int .
 * @param clipDuration int .
 */
function KalturaFlavorParams(){
	KalturaFlavorParams.super_.call(this);
	this.videoCodec = null;
	this.videoBitrate = null;
	this.audioCodec = null;
	this.audioBitrate = null;
	this.audioChannels = null;
	this.audioSampleRate = null;
	this.width = null;
	this.height = null;
	this.frameRate = null;
	this.gopSize = null;
	this.conversionEngines = null;
	this.conversionEnginesExtraParams = null;
	this.twoPass = null;
	this.deinterlice = null;
	this.rotate = null;
	this.operators = null;
	this.engineVersion = null;
	this.format = null;
	this.aspectRatioProcessingMode = null;
	this.forceFrameToMultiplication16 = null;
	this.isGopInSec = null;
	this.isAvoidVideoShrinkFramesizeToSource = null;
	this.isAvoidVideoShrinkBitrateToSource = null;
	this.isVideoFrameRateForLowBrAppleHls = null;
	this.multiStream = null;
	this.anamorphicPixels = null;
	this.isAvoidForcedKeyFrames = null;
	this.isCropIMX = null;
	this.optimizationPolicy = null;
	this.maxFrameRate = null;
	this.videoConstantBitrate = null;
	this.videoBitrateTolerance = null;
	this.watermarkData = null;
	this.clipOffset = null;
	this.clipDuration = null;
}
module.exports.KalturaFlavorParams = KalturaFlavorParams;

util.inherits(KalturaFlavorParams, KalturaAssetParams);


/**
 * @param flavorAsset KalturaFlavorAsset The Flavor Asset (Can be null when there are params without asset).
 * @param flavorParams KalturaFlavorParams The Flavor Params.
 * @param entryId string The entry id.
 */
function KalturaFlavorAssetWithParams(){
	KalturaFlavorAssetWithParams.super_.call(this);
	this.flavorAsset = null;
	this.flavorParams = null;
	this.entryId = null;
}
module.exports.KalturaFlavorAssetWithParams = KalturaFlavorAssetWithParams;

util.inherits(KalturaFlavorAssetWithParams, kaltura.KalturaObjectBase);


/**
 * @param flavorParamsId int .
 * @param commandLinesStr string .
 * @param flavorParamsVersion string .
 * @param flavorAssetId string .
 * @param flavorAssetVersion string .
 * @param readyBehavior int .
 */
function KalturaFlavorParamsOutput(){
	KalturaFlavorParamsOutput.super_.call(this);
	this.flavorParamsId = null;
	this.commandLinesStr = null;
	this.flavorParamsVersion = null;
	this.flavorAssetId = null;
	this.flavorAssetVersion = null;
	this.readyBehavior = null;
}
module.exports.KalturaFlavorParamsOutput = KalturaFlavorParamsOutput;

util.inherits(KalturaFlavorParamsOutput, KalturaFlavorParams);


/**
 * @param protocol int .
 * @param serverUrl string .
 * @param serverPath string .
 * @param username string .
 * @param password string .
 * @param ftpPassiveMode bool .
 * @param httpFieldName string .
 * @param httpFileName string .
 */
function KalturaGenericDistributionProfileAction(){
	KalturaGenericDistributionProfileAction.super_.call(this);
	this.protocol = null;
	this.serverUrl = null;
	this.serverPath = null;
	this.username = null;
	this.password = null;
	this.ftpPassiveMode = null;
	this.httpFieldName = null;
	this.httpFileName = null;
}
module.exports.KalturaGenericDistributionProfileAction = KalturaGenericDistributionProfileAction;

util.inherits(KalturaGenericDistributionProfileAction, kaltura.KalturaObjectBase);


/**
 * @param id int Auto generated (readOnly).
 * @param createdAt int Generic distribution provider action creation date as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Generic distribution provider action last update date as Unix timestamp (In seconds) (readOnly).
 * @param genericDistributionProviderId int  (insertOnly).
 * @param action int  (insertOnly).
 * @param status int  (readOnly).
 * @param resultsParser int .
 * @param protocol int .
 * @param serverAddress string .
 * @param remotePath string .
 * @param remoteUsername string .
 * @param remotePassword string .
 * @param editableFields string .
 * @param mandatoryFields string .
 * @param mrssTransformer string  (readOnly).
 * @param mrssValidator string  (readOnly).
 * @param resultsTransformer string  (readOnly).
 */
function KalturaGenericDistributionProviderAction(){
	KalturaGenericDistributionProviderAction.super_.call(this);
	this.id = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.genericDistributionProviderId = null;
	this.action = null;
	this.status = null;
	this.resultsParser = null;
	this.protocol = null;
	this.serverAddress = null;
	this.remotePath = null;
	this.remoteUsername = null;
	this.remotePassword = null;
	this.editableFields = null;
	this.mandatoryFields = null;
	this.mrssTransformer = null;
	this.mrssValidator = null;
	this.resultsTransformer = null;
}
module.exports.KalturaGenericDistributionProviderAction = KalturaGenericDistributionProviderAction;

util.inherits(KalturaGenericDistributionProviderAction, kaltura.KalturaObjectBase);


/**
 * @param id int Auto generated (readOnly).
 * @param createdAt int Generic distribution provider creation date as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Generic distribution provider last update date as Unix timestamp (In seconds) (readOnly).
 * @param partnerId int  (readOnly).
 * @param isDefault bool .
 * @param status int  (readOnly).
 * @param optionalFlavorParamsIds string .
 * @param requiredFlavorParamsIds string .
 * @param optionalThumbDimensions array .
 * @param requiredThumbDimensions array .
 * @param editableFields string .
 * @param mandatoryFields string .
 */
function KalturaGenericDistributionProvider(){
	KalturaGenericDistributionProvider.super_.call(this);
	this.id = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.partnerId = null;
	this.isDefault = null;
	this.status = null;
	this.optionalFlavorParamsIds = null;
	this.requiredFlavorParamsIds = null;
	this.optionalThumbDimensions = null;
	this.requiredThumbDimensions = null;
	this.editableFields = null;
	this.mandatoryFields = null;
}
module.exports.KalturaGenericDistributionProvider = KalturaGenericDistributionProvider;

util.inherits(KalturaGenericDistributionProvider, KalturaDistributionProvider);


/**
 * @param userId string  (insertOnly).
 * @param groupId string  (insertOnly).
 * @param status int  (readOnly).
 * @param partnerId int  (readOnly).
 * @param createdAt int Creation date as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Last update date as Unix timestamp (In seconds) (readOnly).
 */
function KalturaGroupUser(){
	KalturaGroupUser.super_.call(this);
	this.userId = null;
	this.groupId = null;
	this.status = null;
	this.partnerId = null;
	this.createdAt = null;
	this.updatedAt = null;
}
module.exports.KalturaGroupUser = KalturaGroupUser;

util.inherits(KalturaGroupUser, kaltura.KalturaObjectBase);


/**
 */
function KalturaHttpNotificationData(){
	KalturaHttpNotificationData.super_.call(this);
}
module.exports.KalturaHttpNotificationData = KalturaHttpNotificationData;

util.inherits(KalturaHttpNotificationData, kaltura.KalturaObjectBase);


/**
 * @param value int .
 */
function KalturaIntegerValue(){
	KalturaIntegerValue.super_.call(this);
	this.value = null;
}
module.exports.KalturaIntegerValue = KalturaIntegerValue;

util.inherits(KalturaIntegerValue, KalturaValue);


/**
 */
function KalturaIntegrationJobProviderData(){
	KalturaIntegrationJobProviderData.super_.call(this);
}
module.exports.KalturaIntegrationJobProviderData = KalturaIntegrationJobProviderData;

util.inherits(KalturaIntegrationJobProviderData, kaltura.KalturaObjectBase);


/**
 */
function KalturaIntegrationJobTriggerData(){
	KalturaIntegrationJobTriggerData.super_.call(this);
}
module.exports.KalturaIntegrationJobTriggerData = KalturaIntegrationJobTriggerData;

util.inherits(KalturaIntegrationJobTriggerData, kaltura.KalturaObjectBase);


/**
 * @param protocol string .
 * @param url string .
 * @param publishUrl string .
 * @param backupUrl string .
 * @param streamName string .
 */
function KalturaLiveStreamConfiguration(){
	KalturaLiveStreamConfiguration.super_.call(this);
	this.protocol = null;
	this.url = null;
	this.publishUrl = null;
	this.backupUrl = null;
	this.streamName = null;
}
module.exports.KalturaLiveStreamConfiguration = KalturaLiveStreamConfiguration;

util.inherits(KalturaLiveStreamConfiguration, kaltura.KalturaObjectBase);


/**
 * @param publishUrl string .
 * @param backupPublishUrl string .
 * @param port string .
 */
function KalturaLiveStreamPushPublishConfiguration(){
	KalturaLiveStreamPushPublishConfiguration.super_.call(this);
	this.publishUrl = null;
	this.backupPublishUrl = null;
	this.port = null;
}
module.exports.KalturaLiveStreamPushPublishConfiguration = KalturaLiveStreamPushPublishConfiguration;

util.inherits(KalturaLiveStreamPushPublishConfiguration, kaltura.KalturaObjectBase);


/**
 * @param shouldCopyEntitlement int .
 */
function KalturaLiveEntryRecordingOptions(){
	KalturaLiveEntryRecordingOptions.super_.call(this);
	this.shouldCopyEntitlement = null;
}
module.exports.KalturaLiveEntryRecordingOptions = KalturaLiveEntryRecordingOptions;

util.inherits(KalturaLiveEntryRecordingOptions, kaltura.KalturaObjectBase);


/**
 * @param offlineMessage string The message to be presented when the stream is offline.
 * @param recordStatus int Recording Status Enabled/Disabled (insertOnly).
 * @param dvrStatus int DVR Status Enabled/Disabled (insertOnly).
 * @param dvrWindow int Window of time which the DVR allows for backwards scrubbing (in minutes) (insertOnly).
 * @param lastElapsedRecordingTime int Elapsed recording time (in msec) up to the point where the live stream was last stopped (unpublished).
 * @param liveStreamConfigurations array Array of key value protocol->live stream url objects.
 * @param recordedEntryId string Recorded entry id.
 * @param pushPublishEnabled int Flag denoting whether entry should be published by the media server.
 * @param publishConfigurations array Array of publish configurations.
 * @param firstBroadcast int The first time in which the entry was broadcast (readOnly).
 * @param lastBroadcast int The Last time in which the entry was broadcast (readOnly).
 * @param currentBroadcastStartTime float The time (unix timestamp in milliseconds) in which the entry broadcast started or 0 when the entry is off the air.
 * @param recordingOptions KalturaLiveEntryRecordingOptions  (insertOnly).
 */
function KalturaLiveEntry(){
	KalturaLiveEntry.super_.call(this);
	this.offlineMessage = null;
	this.recordStatus = null;
	this.dvrStatus = null;
	this.dvrWindow = null;
	this.lastElapsedRecordingTime = null;
	this.liveStreamConfigurations = null;
	this.recordedEntryId = null;
	this.pushPublishEnabled = null;
	this.publishConfigurations = null;
	this.firstBroadcast = null;
	this.lastBroadcast = null;
	this.currentBroadcastStartTime = null;
	this.recordingOptions = null;
}
module.exports.KalturaLiveEntry = KalturaLiveEntry;

util.inherits(KalturaLiveEntry, KalturaMediaEntry);


/**
 * @param playlistId string Playlist id to be played.
 * @param repeat int Indicates that the segments should be repeated for ever.
 */
function KalturaLiveChannel(){
	KalturaLiveChannel.super_.call(this);
	this.playlistId = null;
	this.repeat = null;
}
module.exports.KalturaLiveChannel = KalturaLiveChannel;

util.inherits(KalturaLiveChannel, KalturaLiveEntry);


/**
 * @param id string Unique identifier (readOnly).
 * @param partnerId int  (readOnly).
 * @param createdAt int Segment creation date as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Segment update date as Unix timestamp (In seconds) (readOnly).
 * @param name string Segment name.
 * @param description string Segment description.
 * @param tags string Segment tags.
 * @param type string Segment could be associated with the main stream, as additional stream or as overlay.
 * @param status string  (readOnly).
 * @param channelId string Live channel id.
 * @param entryId string Entry id to be played.
 * @param triggerType string Segment start time trigger type.
 * @param triggerSegmentId string Live channel segment that the trigger relates to.
 * @param startTime float Segment play start time, in mili-seconds, according to trigger type.
 * @param duration float Segment play duration time, in mili-seconds.
 */
function KalturaLiveChannelSegment(){
	KalturaLiveChannelSegment.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.name = null;
	this.description = null;
	this.tags = null;
	this.type = null;
	this.status = null;
	this.channelId = null;
	this.entryId = null;
	this.triggerType = null;
	this.triggerSegmentId = null;
	this.startTime = null;
	this.duration = null;
}
module.exports.KalturaLiveChannelSegment = KalturaLiveChannelSegment;

util.inherits(KalturaLiveChannelSegment, kaltura.KalturaObjectBase);


/**
 * @param entryIds string .
 * @param recpientEmail string .
 * @param timeZoneOffset int Time zone offset in minutes (between client to UTC).
 * @param applicationUrlTemplate string Optional argument that allows controlling the prefix of the exported csv url.
 */
function KalturaLiveReportExportParams(){
	KalturaLiveReportExportParams.super_.call(this);
	this.entryIds = null;
	this.recpientEmail = null;
	this.timeZoneOffset = null;
	this.applicationUrlTemplate = null;
}
module.exports.KalturaLiveReportExportParams = KalturaLiveReportExportParams;

util.inherits(KalturaLiveReportExportParams, kaltura.KalturaObjectBase);


/**
 * @param referenceJobId int .
 * @param reportEmail string .
 */
function KalturaLiveReportExportResponse(){
	KalturaLiveReportExportResponse.super_.call(this);
	this.referenceJobId = null;
	this.reportEmail = null;
}
module.exports.KalturaLiveReportExportResponse = KalturaLiveReportExportResponse;

util.inherits(KalturaLiveReportExportResponse, kaltura.KalturaObjectBase);


/**
 * @param entryIds string .
 * @param fromTime int .
 * @param toTime int .
 * @param live int .
 * @param orderBy string .
 */
function KalturaLiveReportInputFilter(){
	KalturaLiveReportInputFilter.super_.call(this);
	this.entryIds = null;
	this.fromTime = null;
	this.toTime = null;
	this.live = null;
	this.orderBy = null;
}
module.exports.KalturaLiveReportInputFilter = KalturaLiveReportInputFilter;

util.inherits(KalturaLiveReportInputFilter, kaltura.KalturaObjectBase);


/**
 * @param audience int .
 * @param dvrAudience int .
 * @param avgBitrate float .
 * @param bufferTime int .
 * @param plays int .
 * @param secondsViewed int .
 * @param startEvent int .
 * @param timestamp int .
 */
function KalturaLiveStats(){
	KalturaLiveStats.super_.call(this);
	this.audience = null;
	this.dvrAudience = null;
	this.avgBitrate = null;
	this.bufferTime = null;
	this.plays = null;
	this.secondsViewed = null;
	this.startEvent = null;
	this.timestamp = null;
}
module.exports.KalturaLiveStats = KalturaLiveStats;

util.inherits(KalturaLiveStats, kaltura.KalturaObjectBase);


/**
 * @param partnerId int .
 * @param entryId string .
 * @param eventType int an integer representing the type of event being sent from the player.
 * @param sessionId string a unique string generated by the client that will represent the client-side session: the primary component will pass it on to other components that sprout from it.
 * @param eventIndex int incremental sequence of the event.
 * @param bufferTime int buffer time in seconds from the last 10 seconds.
 * @param bitrate int bitrate used in the last 10 seconds.
 * @param referrer string the referrer of the client.
 * @param isLive bool .
 * @param startTime string the event start time as string.
 * @param deliveryType string delivery type used for this stream.
 */
function KalturaLiveStatsEvent(){
	KalturaLiveStatsEvent.super_.call(this);
	this.partnerId = null;
	this.entryId = null;
	this.eventType = null;
	this.sessionId = null;
	this.eventIndex = null;
	this.bufferTime = null;
	this.bitrate = null;
	this.referrer = null;
	this.isLive = null;
	this.startTime = null;
	this.deliveryType = null;
}
module.exports.KalturaLiveStatsEvent = KalturaLiveStatsEvent;

util.inherits(KalturaLiveStatsEvent, kaltura.KalturaObjectBase);


/**
 * @param bitrate int .
 * @param width int .
 * @param height int .
 * @param tags string .
 */
function KalturaLiveStreamBitrate(){
	KalturaLiveStreamBitrate.super_.call(this);
	this.bitrate = null;
	this.width = null;
	this.height = null;
	this.tags = null;
}
module.exports.KalturaLiveStreamBitrate = KalturaLiveStreamBitrate;

util.inherits(KalturaLiveStreamBitrate, kaltura.KalturaObjectBase);


/**
 * @param streamRemoteId string The stream id as provided by the provider (readOnly).
 * @param streamRemoteBackupId string The backup stream id as provided by the provider (readOnly).
 * @param bitrates array Array of supported bitrates.
 * @param primaryBroadcastingUrl string .
 * @param secondaryBroadcastingUrl string .
 * @param primaryRtspBroadcastingUrl string .
 * @param secondaryRtspBroadcastingUrl string .
 * @param streamName string .
 * @param streamUrl string The stream url.
 * @param hlsStreamUrl string HLS URL - URL for live stream playback on mobile device.
 * @param urlManager string URL Manager to handle the live stream URL (for instance, add token).
 * @param encodingIP1 string The broadcast primary ip.
 * @param encodingIP2 string The broadcast secondary ip.
 * @param streamPassword string The broadcast password.
 * @param streamUsername string The broadcast username (readOnly).
 */
function KalturaLiveStreamEntry(){
	KalturaLiveStreamEntry.super_.call(this);
	this.streamRemoteId = null;
	this.streamRemoteBackupId = null;
	this.bitrates = null;
	this.primaryBroadcastingUrl = null;
	this.secondaryBroadcastingUrl = null;
	this.primaryRtspBroadcastingUrl = null;
	this.secondaryRtspBroadcastingUrl = null;
	this.streamName = null;
	this.streamUrl = null;
	this.hlsStreamUrl = null;
	this.urlManager = null;
	this.encodingIP1 = null;
	this.encodingIP2 = null;
	this.streamPassword = null;
	this.streamUsername = null;
}
module.exports.KalturaLiveStreamEntry = KalturaLiveStreamEntry;

util.inherits(KalturaLiveStreamEntry, KalturaLiveEntry);


/**
 * @param idEqual string This filter should be in use for retrieving only a specific entry (identified by its entryId).
 * @param idIn string This filter should be in use for retrieving few specific entries (string should include comma separated list of entryId strings).
 * @param idNotIn string .
 * @param nameLike string This filter should be in use for retrieving specific entries. It should include only one string to search for in entry names (no wildcards, spaces are treated as part of the string).
 * @param nameMultiLikeOr string This filter should be in use for retrieving specific entries. It could include few (comma separated) strings for searching in entry names, while applying an OR logic to retrieve entries that contain at least one input string (no wildcards, spaces are treated as part of the string).
 * @param nameMultiLikeAnd string This filter should be in use for retrieving specific entries. It could include few (comma separated) strings for searching in entry names, while applying an AND logic to retrieve entries that contain all input strings (no wildcards, spaces are treated as part of the string).
 * @param nameEqual string This filter should be in use for retrieving entries with a specific name.
 * @param partnerIdEqual int This filter should be in use for retrieving only entries which were uploaded by/assigned to users of a specific Kaltura Partner (identified by Partner ID).
 * @param partnerIdIn string This filter should be in use for retrieving only entries within Kaltura network which were uploaded by/assigned to users of few Kaltura Partners  (string should include comma separated list of PartnerIDs).
 * @param userIdEqual string This filter parameter should be in use for retrieving only entries, uploaded by/assigned to a specific user (identified by user Id).
 * @param userIdIn string .
 * @param creatorIdEqual string .
 * @param tagsLike string This filter should be in use for retrieving specific entries. It should include only one string to search for in entry tags (no wildcards, spaces are treated as part of the string).
 * @param tagsMultiLikeOr string This filter should be in use for retrieving specific entries. It could include few (comma separated) strings for searching in entry tags, while applying an OR logic to retrieve entries that contain at least one input string (no wildcards, spaces are treated as part of the string).
 * @param tagsMultiLikeAnd string This filter should be in use for retrieving specific entries. It could include few (comma separated) strings for searching in entry tags, while applying an AND logic to retrieve entries that contain all input strings (no wildcards, spaces are treated as part of the string).
 * @param adminTagsLike string This filter should be in use for retrieving specific entries. It should include only one string to search for in entry tags set by an ADMIN user (no wildcards, spaces are treated as part of the string).
 * @param adminTagsMultiLikeOr string This filter should be in use for retrieving specific entries. It could include few (comma separated) strings for searching in entry tags, set by an ADMIN user, while applying an OR logic to retrieve entries that contain at least one input string (no wildcards, spaces are treated as part of the string).
 * @param adminTagsMultiLikeAnd string This filter should be in use for retrieving specific entries. It could include few (comma separated) strings for searching in entry tags, set by an ADMIN user, while applying an AND logic to retrieve entries that contain all input strings (no wildcards, spaces are treated as part of the string).
 * @param categoriesMatchAnd string .
 * @param categoriesMatchOr string All entries within these categories or their child categories.
 * @param categoriesNotContains string .
 * @param categoriesIdsMatchAnd string .
 * @param categoriesIdsMatchOr string All entries of the categories, excluding their child categories.
 * To include entries of the child categories, use categoryAncestorIdIn, or categoriesMatchOr.
 * @param categoriesIdsNotContains string .
 * @param categoriesIdsEmpty int .
 * @param statusEqual string This filter should be in use for retrieving only entries, at a specific {.
 * @param statusNotEqual string This filter should be in use for retrieving only entries, not at a specific {.
 * @param statusIn string This filter should be in use for retrieving only entries, at few specific {.
 * @param statusNotIn string This filter should be in use for retrieving only entries, not at few specific {.
 * @param moderationStatusEqual int .
 * @param moderationStatusNotEqual int .
 * @param moderationStatusIn string .
 * @param moderationStatusNotIn string .
 * @param typeEqual string .
 * @param typeIn string This filter should be in use for retrieving entries of few {.
 * @param createdAtGreaterThanOrEqual int This filter parameter should be in use for retrieving only entries which were created at Kaltura system after a specific time/date (standard timestamp format).
 * @param createdAtLessThanOrEqual int This filter parameter should be in use for retrieving only entries which were created at Kaltura system before a specific time/date (standard timestamp format).
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param totalRankLessThanOrEqual int .
 * @param totalRankGreaterThanOrEqual int .
 * @param groupIdEqual int .
 * @param searchTextMatchAnd string This filter should be in use for retrieving specific entries while search match the input string within all of the following metadata attributes: name, description, tags, adminTags.
 * @param searchTextMatchOr string This filter should be in use for retrieving specific entries while search match the input string within at least one of the following metadata attributes: name, description, tags, adminTags.
 * @param accessControlIdEqual int .
 * @param accessControlIdIn string .
 * @param startDateGreaterThanOrEqual int .
 * @param startDateLessThanOrEqual int .
 * @param startDateGreaterThanOrEqualOrNull int .
 * @param startDateLessThanOrEqualOrNull int .
 * @param endDateGreaterThanOrEqual int .
 * @param endDateLessThanOrEqual int .
 * @param endDateGreaterThanOrEqualOrNull int .
 * @param endDateLessThanOrEqualOrNull int .
 * @param referenceIdEqual string .
 * @param referenceIdIn string .
 * @param replacingEntryIdEqual string .
 * @param replacingEntryIdIn string .
 * @param replacedEntryIdEqual string .
 * @param replacedEntryIdIn string .
 * @param replacementStatusEqual string .
 * @param replacementStatusIn string .
 * @param partnerSortValueGreaterThanOrEqual int .
 * @param partnerSortValueLessThanOrEqual int .
 * @param rootEntryIdEqual string .
 * @param rootEntryIdIn string .
 * @param parentEntryIdEqual string .
 * @param entitledUsersEditMatchAnd string .
 * @param entitledUsersPublishMatchAnd string .
 * @param tagsNameMultiLikeOr string .
 * @param tagsAdminTagsMultiLikeOr string .
 * @param tagsAdminTagsNameMultiLikeOr string .
 * @param tagsNameMultiLikeAnd string .
 * @param tagsAdminTagsMultiLikeAnd string .
 * @param tagsAdminTagsNameMultiLikeAnd string .
 */
function KalturaBaseEntryBaseFilter(){
	KalturaBaseEntryBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.idNotIn = null;
	this.nameLike = null;
	this.nameMultiLikeOr = null;
	this.nameMultiLikeAnd = null;
	this.nameEqual = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.userIdEqual = null;
	this.userIdIn = null;
	this.creatorIdEqual = null;
	this.tagsLike = null;
	this.tagsMultiLikeOr = null;
	this.tagsMultiLikeAnd = null;
	this.adminTagsLike = null;
	this.adminTagsMultiLikeOr = null;
	this.adminTagsMultiLikeAnd = null;
	this.categoriesMatchAnd = null;
	this.categoriesMatchOr = null;
	this.categoriesNotContains = null;
	this.categoriesIdsMatchAnd = null;
	this.categoriesIdsMatchOr = null;
	this.categoriesIdsNotContains = null;
	this.categoriesIdsEmpty = null;
	this.statusEqual = null;
	this.statusNotEqual = null;
	this.statusIn = null;
	this.statusNotIn = null;
	this.moderationStatusEqual = null;
	this.moderationStatusNotEqual = null;
	this.moderationStatusIn = null;
	this.moderationStatusNotIn = null;
	this.typeEqual = null;
	this.typeIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.totalRankLessThanOrEqual = null;
	this.totalRankGreaterThanOrEqual = null;
	this.groupIdEqual = null;
	this.searchTextMatchAnd = null;
	this.searchTextMatchOr = null;
	this.accessControlIdEqual = null;
	this.accessControlIdIn = null;
	this.startDateGreaterThanOrEqual = null;
	this.startDateLessThanOrEqual = null;
	this.startDateGreaterThanOrEqualOrNull = null;
	this.startDateLessThanOrEqualOrNull = null;
	this.endDateGreaterThanOrEqual = null;
	this.endDateLessThanOrEqual = null;
	this.endDateGreaterThanOrEqualOrNull = null;
	this.endDateLessThanOrEqualOrNull = null;
	this.referenceIdEqual = null;
	this.referenceIdIn = null;
	this.replacingEntryIdEqual = null;
	this.replacingEntryIdIn = null;
	this.replacedEntryIdEqual = null;
	this.replacedEntryIdIn = null;
	this.replacementStatusEqual = null;
	this.replacementStatusIn = null;
	this.partnerSortValueGreaterThanOrEqual = null;
	this.partnerSortValueLessThanOrEqual = null;
	this.rootEntryIdEqual = null;
	this.rootEntryIdIn = null;
	this.parentEntryIdEqual = null;
	this.entitledUsersEditMatchAnd = null;
	this.entitledUsersPublishMatchAnd = null;
	this.tagsNameMultiLikeOr = null;
	this.tagsAdminTagsMultiLikeOr = null;
	this.tagsAdminTagsNameMultiLikeOr = null;
	this.tagsNameMultiLikeAnd = null;
	this.tagsAdminTagsMultiLikeAnd = null;
	this.tagsAdminTagsNameMultiLikeAnd = null;
}
module.exports.KalturaBaseEntryBaseFilter = KalturaBaseEntryBaseFilter;

util.inherits(KalturaBaseEntryBaseFilter, KalturaRelatedFilter);


/**
 * @param freeText string .
 * @param isRoot int .
 * @param categoriesFullNameIn string .
 * @param categoryAncestorIdIn string All entries within this categoy or in child categories.
 * @param redirectFromEntryId string The id of the original entry.
 */
function KalturaBaseEntryFilter(){
	KalturaBaseEntryFilter.super_.call(this);
	this.freeText = null;
	this.isRoot = null;
	this.categoriesFullNameIn = null;
	this.categoryAncestorIdIn = null;
	this.redirectFromEntryId = null;
}
module.exports.KalturaBaseEntryFilter = KalturaBaseEntryFilter;

util.inherits(KalturaBaseEntryFilter, KalturaBaseEntryBaseFilter);


/**
 * @param lastPlayedAtGreaterThanOrEqual int .
 * @param lastPlayedAtLessThanOrEqual int .
 * @param durationLessThan int .
 * @param durationGreaterThan int .
 * @param durationLessThanOrEqual int .
 * @param durationGreaterThanOrEqual int .
 * @param durationTypeMatchOr string .
 */
function KalturaPlayableEntryBaseFilter(){
	KalturaPlayableEntryBaseFilter.super_.call(this);
	this.lastPlayedAtGreaterThanOrEqual = null;
	this.lastPlayedAtLessThanOrEqual = null;
	this.durationLessThan = null;
	this.durationGreaterThan = null;
	this.durationLessThanOrEqual = null;
	this.durationGreaterThanOrEqual = null;
	this.durationTypeMatchOr = null;
}
module.exports.KalturaPlayableEntryBaseFilter = KalturaPlayableEntryBaseFilter;

util.inherits(KalturaPlayableEntryBaseFilter, KalturaBaseEntryFilter);


/**
 */
function KalturaPlayableEntryFilter(){
	KalturaPlayableEntryFilter.super_.call(this);
}
module.exports.KalturaPlayableEntryFilter = KalturaPlayableEntryFilter;

util.inherits(KalturaPlayableEntryFilter, KalturaPlayableEntryBaseFilter);


/**
 * @param mediaTypeEqual int .
 * @param mediaTypeIn string .
 * @param sourceTypeEqual string .
 * @param sourceTypeNotEqual string .
 * @param sourceTypeIn string .
 * @param sourceTypeNotIn string .
 * @param mediaDateGreaterThanOrEqual int .
 * @param mediaDateLessThanOrEqual int .
 * @param flavorParamsIdsMatchOr string .
 * @param flavorParamsIdsMatchAnd string .
 */
function KalturaMediaEntryBaseFilter(){
	KalturaMediaEntryBaseFilter.super_.call(this);
	this.mediaTypeEqual = null;
	this.mediaTypeIn = null;
	this.sourceTypeEqual = null;
	this.sourceTypeNotEqual = null;
	this.sourceTypeIn = null;
	this.sourceTypeNotIn = null;
	this.mediaDateGreaterThanOrEqual = null;
	this.mediaDateLessThanOrEqual = null;
	this.flavorParamsIdsMatchOr = null;
	this.flavorParamsIdsMatchAnd = null;
}
module.exports.KalturaMediaEntryBaseFilter = KalturaMediaEntryBaseFilter;

util.inherits(KalturaMediaEntryBaseFilter, KalturaPlayableEntryFilter);


/**
 */
function KalturaMediaEntryFilter(){
	KalturaMediaEntryFilter.super_.call(this);
}
module.exports.KalturaMediaEntryFilter = KalturaMediaEntryFilter;

util.inherits(KalturaMediaEntryFilter, KalturaMediaEntryBaseFilter);


/**
 * @param limit int .
 */
function KalturaMediaEntryFilterForPlaylist(){
	KalturaMediaEntryFilterForPlaylist.super_.call(this);
	this.limit = null;
}
module.exports.KalturaMediaEntryFilterForPlaylist = KalturaMediaEntryFilterForPlaylist;

util.inherits(KalturaMediaEntryFilterForPlaylist, KalturaMediaEntryFilter);


/**
 * @param id int The id of the media info (readOnly).
 * @param flavorAssetId string The id of the related flavor asset.
 * @param fileSize int The file size.
 * @param containerFormat string The container format.
 * @param containerId string The container id.
 * @param containerProfile string The container profile.
 * @param containerDuration int The container duration.
 * @param containerBitRate int The container bit rate.
 * @param videoFormat string The video format.
 * @param videoCodecId string The video codec id.
 * @param videoDuration int The video duration.
 * @param videoBitRate int The video bit rate.
 * @param videoBitRateMode int The video bit rate mode.
 * @param videoWidth int The video width.
 * @param videoHeight int The video height.
 * @param videoFrameRate float The video frame rate.
 * @param videoDar float The video display aspect ratio (dar).
 * @param videoRotation int .
 * @param audioFormat string The audio format.
 * @param audioCodecId string The audio codec id.
 * @param audioDuration int The audio duration.
 * @param audioBitRate int The audio bit rate.
 * @param audioBitRateMode int The audio bit rate mode.
 * @param audioChannels int The number of audio channels.
 * @param audioSamplingRate int The audio sampling rate.
 * @param audioResolution int The audio resolution.
 * @param writingLib string The writing library.
 * @param rawData string The data as returned by the mediainfo command line.
 * @param multiStreamInfo string .
 * @param scanType int .
 * @param multiStream string .
 * @param isFastStart int .
 * @param contentStreams string .
 */
function KalturaMediaInfo(){
	KalturaMediaInfo.super_.call(this);
	this.id = null;
	this.flavorAssetId = null;
	this.fileSize = null;
	this.containerFormat = null;
	this.containerId = null;
	this.containerProfile = null;
	this.containerDuration = null;
	this.containerBitRate = null;
	this.videoFormat = null;
	this.videoCodecId = null;
	this.videoDuration = null;
	this.videoBitRate = null;
	this.videoBitRateMode = null;
	this.videoWidth = null;
	this.videoHeight = null;
	this.videoFrameRate = null;
	this.videoDar = null;
	this.videoRotation = null;
	this.audioFormat = null;
	this.audioCodecId = null;
	this.audioDuration = null;
	this.audioBitRate = null;
	this.audioBitRateMode = null;
	this.audioChannels = null;
	this.audioSamplingRate = null;
	this.audioResolution = null;
	this.writingLib = null;
	this.rawData = null;
	this.multiStreamInfo = null;
	this.scanType = null;
	this.multiStream = null;
	this.isFastStart = null;
	this.contentStreams = null;
}
module.exports.KalturaMediaInfo = KalturaMediaInfo;

util.inherits(KalturaMediaInfo, kaltura.KalturaObjectBase);


/**
 * @param id int Unique identifier (readOnly).
 * @param dc int Server data center id (readOnly).
 * @param hostname string Server host name (readOnly).
 * @param createdAt int Server first registration date as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Server last update date as Unix timestamp (In seconds) (readOnly).
 */
function KalturaMediaServer(){
	KalturaMediaServer.super_.call(this);
	this.id = null;
	this.dc = null;
	this.hostname = null;
	this.createdAt = null;
	this.updatedAt = null;
}
module.exports.KalturaMediaServer = KalturaMediaServer;

util.inherits(KalturaMediaServer, kaltura.KalturaObjectBase);


/**
 */
function KalturaMediaServerStatus(){
	KalturaMediaServerStatus.super_.call(this);
}
module.exports.KalturaMediaServerStatus = KalturaMediaServerStatus;

util.inherits(KalturaMediaServerStatus, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param partnerId int  (readOnly).
 * @param metadataProfileId int  (readOnly).
 * @param metadataProfileVersion int  (readOnly).
 * @param metadataObjectType string  (readOnly).
 * @param objectId string  (readOnly).
 * @param version int  (readOnly).
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param status int  (readOnly).
 * @param xml string  (readOnly).
 */
function KalturaMetadata(){
	KalturaMetadata.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.metadataProfileId = null;
	this.metadataProfileVersion = null;
	this.metadataObjectType = null;
	this.objectId = null;
	this.version = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.status = null;
	this.xml = null;
}
module.exports.KalturaMetadata = KalturaMetadata;

util.inherits(KalturaMetadata, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param partnerId int  (readOnly).
 * @param metadataObjectType string .
 * @param version int  (readOnly).
 * @param name string .
 * @param systemName string .
 * @param description string .
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param status int  (readOnly).
 * @param xsd string  (readOnly).
 * @param views string  (readOnly).
 * @param xslt string  (readOnly).
 * @param createMode int .
 */
function KalturaMetadataProfile(){
	KalturaMetadataProfile.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.metadataObjectType = null;
	this.version = null;
	this.name = null;
	this.systemName = null;
	this.description = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.status = null;
	this.xsd = null;
	this.views = null;
	this.xslt = null;
	this.createMode = null;
}
module.exports.KalturaMetadataProfile = KalturaMetadataProfile;

util.inherits(KalturaMetadataProfile, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param xPath string  (readOnly).
 * @param key string  (readOnly).
 * @param label string  (readOnly).
 */
function KalturaMetadataProfileField(){
	KalturaMetadataProfileField.super_.call(this);
	this.id = null;
	this.xPath = null;
	this.key = null;
	this.label = null;
}
module.exports.KalturaMetadataProfileField = KalturaMetadataProfileField;

util.inherits(KalturaMetadataProfileField, kaltura.KalturaObjectBase);


/**
 * @param hasRealThumbnail bool Indicates whether the user has submited a real thumbnail to the mix (Not the one that was generated automaticaly) (readOnly).
 * @param editorType int The editor type used to edit the metadata.
 * @param dataContent string The xml data of the mix.
 */
function KalturaMixEntry(){
	KalturaMixEntry.super_.call(this);
	this.hasRealThumbnail = null;
	this.editorType = null;
	this.dataContent = null;
}
module.exports.KalturaMixEntry = KalturaMixEntry;

util.inherits(KalturaMixEntry, KalturaPlayableEntry);


/**
 * @param id int Moderation flag id (readOnly).
 * @param partnerId int  (readOnly).
 * @param userId string The user id that added the moderation flag (readOnly).
 * @param moderationObjectType string The type of the moderation flag (entry or user) (readOnly).
 * @param flaggedEntryId string If moderation flag is set for entry, this is the flagged entry id.
 * @param flaggedUserId string If moderation flag is set for user, this is the flagged user id.
 * @param status string The moderation flag status (readOnly).
 * @param comments string The comment that was added to the flag.
 * @param flagType int .
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 */
function KalturaModerationFlag(){
	KalturaModerationFlag.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.userId = null;
	this.moderationObjectType = null;
	this.flaggedEntryId = null;
	this.flaggedUserId = null;
	this.status = null;
	this.comments = null;
	this.flagType = null;
	this.createdAt = null;
	this.updatedAt = null;
}
module.exports.KalturaModerationFlag = KalturaModerationFlag;

util.inherits(KalturaModerationFlag, kaltura.KalturaObjectBase);


/**
 * @param relatedObjects map .
 */
function KalturaObject(){
	KalturaObject.super_.call(this);
	this.relatedObjects = null;
}
module.exports.KalturaObject = KalturaObject;

util.inherits(KalturaObject, kaltura.KalturaObjectBase);


/**
 * @param type string  (readOnly).
 * @param stopProcessingOnError bool .
 */
function KalturaObjectTask(){
	KalturaObjectTask.super_.call(this);
	this.type = null;
	this.stopProcessingOnError = null;
}
module.exports.KalturaObjectTask = KalturaObjectTask;

util.inherits(KalturaObjectTask, kaltura.KalturaObjectBase);


/**
 * @param id string .
 * @param label string .
 * @param flashvars array .
 * @param minVersion string .
 * @param enabledByDefault bool .
 */
function KalturaPlayerDeliveryType(){
	KalturaPlayerDeliveryType.super_.call(this);
	this.id = null;
	this.label = null;
	this.flashvars = null;
	this.minVersion = null;
	this.enabledByDefault = null;
}
module.exports.KalturaPlayerDeliveryType = KalturaPlayerDeliveryType;

util.inherits(KalturaPlayerDeliveryType, kaltura.KalturaObjectBase);


/**
 * @param id string .
 * @param label string .
 * @param entryOnly bool .
 * @param minVersion string .
 */
function KalturaPlayerEmbedCodeType(){
	KalturaPlayerEmbedCodeType.super_.call(this);
	this.id = null;
	this.label = null;
	this.entryOnly = null;
	this.minVersion = null;
}
module.exports.KalturaPlayerEmbedCodeType = KalturaPlayerEmbedCodeType;

util.inherits(KalturaPlayerEmbedCodeType, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param name string .
 * @param website string .
 * @param notificationUrl string .
 * @param appearInSearch int .
 * @param createdAt int  (readOnly).
 * @param adminName string deprecated - lastName and firstName replaces this field.
 * @param adminEmail string .
 * @param description string .
 * @param commercialUse int .
 * @param landingPage string .
 * @param userLandingPage string .
 * @param contentCategories string .
 * @param type int .
 * @param phone string .
 * @param describeYourself string .
 * @param adultContent bool .
 * @param defConversionProfileType string .
 * @param notify int .
 * @param status int  (readOnly).
 * @param allowQuickEdit int .
 * @param mergeEntryLists int .
 * @param notificationsConfig string .
 * @param maxUploadSize int .
 * @param partnerPackage int  (readOnly).
 * @param secret string  (readOnly).
 * @param adminSecret string  (readOnly).
 * @param cmsPassword string  (readOnly).
 * @param allowMultiNotification int .
 * @param adminLoginUsersQuota int  (readOnly).
 * @param adminUserId string .
 * @param firstName string firstName and lastName replace the old (deprecated) adminName.
 * @param lastName string lastName and firstName replace the old (deprecated) adminName.
 * @param country string country code (2char) - this field is optional.
 * @param state string state code (2char) - this field is optional.
 * @param additionalParams array  (insertOnly).
 * @param publishersQuota int  (readOnly).
 * @param partnerGroupType int  (readOnly).
 * @param defaultEntitlementEnforcement bool  (readOnly).
 * @param defaultDeliveryType string  (readOnly).
 * @param defaultEmbedCodeType string  (readOnly).
 * @param deliveryTypes array  (readOnly).
 * @param embedCodeTypes array  (readOnly).
 * @param templatePartnerId int  (readOnly).
 * @param ignoreSeoLinks bool  (readOnly).
 * @param host string  (readOnly).
 * @param cdnHost string  (readOnly).
 * @param isFirstLogin bool  (readOnly).
 * @param logoutUrl string  (readOnly).
 * @param partnerParentId int  (readOnly).
 * @param crmId string  (readOnly).
 * @param referenceId string .
 */
function KalturaPartner(){
	KalturaPartner.super_.call(this);
	this.id = null;
	this.name = null;
	this.website = null;
	this.notificationUrl = null;
	this.appearInSearch = null;
	this.createdAt = null;
	this.adminName = null;
	this.adminEmail = null;
	this.description = null;
	this.commercialUse = null;
	this.landingPage = null;
	this.userLandingPage = null;
	this.contentCategories = null;
	this.type = null;
	this.phone = null;
	this.describeYourself = null;
	this.adultContent = null;
	this.defConversionProfileType = null;
	this.notify = null;
	this.status = null;
	this.allowQuickEdit = null;
	this.mergeEntryLists = null;
	this.notificationsConfig = null;
	this.maxUploadSize = null;
	this.partnerPackage = null;
	this.secret = null;
	this.adminSecret = null;
	this.cmsPassword = null;
	this.allowMultiNotification = null;
	this.adminLoginUsersQuota = null;
	this.adminUserId = null;
	this.firstName = null;
	this.lastName = null;
	this.country = null;
	this.state = null;
	this.additionalParams = null;
	this.publishersQuota = null;
	this.partnerGroupType = null;
	this.defaultEntitlementEnforcement = null;
	this.defaultDeliveryType = null;
	this.defaultEmbedCodeType = null;
	this.deliveryTypes = null;
	this.embedCodeTypes = null;
	this.templatePartnerId = null;
	this.ignoreSeoLinks = null;
	this.host = null;
	this.cdnHost = null;
	this.isFirstLogin = null;
	this.logoutUrl = null;
	this.partnerParentId = null;
	this.crmId = null;
	this.referenceId = null;
}
module.exports.KalturaPartner = KalturaPartner;

util.inherits(KalturaPartner, kaltura.KalturaObjectBase);


/**
 * @param packageBandwidthAndStorage int Package total allowed bandwidth and storage (readOnly).
 * @param hosting float Partner total hosting in GB on the disk (readOnly).
 * @param bandwidth float Partner total bandwidth in GB (readOnly).
 * @param usage int total usage in GB - including bandwidth and storage (readOnly).
 * @param usagePercent float Percent of usage out of partner's package. if usage is 5GB and package is 10GB, this value will be 50 (readOnly).
 * @param reachedLimitDate int date when partner reached the limit of his package (timestamp) (readOnly).
 */
function KalturaPartnerStatistics(){
	KalturaPartnerStatistics.super_.call(this);
	this.packageBandwidthAndStorage = null;
	this.hosting = null;
	this.bandwidth = null;
	this.usage = null;
	this.usagePercent = null;
	this.reachedLimitDate = null;
}
module.exports.KalturaPartnerStatistics = KalturaPartnerStatistics;

util.inherits(KalturaPartnerStatistics, kaltura.KalturaObjectBase);


/**
 * @param hostingGB float Partner total hosting in GB on the disk (readOnly).
 * @param Percent float percent of usage out of partner's package. if usageGB is 5 and package is 10GB, this value will be 50 (readOnly).
 * @param packageBW int package total BW - actually this is usage, which represents BW+storage (readOnly).
 * @param usageGB float total usage in GB - including bandwidth and storage (readOnly).
 * @param reachedLimitDate int date when partner reached the limit of his package (timestamp) (readOnly).
 * @param usageGraph string a semi-colon separated list of comma-separated key-values to represent a usage graph.
 * keys could be 1-12 for a year view (1,1.2;2,1.1;3,0.9;...;12,1.4;)
 * keys could be 1-[28,29,30,31] depending on the requested month, for a daily view in a given month (1,0.4;2,0.2;...;31,0.1;) (readOnly).
 */
function KalturaPartnerUsage(){
	KalturaPartnerUsage.super_.call(this);
	this.hostingGB = null;
	this.Percent = null;
	this.packageBW = null;
	this.usageGB = null;
	this.reachedLimitDate = null;
	this.usageGraph = null;
}
module.exports.KalturaPartnerUsage = KalturaPartnerUsage;

util.inherits(KalturaPartnerUsage, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param type int  (readOnly).
 * @param name string .
 * @param friendlyName string .
 * @param description string .
 * @param status int .
 * @param partnerId int  (readOnly).
 * @param dependsOnPermissionNames string .
 * @param tags string .
 * @param permissionItemsIds string .
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param partnerGroup string .
 */
function KalturaPermission(){
	KalturaPermission.super_.call(this);
	this.id = null;
	this.type = null;
	this.name = null;
	this.friendlyName = null;
	this.description = null;
	this.status = null;
	this.partnerId = null;
	this.dependsOnPermissionNames = null;
	this.tags = null;
	this.permissionItemsIds = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.partnerGroup = null;
}
module.exports.KalturaPermission = KalturaPermission;

util.inherits(KalturaPermission, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param type string  (readOnly).
 * @param partnerId int  (readOnly).
 * @param tags string .
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 */
function KalturaPermissionItem(){
	KalturaPermissionItem.super_.call(this);
	this.id = null;
	this.type = null;
	this.partnerId = null;
	this.tags = null;
	this.createdAt = null;
	this.updatedAt = null;
}
module.exports.KalturaPermissionItem = KalturaPermissionItem;

util.inherits(KalturaPermissionItem, kaltura.KalturaObjectBase);


/**
 * @param type string The type of the play enabler.
 */
function KalturaPlayReadyAnalogVideoOPIdHolder(){
	KalturaPlayReadyAnalogVideoOPIdHolder.super_.call(this);
	this.type = null;
}
module.exports.KalturaPlayReadyAnalogVideoOPIdHolder = KalturaPlayReadyAnalogVideoOPIdHolder;

util.inherits(KalturaPlayReadyAnalogVideoOPIdHolder, kaltura.KalturaObjectBase);


/**
 * @param keyId string Guid - key id of the specific content.
 * @param contentKey string License content key 64 bit encoded.
 */
function KalturaPlayReadyContentKey(){
	KalturaPlayReadyContentKey.super_.call(this);
	this.keyId = null;
	this.contentKey = null;
}
module.exports.KalturaPlayReadyContentKey = KalturaPlayReadyContentKey;

util.inherits(KalturaPlayReadyContentKey, kaltura.KalturaObjectBase);


/**
 * @param type string The type of the copy enabler.
 */
function KalturaPlayReadyCopyEnablerHolder(){
	KalturaPlayReadyCopyEnablerHolder.super_.call(this);
	this.type = null;
}
module.exports.KalturaPlayReadyCopyEnablerHolder = KalturaPlayReadyCopyEnablerHolder;

util.inherits(KalturaPlayReadyCopyEnablerHolder, kaltura.KalturaObjectBase);


/**
 * @param type string The type of the play enabler.
 */
function KalturaPlayReadyDigitalAudioOPIdHolder(){
	KalturaPlayReadyDigitalAudioOPIdHolder.super_.call(this);
	this.type = null;
}
module.exports.KalturaPlayReadyDigitalAudioOPIdHolder = KalturaPlayReadyDigitalAudioOPIdHolder;

util.inherits(KalturaPlayReadyDigitalAudioOPIdHolder, kaltura.KalturaObjectBase);


/**
 */
function KalturaPlayReadyRight(){
	KalturaPlayReadyRight.super_.call(this);
}
module.exports.KalturaPlayReadyRight = KalturaPlayReadyRight;

util.inherits(KalturaPlayReadyRight, kaltura.KalturaObjectBase);


/**
 * @param gracePeriod int .
 * @param licenseRemovalPolicy int .
 * @param licenseRemovalDuration int .
 * @param minSecurityLevel int .
 * @param rights array .
 */
function KalturaPlayReadyPolicy(){
	KalturaPlayReadyPolicy.super_.call(this);
	this.gracePeriod = null;
	this.licenseRemovalPolicy = null;
	this.licenseRemovalDuration = null;
	this.minSecurityLevel = null;
	this.rights = null;
}
module.exports.KalturaPlayReadyPolicy = KalturaPlayReadyPolicy;

util.inherits(KalturaPlayReadyPolicy, KalturaDrmPolicy);


/**
 * @param policy KalturaPlayReadyPolicy PlayReady policy object.
 * @param beginDate int License begin date.
 * @param expirationDate int License expiration date.
 * @param removalDate int License removal date.
 */
function KalturaPlayReadyLicenseDetails(){
	KalturaPlayReadyLicenseDetails.super_.call(this);
	this.policy = null;
	this.beginDate = null;
	this.expirationDate = null;
	this.removalDate = null;
}
module.exports.KalturaPlayReadyLicenseDetails = KalturaPlayReadyLicenseDetails;

util.inherits(KalturaPlayReadyLicenseDetails, kaltura.KalturaObjectBase);


/**
 * @param type string The type of the play enabler.
 */
function KalturaPlayReadyPlayEnablerHolder(){
	KalturaPlayReadyPlayEnablerHolder.super_.call(this);
	this.type = null;
}
module.exports.KalturaPlayReadyPlayEnablerHolder = KalturaPlayReadyPlayEnablerHolder;

util.inherits(KalturaPlayReadyPlayEnablerHolder, kaltura.KalturaObjectBase);


/**
 * @param playlistContent string Content of the playlist -
 * XML if the playlistType is dynamic
 * text if the playlistType is static
 * url if the playlistType is mRss.
 * @param filters array .
 * @param totalResults int Maximum count of results to be returned in playlist execution.
 * @param playlistType int Type of playlist.
 * @param plays int Number of plays (readOnly).
 * @param views int Number of views (readOnly).
 * @param duration int The duration in seconds (readOnly).
 * @param executeUrl string The url for this playlist (readOnly).
 */
function KalturaPlaylist(){
	KalturaPlaylist.super_.call(this);
	this.playlistContent = null;
	this.filters = null;
	this.totalResults = null;
	this.playlistType = null;
	this.plays = null;
	this.views = null;
	this.duration = null;
	this.executeUrl = null;
}
module.exports.KalturaPlaylist = KalturaPlaylist;

util.inherits(KalturaPlaylist, KalturaBaseEntry);


/**
 * @param storageProfileId int  (readOnly).
 * @param uri string  (readOnly).
 */
function KalturaRemotePath(){
	KalturaRemotePath.super_.call(this);
	this.storageProfileId = null;
	this.uri = null;
}
module.exports.KalturaRemotePath = KalturaRemotePath;

util.inherits(KalturaRemotePath, kaltura.KalturaObjectBase);


/**
 * @param url string Remote URL, FTP, HTTP or HTTPS.
 * @param forceAsyncDownload bool Force Import Job.
 */
function KalturaUrlResource(){
	KalturaUrlResource.super_.call(this);
	this.url = null;
	this.forceAsyncDownload = null;
}
module.exports.KalturaUrlResource = KalturaUrlResource;

util.inherits(KalturaUrlResource, KalturaContentResource);


/**
 * @param storageProfileId int ID of storage profile to be associated with the created file sync, used for file serving URL composing.
 */
function KalturaRemoteStorageResource(){
	KalturaRemoteStorageResource.super_.call(this);
	this.storageProfileId = null;
}
module.exports.KalturaRemoteStorageResource = KalturaRemoteStorageResource;

util.inherits(KalturaRemoteStorageResource, KalturaUrlResource);


/**
 * @param id int Report id (readOnly).
 * @param partnerId int Partner id associated with the report.
 * @param name string Report name.
 * @param systemName string Used to identify system reports in a friendly way.
 * @param description string Report description.
 * @param query string Report query.
 * @param createdAt int Creation date as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Last update date as Unix timestamp (In seconds) (readOnly).
 */
function KalturaReport(){
	KalturaReport.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.name = null;
	this.systemName = null;
	this.description = null;
	this.query = null;
	this.createdAt = null;
	this.updatedAt = null;
}
module.exports.KalturaReport = KalturaReport;

util.inherits(KalturaReport, kaltura.KalturaObjectBase);


/**
 * @param id string .
 * @param data string .
 */
function KalturaReportBaseTotal(){
	KalturaReportBaseTotal.super_.call(this);
	this.id = null;
	this.data = null;
}
module.exports.KalturaReportBaseTotal = KalturaReportBaseTotal;

util.inherits(KalturaReportBaseTotal, kaltura.KalturaObjectBase);


/**
 * @param id string .
 * @param data string .
 */
function KalturaReportGraph(){
	KalturaReportGraph.super_.call(this);
	this.id = null;
	this.data = null;
}
module.exports.KalturaReportGraph = KalturaReportGraph;

util.inherits(KalturaReportGraph, kaltura.KalturaObjectBase);


/**
 * @param fromDate int Start date as Unix timestamp (In seconds).
 * @param toDate int End date as Unix timestamp (In seconds).
 * @param fromDay string Start day as string (YYYYMMDD).
 * @param toDay string End date as string (YYYYMMDD).
 */
function KalturaReportInputBaseFilter(){
	KalturaReportInputBaseFilter.super_.call(this);
	this.fromDate = null;
	this.toDate = null;
	this.fromDay = null;
	this.toDay = null;
}
module.exports.KalturaReportInputBaseFilter = KalturaReportInputBaseFilter;

util.inherits(KalturaReportInputBaseFilter, kaltura.KalturaObjectBase);


/**
 * @param columns string .
 * @param results array .
 */
function KalturaReportResponse(){
	KalturaReportResponse.super_.call(this);
	this.columns = null;
	this.results = null;
}
module.exports.KalturaReportResponse = KalturaReportResponse;

util.inherits(KalturaReportResponse, kaltura.KalturaObjectBase);


/**
 * @param header string  (readOnly).
 * @param data string  (readOnly).
 * @param totalCount int  (readOnly).
 */
function KalturaReportTable(){
	KalturaReportTable.super_.call(this);
	this.header = null;
	this.data = null;
	this.totalCount = null;
}
module.exports.KalturaReportTable = KalturaReportTable;

util.inherits(KalturaReportTable, kaltura.KalturaObjectBase);


/**
 * @param header string .
 * @param data string .
 */
function KalturaReportTotal(){
	KalturaReportTotal.super_.call(this);
	this.header = null;
	this.data = null;
}
module.exports.KalturaReportTotal = KalturaReportTotal;

util.inherits(KalturaReportTotal, kaltura.KalturaObjectBase);


/**
 * @param partnerId int Impersonated partner id.
 * @param ks string Kaltura API session.
 * @param responseProfile KalturaBaseResponseProfile Response profile.
 */
function KalturaRequestConfiguration(){
	KalturaRequestConfiguration.super_.call(this);
	this.partnerId = null;
	this.ks = null;
	this.responseProfile = null;
}
module.exports.KalturaRequestConfiguration = KalturaRequestConfiguration;

util.inherits(KalturaRequestConfiguration, kaltura.KalturaObjectBase);


/**
 * @param id int Auto generated numeric identifier (readOnly).
 * @param systemName string Unique system name.
 * @param partnerId int  (readOnly).
 * @param createdAt int Creation time as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Update time as Unix timestamp (In seconds) (readOnly).
 * @param status int  (readOnly).
 */
function KalturaResponseProfile(){
	KalturaResponseProfile.super_.call(this);
	this.id = null;
	this.systemName = null;
	this.partnerId = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.status = null;
}
module.exports.KalturaResponseProfile = KalturaResponseProfile;

util.inherits(KalturaResponseProfile, KalturaDetachedResponseProfile);


/**
 * @param id int  (readOnly).
 * @param partnerId int  (readOnly).
 * @param name string .
 * @param systemName string .
 * @param description string .
 * @param status int .
 * @param objectFilterEngineType string The type of engine to use to list objects using the given "objectFilter".
 * @param objectFilter KalturaFilter A filter object (inherits KalturaFilter) that is used to list objects for scheduled tasks.
 * @param objectTasks array A list of tasks to execute on the founded objects.
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param lastExecutionStartedAt int .
 * @param maxTotalCountAllowed int The maximum number of result count allowed to be processed by this profile per execution.
 */
function KalturaScheduledTaskProfile(){
	KalturaScheduledTaskProfile.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.name = null;
	this.systemName = null;
	this.description = null;
	this.status = null;
	this.objectFilterEngineType = null;
	this.objectFilter = null;
	this.objectTasks = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.lastExecutionStartedAt = null;
	this.maxTotalCountAllowed = null;
}
module.exports.KalturaScheduledTaskProfile = KalturaScheduledTaskProfile;

util.inherits(KalturaScheduledTaskProfile, kaltura.KalturaObjectBase);


/**
 * @param id int The id of the Category (readOnly).
 * @param schedulerConfiguredId int The configured id of the scheduler.
 * @param workerConfiguredId int The configured id of the job worker.
 * @param workerType string The type of the job worker.
 * @param type int The status type.
 * @param value int The status value.
 * @param schedulerId int The id of the scheduler (readOnly).
 * @param workerId int The id of the worker (readOnly).
 */
function KalturaSchedulerStatus(){
	KalturaSchedulerStatus.super_.call(this);
	this.id = null;
	this.schedulerConfiguredId = null;
	this.workerConfiguredId = null;
	this.workerType = null;
	this.type = null;
	this.value = null;
	this.schedulerId = null;
	this.workerId = null;
}
module.exports.KalturaSchedulerStatus = KalturaSchedulerStatus;

util.inherits(KalturaSchedulerStatus, kaltura.KalturaObjectBase);


/**
 * @param id int The id of the Category (readOnly).
 * @param createdBy string Creator name.
 * @param updatedBy string Updater name.
 * @param commandId string Id of the control panel command that created this config item.
 * @param commandStatus string The status of the control panel command.
 * @param schedulerId int The id of the scheduler.
 * @param schedulerConfiguredId int The configured id of the scheduler.
 * @param schedulerName string The name of the scheduler.
 * @param workerId int The id of the job worker.
 * @param workerConfiguredId int The configured id of the job worker.
 * @param workerName string The name of the job worker.
 * @param variable string The name of the variable.
 * @param variablePart string The part of the variable.
 * @param value string The value of the variable.
 */
function KalturaSchedulerConfig(){
	KalturaSchedulerConfig.super_.call(this);
	this.id = null;
	this.createdBy = null;
	this.updatedBy = null;
	this.commandId = null;
	this.commandStatus = null;
	this.schedulerId = null;
	this.schedulerConfiguredId = null;
	this.schedulerName = null;
	this.workerId = null;
	this.workerConfiguredId = null;
	this.workerName = null;
	this.variable = null;
	this.variablePart = null;
	this.value = null;
}
module.exports.KalturaSchedulerConfig = KalturaSchedulerConfig;

util.inherits(KalturaSchedulerConfig, kaltura.KalturaObjectBase);


/**
 * @param id int The id of the Worker (readOnly).
 * @param configuredId int The id as configured in the batch config.
 * @param schedulerId int The id of the Scheduler.
 * @param schedulerConfiguredId int The id of the scheduler as configured in the batch config.
 * @param type string The worker type.
 * @param typeName string The friendly name of the type.
 * @param name string The scheduler name.
 * @param statuses array Array of the last statuses.
 * @param configs array Array of the last configs.
 * @param lockedJobs array Array of jobs that locked to this worker.
 * @param avgWait int Avarage time between creation and queue time.
 * @param avgWork int Avarage time between queue time end finish time.
 * @param lastStatus int last status time.
 * @param lastStatusStr string last status formated.
 */
function KalturaSchedulerWorker(){
	KalturaSchedulerWorker.super_.call(this);
	this.id = null;
	this.configuredId = null;
	this.schedulerId = null;
	this.schedulerConfiguredId = null;
	this.type = null;
	this.typeName = null;
	this.name = null;
	this.statuses = null;
	this.configs = null;
	this.lockedJobs = null;
	this.avgWait = null;
	this.avgWork = null;
	this.lastStatus = null;
	this.lastStatusStr = null;
}
module.exports.KalturaSchedulerWorker = KalturaSchedulerWorker;

util.inherits(KalturaSchedulerWorker, kaltura.KalturaObjectBase);


/**
 * @param id int The id of the Scheduler (readOnly).
 * @param configuredId int The id as configured in the batch config.
 * @param name string The scheduler name.
 * @param host string The host name.
 * @param statuses array Array of the last statuses (readOnly).
 * @param configs array Array of the last configs (readOnly).
 * @param workers array Array of the workers (readOnly).
 * @param createdAt int creation time (readOnly).
 * @param lastStatus int last status time (readOnly).
 * @param lastStatusStr string last status formated (readOnly).
 */
function KalturaScheduler(){
	KalturaScheduler.super_.call(this);
	this.id = null;
	this.configuredId = null;
	this.name = null;
	this.host = null;
	this.statuses = null;
	this.configs = null;
	this.workers = null;
	this.createdAt = null;
	this.lastStatus = null;
	this.lastStatusStr = null;
}
module.exports.KalturaScheduler = KalturaScheduler;

util.inherits(KalturaScheduler, kaltura.KalturaObjectBase);


/**
 */
function KalturaScope(){
	KalturaScope.super_.call(this);
}
module.exports.KalturaScope = KalturaScope;

util.inherits(KalturaScope, kaltura.KalturaObjectBase);


/**
 * @param keyWords string .
 * @param searchSource int .
 * @param mediaType int .
 * @param extraData string Use this field to pass dynamic data for searching
 * For example - if you set this field to "mymovies_$partner_id"
 * The $partner_id will be automatically replcaed with your real partner Id.
 * @param authData string .
 */
function KalturaSearch(){
	KalturaSearch.super_.call(this);
	this.keyWords = null;
	this.searchSource = null;
	this.mediaType = null;
	this.extraData = null;
	this.authData = null;
}
module.exports.KalturaSearch = KalturaSearch;

util.inherits(KalturaSearch, kaltura.KalturaObjectBase);


/**
 * @param authData string The authentication data that further should be used for search.
 * @param loginUrl string Login URL when user need to sign-in and authorize the search.
 * @param message string Information when there was an error.
 */
function KalturaSearchAuthData(){
	KalturaSearchAuthData.super_.call(this);
	this.authData = null;
	this.loginUrl = null;
	this.message = null;
}
module.exports.KalturaSearchAuthData = KalturaSearchAuthData;

util.inherits(KalturaSearchAuthData, kaltura.KalturaObjectBase);


/**
 * @param id string .
 * @param title string .
 * @param thumbUrl string .
 * @param description string .
 * @param tags string .
 * @param url string .
 * @param sourceLink string .
 * @param credit string .
 * @param licenseType int .
 * @param flashPlaybackType string .
 * @param fileExt string .
 */
function KalturaSearchResult(){
	KalturaSearchResult.super_.call(this);
	this.id = null;
	this.title = null;
	this.thumbUrl = null;
	this.description = null;
	this.tags = null;
	this.url = null;
	this.sourceLink = null;
	this.credit = null;
	this.licenseType = null;
	this.flashPlaybackType = null;
	this.fileExt = null;
}
module.exports.KalturaSearchResult = KalturaSearchResult;

util.inherits(KalturaSearchResult, KalturaSearch);


/**
 * @param objects array  (readOnly).
 * @param needMediaInfo bool  (readOnly).
 */
function KalturaSearchResultResponse(){
	KalturaSearchResultResponse.super_.call(this);
	this.objects = null;
	this.needMediaInfo = null;
}
module.exports.KalturaSearchResultResponse = KalturaSearchResultResponse;

util.inherits(KalturaSearchResultResponse, kaltura.KalturaObjectBase);


/**
 * @param ks string  (readOnly).
 * @param sessionType int  (readOnly).
 * @param partnerId int  (readOnly).
 * @param userId string  (readOnly).
 * @param expiry int  (readOnly).
 * @param privileges string  (readOnly).
 */
function KalturaSessionInfo(){
	KalturaSessionInfo.super_.call(this);
	this.ks = null;
	this.sessionType = null;
	this.partnerId = null;
	this.userId = null;
	this.expiry = null;
	this.privileges = null;
}
module.exports.KalturaSessionInfo = KalturaSessionInfo;

util.inherits(KalturaSessionInfo, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param expiresAt int .
 * @param partnerId int  (readOnly).
 * @param userId string .
 * @param name string .
 * @param systemName string .
 * @param fullUrl string .
 * @param status int .
 */
function KalturaShortLink(){
	KalturaShortLink.super_.call(this);
	this.id = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.expiresAt = null;
	this.partnerId = null;
	this.userId = null;
	this.name = null;
	this.systemName = null;
	this.fullUrl = null;
	this.status = null;
}
module.exports.KalturaShortLink = KalturaShortLink;

util.inherits(KalturaShortLink, kaltura.KalturaObjectBase);


/**
 * @param actualFileSyncLocalPath string The translated path as used by the scheduler.
 * @param assetId string .
 * @param assetParamsId int .
 */
function KalturaSourceFileSyncDescriptor(){
	KalturaSourceFileSyncDescriptor.super_.call(this);
	this.actualFileSyncLocalPath = null;
	this.assetId = null;
	this.assetParamsId = null;
}
module.exports.KalturaSourceFileSyncDescriptor = KalturaSourceFileSyncDescriptor;

util.inherits(KalturaSourceFileSyncDescriptor, KalturaFileSyncDescriptor);


/**
 * @param partnerId int  (readOnly).
 * @param ks string  (readOnly).
 * @param userId string  (readOnly).
 */
function KalturaStartWidgetSessionResponse(){
	KalturaStartWidgetSessionResponse.super_.call(this);
	this.partnerId = null;
	this.ks = null;
	this.userId = null;
}
module.exports.KalturaStartWidgetSessionResponse = KalturaStartWidgetSessionResponse;

util.inherits(KalturaStartWidgetSessionResponse, kaltura.KalturaObjectBase);


/**
 * @param clientVer string .
 * @param eventType int .
 * @param eventTimestamp float the client's timestamp of this event.
 * @param sessionId string a unique string generated by the client that will represent the client-side session: the primary component will pass it on to other components that sprout from it.
 * @param partnerId int .
 * @param entryId string .
 * @param uniqueViewer string the UV cookie - creates in the operational system and should be passed on ofr every event.
 * @param widgetId string .
 * @param uiconfId int .
 * @param userId string the partner's user id.
 * @param currentPoint int the timestamp along the video when the event happend.
 * @param duration int the duration of the video in milliseconds - will make it much faster than quering the db for each entry.
 * @param userIp string will be retrieved from the request of the user (readOnly).
 * @param processDuration int the time in milliseconds the event took.
 * @param controlId string the id of the GUI control - will be used in the future to better understand what the user clicked.
 * @param seek bool true if the user ever used seek in this session.
 * @param newPoint int timestamp of the new point on the timeline of the video after the user seeks.
 * @param referrer string the referrer of the client.
 * @param isFirstInSession bool will indicate if the event is thrown for the first video in the session.
 * @param applicationId string kaltura application name.
 * @param contextId int .
 * @param featureType int .
 */
function KalturaStatsEvent(){
	KalturaStatsEvent.super_.call(this);
	this.clientVer = null;
	this.eventType = null;
	this.eventTimestamp = null;
	this.sessionId = null;
	this.partnerId = null;
	this.entryId = null;
	this.uniqueViewer = null;
	this.widgetId = null;
	this.uiconfId = null;
	this.userId = null;
	this.currentPoint = null;
	this.duration = null;
	this.userIp = null;
	this.processDuration = null;
	this.controlId = null;
	this.seek = null;
	this.newPoint = null;
	this.referrer = null;
	this.isFirstInSession = null;
	this.applicationId = null;
	this.contextId = null;
	this.featureType = null;
}
module.exports.KalturaStatsEvent = KalturaStatsEvent;

util.inherits(KalturaStatsEvent, kaltura.KalturaObjectBase);


/**
 * @param clientVer string .
 * @param kmcEventActionPath string .
 * @param kmcEventType int .
 * @param eventTimestamp float the client's timestamp of this event.
 * @param sessionId string a unique string generated by the client that will represent the client-side session: the primary component will pass it on to other components that sprout from it.
 * @param partnerId int .
 * @param entryId string .
 * @param widgetId string .
 * @param uiconfId int .
 * @param userId string the partner's user id.
 * @param userIp string will be retrieved from the request of the user (readOnly).
 */
function KalturaStatsKmcEvent(){
	KalturaStatsKmcEvent.super_.call(this);
	this.clientVer = null;
	this.kmcEventActionPath = null;
	this.kmcEventType = null;
	this.eventTimestamp = null;
	this.sessionId = null;
	this.partnerId = null;
	this.entryId = null;
	this.widgetId = null;
	this.uiconfId = null;
	this.userId = null;
	this.userIp = null;
}
module.exports.KalturaStatsKmcEvent = KalturaStatsKmcEvent;

util.inherits(KalturaStatsKmcEvent, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param partnerId int  (readOnly).
 * @param name string .
 * @param systemName string .
 * @param desciption string .
 * @param status int .
 * @param protocol string .
 * @param storageUrl string .
 * @param storageBaseDir string .
 * @param storageUsername string .
 * @param storagePassword string .
 * @param storageFtpPassiveMode bool .
 * @param minFileSize int .
 * @param maxFileSize int .
 * @param flavorParamsIds string .
 * @param maxConcurrentConnections int .
 * @param pathManagerClass string .
 * @param pathManagerParams array .
 * @param trigger int No need to create enum for temp field.
 * @param deliveryPriority int Delivery Priority.
 * @param deliveryStatus int .
 * @param readyBehavior int .
 * @param allowAutoDelete int Flag sugnifying that the storage exported content should be deleted when soure entry is deleted.
 * @param createFileLink bool Indicates to the local file transfer manager to create a link to the file instead of copying it.
 * @param rules array Holds storage profile export rules.
 * @param deliveryProfileIds array Delivery profile ids.
 * @param privateKey string .
 * @param publicKey string .
 * @param passPhrase string .
 */
function KalturaStorageProfile(){
	KalturaStorageProfile.super_.call(this);
	this.id = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.partnerId = null;
	this.name = null;
	this.systemName = null;
	this.desciption = null;
	this.status = null;
	this.protocol = null;
	this.storageUrl = null;
	this.storageBaseDir = null;
	this.storageUsername = null;
	this.storagePassword = null;
	this.storageFtpPassiveMode = null;
	this.minFileSize = null;
	this.maxFileSize = null;
	this.flavorParamsIds = null;
	this.maxConcurrentConnections = null;
	this.pathManagerClass = null;
	this.pathManagerParams = null;
	this.trigger = null;
	this.deliveryPriority = null;
	this.deliveryStatus = null;
	this.readyBehavior = null;
	this.allowAutoDelete = null;
	this.createFileLink = null;
	this.rules = null;
	this.deliveryProfileIds = null;
	this.privateKey = null;
	this.publicKey = null;
	this.passPhrase = null;
}
module.exports.KalturaStorageProfile = KalturaStorageProfile;

util.inherits(KalturaStorageProfile, kaltura.KalturaObjectBase);


/**
 * @param totalEntryCount int the total count of entries that should appear in the feed without flavor filtering.
 * @param actualEntryCount int count of entries that will appear in the feed (including all relevant filters).
 * @param requireTranscodingCount int count of entries that requires transcoding in order to be included in feed.
 */
function KalturaSyndicationFeedEntryCount(){
	KalturaSyndicationFeedEntryCount.super_.call(this);
	this.totalEntryCount = null;
	this.actualEntryCount = null;
	this.requireTranscodingCount = null;
}
module.exports.KalturaSyndicationFeedEntryCount = KalturaSyndicationFeedEntryCount;

util.inherits(KalturaSyndicationFeedEntryCount, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param tag string  (readOnly).
 * @param taggedObjectType string  (readOnly).
 * @param partnerId int  (readOnly).
 * @param instanceCount int  (readOnly).
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 */
function KalturaTag(){
	KalturaTag.super_.call(this);
	this.id = null;
	this.tag = null;
	this.taggedObjectType = null;
	this.partnerId = null;
	this.instanceCount = null;
	this.createdAt = null;
	this.updatedAt = null;
}
module.exports.KalturaTag = KalturaTag;

util.inherits(KalturaTag, kaltura.KalturaObjectBase);


/**
 * @param thumbParamsId int The Flavor Params used to create this Flavor Asset (insertOnly).
 * @param width int The width of the Flavor Asset (readOnly).
 * @param height int The height of the Flavor Asset (readOnly).
 * @param status int The status of the asset (readOnly).
 */
function KalturaThumbAsset(){
	KalturaThumbAsset.super_.call(this);
	this.thumbParamsId = null;
	this.width = null;
	this.height = null;
	this.status = null;
}
module.exports.KalturaThumbAsset = KalturaThumbAsset;

util.inherits(KalturaThumbAsset, KalturaAsset);


/**
 * @param cropType int .
 * @param quality int .
 * @param cropX int .
 * @param cropY int .
 * @param cropWidth int .
 * @param cropHeight int .
 * @param videoOffset float .
 * @param width int .
 * @param height int .
 * @param scaleWidth float .
 * @param scaleHeight float .
 * @param backgroundColor string Hexadecimal value.
 * @param sourceParamsId int Id of the flavor params or the thumbnail params to be used as source for the thumbnail creation.
 * @param format string The container format of the Flavor Params.
 * @param density int The image density (dpi) for example: 72 or 96.
 * @param stripProfiles bool Strip profiles and comments.
 * @param videoOffsetInPercentage int Create thumbnail from the videoLengthpercentage second.
 */
function KalturaThumbParams(){
	KalturaThumbParams.super_.call(this);
	this.cropType = null;
	this.quality = null;
	this.cropX = null;
	this.cropY = null;
	this.cropWidth = null;
	this.cropHeight = null;
	this.videoOffset = null;
	this.width = null;
	this.height = null;
	this.scaleWidth = null;
	this.scaleHeight = null;
	this.backgroundColor = null;
	this.sourceParamsId = null;
	this.format = null;
	this.density = null;
	this.stripProfiles = null;
	this.videoOffsetInPercentage = null;
}
module.exports.KalturaThumbParams = KalturaThumbParams;

util.inherits(KalturaThumbParams, KalturaAssetParams);


/**
 * @param thumbParamsId int .
 * @param thumbParamsVersion string .
 * @param thumbAssetId string .
 * @param thumbAssetVersion string .
 * @param rotate int .
 */
function KalturaThumbParamsOutput(){
	KalturaThumbParamsOutput.super_.call(this);
	this.thumbParamsId = null;
	this.thumbParamsVersion = null;
	this.thumbAssetId = null;
	this.thumbAssetVersion = null;
	this.rotate = null;
}
module.exports.KalturaThumbParamsOutput = KalturaThumbParamsOutput;

util.inherits(KalturaThumbParamsOutput, KalturaThumbParams);


/**
 * @param download bool .
 */
function KalturaThumbnailServeOptions(){
	KalturaThumbnailServeOptions.super_.call(this);
	this.download = null;
}
module.exports.KalturaThumbnailServeOptions = KalturaThumbnailServeOptions;

util.inherits(KalturaThumbnailServeOptions, kaltura.KalturaObjectBase);


/**
 * @param objects array  (readOnly).
 * @param totalCount int  (readOnly).
 * @param lowerVersionCount int  (readOnly).
 */
function KalturaTransformMetadataResponse(){
	KalturaTransformMetadataResponse.super_.call(this);
	this.objects = null;
	this.totalCount = null;
	this.lowerVersionCount = null;
}
module.exports.KalturaTransformMetadataResponse = KalturaTransformMetadataResponse;

util.inherits(KalturaTransformMetadataResponse, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param name string Name of the uiConf, this is not a primary key.
 * @param description string .
 * @param partnerId int  (readOnly).
 * @param objType int .
 * @param objTypeAsString string  (readOnly).
 * @param width int .
 * @param height int .
 * @param htmlParams string .
 * @param swfUrl string .
 * @param confFilePath string  (readOnly).
 * @param confFile string .
 * @param confFileFeatures string .
 * @param config string .
 * @param confVars string .
 * @param useCdn bool .
 * @param tags string .
 * @param swfUrlVersion string .
 * @param createdAt int Entry creation date as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Entry creation date as Unix timestamp (In seconds) (readOnly).
 * @param creationMode int .
 * @param html5Url string .
 * @param version string UiConf version (readOnly).
 * @param partnerTags string .
 */
function KalturaUiConf(){
	KalturaUiConf.super_.call(this);
	this.id = null;
	this.name = null;
	this.description = null;
	this.partnerId = null;
	this.objType = null;
	this.objTypeAsString = null;
	this.width = null;
	this.height = null;
	this.htmlParams = null;
	this.swfUrl = null;
	this.confFilePath = null;
	this.confFile = null;
	this.confFileFeatures = null;
	this.config = null;
	this.confVars = null;
	this.useCdn = null;
	this.tags = null;
	this.swfUrlVersion = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.creationMode = null;
	this.html5Url = null;
	this.version = null;
	this.partnerTags = null;
}
module.exports.KalturaUiConf = KalturaUiConf;

util.inherits(KalturaUiConf, kaltura.KalturaObjectBase);


/**
 * @param type int UiConf Type.
 * @param versions array Available versions.
 * @param directory string The direcotry this type is saved at.
 * @param filename string Filename for this UiConf type.
 */
function KalturaUiConfTypeInfo(){
	KalturaUiConfTypeInfo.super_.call(this);
	this.type = null;
	this.versions = null;
	this.directory = null;
	this.filename = null;
}
module.exports.KalturaUiConfTypeInfo = KalturaUiConfTypeInfo;

util.inherits(KalturaUiConfTypeInfo, kaltura.KalturaObjectBase);


/**
 * @param uploadTokenId string .
 * @param fileSize int .
 * @param errorCode int .
 * @param errorDescription string .
 */
function KalturaUploadResponse(){
	KalturaUploadResponse.super_.call(this);
	this.uploadTokenId = null;
	this.fileSize = null;
	this.errorCode = null;
	this.errorDescription = null;
}
module.exports.KalturaUploadResponse = KalturaUploadResponse;

util.inherits(KalturaUploadResponse, kaltura.KalturaObjectBase);


/**
 * @param id string Upload token unique ID (readOnly).
 * @param partnerId int Partner ID of the upload token (readOnly).
 * @param userId string User id for the upload token (readOnly).
 * @param status int Status of the upload token (readOnly).
 * @param fileName string Name of the file for the upload token, can be empty when the upload token is created and will be updated internally after the file is uploaded (insertOnly).
 * @param fileSize float File size in bytes, can be empty when the upload token is created and will be updated internally after the file is uploaded (insertOnly).
 * @param uploadedFileSize float Uploaded file size in bytes, can be used to identify how many bytes were uploaded before resuming (readOnly).
 * @param createdAt int Creation date as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Last update date as Unix timestamp (In seconds) (readOnly).
 */
function KalturaUploadToken(){
	KalturaUploadToken.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.userId = null;
	this.status = null;
	this.fileName = null;
	this.fileSize = null;
	this.uploadedFileSize = null;
	this.createdAt = null;
	this.updatedAt = null;
}
module.exports.KalturaUploadToken = KalturaUploadToken;

util.inherits(KalturaUploadToken, kaltura.KalturaObjectBase);


/**
 * @param id string .
 * @param partnerId int  (readOnly).
 * @param type int .
 * @param screenName string .
 * @param fullName string .
 * @param email string .
 * @param dateOfBirth int .
 * @param country string .
 * @param state string .
 * @param city string .
 * @param zip string .
 * @param thumbnailUrl string .
 * @param description string .
 * @param tags string .
 * @param adminTags string Admin tags can be updated only by using an admin session.
 * @param gender int .
 * @param status int .
 * @param createdAt int Creation date as Unix timestamp (In seconds) (readOnly).
 * @param updatedAt int Last update date as Unix timestamp (In seconds) (readOnly).
 * @param partnerData string Can be used to store various partner related data as a string.
 * @param indexedPartnerDataInt int .
 * @param indexedPartnerDataString string .
 * @param storageSize int  (readOnly).
 * @param password string  (insertOnly).
 * @param firstName string .
 * @param lastName string .
 * @param isAdmin bool .
 * @param language string .
 * @param lastLoginTime int  (readOnly).
 * @param statusUpdatedAt int  (readOnly).
 * @param deletedAt int  (readOnly).
 * @param loginEnabled bool  (readOnly).
 * @param roleIds string .
 * @param roleNames string  (readOnly).
 * @param isAccountOwner bool  (readOnly).
 * @param allowedPartnerIds string .
 * @param allowedPartnerPackages string .
 */
function KalturaUser(){
	KalturaUser.super_.call(this);
	this.id = null;
	this.partnerId = null;
	this.type = null;
	this.screenName = null;
	this.fullName = null;
	this.email = null;
	this.dateOfBirth = null;
	this.country = null;
	this.state = null;
	this.city = null;
	this.zip = null;
	this.thumbnailUrl = null;
	this.description = null;
	this.tags = null;
	this.adminTags = null;
	this.gender = null;
	this.status = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.partnerData = null;
	this.indexedPartnerDataInt = null;
	this.indexedPartnerDataString = null;
	this.storageSize = null;
	this.password = null;
	this.firstName = null;
	this.lastName = null;
	this.isAdmin = null;
	this.language = null;
	this.lastLoginTime = null;
	this.statusUpdatedAt = null;
	this.deletedAt = null;
	this.loginEnabled = null;
	this.roleIds = null;
	this.roleNames = null;
	this.isAccountOwner = null;
	this.allowedPartnerIds = null;
	this.allowedPartnerPackages = null;
}
module.exports.KalturaUser = KalturaUser;

util.inherits(KalturaUser, kaltura.KalturaObjectBase);


/**
 * @param id string .
 * @param loginEmail string .
 */
function KalturaUserLoginData(){
	KalturaUserLoginData.super_.call(this);
	this.id = null;
	this.loginEmail = null;
}
module.exports.KalturaUserLoginData = KalturaUserLoginData;

util.inherits(KalturaUserLoginData, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param name string .
 * @param systemName string .
 * @param description string .
 * @param status int .
 * @param partnerId int  (readOnly).
 * @param permissionNames string .
 * @param tags string .
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 */
function KalturaUserRole(){
	KalturaUserRole.super_.call(this);
	this.id = null;
	this.name = null;
	this.systemName = null;
	this.description = null;
	this.status = null;
	this.partnerId = null;
	this.permissionNames = null;
	this.tags = null;
	this.createdAt = null;
	this.updatedAt = null;
}
module.exports.KalturaUserRole = KalturaUserRole;

util.inherits(KalturaUserRole, kaltura.KalturaObjectBase);


/**
 * @param partnerId int Partner ID.
 * @param partnerName string Partner name.
 * @param partnerStatus int Partner status.
 * @param partnerPackage int Partner package.
 * @param partnerCreatedAt int Partner creation date (Unix timestamp).
 * @param views int Number of player loads in the specific date range.
 * @param plays int Number of plays in the specific date range.
 * @param entriesCount int Number of new entries created during specific date range.
 * @param totalEntriesCount int Total number of entries.
 * @param videoEntriesCount int Number of new video entries created during specific date range.
 * @param imageEntriesCount int Number of new image entries created during specific date range.
 * @param audioEntriesCount int Number of new audio entries created during specific date range.
 * @param mixEntriesCount int Number of new mix entries created during specific date range.
 * @param bandwidth float The total bandwidth usage during the given date range (in MB).
 * @param totalStorage float The total storage consumption (in MB).
 * @param storage float The added storage consumption (new uploads) during the given date range (in MB).
 * @param deletedStorage float The deleted storage consumption (new uploads) during the given date range (in MB).
 * @param peakStorage float The peak amount of storage consumption during the given date range for the specific publisher.
 * @param avgStorage float The average amount of storage consumption during the given date range for the specific publisher.
 * @param combinedStorageBandwidth float The combined amount of bandwidth and storage consumed during the given date range for the specific publisher.
 * @param transcodingUsage float Amount of transcoding usage in MB.
 * @param dateId string TGhe date at which the report was taken - Unix Timestamp.
 */
function KalturaVarPartnerUsageItem(){
	KalturaVarPartnerUsageItem.super_.call(this);
	this.partnerId = null;
	this.partnerName = null;
	this.partnerStatus = null;
	this.partnerPackage = null;
	this.partnerCreatedAt = null;
	this.views = null;
	this.plays = null;
	this.entriesCount = null;
	this.totalEntriesCount = null;
	this.videoEntriesCount = null;
	this.imageEntriesCount = null;
	this.audioEntriesCount = null;
	this.mixEntriesCount = null;
	this.bandwidth = null;
	this.totalStorage = null;
	this.storage = null;
	this.deletedStorage = null;
	this.peakStorage = null;
	this.avgStorage = null;
	this.combinedStorageBandwidth = null;
	this.transcodingUsage = null;
	this.dateId = null;
}
module.exports.KalturaVarPartnerUsageItem = KalturaVarPartnerUsageItem;

util.inherits(KalturaVarPartnerUsageItem, kaltura.KalturaObjectBase);


/**
 * @param id int  (readOnly).
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param partnerId int  (readOnly).
 * @param name string .
 * @param status int .
 * @param engineType string .
 * @param entryFilter KalturaBaseEntryFilter .
 * @param actionIfInfected int .
 */
function KalturaVirusScanProfile(){
	KalturaVirusScanProfile.super_.call(this);
	this.id = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.partnerId = null;
	this.name = null;
	this.status = null;
	this.engineType = null;
	this.entryFilter = null;
	this.actionIfInfected = null;
}
module.exports.KalturaVirusScanProfile = KalturaVirusScanProfile;

util.inherits(KalturaVirusScanProfile, kaltura.KalturaObjectBase);


/**
 * @param id string  (readOnly).
 * @param sourceWidgetId string .
 * @param rootWidgetId string  (readOnly).
 * @param partnerId int  (readOnly).
 * @param entryId string .
 * @param uiConfId int .
 * @param securityType int .
 * @param securityPolicy int .
 * @param createdAt int  (readOnly).
 * @param updatedAt int  (readOnly).
 * @param partnerData string Can be used to store various partner related data as a string.
 * @param widgetHTML string  (readOnly).
 * @param enforceEntitlement bool Should enforce entitlement on feed entries.
 * @param privacyContext string Set privacy context for search entries that assiged to private and public categories within a category privacy context.
 * @param addEmbedHtml5Support bool Addes the HTML5 script line to the widget's embed code.
 */
function KalturaWidget(){
	KalturaWidget.super_.call(this);
	this.id = null;
	this.sourceWidgetId = null;
	this.rootWidgetId = null;
	this.partnerId = null;
	this.entryId = null;
	this.uiConfId = null;
	this.securityType = null;
	this.securityPolicy = null;
	this.createdAt = null;
	this.updatedAt = null;
	this.partnerData = null;
	this.widgetHTML = null;
	this.enforceEntitlement = null;
	this.privacyContext = null;
	this.addEmbedHtml5Support = null;
}
module.exports.KalturaWidget = KalturaWidget;

util.inherits(KalturaWidget, kaltura.KalturaObjectBase);


/**
 */
function KalturaABCScreenersWatermarkCondition(){
	KalturaABCScreenersWatermarkCondition.super_.call(this);
}
module.exports.KalturaABCScreenersWatermarkCondition = KalturaABCScreenersWatermarkCondition;

util.inherits(KalturaABCScreenersWatermarkCondition, KalturaCondition);


/**
 */
function KalturaAccessControlBlockAction(){
	KalturaAccessControlBlockAction.super_.call(this);
}
module.exports.KalturaAccessControlBlockAction = KalturaAccessControlBlockAction;

util.inherits(KalturaAccessControlBlockAction, KalturaRuleAction);


/**
 * @param flavorParamsIds string Comma separated list of flavor ids.
 * @param isBlockedList bool .
 */
function KalturaAccessControlLimitFlavorsAction(){
	KalturaAccessControlLimitFlavorsAction.super_.call(this);
	this.flavorParamsIds = null;
	this.isBlockedList = null;
}
module.exports.KalturaAccessControlLimitFlavorsAction = KalturaAccessControlLimitFlavorsAction;

util.inherits(KalturaAccessControlLimitFlavorsAction, KalturaRuleAction);


/**
 * @param objects array  (readOnly).
 */
function KalturaAccessControlListResponse(){
	KalturaAccessControlListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaAccessControlListResponse = KalturaAccessControlListResponse;

util.inherits(KalturaAccessControlListResponse, KalturaListResponse);


/**
 * @param policyId int Play ready policy id.
 */
function KalturaAccessControlPlayReadyPolicyAction(){
	KalturaAccessControlPlayReadyPolicyAction.super_.call(this);
	this.policyId = null;
}
module.exports.KalturaAccessControlPlayReadyPolicyAction = KalturaAccessControlPlayReadyPolicyAction;

util.inherits(KalturaAccessControlPlayReadyPolicyAction, KalturaRuleAction);


/**
 * @param limit int .
 */
function KalturaAccessControlPreviewAction(){
	KalturaAccessControlPreviewAction.super_.call(this);
	this.limit = null;
}
module.exports.KalturaAccessControlPreviewAction = KalturaAccessControlPreviewAction;

util.inherits(KalturaAccessControlPreviewAction, KalturaRuleAction);


/**
 * @param objects array  (readOnly).
 */
function KalturaAccessControlProfileListResponse(){
	KalturaAccessControlProfileListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaAccessControlProfileListResponse = KalturaAccessControlProfileListResponse;

util.inherits(KalturaAccessControlProfileListResponse, KalturaListResponse);


/**
 * @param host string .
 * @param port int .
 * @param protocol string .
 * @param username string .
 * @param password string .
 */
function KalturaActivitiBusinessProcessServer(){
	KalturaActivitiBusinessProcessServer.super_.call(this);
	this.host = null;
	this.port = null;
	this.protocol = null;
	this.username = null;
	this.password = null;
}
module.exports.KalturaActivitiBusinessProcessServer = KalturaActivitiBusinessProcessServer;

util.inherits(KalturaActivitiBusinessProcessServer, KalturaBusinessProcessServer);


/**
 * @param protocolType string  (insertOnly).
 * @param sourceUrl string .
 * @param adType string .
 * @param title string .
 * @param endTime int .
 * @param duration int Duration in milliseconds.
 */
function KalturaAdCuePoint(){
	KalturaAdCuePoint.super_.call(this);
	this.protocolType = null;
	this.sourceUrl = null;
	this.adType = null;
	this.title = null;
	this.endTime = null;
	this.duration = null;
}
module.exports.KalturaAdCuePoint = KalturaAdCuePoint;

util.inherits(KalturaAdCuePoint, KalturaCuePoint);


/**
 */
function KalturaAdminUser(){
	KalturaAdminUser.super_.call(this);
}
module.exports.KalturaAdminUser = KalturaAdminUser;

util.inherits(KalturaAdminUser, KalturaUser);


/**
 * @param filesPermissionInS3 string .
 * @param s3Region string .
 */
function KalturaAmazonS3StorageProfile(){
	KalturaAmazonS3StorageProfile.super_.call(this);
	this.filesPermissionInS3 = null;
	this.s3Region = null;
}
module.exports.KalturaAmazonS3StorageProfile = KalturaAmazonS3StorageProfile;

util.inherits(KalturaAmazonS3StorageProfile, KalturaStorageProfile);


/**
 * @param objects array  (readOnly).
 */
function KalturaAnnotationListResponse(){
	KalturaAnnotationListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaAnnotationListResponse = KalturaAnnotationListResponse;

util.inherits(KalturaAnnotationListResponse, KalturaListResponse);


/**
 * @param service string .
 * @param action string .
 */
function KalturaApiActionPermissionItem(){
	KalturaApiActionPermissionItem.super_.call(this);
	this.service = null;
	this.action = null;
}
module.exports.KalturaApiActionPermissionItem = KalturaApiActionPermissionItem;

util.inherits(KalturaApiActionPermissionItem, KalturaPermissionItem);


/**
 * @param object string .
 * @param parameter string .
 * @param action string .
 */
function KalturaApiParameterPermissionItem(){
	KalturaApiParameterPermissionItem.super_.call(this);
	this.object = null;
	this.parameter = null;
	this.action = null;
}
module.exports.KalturaApiParameterPermissionItem = KalturaApiParameterPermissionItem;

util.inherits(KalturaApiParameterPermissionItem, KalturaPermissionItem);


/**
 * @param propertyName string The property name to look for, this will match to a getter on the asset object.
 * Should be camelCase naming convention (defining "myPropertyName" will look for getMyPropertyName()).
 * @param propertyValue string The value to compare.
 */
function KalturaAssetDistributionPropertyCondition(){
	KalturaAssetDistributionPropertyCondition.super_.call(this);
	this.propertyName = null;
	this.propertyValue = null;
}
module.exports.KalturaAssetDistributionPropertyCondition = KalturaAssetDistributionPropertyCondition;

util.inherits(KalturaAssetDistributionPropertyCondition, KalturaAssetDistributionCondition);


/**
 * @param assetParamsId int .
 * @param assetParamsVersion string .
 * @param assetId string .
 * @param assetVersion string .
 * @param readyBehavior int .
 * @param format string The container format of the Flavor Params.
 */
function KalturaAssetParamsOutput(){
	KalturaAssetParamsOutput.super_.call(this);
	this.assetParamsId = null;
	this.assetParamsVersion = null;
	this.assetId = null;
	this.assetVersion = null;
	this.readyBehavior = null;
	this.format = null;
}
module.exports.KalturaAssetParamsOutput = KalturaAssetParamsOutput;

util.inherits(KalturaAssetParamsOutput, KalturaAssetParams);


/**
 * @param properties array Array of key/value objects that holds the property and the value to find and compare on an asset object.
 */
function KalturaAssetPropertiesCompareCondition(){
	KalturaAssetPropertiesCompareCondition.super_.call(this);
	this.properties = null;
}
module.exports.KalturaAssetPropertiesCompareCondition = KalturaAssetPropertiesCompareCondition;

util.inherits(KalturaAssetPropertiesCompareCondition, KalturaCondition);


/**
 * @param resources array Array of resources associated with asset params ids.
 */
function KalturaAssetsParamsResourceContainers(){
	KalturaAssetsParamsResourceContainers.super_.call(this);
	this.resources = null;
}
module.exports.KalturaAssetsParamsResourceContainers = KalturaAssetsParamsResourceContainers;

util.inherits(KalturaAssetsParamsResourceContainers, KalturaResource);


/**
 * @param objects array  (readOnly).
 */
function KalturaAttachmentAssetListResponse(){
	KalturaAttachmentAssetListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaAttachmentAssetListResponse = KalturaAttachmentAssetListResponse;

util.inherits(KalturaAttachmentAssetListResponse, KalturaListResponse);


/**
 * @param changedItems array .
 */
function KalturaAuditTrailChangeInfo(){
	KalturaAuditTrailChangeInfo.super_.call(this);
	this.changedItems = null;
}
module.exports.KalturaAuditTrailChangeInfo = KalturaAuditTrailChangeInfo;

util.inherits(KalturaAuditTrailChangeInfo, KalturaAuditTrailInfo);


/**
 * @param type int .
 */
function KalturaAuditTrailChangeXmlNode(){
	KalturaAuditTrailChangeXmlNode.super_.call(this);
	this.type = null;
}
module.exports.KalturaAuditTrailChangeXmlNode = KalturaAuditTrailChangeXmlNode;

util.inherits(KalturaAuditTrailChangeXmlNode, KalturaAuditTrailChangeItem);


/**
 * @param version string .
 * @param objectSubType int .
 * @param dc int .
 * @param original bool .
 * @param fileType int .
 */
function KalturaAuditTrailFileSyncCreateInfo(){
	KalturaAuditTrailFileSyncCreateInfo.super_.call(this);
	this.version = null;
	this.objectSubType = null;
	this.dc = null;
	this.original = null;
	this.fileType = null;
}
module.exports.KalturaAuditTrailFileSyncCreateInfo = KalturaAuditTrailFileSyncCreateInfo;

util.inherits(KalturaAuditTrailFileSyncCreateInfo, KalturaAuditTrailInfo);


/**
 * @param objects array  (readOnly).
 */
function KalturaAuditTrailListResponse(){
	KalturaAuditTrailListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaAuditTrailListResponse = KalturaAuditTrailListResponse;

util.inherits(KalturaAuditTrailListResponse, KalturaListResponse);


/**
 * @param info string .
 */
function KalturaAuditTrailTextInfo(){
	KalturaAuditTrailTextInfo.super_.call(this);
	this.info = null;
}
module.exports.KalturaAuditTrailTextInfo = KalturaAuditTrailTextInfo;

util.inherits(KalturaAuditTrailTextInfo, KalturaAuditTrailInfo);


/**
 * @param privileges array The privelege needed to remove the restriction.
 */
function KalturaAuthenticatedCondition(){
	KalturaAuthenticatedCondition.super_.call(this);
	this.privileges = null;
}
module.exports.KalturaAuthenticatedCondition = KalturaAuthenticatedCondition;

util.inherits(KalturaAuthenticatedCondition, KalturaCondition);


/**
 * @param objects array  (readOnly).
 */
function KalturaBaseEntryListResponse(){
	KalturaBaseEntryListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaBaseEntryListResponse = KalturaBaseEntryListResponse;

util.inherits(KalturaBaseEntryListResponse, KalturaListResponse);


/**
 */
function KalturaBaseSyndicationFeedBaseFilter(){
	KalturaBaseSyndicationFeedBaseFilter.super_.call(this);
}
module.exports.KalturaBaseSyndicationFeedBaseFilter = KalturaBaseSyndicationFeedBaseFilter;

util.inherits(KalturaBaseSyndicationFeedBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaBaseSyndicationFeedListResponse(){
	KalturaBaseSyndicationFeedListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaBaseSyndicationFeedListResponse = KalturaBaseSyndicationFeedListResponse;

util.inherits(KalturaBaseSyndicationFeedListResponse, KalturaListResponse);


/**
 * @param idEqual int .
 * @param idGreaterThanOrEqual int .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param partnerIdNotIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param executionAttemptsGreaterThanOrEqual int .
 * @param executionAttemptsLessThanOrEqual int .
 * @param lockVersionGreaterThanOrEqual int .
 * @param lockVersionLessThanOrEqual int .
 * @param entryIdEqual string .
 * @param jobTypeEqual string .
 * @param jobTypeIn string .
 * @param jobTypeNotIn string .
 * @param jobSubTypeEqual int .
 * @param jobSubTypeIn string .
 * @param jobSubTypeNotIn string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param statusNotIn string .
 * @param priorityGreaterThanOrEqual int .
 * @param priorityLessThanOrEqual int .
 * @param priorityEqual int .
 * @param priorityIn string .
 * @param priorityNotIn string .
 * @param batchVersionGreaterThanOrEqual int .
 * @param batchVersionLessThanOrEqual int .
 * @param batchVersionEqual int .
 * @param queueTimeGreaterThanOrEqual int .
 * @param queueTimeLessThanOrEqual int .
 * @param finishTimeGreaterThanOrEqual int .
 * @param finishTimeLessThanOrEqual int .
 * @param errTypeEqual int .
 * @param errTypeIn string .
 * @param errTypeNotIn string .
 * @param errNumberEqual int .
 * @param errNumberIn string .
 * @param errNumberNotIn string .
 * @param estimatedEffortLessThan int .
 * @param estimatedEffortGreaterThan int .
 * @param urgencyLessThanOrEqual int .
 * @param urgencyGreaterThanOrEqual int .
 */
function KalturaBatchJobBaseFilter(){
	KalturaBatchJobBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idGreaterThanOrEqual = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.partnerIdNotIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.executionAttemptsGreaterThanOrEqual = null;
	this.executionAttemptsLessThanOrEqual = null;
	this.lockVersionGreaterThanOrEqual = null;
	this.lockVersionLessThanOrEqual = null;
	this.entryIdEqual = null;
	this.jobTypeEqual = null;
	this.jobTypeIn = null;
	this.jobTypeNotIn = null;
	this.jobSubTypeEqual = null;
	this.jobSubTypeIn = null;
	this.jobSubTypeNotIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.statusNotIn = null;
	this.priorityGreaterThanOrEqual = null;
	this.priorityLessThanOrEqual = null;
	this.priorityEqual = null;
	this.priorityIn = null;
	this.priorityNotIn = null;
	this.batchVersionGreaterThanOrEqual = null;
	this.batchVersionLessThanOrEqual = null;
	this.batchVersionEqual = null;
	this.queueTimeGreaterThanOrEqual = null;
	this.queueTimeLessThanOrEqual = null;
	this.finishTimeGreaterThanOrEqual = null;
	this.finishTimeLessThanOrEqual = null;
	this.errTypeEqual = null;
	this.errTypeIn = null;
	this.errTypeNotIn = null;
	this.errNumberEqual = null;
	this.errNumberIn = null;
	this.errNumberNotIn = null;
	this.estimatedEffortLessThan = null;
	this.estimatedEffortGreaterThan = null;
	this.urgencyLessThanOrEqual = null;
	this.urgencyGreaterThanOrEqual = null;
}
module.exports.KalturaBatchJobBaseFilter = KalturaBatchJobBaseFilter;

util.inherits(KalturaBatchJobBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaBatchJobListResponse(){
	KalturaBatchJobListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaBatchJobListResponse = KalturaBatchJobListResponse;

util.inherits(KalturaBatchJobListResponse, KalturaListResponse);


/**
 * @param value bool .
 */
function KalturaBooleanValue(){
	KalturaBooleanValue.super_.call(this);
	this.value = null;
}
module.exports.KalturaBooleanValue = KalturaBooleanValue;

util.inherits(KalturaBooleanValue, KalturaValue);


/**
 * @param templateId int KalturaBusinessProcessNotificationTemplate id.
 * @param businessProcessId string .
 * @param caseId string Execution unique id.
 */
function KalturaBpmEventNotificationIntegrationJobTriggerData(){
	KalturaBpmEventNotificationIntegrationJobTriggerData.super_.call(this);
	this.templateId = null;
	this.businessProcessId = null;
	this.caseId = null;
}
module.exports.KalturaBpmEventNotificationIntegrationJobTriggerData = KalturaBpmEventNotificationIntegrationJobTriggerData;

util.inherits(KalturaBpmEventNotificationIntegrationJobTriggerData, KalturaIntegrationJobTriggerData);


/**
 * @param entryIds string Comma separated list of entry ids.
 * @param flavorParamsId int Flavor params id to use for conversion.
 * @param puserId string The id of the requesting user.
 */
function KalturaBulkDownloadJobData(){
	KalturaBulkDownloadJobData.super_.call(this);
	this.entryIds = null;
	this.flavorParamsId = null;
	this.puserId = null;
}
module.exports.KalturaBulkDownloadJobData = KalturaBulkDownloadJobData;

util.inherits(KalturaBulkDownloadJobData, KalturaJobData);


/**
 * @param filter KalturaFilter Filter for extracting the objects list to upload.
 * @param templateObject KalturaObjectBase Template object for new object creation.
 */
function KalturaBulkServiceFilterData(){
	KalturaBulkServiceFilterData.super_.call(this);
	this.filter = null;
	this.templateObject = null;
}
module.exports.KalturaBulkServiceFilterData = KalturaBulkServiceFilterData;

util.inherits(KalturaBulkServiceFilterData, KalturaBulkServiceData);


/**
 * @param uploadedOnGreaterThanOrEqual int .
 * @param uploadedOnLessThanOrEqual int .
 * @param uploadedOnEqual int .
 * @param statusIn string .
 * @param statusEqual int .
 * @param bulkUploadObjectTypeEqual string .
 * @param bulkUploadObjectTypeIn string .
 */
function KalturaBulkUploadBaseFilter(){
	KalturaBulkUploadBaseFilter.super_.call(this);
	this.uploadedOnGreaterThanOrEqual = null;
	this.uploadedOnLessThanOrEqual = null;
	this.uploadedOnEqual = null;
	this.statusIn = null;
	this.statusEqual = null;
	this.bulkUploadObjectTypeEqual = null;
	this.bulkUploadObjectTypeIn = null;
}
module.exports.KalturaBulkUploadBaseFilter = KalturaBulkUploadBaseFilter;

util.inherits(KalturaBulkUploadBaseFilter, KalturaFilter);


/**
 */
function KalturaBulkUploadCategoryData(){
	KalturaBulkUploadCategoryData.super_.call(this);
}
module.exports.KalturaBulkUploadCategoryData = KalturaBulkUploadCategoryData;

util.inherits(KalturaBulkUploadCategoryData, KalturaBulkUploadObjectData);


/**
 */
function KalturaBulkUploadCategoryEntryData(){
	KalturaBulkUploadCategoryEntryData.super_.call(this);
}
module.exports.KalturaBulkUploadCategoryEntryData = KalturaBulkUploadCategoryEntryData;

util.inherits(KalturaBulkUploadCategoryEntryData, KalturaBulkUploadObjectData);


/**
 */
function KalturaBulkUploadCategoryUserData(){
	KalturaBulkUploadCategoryUserData.super_.call(this);
}
module.exports.KalturaBulkUploadCategoryUserData = KalturaBulkUploadCategoryUserData;

util.inherits(KalturaBulkUploadCategoryUserData, KalturaBulkUploadObjectData);


/**
 * @param conversionProfileId int Selected profile id for all bulk entries.
 */
function KalturaBulkUploadEntryData(){
	KalturaBulkUploadEntryData.super_.call(this);
	this.conversionProfileId = null;
}
module.exports.KalturaBulkUploadEntryData = KalturaBulkUploadEntryData;

util.inherits(KalturaBulkUploadEntryData, KalturaBulkUploadObjectData);


/**
 * @param userId string  (readOnly).
 * @param uploadedBy string The screen name of the user (readOnly).
 * @param conversionProfileId int Selected profile id for all bulk entries (readOnly).
 * @param resultsFileLocalPath string Created by the API (readOnly).
 * @param resultsFileUrl string Created by the API (readOnly).
 * @param numOfEntries int Number of created entries (readOnly).
 * @param numOfObjects int Number of created objects (readOnly).
 * @param filePath string The bulk upload file path (readOnly).
 * @param bulkUploadObjectType string Type of object for bulk upload (readOnly).
 * @param fileName string Friendly name of the file, used to be recognized later in the logs.
 * @param objectData KalturaBulkUploadObjectData Data pertaining to the objects being uploaded (readOnly).
 * @param type string Type of bulk upload (readOnly).
 * @param emailRecipients string Recipients of the email for bulk upload success/failure.
 * @param numOfErrorObjects int Number of objects that finished on error status.
 */
function KalturaBulkUploadJobData(){
	KalturaBulkUploadJobData.super_.call(this);
	this.userId = null;
	this.uploadedBy = null;
	this.conversionProfileId = null;
	this.resultsFileLocalPath = null;
	this.resultsFileUrl = null;
	this.numOfEntries = null;
	this.numOfObjects = null;
	this.filePath = null;
	this.bulkUploadObjectType = null;
	this.fileName = null;
	this.objectData = null;
	this.type = null;
	this.emailRecipients = null;
	this.numOfErrorObjects = null;
}
module.exports.KalturaBulkUploadJobData = KalturaBulkUploadJobData;

util.inherits(KalturaBulkUploadJobData, KalturaJobData);


/**
 * @param objects array  (readOnly).
 */
function KalturaBulkUploadListResponse(){
	KalturaBulkUploadListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaBulkUploadListResponse = KalturaBulkUploadListResponse;

util.inherits(KalturaBulkUploadListResponse, KalturaListResponse);


/**
 * @param relativePath string .
 * @param name string .
 * @param referenceId string .
 * @param description string .
 * @param tags string .
 * @param appearInList int .
 * @param privacy int .
 * @param inheritanceType int .
 * @param userJoinPolicy int .
 * @param defaultPermissionLevel int .
 * @param owner string .
 * @param contributionPolicy int .
 * @param partnerSortValue int .
 * @param moderation bool .
 */
function KalturaBulkUploadResultCategory(){
	KalturaBulkUploadResultCategory.super_.call(this);
	this.relativePath = null;
	this.name = null;
	this.referenceId = null;
	this.description = null;
	this.tags = null;
	this.appearInList = null;
	this.privacy = null;
	this.inheritanceType = null;
	this.userJoinPolicy = null;
	this.defaultPermissionLevel = null;
	this.owner = null;
	this.contributionPolicy = null;
	this.partnerSortValue = null;
	this.moderation = null;
}
module.exports.KalturaBulkUploadResultCategory = KalturaBulkUploadResultCategory;

util.inherits(KalturaBulkUploadResultCategory, KalturaBulkUploadResult);


/**
 * @param categoryId int .
 * @param entryId string .
 */
function KalturaBulkUploadResultCategoryEntry(){
	KalturaBulkUploadResultCategoryEntry.super_.call(this);
	this.categoryId = null;
	this.entryId = null;
}
module.exports.KalturaBulkUploadResultCategoryEntry = KalturaBulkUploadResultCategoryEntry;

util.inherits(KalturaBulkUploadResultCategoryEntry, KalturaBulkUploadResult);


/**
 * @param categoryId int .
 * @param categoryReferenceId string .
 * @param userId string .
 * @param permissionLevel int .
 * @param updateMethod int .
 * @param requiredObjectStatus int .
 */
function KalturaBulkUploadResultCategoryUser(){
	KalturaBulkUploadResultCategoryUser.super_.call(this);
	this.categoryId = null;
	this.categoryReferenceId = null;
	this.userId = null;
	this.permissionLevel = null;
	this.updateMethod = null;
	this.requiredObjectStatus = null;
}
module.exports.KalturaBulkUploadResultCategoryUser = KalturaBulkUploadResultCategoryUser;

util.inherits(KalturaBulkUploadResultCategoryUser, KalturaBulkUploadResult);


/**
 * @param entryId string .
 * @param title string .
 * @param description string .
 * @param tags string .
 * @param url string .
 * @param contentType string .
 * @param conversionProfileId int .
 * @param accessControlProfileId int .
 * @param category string .
 * @param scheduleStartDate int .
 * @param scheduleEndDate int .
 * @param entryStatus int .
 * @param thumbnailUrl string .
 * @param thumbnailSaved bool .
 * @param sshPrivateKey string .
 * @param sshPublicKey string .
 * @param sshKeyPassphrase string .
 * @param creatorId string .
 * @param entitledUsersEdit string .
 * @param entitledUsersPublish string .
 * @param ownerId string .
 */
function KalturaBulkUploadResultEntry(){
	KalturaBulkUploadResultEntry.super_.call(this);
	this.entryId = null;
	this.title = null;
	this.description = null;
	this.tags = null;
	this.url = null;
	this.contentType = null;
	this.conversionProfileId = null;
	this.accessControlProfileId = null;
	this.category = null;
	this.scheduleStartDate = null;
	this.scheduleEndDate = null;
	this.entryStatus = null;
	this.thumbnailUrl = null;
	this.thumbnailSaved = null;
	this.sshPrivateKey = null;
	this.sshPublicKey = null;
	this.sshKeyPassphrase = null;
	this.creatorId = null;
	this.entitledUsersEdit = null;
	this.entitledUsersPublish = null;
	this.ownerId = null;
}
module.exports.KalturaBulkUploadResultEntry = KalturaBulkUploadResultEntry;

util.inherits(KalturaBulkUploadResultEntry, KalturaBulkUploadResult);


/**
 * @param userId string .
 * @param screenName string .
 * @param email string .
 * @param description string .
 * @param tags string .
 * @param dateOfBirth int .
 * @param country string .
 * @param state string .
 * @param city string .
 * @param zip string .
 * @param gender int .
 * @param firstName string .
 * @param lastName string .
 */
function KalturaBulkUploadResultUser(){
	KalturaBulkUploadResultUser.super_.call(this);
	this.userId = null;
	this.screenName = null;
	this.email = null;
	this.description = null;
	this.tags = null;
	this.dateOfBirth = null;
	this.country = null;
	this.state = null;
	this.city = null;
	this.zip = null;
	this.gender = null;
	this.firstName = null;
	this.lastName = null;
}
module.exports.KalturaBulkUploadResultUser = KalturaBulkUploadResultUser;

util.inherits(KalturaBulkUploadResultUser, KalturaBulkUploadResult);


/**
 */
function KalturaBulkUploadUserData(){
	KalturaBulkUploadUserData.super_.call(this);
}
module.exports.KalturaBulkUploadUserData = KalturaBulkUploadUserData;

util.inherits(KalturaBulkUploadUserData, KalturaBulkUploadObjectData);


/**
 * @param serverId int Define the integrated BPM server id.
 * @param processId string Define the integrated BPM process id.
 * @param mainObjectCode string Code to load the main triggering object.
 */
function KalturaBusinessProcessNotificationTemplate(){
	KalturaBusinessProcessNotificationTemplate.super_.call(this);
	this.serverId = null;
	this.processId = null;
	this.mainObjectCode = null;
}
module.exports.KalturaBusinessProcessNotificationTemplate = KalturaBusinessProcessNotificationTemplate;

util.inherits(KalturaBusinessProcessNotificationTemplate, KalturaEventNotificationTemplate);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param idNotIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param statusEqual string .
 * @param statusNotEqual string .
 * @param statusIn string .
 * @param statusNotIn string .
 * @param typeEqual string .
 * @param typeIn string .
 */
function KalturaBusinessProcessServerBaseFilter(){
	KalturaBusinessProcessServerBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.idNotIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.statusEqual = null;
	this.statusNotEqual = null;
	this.statusIn = null;
	this.statusNotIn = null;
	this.typeEqual = null;
	this.typeIn = null;
}
module.exports.KalturaBusinessProcessServerBaseFilter = KalturaBusinessProcessServerBaseFilter;

util.inherits(KalturaBusinessProcessServerBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaBusinessProcessServerListResponse(){
	KalturaBusinessProcessServerListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaBusinessProcessServerListResponse = KalturaBusinessProcessServerListResponse;

util.inherits(KalturaBusinessProcessServerListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaCaptionAssetItemListResponse(){
	KalturaCaptionAssetItemListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaCaptionAssetItemListResponse = KalturaCaptionAssetItemListResponse;

util.inherits(KalturaCaptionAssetItemListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaCaptionAssetListResponse(){
	KalturaCaptionAssetListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaCaptionAssetListResponse = KalturaCaptionAssetListResponse;

util.inherits(KalturaCaptionAssetListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaCaptionParamsListResponse(){
	KalturaCaptionParamsListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaCaptionParamsListResponse = KalturaCaptionParamsListResponse;

util.inherits(KalturaCaptionParamsListResponse, KalturaListResponse);


/**
 * @param srcFileSyncLocalPath string .
 * @param actualSrcFileSyncLocalPath string The translated path as used by the scheduler.
 * @param srcFileSyncRemoteUrl string .
 * @param thumbParamsOutputId int .
 * @param thumbAssetId string .
 * @param srcAssetId string .
 * @param srcAssetType string .
 * @param thumbPath string .
 */
function KalturaCaptureThumbJobData(){
	KalturaCaptureThumbJobData.super_.call(this);
	this.srcFileSyncLocalPath = null;
	this.actualSrcFileSyncLocalPath = null;
	this.srcFileSyncRemoteUrl = null;
	this.thumbParamsOutputId = null;
	this.thumbAssetId = null;
	this.srcAssetId = null;
	this.srcAssetType = null;
	this.thumbPath = null;
}
module.exports.KalturaCaptureThumbJobData = KalturaCaptureThumbJobData;

util.inherits(KalturaCaptureThumbJobData, KalturaJobData);


/**
 * @param categoriesMatchOr string .
 * @param categoryEntryStatusIn string .
 * @param orderBy string .
 * @param categoryIdEqual int .
 */
function KalturaCategoryEntryAdvancedFilter(){
	KalturaCategoryEntryAdvancedFilter.super_.call(this);
	this.categoriesMatchOr = null;
	this.categoryEntryStatusIn = null;
	this.orderBy = null;
	this.categoryIdEqual = null;
}
module.exports.KalturaCategoryEntryAdvancedFilter = KalturaCategoryEntryAdvancedFilter;

util.inherits(KalturaCategoryEntryAdvancedFilter, KalturaSearchItem);


/**
 * @param objects array  (readOnly).
 */
function KalturaCategoryEntryListResponse(){
	KalturaCategoryEntryListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaCategoryEntryListResponse = KalturaCategoryEntryListResponse;

util.inherits(KalturaCategoryEntryListResponse, KalturaListResponse);


/**
 * @param identifier string Identifier of the object.
 */
function KalturaCategoryIdentifier(){
	KalturaCategoryIdentifier.super_.call(this);
	this.identifier = null;
}
module.exports.KalturaCategoryIdentifier = KalturaCategoryIdentifier;

util.inherits(KalturaCategoryIdentifier, KalturaObjectIdentifier);


/**
 * @param objects array  (readOnly).
 */
function KalturaCategoryListResponse(){
	KalturaCategoryListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaCategoryListResponse = KalturaCategoryListResponse;

util.inherits(KalturaCategoryListResponse, KalturaListResponse);


/**
 * @param memberIdEq string .
 * @param memberIdIn string .
 * @param memberPermissionsMatchOr string .
 * @param memberPermissionsMatchAnd string .
 */
function KalturaCategoryUserAdvancedFilter(){
	KalturaCategoryUserAdvancedFilter.super_.call(this);
	this.memberIdEq = null;
	this.memberIdIn = null;
	this.memberPermissionsMatchOr = null;
	this.memberPermissionsMatchAnd = null;
}
module.exports.KalturaCategoryUserAdvancedFilter = KalturaCategoryUserAdvancedFilter;

util.inherits(KalturaCategoryUserAdvancedFilter, KalturaSearchItem);


/**
 * @param objects array  (readOnly).
 */
function KalturaCategoryUserListResponse(){
	KalturaCategoryUserListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaCategoryUserListResponse = KalturaCategoryUserListResponse;

util.inherits(KalturaCategoryUserListResponse, KalturaListResponse);


/**
 * @param userIdEqual string .
 * @param userIdIn string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param updateMethodEqual int .
 * @param updateMethodIn string .
 * @param permissionNamesMatchAnd string .
 * @param permissionNamesMatchOr string .
 */
function KalturaCategoryUserProviderFilter(){
	KalturaCategoryUserProviderFilter.super_.call(this);
	this.userIdEqual = null;
	this.userIdIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.updateMethodEqual = null;
	this.updateMethodIn = null;
	this.permissionNamesMatchAnd = null;
	this.permissionNamesMatchOr = null;
}
module.exports.KalturaCategoryUserProviderFilter = KalturaCategoryUserProviderFilter;

util.inherits(KalturaCategoryUserProviderFilter, KalturaFilter);


/**
 * @param offset int Offset in milliseconds.
 * @param duration int Duration in milliseconds.
 */
function KalturaClipAttributes(){
	KalturaClipAttributes.super_.call(this);
	this.offset = null;
	this.duration = null;
}
module.exports.KalturaClipAttributes = KalturaClipAttributes;

util.inherits(KalturaClipAttributes, KalturaOperationAttributes);


/**
 * @param code string .
 * @param description string .
 * @param endTime int .
 * @param duration int Duration in milliseconds (readOnly).
 */
function KalturaCodeCuePoint(){
	KalturaCodeCuePoint.super_.call(this);
	this.code = null;
	this.description = null;
	this.endTime = null;
	this.duration = null;
}
module.exports.KalturaCodeCuePoint = KalturaCodeCuePoint;

util.inherits(KalturaCodeCuePoint, KalturaCuePoint);


/**
 * @param value KalturaIntegerValue Value to evaluate against the field and operator.
 * @param comparison string Comparing operator.
 */
function KalturaCompareCondition(){
	KalturaCompareCondition.super_.call(this);
	this.value = null;
	this.comparison = null;
}
module.exports.KalturaCompareCondition = KalturaCompareCondition;

util.inherits(KalturaCompareCondition, KalturaCondition);


/**
 */
function KalturaDataCenterContentResource(){
	KalturaDataCenterContentResource.super_.call(this);
}
module.exports.KalturaDataCenterContentResource = KalturaDataCenterContentResource;

util.inherits(KalturaDataCenterContentResource, KalturaContentResource);


/**
 * @param resource KalturaDataCenterContentResource The resource to be concatenated.
 */
function KalturaConcatAttributes(){
	KalturaConcatAttributes.super_.call(this);
	this.resource = null;
}
module.exports.KalturaConcatAttributes = KalturaConcatAttributes;

util.inherits(KalturaConcatAttributes, KalturaOperationAttributes);


/**
 * @param srcFiles array Source files to be concatenated.
 * @param destFilePath string Output file.
 * @param flavorAssetId string Flavor asset to be ingested with the output.
 * @param offset float Clipping offset in seconds.
 * @param duration float Clipping duration in seconds.
 */
function KalturaConcatJobData(){
	KalturaConcatJobData.super_.call(this);
	this.srcFiles = null;
	this.destFilePath = null;
	this.flavorAssetId = null;
	this.offset = null;
	this.duration = null;
}
module.exports.KalturaConcatJobData = KalturaConcatJobData;

util.inherits(KalturaConcatJobData, KalturaJobData);


/**
 * @param fieldValues string .
 */
function KalturaConfigurableDistributionJobProviderData(){
	KalturaConfigurableDistributionJobProviderData.super_.call(this);
	this.fieldValues = null;
}
module.exports.KalturaConfigurableDistributionJobProviderData = KalturaConfigurableDistributionJobProviderData;

util.inherits(KalturaConfigurableDistributionJobProviderData, KalturaDistributionJobProviderData);


/**
 * @param fieldConfigArray array .
 * @param itemXpathsToExtend array .
 */
function KalturaConfigurableDistributionProfile(){
	KalturaConfigurableDistributionProfile.super_.call(this);
	this.fieldConfigArray = null;
	this.itemXpathsToExtend = null;
}
module.exports.KalturaConfigurableDistributionProfile = KalturaConfigurableDistributionProfile;

util.inherits(KalturaConfigurableDistributionProfile, KalturaDistributionProfile);


/**
 * @param noDistributionProfiles bool .
 * @param distributionProfileId int .
 * @param distributionSunStatus int .
 * @param entryDistributionFlag int .
 * @param entryDistributionStatus int .
 * @param hasEntryDistributionValidationErrors bool .
 * @param entryDistributionValidationErrors string Comma seperated validation error types.
 */
function KalturaContentDistributionSearchItem(){
	KalturaContentDistributionSearchItem.super_.call(this);
	this.noDistributionProfiles = null;
	this.distributionProfileId = null;
	this.distributionSunStatus = null;
	this.entryDistributionFlag = null;
	this.entryDistributionStatus = null;
	this.hasEntryDistributionValidationErrors = null;
	this.entryDistributionValidationErrors = null;
}
module.exports.KalturaContentDistributionSearchItem = KalturaContentDistributionSearchItem;

util.inherits(KalturaContentDistributionSearchItem, KalturaSearchItem);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param createdByIdEqual int .
 * @param typeEqual int .
 * @param typeIn string .
 * @param targetTypeEqual int .
 * @param targetTypeIn string .
 * @param statusEqual int .
 * @param statusIn string .
 */
function KalturaControlPanelCommandBaseFilter(){
	KalturaControlPanelCommandBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.createdByIdEqual = null;
	this.typeEqual = null;
	this.typeIn = null;
	this.targetTypeEqual = null;
	this.targetTypeIn = null;
	this.statusEqual = null;
	this.statusIn = null;
}
module.exports.KalturaControlPanelCommandBaseFilter = KalturaControlPanelCommandBaseFilter;

util.inherits(KalturaControlPanelCommandBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaControlPanelCommandListResponse(){
	KalturaControlPanelCommandListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaControlPanelCommandListResponse = KalturaControlPanelCommandListResponse;

util.inherits(KalturaControlPanelCommandListResponse, KalturaListResponse);


/**
 * @param srcFileSyncLocalPath string .
 * @param actualSrcFileSyncLocalPath string The translated path as used by the scheduler.
 * @param srcFileSyncRemoteUrl string .
 * @param srcFileSyncs array .
 * @param engineVersion int .
 * @param flavorParamsOutputId int .
 * @param flavorParamsOutput KalturaFlavorParamsOutput .
 * @param mediaInfoId int .
 * @param currentOperationSet int .
 * @param currentOperationIndex int .
 * @param pluginData array .
 */
function KalturaConvartableJobData(){
	KalturaConvartableJobData.super_.call(this);
	this.srcFileSyncLocalPath = null;
	this.actualSrcFileSyncLocalPath = null;
	this.srcFileSyncRemoteUrl = null;
	this.srcFileSyncs = null;
	this.engineVersion = null;
	this.flavorParamsOutputId = null;
	this.flavorParamsOutput = null;
	this.mediaInfoId = null;
	this.currentOperationSet = null;
	this.currentOperationIndex = null;
	this.pluginData = null;
}
module.exports.KalturaConvartableJobData = KalturaConvartableJobData;

util.inherits(KalturaConvartableJobData, KalturaJobData);


/**
 * @param objects array  (readOnly).
 */
function KalturaConversionProfileAssetParamsListResponse(){
	KalturaConversionProfileAssetParamsListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaConversionProfileAssetParamsListResponse = KalturaConversionProfileAssetParamsListResponse;

util.inherits(KalturaConversionProfileAssetParamsListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaConversionProfileListResponse(){
	KalturaConversionProfileListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaConversionProfileListResponse = KalturaConversionProfileListResponse;

util.inherits(KalturaConversionProfileListResponse, KalturaListResponse);


/**
 * @param flavorParamsIds string Comma separated list of flavor param ids to convert.
 * @param reconvert bool Should reconvert when flavor already exists?.
 */
function KalturaConvertEntryFlavorsObjectTask(){
	KalturaConvertEntryFlavorsObjectTask.super_.call(this);
	this.flavorParamsIds = null;
	this.reconvert = null;
}
module.exports.KalturaConvertEntryFlavorsObjectTask = KalturaConvertEntryFlavorsObjectTask;

util.inherits(KalturaConvertEntryFlavorsObjectTask, KalturaObjectTask);


/**
 * @param entryId string Live stream entry id.
 * @param assetId string .
 * @param mediaServerIndex int Primary or secondary media server.
 * @param fileIndex int The index of the file within the entry.
 * @param srcFilePath string The recorded live media.
 * @param destFilePath string The output file.
 * @param endTime float Duration of the live entry including all recorded segments including the current.
 */
function KalturaConvertLiveSegmentJobData(){
	KalturaConvertLiveSegmentJobData.super_.call(this);
	this.entryId = null;
	this.assetId = null;
	this.mediaServerIndex = null;
	this.fileIndex = null;
	this.srcFilePath = null;
	this.destFilePath = null;
	this.endTime = null;
}
module.exports.KalturaConvertLiveSegmentJobData = KalturaConvertLiveSegmentJobData;

util.inherits(KalturaConvertLiveSegmentJobData, KalturaJobData);


/**
 * @param inputFileSyncLocalPath string .
 * @param thumbHeight int The height of last created thumbnail, will be used to comapare if this thumbnail is the best we can have.
 * @param thumbBitrate int The bit rate of last created thumbnail, will be used to comapare if this thumbnail is the best we can have.
 */
function KalturaConvertProfileJobData(){
	KalturaConvertProfileJobData.super_.call(this);
	this.inputFileSyncLocalPath = null;
	this.thumbHeight = null;
	this.thumbBitrate = null;
}
module.exports.KalturaConvertProfileJobData = KalturaConvertProfileJobData;

util.inherits(KalturaConvertProfileJobData, KalturaJobData);


/**
 * @param fromPartnerId int Id of the partner to copy from.
 * @param toPartnerId int Id of the partner to copy to.
 */
function KalturaCopyPartnerJobData(){
	KalturaCopyPartnerJobData.super_.call(this);
	this.fromPartnerId = null;
	this.toPartnerId = null;
}
module.exports.KalturaCopyPartnerJobData = KalturaCopyPartnerJobData;

util.inherits(KalturaCopyPartnerJobData, KalturaJobData);


/**
 * @param countryRestrictionType int Country restriction type (Allow or deny).
 * @param countryList string Comma separated list of country codes to allow to deny.
 */
function KalturaCountryRestriction(){
	KalturaCountryRestriction.super_.call(this);
	this.countryRestrictionType = null;
	this.countryList = null;
}
module.exports.KalturaCountryRestriction = KalturaCountryRestriction;

util.inherits(KalturaCountryRestriction, KalturaBaseRestriction);


/**
 * @param objects array  (readOnly).
 */
function KalturaCuePointListResponse(){
	KalturaCuePointListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaCuePointListResponse = KalturaCuePointListResponse;

util.inherits(KalturaCuePointListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaDataListResponse(){
	KalturaDataListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaDataListResponse = KalturaDataListResponse;

util.inherits(KalturaDataListResponse, KalturaListResponse);


/**
 * @param deleteType int The logic to use to choose the flavors for deletion.
 * @param flavorParamsIds string Comma separated list of flavor param ids to delete or keep.
 */
function KalturaDeleteEntryFlavorsObjectTask(){
	KalturaDeleteEntryFlavorsObjectTask.super_.call(this);
	this.deleteType = null;
	this.flavorParamsIds = null;
}
module.exports.KalturaDeleteEntryFlavorsObjectTask = KalturaDeleteEntryFlavorsObjectTask;

util.inherits(KalturaDeleteEntryFlavorsObjectTask, KalturaObjectTask);


/**
 */
function KalturaDeleteEntryObjectTask(){
	KalturaDeleteEntryObjectTask.super_.call(this);
}
module.exports.KalturaDeleteEntryObjectTask = KalturaDeleteEntryObjectTask;

util.inherits(KalturaDeleteEntryObjectTask, KalturaObjectTask);


/**
 * @param localFileSyncPath string .
 */
function KalturaDeleteFileJobData(){
	KalturaDeleteFileJobData.super_.call(this);
	this.localFileSyncPath = null;
}
module.exports.KalturaDeleteFileJobData = KalturaDeleteFileJobData;

util.inherits(KalturaDeleteFileJobData, KalturaJobData);


/**
 * @param filter KalturaFilter The filter should return the list of objects that need to be deleted.
 */
function KalturaDeleteJobData(){
	KalturaDeleteJobData.super_.call(this);
	this.filter = null;
}
module.exports.KalturaDeleteJobData = KalturaDeleteJobData;

util.inherits(KalturaDeleteJobData, KalturaJobData);


/**
 */
function KalturaDeleteLocalContentObjectTask(){
	KalturaDeleteLocalContentObjectTask.super_.call(this);
}
module.exports.KalturaDeleteLocalContentObjectTask = KalturaDeleteLocalContentObjectTask;

util.inherits(KalturaDeleteLocalContentObjectTask, KalturaObjectTask);


/**
 * @param supportClipping bool Should we use timing parameters - clipTo / seekFrom.
 */
function KalturaDeliveryProfileAkamaiAppleHttpManifest(){
	KalturaDeliveryProfileAkamaiAppleHttpManifest.super_.call(this);
	this.supportClipping = null;
}
module.exports.KalturaDeliveryProfileAkamaiAppleHttpManifest = KalturaDeliveryProfileAkamaiAppleHttpManifest;

util.inherits(KalturaDeliveryProfileAkamaiAppleHttpManifest, KalturaDeliveryProfile);


/**
 * @param supportClipping bool Should we use timing parameters - clipTo / seekFrom.
 */
function KalturaDeliveryProfileAkamaiHds(){
	KalturaDeliveryProfileAkamaiHds.super_.call(this);
	this.supportClipping = null;
}
module.exports.KalturaDeliveryProfileAkamaiHds = KalturaDeliveryProfileAkamaiHds;

util.inherits(KalturaDeliveryProfileAkamaiHds, KalturaDeliveryProfile);


/**
 * @param useIntelliseek bool Should we use intelliseek.
 */
function KalturaDeliveryProfileAkamaiHttp(){
	KalturaDeliveryProfileAkamaiHttp.super_.call(this);
	this.useIntelliseek = null;
}
module.exports.KalturaDeliveryProfileAkamaiHttp = KalturaDeliveryProfileAkamaiHttp;

util.inherits(KalturaDeliveryProfileAkamaiHttp, KalturaDeliveryProfile);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param systemNameEqual string .
 * @param systemNameIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param streamerTypeEqual string .
 * @param statusEqual int .
 * @param statusIn string .
 */
function KalturaDeliveryProfileBaseFilter(){
	KalturaDeliveryProfileBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.systemNameEqual = null;
	this.systemNameIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.streamerTypeEqual = null;
	this.statusEqual = null;
	this.statusIn = null;
}
module.exports.KalturaDeliveryProfileBaseFilter = KalturaDeliveryProfileBaseFilter;

util.inherits(KalturaDeliveryProfileBaseFilter, KalturaFilter);


/**
 * @param pattern string .
 * @param rendererClass string rendererClass.
 * @param manifestRedirect int Enable to make playManifest redirect to the domain of the delivery profile.
 */
function KalturaDeliveryProfileGenericAppleHttp(){
	KalturaDeliveryProfileGenericAppleHttp.super_.call(this);
	this.pattern = null;
	this.rendererClass = null;
	this.manifestRedirect = null;
}
module.exports.KalturaDeliveryProfileGenericAppleHttp = KalturaDeliveryProfileGenericAppleHttp;

util.inherits(KalturaDeliveryProfileGenericAppleHttp, KalturaDeliveryProfile);


/**
 * @param pattern string .
 * @param rendererClass string rendererClass.
 */
function KalturaDeliveryProfileGenericHds(){
	KalturaDeliveryProfileGenericHds.super_.call(this);
	this.pattern = null;
	this.rendererClass = null;
}
module.exports.KalturaDeliveryProfileGenericHds = KalturaDeliveryProfileGenericHds;

util.inherits(KalturaDeliveryProfileGenericHds, KalturaDeliveryProfile);


/**
 * @param pattern string .
 */
function KalturaDeliveryProfileGenericHttp(){
	KalturaDeliveryProfileGenericHttp.super_.call(this);
	this.pattern = null;
}
module.exports.KalturaDeliveryProfileGenericHttp = KalturaDeliveryProfileGenericHttp;

util.inherits(KalturaDeliveryProfileGenericHttp, KalturaDeliveryProfile);


/**
 * @param pattern string .
 */
function KalturaDeliveryProfileGenericSilverLight(){
	KalturaDeliveryProfileGenericSilverLight.super_.call(this);
	this.pattern = null;
}
module.exports.KalturaDeliveryProfileGenericSilverLight = KalturaDeliveryProfileGenericSilverLight;

util.inherits(KalturaDeliveryProfileGenericSilverLight, KalturaDeliveryProfile);


/**
 * @param objects array  (readOnly).
 */
function KalturaDeliveryProfileListResponse(){
	KalturaDeliveryProfileListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaDeliveryProfileListResponse = KalturaDeliveryProfileListResponse;

util.inherits(KalturaDeliveryProfileListResponse, KalturaListResponse);


/**
 * @param disableExtraAttributes bool .
 * @param forceProxy bool .
 */
function KalturaDeliveryProfileLiveAppleHttp(){
	KalturaDeliveryProfileLiveAppleHttp.super_.call(this);
	this.disableExtraAttributes = null;
	this.forceProxy = null;
}
module.exports.KalturaDeliveryProfileLiveAppleHttp = KalturaDeliveryProfileLiveAppleHttp;

util.inherits(KalturaDeliveryProfileLiveAppleHttp, KalturaDeliveryProfile);


/**
 * @param enforceRtmpe bool enforceRtmpe.
 * @param prefix string a prefix that is added to all stream urls (replaces storageProfile::rtmpPrefix).
 */
function KalturaDeliveryProfileRtmp(){
	KalturaDeliveryProfileRtmp.super_.call(this);
	this.enforceRtmpe = null;
	this.prefix = null;
}
module.exports.KalturaDeliveryProfileRtmp = KalturaDeliveryProfileRtmp;

util.inherits(KalturaDeliveryProfileRtmp, KalturaDeliveryProfile);


/**
 * @param directoryRestrictionType int Kaltura directory restriction type.
 */
function KalturaDirectoryRestriction(){
	KalturaDirectoryRestriction.super_.call(this);
	this.directoryRestrictionType = null;
}
module.exports.KalturaDirectoryRestriction = KalturaDirectoryRestriction;

util.inherits(KalturaDirectoryRestriction, KalturaBaseRestriction);


/**
 * @param eventNotificationTemplateId int The event notification template id to dispatch.
 */
function KalturaDispatchEventNotificationObjectTask(){
	KalturaDispatchEventNotificationObjectTask.super_.call(this);
	this.eventNotificationTemplateId = null;
}
module.exports.KalturaDispatchEventNotificationObjectTask = KalturaDispatchEventNotificationObjectTask;

util.inherits(KalturaDispatchEventNotificationObjectTask, KalturaObjectTask);


/**
 * @param distributionProfileId string Distribution profile id.
 */
function KalturaDistributeObjectTask(){
	KalturaDistributeObjectTask.super_.call(this);
	this.distributionProfileId = null;
}
module.exports.KalturaDistributeObjectTask = KalturaDistributeObjectTask;

util.inherits(KalturaDistributeObjectTask, KalturaObjectTask);


/**
 * @param distributionProfileId int .
 * @param distributionProfile KalturaDistributionProfile .
 * @param entryDistributionId int .
 * @param entryDistribution KalturaEntryDistribution .
 * @param remoteId string Id of the media in the remote system.
 * @param providerType string .
 * @param providerData KalturaDistributionJobProviderData Additional data that relevant for the provider only.
 * @param results string The results as returned from the remote destination.
 * @param sentData string The data as sent to the remote destination.
 * @param mediaFiles array Stores array of media files that submitted to the destination site
 * Could be used later for media update.
 */
function KalturaDistributionJobData(){
	KalturaDistributionJobData.super_.call(this);
	this.distributionProfileId = null;
	this.distributionProfile = null;
	this.entryDistributionId = null;
	this.entryDistribution = null;
	this.remoteId = null;
	this.providerType = null;
	this.providerData = null;
	this.results = null;
	this.sentData = null;
	this.mediaFiles = null;
}
module.exports.KalturaDistributionJobData = KalturaDistributionJobData;

util.inherits(KalturaDistributionJobData, KalturaJobData);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param statusEqual int .
 * @param statusIn string .
 */
function KalturaDistributionProfileBaseFilter(){
	KalturaDistributionProfileBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.statusEqual = null;
	this.statusIn = null;
}
module.exports.KalturaDistributionProfileBaseFilter = KalturaDistributionProfileBaseFilter;

util.inherits(KalturaDistributionProfileBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaDistributionProfileListResponse(){
	KalturaDistributionProfileListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaDistributionProfileListResponse = KalturaDistributionProfileListResponse;

util.inherits(KalturaDistributionProfileListResponse, KalturaListResponse);


/**
 * @param typeEqual string .
 * @param typeIn string .
 */
function KalturaDistributionProviderBaseFilter(){
	KalturaDistributionProviderBaseFilter.super_.call(this);
	this.typeEqual = null;
	this.typeIn = null;
}
module.exports.KalturaDistributionProviderBaseFilter = KalturaDistributionProviderBaseFilter;

util.inherits(KalturaDistributionProviderBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaDistributionProviderListResponse(){
	KalturaDistributionProviderListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaDistributionProviderListResponse = KalturaDistributionProviderListResponse;

util.inherits(KalturaDistributionProviderListResponse, KalturaListResponse);


/**
 * @param conditionName string .
 */
function KalturaDistributionValidationErrorConditionNotMet(){
	KalturaDistributionValidationErrorConditionNotMet.super_.call(this);
	this.conditionName = null;
}
module.exports.KalturaDistributionValidationErrorConditionNotMet = KalturaDistributionValidationErrorConditionNotMet;

util.inherits(KalturaDistributionValidationErrorConditionNotMet, KalturaDistributionValidationError);


/**
 * @param fieldName string .
 * @param validationErrorType int .
 * @param validationErrorParam string Parameter of the validation error
 * For example, minimum value for KalturaDistributionValidationErrorType::STRING_TOO_SHORT validation error.
 */
function KalturaDistributionValidationErrorInvalidData(){
	KalturaDistributionValidationErrorInvalidData.super_.call(this);
	this.fieldName = null;
	this.validationErrorType = null;
	this.validationErrorParam = null;
}
module.exports.KalturaDistributionValidationErrorInvalidData = KalturaDistributionValidationErrorInvalidData;

util.inherits(KalturaDistributionValidationErrorInvalidData, KalturaDistributionValidationError);


/**
 * @param data string .
 */
function KalturaDistributionValidationErrorMissingAsset(){
	KalturaDistributionValidationErrorMissingAsset.super_.call(this);
	this.data = null;
}
module.exports.KalturaDistributionValidationErrorMissingAsset = KalturaDistributionValidationErrorMissingAsset;

util.inherits(KalturaDistributionValidationErrorMissingAsset, KalturaDistributionValidationError);


/**
 * @param flavorParamsId string .
 */
function KalturaDistributionValidationErrorMissingFlavor(){
	KalturaDistributionValidationErrorMissingFlavor.super_.call(this);
	this.flavorParamsId = null;
}
module.exports.KalturaDistributionValidationErrorMissingFlavor = KalturaDistributionValidationErrorMissingFlavor;

util.inherits(KalturaDistributionValidationErrorMissingFlavor, KalturaDistributionValidationError);


/**
 * @param fieldName string .
 */
function KalturaDistributionValidationErrorMissingMetadata(){
	KalturaDistributionValidationErrorMissingMetadata.super_.call(this);
	this.fieldName = null;
}
module.exports.KalturaDistributionValidationErrorMissingMetadata = KalturaDistributionValidationErrorMissingMetadata;

util.inherits(KalturaDistributionValidationErrorMissingMetadata, KalturaDistributionValidationError);


/**
 * @param dimensions KalturaDistributionThumbDimensions .
 */
function KalturaDistributionValidationErrorMissingThumbnail(){
	KalturaDistributionValidationErrorMissingThumbnail.super_.call(this);
	this.dimensions = null;
}
module.exports.KalturaDistributionValidationErrorMissingThumbnail = KalturaDistributionValidationErrorMissingThumbnail;

util.inherits(KalturaDistributionValidationErrorMissingThumbnail, KalturaDistributionValidationError);


/**
 * @param objects array  (readOnly).
 */
function KalturaDocumentListResponse(){
	KalturaDocumentListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaDocumentListResponse = KalturaDocumentListResponse;

util.inherits(KalturaDocumentListResponse, KalturaListResponse);


/**
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param deviceIdLike string .
 * @param providerEqual string .
 * @param providerIn string .
 */
function KalturaDrmDeviceBaseFilter(){
	KalturaDrmDeviceBaseFilter.super_.call(this);
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.deviceIdLike = null;
	this.providerEqual = null;
	this.providerIn = null;
}
module.exports.KalturaDrmDeviceBaseFilter = KalturaDrmDeviceBaseFilter;

util.inherits(KalturaDrmDeviceBaseFilter, KalturaFilter);


/**
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param nameLike string .
 * @param systemNameLike string .
 * @param providerEqual string .
 * @param providerIn string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param scenarioEqual string .
 * @param scenarioIn string .
 */
function KalturaDrmPolicyBaseFilter(){
	KalturaDrmPolicyBaseFilter.super_.call(this);
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.nameLike = null;
	this.systemNameLike = null;
	this.providerEqual = null;
	this.providerIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.scenarioEqual = null;
	this.scenarioIn = null;
}
module.exports.KalturaDrmPolicyBaseFilter = KalturaDrmPolicyBaseFilter;

util.inherits(KalturaDrmPolicyBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaDrmPolicyListResponse(){
	KalturaDrmPolicyListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaDrmPolicyListResponse = KalturaDrmPolicyListResponse;

util.inherits(KalturaDrmPolicyListResponse, KalturaListResponse);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param nameLike string .
 * @param providerEqual string .
 * @param providerIn string .
 * @param statusEqual int .
 * @param statusIn string .
 */
function KalturaDrmProfileBaseFilter(){
	KalturaDrmProfileBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.nameLike = null;
	this.providerEqual = null;
	this.providerIn = null;
	this.statusEqual = null;
	this.statusIn = null;
}
module.exports.KalturaDrmProfileBaseFilter = KalturaDrmProfileBaseFilter;

util.inherits(KalturaDrmProfileBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaDrmProfileListResponse(){
	KalturaDrmProfileListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaDrmProfileListResponse = KalturaDrmProfileListResponse;

util.inherits(KalturaDrmProfileListResponse, KalturaListResponse);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param nameLike string .
 * @param typeEqual string .
 * @param typeIn string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param conversionProfileIdEqual int .
 * @param conversionProfileIdIn string .
 * @param dcEqual int .
 * @param dcIn string .
 * @param pathEqual string .
 * @param pathLike string .
 * @param fileHandlerTypeEqual string .
 * @param fileHandlerTypeIn string .
 * @param fileNamePatternsLike string .
 * @param fileNamePatternsMultiLikeOr string .
 * @param fileNamePatternsMultiLikeAnd string .
 * @param tagsLike string .
 * @param tagsMultiLikeOr string .
 * @param tagsMultiLikeAnd string .
 * @param errorCodeEqual string .
 * @param errorCodeIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 */
function KalturaDropFolderBaseFilter(){
	KalturaDropFolderBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.nameLike = null;
	this.typeEqual = null;
	this.typeIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.conversionProfileIdEqual = null;
	this.conversionProfileIdIn = null;
	this.dcEqual = null;
	this.dcIn = null;
	this.pathEqual = null;
	this.pathLike = null;
	this.fileHandlerTypeEqual = null;
	this.fileHandlerTypeIn = null;
	this.fileNamePatternsLike = null;
	this.fileNamePatternsMultiLikeOr = null;
	this.fileNamePatternsMultiLikeAnd = null;
	this.tagsLike = null;
	this.tagsMultiLikeOr = null;
	this.tagsMultiLikeAnd = null;
	this.errorCodeEqual = null;
	this.errorCodeIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
}
module.exports.KalturaDropFolderBaseFilter = KalturaDropFolderBaseFilter;

util.inherits(KalturaDropFolderBaseFilter, KalturaFilter);


/**
 * @param contentMatchPolicy int .
 * @param slugRegex string Regular expression that defines valid file names to be handled.
 * The following might be extracted from the file name and used if defined:
 * - (?P<referenceId>\w+) - will be used as the drop folder file's parsed slug.
 * - (?P<flavorName>\w+)  - will be used as the drop folder file's parsed flavor.
 */
function KalturaDropFolderContentFileHandlerConfig(){
	KalturaDropFolderContentFileHandlerConfig.super_.call(this);
	this.contentMatchPolicy = null;
	this.slugRegex = null;
}
module.exports.KalturaDropFolderContentFileHandlerConfig = KalturaDropFolderContentFileHandlerConfig;

util.inherits(KalturaDropFolderContentFileHandlerConfig, KalturaDropFolderFileHandlerConfig);


/**
 * @param dropFolderId int .
 * @param dropFolderFileIds string .
 * @param parsedSlug string .
 * @param contentMatchPolicy int .
 * @param conversionProfileId int .
 * @param parsedUserId string .
 */
function KalturaDropFolderContentProcessorJobData(){
	KalturaDropFolderContentProcessorJobData.super_.call(this);
	this.dropFolderId = null;
	this.dropFolderFileIds = null;
	this.parsedSlug = null;
	this.contentMatchPolicy = null;
	this.conversionProfileId = null;
	this.parsedUserId = null;
}
module.exports.KalturaDropFolderContentProcessorJobData = KalturaDropFolderContentProcessorJobData;

util.inherits(KalturaDropFolderContentProcessorJobData, KalturaJobData);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param dropFolderIdEqual int .
 * @param dropFolderIdIn string .
 * @param fileNameEqual string .
 * @param fileNameIn string .
 * @param fileNameLike string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param statusNotIn string .
 * @param parsedSlugEqual string .
 * @param parsedSlugIn string .
 * @param parsedSlugLike string .
 * @param parsedFlavorEqual string .
 * @param parsedFlavorIn string .
 * @param parsedFlavorLike string .
 * @param leadDropFolderFileIdEqual int .
 * @param deletedDropFolderFileIdEqual int .
 * @param entryIdEqual string .
 * @param errorCodeEqual string .
 * @param errorCodeIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 */
function KalturaDropFolderFileBaseFilter(){
	KalturaDropFolderFileBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.dropFolderIdEqual = null;
	this.dropFolderIdIn = null;
	this.fileNameEqual = null;
	this.fileNameIn = null;
	this.fileNameLike = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.statusNotIn = null;
	this.parsedSlugEqual = null;
	this.parsedSlugIn = null;
	this.parsedSlugLike = null;
	this.parsedFlavorEqual = null;
	this.parsedFlavorIn = null;
	this.parsedFlavorLike = null;
	this.leadDropFolderFileIdEqual = null;
	this.deletedDropFolderFileIdEqual = null;
	this.entryIdEqual = null;
	this.errorCodeEqual = null;
	this.errorCodeIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
}
module.exports.KalturaDropFolderFileBaseFilter = KalturaDropFolderFileBaseFilter;

util.inherits(KalturaDropFolderFileBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaDropFolderFileListResponse(){
	KalturaDropFolderFileListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaDropFolderFileListResponse = KalturaDropFolderFileListResponse;

util.inherits(KalturaDropFolderFileListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaDropFolderListResponse(){
	KalturaDropFolderListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaDropFolderListResponse = KalturaDropFolderListResponse;

util.inherits(KalturaDropFolderListResponse, KalturaListResponse);


/**
 */
function KalturaDropFolderXmlBulkUploadFileHandlerConfig(){
	KalturaDropFolderXmlBulkUploadFileHandlerConfig.super_.call(this);
}
module.exports.KalturaDropFolderXmlBulkUploadFileHandlerConfig = KalturaDropFolderXmlBulkUploadFileHandlerConfig;

util.inherits(KalturaDropFolderXmlBulkUploadFileHandlerConfig, KalturaDropFolderFileHandlerConfig);


/**
 * @param categoryIdEqual int .
 * @param categoryIdIn string .
 * @param userIdEqual string .
 * @param userIdIn string .
 * @param permissionLevelEqual int .
 * @param permissionLevelIn string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param updateMethodEqual int .
 * @param updateMethodIn string .
 * @param categoryFullIdsStartsWith string .
 * @param categoryFullIdsEqual string .
 * @param permissionNamesMatchAnd string .
 * @param permissionNamesMatchOr string .
 * @param permissionNamesNotContains string .
 */
function KalturaCategoryUserBaseFilter(){
	KalturaCategoryUserBaseFilter.super_.call(this);
	this.categoryIdEqual = null;
	this.categoryIdIn = null;
	this.userIdEqual = null;
	this.userIdIn = null;
	this.permissionLevelEqual = null;
	this.permissionLevelIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.updateMethodEqual = null;
	this.updateMethodIn = null;
	this.categoryFullIdsStartsWith = null;
	this.categoryFullIdsEqual = null;
	this.permissionNamesMatchAnd = null;
	this.permissionNamesMatchOr = null;
	this.permissionNamesNotContains = null;
}
module.exports.KalturaCategoryUserBaseFilter = KalturaCategoryUserBaseFilter;

util.inherits(KalturaCategoryUserBaseFilter, KalturaRelatedFilter);


/**
 * @param categoryDirectMembers bool Return the list of categoryUser that are not inherited from parent category - only the direct categoryUsers.
 * @param freeText string Free text search on user id or screen name.
 * @param relatedGroupsByUserId string Return a list of categoryUser that related to the userId in this field by groups.
 */
function KalturaCategoryUserFilter(){
	KalturaCategoryUserFilter.super_.call(this);
	this.categoryDirectMembers = null;
	this.freeText = null;
	this.relatedGroupsByUserId = null;
}
module.exports.KalturaCategoryUserFilter = KalturaCategoryUserFilter;

util.inherits(KalturaCategoryUserFilter, KalturaCategoryUserBaseFilter);


/**
 * @param categoryUserFilter KalturaCategoryUserFilter .
 */
function KalturaEmailNotificationCategoryRecipientJobData(){
	KalturaEmailNotificationCategoryRecipientJobData.super_.call(this);
	this.categoryUserFilter = null;
}
module.exports.KalturaEmailNotificationCategoryRecipientJobData = KalturaEmailNotificationCategoryRecipientJobData;

util.inherits(KalturaEmailNotificationCategoryRecipientJobData, KalturaEmailNotificationRecipientJobData);


/**
 * @param categoryId KalturaStringValue The ID of the category whose subscribers should receive the email notification.
 * @param categoryUserFilter KalturaCategoryUserProviderFilter .
 */
function KalturaEmailNotificationCategoryRecipientProvider(){
	KalturaEmailNotificationCategoryRecipientProvider.super_.call(this);
	this.categoryId = null;
	this.categoryUserFilter = null;
}
module.exports.KalturaEmailNotificationCategoryRecipientProvider = KalturaEmailNotificationCategoryRecipientProvider;

util.inherits(KalturaEmailNotificationCategoryRecipientProvider, KalturaEmailNotificationRecipientProvider);


/**
 */
function KalturaEmailNotificationParameter(){
	KalturaEmailNotificationParameter.super_.call(this);
}
module.exports.KalturaEmailNotificationParameter = KalturaEmailNotificationParameter;

util.inherits(KalturaEmailNotificationParameter, KalturaEventNotificationParameter);


/**
 * @param emailRecipients array Email to emails and names.
 */
function KalturaEmailNotificationStaticRecipientJobData(){
	KalturaEmailNotificationStaticRecipientJobData.super_.call(this);
	this.emailRecipients = null;
}
module.exports.KalturaEmailNotificationStaticRecipientJobData = KalturaEmailNotificationStaticRecipientJobData;

util.inherits(KalturaEmailNotificationStaticRecipientJobData, KalturaEmailNotificationRecipientJobData);


/**
 * @param emailRecipients array Email to emails and names.
 */
function KalturaEmailNotificationStaticRecipientProvider(){
	KalturaEmailNotificationStaticRecipientProvider.super_.call(this);
	this.emailRecipients = null;
}
module.exports.KalturaEmailNotificationStaticRecipientProvider = KalturaEmailNotificationStaticRecipientProvider;

util.inherits(KalturaEmailNotificationStaticRecipientProvider, KalturaEmailNotificationRecipientProvider);


/**
 * @param format string Define the email body format.
 * @param subject string Define the email subject.
 * @param body string Define the email body content.
 * @param fromEmail string Define the email sender email.
 * @param fromName string Define the email sender name.
 * @param to KalturaEmailNotificationRecipientProvider Email recipient emails and names.
 * @param cc KalturaEmailNotificationRecipientProvider Email recipient emails and names.
 * @param bcc KalturaEmailNotificationRecipientProvider Email recipient emails and names.
 * @param replyTo KalturaEmailNotificationRecipientProvider Default email addresses to whom the reply should be sent.
 * @param priority int Define the email priority.
 * @param confirmReadingTo string Email address that a reading confirmation will be sent.
 * @param hostname string Hostname to use in Message-Id and Received headers and as default HELLO string.
 * If empty, the value returned by SERVER_NAME is used or 'localhost.localdomain'.
 * @param messageID string Sets the message ID to be used in the Message-Id header.
 * If empty, a unique id will be generated.
 * @param customHeaders array Adds a e-mail custom header.
 */
function KalturaEmailNotificationTemplate(){
	KalturaEmailNotificationTemplate.super_.call(this);
	this.format = null;
	this.subject = null;
	this.body = null;
	this.fromEmail = null;
	this.fromName = null;
	this.to = null;
	this.cc = null;
	this.bcc = null;
	this.replyTo = null;
	this.priority = null;
	this.confirmReadingTo = null;
	this.hostname = null;
	this.messageID = null;
	this.customHeaders = null;
}
module.exports.KalturaEmailNotificationTemplate = KalturaEmailNotificationTemplate;

util.inherits(KalturaEmailNotificationTemplate, KalturaEventNotificationTemplate);


/**
 * @param partnerIdEqual int .
 * @param typeEqual int .
 * @param typeIn string .
 * @param screenNameLike string .
 * @param screenNameStartsWith string .
 * @param emailLike string .
 * @param emailStartsWith string .
 * @param tagsMultiLikeOr string .
 * @param tagsMultiLikeAnd string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param firstNameStartsWith string .
 * @param lastNameStartsWith string .
 * @param isAdminEqual int .
 */
function KalturaUserBaseFilter(){
	KalturaUserBaseFilter.super_.call(this);
	this.partnerIdEqual = null;
	this.typeEqual = null;
	this.typeIn = null;
	this.screenNameLike = null;
	this.screenNameStartsWith = null;
	this.emailLike = null;
	this.emailStartsWith = null;
	this.tagsMultiLikeOr = null;
	this.tagsMultiLikeAnd = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.firstNameStartsWith = null;
	this.lastNameStartsWith = null;
	this.isAdminEqual = null;
}
module.exports.KalturaUserBaseFilter = KalturaUserBaseFilter;

util.inherits(KalturaUserBaseFilter, KalturaRelatedFilter);


/**
 * @param idOrScreenNameStartsWith string .
 * @param idEqual string .
 * @param idIn string .
 * @param loginEnabledEqual int .
 * @param roleIdEqual string .
 * @param roleIdsEqual string .
 * @param roleIdsIn string .
 * @param firstNameOrLastNameStartsWith string .
 * @param permissionNamesMultiLikeOr string Permission names filter expression.
 * @param permissionNamesMultiLikeAnd string Permission names filter expression.
 */
function KalturaUserFilter(){
	KalturaUserFilter.super_.call(this);
	this.idOrScreenNameStartsWith = null;
	this.idEqual = null;
	this.idIn = null;
	this.loginEnabledEqual = null;
	this.roleIdEqual = null;
	this.roleIdsEqual = null;
	this.roleIdsIn = null;
	this.firstNameOrLastNameStartsWith = null;
	this.permissionNamesMultiLikeOr = null;
	this.permissionNamesMultiLikeAnd = null;
}
module.exports.KalturaUserFilter = KalturaUserFilter;

util.inherits(KalturaUserFilter, KalturaUserBaseFilter);


/**
 * @param filter KalturaUserFilter .
 */
function KalturaEmailNotificationUserRecipientJobData(){
	KalturaEmailNotificationUserRecipientJobData.super_.call(this);
	this.filter = null;
}
module.exports.KalturaEmailNotificationUserRecipientJobData = KalturaEmailNotificationUserRecipientJobData;

util.inherits(KalturaEmailNotificationUserRecipientJobData, KalturaEmailNotificationRecipientJobData);


/**
 * @param filter KalturaUserFilter .
 */
function KalturaEmailNotificationUserRecipientProvider(){
	KalturaEmailNotificationUserRecipientProvider.super_.call(this);
	this.filter = null;
}
module.exports.KalturaEmailNotificationUserRecipientProvider = KalturaEmailNotificationUserRecipientProvider;

util.inherits(KalturaEmailNotificationUserRecipientProvider, KalturaEmailNotificationRecipientProvider);


/**
 * @param contentLike string .
 * @param contentMultiLikeOr string .
 * @param contentMultiLikeAnd string .
 */
function KalturaEntryCaptionAssetSearchItem(){
	KalturaEntryCaptionAssetSearchItem.super_.call(this);
	this.contentLike = null;
	this.contentMultiLikeOr = null;
	this.contentMultiLikeAnd = null;
}
module.exports.KalturaEntryCaptionAssetSearchItem = KalturaEntryCaptionAssetSearchItem;

util.inherits(KalturaEntryCaptionAssetSearchItem, KalturaSearchItem);


/**
 * @param entryId string The entry ID in the context of which the playlist should be built.
 * @param followEntryRedirect int Is this a redirected entry followup?.
 */
function KalturaEntryContext(){
	KalturaEntryContext.super_.call(this);
	this.entryId = null;
	this.followEntryRedirect = null;
}
module.exports.KalturaEntryContext = KalturaEntryContext;

util.inherits(KalturaEntryContext, KalturaContext);


/**
 * @param flavorAssetId string Id of the current flavor.
 * @param flavorTags string The tags of the flavors that should be used for playback.
 * @param streamerType string Playback streamer type: RTMP, HTTP, appleHttps, rtsp, sl.
 * @param mediaProtocol string Protocol of the specific media object.
 */
function KalturaEntryContextDataParams(){
	KalturaEntryContextDataParams.super_.call(this);
	this.flavorAssetId = null;
	this.flavorTags = null;
	this.streamerType = null;
	this.mediaProtocol = null;
}
module.exports.KalturaEntryContextDataParams = KalturaEntryContextDataParams;

util.inherits(KalturaEntryContextDataParams, KalturaAccessControlScope);


/**
 * @param isSiteRestricted bool .
 * @param isCountryRestricted bool .
 * @param isSessionRestricted bool .
 * @param isIpAddressRestricted bool .
 * @param isUserAgentRestricted bool .
 * @param previewLength int .
 * @param isScheduledNow bool .
 * @param isAdmin bool .
 * @param streamerType string http/rtmp/hdnetwork.
 * @param mediaProtocol string http/https, rtmp/rtmpe.
 * @param storageProfilesXML string .
 * @param accessControlMessages array Array of messages as received from the access control rules that invalidated.
 * @param accessControlActions array Array of actions as received from the access control rules that invalidated.
 * @param flavorAssets array Array of allowed flavor assets according to access control limitations and requested tags.
 */
function KalturaEntryContextDataResult(){
	KalturaEntryContextDataResult.super_.call(this);
	this.isSiteRestricted = null;
	this.isCountryRestricted = null;
	this.isSessionRestricted = null;
	this.isIpAddressRestricted = null;
	this.isUserAgentRestricted = null;
	this.previewLength = null;
	this.isScheduledNow = null;
	this.isAdmin = null;
	this.streamerType = null;
	this.mediaProtocol = null;
	this.storageProfilesXML = null;
	this.accessControlMessages = null;
	this.accessControlActions = null;
	this.flavorAssets = null;
}
module.exports.KalturaEntryContextDataResult = KalturaEntryContextDataResult;

util.inherits(KalturaEntryContextDataResult, KalturaContextDataResult);


/**
 * @param cuePointsFreeText string .
 * @param cuePointTypeIn string .
 * @param cuePointSubTypeEqual int .
 */
function KalturaEntryCuePointSearchFilter(){
	KalturaEntryCuePointSearchFilter.super_.call(this);
	this.cuePointsFreeText = null;
	this.cuePointTypeIn = null;
	this.cuePointSubTypeEqual = null;
}
module.exports.KalturaEntryCuePointSearchFilter = KalturaEntryCuePointSearchFilter;

util.inherits(KalturaEntryCuePointSearchFilter, KalturaSearchItem);


/**
 * @param objects array  (readOnly).
 */
function KalturaEntryDistributionListResponse(){
	KalturaEntryDistributionListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaEntryDistributionListResponse = KalturaEntryDistributionListResponse;

util.inherits(KalturaEntryDistributionListResponse, KalturaListResponse);


/**
 * @param identifier string Identifier of the object.
 */
function KalturaEntryIdentifier(){
	KalturaEntryIdentifier.super_.call(this);
	this.identifier = null;
}
module.exports.KalturaEntryIdentifier = KalturaEntryIdentifier;

util.inherits(KalturaEntryIdentifier, KalturaObjectIdentifier);


/**
 * @param entryId string .
 * @param peakAudience int .
 * @param peakDvrAudience int .
 */
function KalturaEntryLiveStats(){
	KalturaEntryLiveStats.super_.call(this);
	this.entryId = null;
	this.peakAudience = null;
	this.peakDvrAudience = null;
}
module.exports.KalturaEntryLiveStats = KalturaEntryLiveStats;

util.inherits(KalturaEntryLiveStats, KalturaLiveStats);


/**
 * @param eventType string .
 */
function KalturaEventCuePoint(){
	KalturaEventCuePoint.super_.call(this);
	this.eventType = null;
}
module.exports.KalturaEventCuePoint = KalturaEventCuePoint;

util.inherits(KalturaEventCuePoint, KalturaCuePoint);


/**
 */
function KalturaBooleanField(){
	KalturaBooleanField.super_.call(this);
}
module.exports.KalturaBooleanField = KalturaBooleanField;

util.inherits(KalturaBooleanField, KalturaBooleanValue);


/**
 * @param field KalturaBooleanField The field to be evaluated at runtime.
 */
function KalturaEventFieldCondition(){
	KalturaEventFieldCondition.super_.call(this);
	this.field = null;
}
module.exports.KalturaEventFieldCondition = KalturaEventFieldCondition;

util.inherits(KalturaEventFieldCondition, KalturaCondition);


/**
 * @param values array .
 * @param allowedValues array Used to restrict the values to close list.
 */
function KalturaEventNotificationArrayParameter(){
	KalturaEventNotificationArrayParameter.super_.call(this);
	this.values = null;
	this.allowedValues = null;
}
module.exports.KalturaEventNotificationArrayParameter = KalturaEventNotificationArrayParameter;

util.inherits(KalturaEventNotificationArrayParameter, KalturaEventNotificationParameter);


/**
 * @param templateId int .
 * @param contentParameters array Define the content dynamic parameters.
 */
function KalturaEventNotificationDispatchJobData(){
	KalturaEventNotificationDispatchJobData.super_.call(this);
	this.templateId = null;
	this.contentParameters = null;
}
module.exports.KalturaEventNotificationDispatchJobData = KalturaEventNotificationDispatchJobData;

util.inherits(KalturaEventNotificationDispatchJobData, KalturaJobData);


/**
 * @param objectId string .
 * @param scopeObjectType string .
 */
function KalturaEventNotificationScope(){
	KalturaEventNotificationScope.super_.call(this);
	this.objectId = null;
	this.scopeObjectType = null;
}
module.exports.KalturaEventNotificationScope = KalturaEventNotificationScope;

util.inherits(KalturaEventNotificationScope, KalturaScope);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param systemNameEqual string .
 * @param systemNameIn string .
 * @param typeEqual string .
 * @param typeIn string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 */
function KalturaEventNotificationTemplateBaseFilter(){
	KalturaEventNotificationTemplateBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.systemNameEqual = null;
	this.systemNameIn = null;
	this.typeEqual = null;
	this.typeIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
}
module.exports.KalturaEventNotificationTemplateBaseFilter = KalturaEventNotificationTemplateBaseFilter;

util.inherits(KalturaEventNotificationTemplateBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaEventNotificationTemplateListResponse(){
	KalturaEventNotificationTemplateListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaEventNotificationTemplateListResponse = KalturaEventNotificationTemplateListResponse;

util.inherits(KalturaEventNotificationTemplateListResponse, KalturaListResponse);


/**
 * @param modifiedColumns string Comma seperated column names to be tested.
 */
function KalturaEventObjectChangedCondition(){
	KalturaEventObjectChangedCondition.super_.call(this);
	this.modifiedColumns = null;
}
module.exports.KalturaEventObjectChangedCondition = KalturaEventObjectChangedCondition;

util.inherits(KalturaEventObjectChangedCondition, KalturaCondition);


/**
 * @param metadataProfileId int Metadata profile id to lookup the metadata object.
 * @param metadataObjectType string Metadata object type to lookup the metadata object.
 * @param xslt string The XSLT to execute.
 */
function KalturaExecuteMetadataXsltObjectTask(){
	KalturaExecuteMetadataXsltObjectTask.super_.call(this);
	this.metadataProfileId = null;
	this.metadataObjectType = null;
	this.xslt = null;
}
module.exports.KalturaExecuteMetadataXsltObjectTask = KalturaExecuteMetadataXsltObjectTask;

util.inherits(KalturaExecuteMetadataXsltObjectTask, KalturaObjectTask);


/**
 * @param objects array  (readOnly).
 */
function KalturaExternalMediaEntryListResponse(){
	KalturaExternalMediaEntryListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaExternalMediaEntryListResponse = KalturaExternalMediaEntryListResponse;

util.inherits(KalturaExternalMediaEntryListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaFeatureStatusListResponse(){
	KalturaFeatureStatusListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaFeatureStatusListResponse = KalturaFeatureStatusListResponse;

util.inherits(KalturaFeatureStatusListResponse, KalturaListResponse);


/**
 * @param itemHandlingLimit int .
 * @param feedItemInfo KalturaFeedItemInfo .
 */
function KalturaFeedDropFolder(){
	KalturaFeedDropFolder.super_.call(this);
	this.itemHandlingLimit = null;
	this.feedItemInfo = null;
}
module.exports.KalturaFeedDropFolder = KalturaFeedDropFolder;

util.inherits(KalturaFeedDropFolder, KalturaDropFolder);


/**
 * @param hash string MD5 or Sha1 encrypted string.
 * @param feedXmlPath string Path of the original Feed content XML.
 */
function KalturaFeedDropFolderFile(){
	KalturaFeedDropFolderFile.super_.call(this);
	this.hash = null;
	this.feedXmlPath = null;
}
module.exports.KalturaFeedDropFolderFile = KalturaFeedDropFolderFile;

util.inherits(KalturaFeedDropFolderFile, KalturaDropFolderFile);


/**
 * @param objects array  (readOnly).
 */
function KalturaFileAssetListResponse(){
	KalturaFileAssetListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaFileAssetListResponse = KalturaFileAssetListResponse;

util.inherits(KalturaFileAssetListResponse, KalturaListResponse);


/**
 * @param partnerIdEqual int .
 * @param fileObjectTypeEqual string .
 * @param fileObjectTypeIn string .
 * @param objectIdEqual string .
 * @param objectIdIn string .
 * @param versionEqual string .
 * @param versionIn string .
 * @param objectSubTypeEqual int .
 * @param objectSubTypeIn string .
 * @param dcEqual string .
 * @param dcIn string .
 * @param originalEqual int .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param readyAtGreaterThanOrEqual int .
 * @param readyAtLessThanOrEqual int .
 * @param syncTimeGreaterThanOrEqual int .
 * @param syncTimeLessThanOrEqual int .
 * @param statusEqual int .
 * @param statusIn string .
 * @param fileTypeEqual int .
 * @param fileTypeIn string .
 * @param linkedIdEqual int .
 * @param linkCountGreaterThanOrEqual int .
 * @param linkCountLessThanOrEqual int .
 * @param fileSizeGreaterThanOrEqual float .
 * @param fileSizeLessThanOrEqual float .
 */
function KalturaFileSyncBaseFilter(){
	KalturaFileSyncBaseFilter.super_.call(this);
	this.partnerIdEqual = null;
	this.fileObjectTypeEqual = null;
	this.fileObjectTypeIn = null;
	this.objectIdEqual = null;
	this.objectIdIn = null;
	this.versionEqual = null;
	this.versionIn = null;
	this.objectSubTypeEqual = null;
	this.objectSubTypeIn = null;
	this.dcEqual = null;
	this.dcIn = null;
	this.originalEqual = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.readyAtGreaterThanOrEqual = null;
	this.readyAtLessThanOrEqual = null;
	this.syncTimeGreaterThanOrEqual = null;
	this.syncTimeLessThanOrEqual = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.fileTypeEqual = null;
	this.fileTypeIn = null;
	this.linkedIdEqual = null;
	this.linkCountGreaterThanOrEqual = null;
	this.linkCountLessThanOrEqual = null;
	this.fileSizeGreaterThanOrEqual = null;
	this.fileSizeLessThanOrEqual = null;
}
module.exports.KalturaFileSyncBaseFilter = KalturaFileSyncBaseFilter;

util.inherits(KalturaFileSyncBaseFilter, KalturaFilter);


/**
 * @param sourceUrl string .
 * @param filesyncId string .
 * @param tmpFilePath string .
 * @param destFilePath string .
 * @param fileSize int .
 */
function KalturaFileSyncImportJobData(){
	KalturaFileSyncImportJobData.super_.call(this);
	this.sourceUrl = null;
	this.filesyncId = null;
	this.tmpFilePath = null;
	this.destFilePath = null;
	this.fileSize = null;
}
module.exports.KalturaFileSyncImportJobData = KalturaFileSyncImportJobData;

util.inherits(KalturaFileSyncImportJobData, KalturaJobData);


/**
 * @param objects array  (readOnly).
 */
function KalturaFileSyncListResponse(){
	KalturaFileSyncListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaFileSyncListResponse = KalturaFileSyncListResponse;

util.inherits(KalturaFileSyncListResponse, KalturaListResponse);


/**
 */
function KalturaFlattenJobData(){
	KalturaFlattenJobData.super_.call(this);
}
module.exports.KalturaFlattenJobData = KalturaFlattenJobData;

util.inherits(KalturaFlattenJobData, KalturaJobData);


/**
 * @param objects array  (readOnly).
 */
function KalturaFlavorAssetListResponse(){
	KalturaFlavorAssetListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaFlavorAssetListResponse = KalturaFlavorAssetListResponse;

util.inherits(KalturaFlavorAssetListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaFlavorParamsListResponse(){
	KalturaFlavorParamsListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaFlavorParamsListResponse = KalturaFlavorParamsListResponse;

util.inherits(KalturaFlavorParamsListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaFlavorParamsOutputListResponse(){
	KalturaFlavorParamsOutputListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaFlavorParamsOutputListResponse = KalturaFlavorParamsOutputListResponse;

util.inherits(KalturaFlavorParamsOutputListResponse, KalturaListResponse);


/**
 * @param xml string .
 * @param resultParseData string .
 * @param resultParserType int .
 */
function KalturaGenericDistributionJobProviderData(){
	KalturaGenericDistributionJobProviderData.super_.call(this);
	this.xml = null;
	this.resultParseData = null;
	this.resultParserType = null;
}
module.exports.KalturaGenericDistributionJobProviderData = KalturaGenericDistributionJobProviderData;

util.inherits(KalturaGenericDistributionJobProviderData, KalturaDistributionJobProviderData);


/**
 * @param genericProviderId int  (insertOnly).
 * @param submitAction KalturaGenericDistributionProfileAction .
 * @param updateAction KalturaGenericDistributionProfileAction .
 * @param deleteAction KalturaGenericDistributionProfileAction .
 * @param fetchReportAction KalturaGenericDistributionProfileAction .
 * @param updateRequiredEntryFields string .
 * @param updateRequiredMetadataXPaths string .
 */
function KalturaGenericDistributionProfile(){
	KalturaGenericDistributionProfile.super_.call(this);
	this.genericProviderId = null;
	this.submitAction = null;
	this.updateAction = null;
	this.deleteAction = null;
	this.fetchReportAction = null;
	this.updateRequiredEntryFields = null;
	this.updateRequiredMetadataXPaths = null;
}
module.exports.KalturaGenericDistributionProfile = KalturaGenericDistributionProfile;

util.inherits(KalturaGenericDistributionProfile, KalturaDistributionProfile);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param genericDistributionProviderIdEqual int .
 * @param genericDistributionProviderIdIn string .
 * @param actionEqual int .
 * @param actionIn string .
 */
function KalturaGenericDistributionProviderActionBaseFilter(){
	KalturaGenericDistributionProviderActionBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.genericDistributionProviderIdEqual = null;
	this.genericDistributionProviderIdIn = null;
	this.actionEqual = null;
	this.actionIn = null;
}
module.exports.KalturaGenericDistributionProviderActionBaseFilter = KalturaGenericDistributionProviderActionBaseFilter;

util.inherits(KalturaGenericDistributionProviderActionBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaGenericDistributionProviderActionListResponse(){
	KalturaGenericDistributionProviderActionListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaGenericDistributionProviderActionListResponse = KalturaGenericDistributionProviderActionListResponse;

util.inherits(KalturaGenericDistributionProviderActionListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaGenericDistributionProviderListResponse(){
	KalturaGenericDistributionProviderListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaGenericDistributionProviderListResponse = KalturaGenericDistributionProviderListResponse;

util.inherits(KalturaGenericDistributionProviderListResponse, KalturaListResponse);


/**
 * @param feedDescription string feed description.
 * @param feedLandingPage string feed landing page (i.e publisher website).
 */
function KalturaGenericSyndicationFeed(){
	KalturaGenericSyndicationFeed.super_.call(this);
	this.feedDescription = null;
	this.feedLandingPage = null;
}
module.exports.KalturaGenericSyndicationFeed = KalturaGenericSyndicationFeed;

util.inherits(KalturaGenericSyndicationFeed, KalturaBaseSyndicationFeed);


/**
 * @param adultContent string .
 */
function KalturaGoogleVideoSyndicationFeed(){
	KalturaGoogleVideoSyndicationFeed.super_.call(this);
	this.adultContent = null;
}
module.exports.KalturaGoogleVideoSyndicationFeed = KalturaGoogleVideoSyndicationFeed;

util.inherits(KalturaGoogleVideoSyndicationFeed, KalturaBaseSyndicationFeed);


/**
 * @param objects array  (readOnly).
 */
function KalturaGroupUserListResponse(){
	KalturaGroupUserListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaGroupUserListResponse = KalturaGroupUserListResponse;

util.inherits(KalturaGroupUserListResponse, KalturaListResponse);


/**
 */
function KalturaHttpNotificationDataFields(){
	KalturaHttpNotificationDataFields.super_.call(this);
}
module.exports.KalturaHttpNotificationDataFields = KalturaHttpNotificationDataFields;

util.inherits(KalturaHttpNotificationDataFields, KalturaHttpNotificationData);


/**
 * @param content KalturaStringValue .
 */
function KalturaHttpNotificationDataText(){
	KalturaHttpNotificationDataText.super_.call(this);
	this.content = null;
}
module.exports.KalturaHttpNotificationDataText = KalturaHttpNotificationDataText;

util.inherits(KalturaHttpNotificationDataText, KalturaHttpNotificationData);


/**
 * @param apiObjectType string Kaltura API object type.
 * @param format int Data format.
 * @param ignoreNull bool Ignore null attributes during serialization.
 * @param code string PHP code.
 */
function KalturaHttpNotificationObjectData(){
	KalturaHttpNotificationObjectData.super_.call(this);
	this.apiObjectType = null;
	this.format = null;
	this.ignoreNull = null;
	this.code = null;
}
module.exports.KalturaHttpNotificationObjectData = KalturaHttpNotificationObjectData;

util.inherits(KalturaHttpNotificationObjectData, KalturaHttpNotificationData);


/**
 * @param url string Remote server URL.
 * @param method int Request method.
 * @param data KalturaHttpNotificationData Data to send.
 * @param timeout int The maximum number of seconds to allow cURL functions to execute.
 * @param connectTimeout int The number of seconds to wait while trying to connect.
 * Must be larger than zero.
 * @param username string A username to use for the connection.
 * @param password string A password to use for the connection.
 * @param authenticationMethod int The HTTP authentication method to use.
 * @param sslVersion int The SSL version (2 or 3) to use.
 * By default PHP will try to determine this itself, although in some cases this must be set manually.
 * @param sslCertificate string SSL certificate to verify the peer with.
 * @param sslCertificateType string The format of the certificate.
 * @param sslCertificatePassword string The password required to use the certificate.
 * @param sslEngine string The identifier for the crypto engine of the private SSL key specified in ssl key.
 * @param sslEngineDefault string The identifier for the crypto engine used for asymmetric crypto operations.
 * @param sslKeyType string The key type of the private SSL key specified in ssl key - PEM / DER / ENG.
 * @param sslKey string Private SSL key.
 * @param sslKeyPassword string The secret password needed to use the private SSL key specified in ssl key.
 * @param customHeaders array Adds a e-mail custom header.
 */
function KalturaHttpNotificationTemplate(){
	KalturaHttpNotificationTemplate.super_.call(this);
	this.url = null;
	this.method = null;
	this.data = null;
	this.timeout = null;
	this.connectTimeout = null;
	this.username = null;
	this.password = null;
	this.authenticationMethod = null;
	this.sslVersion = null;
	this.sslCertificate = null;
	this.sslCertificateType = null;
	this.sslCertificatePassword = null;
	this.sslEngine = null;
	this.sslEngineDefault = null;
	this.sslKeyType = null;
	this.sslKey = null;
	this.sslKeyPassword = null;
	this.customHeaders = null;
}
module.exports.KalturaHttpNotificationTemplate = KalturaHttpNotificationTemplate;

util.inherits(KalturaHttpNotificationTemplate, KalturaEventNotificationTemplate);


/**
 * @param feedDescription string feed description.
 * @param language string feed language.
 * @param feedLandingPage string feed landing page (i.e publisher website).
 * @param ownerName string author/publisher name.
 * @param ownerEmail string publisher email.
 * @param feedImageUrl string podcast thumbnail.
 * @param category string  (readOnly).
 * @param adultContent string .
 * @param feedAuthor string .
 * @param enforceOrder int true in case you want to enfore the palylist order on the.
 */
function KalturaITunesSyndicationFeed(){
	KalturaITunesSyndicationFeed.super_.call(this);
	this.feedDescription = null;
	this.language = null;
	this.feedLandingPage = null;
	this.ownerName = null;
	this.ownerEmail = null;
	this.feedImageUrl = null;
	this.category = null;
	this.adultContent = null;
	this.feedAuthor = null;
	this.enforceOrder = null;
}
module.exports.KalturaITunesSyndicationFeed = KalturaITunesSyndicationFeed;

util.inherits(KalturaITunesSyndicationFeed, KalturaBaseSyndicationFeed);


/**
 * @param srcFileUrl string .
 * @param destFileLocalPath string .
 * @param flavorAssetId string .
 * @param fileSize int .
 */
function KalturaImportJobData(){
	KalturaImportJobData.super_.call(this);
	this.srcFileUrl = null;
	this.destFileLocalPath = null;
	this.flavorAssetId = null;
	this.fileSize = null;
}
module.exports.KalturaImportJobData = KalturaImportJobData;

util.inherits(KalturaImportJobData, KalturaJobData);


/**
 * @param srcFileUrl string .
 * @param destFileLocalPath string .
 * @param metadataId int .
 */
function KalturaImportMetadataJobData(){
	KalturaImportMetadataJobData.super_.call(this);
	this.srcFileUrl = null;
	this.destFileLocalPath = null;
	this.metadataId = null;
}
module.exports.KalturaImportMetadataJobData = KalturaImportMetadataJobData;

util.inherits(KalturaImportMetadataJobData, KalturaJobData);


/**
 * @param indexIdGreaterThan int .
 */
function KalturaIndexAdvancedFilter(){
	KalturaIndexAdvancedFilter.super_.call(this);
	this.indexIdGreaterThan = null;
}
module.exports.KalturaIndexAdvancedFilter = KalturaIndexAdvancedFilter;

util.inherits(KalturaIndexAdvancedFilter, KalturaSearchItem);


/**
 * @param filter KalturaFilter The filter should return the list of objects that need to be reindexed.
 * @param lastIndexId int Indicates the last id that reindexed, used when the batch crached, to re-run from the last crash point.
 * @param shouldUpdate bool Indicates that the object columns and attributes values should be recalculated before reindexed.
 */
function KalturaIndexJobData(){
	KalturaIndexJobData.super_.call(this);
	this.filter = null;
	this.lastIndexId = null;
	this.shouldUpdate = null;
}
module.exports.KalturaIndexJobData = KalturaIndexJobData;

util.inherits(KalturaIndexJobData, KalturaJobData);


/**
 * @param changedCategoryId int .
 * @param deletedPrivacyContexts string .
 * @param addedPrivacyContexts string .
 */
function KalturaIndexTagsByPrivacyContextJobData(){
	KalturaIndexTagsByPrivacyContextJobData.super_.call(this);
	this.changedCategoryId = null;
	this.deletedPrivacyContexts = null;
	this.addedPrivacyContexts = null;
}
module.exports.KalturaIndexTagsByPrivacyContextJobData = KalturaIndexTagsByPrivacyContextJobData;

util.inherits(KalturaIndexTagsByPrivacyContextJobData, KalturaJobData);


/**
 * @param callbackNotificationBaseUrl string .
 * @param providerType string .
 * @param providerData KalturaIntegrationJobProviderData Additional data that relevant for the provider only.
 * @param triggerType string .
 * @param triggerData KalturaIntegrationJobTriggerData Additional data that relevant for the trigger only.
 */
function KalturaIntegrationJobData(){
	KalturaIntegrationJobData.super_.call(this);
	this.callbackNotificationBaseUrl = null;
	this.providerType = null;
	this.providerData = null;
	this.triggerType = null;
	this.triggerData = null;
}
module.exports.KalturaIntegrationJobData = KalturaIntegrationJobData;

util.inherits(KalturaIntegrationJobData, KalturaJobData);


/**
 * @param ipAddressRestrictionType int Ip address restriction type (Allow or deny).
 * @param ipAddressList string Comma separated list of ip address to allow to deny.
 */
function KalturaIpAddressRestriction(){
	KalturaIpAddressRestriction.super_.call(this);
	this.ipAddressRestrictionType = null;
	this.ipAddressList = null;
}
module.exports.KalturaIpAddressRestriction = KalturaIpAddressRestriction;

util.inherits(KalturaIpAddressRestriction, KalturaBaseRestriction);


/**
 * @param serviceToken string .
 */
function KalturaKontikiStorageProfile(){
	KalturaKontikiStorageProfile.super_.call(this);
	this.serviceToken = null;
}
module.exports.KalturaKontikiStorageProfile = KalturaKontikiStorageProfile;

util.inherits(KalturaKontikiStorageProfile, KalturaStorageProfile);


/**
 * @param limitFlavorsRestrictionType int Limit flavors restriction type (Allow or deny).
 * @param flavorParamsIds string Comma separated list of flavor params ids to allow to deny.
 */
function KalturaLimitFlavorsRestriction(){
	KalturaLimitFlavorsRestriction.super_.call(this);
	this.limitFlavorsRestrictionType = null;
	this.flavorParamsIds = null;
}
module.exports.KalturaLimitFlavorsRestriction = KalturaLimitFlavorsRestriction;

util.inherits(KalturaLimitFlavorsRestriction, KalturaBaseRestriction);


/**
 * @param objects array  (readOnly).
 */
function KalturaLiveChannelListResponse(){
	KalturaLiveChannelListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaLiveChannelListResponse = KalturaLiveChannelListResponse;

util.inherits(KalturaLiveChannelListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaLiveChannelSegmentListResponse(){
	KalturaLiveChannelSegmentListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaLiveChannelSegmentListResponse = KalturaLiveChannelSegmentListResponse;

util.inherits(KalturaLiveChannelSegmentListResponse, KalturaListResponse);


/**
 * @param timeReference int .
 * @param timeZoneOffset int .
 * @param entryIds string .
 * @param outputPath string .
 * @param recipientEmail string .
 */
function KalturaLiveReportExportJobData(){
	KalturaLiveReportExportJobData.super_.call(this);
	this.timeReference = null;
	this.timeZoneOffset = null;
	this.entryIds = null;
	this.outputPath = null;
	this.recipientEmail = null;
}
module.exports.KalturaLiveReportExportJobData = KalturaLiveReportExportJobData;

util.inherits(KalturaLiveReportExportJobData, KalturaJobData);


/**
 * @param objects KalturaLiveStats .
 */
function KalturaLiveStatsListResponse(){
	KalturaLiveStatsListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaLiveStatsListResponse = KalturaLiveStatsListResponse;

util.inherits(KalturaLiveStatsListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaLiveStreamListResponse(){
	KalturaLiveStreamListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaLiveStreamListResponse = KalturaLiveStreamListResponse;

util.inherits(KalturaLiveStreamListResponse, KalturaListResponse);


/**
 * @param userId string .
 * @param password string .
 * @param streamName string .
 * @param applicationName string .
 */
function KalturaLiveStreamPushPublishRTMPConfiguration(){
	KalturaLiveStreamPushPublishRTMPConfiguration.super_.call(this);
	this.userId = null;
	this.password = null;
	this.streamName = null;
	this.applicationName = null;
}
module.exports.KalturaLiveStreamPushPublishRTMPConfiguration = KalturaLiveStreamPushPublishRTMPConfiguration;

util.inherits(KalturaLiveStreamPushPublishRTMPConfiguration, KalturaLiveStreamPushPublishConfiguration);


/**
 * @param mailType string .
 * @param mailPriority int .
 * @param status int .
 * @param recipientName string .
 * @param recipientEmail string .
 * @param recipientId int kuserId.
 * @param fromName string .
 * @param fromEmail string .
 * @param bodyParams string .
 * @param subjectParams string .
 * @param templatePath string .
 * @param language string .
 * @param campaignId int .
 * @param minSendDate int .
 * @param isHtml bool .
 * @param separator string .
 */
function KalturaMailJobData(){
	KalturaMailJobData.super_.call(this);
	this.mailType = null;
	this.mailPriority = null;
	this.status = null;
	this.recipientName = null;
	this.recipientEmail = null;
	this.recipientId = null;
	this.fromName = null;
	this.fromEmail = null;
	this.bodyParams = null;
	this.subjectParams = null;
	this.templatePath = null;
	this.language = null;
	this.campaignId = null;
	this.minSendDate = null;
	this.isHtml = null;
	this.separator = null;
}
module.exports.KalturaMailJobData = KalturaMailJobData;

util.inherits(KalturaMailJobData, KalturaJobData);


/**
 * @param values array .
 */
function KalturaMatchCondition(){
	KalturaMatchCondition.super_.call(this);
	this.values = null;
}
module.exports.KalturaMatchCondition = KalturaMatchCondition;

util.inherits(KalturaMatchCondition, KalturaCondition);


/**
 * @param flavorAssetIdEqual string .
 */
function KalturaMediaInfoBaseFilter(){
	KalturaMediaInfoBaseFilter.super_.call(this);
	this.flavorAssetIdEqual = null;
}
module.exports.KalturaMediaInfoBaseFilter = KalturaMediaInfoBaseFilter;

util.inherits(KalturaMediaInfoBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaMediaInfoListResponse(){
	KalturaMediaInfoListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaMediaInfoListResponse = KalturaMediaInfoListResponse;

util.inherits(KalturaMediaInfoListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaMediaListResponse(){
	KalturaMediaListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaMediaListResponse = KalturaMediaListResponse;

util.inherits(KalturaMediaListResponse, KalturaListResponse);


/**
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 */
function KalturaMediaServerBaseFilter(){
	KalturaMediaServerBaseFilter.super_.call(this);
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
}
module.exports.KalturaMediaServerBaseFilter = KalturaMediaServerBaseFilter;

util.inherits(KalturaMediaServerBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaMetadataListResponse(){
	KalturaMetadataListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaMetadataListResponse = KalturaMetadataListResponse;

util.inherits(KalturaMetadataListResponse, KalturaListResponse);


/**
 * @param idEqual int .
 * @param partnerIdEqual int .
 * @param metadataObjectTypeEqual string .
 * @param metadataObjectTypeIn string .
 * @param versionEqual int .
 * @param nameEqual string .
 * @param systemNameEqual string .
 * @param systemNameIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param statusEqual int .
 * @param statusIn string .
 * @param createModeEqual int .
 * @param createModeNotEqual int .
 * @param createModeIn string .
 * @param createModeNotIn string .
 */
function KalturaMetadataProfileBaseFilter(){
	KalturaMetadataProfileBaseFilter.super_.call(this);
	this.idEqual = null;
	this.partnerIdEqual = null;
	this.metadataObjectTypeEqual = null;
	this.metadataObjectTypeIn = null;
	this.versionEqual = null;
	this.nameEqual = null;
	this.systemNameEqual = null;
	this.systemNameIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.createModeEqual = null;
	this.createModeNotEqual = null;
	this.createModeIn = null;
	this.createModeNotIn = null;
}
module.exports.KalturaMetadataProfileBaseFilter = KalturaMetadataProfileBaseFilter;

util.inherits(KalturaMetadataProfileBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaMetadataProfileFieldListResponse(){
	KalturaMetadataProfileFieldListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaMetadataProfileFieldListResponse = KalturaMetadataProfileFieldListResponse;

util.inherits(KalturaMetadataProfileFieldListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaMetadataProfileListResponse(){
	KalturaMetadataProfileListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaMetadataProfileListResponse = KalturaMetadataProfileListResponse;

util.inherits(KalturaMetadataProfileListResponse, KalturaListResponse);


/**
 */
function KalturaMetadataResponseProfileMapping(){
	KalturaMetadataResponseProfileMapping.super_.call(this);
}
module.exports.KalturaMetadataResponseProfileMapping = KalturaMetadataResponseProfileMapping;

util.inherits(KalturaMetadataResponseProfileMapping, KalturaResponseProfileMapping);


/**
 * @param objects array  (readOnly).
 */
function KalturaMixListResponse(){
	KalturaMixListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaMixListResponse = KalturaMixListResponse;

util.inherits(KalturaMixListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaModerationFlagListResponse(){
	KalturaModerationFlagListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaModerationFlagListResponse = KalturaModerationFlagListResponse;

util.inherits(KalturaModerationFlagListResponse, KalturaListResponse);


/**
 * @param addRemoveType int Should the object task add or remove categories?.
 * @param categoryIds array The list of category ids to add or remove.
 */
function KalturaModifyCategoriesObjectTask(){
	KalturaModifyCategoriesObjectTask.super_.call(this);
	this.addRemoveType = null;
	this.categoryIds = null;
}
module.exports.KalturaModifyCategoriesObjectTask = KalturaModifyCategoriesObjectTask;

util.inherits(KalturaModifyCategoriesObjectTask, KalturaObjectTask);


/**
 * @param srcCategoryId int Source category id.
 * @param destCategoryId int Destination category id.
 * @param lastMovedCategoryId int Saves the last category id that its entries moved completely
 * In case of crash the batch will restart from that point.
 * @param lastMovedCategoryPageIndex int Saves the last page index of the child categories filter pager
 * In case of crash the batch will restart from that point.
 * @param lastMovedCategoryEntryPageIndex int Saves the last page index of the category entries filter pager
 * In case of crash the batch will restart from that point.
 * @param moveFromChildren bool All entries from all child categories will be moved as well.
 * @param copyOnly bool Entries won't be deleted from the source entry.
 * @param destCategoryFullIds string Destination categories fallback ids.
 */
function KalturaMoveCategoryEntriesJobData(){
	KalturaMoveCategoryEntriesJobData.super_.call(this);
	this.srcCategoryId = null;
	this.destCategoryId = null;
	this.lastMovedCategoryId = null;
	this.lastMovedCategoryPageIndex = null;
	this.lastMovedCategoryEntryPageIndex = null;
	this.moveFromChildren = null;
	this.copyOnly = null;
	this.destCategoryFullIds = null;
}
module.exports.KalturaMoveCategoryEntriesJobData = KalturaMoveCategoryEntriesJobData;

util.inherits(KalturaMoveCategoryEntriesJobData, KalturaJobData);


/**
 * @param userId string .
 * @param type int .
 * @param typeAsString string .
 * @param objectId string .
 * @param status int .
 * @param data string .
 * @param numberOfAttempts int .
 * @param notificationResult string .
 * @param objType int .
 */
function KalturaNotificationJobData(){
	KalturaNotificationJobData.super_.call(this);
	this.userId = null;
	this.type = null;
	this.typeAsString = null;
	this.objectId = null;
	this.status = null;
	this.data = null;
	this.numberOfAttempts = null;
	this.notificationResult = null;
	this.objType = null;
}
module.exports.KalturaNotificationJobData = KalturaNotificationJobData;

util.inherits(KalturaNotificationJobData, KalturaJobData);


/**
 * @param objects array  (readOnly).
 */
function KalturaObjectListResponse(){
	KalturaObjectListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaObjectListResponse = KalturaObjectListResponse;

util.inherits(KalturaObjectListResponse, KalturaListResponse);


/**
 * @param conditions array .
 */
function KalturaOrCondition(){
	KalturaOrCondition.super_.call(this);
	this.conditions = null;
}
module.exports.KalturaOrCondition = KalturaOrCondition;

util.inherits(KalturaOrCondition, KalturaCondition);


/**
 * @param captionAssetId string .
 */
function KalturaParseCaptionAssetJobData(){
	KalturaParseCaptionAssetJobData.super_.call(this);
	this.captionAssetId = null;
}
module.exports.KalturaParseCaptionAssetJobData = KalturaParseCaptionAssetJobData;

util.inherits(KalturaParseCaptionAssetJobData, KalturaJobData);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param idNotIn string .
 * @param nameLike string .
 * @param nameMultiLikeOr string .
 * @param nameMultiLikeAnd string .
 * @param nameEqual string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param partnerPackageEqual int .
 * @param partnerPackageGreaterThanOrEqual int .
 * @param partnerPackageLessThanOrEqual int .
 * @param partnerGroupTypeEqual int .
 * @param partnerNameDescriptionWebsiteAdminNameAdminEmailLike string .
 */
function KalturaPartnerBaseFilter(){
	KalturaPartnerBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.idNotIn = null;
	this.nameLike = null;
	this.nameMultiLikeOr = null;
	this.nameMultiLikeAnd = null;
	this.nameEqual = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.partnerPackageEqual = null;
	this.partnerPackageGreaterThanOrEqual = null;
	this.partnerPackageLessThanOrEqual = null;
	this.partnerGroupTypeEqual = null;
	this.partnerNameDescriptionWebsiteAdminNameAdminEmailLike = null;
}
module.exports.KalturaPartnerBaseFilter = KalturaPartnerBaseFilter;

util.inherits(KalturaPartnerBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaPartnerListResponse(){
	KalturaPartnerListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaPartnerListResponse = KalturaPartnerListResponse;

util.inherits(KalturaPartnerListResponse, KalturaListResponse);


/**
 * @param total KalturaVarPartnerUsageItem .
 * @param objects array .
 */
function KalturaPartnerUsageListResponse(){
	KalturaPartnerUsageListResponse.super_.call(this);
	this.total = null;
	this.objects = null;
}
module.exports.KalturaPartnerUsageListResponse = KalturaPartnerUsageListResponse;

util.inherits(KalturaPartnerUsageListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaPermissionItemListResponse(){
	KalturaPermissionItemListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaPermissionItemListResponse = KalturaPermissionItemListResponse;

util.inherits(KalturaPermissionItemListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaPermissionListResponse(){
	KalturaPermissionListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaPermissionListResponse = KalturaPermissionListResponse;

util.inherits(KalturaPermissionListResponse, KalturaListResponse);


/**
 * @param copyCount int .
 * @param copyEnablers array .
 */
function KalturaPlayReadyCopyRight(){
	KalturaPlayReadyCopyRight.super_.call(this);
	this.copyCount = null;
	this.copyEnablers = null;
}
module.exports.KalturaPlayReadyCopyRight = KalturaPlayReadyCopyRight;

util.inherits(KalturaPlayReadyCopyRight, KalturaPlayReadyRight);


/**
 * @param analogVideoOPL int .
 * @param analogVideoOutputProtectionList array .
 * @param compressedDigitalAudioOPL int .
 * @param compressedDigitalVideoOPL int .
 * @param digitalAudioOutputProtectionList array .
 * @param uncompressedDigitalAudioOPL int .
 * @param uncompressedDigitalVideoOPL int .
 * @param firstPlayExpiration int .
 * @param playEnablers array .
 */
function KalturaPlayReadyPlayRight(){
	KalturaPlayReadyPlayRight.super_.call(this);
	this.analogVideoOPL = null;
	this.analogVideoOutputProtectionList = null;
	this.compressedDigitalAudioOPL = null;
	this.compressedDigitalVideoOPL = null;
	this.digitalAudioOutputProtectionList = null;
	this.uncompressedDigitalAudioOPL = null;
	this.uncompressedDigitalVideoOPL = null;
	this.firstPlayExpiration = null;
	this.playEnablers = null;
}
module.exports.KalturaPlayReadyPlayRight = KalturaPlayReadyPlayRight;

util.inherits(KalturaPlayReadyPlayRight, KalturaPlayReadyRight);


/**
 * @param keySeed string .
 */
function KalturaPlayReadyProfile(){
	KalturaPlayReadyProfile.super_.call(this);
	this.keySeed = null;
}
module.exports.KalturaPlayReadyProfile = KalturaPlayReadyProfile;

util.inherits(KalturaPlayReadyProfile, KalturaDrmProfile);


/**
 * @param objects array  (readOnly).
 */
function KalturaPlaylistListResponse(){
	KalturaPlaylistListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaPlaylistListResponse = KalturaPlaylistListResponse;

util.inherits(KalturaPlaylistListResponse, KalturaListResponse);


/**
 * @param streamID string .
 * @param backupStreamID string .
 * @param rtmp string .
 * @param encoderIP string .
 * @param backupEncoderIP string .
 * @param encoderPassword string .
 * @param encoderUsername string .
 * @param endDate int .
 * @param returnVal string .
 * @param mediaType int .
 * @param primaryBroadcastingUrl string .
 * @param secondaryBroadcastingUrl string .
 * @param streamName string .
 */
function KalturaProvisionJobData(){
	KalturaProvisionJobData.super_.call(this);
	this.streamID = null;
	this.backupStreamID = null;
	this.rtmp = null;
	this.encoderIP = null;
	this.backupEncoderIP = null;
	this.encoderPassword = null;
	this.encoderUsername = null;
	this.endDate = null;
	this.returnVal = null;
	this.mediaType = null;
	this.primaryBroadcastingUrl = null;
	this.secondaryBroadcastingUrl = null;
	this.streamName = null;
}
module.exports.KalturaProvisionJobData = KalturaProvisionJobData;

util.inherits(KalturaProvisionJobData, KalturaJobData);


/**
 */
function KalturaRemoteDropFolder(){
	KalturaRemoteDropFolder.super_.call(this);
}
module.exports.KalturaRemoteDropFolder = KalturaRemoteDropFolder;

util.inherits(KalturaRemoteDropFolder, KalturaDropFolder);


/**
 * @param objects array  (readOnly).
 */
function KalturaRemotePathListResponse(){
	KalturaRemotePathListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaRemotePathListResponse = KalturaRemotePathListResponse;

util.inherits(KalturaRemotePathListResponse, KalturaListResponse);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param systemNameEqual string .
 * @param systemNameIn string .
 */
function KalturaReportBaseFilter(){
	KalturaReportBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.systemNameEqual = null;
	this.systemNameIn = null;
}
module.exports.KalturaReportBaseFilter = KalturaReportBaseFilter;

util.inherits(KalturaReportBaseFilter, KalturaFilter);


/**
 * @param keywords string Search keywords to filter objects.
 * @param searchInTags bool Search keywords in onjects tags.
 * @param searchInAdminTags bool Search keywords in onjects admin tags.
 * @param categories string Search onjects in specified categories.
 * @param timeZoneOffset int Time zone offset in minutes.
 * @param interval string Aggregated results according to interval.
 */
function KalturaReportInputFilter(){
	KalturaReportInputFilter.super_.call(this);
	this.keywords = null;
	this.searchInTags = null;
	this.searchInAdminTags = null;
	this.categories = null;
	this.timeZoneOffset = null;
	this.interval = null;
}
module.exports.KalturaReportInputFilter = KalturaReportInputFilter;

util.inherits(KalturaReportInputFilter, KalturaReportInputBaseFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaReportListResponse(){
	KalturaReportListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaReportListResponse = KalturaReportListResponse;

util.inherits(KalturaReportListResponse, KalturaListResponse);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param systemNameEqual string .
 * @param systemNameIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param statusEqual int .
 * @param statusIn string .
 */
function KalturaResponseProfileBaseFilter(){
	KalturaResponseProfileBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.systemNameEqual = null;
	this.systemNameIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.statusEqual = null;
	this.statusIn = null;
}
module.exports.KalturaResponseProfileBaseFilter = KalturaResponseProfileBaseFilter;

util.inherits(KalturaResponseProfileBaseFilter, KalturaFilter);


/**
 * @param id int Auto generated numeric identifier.
 * @param systemName string Unique system name.
 */
function KalturaResponseProfileHolder(){
	KalturaResponseProfileHolder.super_.call(this);
	this.id = null;
	this.systemName = null;
}
module.exports.KalturaResponseProfileHolder = KalturaResponseProfileHolder;

util.inherits(KalturaResponseProfileHolder, KalturaBaseResponseProfile);


/**
 * @param objects array  (readOnly).
 */
function KalturaResponseProfileListResponse(){
	KalturaResponseProfileListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaResponseProfileListResponse = KalturaResponseProfileListResponse;

util.inherits(KalturaResponseProfileListResponse, KalturaListResponse);


/**
 * @param maxResults int .
 * @param resultsFilePath string .
 * @param referenceTime int .
 */
function KalturaScheduledTaskJobData(){
	KalturaScheduledTaskJobData.super_.call(this);
	this.maxResults = null;
	this.resultsFilePath = null;
	this.referenceTime = null;
}
module.exports.KalturaScheduledTaskJobData = KalturaScheduledTaskJobData;

util.inherits(KalturaScheduledTaskJobData, KalturaJobData);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param systemNameEqual string .
 * @param systemNameIn string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param lastExecutionStartedAtGreaterThanOrEqual int .
 * @param lastExecutionStartedAtLessThanOrEqual int .
 */
function KalturaScheduledTaskProfileBaseFilter(){
	KalturaScheduledTaskProfileBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.systemNameEqual = null;
	this.systemNameIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.lastExecutionStartedAtGreaterThanOrEqual = null;
	this.lastExecutionStartedAtLessThanOrEqual = null;
}
module.exports.KalturaScheduledTaskProfileBaseFilter = KalturaScheduledTaskProfileBaseFilter;

util.inherits(KalturaScheduledTaskProfileBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaScheduledTaskProfileListResponse(){
	KalturaScheduledTaskProfileListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaScheduledTaskProfileListResponse = KalturaScheduledTaskProfileListResponse;

util.inherits(KalturaScheduledTaskProfileListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaSchedulerListResponse(){
	KalturaSchedulerListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaSchedulerListResponse = KalturaSchedulerListResponse;

util.inherits(KalturaSchedulerListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaSchedulerWorkerListResponse(){
	KalturaSchedulerWorkerListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaSchedulerWorkerListResponse = KalturaSchedulerWorkerListResponse;

util.inherits(KalturaSchedulerWorkerListResponse, KalturaListResponse);


/**
 * @param field string .
 * @param value string .
 */
function KalturaSearchCondition(){
	KalturaSearchCondition.super_.call(this);
	this.field = null;
	this.value = null;
}
module.exports.KalturaSearchCondition = KalturaSearchCondition;

util.inherits(KalturaSearchCondition, KalturaSearchItem);


/**
 * @param type int .
 * @param items array .
 */
function KalturaSearchOperator(){
	KalturaSearchOperator.super_.call(this);
	this.type = null;
	this.items = null;
}
module.exports.KalturaSearchOperator = KalturaSearchOperator;

util.inherits(KalturaSearchOperator, KalturaSearchItem);


/**
 */
function KalturaSessionRestriction(){
	KalturaSessionRestriction.super_.call(this);
}
module.exports.KalturaSessionRestriction = KalturaSessionRestriction;

util.inherits(KalturaSessionRestriction, KalturaBaseRestriction);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param expiresAtGreaterThanOrEqual int .
 * @param expiresAtLessThanOrEqual int .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param userIdEqual string .
 * @param userIdIn string .
 * @param systemNameEqual string .
 * @param systemNameIn string .
 * @param statusEqual int .
 * @param statusIn string .
 */
function KalturaShortLinkBaseFilter(){
	KalturaShortLinkBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.expiresAtGreaterThanOrEqual = null;
	this.expiresAtLessThanOrEqual = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.userIdEqual = null;
	this.userIdIn = null;
	this.systemNameEqual = null;
	this.systemNameIn = null;
	this.statusEqual = null;
	this.statusIn = null;
}
module.exports.KalturaShortLinkBaseFilter = KalturaShortLinkBaseFilter;

util.inherits(KalturaShortLinkBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaShortLinkListResponse(){
	KalturaShortLinkListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaShortLinkListResponse = KalturaShortLinkListResponse;

util.inherits(KalturaShortLinkListResponse, KalturaListResponse);


/**
 * @param siteRestrictionType int The site restriction type (allow or deny).
 * @param siteList string Comma separated list of sites (domains) to allow or deny.
 */
function KalturaSiteRestriction(){
	KalturaSiteRestriction.super_.call(this);
	this.siteRestrictionType = null;
	this.siteList = null;
}
module.exports.KalturaSiteRestriction = KalturaSiteRestriction;

util.inherits(KalturaSiteRestriction, KalturaBaseRestriction);


/**
 */
function KalturaStorageAddAction(){
	KalturaStorageAddAction.super_.call(this);
}
module.exports.KalturaStorageAddAction = KalturaStorageAddAction;

util.inherits(KalturaStorageAddAction, KalturaRuleAction);


/**
 * @param storageId string Storage profile id.
 */
function KalturaStorageExportObjectTask(){
	KalturaStorageExportObjectTask.super_.call(this);
	this.storageId = null;
}
module.exports.KalturaStorageExportObjectTask = KalturaStorageExportObjectTask;

util.inherits(KalturaStorageExportObjectTask, KalturaObjectTask);


/**
 * @param serverUrl string .
 * @param serverUsername string .
 * @param serverPassword string .
 * @param serverPrivateKey string .
 * @param serverPublicKey string .
 * @param serverPassPhrase string .
 * @param ftpPassiveMode bool .
 * @param srcFileSyncLocalPath string .
 * @param srcFileSyncId string .
 * @param destFileSyncStoredPath string .
 */
function KalturaStorageJobData(){
	KalturaStorageJobData.super_.call(this);
	this.serverUrl = null;
	this.serverUsername = null;
	this.serverPassword = null;
	this.serverPrivateKey = null;
	this.serverPublicKey = null;
	this.serverPassPhrase = null;
	this.ftpPassiveMode = null;
	this.srcFileSyncLocalPath = null;
	this.srcFileSyncId = null;
	this.destFileSyncStoredPath = null;
}
module.exports.KalturaStorageJobData = KalturaStorageJobData;

util.inherits(KalturaStorageJobData, KalturaJobData);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param systemNameEqual string .
 * @param systemNameIn string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param protocolEqual string .
 * @param protocolIn string .
 */
function KalturaStorageProfileBaseFilter(){
	KalturaStorageProfileBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.systemNameEqual = null;
	this.systemNameIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.protocolEqual = null;
	this.protocolIn = null;
}
module.exports.KalturaStorageProfileBaseFilter = KalturaStorageProfileBaseFilter;

util.inherits(KalturaStorageProfileBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaStorageProfileListResponse(){
	KalturaStorageProfileListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaStorageProfileListResponse = KalturaStorageProfileListResponse;

util.inherits(KalturaStorageProfileListResponse, KalturaListResponse);


/**
 * @param categoryId int category id.
 * @param lastUpdatedCategoryEntryCreatedAt int Saves the last category entry creation date that was updated
 * In case of crash the batch will restart from that point.
 * @param lastUpdatedCategoryCreatedAt int Saves the last sub category creation date that was updated
 * In case of crash the batch will restart from that point.
 */
function KalturaSyncCategoryPrivacyContextJobData(){
	KalturaSyncCategoryPrivacyContextJobData.super_.call(this);
	this.categoryId = null;
	this.lastUpdatedCategoryEntryCreatedAt = null;
	this.lastUpdatedCategoryCreatedAt = null;
}
module.exports.KalturaSyncCategoryPrivacyContextJobData = KalturaSyncCategoryPrivacyContextJobData;

util.inherits(KalturaSyncCategoryPrivacyContextJobData, KalturaJobData);


/**
 * @param xsl string .
 * @param feedId string  (readOnly).
 */
function KalturaSyndicationDistributionProfile(){
	KalturaSyndicationDistributionProfile.super_.call(this);
	this.xsl = null;
	this.feedId = null;
}
module.exports.KalturaSyndicationDistributionProfile = KalturaSyndicationDistributionProfile;

util.inherits(KalturaSyndicationDistributionProfile, KalturaDistributionProfile);


/**
 */
function KalturaSyndicationDistributionProvider(){
	KalturaSyndicationDistributionProvider.super_.call(this);
}
module.exports.KalturaSyndicationDistributionProvider = KalturaSyndicationDistributionProvider;

util.inherits(KalturaSyndicationDistributionProvider, KalturaDistributionProvider);


/**
 * @param objectTypeEqual string .
 * @param tagEqual string .
 * @param tagStartsWith string .
 * @param instanceCountEqual int .
 * @param instanceCountIn int .
 */
function KalturaTagFilter(){
	KalturaTagFilter.super_.call(this);
	this.objectTypeEqual = null;
	this.tagEqual = null;
	this.tagStartsWith = null;
	this.instanceCountEqual = null;
	this.instanceCountIn = null;
}
module.exports.KalturaTagFilter = KalturaTagFilter;

util.inherits(KalturaTagFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaTagListResponse(){
	KalturaTagListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaTagListResponse = KalturaTagListResponse;

util.inherits(KalturaTagListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaThumbAssetListResponse(){
	KalturaThumbAssetListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaThumbAssetListResponse = KalturaThumbAssetListResponse;

util.inherits(KalturaThumbAssetListResponse, KalturaListResponse);


/**
 * @param assetId string .
 * @param description string .
 * @param title string .
 * @param subType int The sub type of the ThumbCuePoint.
 */
function KalturaThumbCuePoint(){
	KalturaThumbCuePoint.super_.call(this);
	this.assetId = null;
	this.description = null;
	this.title = null;
	this.subType = null;
}
module.exports.KalturaThumbCuePoint = KalturaThumbCuePoint;

util.inherits(KalturaThumbCuePoint, KalturaCuePoint);


/**
 * @param objects array  (readOnly).
 */
function KalturaThumbParamsListResponse(){
	KalturaThumbParamsListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaThumbParamsListResponse = KalturaThumbParamsListResponse;

util.inherits(KalturaThumbParamsListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaThumbParamsOutputListResponse(){
	KalturaThumbParamsOutputListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaThumbParamsOutputListResponse = KalturaThumbParamsOutputListResponse;

util.inherits(KalturaThumbParamsOutputListResponse, KalturaListResponse);


/**
 * @param srcXslPath string .
 * @param srcVersion int .
 * @param destVersion int .
 * @param destXsdPath string .
 * @param metadataProfileId int .
 */
function KalturaTransformMetadataJobData(){
	KalturaTransformMetadataJobData.super_.call(this);
	this.srcXslPath = null;
	this.srcVersion = null;
	this.destVersion = null;
	this.destXsdPath = null;
	this.metadataProfileId = null;
}
module.exports.KalturaTransformMetadataJobData = KalturaTransformMetadataJobData;

util.inherits(KalturaTransformMetadataJobData, KalturaJobData);


/**
 * @param category string  (readOnly).
 */
function KalturaTubeMogulSyndicationFeed(){
	KalturaTubeMogulSyndicationFeed.super_.call(this);
	this.category = null;
}
module.exports.KalturaTubeMogulSyndicationFeed = KalturaTubeMogulSyndicationFeed;

util.inherits(KalturaTubeMogulSyndicationFeed, KalturaBaseSyndicationFeed);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param nameLike string .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param objTypeEqual int .
 * @param objTypeIn string .
 * @param tagsMultiLikeOr string .
 * @param tagsMultiLikeAnd string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param creationModeEqual int .
 * @param creationModeIn string .
 * @param versionEqual string .
 * @param versionMultiLikeOr string .
 * @param versionMultiLikeAnd string .
 * @param partnerTagsMultiLikeOr string .
 * @param partnerTagsMultiLikeAnd string .
 */
function KalturaUiConfBaseFilter(){
	KalturaUiConfBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.nameLike = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.objTypeEqual = null;
	this.objTypeIn = null;
	this.tagsMultiLikeOr = null;
	this.tagsMultiLikeAnd = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.creationModeEqual = null;
	this.creationModeIn = null;
	this.versionEqual = null;
	this.versionMultiLikeOr = null;
	this.versionMultiLikeAnd = null;
	this.partnerTagsMultiLikeOr = null;
	this.partnerTagsMultiLikeAnd = null;
}
module.exports.KalturaUiConfBaseFilter = KalturaUiConfBaseFilter;

util.inherits(KalturaUiConfBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaUiConfListResponse(){
	KalturaUiConfListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaUiConfListResponse = KalturaUiConfListResponse;

util.inherits(KalturaUiConfListResponse, KalturaListResponse);


/**
 * @param idEqual string .
 * @param idIn string .
 * @param userIdEqual string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param fileNameEqual string .
 * @param fileSizeEqual float .
 */
function KalturaUploadTokenBaseFilter(){
	KalturaUploadTokenBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.userIdEqual = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.fileNameEqual = null;
	this.fileSizeEqual = null;
}
module.exports.KalturaUploadTokenBaseFilter = KalturaUploadTokenBaseFilter;

util.inherits(KalturaUploadTokenBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaUploadTokenListResponse(){
	KalturaUploadTokenListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaUploadTokenListResponse = KalturaUploadTokenListResponse;

util.inherits(KalturaUploadTokenListResponse, KalturaListResponse);


/**
 * @param headerData string headerData.
 * @param headerSign string headerSign.
 * @param timeout int timeout.
 * @param salt string salt.
 */
function KalturaUrlRecognizerAkamaiG2O(){
	KalturaUrlRecognizerAkamaiG2O.super_.call(this);
	this.headerData = null;
	this.headerSign = null;
	this.timeout = null;
	this.salt = null;
}
module.exports.KalturaUrlRecognizerAkamaiG2O = KalturaUrlRecognizerAkamaiG2O;

util.inherits(KalturaUrlRecognizerAkamaiG2O, KalturaUrlRecognizer);


/**
 * @param paramName string param.
 * @param rootDir string .
 */
function KalturaUrlTokenizerAkamaiHttp(){
	KalturaUrlTokenizerAkamaiHttp.super_.call(this);
	this.paramName = null;
	this.rootDir = null;
}
module.exports.KalturaUrlTokenizerAkamaiHttp = KalturaUrlTokenizerAkamaiHttp;

util.inherits(KalturaUrlTokenizerAkamaiHttp, KalturaUrlTokenizer);


/**
 * @param profile string profile.
 * @param type string Type.
 * @param aifp string .
 * @param usePrefix bool .
 */
function KalturaUrlTokenizerAkamaiRtmp(){
	KalturaUrlTokenizerAkamaiRtmp.super_.call(this);
	this.profile = null;
	this.type = null;
	this.aifp = null;
	this.usePrefix = null;
}
module.exports.KalturaUrlTokenizerAkamaiRtmp = KalturaUrlTokenizerAkamaiRtmp;

util.inherits(KalturaUrlTokenizerAkamaiRtmp, KalturaUrlTokenizer);


/**
 * @param host string host.
 * @param cpcode int Cp-Code.
 */
function KalturaUrlTokenizerAkamaiRtsp(){
	KalturaUrlTokenizerAkamaiRtsp.super_.call(this);
	this.host = null;
	this.cpcode = null;
}
module.exports.KalturaUrlTokenizerAkamaiRtsp = KalturaUrlTokenizerAkamaiRtsp;

util.inherits(KalturaUrlTokenizerAkamaiRtsp, KalturaUrlTokenizer);


/**
 * @param paramName string .
 * @param aclPostfix string .
 * @param customPostfixes string .
 * @param useCookieHosts string .
 * @param rootDir string .
 */
function KalturaUrlTokenizerAkamaiSecureHd(){
	KalturaUrlTokenizerAkamaiSecureHd.super_.call(this);
	this.paramName = null;
	this.aclPostfix = null;
	this.customPostfixes = null;
	this.useCookieHosts = null;
	this.rootDir = null;
}
module.exports.KalturaUrlTokenizerAkamaiSecureHd = KalturaUrlTokenizerAkamaiSecureHd;

util.inherits(KalturaUrlTokenizerAkamaiSecureHd, KalturaUrlTokenizer);


/**
 * @param hashPatternRegex string hashPatternRegex.
 */
function KalturaUrlTokenizerBitGravity(){
	KalturaUrlTokenizerBitGravity.super_.call(this);
	this.hashPatternRegex = null;
}
module.exports.KalturaUrlTokenizerBitGravity = KalturaUrlTokenizerBitGravity;

util.inherits(KalturaUrlTokenizerBitGravity, KalturaUrlTokenizer);


/**
 * @param keyPairId string .
 * @param rootDir string .
 */
function KalturaUrlTokenizerCloudFront(){
	KalturaUrlTokenizerCloudFront.super_.call(this);
	this.keyPairId = null;
	this.rootDir = null;
}
module.exports.KalturaUrlTokenizerCloudFront = KalturaUrlTokenizerCloudFront;

util.inherits(KalturaUrlTokenizerCloudFront, KalturaUrlTokenizer);


/**
 * @param paramName string paramName.
 * @param expiryName string expiryName.
 * @param gen string gen.
 */
function KalturaUrlTokenizerLevel3(){
	KalturaUrlTokenizerLevel3.super_.call(this);
	this.paramName = null;
	this.expiryName = null;
	this.gen = null;
}
module.exports.KalturaUrlTokenizerLevel3 = KalturaUrlTokenizerLevel3;

util.inherits(KalturaUrlTokenizerLevel3, KalturaUrlTokenizer);


/**
 */
function KalturaUrlTokenizerLimeLight(){
	KalturaUrlTokenizerLimeLight.super_.call(this);
}
module.exports.KalturaUrlTokenizerLimeLight = KalturaUrlTokenizerLimeLight;

util.inherits(KalturaUrlTokenizerLimeLight, KalturaUrlTokenizer);


/**
 * @param accountId string accountId.
 */
function KalturaUrlTokenizerUplynk(){
	KalturaUrlTokenizerUplynk.super_.call(this);
	this.accountId = null;
}
module.exports.KalturaUrlTokenizerUplynk = KalturaUrlTokenizerUplynk;

util.inherits(KalturaUrlTokenizerUplynk, KalturaUrlTokenizer);


/**
 * @param hdsPaths string hdsPaths.
 * @param paramName string tokenParamName.
 * @param authPrefix string secure URL prefix.
 */
function KalturaUrlTokenizerVelocix(){
	KalturaUrlTokenizerVelocix.super_.call(this);
	this.hdsPaths = null;
	this.paramName = null;
	this.authPrefix = null;
}
module.exports.KalturaUrlTokenizerVelocix = KalturaUrlTokenizerVelocix;

util.inherits(KalturaUrlTokenizerVelocix, KalturaUrlTokenizer);


/**
 * @param userAgentRestrictionType int User agent restriction type (Allow or deny).
 * @param userAgentRegexList string A comma seperated list of user agent regular expressions.
 */
function KalturaUserAgentRestriction(){
	KalturaUserAgentRestriction.super_.call(this);
	this.userAgentRestrictionType = null;
	this.userAgentRegexList = null;
}
module.exports.KalturaUserAgentRestriction = KalturaUserAgentRestriction;

util.inherits(KalturaUserAgentRestriction, KalturaBaseRestriction);


/**
 * @param objects array  (readOnly).
 */
function KalturaUserListResponse(){
	KalturaUserListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaUserListResponse = KalturaUserListResponse;

util.inherits(KalturaUserListResponse, KalturaListResponse);


/**
 * @param objects array  (readOnly).
 */
function KalturaUserLoginDataListResponse(){
	KalturaUserLoginDataListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaUserLoginDataListResponse = KalturaUserLoginDataListResponse;

util.inherits(KalturaUserLoginDataListResponse, KalturaListResponse);


/**
 * @param roleIds string Comma separated list of role ids.
 */
function KalturaUserRoleCondition(){
	KalturaUserRoleCondition.super_.call(this);
	this.roleIds = null;
}
module.exports.KalturaUserRoleCondition = KalturaUserRoleCondition;

util.inherits(KalturaUserRoleCondition, KalturaCondition);


/**
 * @param objects array  (readOnly).
 */
function KalturaUserRoleListResponse(){
	KalturaUserRoleListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaUserRoleListResponse = KalturaUserRoleListResponse;

util.inherits(KalturaUserRoleListResponse, KalturaListResponse);


/**
 */
function KalturaVarPartnerUsageTotalItem(){
	KalturaVarPartnerUsageTotalItem.super_.call(this);
}
module.exports.KalturaVarPartnerUsageTotalItem = KalturaVarPartnerUsageTotalItem;

util.inherits(KalturaVarPartnerUsageTotalItem, KalturaVarPartnerUsageItem);


/**
 * @param srcFilePath string .
 * @param flavorAssetId string .
 * @param scanResult int .
 * @param virusFoundAction int .
 */
function KalturaVirusScanJobData(){
	KalturaVirusScanJobData.super_.call(this);
	this.srcFilePath = null;
	this.flavorAssetId = null;
	this.scanResult = null;
	this.virusFoundAction = null;
}
module.exports.KalturaVirusScanJobData = KalturaVirusScanJobData;

util.inherits(KalturaVirusScanJobData, KalturaJobData);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param nameEqual string .
 * @param nameLike string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param engineTypeEqual string .
 * @param engineTypeIn string .
 */
function KalturaVirusScanProfileBaseFilter(){
	KalturaVirusScanProfileBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.nameEqual = null;
	this.nameLike = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.engineTypeEqual = null;
	this.engineTypeIn = null;
}
module.exports.KalturaVirusScanProfileBaseFilter = KalturaVirusScanProfileBaseFilter;

util.inherits(KalturaVirusScanProfileBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaVirusScanProfileListResponse(){
	KalturaVirusScanProfileListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaVirusScanProfileListResponse = KalturaVirusScanProfileListResponse;

util.inherits(KalturaVirusScanProfileListResponse, KalturaListResponse);


/**
 * @param webexUserId string .
 * @param webexPassword string .
 * @param webexSiteId int .
 * @param webexPartnerId string .
 * @param webexServiceUrl string .
 * @param webexHostIdMetadataFieldName string .
 */
function KalturaWebexDropFolder(){
	KalturaWebexDropFolder.super_.call(this);
	this.webexUserId = null;
	this.webexPassword = null;
	this.webexSiteId = null;
	this.webexPartnerId = null;
	this.webexServiceUrl = null;
	this.webexHostIdMetadataFieldName = null;
}
module.exports.KalturaWebexDropFolder = KalturaWebexDropFolder;

util.inherits(KalturaWebexDropFolder, KalturaDropFolder);


/**
 * @param recordingId int .
 * @param webexHostId string .
 * @param description string .
 * @param confId string .
 * @param contentUrl string .
 */
function KalturaWebexDropFolderFile(){
	KalturaWebexDropFolderFile.super_.call(this);
	this.recordingId = null;
	this.webexHostId = null;
	this.description = null;
	this.confId = null;
	this.contentUrl = null;
}
module.exports.KalturaWebexDropFolderFile = KalturaWebexDropFolderFile;

util.inherits(KalturaWebexDropFolderFile, KalturaDropFolderFile);


/**
 * @param key string .
 * @param iv string .
 * @param owner string .
 * @param portal string .
 * @param maxGop int .
 * @param regServerHost string .
 */
function KalturaWidevineProfile(){
	KalturaWidevineProfile.super_.call(this);
	this.key = null;
	this.iv = null;
	this.owner = null;
	this.portal = null;
	this.maxGop = null;
	this.regServerHost = null;
}
module.exports.KalturaWidevineProfile = KalturaWidevineProfile;

util.inherits(KalturaWidevineProfile, KalturaDrmProfile);


/**
 * @param syncMode int .
 * @param wvAssetIds string .
 * @param modifiedAttributes string .
 * @param monitorSyncCompletion int .
 */
function KalturaWidevineRepositorySyncJobData(){
	KalturaWidevineRepositorySyncJobData.super_.call(this);
	this.syncMode = null;
	this.wvAssetIds = null;
	this.modifiedAttributes = null;
	this.monitorSyncCompletion = null;
}
module.exports.KalturaWidevineRepositorySyncJobData = KalturaWidevineRepositorySyncJobData;

util.inherits(KalturaWidevineRepositorySyncJobData, KalturaJobData);


/**
 * @param idEqual string .
 * @param idIn string .
 * @param sourceWidgetIdEqual string .
 * @param rootWidgetIdEqual string .
 * @param partnerIdEqual int .
 * @param entryIdEqual string .
 * @param uiConfIdEqual int .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param partnerDataLike string .
 */
function KalturaWidgetBaseFilter(){
	KalturaWidgetBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.sourceWidgetIdEqual = null;
	this.rootWidgetIdEqual = null;
	this.partnerIdEqual = null;
	this.entryIdEqual = null;
	this.uiConfIdEqual = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.partnerDataLike = null;
}
module.exports.KalturaWidgetBaseFilter = KalturaWidgetBaseFilter;

util.inherits(KalturaWidgetBaseFilter, KalturaFilter);


/**
 * @param objects array  (readOnly).
 */
function KalturaWidgetListResponse(){
	KalturaWidgetListResponse.super_.call(this);
	this.objects = null;
}
module.exports.KalturaWidgetListResponse = KalturaWidgetListResponse;

util.inherits(KalturaWidgetListResponse, KalturaListResponse);


/**
 * @param category string  (readOnly).
 * @param adultContent string .
 * @param feedDescription string feed description.
 * @param feedLandingPage string feed landing page (i.e publisher website).
 */
function KalturaYahooSyndicationFeed(){
	KalturaYahooSyndicationFeed.super_.call(this);
	this.category = null;
	this.adultContent = null;
	this.feedDescription = null;
	this.feedLandingPage = null;
}
module.exports.KalturaYahooSyndicationFeed = KalturaYahooSyndicationFeed;

util.inherits(KalturaYahooSyndicationFeed, KalturaBaseSyndicationFeed);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param systemNameEqual string .
 * @param systemNameIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 */
function KalturaAccessControlBaseFilter(){
	KalturaAccessControlBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.systemNameEqual = null;
	this.systemNameIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
}
module.exports.KalturaAccessControlBaseFilter = KalturaAccessControlBaseFilter;

util.inherits(KalturaAccessControlBaseFilter, KalturaRelatedFilter);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param systemNameEqual string .
 * @param systemNameIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 */
function KalturaAccessControlProfileBaseFilter(){
	KalturaAccessControlProfileBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.systemNameEqual = null;
	this.systemNameIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
}
module.exports.KalturaAccessControlProfileBaseFilter = KalturaAccessControlProfileBaseFilter;

util.inherits(KalturaAccessControlProfileBaseFilter, KalturaRelatedFilter);


/**
 * @param wsdlUsername string .
 * @param wsdlPassword string .
 * @param cpcode string .
 * @param emailId string .
 * @param primaryContact string .
 * @param secondaryContact string .
 */
function KalturaAkamaiProvisionJobData(){
	KalturaAkamaiProvisionJobData.super_.call(this);
	this.wsdlUsername = null;
	this.wsdlPassword = null;
	this.cpcode = null;
	this.emailId = null;
	this.primaryContact = null;
	this.secondaryContact = null;
}
module.exports.KalturaAkamaiProvisionJobData = KalturaAkamaiProvisionJobData;

util.inherits(KalturaAkamaiProvisionJobData, KalturaProvisionJobData);


/**
 * @param streamId int .
 * @param systemUserName string .
 * @param systemPassword string .
 * @param domainName string .
 * @param dvrEnabled int .
 * @param dvrWindow int .
 * @param primaryContact string .
 * @param secondaryContact string .
 * @param streamType string .
 * @param notificationEmail string .
 */
function KalturaAkamaiUniversalProvisionJobData(){
	KalturaAkamaiUniversalProvisionJobData.super_.call(this);
	this.streamId = null;
	this.systemUserName = null;
	this.systemPassword = null;
	this.domainName = null;
	this.dvrEnabled = null;
	this.dvrWindow = null;
	this.primaryContact = null;
	this.secondaryContact = null;
	this.streamType = null;
	this.notificationEmail = null;
}
module.exports.KalturaAkamaiUniversalProvisionJobData = KalturaAkamaiUniversalProvisionJobData;

util.inherits(KalturaAkamaiUniversalProvisionJobData, KalturaProvisionJobData);


/**
 * @param idEqual string .
 * @param idIn string .
 * @param entryIdEqual string .
 * @param entryIdIn string .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param sizeGreaterThanOrEqual int .
 * @param sizeLessThanOrEqual int .
 * @param tagsLike string .
 * @param tagsMultiLikeOr string .
 * @param tagsMultiLikeAnd string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param deletedAtGreaterThanOrEqual int .
 * @param deletedAtLessThanOrEqual int .
 */
function KalturaAssetBaseFilter(){
	KalturaAssetBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.entryIdEqual = null;
	this.entryIdIn = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.sizeGreaterThanOrEqual = null;
	this.sizeLessThanOrEqual = null;
	this.tagsLike = null;
	this.tagsMultiLikeOr = null;
	this.tagsMultiLikeAnd = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.deletedAtGreaterThanOrEqual = null;
	this.deletedAtLessThanOrEqual = null;
}
module.exports.KalturaAssetBaseFilter = KalturaAssetBaseFilter;

util.inherits(KalturaAssetBaseFilter, KalturaRelatedFilter);


/**
 * @param systemNameEqual string .
 * @param systemNameIn string .
 * @param isSystemDefaultEqual int .
 * @param tagsEqual string .
 */
function KalturaAssetParamsBaseFilter(){
	KalturaAssetParamsBaseFilter.super_.call(this);
	this.systemNameEqual = null;
	this.systemNameIn = null;
	this.isSystemDefaultEqual = null;
	this.tagsEqual = null;
}
module.exports.KalturaAssetParamsBaseFilter = KalturaAssetParamsBaseFilter;

util.inherits(KalturaAssetParamsBaseFilter, KalturaRelatedFilter);


/**
 * @param assetId string ID of the source asset.
 */
function KalturaAssetResource(){
	KalturaAssetResource.super_.call(this);
	this.assetId = null;
}
module.exports.KalturaAssetResource = KalturaAssetResource;

util.inherits(KalturaAssetResource, KalturaContentResource);


/**
 * @param idEqual int .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param parsedAtGreaterThanOrEqual int .
 * @param parsedAtLessThanOrEqual int .
 * @param statusEqual int .
 * @param statusIn string .
 * @param auditObjectTypeEqual string .
 * @param auditObjectTypeIn string .
 * @param objectIdEqual string .
 * @param objectIdIn string .
 * @param relatedObjectIdEqual string .
 * @param relatedObjectIdIn string .
 * @param relatedObjectTypeEqual string .
 * @param relatedObjectTypeIn string .
 * @param entryIdEqual string .
 * @param entryIdIn string .
 * @param masterPartnerIdEqual int .
 * @param masterPartnerIdIn string .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param requestIdEqual string .
 * @param requestIdIn string .
 * @param userIdEqual string .
 * @param userIdIn string .
 * @param actionEqual string .
 * @param actionIn string .
 * @param ksEqual string .
 * @param contextEqual int .
 * @param contextIn string .
 * @param entryPointEqual string .
 * @param entryPointIn string .
 * @param serverNameEqual string .
 * @param serverNameIn string .
 * @param ipAddressEqual string .
 * @param ipAddressIn string .
 * @param clientTagEqual string .
 */
function KalturaAuditTrailBaseFilter(){
	KalturaAuditTrailBaseFilter.super_.call(this);
	this.idEqual = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.parsedAtGreaterThanOrEqual = null;
	this.parsedAtLessThanOrEqual = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.auditObjectTypeEqual = null;
	this.auditObjectTypeIn = null;
	this.objectIdEqual = null;
	this.objectIdIn = null;
	this.relatedObjectIdEqual = null;
	this.relatedObjectIdIn = null;
	this.relatedObjectTypeEqual = null;
	this.relatedObjectTypeIn = null;
	this.entryIdEqual = null;
	this.entryIdIn = null;
	this.masterPartnerIdEqual = null;
	this.masterPartnerIdIn = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.requestIdEqual = null;
	this.requestIdIn = null;
	this.userIdEqual = null;
	this.userIdIn = null;
	this.actionEqual = null;
	this.actionIn = null;
	this.ksEqual = null;
	this.contextEqual = null;
	this.contextIn = null;
	this.entryPointEqual = null;
	this.entryPointIn = null;
	this.serverNameEqual = null;
	this.serverNameIn = null;
	this.ipAddressEqual = null;
	this.ipAddressIn = null;
	this.clientTagEqual = null;
}
module.exports.KalturaAuditTrailBaseFilter = KalturaAuditTrailBaseFilter;

util.inherits(KalturaAuditTrailBaseFilter, KalturaRelatedFilter);


/**
 */
function KalturaBaseSyndicationFeedFilter(){
	KalturaBaseSyndicationFeedFilter.super_.call(this);
}
module.exports.KalturaBaseSyndicationFeedFilter = KalturaBaseSyndicationFeedFilter;

util.inherits(KalturaBaseSyndicationFeedFilter, KalturaBaseSyndicationFeedBaseFilter);


/**
 */
function KalturaBatchJobFilter(){
	KalturaBatchJobFilter.super_.call(this);
}
module.exports.KalturaBatchJobFilter = KalturaBatchJobFilter;

util.inherits(KalturaBatchJobFilter, KalturaBatchJobBaseFilter);


/**
 * @param csvVersion int The version of the csv file (readOnly).
 * @param columns array Array containing CSV headers.
 */
function KalturaBulkUploadCsvJobData(){
	KalturaBulkUploadCsvJobData.super_.call(this);
	this.csvVersion = null;
	this.columns = null;
}
module.exports.KalturaBulkUploadCsvJobData = KalturaBulkUploadCsvJobData;

util.inherits(KalturaBulkUploadCsvJobData, KalturaBulkUploadJobData);


/**
 */
function KalturaBulkUploadFilter(){
	KalturaBulkUploadFilter.super_.call(this);
}
module.exports.KalturaBulkUploadFilter = KalturaBulkUploadFilter;

util.inherits(KalturaBulkUploadFilter, KalturaBulkUploadBaseFilter);


/**
 * @param filter KalturaFilter Filter for extracting the objects list to upload.
 * @param templateObject KalturaObjectBase Template object for new object creation.
 */
function KalturaBulkUploadFilterJobData(){
	KalturaBulkUploadFilterJobData.super_.call(this);
	this.filter = null;
	this.templateObject = null;
}
module.exports.KalturaBulkUploadFilterJobData = KalturaBulkUploadFilterJobData;

util.inherits(KalturaBulkUploadFilterJobData, KalturaBulkUploadJobData);


/**
 */
function KalturaBulkUploadXmlJobData(){
	KalturaBulkUploadXmlJobData.super_.call(this);
}
module.exports.KalturaBulkUploadXmlJobData = KalturaBulkUploadXmlJobData;

util.inherits(KalturaBulkUploadXmlJobData, KalturaBulkUploadJobData);


/**
 */
function KalturaBusinessProcessAbortNotificationTemplate(){
	KalturaBusinessProcessAbortNotificationTemplate.super_.call(this);
}
module.exports.KalturaBusinessProcessAbortNotificationTemplate = KalturaBusinessProcessAbortNotificationTemplate;

util.inherits(KalturaBusinessProcessAbortNotificationTemplate, KalturaBusinessProcessNotificationTemplate);


/**
 * @param server KalturaBusinessProcessServer .
 * @param caseId string .
 */
function KalturaBusinessProcessNotificationDispatchJobData(){
	KalturaBusinessProcessNotificationDispatchJobData.super_.call(this);
	this.server = null;
	this.caseId = null;
}
module.exports.KalturaBusinessProcessNotificationDispatchJobData = KalturaBusinessProcessNotificationDispatchJobData;

util.inherits(KalturaBusinessProcessNotificationDispatchJobData, KalturaEventNotificationDispatchJobData);


/**
 */
function KalturaBusinessProcessServerFilter(){
	KalturaBusinessProcessServerFilter.super_.call(this);
}
module.exports.KalturaBusinessProcessServerFilter = KalturaBusinessProcessServerFilter;

util.inherits(KalturaBusinessProcessServerFilter, KalturaBusinessProcessServerBaseFilter);


/**
 * @param message string Define the message to be sent.
 * @param eventId string Define the event that waiting to the signal.
 */
function KalturaBusinessProcessSignalNotificationTemplate(){
	KalturaBusinessProcessSignalNotificationTemplate.super_.call(this);
	this.message = null;
	this.eventId = null;
}
module.exports.KalturaBusinessProcessSignalNotificationTemplate = KalturaBusinessProcessSignalNotificationTemplate;

util.inherits(KalturaBusinessProcessSignalNotificationTemplate, KalturaBusinessProcessNotificationTemplate);


/**
 * @param abortOnDeletion bool Abort the process automatically if the triggering object deleted.
 */
function KalturaBusinessProcessStartNotificationTemplate(){
	KalturaBusinessProcessStartNotificationTemplate.super_.call(this);
	this.abortOnDeletion = null;
}
module.exports.KalturaBusinessProcessStartNotificationTemplate = KalturaBusinessProcessStartNotificationTemplate;

util.inherits(KalturaBusinessProcessStartNotificationTemplate, KalturaBusinessProcessNotificationTemplate);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param parentIdEqual int .
 * @param parentIdIn string .
 * @param depthEqual int .
 * @param fullNameEqual string .
 * @param fullNameStartsWith string .
 * @param fullNameIn string .
 * @param fullIdsEqual string .
 * @param fullIdsStartsWith string .
 * @param fullIdsMatchOr string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param tagsLike string .
 * @param tagsMultiLikeOr string .
 * @param tagsMultiLikeAnd string .
 * @param appearInListEqual int .
 * @param privacyEqual int .
 * @param privacyIn string .
 * @param inheritanceTypeEqual int .
 * @param inheritanceTypeIn string .
 * @param referenceIdEqual string .
 * @param referenceIdEmpty int .
 * @param contributionPolicyEqual int .
 * @param membersCountGreaterThanOrEqual int .
 * @param membersCountLessThanOrEqual int .
 * @param pendingMembersCountGreaterThanOrEqual int .
 * @param pendingMembersCountLessThanOrEqual int .
 * @param privacyContextEqual string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param inheritedParentIdEqual int .
 * @param inheritedParentIdIn string .
 * @param partnerSortValueGreaterThanOrEqual int .
 * @param partnerSortValueLessThanOrEqual int .
 */
function KalturaCategoryBaseFilter(){
	KalturaCategoryBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.parentIdEqual = null;
	this.parentIdIn = null;
	this.depthEqual = null;
	this.fullNameEqual = null;
	this.fullNameStartsWith = null;
	this.fullNameIn = null;
	this.fullIdsEqual = null;
	this.fullIdsStartsWith = null;
	this.fullIdsMatchOr = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.tagsLike = null;
	this.tagsMultiLikeOr = null;
	this.tagsMultiLikeAnd = null;
	this.appearInListEqual = null;
	this.privacyEqual = null;
	this.privacyIn = null;
	this.inheritanceTypeEqual = null;
	this.inheritanceTypeIn = null;
	this.referenceIdEqual = null;
	this.referenceIdEmpty = null;
	this.contributionPolicyEqual = null;
	this.membersCountGreaterThanOrEqual = null;
	this.membersCountLessThanOrEqual = null;
	this.pendingMembersCountGreaterThanOrEqual = null;
	this.pendingMembersCountLessThanOrEqual = null;
	this.privacyContextEqual = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.inheritedParentIdEqual = null;
	this.inheritedParentIdIn = null;
	this.partnerSortValueGreaterThanOrEqual = null;
	this.partnerSortValueLessThanOrEqual = null;
}
module.exports.KalturaCategoryBaseFilter = KalturaCategoryBaseFilter;

util.inherits(KalturaCategoryBaseFilter, KalturaRelatedFilter);


/**
 * @param categoryIdEqual int .
 * @param categoryIdIn string .
 * @param entryIdEqual string .
 * @param entryIdIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param categoryFullIdsStartsWith string .
 * @param statusEqual int .
 * @param statusIn string .
 */
function KalturaCategoryEntryBaseFilter(){
	KalturaCategoryEntryBaseFilter.super_.call(this);
	this.categoryIdEqual = null;
	this.categoryIdIn = null;
	this.entryIdEqual = null;
	this.entryIdIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.categoryFullIdsStartsWith = null;
	this.statusEqual = null;
	this.statusIn = null;
}
module.exports.KalturaCategoryEntryBaseFilter = KalturaCategoryEntryBaseFilter;

util.inherits(KalturaCategoryEntryBaseFilter, KalturaRelatedFilter);


/**
 * @param xPath string May contain the full xpath to the field in three formats
 * 1. Slashed xPath, e.g. /metadata/myElementName
 * 2. Using local-name function, e.g. /[local-name()='metadata']/[local-name()='myElementName']
 * 3. Using only the field name, e.g. myElementName, it will be searched as //myElementName.
 * @param profileId int Metadata profile id.
 * @param profileSystemName string Metadata profile system name.
 */
function KalturaCompareMetadataCondition(){
	KalturaCompareMetadataCondition.super_.call(this);
	this.xPath = null;
	this.profileId = null;
	this.profileSystemName = null;
}
module.exports.KalturaCompareMetadataCondition = KalturaCompareMetadataCondition;

util.inherits(KalturaCompareMetadataCondition, KalturaCompareCondition);


/**
 */
function KalturaControlPanelCommandFilter(){
	KalturaControlPanelCommandFilter.super_.call(this);
}
module.exports.KalturaControlPanelCommandFilter = KalturaControlPanelCommandFilter;

util.inherits(KalturaControlPanelCommandFilter, KalturaControlPanelCommandBaseFilter);


/**
 * @param conversionProfileIdEqual int .
 * @param conversionProfileIdIn string .
 * @param assetParamsIdEqual int .
 * @param assetParamsIdIn string .
 * @param readyBehaviorEqual int .
 * @param readyBehaviorIn string .
 * @param originEqual int .
 * @param originIn string .
 * @param systemNameEqual string .
 * @param systemNameIn string .
 */
function KalturaConversionProfileAssetParamsBaseFilter(){
	KalturaConversionProfileAssetParamsBaseFilter.super_.call(this);
	this.conversionProfileIdEqual = null;
	this.conversionProfileIdIn = null;
	this.assetParamsIdEqual = null;
	this.assetParamsIdIn = null;
	this.readyBehaviorEqual = null;
	this.readyBehaviorIn = null;
	this.originEqual = null;
	this.originIn = null;
	this.systemNameEqual = null;
	this.systemNameIn = null;
}
module.exports.KalturaConversionProfileAssetParamsBaseFilter = KalturaConversionProfileAssetParamsBaseFilter;

util.inherits(KalturaConversionProfileAssetParamsBaseFilter, KalturaRelatedFilter);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param statusEqual string .
 * @param statusIn string .
 * @param typeEqual string .
 * @param typeIn string .
 * @param nameEqual string .
 * @param systemNameEqual string .
 * @param systemNameIn string .
 * @param tagsMultiLikeOr string .
 * @param tagsMultiLikeAnd string .
 * @param defaultEntryIdEqual string .
 * @param defaultEntryIdIn string .
 */
function KalturaConversionProfileBaseFilter(){
	KalturaConversionProfileBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.typeEqual = null;
	this.typeIn = null;
	this.nameEqual = null;
	this.systemNameEqual = null;
	this.systemNameIn = null;
	this.tagsMultiLikeOr = null;
	this.tagsMultiLikeAnd = null;
	this.defaultEntryIdEqual = null;
	this.defaultEntryIdIn = null;
}
module.exports.KalturaConversionProfileBaseFilter = KalturaConversionProfileBaseFilter;

util.inherits(KalturaConversionProfileBaseFilter, KalturaRelatedFilter);


/**
 * @param destDirLocalPath string .
 * @param destDirRemoteUrl string .
 * @param destFileName string .
 * @param inputXmlLocalPath string .
 * @param inputXmlRemoteUrl string .
 * @param commandLinesStr string .
 * @param flavors array .
 */
function KalturaConvertCollectionJobData(){
	KalturaConvertCollectionJobData.super_.call(this);
	this.destDirLocalPath = null;
	this.destDirRemoteUrl = null;
	this.destFileName = null;
	this.inputXmlLocalPath = null;
	this.inputXmlRemoteUrl = null;
	this.commandLinesStr = null;
	this.flavors = null;
}
module.exports.KalturaConvertCollectionJobData = KalturaConvertCollectionJobData;

util.inherits(KalturaConvertCollectionJobData, KalturaConvartableJobData);


/**
 * @param destFileSyncLocalPath string .
 * @param destFileSyncRemoteUrl string .
 * @param logFileSyncLocalPath string .
 * @param logFileSyncRemoteUrl string .
 * @param flavorAssetId string .
 * @param remoteMediaId string .
 * @param customData string .
 * @param extraDestFileSyncs array .
 * @param engineMessage string .
 */
function KalturaConvertJobData(){
	KalturaConvertJobData.super_.call(this);
	this.destFileSyncLocalPath = null;
	this.destFileSyncRemoteUrl = null;
	this.logFileSyncLocalPath = null;
	this.logFileSyncRemoteUrl = null;
	this.flavorAssetId = null;
	this.remoteMediaId = null;
	this.customData = null;
	this.extraDestFileSyncs = null;
	this.engineMessage = null;
}
module.exports.KalturaConvertJobData = KalturaConvertJobData;

util.inherits(KalturaConvertJobData, KalturaConvartableJobData);


/**
 * @param geoCoderType string The ip geo coder engine to be used.
 */
function KalturaCountryCondition(){
	KalturaCountryCondition.super_.call(this);
	this.geoCoderType = null;
}
module.exports.KalturaCountryCondition = KalturaCountryCondition;

util.inherits(KalturaCountryCondition, KalturaMatchCondition);


/**
 * @param idEqual string .
 * @param idIn string .
 * @param cuePointTypeEqual string .
 * @param cuePointTypeIn string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param entryIdEqual string .
 * @param entryIdIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param triggeredAtGreaterThanOrEqual int .
 * @param triggeredAtLessThanOrEqual int .
 * @param tagsLike string .
 * @param tagsMultiLikeOr string .
 * @param tagsMultiLikeAnd string .
 * @param startTimeGreaterThanOrEqual int .
 * @param startTimeLessThanOrEqual int .
 * @param userIdEqual string .
 * @param userIdIn string .
 * @param partnerSortValueEqual int .
 * @param partnerSortValueIn string .
 * @param partnerSortValueGreaterThanOrEqual int .
 * @param partnerSortValueLessThanOrEqual int .
 * @param forceStopEqual int .
 * @param systemNameEqual string .
 * @param systemNameIn string .
 */
function KalturaCuePointBaseFilter(){
	KalturaCuePointBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.cuePointTypeEqual = null;
	this.cuePointTypeIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.entryIdEqual = null;
	this.entryIdIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.triggeredAtGreaterThanOrEqual = null;
	this.triggeredAtLessThanOrEqual = null;
	this.tagsLike = null;
	this.tagsMultiLikeOr = null;
	this.tagsMultiLikeAnd = null;
	this.startTimeGreaterThanOrEqual = null;
	this.startTimeLessThanOrEqual = null;
	this.userIdEqual = null;
	this.userIdIn = null;
	this.partnerSortValueEqual = null;
	this.partnerSortValueIn = null;
	this.partnerSortValueGreaterThanOrEqual = null;
	this.partnerSortValueLessThanOrEqual = null;
	this.forceStopEqual = null;
	this.systemNameEqual = null;
	this.systemNameIn = null;
}
module.exports.KalturaCuePointBaseFilter = KalturaCuePointBaseFilter;

util.inherits(KalturaCuePointBaseFilter, KalturaRelatedFilter);


/**
 */
function KalturaDeliveryProfileFilter(){
	KalturaDeliveryProfileFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileFilter = KalturaDeliveryProfileFilter;

util.inherits(KalturaDeliveryProfileFilter, KalturaDeliveryProfileBaseFilter);


/**
 * @param pattern string .
 * @param rendererClass string rendererClass.
 */
function KalturaDeliveryProfileGenericRtmp(){
	KalturaDeliveryProfileGenericRtmp.super_.call(this);
	this.pattern = null;
	this.rendererClass = null;
}
module.exports.KalturaDeliveryProfileGenericRtmp = KalturaDeliveryProfileGenericRtmp;

util.inherits(KalturaDeliveryProfileGenericRtmp, KalturaDeliveryProfileRtmp);


/**
 */
function KalturaDistributionDeleteJobData(){
	KalturaDistributionDeleteJobData.super_.call(this);
}
module.exports.KalturaDistributionDeleteJobData = KalturaDistributionDeleteJobData;

util.inherits(KalturaDistributionDeleteJobData, KalturaDistributionJobData);


/**
 * @param plays int .
 * @param views int .
 */
function KalturaDistributionFetchReportJobData(){
	KalturaDistributionFetchReportJobData.super_.call(this);
	this.plays = null;
	this.views = null;
}
module.exports.KalturaDistributionFetchReportJobData = KalturaDistributionFetchReportJobData;

util.inherits(KalturaDistributionFetchReportJobData, KalturaDistributionJobData);


/**
 */
function KalturaDistributionProfileFilter(){
	KalturaDistributionProfileFilter.super_.call(this);
}
module.exports.KalturaDistributionProfileFilter = KalturaDistributionProfileFilter;

util.inherits(KalturaDistributionProfileFilter, KalturaDistributionProfileBaseFilter);


/**
 */
function KalturaDistributionProviderFilter(){
	KalturaDistributionProviderFilter.super_.call(this);
}
module.exports.KalturaDistributionProviderFilter = KalturaDistributionProviderFilter;

util.inherits(KalturaDistributionProviderFilter, KalturaDistributionProviderBaseFilter);


/**
 */
function KalturaDistributionSubmitJobData(){
	KalturaDistributionSubmitJobData.super_.call(this);
}
module.exports.KalturaDistributionSubmitJobData = KalturaDistributionSubmitJobData;

util.inherits(KalturaDistributionSubmitJobData, KalturaDistributionJobData);


/**
 */
function KalturaDistributionUpdateJobData(){
	KalturaDistributionUpdateJobData.super_.call(this);
}
module.exports.KalturaDistributionUpdateJobData = KalturaDistributionUpdateJobData;

util.inherits(KalturaDistributionUpdateJobData, KalturaDistributionJobData);


/**
 * @param metadataProfileId int .
 */
function KalturaDistributionValidationErrorInvalidMetadata(){
	KalturaDistributionValidationErrorInvalidMetadata.super_.call(this);
	this.metadataProfileId = null;
}
module.exports.KalturaDistributionValidationErrorInvalidMetadata = KalturaDistributionValidationErrorInvalidMetadata;

util.inherits(KalturaDistributionValidationErrorInvalidMetadata, KalturaDistributionValidationErrorInvalidData);


/**
 */
function KalturaDocumentFlavorParams(){
	KalturaDocumentFlavorParams.super_.call(this);
}
module.exports.KalturaDocumentFlavorParams = KalturaDocumentFlavorParams;

util.inherits(KalturaDocumentFlavorParams, KalturaFlavorParams);


/**
 */
function KalturaDrmDeviceFilter(){
	KalturaDrmDeviceFilter.super_.call(this);
}
module.exports.KalturaDrmDeviceFilter = KalturaDrmDeviceFilter;

util.inherits(KalturaDrmDeviceFilter, KalturaDrmDeviceBaseFilter);


/**
 */
function KalturaDrmPolicyFilter(){
	KalturaDrmPolicyFilter.super_.call(this);
}
module.exports.KalturaDrmPolicyFilter = KalturaDrmPolicyFilter;

util.inherits(KalturaDrmPolicyFilter, KalturaDrmPolicyBaseFilter);


/**
 */
function KalturaDrmProfileFilter(){
	KalturaDrmProfileFilter.super_.call(this);
}
module.exports.KalturaDrmProfileFilter = KalturaDrmProfileFilter;

util.inherits(KalturaDrmProfileFilter, KalturaDrmProfileBaseFilter);


/**
 */
function KalturaDropFolderFileFilter(){
	KalturaDropFolderFileFilter.super_.call(this);
}
module.exports.KalturaDropFolderFileFilter = KalturaDropFolderFileFilter;

util.inherits(KalturaDropFolderFileFilter, KalturaDropFolderFileBaseFilter);


/**
 * @param currentDc int .
 */
function KalturaDropFolderFilter(){
	KalturaDropFolderFilter.super_.call(this);
	this.currentDc = null;
}
module.exports.KalturaDropFolderFilter = KalturaDropFolderFilter;

util.inherits(KalturaDropFolderFilter, KalturaDropFolderBaseFilter);


/**
 * @param fromEmail string Define the email sender email.
 * @param fromName string Define the email sender name.
 * @param to KalturaEmailNotificationRecipientJobData Email recipient emails and names, key is mail address and value is the name.
 * @param cc KalturaEmailNotificationRecipientJobData Email cc emails and names, key is mail address and value is the name.
 * @param bcc KalturaEmailNotificationRecipientJobData Email bcc emails and names, key is mail address and value is the name.
 * @param replyTo KalturaEmailNotificationRecipientJobData Email addresses that a replies should be sent to, key is mail address and value is the name.
 * @param priority int Define the email priority.
 * @param confirmReadingTo string Email address that a reading confirmation will be sent to.
 * @param hostname string Hostname to use in Message-Id and Received headers and as default HELO string.
 * If empty, the value returned by SERVER_NAME is used or 'localhost.localdomain'.
 * @param messageID string Sets the message ID to be used in the Message-Id header.
 * If empty, a unique id will be generated.
 * @param customHeaders array Adds a e-mail custom header.
 */
function KalturaEmailNotificationDispatchJobData(){
	KalturaEmailNotificationDispatchJobData.super_.call(this);
	this.fromEmail = null;
	this.fromName = null;
	this.to = null;
	this.cc = null;
	this.bcc = null;
	this.replyTo = null;
	this.priority = null;
	this.confirmReadingTo = null;
	this.hostname = null;
	this.messageID = null;
	this.customHeaders = null;
}
module.exports.KalturaEmailNotificationDispatchJobData = KalturaEmailNotificationDispatchJobData;

util.inherits(KalturaEmailNotificationDispatchJobData, KalturaEventNotificationDispatchJobData);


/**
 * @param application string .
 * @param userIds string .
 * @param playbackContext string .
 * @param ancestorPlaybackContext string .
 */
function KalturaEndUserReportInputFilter(){
	KalturaEndUserReportInputFilter.super_.call(this);
	this.application = null;
	this.userIds = null;
	this.playbackContext = null;
	this.ancestorPlaybackContext = null;
}
module.exports.KalturaEndUserReportInputFilter = KalturaEndUserReportInputFilter;

util.inherits(KalturaEndUserReportInputFilter, KalturaReportInputFilter);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param submittedAtGreaterThanOrEqual int .
 * @param submittedAtLessThanOrEqual int .
 * @param entryIdEqual string .
 * @param entryIdIn string .
 * @param distributionProfileIdEqual int .
 * @param distributionProfileIdIn string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param dirtyStatusEqual int .
 * @param dirtyStatusIn string .
 * @param sunriseGreaterThanOrEqual int .
 * @param sunriseLessThanOrEqual int .
 * @param sunsetGreaterThanOrEqual int .
 * @param sunsetLessThanOrEqual int .
 */
function KalturaEntryDistributionBaseFilter(){
	KalturaEntryDistributionBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.submittedAtGreaterThanOrEqual = null;
	this.submittedAtLessThanOrEqual = null;
	this.entryIdEqual = null;
	this.entryIdIn = null;
	this.distributionProfileIdEqual = null;
	this.distributionProfileIdIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.dirtyStatusEqual = null;
	this.dirtyStatusIn = null;
	this.sunriseGreaterThanOrEqual = null;
	this.sunriseLessThanOrEqual = null;
	this.sunsetGreaterThanOrEqual = null;
	this.sunsetLessThanOrEqual = null;
}
module.exports.KalturaEntryDistributionBaseFilter = KalturaEntryDistributionBaseFilter;

util.inherits(KalturaEntryDistributionBaseFilter, KalturaRelatedFilter);


/**
 * @param referrer string .
 */
function KalturaEntryReferrerLiveStats(){
	KalturaEntryReferrerLiveStats.super_.call(this);
	this.referrer = null;
}
module.exports.KalturaEntryReferrerLiveStats = KalturaEntryReferrerLiveStats;

util.inherits(KalturaEntryReferrerLiveStats, KalturaEntryLiveStats);


/**
 * @param entryId string ID of the source entry.
 * @param flavorParamsId int ID of the source flavor params, set to null to use the source flavor.
 */
function KalturaEntryResource(){
	KalturaEntryResource.super_.call(this);
	this.entryId = null;
	this.flavorParamsId = null;
}
module.exports.KalturaEntryResource = KalturaEntryResource;

util.inherits(KalturaEntryResource, KalturaContentResource);


/**
 */
function KalturaEventNotificationTemplateFilter(){
	KalturaEventNotificationTemplateFilter.super_.call(this);
}
module.exports.KalturaEventNotificationTemplateFilter = KalturaEventNotificationTemplateFilter;

util.inherits(KalturaEventNotificationTemplateFilter, KalturaEventNotificationTemplateBaseFilter);


/**
 * @param flavorAssetId string .
 */
function KalturaExtractMediaJobData(){
	KalturaExtractMediaJobData.super_.call(this);
	this.flavorAssetId = null;
}
module.exports.KalturaExtractMediaJobData = KalturaExtractMediaJobData;

util.inherits(KalturaExtractMediaJobData, KalturaConvartableJobData);


/**
 */
function KalturaIntegerField(){
	KalturaIntegerField.super_.call(this);
}
module.exports.KalturaIntegerField = KalturaIntegerField;

util.inherits(KalturaIntegerField, KalturaIntegerValue);


/**
 * @param field KalturaIntegerField Field to evaluate.
 */
function KalturaFieldCompareCondition(){
	KalturaFieldCompareCondition.super_.call(this);
	this.field = null;
}
module.exports.KalturaFieldCompareCondition = KalturaFieldCompareCondition;

util.inherits(KalturaFieldCompareCondition, KalturaCompareCondition);


/**
 */
function KalturaStringField(){
	KalturaStringField.super_.call(this);
}
module.exports.KalturaStringField = KalturaStringField;

util.inherits(KalturaStringField, KalturaStringValue);


/**
 * @param field KalturaStringField Field to evaluate.
 */
function KalturaFieldMatchCondition(){
	KalturaFieldMatchCondition.super_.call(this);
	this.field = null;
}
module.exports.KalturaFieldMatchCondition = KalturaFieldMatchCondition;

util.inherits(KalturaFieldMatchCondition, KalturaMatchCondition);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param partnerIdEqual int .
 * @param fileAssetObjectTypeEqual string .
 * @param objectIdEqual string .
 * @param objectIdIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param statusEqual string .
 * @param statusIn string .
 */
function KalturaFileAssetBaseFilter(){
	KalturaFileAssetBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.partnerIdEqual = null;
	this.fileAssetObjectTypeEqual = null;
	this.objectIdEqual = null;
	this.objectIdIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.statusEqual = null;
	this.statusIn = null;
}
module.exports.KalturaFileAssetBaseFilter = KalturaFileAssetBaseFilter;

util.inherits(KalturaFileAssetBaseFilter, KalturaRelatedFilter);


/**
 * @param currentDc int .
 */
function KalturaFileSyncFilter(){
	KalturaFileSyncFilter.super_.call(this);
	this.currentDc = null;
}
module.exports.KalturaFileSyncFilter = KalturaFileSyncFilter;

util.inherits(KalturaFileSyncFilter, KalturaFileSyncBaseFilter);


/**
 * @param fileSyncObjectType int The object type of the file sync object.
 * @param objectSubType int The object sub-type of the file sync object.
 * @param objectId string The object id of the file sync object.
 * @param version string The version of the file sync object.
 */
function KalturaFileSyncResource(){
	KalturaFileSyncResource.super_.call(this);
	this.fileSyncObjectType = null;
	this.objectSubType = null;
	this.objectId = null;
	this.version = null;
}
module.exports.KalturaFileSyncResource = KalturaFileSyncResource;

util.inherits(KalturaFileSyncResource, KalturaContentResource);


/**
 * @param host string .
 * @param port int .
 * @param username string .
 * @param password string .
 */
function KalturaFtpDropFolder(){
	KalturaFtpDropFolder.super_.call(this);
	this.host = null;
	this.port = null;
	this.username = null;
	this.password = null;
}
module.exports.KalturaFtpDropFolder = KalturaFtpDropFolder;

util.inherits(KalturaFtpDropFolder, KalturaRemoteDropFolder);


/**
 */
function KalturaGenericDistributionProviderActionFilter(){
	KalturaGenericDistributionProviderActionFilter.super_.call(this);
}
module.exports.KalturaGenericDistributionProviderActionFilter = KalturaGenericDistributionProviderActionFilter;

util.inherits(KalturaGenericDistributionProviderActionFilter, KalturaGenericDistributionProviderActionBaseFilter);


/**
 * @param xslt string .
 * @param itemXpathsToExtend array .
 */
function KalturaGenericXsltSyndicationFeed(){
	KalturaGenericXsltSyndicationFeed.super_.call(this);
	this.xslt = null;
	this.itemXpathsToExtend = null;
}
module.exports.KalturaGenericXsltSyndicationFeed = KalturaGenericXsltSyndicationFeed;

util.inherits(KalturaGenericXsltSyndicationFeed, KalturaGenericSyndicationFeed);


/**
 * @param geoCoderType string The ip geo coder engine to be used.
 */
function KalturaGeoDistanceCondition(){
	KalturaGeoDistanceCondition.super_.call(this);
	this.geoCoderType = null;
}
module.exports.KalturaGeoDistanceCondition = KalturaGeoDistanceCondition;

util.inherits(KalturaGeoDistanceCondition, KalturaMatchCondition);


/**
 * @param city KalturaCoordinate .
 * @param country KalturaCoordinate .
 */
function KalturaGeoTimeLiveStats(){
	KalturaGeoTimeLiveStats.super_.call(this);
	this.city = null;
	this.country = null;
}
module.exports.KalturaGeoTimeLiveStats = KalturaGeoTimeLiveStats;

util.inherits(KalturaGeoTimeLiveStats, KalturaEntryLiveStats);


/**
 * @param userIdEqual string .
 * @param userIdIn string .
 * @param groupIdEqual string .
 * @param groupIdIn string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 */
function KalturaGroupUserBaseFilter(){
	KalturaGroupUserBaseFilter.super_.call(this);
	this.userIdEqual = null;
	this.userIdIn = null;
	this.groupIdEqual = null;
	this.groupIdIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
}
module.exports.KalturaGroupUserBaseFilter = KalturaGroupUserBaseFilter;

util.inherits(KalturaGroupUserBaseFilter, KalturaRelatedFilter);


/**
 * @param url string Remote server URL.
 * @param method int Request method.
 * @param data string Data to send.
 * @param timeout int The maximum number of seconds to allow cURL functions to execute.
 * @param connectTimeout int The number of seconds to wait while trying to connect.
 * Must be larger than zero.
 * @param username string A username to use for the connection.
 * @param password string A password to use for the connection.
 * @param authenticationMethod int The HTTP authentication method to use.
 * @param sslVersion int The SSL version (2 or 3) to use.
 * By default PHP will try to determine this itself, although in some cases this must be set manually.
 * @param sslCertificate string SSL certificate to verify the peer with.
 * @param sslCertificateType string The format of the certificate.
 * @param sslCertificatePassword string The password required to use the certificate.
 * @param sslEngine string The identifier for the crypto engine of the private SSL key specified in ssl key.
 * @param sslEngineDefault string The identifier for the crypto engine used for asymmetric crypto operations.
 * @param sslKeyType string The key type of the private SSL key specified in ssl key - PEM / DER / ENG.
 * @param sslKey string Private SSL key.
 * @param sslKeyPassword string The secret password needed to use the private SSL key specified in ssl key.
 * @param customHeaders array Adds a e-mail custom header.
 * @param signSecret string The secret to sign the notification with.
 */
function KalturaHttpNotificationDispatchJobData(){
	KalturaHttpNotificationDispatchJobData.super_.call(this);
	this.url = null;
	this.method = null;
	this.data = null;
	this.timeout = null;
	this.connectTimeout = null;
	this.username = null;
	this.password = null;
	this.authenticationMethod = null;
	this.sslVersion = null;
	this.sslCertificate = null;
	this.sslCertificateType = null;
	this.sslCertificatePassword = null;
	this.sslEngine = null;
	this.sslEngineDefault = null;
	this.sslKeyType = null;
	this.sslKey = null;
	this.sslKeyPassword = null;
	this.customHeaders = null;
	this.signSecret = null;
}
module.exports.KalturaHttpNotificationDispatchJobData = KalturaHttpNotificationDispatchJobData;

util.inherits(KalturaHttpNotificationDispatchJobData, KalturaEventNotificationDispatchJobData);


/**
 * @param densityWidth int .
 * @param densityHeight int .
 * @param sizeWidth int .
 * @param sizeHeight int .
 * @param depth int .
 */
function KalturaImageFlavorParams(){
	KalturaImageFlavorParams.super_.call(this);
	this.densityWidth = null;
	this.densityHeight = null;
	this.sizeWidth = null;
	this.sizeHeight = null;
	this.depth = null;
}
module.exports.KalturaImageFlavorParams = KalturaImageFlavorParams;

util.inherits(KalturaImageFlavorParams, KalturaFlavorParams);


/**
 */
function KalturaIpAddressCondition(){
	KalturaIpAddressCondition.super_.call(this);
}
module.exports.KalturaIpAddressCondition = KalturaIpAddressCondition;

util.inherits(KalturaIpAddressCondition, KalturaMatchCondition);


/**
 * @param multicastIP string .
 * @param multicastPort int .
 */
function KalturaLiveAsset(){
	KalturaLiveAsset.super_.call(this);
	this.multicastIP = null;
	this.multicastPort = null;
}
module.exports.KalturaLiveAsset = KalturaLiveAsset;

util.inherits(KalturaLiveAsset, KalturaFlavorAsset);


/**
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param statusEqual string .
 * @param statusIn string .
 * @param channelIdEqual string .
 * @param channelIdIn string .
 * @param startTimeGreaterThanOrEqual float .
 * @param startTimeLessThanOrEqual float .
 */
function KalturaLiveChannelSegmentBaseFilter(){
	KalturaLiveChannelSegmentBaseFilter.super_.call(this);
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.channelIdEqual = null;
	this.channelIdIn = null;
	this.startTimeGreaterThanOrEqual = null;
	this.startTimeLessThanOrEqual = null;
}
module.exports.KalturaLiveChannelSegmentBaseFilter = KalturaLiveChannelSegmentBaseFilter;

util.inherits(KalturaLiveChannelSegmentBaseFilter, KalturaRelatedFilter);


/**
 * @param streamSuffix string Suffix to be added to the stream name after the entry id {entry_id}_{stream_suffix}, e.g. for entry id 0_kjdu5jr6 and suffix 1, the stream name will be 0_kjdu5jr6_1.
 */
function KalturaLiveParams(){
	KalturaLiveParams.super_.call(this);
	this.streamSuffix = null;
}
module.exports.KalturaLiveParams = KalturaLiveParams;

util.inherits(KalturaLiveParams, KalturaFlavorParams);


/**
 * @param xPath string May contain the full xpath to the field in three formats
 * 1. Slashed xPath, e.g. /metadata/myElementName
 * 2. Using local-name function, e.g. /[local-name()='metadata']/[local-name()='myElementName']
 * 3. Using only the field name, e.g. myElementName, it will be searched as //myElementName.
 * @param profileId int Metadata profile id.
 * @param profileSystemName string Metadata profile system name.
 */
function KalturaMatchMetadataCondition(){
	KalturaMatchMetadataCondition.super_.call(this);
	this.xPath = null;
	this.profileId = null;
	this.profileSystemName = null;
}
module.exports.KalturaMatchMetadataCondition = KalturaMatchMetadataCondition;

util.inherits(KalturaMatchMetadataCondition, KalturaMatchCondition);


/**
 */
function KalturaMediaFlavorParams(){
	KalturaMediaFlavorParams.super_.call(this);
}
module.exports.KalturaMediaFlavorParams = KalturaMediaFlavorParams;

util.inherits(KalturaMediaFlavorParams, KalturaFlavorParams);


/**
 */
function KalturaMediaInfoFilter(){
	KalturaMediaInfoFilter.super_.call(this);
}
module.exports.KalturaMediaInfoFilter = KalturaMediaInfoFilter;

util.inherits(KalturaMediaInfoFilter, KalturaMediaInfoBaseFilter);


/**
 * @param partnerIdEqual int .
 * @param metadataProfileIdEqual int .
 * @param metadataProfileVersionEqual int .
 * @param metadataProfileVersionGreaterThanOrEqual int .
 * @param metadataProfileVersionLessThanOrEqual int .
 * @param metadataObjectTypeEqual string When null, default is KalturaMetadataObjectType::ENTRY.
 * @param objectIdEqual string .
 * @param objectIdIn string .
 * @param versionEqual int .
 * @param versionGreaterThanOrEqual int .
 * @param versionLessThanOrEqual int .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param statusEqual int .
 * @param statusIn string .
 */
function KalturaMetadataBaseFilter(){
	KalturaMetadataBaseFilter.super_.call(this);
	this.partnerIdEqual = null;
	this.metadataProfileIdEqual = null;
	this.metadataProfileVersionEqual = null;
	this.metadataProfileVersionGreaterThanOrEqual = null;
	this.metadataProfileVersionLessThanOrEqual = null;
	this.metadataObjectTypeEqual = null;
	this.objectIdEqual = null;
	this.objectIdIn = null;
	this.versionEqual = null;
	this.versionGreaterThanOrEqual = null;
	this.versionLessThanOrEqual = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.statusEqual = null;
	this.statusIn = null;
}
module.exports.KalturaMetadataBaseFilter = KalturaMetadataBaseFilter;

util.inherits(KalturaMetadataBaseFilter, KalturaRelatedFilter);


/**
 * @param xPath string May contain the full xpath to the field in three formats
 * 1. Slashed xPath, e.g. /metadata/myElementName
 * 2. Using local-name function, e.g. /[local-name()='metadata']/[local-name()='myElementName']
 * 3. Using only the field name, e.g. myElementName, it will be searched as //myElementName.
 * @param profileId int Metadata profile id.
 * @param profileSystemName string Metadata profile system name.
 * @param versionA string .
 * @param versionB string .
 */
function KalturaMetadataFieldChangedCondition(){
	KalturaMetadataFieldChangedCondition.super_.call(this);
	this.xPath = null;
	this.profileId = null;
	this.profileSystemName = null;
	this.versionA = null;
	this.versionB = null;
}
module.exports.KalturaMetadataFieldChangedCondition = KalturaMetadataFieldChangedCondition;

util.inherits(KalturaMetadataFieldChangedCondition, KalturaMatchCondition);


/**
 */
function KalturaMetadataProfileFilter(){
	KalturaMetadataProfileFilter.super_.call(this);
}
module.exports.KalturaMetadataProfileFilter = KalturaMetadataProfileFilter;

util.inherits(KalturaMetadataProfileFilter, KalturaMetadataProfileBaseFilter);


/**
 * @param metadataProfileId int .
 * @param orderBy string .
 */
function KalturaMetadataSearchItem(){
	KalturaMetadataSearchItem.super_.call(this);
	this.metadataProfileId = null;
	this.orderBy = null;
}
module.exports.KalturaMetadataSearchItem = KalturaMetadataSearchItem;

util.inherits(KalturaMetadataSearchItem, KalturaSearchOperator);


/**
 * @param resource KalturaContentResource Only KalturaEntryResource and KalturaAssetResource are supported.
 * @param operationAttributes array .
 * @param assetParamsId int ID of alternative asset params to be used instead of the system default flavor params.
 */
function KalturaOperationResource(){
	KalturaOperationResource.super_.call(this);
	this.resource = null;
	this.operationAttributes = null;
	this.assetParamsId = null;
}
module.exports.KalturaOperationResource = KalturaOperationResource;

util.inherits(KalturaOperationResource, KalturaContentResource);


/**
 */
function KalturaPartnerFilter(){
	KalturaPartnerFilter.super_.call(this);
}
module.exports.KalturaPartnerFilter = KalturaPartnerFilter;

util.inherits(KalturaPartnerFilter, KalturaPartnerBaseFilter);


/**
 * @param readonly bool .
 */
function KalturaPdfFlavorParams(){
	KalturaPdfFlavorParams.super_.call(this);
	this.readonly = null;
}
module.exports.KalturaPdfFlavorParams = KalturaPdfFlavorParams;

util.inherits(KalturaPdfFlavorParams, KalturaFlavorParams);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param typeEqual int .
 * @param typeIn string .
 * @param nameEqual string .
 * @param nameIn string .
 * @param friendlyNameLike string .
 * @param descriptionLike string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param dependsOnPermissionNamesMultiLikeOr string .
 * @param dependsOnPermissionNamesMultiLikeAnd string .
 * @param tagsMultiLikeOr string .
 * @param tagsMultiLikeAnd string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 */
function KalturaPermissionBaseFilter(){
	KalturaPermissionBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.typeEqual = null;
	this.typeIn = null;
	this.nameEqual = null;
	this.nameIn = null;
	this.friendlyNameLike = null;
	this.descriptionLike = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.dependsOnPermissionNamesMultiLikeOr = null;
	this.dependsOnPermissionNamesMultiLikeAnd = null;
	this.tagsMultiLikeOr = null;
	this.tagsMultiLikeAnd = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
}
module.exports.KalturaPermissionBaseFilter = KalturaPermissionBaseFilter;

util.inherits(KalturaPermissionBaseFilter, KalturaRelatedFilter);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param typeEqual string .
 * @param typeIn string .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param tagsMultiLikeOr string .
 * @param tagsMultiLikeAnd string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 */
function KalturaPermissionItemBaseFilter(){
	KalturaPermissionItemBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.typeEqual = null;
	this.typeIn = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.tagsMultiLikeOr = null;
	this.tagsMultiLikeAnd = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
}
module.exports.KalturaPermissionItemBaseFilter = KalturaPermissionItemBaseFilter;

util.inherits(KalturaPermissionItemBaseFilter, KalturaRelatedFilter);


/**
 * @param flavorAssetId string .
 * @param createThumb bool Indicates if a thumbnail should be created.
 * @param thumbPath string The path of the created thumbnail.
 * @param thumbOffset int The position of the thumbnail in the media file.
 * @param thumbHeight int The height of the movie, will be used to comapare if this thumbnail is the best we can have.
 * @param thumbBitrate int The bit rate of the movie, will be used to comapare if this thumbnail is the best we can have.
 * @param customData string .
 */
function KalturaPostConvertJobData(){
	KalturaPostConvertJobData.super_.call(this);
	this.flavorAssetId = null;
	this.createThumb = null;
	this.thumbPath = null;
	this.thumbOffset = null;
	this.thumbHeight = null;
	this.thumbBitrate = null;
	this.customData = null;
}
module.exports.KalturaPostConvertJobData = KalturaPostConvertJobData;

util.inherits(KalturaPostConvertJobData, KalturaConvartableJobData);


/**
 * @param previewLength int The preview restriction length.
 */
function KalturaPreviewRestriction(){
	KalturaPreviewRestriction.super_.call(this);
	this.previewLength = null;
}
module.exports.KalturaPreviewRestriction = KalturaPreviewRestriction;

util.inherits(KalturaPreviewRestriction, KalturaSessionRestriction);


/**
 */
function KalturaRegexCondition(){
	KalturaRegexCondition.super_.call(this);
}
module.exports.KalturaRegexCondition = KalturaRegexCondition;

util.inherits(KalturaRegexCondition, KalturaMatchCondition);


/**
 * @param resources array Array of remote stoage resources.
 */
function KalturaRemoteStorageResources(){
	KalturaRemoteStorageResources.super_.call(this);
	this.resources = null;
}
module.exports.KalturaRemoteStorageResources = KalturaRemoteStorageResources;

util.inherits(KalturaRemoteStorageResources, KalturaContentResource);


/**
 */
function KalturaReportFilter(){
	KalturaReportFilter.super_.call(this);
}
module.exports.KalturaReportFilter = KalturaReportFilter;

util.inherits(KalturaReportFilter, KalturaReportBaseFilter);


/**
 */
function KalturaResponseProfileFilter(){
	KalturaResponseProfileFilter.super_.call(this);
}
module.exports.KalturaResponseProfileFilter = KalturaResponseProfileFilter;

util.inherits(KalturaResponseProfileFilter, KalturaResponseProfileBaseFilter);


/**
 */
function KalturaScheduledTaskProfileFilter(){
	KalturaScheduledTaskProfileFilter.super_.call(this);
}
module.exports.KalturaScheduledTaskProfileFilter = KalturaScheduledTaskProfileFilter;

util.inherits(KalturaScheduledTaskProfileFilter, KalturaScheduledTaskProfileBaseFilter);


/**
 * @param comparison string .
 */
function KalturaSearchComparableCondition(){
	KalturaSearchComparableCondition.super_.call(this);
	this.comparison = null;
}
module.exports.KalturaSearchComparableCondition = KalturaSearchComparableCondition;

util.inherits(KalturaSearchComparableCondition, KalturaSearchCondition);


/**
 */
function KalturaShortLinkFilter(){
	KalturaShortLinkFilter.super_.call(this);
}
module.exports.KalturaShortLinkFilter = KalturaShortLinkFilter;

util.inherits(KalturaShortLinkFilter, KalturaShortLinkBaseFilter);


/**
 */
function KalturaSiteCondition(){
	KalturaSiteCondition.super_.call(this);
}
module.exports.KalturaSiteCondition = KalturaSiteCondition;

util.inherits(KalturaSiteCondition, KalturaMatchCondition);


/**
 * @param host string .
 * @param port int .
 * @param username string .
 * @param password string .
 * @param privateKey string .
 * @param publicKey string .
 * @param passPhrase string .
 */
function KalturaSshDropFolder(){
	KalturaSshDropFolder.super_.call(this);
	this.host = null;
	this.port = null;
	this.username = null;
	this.password = null;
	this.privateKey = null;
	this.publicKey = null;
	this.passPhrase = null;
}
module.exports.KalturaSshDropFolder = KalturaSshDropFolder;

util.inherits(KalturaSshDropFolder, KalturaRemoteDropFolder);


/**
 * @param privateKey string .
 * @param publicKey string .
 * @param passPhrase string .
 */
function KalturaSshImportJobData(){
	KalturaSshImportJobData.super_.call(this);
	this.privateKey = null;
	this.publicKey = null;
	this.passPhrase = null;
}
module.exports.KalturaSshImportJobData = KalturaSshImportJobData;

util.inherits(KalturaSshImportJobData, KalturaImportJobData);


/**
 */
function KalturaStorageDeleteJobData(){
	KalturaStorageDeleteJobData.super_.call(this);
}
module.exports.KalturaStorageDeleteJobData = KalturaStorageDeleteJobData;

util.inherits(KalturaStorageDeleteJobData, KalturaStorageJobData);


/**
 * @param force bool .
 * @param createLink bool .
 */
function KalturaStorageExportJobData(){
	KalturaStorageExportJobData.super_.call(this);
	this.force = null;
	this.createLink = null;
}
module.exports.KalturaStorageExportJobData = KalturaStorageExportJobData;

util.inherits(KalturaStorageExportJobData, KalturaStorageJobData);


/**
 */
function KalturaStorageProfileFilter(){
	KalturaStorageProfileFilter.super_.call(this);
}
module.exports.KalturaStorageProfileFilter = KalturaStorageProfileFilter;

util.inherits(KalturaStorageProfileFilter, KalturaStorageProfileBaseFilter);


/**
 * @param content string Textual content.
 */
function KalturaStringResource(){
	KalturaStringResource.super_.call(this);
	this.content = null;
}
module.exports.KalturaStringResource = KalturaStringResource;

util.inherits(KalturaStringResource, KalturaContentResource);


/**
 * @param flashVersion int .
 * @param poly2Bitmap bool .
 */
function KalturaSwfFlavorParams(){
	KalturaSwfFlavorParams.super_.call(this);
	this.flashVersion = null;
	this.poly2Bitmap = null;
}
module.exports.KalturaSwfFlavorParams = KalturaSwfFlavorParams;

util.inherits(KalturaSwfFlavorParams, KalturaFlavorParams);


/**
 * @param cuePointId string Associated thumb cue point ID (insertOnly).
 */
function KalturaTimedThumbAsset(){
	KalturaTimedThumbAsset.super_.call(this);
	this.cuePointId = null;
}
module.exports.KalturaTimedThumbAsset = KalturaTimedThumbAsset;

util.inherits(KalturaTimedThumbAsset, KalturaThumbAsset);


/**
 */
function KalturaUiConfFilter(){
	KalturaUiConfFilter.super_.call(this);
}
module.exports.KalturaUiConfFilter = KalturaUiConfFilter;

util.inherits(KalturaUiConfFilter, KalturaUiConfBaseFilter);


/**
 */
function KalturaUploadTokenFilter(){
	KalturaUploadTokenFilter.super_.call(this);
}
module.exports.KalturaUploadTokenFilter = KalturaUploadTokenFilter;

util.inherits(KalturaUploadTokenFilter, KalturaUploadTokenBaseFilter);


/**
 * @param loginEmailEqual string .
 */
function KalturaUserLoginDataBaseFilter(){
	KalturaUserLoginDataBaseFilter.super_.call(this);
	this.loginEmailEqual = null;
}
module.exports.KalturaUserLoginDataBaseFilter = KalturaUserLoginDataBaseFilter;

util.inherits(KalturaUserLoginDataBaseFilter, KalturaRelatedFilter);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param nameEqual string .
 * @param nameIn string .
 * @param systemNameEqual string .
 * @param systemNameIn string .
 * @param descriptionLike string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param tagsMultiLikeOr string .
 * @param tagsMultiLikeAnd string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 */
function KalturaUserRoleBaseFilter(){
	KalturaUserRoleBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.nameEqual = null;
	this.nameIn = null;
	this.systemNameEqual = null;
	this.systemNameIn = null;
	this.descriptionLike = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.tagsMultiLikeOr = null;
	this.tagsMultiLikeAnd = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
}
module.exports.KalturaUserRoleBaseFilter = KalturaUserRoleBaseFilter;

util.inherits(KalturaUserRoleBaseFilter, KalturaRelatedFilter);


/**
 * @param provisioningParams array .
 * @param userName string .
 * @param password string .
 */
function KalturaVelocixProvisionJobData(){
	KalturaVelocixProvisionJobData.super_.call(this);
	this.provisioningParams = null;
	this.userName = null;
	this.password = null;
}
module.exports.KalturaVelocixProvisionJobData = KalturaVelocixProvisionJobData;

util.inherits(KalturaVelocixProvisionJobData, KalturaProvisionJobData);


/**
 */
function KalturaVirusScanProfileFilter(){
	KalturaVirusScanProfileFilter.super_.call(this);
}
module.exports.KalturaVirusScanProfileFilter = KalturaVirusScanProfileFilter;

util.inherits(KalturaVirusScanProfileFilter, KalturaVirusScanProfileBaseFilter);


/**
 * @param description string .
 * @param webexHostId string .
 */
function KalturaWebexDropFolderContentProcessorJobData(){
	KalturaWebexDropFolderContentProcessorJobData.super_.call(this);
	this.description = null;
	this.webexHostId = null;
}
module.exports.KalturaWebexDropFolderContentProcessorJobData = KalturaWebexDropFolderContentProcessorJobData;

util.inherits(KalturaWebexDropFolderContentProcessorJobData, KalturaDropFolderContentProcessorJobData);


/**
 * @param widevineDistributionStartDate int License distribution window start date.
 * @param widevineDistributionEndDate int License distribution window end date.
 * @param widevineAssetId int Widevine unique asset id.
 */
function KalturaWidevineFlavorAsset(){
	KalturaWidevineFlavorAsset.super_.call(this);
	this.widevineDistributionStartDate = null;
	this.widevineDistributionEndDate = null;
	this.widevineAssetId = null;
}
module.exports.KalturaWidevineFlavorAsset = KalturaWidevineFlavorAsset;

util.inherits(KalturaWidevineFlavorAsset, KalturaFlavorAsset);


/**
 */
function KalturaWidevineFlavorParams(){
	KalturaWidevineFlavorParams.super_.call(this);
}
module.exports.KalturaWidevineFlavorParams = KalturaWidevineFlavorParams;

util.inherits(KalturaWidevineFlavorParams, KalturaFlavorParams);


/**
 */
function KalturaWidgetFilter(){
	KalturaWidgetFilter.super_.call(this);
}
module.exports.KalturaWidgetFilter = KalturaWidgetFilter;

util.inherits(KalturaWidgetFilter, KalturaWidgetBaseFilter);


/**
 */
function KalturaAccessControlFilter(){
	KalturaAccessControlFilter.super_.call(this);
}
module.exports.KalturaAccessControlFilter = KalturaAccessControlFilter;

util.inherits(KalturaAccessControlFilter, KalturaAccessControlBaseFilter);


/**
 */
function KalturaAccessControlProfileFilter(){
	KalturaAccessControlProfileFilter.super_.call(this);
}
module.exports.KalturaAccessControlProfileFilter = KalturaAccessControlProfileFilter;

util.inherits(KalturaAccessControlProfileFilter, KalturaAccessControlProfileBaseFilter);


/**
 */
function KalturaActivitiBusinessProcessServerBaseFilter(){
	KalturaActivitiBusinessProcessServerBaseFilter.super_.call(this);
}
module.exports.KalturaActivitiBusinessProcessServerBaseFilter = KalturaActivitiBusinessProcessServerBaseFilter;

util.inherits(KalturaActivitiBusinessProcessServerBaseFilter, KalturaBusinessProcessServerFilter);


/**
 * @param filesPermissionInS3 string .
 * @param s3Region string .
 */
function KalturaAmazonS3StorageExportJobData(){
	KalturaAmazonS3StorageExportJobData.super_.call(this);
	this.filesPermissionInS3 = null;
	this.s3Region = null;
}
module.exports.KalturaAmazonS3StorageExportJobData = KalturaAmazonS3StorageExportJobData;

util.inherits(KalturaAmazonS3StorageExportJobData, KalturaStorageExportJobData);


/**
 */
function KalturaAmazonS3StorageProfileBaseFilter(){
	KalturaAmazonS3StorageProfileBaseFilter.super_.call(this);
}
module.exports.KalturaAmazonS3StorageProfileBaseFilter = KalturaAmazonS3StorageProfileBaseFilter;

util.inherits(KalturaAmazonS3StorageProfileBaseFilter, KalturaStorageProfileFilter);


/**
 */
function KalturaAssetFilter(){
	KalturaAssetFilter.super_.call(this);
}
module.exports.KalturaAssetFilter = KalturaAssetFilter;

util.inherits(KalturaAssetFilter, KalturaAssetBaseFilter);


/**
 */
function KalturaAssetParamsFilter(){
	KalturaAssetParamsFilter.super_.call(this);
}
module.exports.KalturaAssetParamsFilter = KalturaAssetParamsFilter;

util.inherits(KalturaAssetParamsFilter, KalturaAssetParamsBaseFilter);


/**
 */
function KalturaAuditTrailFilter(){
	KalturaAuditTrailFilter.super_.call(this);
}
module.exports.KalturaAuditTrailFilter = KalturaAuditTrailFilter;

util.inherits(KalturaAuditTrailFilter, KalturaAuditTrailBaseFilter);


/**
 * @param jobTypeAndSubTypeIn string .
 */
function KalturaBatchJobFilterExt(){
	KalturaBatchJobFilterExt.super_.call(this);
	this.jobTypeAndSubTypeIn = null;
}
module.exports.KalturaBatchJobFilterExt = KalturaBatchJobFilterExt;

util.inherits(KalturaBatchJobFilterExt, KalturaBatchJobFilter);


/**
 */
function KalturaBusinessProcessNotificationTemplateBaseFilter(){
	KalturaBusinessProcessNotificationTemplateBaseFilter.super_.call(this);
}
module.exports.KalturaBusinessProcessNotificationTemplateBaseFilter = KalturaBusinessProcessNotificationTemplateBaseFilter;

util.inherits(KalturaBusinessProcessNotificationTemplateBaseFilter, KalturaEventNotificationTemplateFilter);


/**
 */
function KalturaCategoryEntryFilter(){
	KalturaCategoryEntryFilter.super_.call(this);
}
module.exports.KalturaCategoryEntryFilter = KalturaCategoryEntryFilter;

util.inherits(KalturaCategoryEntryFilter, KalturaCategoryEntryBaseFilter);


/**
 * @param freeText string .
 * @param membersIn string .
 * @param nameOrReferenceIdStartsWith string .
 * @param managerEqual string .
 * @param memberEqual string .
 * @param fullNameStartsWithIn string .
 * @param ancestorIdIn string not includes the category itself (only sub categories).
 * @param idOrInheritedParentIdIn string .
 */
function KalturaCategoryFilter(){
	KalturaCategoryFilter.super_.call(this);
	this.freeText = null;
	this.membersIn = null;
	this.nameOrReferenceIdStartsWith = null;
	this.managerEqual = null;
	this.memberEqual = null;
	this.fullNameStartsWithIn = null;
	this.ancestorIdIn = null;
	this.idOrInheritedParentIdIn = null;
}
module.exports.KalturaCategoryFilter = KalturaCategoryFilter;

util.inherits(KalturaCategoryFilter, KalturaCategoryBaseFilter);


/**
 */
function KalturaConfigurableDistributionProfileBaseFilter(){
	KalturaConfigurableDistributionProfileBaseFilter.super_.call(this);
}
module.exports.KalturaConfigurableDistributionProfileBaseFilter = KalturaConfigurableDistributionProfileBaseFilter;

util.inherits(KalturaConfigurableDistributionProfileBaseFilter, KalturaDistributionProfileFilter);


/**
 */
function KalturaConversionProfileFilter(){
	KalturaConversionProfileFilter.super_.call(this);
}
module.exports.KalturaConversionProfileFilter = KalturaConversionProfileFilter;

util.inherits(KalturaConversionProfileFilter, KalturaConversionProfileBaseFilter);


/**
 * @param conversionProfileIdFilter KalturaConversionProfileFilter .
 * @param assetParamsIdFilter KalturaAssetParamsFilter .
 */
function KalturaConversionProfileAssetParamsFilter(){
	KalturaConversionProfileAssetParamsFilter.super_.call(this);
	this.conversionProfileIdFilter = null;
	this.assetParamsIdFilter = null;
}
module.exports.KalturaConversionProfileAssetParamsFilter = KalturaConversionProfileAssetParamsFilter;

util.inherits(KalturaConversionProfileAssetParamsFilter, KalturaConversionProfileAssetParamsBaseFilter);


/**
 * @param geoCoderType string The ip geo coder engine to be used.
 */
function KalturaCoordinatesContextField(){
	KalturaCoordinatesContextField.super_.call(this);
	this.geoCoderType = null;
}
module.exports.KalturaCoordinatesContextField = KalturaCoordinatesContextField;

util.inherits(KalturaCoordinatesContextField, KalturaStringField);


/**
 * @param geoCoderType string The ip geo coder engine to be used.
 */
function KalturaCountryContextField(){
	KalturaCountryContextField.super_.call(this);
	this.geoCoderType = null;
}
module.exports.KalturaCountryContextField = KalturaCountryContextField;

util.inherits(KalturaCountryContextField, KalturaStringField);


/**
 * @param freeText string .
 */
function KalturaCuePointFilter(){
	KalturaCuePointFilter.super_.call(this);
	this.freeText = null;
}
module.exports.KalturaCuePointFilter = KalturaCuePointFilter;

util.inherits(KalturaCuePointFilter, KalturaCuePointBaseFilter);


/**
 */
function KalturaDeliveryProfileAkamaiAppleHttpManifestBaseFilter(){
	KalturaDeliveryProfileAkamaiAppleHttpManifestBaseFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileAkamaiAppleHttpManifestBaseFilter = KalturaDeliveryProfileAkamaiAppleHttpManifestBaseFilter;

util.inherits(KalturaDeliveryProfileAkamaiAppleHttpManifestBaseFilter, KalturaDeliveryProfileFilter);


/**
 */
function KalturaDeliveryProfileAkamaiHdsBaseFilter(){
	KalturaDeliveryProfileAkamaiHdsBaseFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileAkamaiHdsBaseFilter = KalturaDeliveryProfileAkamaiHdsBaseFilter;

util.inherits(KalturaDeliveryProfileAkamaiHdsBaseFilter, KalturaDeliveryProfileFilter);


/**
 */
function KalturaDeliveryProfileAkamaiHttpBaseFilter(){
	KalturaDeliveryProfileAkamaiHttpBaseFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileAkamaiHttpBaseFilter = KalturaDeliveryProfileAkamaiHttpBaseFilter;

util.inherits(KalturaDeliveryProfileAkamaiHttpBaseFilter, KalturaDeliveryProfileFilter);


/**
 */
function KalturaDeliveryProfileGenericAppleHttpBaseFilter(){
	KalturaDeliveryProfileGenericAppleHttpBaseFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileGenericAppleHttpBaseFilter = KalturaDeliveryProfileGenericAppleHttpBaseFilter;

util.inherits(KalturaDeliveryProfileGenericAppleHttpBaseFilter, KalturaDeliveryProfileFilter);


/**
 */
function KalturaDeliveryProfileGenericHdsBaseFilter(){
	KalturaDeliveryProfileGenericHdsBaseFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileGenericHdsBaseFilter = KalturaDeliveryProfileGenericHdsBaseFilter;

util.inherits(KalturaDeliveryProfileGenericHdsBaseFilter, KalturaDeliveryProfileFilter);


/**
 */
function KalturaDeliveryProfileGenericHttpBaseFilter(){
	KalturaDeliveryProfileGenericHttpBaseFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileGenericHttpBaseFilter = KalturaDeliveryProfileGenericHttpBaseFilter;

util.inherits(KalturaDeliveryProfileGenericHttpBaseFilter, KalturaDeliveryProfileFilter);


/**
 */
function KalturaDeliveryProfileGenericSilverLightBaseFilter(){
	KalturaDeliveryProfileGenericSilverLightBaseFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileGenericSilverLightBaseFilter = KalturaDeliveryProfileGenericSilverLightBaseFilter;

util.inherits(KalturaDeliveryProfileGenericSilverLightBaseFilter, KalturaDeliveryProfileFilter);


/**
 */
function KalturaDeliveryProfileLiveAppleHttpBaseFilter(){
	KalturaDeliveryProfileLiveAppleHttpBaseFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileLiveAppleHttpBaseFilter = KalturaDeliveryProfileLiveAppleHttpBaseFilter;

util.inherits(KalturaDeliveryProfileLiveAppleHttpBaseFilter, KalturaDeliveryProfileFilter);


/**
 */
function KalturaDeliveryProfileRtmpBaseFilter(){
	KalturaDeliveryProfileRtmpBaseFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileRtmpBaseFilter = KalturaDeliveryProfileRtmpBaseFilter;

util.inherits(KalturaDeliveryProfileRtmpBaseFilter, KalturaDeliveryProfileFilter);


/**
 */
function KalturaDistributionDisableJobData(){
	KalturaDistributionDisableJobData.super_.call(this);
}
module.exports.KalturaDistributionDisableJobData = KalturaDistributionDisableJobData;

util.inherits(KalturaDistributionDisableJobData, KalturaDistributionUpdateJobData);


/**
 */
function KalturaDistributionEnableJobData(){
	KalturaDistributionEnableJobData.super_.call(this);
}
module.exports.KalturaDistributionEnableJobData = KalturaDistributionEnableJobData;

util.inherits(KalturaDistributionEnableJobData, KalturaDistributionUpdateJobData);


/**
 */
function KalturaDocumentFlavorParamsOutput(){
	KalturaDocumentFlavorParamsOutput.super_.call(this);
}
module.exports.KalturaDocumentFlavorParamsOutput = KalturaDocumentFlavorParamsOutput;

util.inherits(KalturaDocumentFlavorParamsOutput, KalturaFlavorParamsOutput);


/**
 * @param dropFolderFileId int Id of the drop folder file object.
 */
function KalturaDropFolderFileResource(){
	KalturaDropFolderFileResource.super_.call(this);
	this.dropFolderFileId = null;
}
module.exports.KalturaDropFolderFileResource = KalturaDropFolderFileResource;

util.inherits(KalturaDropFolderFileResource, KalturaDataCenterContentResource);


/**
 * @param dropFolderFileId int .
 */
function KalturaDropFolderImportJobData(){
	KalturaDropFolderImportJobData.super_.call(this);
	this.dropFolderFileId = null;
}
module.exports.KalturaDropFolderImportJobData = KalturaDropFolderImportJobData;

util.inherits(KalturaDropFolderImportJobData, KalturaSshImportJobData);


/**
 */
function KalturaEmailNotificationTemplateBaseFilter(){
	KalturaEmailNotificationTemplateBaseFilter.super_.call(this);
}
module.exports.KalturaEmailNotificationTemplateBaseFilter = KalturaEmailNotificationTemplateBaseFilter;

util.inherits(KalturaEmailNotificationTemplateBaseFilter, KalturaEventNotificationTemplateFilter);


/**
 */
function KalturaEntryDistributionFilter(){
	KalturaEntryDistributionFilter.super_.call(this);
}
module.exports.KalturaEntryDistributionFilter = KalturaEntryDistributionFilter;

util.inherits(KalturaEntryDistributionFilter, KalturaEntryDistributionBaseFilter);


/**
 * @param code string PHP code.
 */
function KalturaEvalBooleanField(){
	KalturaEvalBooleanField.super_.call(this);
	this.code = null;
}
module.exports.KalturaEvalBooleanField = KalturaEvalBooleanField;

util.inherits(KalturaEvalBooleanField, KalturaBooleanField);


/**
 * @param code string PHP code.
 */
function KalturaEvalStringField(){
	KalturaEvalStringField.super_.call(this);
	this.code = null;
}
module.exports.KalturaEvalStringField = KalturaEvalStringField;

util.inherits(KalturaEvalStringField, KalturaStringField);


/**
 */
function KalturaFileAssetFilter(){
	KalturaFileAssetFilter.super_.call(this);
}
module.exports.KalturaFileAssetFilter = KalturaFileAssetFilter;

util.inherits(KalturaFileAssetFilter, KalturaFileAssetBaseFilter);


/**
 */
function KalturaGenericDistributionProfileBaseFilter(){
	KalturaGenericDistributionProfileBaseFilter.super_.call(this);
}
module.exports.KalturaGenericDistributionProfileBaseFilter = KalturaGenericDistributionProfileBaseFilter;

util.inherits(KalturaGenericDistributionProfileBaseFilter, KalturaDistributionProfileFilter);


/**
 * @param idEqual int .
 * @param idIn string .
 * @param createdAtGreaterThanOrEqual int .
 * @param createdAtLessThanOrEqual int .
 * @param updatedAtGreaterThanOrEqual int .
 * @param updatedAtLessThanOrEqual int .
 * @param partnerIdEqual int .
 * @param partnerIdIn string .
 * @param isDefaultEqual int .
 * @param isDefaultIn string .
 * @param statusEqual int .
 * @param statusIn string .
 */
function KalturaGenericDistributionProviderBaseFilter(){
	KalturaGenericDistributionProviderBaseFilter.super_.call(this);
	this.idEqual = null;
	this.idIn = null;
	this.createdAtGreaterThanOrEqual = null;
	this.createdAtLessThanOrEqual = null;
	this.updatedAtGreaterThanOrEqual = null;
	this.updatedAtLessThanOrEqual = null;
	this.partnerIdEqual = null;
	this.partnerIdIn = null;
	this.isDefaultEqual = null;
	this.isDefaultIn = null;
	this.statusEqual = null;
	this.statusIn = null;
}
module.exports.KalturaGenericDistributionProviderBaseFilter = KalturaGenericDistributionProviderBaseFilter;

util.inherits(KalturaGenericDistributionProviderBaseFilter, KalturaDistributionProviderFilter);


/**
 */
function KalturaGenericSyndicationFeedBaseFilter(){
	KalturaGenericSyndicationFeedBaseFilter.super_.call(this);
}
module.exports.KalturaGenericSyndicationFeedBaseFilter = KalturaGenericSyndicationFeedBaseFilter;

util.inherits(KalturaGenericSyndicationFeedBaseFilter, KalturaBaseSyndicationFeedFilter);


/**
 */
function KalturaGoogleVideoSyndicationFeedBaseFilter(){
	KalturaGoogleVideoSyndicationFeedBaseFilter.super_.call(this);
}
module.exports.KalturaGoogleVideoSyndicationFeedBaseFilter = KalturaGoogleVideoSyndicationFeedBaseFilter;

util.inherits(KalturaGoogleVideoSyndicationFeedBaseFilter, KalturaBaseSyndicationFeedFilter);


/**
 */
function KalturaGroupUserFilter(){
	KalturaGroupUserFilter.super_.call(this);
}
module.exports.KalturaGroupUserFilter = KalturaGroupUserFilter;

util.inherits(KalturaGroupUserFilter, KalturaGroupUserBaseFilter);


/**
 */
function KalturaHttpNotificationTemplateBaseFilter(){
	KalturaHttpNotificationTemplateBaseFilter.super_.call(this);
}
module.exports.KalturaHttpNotificationTemplateBaseFilter = KalturaHttpNotificationTemplateBaseFilter;

util.inherits(KalturaHttpNotificationTemplateBaseFilter, KalturaEventNotificationTemplateFilter);


/**
 */
function KalturaITunesSyndicationFeedBaseFilter(){
	KalturaITunesSyndicationFeedBaseFilter.super_.call(this);
}
module.exports.KalturaITunesSyndicationFeedBaseFilter = KalturaITunesSyndicationFeedBaseFilter;

util.inherits(KalturaITunesSyndicationFeedBaseFilter, KalturaBaseSyndicationFeedFilter);


/**
 * @param densityWidth int .
 * @param densityHeight int .
 * @param sizeWidth int .
 * @param sizeHeight int .
 * @param depth int .
 */
function KalturaImageFlavorParamsOutput(){
	KalturaImageFlavorParamsOutput.super_.call(this);
	this.densityWidth = null;
	this.densityHeight = null;
	this.sizeWidth = null;
	this.sizeHeight = null;
	this.depth = null;
}
module.exports.KalturaImageFlavorParamsOutput = KalturaImageFlavorParamsOutput;

util.inherits(KalturaImageFlavorParamsOutput, KalturaFlavorParamsOutput);


/**
 */
function KalturaIpAddressContextField(){
	KalturaIpAddressContextField.super_.call(this);
}
module.exports.KalturaIpAddressContextField = KalturaIpAddressContextField;

util.inherits(KalturaIpAddressContextField, KalturaStringField);


/**
 * @param contentMoid string Unique Kontiki MOID for the content uploaded to Kontiki.
 * @param serviceToken string .
 */
function KalturaKontikiStorageDeleteJobData(){
	KalturaKontikiStorageDeleteJobData.super_.call(this);
	this.contentMoid = null;
	this.serviceToken = null;
}
module.exports.KalturaKontikiStorageDeleteJobData = KalturaKontikiStorageDeleteJobData;

util.inherits(KalturaKontikiStorageDeleteJobData, KalturaStorageDeleteJobData);


/**
 * @param flavorAssetId string Holds the id of the exported asset.
 * @param contentMoid string Unique Kontiki MOID for the content uploaded to Kontiki.
 * @param serviceToken string .
 */
function KalturaKontikiStorageExportJobData(){
	KalturaKontikiStorageExportJobData.super_.call(this);
	this.flavorAssetId = null;
	this.contentMoid = null;
	this.serviceToken = null;
}
module.exports.KalturaKontikiStorageExportJobData = KalturaKontikiStorageExportJobData;

util.inherits(KalturaKontikiStorageExportJobData, KalturaStorageExportJobData);


/**
 */
function KalturaKontikiStorageProfileBaseFilter(){
	KalturaKontikiStorageProfileBaseFilter.super_.call(this);
}
module.exports.KalturaKontikiStorageProfileBaseFilter = KalturaKontikiStorageProfileBaseFilter;

util.inherits(KalturaKontikiStorageProfileBaseFilter, KalturaStorageProfileFilter);


/**
 */
function KalturaLiveChannelSegmentFilter(){
	KalturaLiveChannelSegmentFilter.super_.call(this);
}
module.exports.KalturaLiveChannelSegmentFilter = KalturaLiveChannelSegmentFilter;

util.inherits(KalturaLiveChannelSegmentFilter, KalturaLiveChannelSegmentBaseFilter);


/**
 */
function KalturaMediaFlavorParamsOutput(){
	KalturaMediaFlavorParamsOutput.super_.call(this);
}
module.exports.KalturaMediaFlavorParamsOutput = KalturaMediaFlavorParamsOutput;

util.inherits(KalturaMediaFlavorParamsOutput, KalturaFlavorParamsOutput);


/**
 */
function KalturaMetadataFilter(){
	KalturaMetadataFilter.super_.call(this);
}
module.exports.KalturaMetadataFilter = KalturaMetadataFilter;

util.inherits(KalturaMetadataFilter, KalturaMetadataBaseFilter);


/**
 */
function KalturaObjectIdField(){
	KalturaObjectIdField.super_.call(this);
}
module.exports.KalturaObjectIdField = KalturaObjectIdField;

util.inherits(KalturaObjectIdField, KalturaStringField);


/**
 * @param readonly bool .
 */
function KalturaPdfFlavorParamsOutput(){
	KalturaPdfFlavorParamsOutput.super_.call(this);
	this.readonly = null;
}
module.exports.KalturaPdfFlavorParamsOutput = KalturaPdfFlavorParamsOutput;

util.inherits(KalturaPdfFlavorParamsOutput, KalturaFlavorParamsOutput);


/**
 */
function KalturaPermissionFilter(){
	KalturaPermissionFilter.super_.call(this);
}
module.exports.KalturaPermissionFilter = KalturaPermissionFilter;

util.inherits(KalturaPermissionFilter, KalturaPermissionBaseFilter);


/**
 */
function KalturaPermissionItemFilter(){
	KalturaPermissionItemFilter.super_.call(this);
}
module.exports.KalturaPermissionItemFilter = KalturaPermissionItemFilter;

util.inherits(KalturaPermissionItemFilter, KalturaPermissionItemBaseFilter);


/**
 */
function KalturaPlayReadyPolicyBaseFilter(){
	KalturaPlayReadyPolicyBaseFilter.super_.call(this);
}
module.exports.KalturaPlayReadyPolicyBaseFilter = KalturaPlayReadyPolicyBaseFilter;

util.inherits(KalturaPlayReadyPolicyBaseFilter, KalturaDrmPolicyFilter);


/**
 */
function KalturaPlayReadyProfileBaseFilter(){
	KalturaPlayReadyProfileBaseFilter.super_.call(this);
}
module.exports.KalturaPlayReadyProfileBaseFilter = KalturaPlayReadyProfileBaseFilter;

util.inherits(KalturaPlayReadyProfileBaseFilter, KalturaDrmProfileFilter);


/**
 */
function KalturaRemoteDropFolderBaseFilter(){
	KalturaRemoteDropFolderBaseFilter.super_.call(this);
}
module.exports.KalturaRemoteDropFolderBaseFilter = KalturaRemoteDropFolderBaseFilter;

util.inherits(KalturaRemoteDropFolderBaseFilter, KalturaDropFolderFilter);


/**
 */
function KalturaScpDropFolder(){
	KalturaScpDropFolder.super_.call(this);
}
module.exports.KalturaScpDropFolder = KalturaScpDropFolder;

util.inherits(KalturaScpDropFolder, KalturaSshDropFolder);


/**
 * @param localFilePath string Full path to the local file.
 */
function KalturaServerFileResource(){
	KalturaServerFileResource.super_.call(this);
	this.localFilePath = null;
}
module.exports.KalturaServerFileResource = KalturaServerFileResource;

util.inherits(KalturaServerFileResource, KalturaDataCenterContentResource);


/**
 */
function KalturaSftpDropFolder(){
	KalturaSftpDropFolder.super_.call(this);
}
module.exports.KalturaSftpDropFolder = KalturaSftpDropFolder;

util.inherits(KalturaSftpDropFolder, KalturaSshDropFolder);


/**
 * @param privateKey string SSH private key.
 * @param publicKey string SSH public key.
 * @param keyPassphrase string Passphrase for SSH keys.
 */
function KalturaSshUrlResource(){
	KalturaSshUrlResource.super_.call(this);
	this.privateKey = null;
	this.publicKey = null;
	this.keyPassphrase = null;
}
module.exports.KalturaSshUrlResource = KalturaSshUrlResource;

util.inherits(KalturaSshUrlResource, KalturaUrlResource);


/**
 * @param flashVersion int .
 * @param poly2Bitmap bool .
 */
function KalturaSwfFlavorParamsOutput(){
	KalturaSwfFlavorParamsOutput.super_.call(this);
	this.flashVersion = null;
	this.poly2Bitmap = null;
}
module.exports.KalturaSwfFlavorParamsOutput = KalturaSwfFlavorParamsOutput;

util.inherits(KalturaSwfFlavorParamsOutput, KalturaFlavorParamsOutput);


/**
 */
function KalturaSyndicationDistributionProfileBaseFilter(){
	KalturaSyndicationDistributionProfileBaseFilter.super_.call(this);
}
module.exports.KalturaSyndicationDistributionProfileBaseFilter = KalturaSyndicationDistributionProfileBaseFilter;

util.inherits(KalturaSyndicationDistributionProfileBaseFilter, KalturaDistributionProfileFilter);


/**
 */
function KalturaSyndicationDistributionProviderBaseFilter(){
	KalturaSyndicationDistributionProviderBaseFilter.super_.call(this);
}
module.exports.KalturaSyndicationDistributionProviderBaseFilter = KalturaSyndicationDistributionProviderBaseFilter;

util.inherits(KalturaSyndicationDistributionProviderBaseFilter, KalturaDistributionProviderFilter);


/**
 * @param offset int Time offset in seconds since current time.
 */
function KalturaTimeContextField(){
	KalturaTimeContextField.super_.call(this);
	this.offset = null;
}
module.exports.KalturaTimeContextField = KalturaTimeContextField;

util.inherits(KalturaTimeContextField, KalturaIntegerField);


/**
 */
function KalturaTubeMogulSyndicationFeedBaseFilter(){
	KalturaTubeMogulSyndicationFeedBaseFilter.super_.call(this);
}
module.exports.KalturaTubeMogulSyndicationFeedBaseFilter = KalturaTubeMogulSyndicationFeedBaseFilter;

util.inherits(KalturaTubeMogulSyndicationFeedBaseFilter, KalturaBaseSyndicationFeedFilter);


/**
 * @param token string Token that returned from upload.upload action or uploadToken.add action.
 */
function KalturaUploadedFileTokenResource(){
	KalturaUploadedFileTokenResource.super_.call(this);
	this.token = null;
}
module.exports.KalturaUploadedFileTokenResource = KalturaUploadedFileTokenResource;

util.inherits(KalturaUploadedFileTokenResource, KalturaDataCenterContentResource);


/**
 */
function KalturaUserAgentCondition(){
	KalturaUserAgentCondition.super_.call(this);
}
module.exports.KalturaUserAgentCondition = KalturaUserAgentCondition;

util.inherits(KalturaUserAgentCondition, KalturaRegexCondition);


/**
 */
function KalturaUserAgentContextField(){
	KalturaUserAgentContextField.super_.call(this);
}
module.exports.KalturaUserAgentContextField = KalturaUserAgentContextField;

util.inherits(KalturaUserAgentContextField, KalturaStringField);


/**
 */
function KalturaUserEmailContextField(){
	KalturaUserEmailContextField.super_.call(this);
}
module.exports.KalturaUserEmailContextField = KalturaUserEmailContextField;

util.inherits(KalturaUserEmailContextField, KalturaStringField);


/**
 */
function KalturaUserLoginDataFilter(){
	KalturaUserLoginDataFilter.super_.call(this);
}
module.exports.KalturaUserLoginDataFilter = KalturaUserLoginDataFilter;

util.inherits(KalturaUserLoginDataFilter, KalturaUserLoginDataBaseFilter);


/**
 */
function KalturaUserRoleFilter(){
	KalturaUserRoleFilter.super_.call(this);
}
module.exports.KalturaUserRoleFilter = KalturaUserRoleFilter;

util.inherits(KalturaUserRoleFilter, KalturaUserRoleBaseFilter);


/**
 * @param groupTypeEq int Eq filter for the partner's group type.
 * @param groupTypeIn string In filter for the partner's group type.
 * @param partnerPermissionsExist string Filter for partner permissions- filter contains comma-separated string of permission names which the returned partners should have.
 */
function KalturaVarConsolePartnerFilter(){
	KalturaVarConsolePartnerFilter.super_.call(this);
	this.groupTypeEq = null;
	this.groupTypeIn = null;
	this.partnerPermissionsExist = null;
}
module.exports.KalturaVarConsolePartnerFilter = KalturaVarConsolePartnerFilter;

util.inherits(KalturaVarConsolePartnerFilter, KalturaPartnerFilter);


/**
 * @param token string Token that returned from media server such as FMS or red5.
 */
function KalturaWebcamTokenResource(){
	KalturaWebcamTokenResource.super_.call(this);
	this.token = null;
}
module.exports.KalturaWebcamTokenResource = KalturaWebcamTokenResource;

util.inherits(KalturaWebcamTokenResource, KalturaDataCenterContentResource);


/**
 */
function KalturaWebexDropFolderBaseFilter(){
	KalturaWebexDropFolderBaseFilter.super_.call(this);
}
module.exports.KalturaWebexDropFolderBaseFilter = KalturaWebexDropFolderBaseFilter;

util.inherits(KalturaWebexDropFolderBaseFilter, KalturaDropFolderFilter);


/**
 */
function KalturaWebexDropFolderFileBaseFilter(){
	KalturaWebexDropFolderFileBaseFilter.super_.call(this);
}
module.exports.KalturaWebexDropFolderFileBaseFilter = KalturaWebexDropFolderFileBaseFilter;

util.inherits(KalturaWebexDropFolderFileBaseFilter, KalturaDropFolderFileFilter);


/**
 * @param widevineDistributionStartDate int License distribution window start date.
 * @param widevineDistributionEndDate int License distribution window end date.
 */
function KalturaWidevineFlavorParamsOutput(){
	KalturaWidevineFlavorParamsOutput.super_.call(this);
	this.widevineDistributionStartDate = null;
	this.widevineDistributionEndDate = null;
}
module.exports.KalturaWidevineFlavorParamsOutput = KalturaWidevineFlavorParamsOutput;

util.inherits(KalturaWidevineFlavorParamsOutput, KalturaFlavorParamsOutput);


/**
 */
function KalturaWidevineProfileBaseFilter(){
	KalturaWidevineProfileBaseFilter.super_.call(this);
}
module.exports.KalturaWidevineProfileBaseFilter = KalturaWidevineProfileBaseFilter;

util.inherits(KalturaWidevineProfileBaseFilter, KalturaDrmProfileFilter);


/**
 */
function KalturaYahooSyndicationFeedBaseFilter(){
	KalturaYahooSyndicationFeedBaseFilter.super_.call(this);
}
module.exports.KalturaYahooSyndicationFeedBaseFilter = KalturaYahooSyndicationFeedBaseFilter;

util.inherits(KalturaYahooSyndicationFeedBaseFilter, KalturaBaseSyndicationFeedFilter);


/**
 */
function KalturaActivitiBusinessProcessServerFilter(){
	KalturaActivitiBusinessProcessServerFilter.super_.call(this);
}
module.exports.KalturaActivitiBusinessProcessServerFilter = KalturaActivitiBusinessProcessServerFilter;

util.inherits(KalturaActivitiBusinessProcessServerFilter, KalturaActivitiBusinessProcessServerBaseFilter);


/**
 * @param protocolTypeEqual string .
 * @param protocolTypeIn string .
 * @param titleLike string .
 * @param titleMultiLikeOr string .
 * @param titleMultiLikeAnd string .
 * @param endTimeGreaterThanOrEqual int .
 * @param endTimeLessThanOrEqual int .
 * @param durationGreaterThanOrEqual int .
 * @param durationLessThanOrEqual int .
 */
function KalturaAdCuePointBaseFilter(){
	KalturaAdCuePointBaseFilter.super_.call(this);
	this.protocolTypeEqual = null;
	this.protocolTypeIn = null;
	this.titleLike = null;
	this.titleMultiLikeOr = null;
	this.titleMultiLikeAnd = null;
	this.endTimeGreaterThanOrEqual = null;
	this.endTimeLessThanOrEqual = null;
	this.durationGreaterThanOrEqual = null;
	this.durationLessThanOrEqual = null;
}
module.exports.KalturaAdCuePointBaseFilter = KalturaAdCuePointBaseFilter;

util.inherits(KalturaAdCuePointBaseFilter, KalturaCuePointFilter);


/**
 */
function KalturaAdminUserBaseFilter(){
	KalturaAdminUserBaseFilter.super_.call(this);
}
module.exports.KalturaAdminUserBaseFilter = KalturaAdminUserBaseFilter;

util.inherits(KalturaAdminUserBaseFilter, KalturaUserFilter);


/**
 */
function KalturaAmazonS3StorageProfileFilter(){
	KalturaAmazonS3StorageProfileFilter.super_.call(this);
}
module.exports.KalturaAmazonS3StorageProfileFilter = KalturaAmazonS3StorageProfileFilter;

util.inherits(KalturaAmazonS3StorageProfileFilter, KalturaAmazonS3StorageProfileBaseFilter);


/**
 * @param parentIdEqual string .
 * @param parentIdIn string .
 * @param textLike string .
 * @param textMultiLikeOr string .
 * @param textMultiLikeAnd string .
 * @param endTimeGreaterThanOrEqual int .
 * @param endTimeLessThanOrEqual int .
 * @param durationGreaterThanOrEqual int .
 * @param durationLessThanOrEqual int .
 * @param isPublicEqual int .
 */
function KalturaAnnotationBaseFilter(){
	KalturaAnnotationBaseFilter.super_.call(this);
	this.parentIdEqual = null;
	this.parentIdIn = null;
	this.textLike = null;
	this.textMultiLikeOr = null;
	this.textMultiLikeAnd = null;
	this.endTimeGreaterThanOrEqual = null;
	this.endTimeLessThanOrEqual = null;
	this.durationGreaterThanOrEqual = null;
	this.durationLessThanOrEqual = null;
	this.isPublicEqual = null;
}
module.exports.KalturaAnnotationBaseFilter = KalturaAnnotationBaseFilter;

util.inherits(KalturaAnnotationBaseFilter, KalturaCuePointFilter);


/**
 */
function KalturaApiActionPermissionItemBaseFilter(){
	KalturaApiActionPermissionItemBaseFilter.super_.call(this);
}
module.exports.KalturaApiActionPermissionItemBaseFilter = KalturaApiActionPermissionItemBaseFilter;

util.inherits(KalturaApiActionPermissionItemBaseFilter, KalturaPermissionItemFilter);


/**
 */
function KalturaApiParameterPermissionItemBaseFilter(){
	KalturaApiParameterPermissionItemBaseFilter.super_.call(this);
}
module.exports.KalturaApiParameterPermissionItemBaseFilter = KalturaApiParameterPermissionItemBaseFilter;

util.inherits(KalturaApiParameterPermissionItemBaseFilter, KalturaPermissionItemFilter);


/**
 */
function KalturaAssetParamsOutputBaseFilter(){
	KalturaAssetParamsOutputBaseFilter.super_.call(this);
}
module.exports.KalturaAssetParamsOutputBaseFilter = KalturaAssetParamsOutputBaseFilter;

util.inherits(KalturaAssetParamsOutputBaseFilter, KalturaAssetParamsFilter);


/**
 * @param formatEqual string .
 * @param formatIn string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param statusNotIn string .
 */
function KalturaAttachmentAssetBaseFilter(){
	KalturaAttachmentAssetBaseFilter.super_.call(this);
	this.formatEqual = null;
	this.formatIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.statusNotIn = null;
}
module.exports.KalturaAttachmentAssetBaseFilter = KalturaAttachmentAssetBaseFilter;

util.inherits(KalturaAttachmentAssetBaseFilter, KalturaAssetFilter);


/**
 */
function KalturaBusinessProcessNotificationTemplateFilter(){
	KalturaBusinessProcessNotificationTemplateFilter.super_.call(this);
}
module.exports.KalturaBusinessProcessNotificationTemplateFilter = KalturaBusinessProcessNotificationTemplateFilter;

util.inherits(KalturaBusinessProcessNotificationTemplateFilter, KalturaBusinessProcessNotificationTemplateBaseFilter);


/**
 * @param captionParamsIdEqual int .
 * @param captionParamsIdIn string .
 * @param formatEqual string .
 * @param formatIn string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param statusNotIn string .
 */
function KalturaCaptionAssetBaseFilter(){
	KalturaCaptionAssetBaseFilter.super_.call(this);
	this.captionParamsIdEqual = null;
	this.captionParamsIdIn = null;
	this.formatEqual = null;
	this.formatIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.statusNotIn = null;
}
module.exports.KalturaCaptionAssetBaseFilter = KalturaCaptionAssetBaseFilter;

util.inherits(KalturaCaptionAssetBaseFilter, KalturaAssetFilter);


/**
 * @param formatEqual string .
 * @param formatIn string .
 */
function KalturaCaptionParamsBaseFilter(){
	KalturaCaptionParamsBaseFilter.super_.call(this);
	this.formatEqual = null;
	this.formatIn = null;
}
module.exports.KalturaCaptionParamsBaseFilter = KalturaCaptionParamsBaseFilter;

util.inherits(KalturaCaptionParamsBaseFilter, KalturaAssetParamsFilter);


/**
 * @param codeLike string .
 * @param codeMultiLikeOr string .
 * @param codeMultiLikeAnd string .
 * @param codeEqual string .
 * @param codeIn string .
 * @param descriptionLike string .
 * @param descriptionMultiLikeOr string .
 * @param descriptionMultiLikeAnd string .
 * @param endTimeGreaterThanOrEqual int .
 * @param endTimeLessThanOrEqual int .
 * @param durationGreaterThanOrEqual int .
 * @param durationLessThanOrEqual int .
 */
function KalturaCodeCuePointBaseFilter(){
	KalturaCodeCuePointBaseFilter.super_.call(this);
	this.codeLike = null;
	this.codeMultiLikeOr = null;
	this.codeMultiLikeAnd = null;
	this.codeEqual = null;
	this.codeIn = null;
	this.descriptionLike = null;
	this.descriptionMultiLikeOr = null;
	this.descriptionMultiLikeAnd = null;
	this.endTimeGreaterThanOrEqual = null;
	this.endTimeLessThanOrEqual = null;
	this.durationGreaterThanOrEqual = null;
	this.durationLessThanOrEqual = null;
}
module.exports.KalturaCodeCuePointBaseFilter = KalturaCodeCuePointBaseFilter;

util.inherits(KalturaCodeCuePointBaseFilter, KalturaCuePointFilter);


/**
 */
function KalturaConfigurableDistributionProfileFilter(){
	KalturaConfigurableDistributionProfileFilter.super_.call(this);
}
module.exports.KalturaConfigurableDistributionProfileFilter = KalturaConfigurableDistributionProfileFilter;

util.inherits(KalturaConfigurableDistributionProfileFilter, KalturaConfigurableDistributionProfileBaseFilter);


/**
 */
function KalturaDataEntryBaseFilter(){
	KalturaDataEntryBaseFilter.super_.call(this);
}
module.exports.KalturaDataEntryBaseFilter = KalturaDataEntryBaseFilter;

util.inherits(KalturaDataEntryBaseFilter, KalturaBaseEntryFilter);


/**
 */
function KalturaDeliveryProfileAkamaiAppleHttpManifestFilter(){
	KalturaDeliveryProfileAkamaiAppleHttpManifestFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileAkamaiAppleHttpManifestFilter = KalturaDeliveryProfileAkamaiAppleHttpManifestFilter;

util.inherits(KalturaDeliveryProfileAkamaiAppleHttpManifestFilter, KalturaDeliveryProfileAkamaiAppleHttpManifestBaseFilter);


/**
 */
function KalturaDeliveryProfileAkamaiHdsFilter(){
	KalturaDeliveryProfileAkamaiHdsFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileAkamaiHdsFilter = KalturaDeliveryProfileAkamaiHdsFilter;

util.inherits(KalturaDeliveryProfileAkamaiHdsFilter, KalturaDeliveryProfileAkamaiHdsBaseFilter);


/**
 */
function KalturaDeliveryProfileAkamaiHttpFilter(){
	KalturaDeliveryProfileAkamaiHttpFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileAkamaiHttpFilter = KalturaDeliveryProfileAkamaiHttpFilter;

util.inherits(KalturaDeliveryProfileAkamaiHttpFilter, KalturaDeliveryProfileAkamaiHttpBaseFilter);


/**
 */
function KalturaDeliveryProfileGenericAppleHttpFilter(){
	KalturaDeliveryProfileGenericAppleHttpFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileGenericAppleHttpFilter = KalturaDeliveryProfileGenericAppleHttpFilter;

util.inherits(KalturaDeliveryProfileGenericAppleHttpFilter, KalturaDeliveryProfileGenericAppleHttpBaseFilter);


/**
 */
function KalturaDeliveryProfileGenericHdsFilter(){
	KalturaDeliveryProfileGenericHdsFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileGenericHdsFilter = KalturaDeliveryProfileGenericHdsFilter;

util.inherits(KalturaDeliveryProfileGenericHdsFilter, KalturaDeliveryProfileGenericHdsBaseFilter);


/**
 */
function KalturaDeliveryProfileGenericHttpFilter(){
	KalturaDeliveryProfileGenericHttpFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileGenericHttpFilter = KalturaDeliveryProfileGenericHttpFilter;

util.inherits(KalturaDeliveryProfileGenericHttpFilter, KalturaDeliveryProfileGenericHttpBaseFilter);


/**
 */
function KalturaDeliveryProfileGenericSilverLightFilter(){
	KalturaDeliveryProfileGenericSilverLightFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileGenericSilverLightFilter = KalturaDeliveryProfileGenericSilverLightFilter;

util.inherits(KalturaDeliveryProfileGenericSilverLightFilter, KalturaDeliveryProfileGenericSilverLightBaseFilter);


/**
 */
function KalturaDeliveryProfileLiveAppleHttpFilter(){
	KalturaDeliveryProfileLiveAppleHttpFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileLiveAppleHttpFilter = KalturaDeliveryProfileLiveAppleHttpFilter;

util.inherits(KalturaDeliveryProfileLiveAppleHttpFilter, KalturaDeliveryProfileLiveAppleHttpBaseFilter);


/**
 */
function KalturaDeliveryProfileRtmpFilter(){
	KalturaDeliveryProfileRtmpFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileRtmpFilter = KalturaDeliveryProfileRtmpFilter;

util.inherits(KalturaDeliveryProfileRtmpFilter, KalturaDeliveryProfileRtmpBaseFilter);


/**
 * @param documentTypeEqual int .
 * @param documentTypeIn string .
 * @param assetParamsIdsMatchOr string .
 * @param assetParamsIdsMatchAnd string .
 */
function KalturaDocumentEntryBaseFilter(){
	KalturaDocumentEntryBaseFilter.super_.call(this);
	this.documentTypeEqual = null;
	this.documentTypeIn = null;
	this.assetParamsIdsMatchOr = null;
	this.assetParamsIdsMatchAnd = null;
}
module.exports.KalturaDocumentEntryBaseFilter = KalturaDocumentEntryBaseFilter;

util.inherits(KalturaDocumentEntryBaseFilter, KalturaBaseEntryFilter);


/**
 */
function KalturaEmailNotificationTemplateFilter(){
	KalturaEmailNotificationTemplateFilter.super_.call(this);
}
module.exports.KalturaEmailNotificationTemplateFilter = KalturaEmailNotificationTemplateFilter;

util.inherits(KalturaEmailNotificationTemplateFilter, KalturaEmailNotificationTemplateBaseFilter);


/**
 * @param eventTypeEqual string .
 * @param eventTypeIn string .
 */
function KalturaEventCuePointBaseFilter(){
	KalturaEventCuePointBaseFilter.super_.call(this);
	this.eventTypeEqual = null;
	this.eventTypeIn = null;
}
module.exports.KalturaEventCuePointBaseFilter = KalturaEventCuePointBaseFilter;

util.inherits(KalturaEventCuePointBaseFilter, KalturaCuePointFilter);


/**
 * @param flavorParamsIdEqual int .
 * @param flavorParamsIdIn string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param statusNotIn string .
 */
function KalturaFlavorAssetBaseFilter(){
	KalturaFlavorAssetBaseFilter.super_.call(this);
	this.flavorParamsIdEqual = null;
	this.flavorParamsIdIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.statusNotIn = null;
}
module.exports.KalturaFlavorAssetBaseFilter = KalturaFlavorAssetBaseFilter;

util.inherits(KalturaFlavorAssetBaseFilter, KalturaAssetFilter);


/**
 * @param formatEqual string .
 */
function KalturaFlavorParamsBaseFilter(){
	KalturaFlavorParamsBaseFilter.super_.call(this);
	this.formatEqual = null;
}
module.exports.KalturaFlavorParamsBaseFilter = KalturaFlavorParamsBaseFilter;

util.inherits(KalturaFlavorParamsBaseFilter, KalturaAssetParamsFilter);


/**
 */
function KalturaGenericDistributionProfileFilter(){
	KalturaGenericDistributionProfileFilter.super_.call(this);
}
module.exports.KalturaGenericDistributionProfileFilter = KalturaGenericDistributionProfileFilter;

util.inherits(KalturaGenericDistributionProfileFilter, KalturaGenericDistributionProfileBaseFilter);


/**
 */
function KalturaGenericDistributionProviderFilter(){
	KalturaGenericDistributionProviderFilter.super_.call(this);
}
module.exports.KalturaGenericDistributionProviderFilter = KalturaGenericDistributionProviderFilter;

util.inherits(KalturaGenericDistributionProviderFilter, KalturaGenericDistributionProviderBaseFilter);


/**
 */
function KalturaGenericSyndicationFeedFilter(){
	KalturaGenericSyndicationFeedFilter.super_.call(this);
}
module.exports.KalturaGenericSyndicationFeedFilter = KalturaGenericSyndicationFeedFilter;

util.inherits(KalturaGenericSyndicationFeedFilter, KalturaGenericSyndicationFeedBaseFilter);


/**
 */
function KalturaGoogleVideoSyndicationFeedFilter(){
	KalturaGoogleVideoSyndicationFeedFilter.super_.call(this);
}
module.exports.KalturaGoogleVideoSyndicationFeedFilter = KalturaGoogleVideoSyndicationFeedFilter;

util.inherits(KalturaGoogleVideoSyndicationFeedFilter, KalturaGoogleVideoSyndicationFeedBaseFilter);


/**
 */
function KalturaHttpNotificationTemplateFilter(){
	KalturaHttpNotificationTemplateFilter.super_.call(this);
}
module.exports.KalturaHttpNotificationTemplateFilter = KalturaHttpNotificationTemplateFilter;

util.inherits(KalturaHttpNotificationTemplateFilter, KalturaHttpNotificationTemplateBaseFilter);


/**
 */
function KalturaITunesSyndicationFeedFilter(){
	KalturaITunesSyndicationFeedFilter.super_.call(this);
}
module.exports.KalturaITunesSyndicationFeedFilter = KalturaITunesSyndicationFeedFilter;

util.inherits(KalturaITunesSyndicationFeedFilter, KalturaITunesSyndicationFeedBaseFilter);


/**
 */
function KalturaKontikiStorageProfileFilter(){
	KalturaKontikiStorageProfileFilter.super_.call(this);
}
module.exports.KalturaKontikiStorageProfileFilter = KalturaKontikiStorageProfileFilter;

util.inherits(KalturaKontikiStorageProfileFilter, KalturaKontikiStorageProfileBaseFilter);


/**
 */
function KalturaPlayReadyPolicyFilter(){
	KalturaPlayReadyPolicyFilter.super_.call(this);
}
module.exports.KalturaPlayReadyPolicyFilter = KalturaPlayReadyPolicyFilter;

util.inherits(KalturaPlayReadyPolicyFilter, KalturaPlayReadyPolicyBaseFilter);


/**
 */
function KalturaPlayReadyProfileFilter(){
	KalturaPlayReadyProfileFilter.super_.call(this);
}
module.exports.KalturaPlayReadyProfileFilter = KalturaPlayReadyProfileFilter;

util.inherits(KalturaPlayReadyProfileFilter, KalturaPlayReadyProfileBaseFilter);


/**
 */
function KalturaPlaylistBaseFilter(){
	KalturaPlaylistBaseFilter.super_.call(this);
}
module.exports.KalturaPlaylistBaseFilter = KalturaPlaylistBaseFilter;

util.inherits(KalturaPlaylistBaseFilter, KalturaBaseEntryFilter);


/**
 */
function KalturaRemoteDropFolderFilter(){
	KalturaRemoteDropFolderFilter.super_.call(this);
}
module.exports.KalturaRemoteDropFolderFilter = KalturaRemoteDropFolderFilter;

util.inherits(KalturaRemoteDropFolderFilter, KalturaRemoteDropFolderBaseFilter);


/**
 */
function KalturaSyndicationDistributionProfileFilter(){
	KalturaSyndicationDistributionProfileFilter.super_.call(this);
}
module.exports.KalturaSyndicationDistributionProfileFilter = KalturaSyndicationDistributionProfileFilter;

util.inherits(KalturaSyndicationDistributionProfileFilter, KalturaSyndicationDistributionProfileBaseFilter);


/**
 * @param thumbParamsIdEqual int .
 * @param thumbParamsIdIn string .
 * @param statusEqual int .
 * @param statusIn string .
 * @param statusNotIn string .
 */
function KalturaThumbAssetBaseFilter(){
	KalturaThumbAssetBaseFilter.super_.call(this);
	this.thumbParamsIdEqual = null;
	this.thumbParamsIdIn = null;
	this.statusEqual = null;
	this.statusIn = null;
	this.statusNotIn = null;
}
module.exports.KalturaThumbAssetBaseFilter = KalturaThumbAssetBaseFilter;

util.inherits(KalturaThumbAssetBaseFilter, KalturaAssetFilter);


/**
 * @param descriptionLike string .
 * @param descriptionMultiLikeOr string .
 * @param descriptionMultiLikeAnd string .
 * @param titleLike string .
 * @param titleMultiLikeOr string .
 * @param titleMultiLikeAnd string .
 * @param subTypeEqual int .
 * @param subTypeIn string .
 */
function KalturaThumbCuePointBaseFilter(){
	KalturaThumbCuePointBaseFilter.super_.call(this);
	this.descriptionLike = null;
	this.descriptionMultiLikeOr = null;
	this.descriptionMultiLikeAnd = null;
	this.titleLike = null;
	this.titleMultiLikeOr = null;
	this.titleMultiLikeAnd = null;
	this.subTypeEqual = null;
	this.subTypeIn = null;
}
module.exports.KalturaThumbCuePointBaseFilter = KalturaThumbCuePointBaseFilter;

util.inherits(KalturaThumbCuePointBaseFilter, KalturaCuePointFilter);


/**
 * @param formatEqual string .
 */
function KalturaThumbParamsBaseFilter(){
	KalturaThumbParamsBaseFilter.super_.call(this);
	this.formatEqual = null;
}
module.exports.KalturaThumbParamsBaseFilter = KalturaThumbParamsBaseFilter;

util.inherits(KalturaThumbParamsBaseFilter, KalturaAssetParamsFilter);


/**
 */
function KalturaTubeMogulSyndicationFeedFilter(){
	KalturaTubeMogulSyndicationFeedFilter.super_.call(this);
}
module.exports.KalturaTubeMogulSyndicationFeedFilter = KalturaTubeMogulSyndicationFeedFilter;

util.inherits(KalturaTubeMogulSyndicationFeedFilter, KalturaTubeMogulSyndicationFeedBaseFilter);


/**
 */
function KalturaWebexDropFolderFileFilter(){
	KalturaWebexDropFolderFileFilter.super_.call(this);
}
module.exports.KalturaWebexDropFolderFileFilter = KalturaWebexDropFolderFileFilter;

util.inherits(KalturaWebexDropFolderFileFilter, KalturaWebexDropFolderFileBaseFilter);


/**
 */
function KalturaWebexDropFolderFilter(){
	KalturaWebexDropFolderFilter.super_.call(this);
}
module.exports.KalturaWebexDropFolderFilter = KalturaWebexDropFolderFilter;

util.inherits(KalturaWebexDropFolderFilter, KalturaWebexDropFolderBaseFilter);


/**
 */
function KalturaWidevineProfileFilter(){
	KalturaWidevineProfileFilter.super_.call(this);
}
module.exports.KalturaWidevineProfileFilter = KalturaWidevineProfileFilter;

util.inherits(KalturaWidevineProfileFilter, KalturaWidevineProfileBaseFilter);


/**
 */
function KalturaYahooSyndicationFeedFilter(){
	KalturaYahooSyndicationFeedFilter.super_.call(this);
}
module.exports.KalturaYahooSyndicationFeedFilter = KalturaYahooSyndicationFeedFilter;

util.inherits(KalturaYahooSyndicationFeedFilter, KalturaYahooSyndicationFeedBaseFilter);


/**
 */
function KalturaAdCuePointFilter(){
	KalturaAdCuePointFilter.super_.call(this);
}
module.exports.KalturaAdCuePointFilter = KalturaAdCuePointFilter;

util.inherits(KalturaAdCuePointFilter, KalturaAdCuePointBaseFilter);


/**
 */
function KalturaAdminUserFilter(){
	KalturaAdminUserFilter.super_.call(this);
}
module.exports.KalturaAdminUserFilter = KalturaAdminUserFilter;

util.inherits(KalturaAdminUserFilter, KalturaAdminUserBaseFilter);


/**
 */
function KalturaAnnotationFilter(){
	KalturaAnnotationFilter.super_.call(this);
}
module.exports.KalturaAnnotationFilter = KalturaAnnotationFilter;

util.inherits(KalturaAnnotationFilter, KalturaAnnotationBaseFilter);


/**
 */
function KalturaApiActionPermissionItemFilter(){
	KalturaApiActionPermissionItemFilter.super_.call(this);
}
module.exports.KalturaApiActionPermissionItemFilter = KalturaApiActionPermissionItemFilter;

util.inherits(KalturaApiActionPermissionItemFilter, KalturaApiActionPermissionItemBaseFilter);


/**
 */
function KalturaApiParameterPermissionItemFilter(){
	KalturaApiParameterPermissionItemFilter.super_.call(this);
}
module.exports.KalturaApiParameterPermissionItemFilter = KalturaApiParameterPermissionItemFilter;

util.inherits(KalturaApiParameterPermissionItemFilter, KalturaApiParameterPermissionItemBaseFilter);


/**
 */
function KalturaAssetParamsOutputFilter(){
	KalturaAssetParamsOutputFilter.super_.call(this);
}
module.exports.KalturaAssetParamsOutputFilter = KalturaAssetParamsOutputFilter;

util.inherits(KalturaAssetParamsOutputFilter, KalturaAssetParamsOutputBaseFilter);


/**
 */
function KalturaAttachmentAssetFilter(){
	KalturaAttachmentAssetFilter.super_.call(this);
}
module.exports.KalturaAttachmentAssetFilter = KalturaAttachmentAssetFilter;

util.inherits(KalturaAttachmentAssetFilter, KalturaAttachmentAssetBaseFilter);


/**
 */
function KalturaBusinessProcessAbortNotificationTemplateBaseFilter(){
	KalturaBusinessProcessAbortNotificationTemplateBaseFilter.super_.call(this);
}
module.exports.KalturaBusinessProcessAbortNotificationTemplateBaseFilter = KalturaBusinessProcessAbortNotificationTemplateBaseFilter;

util.inherits(KalturaBusinessProcessAbortNotificationTemplateBaseFilter, KalturaBusinessProcessNotificationTemplateFilter);


/**
 */
function KalturaBusinessProcessSignalNotificationTemplateBaseFilter(){
	KalturaBusinessProcessSignalNotificationTemplateBaseFilter.super_.call(this);
}
module.exports.KalturaBusinessProcessSignalNotificationTemplateBaseFilter = KalturaBusinessProcessSignalNotificationTemplateBaseFilter;

util.inherits(KalturaBusinessProcessSignalNotificationTemplateBaseFilter, KalturaBusinessProcessNotificationTemplateFilter);


/**
 */
function KalturaBusinessProcessStartNotificationTemplateBaseFilter(){
	KalturaBusinessProcessStartNotificationTemplateBaseFilter.super_.call(this);
}
module.exports.KalturaBusinessProcessStartNotificationTemplateBaseFilter = KalturaBusinessProcessStartNotificationTemplateBaseFilter;

util.inherits(KalturaBusinessProcessStartNotificationTemplateBaseFilter, KalturaBusinessProcessNotificationTemplateFilter);


/**
 */
function KalturaCaptionAssetFilter(){
	KalturaCaptionAssetFilter.super_.call(this);
}
module.exports.KalturaCaptionAssetFilter = KalturaCaptionAssetFilter;

util.inherits(KalturaCaptionAssetFilter, KalturaCaptionAssetBaseFilter);


/**
 */
function KalturaCaptionParamsFilter(){
	KalturaCaptionParamsFilter.super_.call(this);
}
module.exports.KalturaCaptionParamsFilter = KalturaCaptionParamsFilter;

util.inherits(KalturaCaptionParamsFilter, KalturaCaptionParamsBaseFilter);


/**
 */
function KalturaCodeCuePointFilter(){
	KalturaCodeCuePointFilter.super_.call(this);
}
module.exports.KalturaCodeCuePointFilter = KalturaCodeCuePointFilter;

util.inherits(KalturaCodeCuePointFilter, KalturaCodeCuePointBaseFilter);


/**
 */
function KalturaDataEntryFilter(){
	KalturaDataEntryFilter.super_.call(this);
}
module.exports.KalturaDataEntryFilter = KalturaDataEntryFilter;

util.inherits(KalturaDataEntryFilter, KalturaDataEntryBaseFilter);


/**
 */
function KalturaDeliveryProfileGenericRtmpBaseFilter(){
	KalturaDeliveryProfileGenericRtmpBaseFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileGenericRtmpBaseFilter = KalturaDeliveryProfileGenericRtmpBaseFilter;

util.inherits(KalturaDeliveryProfileGenericRtmpBaseFilter, KalturaDeliveryProfileRtmpFilter);


/**
 */
function KalturaDocumentEntryFilter(){
	KalturaDocumentEntryFilter.super_.call(this);
}
module.exports.KalturaDocumentEntryFilter = KalturaDocumentEntryFilter;

util.inherits(KalturaDocumentEntryFilter, KalturaDocumentEntryBaseFilter);


/**
 */
function KalturaEventCuePointFilter(){
	KalturaEventCuePointFilter.super_.call(this);
}
module.exports.KalturaEventCuePointFilter = KalturaEventCuePointFilter;

util.inherits(KalturaEventCuePointFilter, KalturaEventCuePointBaseFilter);


/**
 */
function KalturaFlavorAssetFilter(){
	KalturaFlavorAssetFilter.super_.call(this);
}
module.exports.KalturaFlavorAssetFilter = KalturaFlavorAssetFilter;

util.inherits(KalturaFlavorAssetFilter, KalturaFlavorAssetBaseFilter);


/**
 */
function KalturaFlavorParamsFilter(){
	KalturaFlavorParamsFilter.super_.call(this);
}
module.exports.KalturaFlavorParamsFilter = KalturaFlavorParamsFilter;

util.inherits(KalturaFlavorParamsFilter, KalturaFlavorParamsBaseFilter);


/**
 */
function KalturaFtpDropFolderBaseFilter(){
	KalturaFtpDropFolderBaseFilter.super_.call(this);
}
module.exports.KalturaFtpDropFolderBaseFilter = KalturaFtpDropFolderBaseFilter;

util.inherits(KalturaFtpDropFolderBaseFilter, KalturaRemoteDropFolderFilter);


/**
 */
function KalturaGenericXsltSyndicationFeedBaseFilter(){
	KalturaGenericXsltSyndicationFeedBaseFilter.super_.call(this);
}
module.exports.KalturaGenericXsltSyndicationFeedBaseFilter = KalturaGenericXsltSyndicationFeedBaseFilter;

util.inherits(KalturaGenericXsltSyndicationFeedBaseFilter, KalturaGenericSyndicationFeedFilter);


/**
 */
function KalturaLiveStreamAdminEntry(){
	KalturaLiveStreamAdminEntry.super_.call(this);
}
module.exports.KalturaLiveStreamAdminEntry = KalturaLiveStreamAdminEntry;

util.inherits(KalturaLiveStreamAdminEntry, KalturaLiveStreamEntry);


/**
 */
function KalturaPlaylistFilter(){
	KalturaPlaylistFilter.super_.call(this);
}
module.exports.KalturaPlaylistFilter = KalturaPlaylistFilter;

util.inherits(KalturaPlaylistFilter, KalturaPlaylistBaseFilter);


/**
 */
function KalturaSshDropFolderBaseFilter(){
	KalturaSshDropFolderBaseFilter.super_.call(this);
}
module.exports.KalturaSshDropFolderBaseFilter = KalturaSshDropFolderBaseFilter;

util.inherits(KalturaSshDropFolderBaseFilter, KalturaRemoteDropFolderFilter);


/**
 * @param typeIn string .
 */
function KalturaThumbAssetFilter(){
	KalturaThumbAssetFilter.super_.call(this);
	this.typeIn = null;
}
module.exports.KalturaThumbAssetFilter = KalturaThumbAssetFilter;

util.inherits(KalturaThumbAssetFilter, KalturaThumbAssetBaseFilter);


/**
 */
function KalturaThumbCuePointFilter(){
	KalturaThumbCuePointFilter.super_.call(this);
}
module.exports.KalturaThumbCuePointFilter = KalturaThumbCuePointFilter;

util.inherits(KalturaThumbCuePointFilter, KalturaThumbCuePointBaseFilter);


/**
 */
function KalturaThumbParamsFilter(){
	KalturaThumbParamsFilter.super_.call(this);
}
module.exports.KalturaThumbParamsFilter = KalturaThumbParamsFilter;

util.inherits(KalturaThumbParamsFilter, KalturaThumbParamsBaseFilter);


/**
 */
function KalturaBusinessProcessAbortNotificationTemplateFilter(){
	KalturaBusinessProcessAbortNotificationTemplateFilter.super_.call(this);
}
module.exports.KalturaBusinessProcessAbortNotificationTemplateFilter = KalturaBusinessProcessAbortNotificationTemplateFilter;

util.inherits(KalturaBusinessProcessAbortNotificationTemplateFilter, KalturaBusinessProcessAbortNotificationTemplateBaseFilter);


/**
 */
function KalturaBusinessProcessSignalNotificationTemplateFilter(){
	KalturaBusinessProcessSignalNotificationTemplateFilter.super_.call(this);
}
module.exports.KalturaBusinessProcessSignalNotificationTemplateFilter = KalturaBusinessProcessSignalNotificationTemplateFilter;

util.inherits(KalturaBusinessProcessSignalNotificationTemplateFilter, KalturaBusinessProcessSignalNotificationTemplateBaseFilter);


/**
 */
function KalturaBusinessProcessStartNotificationTemplateFilter(){
	KalturaBusinessProcessStartNotificationTemplateFilter.super_.call(this);
}
module.exports.KalturaBusinessProcessStartNotificationTemplateFilter = KalturaBusinessProcessStartNotificationTemplateFilter;

util.inherits(KalturaBusinessProcessStartNotificationTemplateFilter, KalturaBusinessProcessStartNotificationTemplateBaseFilter);


/**
 * @param contentLike string .
 * @param contentMultiLikeOr string .
 * @param contentMultiLikeAnd string .
 * @param partnerDescriptionLike string .
 * @param partnerDescriptionMultiLikeOr string .
 * @param partnerDescriptionMultiLikeAnd string .
 * @param languageEqual string .
 * @param languageIn string .
 * @param labelEqual string .
 * @param labelIn string .
 * @param startTimeGreaterThanOrEqual int .
 * @param startTimeLessThanOrEqual int .
 * @param endTimeGreaterThanOrEqual int .
 * @param endTimeLessThanOrEqual int .
 */
function KalturaCaptionAssetItemFilter(){
	KalturaCaptionAssetItemFilter.super_.call(this);
	this.contentLike = null;
	this.contentMultiLikeOr = null;
	this.contentMultiLikeAnd = null;
	this.partnerDescriptionLike = null;
	this.partnerDescriptionMultiLikeOr = null;
	this.partnerDescriptionMultiLikeAnd = null;
	this.languageEqual = null;
	this.languageIn = null;
	this.labelEqual = null;
	this.labelIn = null;
	this.startTimeGreaterThanOrEqual = null;
	this.startTimeLessThanOrEqual = null;
	this.endTimeGreaterThanOrEqual = null;
	this.endTimeLessThanOrEqual = null;
}
module.exports.KalturaCaptionAssetItemFilter = KalturaCaptionAssetItemFilter;

util.inherits(KalturaCaptionAssetItemFilter, KalturaCaptionAssetFilter);


/**
 */
function KalturaDeliveryProfileGenericRtmpFilter(){
	KalturaDeliveryProfileGenericRtmpFilter.super_.call(this);
}
module.exports.KalturaDeliveryProfileGenericRtmpFilter = KalturaDeliveryProfileGenericRtmpFilter;

util.inherits(KalturaDeliveryProfileGenericRtmpFilter, KalturaDeliveryProfileGenericRtmpBaseFilter);


/**
 */
function KalturaDocumentFlavorParamsBaseFilter(){
	KalturaDocumentFlavorParamsBaseFilter.super_.call(this);
}
module.exports.KalturaDocumentFlavorParamsBaseFilter = KalturaDocumentFlavorParamsBaseFilter;

util.inherits(KalturaDocumentFlavorParamsBaseFilter, KalturaFlavorParamsFilter);


/**
 * @param flavorParamsIdEqual int .
 * @param flavorParamsVersionEqual string .
 * @param flavorAssetIdEqual string .
 * @param flavorAssetVersionEqual string .
 */
function KalturaFlavorParamsOutputBaseFilter(){
	KalturaFlavorParamsOutputBaseFilter.super_.call(this);
	this.flavorParamsIdEqual = null;
	this.flavorParamsVersionEqual = null;
	this.flavorAssetIdEqual = null;
	this.flavorAssetVersionEqual = null;
}
module.exports.KalturaFlavorParamsOutputBaseFilter = KalturaFlavorParamsOutputBaseFilter;

util.inherits(KalturaFlavorParamsOutputBaseFilter, KalturaFlavorParamsFilter);


/**
 */
function KalturaFtpDropFolderFilter(){
	KalturaFtpDropFolderFilter.super_.call(this);
}
module.exports.KalturaFtpDropFolderFilter = KalturaFtpDropFolderFilter;

util.inherits(KalturaFtpDropFolderFilter, KalturaFtpDropFolderBaseFilter);


/**
 */
function KalturaGenericXsltSyndicationFeedFilter(){
	KalturaGenericXsltSyndicationFeedFilter.super_.call(this);
}
module.exports.KalturaGenericXsltSyndicationFeedFilter = KalturaGenericXsltSyndicationFeedFilter;

util.inherits(KalturaGenericXsltSyndicationFeedFilter, KalturaGenericXsltSyndicationFeedBaseFilter);


/**
 */
function KalturaImageFlavorParamsBaseFilter(){
	KalturaImageFlavorParamsBaseFilter.super_.call(this);
}
module.exports.KalturaImageFlavorParamsBaseFilter = KalturaImageFlavorParamsBaseFilter;

util.inherits(KalturaImageFlavorParamsBaseFilter, KalturaFlavorParamsFilter);


/**
 */
function KalturaLiveAssetBaseFilter(){
	KalturaLiveAssetBaseFilter.super_.call(this);
}
module.exports.KalturaLiveAssetBaseFilter = KalturaLiveAssetBaseFilter;

util.inherits(KalturaLiveAssetBaseFilter, KalturaFlavorAssetFilter);


/**
 */
function KalturaLiveParamsBaseFilter(){
	KalturaLiveParamsBaseFilter.super_.call(this);
}
module.exports.KalturaLiveParamsBaseFilter = KalturaLiveParamsBaseFilter;

util.inherits(KalturaLiveParamsBaseFilter, KalturaFlavorParamsFilter);


/**
 */
function KalturaMediaFlavorParamsBaseFilter(){
	KalturaMediaFlavorParamsBaseFilter.super_.call(this);
}
module.exports.KalturaMediaFlavorParamsBaseFilter = KalturaMediaFlavorParamsBaseFilter;

util.inherits(KalturaMediaFlavorParamsBaseFilter, KalturaFlavorParamsFilter);


/**
 */
function KalturaMixEntryBaseFilter(){
	KalturaMixEntryBaseFilter.super_.call(this);
}
module.exports.KalturaMixEntryBaseFilter = KalturaMixEntryBaseFilter;

util.inherits(KalturaMixEntryBaseFilter, KalturaPlayableEntryFilter);


/**
 */
function KalturaPdfFlavorParamsBaseFilter(){
	KalturaPdfFlavorParamsBaseFilter.super_.call(this);
}
module.exports.KalturaPdfFlavorParamsBaseFilter = KalturaPdfFlavorParamsBaseFilter;

util.inherits(KalturaPdfFlavorParamsBaseFilter, KalturaFlavorParamsFilter);


/**
 */
function KalturaSshDropFolderFilter(){
	KalturaSshDropFolderFilter.super_.call(this);
}
module.exports.KalturaSshDropFolderFilter = KalturaSshDropFolderFilter;

util.inherits(KalturaSshDropFolderFilter, KalturaSshDropFolderBaseFilter);


/**
 */
function KalturaSwfFlavorParamsBaseFilter(){
	KalturaSwfFlavorParamsBaseFilter.super_.call(this);
}
module.exports.KalturaSwfFlavorParamsBaseFilter = KalturaSwfFlavorParamsBaseFilter;

util.inherits(KalturaSwfFlavorParamsBaseFilter, KalturaFlavorParamsFilter);


/**
 * @param thumbParamsIdEqual int .
 * @param thumbParamsVersionEqual string .
 * @param thumbAssetIdEqual string .
 * @param thumbAssetVersionEqual string .
 */
function KalturaThumbParamsOutputBaseFilter(){
	KalturaThumbParamsOutputBaseFilter.super_.call(this);
	this.thumbParamsIdEqual = null;
	this.thumbParamsVersionEqual = null;
	this.thumbAssetIdEqual = null;
	this.thumbAssetVersionEqual = null;
}
module.exports.KalturaThumbParamsOutputBaseFilter = KalturaThumbParamsOutputBaseFilter;

util.inherits(KalturaThumbParamsOutputBaseFilter, KalturaThumbParamsFilter);


/**
 */
function KalturaTimedThumbAssetBaseFilter(){
	KalturaTimedThumbAssetBaseFilter.super_.call(this);
}
module.exports.KalturaTimedThumbAssetBaseFilter = KalturaTimedThumbAssetBaseFilter;

util.inherits(KalturaTimedThumbAssetBaseFilter, KalturaThumbAssetFilter);


/**
 */
function KalturaWidevineFlavorAssetBaseFilter(){
	KalturaWidevineFlavorAssetBaseFilter.super_.call(this);
}
module.exports.KalturaWidevineFlavorAssetBaseFilter = KalturaWidevineFlavorAssetBaseFilter;

util.inherits(KalturaWidevineFlavorAssetBaseFilter, KalturaFlavorAssetFilter);


/**
 */
function KalturaWidevineFlavorParamsBaseFilter(){
	KalturaWidevineFlavorParamsBaseFilter.super_.call(this);
}
module.exports.KalturaWidevineFlavorParamsBaseFilter = KalturaWidevineFlavorParamsBaseFilter;

util.inherits(KalturaWidevineFlavorParamsBaseFilter, KalturaFlavorParamsFilter);


/**
 */
function KalturaDocumentFlavorParamsFilter(){
	KalturaDocumentFlavorParamsFilter.super_.call(this);
}
module.exports.KalturaDocumentFlavorParamsFilter = KalturaDocumentFlavorParamsFilter;

util.inherits(KalturaDocumentFlavorParamsFilter, KalturaDocumentFlavorParamsBaseFilter);


/**
 */
function KalturaFlavorParamsOutputFilter(){
	KalturaFlavorParamsOutputFilter.super_.call(this);
}
module.exports.KalturaFlavorParamsOutputFilter = KalturaFlavorParamsOutputFilter;

util.inherits(KalturaFlavorParamsOutputFilter, KalturaFlavorParamsOutputBaseFilter);


/**
 */
function KalturaImageFlavorParamsFilter(){
	KalturaImageFlavorParamsFilter.super_.call(this);
}
module.exports.KalturaImageFlavorParamsFilter = KalturaImageFlavorParamsFilter;

util.inherits(KalturaImageFlavorParamsFilter, KalturaImageFlavorParamsBaseFilter);


/**
 */
function KalturaLiveAssetFilter(){
	KalturaLiveAssetFilter.super_.call(this);
}
module.exports.KalturaLiveAssetFilter = KalturaLiveAssetFilter;

util.inherits(KalturaLiveAssetFilter, KalturaLiveAssetBaseFilter);


/**
 */
function KalturaLiveParamsFilter(){
	KalturaLiveParamsFilter.super_.call(this);
}
module.exports.KalturaLiveParamsFilter = KalturaLiveParamsFilter;

util.inherits(KalturaLiveParamsFilter, KalturaLiveParamsBaseFilter);


/**
 */
function KalturaMediaFlavorParamsFilter(){
	KalturaMediaFlavorParamsFilter.super_.call(this);
}
module.exports.KalturaMediaFlavorParamsFilter = KalturaMediaFlavorParamsFilter;

util.inherits(KalturaMediaFlavorParamsFilter, KalturaMediaFlavorParamsBaseFilter);


/**
 */
function KalturaMixEntryFilter(){
	KalturaMixEntryFilter.super_.call(this);
}
module.exports.KalturaMixEntryFilter = KalturaMixEntryFilter;

util.inherits(KalturaMixEntryFilter, KalturaMixEntryBaseFilter);


/**
 */
function KalturaPdfFlavorParamsFilter(){
	KalturaPdfFlavorParamsFilter.super_.call(this);
}
module.exports.KalturaPdfFlavorParamsFilter = KalturaPdfFlavorParamsFilter;

util.inherits(KalturaPdfFlavorParamsFilter, KalturaPdfFlavorParamsBaseFilter);


/**
 */
function KalturaScpDropFolderBaseFilter(){
	KalturaScpDropFolderBaseFilter.super_.call(this);
}
module.exports.KalturaScpDropFolderBaseFilter = KalturaScpDropFolderBaseFilter;

util.inherits(KalturaScpDropFolderBaseFilter, KalturaSshDropFolderFilter);


/**
 */
function KalturaSftpDropFolderBaseFilter(){
	KalturaSftpDropFolderBaseFilter.super_.call(this);
}
module.exports.KalturaSftpDropFolderBaseFilter = KalturaSftpDropFolderBaseFilter;

util.inherits(KalturaSftpDropFolderBaseFilter, KalturaSshDropFolderFilter);


/**
 */
function KalturaSwfFlavorParamsFilter(){
	KalturaSwfFlavorParamsFilter.super_.call(this);
}
module.exports.KalturaSwfFlavorParamsFilter = KalturaSwfFlavorParamsFilter;

util.inherits(KalturaSwfFlavorParamsFilter, KalturaSwfFlavorParamsBaseFilter);


/**
 */
function KalturaThumbParamsOutputFilter(){
	KalturaThumbParamsOutputFilter.super_.call(this);
}
module.exports.KalturaThumbParamsOutputFilter = KalturaThumbParamsOutputFilter;

util.inherits(KalturaThumbParamsOutputFilter, KalturaThumbParamsOutputBaseFilter);


/**
 */
function KalturaTimedThumbAssetFilter(){
	KalturaTimedThumbAssetFilter.super_.call(this);
}
module.exports.KalturaTimedThumbAssetFilter = KalturaTimedThumbAssetFilter;

util.inherits(KalturaTimedThumbAssetFilter, KalturaTimedThumbAssetBaseFilter);


/**
 */
function KalturaWidevineFlavorAssetFilter(){
	KalturaWidevineFlavorAssetFilter.super_.call(this);
}
module.exports.KalturaWidevineFlavorAssetFilter = KalturaWidevineFlavorAssetFilter;

util.inherits(KalturaWidevineFlavorAssetFilter, KalturaWidevineFlavorAssetBaseFilter);


/**
 */
function KalturaWidevineFlavorParamsFilter(){
	KalturaWidevineFlavorParamsFilter.super_.call(this);
}
module.exports.KalturaWidevineFlavorParamsFilter = KalturaWidevineFlavorParamsFilter;

util.inherits(KalturaWidevineFlavorParamsFilter, KalturaWidevineFlavorParamsBaseFilter);


/**
 */
function KalturaDocumentFlavorParamsOutputBaseFilter(){
	KalturaDocumentFlavorParamsOutputBaseFilter.super_.call(this);
}
module.exports.KalturaDocumentFlavorParamsOutputBaseFilter = KalturaDocumentFlavorParamsOutputBaseFilter;

util.inherits(KalturaDocumentFlavorParamsOutputBaseFilter, KalturaFlavorParamsOutputFilter);


/**
 * @param externalSourceTypeEqual string .
 * @param externalSourceTypeIn string .
 * @param assetParamsIdsMatchOr string .
 * @param assetParamsIdsMatchAnd string .
 */
function KalturaExternalMediaEntryBaseFilter(){
	KalturaExternalMediaEntryBaseFilter.super_.call(this);
	this.externalSourceTypeEqual = null;
	this.externalSourceTypeIn = null;
	this.assetParamsIdsMatchOr = null;
	this.assetParamsIdsMatchAnd = null;
}
module.exports.KalturaExternalMediaEntryBaseFilter = KalturaExternalMediaEntryBaseFilter;

util.inherits(KalturaExternalMediaEntryBaseFilter, KalturaMediaEntryFilter);


/**
 */
function KalturaImageFlavorParamsOutputBaseFilter(){
	KalturaImageFlavorParamsOutputBaseFilter.super_.call(this);
}
module.exports.KalturaImageFlavorParamsOutputBaseFilter = KalturaImageFlavorParamsOutputBaseFilter;

util.inherits(KalturaImageFlavorParamsOutputBaseFilter, KalturaFlavorParamsOutputFilter);


/**
 */
function KalturaLiveEntryBaseFilter(){
	KalturaLiveEntryBaseFilter.super_.call(this);
}
module.exports.KalturaLiveEntryBaseFilter = KalturaLiveEntryBaseFilter;

util.inherits(KalturaLiveEntryBaseFilter, KalturaMediaEntryFilter);


/**
 */
function KalturaMediaFlavorParamsOutputBaseFilter(){
	KalturaMediaFlavorParamsOutputBaseFilter.super_.call(this);
}
module.exports.KalturaMediaFlavorParamsOutputBaseFilter = KalturaMediaFlavorParamsOutputBaseFilter;

util.inherits(KalturaMediaFlavorParamsOutputBaseFilter, KalturaFlavorParamsOutputFilter);


/**
 */
function KalturaPdfFlavorParamsOutputBaseFilter(){
	KalturaPdfFlavorParamsOutputBaseFilter.super_.call(this);
}
module.exports.KalturaPdfFlavorParamsOutputBaseFilter = KalturaPdfFlavorParamsOutputBaseFilter;

util.inherits(KalturaPdfFlavorParamsOutputBaseFilter, KalturaFlavorParamsOutputFilter);


/**
 */
function KalturaScpDropFolderFilter(){
	KalturaScpDropFolderFilter.super_.call(this);
}
module.exports.KalturaScpDropFolderFilter = KalturaScpDropFolderFilter;

util.inherits(KalturaScpDropFolderFilter, KalturaScpDropFolderBaseFilter);


/**
 */
function KalturaSftpDropFolderFilter(){
	KalturaSftpDropFolderFilter.super_.call(this);
}
module.exports.KalturaSftpDropFolderFilter = KalturaSftpDropFolderFilter;

util.inherits(KalturaSftpDropFolderFilter, KalturaSftpDropFolderBaseFilter);


/**
 */
function KalturaSwfFlavorParamsOutputBaseFilter(){
	KalturaSwfFlavorParamsOutputBaseFilter.super_.call(this);
}
module.exports.KalturaSwfFlavorParamsOutputBaseFilter = KalturaSwfFlavorParamsOutputBaseFilter;

util.inherits(KalturaSwfFlavorParamsOutputBaseFilter, KalturaFlavorParamsOutputFilter);


/**
 */
function KalturaWidevineFlavorParamsOutputBaseFilter(){
	KalturaWidevineFlavorParamsOutputBaseFilter.super_.call(this);
}
module.exports.KalturaWidevineFlavorParamsOutputBaseFilter = KalturaWidevineFlavorParamsOutputBaseFilter;

util.inherits(KalturaWidevineFlavorParamsOutputBaseFilter, KalturaFlavorParamsOutputFilter);


/**
 */
function KalturaDocumentFlavorParamsOutputFilter(){
	KalturaDocumentFlavorParamsOutputFilter.super_.call(this);
}
module.exports.KalturaDocumentFlavorParamsOutputFilter = KalturaDocumentFlavorParamsOutputFilter;

util.inherits(KalturaDocumentFlavorParamsOutputFilter, KalturaDocumentFlavorParamsOutputBaseFilter);


/**
 */
function KalturaExternalMediaEntryFilter(){
	KalturaExternalMediaEntryFilter.super_.call(this);
}
module.exports.KalturaExternalMediaEntryFilter = KalturaExternalMediaEntryFilter;

util.inherits(KalturaExternalMediaEntryFilter, KalturaExternalMediaEntryBaseFilter);


/**
 */
function KalturaImageFlavorParamsOutputFilter(){
	KalturaImageFlavorParamsOutputFilter.super_.call(this);
}
module.exports.KalturaImageFlavorParamsOutputFilter = KalturaImageFlavorParamsOutputFilter;

util.inherits(KalturaImageFlavorParamsOutputFilter, KalturaImageFlavorParamsOutputBaseFilter);


/**
 * @param isLive int .
 * @param isRecordedEntryIdEmpty int .
 */
function KalturaLiveEntryFilter(){
	KalturaLiveEntryFilter.super_.call(this);
	this.isLive = null;
	this.isRecordedEntryIdEmpty = null;
}
module.exports.KalturaLiveEntryFilter = KalturaLiveEntryFilter;

util.inherits(KalturaLiveEntryFilter, KalturaLiveEntryBaseFilter);


/**
 */
function KalturaMediaFlavorParamsOutputFilter(){
	KalturaMediaFlavorParamsOutputFilter.super_.call(this);
}
module.exports.KalturaMediaFlavorParamsOutputFilter = KalturaMediaFlavorParamsOutputFilter;

util.inherits(KalturaMediaFlavorParamsOutputFilter, KalturaMediaFlavorParamsOutputBaseFilter);


/**
 */
function KalturaPdfFlavorParamsOutputFilter(){
	KalturaPdfFlavorParamsOutputFilter.super_.call(this);
}
module.exports.KalturaPdfFlavorParamsOutputFilter = KalturaPdfFlavorParamsOutputFilter;

util.inherits(KalturaPdfFlavorParamsOutputFilter, KalturaPdfFlavorParamsOutputBaseFilter);


/**
 */
function KalturaSwfFlavorParamsOutputFilter(){
	KalturaSwfFlavorParamsOutputFilter.super_.call(this);
}
module.exports.KalturaSwfFlavorParamsOutputFilter = KalturaSwfFlavorParamsOutputFilter;

util.inherits(KalturaSwfFlavorParamsOutputFilter, KalturaSwfFlavorParamsOutputBaseFilter);


/**
 */
function KalturaWidevineFlavorParamsOutputFilter(){
	KalturaWidevineFlavorParamsOutputFilter.super_.call(this);
}
module.exports.KalturaWidevineFlavorParamsOutputFilter = KalturaWidevineFlavorParamsOutputFilter;

util.inherits(KalturaWidevineFlavorParamsOutputFilter, KalturaWidevineFlavorParamsOutputBaseFilter);


/**
 */
function KalturaLiveChannelBaseFilter(){
	KalturaLiveChannelBaseFilter.super_.call(this);
}
module.exports.KalturaLiveChannelBaseFilter = KalturaLiveChannelBaseFilter;

util.inherits(KalturaLiveChannelBaseFilter, KalturaLiveEntryFilter);


/**
 */
function KalturaLiveStreamEntryBaseFilter(){
	KalturaLiveStreamEntryBaseFilter.super_.call(this);
}
module.exports.KalturaLiveStreamEntryBaseFilter = KalturaLiveStreamEntryBaseFilter;

util.inherits(KalturaLiveStreamEntryBaseFilter, KalturaLiveEntryFilter);


/**
 */
function KalturaLiveChannelFilter(){
	KalturaLiveChannelFilter.super_.call(this);
}
module.exports.KalturaLiveChannelFilter = KalturaLiveChannelFilter;

util.inherits(KalturaLiveChannelFilter, KalturaLiveChannelBaseFilter);


/**
 */
function KalturaLiveStreamEntryFilter(){
	KalturaLiveStreamEntryFilter.super_.call(this);
}
module.exports.KalturaLiveStreamEntryFilter = KalturaLiveStreamEntryFilter;

util.inherits(KalturaLiveStreamEntryFilter, KalturaLiveStreamEntryBaseFilter);


/**
 */
function KalturaLiveStreamAdminEntryBaseFilter(){
	KalturaLiveStreamAdminEntryBaseFilter.super_.call(this);
}
module.exports.KalturaLiveStreamAdminEntryBaseFilter = KalturaLiveStreamAdminEntryBaseFilter;

util.inherits(KalturaLiveStreamAdminEntryBaseFilter, KalturaLiveStreamEntryFilter);


/**
 */
function KalturaLiveStreamAdminEntryFilter(){
	KalturaLiveStreamAdminEntryFilter.super_.call(this);
}
module.exports.KalturaLiveStreamAdminEntryFilter = KalturaLiveStreamAdminEntryFilter;

util.inherits(KalturaLiveStreamAdminEntryFilter, KalturaLiveStreamAdminEntryBaseFilter);


