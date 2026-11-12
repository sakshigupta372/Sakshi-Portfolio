import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// In production, Vercel serves /api/* from the files in /api. This plugin runs
// the same handlers inside `npm run dev` / `npm run preview`, reading secrets
// from .env.local, so the chat and contact form work locally too.
function localApi(env) {
  const routes = {
    '/api/chat': () => import('./server/chat.js').then((m) => m.handleChat),
    '/api/contact': () => import('./server/contact.js').then((m) => m.handleContact),
  }

  const middleware = async (req, res, next) => {
    const path = req.url.split('?')[0]
    const load = routes[path]
    if (!load) return next()

    let raw = ''
    for await (const chunk of req) {
      raw += chunk
      if (raw.length > 100_000) {
        res.statusCode = 413
        return res.end('Payload too large')
      }
    }
    try {
      req.body = raw && req.headers['content-type']?.includes('application/json') ? JSON.parse(raw) : undefined
    } catch {
      req.body = undefined
    }
    try {
      const handler = await load()
      await handler(req, res, { ...process.env, ...env })
    } catch (err) {
      console.error(err)
      if (!res.headersSent) res.statusCode = 500
      res.end()
    }
  }

  // Block bodies on purpose: a returned function would be treated as a post-hook by Vite.
  return {
    name: 'local-api',
    configureServer(server) {
      server.middlewares.use(middleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(middleware)
    },
  }
}

export default defineConfig(({ mode }) => {
  // '' prefix = load all vars (incl. GEMINI_API_KEY), but only for the server side.
  const env = loadEnv(mode, process.cwd(), '')

  // index.html uses %VITE_SITE_URL%. If it's unset (e.g. on Vercel without the
  // env var), Vite leaves the placeholder in and the build fails with
  // "URI malformed". Fall back to Vercel's production domain, then localhost.
  if (!env.VITE_SITE_URL) {
    const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL
    process.env.VITE_SITE_URL = vercelHost ? `https://${vercelHost}` : 'http://localhost:3000'
  }

  return {
    plugins: [react(), localApi(env)],
    server: {
      port: 3000,
      open: true,
    },
  }
})
