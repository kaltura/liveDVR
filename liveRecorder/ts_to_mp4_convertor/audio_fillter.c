//
//  audio.c
//  ts_to_mp4_convertor
//
//  Created by Guy.Jacubovski on 25/10/2017.
//  Copyright © 2017 Kaltura. All rights reserved.
//

#include <libavutil/timestamp.h>
#include <libavformat/avformat.h>
#include "audio_filler.h"
#include <stdbool.h>



/*
Creates one encoder sample that contains absolute silence
*/
bool generateCodecSilentPacket(AVCodecContext *pContext,AVPacket* packet)
{
    AVCodec *output_codec          = NULL;
    int ret = -1;
    
    if (!(output_codec = avcodec_find_encoder(pContext->codec_id)))
    {
        fprintf(stderr, "Could not find an audio encoder.\n");
        return false;
    }
    AVCodecContext *pNewContext = avcodec_alloc_context3(output_codec);
    if (!pNewContext) {
        fprintf(stderr, "Could not allocate audio codec context\n");
        return false;
    }
    pNewContext->bit_rate = pContext->bit_rate;
    pNewContext->sample_fmt = pContext->sample_fmt;
    pNewContext->sample_rate = pContext->sample_rate;
    pNewContext->channel_layout = pContext->channel_layout;
    pNewContext->channels  = pContext->channels ;
    pNewContext->profile = pContext->profile;    /** Open the encoder for the audio stream to use it later. */
    if ( (ret = avcodec_open2(pNewContext, output_codec, NULL)) < 0)
    {
        fprintf(stderr, "Could not open output codec (error '%d')\n",ret);
        return false;
    }
    
    AVFrame *frame  = av_frame_alloc();
    frame->nb_samples     = pNewContext->frame_size;
    frame->format         = pNewContext->sample_fmt;
    frame->channel_layout = pNewContext->channel_layout;
    
    int buffer_size = av_samples_get_buffer_size(NULL, pNewContext->channels, pNewContext->frame_size,pNewContext->sample_fmt, 0);
    uint16_t * samples = av_malloc(buffer_size);
    
    
    ret = avcodec_fill_audio_frame(frame,pNewContext->channels, pNewContext->sample_fmt,
                                   (const uint8_t*)samples,  buffer_size, 0);
    if (ret < 0) {
        fprintf(stderr, "Could not setup audio frame\n");
        return false;
    }
    
    int got_output;
    ret = avcodec_encode_audio2(pNewContext, packet, frame, &got_output);
    
    if (ret < 0) {
        fprintf(stderr, "Could not encode audio frame\n");
        return false;
    }
    
    
    ret = avcodec_encode_audio2(pNewContext, packet, NULL, &got_output);
    if (ret < 0 || got_output==0) {
        fprintf(stderr, "Could not encode audio frame\n");
        return false;
    }
    
    av_freep(&samples);
    av_frame_free(&frame);
    avcodec_close(pNewContext);
    av_free(pNewContext);
    
    return true;
}


int getFreqIdx(AVCodecContext *pContext)
{
  uint32_t sample_rate_index[] = {96000,88200,64000, 48000,44100,32000, 24000,22050,16000,12000,11025,8000 ,7350 };
    
    
    //https://www.ffmpeg.org/doxygen/3.2/profiles_8c_source.html#l00026
    int freqIdx = 0;
    
    while (1)
    {
        if (freqIdx>=sizeof(sample_rate_index)) {
            return -1;
        }
        if (sample_rate_index[freqIdx]==pContext->sample_rate) {
            break;
        }
        freqIdx++;
    }
    return freqIdx;
}

void generateADTSpacket(AVCodecContext *pContext,AVPacket pkt,  AVPacket *dst)
{
    
    av_init_packet(dst);

    
    int freqIdx = getFreqIdx(pContext);
    if (freqIdx==-1) {
        return;
    }
    
    
    int profile = pContext->profile + 1;  //AAC LC
    
    int chanCfg = pContext->channels;  //MPEG-4 Audio Channel Configuration. 1 Channel front-center
    
#define adtsLength 7
    uint8_t *packet = malloc(pkt.size + adtsLength);
    int16_t fullLength = adtsLength + pkt.size;

    
    
    //https://wiki.multimedia.cx/index.php/ADTS
    
    // fill in ADTS data
    packet[0] = (char)0xFF;	// 11111111  	= syncword
    packet[1] = (char)0xF9;	// 1111 1 00 1  = syncword MPEG-2 Layer CRC
    packet[2] = (char)(((profile-1)<<6) + (freqIdx<<2) +(chanCfg>>2));
    packet[3] = (char)(((chanCfg&3)<<6) + (fullLength>>11));
    packet[4] = (char)((fullLength&0x7FF) >> 3);
    packet[5] = (char)(((fullLength&7)<<5) + 0x1F);
    packet[6] = (char)0xFC;
    memcpy(packet+7,pkt.data,pkt.size);
        dst->duration = pkt.duration;
    dst->size=fullLength;
    dst->data=packet;
}

void createSilentAudio(AVCodecContext *pContext,AVPacket* dst)
{
    AVPacket pkt;
    av_init_packet(&pkt);
    pkt.data = NULL; // packet data will be allocated by the encoder
    pkt.size = 0;
    
    if (!generateCodecSilentPacket(pContext,&pkt)) {
        return ;
    }
    
    if (pContext->codec_id==AV_CODEC_ID_AAC) {
        //we need to wrap the AAC packet with ADTS header
        generateADTSpacket(pContext,pkt, dst);
    } else {
        av_copy_packet(dst,&pkt);
    }
}

    
    /*
     
     static uint8_t array[] = {0xff,0xf1,0x50,0x80,0x3,0xff,0xfc,0xde,0x4,0x0,0x4c,0x61,0x76,0x63,0x35,0x37,
     0x2e,0x31,0x30,0x30,0x2e,0x31,0x30,0x33,0x0,0x42,0x20,0x8,0xc1,0x18,0x38};
     
     static uint8_t array2[] = {0x21, 0x00, 0x49, 0x90, 0x02, 0x19, 0x00, 0x23, 0x80};
     
     
     */
    
    
    /*
     int ret = 0 ;
     AVFormatContext* ifmt_ctx=NULL;
     
     // av_log_set_level(AV_LOG_TRACE  );
     char* fileName="/Users/guyjacubovski/1.mp4";
     if ((ret = avformat_open_input(&ifmt_ctx, fileName, 0, 0)) < 0) {
     fprintf(stderr, "Could not open silence file '%s'\n", fileName);
     return ;
     }
     
     AVPacket pkt;
     if (ret = av_read_frame(ifmt_ctx, &pkt)<0) {
     return;
     }
     
     
     *arr=alloca(pkt.size);
     memcpy(*arr,pkt.data,pkt.size);
     *len=pkt.size;
     *duration = (90000*pContext->frame_size)/(1*pContext->sample_rate);
     av_packet_unref(&pkt);
     
     
     avformat_close_input(&ifmt_ctx);
     
     */
    /*
     ./ffmpeg -y -f lavfi -i "aevalsrc=0:d=0.01" -c:a aac -profile:a aac_low -b:a 4k -f adts output.aac && hexdump -v -e '16/1 "0x%x," "\n"' -v output.aac
     
     
     int channelCount=pContext->channels;
     pContext->codec_descriptor->profiles->profile;
     AVCodec *output_codec          = NULL;
     if (!(output_codec = avcodec_find_encoder(pContext->codec_id))) {
     fprintf(stderr, "Could not find an AAC encoder.\n");
     return NULL;
     }
     av_free(output_codec);
     */
    
    
    

