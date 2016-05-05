#include <stdlib.h>
#include <string.h>
#include "mpegTs.h"

#define MIN_PAT_SECTION_LENGTH (5 + 4)			// 5 bytes after the section length + 4 bytes crc at the end

int64_t 
get_pcr(const pcr_t* pcr)
{
	return (((int64_t)pcr_get_pcr90kHzHigh(pcr)) << 16) | pcr_get_pcr90kHzLow(pcr);
}

void 
set_pcr(pcr_t* pcr, int64_t pcr_val)
{
	pcr[4] = pcr[5] = 0;
	pcr_set_pcr90kHzHigh(pcr, 	(pcr_val >> 16));
	pcr_set_pcr90kHzLow	(pcr, 	 pcr_val 	   );
}

int64_t 
get_pts(const pts_t* pts)
{
	return (((int64_t)pts_get_high(pts)) << 30) | (((int64_t)pts_get_medium(pts)) << 15) | (int64_t)pts_get_low(pts);
}

void 
set_pts(pts_t* pts, int indicator, int64_t pts_val)
{
	pts[0] = pts[2] = pts[4] = 0xff;
	pts_set_pad1	(pts,	indicator);
	pts_set_high	(pts, 	(pts_val >> 30));
	pts_set_medium	(pts,	(pts_val >> 15));
	pts_set_low		(pts, 	 pts_val	   );
}

void 
get_timestamp_offsets_and_stream_id(const byte_t* packet_start, timestamp_offsets_t* timestamp_offsets, byte_t* stream_id)
{
	const byte_t* packet_offset = packet_start;
	const byte_t* packet_end = packet_offset + TS_PACKET_LENGTH;
	const mpeg_ts_header_t* ts_header;
	const mpeg_ts_adaptation_field_t* adapt_field;
	size_t adapt_size;
	const pes_optional_header_t* pes_optional_header;

	timestamp_offsets->pcr = NO_OFFSET;
	timestamp_offsets->pts = NO_OFFSET;
	timestamp_offsets->dts = NO_OFFSET;
	
	ts_header = packet_offset;
	packet_offset += sizeof_mpeg_ts_header;
	if (mpeg_ts_header_get_adaptationFieldExist(ts_header))
	{
		adapt_field = (const mpeg_ts_adaptation_field_t*)packet_offset;
		adapt_size = 1 + mpeg_ts_adaptation_field_get_adaptationFieldLength(adapt_field);
		
		if (mpeg_ts_adaptation_field_get_pcrFlag(adapt_field) && adapt_size >= sizeof_mpeg_ts_adaptation_field + sizeof_pcr)
		{			
			timestamp_offsets->pcr = packet_offset + sizeof_mpeg_ts_adaptation_field - packet_start;
		}

		packet_offset += adapt_size;
	}
	
	if (mpeg_ts_header_get_payloadUnitStartIndicator(ts_header) &&
		packet_offset + sizeof_pes_header + sizeof_pes_optional_header + sizeof_pts < packet_end &&
		pes_header_get_prefix(packet_offset) == PES_MARKER)
	{
		*stream_id = pes_header_get_streamId(packet_offset);
		packet_offset += sizeof_pes_header;
		pes_optional_header = packet_offset;
		packet_offset += sizeof_pes_optional_header;

		if (pes_optional_header_get_ptsFlag(pes_optional_header))
		{
			timestamp_offsets->pts = packet_offset - packet_start;
			packet_offset += sizeof_pts;
			if (pes_optional_header_get_dtsFlag(pes_optional_header) && 
				packet_offset + sizeof_pts < packet_end)
			{
				timestamp_offsets->dts = packet_offset - packet_start;
			}
		}
	}
}

void 
reset_timestamps(timestamps_t* timestamps)
{
	timestamps->pcr = NO_TIMESTAMP;
	timestamps->pts = NO_TIMESTAMP;
	timestamps->dts = NO_TIMESTAMP;
}

int64_t 
get_pts_from_packet(const byte_t* packet_offset, size_t size)
{
	const byte_t* packet_end = packet_offset + size;
	const pes_optional_header_t* pes_optional_header;

	if (packet_offset + sizeof_pes_header + sizeof_pes_optional_header + sizeof_pts < packet_end &&
		pes_header_get_prefix(packet_offset) == PES_MARKER)
	{
		packet_offset += sizeof_pes_header;
		pes_optional_header = packet_offset;
		packet_offset += sizeof_pes_optional_header;

		if (pes_optional_header_get_ptsFlag(pes_optional_header))
		{
			return get_pts(packet_offset);
		}
	}
	return NO_TIMESTAMP;
}

static void 
enable_iframe(frame_info_t* frames, int frame_count, int frame_pos)
{
	int mid_value;
	int left;
	int right;
	int mid;

	// perform binary search for the frame according to the position
	left = 0;
	right = frame_count - 1;
	while (left <= right)
	{
		mid = (left + right) / 2;
		mid_value = frames[mid].pos;
		if (mid_value < frame_pos)
		{
			left = mid + 1;
		}
		else if (mid_value > frame_pos)
		{
			right = mid - 1;
		}
		else
		{
			frames[mid].is_iframe = TRUE;
			break;
		}
	}
}

