#include <libavutil/timestamp.h>
#include <libavformat/avformat.h>
#include <time.h>
#include <stdio.h>
#include <sys/ioctl.h> // For FIONREAD
#include <termios.h>
#include <stdbool.h>
#include "audio_filler.h"
#include "tests.h"

#define MAX_CONVERSIONS 20
#define MAX_TRACKS 10
#define KEY_FRAME_THRESHOLD 1000
#define THRESHOLD_IN_SECONDS_FOR_ADDING_SILENCE 5

#ifndef VERSION
#define VERSION __TIMESTAMP__
#endif
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
    bool displayedFirstPacket;
    int64_t lastPts,lastDts,packetCount,lastSilencePts;
    AVPacket silent_packet;
    
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


bool hasVideo(AVFormatContext* ctx)
{
    for (int i=0;i<ctx->nb_streams;i++) {
        if (ctx->streams[i]->codec->codec_type==AVMEDIA_TYPE_VIDEO) {
            return true;
        }
    }
    return false;
}

int getMainTrackIndex(AVFormatContext* ctx)
{
    for (int i=0;i<ctx->nb_streams;i++) {
        if (ctx->streams[i]->codec->codec_type==AVMEDIA_TYPE_VIDEO) {
            return i;
        }
    }
    return 0;
}

uint64_t calculateFirstPts(int total_conversions)
{
    int64_t start_time=0;
    int i,j;
    
    //if the entire conversion is audio only
    bool audioOnlyConversion=false;
    
    //we need two passes so validate that all streams will start together
    for (j=0;j<2;j++)
    {
        bool hasVideoStream=false;
        
        for ( i=0;i<total_conversions;i++)
        {
            struct FileConversion* currentConversion = &conversion[i];

            AVFormatContext* ifmt_ctx=NULL;
            if (avformat_open_input(&ifmt_ctx, currentConversion->inputFileName, 0, 0) < 0) {
                fprintf(stderr, "Could not open input file '%s'", currentConversion->inputFileName);
                return false;
            }

            
            AVPacket pkt;
            
            int mainTrackIndex=getMainTrackIndex(currentConversion->ifmt_ctx);
            bool shouldStop=false;
            int64_t threshold = av_rescale_q(KEY_FRAME_THRESHOLD, standard_timebase, ifmt_ctx->streams[0]->time_base);
            printf("[calculateFirstPts] ************ iter %d stream %d  threshold=%s; audioOnlyConversion=%d \n",j+1,i,av_ts2str(threshold),audioOnlyConversion);
            //find first key frame  (only if video or audio only)
            bool conversionHasVideo=hasVideo(currentConversion->ifmt_ctx);
            if (audioOnlyConversion || conversionHasVideo) {
            
                if (conversionHasVideo) {
                    hasVideoStream=true;
                }
                while (!shouldStop) {
                    
                    int ret = av_read_frame(ifmt_ctx, &pkt);
                    if (ret < 0)
                        break;
                    
                    int64_t time = pkt.pts;
                    
                    //struct TrackInfo* trackInfo = &currentConversion->trackInfo[pkt.stream_index];
                    if (pkt.stream_index==mainTrackIndex &&
                        (pkt.flags & AV_PKT_FLAG_KEY)==AV_PKT_FLAG_KEY)
                    { ///if video stream & it's the first packet
                        if (time>=start_time && time<start_time+threshold) {
                            printf("[calculateFirstPts] iter %d, stream %d is equal or a bit greater than the start_time (%s) diff = %s\n",j+1,i,av_ts2str(start_time),av_ts2str(time-start_time));
                            shouldStop=true;
                        }
                        else
                        {
                            if (time>=start_time-threshold ) {
                                printf("[calculateFirstPts] iter %d, stream %d changed start_time from %s to %s diff = %s\n",j+1,i,av_ts2str(start_time),av_ts2str(time),av_ts2str(time-start_time));
                                start_time=time;
                                shouldStop=true;
                            } else {
                                printf("[calculateFirstPts] iter %d, stream %d frame @ %s is smaller than start time  %s\n",j+1,i,av_ts2str(time),av_ts2str(start_time));
                            }
                        }
                    }
                    
                }
            } else {
                printf("[calculateFirstPts] audio only stream ignoring\n");

            }
            audioOnlyConversion=!hasVideoStream;
            avformat_close_input(&ifmt_ctx);
            
        }
    }
    
    for ( i=0;i<total_conversions;i++)
    {
        struct FileConversion* currentConversion = &conversion[i];
        currentConversion->start_time=start_time;
    }
    printf("[calculateFirstPts] calculated start_time is %s\n",av_ts2str(start_time));
    
    return start_time;
}



