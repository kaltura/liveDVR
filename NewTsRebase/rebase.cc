#include "nan.h"
#include "include/mpegts_stream_walker.h"
#include "include/ts_rebase_impl.h"
#include "include/common.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "include/constants.h"
#include "include/utils.h"


// object keys
#define CONTEXT_EXPECTED_DTS			"expectedDts"
#define CONTEXT_CORRECTION				"correction"
#define CONTEXT_TOTAL_FRAME_DURATIONS	"totalFrameDurations"
#define CONTEXT_TOTAL_FRAME_COUNT		"totalFrameCount"
#define TIMESTAMP_MASK (0x1ffffffff)	// 33 bits
#define REBASE_THRESHOLD (22500)		// 1/4 sec

using namespace v8;
using namespace node;

static const char kaltura_object_type[] = "KalturaSyncTimecode";

long get_suggested_correction(ID3v2_struct* obj)
{
    long suggested_correction;
    if (obj==NULL)
    {
        return 0    ;
    }
    while (1){
        suggested_correction=90*obj->UnixTimeStamp-obj->PTS;
        if  (!strcmp(obj->objectType,kaltura_object_type)){   //TODO: change to constant
            suggested_correction=90*obj->UnixTimeStamp-obj->PTS; //normalize it such the units is second*90,000
            if (*obj->objectType=='\0'){
                puts("ERROR oject type is null");
            }
            return suggested_correction;
        }
        obj=obj->next;
        if (obj == NULL)
            break;
    }
    return suggested_correction;
    
}

NAN_METHOD(RebaseTs)
{
    NanScope();
    
    // validate args
    if (args.Length() < 2)
    {
        return NanThrowTypeError("Function requires 2 arguments");
    }
    
    if (!args[0]->IsObject())
    {
        return NanThrowTypeError("Argument 1 must be an object");
    }
    
    if (!args[1]->IsObject() || !Buffer::HasInstance(args[1]))
    {
        return NanThrowTypeError("Argument 2 must be a buffer");
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
    
    //parsing ID3 tag
    stream_walker_state_t stream_walker_state;
    long suggested_correction;
    ID3v2_struct* ID3v2_struct_list=NULL;
    
    stream_walker_init(&stream_walker_state);
    walk_ts_streams(
                    (const byte_t*)Buffer::Data(args[1]->ToObject()),
                    Buffer::Length(args[1]->ToObject()),
                    stream_walker_pmt_header_callback,
                    stream_walker_pmt_entry_callback,
                    stream_walker_packet_data_callback,
                    &stream_walker_state,
                    &ID3v2_struct_list);
	stream_walker_free(&stream_walker_state);
    
   suggested_correction=get_suggested_correction(ID3v2_struct_list);
    if (((context.correction - suggested_correction) & TIMESTAMP_MASK) > REBASE_THRESHOLD &&
        ((suggested_correction - context.correction) & TIMESTAMP_MASK) > REBASE_THRESHOLD)
    {
        context.correction = suggested_correction;
    }


    
    // perform the rebase
    uint64_t duration;
    
    ts_rebase_impl(
                   &context,
                   (u_char*)Buffer::Data(args[1]->ToObject()),
                   Buffer::Length(args[1]->ToObject()),
                   &duration);
    
    // update the context object
    inputContext->Set(NanNew<String>(CONTEXT_EXPECTED_DTS), 		 NanNew<Number>(context.expected_dts));
    inputContext->Set(NanNew<String>(CONTEXT_CORRECTION),            NanNew<Number>(context.correction));
    inputContext->Set(NanNew<String>(CONTEXT_TOTAL_FRAME_DURATIONS), NanNew<Number>(context.total_frame_durations));
    inputContext->Set(NanNew<String>(CONTEXT_TOTAL_FRAME_COUNT),     NanNew<Number>(context.total_frame_count));
    
    Local<Value> result = NanNew<Number>(duration);
    
    NanReturnValue(result);
}

void init(Handle<Object> exports) 
{
    exports->Set(NanNew<String>("rebaseTs"), NanNew<FunctionTemplate>(RebaseTs)->GetFunction());
}

NODE_MODULE(TsRebase, init)
