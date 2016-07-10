//
//  main.c
//  mpegts-mp4-converter
//
//  Created by Igor Shevach on 2/25/16.
//  Copyright (c) 2016 Igor Shevach. All rights reserved.
//

#include "Utils.h"
#include "AVFormat.h"
#include "FileStream.h"
#include "Converter.h"
using namespace converter;


class CPushStream : public StreamBase{
    
    std::shared_ptr<StreamBase> m_stream;
    Converter &m_conv;
    std::vector<uint8_t> m_pushbuf;
    std::vector<uint8_t>::iterator m_pos,m_end;
    
    virtual int Write(uint8_t *buf, int size){ return -1;}
    virtual int Read(uint8_t *buf, int size) {
     //   return m_stream->Read(buf,size );
        std::vector<uint8_t>::difference_type n = m_end - m_pos;
        std::vector<uint8_t>::difference_type available = std::min(m_end - m_pos,(std::vector<uint8_t>::difference_type )size);
        std::copy(m_pos, m_pos+available, buf);
        m_pos += available;
        return available;
    }
    virtual int64_t Seek(int64_t offset, int whence) {
       
        int64_t retVal = m_stream->Seek(offset,whence);
        internalRead();
        return retVal;
    }
    
    int internalRead(){
        m_end = m_pos = m_pushbuf.end();
        std::vector<uint8_t>::difference_type n = m_stream->Read(&m_pushbuf.at(0),m_pushbuf.size() );
        if( n > 0 ){
            m_pos = m_pushbuf.begin();
            m_end = m_pos + n;
        }
        return n;
    }
    
public:
    CPushStream(std::shared_ptr<StreamBase> stream,Converter &conv)
        :m_stream(stream),
        m_conv(conv)
    {
        m_pushbuf.resize(1024 * 1024);
        m_pos = m_end = m_pushbuf.end();
    }
  
   
    void run(){
        while(true){
            if( m_pos == m_end ){
                internalRead();
            }
            m_conv.onData();
        }
    }

};

bool g_done = false;
void handle_siginint(int){
    g_done = true;
}

int main(int argc, const char * argv[]) {
    
    _S(ConverterAppInst::instance().init());
    
    signal(SIGINT, handle_siginint);
   
   // while(!g_done){
        
    std::shared_ptr<FileStream> inputStream( new FileStream() ),outputStream( new FileStream() );
    
    std::string inputFileName  (argv[1]);
    _S(inputStream->open(inputFileName,"r"));
    _S(outputStream->open(inputFileName + ".mp4","w"));
    
    Converter conv;
    
    std::shared_ptr<CPushStream> ps( new CPushStream(std::static_pointer_cast<StreamBase>(inputStream),conv) );
    
    _S(conv.init(std::static_pointer_cast<StreamBase>(inputStream),
                 std::static_pointer_cast<StreamBase>(outputStream) ));
   
   // ps->run();
    conv.onData();
   // }
    // insert code here...
    printf("exiting...\n");
    return 0;
}
