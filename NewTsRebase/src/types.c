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

#include "types.h"

ID3v2_tag* new_tag()
{
    ID3v2_tag* tag = (ID3v2_tag*) malloc(sizeof(ID3v2_tag));        
    if (tag!=NULL){
        tag->frames = new_frame_list();
        if (tag->frames==NULL){
            free(tag);
            return NULL;
        }
    }
    return tag;
}

ID3v2_header* new_header()
{
    ID3v2_header* tag_header = (ID3v2_header*) malloc(sizeof(ID3v2_header));
    if(tag_header != NULL)
    {
        memset(tag_header->tag, '\0', ID3_HEADER_TAG);
        tag_header->minor_version = 0x00;
        tag_header->major_version = 0x00;
        tag_header->flags = 0x00;
        memset(tag_header->tag, 0, ID3_HEADER_SIZE);
    }
    
    return tag_header;
}

ID3v2_frame* new_frame()
{
    ID3v2_frame* frame = (ID3v2_frame*) malloc(sizeof(ID3v2_frame));
    return frame;
}

ID3v2_frame_list* new_frame_list()
{
    ID3v2_frame_list* list = (ID3v2_frame_list*) malloc(sizeof(ID3v2_frame_list));
    if(list != NULL)
    {
        list->frame = NULL;
        list->next = NULL;
        list->start = NULL;
    }
    return list;
}
ID3v2_struct* new_ID3v2_struct(){
     ID3v2_struct* ID3v2_struct_t=(ID3v2_struct*) malloc(sizeof(ID3v2_struct));
    if (ID3v2_struct_t !=NULL){
        ID3v2_struct_t->next=NULL;
        ID3v2_struct_t->objectType=NULL;
        ID3v2_struct_t->PTS=0;
        ID3v2_struct_t->UnixTimeStamp=0;
    }
    return ID3v2_struct_t;
}

void add_to_list(ID3v2_frame_list* main, ID3v2_frame* frame)
{
    // if empty list
    if(main->start == NULL)
    {
        main->start = main;
        main->frame = frame;
    }
    else
    {
        ID3v2_frame_list* current = new_frame_list();
        current->frame = frame;
        current->start = main->start;
    }
}

void add_list_ID3_struct(ID3v2_struct** main, ID3v2_struct* obj)
{
    // if empty list
    if (*main==NULL)
    {
        *main=obj;
    }
    else
    {
        obj->next=*main;
        *main=obj;
    }
}


void free_tag(ID3v2_tag* tag)
{
    free(tag->raw);
    free(tag->tag_header);
    ID3v2_frame_list* list = tag->frames;
    ID3v2_frame_list* tmp;
    while(list != NULL)
    {
        if (list->frame) free(list->frame->data);
        free(list->frame);
        tmp=list;
        list = list->next;
        free(tmp);
    }
    free(list);
    free(tag);
}
