#!/bin/bash

# 🎬 Script di Ottimizzazione Video per Web Streaming
# Ottimizza il video hero per caricamento veloce

echo "🎬 Ottimizzazione Video Hero per Web Streaming..."
echo "================================================="

# Verifica che FFmpeg sia installato
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ FFmpeg non trovato. Installa con:"
    echo "   brew install ffmpeg"
    exit 1
fi

# Crea directory se non esistono
mkdir -p public/videos
mkdir -p public/posters

# File di input
INPUT_VIDEO="public/hero_video.mp4"

if [ ! -f "$INPUT_VIDEO" ]; then
    echo "❌ File hero_video.mp4 non trovato in public/"
    exit 1
fi

echo "✅ File trovato: $INPUT_VIDEO"
echo ""

# 1. Versione Desktop (HD - 1920x1080)
echo "🖥️  Creando versione Desktop (HD)..."
ffmpeg -i "$INPUT_VIDEO" \
    -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
    -c:v libx264 \
    -crf 28 \
    -preset medium \
    -movflags +faststart \
    -an \
    public/videos/hero_video_hd.mp4 \
    -y > /dev/null 2>&1

ffmpeg -i "$INPUT_VIDEO" \
    -vf "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080" \
    -c:v libvpx-vp9 \
    -crf 30 \
    -b:v 0 \
    -an \
    public/videos/hero_video_hd.webm \
    -y > /dev/null 2>&1

echo "✅ Desktop HD creato"

# 2. Versione Tablet (MD - 1280x720)
echo "📱 Creando versione Tablet (MD)..."
ffmpeg -i "$INPUT_VIDEO" \
    -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720" \
    -c:v libx264 \
    -crf 30 \
    -preset medium \
    -movflags +faststart \
    -an \
    public/videos/hero_video_md.mp4 \
    -y > /dev/null 2>&1

ffmpeg -i "$INPUT_VIDEO" \
    -vf "scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720" \
    -c:v libvpx-vp9 \
    -crf 32 \
    -b:v 0 \
    -an \
    public/videos/hero_video_md.webm \
    -y > /dev/null 2>&1

echo "✅ Tablet MD creato"

# 3. Versione Mobile (SM - 854x480)
echo "📱 Creando versione Mobile (SM)..."
ffmpeg -i "$INPUT_VIDEO" \
    -vf "scale=854:480:force_original_aspect_ratio=increase,crop=854:480" \
    -c:v libx264 \
    -crf 32 \
    -preset medium \
    -movflags +faststart \
    -an \
    public/videos/hero_video_sm.mp4 \
    -y > /dev/null 2>&1

ffmpeg -i "$INPUT_VIDEO" \
    -vf "scale=854:480:force_original_aspect_ratio=increase,crop=854:480" \
    -c:v libvpx-vp9 \
    -crf 35 \
    -b:v 0 \
    -an \
    public/videos/hero_video_sm.webm \
    -y > /dev/null 2>&1

echo "✅ Mobile SM creato"

# 4. Crea poster frames (immagini statiche)
echo "🖼️  Creando poster images..."
ffmpeg -i public/videos/hero_video_hd.mp4 -vf "select=eq(n\,30)" -vframes 1 public/posters/hero_poster_hd.jpg -y > /dev/null 2>&1
ffmpeg -i public/videos/hero_video_md.mp4 -vf "select=eq(n\,30)" -vframes 1 public/posters/hero_poster_md.jpg -y > /dev/null 2>&1
ffmpeg -i public/videos/hero_video_sm.mp4 -vf "select=eq(n\,30)" -vframes 1 public/posters/hero_poster_sm.jpg -y > /dev/null 2>&1

echo "✅ Poster images create"

# 5. Mostra statistiche file
echo ""
echo "📊 Statistiche File:"
echo "==================="

get_size() {
    if [ -f "$1" ]; then
        du -h "$1" | cut -f1
    else
        echo "N/A"
    fi
}

echo "📁 File originale:"
echo "   hero_video.mp4: $(get_size public/hero_video.mp4)"
echo ""
echo "📁 Versioni ottimizzate:"
echo "   Desktop HD MP4:  $(get_size public/videos/hero_video_hd.mp4)"
echo "   Desktop HD WebM: $(get_size public/videos/hero_video_hd.webm)"
echo "   Tablet MD MP4:   $(get_size public/videos/hero_video_md.mp4)"
echo "   Tablet MD WebM:  $(get_size public/videos/hero_video_md.webm)"
echo "   Mobile SM MP4:   $(get_size public/videos/hero_video_sm.mp4)"
echo "   Mobile SM WebM:  $(get_size public/videos/hero_video_sm.webm)"

echo ""
echo "🎉 Ottimizzazione completata!"
echo ""
echo "🔧 Prossimi step:"
echo "1. Aggiorna HeroSection.tsx per usare le nuove versioni"
echo "2. Test del caricamento su diversi dispositivi"
echo "3. Verifica performance con DevTools"
echo ""
echo "📈 Risultato atteso: Video che carica 5-10x più veloce!"