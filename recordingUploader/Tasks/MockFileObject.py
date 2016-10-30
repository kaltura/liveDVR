class MockFileObject:
    def __init__(self, file_name, _buffer):
        self.length = len(_buffer)
        self.buffer = _buffer
        self.name = file_name
        self.offset = 0

    def read(self, index=-1):
        if index < 0:
            result = self.buffer[self.offset:]
            self.offset = self.length
            return result
        result = self.buffer[self.offset:self.offset+index]
        self.offset += index
        if self.offset > self.length:
            self.offset = self.length
        return result

    def seek(self, offset, whence = 0):
        if whence == 0:
            self.offset = offset
        if whence == 1:
            self.offset = self.offset - offset
        if whence == 2:
            self.offset = self.length - offset
        if self.offset > self.length:
            self.offset = self.length

    def tell(self):
        return self.offset
