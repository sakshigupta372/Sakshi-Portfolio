// Renders public/og-image.png (1200x630), the image shown when the site
// link is shared on LinkedIn, WhatsApp, X, Slack, etc.
//   node scripts/generate-og.mjs
import { readFileSync, writeFileSync, statSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { launchChrome } from './lib/chrome.mjs'

const publicDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public')
const photo = `data:image/webp;base64,${readFileSync(path.join(publicDir, 'profile-cutout-clean.webp')).toString('base64')}`

// Download the Google Fonts (latin subset) and inline them as data URLs, so the
// render never depends on Chrome fetching web fonts from a file:// page.
async function inlineFonts() {
  const css = await (
    await fetch(
      'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=block',
      { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/130 Safari/537.36' } }
    )
  ).text()
  const blocks = css.split('/* ').filter((b) => b.startsWith('latin */'))
  const out = []
  for (const block of blocks) {
    const url = block.match(/url\((https:[^)]+)\)/)?.[1]
    if (!url) continue
    const font = Buffer.from(await (await fetch(url)).arrayBuffer()).toString('base64')
    out.push(block.replace('latin */', '').replace(url, `data:font/woff2;base64,${font}`))
  }
  if (!out.length) throw new Error('Could not download fonts')
  return out.join('\n')
}

const fontCss = await inlineFonts()

// Indigo palette, same tokens as src/index.css (light mode).
const html = `<!doctype html>
<html><head>
<style>${fontCss}</style>
<style>
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; overflow: hidden; }
  body { background: #F7F7FB; color: #0E1120; font-family: Inter, sans-serif; position: relative; }
  .grid { position: absolute; inset: 0;
    background-image: linear-gradient(#E2E5F0 1px, transparent 1px), linear-gradient(90deg, #E2E5F0 1px, transparent 1px);
    background-size: 48px 48px; opacity: .55;
    mask-image: radial-gradient(ellipse at 30% 40%, #000 30%, transparent 75%); }
  .left { position: absolute; left: 80px; top: 92px; width: 640px; }
  .chip { display: inline-flex; align-items: center; gap: 10px; padding: 9px 16px; border: 1px solid #E2E5F0;
    border-radius: 999px; background: #fff; font-size: 15px; font-weight: 500; letter-spacing: .16em; color: #646A7E; }
  .dot { width: 9px; height: 9px; border-radius: 50%; background: #4F46E5; box-shadow: 0 0 0 5px rgba(79,70,229,.15); }
  h1 { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: 128px; line-height: .95; letter-spacing: -.02em; margin-top: 34px; white-space: nowrap; }
  .role { font-family: 'Instrument Serif', serif; font-style: italic; font-size: 48px; color: #4F46E5; margin-top: 18px; }
  .tag { font-size: 23px; line-height: 1.45; color: #646A7E; margin-top: 22px; max-width: 560px; }
  .foot { position: absolute; left: 80px; bottom: 56px; right: 80px; display: flex; justify-content: space-between;
    align-items: center; font-family: 'JetBrains Mono', monospace; font-size: 17px; color: #646A7E; }
  .foot b { color: #0E1120; font-weight: 500; }
  .disc { position: absolute; right: 70px; top: 85px; width: 400px; height: 400px; border-radius: 50%;
    background: #4F46E5; overflow: hidden; box-shadow: 0 30px 60px -25px rgba(14,17,32,.45); }
  .disc img { position: absolute; width: 132%; left: -15%; top: -4%; }
  .ring { position: absolute; right: 52px; top: 67px; width: 436px; height: 436px; border-radius: 50%;
    border: 1.5px dashed rgba(79,70,229,.35); }
</style></head>
<body>
  <div class="grid"></div>
  <div class="left">
    <span class="chip"><span class="dot"></span>AVAILABLE · REMOTE &amp; FULL-TIME</span>
    <h1>Sakshi Gupta</h1>
    <p class="role">Agentic AI Developer</p>
    <p class="tag">Multi-agent systems, MCP servers, RAG products and LLM backends that hold up in production.</p>
  </div>
  <div class="ring"></div>
  <div class="disc"><img src="${photo}" alt=""></div>
  <div class="foot"><span>LangGraph · CrewAI · MCP · RAG · FastAPI</span><b>Portfolio →</b></div>
</body></html>`

const chrome = await launchChrome()
const tmpHtml = path.join(tmpdir(), `sg-og-${process.pid}.html`)
try {
  writeFileSync(tmpHtml, html)
  await chrome.send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false })
  await chrome.send('Page.navigate', { url: pathToFileURL(tmpHtml).href })
  // Wait for the stylesheet, then force-load each face actually used.
  await chrome.evaluate(`new Promise(r => {
    const done = () => document.readyState === 'complete' ? r() : setTimeout(done, 50); done()
  })`)
  await chrome.evaluate(`Promise.all([
    document.fonts.load("128px 'Instrument Serif'"),
    document.fonts.load("italic 48px 'Instrument Serif'"),
    document.fonts.load("500 15px Inter"),
    document.fonts.load("400 23px Inter"),
    document.fonts.load("500 17px 'JetBrains Mono'"),
  ]).then(() => document.fonts.ready)`)
  await chrome.sleep(300)
  const fonts = await chrome.evaluate(
    "[...new Set([...document.fonts].filter(f => f.status === 'loaded').map(f => f.family))].join(', ')"
  )
  const shot = await chrome.send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: 1200, height: 630, scale: 1 } })
  const out = path.join(publicDir, 'og-image.png')
  writeFileSync(out, Buffer.from(shot.data, 'base64'))
  console.log(`og-image.png written (${Math.round(statSync(out).size / 1024)}KB). Fonts loaded: ${fonts || 'none (fallbacks used)'}`)
} finally {
  await chrome.close()
  rmSync(tmpHtml, { force: true })
}
