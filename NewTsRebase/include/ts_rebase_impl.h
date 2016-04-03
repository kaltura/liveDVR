#ifndef __TS_REBASE_IMPL_H__
#define __TS_REBASE_IMPL_H__

// includes
#include <sys/types.h>
#include "mpegTs.h"

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
} ts_rebase_context_t;

// functions
#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

void ts_rebase_impl(
	ts_rebase_context_t* context,
	u_char* buffer,
	size_t size,
	uint64_t* duration);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif // __TS_REBASE_IMPL_H__
