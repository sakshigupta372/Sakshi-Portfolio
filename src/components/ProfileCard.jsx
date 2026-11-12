import React from 'react'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail } from 'lucide-react'
import CountUp from './reactbits/CountUp'
import { Reveal, RevealLine, RevealWords, fadeUp, stagger } from './Reveal'

const STATS = [
  { value: 10, suffix: '+', label: 'Projects shipped' },
  { value: 4, suffix: '+', label: 'International clients' },
  { value: 1, suffix: '+', label: 'Year in production' },
]

const DETAILS = [
  { label: 'Focus', value: 'Multi-agent systems, MCP, RAG' },
  { label: 'Location', value: 'Indore, India' },
  { label: 'Education', value: 'B.Tech CSE · AITR · 2023–2027' },
  { label: 'Status', value: 'Available for work' },
]

const ProfileCard = () => {
  return (
    <section id="about" className="relative scroll-mt-24 overflow-hidden border-t border-line px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 flex items-end justify-between gap-6 sm:mb-16">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">01 — About</p>
          <RevealLine className="mb-1 max-w-xs flex-1 bg-ink/20" />
        </div>

        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] lg:gap-20">
          <div>
            <RevealWords
              as="h2"
              text="I architect autonomous systems that actually ship."
              className="font-display text-4xl leading-[1.05] tracking-tight text-ink sm:text-5xl lg:text-[3.5rem]"
            />

            <motion.div
              className="mt-8 max-w-xl space-y-4 text-base leading-relaxed text-muted sm:text-lg"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={stagger}
            >
              <motion.p variants={fadeUp}>
                I&apos;m Sakshi Gupta, an Agentic AI & Gen AI developer. I specialize in multi-agent
                orchestration, custom MCP servers, and RAG-powered products.
              </motion.p>
              <motion.p variants={fadeUp}>
                I built an SDK for autonomous agent deployment and delivered production chatbots
                with context-aware reasoning — systems that plan, reason, and act on their own.
              </motion.p>
            </motion.div>

            <motion.div
              className="mt-10 flex items-center gap-3"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              {[
                { href: 'https://github.com/sakshigupta372', label: 'GitHub', icon: Github },
                { href: 'https://www.linkedin.com/in/sakshi-gupta-ba858a292/', label: 'LinkedIn', icon: Linkedin },
                { href: 'mailto:sg6227174@gmail.com', label: 'Email', icon: Mail },
              ].map((link) => (
                <motion.a
                  key={link.label}
                  variants={fadeUp}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
                  aria-label={link.label}
                >
                  <link.icon size={16} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          <Reveal delay={0.12} className="lg:pt-2">
            <div className="flex items-center gap-5">
              <motion.div
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[1.4rem] border border-line bg-surface sm:h-28 sm:w-28"
                initial={{ clipPath: 'inset(100% 0 0 0)' }}
                whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <img
                  src="/profile.webp"
                  alt="Sakshi Gupta"
                  width={112}
                  height={112}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover"
                />
              </motion.div>
              <div>
                <p className="font-display text-2xl text-ink sm:text-3xl">Sakshi Gupta</p>
                <p className="mt-1 font-display italic text-muted">Agentic AI Developer</p>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4">
              {STATS.map((stat, index) => (
                <div key={stat.label}>
                  <p className="font-display text-4xl tracking-tight text-ink sm:text-5xl">
                    <CountUp target={stat.value} suffix={stat.suffix} duration={1400} />
                  </p>
                  <RevealLine className="my-3 bg-ink/30" delay={0.15 + index * 0.08} />
                  <p className="text-[11px] uppercase tracking-[0.14em] text-muted">{stat.label}</p>
                </div>
              ))}
            </div>

            <dl className="mt-10 space-y-0">
              {DETAILS.map((row, index) => (
                <motion.div
                  key={row.label}
                  className="flex justify-between gap-6 border-t border-line py-4 text-sm last:border-b"
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <dt className="uppercase tracking-[0.14em] text-muted">{row.label}</dt>
                  <dd className="text-right text-ink">{row.value}</dd>
                </motion.div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default ProfileCard
