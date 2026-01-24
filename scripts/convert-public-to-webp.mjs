import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const projectRoot = process.cwd()
const publicDir = path.join(projectRoot, 'public')
const methodDir = path.join(publicDir, 'method')

const shouldSkipPng = (fileName) => {
  const lower = fileName.toLowerCase()
  if (!lower.endsWith('.png')) return true
  if (lower.startsWith('favicon')) return true
  if (lower === 'apple-touch-icon.png') return true
  return false
}

const isSvg = (fileName) => fileName.toLowerCase().endsWith('.svg')

const LOSSY_PNGS = new Set(['marketing.png', '1H.png', 'IOT.png'])

const toWebp = async ({ inputPath, outputPath, isVector, resizeWidth, webp }) => {
  const instance = isVector
    ? sharp(inputPath, { density: 300 })
    : sharp(inputPath)

  const pipeline = resizeWidth
    ? instance.resize({ width: resizeWidth, withoutEnlargement: true })
    : instance

  await pipeline
    .webp({ lossless: webp?.lossless ?? true, quality: webp?.quality, effort: 6 })
    .toFile(outputPath)
}

const main = async () => {
  const dirents = await fs.readdir(publicDir, { withFileTypes: true })
  const hasIotPng = dirents.some((d) => d.isFile() && d.name === 'IOT.png')

  const pngFiles = dirents
    .filter((d) => d.isFile())
    .map((d) => d.name)
    .filter((name) => !shouldSkipPng(name))

  const svgFiles = hasIotPng
    ? []
    : ['IOT.svg'].filter((name) => dirents.some((d) => d.isFile() && d.name === name))

  const conversions = [
    ...pngFiles.map((name) => {
      const shouldUseLossy = LOSSY_PNGS.has(name)

      return {
        input: name,
        output: name.replace(/\.png$/i, '.webp'),
        vector: false,
        resizeWidth: shouldUseLossy ? 900 : undefined,
        webp: shouldUseLossy ? { lossless: false, quality: 82 } : undefined
      }
    }),
    ...svgFiles.map((name) => ({
      input: name,
      output: name.replace(/\.svg$/i, '.webp'),
      vector: true
    }))
  ]

  // Convert method step SVGs (public/method/*.svg) to WebP for faster loading
  try {
    const methodDirents = await fs.readdir(methodDir, { withFileTypes: true })
    const methodSvgs = methodDirents
      .filter((d) => d.isFile())
      .map((d) => d.name)
      .filter((name) => isSvg(name))

    for (const name of methodSvgs) {
      conversions.push({
        input: path.join('method', name),
        output: path.join('method', name.replace(/\.svg$/i, '.webp')),
        vector: true,
        resizeWidth: 1100,
        webp: { lossless: false, quality: 82 }
      })
    }
  } catch {
    // ignore if method directory doesn't exist
  }

  if (conversions.length === 0) {
    console.log('No convertible images found in public/.')
    return
  }

  for (const conversion of conversions) {
    const inputPath = path.join(publicDir, conversion.input)
    const outputPath = path.join(publicDir, conversion.output)

    await toWebp({
      inputPath,
      outputPath,
      isVector: conversion.vector,
      resizeWidth: conversion.resizeWidth,
      webp: conversion.webp
    })
    console.log(`${conversion.input} -> ${conversion.output}`)
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
