//
//  NodeStream.h
//  binding
//
//  Created by Igor Shevach on 3/8/16.
//
//

#ifndef binding_NodeStream_h
#define binding_NodeStream_h

#include <nan.h>
#include <MemoryStream.h>
#include <fstream>

using namespace v8;
using namespace node;

namespace converter {
    
    class InputStreamOnBuffer : public MemoryInputStream
    {
        Nan::Persistent<Object> m_buffer;
    public:
        InputStreamOnBuffer(Local<Object> b, const uint8_t *pb,size_t len)
        :MemoryInputStream(pb,len) {
            m_buffer.Reset(b);
        }
        
        ~InputStreamOnBuffer(){
            m_buffer.Reset();
        }
    };
    
    class NodeOutputStream : public StreamBase{
        
    public:
        
        std::vector<uint8_t> m_output;
        std::vector<uint8_t>::iterator m_pos;
        size_t m_written;
        std::ofstream m_ofs;
        
        NodeOutputStream();
        
        ~NodeOutputStream();
        
        virtual int Write(uint8_t *buf, int size);
        
        virtual int Read(uint8_t *buf, int size);
        
        virtual int64_t Seek(int64_t offset, int whence);
        
        MediaFileInfo m_fileInfo;
        
        virtual void EmitInfo(const MediaFileInfo &mfi);
        
        static void FreeCallback(char* data, void* hint);
        
        Local<Object> createFastBuffer();
        
        Local<Value> GetData(Isolate *isolate);
        Local<Value> GetFileInfo(Isolate *isolate);
        
    };

}

#endif
