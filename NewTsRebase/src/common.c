#include <string.h>
#include "common.h"

bool_t 
search_pattern(const byte_t* buffer, size_t size, const byte_t* pattern, size_t pattern_size)
{
	const byte_t* buffer_end = buffer + size;

	for (; buffer + pattern_size <= buffer_end; buffer++)
	{
		if (memcmp(buffer, pattern, pattern_size) == 0)
		{
			return TRUE;
		}
	}
	return FALSE;
}
