#!/usr/bin/env bash
#
# Transcode a camera master into the web loop used behind the featured-events
# section, plus its poster frame.
#
# The master is a 1080x1920 portrait clip of ~293MB. Three things have to
# change before it can be a background video:
#
#   Container  .mov plays in Safari but Chrome and Firefox frequently refuse
#              it. MP4 with faststart moves the index to the front so playback
#              can begin before the file finishes downloading.
#   Weight     A background loop competes with the page for bandwidth. The
#              clip is cut to a short segment and encoded at a modest bitrate;
#              the target is single-digit megabytes, not hundreds.
#   Audio      Dropped entirely. The video is muted by design, so shipping an
#              audio track is pure waste.
#
# Resolution stays 1080 wide. The section crops the top and bottom to fill a
# wide frame, so height is what gets thrown away — downscaling further would
# soften the strip of image that actually survives the crop.
#
# Usage: scripts/encode-backdrop.sh [input] [start] [duration]

set -euo pipefail

IN="${1:-public/videos/video.mov}"
START="${2:-0}"
DUR="${3:-14}"
OUT_DIR="public/videos"
OUT="$OUT_DIR/featured-events.mp4"
POSTER="$OUT_DIR/featured-events-poster.jpg"

[ -f "$IN" ] || { echo "input not found: $IN" >&2; exit 1; }
mkdir -p "$OUT_DIR"

echo "encoding $DUR s from $IN"

ffmpeg -hide_banner -loglevel error -y \
  -ss "$START" -t "$DUR" -i "$IN" \
  -an \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -crf 30 -preset slow -maxrate 1400k -bufsize 2800k \
  -vf "scale=1080:-2,fps=24" \
  -movflags +faststart \
  "$OUT"

# Poster frame: shown before the video can play, and in its place under
# reduced motion. Taken a second in so it is never a black lead-in frame.
ffmpeg -hide_banner -loglevel error -y \
  -ss "$((START + 1))" -i "$IN" \
  -frames:v 1 -q:v 6 -vf "scale=720:-2" \
  "$POSTER"

echo "  $OUT      $(du -h "$OUT" | cut -f1)"
echo "  $POSTER   $(du -h "$POSTER" | cut -f1)"
