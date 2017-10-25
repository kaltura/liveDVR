#include <libavutil/timestamp.h>
#include <libavformat/avformat.h>
#include <time.h>
#include <stdio.h>
#include <stdio.h>
#include <sys/ioctl.h> // For FIONREAD
#include <termios.h>
#include <stdbool.h>

#define MAX_CONVERSIONS 20
#define MAX_TRACKS 10
#define KEY_FRAME_THRESHOLD 1000

static  AVRational standard_timebase = {1,1000};


static void log_packet(const AVFormatContext *fmt_ctx, const AVPacket *pkt, const char *tag)
{
    AVRational *time_base = &fmt_ctx->streams[pkt->stream_index]->time_base;
    
    printf("%s:  stream_index:%d  pts:%s pts_time:%s dts:%s dts_time:%s duration:%s duration_time:%s flags:%d\n",
           tag,
           pkt->stream_index,
           av_ts2str(pkt->pts), av_ts2timestr(pkt->pts, time_base),
           av_ts2str(pkt->dts), av_ts2timestr(pkt->dts, time_base),
           av_ts2str(pkt->duration), av_ts2timestr(pkt->duration, time_base),           pkt->flags);
}

int kbhit(void) {
    static bool initflag = false;
    static const int STDIN = 0;
    
    if (!initflag) {
        // Use termios to turn off line buffering
        struct termios term;
        tcgetattr(STDIN, &term);
        term.c_lflag &= ~ICANON;
        tcsetattr(STDIN, TCSANOW, &term);
        setbuf(stdin, NULL);
        initflag = true;
    }
    
    int nbbytes;
    ioctl(STDIN, FIONREAD, &nbbytes);  // 0 is STDIN
    return nbbytes;
}


struct TrackInfo
{
    bool waitForKeyFrame;
    int64_t lastPts,lastDts,packetCount,lastSilencePts;
    uint8_t* silent_frame;
    size_t silent_frame_len;
    int64_t silent_frame_duration;
    
};
struct FileConversion
{
    char inputFileName[10240];
    struct TrackInfo trackInfo[MAX_TRACKS]; //per track
    AVFormatContext *ifmt_ctx;
    AVFormatContext *ofmt_ctx;
    int64_t start_time;
    bool skipSilenceFilling;
};

struct FileConversion conversion[MAX_CONVERSIONS];


uint64_t calculateFirstPts(int total_strams)
{
    int64_t start_time=0;
    int i,j;
    
    
    //we need two passes so validate that all streams will start together
    for (j=0;j<2;j++)
    {
        
        for ( i=0;i<total_strams;i++)
        {
            struct FileConversion* currentConversion = &conversion[i];

            AVFormatContext* ifmt_ctx=NULL;
            if (avformat_open_input(&ifmt_ctx, currentConversion->inputFileName, 0, 0) < 0) {
                fprintf(stderr, "Could not open input file '%s'", currentConversion->inputFileName);
                return false;
            }

            
            AVPacket pkt;
            
            bool shouldStop=false;
            printf("[calculateFirstPts] ************ iter %d stream %d\n",j+1,i);
            int64_t threshold = av_rescale_q(KEY_FRAME_THRESHOLD, standard_timebase, ifmt_ctx->streams[0]->time_base);

            while (!shouldStop) {
                
                int ret = av_read_frame(ifmt_ctx, &pkt);
                if (ret < 0)
                    break;
                
                //struct TrackInfo* trackInfo = &currentConversion->trackInfo[pkt.stream_index];
                if (pkt.stream_index==0 &&
                    (pkt.flags & AV_PKT_FLAG_KEY)==AV_PKT_FLAG_KEY)
                { ///if video stream & it's the first packet
                    int64_t diff=llabs(start_time - pkt.pts);
                    if (diff<threshold) {
                        printf("[calculateFirstPts] iter %d, stream %d same start_time (%s %s)\n",j+1,i,av_ts2str(start_time),av_ts2str(diff));
                        shouldStop=true;
                    }
                    else
                    {

                        if (start_time < pkt.pts) {
                            printf("[calculateFirstPts] iter %d, stream %d changed start_time from %s to %s\n",j+1,i,av_ts2str(start_time),av_ts2str(pkt.pts));
                            start_time=pkt.pts;
                            shouldStop=true;
                        } else {
                            printf("[calculateFirstPts] iter %d, stream %d frame @ %s is smaller than start time  %s\n",j+1,i,av_ts2str(pkt.pts),av_ts2str(start_time));
                        }
                        
                    }
                }
                
            }
            
            currentConversion->start_time=pkt.pts;
            avformat_close_input(&ifmt_ctx);

        }
    }
    printf("[calculateFirstPts] calculated start_time is %s\n",av_ts2str(start_time));

    return start_time;
}



