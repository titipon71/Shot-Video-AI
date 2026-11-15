#!/usr/bin/env bash
# Synthesises the trailer sound bed for tame-demo with FFmpeg only (no samples, no copyrighted audio).
# Output: assets/audio/tame-bed.wav (32 s, 48 kHz stereo). Cue times match the scene timeline in index.html.
set -euo pipefail
cd "$(dirname "$0")/.."
OUT=assets/audio/tame-bed.wav
TMP=$(mktemp -d); trap 'rm -rf "$TMP"' EXIT
SR=48000; n=0; INPUTS=(); FILTERS=""

gen() { # gen <file> <ffmpeg lavfi source> [extra filters]
  ffmpeg -v error -y -f lavfi -i "$2" -af "${3:-anull},aformat=sample_rates=$SR:channel_layouts=stereo" "$TMP/$1.wav"; }
place() { # place <file> <start-seconds> <gain>
  local ms; ms=$(awk -v t="$2" 'BEGIN{printf "%d", t*1000}')
  INPUTS+=(-i "$TMP/$1.wav"); FILTERS+="[$n:a]adelay=${ms}|${ms},volume=$3[c$n];"; n=$((n+1)); }

# building blocks
gen drone "aevalsrc='0.10*sin(2*PI*55*t)*(0.75+0.25*sin(2*PI*0.23*t))+0.06*sin(2*PI*82.41*t+0.6*sin(2*PI*0.5*t))+0.035*sin(2*PI*110.2*t)*(0.5+0.5*sin(2*PI*0.11*t))':s=$SR:d=32" "lowpass=f=520,afade=t=in:d=1.6,afade=t=out:st=29.8:d=2.2"
gen boom "aevalsrc='0.9*sin(2*PI*(34+80*exp(-7*t))*t)*exp(-1.9*t)+0.35*sin(2*PI*(68+140*exp(-10*t))*t)*exp(-4*t)+0.25*(random(0)*2-1)*exp(-45*t)':s=$SR:d=3.2" "lowpass=f=2400"
gen hit "aevalsrc='0.8*sin(2*PI*(52+110*exp(-14*t))*t)*exp(-5*t)+0.3*(random(1)*2-1)*exp(-60*t)':s=$SR:d=1.2" "lowpass=f=3000"
gen tick "aevalsrc='0.6*sin(2*PI*(90+160*exp(-30*t))*t)*exp(-14*t)':s=$SR:d=0.5"
gen whoosh "anoisesrc=d=0.6:c=pink:r=$SR:a=0.5" "highpass=f=350,lowpass=f=5200,afade=t=in:d=0.42:curve=exp,afade=t=out:st=0.42:d=0.18"
gen snap "aevalsrc='(random(2)*2-1)*exp(-26*t)+0.6*sin(2*PI*1800*t)*exp(-50*t)':s=$SR:d=0.6" "highpass=f=1200"
gen rumble "anoisesrc=d=1.0:c=brown:r=$SR:a=0.9" "lowpass=f=140,afade=t=in:d=0.15,afade=t=out:st=0.6:d=0.4,volume=2.2"
gen riser1 "aevalsrc='0.35*sin(2*PI*(70*t+160*t*t))*pow(t/1.1,2)':s=$SR:d=1.1" "afade=t=out:st=1.02:d=0.08"
gen riser2 "aevalsrc='0.35*sin(2*PI*(60*t+150*t*t))*pow(t/1.4,2)':s=$SR:d=1.4" "afade=t=out:st=1.32:d=0.08"
gen rnoise1 "anoisesrc=d=1.1:c=pink:r=$SR:a=0.4" "highpass=f=800,afade=t=in:d=1.05:curve=exp,afade=t=out:st=1.05:d=0.05"
gen rnoise2 "anoisesrc=d=1.4:c=pink:r=$SR:a=0.4" "highpass=f=800,afade=t=in:d=1.35:curve=exp,afade=t=out:st=1.35:d=0.05"

place drone 0 1.0
# hook: words tick in, stamp lands
for t in 0.2 0.44 0.68 0.92; do place tick $t 0.35; done
place boom 1.4 0.85
# scene-boundary whooshes (peak just before each cut) and low hits on the cut
for b in 3 7 11 16 20 25; do place whoosh "$(awk -v b=$b 'BEGIN{print b-0.45}')" 0.55; done
for b in 3 7 11 16; do place hit $b 0.45; done
place hit 3.9 0.35          # สุโขทัย
place rumble 7.35 0.9       # bull bucking
place boom 8.55 0.8         # เชื่อง stamp
place hit 12.75 0.55        # rope A lands
place hit 14.1 0.55         # rope B lands
place hit 14.9 0.4          # knot tightens
place boom 18.57 0.75       # rope yanks Khwan back
place riser1 18.9 0.7; place rnoise1 18.9 0.35
place boom 20.0 0.55
place boom 21.05 0.7        # ก็ทำให้เชื่อง
place boom 22.42 1.0        # villagers turn into bulls
place riser2 23.6 0.7; place rnoise2 23.6 0.35
place boom 25.0 0.5
place snap 26.05 0.5; place boom 26.05 1.0   # rope snaps under the title
place hit 28.9 0.35         # ในโรงภาพยนตร์

MIX=""; for i in $(seq 0 $((n-1))); do MIX+="[c$i]"; done
ffmpeg -v error -y "${INPUTS[@]}" -filter_complex "${FILTERS}${MIX}amix=inputs=$n:normalize=0:duration=first,alimiter=limit=0.89:level=false,atrim=0:32[o]" -map "[o]" -ar $SR -ac 2 -c:a pcm_s16le "$OUT"
echo "wrote $OUT"
