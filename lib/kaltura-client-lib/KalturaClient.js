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
/**
 * The Kaltura Client - this is the facade through which all service actions should be called.
 * @param config the Kaltura configuration object holding partner credentials (type: KalturaConfiguration).
 */
var util = require('util');
var kaltura = require('./KalturaClientBase');
kaltura.objects = require('./KalturaVO');
kaltura.services = require('./KalturaServices');
kaltura.enums = require('./KalturaTypes');

function KalturaClient(config) {
	this.setApiVersion('3.2.0');
	this.setClientTag('node:15-05-14');
	this.init(config);
}

module.exports = kaltura;
module.exports.KalturaClient = KalturaClient;

util.inherits(KalturaClient, kaltura.KalturaClientBase);

/**
 * Manage access control profiles
 * @param kaltura.services.KalturaAccessControlProfileService
 */
KalturaClient.prototype.accessControlProfile = null;
/**
 * Add & Manage Access Controls
 * @param kaltura.services.KalturaAccessControlService
 */
KalturaClient.prototype.accessControl = null;
/**
 * Manage details for the administrative user
 * @param kaltura.services.KalturaAdminUserService
 */
KalturaClient.prototype.adminUser = null;
/**
 * Base Entry Service
 * @param kaltura.services.KalturaBaseEntryService
 */
KalturaClient.prototype.baseEntry = null;
/**
 * Bulk upload service is used to upload & manage bulk uploads using CSV files.
 * This service manages only entry bulk uploads
 * @param kaltura.services.KalturaBulkUploadService
 */
KalturaClient.prototype.bulkUpload = null;
/**
 * Add & Manage CategoryEntry - assign entry to category
 * @param kaltura.services.KalturaCategoryEntryService
 */
KalturaClient.prototype.categoryEntry = null;
/**
 * Add & Manage Categories
 * @param kaltura.services.KalturaCategoryService
 */
KalturaClient.prototype.category = null;
/**
 * Add & Manage CategoryUser - membership of a user in a category
 * @param kaltura.services.KalturaCategoryUserService
 */
KalturaClient.prototype.categoryUser = null;
/**
 * Manage the connection between Conversion Profiles and Asset Params
 * @param kaltura.services.KalturaConversionProfileAssetParamsService
 */
KalturaClient.prototype.conversionProfileAssetParams = null;
/**
 * Add & Manage Conversion Profiles
 * @param kaltura.services.KalturaConversionProfileService
 */
KalturaClient.prototype.conversionProfile = null;
/**
 * Data service lets you manage data content (textual content)
 * @param kaltura.services.KalturaDataService
 */
KalturaClient.prototype.data = null;
/**
 * delivery service is used to control delivery objects
 * @param kaltura.services.KalturaDeliveryProfileService
 */
KalturaClient.prototype.deliveryProfile = null;
/**
 * Document service
 * @param kaltura.services.KalturaDocumentService
 */
KalturaClient.prototype.document = null;
/**
 * EmailIngestionProfile service lets you manage email ingestion profile records
 * @param kaltura.services.KalturaEmailIngestionProfileService
 */
KalturaClient.prototype.EmailIngestionProfile = null;
/**
 * Manage file assets
 * @param kaltura.services.KalturaFileAssetService
 */
KalturaClient.prototype.fileAsset = null;
/**
 * Retrieve information and invoke actions on Flavor Asset
 * @param kaltura.services.KalturaFlavorAssetService
 */
KalturaClient.prototype.flavorAsset = null;
/**
 * Flavor Params Output service
 * @param kaltura.services.KalturaFlavorParamsOutputService
 */
KalturaClient.prototype.flavorParamsOutput = null;
/**
 * Add & Manage Flavor Params
 * @param kaltura.services.KalturaFlavorParamsService
 */
KalturaClient.prototype.flavorParams = null;
/**
 * Add & Manage GroupUser
 * @param kaltura.services.KalturaGroupUserService
 */
KalturaClient.prototype.groupUser = null;
/**
 * Manage live channel segments
 * @param kaltura.services.KalturaLiveChannelSegmentService
 */
KalturaClient.prototype.liveChannelSegment = null;
/**
 * Live Channel service lets you manage live channels
 * @param kaltura.services.KalturaLiveChannelService
 */
KalturaClient.prototype.liveChannel = null;
/**
 * 
 * @param kaltura.services.KalturaLiveReportsService
 */
