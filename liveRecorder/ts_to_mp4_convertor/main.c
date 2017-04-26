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

int main(int argc, char **argv)
{
    AVFormatContext *ifmt_ctx[MAX_STREAMS]= { NULL}, *ofmt_ctx[MAX_STREAMS] ={ NULL};
    AVPacket pkt;
    int ret=0, i, j;
    
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
    
        char* in_filename  = argv[i*2+1];
        char* out_filename = argv[i*2+2];
    
    
    
        if ((ret = avformat_open_input(&ifmt_ctx[i], in_filename, 0, 0)) < 0) {
            fprintf(stderr, "Could not open input file '%s'", in_filename);
            goto end;
        }
    
        if ((ret = avformat_find_stream_info(ifmt_ctx[i], 0)) < 0) {
            fprintf(stderr, "Failed to retrieve input stream information");
            goto end;
        }
    
        av_dump_format(ifmt_ctx[i], 0, in_filename, 0);
        avformat_alloc_output_context2(&ofmt_ctx[i], NULL, NULL, out_filename);
        if (!ofmt_ctx[i]) {
            fprintf(stderr, "Could not create output context\n");
            ret = AVERROR_UNKNOWN;
            goto end;
        }
    
        AVOutputFormat *ofmt = ofmt_ctx[i]->oformat;
        
        for (j = 0; j < ifmt_ctx[i]->nb_streams; j++) {
            AVStream *in_stream = ifmt_ctx[i]->streams[j];
        
        
            if (in_stream->codec->codec_id==AV_CODEC_ID_TIMED_ID3) {
                in_stream->codec->codec_id=AV_CODEC_ID_MOV_TEXT;
            }
        
            AVStream *out_stream = avformat_new_stream(ofmt_ctx[i], in_stream->codec->codec);
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
            if (ofmt_ctx[i]->oformat->flags & AVFMT_GLOBALHEADER)
                out_stream->codec->flags |= AV_CODEC_FLAG_GLOBAL_HEADER;
        
            out_stream->time_base           = in_stream->time_base;
            out_stream->sample_aspect_ratio = in_stream->sample_aspect_ratio;
            if (start_time < in_stream->start_time) {
                start_time=in_stream->start_time;
            }
        
            out_stream->codec->codec_tag = 0;
            ofmt_ctx[i]->oformat->flags |= AVFMT_TS_NONSTRICT;
        
        
            if(in_stream->codec->codec_id == AV_CODEC_ID_AAC) {
                ff_stream_add_bitstream_filter(out_stream, "aac_adtstoasc", NULL);

            }
        
        }
        av_dump_format(ofmt_ctx[i], 0, out_filename, 1);
    
    
        if (!(ofmt->flags & AVFMT_NOFILE)) {
        
            ret = avio_open(&ofmt_ctx[i]->pb, out_filename, AVIO_FLAG_WRITE);
            if (ret < 0) {
                fprintf(stderr, "Could not open output file '%s'", out_filename);
                goto end;
            }
        }
    
        ret = avformat_write_header(ofmt_ctx[i], NULL);
        if (ret < 0) {
            fprintf(stderr, "Error occurred when opening output file\n");
            goto end;
        }
    }
    
    for (i=0;i<total_strams;i++)
    {
        while (1) {
            AVStream *in_stream, *out_stream;
            ret = av_read_frame(ifmt_ctx[i], &pkt);
            if (ret < 0)
                break;
        
            in_stream  = ifmt_ctx[i]->streams[pkt.stream_index];
            out_stream = ofmt_ctx[i]->streams[pkt.stream_index];
        
        
            if(kbhit())
            {
                int ch=getchar();
                if(ch==27)
                {
                    break;
                }
            
            }
        
        
            // log_packet(ifmt_ctx, &pkt, "in");
        
            /* copy packet */
            pkt.pts = av_rescale_q_rnd(pkt.pts-start_time, in_stream->time_base, out_stream->time_base, AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX);
            pkt.dts = av_rescale_q_rnd(pkt.dts-start_time, in_stream->time_base, out_stream->time_base, AV_ROUND_NEAR_INF|AV_ROUND_PASS_MINMAX);
            pkt.duration = av_rescale_q(pkt.duration, in_stream->time_base, out_stream->time_base);
            pkt.pos = -1;
            
            if (pkt.pts<0) {
                //trim packets outside of GOP
                continue;
            }
        
            //log_packet(ofmt_ctx, &pkt, "out");
        
            ret = av_interleaved_write_frame(ofmt_ctx[i], &pkt);
            if (ret < 0) {
                fprintf(stderr, "Error muxing packet\n");
                break;
            }
            av_packet_unref(&pkt);
        }
        av_write_trailer(ofmt_ctx[i]);
    }
    
end:
    
    for (i=0;i<total_strams;i++)
    {

        avformat_close_input(&ifmt_ctx[i]);
        
        AVOutputFormat *ofmt = ofmt_ctx[i]->oformat;

        /* close output */
        if (ofmt_ctx[i] && !(ofmt->flags & AVFMT_NOFILE))
            avio_closep(&ofmt_ctx[i]->pb);
    
        avformat_free_context(ofmt_ctx[i]);
    
        if (ret < 0 && ret != AVERROR_EOF) {
            fprintf(stderr, "Error occurred: %s\n", av_err2str(ret));
            return 1;
        }
    }
    return 0;
}
