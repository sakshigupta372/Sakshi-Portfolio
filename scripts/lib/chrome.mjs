// Minimal headless-Chrome driver over the DevTools protocol.
// Used by the image scripts so they need no extra npm dependencies.
// Requires Node 22+ (global WebSocket) and a local Chrome or Edge install.
import { spawn } from 'child_process'
import { existsSync, mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import path from 'path'

const CANDIDATES = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export async function launchChrome({ port = 9334 } = {}) {
  const exe = CANDIDATES.find((p) => existsSync(p))
  if (!exe) throw new Error('Chrome/Edge not found. Set CHROME_PATH to the browser executable.')

  const profile = mkdtempSync(path.join(tmpdir(), 'sg-chrome-'))
  const proc = spawn(exe, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profile}`,
    '--hide-scrollbars',
    '--allow-file-access-from-files',
    'about:blank',
  ])

  let wsUrl
  for (let i = 0; i < 60 && !wsUrl; i++) {
    await sleep(250)
    try {
      const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
      wsUrl = list.find((t) => t.type === 'page')?.webSocketDebuggerUrl
    } catch {
      /* not up yet */
    }
  }
  if (!wsUrl) throw new Error('Chrome did not start')

  const ws = new WebSocket(wsUrl)
  await new Promise((resolve, reject) => {
    ws.onopen = resolve
    ws.onerror = reject
  })

  let id = 0
  const waiters = new Map()
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data)
    if (msg.id && waiters.has(msg.id)) {
      waiters.get(msg.id)(msg)
      waiters.delete(msg.id)
    }
  }

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const i = ++id
      waiters.set(i, (msg) => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)))
      ws.send(JSON.stringify({ id: i, method, params }))
    })

  const evaluate = async (expression) => {
    const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text)
    return r.result.value
  }

  await send('Page.enable')
  await send('Runtime.enable')

  const close = async () => {
    try {
      ws.close()
    } catch {
      /* ignore */
    }
    proc.kill()
    await sleep(300)
    try {
      rmSync(profile, { recursive: true, force: true })
    } catch {
      /* Chrome may still hold files briefly */
    }
  }

  return { send, evaluate, close, sleep }
}
