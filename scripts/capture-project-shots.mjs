import { chromium } from 'playwright'
import { mkdir } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'public', 'projects')

const targets = [
  {
    file: 'nexus.jpg',
    url: 'https://ai-interview-platform-one-wine.vercel.app',
    waitMs: 5000,
  },
  {
    file: 'llm-gateway.jpg',
    url: 'https://multi-tenant-llm-gateway.vercel.app',
    waitMs: 4000,
  },
  {
    file: 'compliledger.jpg',
    url: 'https://compliagent.vercel.app',
    waitMs: 4000,
  },
  {
    file: 'audit-ai.jpg',
    url: 'https://auditai-2d83.onrender.com',
    waitMs: 10000,
  },
  {
    file: 'hireboard.jpg',
    url: 'https://frontend-chi-blush.vercel.app/',
    waitMs: 4000,
  },
]

await mkdir(outDir, { recursive: true })

const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
})

for (const target of targets) {
  const page = await context.newPage()
  const outPath = path.join(outDir, target.file)
  console.log(`Capturing ${target.file} <- ${target.url}`)
  try {
    await page.goto(target.url, { waitUntil: 'networkidle', timeout: 90000 })
    await page.waitForTimeout(target.waitMs)
    await page.keyboard.press('Escape').catch(() => {})
    await page.screenshot({
      path: outPath,
      type: 'jpeg',
      quality: 88,
      fullPage: false,
    })
    console.log(`  saved ${outPath}`)
  } catch (err) {
    console.error(`  FAILED ${target.file}: ${err.message}`)
  } finally {
    await page.close()
  }
}

await browser.close()
console.log('Done.')
