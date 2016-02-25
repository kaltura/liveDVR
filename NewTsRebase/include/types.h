/*
 * This file is part of the id3v2lib library
 *
 * Copyright (c) 2013, Lorenzo Ruiz
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

#ifndef id3v2lib_types_h
#define id3v2lib_types_h

#include "constants.h"


typedef struct
{
    char tag[ID3_HEADER_TAG];
    char major_version;
    char minor_version;
    char flags;
    int tag_size;
} ID3v2_header;

typedef struct
{
    char frame_id[ID3_FRAME_ID];
    char frame_encoding;
    int size;
    char flags[ID3_FRAME_FLAGS];
    char* data;
} ID3v2_frame;

typedef struct _ID3v2_frame_list
{
    ID3v2_frame* frame;
    struct _ID3v2_frame_list* start;
    struct _ID3v2_frame_list* next;
} ID3v2_frame_list;

typedef struct
{
    char* raw;
    ID3v2_header* tag_header;
    ID3v2_frame_list* frames;
} ID3v2_tag;

typedef struct ID3v2_struct
{
    long PTS;
    long UnixTimeStamp;
    char* objectType;
    struct ID3v2_struct* next;
} ID3v2_struct;

// Constructor functions
ID3v2_header* new_header();
ID3v2_tag* new_tag();
ID3v2_frame* new_frame();
ID3v2_frame_list* new_frame_list();
ID3v2_struct* new_ID3v2_struct();

void add_to_list(ID3v2_frame_list* list, ID3v2_frame* frame);
void add_list_ID3_struct(ID3v2_struct** list, ID3v2_struct* obj);
void free_tag(ID3v2_tag* tag);
void free_list_ID3_struct(ID3v2_struct* head);


#endif
