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

const welcomeMessage = `Ciao! Sono ADAM, il tuo assistente 24/7. Ti spiego i servizi Metis (e-commerce, AI, ERP/automazioni, design, marketing, IoT), il metodo in 4 step e ti porto alle sezioni giuste. Se vuoi disattivarmi clicca "Disattiva ADAM".`

const quickTips = [
  'Cerchi un servizio? Posso consigliarti e portarti alla card corretta.',
  'Vuoi capire il Metodo Metis in 4 step? Te lo riassumo e ti ci porto.',
  'Se ti serve un preventivo rapido ti dico come contattarci subito (email o WhatsApp).'
]

const knowledgeBase = [
  {
    keywords: ['ecommerce', 'e-commerce', 'shop', 'vendere online', 'store'],
    response:
      'E-commerce su misura: UX + checkout che converte, pagamenti/spedizioni/promo e integrazioni ERP/CRM. Posso portarti alla card "Soluzioni e-commerce personalizzata" nei Servizi.'
  },
  {
    keywords: ['ai', 'chatbot', 'intelligenza artificiale', 'assistente', 'assistenti'],
    response:
      'AI & chatbot: risposte su FAQ/catalogo, copilot per offerte/email, triage ticket con handoff umano. Vuoi vedere la card "AI Assistenti" o un esempio pratico?'
  },
  {
    keywords: ['erp', 'automazioni', 'processi', 'magazzino', 'flussi'],
    response:
      'ERP + automazioni: ordini→magazzino→fatture, ruoli/permessi, integrazioni tra reparti e report. Ti porto alla card "ERP & Automazioni"?'
  },
  {
    keywords: ['ux', 'ui', 'design', 'interfaccia', 'prototipo'],
    response:
      'UI/UX & product design: flow + prototipo cliccabile, design system e handoff pulito a sviluppo. Vuoi aprire la card "UI/UX + Responsive Design"?'
  },
  {
    keywords: ['marketing', 'seo', 'ads', 'meta', 'google'],
    response:
      'Marketing: SEO + Ads, landing con CRO, tracking pulito (pixel/eventi/UTM) e nurturing. Posso portarti alla card "Marketing".'
  },
  {
    keywords: ['consulenza', 'call', 'ora', '1h', 'review'],
    response:
      '1H Consulting: una call mirata per roadmap, priorità e decisioni rapide con piano d\'azione chiaro. Vuoi prenotarla da Contatti?'
  },
  {
    keywords: ['iot', 'device', 'sensor', 'sensore'],
    response:
      'IoT su misura: backend/API, device management, sicurezza, dati real‑time e alert pronti per dashboard/automazioni. Ti porto alla card "Soluzioni IoT personalizzate"?'
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

  // Check for explanation requests first
  if (text.includes('come funziona') || text.includes('spiegami') || text.includes('come lavora') || text.includes('perché')) {
    if (text.includes('e-commerce') || text.includes('vendere online') || text.includes('shop')) {
      return `E-commerce: Creiamo siti di vendita con UX che converte, checkout ottimizzato, gestione pagamenti, spedizioni e promo. Si integra col tuo gestionale (ERP) per sincronizzare catalogo, ordini e inventario in tempo reale. ROI: meno errori manali, più vendite.`
    }
    if (text.includes('ai') || text.includes('assistente') || text.includes('chatbot')) {
      return `AI Assistenti: Chatbot 24/7 che risponde ai clienti su FAQ, catalogo, preventivi. Usa AI generativa per suggerire offerte, rispondere email, triaging ticket. Se la domanda è complessa, passa a un umano. Vantaggio: meno carico sul team, clienti happy 24/7.`
    }
    if (text.includes('erp') || text.includes('gestionale') || text.includes('contabilità') || text.includes('magazzino')) {
      return `ERP & Automazioni: Organizziamo processi (ordini→magazzino→fatture→contabilità) in un'unica piattaforma. Ruoli e permessi, approvazioni automatiche, integrazioni con banca/fornitori. Risultato: trasparenza, zero errori, decisioni basate su dati reali.`
    }
    return `Posso spiegare ogni servizio. Dimmi quale ti interessa (e-commerce, AI, ERP, design, marketing, IoT) e ti dettaglio come funziona e il perché fa la differenza.`
  }

  // Detect complex scenarios (e.g., "vendita online + gestionale + assistente")
  const hasEcommerce = ['ecommerce', 'e-commerce', 'shop', 'vendere online', 'store', 'vendita online'].some((k) => text.includes(k))
  const hasERP = ['erp', 'gestionale', 'contabilità', 'magazzino', 'processi'].some((k) => text.includes(k))
  const hasAI = ['ai', 'chatbot', 'assistente', 'intelligenza artificiale'].some((k) => text.includes(k))

  // Smart combo detection for complex requests
  if ((hasEcommerce && hasERP && hasAI) || (text.includes('integrato') && (hasEcommerce || hasERP) && hasAI)) {
    return `Perfetto! Per un sito di vendita integrato al gestionale + assistente ti consiglio questa combo:\n\n1) *E-commerce personalizzato*: Sito con UX che vende, checkout sicuro, pagamenti, spedizioni integrate\n2) *ERP & Automazioni*: Il cuore - sincronizza ordini dal sito al gestionale, aggiorna catalogo e inventario in tempo reale\n3) *AI Assistenti*: Chatbot 24/7 che risponde su prodotti, assistenza pre/post-vendita, riduce carico team\n\nCome funziona assieme: Cliente compra → sito invia ordine a ERP → chatbot offre supporto 24/7 → team interno vede tutto sincronizzato.\n\nVuoi che ti apra la sezione Servizi per i dettagli?`
  }

  const serviceMatches: { name: string; label: string; desc: string }[] = []

  if (hasEcommerce) {
    serviceMatches.push({ name: 'ecommerce', label: 'Soluzioni e-commerce personalizzata', desc: 'UX + checkout che converte, pagamenti, spedizioni, integrazioni ERP/CRM.' })
  }
  if (hasAI) {
    serviceMatches.push({ name: 'ai', label: 'AI Assistenti', desc: 'Chatbot 24/7 su FAQ/catalogo, copilot per offerte/email, triage ticket.' })
  }
  if (hasERP) {
    serviceMatches.push({ name: 'erp', label: 'ERP & Automazioni', desc: 'Ordini→magazzino→fatture, ruoli/permessi, integrazioni tra reparti.' })
  }
  if (['ux', 'ui', 'design', 'interfaccia', 'prototipo'].some((k) => text.includes(k))) {
    serviceMatches.push({ name: 'design', label: 'UI/UX + Responsive Design', desc: 'Flow + prototipo cliccabile, design system, handoff a sviluppo.' })
  }
  if (['marketing', 'seo', 'ads', 'meta', 'google'].some((k) => text.includes(k))) {
    serviceMatches.push({ name: 'marketing', label: 'Marketing', desc: 'SEO + Ads, landing con CRO, tracking pulito, lead nurturing.' })
  }
  if (['iot', 'device', 'sensor', 'sensore'].some((k) => text.includes(k))) {
    serviceMatches.push({ name: 'iot', label: 'IoT personalizzate', desc: 'Backend/API, device management, dati real-time, alert.' })
  }
  if (['consulenza', 'call', 'ora', '1h', 'review'].some((k) => text.includes(k))) {
    serviceMatches.push({ name: 'consulting', label: '1H Consulting', desc: 'Una call mirata per roadmap, priorità e decisioni rapide.' })
  }

  if (serviceMatches.length >= 2) {
    const list = serviceMatches.map((s, i) => `${i + 1}) ${s.label}\n   ${s.desc}`).join('\n')
    return `Perfetto! Ti consiglio questi ${serviceMatches.length} servizi insieme:\n\n${list}\n\nVuoi che ti apra la sezione Servizi?`
  }

  // Knowledge base for single-service queries
  const matched = knowledgeBase.find((topic) =>
    topic.keywords.some((keyword) => text.includes(keyword))
  )
  if (matched) return matched.response

  if (text.includes('suggeriscimi') || text.includes('consigliami') || text.includes('quali sono') || text.includes('che cosa') || text.includes('servizio') || text.includes('servizi')) {
    return `Ecco i 7 servizi Metis:\n\n1) E-commerce: UX+checkout, pagamenti, integrazioni\n2) AI Assistenti: Chatbot 24/7 su FAQ/catalogo\n3) ERP & Automazioni: Processi end-to-end\n4) UI/UX Design: Prototipi e design system\n5) Marketing: SEO+Ads, landing, tracking\n6) IoT: Backend, device management, dati real-time\n7) 1H Consulting: Review e roadmap\n\nCerchi uno in particolare?`
  }

  return 'Dimmi quale servizio cerchi (e-commerce, AI, ERP, design, marketing, IoT) o una domanda specifica. Sono qui per aiutarti! 🤖'
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
            <span className="relative flex h-full w-full items-center justify-center rounded-[14px] bg-[#0b1220]">
              <svg className="w-5 h-5 text-cyan-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="6" r="1" />
                <circle cx="9" cy="6" r="1" />
                <circle cx="15" cy="6" r="1" />
                <path d="M12 1 L13 4 L11 4 Z" fill="currentColor" />
                <rect x="7" y="8" width="10" height="6" rx="1" fill="currentColor" opacity="0.7" />
                <rect x="8" y="10" width="2" height="2" fill="#0b1220" />
                <rect x="14" y="10" width="2" height="2" fill="#0b1220" />
              </svg>
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
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between sticky top-0 z-10 bg-[#0b1220]/90 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/70 via-fuchsia-500/60 to-amber-300/40 blur-xl opacity-80" aria-hidden="true" />
                <div className="relative h-12 w-12 rounded-full bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-indigo-500 p-[2px] shadow-[0_12px_40px_rgba(56,189,248,0.35)]">
                  <div className="h-full w-full rounded-full bg-[#0b1220] flex items-center justify-center">
                    <svg className="w-6 h-6 text-cyan-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="12" cy="8" r="1.5" />
                      <circle cx="9" cy="8" r="1.5" />
                      <circle cx="15" cy="8" r="1.5" />
                      <path d="M12 2 L14 6 L10 6 Z" fill="currentColor" />
                      <rect x="7" y="10" width="10" height="7" rx="1" fill="currentColor" opacity="0.7" />
                      <rect x="8" y="12" width="2" height="3" fill="#0b1220" />
                      <rect x="14" y="12" width="2" height="3" fill="#0b1220" />
                      <path d="M9 18 L10 20 M12 18 L12 20 M15 18 L14 20" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
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

          <div className="px-5 py-4 space-y-3 text-sm flex-1 min-h-0 overflow-y-auto">
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
                  className={`rounded-2xl px-4 py-3 shadow-sm break-words ${message.from === 'adam' ? 'bg-white/10 text-white border border-white/10 whitespace-pre-wrap' : 'bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/20 text-white text-right'}`}
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
