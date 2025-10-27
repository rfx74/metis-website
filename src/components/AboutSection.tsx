'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'
import { useTranslation } from '@/lib/LanguageContext'

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const t = useTranslation()

  return (
    <section id="about" ref={ref} className="min-h-screen bg-white/30 backdrop-blur-sm py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8"
          >
            {t.about.title.split(' ')[0]} <span className="bg-gradient-to-r from-gray-600 to-gray-800 bg-clip-text text-transparent">
              {t.about.title.split(' ').slice(1).join(' ')}
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl lg:text-2xl text-gray-700 mb-8 sm:mb-12 leading-relaxed px-4"
          >
            {t.about.description}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="glass-light rounded-3xl p-6 sm:p-8 md:p-12"
          >
            <p className="text-lg text-gray-800 leading-relaxed">
              {t.about.mission}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}