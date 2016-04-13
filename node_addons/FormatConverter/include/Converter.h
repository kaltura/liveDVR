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
        CInputCtx   input;
        COutputCtx  output;
        std::vector<int64_t> pts, dts;
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
