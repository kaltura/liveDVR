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
#include "Stream.h"
#include "AVFormat.h"

namespace converter{
    
    
    class ConverterAppInst{
    public:
        ConverterAppInst();
        
        int init(int logLevel = AV_LOG_TRACE);
        
        static ConverterAppInst &instance();
        
        const size_t STREAM_BUFFER_SIZE;
        const std::string INPUT_FORMAT ;
        const std::string OUTPUT_FORMAT;
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
            ExtraTrackInfo(const double &dts)
            :lastDTS(AV_NOPTS_VALUE),
            lastPTS(AV_NOPTS_VALUE),
            maxDTS(0),
            startDTS(dts)
            {}
            
            int64_t lastDTS,
                    lastPTS,
                    maxDTS;
            double startDTS;
         };
        
        std::vector<ExtraTrackInfo> m_extraTrackInfo;
        int64_t          m_creationTime;
        AVMD5            *m_hash;
        int64_t          m_minStartDTSMsec;
        bool             m_bDataPending;
        
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
