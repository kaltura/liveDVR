/*
* Copyright (c) 2013 Stefano Sabatini
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
* THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

/**
 * @file
 * libavformat/libavcodec demuxing and muxing API example.
 *
 * Remux streams from one container format to another.
 * @example remuxing.c
 */
#define __STDC_CONSTANT_MACROS
extern "C"
{
    #include <libavutil/timestamp.h>
    #include <libavutil/mathematics.h>
    #include <libavformat/avformat.h>
    #include <libavutil/time.h>
}
#include <time.h>
#include <stdio.h>
#include <string>
#include <queue>
#include <vector>

#include <stdio.h>
#include <sys/ioctl.h> // For FIONREAD
#include <termios.h>
#include <stdbool.h>
#include <pthread.h>

static void log_packet(const char* id,const AVFormatContext *fmt_ctx, const AVPacket *pkt, const char *tag)
{
    AVRational *time_base = &fmt_ctx->streams[pkt->stream_index]->time_base;
    
    printf("[%s] %s: pts:%s pts_time:%s dts:%s dts_time:%s duration:%s duration_time:%s stream_index:%d\n",
           id,
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




bool should_terminate = false;

class Input
{
    AVFormatContext *ifmt_ctx, *ofmt_ctx;
    pthread_mutex_t mu_queue;
    pthread_cond_t cond;
    pthread_t thread;
    int64_t start_offset;
    std::string id;
    
public:
    Input(const std::string& _id) : ifmt_ctx(NULL),  ofmt_ctx(NULL), start_offset(0), id(_id)
    {
        
    }
    ~Input()
    {
        Clean();
    }
    
    bool Init(const char* in_filename, const char* out_filename)
    {
        int ret=0;
        if ((ret = avformat_open_input(&ifmt_ctx, in_filename, 0, 0)) < 0) {
            fprintf(stderr, "Could not open input file '%s'", in_filename);
            return false;
        }
        
        if ((ret = avformat_find_stream_info(ifmt_ctx, 0)) < 0) {
            fprintf(stderr, "Failed to retrieve input stream information");
            return false;
        }
        
        av_dump_format(ifmt_ctx, 0, in_filename, 0);
        char* format = NULL;
        
        if (strstr(out_filename,"rtmp") != NULL)
            format = "flv";
        
        
        avformat_alloc_output_context2(&ofmt_ctx, NULL, format, out_filename);
        if (!ofmt_ctx) {
            fprintf(stderr, "Could not create output context\n");
            ret = AVERROR_UNKNOWN;
            return false;
        }
        
        AVOutputFormat *ofmt = ofmt_ctx->oformat;
        
        for (int j = 0; j < ifmt_ctx->nb_streams; j++) {
            AVStream *in_stream = ifmt_ctx->streams[j];
            
            AVStream *out_stream = avformat_new_stream(ofmt_ctx, in_stream->codec->codec);
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
            if (ofmt_ctx->oformat->flags & AVFMT_GLOBALHEADER)
                out_stream->codec->flags |= AV_CODEC_FLAG_GLOBAL_HEADER;
            
            out_stream->time_base           = in_stream->time_base;
            out_stream->sample_aspect_ratio = in_stream->sample_aspect_ratio;
            out_stream->codec->codec_tag = 0;
            ofmt_ctx->oformat->flags |= AVFMT_TS_NONSTRICT;
            
            
            
        }
        av_dump_format(ofmt_ctx, 0, out_filename, 1);
        
        
        if (!(ofmt->flags & AVFMT_NOFILE)) {
            
            ret = avio_open(&ofmt_ctx->pb, out_filename, AVIO_FLAG_WRITE);
            if (ret < 0) {
                fprintf(stderr, "Could not open output file '%s'", out_filename);
                return false;
            }
        }
        
        ret = avformat_write_header(ofmt_ctx, NULL);
        if (ret < 0) {
            fprintf(stderr, "Error occurred when opening output file\n");
            return false;
        }
        return true;

    }
    
    void Start()
    {
        pthread_create(&thread, NULL, Thread, (void *)this);
        
    }
    
    void Stop()
    {
        pthread_join(thread, NULL);

    }
    
    void Clean()
    {
        av_write_trailer(ofmt_ctx);
        
        
        avformat_close_input(&ifmt_ctx);
        
        if (!ofmt_ctx) {
            return;
        }
        AVOutputFormat *ofmt = ofmt_ctx->oformat;
        
        /* close output */
        if (!(ofmt->flags & AVFMT_NOFILE))
            avio_closep(&ofmt_ctx->pb);
        avformat_free_context(ofmt_ctx);
        
    }
    
private:
    static void* Thread(void *context)
    {
        Input* pThis = (Input*)context;
        pThis->MainThread();
        pthread_exit(NULL);
    }
    
    void MainThread()
    {
        AVPacket pkt;
        
        
        
        int64_t refTime[10]={0};
        int64_t refPts[10]={0};
        int64_t ptsOffset[10]={0};
        while (!should_terminate) {
            AVStream *in_stream, *out_stream;
            
            int ret = av_read_frame(ifmt_ctx, &pkt);
            if (ret < 0)
                break;
            
            in_stream  = ifmt_ctx->streams[pkt.stream_index];
            out_stream = ofmt_ctx->streams[pkt.stream_index];
            
            
            
            
            //log_packet(input,ifmt_ctx[input], &pkt, "in");
            
            
            //printf("[%d] correcting pts %s to %s (%ld)\n",input,av_ts2str(pkt.pts),av_ts2str(pkt.pts+ptsOffset[pkt.stream_index]),ptsOffset[pkt.stream_index]);
            pkt.pts+=ptsOffset[pkt.stream_index];
            pkt.dts+=ptsOffset[pkt.stream_index];
            
            AVRounding a=(AVRounding)((int)AVRounding::AV_ROUND_NEAR_INF|(int)AVRounding::AV_ROUND_PASS_MINMAX);
            
            /* copy packet */
            pkt.pts = av_rescale_q_rnd(pkt.pts, in_stream->time_base, out_stream->time_base, a);
            pkt.dts = av_rescale_q_rnd(pkt.dts, in_stream->time_base, out_stream->time_base, a);
            pkt.duration = av_rescale_q(pkt.duration, in_stream->time_base, out_stream->time_base);
            pkt.pos = -1;
            
            int64_t now = av_gettime();
            if (refPts[pkt.stream_index]==0) {
                refPts[pkt.stream_index]=pkt.pts;
                refTime[pkt.stream_index]=now;
            }
            int64_t running_pts = (pkt.pts-refPts[pkt.stream_index]);
            
            int64_t timeToSleep =  running_pts - (now - refTime[pkt.stream_index])/1000;
            if (timeToSleep>0) {
                if (timeToSleep>1000) {
                    timeToSleep=1000;
                }
                av_usleep(timeToSleep*1000);
            }
            
            if (running_pts<start_offset) {
                continue;
            }
            log_packet(id.c_str(),ofmt_ctx, &pkt, "out");
            
            ret = av_interleaved_write_frame(ofmt_ctx, &pkt);
            if (ret < 0) {
                fprintf(stderr, "Error muxing packet\n");
                break;
            }
            av_packet_unref(&pkt);
        }
        
        
        
    }
};


int main(int argc, char **argv)
{

    int ret, i;
    
    if (argc < 3) {
        printf("usage: %s input output\n"
               "API example program to remux a media file with libavformat and libavcodec.\n"
               "The output format is guessed according to the file extension.\n"
               "\n", argv[0]);
        return 1;
    }
    
    
    av_register_all();
    avformat_network_init();
    int total_strams= (argc-1)/3;
    std::vector<Input*> inputs;
    for (int i=0;i<total_strams;i++)
    {
        
        char* in_filename  = argv[i*3+1];
        char* out_filename = argv[i*3+2];
        
        int64_t start_offset= atoi(argv[i*3+3]);
     
        auto pInput=new Input(std::to_string(i));
        pInput->Init(in_filename,out_filename);
        inputs.push_back(pInput);
    }
    for (int i=0;i<inputs.size();i++)
    {
        
        inputs[i]->Start();
    }
    while(1)
    {
        if(kbhit())
        {
            int ch=getchar();
            if(ch=='s')
            {
                AVRational time_base = {1,1};
                int seconds = 100000;
                printf("moving forward %d seconds\n",seconds);
                
               // for (int i=0;i<ifmt_ctx[input]->nb_streams;i++) {
              //      ptsOffset[i] += av_rescale_q(seconds, time_base, ifmt_ctx[input]->streams[i]->time_base);
                //    refPts[i]=0;
                //}
                
            }
            if(ch==27)
            {
                break;
            }
            
        }
        

    }
    should_terminate = true;
    
    for (int i=0;i<inputs.size();i++)
    {
        inputs[i]->Stop();
    }
    
end:
    for (int i=0;i<inputs.size();i++)
    {
        inputs[i]->Clean();
        delete inputs[i];
    }
    inputs.clear();

    
    
    
    return 0;
}
