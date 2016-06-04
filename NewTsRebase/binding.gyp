{
	"targets": [
		{
			"target_name": "TsRebase",
			"sources": [ "rebase.cc", "src/ts_rebase_impl.c", "src/common.c", "src/dynamicBuffer.c", "src/frame.c", "src/header.c", "src/id3v2lib.c", "src/mpegts_stream_walker.c", "src/mpegTs.c", "src/mpegTsPacketizer.c", "src/ts_rebase_impl.c", "src/types.c", "src/utils.c" ],
			'include_dirs': [
				"<!(node -p -e \"require('path').relative('.', require('path').dirname(require.resolve('nan')))\")",
				"include/"
			]

		}
	]
}
