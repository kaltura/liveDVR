//
//  Converter.cpp
//  FormatConverter
//
//  Created by Igor Shevach on 2/29/16.
//  Copyright (c) 2016 Igor Shevach. All rights reserved.
//

#include "Converter.h"
#include <bitset>
#include <set>
#include <chrono>
#include <sstream>

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
        ts_buf a,b,c,d,e,f,h;
        
        av_log(nullptr,avlog_level,"stm:%d sz:%d (pts-dts)={%s,%s,%s} (pts_time:%s dts_time:%s) duration:%s duration_time:%s stream_index:%d pkt_flags:%x\n",
               pkt->stream_index,
               pkt->size,
               av_ts_make_string(a,pkt->pts),
               av_ts_make_string(c,pkt->dts),
                av_ts_make_string(h,pkt->pts-pkt->dts),
               av_ts_make_time_string(b,pkt->pts, time_base),
               av_ts_make_time_string(d,pkt->dts, time_base),
               av_ts_make_string(e,pkt->duration), av_ts_make_time_string(f,pkt->duration, time_base),
               pkt->stream_index,
               pkt->flags);
        
    }
};

namespace converter{
  
    void AvLogFilter::addFilter(const char *s){
        m_patterns.insert(s);
    }
    
    bool AvLogFilter::filter(const char * szFmt) {
        if(m_patterns.size()){
            if(m_cached.find(szFmt) != m_cached.end()){
                return false;
            }
            if(m_patterns.find(szFmt) != m_patterns.end()){
                m_cached.insert(szFmt);
                return false;
            }
        }
        return true;
    }
    
    
    ConverterAppInst appInst;
    
    ConverterAppInst &ConverterAppInst::instance(){
        return appInst;
    }
    
    ConverterAppInst::ConverterAppInst()
    :STREAM_BUFFER_SIZE(1024*4),
    INPUT_FORMAT("mpegts"),
    OUTPUT_FORMAT("mp4"),
    m_bStrict(true)
    {}
    
    int ConverterAppInst::init(int logLevel){
        av_log_set_level(logLevel);
        av_register_all();
        if(logLevel <= AV_LOG_WARNING){
            m_filter.addFilter("Not writing any edit list");
            av_log_set_callback(avlog_cb);
        }
        return 0;
    }

    const char szDateTimeormat [] = "%F %T %z"; 
    void ConverterAppInst::avlog_cb(void *data, int level, const char * szFmt, va_list varg){
        if(level > av_log_get_level()){
            return;
        }
        if(!ConverterAppInst::instance().m_filter.filter(szFmt)){
            return;
        }
        //include date-time
        std::time_t t = std::time(nullptr);
        std::gmtime(&t);
        std::tm *tm = std::gmtime(&t);
        char szDateTime[sizeof("2016-08-15 08:45:07 +0200\0")];
        
        std::strftime(szDateTime,sizeof(szDateTime),szDateTimeormat,tm);
        std::string formatDateTime(szDateTime);
        formatDateTime += std::string(" ") + szFmt;
        av_log_default_callback(data,level,formatDateTime.c_str(),varg);
    }
    
    
    Converter::Converter()
    :m_creationTime(0),
    m_hash(nullptr),
    m_minStartDTSMsec(0),
    m_bDataPending(true),
    m_totalBitrate(0),
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
    
    int64_t getStreamStartTime(const AVStream *stream){
        switch(stream->codec->codec_type){
        case AVMEDIA_TYPE_VIDEO:
        case AVMEDIA_TYPE_AUDIO:
            return stream->first_dts;
        default:
            return stream->start_time;
        };
    }