KalturaClient.prototype.liveReports = null;
/**
 * Stats Service
 * @param kaltura.services.KalturaLiveStatsService
 */
KalturaClient.prototype.liveStats = null;
/**
 * Live Stream service lets you manage live stream entries
 * @param kaltura.services.KalturaLiveStreamService
 */
KalturaClient.prototype.liveStream = null;
/**
 * Media Info service
 * @param kaltura.services.KalturaMediaInfoService
 */
KalturaClient.prototype.mediaInfo = null;
/**
 * Manage media servers
 * @param kaltura.services.KalturaMediaServerService
 */
KalturaClient.prototype.mediaServer = null;
/**
 * Media service lets you upload and manage media files (images / videos & audio)
 * @param kaltura.services.KalturaMediaService
 */
KalturaClient.prototype.media = null;
/**
 * A Mix is an XML unique format invented by Kaltura, it allows the user to create a mix of videos and images, in and out points, transitions, text overlays, soundtrack, effects and much more...
 * Mixing service lets you create a new mix, manage its metadata and make basic manipulations
 * @param kaltura.services.KalturaMixingService
 */
KalturaClient.prototype.mixing = null;
/**
 * Notification Service
 * @param kaltura.services.KalturaNotificationService
 */
KalturaClient.prototype.notification = null;
/**
 * partner service allows you to change/manage your partner personal details and settings as well
 * @param kaltura.services.KalturaPartnerService
 */
KalturaClient.prototype.partner = null;
/**
 * PermissionItem service lets you create and manage permission items
 * @param kaltura.services.KalturaPermissionItemService
 */
KalturaClient.prototype.permissionItem = null;
/**
 * Permission service lets you create and manage user permissions
 * @param kaltura.services.KalturaPermissionService
 */
KalturaClient.prototype.permission = null;
/**
 * Playlist service lets you create,manage and play your playlists
 * Playlists could be static (containing a fixed list of entries) or dynamic (baseed on a filter)
 * @param kaltura.services.KalturaPlaylistService
 */
KalturaClient.prototype.playlist = null;
/**
 * api for getting reports data by the report type and some inputFilter
 * @param kaltura.services.KalturaReportService
 */
KalturaClient.prototype.report = null;
/**
 * Manage response profiles
 * @param kaltura.services.KalturaResponseProfileService
 */
KalturaClient.prototype.responseProfile = null;
/**
 * Expose the schema definitions for syndication MRSS, bulk upload XML and other schema types
 * @param kaltura.services.KalturaSchemaService
 */
KalturaClient.prototype.schema = null;
/**
 * Search service allows you to search for media in various media providers
 * This service is being used mostly by the CW component
 * @param kaltura.services.KalturaSearchService
 */
KalturaClient.prototype.search = null;
/**
 * Session service
 * @param kaltura.services.KalturaSessionService
 */
KalturaClient.prototype.session = null;
/**
 * Stats Service
 * @param kaltura.services.KalturaStatsService
 */
KalturaClient.prototype.stats = null;
/**
 * Storage Profiles service
 * @param kaltura.services.KalturaStorageProfileService
 */
KalturaClient.prototype.storageProfile = null;
/**
 * Add & Manage Syndication Feeds
 * @param kaltura.services.KalturaSyndicationFeedService
 */
KalturaClient.prototype.syndicationFeed = null;
/**
 * System service is used for internal system helpers & to retrieve system level information
 * @param kaltura.services.KalturaSystemService
 */
KalturaClient.prototype.system = null;
/**
 * Retrieve information and invoke actions on Thumb Asset
 * @param kaltura.services.KalturaThumbAssetService
 */
KalturaClient.prototype.thumbAsset = null;
/**
 * Thumbnail Params Output service
 * @param kaltura.services.KalturaThumbParamsOutputService
 */
KalturaClient.prototype.thumbParamsOutput = null;
/**
 * Add & Manage Thumb Params
 * @param kaltura.services.KalturaThumbParamsService
 */
KalturaClient.prototype.thumbParams = null;
/**
 * UiConf service lets you create and manage your UIConfs for the various flash components
 * This service is used by the KMC-ApplicationStudio
 * @param kaltura.services.KalturaUiConfService
 */
KalturaClient.prototype.uiConf = null;
/**
 * 
 * @param kaltura.services.KalturaUploadService
 */
