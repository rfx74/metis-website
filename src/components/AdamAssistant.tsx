'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { loadConsent, subscribeToConsent } from '@/lib/consent'

const OPEN_ADAM_EVENT = 'metis-open-adam'
const DISABLE_KEY = 'adam-disabled'
const SEEN_KEY = 'adam-seen'

type Message = {
  id: string
  from: 'adam' | 'user'
  text: string
}

const welcomeMessage = `Ciao! Sono ADAM, il tuo assistente 24/7. Ti spiego i servizi Metis (e-commerce, AI, ERP/automazioni, design, marketing, IoT), il metodo in 4 step e ti porto alle sezioni giuste. Se vuoi disattivarmi clicca “Disattiva ADAM”.`

const quickTips = [
  'Cerchi un servizio? Posso consigliarti e portarti alla card corretta.',
  'Vuoi capire il Metodo Metis in 4 step? Te lo riassumo e ti ci porto.',
  'Se ti serve un preventivo rapido ti dico come contattarci subito (email o WhatsApp).'
]

const knowledgeBase = [
  {
    keywords: ['ecommerce', 'e-commerce', 'shop', 'vendere online', 'store'],
    response:
      'E-commerce su misura: UX + checkout che converte, pagamenti/spedizioni/promo e integrazioni ERP/CRM. Posso portarti alla card “Soluzioni e-commerce personalizzata” nei Servizi.'
  },
  {
    keywords: ['ai', 'chatbot', 'intelligenza artificiale', 'assistente', 'assistenti'],
    response:
      'AI & chatbot: risposte su FAQ/catalogo, copilot per offerte/email, triage ticket con handoff umano. Vuoi vedere la card “AI Assistenti” o un esempio pratico?'
  },
  {
    keywords: ['erp', 'automazioni', 'processi', 'magazzino', 'flussi'],
    response:
      'ERP + automazioni: ordini→magazzino→fatture, ruoli/permessi, integrazioni tra reparti e report. Ti porto alla card “ERP & Automazioni”?'
  },
  {
    keywords: ['ux', 'ui', 'design', 'interfaccia', 'prototipo'],
    response:
      'UI/UX & product design: flow + prototipo cliccabile, design system e handoff pulito a sviluppo. Vuoi aprire la card “UI/UX + Responsive Design”?'
  },
  {
    keywords: ['marketing', 'seo', 'ads', 'meta', 'google'],
    response:
      'Marketing: SEO + Ads, landing con CRO, tracking pulito (pixel/eventi/UTM) e nurturing. Posso portarti alla card “Marketing”.'
  },
  {
    keywords: ['consulenza', 'call', 'ora', '1h', 'review'],
    response:
      '1H Consulting: una call mirata per roadmap, priorità e decisioni rapide con piano d’azione chiaro. Vuoi prenotarla da Contatti?'
  },
  {
    keywords: ['iot', 'device', 'sensor', 'sensore'],
    response:
      'IoT su misura: backend/API, device management, sicurezza, dati real‑time e alert pronti per dashboard/automazioni. Ti porto alla card “Soluzioni IoT personalizzate”?'
  },
  {
    keywords: ['defi', 'token', 'tokenizzazione', 'web3'],
    response:
      'DeFi e tokenizzazione: architetture compliant per asset reali e integrazione web3 nel business. Vuoi parlarne ora?'
  },
  {
    keywords: ['metodo', 'processo', 'portfolio', 'come lavorate', 'step'],
    response:
      'Metodo Metis in 4 step: 1) Analisi strategica, 2) Architettura, 3) Sviluppo agile, 4) Rilascio e miglioramento. Posso portarti alla sezione Metodo per i dettagli.'
  },
  {
    keywords: ['preventivo', 'prezzo', 'costo', 'quanto'],
    response:
      'Per un preventivo rapido: scrivici da Contatti (email) oppure clicca WhatsApp in basso a destra. Rispondiamo entro 24h con priorità + stima.'
  },
  {
    keywords: ['contatto', 'contattare', 'whatsapp', 'telefono', 'chiamare'],
    response:
      'Puoi scriverci dal form Contatti o su WhatsApp Business (risposta entro 24h). Vuoi che ti apra la sezione Contatti?'
  },
  {
    keywords: ['privacy', 'cookie', 'gdpr'],
    response:
      'Privacy e cookie: trovi Privacy Policy e Preferenze cookie nel footer. Posso aprirti subito la pagina dedicata.'
  }
]

