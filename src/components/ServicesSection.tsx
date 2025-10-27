'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useTranslation } from '@/lib/LanguageContext'

const serviceIcons = ['🛍️', '💳', '🌐', '🏢']
const serviceColors = [
  'from-blue-500 to-cyan-500',
  'from-purple-500 to-pink-500', 
  'from-green-500 to-emerald-500',
  'from-orange-500 to-red-500'
]

const stats = [
  { value: '50+', labelKey: 'services.stats.projects' },
  { value: '25+', labelKey: 'services.stats.clients' },
  { value: '5+', labelKey: 'services.stats.experience' },
  { value: '99%', labelKey: 'services.stats.satisfaction' }
]

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const t = useTranslation()

  const services = [
    t.services.ecommerce,
    t.services.fintech,
    t.services.defi,
    t.services.tokenization
  ]

  return (
    <section id="services" ref={ref} className="py-20 lg:py-32 bg-gray-900/95 backdrop-blur-sm relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-800/20 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 lg:mb-24"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <span className="text-sm uppercase tracking-widest text-blue-400 font-semibold">
              {t.services.subtitle}
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {t.services.title}
          </h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed"
          >
            Trasformiamo le tue idee in soluzioni digitali innovative che guidano la crescita del business
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.labelKey}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="text-center glass rounded-2xl p-6"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm md:text-base text-white/70">
                {stat.labelKey.split('.').reduce((obj, key) => obj?.[key], t as any)}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.15 }}
              className="group relative"
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <motion.div
                className="glass rounded-3xl p-8 h-full relative overflow-hidden card-hover"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Gradient Background on Hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${serviceColors[index]} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  initial={false}
                />

                {/* Service Icon */}
                <motion.div
                  className="text-5xl mb-6 text-center relative z-10"
                  animate={hoveredCard === index ? { scale: 1.2, rotate: 10 } : { scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {serviceIcons[index]}
                </motion.div>

                {/* Service Content */}
                <div className="relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-4 group-hover:text-white transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-white/80 mb-6 leading-relaxed text-sm md:text-base">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-white/90 mb-3">
                      {t.services.featuresLabel}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {service.features.map((feature, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ duration: 0.4, delay: 1 + index * 0.1 + idx * 0.05 }}
                          className="text-xs text-white/70 flex items-center"
                        >
                          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2 flex-shrink-0" />
                          {feature}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Examples */}
                  <div className="border-t border-white/10 pt-4">
                    <h4 className="text-sm font-semibold text-white/90 mb-3">
                      {t.services.examplesLabel}
                    </h4>
                    <div className="space-y-2">
                      {service.examples.map((example, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={isInView ? { opacity: 1 } : {}}
                          transition={{ duration: 0.4, delay: 1.2 + index * 0.1 + idx * 0.05 }}
                          className="text-sm text-white/70 flex items-center"
                        >
                          <span className="text-blue-400 mr-2">•</span>
                          {example}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/20 transition-all duration-300"
                  initial={false}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="text-center mt-16 lg:mt-24"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
            {t.services.cta.title}
          </h3>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            {t.services.cta.description}
          </p>
          <motion.button
            className="btn-primary group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const element = document.getElementById('contact')
              if (element) element.scrollIntoView({ behavior: 'smooth' })
            }}
          >
            {t.services.cta.button}
            <motion.span
              className="inline-block ml-2"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}