KalturaClient.prototype.upload = null;
/**
 * 
 * @param kaltura.services.KalturaUploadTokenService
 */
KalturaClient.prototype.uploadToken = null;
/**
 * UserRole service lets you create and manage user roles
 * @param kaltura.services.KalturaUserRoleService
 */
KalturaClient.prototype.userRole = null;
/**
 * Manage partner users on Kaltura's side
 * The userId in kaltura is the unique Id in the partner's system, and the [partnerId,Id] couple are unique key in kaltura's DB
 * @param kaltura.services.KalturaUserService
 */
KalturaClient.prototype.user = null;
/**
 * widget service for full widget management
 * @param kaltura.services.KalturaWidgetService
 */
KalturaClient.prototype.widget = null;
/**
 * Internal Service is used for actions that are used internally in Kaltura applications and might be changed in the future without any notice
 * @param kaltura.services.KalturaXInternalService
 */
KalturaClient.prototype.xInternal = null;
/**
 * Metadata service
 * @param kaltura.services.KalturaMetadataService
 */
KalturaClient.prototype.metadata = null;
/**
 * Metadata Profile service
 * @param kaltura.services.KalturaMetadataProfileService
 */
KalturaClient.prototype.metadataProfile = null;
/**
 * 
 * @param kaltura.services.KalturaMetadataBatchService
 */
KalturaClient.prototype.metadataBatch = null;
/**
 * Document service lets you upload and manage document files
 * @param kaltura.services.KalturaDocumentsService
 */
KalturaClient.prototype.documents = null;
/**
 * Annotation service - Video Annotation
 * @param kaltura.services.KalturaAnnotationService
 */
KalturaClient.prototype.annotation = null;
/**
 * Aspera service
 * @param kaltura.services.KalturaAsperaService
 */
KalturaClient.prototype.aspera = null;
/**
 * Retrieve information and invoke actions on attachment Asset
 * @param kaltura.services.KalturaAttachmentAssetService
 */
KalturaClient.prototype.attachmentAsset = null;
/**
 * Audit Trail service
 * @param kaltura.services.KalturaAuditTrailService
 */
KalturaClient.prototype.auditTrail = null;
/**
 * Bulk upload service is used to upload & manage bulk uploads
 * @param kaltura.services.KalturaBulkService
 */
KalturaClient.prototype.bulk = null;
/**
 * Retrieve information and invoke actions on caption Asset
 * @param kaltura.services.KalturaCaptionAssetService
 */
KalturaClient.prototype.captionAsset = null;
/**
 * Add & Manage Caption Params
 * @param kaltura.services.KalturaCaptionParamsService
 */
KalturaClient.prototype.captionParams = null;
/**
 * Search caption asset items
 * @param kaltura.services.KalturaCaptionAssetItemService
 */
KalturaClient.prototype.captionAssetItem = null;
/**
 * Distribution Profile service
 * @param kaltura.services.KalturaDistributionProfileService
 */
KalturaClient.prototype.distributionProfile = null;
/**
 * Entry Distribution service
 * @param kaltura.services.KalturaEntryDistributionService
 */
KalturaClient.prototype.entryDistribution = null;
/**
 * Distribution Provider service
 * @param kaltura.services.KalturaDistributionProviderService
 */
KalturaClient.prototype.distributionProvider = null;
/**
 * Generic Distribution Provider service
 * @param kaltura.services.KalturaGenericDistributionProviderService
 */
KalturaClient.prototype.genericDistributionProvider = null;
/**
 * Generic Distribution Provider Actions service
 * @param kaltura.services.KalturaGenericDistributionProviderActionService
 */
KalturaClient.prototype.genericDistributionProviderAction = null;
/**
 * 
 * @param kaltura.services.KalturaContentDistributionBatchService
 */
KalturaClient.prototype.contentDistributionBatch = null;
/**
 * Cue Point service
 * @param kaltura.services.KalturaCuePointService
 */
KalturaClient.prototype.cuePoint = null;
/**
 * DropFolder service lets you create and manage drop folders
 * @param kaltura.services.KalturaDropFolderService
 */
KalturaClient.prototype.dropFolder = null;
/**
 * DropFolderFile service lets you create and manage drop folder files
 * @param kaltura.services.KalturaDropFolderFileService
 */
KalturaClient.prototype.dropFolderFile = null;
/**
 * Event notification template service lets you create and manage event notification templates
 * @param kaltura.services.KalturaEventNotificationTemplateService
 */
