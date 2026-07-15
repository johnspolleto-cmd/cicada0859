#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/posters

convert -size 1920x1080 gradient:'#0a0a0c-#123028' \
  -attenuate 0.4 +noise Gaussian \
  -modulate 100,55,100 \
  assets/posters/hero-night-road.webp

convert -size 1920x1080 gradient:'#0a0a0c-#2a1c10' \
  -attenuate 0.4 +noise Gaussian \
  -modulate 100,50,100 \
  assets/posters/city-drift.webp

echo "Generated placeholder posters in assets/posters/"