bool createSilentAACSample(AVCodecContext *pContext,AVPacket* packet)
{
    AVCodec *output_codec          = NULL;
    
    if (!(output_codec = avcodec_find_encoder(pContext->codec_id)))
    {
        fprintf(stderr, "Could not find an audio encoder.\n");
        return false;
    }
    
    //FF_PROFILE_AAC_LOW  FF_PROFILE_AAC_MAIN
    //FF_PROFILE_AAC_HE
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
    pNewContext->profile = pContext->profile;
    int ret;
    /** Open the encoder for the audio stream to use it later. */
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


void createSilentAudio(AVCodecContext *pContext,uint8_t** arr,size_t* len,int64_t* duration)
{
    AVPacket pkt;
    av_init_packet(&pkt);
    pkt.data = NULL; // packet data will be allocated by the encoder
    pkt.size = 0;
    
    if (!createSilentAACSample(pContext,&pkt)) {
        return ;
    }
    
    /*
    
    static uint8_t array[] = {0xff,0xf1,0x50,0x80,0x3,0xff,0xfc,0xde,0x4,0x0,0x4c,0x61,0x76,0x63,0x35,0x37,
        0x2e,0x31,0x30,0x30,0x2e,0x31,0x30,0x33,0x0,0x42,0x20,0x8,0xc1,0x18,0x38};
    
    static uint8_t array2[] = {0x21, 0x00, 0x49, 0x90, 0x02, 0x19, 0x00, 0x23, 0x80};
    
    
    */
    
    static uint32_t sample_rate_index[] = {96000,88200,64000, 48000,44100,32000, 24000,22050,16000,12000,11025,8000 ,7350 };
    
#define adtsLength 7
    uint8_t *packet = malloc(pkt.size + adtsLength);
    
    //https://www.ffmpeg.org/doxygen/3.2/profiles_8c_source.html#l00026
    int profile = pContext->profile + 1;  //AAC LC
    switch(pContext->profile)
    {
        case FF_PROFILE_AAC_MAIN:  profile=1; break;
        case FF_PROFILE_AAC_LOW: profile=2; break;
        case FF_PROFILE_AAC_SSR: profile=3; break;
        case FF_PROFILE_AAC_LTP:  profile=4; break;
        case FF_PROFILE_AAC_HE: profile=2; break;
        case FF_PROFILE_AAC_HE_V2:  profile=2; break;
        case FF_PROFILE_AAC_LD: profile=2; break;
        case FF_PROFILE_AAC_ELD:  profile=2; break;
            
            //FF_PROFILE_AAC_HE
    }
    int freqIdx = 0;  //44.1KHz
    while (1)
    {
        if (freqIdx>=sizeof(sample_rate_index)) {
            return;
        }
        if (sample_rate_index[freqIdx]==pContext->sample_rate) {
            break;
        }
        freqIdx++;
    }
    
    //https://wiki.multimedia.cx/index.php/ADTS
    
    int chanCfg = pContext->channels;  //MPEG-4 Audio Channel Configuration. 1 Channel front-center
    int16_t fullLength = adtsLength + pkt.size;
    // fill in ADTS data
    packet[0] = (char)0xFF;	// 11111111  	= syncword
    packet[1] = (char)0xF9;	// 1111 1 00 1  = syncword MPEG-2 Layer CRC
    packet[2] = (char)(((profile-1)<<6) + (freqIdx<<2) +(chanCfg>>2));
    packet[3] = (char)(((chanCfg&3)<<6) + (fullLength>>11));
    packet[4] = (char)((fullLength&0x7FF) >> 3);
    packet[5] = (char)(((fullLength&7)<<5) + 0x1F);
    packet[6] = (char)0xFC;
    memcpy(packet+7,pkt.data,pkt.size);
    
    *arr =packet;
    *duration = (pContext->sample_rate*pContext->frame_size)/(1*pContext->sample_rate);
    *len = fullLength;
    
    return;
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
    
    

}

bool initConversion(struct FileConversion* conversion,char* in_filename ,char* out_filename, char* language)
{
    int ret=0,j=0;
    
    for (j=0;j<MAX_TRACKS;j++) {
        conversion->trackInfo[j].waitForKeyFrame=true;
        conversion->trackInfo[j].lastPts=AV_NOPTS_VALUE;
        conversion->trackInfo[j].lastDts=AV_NOPTS_VALUE;
        conversion->trackInfo[j].packetCount=0;
        conversion->trackInfo[j].lastSilencePts=0;
        conversion->trackInfo[j].silent_frame=NULL;
        conversion->trackInfo[j].silent_frame_len=0;
        conversion->trackInfo[j].silent_frame_duration=0;
        
    }
    conversion->ifmt_ctx=NULL;
    conversion->ofmt_ctx=NULL;
    conversion->skipSilenceFilling=false;
    
    strcpy(conversion->inputFileName,in_filename);
    
    if ((ret = avformat_open_input(&conversion->ifmt_ctx, in_filename, 0, 0)) < 0) {
        fprintf(stderr, "Could not open input file '%s'", in_filename);
        return false;
    }
    
    if ((ret = avformat_find_stream_info(conversion->ifmt_ctx, 0)) < 0) {
        fprintf(stderr, "Failed to retrieve stream input stream information");
        return false;
    }
    
    av_dump_format(conversion->ifmt_ctx, 0, in_filename, 0);
    avformat_alloc_output_context2(&conversion->ofmt_ctx, NULL, NULL, out_filename);
    if (!conversion->ofmt_ctx) {
        fprintf(stderr, "Could not create output context\n");
        ret = AVERROR_UNKNOWN;
        return false;
    }

    AVOutputFormat *ofmt = conversion->ofmt_ctx->oformat;
    
   
    for (j = 0; j < conversion->ifmt_ctx->nb_streams; j++) {
        AVStream *in_stream = conversion->ifmt_ctx->streams[j];
        
        
        if (in_stream->codec->codec_type==AVMEDIA_TYPE_DATA &&
            in_stream->codec->codec_id==AV_CODEC_ID_NONE) {
            in_stream->codec->codec_id=AV_CODEC_ID_MOV_TEXT;
        }
        if (in_stream->codec->codec_id==AV_CODEC_ID_TIMED_ID3) {
            in_stream->codec->codec_id=AV_CODEC_ID_MOV_TEXT;
        }

        
        AVStream *out_stream = avformat_new_stream(conversion->ofmt_ctx, in_stream->codec->codec);
        if (!out_stream) {
            fprintf(stderr, "Failed allocating output stream\n");
            ret = AVERROR_UNKNOWN;
            return false;
        }
        
        ret = avcodec_copy_context(out_stream->codec, in_stream->codec);
        if (ret < 0) {
            fprintf(stderr, "Failed to copy context from input to output stream codec context\n");
            return false;
        }
        out_stream->codec->codec_tag = 0;
        if (conversion->ofmt_ctx->oformat->flags & AVFMT_GLOBALHEADER)
            out_stream->codec->flags |= AV_CODEC_FLAG_GLOBAL_HEADER;
        
        out_stream->time_base           = in_stream->time_base;
        out_stream->sample_aspect_ratio = in_stream->sample_aspect_ratio;
        out_stream->codec->codec_tag = 0;
        conversion->ofmt_ctx->oformat->flags |= AVFMT_TS_NONSTRICT;
        
        if(in_stream->codec->codec_id == AV_CODEC_ID_AAC) {
            ff_stream_add_bitstream_filter(out_stream, "aac_adtstoasc", NULL);
            
        }
        
        av_dict_set(&out_stream->metadata, "language", language, 0);
        
        if (in_stream->codec->codec_type==AVMEDIA_TYPE_AUDIO) {
            
            
            createSilentAudio(in_stream->codec,
                              &conversion->trackInfo[j].silent_frame,
                              &conversion->trackInfo[j].silent_frame_len,
                              &conversion->trackInfo[j].silent_frame_duration);
        }

    }
    av_dump_format(conversion->ofmt_ctx, 0, out_filename, 1);
    
    
    if (!(ofmt->flags & AVFMT_NOFILE)) {
        
        ret = avio_open(&conversion->ofmt_ctx->pb, out_filename, AVIO_FLAG_WRITE);
        if (ret < 0) {
            fprintf(stderr, "Could not open output file '%s'\n", out_filename);
            return false;
        }
    }
    
    ret = avformat_write_header(conversion->ofmt_ctx, NULL);
    if (ret < 0) {
        fprintf(stderr, "Error occurred when opening output file\n");
        return false;
    }
    
    return true;
}
bool dispose(struct FileConversion* conversion)
{
    int ret=0;
    
    avformat_close_input(&conversion->ifmt_ctx);
    
    AVOutputFormat *ofmt = conversion->ofmt_ctx->oformat;
    
    /* close output */
    if (conversion->ofmt_ctx && !(ofmt->flags & AVFMT_NOFILE))
        avio_closep(&conversion->ofmt_ctx->pb);
    
    avformat_free_context(conversion->ofmt_ctx);
    
    if (ret < 0 && ret != AVERROR_EOF) {
        fprintf(stderr, "Error occurred: %s\n", av_err2str(ret));
        return  false;
    }

    return true;
    
}

void fillSilence(int64_t currentPts,struct TrackInfo* currentTrack,struct FileConversion* conversion)
{
    conversion->skipSilenceFilling = true;
    for (int i = 0; i < conversion->ofmt_ctx->nb_streams; i++) {
        struct TrackInfo* trackInfo = &conversion->trackInfo[i];
        AVStream * out_stream  = conversion->ofmt_ctx->streams[i];

        if (trackInfo->silent_frame!=NULL && trackInfo->packetCount==0 )
        {
            printf("Check if need to add silence to audio tracks stream_index:%d current_pts:%lld  (%s)\n",i,currentPts, av_ts2timestr(currentPts, &standard_timebase));

            conversion->skipSilenceFilling = false;
            
            int64_t threshold=5*1000;//5 seconds
            
            if (currentTrack==trackInfo)
            {
                printf("Got first packet of audio track, filling silence stream_index:%d current_pts:%lld (%s)\n",i,currentPts, av_ts2timestr(currentPts, &standard_timebase));
                threshold=0;
            }
            
            while (av_rescale_q_rnd(trackInfo->lastSilencePts +  trackInfo->silent_frame_duration, out_stream->time_base, standard_timebase, AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX)
                   < currentPts - threshold)
            {

                AVPacket silent_pkt;
                av_init_packet(&silent_pkt);
                silent_pkt.data=alloca(trackInfo->silent_frame_len);
                memcpy(silent_pkt.data, trackInfo->silent_frame, (int)trackInfo->silent_frame_len);
                silent_pkt.size = (int)trackInfo->silent_frame_len;
                silent_pkt.duration = trackInfo->silent_frame_duration;
                silent_pkt.pts= silent_pkt.dts = trackInfo->lastSilencePts;
                silent_pkt.stream_index = i;
                log_packet(conversion->ofmt_ctx, &silent_pkt, "silence");

                av_interleaved_write_frame(conversion->ofmt_ctx, &silent_pkt);
                trackInfo->lastSilencePts += trackInfo->silent_frame_duration;
                
                av_packet_unref(&silent_pkt);
                
            }
            
            currentTrack->lastSilencePts=AV_NOPTS_VALUE;
        }
            
    }
}



bool convert(struct FileConversion* conversion)
{
    
    bool retVal=true;
    AVPacket pkt;
    
    uint64_t offset = conversion->start_time;
    
    printf("Starting to convert %s\n",conversion->inputFileName);
    
    int64_t max_pts = 30*60*1000;//AV_NOPTS_VALUE;
    while (1) {
        
        AVStream *in_stream, *out_stream;
        int ret = av_read_frame(conversion->ifmt_ctx, &pkt);
        if (ret < 0)
            break;
        
        in_stream  = conversion->ifmt_ctx->streams[pkt.stream_index];
        out_stream = conversion->ofmt_ctx->streams[pkt.stream_index];
        struct TrackInfo* trackInfo = &conversion->trackInfo[pkt.stream_index];
        
        if(kbhit())
        {
            int ch=getchar();
            if(ch==27)
            {
                break;
            }
            
        }
    
        /* copy packet */
        pkt.pts = av_rescale_q_rnd(pkt.pts-offset, in_stream->time_base, out_stream->time_base, AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX);
        pkt.dts = av_rescale_q_rnd(pkt.dts-offset, in_stream->time_base, out_stream->time_base, AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX);
        pkt.duration = av_rescale_q(pkt.duration, in_stream->time_base, out_stream->time_base);
        pkt.pos = -1;
        
        
        if (  in_stream->codec->codec_type==AVMEDIA_TYPE_AUDIO &&
            av_rescale_q(pkt.pts, out_stream->time_base, standard_timebase)<5*60*1000) {
            //continue;
        }
        if (max_pts!=AV_NOPTS_VALUE &&  av_rescale_q(pkt.pts, out_stream->time_base, standard_timebase) > max_pts)
        {
            break;
        }

        
        
        if (!conversion->skipSilenceFilling) {
            fillSilence(av_rescale_q_rnd(pkt.pts,out_stream->time_base,standard_timebase, AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX),trackInfo,conversion);
        }
        trackInfo->lastPts=pkt.pts;
        trackInfo->lastDts=pkt.dts;
        trackInfo->packetCount++;
        
        if (pkt.pts<0) {
            //trim packets outside of start time
            continue;
        } else {
            if ( trackInfo->waitForKeyFrame) {
                if ((pkt.flags & AV_PKT_FLAG_KEY)==AV_PKT_FLAG_KEY) {
                    // printf("Recieving key frame on track %d at time pts %s vs %s\n",pkt.stream_index, av_ts2str(trackInfo->lastPts),av_ts2str(offset));
                    trackInfo->waitForKeyFrame=false;
                } else {
                    continue;
                }
            }
        }

        
        /*
        if ( trackInfo->packetCount==1 && in_stream->codec->codec_type==AVMEDIA_TYPE_DATA) {
            char* data=(char*)pkt.buf->data;
            char *json="N/A";
            char* timestr="N/A\n";
            
            if (pkt.buf->size>16) {
                json=data+16;
                
                int64_t epoch64=0;
                sscanf( json, "{\"timestamp\":%lld}", &epoch64 );
                if (epoch64!=0) {
                    time_t t = epoch64/1000;
                    timestr=ctime(&t);
                }
            }
            printf("ID3: %15s\t%15s\t%s\t%s",av_ts2str(pkt.pts),av_ts2timestr(pkt.pts,&in_stream->time_base),json,timestr);
        }*/
        //log_packet(conversion->ofmt_ctx, &pkt, "out");
        
        ret = av_interleaved_write_frame(conversion->ofmt_ctx, &pkt);
        if (ret < 0) {
            trackInfo->waitForKeyFrame=true;
            fprintf(stderr, "Error muxing packet of stream %d packet# (%"PRId64"),with pts %s \n",pkt.stream_index,trackInfo->packetCount, av_ts2str(trackInfo->lastPts));
        }
        av_packet_unref(&pkt);
        
        
    }
    av_write_trailer(conversion->ofmt_ctx);
    
    return retVal;
    
}

int main(int argc, char **argv)
{
    
    int i=0;
    
    if (argc < 4 || (argc-1) % 3!=0) {
        printf("usage: %s input1 ouput1 language1... inputn outputn language\n"
               "\n", argv[0]);
        for (i=0; i<argc; i++) {
            printf("(%d) arg_%d=%s", i,i,argv[i]);
        }
        return -1;
    }
    
    av_register_all();
    avcodec_register_all();
    avformat_network_init();
    
    
    int total_conversions= (argc-1)/3;
    
    //initialize the streams
    for (i=0;i<total_conversions;i++)
    {
       
        char* in_filename  = argv[i*3+1];
        char* out_filename = argv[i*3+2];
        char* language = argv[i*3+3];

        if (!initConversion(&conversion[i],in_filename,out_filename, language))
        {
            printf("Conversion initialization failed\n");
            return -1;
        }
    }
    
    uint64_t start_time=calculateFirstPts(total_conversions);
    
    bool convertionOK=true;
    //convert all streams
    for ( i=0;i<total_conversions;i++)
    {
        convertionOK&=convert(&conversion[i]);
    }
    
    if (convertionOK) {
        printf("Conversion was successfull\n");
    } else {
        printf("Conversion FAILED!!\n");

    }
    //cleanup
    for (i=0;i<total_conversions;i++)
    {
        dispose(&conversion[i]);
    }
    
    printf("Cleanup done successfully\n");
    
    return 0;
}
