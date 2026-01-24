'use client'

import { motion, useInView } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from '@/lib/LanguageContext'

export default function PortfolioSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const t = useTranslation()
  const [activeStep, setActiveStep] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const icons = useMemo(
    () => [
    // Strategy
    (
      <svg key="strategy" viewBox="0 0 24 24" fill="none" className="w-7 h-7" aria-hidden="true">
        <path
          d="M4 20V6a2 2 0 0 1 2-2h10.5a2 2 0 0 1 2 2v14"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path d="M8 8h6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M8 12h8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M8 16h5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
    // Architecture
    (
      <svg key="architecture" viewBox="0 0 24 24" fill="none" className="w-7 h-7" aria-hidden="true">
        <path
          d="M6 7a2 2 0 1 1 4 0a2 2 0 0 1-4 0Z"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path
          d="M14 6a2 2 0 1 1 4 0a2 2 0 0 1-4 0Z"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path
          d="M10 17a2 2 0 1 1 4 0a2 2 0 0 1-4 0Z"
          stroke="currentColor"
          strokeWidth="2.2"
        />
        <path
          d="M9.5 8.5l5-2"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M9.5 8.5l2.5 6.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M16 7.5l-2 7.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    ),
    // Agile
    (
      <svg key="agile" viewBox="0 0 24 24" fill="none" className="w-7 h-7" aria-hidden="true">
        <path
          d="M12 3a9 9 0 1 0 9 9"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path d="M12 7v6l4 2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M21 3v6h-6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
    // Release
    (
      <svg key="release" viewBox="0 0 24 24" fill="none" className="w-7 h-7" aria-hidden="true">
        <path
          d="M5 19l14-7-14-7v6l10 1-10 1v6Z"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      </svg>
    )
    ],
    []
  )

  const iconStyles = useMemo(
    () => [
      { color: 'text-cyan-500', glow: 'bg-cyan-400/35' },
      { color: 'text-fuchsia-500', glow: 'bg-fuchsia-400/35' },
      { color: 'text-yellow-500', glow: 'bg-yellow-300/40' },
      { color: 'text-emerald-500', glow: 'bg-emerald-400/35' }
    ],
    []
  )

  const steps = t.portfolio.steps
  const safeActiveStep = Math.min(Math.max(activeStep, 0), Math.max(steps.length - 1, 0))
  const currentStep = steps[safeActiveStep]
  const currentIconStyle = iconStyles[safeActiveStep] ?? iconStyles[0]
  const currentIcon = icons[safeActiveStep] ?? icons[0]

  const stepImages = useMemo(
    () => [
      '/method/step-1-strategy.webp',
      '/method/step-2-architecture.webp',
      '/method/step-3-agile.webp',
      '/method/step-4-release.webp'
    ],
    []
  )

  const currentImage = stepImages[safeActiveStep] ?? stepImages[0]

  // Preload method images so they are ready on first interaction
  const preloadImages = stepImages

  useEffect(() => {
    if (!isInView) return
    const el = tabRefs.current[safeActiveStep]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [safeActiveStep, isInView])

  useEffect(() => {
    setIsFlipped(false)
  }, [safeActiveStep])

  const toggleFlip = () => {
    setIsFlipped((prev) => !prev)
  }

  return (
    <section
      id="method"
      ref={ref}
      className="min-h-screen py-20 lg:py-32 bg-transparent"
    >
      <div className="container mx-auto px-4 sm:px-6 text-center">
        {/* Preload method images to avoid delayed loads on tab click */}
        <div className="sr-only" aria-hidden="true">
          {preloadImages.map((src) => (
            <img key={src} src={src} alt="" loading="eager" />
          ))}
        </div>

        <motion.h2 
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8"
        >
          <span className="bg-gradient-to-r from-blue-600 to-fuchsia-600 bg-clip-text text-transparent">
            {t.portfolio.title}
          </span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg sm:text-xl lg:text-2xl text-white mb-8 sm:mb-10 max-w-4xl mx-auto px-4 leading-relaxed text-justify italic drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)]"
        >
          {t.portfolio.intro}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="text-base sm:text-lg font-bold text-[#fff404] mb-6"
        >
          {t.portfolio.stepsHeading}
        </motion.p>
        
        <div className="max-w-6xl mx-auto">
          {/* Step selector (one card at a time) */}
          <div className="max-w-5xl mx-auto mb-8">
            <div className="border-b border-black/10">
              <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-8 overflow-x-auto sm:overflow-x-visible py-2 px-2 sm:px-0 snap-x snap-mandatory">
                {steps.map((step, index) => {
                  const isActive = index === safeActiveStep

                  return (
                    <button
                      key={step.title}
                      ref={(node) => {
                        tabRefs.current[index] = node
                      }}
                      type="button"
                      onClick={() => {
                        setActiveStep(index)
                        setIsFlipped(false)
                      }}
                      className={`relative whitespace-nowrap px-1 pb-3 text-xs sm:text-sm font-bold transition-colors duration-200 snap-start ${
                        isActive ? 'text-white' : 'text-white/80 hover:text-white'
                      }`}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      {step.title}
                      {isActive ? (
                        <span
                          className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500"
                          aria-hidden="true"
                        />
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Active card */}
          <motion.div
            key={currentStep?.title ?? safeActiveStep}
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="relative"
          >
            <div
              className="relative h-full cursor-pointer [perspective:1200px] outline-none focus:outline-none select-none [-webkit-tap-highlight-color:transparent]"
              role="button"
              tabIndex={0}
              onClick={toggleFlip}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') toggleFlip()
              }}
            >
              <div
                className={`relative grid transition-transform duration-700 [transform-style:preserve-3d] ${
                  isFlipped ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'
                }`}
              >
                {/* Front */}
                <div className="glass-light rounded-3xl p-6 sm:p-8 text-left [backface-visibility:hidden] [grid-area:1/1] outline-none">
                  <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6 sm:gap-8 items-start">
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="relative w-12 h-12 rounded-2xl bg-white/60 border border-black/5 flex items-center justify-center overflow-hidden">
                          <div className={`absolute -inset-3 blur-2xl ${currentIconStyle.glow}`} aria-hidden="true" />
                          <div className={`relative ${currentIconStyle.color}`}>{currentIcon}</div>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.65)]">{currentStep?.title}</h3>
                      </div>

                      <p className="text-white/90 leading-relaxed text-justify drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
                        <span className="font-semibold italic">{currentStep?.lead} </span>
                        <span>{currentStep?.body}</span>
                      </p>
                    </div>

                    {/* Visual panel */}
                    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/30 via-white/20 to-white/10 shadow-[0_25px_50px_rgba(0,0,0,0.18)]">
                      <div className={`absolute -inset-10 blur-3xl ${currentIconStyle.glow}`} aria-hidden="true" />
                      <div className="relative">
                        <img
                          src={currentImage}
                          alt={currentStep?.title ?? 'Method step'}
                          className="w-full h-auto object-cover rounded-3xl"
                          loading={safeActiveStep === 0 ? 'eager' : 'lazy'}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div className="glass-light rounded-3xl p-6 sm:p-8 text-left [backface-visibility:hidden] [transform:rotateY(180deg)] [grid-area:1/1] outline-none">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative w-12 h-12 rounded-2xl bg-white/60 border border-black/5 flex items-center justify-center overflow-hidden">
                      <div className={`absolute -inset-3 blur-2xl ${currentIconStyle.glow}`} aria-hidden="true" />
                      <div className={`relative ${currentIconStyle.color}`}>{currentIcon}</div>
                    </div>
                  </div>

                  <p className="text-white font-bold leading-relaxed text-justify drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]">
                    {(currentStep as any)?.backDescription ?? currentStep?.body}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-10 sm:mt-14 text-left"
          >
            <div className="rounded-3xl bg-gradient-to-r from-cyan-400/80 via-fuchsia-500/80 to-yellow-300/80 p-[1.5px] shadow-[0_16px_40px_rgba(18,115,197,0.22)]">
              <div className="glass-light rounded-3xl p-6 sm:p-8">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3">
                  {t.portfolio.whyTitle}
                </h3>
                <p className="text-slate-800 leading-relaxed text-justify">
                  <span className="font-bold">{t.portfolio.whyLead} </span>
                  <span>{t.portfolio.whyBody}</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}