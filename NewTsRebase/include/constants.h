/*
 * This file is part of the id3v2lib library
 *
 * Copyright (c) 2013, Lorenzo Ruiz
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

#ifndef id3v2lib_constants_h
#define id3v2lib_constants_h

/**
 * TAG_HEADER CONSTANTS
 */
#define ID3_HEADER 10
#define ID3_HEADER_TAG 3
#define ID3_HEADER_VERSION 1
#define ID3_HEADER_REVISION 1
#define ID3_HEADER_FLAGS 1
#define ID3_HEADER_SIZE 4

#define NO_COMPATIBLE_TAG 0
#define ID3v23  1
#define ID3v24  2
// END TAG_HEADER CONSTANTS

/**
 * TAG_FRAME CONSTANTS
 */
#define ID3_FRAME 10
#define ID3_FRAME_ID 4
#define ID3_FRAME_SIZE 4
#define ID3_FRAME_FLAGS 2
#define ID3_FRAME_ENCODING 1
#define ID3_FRAME_LANGUAGE 3
#define ID3_FRAME_SHORT_DESCRIPTION 1

#define INVALID_FRAME 0
#define TEXT_FRAME 1
#define COMMENT_FRAME 2
#define APIC_FRAME 3

#define ISO_ENCODING 0
#define UTF_16_ENCODING 1
// END TAG_FRAME CONSTANTS


#define TIMESTAMP_MASK (0x1ffffffff)	// 33 bits
#define REBASE_THRESHOLD (22500)		// 1/4 sec



//Encoding types:
#define UTF16 0x01
#define UTF16BE 0x02
#define UTF8 0x03
// END APIC FRAME CONSTANTS

#endif
