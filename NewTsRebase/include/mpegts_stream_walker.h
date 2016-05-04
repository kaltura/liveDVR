#ifndef __MPEGTS_STREAM_WALKER_H__
#define __MPEGTS_STREAM_WALKER_H__

// includes
#include "mpegTsPacketizer.h"

// typedefs
typedef struct {
	int audio_pid;
	int video_pid;
	int id3_pid;
	int64_t initial_video_pts;
	int64_t initial_audio_pts;
	ts_packetizer_state_t packetizer_state;
} stream_walker_state_t;

// functions
#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

void stream_walker_init(stream_walker_state_t* state);

void stream_walker_pmt_header_callback(void* context, const pmt_t* pmt_header);

void stream_walker_pmt_entry_callback(void* context, const pmt_entry_t* pmt_entry, size_t size);

bool_t stream_walker_packet_data_callback(void* context, int cur_pid, const byte_t* packet, size_t size, ID3v2_struct** ID3v2_struct_list_p);

void stream_walker_free(stream_walker_state_t* state);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif // __MPEGTS_STREAM_WALKER_H__
