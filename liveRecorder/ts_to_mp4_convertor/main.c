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


static void log_packet(const AVFormatContext *fmt_ctx, const AVPacket *pkt, const char *tag)
{
    AVRational *time_base = &fmt_ctx->streams[pkt->stream_index]->time_base;
    
    printf("%s: pts:%s pts_time:%s dts:%s dts_time:%s duration:%s duration_time:%s stream_index:%d\n",
           tag,
           av_ts2str(pkt->pts), av_ts2timestr(pkt->pts, time_base),
           av_ts2str(pkt->dts), av_ts2timestr(pkt->dts, time_base),
           av_ts2str(pkt->duration), av_ts2timestr(pkt->duration, time_base),
           pkt->stream_index);
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
    int64_t lastPts,firstPts;
    
};
struct FileConversion
{
    struct TrackInfo trackInfo[MAX_TRACKS]; //per track
    AVFormatContext *ifmt_ctx;
    AVFormatContext *ofmt_ctx;
};

struct FileConversion conversion[MAX_CONVERSIONS];

uint64_t calculateFirstPts(int total_strams)
{
    AVPacket pkt;
    int64_t start_time=0;
    int i=0;
    for (i=0;i<total_strams;i++)
    {
        struct FileConversion* currentStream = &conversion[i];
        bool shouldStop=false;
        while (!shouldStop) {
            
            int ret = av_read_frame(currentStream->ifmt_ctx, &pkt);
            if (ret < 0)
                break;
            
            struct TrackInfo* trackInfo = &currentStream->trackInfo[pkt.stream_index];
            
            if (pkt.stream_index==0 && trackInfo->firstPts==-1) { ///if video stream & it's the first packet
                trackInfo->firstPts=pkt.pts;
                if (start_time < pkt.pts) {
                    start_time=pkt.pts;
                }
                shouldStop=true;
            }
            
        }
    }
    return start_time;
}


bool initConversion(struct FileConversion* conversion,char* in_filename ,char* out_filename)
{
    int ret=0,j=0;
    
    for (j=0;j<MAX_TRACKS;j++) {
        conversion->trackInfo[j].waitForKeyFrame=true;
        conversion->trackInfo[j].lastPts=-1;
        conversion->trackInfo[j].firstPts=-1;
        
    }
    conversion->ifmt_ctx=NULL;
    conversion->ofmt_ctx=NULL;
    
    
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
        
        //av_dict_set(&out_stream->metadata, "language", "fra", 0);

        
    }
    av_dump_format(conversion->ofmt_ctx, 0, out_filename, 1);
    
    
    if (!(ofmt->flags & AVFMT_NOFILE)) {
        
        ret = avio_open(&conversion->ofmt_ctx->pb, out_filename, AVIO_FLAG_WRITE);
        if (ret < 0) {
            fprintf(stderr, "Could not open output file '%s'", out_filename);
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

void convert(struct FileConversion* conversion,uint64_t offset)
{
    AVPacket pkt;
    av_seek_frame(conversion->ifmt_ctx, -1,0, AVSEEK_FLAG_BYTE);
    
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
        
        
        // log_packet(ifmt_ctx, &pkt, "in");
        //if (trackInfo->lastPts!=-1) {
        //    if (pkt.pts<trackInfo->lastPts) {
        //        offset+=(pkt.pts-trackInfo->lastPts);
        //    }
        //}
        
        //pkt.pts+=2^33-100000;
        
        trackInfo->lastPts=pkt.pts;
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
        
        //log_packet(ofmt_ctx, &pkt, "out");
        
        ret = av_interleaved_write_frame(conversion->ofmt_ctx, &pkt);
        if (ret < 0) {
            fprintf(stderr, "Error muxing packet\n");
            break;
        }
        av_packet_unref(&pkt);
    }
    av_write_trailer(conversion->ofmt_ctx);
    
}

int main(int argc, char **argv)
{
    
    int i=0;
    
    if (argc < 3 || (argc-1) % 2!=0) {
        printf("usage: %s input1 ouput1 ... inputn outputn\n"
               "\n", argv[0]);
        return -1;
    }
    
    av_register_all();
    avformat_network_init();
    
    
    int total_conversions= (argc-1)/2;
    
    //initialize the streams
    for (i=0;i<total_conversions;i++)
    {
       
        char* in_filename  = argv[i*2+1];
        char* out_filename = argv[i*2+2];
    

        if (!initConversion(&conversion[i],in_filename,out_filename))
        {
            printf("Conversion initialization failed\n");
            return -1;
        }
    }
    
    uint64_t start_time=calculateFirstPts(total_conversions);
    
    //convert all streams
    for ( i=0;i<total_conversions;i++)
    {
        convert(&conversion[i], start_time);
    }
    
    printf("Conversion was successfull\n");
    
    //cleanup
    for (i=0;i<total_conversions;i++)
    {
        dispose(&conversion[i]);
    }
    
    printf("Cleanup done successfully\n");
    
    return 0;
}
