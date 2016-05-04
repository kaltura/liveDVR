#include "ts_rebase_impl.h"
#include "constants.h"
#include <stdbool.h>

static int
ts_rebase_get_main_pid_from_pmt(
	const u_char* packet_offset,
	const u_char* packet_end)
{
	const pmt_t* pmt_header;
	const pmt_entry_t* pmt_entry;
	const byte_t* end_offset;
	int result = 0;

	// extract the pmt header
	if (packet_offset + sizeof_pmt > packet_end)
	{
		return 0;
	}

	pmt_header = (const pmt_t*)packet_offset;
	packet_offset += sizeof_pmt + pmt_get_programInfoLength(pmt_header);
	if (packet_offset > packet_end)
	{
		return 0;
	}

	// Note: sectionLength is the number of bytes following the sectionLength field inc. the CRC
	//		since sectionLength ends at offset 4 and the CRC is 4 bytes, end_offset below will point
	//		to the beginning of the CRC
	end_offset = pmt_header + pmt_get_sectionLength(pmt_header);

	while (packet_offset < end_offset)
	{
		// extract the pmt entry
		if (packet_offset + sizeof_pmt_entry > packet_end)
		{
			return 0;
		}
		pmt_entry = (const pmt_entry_t*)packet_offset;
		packet_offset += sizeof_pmt_entry + pmt_entry_get_esInfoLength(pmt_entry);
		if (packet_offset > packet_end)
		{
			return 0;
		}

		switch (pmt_entry_get_streamType(pmt_entry))
		{
		case STREAM_TYPE_AUDIO_AAC:
			result = pmt_entry_get_elementaryPID(pmt_entry);
			break;

		case STREAM_TYPE_VIDEO_H264:
			return pmt_entry_get_elementaryPID(pmt_entry);
		}
	}

	return result;
}

 int
ts_rebase_find_main_pid(const u_char* buffer, size_t size)
{
	const mpeg_ts_header_t* ts_header;
	const u_char* cur_pos;
	const u_char* end_pos;
	const u_char* packet_end;
	const u_char* packet_offset;
	int cur_pid;
	int pmt_program_pid = 0;

	end_pos = buffer + size - TS_PACKET_LENGTH;

	for (cur_pos = buffer; cur_pos <= end_pos; cur_pos = packet_end)
	{
		// extract the current PID
		ts_header = (const mpeg_ts_header_t*)cur_pos;
		cur_pid = mpeg_ts_header_get_PID(ts_header);
		packet_end = cur_pos + TS_PACKET_LENGTH;

		// skip the adaptation field if present
		packet_offset = skip_adaptation_field(ts_header);
		if (packet_offset == NULL)
		{
			return 0;
		}

		if (cur_pid == PAT_PID)
		{
			if (!get_pmt_program_pid(packet_offset, packet_end, &pmt_program_pid))
			{
				return 0;
			}
		}
		else if (cur_pid == pmt_program_pid)
		{
			return ts_rebase_get_main_pid_from_pmt(packet_offset, packet_end);
		}
	}

	return 0;
}

 void
ts_rebase_get_stream_frames_info(
	const u_char* buffer,
	size_t size,
	int pid, 
	uint32_t* frame_count,
	int64_t* first_frame_dts,
	int64_t* last_frame_dts)
{
	timestamp_offsets_t timestamp_offsets;
	const u_char* cur_pos;
	const u_char* end_pos;
	int64_t timestamp;
	byte_t ignore;

	*frame_count = 0;

	end_pos = buffer + size - TS_PACKET_LENGTH;

	for (cur_pos = buffer; cur_pos <= end_pos; cur_pos += TS_PACKET_LENGTH)
	{
		if (mpeg_ts_header_get_PID(cur_pos) != pid)
		{
			continue;
		}

		if (!mpeg_ts_header_get_payloadUnitStartIndicator(cur_pos))
		{
			continue;
		}

		get_timestamp_offsets_and_stream_id(cur_pos, &timestamp_offsets, &ignore);
		if (timestamp_offsets.pts == NO_OFFSET)
		{
			continue;
		}

		if (timestamp_offsets.dts != NO_OFFSET)
		{
			timestamp = get_pts(cur_pos + timestamp_offsets.dts);
		}
		else
		{
			timestamp = get_pts(cur_pos + timestamp_offsets.pts);
		}

		if (*frame_count == 0)
		{
			*first_frame_dts = timestamp;
		}
		*last_frame_dts = timestamp;
		(*frame_count)++;
	}
}

