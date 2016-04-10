//
//  NodeFormatConverter.cpp
//  binding
//
//  Created by Igor Shevach on 3/2/16.
//
//

#include "nan.h"

#include "NodeFormatConverter.h"
#include "NodeStream.h"
#include <unordered_map>


namespace converter {
    
    
    // class TS2MP4Convertor
    
    void TS2MP4Convertor::Init(v8::Handle<v8::Object> exports){
        
        // Prepare constructor template
        Local<FunctionTemplate> tpl = FunctionTemplate::New(New);
        tpl->SetClassName(String::New("TS2MP4Convertor"));
        tpl->InstanceTemplate()->SetInternalFieldCount(1);
        
        // Prototype
        Nan::SetPrototypeMethod(tpl, "push", push);
        Nan::SetPrototypeMethod(tpl, "on", on);
        Nan::SetPrototypeMethod(tpl, "end", end);
        
        constructor = v8::Persistent<v8::Function>::New(tpl->GetFunction());
        exports->Set(String::New( "TS2MP4Convertor"),
                     tpl->GetFunction());
        
        Nan::HandleScope scope;
        // Now we need to create the JS version of the Buffer I was telling you about.
        // To do that we need to actually pull it from the execution context.
        // First step is to get a handle to the global object.
        v8::Local<v8::Object> globalObj = v8::Context::GetCurrent()->Global();
        
        // Now we need to grab the Buffer constructor function.
        bufferConstructor = v8::Persistent<Function>::New(globalObj->Get(v8::String::New("Buffer")).As<Function>());
        
    }
    
    NAN_METHOD(TS2MP4Convertor::NewInstance) {
        
        const unsigned argc = 0;
        Local<Value> argv[argc] = {  };
        Local<Function> cons = Nan::New<Function>(constructor);
        Local<Object> instance = cons->NewInstance(argc, argv);
        
        info.GetReturnValue().Set(instance);
    }
    
    TS2MP4Convertor::TS2MP4Convertor()
    :m_pAsyncConverter(nullptr)
    {
        av_log(nullptr,AV_LOG_TRACE,"TS2MP4Convertor::TS2MP4Convertor");
        // supported event types
        m_callSubscriptions.insert(CALLBACK_SUBS::value_type(std::string("end"),CallbackInfo()));
        m_callSubscriptions.insert(CALLBACK_SUBS::value_type(std::string("data"),CallbackInfo()));
        m_callSubscriptions.insert(CALLBACK_SUBS::value_type(std::string("error"),CallbackInfo()));
    }
    
    TS2MP4Convertor::~TS2MP4Convertor(){
        av_log(nullptr,AV_LOG_TRACE,"TS2MP4Convertor::~TS2MP4Convertor");
    }
    
    Handle<Value> TS2MP4Convertor::New(const Arguments& args) {
        if (args.IsConstructCall()) {
            TS2MP4Convertor* obj = new TS2MP4Convertor();
            obj->Wrap(args.This());
            return args.This();
        } else {
            // Invoked as plain function `MyObject(...)`, turn into construct call.
            const int argc = 0;
            Local<Value> argv[argc] = {  };
            Local<Function> cons = Nan::New<Function>(constructor);
            return cons->NewInstance(argc, argv);
        }
    }
    
    NAN_METHOD (TS2MP4Convertor::end)
    {
        TS2MP4Convertor* obj = ObjectWrap::Unwrap<TS2MP4Convertor>(info.Holder());
        obj->internalEnd(info);
    }
    
    NAN_METHOD (TS2MP4Convertor::push)
    {
        TS2MP4Convertor* obj = ObjectWrap::Unwrap<TS2MP4Convertor>(info.Holder());
        obj->internalPush(info);
    }
    
    NAN_METHOD (TS2MP4Convertor::on)
    {
        TS2MP4Convertor* obj = ObjectWrap::Unwrap<TS2MP4Convertor>(info.Holder());
        obj->internalOn(info);
    }
    
