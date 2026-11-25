// Build step: writes dist/work/<slug>/index.html (index.html with that page's
// meta tags), dist/sitemap.xml, and adds the sitemap line to dist/robots.txt.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs'
import path from 'path'
import { PROJECTS } from '../src/data/projects.js'
import { CASE_STUDIES, CASE_STUDY_ORDER } from '../src/data/caseStudies.js'
import { caseStudyMeta, metaTags } from '../src/lib/seo.js'

const escapeHtml = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

// Fails loudly if a tag is missing, so an edit to index.html can't silently
// leave case studies with the home page's tags.
function replaceOnce(html, pattern, value) {
  if (!pattern.test(html)) throw new Error(`seo-pages: ${pattern} not found in index.html`)
  return html.replace(pattern, (_, before, after) => `${before}${escapeHtml(value)}${after}`)
}

function renderPage(template, meta, siteUrl) {
  let html = replaceOnce(template, /(<title>)[^<]*(<\/title>)/, meta.title)
  for (const [tag, key, id, attr, value] of metaTags(meta, siteUrl)) {
    html = replaceOnce(html, new RegExp(`(<${tag} ${key}="${id}" ${attr}=")[^"]*(")`), value)
  }
  return html
}

export default function seoPages(siteUrl) {
  const site = siteUrl.replace(/\/+$/, '')
  let outDir

  return {
    name: 'seo-pages',
    apply: 'build',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const indexFile = path.join(outDir, 'index.html')
      if (!existsSync(indexFile)) return // the build already failed
      const template = readFileSync(indexFile, 'utf8')

      for (const slug of CASE_STUDY_ORDER) {
        const project = PROJECTS.find((p) => p.slug === slug)
        const dir = path.join(outDir, 'work', slug)
        mkdirSync(dir, { recursive: true })
        writeFileSync(path.join(dir, 'index.html'), renderPage(template, caseStudyMeta(project, CASE_STUDIES[slug]), site))
      }

      const urls = ['/', ...CASE_STUDY_ORDER.map((slug) => `/work/${slug}`)]
      writeFileSync(
        path.join(outDir, 'sitemap.xml'),
        '<?xml version="1.0" encoding="UTF-8"?>\n' +
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
          urls.map((u) => `  <url><loc>${escapeHtml(site + u)}</loc></url>\n`).join('') +
          '</urlset>\n'
      )

      const robotsFile = path.join(outDir, 'robots.txt')
      const robots = existsSync(robotsFile) ? readFileSync(robotsFile, 'utf8').trimEnd() : 'User-agent: *\nAllow: /'
      writeFileSync(robotsFile, `${robots}\n\nSitemap: ${site}/sitemap.xml\n`)
    },
  }
}
