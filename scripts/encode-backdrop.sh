#!/usr/bin/env bash
#
# Transcode a camera master into a web loop for the featured-events backdrop,
# plus its poster frame.
#
# Masters come off a camera or a phone and are never shippable as-is:
#
#   Codec      Some arrive as HEVC/H.265, which Chrome and Firefox largely do
#              not decode — the element renders a black frame. Everything is
#              re-encoded to H.264 baseline-compatible profile regardless of
#              what came in.
#   Container  .mov plays in Safari but is frequently refused elsewhere. MP4
#              with faststart moves the index ahead of the media so playback
#              can begin before the download finishes.
#   Weight     A background loop competes with the page for bandwidth. The clip
#              is cut to a short segment at a modest bitrate; the target is
#              single-digit megabytes, not hundreds.
#   Audio      Dropped. The video is muted by design, so an audio track is
#              pure waste.
#
# Output is capped at 1280 wide. The section scales the video to cover a wide
# frame and crops the overflow, so detail beyond that is thrown away anyway.
#
# Usage: scripts/encode-backdrop.sh <input> <output-name> [start] [duration]
#   e.g. scripts/encode-backdrop.sh public/videos/technova.mp4 technova 12 16

set -euo pipefail

IN="${1:?usage: encode-backdrop.sh <input> <output-name> [start] [duration]}"
NAME="${2:?usage: encode-backdrop.sh <input> <output-name> [start] [duration]}"
START="${3:-0}"
DUR="${4:-16}"

OUT_DIR="public/videos"
OUT="$OUT_DIR/$NAME-loop.mp4"
POSTER="$OUT_DIR/$NAME-poster.jpg"

[ -f "$IN" ] || { echo "input not found: $IN" >&2; exit 1; }
mkdir -p "$OUT_DIR"

echo "encoding ${DUR}s from ${START}s of $IN"

ffmpeg -hide_banner -loglevel error -y \
  -ss "$START" -t "$DUR" -i "$IN" \
  -an \
  -c:v libx264 -profile:v high -pix_fmt yuv420p \
  -crf 30 -preset slow -maxrate 1600k -bufsize 3200k \
  -vf "scale='min(1280,iw)':-2,fps=24" \
  -movflags +faststart \
  "$OUT"

# Poster frame: shown before the video can play. Taken a second past the start
# so it is never a black lead-in frame.
ffmpeg -hide_banner -loglevel error -y \
  -ss "$(awk "BEGIN{print $START + 1}")" -i "$IN" \
  -frames:v 1 -q:v 6 -vf "scale='min(960,iw)':-2" \
  "$POSTER"

echo "  $OUT    $(du -h "$OUT" | cut -f1)"
echo "  $POSTER $(du -h "$POSTER" | cut -f1)"
