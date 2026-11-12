import React from 'react'
import { motion } from 'framer-motion'
import { RevealWords } from './Reveal'

const EXPERIENCES = [
  {
    type: 'Work',
    title: 'Agentic AI Developer',
    organization: 'BlockX',
    period: 'Jul 2025 — Dec 2025',
    description:
      'Architected an SDK for autonomous agent deployment. Built custom MCP servers for secure LLM tool use, and a RAG chatbot with context-aware reasoning.',
  },
  {
    type: 'Work',
    title: 'Freelance AI Developer',
    organization: 'Independent',
    period: '2024 — Present',
    description:
      'Shipped AI systems for 4+ international clients including Compliledger (California), Omelo, and CoinX — backends, agents, and API orchestration.',
  },
  {
    type: 'Education',
    title: 'B.Tech in Computer Science',
    organization: 'AITR, Indore',
    period: '2023 — 2027',
    description:
      'Focus on AI and autonomous systems. CGPA 7.4/10. Research presented at NSSAFE 2025.',
  },
]

const Timeline = () => {
  return (
    <section id="journey" className="scroll-mt-24 border-t border-line px-5 py-24 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.22em] text-muted">04 — Path</p>
          <RevealWords
            as="h2"
            text="Experience"
            className="font-display text-4xl tracking-tight text-ink sm:text-5xl"
          />
        </div>

        <div className="relative">
          <motion.span
            className="absolute bottom-0 left-0 top-0 hidden w-px origin-top bg-ink/20 md:block"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="divide-y divide-line border-y border-line">
            {EXPERIENCES.map((exp, index) => (
              <motion.article
                key={exp.title}
                className="grid gap-4 py-10 md:grid-cols-[8rem_1fr_1.6fr] md:gap-10 md:pl-10"
                initial={{ opacity: 0, x: -18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">{exp.type}</p>
                <div>
                  <h3 className="font-display text-2xl text-ink">{exp.title}</h3>
                  <p className="mt-1 text-sm text-muted">{exp.organization}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted">{exp.period}</p>
                </div>
                <p className="text-sm leading-relaxed text-muted sm:text-base">{exp.description}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Timeline
