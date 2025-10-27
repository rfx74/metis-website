# Image Optimization Guide

## Current Images
- `logo + scritta metis trasp.png` - Main logo with text (1.4MB - needs optimization)
- `solo logo trasparente.png` - Logo only (57KB)
- `Metis scritta trasparente.png` - Text only (40KB)

## Optimization Steps Needed

### 1. Convert to WebP format
For better performance and smaller file sizes:

```bash
# Using imagemagick or other tools
convert "logo + scritta metis trasp.png" "logo-metis-full.webp"
convert "solo logo trasparente.png" "logo-only.webp"
convert "Metis scritta trasparente.png" "metis-text.webp"
```

### 2. Create multiple sizes for responsive design
```bash
# Small (mobile)
convert "logo + scritta metis trasp.png" -resize 200x "logo-metis-small.webp"

# Medium (tablet)
convert "logo + scritta metis trasp.png" -resize 400x "logo-metis-medium.webp"

# Large (desktop)
convert "logo + scritta metis trasp.png" -resize 600x "logo-metis-large.webp"
```

### 3. Optimize original PNGs as fallback
```bash
# Compress PNG files
pngcrush -reduce "logo + scritta metis trasp.png" "logo-metis-optimized.png"
```

## Current Implementation
- Main logo is used in HeroSection as primary branding
- Small logo is used in Navigation
- Images are filtered for color adaptation (dark/light)
- Responsive sizing implemented
- Loading states included

## Next Steps
1. Manual conversion of PNG to WebP recommended
2. Update file names to web-friendly format (no spaces)
3. Create responsive image variants
4. Test cross-browser compatibility