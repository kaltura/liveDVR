//
//  AVFormat.cpp
//  FormatConverter
//
//  Created by Igor Shevach on 3/1/16.
//  Copyright (c) 2016 Igor Shevach. All rights reserved.
//

#include "AVFormat.h"

namespace converter{
       
    int CFtCtx::Dispose(){
        av_log(m_pCtx,AV_LOG_INFO,"CFtCtx::Dispose %p", m_pCtx);
        if(m_pCtx){
            if(m_pCtx->pb){
                av_freep(&m_pCtx->pb->buffer);
                av_free(m_pCtx->pb);
            }
            avformat_free_context(m_pCtx);
            m_pCtx = nullptr;
        }
        return 0;
    }
    
    int CInputCtx::checkStreams(){
        
        if(m_pCtx->nb_streams != 0)
            return 0;
        
        _S(avformat_open_input(&m_pCtx,NULL,m_format,NULL));
        return 0;
    }
    
    int CInputCtx::init(const std::string &type,std::shared_ptr<StreamBase> stream){
        
        if(m_pCtx){
            av_log(m_pCtx,AV_LOG_WARNING,"CInputCtx::init. already initialized!");
            return -1;
        }
        
        m_format = av_find_input_format(type.c_str());
        
        _PTR(m_format);
        
        m_pCtx = avformat_alloc_context();
        
        _PTR(m_pCtx);
        
        size_t bufSz = 512;
        unsigned char *iobuf = (unsigned char *)av_malloc(bufSz);
        _PTR(iobuf );
        
        m_pCtx->pb = avio_alloc_context(iobuf,bufSz, 0, stream.get(), stream_read, NULL, stream_seek);
        
        _PTR(m_pCtx->pb);
        
        av_log(m_pCtx,AV_LOG_INFO,"CInputCtx::init %p", m_pCtx);
        
        m_stream = stream;
        
        return  0;
    }
    
    int CInputCtx::Close(){
        av_log(m_pCtx,AV_LOG_INFO,"CInputCtx::Close %p", m_pCtx);
        if(m_pCtx){
            if(m_pCtx->pb){
                av_freep(&m_pCtx->pb->buffer);
                av_free(m_pCtx->pb);
            }
            avformat_close_input(&m_pCtx);
        }
        m_stream.reset();
        return 0;
    }
    
    CInputCtx::~CInputCtx(){
        av_log(m_pCtx,AV_LOG_INFO,"CInputCtx::~CInputCtx %p", m_pCtx);
        Close();
    }
    
    
    int COutputCtx::init(const std::string &type,size_t bufSize,std::shared_ptr<StreamBase> stream){
        
        if(m_pCtx){
            av_log(m_pCtx,AV_LOG_WARNING,"CInputCtx::init. already initialized!");
            return -1;
        }
        
        _S(avformat_alloc_output_context2(&m_pCtx,NULL,type.c_str(),NULL));
        
        unsigned char *iobuf = (unsigned char *)av_malloc(bufSize);
        _PTR(iobuf );
        m_stream = stream;
        _PTR(m_pCtx->pb = avio_alloc_context(iobuf, bufSize, AVIO_FLAG_WRITE,
                                             stream.get(), NULL, stream_write, stream_seek));
        av_log(m_pCtx,AV_LOG_INFO,"COutputCtx::init %p", m_pCtx);
        return 0;
    }
    
    int COutputCtx::Close(){
        if(m_pCtx && m_pCtx->pb){
            av_write_frame(m_pCtx, NULL);
            av_write_trailer(m_pCtx);
            for(unsigned int i =0; i < m_pCtx->nb_streams; i++){
                AVStream *st = m_pCtx->streams[i];
                if(st){
                    av_bitstream_filter_close(st->internal->bsfc);
                }
            }
            Dispose();
        }
        return 0;
    }
    
    
    COutputCtx::~COutputCtx(){
        av_log(m_pCtx,AV_LOG_INFO," COutputCtx::~COutputCtx %p", m_pCtx);
    }
    
};