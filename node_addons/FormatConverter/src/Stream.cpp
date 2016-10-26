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
    const std::string MediaFileInfo::fld_metaData = "metaData";


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
        field(os,MediaTrackInfo::fld_firstDTS)  <<  std::fixed << mti.absoluteTimeMsec << ",";
        field(os,MediaTrackInfo::fld_firstEncoderDTS)  << std::fixed << mti.ptsMsec << ",";
        field(os,MediaTrackInfo::fld_wrapEncoderDTS)  << std::fixed << mti.wrapPtsMsec;
        
        if(mti.vecKeyFrameDtsMsec.size() > 0){
            os << ",";
            field(os,MediaTrackInfo::fld_keyFrameDTS);
            array(os,mti.vecKeyFrameDtsMsec.begin(),mti.vecKeyFrameDtsMsec.end());
        }
        
        os << "}";
        return os;
    }
    
    std::ostream& operator<<(std::ostream& os, const TSTrackInfo& tti){
        os << "{";
        field(os,"dts")  <<  std::fixed << tti.m_dts << ",";
        field(os,"ptsDelay")  <<  std::fixed << tti.m_ptsDelay << ",";
        field(os,"duration")  <<  std::fixed << tti.m_duration;
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
        
        //dump original ts info
        if(mfi.tsTracks.size()){
            os << ",";
            field(os,"ts_info");
            os << "{";
            for(std::vector<TSTrackInfo>::const_iterator iter = mfi.tsTracks.begin();
                iter != mfi.tsTracks.end(); iter++){
                
                switch(iter->mtype){
                    case AVMEDIA_TYPE_VIDEO:
                    case AVMEDIA_TYPE_AUDIO:
                    {
                        if(iter->mtype == AVMEDIA_TYPE_VIDEO)
                            field(os,MediaFileInfo::fld_video);
                        else
                            field(os,MediaFileInfo::fld_audio);
                        os << *iter;
                        if(iter < mfi.tsTracks.end() - 1){
                            os << ",";
                        }
                    }
                        break;
                    default:
                        break;
                };
            }
            
            os << "}";
        }
        
        if(mfi.bSerializeMetaData){
            os << ",";
            field(os,MediaFileInfo::fld_metaData) << mfi.metadata;
        }
        os << "}";
        return os;
    }

    std::ostream& operator<<(std::ostream& os, const MediaMetadata& md){

        os << "{";
        if(md.width > 0 && md.height > 0 ){
            field(os,"resolution") << "[" << md.width << "," << md.height << "]" << ",";
        }
        field(os,"fileSize_kbits") << md.fileSize;
        if(md.framerate){
            os << ",";
            field(os,"framerate") << md.framerate;
        }
        if(md.keyFrameDistance){
            os << ",";
            field(os,"keyFrameDistance") << md.keyFrameDistance;
        }
        os << "}";
        return os;
    }

};