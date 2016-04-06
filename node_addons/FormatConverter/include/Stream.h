//
//  Stream.h
//  FormatConverter
//
//  Created by Igor Shevach on 2/29/16.
//  Copyright (c) 2016 Igor Shevach. All rights reserved.
//

#ifndef FormatConverter_Stream_h
#define FormatConverter_Stream_h

#include <Utils.h>
#include <vector>

namespace converter{
    
    
    struct MediaTrackInfo{
        double firstDtsMsec;
        double firstEncoderDtsMsec;
        double wrapEncoderDtsMsec;
        double durationMsec;
        AVMediaType  mtype;
    };
    
    struct MediaFileInfo{
       
        MediaFileInfo()
        :startTimeUnixMs(0)
        {}
     
        std::string sig;
        int64_t startTimeUnixMs;
        std::vector<MediaTrackInfo> tracks;
    };

    
    class  StreamBase : public enable_lockable_shared_from_this<StreamBase> {
    public:
        virtual ~StreamBase(){}
        virtual int Write(uint8_t *buf, int size) = 0;
        virtual int Read(uint8_t *buf, int size) = 0;
        virtual int64_t Seek(int64_t offset, int whence) = 0;
        
        virtual void EmitInfo(const MediaFileInfo &mfi) {
            
        }
    };
    
};

#endif
