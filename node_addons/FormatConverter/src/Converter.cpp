//
//  Converter.cpp
//  FormatConverter
//
//  Created by Igor Shevach on 2/29/16.
//  Copyright (c) 2016 Igor Shevach. All rights reserved.
//

#include "Converter.h"

extern "C"{
#include <libavformat/movenc.h>
    
    
    //invalid suffix on literal C++11 requires...
    // thus, some code is replicated
    //#include <libavutil/timestamp.h>
#define AV_TS_MAX_STRING_SIZE 32
    
#ifndef PRId64
#define PRId64 "ld"
#endif
    
    typedef char ts_buf[AV_TS_MAX_STRING_SIZE];
    /**
     * Fill the provided buffer with a string containing a timestamp
     * representation.
     *
     * @param buf a buffer with size in bytes of at least AV_TS_MAX_STRING_SIZE
     * @param ts the timestamp to represent
     * @return the buffer in input
     */
    static inline char *av_ts_make_string(char *buf, int64_t ts)
    {
        if (ts == AV_NOPTS_VALUE) snprintf(buf, AV_TS_MAX_STRING_SIZE, "NOPTS");
        else                      snprintf(buf, AV_TS_MAX_STRING_SIZE, "%" PRId64, ts);
        return buf;
    }
    
    
    /**
     * Fill the provided buffer with a string containing a timestamp time
     * representation.
     *
     * @param buf a buffer with size in bytes of at least AV_TS_MAX_STRING_SIZE
     * @param ts the timestamp to represent
     * @param tb the timebase of the timestamp
     * @return the buffer in input
     */
    static inline char *av_ts_make_time_string(char *buf, int64_t ts, AVRational *tb)
    {
        if (ts == AV_NOPTS_VALUE) snprintf(buf, AV_TS_MAX_STRING_SIZE, "NOPTS");
        else                      snprintf(buf, AV_TS_MAX_STRING_SIZE, "%.6g", av_q2d(*tb) * ts);
        return buf;
    }
    
    inline void log_packet(const AVFormatContext *fmt_ctx, const AVPacket *pkt, const char *tag,int avlog_level = AV_LOG_TRACE)
    {
        AVRational *time_base = &fmt_ctx->streams[pkt->stream_index]->time_base;
        ts_buf a,b,c,d,e,f;
        
        av_log(nullptr,avlog_level,"stm:%d sz:%d (pts-dts)={%s,%s} (pts_time:%s dts_time:%s) duration:%s duration_time:%s stream_index:%d pkt_flags:%x\n",
               pkt->stream_index,
               pkt->size,
               av_ts_make_string(a,pkt->pts), av_ts_make_string(c,pkt->dts),av_ts_make_time_string(b,pkt->pts, time_base),
                av_ts_make_time_string(d,pkt->dts, time_base),
               av_ts_make_string(e,pkt->duration), av_ts_make_time_string(f,pkt->duration, time_base),
               pkt->stream_index,
               pkt->flags);
        
    }
}

namespace converter{
    
   
    
    ConverterAppInst appInst;
    
    ConverterAppInst &ConverterAppInst::instance(){
        return appInst;
    }
    
    ConverterAppInst::ConverterAppInst()
    :STREAM_BUFFER_SIZE(1024*4),
    INPUT_FORMAT("mpegts"),
    OUTPUT_FORMAT("mp4")
    {}
    
    int ConverterAppInst::init(int logLevel){
        av_log_set_level(logLevel);
        av_register_all();
        return 0;
    }
    
    
    Converter::Converter()
    :m_creationTime(0),
    m_hash(nullptr),
    m_minStartDTSMsec(0),
    m_bDataPending(true),
    state(CLOSED)
    {}
    
    Converter::~Converter(){
        close();
        if(m_hash){
            av_free(m_hash);
        }
    }
    
    double Converter::dts2msec(const int64_t&val,const AVRational &timebase){
        
        return val /(double)timebase.den * TIMESTAMP_RESOLUTION * timebase.num;
    }
    
