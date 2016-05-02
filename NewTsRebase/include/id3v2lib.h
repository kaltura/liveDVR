/*
 * This file is part of the id3v2lib library
 *
 * Copyright (c) 2013, Lorenzo Ruiz
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

#ifndef id3v2lib_id3v2lib_h
#define id3v2lib_id3v2lib_h

#include "types.h"
#include "constants.h"
#include "header.h"
#include "frame.h"
#include "utils.h"

//TODO change function name
ID3v2_tag* load_tag_with_buffer(char* buffer, int length);

#endif