    NAN_METHOD (TS2MP4Convertor::internalOn)
    {
        if(info.Length() != 2){
            Nan::ThrowError("TS2MP4Convertor::on. expected 2 args");
        }
        
        if(!info[0]->IsString()){
            Nan::ThrowError("TS2MP4Convertor::on. expected event name");
        }
        
        if(!info[1]->IsFunction()){
            Nan::ThrowError("TS2MP4Convertor::on. expected callback");
        }
        
        String::AsciiValue eventName (info[0]);
        std::string strEvent(*eventName);
        SUBS_iter found = m_callSubscriptions.find(strEvent);
        if( found == m_callSubscriptions.end() ){
            Nan::ThrowError(("TS2MP4Convertor::on. unsupported event "+strEvent).c_str());
        }
        if( found->second.m_flags & ~DELIVERED ){
            found->second.m_cb.reset(new Nan::Callback(info[1].As<Function>()));
        }
        else if( found->second.m_flags & READY ){
            this->runCompleteCallback(found);
        }
        info.GetReturnValue().Set(info.Holder());
    }
    
   
    
    NAN_METHOD(TS2MP4Convertor::internalPush)
    {
        Nan::HandleScope scope;
        
        if(info[0]->IsNull() || info[0]->IsUndefined()){
            internalEnd(info);
            return;
        }
        else if(Buffer::HasInstance(info[0]))
        {
            if(!*input){
                
                const uint8_t *pb = (const uint8_t *)Buffer::Data(info[0]);
                size_t len = Buffer::Length(info[0]);
              
                std::shared_ptr<InputStreamOnBuffer> inputStream = std::make_shared<InputStreamOnBuffer>(info[0]->ToObject(),pb,len);
                
                std::shared_ptr<NodeOutputStream> outputStream = std::make_shared<NodeOutputStream>();
                
                av_log(nullptr,AV_LOG_TRACE,"internalPush. init");
                
                _N(this->init(std::static_pointer_cast<StreamBase>(inputStream),
                              std::static_pointer_cast<StreamBase>(outputStream) ));
                
            } 
        }
        
        info.GetReturnValue().Set(info.This());
    }
    
    NAN_METHOD(TS2MP4Convertor::internalEnd)
    {
        if( input.GetStream() == NULL){
            Nan::ThrowError("internalPush. null buffer");
        }
        
        if(m_pAsyncConverter != NULL){
            av_log(*input,AV_LOG_TRACE,"internalPush. task already scheduled. skipping");
        } else {
            //no more input - kick off
            av_log(*input,AV_LOG_TRACE,"internalPush. kick off worker");
            
            m_pAsyncConverter = new AsyncProgressConverter(*this);
            
            Nan::AsyncQueueWorker(m_pAsyncConverter);
        }
        
        info.GetReturnValue().Set(info.This());
    }
    
    
    // called by libuv worker in separate thread
    void TS2MP4Convertor::Execute (const TS2MP4Convertor::AsyncProgressConverter::ExecutionProgress& progress) {
        
        int result = onData();
        if( result < 0){
            std::ostringstream error;
            error << " TS2MP4Convertor::Execute failed with error " << result;
            throw std::runtime_error(error.str());
        }
    }
    
    void TS2MP4Convertor::HandleProgressCallback(const char *data, size_t size) {
        //TODO: send partial report callbacks
    }
    
    // called by libuv in event loop when async function completes
    void TS2MP4Convertor::HandleOKCallback () {
        
        av_log(*input,AV_LOG_TRACE,"HandleOKCallback");
        
        close();
        
        runCompleteCallback(m_callSubscriptions.find("data"));
        runCompleteCallback(m_callSubscriptions.find("end"));
    }
    
    void TS2MP4Convertor::runCompleteCallback(TS2MP4Convertor::SUBS_iter iter){
        
        if( iter->second.m_flags & DELIVERED){
            av_log(nullptr,AV_LOG_TRACE,"runCompleteCallback. callback event (%s) already delivered. skipping",iter->first.c_str());
            return;
        }
        
        iter->second.m_flags |= READY;
        
        if(iter->second.m_cb){
            
            av_log(nullptr,AV_LOG_TRACE,"runCompleteCallback. return callback");
            
            Isolate * isolate = Isolate::GetCurrent();
            Local<Value> result;
            
            std::shared_ptr<NodeOutputStream> nos(std::static_pointer_cast<NodeOutputStream> (output.GetStream()));
            if(nos){
                if(iter->first == "end"){
                    result = nos->GetFileInfo(isolate);
                } else {
                    result = nos->GetData(isolate);
                    //TODO: fix TS2MP4Convertor dtor never called!
                    //output.GetStream().reset();
                }
            }
            
            if(!result.IsEmpty()) {
                Local<Value> argv[] = { result };
                iter->second.m_cb->Call(1, argv);
            } else {
                av_log(nullptr,AV_LOG_TRACE,"runCompleteCallback. empty result, probably a bug or error.");
                deliverError(std::string("empty args, probably a bug or error. ") + iter->first);
            }
            
            iter->second.m_flags |= DELIVERED;
            iter->second.m_cb.reset();
        }
        
    }
    
