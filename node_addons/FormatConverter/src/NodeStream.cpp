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
            std::ios_base::seek_dir dir;
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
    
    void NodeOutputStream::FreeCallback(char* data, void* hint){
        int tc = --gc_count;
        av_log(nullptr, AV_LOG_TRACE, "FreeCallback data %p total count %d", data,tc);
        NodeOutputStream *stream = reinterpret_cast<NodeOutputStream*>(hint);
        stream->unlock_shared_ptr();
    }
    
    Local<Object> NodeOutputStream::createFastBuffer(){
        
        if(m_output.size() == 0){
            return Local<Object>();
        }
        
        if(m_output.size() == m_written){
            return Local<Object>();
        }
        
        size_t toWrite = m_output.size() - m_written;
        
        Local<Buffer> slowBuffer = Buffer::New((char *)&m_output.at(0) + m_written,toWrite,FreeCallback,this);
        
        m_written += m_output.size();
        
        gc_count++;
        
        // Great. We can use this constructor function to allocate new Buffers.
        // Let's do that now. First we need to provide the correct arguments.
        // First argument is the JS object Handle for the SlowBuffer.
        // Second arg is the length of the SlowBuffer.
        // Third arg is the offset in the SlowBuffer we want the .. "Fast"Buffer to start at.
        v8::Handle<v8::Value> constructorArgs[3] = { slowBuffer->handle_,
            v8::Integer::New(toWrite),
            v8::Integer::New(0) };
        
        // Now we have our constructor, and our constructor args. Let's create the
        // damn Buffer already!
        v8::Local<v8::Object> actualBuffer = TS2MP4Convertor::bufferConstructor->NewInstance(3, constructorArgs);
        
        if(actualBuffer->IsObject()){
            lock_shared_ptr();
        }
        
        return actualBuffer;
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
        Local<Object> fileInfo = Nan::New<Object>();
        
        fileInfo->Set(String::New("startTime"),Number::New(m_fileInfo.startTimeUnixMs));
        fileInfo->Set(String::New("sig"),String::New(m_fileInfo.sig.c_str()));
        for(std::vector<MediaTrackInfo>::iterator iter = m_fileInfo.tracks.begin();
            iter != m_fileInfo.tracks.end(); iter++){
            switch(iter->mtype){
                case AVMEDIA_TYPE_VIDEO:
                case AVMEDIA_TYPE_AUDIO:
                {
                    Local<Array> vecKeyFrameDtsMsec = Array::New(iter->vecKeyFrameDtsMsec.size());
                  
                    for(uint32_t i = 0; i < vecKeyFrameDtsMsec->Length();i++){
                        vecKeyFrameDtsMsec->Set(i, Number::New(iter->vecKeyFrameDtsMsec[i]));
                    }
                    
                    Local<Object> trackInfo = Nan::New<Object>();
                    fileInfo->Set(String::New(iter->mtype == AVMEDIA_TYPE_VIDEO ? "video" : "audio"),trackInfo);
                    trackInfo->Set(String::New("duration"),Number::New(iter->durationMsec));
                    trackInfo->Set(String::New("firstDTS"),Number::New(iter->firstDtsMsec));
                    trackInfo->Set(String::New("firstEncoderDTS"),Number::New(iter->firstEncoderDtsMsec));
                    trackInfo->Set(String::New("wrapEncoderDTS"),Number::New(iter->wrapEncoderDtsMsec));
                    trackInfo->Set(String::New("keyFrameDTS"),vecKeyFrameDtsMsec);
                }
                    break;
                default:
                    break;
            };
        }
        return fileInfo;
    }
}