static void 
parse_ffprobe_output(char* input_buffer, size_t length, frame_info_t* frames, int frame_count)
{
	char* new_line_pos;
	char* cur_pos;
	char* end_pos = input_buffer + length;
	int frame_pos = 0;
	bool_t is_iframe = FALSE;

	// only thing extracted from ffprobe is the key frames
	for (cur_pos = input_buffer; cur_pos < end_pos; cur_pos = new_line_pos + 1)
	{
		new_line_pos = (char*)memchr(cur_pos, '\n', end_pos - cur_pos);
		if (new_line_pos == NULL)
		{
			break;
		}
		
		*new_line_pos = '\0';
		
		if (STARTS_WITH_STATIC(cur_pos, "[PACKET]"))
		{
			frame_pos = 0;
			is_iframe = FALSE;
		}
		else if (STARTS_WITH_STATIC(cur_pos, "[/PACKET]"))
		{
			if (is_iframe && frame_pos > 0)
			{
				enable_iframe(frames, frame_count, frame_pos);
			}
		}
		else if (STARTS_WITH_STATIC(cur_pos, "flags=K"))
		{
			is_iframe = TRUE;
		}
		else if (STARTS_WITH_STATIC(cur_pos, "pos="))
		{
			frame_pos = atoi(cur_pos + sizeof("pos=") - 1);
		}		
	}
}

byte_t*
skip_adaptation_field(const mpeg_ts_header_t* ts_header)
{
	const mpeg_ts_adaptation_field_t* adapt_field;
	byte_t* packet_offset;

	packet_offset = (byte_t*)ts_header + sizeof_mpeg_ts_header;
	
	if (mpeg_ts_header_get_adaptationFieldExist(ts_header))
	{
		adapt_field = (mpeg_ts_adaptation_field_t*)packet_offset;
		packet_offset += 1 + mpeg_ts_adaptation_field_get_adaptationFieldLength(adapt_field);
		if (packet_offset > (byte_t*)ts_header + TS_PACKET_LENGTH)
		{
			return NULL;
		}
	}
	
	return packet_offset;
}

bool_t
get_pmt_program_pid(const byte_t* pat_start, const byte_t* packet_end, int* pmt_program_pid)
{
	const byte_t* packet_offset = pat_start;
	const pat_entry_t* pat_entry;
	const pat_t* pat_header;
	size_t pat_entry_count;
	size_t i;

	*pmt_program_pid = 0;
	
	// extract the pat header
	if (packet_offset + sizeof_pat > packet_end)
	{
		return FALSE;
	}			
	pat_header = (const pat_t*)packet_offset;
	packet_offset += sizeof_pat;
	
	// get the pat entry count
	if (pat_get_sectionLength(pat_header) < MIN_PAT_SECTION_LENGTH)
	{
		return FALSE;
	}
	pat_entry_count = (pat_get_sectionLength(pat_header) - MIN_PAT_SECTION_LENGTH) / sizeof_pat_entry;
	
	for (i = 0; i < pat_entry_count; i++)
	{
		// extract the pat entry
		if (packet_offset + sizeof_pat_entry > packet_end)
		{
			return FALSE;
		}
		pat_entry = (const pat_entry_t*)packet_offset;
		packet_offset += sizeof_pat_entry;
		
		// if the program number is 1, the PID is PID of the PMT
		if (pat_entry_get_programNumber(pat_entry) == 1)
		{
			*pmt_program_pid = pat_entry_get_programPID(pat_entry);
		}
	}
	return TRUE;
}

typedef struct {
	int index;
	int64_t pts;
} frame_pts_t;

static int 
compare_frame_pts_timestamps(const void* frame1, const void* frame2)
{
	return ((frame_pts_t*)frame1)->pts - ((frame_pts_t*)frame2)->pts;
}

