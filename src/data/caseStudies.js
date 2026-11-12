// Long-form case studies, keyed by project slug. Every fact and number here
// comes from the project's own GitHub README — keep it that way when editing.
//
// flow: the animated architecture diagram. Each step is one box; `detail` is
// the small caption. `branch` renders a step as a row of parallel boxes.

export const CASE_STUDIES = {
  'agent-observatory': {
    tagline: 'Watch an AI agent work, not just its final answer.',
    role: 'Solo — design, agent runtime, 3D frontend, evals',
    overview:
      'AI Agent Observatory is a real-time 3D observability platform for AI agents. It renders the path an agent ' +
      'actually took — intent detection, planning, tool selection, memory retrieval, reasoning and verification — ' +
      'as it happens, and keeps span-based traces and an evaluation suite to measure it.',
    problem: [
      'Logs tell you what an agent did after the fact. When an agent picks the wrong tool, retrieves irrelevant memory or ' +
        'stalls on a failing API, the failure is buried in text.',
      'I wanted to see the execution path live, and to measure whether self-verification and replanning actually make ' +
        'an agent more reliable — with numbers, not vibes.',
    ],
    flow: [
      { label: 'User query' },
      { label: 'Intent classifier', detail: 'pattern match + LLM routing' },
      { label: 'Planner', detail: 'builds execution plan' },
      { label: 'Tool hub', branch: ['Web search', 'pgvector DB', 'Calculator'] },
      { label: 'Memory store', detail: 'pgvector · 384-dim' },
      { label: 'Reasoning', detail: 'Groq gpt-oss-120b' },
      { label: 'Claim verifier', detail: 'checks claims vs sources' },
      { label: 'Response', detail: 'answer + confidence' },
    ],
    decisions: [
      {
        title: 'Direct orchestration, no framework',
        body: 'No LangChain or LlamaIndex. Owning the loop keeps every step transparent, which is the whole point of an observability tool.',
      },
      {
        title: 'SSE streaming to the UI',
        body: 'Server-Sent Events push each stage to the 3D scene as it runs, so the graph shows what the agent is doing right now.',
      },
      {
        title: 'Claim-level verification + replanning',
        body: 'Each factual claim is checked against tool outputs. Tool failures trigger a replan, with exponential backoff for rate limits.',
      },
      {
        title: 'Span-based tracing in Postgres',
        body: 'Every run stores timestamps, latency per stage, tokens and cost — the data behind the traces and evals dashboards.',
      },
    ],
    metrics: [
      { value: '96%', label: 'Task success (verifier + replan, 24/25)' },
      { value: '+8–12%', label: 'Accuracy gain from verification' },
      { value: '92%', label: 'Injected-failure detection' },
      { value: '1.02ms', label: 'HNSW vector search at 5K rows' },
      { value: '~1.9s', label: 'p50 end-to-end latency' },
      { value: '$0.00044', label: 'Cost per run (Groq list price)' },
    ],
    stack: ['Astro', 'React', 'Three.js', 'React Three Fiber', 'Node.js 22', 'PostgreSQL', 'pgvector', 'Groq', 'Tavily', 'Transformers.js', 'SSE', 'Neon', 'Render'],
  },

  'llm-gateway': {
    tagline: 'One gateway in front of every model provider, with per-tenant control.',
    role: 'Solo — backend, routing, caching, admin dashboard',
    overview:
      'A proxy layer that sits between applications and LLM providers. Each tenant gets its own API key, rate limits ' +
      'and monthly budget; requests are cached semantically and routed across providers with automatic fallback, and ' +
      'every request is logged with its token count and USD cost.',
    problem: [
      'When several apps or customers share LLM access, everything collapses into one provider bill. Nobody can say ' +
        'which tenant spent what, a single noisy tenant can exhaust rate limits for everyone, and identical questions get paid for again and again.',
      'Provider outages also take every app down at once unless something sits in the middle to fail over.',
    ],
    flow: [
      { label: 'Client app', detail: 'Bearer gw_… key' },
      { label: 'Auth', detail: 'resolve tenant' },
      { label: 'Rate limiter', detail: 'RPM + TPM per tenant' },
      { label: 'Budget check', detail: 'monthly spend cap' },
      { label: 'Semantic cache', detail: 'similar, not just identical' },
      { label: 'Router', branch: ['OpenAI', 'Anthropic', 'Local', 'Mock'] },
      { label: 'Cost tracker', detail: 'tokens + USD per request' },
    ],
    decisions: [
      {
        title: 'Semantic, not exact, caching',
        body: 'Similar queries hit the cache, not only byte-identical ones — repeated questions stop costing money. Responses report cache_hit.',
      },
      {
        title: 'Ordered provider fallback',
        body: 'OpenAI → Anthropic → Local → Mock. If a provider fails or has no key configured, the request moves down the chain.',
      },
      {
        title: 'Two-key model',
        body: 'An admin key manages tenants; tenants get their own gw_ keys (shown once). Tenant traffic never touches admin routes.',
      },
      {
        title: 'Runs with just Python',
        body: 'SQLite replaces Postgres and an in-memory store replaces Redis locally, so anyone can run it in two commands. OpenTelemetry tracing is opt-in.',
      },
    ],
    metrics: [],
    stack: ['Python', 'FastAPI', 'SQLite / PostgreSQL', 'Redis (fakeredis locally)', 'OpenTelemetry', 'Next.js admin'],
  },

  'nexus-ai': {
    tagline: 'An interview that adapts to every answer you give.',
    role: 'Solo — product, multi-agent backend, frontend',
    overview:
      'NEXUS.AI is an agentic interview simulator on Google Gemini. A three-agent pipeline generates role-specific ' +
      'questions, scores each answer from 0 to 10 with feedback, and picks the next question based on your score — ' +
      'across technical, HR, system-design and live coding rounds.',
    problem: [
      'Most interview prep is a static question bank. It doesn\u2019t know your background, can\u2019t tell a weak answer ' +
        'from a strong one, and never gets harder or easier based on how you are doing.',
      'Running it on the platform\u2019s own API key would also mean rate limits and cost that grow with every user.',
    ],
    flow: [
      { label: 'Sign in', detail: 'Clerk' },
      { label: 'BYOK', detail: 'your Gemini key, sessionStorage only' },
      { label: 'Resume parse', detail: 'optional PDF → profile' },
      { label: 'Agent 1 · Generator', detail: 'role + resume-aware question' },
      { label: 'Agent 2 · Evaluator', detail: 'score 0–10, strengths, complexity' },
      { label: 'Agent 3 · Follow-up', detail: 'adaptive difficulty' },
      { label: 'Report', detail: 'PDF + progress charts' },
    ],
    decisions: [
      {
        title: 'Three specialised agents',
        body: 'Generating, evaluating and following up are separate Gemini agents, so each prompt stays focused and the evaluator can be code-aware in coding rounds.',
      },
      {
        title: 'Bring your own key',
        body: 'Users paste their own Gemini key after login. It lives in sessionStorage and is never stored in the database — no platform rate limits, no shared bill.',
      },
      {
        title: 'Privacy-first processing',
        body: 'PDF reports are generated client-side with jsPDF and the resume is never stored on the server.',
      },
      {
        title: 'Real interview modes',
        body: 'Monaco editor for 8 languages in coding rounds, two-way voice via the Web Speech API, company and interviewer-persona targeting, and three timer modes.',
      },
    ],
    metrics: [
      { value: '3', label: 'Cooperating Gemini agents' },
      { value: '4', label: 'Round types incl. live coding' },
      { value: '8', label: 'Languages in the code editor' },
      { value: '$0', label: 'Monthly hosting (Vercel + Render + Atlas)' },
    ],
    stack: ['Next.js', 'Node.js', 'Express', 'Gemini', 'MongoDB', 'Clerk', 'Monaco Editor', 'Recharts', 'jsPDF', 'Web Speech API', 'Framer Motion'],
  },
}

export const CASE_STUDY_ORDER = ['agent-observatory', 'llm-gateway', 'nexus-ai']
