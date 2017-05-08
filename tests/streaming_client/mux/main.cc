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
#include <tuple>

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




bool should_terminate = false;

class Input
{
    AVFormatContext *ifmt_ctx, *ofmt_ctx;
    std::queue<std::string> mq;
    pthread_mutex_t mu_queue;
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
    
    void sendMessage(std::string str)
    {
        pthread_mutex_lock(&mu_queue);
        mq.push(str);
        pthread_mutex_unlock(&mu_queue);

    }
    bool Init(const char* in_filename, const char* out_filename, int64_t _start_offset)
    {
        start_offset=_start_offset;
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
            out_stream->time_base =  {1,1000};
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
        
        if (ifmt_ctx) {
            avformat_close_input(&ifmt_ctx);
            ifmt_ctx=NULL;
        }
        
        if (ofmt_ctx) {
            
            AVOutputFormat *ofmt = ofmt_ctx->oformat;
        
            /* close output */
            if (!(ofmt->flags & AVFMT_NOFILE))
                avio_closep(&ofmt_ctx->pb);
            avformat_free_context(ofmt_ctx);
            ofmt_ctx=NULL;
        }
    }
    
    struct Stats
    {
        int64_t currentPts,running_clock;
        float rate;
    } m_currentStat;
    
private:
    std::string getMessage()
    {
        std::string retVal;
        pthread_mutex_lock(&mu_queue);
        if (!mq.empty())
        {
            retVal = mq.front();
            mq.pop();
        }
        pthread_mutex_unlock(&mu_queue);
        return retVal;
        
    }

    
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
        
        m_currentStat.currentPts=0;
        m_currentStat.rate=0;
        bool isPaused=false;
        
        std::queue<std::tuple<int64_t,int64_t>> timeQueue;
        bool waitforKeyFrame[10]={true};

        while (!should_terminate) {
            
            auto msg=getMessage();
            if (msg.size()>0)
            {
                if (msg.compare("pause")==0)
                {
                    isPaused=true;
                }
                if (msg.compare("resume")==0)
                {
                    isPaused=false;
                }

            }
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
            int64_t running_clock = (now - refTime[pkt.stream_index])/1000;
            
            timeQueue.push(std::make_tuple(pkt.pts,now/1000));
            
            int64_t timeToSleep =  running_pts - running_clock ;
            if (timeToSleep>0) {
                if (timeToSleep>1000) {
                    timeToSleep=1000;
                }
                av_usleep(timeToSleep*1000);
            }
            
            if (running_pts<start_offset || isPaused) {
                m_currentStat.currentPts= AV_NOPTS_VALUE;
                for (int i=0;i<10;i++)
                    waitforKeyFrame[i]=true;
                
                continue;
            }
            
            if (waitforKeyFrame[pkt.stream_index]) {
                if ((pkt.flags & AV_PKT_FLAG_KEY)==AV_PKT_FLAG_KEY) {
                    waitforKeyFrame[pkt.stream_index]=false;
                } else {
                    continue;
                }
            }
            //log_packet(id.c_str(),ofmt_ctx, &pkt, "out");
            
            m_currentStat.currentPts = pkt.pts;
            m_currentStat.running_clock = running_clock;
            auto& f=timeQueue.front();
            auto& b=timeQueue.back();
            
            auto pts_diff= std::get<0>(b)-std::get<0>(f);
            auto clock_diff=std::get<1>(b)-std::get<1>(f);
            if (clock_diff!=0) {
                m_currentStat.rate=(float)(pts_diff)/(float)clock_diff;
            }

            if (timeQueue.size()>=100) {
                timeQueue.pop();
            }
            
            ret = av_interleaved_write_frame(ofmt_ctx, &pkt);
            if (ret < 0) {
                fprintf(stderr, "Error muxing packet\n");
                break;
            }
            
            av_packet_unref(&pkt);
        }

        
        av_write_trailer(ofmt_ctx);
        
    }
};


int main(int argc, char **argv)
{

    
    if (argc  < 4 || (argc-1) % 3!=0) {
        printf("usage: %s input1 output1 startoffsetn ... inputn outputn startoffsetnn"
               "Stream input1 to output1 starting at startoffset (in ms) \n"
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
        pInput->Init(in_filename,out_filename,start_offset);
        inputs.push_back(pInput);
    }
    for (int i=0;i<inputs.size();i++)
    {
        
        inputs[i]->Start();
    }
    printf("\n\nPress Esc to stop, 1 to pause steam 1, ! to resume stream 1, 2 to pause stream 2, @ to resume stream 2 and so on\n\n");

    printf("============================================================\n");
    for (int i=0;i<inputs.size();i++)
    {
        printf("|  Input # %2d PTS   ",i+1);

    }
    printf("\n============================================================\n");

    
    std::string pauseIndex="123456789";
    std::string  resumeIndex="!@#$%^&*(";
    while(1)
    {
        if(kbhit())
        {
            int ch=getchar();
            if(ch=='s')
            {
                //AVRational time_base = {1,1};
                //int seconds = 100000;
                //printf("moving forward %d seconds\n",seconds);
                
               // for (int i=0;i<ifmt_ctx[input]->nb_streams;i++) {
              //      ptsOffset[i] += av_rescale_q(seconds, time_base, ifmt_ctx[input]->streams[i]->time_base);
                //    refPts[i]=0;
                //}
                
            }
            std::string::size_type loc = pauseIndex.find( ch, 0 );
            if( loc != std::string::npos ) {
                inputs[loc]->sendMessage("pause");
            } else {
                loc = resumeIndex.find( ch, 0 );
                if ( loc != std::string::npos ) {
                    inputs[loc]->sendMessage("resume");
                }
            }
            if(ch==27)
            {
                break;
            }
            
        }
        printf("\r");
        for (int i=0;i<inputs.size();i++)
        {
            auto stat=inputs[i]->m_currentStat;
            printf("| %8s (x%.3f) ",av_ts2str(stat.currentPts),stat.rate);
        }
        printf("|                                    ");
        av_usleep(1000);
        

    }
    printf("\n============================================================\n");

    should_terminate = true;
    
    for (int i=0;i<inputs.size();i++)
    {
        inputs[i]->Stop();
        inputs[i]->Clean();
        delete inputs[i];
    }
    inputs.clear();

    
    
    
    return 0;
}
