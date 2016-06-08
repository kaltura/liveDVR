//
//  AVFormat.h
//  FormatConverter
//
//  Created by Igor Shevach on 2/29/16.
//  Copyright (c) 2016 Igor Shevach. All rights reserved.
//

#ifndef FormatConverter_AVFormat_h
#define FormatConverter_AVFormat_h



extern "C" {
#include <libavutil/mathematics.h>
#include <libavformat/avformat.h>
#include <libavformat/internal.h>
#include <libavutil/md5.h>
}
#include <string>
#include "Stream.h"
#include "Utils.h"


namespace converter{
    
    class CFtCtx {
        
        CFtCtx(const CFtCtx&);
        void operator=(const CFtCtx&);
        
    protected:
        AVFormatContext *m_pCtx;
        std::shared_ptr<StreamBase> m_stream;
        
        static int stream_write(void *opaque, uint8_t *buf, int size)
        {
            return reinterpret_cast<StreamBase*>(opaque)->Write(buf,size);
        }
        
        static int64_t stream_seek(void *opaque, int64_t offset, int whence)
        {
            return reinterpret_cast<StreamBase*>(opaque)->Seek(offset,whence);
        }
        
        static int stream_read(void *opaque, uint8_t *buf, int size){
            
            return reinterpret_cast<StreamBase*>(opaque)->Read(buf,size);
        }
   
    public:
        
        CFtCtx(AVFormatContext *pCtx = NULL)
        :m_pCtx(pCtx)
        {}
        
        AVFormatContext *operator->(){
            return m_pCtx;
        }
        
        AVFormatContext *operator *(){
            return m_pCtx;
        }
        
        AVFormatContext **operator &(){
            return &m_pCtx;
        }
        
        int Dispose();
        
        virtual ~CFtCtx(){
            Dispose();
        }
        
        void  EmitInfo(const MediaFileInfo &mfi)
        {
            if(m_stream){
                m_stream->EmitInfo(mfi);
            }
        }
        
        std::shared_ptr<StreamBase> GetStream() const {
            return m_stream;
        }
    };
    
    class CInputCtx : public CFtCtx{
        AVInputFormat *m_format;
    public:
        
        int checkStreams();
        
        int init(const std::string &type,std::shared_ptr<StreamBase> stream);
        
        int Close();
        
        ~CInputCtx();
    };
    
    class COutputCtx : public CFtCtx
    {
    public:
        int init(const std::string &type,size_t bufSize,std::shared_ptr<StreamBase> stream);
        
        int Close();
        
        ~COutputCtx();
    };
    
    
    
};


#endif
