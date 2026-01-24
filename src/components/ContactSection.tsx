'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { useTranslation } from '@/lib/LanguageContext'

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [hoveredButton, setHoveredButton] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const t = useTranslation()

  const contactTitleParts = t.contact.title.split(' ').filter(Boolean)
  const contactTitleLead = contactTitleParts.slice(0, 2).join(' ')
  const contactTitleTail = contactTitleParts.slice(2).join(' ')

  const whatsappMessage = encodeURIComponent(t.whatsapp.message)
  const whatsappUrl = `https://wa.me/393703603909?text=${whatsappMessage}`

  const focusForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => nameInputRef.current?.focus(), 350)
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    const form = e.currentTarget
    const formData = new FormData(form)

    const payload = {
      name: String(formData.get('name') || '').trim(),
      email: String(formData.get('email') || '').trim(),
      company: String(formData.get('company') || '').trim(),
      message: String(formData.get('message') || '').trim(),
      companyWebsite: String(formData.get('companyWebsite') || '').trim(),
    }

    if (!payload.name || !payload.email || !payload.message) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error('Request failed')

      form.reset()
      setSubmitStatus('success')
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={ref} className="min-h-screen bg-transparent py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 text-center">
        
        <motion.p 
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#fff404] text-stroke-black-sm mb-12 sm:mb-16 max-w-3xl mx-auto px-4"
        >
          {t.contact.description}
        </motion.p>
        
        <div className="max-w-6xl mx-auto px-4">
          
          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="glass-light rounded-3xl p-6 sm:p-8 md:p-12 max-w-4xl mx-auto"
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 sm:mb-8">
              {t.contact.cta.title}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <motion.button 
                className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-base"
                type="button"
                onHoverStart={() => setHoveredButton(0)}
                onHoverEnd={() => setHoveredButton(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={hoveredButton === 0 ? { y: -2 } : { y: 0 }}
                onClick={focusForm}
              >
                {t.contact.cta.consultation}
              </motion.button>
              
              <motion.a 
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full py-3 sm:py-4 text-sm sm:text-base bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600 flex items-center justify-center space-x-2"
                onHoverStart={() => setHoveredButton(1)}
                onHoverEnd={() => setHoveredButton(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={hoveredButton === 1 ? { y: -2 } : { y: 0 }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                </svg>
                <span>{t.contact.cta.whatsapp}</span>
              </motion.a>
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="text-gray-600 text-sm sm:text-base px-4"
            >
              {t.contact.cta.response}
            </motion.p>

            {/* Contact Form */}
            <div className="mt-10 text-left">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center">
                {t.contact.form.title}
              </h4>

              <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot */}
                <input
                  type="text"
                  name="companyWebsite"
                  aria-label="Company website (leave blank)"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-sm font-medium text-gray-800">{t.contact.form.name}</span>
                    <input
                      ref={nameInputRef}
                      name="name"
                      required
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white/60 backdrop-blur-sm px-4 py-3 text-gray-900 outline-none focus:border-black/30"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium text-gray-800">{t.contact.form.email}</span>
                    <input
                      name="email"
                      type="email"
                      required
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white/60 backdrop-blur-sm px-4 py-3 text-gray-900 outline-none focus:border-black/30"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-medium text-gray-800">{t.contact.form.company}</span>
                  <input
                    name="company"
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white/60 backdrop-blur-sm px-4 py-3 text-gray-900 outline-none focus:border-black/30"
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-800">{t.contact.form.message}</span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    className="mt-2 w-full resize-none rounded-xl border border-black/10 bg-white/60 backdrop-blur-sm px-4 py-3 text-gray-900 outline-none focus:border-black/30"
                  />
                </label>

                <div className="flex flex-col items-center gap-3">
                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t.contact.form.sending : t.contact.form.send}
                  </button>

                  {submitStatus === 'success' ? (
                    <p className="text-sm text-gray-700 text-center">{t.contact.form.success}</p>
                  ) : null}

                  {submitStatus === 'error' ? (
                    <p className="text-sm text-gray-700 text-center">{t.contact.form.error}</p>
                  ) : null}
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}