{
"variables": {
"ffmpegDir": "<(module_root_dir)/build/FFmpeg"
},
"targets": [

{
    "target_name": "FormatConverter",
    "type": "<(library)",
    "sources": [
    "src/NodeFormatConverter.cpp" ,
    "src/Converter.cpp" ,
    "src/AVFormat.cpp" ,
    "src/NodeStream.cpp",
    "src/Stream.cpp",
    "include/Utils.h",
    "include/Stream.h",
    "include/Converter.h",
    "include/AVFormat.h",
    "include/MemoryStream.h",
    "include/NodeStream.h",
    "include/NodeFormatConverter.h"
    ],
    "include_dirs": [ "<!(node -p -e \"require('path').relative('.', require('path').dirname(require.resolve('nan')))\")",
    "<(ffmpegDir)",
    "include" ],
    "conditions": [
    [ 'OS=="linux" or OS=="freebsd" or OS=="openbsd" or OS=="solaris"',
    {
       "cflags": [
            "-std=c++11",
            "-D__STDC_CONSTANT_MACROS",
            "-v",
            "-fPIC",
        ],
	 "cflags_cc": [
                "-fexceptions"
        ],
	"ldflags":[
"-rdynamic -Wl,-whole-archive  <(ffmpegDir)/libavcodec/libavcodec.a <(ffmpegDir)/libavformat/libavformat.a <(ffmpegDir)/libavutil/libavutil.a -Wl,-no-whole-archive",
	"-Wl,-Bsymbolic",
	"-o ../../bin/linux/FormatConverter.node"
	]
     }
    ],
 
       ['OS=="mac"', {
           
        "xcode_settings": {
            "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
            "OTHER_CPLUSPLUSFLAGS" : ["-std=c++11","-stdlib=libc++", "-v", "-D__STDC_CONSTANT_MACROS"],
            "OTHER_LDFLAGS": ["-stdlib=libc++","-undefined dynamic_lookup"],
            "MACOSX_DEPLOYMENT_TARGET": "10.7",
            "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
            
         },
        "link_settings": {
            "libraries": [
                "/usr/lib/libiconv.dylib",
                "/usr/lib/libz.dylib",
                "<(ffmpegDir)/libavcodec/libavcodec.a",
                "<(ffmpegDir)/libavformat/libavformat.a",
                "<(ffmpegDir)/libavutil/libavutil.a"
            ]
        }
   
       }]
    ],

},
]
}
