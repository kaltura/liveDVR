/*
 * This file is part of the id3v2lib library
 *
 * Copyright (c) 2013, Lorenzo Ruiz
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "id3v2lib.h"



ID3v2_tag* load_tag_with_buffer(char *bytes, int length)
{
    // Declaration
    ID3v2_tag* tag;
    ID3v2_header* tag_header;

    // Initialization
    tag = new_tag();
    if (tag==NULL){
        return NULL;
    }
    tag_header = get_tag_header_with_buffer(bytes, length);

    if(tag_header == NULL ||
       get_tag_version(tag_header) == NO_COMPATIBLE_TAG)
    {
        // No compatible ID3 tag in the file, or we got some problem allocation memory
        free_tag(tag);
        return NULL;
    }
    
    // Associations
    tag->tag_header = tag_header;

    tag->raw = (char*) malloc(tag->tag_header->tag_size * sizeof(char));
    if (tag->raw==NULL)
    {
        // No compatible ID3 tag in the file, or we got some problem allocation memory
        free_tag(tag);
        return NULL;
    }
    memcpy(tag->raw, bytes+ID3_HEADER, tag->tag_header->tag_size);
    int payload_size= tag->tag_header->tag_size-ID3_HEADER;
    int offset = 0;
    while(offset <payload_size)
    {
        ID3v2_frame* frame;
        frame = parse_frame(tag->raw, offset, get_tag_version(tag_header));

        if(frame != NULL)
        {
            offset += frame->size;
            add_to_list(tag->frames, frame);
        }
        else
        {
            break;
        }
    }

    return tag;
}