static bool_t 
set_frame_durations(frame_info_t* frames, int frame_count)
{
	frame_info_t* last_frame[MEDIA_TYPE_COUNT];
	frame_info_t* cur_frame;
	frame_pts_t* frame_ptss;
	frame_pts_t* frame_ptss_end;
	frame_pts_t* cur_pts;
	uint32_t total_durations[MEDIA_TYPE_COUNT];
	int frame_counts[MEDIA_TYPE_COUNT];
	int i;
	
	// sort the frames according to pts
	frame_ptss = malloc(sizeof(frame_ptss[0]) * frame_count);
	if (frame_ptss == NULL)
	{
		return FALSE;
	}
	
	for (i = 0; i < frame_count; i++)
	{
		frame_ptss[i].index = i;
		frame_ptss[i].pts = frames[i].timestamps.pts;
	}

	qsort(frame_ptss, frame_count, sizeof(frame_ptss[0]), &compare_frame_pts_timestamps);
	
	// within each media type set the duration to the diff in pts
	memset(&last_frame, 0, sizeof(last_frame));
	memset(&total_durations, 0, sizeof(total_durations));
	memset(&frame_counts, 0, sizeof(frame_counts));
	
	frame_ptss_end = frame_ptss + frame_count;
	for (cur_pts = frame_ptss; cur_pts < frame_ptss_end; cur_pts++)
	{
		cur_frame = &frames[cur_pts->index];
		if (last_frame[cur_frame->media_type] != NULL)
		{
			last_frame[cur_frame->media_type]->duration = cur_frame->timestamps.pts - last_frame[cur_frame->media_type]->timestamps.pts;
			total_durations[cur_frame->media_type] += last_frame[cur_frame->media_type]->duration;
			frame_counts[cur_frame->media_type]++;
		}
		last_frame[cur_frame->media_type] = cur_frame;
	}
	
	// set the duration of the last frames to the average duration
	for (i = 0; i < MEDIA_TYPE_COUNT; i++)
	{
		if (last_frame[i] != NULL && frame_counts[i] > 0)
		{
			last_frame[i]->duration = total_durations[i] / frame_counts[i];
		}
	}
	
	free(frame_ptss);
	
	return TRUE;
}

bool_t 
get_frames(
	dynamic_buffer_t* buffers_start,
	int buffer_count,
	char* frames_text,
	size_t frames_text_size, 
	frame_info_t** frames,
	int* frame_count, 
	bool_t use_first_pcr)
{
	timestamp_offsets_t timestamp_offsets;
	dynamic_buffer_t* buffers_end = buffers_start + buffer_count;
	dynamic_buffer_t* buffers;
	dynamic_buffer_t result = { NULL, 0, 0 };
	frame_info_t frame_info;
	frame_info_t* last_frame;
	byte_t stream_id;
	byte_t* data_end;
	byte_t* data_cur;
	bool_t has_frame;
	uint32_t cur_pos = 0;
	
	*frame_count = 0;
	memset(&frame_info, 0, sizeof(frame_info));
	
	for (buffers = buffers_start; buffers < buffers_end; buffers++)
	{
		has_frame = FALSE;
		
		data_end = buffers->data + buffers->write_pos - TS_PACKET_LENGTH;
		for (data_cur = buffers->data; data_cur <= data_end; data_cur += TS_PACKET_LENGTH, cur_pos += TS_PACKET_LENGTH)
		{
			get_timestamp_offsets_and_stream_id(data_cur, &timestamp_offsets, &stream_id);
			if (timestamp_offsets.pts != NO_OFFSET)
			{
				// determine the media type according to the stream id
				if (stream_id >= MIN_VIDEO_STREAM_ID && stream_id <= MAX_VIDEO_STREAM_ID)
				{
					frame_info.media_type = MEDIA_TYPE_VIDEO;
				}
				else if (stream_id >= MIN_AUDIO_STREAM_ID && stream_id <= MAX_AUDIO_STREAM_ID)
				{
					frame_info.media_type = MEDIA_TYPE_AUDIO;
				}
				else
				{
					continue;
				}
				
				// initialize the timestamps
				frame_info.timestamps.pcr = NO_TIMESTAMP;
				frame_info.timestamps.pts = get_pts(data_cur + timestamp_offsets.pts);
				if (timestamp_offsets.dts != NO_OFFSET)
				{
					frame_info.timestamps.dts = get_pts(data_cur + timestamp_offsets.dts);
				}
				else
				{
					frame_info.timestamps.dts = frame_info.timestamps.pts;
				}

				// append the frame
				frame_info.pos = cur_pos;
				frame_info.timestamp_offsets = timestamp_offsets;
								
				if (!append_buffer(&result, &frame_info, sizeof(frame_info)))
				{
					goto error;
				}
				(*frame_count)++;
				
				has_frame = TRUE;
			}

			// update the pcr of the frame
			// Note: the pcr does not necessarily appear on the first frame packet
			if (has_frame && timestamp_offsets.pcr != NO_OFFSET)
			{
				last_frame = ((frame_info_t*)(result.data + result.write_pos)) - 1;
				if (last_frame->timestamps.pcr == NO_TIMESTAMP || !use_first_pcr)
				{
					last_frame->timestamps.pcr = get_pcr(data_cur + timestamp_offsets.pcr);
				}
			}
		}
	}
	
	// mark the key frames according to ffprobe output
	parse_ffprobe_output(frames_text, frames_text_size, (frame_info_t*)result.data, *frame_count);
	
	// set the durations of the frames
	if (!set_frame_durations((frame_info_t*)result.data, *frame_count))
	{
		goto error;
	}

	*frames = (frame_info_t*)result.data;

	return TRUE;
	
error:

	free_buffer(&result);
	
	return FALSE;
}
