clear
(( $# )) &&  entryId=$1 || entryId=0_simstream1
partnerId=123
address=http://localhost:8080
set -x
echo HLS:
curl $address/live/hls/p/$partnerId/e/$entryId/master.m3u8 -i
curl $address/live/hls/p/$partnerId/e/$entryId/index-f1.m3u8 -i
echo HDS
curl $address/live/hds/p/$partnerId/e/$entryId/manifest.f4m  -i
curl $address/live/hds/p/$partnerId/e/$entryId/bootstrap-v1-a1.abst -i
echo MSS
curl $address/live/mss/p/$partnerId/e/$entryId/manifest -i
echo DASH
curl $address/live/dash/p/$partnerId/e/$entryId/manifest.mpd -i



echo HLS legacy :
curl $address/kLive/smil:${entryId}_all.smil/master.m3u8 -i
curl $address/kLive/smil:${entryId}_all.smil/1/index.m3u8 -i
curl $address/kLive/smil:${entryId}_all.smil/manifest.f4m -i
curl $address/kLive/smil:${entryId}_all.smil/bootstrap-v1-a1.abst -i