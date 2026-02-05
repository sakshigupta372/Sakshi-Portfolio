import React from 'react'
import { Award, ExternalLink } from 'lucide-react'

const Certifications = () => {
  const certifications = [
    {
      title: 'AWS Certified Machine Learning',
      issuer: 'Amazon Web Services',
      date: '2024',
      credentialId: 'AWS-ML-2024-XXXXX',
      link: '#',
      skills: ['Machine Learning', 'AWS', 'Model Deployment']
    },
    {
      title: 'TensorFlow Developer Certificate',
      issuer: 'Google',
      date: '2023',
      credentialId: 'TF-DEV-2023-XXXXX',
      link: '#',
      skills: ['TensorFlow', 'Deep Learning', 'Neural Networks']
    },
    {
      title: 'Deep Learning Specialization',
      issuer: 'DeepLearning.AI (Coursera)',
      date: '2023',
      credentialId: 'DEEP-2023-XXXXX',
      link: '#',
      skills: ['Deep Learning', 'CNNs', 'RNNs', 'Transformers']
    },
    {
      title: 'Azure AI Engineer Associate',
      issuer: 'Microsoft',
      date: '2023',
      credentialId: 'AZ-AI-2023-XXXXX',
      link: '#',
      skills: ['Azure AI', 'Cognitive Services', 'MLOps']
    },
    {
      title: 'Natural Language Processing',
      issuer: 'Stanford Online',
      date: '2022',
      credentialId: 'NLP-2022-XXXXX',
      link: '#',
      skills: ['NLP', 'Transformers', 'LLMs']
    },
    {
      title: 'IoT Fundamentals',
      issuer: 'Cisco',
      date: '2022',
      credentialId: 'IOT-2022-XXXXX',
      link: '#',
      skills: ['IoT', 'Sensors', 'Arduino', 'Raspberry Pi']
    }
  ]

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold font-mono mb-4">
            Certifications & <span className="text-gradient">Achievements</span>
          </h2>
          <p className="text-gray-400 text-lg">Professional certifications and continuous learning</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className="group bg-dark-secondary border border-white/10 rounded-xl p-6 hover:border-white/40 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:shadow-white/10"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-white/10 border border-white/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <a
                  href={cert.link}
                  onClick={(e) => e.preventDefault()}
                  className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 rounded-lg transition-all"
                >
                  <ExternalLink size={16} className="text-gray-400 hover:text-white" />
                </a>
              </div>

              <h3 className="text-lg font-bold font-mono mb-2 group-hover:text-white transition-colors">
                {cert.title}
              </h3>
              
              <p className="text-sm text-gray-400 mb-1">{cert.issuer}</p>
              <p className="text-xs text-gray-500 font-mono mb-3">{cert.date}</p>
              
              <div className="mb-4 pb-4 border-b border-white/10">
                <p className="text-xs text-gray-500">Credential ID:</p>
                <p className="text-xs font-mono text-gray-400">{cert.credentialId}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {cert.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-mono px-2 py-1 bg-dark border border-white/20 rounded text-gray-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Want to verify these certifications?</p>
          <button className="inline-flex items-center space-x-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 text-white font-semibold px-6 py-3 rounded-lg transition-all">
            <ExternalLink size={18} />
            <span>View All Credentials</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Certifications