function getReply(input: string) {
  const text = input.toLowerCase()

  const mentionsEcommerce = ['ecommerce', 'e-commerce', 'shop', 'vendere online', 'store'].some((k) => text.includes(k))
  const mentionsAi = ['ai', 'chatbot', 'assistente', 'assistenti', 'intelligenza artificiale'].some((k) => text.includes(k))

  if (mentionsEcommerce && mentionsAi) {
    return 'Per vendita online + assistente 24/7 ti consiglio due servizi insieme: 1) “Soluzioni e-commerce personalizzata” per UX/checkout + integrazioni, 2) “AI Assistenti” per chatbot/hand-off umano. Posso aprirti la sezione Servizi e mostrarti entrambe le card?'
  }

  const matched = knowledgeBase.find((topic) =>
    topic.keywords.some((keyword) => text.includes(keyword))
  )
  if (matched) return matched.response

  if (text.includes('servizio') || text.includes('servizi') || text.includes('cosa fate')) {
    return 'Panoramica rapida: e-commerce su misura, AI/chatbot, ERP & automazioni, UI/UX design, marketing, IoT e consulenza 1H. Dimmi l’area che ti interessa e ti porto alla card o ti spiego come lavoriamo su quel tema.'
  }

  return 'Posso fare tre cose rapide: 1) suggerirti il servizio giusto (e-commerce, AI, ERP/automazioni, marketing, UI/UX, IoT), 2) riassumerti il Metodo in 4 step, 3) aprirti Contatti o WhatsApp per un preventivo in 24h. Cosa vuoi che faccia adesso?'
}

