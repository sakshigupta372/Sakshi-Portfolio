// Screenshots the live project demos into public/projects/<name>.jpg.
//   node scripts/capture-project-shots.mjs            (all projects)
//   node scripts/capture-project-shots.mjs nexus      (only the ones named)
// Then convert them:  node scripts/optimize-images.mjs nexus
// Check each image before committing: an empty dashboard or a popup makes a poor card.
import { mkdirSync, writeFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { launchChrome } from './lib/chrome.mjs'

const outDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'projects')

// waitMs: time to let the page settle. dismiss: label of a button that closes an
// intro popup. busy: keep waiting (up to 100s) while the page shows this text,
// for backends that need to wake from sleep.
const TARGETS = [
  { name: 'nexus', url: 'https://ai-interview-platform-one-wine.vercel.app', waitMs: 8000, dismiss: 'Skip' },
  { name: 'llm-gateway', url: 'https://multi-tenant-llm-gateway.vercel.app', waitMs: 4000, busy: /Loading|Refreshing/ },
  { name: 'compliledger', url: 'https://compliagent.vercel.app', waitMs: 4000 },
  { name: 'audit-ai', url: 'https://auditai-2d83.onrender.com', waitMs: 10000 },
  { name: 'hireboard', url: 'https://frontend-chi-blush.vercel.app/', waitMs: 4000 },
]

const only = process.argv.slice(2)
const unknown = only.filter((n) => !TARGETS.some((t) => t.name === n))
if (unknown.length) {
  console.error(`Unknown: ${unknown.join(', ')}. Choose from: ${TARGETS.map((t) => t.name).join(', ')}`)
  process.exit(1)
}

mkdirSync(outDir, { recursive: true })
const chrome = await launchChrome()
try {
  await chrome.send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false })
  for (const target of TARGETS.filter((t) => !only.length || only.includes(t.name))) {
    console.log(`Capturing ${target.name} <- ${target.url}`)
    try {
      const nav = await chrome.send('Page.navigate', { url: target.url })
      if (nav.errorText) throw new Error(nav.errorText)
      await chrome.sleep(target.waitMs)

      if (target.busy) {
        const deadline = Date.now() + 100_000
        while (target.busy.test(await chrome.evaluate('document.body.innerText'))) {
          if (Date.now() > deadline) throw new Error('page never finished loading')
          await chrome.sleep(5000)
        }
      }

      if (target.dismiss) {
        const clicked = await chrome.evaluate(`(() => {
          const b = [...document.querySelectorAll('button')].find((el) => el.textContent.trim() === ${JSON.stringify(target.dismiss)})
          b?.click()
          return Boolean(b)
        })()`)
        if (clicked) await chrome.sleep(2500)
      }

      const { data } = await chrome.send('Page.captureScreenshot', { format: 'jpeg', quality: 88 })
      const file = path.join(outDir, `${target.name}.jpg`)
      writeFileSync(file, Buffer.from(data, 'base64'))
      console.log(`  saved ${file}`)
    } catch (err) {
      console.error(`  FAILED ${target.name}: ${err.message}`)
      process.exitCode = 1
    }
  }
} finally {
  await chrome.close()
}
