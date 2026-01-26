'use client'

import { useEffect, useMemo, useState } from 'react'
import { CONSENT_EVENT, OPEN_CONSENT_EVENT, loadConsent, notifyConsent, saveConsent, type ConsentPreferences } from '@/lib/consent'

const defaultPrefs: ConsentPreferences = {
  necessary: true,
  analytics: false,
}

export default function CookieConsent() {
  const [showPanel, setShowPanel] = useState(false)
  const [prefs, setPrefs] = useState<ConsentPreferences>(defaultPrefs)
  const [hasStored, setHasStored] = useState(false)

  useEffect(() => {
    const stored = loadConsent()
    if (stored) {
      setPrefs(stored)
      setHasStored(true)
      setShowPanel(false)
    } else {
      setShowPanel(true)
    }

    const openHandler = () => setShowPanel(true)
    window.addEventListener(OPEN_CONSENT_EVENT, openHandler)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, openHandler)
  }, [])

  const saveAndClose = (next: ConsentPreferences) => {
    setPrefs(next)
    saveConsent(next)
    notifyConsent(next)
    setHasStored(true)
    setShowPanel(false)
  }

  const acceptAll = () => saveAndClose({ necessary: true, analytics: true })
  const rejectNonEssential = () => saveAndClose({ necessary: true, analytics: false })
  const saveCustom = () => saveAndClose(prefs)

  const toggleAnalytics = () => setPrefs((prev) => ({ ...prev, analytics: !prev.analytics }))

  const badgeLabel = useMemo(() => (hasStored ? 'Preferenze cookie' : 'Gestisci cookie'), [hasStored])

  return (
    <>
      {/* Floating manage badge */}
      <button
        type="button"
        className="fixed left-4 bottom-4 z-[60] rounded-full bg-white/20 backdrop-blur-xl border border-white/30 px-4 py-2 text-sm text-white shadow-lg hover:bg-white/30 transition-colors"
        onClick={() => setShowPanel(true)}
      >
        {badgeLabel}
      </button>

      {/* Consent panel */}
      {showPanel ? (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center px-4 py-6 bg-black/30 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#0f172a]/90 via-[#111827]/90 to-[#0b1220]/90 text-white shadow-2xl">
            <div className="absolute -inset-24 bg-gradient-to-r from-cyan-500/20 via-fuchsia-500/15 to-amber-400/10 blur-3xl" aria-hidden="true" />
            <div className="relative p-6 sm:p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                  <h3 className="text-2xl font-bold">Cookie & Privacy</h3>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Usiamo cookie tecnici necessari e, solo con il tuo consenso, cookie di analisi per migliorare l’esperienza. Puoi modificare le preferenze in qualsiasi momento.
                  </p>
                  <div className="text-xs text-white/70">
                    Consulta la <a href="/privacy" className="underline underline-offset-4 hover:text-white">Privacy Policy</a> o la
                    {' '}
                    <a href="/cookie-preferences" className="underline underline-offset-4 hover:text-white">pagina preferenze cookie</a>.
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Cookie necessari</p>
                      <p className="text-xs text-white/70">Sempre attivi per sicurezza e funzionalità base.</p>
                    </div>
                    <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full">Attivi</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/5 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Analytics</p>
                      <p className="text-xs text-white/70">Dati anonimi per capire come viene usato il sito.</p>
                    </div>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={prefs.analytics}
                        onChange={toggleAnalytics}
                        aria-label="Abilita cookie analytics"
                      />
                      <span className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${prefs.analytics ? 'bg-cyan-400' : 'bg-white/30'}`}>
                        <span className={`bg-white w-4 h-4 rounded-full shadow transition-transform ${prefs.analytics ? 'translate-x-5' : 'translate-x-0'}`} />
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-2">
                <button
                  type="button"
                  onClick={rejectNonEssential}
                  className="w-full sm:w-auto rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15 transition-colors"
                >
                  Rifiuta non essenziali
                </button>
                <button
                  type="button"
                  onClick={acceptAll}
                  className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:brightness-105 transition-all"
                >
                  Accetta tutti
                </button>
                <button
                  type="button"
                  onClick={saveCustom}
                  className="w-full sm:w-auto rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold hover:bg-white/15 transition-colors"
                >
                  Salva preferenze
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
