//
//  FileStream.h
//  FormatConverter
//
//  Created by Igor Shevach on 2/29/16.
//  Copyright (c) 2016 Igor Shevach. All rights reserved.
//

#ifndef FormatConverter_FileStream_h
#define FormatConverter_FileStream_h

#include "Stream.h"

namespace converter{
    
    
    
    class  FileStream : public StreamBase {
    protected:
        FILE *m_fp;
        
        void close(){
            
            if(m_fp){
                fclose(m_fp);
                m_fp = NULL;
            }
        }
        
    public:
        
        FileStream()
        :m_fp(NULL)
        {}
        
        ~FileStream()
        {
            close();
        }
        
        int open(const std::string &path, const std::string &mode){
            close();
            m_fp = fopen(path.c_str(),mode.c_str());
            return m_fp ? 0 : -1;
        }
        
        virtual int Write(uint8_t *buf, int size) {
            return m_fp ? fwrite(buf,1,size,m_fp) : 0;
        }
        virtual int Read(uint8_t *buf, int size){
            return m_fp ? fread(buf,1,size,m_fp) : 0;
        }
        virtual int64_t Seek(int64_t offset, int whence) {
            return m_fp ? fseek(m_fp,offset,whence) : 0;
        }
    };
    
};

#endif
