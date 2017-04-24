from UploadChunkJob import UploadChunkJob
from Config.config import get_config

class KalturaUploadSession:
    def __init__(self, file_name, file_size, chunks_to_upload, entry_id, recorded_id, backend_client, logger, infile):
        self.infile = infile
        self.file_name = file_name
        self.logger = logger
        self.file_size = file_size
        self.chunks_to_upload = chunks_to_upload
        self.partner_id = backend_client.get_live_entry(entry_id).partnerId
        self.recorded_id = recorded_id
        self.entry_id = entry_id
        self.backend_client = backend_client
        self.chunk_index = 1
        self.upload_token_buffer_size = get_config('upload_token_buffer_size_mb', 'int') * 1000000  # buffer is in MB
        # self.token_id,self.start_from = ServerUploader.backend_client.get_token(self.partner_id,file_name)
        # if !self.token_id:
        upload_token_list_response = backend_client.upload_token_list(self.partner_id, file_name)
        if upload_token_list_response.totalCount == 0:
            self.token_id = backend_client.upload_token_add(self.partner_id, file_name, file_size)
            self.uploaded_file_size = 0
            return
        if upload_token_list_response.totalCount == 1 or upload_token_list_response.totalCount == 2:  # if token is exist
            self.token_id = upload_token_list_response.objects[0].id
            self.uploaded_file_size = upload_token_list_response.objects[0].uploadedFileSize
            if self.uploaded_file_size is None:  # API return None instead of 0.
                self.uploaded_file_size = 0

            self.logger.info("Found token exist for %s, token: %s, stating from %s", self.file_name, self.token_id,
                             self.uploaded_file_size)

            return
        if upload_token_list_response.totalCount > 1:  # if more then one result, throw exption
            raise Exception('file ' + file_name + ' has ' + upload_token_list_response.totalCount
                            + '(more then one) KalturaUploadToken')

    def get_next_chunk(self, last_chunk = False):

            resume_at = self.upload_token_buffer_size * (self.chunk_index - 1)
            while resume_at < self.uploaded_file_size:
                self.logger.info('Chunk %s of %s has already upload skipped it (stating from %s bytes), ',
                                 self.chunk_index, self.chunks_to_upload, self.uploaded_file_size)
                self.chunk_index += 1
                resume_at = self.upload_token_buffer_size * (self.chunk_index - 1)
            if self.chunk_index > self.chunks_to_upload:
                self.logger.debug("No chunks to upload founded, return None")
                return None
            final_chunk = self.chunk_index == self.chunks_to_upload
            if final_chunk is True and last_chunk is False:
                self.logger.warn("Founded that is the last chunk, but function is not called from the right place, "
                    "return None. self.chunk_index %s, resume_at: %s, uploaded_file_size: %s",
                                 self.chunk_index , resume_at, self.uploaded_file_size)
                return None
            resume = self.chunk_index > 1
            chunk = UploadChunkJob(self, final_chunk, resume_at, resume, self.chunk_index)
            self.chunk_index += 1
            self.logger.debug("UploadChunkJob: %s", str(vars(chunk)))
            return chunk
