from MockFileObject import MockFileObject
from threading import Thread, Lock


class UploadChunkJob: # todo move it to other file
    #global backend_client
    mutex = Lock()  # mutex for prevent race when reading file

    def __init__(self, upload_session, final_chunk, resume_at, resume, chunk_index):
        self.upload_session = upload_session
        self.final_chunk = final_chunk
        self.resume_at = resume_at
        self.resume = resume
        self.chunk_index = chunk_index

    def upload(self):
        pointer_to_read = self.resume_at
        self.mutex.acquire()
        try:
            self.upload_session.infile.seek(pointer_to_read)
            data = self.upload_session.infile.read(self.upload_session.upload_token_buffer_size)
        except IOError as e:
            raise e  # if exception then do not continue
        finally:  # called anyway
            self.mutex.release()
        self.file_obj = MockFileObject(self.upload_session.infile.name, data)
        result = self.upload_session.backend_client.upload_token_upload(self)  #todo what to  do with result