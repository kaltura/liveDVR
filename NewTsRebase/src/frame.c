/*
 * This file is part of the id3v2lib library
 *
 * Copyright (c) 2013, Lorenzo Ruiz
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#include "frame.h"
#include "utils.h"
#include "constants.h"




ID3v2_frame* parse_frame(char* bytes, int offset, int version)
{
    ID3v2_frame* frame = new_frame();
    if (frame==NULL){
        puts("failed to allocate memory for frame object. \n");
        return NULL;
    }
    // Parse frame header
    memcpy(frame->frame_id, bytes + offset, ID3_FRAME_ID);
    // Check if we are into padding
    if(memcmp(frame->frame_id, "\0\0\0\0", 4) == 0)
    {
        puts("something wrong with frame ID. \n");
        free(frame);
        return NULL;
    }

    frame->size = btoi(bytes, 4, offset += ID3_FRAME_ID);
    if(version == ID3v24)
    {
        frame->size = syncint_decode(frame->size);
    }

    memcpy(frame->flags, bytes + (offset += ID3_FRAME_SIZE), ID3_FRAME_FLAGS);
    

    offset += ID3_FRAME_FLAGS;
    char frame_encoding=*(bytes+offset);
    if (frame_encoding==0x00 || frame_encoding==0x01 || frame_encoding==0x02 || frame_encoding==0x03){
        frame->frame_encoding=frame_encoding;
        offset += ID3_HEADER_FLAGS;  
    }
    else{
        frame->frame_encoding=0x00;
    }
        // Load frame data
    frame->data = (char*) malloc(frame->size * sizeof(char*));
    if (frame->data==NULL){
        puts("failed to allocate memory for frame data. \n");
        free(frame);
    }
    memcpy(frame->data, bytes + offset , frame->size-1);
    return frame;
}


