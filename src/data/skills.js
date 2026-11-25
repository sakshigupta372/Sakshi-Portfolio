// The tools in the Stack section, grouped as the patch board's four modules.
// The board and the narrow-screen chip list both read from here.
export const SKILL_GROUPS = {
  agents: ['LangGraph', 'CrewAI', 'LangChain', 'AutoGen', 'Multi-Agent Systems', 'Agent Orchestration'],
  context: ['MCP Servers', 'RAG Pipelines'],
  models: ['OpenAI API', 'Groq API', 'Gemini Vision', 'Hugging Face', 'Transformers', 'NLP'],
  ship: ['FastAPI', 'Flask', 'AWS', 'Docker', 'PyPi SDK'],
}

export const SKILLS = Object.values(SKILL_GROUPS).flat()
