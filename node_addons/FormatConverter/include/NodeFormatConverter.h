//
//  NodeFormatConverter.h
//  binding
//
//  Created by Igor Shevach on 3/6/16.
//
//

#ifndef binding_NodeFormatConverter_h
#define binding_NodeFormatConverter_h

#include "nan.h"
#include "Utils.h"
#include "AVFormat.h"
#include "Converter.h"
#include <unordered_map>
#include <sstream>

using namespace v8;
using namespace node;

#define _N(e)\
{\
int c = (e);\
if(c){\
return Nan::ThrowTypeError("error ");\
}\
}


namespace converter {
    
       
    class TS2MP4Convertor : public node::ObjectWrap,
    public Converter
    {
        class AsyncProgressConverter : public Nan::AsyncProgressWorker {
            //AsyncProgressWorker
          
        public:
            AsyncProgressConverter(TS2MP4Convertor &obj)
            :Nan::AsyncProgressWorker(nullptr),
            m_handler(obj)
            ,m_lockObj(obj.handle_)
            {
            }
            
            ~AsyncProgressConverter(){
                m_lockObj.Reset();
            }
        private:
            // called by libuv worker in separate thread
            virtual void Execute (const ExecutionProgress& progress){
                try {
                    m_handler.Execute(progress);
                } catch(std::exception &e) {
                    this->SetErrorMessage(e.what());
                }
            }
            
            virtual void HandleProgressCallback(const char *data, size_t size){
                m_handler.HandleProgressCallback(data,size);
            }
            
            virtual void HandleOKCallback (){
                m_handler.HandleOKCallback();
            }
            
            virtual void HandleErrorCallback() {
                m_handler.deliverError(ErrorMessage());
            }
            
            TS2MP4Convertor &m_handler;
            Nan::Persistent<Object> m_lockObj;
        };
        
        friend class AsyncProgressConverter;
    public:
        static void Init(v8::Handle<v8::Object> exports);
        
        static NAN_METHOD(NewInstance);
        
        static  v8::Persistent<v8::Function> constructor, bufferConstructor;
    private:
        
        TS2MP4Convertor();
        
        ~TS2MP4Convertor();
        
        static Handle<Value> New(const Arguments& args);
        
        static NAN_METHOD (on);
        
        static NAN_METHOD (push);
       
        static NAN_METHOD (end);
        
        NAN_METHOD(internalPush);
        
        NAN_METHOD(internalOn);
        
        NAN_METHOD(internalEnd);
        
        // called by libuv worker in separate thread
        void Execute (const AsyncProgressConverter::ExecutionProgress& progress);
        
        virtual void HandleProgressCallback(const char *data, size_t size);
        
        // called by libuv in event loop when async function completes
        void HandleOKCallback ();
        
        AsyncProgressConverter *m_pAsyncConverter;
        
        // managing event subscriptions
        
        
        typedef std::unique_ptr<Nan::Callback> CALLBACK_PTR;
        // callback state
        enum CALLBACK_STATE{ INIT = 1, READY = 2, DELIVERED = 4};
        
        struct CallbackInfo {
            
            CallbackInfo(Nan::Callback *cb = nullptr)
            :m_cb(cb),
            m_flags(INIT)
            {}
           
            CALLBACK_PTR     m_cb;
            unsigned char   m_flags;
        };
        
        bool m_bEOS;
        
        typedef std::unordered_map< std::string, CallbackInfo > CALLBACK_SUBS;
        typedef CALLBACK_SUBS::iterator SUBS_iter;
        CALLBACK_SUBS m_callSubscriptions;
        
        void runCompleteCallback(SUBS_iter iter);
        void deliverError(const std::string &message);
    };
    
};

#endif
