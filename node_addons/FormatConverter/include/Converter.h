//
//  Converter.h
//  FormatConverter
//
//  Created by Igor Shevach on 2/29/16.
//  Copyright (c) 2016 Igor Shevach. All rights reserved.
//

#ifndef FormatConverter_Converter_h
#define FormatConverter_Converter_h


#include <vector>
#include <string>
#include <set>
#include "Stream.h"
#include "AVFormat.h"

namespace converter{
    
    class AvLogFilter {
        
        struct Partial{
          bool operator ()(const char* l,const char* r) const{
              
              while(*l && *r){
                  if( *l != *r )
                      return *l - *r;
                  l++;
                  r++;
              }
              return 0;
        }
        };
        std::set<const char*,Partial> m_patterns;
        std::set<const char*> m_cached;
    public:
        void addFilter(const char *p);
        bool filter(const char * szFmt);
    };
       
    class ConverterAppInst{
        AvLogFilter m_filter;
        static void avlog_cb(void *data, int level, const char * szFmt, va_list varg);
    public:
        ConverterAppInst();
        
        int init(int logLevel = AV_LOG_TRACE);
        
        
        static ConverterAppInst &instance();
        
        const size_t STREAM_BUFFER_SIZE;
        const std::string INPUT_FORMAT ;
        const std::string OUTPUT_FORMAT;
        const bool m_bStrict;
    };
    
    
    class Converter{
        
        Converter(const Converter&);
        void operator=(Converter&);
    protected:
        
        static double dts2msec(const int64_t&val,const AVRational &timebase);
        
        friend struct ExtraTrackInfo;
        
        CInputCtx   input;
        COutputCtx  output;
        
        struct ExtraTrackInfo{
            
            ExtraTrackInfo(const AVStream *stream);
            
            int64_t clipPts(const int64_t &dts,const int64_t &pts, bool bReportError = false) const;
         
            MediaTrackInfo::value_type m_lastDTS,
                            m_lastPTS,
                            m_maxDTS,
                            m_startDTS;
            TSTrackInfo     m_tsInfo;
            int64_t         m_maxAllowedPtsDelay;
            const AVStream &m_stream;
            
            
            MediaTrackInfo::value_type dts2msec(const int64_t &dts) const{
                return MediaTrackInfo::value_type(
                        ::ceil(Converter::dts2msec(dts,m_stream.time_base)));
            }
            
            int64_t getStreamStartTime() const{
                switch(m_stream.codec->codec_type){
                    case AVMEDIA_TYPE_VIDEO:
                    case AVMEDIA_TYPE_AUDIO:
                        return m_stream.first_dts;
                    default:
                        return m_stream.start_time;
                };
            }
            
         };
        
        std::vector<ExtraTrackInfo> m_extraTrackInfo;
        int64_t          m_creationTime;
        AVMD5            *m_hash;
        int64_t          m_minStartDTSMsec;
        bool             m_bDataPending;
        uint64_t         m_totalBitrate;

        std::vector<int> m_streamMapper;
        
        enum { INIT, CREATING , PUSHING , CLOSING,  CLOSED, ERROR } state;
        
        int checkForStreams();
        int pushData();
        
    public:
        
        Converter();
        
        virtual ~Converter();
        
        int init(std::shared_ptr<StreamBase> inputStream, std::shared_ptr<StreamBase> outputStream);
        
        int onData(bool bEOS);
        
        void close();
        
    };
    
};

#endif
