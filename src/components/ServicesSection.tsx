'use client'

import { motion, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from '@/lib/LanguageContext'
import OptimizedImage from '@/components/OptimizedImage'

const stats = [
  { value: '2–6', labelKey: 'services.stats.projects' },
  { value: '24h', labelKey: 'services.stats.clients' },
  { value: '1', labelKey: 'services.stats.experience' },
  { value: '100%', labelKey: 'services.stats.satisfaction' }
]

export default function ServicesSection() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set())
  const [activeService, setActiveService] = useState(0)
  const t = useTranslation()

  type ServiceCard = {
    title: string
    bullets: string[]
    price?: string
    backDescription?: string
    imageSrc?: string
    imageAlt?: string
  }

  const services: ServiceCard[] = [
    {
      ...t.services.ecommerce,
      imageSrc: '/e-commerce.webp',
      imageAlt: 'e-commerce'
    },
    {
      ...(t.services as any).design,
      imageSrc: '/UXUI.webp',
      imageAlt: 'UI/UX'
    },
    {
      ...(t.services as any).aiAssistants,
      imageSrc: '/AI.webp',
      imageAlt: 'AI'
    },
    {
      ...(t.services as any).operations,
      imageSrc: '/ERP.webp',
      imageAlt: 'ERP'
    },
    {
      ...(t.services as any).marketing,
      imageSrc: '/marketing.webp',
      imageAlt: 'Marketing'
    },
    {
      ...(t.services as any).consulting,
      imageSrc: '/1H.webp',
      imageAlt: 'Consulting'
    },
    {
      ...(t.services as any).iot,
      imageSrc: '/IOT.webp',
      imageAlt: 'IoT'
    }
  ].filter(Boolean)

  const safeActiveService = Math.min(Math.max(activeService, 0), Math.max(services.length - 1, 0))
  const service = services[safeActiveService]

  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    if (!isInView) return
    const el = tabRefs.current[safeActiveService]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
    }
  }, [safeActiveService, isInView])

  const toggleFlip = (index: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <section
      id="services"
      ref={ref}
      className="py-20 lg:py-32 bg-transparent relative overflow-hidden"
    >
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-16 lg:mb-24"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1fdefe] mb-6 leading-tight">
            {t.services.title}
          </h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl lg:text-2xl text-white/80 max-w-4xl mx-auto leading-relaxed"
          >
            {t.services.subtitle}
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
              <div className="text-3xl md:text-4xl font-bold text-[#1fdefe] mb-2">{stat.value}</div>
              <div className="text-sm md:text-base text-white/70">
                {stat.labelKey.split('.').reduce((obj, key) => obj?.[key], t as any)}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Services Menu (same style as Method) */}
        <div className="max-w-5xl mx-auto mb-10">
          <div className="border-b border-white/15">
            <div className="flex md:flex-wrap items-center justify-start md:justify-center gap-6 sm:gap-8 overflow-x-auto md:overflow-x-visible py-2 px-2 sm:px-0 snap-x snap-mandatory">
              {services.map((s, index) => {
                const isActive = index === safeActiveService

                return (
                  <button
                    key={`${s.title}-${index}`}
                    ref={(node) => {
                      tabRefs.current[index] = node
                    }}
                    type="button"
                    onClick={() => {
                      setActiveService(index)
                      setHoveredCard(null)
                    }}
                    className={`relative whitespace-nowrap px-1 pb-3 text-xs sm:text-sm font-bold transition-colors duration-200 snap-start ${
                      isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    {s.title}
                    {isActive ? (
                      <span
                        className="absolute left-0 right-0 -bottom-[1px] h-[3px] rounded-full bg-gradient-to-r from-[#1fdefe] to-[#ff45a9]"
                        aria-hidden="true"
                      />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Active Service Card (flip to show details + contact CTA) */}
        {service ? (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="max-w-3xl mx-auto"
            onHoverStart={() => setHoveredCard(safeActiveService)}
            onHoverEnd={() => setHoveredCard(null)}
          >
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="relative h-full cursor-pointer [perspective:1200px]"
              role="button"
              tabIndex={0}
              onClick={() => toggleFlip(safeActiveService)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') toggleFlip(safeActiveService)
              }}
            >
              <div
                className={`relative z-10 grid transition-transform duration-700 [transform-style:preserve-3d] ${
                  flippedCards.has(safeActiveService) ? '[transform:rotateY(180deg)]' : '[transform:rotateY(0deg)]'
                }`}
              >
                {/* Front */}
                <div className="glass rounded-3xl p-6 sm:p-7 overflow-hidden flex flex-col relative [backface-visibility:hidden] [grid-area:1/1]">
                  {/* Subtle hover glow */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  >
                    <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#ff45a9]/20 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#ff45a9]/15 blur-3xl" />
                  </motion.div>

                  {/* Icon */}
                  {service.imageSrc ? (
                    <div className="relative z-10 mb-0 flex justify-center">
                      <OptimizedImage
                        src={service.imageSrc}
                        alt={service.imageAlt ?? service.title}
                        width={420}
                        height={420}
                        className="w-64 h-64 sm:w-80 sm:h-80 md:w-[420px] md:h-[420px]"
                        priority={false}
                        quality={80}
                      />
                    </div>
                  ) : null}

                  {/* Service Title */}
                  <motion.div
                    className="mb-4 sm:mb-5 -mt-24 sm:-mt-32 md:-mt-36 text-center relative z-10"
                    animate={hoveredCard === safeActiveService ? { scale: 1.03 } : { scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    <h3 className="text-xl md:text-2xl font-bold text-[#1fdefe] tracking-wide leading-none">
                      {service.title}
                    </h3>
                  </motion.div>

                  {/* Service Content */}
                  <div className="flex-1 relative z-10">
                    <div className="space-y-1.5">
                      {service.bullets.slice(0, 4).map((bullet, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 6 }}
                          animate={isInView ? { opacity: 1, y: 0 } : {}}
                          transition={{ duration: 0.35, delay: 0.2 + idx * 0.05 }}
                          className="text-base text-white/80 flex items-start text-justify"
                        >
                          <span className="text-white/60 mr-2 mt-[3px]">•</span>
                          <span className="leading-snug">{bullet}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/20 transition-all duration-300"
                    initial={false}
                  />
                </div>

                {/* Back */}
                <div className="glass rounded-3xl p-6 sm:p-8 overflow-hidden flex flex-col items-center justify-center text-center relative [backface-visibility:hidden] [transform:rotateY(180deg)] [grid-area:1/1]">
                  {/* Subtle hover glow */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  >
                    <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#ff45a9]/20 blur-3xl" />
                    <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#ff45a9]/15 blur-3xl" />
                  </motion.div>

                  <div className="relative z-10 max-w-xl">
                    <p className="text-[#ff45a9] font-bold text-base sm:text-lg leading-relaxed text-justify">
                      {service.backDescription ?? ''}
                    </p>

                    <div className="mt-6 flex items-center justify-center">
                      <a
                        href={`mailto:info@metis-tech.it?subject=${encodeURIComponent(`Richiesta: ${service.title}`)}`}
                        className="btn-primary"
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                      >
                        {(t.services as any).contactCta ?? 'Contattaci'}
                      </a>
                    </div>
                  </div>

                  {/* Hover Effect Border */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-white/20 transition-all duration-300"
                    initial={false}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}

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