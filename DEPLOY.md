# 🚀 Deploy Checklist - Metis Website

## ✅ Pre-Deploy Verification

### Build Status
- ✅ Production build successful (`npm run build`)
- ✅ No TypeScript errors (`npm run type-check`)
- ✅ Bundle size: 153kB (optimal for mobile)
- ✅ No warnings in build output

### Configuration Files
- ✅ `netlify.toml` configured (Next.js plugin, headers, caching)
- ✅ `next.config.js` updated (remotePatterns instead of deprecated domains)
- ✅ `.env.example` present with all required variables
- ✅ `.gitignore` excludes `.env*.local` files

### Content & Assets
- ✅ Service images optimized (WebP: 47-74KB instead of 1.2-1.6MB)
- ✅ All translations (IT/EN) complete
- ✅ Responsive design verified (mobile/tablet/desktop)
- ✅ Hero video optimized and loading correctly
- ✅ Method section with flip cards functional
- ✅ Contact form with Aruba SMTP integration
- ✅ WhatsApp floating button configured

## 🔧 Environment Variables Required on Netlify

Create these in **Netlify Dashboard → Site Settings → Environment Variables**:

```bash
# Public
NEXT_PUBLIC_SITE_URL=https://metis-tech.it

# SMTP (Aruba) - IMPORTANT: Add real credentials
SMTP_HOST=smtps.aruba.it
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@metis-tech.it
SMTP_PASS=YOUR_REAL_PASSWORD_HERE

# Contact form
CONTACT_FROM=info@metis-tech.it
CONTACT_TO=info@metis-tech.it
```

## 📋 Deploy Steps

### 1. Commit Changes
```bash
git add -A
git commit -m "feat: production-ready website with optimized images, flip cards, responsive design"
```

### 2. Push to Repository
```bash
git push origin main
```

### 3. Netlify Configuration
- Netlify will auto-deploy from `main` branch
- Build command: `npm run build` (already in netlify.toml)
- Publish directory: `.next` (already in netlify.toml)
- Node version: 18 (already in netlify.toml)

### 4. Post-Deploy Verification
- [ ] Test homepage loads correctly
- [ ] Test language switch (IT/EN)
- [ ] Test service cards flip interaction
- [ ] Test method cards flip interaction
- [ ] Test contact form submission
- [ ] Test WhatsApp button link
- [ ] Check mobile/tablet responsiveness
- [ ] Verify all images load (especially services: marketing, 1H, IOT)
- [ ] Check SEO meta tags (robots.txt, sitemap.xml)
- [ ] Test all navigation links

## 🔒 Security Headers (Already Configured)
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Strict-Transport-Security: max-age=31536000

## 📊 Performance
- First Load JS: 87.3 kB (excellent)
- Page size: 153 kB (optimal for mobile)
- Static pages: 7 (SEO-friendly)
- Images: WebP format with lossy compression
- Caching: 1 year for static assets, 1 month for images

## 🐛 Known Issues / Notes
- ⚠️ Ensure `.env.local` exists locally for development with real SMTP credentials
- ⚠️ Contact form requires valid Aruba SMTP password in Netlify env vars
- ✅ All warnings resolved (baseline-browser-mapping, images.domains deprecation)

## 🎯 Ready to Deploy!
Il sito è pronto per andare live. Tutti i test sono passati e la configurazione è ottimizzata per produzione.
