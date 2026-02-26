import React, { useState } from 'react'
import { Send, Mail, User, MessageSquare } from 'lucide-react'
import SpotlightCard from './reactbits/SpotlightCard'
import GradientText from './reactbits/GradientText'

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // For now, just show success message
      // You can integrate with EmailJS, Formspree, or your backend here
      console.log('Form submitted:', formData)
      setSubmitted(true)
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', message: '' })
        setSubmitted(false)
      }, 3000)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-bold font-display mb-4">
            Get In <GradientText colors={['#ffffff', '#a855f7', '#ec4899', '#ffffff']} speed={6}>Touch</GradientText>
          </h2>
          <p className="text-gray-400 text-lg">
            Have a project in mind? Let's work together to build something amazing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <SpotlightCard className="bg-dark-secondary border border-white/10 rounded-xl p-6 hover:border-white/30 transition-colors" spotlightColor="rgba(168, 85, 247, 0.08)">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/10 border border-white/30 rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Email</h3>
                  <a href="mailto:sg6227174@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                    sg6227174@gmail.com
                  </a>
                </div>
              </div>
            </SpotlightCard>

            <SpotlightCard className="bg-dark-secondary border border-white/10 rounded-xl p-6" spotlightColor="rgba(59, 130, 246, 0.08)">
              <h3 className="text-lg font-semibold mb-4">Why Work With Me?</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <span className="text-white mr-2">✓</span>
                  <span>Expertise in Agentic AI and Gen AI systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">✓</span>
                  <span>End-to-end project development and deployment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">✓</span>
                  <span>Clean, maintainable, and scalable code</span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">✓</span>
                  <span>Fast response time and clear communication</span>
                </li>
              </ul>
            </SpotlightCard>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                <User className="w-4 h-4 inline mr-2" />
                Your Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className={`w-full px-4 py-3 bg-dark-secondary border ${
                  errors.name ? 'border-red-500' : 'border-white/10'
                } rounded-lg focus:border-white/50 focus:outline-none text-white placeholder-gray-500 transition-colors`}
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                <Mail className="w-4 h-4 inline mr-2" />
                Your Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={`w-full px-4 py-3 bg-dark-secondary border ${
                  errors.email ? 'border-red-500' : 'border-white/10'
                } rounded-lg focus:border-white/50 focus:outline-none text-white placeholder-gray-500 transition-colors`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                <MessageSquare className="w-4 h-4 inline mr-2" />
                Your Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                rows="5"
                className={`w-full px-4 py-3 bg-dark-secondary border ${
                  errors.message ? 'border-red-500' : 'border-white/10'
                } rounded-lg focus:border-white/50 focus:outline-none text-white placeholder-gray-500 transition-colors resize-none`}
              />
              {errors.message && (
                <p className="text-red-400 text-sm mt-1">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={submitted}
              className={`w-full flex items-center justify-center space-x-2 ${
                submitted
                  ? 'bg-green-600 cursor-not-allowed'
                  : 'bg-white hover:bg-gray-200'
              } text-black font-semibold px-8 py-4 rounded-lg transition-all duration-300 hover:scale-105`}
            >
              {submitted ? (
                <>
                  <span>✓</span>
                  <span>Message Sent!</span>
                </>
              ) : (
                <>
                  <Send size={20} />
                  <span>Send Message</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default ContactForm