export default function AdamAssistant() {
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [seen, setSeen] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const messagesRef = useRef<Message[]>([])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedDisabled = window.localStorage.getItem(DISABLE_KEY) === '1'
    setDisabled(storedDisabled)

    const storedSeen = window.localStorage.getItem(SEEN_KEY) === '1'
    setSeen(storedSeen)

    const consent = loadConsent()
    if (consent && !storedSeen && !storedDisabled) {
      setOpen(true)
      setMessages([{ id: 'welcome', from: 'adam', text: welcomeMessage }])
      window.localStorage.setItem(SEEN_KEY, '1')
      setSeen(true)
    }

    const unsubscribe = subscribeToConsent(() => {
      if (!storedDisabled && !storedSeen) {
        setOpen(true)
        setMessages([{ id: 'welcome', from: 'adam', text: welcomeMessage }])
        window.localStorage.setItem(SEEN_KEY, '1')
        setSeen(true)
      }
    })

    const openHandler = () => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DISABLE_KEY, '0')
      }
      setDisabled(false)
      setOpen(true)
      if (!messagesRef.current.length) {
        setMessages([{ id: 'welcome', from: 'adam', text: welcomeMessage }])
      }
    }
    window.addEventListener(OPEN_ADAM_EVENT, openHandler)

    return () => {
      unsubscribe()
      window.removeEventListener(OPEN_ADAM_EVENT, openHandler)
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const sendMessage = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      from: 'user',
      text: trimmed,
    }

    const reply: Message = {
      id: `${Date.now()}-adam`,
      from: 'adam',
      text: getReply(trimmed),
    }

    setMessages((prev) => [...prev, userMessage, reply])
    setInput('')
  }

  const quickActions = useMemo(
    () => [
      { label: 'Vai ai Servizi', target: 'services' },
      { label: 'Metodo Metis', target: 'method' },
      { label: 'Chi siamo', target: 'about' },
      { label: 'Contatti', target: 'contact' },
    ],
    []
  )

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (!element) return
    element.scrollIntoView({ behavior: 'smooth' })
  }

  const disableAssistant = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(DISABLE_KEY, '1')
    }
    setDisabled(true)
    setOpen(false)
  }

  if (disabled) return null

  return (
    <>
      {!open && (
        <button
          type="button"
          className="flex fixed right-4 bottom-24 z-[60] items-center gap-3 rounded-full border border-white/15 bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/20 px-3.5 py-2 text-xs text-white/90 backdrop-blur-lg shadow-[0_12px_40px_rgba(56,189,248,0.25)] hover:brightness-110 transition-all"
          onClick={() => setOpen(true)}
        >
          <span className="relative h-9 w-9 rounded-2xl bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-indigo-500 p-[2px] shadow-[0_10px_30px_rgba(56,189,248,0.35)]">
            <span className="absolute -right-[6px] -bottom-[6px] h-3.5 w-3.5 rounded-full bg-emerald-400 border border-[#0b1220] shadow" title="Online" />
            <span className="relative flex h-full w-full items-center justify-center rounded-[14px] bg-[#0b1220] text-sm font-semibold tracking-[0.22em] text-white">
              A
            </span>
          </span>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-[11px] uppercase tracking-[0.22em] text-white/60">Assistente</span>
            <span className="text-sm font-semibold text-white">ADAM 24/7</span>
          </div>
        </button>
      )}

      {open && (
        <div className="fixed right-4 bottom-24 z-[70] w-[min(92vw,390px)] max-h-[78vh] rounded-[28px] border border-white/15 bg-gradient-to-br from-[#0b1220]/95 via-[#111827]/95 to-[#0f172a]/95 text-white shadow-[0_24px_80px_rgba(15,23,42,0.65)] backdrop-blur-xl overflow-hidden flex flex-col">
          <div className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-cyan-500/20 blur-3xl" aria-hidden="true" />
          <div className="absolute -bottom-28 -left-24 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl" aria-hidden="true" />
          <div className="relative px-5 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#0b1220]/90 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/70 via-fuchsia-500/60 to-amber-300/40 blur-xl opacity-80" aria-hidden="true" />
                <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-indigo-500 p-[2px] shadow-[0_12px_40px_rgba(56,189,248,0.35)]">
                  <div className="h-full w-full rounded-full bg-[#0b1220] flex items-center justify-center text-lg">
                    <span className="animate-pulse">🙂</span>
                  </div>
                </div>
                <span className="absolute -right-1 -bottom-1 h-4 w-4 rounded-full bg-emerald-400 border border-[#0b1220] shadow" title="Online" />
              </div>
              <div>
                <h3 className="text-lg font-semibold leading-tight">ADAM</h3>
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">Assistente 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-white/70 hover:text-white"
              >
                Minimizza
              </button>
              <button
                type="button"
                onClick={disableAssistant}
                className="text-xs text-white/70 hover:text-white"
              >
                Disattiva
              </button>
            </div>
          </div>

          <div className="px-5 py-4 space-y-3 text-sm flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="space-y-3 text-white/80">
                <p>{welcomeMessage}</p>
                {quickTips.map((tip) => (
                  <p key={tip} className="text-white/70">• {tip}</p>
                ))}
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-2xl px-3 py-2 shadow-sm ${message.from === 'adam' ? 'bg-white/10 text-white border border-white/10' : 'bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/20 text-white text-right'}`}
                >
                  {message.text}
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-5 pb-4 space-y-3 border-t border-white/10 bg-[#0b1220]/85">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.target}
                  type="button"
                  onClick={() => scrollToSection(action.target)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {action.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') sendMessage()
                }}
                placeholder="Chiedi ad ADAM..."
                className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-cyan-400/40"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-md hover:brightness-110 transition-all"
              >
                Invia
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