bool initConversion(struct FileConversion* conversion,char* in_filename ,char* out_filename, char* language)
{
    int ret=0,j=0;
    
    for (j=0;j<MAX_TRACKS;j++) {
        conversion->trackInfo[j].waitForKeyFrame=true;
        conversion->trackInfo[j].displayedFirstPacket=false;
        conversion->trackInfo[j].lastPts=AV_NOPTS_VALUE;
        conversion->trackInfo[j].lastDts=AV_NOPTS_VALUE;
        conversion->trackInfo[j].packetCount=0;
        conversion->trackInfo[j].lastSilencePts=0;
        av_init_packet(&conversion->trackInfo[j].silent_packet);
        
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
            
            
            createSilentAudio(in_stream->codec,&conversion->trackInfo[j].silent_packet);
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

/*
 
 This function should fill silence for all audio tracks that didn't start,
 to avoid too-long silence period that will disturbe the interlaving factor of the mp4 files,
 we keep a threshold (THRESHOLD_IN_SECONDS_FOR_ADDING_SILENCE) to determin  if the video is too ahead and insert the silence
 once we got the first packet and we know the actual time of the first packet, we fill until that time.
 */
void fillSilence(int64_t currentPts,struct TrackInfo* currentTrack,struct FileConversion* conversion)
{
    conversion->skipSilenceFilling = true;
    
    for (int i = 0; i < conversion->ofmt_ctx->nb_streams; i++) {
        struct TrackInfo* trackInfo = &conversion->trackInfo[i];
        AVStream * out_stream  = conversion->ofmt_ctx->streams[i];
        
        if (trackInfo->silent_packet.data!=NULL && trackInfo->packetCount==0 )
        {
            //printf("Check if need to add silence to audio tracks stream_index:%d current_pts:%lld  (%s)\n",i,currentPts, av_ts2timestr(currentPts, &standard_timebase));
            
            //we detected at least stream without content, so we need to fill up silence
            conversion->skipSilenceFilling = false;
            
            int64_t threshold=THRESHOLD_IN_SECONDS_FOR_ADDING_SILENCE*1000;
            
            //check if the next packet is the first packet so we need to fillup the gap until that time
            if (currentTrack==trackInfo)
            {
                printf("Got first packet of audio track, filling silence stream_index:%d current_pts:%lld (%s)\n",i,currentPts, av_ts2timestr(currentPts, &standard_timebase));
                threshold=0;
            }
            
            while (av_rescale_q_rnd(trackInfo->lastSilencePts +  trackInfo->silent_packet.duration, out_stream->time_base, standard_timebase, AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX)
                   < currentPts - threshold)
            {
                
                AVPacket silent_pkt;
                av_init_packet(&silent_pkt);
                av_copy_packet(&silent_pkt,&trackInfo->silent_packet);
                silent_pkt.pts= silent_pkt.dts = trackInfo->lastSilencePts;
                silent_pkt.stream_index = i;
                log_packet(conversion->ofmt_ctx, &silent_pkt, "silence");
                
                av_interleaved_write_frame(conversion->ofmt_ctx, &silent_pkt);
                trackInfo->lastSilencePts += trackInfo->silent_packet.duration;
                
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
    
    printf("Starting to convert %s offset=%s\n",conversion->inputFileName,av_ts2str(offset));
    
    //this value is what is the maximum length of the converted file
    int64_t max_duration = AV_NOPTS_VALUE;//30*60*1000;//AV_NOPTS_VALUE;
    
    uint64_t progressReportInterval = av_rescale_q(30*60*1000, standard_timebase, conversion->ifmt_ctx->streams[0]->time_base) ; //30 min
    uint64_t nextProgressReport = progressReportInterval;
    bool resetPtsOnFirstKeyFrame=true;
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
        
        /*   //for debugging, this makes the audio to start 5 min. after video
         if (  in_stream->codec->codec_type==AVMEDIA_TYPE_AUDIO &&
         av_rescale_q(pkt.pts, out_stream->time_base, standard_timebase)<5*60*1000) {
         continue;
         }
         */
        
        if (max_duration!=AV_NOPTS_VALUE &&  av_rescale_q(pkt.pts, out_stream->time_base, standard_timebase) > max_duration)
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
            //printf("trim packets outside of start time track: %d, %s %s\n",pkt.stream_index, av_ts2str(pkt.pts), av_ts2str(pkt.dts));
            //trim packets outside of start time
            continue;
        } else {
            if ( trackInfo->waitForKeyFrame) {
                if ((pkt.flags & AV_PKT_FLAG_KEY)==AV_PKT_FLAG_KEY) {
                    // printf("Recieving key frame on track %d at time pts %s\n",pkt.stream_index, av_ts2str(trackInfo->lastPts-offset));
                    trackInfo->waitForKeyFrame=false;
                    //don't allow EDT list since packager doesn't support them, so move first frame to the beginning
                    if ( in_stream->codec->codec_type==AVMEDIA_TYPE_VIDEO && pkt.pts>0 && resetPtsOnFirstKeyFrame ) {
                        printf("Corrected first video key frame to 0  on track %d pts = %s (%s)  dts = %s (%s)\n",
                               pkt.stream_index,
                               av_ts2str(pkt.pts),av_ts2timestr(pkt.pts, &out_stream->time_base),
                               av_ts2str(pkt.dts),av_ts2timestr(pkt.dts, &out_stream->time_base));
                        int64_t newOffset = pkt.dts;
                        pkt.pts-=newOffset;
                        pkt.dts-=newOffset;
                        pkt.duration+=newOffset;
                        trackInfo->lastPts=pkt.pts;
                        trackInfo->lastDts=pkt.dts;
                        resetPtsOnFirstKeyFrame=false;
                    }

                } else {
                    printf("Skipping non key frame on track %d at time pts %s\n",pkt.stream_index, av_ts2str(pkt.pts));
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
        if (!trackInfo->displayedFirstPacket){
            log_packet(conversion->ofmt_ctx, &pkt, "out");
            trackInfo->displayedFirstPacket=true;
        }
        if (pkt.stream_index==0 && pkt.pts>nextProgressReport) {
            printf("Progress %s (%s)\n",av_ts2str(pkt.pts),av_ts2timestr(pkt.pts,&out_stream->time_base));
            nextProgressReport=pkt.pts + progressReportInterval ;
        }
        
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
    
    //argv=&test3;
   // argc=sizeof(test3)/sizeof(test3[0]);
    
    int i=0;
    printf("Version: %s\n", VERSION);

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

