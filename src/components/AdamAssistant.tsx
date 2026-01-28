'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

const OPEN_ADAM_EVENT = 'metis-open-adam'
const DISABLE_KEY = 'adam-disabled'
const SEEN_KEY = 'adam-seen'

type Message = {
  id: string
  from: 'adam' | 'user'
  text: string
}

const copy = {
  it: {
    welcome: 'Ciao! Sono Adam, posso esserti di aiuto?',
    quickTips: [
      'Suggerimento: nelle card dei servizi puoi cliccare per girarle e vedere dettagli ed esempi.',
      'Vuoi il Metodo Metis in 4 step? Te lo riassumo e ti indico il link.',
      'Curiosità: prova a cliccare il logo per vedere la “sorpresa”.'
    ],
    placeholder: 'Chiedi ad ADAM...',
    send: 'Invia',
    minimize: 'Minimizza',
    disable: 'Disattiva',
    quickActions: [],
    webSearch:
      'Non ho accesso al web in tempo reale. Posso però rispondere usando le informazioni del sito e la mia base di conoscenza. Dimmi pure cosa ti serve e lo dettaglio con esempi pratici.',
    generalFallback:
      'Dimmi quale servizio cerchi (e-commerce, AI, ERP, design, marketing, IoT) o una domanda specifica. Sono qui per aiutarti! 🤖'
  },
  en: {
    welcome: 'Hi! I am Adam, how can I help you?',
    quickTips: [
      'Tip: you can click service cards to flip them and see details and examples.',
      'Want the 4-step Metis Method? I can summarize it and share the link.',
      'Try clicking the logo to see the “surprise”.'
    ],
    placeholder: 'Ask ADAM...',
    send: 'Send',
    minimize: 'Minimize',
    disable: 'Disable',
    quickActions: [],
    webSearch:
      'I do not have real-time web access. I can still answer using the site information and my knowledge. Tell me what you need and I will add practical examples.',
    generalFallback:
      'Tell me which service you need (e-commerce, AI, ERP, design, marketing, IoT) or a specific question. I am here to help! 🤖'
  }
}

