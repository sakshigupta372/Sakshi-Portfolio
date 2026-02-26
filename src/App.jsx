import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProfileCard from './components/ProfileCard'
import ProjectShowcase from './components/ProjectShowcase'
import TechStack from './components/TechStack'
import Timeline from './components/Timeline'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import ParticleBackground from './components/ParticleBackground'
import CustomCursor from './components/CustomCursor'
import ClickSpark from './components/reactbits/ClickSpark'
import Aurora from './components/reactbits/Aurora'
import Noise from './components/reactbits/Noise'

function App() {
  return (
    <ClickSpark sparkColor="#a855f7" sparkCount={10} sparkSize={8} duration={500}>
    <div className="min-h-screen bg-dark text-white relative overflow-hidden">
      <CustomCursor />
      <ParticleBackground />
      <Noise opacity={0.03} />
      
      {/* Aurora + Orb Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Aurora />
        <div className="absolute top-20 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-white/8 via-white/3 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/4 -right-32 w-[700px] h-[700px] bg-gradient-to-bl from-white/6 via-white/3 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-white/5 via-white/2 to-transparent rounded-full blur-3xl"></div>
      </div>
      <div className="gradient-bg relative z-10">
        <Navbar />
        <Hero />
        <ProfileCard />
        <ProjectShowcase />
        <TechStack />
        <Timeline />
        <ContactForm />
        <Footer />
      </div>
    </div>
    </ClickSpark>
  )
}

export default App