KalturaClient.prototype.eventNotificationTemplate = null;
/**
 * System user service
 * @param kaltura.services.KalturaFileSyncService
 */
KalturaClient.prototype.fileSync = null;
/**
 * Kaltura Sharepoint Extension Service
 * @param kaltura.services.KalturaSharepointExtensionService
 */
KalturaClient.prototype.sharepointExtension = null;
/**
 * Allows user to 'like' or 'unlike' and entry
 * @param kaltura.services.KalturaLikeService
 */
KalturaClient.prototype.like = null;
/**
 * 
 * @param kaltura.services.KalturaFilesyncImportBatchService
 */
KalturaClient.prototype.filesyncImportBatch = null;
/**
 * Short link service
 * @param kaltura.services.KalturaShortLinkService
 */
KalturaClient.prototype.shortLink = null;
/**
 * Search object tags
 * @param kaltura.services.KalturaTagService
 */
KalturaClient.prototype.tag = null;
/**
 * Utility service for the Multi-publishers console
 * @param kaltura.services.KalturaVarConsoleService
 */
KalturaClient.prototype.varConsole = null;
/**
 * Virus scan profile service
 * @param kaltura.services.KalturaVirusScanProfileService
 */
KalturaClient.prototype.virusScanProfile = null;
/**
 * External media service lets you upload and manage embed codes and external playable content
 * @param kaltura.services.KalturaExternalMediaService
 */
KalturaClient.prototype.externalMedia = null;
/**
 * 
 * @param kaltura.services.KalturaDrmPolicyService
 */
KalturaClient.prototype.drmPolicy = null;
/**
 * 
 * @param kaltura.services.KalturaDrmProfileService
 */
KalturaClient.prototype.drmProfile = null;
/**
 * WidevineDrmService serves as a license proxy to a Widevine license server
 * @param kaltura.services.KalturaWidevineDrmService
 */
KalturaClient.prototype.widevineDrm = null;
/**
 * Enable serving live conversion profile to the Wowza servers as XML
 * @param kaltura.services.KalturaLiveConversionProfileService
 */
KalturaClient.prototype.liveConversionProfile = null;
/**
 * Schedule task service lets you create and manage scheduled task profiles
 * @param kaltura.services.KalturaScheduledTaskProfileService
 */
KalturaClient.prototype.scheduledTaskProfile = null;
/**
 * 
 * @param kaltura.services.KalturaPlayReadyDrmService
 */
KalturaClient.prototype.playReadyDrm = null;
/**
 * Integration service lets you dispatch integration tasks
 * @param kaltura.services.KalturaIntegrationService
 */
KalturaClient.prototype.integration = null;
/**
 * Business-Process server service lets you create and manage servers
 * @param kaltura.services.KalturaBusinessProcessServerService
 */
KalturaClient.prototype.businessProcessServer = null;
/**
 * Business-process case service lets you get information about processes
 * @param kaltura.services.KalturaBusinessProcessCaseService
 */
KalturaClient.prototype.businessProcessCase = null;
/**
 * The client constructor.
 * @param config the Kaltura configuration object holding partner credentials (type: KalturaConfiguration).
 */