const knowledgeBase = {
  it: [
    {
      keywords: ['ecommerce', 'e-commerce', 'shop', 'vendere online', 'store'],
      response:
        'E-commerce su misura: UX + checkout che converte, pagamenti/spedizioni/promo e integrazioni ERP/CRM. Esempio: catalogo sincronizzato con il gestionale, stock in tempo reale e checkout con upsell. Link: /#services. Suggerimento: clicca la card per girarla e vedere i dettagli.'
    },
    {
      keywords: ['ai', 'chatbot', 'intelligenza artificiale', 'assistente', 'assistenti'],
      response:
        'AI & chatbot: risposte su FAQ/catalogo, copilot per offerte/email, triage ticket con handoff umano. Esempio: chatbot che risponde su tempi di consegna e apre ticket al team quando serve. Link: /#services. Suggerimento: clicca la card per girarla e vedere i dettagli.'
    },
    {
      keywords: ['erp', 'automazioni', 'processi', 'magazzino', 'flussi'],
      response:
        'ERP + automazioni: ordini→magazzino→fatture, ruoli/permessi, integrazioni tra reparti e report. Esempio: ordine dal sito crea automaticamente DDT e fattura, con notifica al magazzino. Link: /#services. Suggerimento: clicca la card per girarla e vedere i dettagli.'
    },
    {
      keywords: ['ux', 'ui', 'design', 'interfaccia', 'prototipo'],
      response:
        'UI/UX & product design: flow + prototipo cliccabile, design system e handoff pulito a sviluppo. Esempio: prototipo per testare funnel e micro-copy prima dello sviluppo. Link: /#services. Suggerimento: clicca la card per girarla e vedere i dettagli.'
    },
    {
      keywords: ['marketing', 'seo', 'ads', 'meta', 'google'],
      response:
        'Marketing: SEO + Ads, landing con CRO, tracking pulito (pixel/eventi/UTM) e nurturing. Esempio: landing A/B con tracciamento completo dei lead. Link: /#services. Suggerimento: clicca la card per girarla e vedere i dettagli.'
    },
    {
      keywords: ['consulenza', 'call', 'ora', '1h', 'review'],
      response:
        '1H Consulting: una call mirata per roadmap, priorità e decisioni rapide con piano d\'azione chiaro. Esempio: review architettura e backlog con priorità per un MVP. Link: /#services e /#contact.'
    },
    {
      keywords: ['iot', 'device', 'sensor', 'sensore'],
      response:
        'IoT su misura: backend/API, device management, sicurezza, dati real‑time e alert pronti per dashboard/automazioni. Esempio: sensori di produzione che inviano alert e KPI su dashboard. Link: /#services. Suggerimento: clicca la card per girarla e vedere i dettagli.'
    },
    {
      keywords: ['defi', 'token', 'tokenizzazione', 'web3'],
      response:
        'DeFi e tokenizzazione: architetture compliant per asset reali e integrazione web3 nel business. Esempio: tokenizzazione di asset immobiliari con accessi regolati. Link: /#services e /#contact.'
    },
    {
      keywords: ['metodo', 'processo', 'portfolio', 'come lavorate', 'step'],
      response:
        'Metodo Metis in 4 step: 1) Analisi strategica, 2) Architettura, 3) Sviluppo agile, 4) Rilascio e miglioramento. Esempio: roadmap MVP in 4-6 settimane con rilasci settimanali. Link: /#method.'
    },
    {
      keywords: ['preventivo', 'prezzo', 'costo', 'quanto'],
      response:
        'Per un preventivo rapido: scrivici da Contatti (email) oppure clicca WhatsApp in basso a destra. Rispondiamo entro 24h con priorità + stima. Link: /#contact.'
    },
    {
      keywords: ['contatto', 'contattare', 'whatsapp', 'telefono', 'chiamare'],
      response:
        'Puoi scriverci dal form Contatti o su WhatsApp Business (risposta entro 24h). Link: /#contact.'
    },
    {
      keywords: ['privacy', 'cookie', 'gdpr'],
      response:
        'Privacy e cookie: trovi Privacy Policy e Cookie Policy nel footer. Link: /privacy • /cookie-policy • /cookie-preferences.'
    }
  ],
  en: [
    {
      keywords: ['ecommerce', 'e-commerce', 'shop', 'sell online', 'store', 'online store'],
      response:
        'Custom e-commerce: high‑conversion UX + checkout, payments/shipping/promos, and ERP/CRM integrations. Example: real‑time stock sync and an upsell‑ready checkout. Link: /#services. Tip: click the card to flip it and read details.'
    },
    {
      keywords: ['ai', 'chatbot', 'artificial intelligence', 'assistant', 'assistants'],
      response:
        'AI & chatbots: answers for FAQ/catalog, copilot for quotes/emails, ticket triage with human handoff. Example: a bot that answers delivery times and escalates complex cases. Link: /#services. Tip: click the card to flip it and read details.'
    },
    {
      keywords: ['erp', 'automation', 'process', 'warehouse', 'workflow'],
      response:
        'ERP + automation: orders→warehouse→invoices, roles/permissions, cross‑department integrations and reporting. Example: site order auto‑creates picking list and invoice. Link: /#services. Tip: click the card to flip it and read details.'
    },
    {
      keywords: ['ux', 'ui', 'design', 'interface', 'prototype'],
      response:
        'UI/UX & product design: flows + clickable prototype, design system, clean dev handoff. Example: prototype to test funnel and micro‑copy before build. Link: /#services. Tip: click the card to flip it and read details.'
    },
    {
      keywords: ['marketing', 'seo', 'ads', 'meta', 'google'],
      response:
        'Marketing: SEO + Ads, CRO‑focused landing pages, clean tracking (pixels/events/UTM) and nurturing. Example: A/B landing pages with full lead tracking. Link: /#services. Tip: click the card to flip it and read details.'
    },
    {
      keywords: ['consulting', 'call', 'hour', '1h', 'review'],
      response:
        '1H Consulting: a focused call for roadmap, priorities and fast decisions with a clear action plan. Example: architecture review and MVP backlog priorities. Link: /#services and /#contact.'
    },
    {
      keywords: ['iot', 'device', 'sensor'],
      response:
        'Custom IoT: backend/API, device management, security, real‑time data and alerts for dashboards/automation. Example: production sensors sending alerts and KPI dashboards. Link: /#services. Tip: click the card to flip it and read details.'
    },
    {
      keywords: ['defi', 'token', 'tokenization', 'web3'],
      response:
        'DeFi & tokenization: compliant architectures for real‑world assets with web3 integration. Example: tokenized real‑estate with regulated access. Link: /#services and /#contact.'
    },
    {
      keywords: ['method', 'process', 'portfolio', 'how you work', 'steps'],
      response:
        'Metis 4‑step method: 1) Strategy analysis, 2) Architecture, 3) Agile development, 4) Release & improvement. Example: a 4–6 week MVP roadmap with weekly releases. Link: /#method.'
    },
    {
      keywords: ['quote', 'price', 'cost', 'how much'],
      response:
        'For a quick estimate: contact us via the Contact form or WhatsApp. We respond within 24h with priorities + a rough estimate. Link: /#contact.'
    },
    {
      keywords: ['contact', 'whatsapp', 'phone', 'call'],
      response:
        'You can reach us through the Contact form or WhatsApp Business (reply within 24h). Link: /#contact.'
    },
    {
      keywords: ['privacy', 'cookie', 'gdpr'],
      response:
        'Privacy & cookies: you can find Privacy Policy and Cookie Policy in the footer. Links: /privacy • /cookie-policy • /cookie-preferences.'
    }
  ]
}