static void
ts_rebase_shift_timestamps(
	u_char* buffer,
	size_t size,
	int64_t diff)
{
	timestamp_offsets_t timestamp_offsets;
	u_char* cur_offset;
	u_char* cur_pos;
	u_char* end_pos;
	byte_t ignore;
	int indicator;

	end_pos = buffer + size - TS_PACKET_LENGTH;

	for (cur_pos = buffer; cur_pos <= end_pos; cur_pos += TS_PACKET_LENGTH)
	{
		if (!mpeg_ts_header_get_adaptationFieldExist(cur_pos) &&
			!mpeg_ts_header_get_payloadUnitStartIndicator(cur_pos))
		{
			continue;
		}

		get_timestamp_offsets_and_stream_id(cur_pos, &timestamp_offsets, &ignore);
		
		if (timestamp_offsets.pcr != NO_OFFSET)
		{
			cur_offset = cur_pos + timestamp_offsets.pcr;
			set_pcr(cur_offset, get_pcr(cur_offset) + diff);
		}

		if (timestamp_offsets.pts != NO_OFFSET)
		{
			cur_offset = cur_pos + timestamp_offsets.pts;
			indicator = timestamp_offsets.dts != NO_OFFSET ? PTS_BOTH_PTS : PTS_ONLY_PTS;
			set_pts(cur_offset, indicator, get_pts(cur_offset) + diff);
		}

		if (timestamp_offsets.dts != NO_OFFSET)
		{
			cur_offset = cur_pos + timestamp_offsets.dts;
			set_pts(cur_offset, PTS_BOTH_DTS, get_pts(cur_offset) + diff);
		}
	}
}

void 
ts_rebase_impl(
	ts_rebase_context_t* context,
	u_char* buffer, 
	size_t size, 
	uint64_t* duration,
    bool universal_timestamp)
{
	uint32_t frame_count;
    int64_t corrected_dts;
	int64_t first_frame_dts = 0;
	int64_t last_frame_dts = 0;
	int main_pid;
	
	*duration = 0;

	if (size < TS_PACKET_LENGTH)
	{
		return;
	}
	
	main_pid = ts_rebase_find_main_pid(buffer, size);
	if (main_pid == 0)
	{
		return;
	}

	ts_rebase_get_stream_frames_info(
		buffer,
		size,
		main_pid,
		&frame_count,
		&first_frame_dts,
		&last_frame_dts);
	context->original_first_frame_dts = first_frame_dts;
	if (frame_count == 0)
	{
		return;
	}
    
    if (!universal_timestamp  && context->expected_dts != NO_TIMESTAMP)
    {
        corrected_dts = first_frame_dts + context->correction;
        
        if (((context->expected_dts - corrected_dts) & TIMESTAMP_MASK) > REBASE_THRESHOLD &&
            ((corrected_dts - context->expected_dts) & TIMESTAMP_MASK) > REBASE_THRESHOLD)
        {
            context->correction = context->expected_dts - first_frame_dts;
        }
    }
    
	if (context->correction != 0)
	{
		ts_rebase_shift_timestamps(
			buffer,
			size,
			context->correction);
			
		first_frame_dts += context->correction;
		last_frame_dts += context->correction;
	}

	context->total_frame_durations += (last_frame_dts - first_frame_dts) & TIMESTAMP_MASK;
	context->total_frame_count += frame_count - 1;
	context->expected_dts = last_frame_dts;
	if (context->total_frame_count > 0)
	{
		context->expected_dts += context->total_frame_durations / context->total_frame_count;
	}

	*duration = (context->expected_dts - first_frame_dts) & TIMESTAMP_MASK;
}