KalturaClient.prototype.init = function(config){
	//call the super constructor:
	kaltura.KalturaClientBase.prototype.init.apply(this, arguments);
	//initialize client services:
	this.accessControlProfile = new kaltura.services.KalturaAccessControlProfileService(this);
	this.accessControl = new kaltura.services.KalturaAccessControlService(this);
	this.adminUser = new kaltura.services.KalturaAdminUserService(this);
	this.baseEntry = new kaltura.services.KalturaBaseEntryService(this);
	this.bulkUpload = new kaltura.services.KalturaBulkUploadService(this);
	this.categoryEntry = new kaltura.services.KalturaCategoryEntryService(this);
	this.category = new kaltura.services.KalturaCategoryService(this);
	this.categoryUser = new kaltura.services.KalturaCategoryUserService(this);
	this.conversionProfileAssetParams = new kaltura.services.KalturaConversionProfileAssetParamsService(this);
	this.conversionProfile = new kaltura.services.KalturaConversionProfileService(this);
	this.data = new kaltura.services.KalturaDataService(this);
	this.deliveryProfile = new kaltura.services.KalturaDeliveryProfileService(this);
	this.document = new kaltura.services.KalturaDocumentService(this);
	this.EmailIngestionProfile = new kaltura.services.KalturaEmailIngestionProfileService(this);
	this.fileAsset = new kaltura.services.KalturaFileAssetService(this);
	this.flavorAsset = new kaltura.services.KalturaFlavorAssetService(this);
	this.flavorParamsOutput = new kaltura.services.KalturaFlavorParamsOutputService(this);
	this.flavorParams = new kaltura.services.KalturaFlavorParamsService(this);
	this.groupUser = new kaltura.services.KalturaGroupUserService(this);
	this.liveChannelSegment = new kaltura.services.KalturaLiveChannelSegmentService(this);
	this.liveChannel = new kaltura.services.KalturaLiveChannelService(this);
	this.liveReports = new kaltura.services.KalturaLiveReportsService(this);
	this.liveStats = new kaltura.services.KalturaLiveStatsService(this);
	this.liveStream = new kaltura.services.KalturaLiveStreamService(this);
	this.mediaInfo = new kaltura.services.KalturaMediaInfoService(this);
	this.mediaServer = new kaltura.services.KalturaMediaServerService(this);
	this.media = new kaltura.services.KalturaMediaService(this);
	this.mixing = new kaltura.services.KalturaMixingService(this);
	this.notification = new kaltura.services.KalturaNotificationService(this);
	this.partner = new kaltura.services.KalturaPartnerService(this);
	this.permissionItem = new kaltura.services.KalturaPermissionItemService(this);
	this.permission = new kaltura.services.KalturaPermissionService(this);
	this.playlist = new kaltura.services.KalturaPlaylistService(this);
	this.report = new kaltura.services.KalturaReportService(this);
	this.responseProfile = new kaltura.services.KalturaResponseProfileService(this);
	this.schema = new kaltura.services.KalturaSchemaService(this);
	this.search = new kaltura.services.KalturaSearchService(this);
	this.session = new kaltura.services.KalturaSessionService(this);
	this.stats = new kaltura.services.KalturaStatsService(this);
	this.storageProfile = new kaltura.services.KalturaStorageProfileService(this);
	this.syndicationFeed = new kaltura.services.KalturaSyndicationFeedService(this);
	this.system = new kaltura.services.KalturaSystemService(this);
	this.thumbAsset = new kaltura.services.KalturaThumbAssetService(this);
	this.thumbParamsOutput = new kaltura.services.KalturaThumbParamsOutputService(this);
	this.thumbParams = new kaltura.services.KalturaThumbParamsService(this);
	this.uiConf = new kaltura.services.KalturaUiConfService(this);
	this.upload = new kaltura.services.KalturaUploadService(this);
	this.uploadToken = new kaltura.services.KalturaUploadTokenService(this);
	this.userRole = new kaltura.services.KalturaUserRoleService(this);
	this.user = new kaltura.services.KalturaUserService(this);
	this.widget = new kaltura.services.KalturaWidgetService(this);
	this.xInternal = new kaltura.services.KalturaXInternalService(this);
	this.metadata = new kaltura.services.KalturaMetadataService(this);
	this.metadataProfile = new kaltura.services.KalturaMetadataProfileService(this);
	this.metadataBatch = new kaltura.services.KalturaMetadataBatchService(this);
	this.documents = new kaltura.services.KalturaDocumentsService(this);
	this.annotation = new kaltura.services.KalturaAnnotationService(this);
	this.aspera = new kaltura.services.KalturaAsperaService(this);
	this.attachmentAsset = new kaltura.services.KalturaAttachmentAssetService(this);
	this.auditTrail = new kaltura.services.KalturaAuditTrailService(this);
	this.bulk = new kaltura.services.KalturaBulkService(this);
	this.captionAsset = new kaltura.services.KalturaCaptionAssetService(this);
	this.captionParams = new kaltura.services.KalturaCaptionParamsService(this);
	this.captionAssetItem = new kaltura.services.KalturaCaptionAssetItemService(this);
	this.distributionProfile = new kaltura.services.KalturaDistributionProfileService(this);
	this.entryDistribution = new kaltura.services.KalturaEntryDistributionService(this);
	this.distributionProvider = new kaltura.services.KalturaDistributionProviderService(this);
	this.genericDistributionProvider = new kaltura.services.KalturaGenericDistributionProviderService(this);
	this.genericDistributionProviderAction = new kaltura.services.KalturaGenericDistributionProviderActionService(this);
	this.contentDistributionBatch = new kaltura.services.KalturaContentDistributionBatchService(this);
	this.cuePoint = new kaltura.services.KalturaCuePointService(this);
	this.dropFolder = new kaltura.services.KalturaDropFolderService(this);
	this.dropFolderFile = new kaltura.services.KalturaDropFolderFileService(this);
	this.eventNotificationTemplate = new kaltura.services.KalturaEventNotificationTemplateService(this);
	this.fileSync = new kaltura.services.KalturaFileSyncService(this);
	this.sharepointExtension = new kaltura.services.KalturaSharepointExtensionService(this);
	this.like = new kaltura.services.KalturaLikeService(this);
	this.filesyncImportBatch = new kaltura.services.KalturaFilesyncImportBatchService(this);
	this.shortLink = new kaltura.services.KalturaShortLinkService(this);
	this.tag = new kaltura.services.KalturaTagService(this);
	this.varConsole = new kaltura.services.KalturaVarConsoleService(this);
	this.virusScanProfile = new kaltura.services.KalturaVirusScanProfileService(this);
	this.externalMedia = new kaltura.services.KalturaExternalMediaService(this);
	this.drmPolicy = new kaltura.services.KalturaDrmPolicyService(this);
	this.drmProfile = new kaltura.services.KalturaDrmProfileService(this);
	this.widevineDrm = new kaltura.services.KalturaWidevineDrmService(this);
	this.liveConversionProfile = new kaltura.services.KalturaLiveConversionProfileService(this);
	this.scheduledTaskProfile = new kaltura.services.KalturaScheduledTaskProfileService(this);
	this.playReadyDrm = new kaltura.services.KalturaPlayReadyDrmService(this);
	this.integration = new kaltura.services.KalturaIntegrationService(this);
	this.businessProcessServer = new kaltura.services.KalturaBusinessProcessServerService(this);
	this.businessProcessCase = new kaltura.services.KalturaBusinessProcessCaseService(this);
};
/**
 * @param string clientTag
 */
