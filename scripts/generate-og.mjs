import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const projectRoot = process.cwd()
const publicDir = path.join(projectRoot, 'public')

const ogPath = path.join(publicDir, 'og.png')
const wordmarkPngPath = path.join(publicDir, 'logo-solo-scritta.png')

const toDataUri = (mimeType, buffer) => {
  const base64 = buffer.toString('base64')
  return `data:${mimeType};base64,${base64}`
}

const main = async () => {
  const [wordmarkPng] = await Promise.all([fs.readFile(wordmarkPngPath)])

  const width = 1200
  const height = 630

  const wordmarkDataUri = toDataUri('image/png', wordmarkPng)

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#070b13" />
      <stop offset="100%" stop-color="#1a2331" />
    </linearGradient>

    <radialGradient id="glowCyan" cx="25%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#1fdefe" stop-opacity="0.35" />
      <stop offset="60%" stop-color="#1fdefe" stop-opacity="0.0" />
    </radialGradient>

    <radialGradient id="glowPink" cx="78%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#ff45a9" stop-opacity="0.30" />
      <stop offset="65%" stop-color="#ff45a9" stop-opacity="0.0" />
    </radialGradient>

    <radialGradient id="glowYellow" cx="60%" cy="85%" r="60%">
      <stop offset="0%" stop-color="#fff404" stop-opacity="0.18" />
      <stop offset="70%" stop-color="#fff404" stop-opacity="0.0" />
    </radialGradient>

    <linearGradient id="brand" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1fdefe" />
      <stop offset="55%" stop-color="#ff45a9" />
      <stop offset="100%" stop-color="#fff404" />
    </linearGradient>

    <filter id="blur40" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="40" />
    </filter>

    <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="14" result="b" />
      <feColorMatrix in="b" type="matrix"
        values="1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 0.85 0" result="g" />
      <feMerge>
        <feMergeNode in="g" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>

    <mask id="wordmarkMask">
      <rect width="100%" height="100%" fill="black" />
      <image href="${wordmarkDataUri}" x="90" y="185" width="720" height="160" preserveAspectRatio="xMidYMid meet" />
    </mask>
  </defs>

  <rect width="${width}" height="${height}" fill="url(#bg)" />

  <rect width="${width}" height="${height}" fill="url(#glowCyan)" filter="url(#blur40)" opacity="0.9" />
  <rect width="${width}" height="${height}" fill="url(#glowPink)" filter="url(#blur40)" opacity="0.85" />
  <rect width="${width}" height="${height}" fill="url(#glowYellow)" filter="url(#blur40)" opacity="0.9" />

  <rect x="70" y="120" width="1060" height="390" rx="36" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.10)" />

  <rect width="${width}" height="${height}" fill="url(#brand)" mask="url(#wordmarkMask)" filter="url(#softGlow)" />

  <text x="92" y="385" fill="rgba(255,255,255,0.92)" font-size="44" font-style="italic" font-weight="600" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial">
    Innovative IT Solutions
  </text>

  <text x="92" y="430" fill="rgba(255,255,255,0.72)" font-size="22" font-weight="500" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial">
    Custom e-commerce • AI assistants • Automation • ERP • Marketing
  </text>

  <text x="92" y="485" fill="rgba(255,255,255,0.62)" font-size="18" font-weight="500" font-family="Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial">
    metis-tech.it
  </text>
</svg>
`.trim()

  await sharp(Buffer.from(svg), { density: 220 })
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toFile(ogPath)

  console.log('Generated', ogPath)
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
