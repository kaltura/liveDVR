//
//  Utils.h
//  FormatConverter
//
//  Created by Igor Shevach on 2/29/16.
//  Copyright (c) 2016 Igor Shevach. All rights reserved.
//

#ifndef FormatConverter_Utils_h
#define FormatConverter_Utils_h

#include <vector>
#include <stdio.h>
#include <regex>
#include <arpa/inet.h>
#include <assert.h>

extern "C"{
#include "libavutil/log.h"
#include "libavutil/dict.h"
#include "libavformat/avformat.h"
}

#define _S(e)  { \
int res = (e);\
if(res < 0) { \
av_log(nullptr,AV_LOG_WARNING,"%s (%d) error %d\n",__FILE__,__LINE__,res); \
return res;\
} \
}

#define _V(e)  { \
int res = (e);\
if(res < 0) { \
av_log(nullptr,AV_LOG_WARNING,"%s (%d) error %d\n",__FILE__,__LINE__,res); \
} \
}

#define _PTR(p)  { \
if(!(p)) { \
av_log(nullptr,AV_LOG_WARNING,"%s (%d) NULL pointer\n",__FILE__,__LINE__); \
return -1;\
} \
}

namespace std {
#ifndef _NOEXCEPT
#define _NOEXCEPT noexcept
#endif
    
    template<>
    inline
    void default_delete<AVDictionary>::operator() (AVDictionary* p) const _NOEXCEPT
    {
    av_dict_free(&p);
}

};

namespace converter{
    
    template<class _Tp>
    class enable_lockable_shared_from_this : public std::enable_shared_from_this<_Tp>
    {
        std::vector< std::shared_ptr<_Tp> > _locks;
    public:
        void lock_shared_ptr(){
            _locks.push_back(this->shared_from_this());
        }
        void unlock_shared_ptr(){
            if(_locks.size()){
                _locks.pop_back();
            }
        }
    };
    
    inline std::string
    parseId3Tag(const char *buf,size_t len)
    {
        
#define ensure_len(val) if(len<=val) \
{\
return "";\
}
        
        size_t walkerIndex = 0;
        
        uint8_t flags = buf[walkerIndex];
        
        //skip id3 tag header flags
        walkerIndex++;
        ensure_len(walkerIndex+1)
        if (0 != (flags & (1 << 6)))
        {
            int extHeaderSize = ntohl(*(int*)(buf+walkerIndex));
            walkerIndex += extHeaderSize;
        }
        
        int tagSize = ntohl( *(int*)(buf+walkerIndex));
        tagSize -= 10;
        //      if( buf.Length < tagSize )
        //      {
        //          logger.warn("parseId3Tag. wrong input buffer size {0} expected {1}", buf.Length, tagSize);
        //          return KalturaSyncPoint.Zero;
        //     }
        walkerIndex += 4;
        ensure_len(walkerIndex+4)
        const char *frameId = &buf[walkerIndex];
        if ( strncmp("TEXT",frameId,4) )
        {
            av_log(NULL, AV_LOG_ERROR, "bad id3 tag");
            return "";
        }
        
        walkerIndex += 4;
        ensure_len(walkerIndex+4)
        int frameSize = ntohl( *(int*)(buf+walkerIndex) );
        //        if( buf.Length - walkerIndex < frameSize)
        //        {
        //            logger.warn("parseId3Tag. wrong input buffer size {0} expected {1}", buf.Length, frameSize + walkerIndex);
        //            return KalturaSyncPoint.Zero;
        //       }
        frameSize -= 10;
        walkerIndex += 4;
        // skip frame flags
        walkerIndex += 2;
        ensure_len(walkerIndex+1)
        uint8_t encoding = buf[walkerIndex];
        
        if (encoding != 0x3) // UTF-8
        {
            av_log(NULL, AV_LOG_ERROR,"parseId3Tag. unsupported encoding %u expected 0x3 (UTF-8)", encoding);
            return "";
        }
        walkerIndex++;
        size_t indexStart = walkerIndex, lastIndex = walkerIndex;
        for (; lastIndex < len; lastIndex++)
        {
            //   ensure_len(lastIndex+1)
            if (0 == buf[lastIndex])
            {
                break;
            }
        }
        
        if (lastIndex == len)
        {
            av_log(NULL, AV_LOG_ERROR,"parseId3Tag. failed to find terminating 0");
            return "";
        }
        
        av_log(NULL, AV_LOG_DEBUG,"parseId3Data. found valid UTF-8 tag of length=%lu. ", lastIndex - indexStart);
        
        return std::string(buf+indexStart, buf+lastIndex);
        
    }
    
    
    inline int64_t extractUnixTimeMsecFromId3Tag(const uint8_t *data,size_t len){
        using namespace std;
        
        string s = parseId3Tag((const char *)data,len);
        // only sync points of type KalturaSyncPoint are accepted...
        string type("\"objectType\":\"KalturaSyncPoint\"");
        size_t n = s.find(type);
        if(string::npos != n){
            string pattern ("\"timestamp\":");
            n = s.find(pattern);
            if(string::npos != n){
                string delims = ",}";
                n += pattern.length();
                size_t closest = numeric_limits<size_t>::max();
                for(string::iterator it = delims.begin(); it != delims.end(); it++){
                    size_t k =  s.find(*it,n);
                    if(k != string::npos){
                        closest = min(closest,k);
                    }
                }
                if( closest != numeric_limits<size_t>::max()){
                    return stod(s.substr(n,closest));
                }
            }
        }

        return 0;
    }
    
    const double TIMESTAMP_RESOLUTION = 1000.0;
    
    class dtsUtils
    {
    public:
        
        static const int64_t INVALID_VALUE = std::numeric_limits<int64_t>::max();
        
        static int64_t to_ms(const AVStream *stream,const int64_t &dts){
            return av_rescale(dts,TIMESTAMP_RESOLUTION * stream->time_base.num,
                              stream->time_base.den);
        }
        
        static int64_t to_dts(const AVStream *stream,const int64_t &ms){
            return av_rescale(ms,stream->time_base.den,1000 * stream->time_base.num);
        }
        
        static int64_t diff(AVStream *stream,const int64_t &dts,const int64_t &startTime,bool conv = true){
            int64_t start_dts = conv ? to_dts(stream,startTime) : startTime;
            int64_t w = 1ULL << stream->pts_wrap_bits;
            int64_t retval = diff_wrap(dts,start_dts,w);
            if(retval > w / 2){
                //diff is negative
                retval = dts - start_dts;
            }
            return conv ? to_ms(stream,retval) : retval;
        }
        
        static int64_t min(int64_t val,AVStream *stream){
            
            if(INVALID_VALUE == val || diff(stream,stream->start_time,val) < 0 ){
                return to_ms(stream,stream->start_time);
            }
            return val;
        }
        
        static int64_t add(const int64_t &a,const int64_t &b,const int64_t &w){
            return (a+b)%w;
        }
        
        static int64_t diff_wrap(const int64_t &a,const int64_t &b,const int64_t &w){
            return add(a-b,w,w);
        }
    };
    
    
};

#endif
