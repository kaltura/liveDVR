//
//  NodeStream.cpp
//  binding
//
//  Created by Igor Shevach on 3/8/16.
//
//


#include "NodeStream.h"
#include "NodeFormatConverter.h"
#include <atomic>

namespace converter {
    
   
    //NodeOutputStream
    NodeOutputStream::NodeOutputStream()
    :m_written(0)
    {
        m_pos =m_output.begin();
        //m_ofs.open("/Users/igors/Documents/out.ts");
    }
    
    NodeOutputStream::~NodeOutputStream()
    {
        if(m_ofs.is_open()){
            m_ofs.close();
        }
    }
    
    int NodeOutputStream::Write(uint8_t *buf, int size) {
        if(m_ofs.is_open()){
            m_ofs.write((const char*)buf,size);
        }
        if(m_pos == m_output.end()){
            //m_output.reserve(NextPow2::next(m_output.size()));
            m_output.insert(m_pos, buf, buf + size);
            m_pos = m_output.end();
        } else {
            std::copy(buf, buf + size,m_pos);
        }
        
        return size;
    }
    
    int NodeOutputStream::Read(uint8_t *buf, int size) {
        return -1;
    }
    
    int64_t NodeOutputStream::Seek(int64_t offset, int whence) {
        if(m_ofs.is_open()){
            std::ios_base::seekdir dir;
            switch(whence)
            {
                case SEEK_SET:
                    dir = std::ios_base::beg;
                    break;
                case SEEK_END:
                    dir = std::ios_base::end;
                    break;
                case SEEK_CUR:
                   dir = std::ios_base::cur;
                    break;
                    
            };
            m_ofs.seekp(offset,dir);
        }
        switch(whence)
        {
            case SEEK_SET:
                m_pos = m_output.begin() + offset;
                break;
            case SEEK_END:
                m_pos = m_output.end() - offset;
                break;
            case SEEK_CUR:
                m_pos += offset;
                break;
                
        };
        if(m_pos < m_output.begin())
            m_pos = m_output.begin();
        if(m_pos > m_output.end() )
            m_pos =  m_output.end();
        return  m_pos - m_output.begin();
    }
    
    
    void NodeOutputStream::EmitInfo(const MediaFileInfo &mfi)
    {
        m_fileInfo  = mfi;
    }
    
    std::atomic_int gc_count(0);
    
    void NodeOutputStream::FreeCallback(char* data, void* hint) {
        int tc = --gc_count;
        av_log(nullptr, AV_LOG_TRACE, "FreeCallback data %p total count %d", data,tc);
        NodeOutputStream *stream = reinterpret_cast<NodeOutputStream*>(hint);
        stream->unlock_shared_ptr();
    }
    
    Local<Object> NodeOutputStream::createFastBuffer() {
        Isolate* isolate = v8::Isolate::GetCurrent();
        if(m_output.size() == 0){
            return Local<Object>();
        }
        
        if(m_output.size() == m_written){
            return Local<Object>();
        }
        
        size_t toWrite = m_output.size() - m_written;
        
        MaybeLocal<Object> slowBuffer = node::Buffer::New(isolate, (char *)&m_output.at(0) + m_written, toWrite, FreeCallback, this);
        
        m_written += m_output.size();
        
        gc_count++;
        
        Local<Object> retval = slowBuffer.ToLocalChecked();
        
        if(retval->IsObject()){
            // FreeCallback is provided to unlock shared ptr.
            lock_shared_ptr();
        }
        
        return retval;
    }
    
    Local<Value> NodeOutputStream::GetData(Isolate *isolate)
    {
        Local<Value> arrayBuffer;
        if(m_written < m_output.size()) {
            arrayBuffer = createFastBuffer();
        } else {
            arrayBuffer =   Nan::Null();
        }
        return arrayBuffer;
    }
    
    Local<Value> NodeOutputStream::GetFileInfo(Isolate *isolate){
        
        std::ostringstream ostr;
        m_fileInfo.bSerializeMetaData = true;
        ostr << m_fileInfo;
        const std::string &str = ostr.str();
        return JSON::Parse(isolate,String::NewFromUtf8(isolate,str.c_str())).ToLocalChecked();
    }
}