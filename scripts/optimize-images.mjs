// Converts site images to WebP next to the originals.
//   node scripts/optimize-images.mjs
// Originals are kept; the app references the .webp files.
import { readFileSync, writeFileSync, statSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { launchChrome } from './lib/chrome.mjs'

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')

// maxWidth keeps screenshots at a sensible size for a ~600px card (2x for retina).
const JOBS = [
  ...['ai-agent-observatory', 'audit-ai', 'compliledger', 'health-diagnosis', 'hireboard', 'llm-gateway', 'nexus'].map(
    (name) => ({ src: `projects/${name}.jpg`, maxWidth: 1400, quality: 0.8 })
  ),
  { src: 'profile.jpg', maxWidth: 480, quality: 0.82 },
  // Transparent cutout used by the hero portrait (alpha is preserved).
  { src: 'profile-cutout-clean.png', maxWidth: 1024, quality: 0.85 },
]

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png' }

const chrome = await launchChrome()
try {
  for (const job of JOBS) {
    const file = path.join(root, job.src)
    const ext = path.extname(file).toLowerCase()
    const dataUrl = `data:${MIME[ext]};base64,${readFileSync(file).toString('base64')}`

    const result = await chrome.evaluate(`
      new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => {
          const scale = Math.min(1, ${job.maxWidth} / img.naturalWidth)
          const w = Math.round(img.naturalWidth * scale)
          const h = Math.round(img.naturalHeight * scale)
          const c = document.createElement('canvas')
          c.width = w; c.height = h
          const ctx = c.getContext('2d')
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, w, h)
          resolve({ w, h, ow: img.naturalWidth, oh: img.naturalHeight, data: c.toDataURL('image/webp', ${job.quality}) })
        }
        img.onerror = () => reject(new Error('decode failed'))
        img.src = ${JSON.stringify(dataUrl)}
      })
    `)

    if (!result.data.startsWith('data:image/webp')) throw new Error(`WebP encoding not supported for ${job.src}`)
    const out = file.replace(/\.(jpe?g|png)$/i, '.webp')
    writeFileSync(out, Buffer.from(result.data.split(',')[1], 'base64'))
    const before = Math.round(statSync(file).size / 1024)
    const after = Math.round(statSync(out).size / 1024)
    console.log(`${job.src}  ${result.ow}x${result.oh} ${before}KB  →  ${path.basename(out)} ${result.w}x${result.h} ${after}KB`)
  }
} finally {
  await chrome.close()
}
