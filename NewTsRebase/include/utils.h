/*
 * This file is part of the id3v2lib library
 *
 * Copyright (c) 2013, Lorenzo Ruiz
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */



#define MAX_ERROR_MSG 0x1000

#ifndef id3v2lib_utils_h
#define id3v2lib_utils_h

#include <inttypes.h>
#include <regex.h>
#include "types.h"

unsigned int btoi(char* bytes, int size, int offset);
char* itob(int integer);
int syncint_encode(int value);
int syncint_decode(int value);


// String functions
char * match_regex (const char *regex_key , const char * to_match);

#endif
