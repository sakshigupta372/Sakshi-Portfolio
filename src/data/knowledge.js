import { PROJECTS, isLiveDemo } from './projects.js'
import { CASE_STUDIES } from './caseStudies.js'
import { EMAIL, LINKS } from '../lib/ui.js'

// Everything the on-page agent is allowed to say. Each entry has:
//   keywords – words that strongly signal the topic (weight 3)
//   text     – the answer; its own words also count toward matching (weight 1)
//   actions  – optional buttons: { label, section } scrolls, { label, href } opens a link
// Projects are generated from the same data the Work section renders.

const isLive = isLiveDemo

const projectEntries = PROJECTS.map((p) => ({
  id: `project-${p.id}`,
  title: p.title,
  keywords: [p.short, p.title, p.type, p.category, ...p.tags].map((s) => s.toLowerCase()),
  text:
    `${p.short} — ${p.title}. Problem: ${p.problem} What I built: ${p.built} ` +
    `Outcome: ${p.result} Stack: ${p.tags.join(', ')}.`,
  actions: [
    p.slug ? { label: 'Read case study', route: `/work/${p.slug}` } : null,
    isLive(p) ? { label: 'Live demo', href: p.demoLink } : null,
    { label: 'GitHub', href: p.githubLink },
  ].filter(Boolean),
}))

const projectNames = PROJECTS.map((p) => p.short).join(', ')

