#include <string.h>
#include "mpegts_stream_walker.h"
#include "mpegTs.h"

void 
stream_walker_init(stream_walker_state_t* state)
{
	memset(state, 0, sizeof(*state));
	state->initial_video_pts = NO_TIMESTAMP;
	state->initial_audio_pts = NO_TIMESTAMP;
	ts_packetizer_init(&state->packetizer_state);      
}

void 
stream_walker_pmt_header_callback(void* context, const pmt_t* pmt_header)
{
	stream_walker_state_t* state = (stream_walker_state_t*)context;
	
	state->audio_pid = 0;
	state->video_pid = 0;
	state->id3_pid = 0;
}

void 
stream_walker_pmt_entry_callback(void* context, const pmt_entry_t* pmt_entry, size_t size)
{
	stream_walker_state_t* state = (stream_walker_state_t*)context;
	
	switch (pmt_entry_get_streamType(pmt_entry))
	{
	case STREAM_TYPE_AUDIO_AAC:
		state->audio_pid = pmt_entry_get_elementaryPID(pmt_entry);
		break;
		
	case STREAM_TYPE_VIDEO_H264:
		state->video_pid = pmt_entry_get_elementaryPID(pmt_entry);
		break;
		
	default:
		if (search_pattern(pmt_entry, size, (const byte_t*)"ID3 ", 4))
		{
			state->id3_pid = pmt_entry_get_elementaryPID(pmt_entry);
		}
	}
}

bool_t 
stream_walker_packet_data_callback(void* context, int cur_pid, const byte_t* packet, size_t size, ID3v2_struct** ID3v2_struct_list_p)
{
	stream_walker_state_t* state = (stream_walker_state_t*)context;
	
	if (cur_pid == state->audio_pid && state->initial_audio_pts == NO_TIMESTAMP)
	{
		state->initial_audio_pts = get_pts_from_packet(packet, size);
	}
	else if (cur_pid == state->video_pid && state->initial_video_pts == NO_TIMESTAMP)
	{
		state->initial_video_pts = get_pts_from_packet(packet, size);
	}
	else if (cur_pid == state->id3_pid)
	{
		if (!ts_packetizer_process_data(&state->packetizer_state, packet, size, ID3v2_struct_list_p))
		{
			return FALSE;
		}			
	}
	return TRUE;
}

void 
stream_walker_free(stream_walker_state_t* state)
{
	ts_packetizer_free(&state->packetizer_state);
}