    void clipUnrealisticPTS(AVStream *stream){
        
        const AVRational &frame_rate = (stream->r_frame_rate.den > 0 && stream->r_frame_rate.num > 0) ? stream->r_frame_rate : stream->avg_frame_rate;
        //stream->r_frame_rate
        if( stream->first_dts != AV_NOPTS_VALUE && stream->first_dts != stream->start_time && frame_rate.den > 0 && frame_rate.num > 0 ) {
            uint64_t diff = dtsUtils::diff(stream,stream->start_time , stream->first_dts, false ) ,
            threshold = dtsUtils::to_dts(stream,10000);
            
            if( diff > threshold ){
                av_log(nullptr,AV_LOG_WARNING,"pts to dts diff is too big (pts=%lld - dts=%llu > threshold=%llu) for stream %d\n", stream->start_time, stream->first_dts, threshold, stream->index );
                stream->start_time = stream->first_dts;
            }
        }
    }

    int Converter::checkForStreams(){
        
        if(!input->nb_streams){
            _S(input.checkStreams());
            if(!input->nb_streams){
                return m_bDataPending ? 0 : -1;
            }
        }
        
        // surpress av warning on id3 tag stream: start time for stream %d is not set in estimate_timings_from_pts
        std::bitset<32> markedStreamsSet;
        for( size_t i = 0 ; i < input->nb_streams; i++){
             AVStream *in_stream =input->streams[i];
            if(in_stream->codec->codec_type == AVMEDIA_TYPE_DATA && in_stream->start_time == AV_NOPTS_VALUE){
                in_stream->codec->codec_type = AVMEDIA_TYPE_UNKNOWN;
                markedStreamsSet.set(i,true);
            }
        }
        
        int status =  avformat_find_stream_info(*input,NULL);
        
        if( status < 0 && (ConverterAppInst::instance().m_bStrict || input->nb_streams == 0)){
            av_log(nullptr,AV_LOG_WARNING,"%s (%d) failed to parse stream info\n",__FILE__,__LINE__);
            return -1;
        }
        
        for( size_t i = 0 ; i < input->nb_streams; i++){
            AVStream *in_stream =input->streams[i];
            switch(in_stream->codec->codec_type){
                case AVMEDIA_TYPE_UNKNOWN:
                    if(markedStreamsSet[i]){
                        in_stream->codec->codec_type = AVMEDIA_TYPE_DATA;
                    }
                    break;
                default:
                    break;
            };
        }
        
        output->max_interleave_delta = 100;
        
        m_streamMapper.resize(input->nb_streams);
  
        m_minStartDTSMsec = std::numeric_limits<int64_t>::max();
        
        //ffmpeg can shorten firt sample provided it's dts < pts
        //it provides, however, means of overriding mechanism of mapping input dts on the output one.
        output->output_ts_offset = dtsUtils::INVALID_VALUE;
        output->avoid_negative_ts = 0;
        
        for( size_t i = 0 , output_stream = 0; i < input->nb_streams; i++){
            
            std::vector<std::string> errors;
            
            AVStream *in_stream =input->streams[i];
            
            // check for streams with unrealistic delay
            clipUnrealisticPTS(in_stream);
            
            m_minStartDTSMsec = dtsUtils::min(m_minStartDTSMsec,in_stream);

            if(in_stream->codec->codec_id == AV_CODEC_ID_TIMED_ID3)
                continue;
            
            bool bValidStream = true;
            switch(in_stream->codec->codec_type){
                case AVMEDIA_TYPE_VIDEO:
                    bValidStream = in_stream->codec->width > 0;
                    break;
                case AVMEDIA_TYPE_AUDIO:
                    bValidStream = in_stream->codec->channels > 0;
                    break;
                default:
                    break;
            };
            
            if(!bValidStream){
                 av_log(nullptr,AV_LOG_WARNING,"%s (%d) skipping stream %lu\n",__FILE__,__LINE__,i);
                continue;
            }

            
            // remember min dts offset. it will be subtracted by ffmpeg from dts/pts values before muxing
            output->output_ts_offset = std::max(output->output_ts_offset,av_rescale_q(-in_stream->first_dts, in_stream->time_base,AV_TIME_BASE_Q));
            
            AVStream *out_stream = avformat_new_stream(*output, in_stream->codec->codec);
            
            m_streamMapper[i] = output_stream++;
            
            m_extraTrackInfo.push_back(ExtraTrackInfo(dts2msec(getStreamStartTime(in_stream),in_stream->time_base),errors));
            
            _S(avcodec_copy_context(out_stream->codec, in_stream->codec));
            
            out_stream->time_base           = in_stream->time_base;
            out_stream->sample_aspect_ratio = in_stream->sample_aspect_ratio;
            
            out_stream->codec->codec_tag = 0;
            if (output->oformat->flags & AVFMT_GLOBALHEADER) {
                out_stream->codec->flags |= AV_CODEC_FLAG_GLOBAL_HEADER;
            }
            output->oformat->flags |= AVFMT_TS_NONSTRICT;
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
    
    inline void updateLastTimestamp(int64_t &lastValue,int64_t &timestamp,bool bStrictTimestamps){
        
        if(AV_NOPTS_VALUE == timestamp && AV_NOPTS_VALUE != lastValue){
            timestamp = lastValue;
            if(bStrictTimestamps){
                timestamp++;
            }
        }
        if(AV_NOPTS_VALUE != lastValue) {
            timestamp = std::max(lastValue,timestamp);
            if(lastValue == timestamp && bStrictTimestamps){
                timestamp++;
            }
        }
        lastValue = timestamp;
    }
    
    int Converter::pushData(){
        
        const bool bStrictTimestamps = (output->oformat->flags & AVFMT_TS_NONSTRICT) ? false : true;
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
                        av_log(*input,AV_LOG_TRACE,"Converter::pushData. parsed id3 time %lld stream first_dts %lld pts %lld",
                               m_creationTime, in_stream->first_dts,pkt.pts);

                        m_creationTime -= dtsUtils::diff(in_stream,pkt.dts,m_minStartDTSMsec);

                        // hack for mp4
                        MOVMuxContext *mov = reinterpret_cast<MOVMuxContext*>(output->priv_data);
                        mov->time = m_creationTime / 1000 + 0x7C25B080; // 1970 based -> 1904 based
                    }
                }
            } else {
                
                pkt.stream_index = m_streamMapper[pkt.stream_index];
                
                AVStream *out_stream = output->streams[pkt.stream_index];
                
                ExtraTrackInfo &xtra = m_extraTrackInfo[pkt.stream_index];
                
                /* copy packet */
                
                //log_packet(*input, &pkt, "in",AV_LOG_FATAL);
                
                updateLastTimestamp(xtra.lastPTS, pkt.pts,bStrictTimestamps);
                
                pkt.pts = av_rescale_q_rnd(pkt.pts, in_stream->time_base,out_stream->time_base, (AVRounding)(AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX));
                
                updateLastTimestamp(xtra.lastDTS,pkt.dts,bStrictTimestamps);
                
                xtra.maxDTS = pkt.dts + pkt.duration;
                
                pkt.dts = av_rescale_q_rnd(pkt.dts, in_stream->time_base,out_stream->time_base, (AVRounding)(AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX));
                
                pkt.duration = av_rescale_q(pkt.duration, in_stream->time_base, out_stream->time_base);
                pkt.pos = -1;

                log_packet(*input, &pkt, "in");
                
                if(!pkt.size){
                    av_log(*input,AV_LOG_WARNING,"Converter::pushData. zero sized packet stream=%d time=%lld",
                           pkt.stream_index, pkt.pts);
                } else {
                    m_totalBitrate += (pkt.size * 8.f);
                    _S(av_interleaved_write_frame(*output, &pkt));
                }
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
    
    
    int getKeyFrames(MOVMuxContext *mov,std::vector<double> &result){
    
        if(!mov){
            return -1;
        }
        
        result.resize(0);
        
        // code *stolen* from movenc.c
        for(MOVTrack *track = mov->tracks; track < mov->tracks + mov->nb_streams ; track++){
            if (track->enc->codec_type == AVMEDIA_TYPE_VIDEO  &&
                track->has_keyframes && track->has_keyframes < track->entry){
                for (int i = 0; i < track->entry; i++) {
                    if (track->cluster[i].flags & MOV_SYNC_SAMPLE) {
                        int64_t dts = track->cluster[i].dts;
                        if(AV_NOPTS_VALUE == dts){
                            av_log(NULL,AV_LOG_WARNING,"getKeyFrames. undefined dts value for keyframe %d",
                                   i);
                        } else {
                            int64_t millis = av_rescale_rnd(dts,1000,
                                                            track->timescale,AV_ROUND_ZERO);
                            if(millis < 0){
                                av_log(NULL,AV_LOG_WARNING,"getKeyFrames. negative dts value for keyframe %i dts=%lld timescale=%u millis=%lld",
                                       i, dts , track->timescale, millis );
                            } else {
                                result.push_back(millis);
                            }
                        }
                    }
                }
                break;
            }
        }
        
        if(result.size()){
            
            auto diff = result[0];
            
            std::transform(result.begin(),result.end(),result.begin(),[ diff ] (double val) -> double { return val - diff; });
        }
        
        return 0;
    }
    
    void Converter::close(){
        
        if(state == PUSHING){
            
            state = CLOSING;
            
            MediaFileInfo mfi;
            
            if(m_hash){
                uint8_t md5val[16];
                av_md5_final(m_hash, md5val);
                
                mfi.sig.resize(sizeof(md5val) * 2);
                const std::string map("0123456789ABCDEF");
                
                for( size_t i = 0; i < mfi.sig.length(); ){
                    uint8_t val = md5val[i/2];
                    mfi.sig[i++] = map[val>>4];
                    mfi.sig[i++] = map[val & 0xf];
                }
                //mfi.sig[mfi.sig.length()-1] = '\0';
            }

            for(size_t i = 0; i < input->nb_streams;i++)
            {
                AVStream *stream = this->input->streams[i];
                
                bool bFound = false;
                for(size_t j = 0; j < output->nb_streams && false == bFound;j++){
                    AVStream *out_stream = this->output->streams[j];
                    if(out_stream->codec->codec_type == stream->codec->codec_type ){
                        bFound = true;
                    }
                }
                
                if(!bFound)
                    continue;
                
                std::vector<double> keyFrames;

                switch(stream->codec->codec_type){
                    case AVMEDIA_TYPE_VIDEO:
                    {
                        MOVMuxContext *mov = reinterpret_cast<MOVMuxContext*>(output->priv_data);
                        
                        _V(getKeyFrames(mov,keyFrames));

                        mfi.metadata.width = stream->codec->width;
                        mfi.metadata.height = stream->codec->height;
                        if(stream->r_frame_rate.den){
                            mfi.metadata.framerate = (float)stream->r_frame_rate.num / stream->r_frame_rate.den;
                        }
                    }
                    case AVMEDIA_TYPE_AUDIO:
                    {
                        
                        double wrapDTS = ::ceil(dts2msec(1ULL << stream->pts_wrap_bits,stream->time_base));
                        ExtraTrackInfo &extraInfo = this->m_extraTrackInfo[this->m_streamMapper[i]];
                        double duration = dts2msec(extraInfo.maxDTS - stream->first_dts,stream->time_base);
                        if(keyFrames.size()) {
                            std::vector<double>::iterator last = std::unique(keyFrames.begin(), keyFrames.end());
                            keyFrames.erase(last,keyFrames.end());
                            mfi.metadata.keyFrameDistance = (float)duration / keyFrames.size();
                        }
                        mfi.tracks.push_back({ (double)(this->m_creationTime + dtsUtils::diff(stream,stream->start_time,m_minStartDTSMsec)),
                            extraInfo.startDTS,
                            wrapDTS,
                            duration,
                            keyFrames,
                            stream->codec->codec_type
                        });
                    }
                        break;
                    default:
                        break;
                };
            }
            
            mfi.metadata.fileSize = m_totalBitrate / 1024;

            assert(mfi.tracks.size() > 0);
            mfi.startTimeUnixMs = this->m_creationTime;

            if(output->metadata){
                std::ostringstream ostr;
                ostr << mfi;
                av_dict_set(&output->metadata, "comment", ostr.str().c_str(), 0);
            }
            output.Close();
            output.EmitInfo(mfi);
            input.Close();
            state = CLOSED;
        }
    }
};