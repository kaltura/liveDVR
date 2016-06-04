#ifndef __COMMON_H__
#define __COMMON_H__

// includes
#include <stddef.h>
#include <stdint.h>

// macros
#define PS(x) &x, sizeof(x)
#define STARTS_WITH_STATIC(str, prefix) (strncmp(str, prefix, sizeof(prefix) - 1) == 0)
#define MAX(x,y) (((x) > (y)) ? (x) : (y))
#define MIN(x,y) (((x) < (y)) ? (x) : (y))
#define ARRAY_ENTRIES(x) (sizeof(x) / sizeof(x[0]))
#define DIV_CEIL(x, y) (((x) + (y) - 1) / (y))

#ifndef TRUE
#define TRUE (1)
#endif

#ifndef FALSE
#define FALSE (0)
#endif

// typedefs
typedef unsigned char byte_t;
typedef int bool_t;

// functions
#ifdef __cplusplus
extern "C" {
#endif /* __cplusplus */

bool_t search_pattern(const byte_t* buffer, size_t size, const byte_t* pattern, size_t pattern_size);

#ifdef __cplusplus
}
#endif /* __cplusplus */

#endif // __COMMON_H__
