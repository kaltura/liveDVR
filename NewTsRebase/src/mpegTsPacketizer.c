#include <stdlib.h>
#include <string.h>
#include "mpegTsPacketizer.h"
#include "mpegTs.h"
#include "constants.h"
#include "id3v2lib.h"


ID3v2_struct* parse_json(char * json){
    const char * regex_objectType="\"objectType\":\"(.*)\",";
    const char * regex_timestamp="\"timestamp\":(.*)}";
    const char * find_text=json;
    ID3v2_struct* ID3v2_struct_t=new_ID3v2_struct();
    if (ID3v2_struct_t==NULL){
        puts("failed to allocate memory for ID3v2 struct.\n");
        return NULL;
    }
    ID3v2_struct_t->objectType=match_regex(regex_objectType, find_text);
    char *UnixTimeStamp_string=match_regex(regex_timestamp, find_text);
	if (ID3v2_struct_t->objectType == NULL || *UnixTimeStamp_string == NULL){
		return NULL;
	}
   ID3v2_struct_t->UnixTimeStamp = (long)strtold(UnixTimeStamp_string, NULL);
   free(UnixTimeStamp_string);
   if (ID3v2_struct_t->UnixTimeStamp == 0){
	   return NULL;
   }
   return ID3v2_struct_t;
}
static void
ParseID3Tag(void* context, const byte_t* buf, size_t size, int64_t pts, ID3v2_struct** ID3v2_struct_list_p)
{
    ID3v2_tag* tag= load_tag_with_buffer((char *)buf,(int)size);
    if (tag!=NULL)
    {
		ID3v2_frame_list* frame;
		for (frame = tag->frames->start; frame != NULL; frame = frame->next){
            ID3v2_frame* frameObj=frame->frame;
            ID3v2_struct* ID3v2_struct_t=parse_json(frameObj->data);
            if (ID3v2_struct_t!=NULL){
                ID3v2_struct_t->PTS=pts;
                add_list_ID3_struct(ID3v2_struct_list_p,ID3v2_struct_t);
            }
        }
        free_tag(tag);
    }
}

void ts_packetizer_init(ts_packetizer_state_t* state)
{
	memset(state, 0, sizeof(*state));
}

bool_t ts_packetizer_process_data(ts_packetizer_state_t* state, const byte_t* packet_offset, size_t size,ID3v2_struct** ID3v2_struct_list_p)
{
	const byte_t* packet_end = packet_offset + size;
	const pes_optional_header_t* pes_optional_header;
	const pes_header_t* pes_header;
	size_t copy_size;

	// check whether we have a PES packet
	if (!state->in_packet &&
		packet_offset + sizeof_pes_header + sizeof_pes_optional_header < packet_end &&
		pes_header_get_prefix(packet_offset) == PES_MARKER)
	{
		// skip the PES header and optional header
		pes_header = packet_offset;
		packet_offset += sizeof_pes_header;
		pes_optional_header = packet_offset;
		packet_offset += sizeof_pes_optional_header;
		if (pes_optional_header_get_ptsFlag(pes_optional_header) && packet_offset + sizeof_pts <= packet_end)
		{
			state->pts = get_pts(packet_offset);
		}
		else
		{
			state->pts = NO_TIMESTAMP;
		}
		packet_offset += pes_optional_header_get_pesHeaderLength(pes_optional_header);
		if (packet_offset > packet_end)
		{
			return FALSE;
		}
		
		state->packet_size = pes_header_get_pesPacketLength(pes_header) - 
			sizeof_pes_optional_header - 
			pes_optional_header_get_pesHeaderLength(pes_optional_header);
		
		if (state->packet_size > 0 && state->packet_size < MAX_PES_PAYLOAD)
		{
			// initialize the state for a packet
			state->packet_buffer = (byte_t*)malloc(state->packet_size);
			if (state->packet_buffer == NULL)
			{
				return FALSE;
			}
			state->packet_pos = state->packet_buffer;
			state->size_left = state->packet_size;
			state->in_packet = TRUE;
		}
	}
	
	if (state->in_packet)
	{
		// copy to the packet buffer
		copy_size = MIN(state->size_left, (size_t)(packet_end - packet_offset));
		memcpy(state->packet_pos, packet_offset, copy_size);
		state->packet_pos += copy_size;
		state->size_left -= copy_size;
		
		if (state->size_left <= 0)
		{
            ParseID3Tag(
                         state->callback_context,
                         state->packet_buffer,
                         state->packet_size,
                         state->pts,
                         ID3v2_struct_list_p);
			free(state->packet_buffer);
			state->packet_buffer = NULL;
			state->in_packet = FALSE;
		}
	}
	
	return TRUE;
}

