'use client'

import { useTranslation } from '@/lib/LanguageContext'

export default function Footer() {
  const t = useTranslation()
  const year = new Date().getFullYear()

  const whatsappMessage = encodeURIComponent(t.whatsapp.message)
  const whatsappUrl = `https://wa.me/393703603909?text=${whatsappMessage}`

  return (
    <footer className="relative bg-transparent">
      <div className="container mx-auto px-6 py-14">
        <div className="glass-light rounded-3xl p-8 sm:p-10 text-center">
          <div className="flex flex-col items-center gap-10">
            <div className="max-w-xl flex flex-col items-center">
              <div className="flex items-center justify-center gap-3">
                <div className="metis-wordmark" aria-label="Metis">
                  <img
                    className="metis-wordmark__fallback"
                    src="/logo-solo-scritta.png"
                    alt="Metis"
                    loading="lazy"
                  />
                  <div className="metis-wordmark__gradient" aria-hidden="true" />
                </div>
              </div>

              <div className="mt-4 text-gray-800 italic font-medium tracking-[0.08em]">
                Innovative IT Solutions
              </div>
            </div>

            <div className="rounded-2xl border border-black/10 bg-white/40 backdrop-blur-xl p-6 w-full max-w-[420px]">
              <div className="space-y-3 text-gray-700">
                <div className="text-sm sm:text-base">
                  <div className="font-semibold text-gray-900">{t.contact.info.company}</div>
                </div>

                <div className="flex flex-col items-center gap-2">
                  <a className="hover:text-gray-900 transition-colors" href="mailto:info@metis-tech.it">
                    info@metis-tech.it
                  </a>
                  <a className="hover:text-gray-900 transition-colors" href="tel:+393703603909">
                    +39 370 360 3909
                  </a>
                  <a
                    className="hover:text-gray-900 transition-colors"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.contact.info.whatsapp}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-10 h-px bg-black/10" />

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-600">
            <span>© {year} Metis Srl</span>
            <span className="hidden sm:inline">•</span>
            <a className="hover:text-gray-900 transition-colors" href="/privacy">
              Privacy Policy
            </a>
            <span className="hidden sm:inline">•</span>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('metis-open-consent'))
                }
              }}
              className="underline underline-offset-4 hover:text-gray-900"
            >
              Preferenze cookie
            </button>
            <span className="hidden sm:inline">•</span>
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.dispatchEvent(new Event('metis-open-adam'))
                }
              }}
              className="underline underline-offset-4 hover:text-gray-900"
            >
              Apri ADAM
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
