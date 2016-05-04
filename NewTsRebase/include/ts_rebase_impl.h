#ifndef __TS_REBASE_IMPL_H__
#define __TS_REBASE_IMPL_H__

// includes
#include <sys/types.h>
#include "mpegTs.h"
#include <stdbool.h>

// typedefs
#ifdef WIN32
typedef unsigned char   u_char;
#endif // WIN32

typedef struct
{
	int64_t expected_dts;
	uint64_t total_frame_durations;
	uint64_t total_frame_count;
	int64_t correction;
    int64_t id3_pts_diff;
	int64_t original_first_frame_dts;
    int64_t original_last_frame_dts;
} ts_rebase_context_t;

// functions
#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

void ts_rebase_impl(
	ts_rebase_context_t* context,
    uint64_t* duration,
	u_char* buffer,
	size_t size,
    int main_pid,
    uint32_t frame_count,
    int64_t first_frame_dts,
    int64_t last_frame_dts
   );

 void ts_rebase_get_stream_frames_info(
                                     const u_char* buffer,
                                     size_t size,
                                     int pid,
                                     uint32_t* frame_count,
                                     int64_t* first_frame_dts,
                                     int64_t* last_frame_dts);
    

int ts_rebase_find_main_pid(const u_char* buffer, size_t size);
#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif // __TS_REBASE_IMPL_H__
