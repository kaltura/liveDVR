#include <libavutil/timestamp.h>
#include <libavformat/avformat.h>
#include <time.h>
#include <stdio.h>
#include <stdio.h>
#include <sys/ioctl.h> // For FIONREAD
#include <termios.h>
#include <stdbool.h>

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

#define MAX_STREAMS 100

struct TrackInfo
{
    bool waitForKeyFrame;
    int64_t lastPts,firstPts;
    
};
struct Stream
{
    struct TrackInfo trackInfo[10]; //per track
    AVFormatContext *ifmt_ctx;
    AVFormatContext *ofmt_ctx;
} stream[MAX_STREAMS];

void initStream(struct Stream* stream) {
    for (int j=0;j<10;j++) {
        stream->trackInfo[j].waitForKeyFrame=true;
        stream->trackInfo[j].lastPts=-1;
        stream->trackInfo[j].firstPts=-1;

    }
    stream->ifmt_ctx=NULL;
    stream->ofmt_ctx=NULL;

}

uint64_t calculateFirstPts(int total_strams) {
    
    AVPacket pkt;
    int64_t start_time=0;
    for (int i=0;i<total_strams;i++)
    {
        struct Stream* currentStream = &stream[i];
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
int main(int argc, char **argv)
{
    
    AVPacket pkt;
    int ret=0, i=0, j=0;
    
    if (argc < 3) {
        printf("usage: %s input1 ouput1 ... inputn outputn\n"
               "API example program to remux a media file with libavformat and libavcodec.\n"
               "The output format is guessed according to the file extension.\n"
               "\n", argv[0]);
        return 1;
    }
    
    av_register_all();
    avformat_network_init();
    
    uint64_t start_time=0;

    
    int total_strams= (argc-1)/2;
    for (i=0;i<total_strams;i++)
    {
    
        initStream(&stream[i]);
        char* in_filename  = argv[i*2+1];
        char* out_filename = argv[i*2+2];
    
    
    
        if ((ret = avformat_open_input(&stream[i].ifmt_ctx, in_filename, 0, 0)) < 0) {
            fprintf(stderr, "Could not open input file '%s'", in_filename);
            goto end;
        }
    
        if ((ret = avformat_find_stream_info(stream[i].ifmt_ctx, 0)) < 0) {
            fprintf(stderr, "Failed to retrievestreaminput stream information");
            goto end;
        }
    
        av_dump_format(stream[i].ifmt_ctx, 0, in_filename, 0);
        avformat_alloc_output_context2(&stream[i].ofmt_ctx, NULL, NULL, out_filename);
        if (!stream[i].ofmt_ctx) {
            fprintf(stderr, "Could not create output context\n");
            ret = AVERROR_UNKNOWN;
            goto end;
        }
    
        AVOutputFormat *ofmt = stream[i].ofmt_ctx->oformat;
        
        for ( j = 0; j < stream[i].ifmt_ctx->nb_streams; j++) {
            AVStream *in_stream = stream[i].ifmt_ctx->streams[j];
        
        
            if (in_stream->codec->codec_id==AV_CODEC_ID_TIMED_ID3) {
                in_stream->codec->codec_id=AV_CODEC_ID_MOV_TEXT;
            }
        
            AVStream *out_stream = avformat_new_stream(stream[i].ofmt_ctx, in_stream->codec->codec);
            if (!out_stream) {
                fprintf(stderr, "Failed allocating output stream\n");
                ret = AVERROR_UNKNOWN;
                goto end;
            }
        
            ret = avcodec_copy_context(out_stream->codec, in_stream->codec);
            if (ret < 0) {
                fprintf(stderr, "Failed to copy context from input to output stream codec context\n");
                goto end;
            }
            out_stream->codec->codec_tag = 0;
            if (stream[i].ofmt_ctx->oformat->flags & AVFMT_GLOBALHEADER)
                out_stream->codec->flags |= AV_CODEC_FLAG_GLOBAL_HEADER;
        
            out_stream->time_base           = in_stream->time_base;
            out_stream->sample_aspect_ratio = in_stream->sample_aspect_ratio;
            out_stream->codec->codec_tag = 0;
            stream[i].ofmt_ctx->oformat->flags |= AVFMT_TS_NONSTRICT;
        
        
            if(in_stream->codec->codec_id == AV_CODEC_ID_AAC) {
                ff_stream_add_bitstream_filter(out_stream, "aac_adtstoasc", NULL);

            }
        
        }
        av_dump_format(stream[i].ofmt_ctx, 0, out_filename, 1);
    
    
        if (!(ofmt->flags & AVFMT_NOFILE)) {
        
            ret = avio_open(&stream[i].ofmt_ctx->pb, out_filename, AVIO_FLAG_WRITE);
            if (ret < 0) {
                fprintf(stderr, "Could not open output file '%s'", out_filename);
                goto end;
            }
        }
    
        ret = avformat_write_header(stream[i].ofmt_ctx, NULL);
        if (ret < 0) {
            fprintf(stderr, "Error occurred when opening output file\n");
            goto end;
        }
    }
    
    start_time=calculateFirstPts(total_strams);
    
    for ( i=0;i<total_strams;i++)
    {
        
        struct Stream* currentStream = &stream[i];
        
        av_seek_frame(currentStream->ifmt_ctx, -1,0, AVSEEK_FLAG_BYTE);

        uint64_t offset = start_time;
        while (1) {
            
            AVStream *in_stream, *out_stream;
            ret = av_read_frame(currentStream->ifmt_ctx, &pkt);
            if (ret < 0)
                break;
        
            in_stream  = currentStream->ifmt_ctx->streams[pkt.stream_index];
            out_stream = currentStream->ofmt_ctx->streams[pkt.stream_index];
            struct TrackInfo* trackInfo = &currentStream->trackInfo[pkt.stream_index];
        
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
        
            ret = av_interleaved_write_frame(currentStream->ofmt_ctx, &pkt);
            if (ret < 0) {
                fprintf(stderr, "Error muxing packet\n");
                break;
            }
            av_packet_unref(&pkt);
        }
        av_write_trailer(currentStream->ofmt_ctx);
    }
    
end:
    
    for (i=0;i<total_strams;i++)
    {

        avformat_close_input(&stream[i].ifmt_ctx);
        
        AVOutputFormat *ofmt = stream[i].ofmt_ctx->oformat;

        /* close output */
        if (stream[i].ofmt_ctx && !(ofmt->flags & AVFMT_NOFILE))
            avio_closep(&stream[i].ofmt_ctx->pb);
    
        avformat_free_context(stream[i].ofmt_ctx);
    
        if (ret < 0 && ret != AVERROR_EOF) {
            fprintf(stderr, "Error occurred: %s\n", av_err2str(ret));
            return 1;
        }
    }
    return 0;
}
