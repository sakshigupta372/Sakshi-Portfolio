import React from 'react'
import { motion } from 'framer-motion'
import { RevealWords } from './Reveal'

const AGENT_SKILLS = [
  'LangGraph', 'CrewAI', 'LangChain', 'AutoGen', 'Multi-Agent Systems', 'MCP',
  'RAG', 'OpenAI API', 'Groq API', 'Gemini Vision', 'Hugging Face', 'Transformers',
  'Docker', 'NLP', 'PyPi SDK', 'Agent Orchestration',
]

const group = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.025 } },
}

const item = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

const TechStack = () => {
  return (
    <section id="stack" className="scroll-mt-24 border-t border-line px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.55 }}
        >
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">03 — Tools</p>
          <RevealWords
            as="h2"
            text="What I work with"
            className="font-display text-4xl tracking-tight text-ink sm:text-5xl"
          />
        </motion.div>

        <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-muted">Agents & AI</p>
        <motion.div
          className="flex flex-wrap gap-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={group}
        >
          {AGENT_SKILLS.map((skill) => (
            <motion.span
              key={skill}
              variants={item}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm text-ink"
            >
              {skill}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default TechStack
