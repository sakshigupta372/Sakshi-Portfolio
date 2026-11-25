// Per-page title, description, canonical URL and social preview tags.
// Used in the browser on navigation, and at build time (scripts/vite-seo.js) to
// write a static HTML file per case study, since link-preview bots don't run JS.
// Plain JS with no imports, so the Vite config can load it too.

// Keep HOME_META in step with the tags in index.html.
export const HOME_META = {
  path: '/',
  title: 'Sakshi Gupta | Agentic AI Developer',
  description:
    'Sakshi Gupta builds multi-agent systems, MCP servers, RAG products and LLM backends that hold up in production. Open to remote and full-time roles.',
  socialDescription: 'Multi-agent systems, MCP servers, RAG products and LLM backends that hold up in production.',
}

export const caseStudyMeta = (project, caseStudy) => ({
  path: `/work/${project.slug}`,
  title: `${project.short} — Case study | Sakshi Gupta`,
  description: caseStudy.tagline,
  socialDescription: caseStudy.tagline,
})

// [tag, identifying attribute, its value, attribute to set, new value]
export function metaTags(meta, siteUrl) {
  const url = `${siteUrl.replace(/\/+$/, '')}${meta.path}`
  return [
    ['meta', 'name', 'description', 'content', meta.description],
    ['link', 'rel', 'canonical', 'href', url],
    ['meta', 'property', 'og:url', 'content', url],
    ['meta', 'property', 'og:title', 'content', meta.title],
    ['meta', 'property', 'og:description', 'content', meta.socialDescription],
    ['meta', 'name', 'twitter:title', 'content', meta.title],
    ['meta', 'name', 'twitter:description', 'content', meta.socialDescription],
  ]
}

export function applyMeta(meta, siteUrl) {
  document.title = meta.title
  for (const [tag, key, id, attr, value] of metaTags(meta, siteUrl)) {
    document.querySelector(`${tag}[${key}="${id}"]`)?.setAttribute(attr, value)
  }
}
