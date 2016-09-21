//
//  Stream.cpp
//  binding
//
//  Created by Igor Shevach on 25/08/2016.
//
//

#include <Stream.h>
#include <sstream>

namespace converter{
    
    const std::string MediaTrackInfo::fld_duration = "duration";
    const std::string MediaTrackInfo::fld_firstDTS = "firstDTS";
    const std::string MediaTrackInfo::fld_firstEncoderDTS = "firstEncoderDTS";
    const std::string MediaTrackInfo::fld_wrapEncoderDTS = "wrapEncoderDTS";
    const std::string MediaTrackInfo::fld_keyFrameDTS = "keyFrameDTS";
    
    const std::string MediaFileInfo::fld_sig = "sig";
    const std::string MediaFileInfo::fld_startTime = "startTime";
    const std::string MediaFileInfo::fld_video = "video";
    const std::string MediaFileInfo::fld_audio = "audio";
    
    std::ostream& quotes(std::ostream& os,const std::string &s) {
        return os << "\"" << s << "\"";
    }
    
    std::ostream& field(std::ostream& os,const std::string &s) {
        return quotes(os,s) << ":";
    }
    
    template <class iter>
    std::ostream& array(std::ostream& os,iter start,iter end) {
        if(start != end){
            os << "[";
            for(; start != end; ){
                os << *start++;
            if(start != end ){
                os << ",";
            }
        }
         os << "]";
        }
        return os;
    }
    
    std::ostream& operator<<(std::ostream& os, const MediaTrackInfo& mti){
        os << "{";
        field(os,MediaTrackInfo::fld_duration)  <<  std::fixed << mti.durationMsec << ",";
        field(os,MediaTrackInfo::fld_firstDTS)  <<  std::fixed << mti.firstDtsMsec << ",";
        field(os,MediaTrackInfo::fld_firstEncoderDTS)  << std::fixed << mti.firstEncoderDtsMsec << ",";
        field(os,MediaTrackInfo::fld_wrapEncoderDTS)  << std::fixed << mti.wrapEncoderDtsMsec;
        
        if(mti.vecKeyFrameDtsMsec.size() > 0){
            os << ",";
            field(os,MediaTrackInfo::fld_keyFrameDTS);
            array(os,mti.vecKeyFrameDtsMsec.begin(),mti.vecKeyFrameDtsMsec.end());
        }
        
        os << "}";
        return os;
    }
    
    
     std::ostream& operator<<(std::ostream& os, const MediaFileInfo& mfi){
      
         os << "{";
         field(os,MediaFileInfo::fld_startTime) << mfi.startTimeUnixMs << ",";
         field(os,MediaFileInfo::fld_sig);
         quotes(os,mfi.sig);
         
         for(std::vector<MediaTrackInfo>::const_iterator iter = mfi.tracks.begin();
            iter != mfi.tracks.end(); iter++){
           
            switch(iter->mtype){
                case AVMEDIA_TYPE_VIDEO:
                case AVMEDIA_TYPE_AUDIO:
                {
                    if(iter == mfi.tracks.begin()){
                        os << ",";
                    }
                    if(iter->mtype == AVMEDIA_TYPE_VIDEO)
                        field(os,MediaFileInfo::fld_video);
                    else
                       field(os,MediaFileInfo::fld_audio);
                    os << *iter;
                    if(iter < mfi.tracks.end() - 1){
                        os << ",";
                    }
                }
                    break;
                default:
                    break;
            };
        }
        os << "}";
         return os;
    }

};