    int Converter::checkForStreams(){
        
        if(!input->nb_streams){
            _S(input.checkStreams());
            if(!input->nb_streams){
                return m_bDataPending ? 0 : -1;
            }
        }
        
        _S(avformat_find_stream_info(*input,NULL));
        
        
        for( size_t i = 0 ; i < input->nb_streams; i++){
            AVStream *in_stream =input->streams[i];
            switch(in_stream->codec->codec_type){
                case AVMEDIA_TYPE_VIDEO:
                    if(in_stream->codec->width == 0 )
                        return m_bDataPending ? 0 : -1;
                    break;
                case AVMEDIA_TYPE_AUDIO:
                    if(in_stream->codec->channels == 0 )
                        return m_bDataPending ? 0 : -1;
                    break;
                default:
                    break;
            };
        }
        
        output->max_interleave_delta = 100;
        
        m_streamMapper.resize(input->nb_streams);
  
        m_minStartDTSMsec = std::numeric_limits<int64_t>::max();
        
        for( size_t i = 0 , output_stream = 0; i < input->nb_streams; i++){
            
            AVStream *in_stream =input->streams[i];
            
            int64_t stmStartTimeMs = av_rescale(in_stream->start_time,1000 * in_stream->time_base.num,in_stream->time_base.den);
            
            m_minStartDTSMsec = std::min(m_minStartDTSMsec,stmStartTimeMs);
            
            if(in_stream->codec->codec_id == AV_CODEC_ID_TIMED_ID3)
                continue;
            
            AVStream *out_stream = avformat_new_stream(*output, in_stream->codec->codec);
            
            m_streamMapper[i] = output_stream++;
            
            m_extraTrackInfo.push_back(ExtraTrackInfo(dts2msec(in_stream->start_time,in_stream->time_base)));
            
            _S(avcodec_copy_context(out_stream->codec, in_stream->codec));
            
            out_stream->time_base           = in_stream->time_base;
            out_stream->sample_aspect_ratio = in_stream->sample_aspect_ratio;
            
            out_stream->codec->codec_tag = 0;
            if (output->oformat->flags & AVFMT_GLOBALHEADER) {
                out_stream->codec->flags |= AV_CODEC_FLAG_GLOBAL_HEADER;
            }
            switch(out_stream->codec->codec_type){
                case AVMEDIA_TYPE_AUDIO:
                    if(out_stream->codec->codec_id == AV_CODEC_ID_AAC){
                        _S(ff_stream_add_bitstream_filter(out_stream, "aac_adtstoasc", NULL));
                    }
                    break;
                default:
                    break;
            }
        }
        
        AVDictionary *opts = nullptr;

        _S(av_dict_set(&opts, "use_editlist", "0", 0));
        std::unique_ptr<AVDictionary> optsptr(opts);
        _S(avformat_write_header(*output, &opts));
        optsptr.release();
        
        state = PUSHING;
        
        _S(pushData());
        
        return 0;
    }
    
    inline void updateLastTimestamp(int64_t &lastValue,int64_t &timestamp,AVRational &tbIn,AVRational &tbOut){
        
        if(AV_NOPTS_VALUE == timestamp && AV_NOPTS_VALUE != lastValue){
            timestamp = lastValue+1;
        } else {
            timestamp = av_rescale_q_rnd(timestamp, tbIn, tbOut, (AVRounding)(AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX));
        }
        if(AV_NOPTS_VALUE != lastValue && lastValue == timestamp){
            timestamp++;
        }
        lastValue = timestamp;
    }
    
