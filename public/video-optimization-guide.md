# 🎬 Video Optimization Guide per Web Streaming

## 🚀 **Problema Attuale**
Il video hero si carica lentamente perché non è ottimizzato per lo streaming web.

## ✅ **Soluzioni Immediate**

### 1. **Comprimi il Video Attuale**
```bash
# Con FFmpeg (installa prima: brew install ffmpeg)
ffmpeg -i hero_video.mp4 \
  -vcodec libx264 \
  -crf 28 \
  -preset medium \
  -vf scale=1920:1080 \
  -acodec aac \
  -b:a 128k \
  -movflags +faststart \
  hero_video_optimized.mp4
```

### 2. **Crea Versione WebM** (formato più efficiente)
```bash
ffmpeg -i hero_video.mp4 \
  -c:v libvpx-vp9 \
  -crf 30 \
  -b:v 0 \
  -b:a 128k \
  -c:a libopus \
  -vf scale=1920:1080 \
  hero_video.webm
```

### 3. **Versioni Multiple per Responsive**
```bash
# HD (1920x1080) - Desktop
ffmpeg -i hero_video.mp4 -vf scale=1920:1080 -crf 28 hero_video_hd.mp4

# MD (1280x720) - Tablet  
ffmpeg -i hero_video.mp4 -vf scale=1280:720 -crf 30 hero_video_md.mp4

# SM (854x480) - Mobile
ffmpeg -i hero_video.mp4 -vf scale=854:480 -crf 32 hero_video_sm.mp4
```

## 🎯 **Parametri Ottimali per Web**

### **MP4 Settings**
- **Codec**: H.264 (libx264)
- **CRF**: 28-32 (bilanciamento qualità/dimensione)
- **Preset**: medium/fast
- **Flags**: +faststart (streaming immediato)
- **Frame Rate**: 30fps max
- **Bitrate Audio**: 128k

### **WebM Settings** 
- **Codec**: VP9 (libvpx-vp9)
- **CRF**: 30-35
- **Audio**: Opus codec
- **Supporto**: Chrome, Firefox, Edge moderni

## 📱 **Implementazione Responsive**

```tsx
// Componente video responsive
<video>
  <source 
    src="/hero_video_hd.webm" 
    type="video/webm"
    media="(min-width: 1024px)"
  />
  <source 
    src="/hero_video_md.webm" 
    type="video/webm"
    media="(min-width: 768px)"
  />
  <source 
    src="/hero_video_sm.webm" 
    type="video/webm"
    media="(max-width: 767px)"
  />
  
  {/* Fallback MP4 */}
  <source src="/hero_video_optimized.mp4" type="video/mp4" />
</video>
```

## ⚡ **Performance Tips**

### **1. Lazy Loading Aggressivo**
- Carica solo quando video è visibile
- Preload="none" di default
- IntersectionObserver per trigger

### **2. Poster Image Ottimizzato**
- WebP format per poster
- Dimensioni multiple per responsive
- Placeholder con gradient fallback

### **3. Progressive Loading**
- Metadata first, poi contenuto
- Chunk loading per video lunghi
- Fallback per connessioni lente

## 🔧 **File da Sostituire**

### **Attuale**
- `hero_video.mp4` (probabilmente pesante)

### **Nuovo Setup**
```
public/
├── videos/
│   ├── hero_video_hd.webm      (Desktop WebM)
│   ├── hero_video_md.webm      (Tablet WebM) 
│   ├── hero_video_sm.webm      (Mobile WebM)
│   ├── hero_video_hd.mp4       (Desktop MP4 fallback)
│   ├── hero_video_md.mp4       (Tablet MP4 fallback)
│   └── hero_video_sm.mp4       (Mobile MP4 fallback)
└── posters/
    ├── hero_poster_hd.webp
    ├── hero_poster_md.webp
    └── hero_poster_sm.webp
```

## 📊 **Risultati Attesi**

### **Prima**
- Peso: ~50-100MB+
- Caricamento: 10-30 secondi
- Formati: Solo MP4

### **Dopo** 
- Peso: ~5-15MB per versione
- Caricamento: 2-5 secondi
- Formati: WebM + MP4 fallback
- Responsive: 3 versioni ottimizzate

## 🛠️ **Comando Rapido All-in-One**

```bash
#!/bin/bash
# Script completo di ottimizzazione

# Desktop versions
ffmpeg -i hero_video.mp4 -vf scale=1920:1080 -c:v libx264 -crf 28 -preset medium -movflags +faststart public/videos/hero_video_hd.mp4
ffmpeg -i hero_video.mp4 -vf scale=1920:1080 -c:v libvpx-vp9 -crf 30 -b:v 0 public/videos/hero_video_hd.webm

# Tablet versions  
ffmpeg -i hero_video.mp4 -vf scale=1280:720 -c:v libx264 -crf 30 -preset medium -movflags +faststart public/videos/hero_video_md.mp4
ffmpeg -i hero_video.mp4 -vf scale=1280:720 -c:v libvpx-vp9 -crf 32 -b:v 0 public/videos/hero_video_md.webm

# Mobile versions
ffmpeg -i hero_video.mp4 -vf scale=854:480 -c:v libx264 -crf 32 -preset medium -movflags +faststart public/videos/hero_video_sm.mp4
ffmpeg -i hero_video.mp4 -vf scale=854:480 -c:v libvpx-vp9 -crf 35 -b:v 0 public/videos/hero_video_sm.webm
```

## 🎯 **Prossimo Step**

1. **Installa FFmpeg**: `brew install ffmpeg`
2. **Esegui script di ottimizzazione**
3. **Aggiorna componente** per usare versioni multiple
4. **Test cross-browser** e performance

**Risultato**: Video che carica **5-10x più veloce** con qualità mantenuta! 🚀