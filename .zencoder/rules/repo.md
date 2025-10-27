---
description: Repository Information Overview
alwaysApply: true
---

# Metis Website Information

## Summary
Sito web moderno e dinamico per Metis Srl, un'azienda IT specializzata in soluzioni ecommerce personalizzate, soluzioni fintech, DeFi e tokenizzazione di asset fisici. Il sito è completamente responsivo e ottimizzato per tutti i browser e dispositivi.

## Structure
- **public/**: Contiene risorse statiche come video, immagini e logo
- **src/**: Codice sorgente dell'applicazione
  - **app/**: Componenti principali dell'app Next.js (layout, page)
  - **components/**: Componenti React riutilizzabili
  - **lib/**: Utility e contesti (LanguageContext)
- **.next/**: Build compilata di Next.js (generata automaticamente)
- **.github/**: Istruzioni per GitHub Copilot

## Language & Runtime
**Language**: TypeScript, JavaScript
**Version**: TypeScript 5.6.2
**Runtime**: Node.js >=18.0.0
**Framework**: Next.js 14.2.13, React 18.3.1
**Build System**: Next.js build system
**Package Manager**: npm

## Dependencies
**Main Dependencies**:
- next: ^14.2.13
- react: ^18.3.1
- react-dom: ^18.3.1
- framer-motion: ^11.5.4
- three: ^0.168.0
- @react-three/fiber: ^8.17.7
- @react-three/drei: ^9.112.0
- clsx: ^2.1.1
- tailwind-merge: ^2.5.2

**Development Dependencies**:
- typescript: ^5.6.2
- tailwindcss: ^3.4.12
- eslint: ^8.57.1
- postcss: ^8.4.47
- autoprefixer: ^10.4.20
- @types/node, @types/react, @types/react-dom, @types/three

## Build & Installation
```bash
# Installazione dipendenze
npm install

# Sviluppo locale
npm run dev

# Build di produzione
npm run build

# Avvio server di produzione
npm run start

# Controllo linting
npm run lint

# Controllo tipi TypeScript
npm run type-check
```

## Key Features
- **Multilingual Support**: Sistema di traduzione tramite LanguageContext
- **Responsive Design**: Layout ottimizzato per mobile, tablet e desktop
- **Animations**: Animazioni avanzate con Framer Motion
- **3D Effects**: Integrazione con Three.js per effetti 3D
- **Optimized Media**: Componenti personalizzati per ottimizzazione video e immagini
- **Glassmorphism**: Effetti di design moderni con blur e trasparenze

## Main Files & Resources
**Entry Points**:
- src/app/page.tsx: Pagina principale dell'applicazione
- src/app/layout.tsx: Layout principale con metadata e struttura HTML

**Key Components**:
- src/components/HeroSection.tsx: Sezione hero con video di sfondo
- src/components/Navigation.tsx: Barra di navigazione
- src/components/ServicesSection.tsx: Sezione servizi
- src/components/OptimizedVideo.tsx: Componente per ottimizzazione video
- src/components/OptimizedImage.tsx: Componente per ottimizzazione immagini

**Configuration Files**:
- next.config.js: Configurazione Next.js
- tailwind.config.js: Configurazione Tailwind CSS
- tsconfig.json: Configurazione TypeScript
- postcss.config.js: Configurazione PostCSS

**Static Assets**:
- public/hero_video.mp4: Video di sfondo per la hero section
- public/Metis scritta trasparente.png: Logo testuale
- public/solo logo trasparente.png: Logo iconico