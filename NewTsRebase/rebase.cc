#include "nan.h"
#include "include/mpegts_stream_walker.h"
#include "include/ts_rebase_impl.h"
#include "include/common.h"
#include <stdlib.h>
#include <string.h>
#include "include/constants.h"
#include "include/utils.h"


// object keys
#define CONTEXT_EXPECTED_DTS			"expectedDts"
#define CONTEXT_CORRECTION				"correction"
#define CONTEXT_TOTAL_FRAME_DURATIONS	"totalFrameDurations"
#define CONTEXT_TOTAL_FRAME_COUNT		"totalFrameCount"
#define CONTEXT_SUGGESTED_CORRECTION "id3_pts_diff"
#define CONTEXT_FIRST_FRAME_DTS "original_first_frame_dts"
#define LAST_FRAME_DTS "last_frame_dts"


#define TIMESTAMP_MASK (0x1ffffffff)	// 33 bits
#define REBASE_THRESHOLD_DEFAULT (22500)		// 1/4 sec

using namespace v8;
using namespace node;

void free_list_ID3_struct(ID3v2_struct* head){
    ID3v2_struct* tmp;
    
    while (head != NULL)
    {
        tmp = head;
        head = head->next;
        free(tmp->objectType);
        free(tmp);
    }
    
}

static const char KALTURA_SYNC_TIMECODE[] = "KalturaSyncTimecode";
static const char KALTURA_SYNC_POINT[] = "KalturaSyncPoint";
uint64_t get_suggested_correction(ID3v2_struct* obj)
{
	uint64_t suggested_correction=0;
	while (obj != NULL) {
		if (!strcmp(obj->objectType, KALTURA_SYNC_TIMECODE) || !strcmp(obj->objectType, KALTURA_SYNC_POINT)){
			suggested_correction = 90 * obj->UnixTimeStamp - obj->PTS; //normalize it such the units is second*90,000
			if (!strcmp(obj->objectType, KALTURA_SYNC_TIMECODE)){	// if object type is KalturaSyncTimecode return its value
				return suggested_correction;
			}
		}
		obj = obj->next;
	}
	return suggested_correction;
}

void parsing_ID3_tag(const byte_t* buffer_data, size_t buffer_size, ts_rebase_context_t* context, int threshold, int64_t first_frame_dts)
{
    stream_walker_state_t stream_walker_state;
    ID3v2_struct* ID3v2_struct_list=NULL;
    
    stream_walker_init(&stream_walker_state);
    walk_ts_streams(
                    buffer_data,
                    buffer_size,
                    stream_walker_pmt_header_callback,
                    stream_walker_pmt_entry_callback,
                    stream_walker_packet_data_callback,
                    &stream_walker_state,
                    &ID3v2_struct_list);
    stream_walker_free(&stream_walker_state);


    context->id3_pts_diff=get_suggested_correction(ID3v2_struct_list);
    if ( 0!=context->id3_pts_diff )
    {
        if ((((context->last_frame_dts -  first_frame_dts) & TIMESTAMP_MASK) > threshold &&
            ((first_frame_dts - context->last_frame_dts) & TIMESTAMP_MASK) > threshold) || context->last_frame_dts == 0)
        {
            context->correction =  context->id3_pts_diff;
        }
    }
    free_list_ID3_struct(ID3v2_struct_list);
    
}

