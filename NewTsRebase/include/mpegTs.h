#ifndef __MPEGTS_H__
#define __MPEGTS_H__

// includes
#include "mpegTsStructs.h"
#include "dynamicBuffer.h"
#include "common.h"

// constants
#define TS_PACKET_LENGTH (188)
#define PAT_PID (0)
#define PES_MARKER (1)
#define MAX_PES_PAYLOAD (200 * 1024)

#define NO_TIMESTAMP (-1)
#define NO_OFFSET (0xff)

#define PTS_ONLY_PTS 0x2
#define PTS_BOTH_PTS 0x3
#define PTS_BOTH_DTS 0x1

#define STREAM_TYPE_AUDIO_AAC       0x0f
#define STREAM_TYPE_VIDEO_H264      0x1b

#define MIN_AUDIO_STREAM_ID (0xC0)
#define MAX_AUDIO_STREAM_ID (0xDF)

#define MIN_VIDEO_STREAM_ID (0xE0)
#define MAX_VIDEO_STREAM_ID (0xEF)

// typedefs
enum {
	MEDIA_TYPE_NONE,
	MEDIA_TYPE_AUDIO,
	MEDIA_TYPE_VIDEO,
	MEDIA_TYPE_COUNT,
};

typedef struct {
	int64_t pcr;
	int64_t pts;
	int64_t dts;
} timestamps_t;

typedef struct {
	uint8_t pcr;
	uint8_t pts;
	uint8_t dts;
} timestamp_offsets_t;

typedef struct {
	uint32_t media_type;
	uint32_t pos;					// file offset
	uint32_t duration;				// measured in 90KHz
	timestamps_t timestamps;		// measured in 90KHz
	timestamp_offsets_t timestamp_offsets;
	bool_t is_iframe;
} frame_info_t;

// functions
#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

int64_t get_pcr(const pcr_t* pcr);
void set_pcr(pcr_t* pcr, int64_t pcr_val);

int64_t get_pts(const pts_t* pts);
void set_pts(pts_t* pts, int indicator, int64_t pts_val);

void reset_timestamps(timestamps_t* timestamps);

void get_timestamp_offsets_and_stream_id(const byte_t* packet_start, timestamp_offsets_t* timestamp_offsets, byte_t* stream_id);

int64_t get_pts_from_packet(const byte_t* packet, size_t size);

byte_t* skip_adaptation_field(const mpeg_ts_header_t* ts_header);

bool_t get_pmt_program_pid(const byte_t* pat_start, const byte_t* packet_end, int* pmt_program_pid);

bool_t get_frames(
	dynamic_buffer_t* buffers_start,
	int buffer_count,
	char* frames_text,
	size_t frames_text_size, 
	frame_info_t** frames,
	int* frame_count, 
	bool_t use_first_pcr);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif // __MPEGTS_H__
