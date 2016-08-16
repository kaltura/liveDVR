import os
import io
from KalturaAPI import KalturaAPI
from config import get_config
import Queue
from threading import Thread
import logging.handlers

class file_cust():
    def __init__(self, _buffer):
        self.length = len(_buffer)
        self.buffer = _buffer
        self.name = '/tmp/1.txt'
        self.offset = 0

    def read(self, index=-1):
        if index < 0:
            result = self.buffer[self.offset:]
            self.offset = self.length
            return result
        result = self.buffer[self.offset:self.offset+index]
        self.offset = self.offset + index
        if self.offset > self.length:
            self.offset = self.length
        return result

    def seek(self, offset, whence = 0):
        if whence == 0:
            self.offset = offset
        if whence == 1:
            self.offset = self.offset - offset # todo check if its plus 0r minus
        if whence == 2:
            self.offset = self.length - offset
        if self.offset > self.length:
            self.offset = self.length

    def tell(self):
        return self.offset


class file_cust2():
    def __init__(self, obj):
        self.obj = obj
        self.name = '/tmp/1.txt'

    def read(self, index = None):
        if index is None:
            res = self.obj.read()
            return res
        res = self.obj.read(index)
        return res

    def fileno(self):
        res = self.obj.fileno()
        return res

    def seek(self, offset=0):
        res = self.obj.seek(offset)

    def tell(self):
        res = self.obj.tell()
        return res


class ServerUploader:

    def __init__(self, entry_directory):
        self.upload_directory = get_config('recording_uploader_server')
        self.entry_directory = entry_directory
        self.output_file = os.path.join(self.upload_directory, entry_directory, entry_directory+'_out.mp4')
        self.logger = logging.getLogger('ServerUploader')
        self.upload_token_buffer_size = get_config('upload_token_buffer_size', 'int') * 1024  # buffer is in MB
        #self.upload_token_buffer_size = 5
        self.num_of_thread = get_config('num_of_thread', 'int')
        self.q = Queue.Queue()
        self._generate_upload_thread()

    def _generate_upload_thread(self):
        for i in range(1, self.num_of_thread):
            t = Thread(target=self.worker, args=(i,))  # todo change name
            t.daemon = True  # todo check it
            t.start()


    def worker(self, index):
        self.logger.info("Thread %d is start working", index)
        while True:
            item = self.q.get()
            try:
                KalturaAPI().upload_token_upload(item)
            except IOError as e:  # todo which kind of excepotion? what to do then? verify that no more try is wrapped
                self.logger.error("Faild to upload file: %s", e.message)
            self.q.task_done()


    def upload_file_handler(self):
        while True:
            upload_file = self.input_queue.get()
            self.upload_file(upload_file)


    def upload_file(self, file_name):
        try:
            file_size = os.path.getsize(file_name)
            infile = io.open(file_name, 'rb')
            files = open(file_name, 'rb')
            chunks_to_upload = int(file_size / self.upload_token_buffer_size) + 1  # todo check buffer_size not null
            #entryId = KalturaAPI().create_entry('tesssst','stsssam')
            token_id = KalturaAPI().upload_token_add()

            for sequence_number in range(1, chunks_to_upload):
                data = infile.read(self.upload_token_buffer_size)
                chunkfilename = file_name + '_' + str(sequence_number)
                chunkf = file(chunkfilename, 'wb')
                chunkf.write(data)
                chunkf.close()
                chunkf = file(chunkfilename, 'rb')
                item = {
                    'file_name': file_name,
                    'data_stream': chunkf,
                    'sequence_number': sequence_number,
                    'chunks_to_upload': chunks_to_upload,
                    'token_id': token_id,
                    'is_last_chunk': False,
                    "resumeAt": self.upload_token_buffer_size * (sequence_number - 1)
                }
                self.q.put(item)
            data = infile.read(self.upload_token_buffer_size)  # todo check how to verify that its the last chunk

            item = {
                'file_name': file_name,
                'data_stream': file_cust(data),
                #'data_stream': files,
                #'data_stream': file_cust2(files),
                'sequence_number': chunks_to_upload,
                'chunks_to_upload': chunks_to_upload,  # The last one
                'token_id': token_id,
                'is_last_chunk': True,
                "resumeAt": self.upload_token_buffer_size * (chunks_to_upload - 1)
            }
            self.q.put(item)
            #KalturaAPI().set_media_content(entryId, token_id)
        except IOError as e:
            self.logger.error("Faild to upload file: %s", e.message)
        except Exception as e:
            self.logger.error("Faild to upload file: %s", e.message)

    def append_recording_handler(self):
        try:
            KalturaAPI().append_recording(self.output_file)
        except Exception, e:
            self.logger.error(e)


    def run(self):
        if get_config('mode') == 'ecdn':
            self.RemoteUploader()
        else:
            self.append_recording_handler()


a=ServerUploader("/tmp/")
b= a.upload_file("/tmp/1.txt")
#b= a.upload_file("/Users/ron.yadgar/Desktop/0_yo7ohrxo.0_2nijzf3v.0_2016-08-10-15.31.58.407-IDT_0.mp4")
a.worker(2)