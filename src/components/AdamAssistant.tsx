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

const welcomeMessage = `Ciao! Sono ADAM, il tuo assistente 24/7. Posso aiutarti a capire i servizi Metis e suggerirti dove cliccare (card, sezioni, metodo). Se vuoi disattivarmi, usa il pulsante “Disattiva ADAM” qui sotto: sparirò e non sarò invasivo.`

const quickTips = [
  'Vuoi una panoramica rapida dei servizi?',
  'Posso guidarti nelle card “Servizi” o “Metodo”.',
  'Se cerchi un preventivo, ti dico come contattarci subito.'
]

function getReply(input: string) {
  const text = input.toLowerCase()

  if (text.includes('prezzo') || text.includes('preventivo') || text.includes('costo')) {
    return 'Per un preventivo veloce: vai su “Contatti” e scrivici due righe, oppure clicca WhatsApp. Ti rispondiamo entro 24h.'
  }
  if (text.includes('ecommerce') || text.includes('e-commerce')) {
    return 'E-commerce su misura: UX + checkout che converte, pagamenti, spedizioni, promo e integrazioni ERP/CRM. Vuoi che ti porti alla card E-commerce nei Servizi?'
  }
  if (text.includes('chatbot') || text.includes('ai') || text.includes('intelligenza artificiale')) {
    return 'AI & Chatbot: assistenti conversazionali, automazioni e AI generativa su processi reali. Vuoi vedere la card “AI Assistenti”?' 
  }
  if (text.includes('erp') || text.includes('automazioni') || text.includes('processi')) {
    return 'ERP & Automazioni: integriamo processi end‑to‑end per ridurre tempi e errori. Ti porto alla card “ERP & Automazioni”?'
  }
  if (text.includes('defi') || text.includes('tokenizzazione') || text.includes('web3')) {
    return 'Soluzioni DeFi e tokenizzazione: progettiamo architetture compliant per asset reali e servizi web3 integrati nel business.'
  }
  if (text.includes('metodo') || text.includes('step')) {
    return 'Il Metodo Metis è in 4 step: Analisi, Architettura, Sviluppo Agile, Rilascio. Vuoi che ti porti alla sezione Metodo?'
  }
  if (text.includes('logo') || text.includes('giochino') || text.includes('easter')) {
    return 'Se vuoi, posso aggiungere un mini‑gioco discreto sul logo. Dimmi se lo vuoi attivare e lo preparo.'
  }
  if (text.includes('privacy') || text.includes('cookie')) {
    return 'La Privacy Policy è disponibile in fondo alla pagina. Per i cookie puoi aprire “Preferenze cookie”.'
  }
  if (text.includes('contatto') || text.includes('contattare') || text.includes('whatsapp')) {
    return 'Ti conviene usare il pulsante “Contatti” o WhatsApp in basso a destra: rispondiamo in 24h.'
  }

  return 'Posso aiutarti su servizi, metodo, contatti o privacy. Dimmi cosa ti interessa e ti guido nella sezione giusta.'
}

export default function AdamAssistant() {
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [seen, setSeen] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)

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
      if (!messages.length) {
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
          className="hidden sm:flex fixed right-4 bottom-24 z-[60] items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/80 backdrop-blur-lg shadow-lg hover:text-white hover:bg-white/20 transition-all"
          onClick={() => setOpen(true)}
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          ADAM 24/7
        </button>
      )}

      {open && (
        <div className="fixed right-4 bottom-24 z-[70] w-[min(92vw,380px)] rounded-3xl border border-white/15 bg-gradient-to-br from-[#0b1220]/95 via-[#111827]/95 to-[#0f172a]/95 text-white shadow-2xl backdrop-blur-xl">
          <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Assistente 24/7</p>
              <h3 className="text-lg font-semibold">ADAM</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-white/60 hover:text-white"
              >
                Minimizza
              </button>
              <button
                type="button"
                onClick={disableAssistant}
                className="text-xs text-white/60 hover:text-white"
              >
                Disattiva ADAM
              </button>
            </div>
          </div>

          <div className="px-5 py-4 max-h-[320px] overflow-y-auto space-y-3 text-sm">
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
                  className={`rounded-2xl px-3 py-2 ${message.from === 'adam' ? 'bg-white/10 text-white' : 'bg-cyan-500/20 text-white text-right'}`}
                >
                  {message.text}
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <div className="px-5 pb-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action) => (
                <button
                  key={action.target}
                  type="button"
                  onClick={() => scrollToSection(action.target)}
                  className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors"
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
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-slate-900"
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
