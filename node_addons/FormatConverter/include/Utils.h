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
}

#define _S(e)  { \
		int res = (e);\
		if(res < 0) { \
			av_log(nullptr,AV_LOG_WARNING,"%s (%d) error %d\n",__FILE__,__LINE__,res); \
			return e;\
		} \
}

#define _PTR(p)  { \
		if(!(p)) { \
			av_log(nullptr,AV_LOG_WARNING,"%s (%d) NULL pointer\n",__FILE__,__LINE__); \
			return -1;\
		} \
}

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
		ensure_len(lastIndex+1)
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

#if 0
	smatch m;

	av_log(NULL, AV_LOG_DEBUG,"extractUnixTimeMsecFromId3Tag. input string <%s> ", s.c_str());

	try {
		std::regex e ("\"timestamp\":(.*?)(?:,|}).*");

		av_log(NULL, AV_LOG_DEBUG,"extractUnixTimeMsecFromId3Tag. before regex_search ");

		if(std::regex_search (s,m,e)){
			std::string val(m[1].first,m[1].second);
			return std::stod(val);
		} else {
			throw s.c_str();
		}
	} catch (std::regex_error &ex) {
		const char *reason;
		switch( ex.code() )
		{
		case regex_constants::error_collate:
			reason = "The expression contained an invalid collating element name.";
			break;
		case regex_constants::error_ctype:
			reason = "The expression contained an invalid character class name.";
			break;
		case regex_constants::error_escape:
			reason = "The expression contained an invalid escaped character, or a trailing escape.";
			break;
		case regex_constants::error_backref:
			reason = "The expression contained an invalid back reference.";
			break;
		case regex_constants::error_brack:
			reason = "The expression contained mismatched brackets ([ and ]).";
			break;
		case regex_constants::error_paren:
			reason = "The expression contained mismatched parentheses (( and )).";
			break;
		case regex_constants::error_brace:
			reason = "The expression contained mismatched braces ({ and }).";
			break;
		case regex_constants::error_badbrace:
			reason = "The expression contained an invalid range between braces ({ and }).";
			break;
		case regex_constants::error_range:
			reason = "The expression contained an invalid character range.";
			break;
		case regex_constants::error_space:
			reason = "There was insufficient memory to convert the expression into a finite state machine.";
			break;
		case regex_constants::error_badrepeat:
			reason = "The expression contained a repeat specifier (one of *?+{) that was not preceded by a valid regular expression.";
			break;
		case regex_constants::error_complexity:
			reason = "The complexity of an attempted match against a regular expression exceeded a pre-set level.";
			break;
		case regex_constants::error_stack:
			reason = "There was insufficient memory to determine whether the regular expression could match the specified character sequence.";
			break;
		default:
			reason = "Undefined.";
			break;

		};

		av_log(NULL, AV_LOG_DEBUG,"extractUnixTimeMsecFromId3Tag. error %s code: %d => %s", ex.what(), ex.code(), reason);
		throw;

	}
#else
	string pattern ("\"timestamp\":");
	size_t n = s.find(pattern);
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
#endif
	return 0;
}

const double TIMESTAMP_RESOLUTION = 1000.0;

};

#endif