export const ENTRIES = [
  {
    id: 'intro',
    title: 'Who is Sakshi',
    keywords: ['who', 'about', 'introduce', 'yourself', 'sakshi', 'bio', 'summary', 'do', 'build', 'builds', 'work'],
    text:
      "Sakshi Gupta is an Agentic AI & Gen AI developer. She builds multi-agent systems, custom MCP servers, " +
      'RAG products and LLM backends that hold up in production.',
    actions: [{ label: 'About section', section: 'about' }],
  },
  {
    id: 'projects-overview',
    title: 'Projects overview',
    keywords: ['projects', 'project', 'portfolio', 'best', 'showcase', 'built', 'shipped', 'demo', 'demos', 'list'],
    text:
      `She has shipped 10+ projects. The ${PROJECTS.length} featured here are: ${projectNames}. ` +
      'They cover agent platforms, LLM infrastructure, RAG products and developer tools. ' +
      'Ask about any one by name, or try "tell me about the LLM Gateway".',
    actions: [{ label: 'Open Work', section: 'projects' }],
  },
  ...projectEntries,
  {
    id: 'stack',
    title: 'Tech stack',
    keywords: [
      'stack', 'tech', 'technologies', 'skills', 'tools', 'languages', 'frameworks', 'python', 'typescript',
      'javascript', 'langgraph', 'crewai', 'langchain', 'autogen', 'fastapi', 'react', 'nextjs', 'docker',
    ],
    text:
      'Agents: LangGraph, CrewAI, LangChain, AutoGen, MCP, RAG, Gemini, OpenAI and Groq APIs. ' +
      'Backend: Python, FastAPI, Node.js, Express, Django, Flask, Postgres/pgvector, Redis, MongoDB, Supabase. ' +
      'Frontend: React, Next.js, TypeScript, Tailwind. Plus Docker, Git, and a PyPI SDK for agent deployment.',
    actions: [{ label: 'Tech stack', section: 'stack' }],
  },
  {
    id: 'mcp',
    title: 'MCP servers',
    keywords: ['mcp', 'model', 'context', 'protocol', 'tool', 'tools', 'servers', 'blockx'],
    text:
      'At BlockX she built custom MCP servers that let LLMs call tools securely, and an SDK for deploying ' +
      'autonomous agents. MCP is a core part of how she connects agents to real systems.',
    actions: [{ label: 'Experience', section: 'journey' }],
  },
  {
    id: 'rag',
    title: 'RAG',
    keywords: ['rag', 'retrieval', 'embeddings', 'vector', 'pgvector', 'chatbot', 'grounded', 'hallucination'],
    text:
      'She builds RAG systems grounded in source material — for example a privacy-first site Q&A bot on ' +
      'Gemini 2.5 Pro with embeddings over public pages only, and a production chatbot with context-aware reasoning.',
    actions: [{ label: 'RAG project', section: 'projects' }],
  },
  {
    id: 'experience',
    title: 'Experience',
    keywords: ['experience', 'job', 'jobs', 'career', 'worked', 'company', 'companies', 'employment', 'blockx', 'freelance', 'intern', 'history'],
    text:
      'Agentic AI Developer at BlockX (Jul–Dec 2025): architected an SDK for autonomous agent deployment, ' +
      'custom MCP servers and a RAG chatbot. Freelance AI Developer (2024–present): AI systems for 4+ ' +
      'international clients including Compliledger (California), Omelo and CoinX.',
    actions: [{ label: 'Journey', section: 'journey' }],
  },
  {
    id: 'education',
    title: 'Education',
    keywords: ['education', 'degree', 'college', 'university', 'study', 'studied', 'btech', 'cgpa', 'aitr', 'student', 'graduate', 'research', 'nssafe'],
    text:
      'B.Tech in Computer Science at AITR, Indore (2023–2027), focused on AI and autonomous systems. ' +
      'CGPA 7.4/10. Research presented at NSSAFE 2025.',
    actions: [{ label: 'Journey', section: 'journey' }],
  },
  {
    id: 'availability',
    title: 'Availability',
    keywords: ['available', 'availability', 'hire', 'hiring', 'open', 'job', 'opportunity', 'remote', 'fulltime', 'full-time', 'freelance', 'join', 'recruit'],
    text:
      'Yes — she is open to work, remote and full-time. She also takes freelance AI projects. ' +
      'The fastest way to reach her is email.',
    actions: [{ label: 'Email Sakshi', href: `mailto:${EMAIL}` }, { label: 'Contact form', section: 'contact' }],
  },
  {
    id: 'contact',
    title: 'Contact',
    keywords: ['contact', 'email', 'reach', 'message', 'linkedin', 'github', 'twitter', 'social', 'talk', 'call', 'connect'],
    text: `Email: ${EMAIL}. She is also on GitHub and LinkedIn — links below.`,
    actions: [
      { label: 'Email', href: `mailto:${EMAIL}` },
      { label: 'LinkedIn', href: LINKS.linkedin },
      { label: 'GitHub', href: LINKS.github },
    ],
  },
  {
    id: 'resume',
    title: 'Resume',
    keywords: ['resume', 'cv', 'curriculum', 'download', 'pdf'],
    text: 'You can download her resume as a PDF.',
    actions: [{ label: 'Download resume', href: '/resume.pdf' }],
  },
  {
    id: 'location',
    title: 'Location',
    keywords: ['where', 'location', 'based', 'live', 'city', 'country', 'india', 'indore', 'timezone', 'relocate'],
    text: 'Based in Indore, India, and comfortable working remotely with international teams (4+ clients so far).',
    actions: [],
  },
  {
    id: 'website',
    title: 'This website',
    keywords: ['website', 'site', 'portfolio', 'built', 'made', 'react', 'vite', 'tailwind', 'framer', 'theme', 'dark', 'palette'],
    text:
      'This site is React + Vite + Tailwind with Framer Motion and Lenis smooth scroll. Press Ctrl/⌘+K for the ' +
      'command palette, and use the sun/moon button for dark mode.',
    actions: [],
  },
]

export const SUGGESTIONS = [
  'What do you build?',
  'Show me your best project',
  'Are you available?',
  "What's your tech stack?",
  'Tell me about your experience',
  'How can I contact you?',
]

const STOP = new Set(
  ('a an the and or but if of to in on at by for with from is are was were be been am do does did your you ' +
    'yours my me i we us our it its this that these those what which who whom how can could would should will ' +
    'please tell about show give any some there their them they he she her his as so than then too very just ' +
    'know want like get got let lets hi hello hey')
    .split(' ')
);

const tokenize = (str) =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.replace(/^[.-]+|[.-]+$/g, ''))
    .filter((w) => w && !STOP.has(w))
    .map((w) => (w.length > 3 ? w.replace(/(ing|ed|es|s)$/, '') : w))

const GREETING = /^(hi|hello|hey|yo|hola|namaste)\b/i
const THANKS = /\b(thanks|thank you|thx|cheers)\b/i

const indexed = ENTRIES.map((entry) => ({
  entry,
  keywords: new Set(entry.keywords.flatMap((k) => tokenize(k))),
  words: new Set(tokenize(`${entry.title} ${entry.text}`)),
  phrases: entry.keywords.filter((k) => k.includes(' ') || k.includes('-')),
}))