    void TS2MP4Convertor::deliverError(const std::string &message){
        
        SUBS_iter iter = m_callSubscriptions.find("error");
      
        if(iter != m_callSubscriptions.end() && iter->second.m_cb){
            v8::Local<v8::Value> argv[] = {
                v8::Exception::Error(Nan::New<String>(message.c_str()).ToLocalChecked())
            };
            iter->second.m_cb->Call(1, argv);
        } else {
            av_log(nullptr,AV_LOG_TRACE,"deliverError. no subscription for error event");
        }
    }
    
    
    v8::Persistent<v8::Function> TS2MP4Convertor::constructor;
    v8::Persistent<v8::Function> TS2MP4Convertor::bufferConstructor;
    
    
    void atExit(void* arg){
        av_log(nullptr,AV_LOG_TRACE,"atExit!");
    }
    
    void handleSignal(int signum){
        av_log(nullptr,AV_LOG_WARNING,"handleSignal %d",signum);
    }
    
    
    class Configuration {
        
    public:
        
        template < typename Key, typename Value>
        class predefined : public std::unordered_map<Key,Value>
        {
        public:
            predefined &operator=(const std::pair<Key,Value> &p ){
                std::unordered_map<Key,Value>::insert(p);
                return *this;
            }
            predefined &operator,(const std::pair<Key,Value> &p){
                std::unordered_map<Key,Value>::insert(p);
                return *this;
            }
        };
        
        
        static Handle<Value> ModuleConfigure(const Arguments& args){
            
            Nan::HandleScope scope;
            
            
            if(args[0]->IsObject()){
                
                predefined<std::string,int> logLevels;
                logLevels = std::pair<std::string,int>("warn",AV_LOG_WARNING),
                std::pair<std::string,int>("error",AV_LOG_ERROR),
                std::pair<std::string,int>("info",AV_LOG_INFO),
                std::pair<std::string,int>("debug",AV_LOG_DEBUG),
                std::pair<std::string,int>("trace",AV_LOG_TRACE);
                
                int avlog_level = AV_LOG_WARNING;
                
                Local<Object> opts = args[0].As<Object>();
                String::AsciiValue strLevel (opts->Get(v8::String::New("logLevel")));
                
                predefined<std::string,int>::iterator found =  logLevels.find(*strLevel);
                if( found != logLevels.end() ){
                    avlog_level =found->second;
                }
                if(ConverterAppInst::instance().init(avlog_level)){
                    Nan::ThrowTypeError("failed to initialize ffmpeg runtime");
                }
                
                //         Local<Number> num = Local<Number>::Cast(args[0]->Get(Nan::New<String>("logLevel"));
            } else {
                if(ConverterAppInst::instance().init()){
                    Nan::ThrowTypeError("failed to initialize ffmpeg runtime");
                }
            }
            return Handle<Value>();
        }
        
        static void Initialize(Handle<Object> exports)
        {
            Local<FunctionTemplate> tpl = FunctionTemplate::New(ModuleConfigure);
            exports->Set(String::New( "Configure"),
                         tpl->GetFunction());
            
            if(ConverterAppInst::instance().init()){
                Nan::ThrowTypeError("failed to initialize ffmpeg runtime");
            }
            
            TS2MP4Convertor::Init(exports);
            
            AtExit(atExit,nullptr);
            ::signal(SIGABRT,handleSignal);
        }
    };
    
    
    NODE_MODULE(FormatConverter, Configuration::Initialize)
};
