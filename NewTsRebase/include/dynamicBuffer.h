#ifndef __DYNAMICBUFFER_H__
#define __DYNAMICBUFFER_H__

// includes
#include "common.h"

// typedefs
typedef struct {
	byte_t* data;
	size_t write_pos;
	size_t alloc_size;
} dynamic_buffer_t;

// functions
#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

bool_t append_buffer(dynamic_buffer_t* buf, const void* data, size_t len);

bool_t alloc_buffer_space(dynamic_buffer_t* buf, size_t len);

bool_t resize_buffer(dynamic_buffer_t* buf, size_t len);

void free_buffer(dynamic_buffer_t* buf);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif // __DYNAMICBUFFER_H__
