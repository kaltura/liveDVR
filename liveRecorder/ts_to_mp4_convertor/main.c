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

static const AVRational standard_timebase = {1,1000};


static void log_packet(const AVFormatContext *fmt_ctx, const AVPacket *pkt, const char *tag)
{
    AVRational *time_base = &fmt_ctx->streams[pkt->stream_index]->time_base;
    
    printf("%s: pts:%s pts_time:%s dts:%s dts_time:%s duration:%s duration_time:%s stream_index:%d flags:%d\n",
           tag,
           av_ts2str(pkt->pts), av_ts2timestr(pkt->pts, time_base),
           av_ts2str(pkt->dts), av_ts2timestr(pkt->dts, time_base),
           av_ts2str(pkt->duration), av_ts2timestr(pkt->duration, time_base),
           pkt->stream_index,
           pkt->flags);
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
    int64_t lastPts,lastDts,packetCount;
    
};
struct FileConversion
{
    char inputFileName[10240];
    struct TrackInfo trackInfo[MAX_TRACKS]; //per track
    AVFormatContext *ifmt_ctx;
    AVFormatContext *ofmt_ctx;
    int64_t start_time;
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


bool initConversion(struct FileConversion* conversion,char* in_filename ,char* out_filename, char* language)
{
    int ret=0,j=0;
    
    for (j=0;j<MAX_TRACKS;j++) {
        conversion->trackInfo[j].waitForKeyFrame=true;
        conversion->trackInfo[j].lastPts=AV_NOPTS_VALUE;
        conversion->trackInfo[j].lastDts=AV_NOPTS_VALUE;
        conversion->trackInfo[j].packetCount=0;

        
    }
    conversion->ifmt_ctx=NULL;
    conversion->ofmt_ctx=NULL;
    
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

bool convert(struct FileConversion* conversion)
{
    
    bool retVal=true;
    AVPacket pkt;
    
    uint64_t offset = conversion->start_time;
    
    printf("Starting to convert %s\n",conversion->inputFileName);
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
        
    
        trackInfo->lastPts=pkt.pts;
        trackInfo->lastDts=pkt.dts;
        trackInfo->packetCount++;
    
    
        /* copy packet */
        pkt.pts = av_rescale_q_rnd(pkt.pts-offset, in_stream->time_base, out_stream->time_base, AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX);
        pkt.dts = av_rescale_q_rnd(pkt.dts-offset, in_stream->time_base, out_stream->time_base, AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX);
        pkt.duration = av_rescale_q(pkt.duration, in_stream->time_base, out_stream->time_base);
        pkt.pos = -1;
        
        
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
