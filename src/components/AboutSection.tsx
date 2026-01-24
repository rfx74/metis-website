'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useLanguage, useTranslation } from '@/lib/LanguageContext'

export default function AboutSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { language } = useLanguage()
  const t = useTranslation()
  const [expanded, setExpanded] = useState(false)

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen py-20 lg:py-32 overflow-hidden bg-transparent"
    >
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#fb4ca8] mb-6 sm:mb-8"
          >
            {t.about.title}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg sm:text-xl lg:text-2xl text-white/80 mb-8 sm:mb-12 leading-relaxed text-justify"
          >
            {(() => {
              const paragraphs = String(t.about.description)
                .split(/\n\n+/)
                .filter(Boolean)
              const visible = expanded ? paragraphs : paragraphs.slice(0, 1)
              return visible.map((paragraph) => (
                <p key={paragraph} className="mb-6 last:mb-0">
                  {paragraph}
                </p>
              ))
            })()}
            {!expanded && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  className="btn-primary text-sm"
                  onClick={() => setExpanded(true)}
                >
                  {language === 'it' ? 'Leggi di più' : 'Read more'}
                </button>
              </div>
            )}
          </motion.div>

          {t.about.mission ? (
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="max-w-6xl mx-auto"
            >
              <div className="rounded-3xl bg-gradient-to-r from-cyan-400/80 via-fuchsia-500/80 to-blue-500/80 p-[1.5px] shadow-[0_16px_40px_rgba(18,115,197,0.25)]">
                <div className="glass-light rounded-3xl p-6 sm:p-8 md:p-12">
                  <p
                    className={`text-lg leading-relaxed text-slate-900 ${
                      language === 'it' ? 'font-bold italic text-center' : 'text-justify'
                    }`}
                  >
                    {t.about.mission}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  )
}