function getReply(input: string, language: 'it' | 'en') {
  const text = input.toLowerCase()

  const isItalian = language === 'it'

  if (text.includes('web') || text.includes('cerca sul web') || text.includes('search the web') || text.includes('google')) {
    return copy[language].webSearch
  }

  if (
    text.includes('tutti i servizi') ||
    text.includes('tutti i nostri servizi') ||
    text.includes('all services') ||
    text.includes('all of your services') ||
    text.includes('all the services')
  ) {
    return isItalian
      ? `Ecco tutti i servizi Metis con esempi:

1) E-commerce: UX+checkout, pagamenti, integrazioni. Esempio: stock sincronizzato con ERP e checkout con upsell.
2) AI Assistenti: chatbot 24/7 su FAQ/catalogo. Esempio: bot che risponde su consegne e apre ticket.
3) ERP & Automazioni: processi end‑to‑end. Esempio: ordine → magazzino → fattura automatica.
4) UI/UX Design: prototipi e design system. Esempio: prototipo cliccabile per validare il funnel.
5) Marketing: SEO+Ads, CRO, tracking. Esempio: landing A/B con tracciamento lead.
6) IoT: backend, device management, dati real‑time. Esempio: sensori con dashboard KPI.
7) 1H Consulting: review e roadmap. Esempio: call per priorità MVP.

Link utili: Servizi /#services • Metodo /#method • Contatti /#contact
Suggerimento: clicca le card dei servizi per girarle e leggere i dettagli.`
      : `Here are all Metis services with examples:

1) E-commerce: UX+checkout, payments, integrations. Example: ERP‑synced stock and upsell checkout.
2) AI Assistants: 24/7 chatbot for FAQ/catalog. Example: bot answers delivery times and opens tickets.
3) ERP & Automation: end‑to‑end processes. Example: order → warehouse → invoice automatically.
4) UI/UX Design: prototypes and design systems. Example: clickable prototype to validate the funnel.
5) Marketing: SEO+Ads, CRO, tracking. Example: A/B landing with lead tracking.
6) IoT: backend, device management, real‑time data. Example: sensors with KPI dashboards.
7) 1H Consulting: review and roadmap. Example: MVP priorities call.

Useful links: Services /#services • Method /#method • Contact /#contact
Tip: click service cards to flip and read details.`
  }

  if (text.includes('come funziona') || text.includes('spiegami') || text.includes('come lavora') || text.includes('perché') || text.includes('how does') || text.includes('explain')) {
    if (text.includes('e-commerce') || text.includes('vendere online') || text.includes('shop')) {
      return isItalian
        ? 'E-commerce: creiamo siti di vendita con UX che converte, checkout ottimizzato, pagamenti, spedizioni e promo. Integrazione con ERP per sincronizzare catalogo, ordini e inventario in tempo reale. Esempio: stock aggiornato live e promozioni automatiche. ROI: meno errori manuali, più vendite.'
        : 'E-commerce: we build high‑conversion stores with optimized checkout, payments, shipping and promos. ERP integration keeps catalog, orders and inventory synced in real time. Example: live stock updates and automatic promos. ROI: fewer manual errors and more sales.'
    }
    if (text.includes('ai') || text.includes('assistente') || text.includes('chatbot')) {
      return isItalian
        ? 'AI Assistenti: chatbot 24/7 su FAQ, catalogo e preventivi. Usa AI generativa per suggerire offerte, rispondere a email e fare triage ticket. Se la domanda è complessa, passa a un umano. Esempio: bot che risponde su tempi di consegna e crea ticket. Vantaggio: meno carico sul team, clienti soddisfatti.'
        : 'AI Assistants: 24/7 chatbots for FAQ, catalog and quotes. Uses generative AI to suggest offers, answer emails and triage tickets, with human handoff for complex cases. Example: bot answers delivery times and creates a support ticket. Benefit: less team load, happier customers.'
    }
    if (text.includes('erp') || text.includes('gestionale') || text.includes('contabilità') || text.includes('magazzino')) {
      return isItalian
        ? 'ERP & Automazioni: organizziamo i processi (ordini→magazzino→fatture→contabilità) in un’unica piattaforma. Ruoli, permessi, approvazioni automatiche, integrazioni con banca/fornitori. Esempio: ordine dal sito crea DDT e fattura, con alert al magazzino. Risultato: trasparenza e decisioni basate sui dati.'
        : 'ERP & Automation: we centralize processes (orders→warehouse→invoicing→accounting) in one platform. Roles/permissions, automatic approvals, and integrations with banks/suppliers. Example: web order auto‑creates picking list and invoice with warehouse alerts. Result: transparency and data‑driven decisions.'
    }
    return isItalian
      ? 'Posso spiegare ogni servizio. Dimmi quale ti interessa (e-commerce, AI, ERP, design, marketing, IoT) e ti dettaglio come funziona e perché fa la differenza.'
      : 'I can explain any service. Tell me which one you need (e-commerce, AI, ERP, design, marketing, IoT) and I will detail how it works and why it matters.'
  }

  const hasEcommerce = ['ecommerce', 'e-commerce', 'shop', 'vendere online', 'store', 'vendita online'].some((k) => text.includes(k))
  const hasERP = ['erp', 'gestionale', 'contabilità', 'magazzino', 'processi'].some((k) => text.includes(k))
  const hasAI = ['ai', 'chatbot', 'assistente', 'intelligenza artificiale'].some((k) => text.includes(k))

  if ((hasEcommerce && hasERP && hasAI) || (text.includes('integrato') && (hasEcommerce || hasERP) && hasAI)) {
    return isItalian
      ? 'Perfetto! Per un sito di vendita integrato al gestionale + assistente ti consiglio questa combo:\n\n1) *E-commerce personalizzato*: UX che vende, checkout sicuro, pagamenti e spedizioni integrate\n2) *ERP & Automazioni*: sincronizza ordini dal sito al gestionale, aggiorna catalogo e inventario in tempo reale\n3) *AI Assistenti*: chatbot 24/7 per prodotti e assistenza pre/post-vendita\n\nEsempio: cliente compra → ordine va in ERP → stock aggiornato → chatbot risponde su tracking → team vede tutto sincronizzato.\n\nVuoi che ti apra la sezione Servizi per i dettagli?'
      : 'Great! For a store integrated with ERP + assistant, I recommend this combo:\n\n1) *Custom e-commerce*: high‑conversion UX, secure checkout, integrated payments and shipping\n2) *ERP & Automation*: syncs orders from the site to the ERP, updates catalog and inventory in real time\n3) *AI Assistants*: 24/7 bot for product questions and pre/post‑sales support\n\nExample: customer buys → order hits ERP → stock updates → chatbot answers tracking → team sees everything synced.\n\nWant me to open the Services section?'
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
    return isItalian
      ? `Perfetto! Ti consiglio questi ${serviceMatches.length} servizi insieme:\n\n${list}\n\nVuoi che ti apra la sezione Servizi?`
      : `Perfect! I recommend these ${serviceMatches.length} services together:\n\n${list}\n\nWant me to open the Services section?`
  }

  const matched = knowledgeBase[language].find((topic) =>
    topic.keywords.some((keyword) => text.includes(keyword))
  )
  if (matched) return matched.response

  if (text.includes('suggeriscimi') || text.includes('consigliami') || text.includes('quali sono') || text.includes('che cosa') || text.includes('servizio') || text.includes('servizi') || text.includes('services')) {
    return isItalian
      ? 'Ecco i 7 servizi Metis:\n\n1) E-commerce: UX+checkout, pagamenti, integrazioni\n2) AI Assistenti: Chatbot 24/7 su FAQ/catalogo\n3) ERP & Automazioni: Processi end-to-end\n4) UI/UX Design: Prototipi e design system\n5) Marketing: SEO+Ads, landing, tracking\n6) IoT: Backend, device management, dati real-time\n7) 1H Consulting: Review e roadmap\n\nLink utili: Servizi /#services • Metodo /#method • Contatti /#contact\nSuggerimento: clicca le card dei servizi per girarle e leggere i dettagli.'
      : 'Here are the 7 Metis services:\n\n1) E-commerce: UX+checkout, payments, integrations\n2) AI Assistants: 24/7 chatbot for FAQ/catalog\n3) ERP & Automation: end‑to‑end processes\n4) UI/UX Design: prototypes and design systems\n5) Marketing: SEO+Ads, landing, tracking\n6) IoT: backend, device management, real‑time data\n7) 1H Consulting: review and roadmap\n\nUseful links: Services /#services • Method /#method • Contact /#contact\nTip: click service cards to flip and read details.'
  }

  return copy[language].generalFallback
}