KalturaClient.prototype.setClientTag = function(clientTag){
	this.clientConfiguration['clientTag'] = clientTag;
};

/**
 * @return string
 */
KalturaClient.prototype.getClientTag = function(){
	return this.clientConfiguration['clientTag'];
};

/**
 * @param string apiVersion
 */
KalturaClient.prototype.setApiVersion = function(apiVersion){
	this.clientConfiguration['apiVersion'] = apiVersion;
};

/**
 * @return string
 */
KalturaClient.prototype.getApiVersion = function(){
	return this.clientConfiguration['apiVersion'];
};

/**
 * Impersonated partner id
 * 
 * @param int partnerId
 */
KalturaClient.prototype.setPartnerId = function(partnerId){
	this.requestConfiguration['partnerId'] = partnerId;
};

/**
 * Impersonated partner id
 * 
 * @return int
 */
KalturaClient.prototype.getPartnerId = function(){
	return this.requestConfiguration['partnerId'];
};

/**
 * Kaltura API session
 * 
 * @param string ks
 */
KalturaClient.prototype.setKs = function(ks){
	this.requestConfiguration['ks'] = ks;
};

/**
 * Kaltura API session
 * 
 * @return string
 */
KalturaClient.prototype.getKs = function(){
	return this.requestConfiguration['ks'];
};

/**
 * Kaltura API session
 * 
 * @param string sessionId
 */
KalturaClient.prototype.setSessionId = function(sessionId){
	this.requestConfiguration['ks'] = sessionId;
};

/**
 * Kaltura API session
 * 
 * @return string
 */
KalturaClient.prototype.getSessionId = function(){
	return this.requestConfiguration['ks'];
};

/**
 * Response profile
 * 
 * @param KalturaBaseResponseProfile responseProfile
 */
KalturaClient.prototype.setResponseProfile = function(responseProfile){
	this.requestConfiguration['responseProfile'] = responseProfile;
};

/**
 * Response profile
 * 
 * @return KalturaBaseResponseProfile
 */
KalturaClient.prototype.getResponseProfile = function(){
	return this.requestConfiguration['responseProfile'];
};

/**
 * Clear all volatile configuration parameters
 */
KalturaClient.prototype.resetRequest = function(){
	delete this.requestConfiguration['responseProfile'];
};