    int Converter::pushData(){
        
        while(true){
            
            AVPacket pkt;
            if( av_read_frame(*input,&pkt) < 0 ){
                av_log(*input,AV_LOG_TRACE,"no more frames");
                break;
            }
            
            av_md5_update(m_hash, (const uint8_t *)&pkt.pts, sizeof(pkt.pts));
            
            AVStream *in_stream  = input->streams[pkt.stream_index];
            
            if(in_stream->codec->codec_id == AV_CODEC_ID_TIMED_ID3){
                if( m_creationTime ==0 ){
                    m_creationTime = extractUnixTimeMsecFromId3Tag(pkt.data,pkt.size);
                    if(m_creationTime > 0){
                        av_log(*input,AV_LOG_TRACE,"Converter::pushData. parsed id3 time %lld stream start time %lld pts %lld",
                               m_creationTime, in_stream->start_time,pkt.pts);

                        m_creationTime -= av_rescale(pkt.pts,TIMESTAMP_RESOLUTION * in_stream->time_base.num,
                                                     in_stream->time_base.den) - m_minStartDTSMsec;

                        // hack for mp4
                        MOVMuxContext *mov = reinterpret_cast<MOVMuxContext*>(output->priv_data);
                        mov->time = m_creationTime / 1000 + 0x7C25B080; // 1970 based -> 1904 based
                    }
                }
            } else {
                
                pkt.stream_index = m_streamMapper[pkt.stream_index];
                
                AVStream *out_stream = output->streams[pkt.stream_index];
                
                ExtraTrackInfo &xtra = m_extraTrackInfo[pkt.stream_index];
                
                if(AVMEDIA_TYPE_VIDEO == out_stream->codec->codec_type && (pkt.flags & AV_PKT_FLAG_KEY)){
                    xtra.addKeyFrame(dts2msec(pkt.pts,in_stream->time_base));
                }
                
                /* copy packet */
                
                //log_packet(*input, &pkt, "in",AV_LOG_FATAL);
          
                xtra.maxDTS = pkt.pts + pkt.duration;
                
                updateLastTimestamp(xtra.lastPTS, pkt.pts,in_stream->time_base,out_stream->time_base);
                
                updateLastTimestamp(xtra.lastDTS, pkt.dts,in_stream->time_base,out_stream->time_base);
                
                pkt.duration = av_rescale_q(pkt.duration, in_stream->time_base, out_stream->time_base);
                pkt.pos = -1;

       
                log_packet(*input, &pkt, "in");
                
                _S(av_interleaved_write_frame(*output, &pkt));
            }
            
            av_packet_unref(&pkt);
        }
        return 0;
    }
    
    
    
    
    int Converter::init(std::shared_ptr<StreamBase> inputStream, std::shared_ptr<StreamBase> outputStream){
        
        state = INIT;
        
        _S( input.init(ConverterAppInst::instance().INPUT_FORMAT,inputStream ));
        _S( output.init(ConverterAppInst::instance().OUTPUT_FORMAT,
                        ConverterAppInst::instance().STREAM_BUFFER_SIZE,outputStream ));
        m_hash = av_md5_alloc();
        if(m_hash) {
            av_md5_init(m_hash);
        }
        state = CREATING;
        return 0;
    }
    
    int Converter::onData(bool bEOS){
        m_bDataPending = bEOS == false;
        switch(state){
            case CREATING:
                if(checkForStreams()){
                    state = ERROR;
                }
                break;
            case PUSHING:
                if(pushData()) {
                    state = ERROR;
                }
                break;
            default:
                break;
        };
        
        return state == ERROR ? -1 : 0;
        
    }
    
    
    void Converter::close(){
        
        if(state == PUSHING){
            
            state = CLOSING;
            
            MediaFileInfo mfi;
            
            if(m_hash){
                uint8_t md5val[16];
                av_md5_final(m_hash, md5val);
                
                mfi.sig.resize(sizeof(md5val) * 2 + 1);
                const std::string map("0123456789ABCDEF");
                
                for( size_t i = 0; i < mfi.sig.length(); ){
                    uint8_t val = md5val[i/2];
                    mfi.sig[i++] = map[val>>4];
                    mfi.sig[i++] = map[val & 0xf];
                }
                mfi.sig[mfi.sig.length()-1] = 0;
            }
            for(size_t i = 0; i < input->nb_streams;i++)
            {
                AVStream *stream = this->input->streams[i];
                
                switch(stream->codec->codec_type){
                    case AVMEDIA_TYPE_VIDEO:
                    case AVMEDIA_TYPE_AUDIO:
                    {
                       
                      
                        double wrapDTS = ::ceil(dts2msec(1ULL << stream->pts_wrap_bits,stream->time_base));
                        ExtraTrackInfo &extraInfo = this->m_extraTrackInfo[this->m_streamMapper[i]];
                        double duration = dts2msec(extraInfo.maxDTS - stream->start_time,stream->time_base);

                        mfi.tracks.push_back({ this->m_creationTime + extraInfo.startDTS - m_minStartDTSMsec,
                            extraInfo.startDTS,
                            wrapDTS,
                            duration,
                            extraInfo.vecKeyFrameDTS,
                            stream->codec->codec_type
                        });
                    }
                        break;
                    default:
                        break;
                };
            }
            output.Close();
            assert(mfi.tracks.size() > 0);
            mfi.startTimeUnixMs = this->m_creationTime;
            output.EmitInfo(mfi);
            input.Close();
            state = CLOSED;
        }
    }
};