void ts_packetizer_free(ts_packetizer_state_t* state)
{
	free(state->packet_buffer);
}

bool_t walk_ts_streams(
	const byte_t* data, 
	size_t size, 
	pmt_header_callback_t pmt_header_callback,
	pmt_entry_callback_t pmt_entry_callback,
	packet_data_callback_t packet_data_callback,
	void* callback_context,
    ID3v2_struct** ID3v2_struct_list_p)
{
	const byte_t* end_data = data + size - TS_PACKET_LENGTH;
	const byte_t* packet_offset;
	const byte_t* packet_end;
	const byte_t* cur_data;
	int cur_pid;
	int pmt_program_pid = 0;
	const mpeg_ts_header_t* ts_header;
	const pmt_t* pmt_header;
	const pmt_entry_t* pmt_entry;
	const byte_t* end_offset;
	
	for (cur_data = data; cur_data <= end_data; cur_data += TS_PACKET_LENGTH)
	{
		// extract the current PID
		ts_header = (const mpeg_ts_header_t*)cur_data;				
		cur_pid = mpeg_ts_header_get_PID(ts_header);
		packet_end = cur_data + TS_PACKET_LENGTH;
		
		// skip the adaptation field if present
		packet_offset = skip_adaptation_field(ts_header);
		if (packet_offset == NULL)
		{
			return FALSE;
		}
		
		if (cur_pid == PAT_PID)
		{
			if (!get_pmt_program_pid(packet_offset, packet_end, &pmt_program_pid))
			{
				return FALSE;
			}
		}
		else if (cur_pid == pmt_program_pid)
		{			
			// extract the pmt header
			if (packet_offset + sizeof_pmt > packet_end)
			{
				return FALSE;
			}
			pmt_header = (const pmt_t*)packet_offset;
			packet_offset += sizeof_pmt + pmt_get_programInfoLength(pmt_header);
			if (packet_offset > packet_end)
			{
				return FALSE;
			}
		
			// call the pmt header callback - initialize
			pmt_header_callback(callback_context, pmt_header);
			
			// Note: sectionLength is the number of bytes following the sectionLength field inc. the CRC
			//		since sectionLength ends at offset 4 and the CRC is 4 bytes, end_offset below will point
			//		to the beginning of the CRC
			end_offset = pmt_header + pmt_get_sectionLength(pmt_header);
			
			while (packet_offset < end_offset)
			{
				// extract the pmt entry
				if (packet_offset + sizeof_pmt_entry > packet_end)
				{
					return FALSE;
				}
				pmt_entry = (const pmt_entry_t*)packet_offset;
				packet_offset += sizeof_pmt_entry + pmt_entry_get_esInfoLength(pmt_entry);
				if (packet_offset > packet_end)
				{
					return FALSE;
				}

				// call the pmt entry callback
				pmt_entry_callback(callback_context, pmt_entry, packet_offset - pmt_entry);
			}
		}
		else
		{
			// call the data callback
            if (!packet_data_callback(callback_context, cur_pid, packet_offset, cur_data + TS_PACKET_LENGTH - packet_offset, ID3v2_struct_list_p))
			{
				return FALSE;
			}
		}
	}
	return TRUE;
}
