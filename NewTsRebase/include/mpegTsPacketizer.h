#ifndef __MPEGTS_PACKETIZER_H__
#define __MPEGTS_PACKETIZER_H__

// includes
#include "mpegTsStructs.h"
#include "common.h"
#include "types.h"

// typedefs
//typedef void (*packetizer_callback_t)(void* context, const byte_t* packet, size_t size, int64_t pts,ID3v2_struct** ID3v2_struct_list_p);

typedef void (*pmt_header_callback_t)(void* context, const pmt_t* pmt_header);
typedef void (*pmt_entry_callback_t)(void* context, const pmt_entry_t* pmt_entry, size_t size);
typedef bool_t (*packet_data_callback_t)(void* context, int cur_pid, const byte_t* packet, size_t size,ID3v2_struct** ID3v2_struct_list_p);

typedef struct
{
	//packetizer_callback_t callback;
	void* callback_context;
	bool_t in_packet;
	byte_t* packet_buffer;
	byte_t* packet_pos;
	int64_t pts;
	size_t packet_size;
	size_t size_left;
} ts_packetizer_state_t;

// functions
#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

void ts_packetizer_init(ts_packetizer_state_t* state);
bool_t ts_packetizer_process_data(ts_packetizer_state_t* state, const byte_t* packet_offset, size_t size,ID3v2_struct** ID3v2_struct_list_p);
void ts_packetizer_free(ts_packetizer_state_t* state);
ID3v2_struct* parse_json(char * json);
bool_t walk_ts_streams(
	const byte_t* data,
	size_t size,
	pmt_header_callback_t pmt_header_callback,
	pmt_entry_callback_t pmt_entry_callback,
	packet_data_callback_t packet_data_callback,
	void* callback_context,
    ID3v2_struct** ID3v2_struct_list_p);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif // __MPEGTS_PACKETIZER_H__
