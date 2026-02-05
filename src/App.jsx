import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import TechStack from './components/TechStack'
import Features from './components/Features'
import Timeline from './components/Timeline'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import ParticleBackground from './components/ParticleBackground'
import CustomCursor from './components/CustomCursor'

function App() {
  return (
    <div className="min-h-screen bg-dark text-white relative overflow-hidden">
      <CustomCursor />
      <ParticleBackground />
      
      {/* Enhanced Glassmorphism Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Large glowing orbs */}
        <div className="absolute top-20 -left-20 w-[600px] h-[600px] bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/4 -right-32 w-[700px] h-[700px] bg-gradient-to-bl from-white/10 via-white/5 to-transparent rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] bg-gradient-to-tr from-white/10 via-white/5 to-transparent rounded-full blur-3xl opacity-50"></div>
        
        {/* Additional smaller orbs for depth */}
        <div className="absolute top-1/2 left-1/4 w-[300px] h-[300px] bg-white/8 rounded-full blur-2xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-white/8 rounded-full blur-2xl"></div>
      </div>
      <div className="gradient-bg relative z-10">
        <Navbar />
        <Hero />
        <TechStack />
        <Features />
        <Timeline />
        <ContactForm />
        <Footer />
      </div>
    </div>
  )
}

export default App