// Rank entries against the question. Returns the best few with scores.
export function retrieve(query, limit = 3) {
  const q = query.toLowerCase()
  const tokens = tokenize(query)
  if (!tokens.length) return []

  const scored = indexed
    .map(({ entry, keywords, words, phrases }) => {
      let score = 0
      for (const t of tokens) {
        if (keywords.has(t)) score += 3
        else if (words.has(t)) score += 1
      }
      for (const p of phrases) if (q.includes(p)) score += 3
      // Naming a project outright should beat the generic overview.
      if (entry.id.startsWith('project-') && q.includes(entry.title.toLowerCase().slice(0, 12))) score += 4
      return { entry, score }
    })
    .filter((s) => s.score >= 2)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit)
}

// Build the agent's reply for a question. `trace` is what the UI shows while "thinking".
export function answer(query) {
  const trimmed = query.trim()

  if (GREETING.test(trimmed) && trimmed.split(/\s+/).length <= 3) {
    return {
      trace: ['intent: greeting'],
      text: "Hi! I'm Sakshi's portfolio agent. Ask me about her projects, stack, experience, or availability.",
      actions: [],
      sources: [],
    }
  }
  if (THANKS.test(trimmed)) {
    return { trace: ['intent: thanks'], text: 'Anytime! Want to see the work or get in touch?', actions: [{ label: 'Open Work', section: 'projects' }, { label: 'Email', href: `mailto:${EMAIL}` }], sources: [] }
  }

  const hits = retrieve(trimmed)

  if (!hits.length) {
    return {
      trace: ['retriever: 0 matches', 'fallback: suggest topics'],
      text:
        "I only know what's on this portfolio, and I couldn't match that. Try asking about her projects, " +
        'tech stack, experience, education, or whether she is available — or email her directly.',
      actions: [{ label: 'Email Sakshi', href: `mailto:${EMAIL}` }],
      sources: [],
    }
  }

  const top = hits[0].entry
  const sources = hits.map((h) => h.entry.title)
  const topProjects = hits.filter((h) => h.entry.id.startsWith('project-'))

  // A generic "projects" question lists the strongest matches, not a single one.
  const text =
    top.id === 'projects-overview' || topProjects.length === 0 || topProjects.length === 1
      ? top.text
      : topProjects
          .slice(0, 2)
          .map((h) => h.entry.text)
          .join('\n\n')

  return {
    trace: [`planner: classify → ${top.id}`, `retriever: ${hits.length} source${hits.length > 1 ? 's' : ''}`, 'composer: grounded reply'],
    text,
    actions: top.actions,
    sources,
  }
}

// ---------------------------------------------------------------------------
// Plain-text profile for the LLM (used server-side by /api/chat). It contains
// only what is already public on this site.
// ---------------------------------------------------------------------------
export function buildContext() {
  const general = ENTRIES.filter((e) => !e.id.startsWith('project-'))
    .map((e) => `## ${e.title}\n${e.text}`)
    .join('\n\n')

  const projects = PROJECTS.map((p) => {
    const cs = p.slug ? CASE_STUDIES[p.slug] : null
    const lines = [
      `## Project: ${p.short} — ${p.title} (${p.type})`,
      `Problem: ${p.problem}`,
      `Built: ${p.built}`,
      `Result: ${p.result}`,
      `Stack: ${p.tags.join(', ')}`,
      isLive(p) ? `Live demo: ${p.demoLink}` : null,
      `Code: ${p.githubLink}`,
    ]
    if (cs) {
      lines.push(`Overview: ${cs.overview}`)
      lines.push(`Architecture: ${cs.flow.map((s) => (s.branch ? `${s.label} [${s.branch.join(' | ')}]` : s.label)).join(' → ')}`)
      lines.push(`Key decisions: ${cs.decisions.map((d) => `${d.title}: ${d.body}`).join(' ')}`)
      if (cs.metrics.length) lines.push(`Measured results: ${cs.metrics.map((m) => `${m.value} ${m.label}`).join('; ')}`)
      lines.push(`Full stack: ${cs.stack.join(', ')}`)
      lines.push(`Case study page: /work/${p.slug}`)
    }
    return lines.filter(Boolean).join('\n')
  }).join('\n\n')

  return `${general}\n\n${projects}`
}
