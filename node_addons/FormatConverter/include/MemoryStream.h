//
//  MemoryStream.h
//  binding
//
//  Created by Igor Shevach on 3/2/16.
//
//

#ifndef binding_MemoryStream_h
#define binding_MemoryStream_h

#include "Stream.h"
extern "C"{
#include <libavformat/avio.h>
}

namespace converter{
    
    class MemoryInputStream : public StreamBase{
        const uint8_t *m_buf,*m_last;
        size_t         m_length;
    protected:
        void initData(const uint8_t *pb,size_t len){
            m_buf = pb;
            m_length = len;
        }
    public:
        MemoryInputStream(const uint8_t *pb = nullptr,size_t len = 0)
        :m_buf(pb),
        m_length(len)
        {
            m_last = m_buf;
        }
        
        size_t get_length() const {
            return m_length;
        }
        
        virtual int Write(uint8_t *buf, int size) {
            return -1;
        }
        virtual int Read(uint8_t *buf, int size) {
            //av_log(nullptr,AV_LOG_TRACE,"MemoryInputStream::Read(%p,%d)",buf,size);
            size_t avail = std::min(get_length() - (m_last - m_buf),(size_t)size);
            if(avail > 0){
                std::copy(m_last,m_last+avail,buf);
                m_last += avail;
            }
            av_log(nullptr,AV_LOG_TRACE,"MemoryInputStream::Read(%p,%d) available %zu",buf,size,avail);
            return avail;
        }
        virtual int64_t Seek(int64_t offset, int whence) {
            
            switch(whence)
            {
                case SEEK_SET:
                    m_last = m_buf + offset;
                    break;
                case SEEK_END:
                    m_last = m_buf + get_length() - offset;
                    break;
                case SEEK_CUR:
                    m_last += offset;
                    break;
                case AVSEEK_SIZE:
                    return get_length();
                    break;
            };
            if(m_last < m_buf)
                m_last = m_buf;
            if(m_last > m_buf + get_length())
                m_last =  m_buf + get_length();
            
            av_log(nullptr,AV_LOG_TRACE,"MemoryInputStream::Seek(%lld,%d). total len: %zu pos: %ld",offset,whence,get_length(),m_last - m_buf);
            
            return m_last - m_buf;
        }
        
    };
    
};
#endif
