//
//  main.c
//  ID3TAG
//
//  Created by Ron Yadgar on 20/02/2016.
//  Copyright © 2016 Ron Yadgar. All rights reserved.
//
#include "mpegts_stream_walker.h"
#include "ts_rebase_impl.h"
#include "common.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "constants.h"
#include "utils.h"
static const char kaltura_object_type[] = "KalturaSyncTimecode";

void free_list_ID3_struct(ID3v2_struct* head){
    ID3v2_struct* tmp;
    
    while (head != NULL)
    {
        tmp = head;
        head = head->next;
        free(tmp->objectType);
        free(tmp);
    }
    
}

uint64_t get_suggested_correction(ID3v2_struct* obj)
{
    uint64_t suggested_correction;
    if (obj==NULL)
    {
        return 0    ;
    }
    while (1){
        suggested_correction=90*obj->UnixTimeStamp-obj->PTS;
        if  (!strcmp(obj->objectType,kaltura_object_type)){
            suggested_correction=90*obj->UnixTimeStamp-obj->PTS; //normalize it such the units is second*90,000
            if (*obj->objectType=='\0'){
                puts("ERROR oject type is null");
            }
            return suggested_correction;
        }
        obj=obj->next;
        if (obj == NULL)
            break;
    }
    return suggested_correction;
    
}

void parsing_ID3_tag(const byte_t* buffer_data, size_t buffer_size, ts_rebase_context_t* context)
{
    stream_walker_state_t stream_walker_state;
    ID3v2_struct* ID3v2_struct_list=NULL;
    
    stream_walker_init(&stream_walker_state);
    walk_ts_streams(
                    buffer_data,
                    buffer_size,
                    stream_walker_pmt_header_callback,
                    stream_walker_pmt_entry_callback,
                    stream_walker_packet_data_callback,
                    &stream_walker_state,
                    &ID3v2_struct_list);
    stream_walker_free(&stream_walker_state);
    
    context->suggested_correction=get_suggested_correction(ID3v2_struct_list);
    if (((context->correction - context->suggested_correction) & TIMESTAMP_MASK) > REBASE_THRESHOLD &&
        ((context->suggested_correction - context->correction) & TIMESTAMP_MASK) > REBASE_THRESHOLD)
    {
        context->correction = context->suggested_correction;
    }
    free_list_ID3_struct(ID3v2_struct_list);
    
}

int main(int argc, const char * argv[]) {
    while(1)
    {
    uint64_t duration;
    ID3v2_struct* ID3v2_struct_list=NULL;
    size_t buffer_size;
    char *buffer_data = NULL;
    FILE *fp = fopen("/tmp/3.ts", "r");
    if (fp != NULL) {
        /* Go to the end of the file. */
        if (fseek(fp, 0L, SEEK_END) == 0) {
            /* Get the size of the file. */
            long bufsize = ftell(fp);
            if (bufsize == -1) { /* Error */ }
            
            /* Allocate our buffer to that size. */
            buffer_data = malloc(sizeof(char) * (bufsize + 1));
            
            /* Go back to the start of the file. */
            if (fseek(fp, 0L, SEEK_SET) != 0) { /* Error */ }
            
            /* Read the entire file into memory. */
             buffer_size = fread(buffer_data, sizeof(char), bufsize, fp);
            if (buffer_size == 0) {
                fputs("Error reading file", stderr);
            }
        
            fclose(fp);
        }
    }


    ts_rebase_context_t context;
    context.expected_dts = NO_TIMESTAMP;
        
    parsing_ID3_tag(buffer_data, buffer_size, &context);
    
    // perform the rebase

    ts_rebase_impl(&context, (u_char*)buffer_data,  buffer_size, &duration);
 
    
    free(buffer_data);
    FILE *f = fopen("/Users/ronyadgar/Desktop/1_rebase.ts", "w");
    if (f == NULL)
    {
        printf("Error opening file!\n");
        exit(1);
    }
    fwrite(buffer_data, buffer_size, 1, f);
    puts("Wrote to file!");
    
    free_list_ID3_struct(ID3v2_struct_list);
    fclose(f);
  }
    return 0;
}