export default function AdamAssistant() {
  const { language } = useLanguage()
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const messagesContainerRef = useRef<HTMLDivElement | null>(null)
  const messagesRef = useRef<Message[]>([])

  useEffect(() => {
    messagesRef.current = messages
  }, [messages])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedDisabled = window.localStorage.getItem(DISABLE_KEY) === '1'
    setDisabled(storedDisabled)

    const openHandler = () => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(DISABLE_KEY, '0')
      }
      setDisabled(false)
      setOpen(true)
      if (!messagesRef.current.length) {
        setMessages([{ id: 'welcome', from: 'adam', text: copy[language].welcome }])
        window.localStorage.setItem(SEEN_KEY, '1')
      }
    }
    window.addEventListener(OPEN_ADAM_EVENT, openHandler)

    return () => {
      window.removeEventListener(OPEN_ADAM_EVENT, openHandler)
    }
  }, [language])

  // Scroll to top when opening, to bottom when new messages arrive
  useEffect(() => {
    if (open && messagesContainerRef.current) {
      // Small delay to ensure DOM is rendered
      setTimeout(() => {
        if (messages.length <= 1) {
          // Initial open: scroll to top
          messagesContainerRef.current?.scrollTo({ top: 0, behavior: 'instant' })
        } else {
          // New messages: scroll to bottom
          bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        }
      }, 50)
    }
  }, [messages, open])

  useEffect(() => {
    const first = messagesRef.current[0]
    if (first?.id === 'welcome' && first.text !== copy[language].welcome) {
      setMessages([{ ...first, text: copy[language].welcome }])
    }
  }, [language])

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
      text: getReply(trimmed, language),
    }

    setMessages((prev) => [...prev, userMessage, reply])
    setInput('')
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
          aria-label="Apri ADAM"
          className="flex fixed right-3 bottom-20 sm:right-4 sm:bottom-24 z-[60] items-center rounded-full border border-white/15 bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/20 p-2.5 text-xs text-white/90 backdrop-blur-lg shadow-[0_12px_40px_rgba(56,189,248,0.25)] hover:brightness-110 transition-all"
          onClick={() => {
            setOpen(true)
            if (!messagesRef.current.length) {
              setMessages([{ id: 'welcome', from: 'adam', text: copy[language].welcome }])
              window.localStorage.setItem(SEEN_KEY, '1')
            }
          }}
        >
          <span className="relative h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-fuchsia-500 to-indigo-500 p-[2px] shadow-[0_10px_30px_rgba(56,189,248,0.35)]">
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
        </button>
      )}

      {open && (
        <div className="fixed right-3 bottom-20 sm:right-4 sm:bottom-24 z-[70] w-[min(92vw,380px)] sm:w-[min(92vw,390px)] h-[65vh] sm:h-[78vh] max-h-[500px] sm:max-h-[600px] rounded-[28px] border border-white/15 bg-gradient-to-br from-[#0b1220]/95 via-[#111827]/95 to-[#0f172a]/95 text-white shadow-[0_24px_80px_rgba(15,23,42,0.65)] backdrop-blur-xl overflow-hidden flex flex-col">
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
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs text-white/70 hover:text-white"
              >
                {copy[language].minimize}
              </button>
              <button
                type="button"
                onClick={disableAssistant}
                className="text-xs text-white/70 hover:text-white"
              >
                {copy[language].disable}
              </button>
            </div>
          </div>

          <div ref={messagesContainerRef} className="px-5 py-4 space-y-3 text-sm flex-1 min-h-[200px] overflow-y-auto overscroll-contain">
            {messages.length === 0 ? (
              <div className="space-y-3 text-white/80">
                <p>{copy[language].welcome}</p>
                {copy[language].quickTips.map((tip) => (
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
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') sendMessage()
                }}
                placeholder={copy[language].placeholder}
                className="flex-1 rounded-xl bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-cyan-400/40"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-slate-900 shadow-md hover:brightness-110 transition-all"
              >
                {copy[language].send}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