NAN_METHOD(RebaseTs)
{
    NanScope();
    
    // validate args
    if (args.Length() < 3)
    {
        return NanThrowTypeError("Function requires 3 arguments");
    }
    
    if (!args[0]->IsObject())
    {
        return NanThrowTypeError("Argument 1 must be an object");
    }
    
    if (!args[1]->IsObject() || !Buffer::HasInstance(args[1]))
    {
        return NanThrowTypeError("Argument 2 must be a buffer");
    }
    
    if (!args[2]->IsBoolean())
    {
       return NanThrowTypeError("Argument 3 must be a buffer");
    }
    

    // parse the context
    ts_rebase_context_t context;
    Local<Value> curValue;
    Local<Object> inputContext = args[0]->ToObject();
    
    curValue = inputContext->Get(NanNew<String>(CONTEXT_EXPECTED_DTS));
    context.expected_dts = curValue->IsNumber() ? curValue->IntegerValue() : NO_TIMESTAMP;
    
    curValue = inputContext->Get(NanNew<String>(CONTEXT_CORRECTION));
    context.correction = curValue->IsNumber() ? curValue->IntegerValue() : 0;
    
    curValue = inputContext->Get(NanNew<String>(CONTEXT_TOTAL_FRAME_DURATIONS));
    context.total_frame_durations = curValue->IsNumber() ? curValue->IntegerValue() : 0;
    
    curValue = inputContext->Get(NanNew<String>(CONTEXT_TOTAL_FRAME_COUNT));
    context.total_frame_count = curValue->IsNumber() ? curValue->IntegerValue() : 0;
    
    curValue = inputContext->Get(NanNew<String>(CONTEXT_SUGGESTED_CORRECTION));
    context.id3_pts_diff = curValue->IsNumber() ? curValue->IntegerValue() : 0;
    

    int rebase_threshold = (args.Length() == 4)  ? args[3]->NumberValue() : REBASE_THRESHOLD_DEFAULT;
    bool universal_timestamp = args[2]->ToBoolean()->BooleanValue();
    if (universal_timestamp)
    {
        curValue = inputContext->Get(NanNew<String>(LAST_FRAME_DTS));
        context.last_frame_dts = curValue->IsNumber() ? curValue->IntegerValue() : 0;
        
        const byte_t* buffer_data=(const byte_t*)Buffer::Data(args[1]->ToObject());
        size_t buffer_size=Buffer::Length(args[1]->ToObject());
        context.expected_dts=NO_TIMESTAMP;
        int main_pid = ts_rebase_find_main_pid(buffer_data, buffer_size);
        uint32_t frame_count;
        int64_t first_frame_dts = 0;
        int64_t last_frame_dts = 0;
        
        ts_rebase_get_stream_frames_info(
                                         buffer_data,
                                         buffer_size,
                                         main_pid,
                                         &frame_count,
                                         &first_frame_dts,
                                         &last_frame_dts);
        
		parsing_ID3_tag(buffer_data, buffer_size, &context, rebase_threshold, first_frame_dts);
        inputContext->Set(NanNew<String>(CONTEXT_SUGGESTED_CORRECTION),     NanNew<Number>(context.id3_pts_diff));
        inputContext->Set(NanNew<String>(LAST_FRAME_DTS),     NanNew<Number>(last_frame_dts));
        
    }

	
    
    // perform the rebase
    uint64_t duration;
    
    ts_rebase_impl(
                   &context,
                   (u_char*)Buffer::Data(args[1]->ToObject()),
                   Buffer::Length(args[1]->ToObject()),
                   &duration,
                   universal_timestamp);
    
    // update the context object
    inputContext->Set(NanNew<String>(CONTEXT_EXPECTED_DTS), 		 NanNew<Number>(context.expected_dts));
    inputContext->Set(NanNew<String>(CONTEXT_CORRECTION),            NanNew<Number>(context.correction));
    inputContext->Set(NanNew<String>(CONTEXT_TOTAL_FRAME_DURATIONS), NanNew<Number>(context.total_frame_durations));
    inputContext->Set(NanNew<String>(CONTEXT_TOTAL_FRAME_COUNT),     NanNew<Number>(context.total_frame_count));
	inputContext->Set(NanNew<String>(CONTEXT_FIRST_FRAME_DTS), NanNew<Number>(context.original_first_frame_dts));
    
    Local<Value> result = NanNew<Number>(duration);
    
    NanReturnValue(result);
}

void init(Handle<Object> exports) 
{
    exports->Set(NanNew<String>("rebaseTs"), NanNew<FunctionTemplate>(RebaseTs)->GetFunction());
}

NODE_MODULE(TsRebase, init)
