// The project book: cover text and one page per project, taken from the same
// data as the grid view.
import { PROJECTS } from '../../data/projects.js'
import { LINKS } from '../../lib/ui.js'

export const BOOK = {
  title: 'Selected Work',
  sub: `Sakshi Gupta · ${PROJECTS.length} projects`,
  back: 'Multi-agent systems, MCP servers, RAG products and LLM backends that hold up in production.',
  imprint: LINKS.github.replace('https://', ''),
}

// Pages in reading order. The book needs an even number, so a blank endpaper
// is added if the projects plus the closing page come out odd.
export const PAGES = [...PROJECTS.map((project) => ({ kind: 'project', project })), { kind: 'more' }]
if (PAGES.length % 2) PAGES.push({ kind: 'end' })
