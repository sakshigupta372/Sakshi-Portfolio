import React, { Suspense, lazy, useEffect } from 'react'
import { Analytics } from '@vercel/analytics/react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProfileCard from './components/ProfileCard'
import ProjectShowcase from './components/ProjectShowcase'
import TechStack from './components/TechStack'
import Timeline from './components/Timeline'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import ScrollProgress from './components/ScrollProgress'
import ScrollAnimations from './components/ScrollAnimations'
import SmoothScroll, { scrollToId } from './components/SmoothScroll'
import ToastHost from './components/Toast'
import AmbientBackground from './components/AmbientBackground'
import { ThemeProvider } from './theme/ThemeProvider'
import { matchCaseStudy, peekPendingSection, takePendingSection, usePath } from './lib/router.jsx'

// Not needed for first paint: split into their own chunks.
const CommandPalette = lazy(() => import('./components/CommandPalette'))
const AgentChat = lazy(() => import('./components/AgentChat'))
const GithubActivity = lazy(() => import('./components/GithubActivity'))
const CaseStudy = lazy(() => import('./pages/CaseStudy'))

function Home() {
  // Coming back from a case study via a nav link: finish the scroll once the
  // home page has its real height (Lenis measures asynchronously).
  useEffect(() => {
    if (!peekPendingSection()) return undefined
    const timers = []
    let id = null
    const attempt = (n) => {
      id = id || takePendingSection()
      if (!id) return
      window.lenis?.resize?.()
      scrollToId(id)
      if (n < 3) {
        timers.push(
          setTimeout(() => {
            // Settled if the section's top sits in the upper part of the viewport.
            const top = document.getElementById(id)?.getBoundingClientRect().top ?? 0
            if (top < 0 || top > window.innerHeight * 0.4) attempt(n + 1)
          }, 1300)
        )
      }
    }
    timers.push(setTimeout(() => attempt(0), 150))
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <main>
      <Hero />
      <ProfileCard />
      <ProjectShowcase />
      <TechStack />
      <Suspense fallback={<div className="min-h-[40rem]" />}>
        <GithubActivity />
      </Suspense>
      <Timeline />
      <ContactForm />
    </main>
  )
}

function App() {
  const path = usePath()
  const slug = matchCaseStudy(path)

  return (
    <ThemeProvider>
      <SmoothScroll>
        {/* `isolate` keeps the -z-10 background above this div's own bg-paper */}
        <div className="relative isolate min-h-screen bg-paper text-ink">
          <AmbientBackground />
          <ScrollProgress />
          <ScrollAnimations />
          <Navbar />
          {slug ? (
            <Suspense fallback={<div className="min-h-screen" />}>
              <CaseStudy key={slug} slug={slug} />
            </Suspense>
          ) : (
            <Home />
          )}
          <Footer />
          <Suspense fallback={null}>
            <AgentChat />
            <CommandPalette />
          </Suspense>
          <ToastHost />
        </div>
      </SmoothScroll>
      <Analytics />
    </ThemeProvider>
  )
}

export default App
