'use client'

import { useEffect, useRef, useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'

const OPEN_ADAM_EVENT = 'metis-open-adam'
const DISABLE_KEY = 'adam-disabled'
const SEEN_KEY = 'adam-seen'

const openEmailClient = (subject: string) => {
  if (typeof window === 'undefined') return

  const mailto = `mailto:info@metis-tech.it?subject=${encodeURIComponent(subject)}`

  // Trigger mailto via synthetic anchor click (better compatibility than location.href alone)
  const a = document.createElement('a')
  a.href = mailto
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  // Webmail fallbacks in sequence
  const webmailOptions = [
    { name: 'Gmail', url: `https://mail.google.com/mail/?view=cm&fs=1&to=info@metis-tech.it&su=${encodeURIComponent(subject)}` },
    { name: 'Outlook', url: `https://outlook.live.com/mail/0/compose?to=info@metis-tech.it&subject=${encodeURIComponent(subject)}` },
    { name: 'Yahoo', url: `https://compose.mail.yahoo.com/?to=info@metis-tech.it&subject=${encodeURIComponent(subject)}` },
    { name: 'ProtonMail', url: `https://mail.proton.me/u/0/inbox?action=compose&to=info@metis-tech.it&subject=${encodeURIComponent(subject)}` },
    { name: 'Fastmail', url: `https://www.fastmail.com/action/compose?to=info@metis-tech.it&subject=${encodeURIComponent(subject)}` },
    { name: 'Zoho Mail', url: `https://mail.zoho.com/?sc=http&login=true#compose?to=info@metis-tech.it&subject=${encodeURIComponent(subject)}` },
    { name: 'Tutanota', url: `https://mail.tutanota.com/#new?to=info@metis-tech.it&subject=${encodeURIComponent(subject)}` },
    { name: 'Mailbox.org', url: `https://mailbox.org/en/user/webmail?action=compose&to=info@metis-tech.it&subject=${encodeURIComponent(subject)}` },
  ]

  let fallbackIndex = 0
  const tryNextWebmail = () => {
    if (fallbackIndex >= webmailOptions.length) return

    const option = webmailOptions[fallbackIndex]
    fallbackIndex++

    const newWindow = window.open(option.url, '_blank', 'noopener,noreferrer')

    // If popup blocked, attempt next option shortly
    if (!newWindow) {
      setTimeout(tryNextWebmail, 350)
    }
  }

  // Start fallbacks after a short delay; if still on the page, open webmail
  setTimeout(() => {
    if (document.visibilityState === 'visible') {
      tryNextWebmail()
    }
  }, 1200)

  // Last resort: if nothing happened, navigate current tab to the first webmail option
  setTimeout(() => {
    if (document.visibilityState === 'visible') {
      window.location.href = webmailOptions[0].url
    }
  }, 4000)
}

const normalizeAnswer = (value: string) =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const formatMessageToHtml = (value: string) => {
  const escaped = escapeHtml(value)

  const withBold = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')

  const withItalic = withBold
    // Italic with *text*
    .replace(/(^|[^*])\*(?!\s)([^*]+?)\*(?!\*)/g, '$1<em>$2</em>')
    // Italic with _text_
    .replace(/(^|[^_])_(?!\s)([^_]+?)_(?!_)/g, '$1<em>$2</em>')

  return withItalic.replace(/\n/g, '<br />')
}

const POSITIVE_RESPONSES = new Set([
  'si',
  'si grazie',
  'certo',
  'certamente',
  'volentieri',
  'assolutamente',
  'va bene',
  'va bene grazie',
  'daccordo',
  'ok',
  'ok grazie',
  'perfetto',
  'yes',
  'yes please',
  'sure',
  'sure thing',
  'of course',
  'yeah',
  'yep',
  'yup',
  'absolutely'
])

const NEGATIVE_RESPONSES = new Set([
  'no',
  'no grazie',
  'non ora',
  'magari dopo',
  'forse dopo',
  'forse piu tardi',
  'not now',
  'maybe later',
  'no thanks',
  'no thank you',
  'not yet',
  'nope'
])

type Message = {
  id: string
  from: 'adam' | 'user'
  text: string
  meta?: {
    askedQuote?: boolean
  }
}

type Reply = {
  text: string
  askQuote?: boolean
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

function getReply(input: string, language: 'it' | 'en'): Reply {
  const text = input.toLowerCase()

  const isItalian = language === 'it'

  if (text.includes('web') || text.includes('cerca sul web') || text.includes('search the web') || text.includes('google')) {
    return { text: copy[language].webSearch }
  }

  if (
    text.includes('tutti i servizi') ||
    text.includes('tutti i nostri servizi') ||
    text.includes('all services') ||
    text.includes('all of your services') ||
    text.includes('all the services')
  ) {
    return {
      text: isItalian
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
  }

  // Keywords espanse per catturare più variazioni - ITALIANO
  const ecommerceKeywordsIT = [
    'ecommerce', 'e-commerce', 'shop', 'vendere online', 'store', 'vendita online',
    'sito di vendita', 'sito vendita', 'negozio online', 'negozio digitale',
    'vendite online', 'commercio elettronico', 'piattaforma vendita', 'catalogo online',
    'carrello', 'checkout', 'pagamenti online', 'spedizioni', 'ordini online',
    'sito per la vendita', 'vendita dei miei prodotti', 'vendere i miei prodotti'
  ]
  
  const erpKeywordsIT = [
    'erp', 'gestionale', 'contabilità', 'magazzino', 'processi', 'automazione',
    'magazzino digitale', 'inventario', 'fatturazione', 'fatture', 'ddt',
    'ordini', 'flussi', 'workflow', 'integrazione', 'sincronizzazione',
    'gestione ordini', 'gestione magazzino', 'stock', 'giacenze', 'picking',
    'logistica', 'backoffice', 'back-office', 'amministrazione', 'contabile'
  ]
  
  const aiKeywordsIT = [
    'ai', 'chatbot', 'assistente', 'intelligenza artificiale', 'bot',
    'customer care', 'customercare', 'assistenza clienti', 'supporto clienti',
    'help desk', 'helpdesk', 'ticket', 'faq', 'risposte automatiche',
    'assistenza', 'supporto', 'care', 'servizio clienti', 'post-vendita',
    'post vendita', 'pre-vendita', 'pre vendita', 'chat', 'risposta automatica',
    'assistente digitale', 'assistente virtuale'
  ]

  // Keywords per servizi alternativi che indirizzano a 1H Consulting
  const consultingKeywordsIT = [
    'blog', 'blog site', 'sito blog', 'blogging', 'blogger',
    'video', 'videoblog', 'video blog', 'vlog', 'youtube',
    'app', 'applicazione', 'mobile app', 'app mobile',
    'portale', 'piattaforma', 'web app',
    'landing page', 'squeeze page', 'sales page',
    // siti generici
    'sito', 'sito web', 'sito internet', 'sito vetrina', 'vetrina online', 'sito aziendale', 'website', 'web site'
  ]

  // Keywords espanse - ENGLISH
  const ecommerceKeywordsEN = [
    'ecommerce', 'e-commerce', 'shop', 'sell online', 'store', 'online store',
    'online shop', 'web store', 'digital store', 'selling online', 'sales website',
    'shopping cart', 'checkout', 'online payments', 'shipping', 'online orders',
    'product catalog', 'online catalog', 'digital commerce', 'retail',
    'sell my products', 'selling my products', 'sales site'
  ]
  
  const erpKeywordsEN = [
    'erp', 'management system', 'accounting', 'warehouse', 'processes', 'automation',
    'digital warehouse', 'inventory', 'invoicing', 'invoices', 'orders',
    'workflow', 'integration', 'synchronization', 'sync', 'order management',
    'warehouse management', 'stock', 'stock management', 'picking', 'logistics',
    'backoffice', 'back-office', 'administration', 'business management'
  ]
  
  const aiKeywordsEN = [
    'ai', 'chatbot', 'assistant', 'artificial intelligence', 'bot',
    'customer care', 'customercare', 'customer service', 'customer support',
    'help desk', 'helpdesk', 'ticket', 'faq', 'automatic responses',
    'support', 'care', 'post-sale', 'post sale', 'pre-sale', 'pre sale',
    'chat', 'automatic reply', 'virtual assistant', 'smart assistant', 'digital assistant'
  ]

  // Keywords per servizi alternativi che indirizzano a 1H Consulting
  const consultingKeywordsEN = [
    'blog', 'blog site', 'blogging', 'blogger',
    'video', 'videoblog', 'video blog', 'vlog', 'youtube',
    'app', 'application', 'mobile app', 'mobile application',
    'portal', 'platform', 'web app',
    'landing page', 'squeeze page', 'sales page',
    // generic websites
    'website', 'web site', 'site', 'corporate site', 'business site', 'brochure site'
  ]

  const hasEcommerce = ecommerceKeywordsIT.some((k) => text.includes(k)) || ecommerceKeywordsEN.some((k) => text.includes(k))
    
  const hasERP = erpKeywordsIT.some((k) => text.includes(k)) || erpKeywordsEN.some((k) => text.includes(k))
    
  const hasAI = aiKeywordsIT.some((k) => text.includes(k)) || aiKeywordsEN.some((k) => text.includes(k))

  const hasConsulting = consultingKeywordsIT.some((k) => text.includes(k)) || consultingKeywordsEN.some((k) => text.includes(k))

  // If user asks for alternative service (blog, app, video, etc.), suggest 1H Consulting
  if (hasConsulting && !hasEcommerce && !hasERP && !hasAI) {
    return {
      text: isItalian
        ? `Mi sembra una richiesta interessante! Per un progetto come questo, consiglio una **1H Consulting** con il nostro team per approfondire il tuo progetto, definire la soluzione migliore e la roadmap.\n\nVuoi che ti metti in contatto con noi? Rispondi sì o no.`
        : `This sounds like an interesting project! I recommend a **1H Consulting** call with our team to discuss your needs, define the best solution, and create a roadmap.\n\nWould you like me to help you reach out to us? Reply yes or no.`,
      askQuote: true
    }
  }

  const primaryServicesCount = [hasEcommerce, hasERP, hasAI].filter(Boolean).length

  // Check for integrated/combined services request (both IT and EN)
  const wantsIntegration = [
    'integrato', 'integrati', 'integrazione', 'integrare', 'integra', 'integrarlo', 'integrarla',
    'integrated', 'integration', 'integrate it', 'connect it', 'connected',
    'combined', 'together', 'insieme', 'collegato', 'collegate', 'completo', 'complete', 'all-in-one',
    'ecosistema', 'ecosystem'
  ].some((k) => text.includes(k))

  if ((hasEcommerce && hasERP && hasAI) || (wantsIntegration && (hasEcommerce || hasERP) && hasAI)) {
    return {
      text: isItalian
        ? `Ottima domanda! Per il tuo progetto ti servono questi 3 servizi Metis:

**1) E-commerce personalizzato**
Perché: ti serve un sito di vendita professionale con UX che converte, checkout sicuro, e pagamenti/spedizioni integrate.
Esempio: catalogo prodotti con filtri smart, carrello persistente, checkout in 3 click con PayPal/Stripe/carta.

**2) ERP & Automazioni (Magazzino Digitale)**
Perché: serve sincronizzare ordini, stock e fatturazione in tempo reale col gestionale. Niente più errori manuali.
Esempio: cliente compra → ordine va automaticamente nel gestionale → stock aggiornato → DDT e fattura generati → notifica al magazzino per il picking.

**3) AI Assistenti (Customer Care)**
Perché: un chatbot 24/7 risponde a domande su prodotti, ordini, tracking, resi. Riduce il carico sul team e migliora la customer experience.
Esempio: cliente chiede "dov'è il mio ordine?" → il bot recupera lo stato dal gestionale e risponde subito con link tracking.

**Come funzionano insieme:**
Cliente acquista → Ordine sincronizzato col gestionale → Stock aggiornato in tempo reale → Chatbot risponde su tracking e assistenza → Team vede tutto integrato in un'unica dashboard.

Vuoi che ti prepari un preventivo personalizzato? Rispondi sì o no.`
    : `Great question! For your project you need these 3 Metis services:

**1) Custom E-commerce**
Why: you need a professional sales website with high-conversion UX, secure checkout, and integrated payments/shipping.
Example: product catalog with smart filters, persistent cart, 3-click checkout with PayPal/Stripe/card.

**2) ERP & Automation (Digital Warehouse)**
Why: you need to sync orders, stock, and invoicing in real-time with your management system. No more manual errors.
Example: customer buys → order goes automatically to ERP → stock updated → invoice generated → warehouse notified for picking.

**3) AI Assistants (Customer Care)**
Why: a 24/7 chatbot answers questions about products, orders, tracking, returns. Reduces team workload and improves customer experience.
Example: customer asks "where's my order?" → bot retrieves status from ERP and replies instantly with tracking link.

**How they work together:**
Customer buys → Order synced with ERP → Stock updated in real-time → Chatbot handles tracking and support → Team sees everything in one dashboard.

Would you like me to prepare a tailored quote? Reply yes or no.`,
      askQuote: true
    }
  }

  // Check for any two services combination with detailed response
  const serviceMatches: { name: string; label: string; labelEN: string; desc: string; descEN: string; why: string; whyEN: string; example: string; exampleEN: string }[] = []

  if (hasEcommerce) {
    serviceMatches.push({ 
      name: 'ecommerce', 
      label: 'E-commerce personalizzato', 
      labelEN: 'Custom E-commerce',
      desc: 'UX che converte, checkout sicuro, pagamenti e spedizioni integrate, integrazioni ERP/CRM.',
      descEN: 'High-conversion UX, secure checkout, integrated payments and shipping, ERP/CRM integrations.',
      why: 'ti permette di vendere online con un\'esperienza utente professionale che massimizza le conversioni.',
      whyEN: 'allows you to sell online with a professional user experience that maximizes conversions.',
      example: 'catalogo prodotti, carrello persistente, checkout rapido, notifiche ordine automatiche.',
      exampleEN: 'product catalog, persistent cart, quick checkout, automatic order notifications.'
    })
  }
  if (hasAI) {
    serviceMatches.push({ 
      name: 'ai', 
      label: 'AI Assistenti', 
      labelEN: 'AI Assistants',
      desc: 'Chatbot 24/7 per FAQ, catalogo, ordini. Copilot per email/offerte. Triage ticket con handoff umano.',
      descEN: '24/7 chatbot for FAQ, catalog, orders. Copilot for emails/quotes. Ticket triage with human handoff.',
      why: 'automatizza il customer care, risponde istantaneamente e libera il team dalle domande ripetitive.',
      whyEN: 'automates customer care, responds instantly, and frees your team from repetitive questions.',
      example: 'bot che risponde su tracking, tempi consegna, disponibilità prodotti, e apre ticket per casi complessi.',
      exampleEN: 'bot that answers about tracking, delivery times, product availability, and creates tickets for complex cases.'
    })
  }
  if (hasERP) {
    serviceMatches.push({ 
      name: 'erp', 
      label: 'ERP & Automazioni', 
      labelEN: 'ERP & Automation',
      desc: 'Gestione ordini, magazzino digitale, fatturazione, sincronizzazione tra sistemi.',
      descEN: 'Order management, digital warehouse, invoicing, system synchronization.',
      why: 'centralizza i processi, elimina errori manuali e ti dà visibilità in tempo reale su tutto il business.',
      whyEN: 'centralizes processes, eliminates manual errors, and gives you real-time visibility across your business.',
      example: 'ordine → picking list automatica → fattura generata → stock aggiornato → notifica al cliente.',
      exampleEN: 'order → automatic picking list → invoice generated → stock updated → customer notified.'
    })
  }
  if (['ux', 'ui', 'design', 'interfaccia', 'prototipo', 'grafica', 'interface', 'prototype', 'graphics'].some((k) => text.includes(k))) {
    serviceMatches.push({ 
      name: 'design', 
      label: 'UI/UX + Responsive Design', 
      labelEN: 'UI/UX + Responsive Design',
      desc: 'Prototipi cliccabili, design system, handoff pulito a sviluppo.',
      descEN: 'Clickable prototypes, design system, clean dev handoff.',
      why: 'ti permette di testare l\'esperienza utente prima dello sviluppo, risparmiando tempo e soldi.',
      whyEN: 'lets you test user experience before development, saving time and money.',
      example: 'prototipo interattivo per validare il funnel di acquisto prima di scrivere codice.',
      exampleEN: 'interactive prototype to validate the purchase funnel before writing code.'
    })
  }
  // Se l'utente chiede un sito/app generico (consulting) ma non ha menzionato UX esplicitamente, proponi anche UI/UX come supporto naturale
  const alreadyAdded = (serviceName: string) => serviceMatches.some((s) => s.name === serviceName)
  if (hasConsulting && !alreadyAdded('design')) {
    serviceMatches.push({
      name: 'design',
      label: 'UI/UX + Responsive Design',
      labelEN: 'UI/UX + Responsive Design',
      desc: 'Prototipi cliccabili, design system, handoff pulito a sviluppo.',
      descEN: 'Clickable prototypes, design system, clean dev handoff.',
      why: 'assicura che il sito sia chiaro, usabile e pronto per lo sviluppo senza rework.',
      whyEN: 'ensures the site is clear, usable, and ready for development with no rework.',
      example: 'wireframe + prototipo interattivo per validare struttura e contenuti prima del codice.',
      exampleEN: 'wireframe + interactive prototype to validate structure and content before coding.'
    })
  }
  if (['marketing', 'seo', 'ads', 'meta', 'google', 'advertising', 'pubblicità', 'promozione', 'visibility', 'visibilità'].some((k) => text.includes(k))) {
    serviceMatches.push({ 
      name: 'marketing', 
      label: 'Marketing', 
      labelEN: 'Marketing',
      desc: 'SEO + Ads, landing con CRO, tracking pulito, lead nurturing.',
      descEN: 'SEO + Ads, CRO landing pages, clean tracking, lead nurturing.',
      why: 'porta traffico qualificato al tuo sito e converte i visitatori in clienti.',
      whyEN: 'brings qualified traffic to your site and converts visitors into customers.',
      example: 'landing page A/B testata con pixel tracking completo e funnel email automatizzato.',
      exampleEN: 'A/B tested landing page with complete pixel tracking and automated email funnel.'
    })
  }
  if (['iot', 'device', 'sensor', 'sensore', 'dispositivo', 'hardware', 'embedded', 'sensori', 'sensors', 'devices'].some((k) => text.includes(k))) {
    serviceMatches.push({ 
      name: 'iot', 
      label: 'IoT personalizzate', 
      labelEN: 'Custom IoT',
      desc: 'Backend/API, device management, dati real-time, alert.',
      descEN: 'Backend/API, device management, real-time data, alerts.',
      why: 'collega i tuoi dispositivi fisici al cloud per monitoraggio e automazioni.',
      whyEN: 'connects your physical devices to the cloud for monitoring and automation.',
      example: 'sensori di temperatura che inviano alert se superano soglie critiche.',
      exampleEN: 'temperature sensors that send alerts if critical thresholds are exceeded.'
    })
  }
  if (['consulenza', 'call', '1h', 'review', 'consulting', 'advice', 'consiglio', 'parere', 'opinione', 'valutazione', 'assessment'].some((k) => text.includes(k))) {
    serviceMatches.push({ 
      name: 'consulting', 
      label: '1H Consulting', 
      labelEN: '1H Consulting',
      desc: 'Una call mirata per roadmap, priorità e decisioni rapide.',
      descEN: 'A focused call for roadmap, priorities, and quick decisions.',
      why: 'ti aiuta a fare chiarezza su priorità e prossimi passi con un esperto.',
      whyEN: 'helps you clarify priorities and next steps with an expert.',
      example: 'review dell\'architettura attuale e piano d\'azione per i prossimi 3 mesi.',
      exampleEN: 'review of current architecture and action plan for the next 3 months.'
    })
  }

  // Se l'utente chiede un sito generico, blog, app, portale, landing ecc. (consultingKeywords), aggiungi 1H Consulting come servizio rilevante
  if (hasConsulting) {
    serviceMatches.push({
      name: 'consulting-keywords',
      label: '1H Consulting',
      labelEN: '1H Consulting',
      desc: 'Una call per definire obiettivi, contenuti e roadmap del tuo sito/app.',
      descEN: 'A call to define goals, content, and the roadmap for your site/app.',
      why: 'allinea requisiti e priorità prima di partire con design e sviluppo.',
      whyEN: 'aligns requirements and priorities before starting design and development.',
      example: 'esempi di sitemap, tono di voce e feature principali per il lancio.',
      exampleEN: 'examples of sitemap, tone of voice, and key features for launch.'
    })
  }

  if (serviceMatches.length >= 2) {
    const list = serviceMatches
      .map((s, i) =>
        isItalian
          ? `**${i + 1}) ${s.label}**\nCosa fa: ${s.desc}\nPerché: ${s.why}\nEsempio: ${s.example}`
          : `**${i + 1}) ${s.labelEN}**\nWhat it does: ${s.descEN}\nWhy: ${s.whyEN}\nExample: ${s.exampleEN}`
      )
      .join('\n\n')

    const followUp = isItalian
      ? '**Come funzionano insieme:** questi servizi si integrano per creare un ecosistema completo e automatizzato.\n\nVuoi che ti prepari un preventivo personalizzato? Rispondi sì o no.'
      : '**How they work together:** these services integrate to create a complete, automated ecosystem.\n\nWould you like me to prepare a tailored quote? Reply yes or no.'

    return {
      text: `${isItalian ? `Perfetto! Per il tuo progetto ti consiglio questi ${serviceMatches.length} servizi Metis:` : `Perfect! For your project I recommend these ${serviceMatches.length} Metis services:`}\n\n${list}\n\n${followUp}`,
      askQuote: true
    }
  }

  // "Come funziona" check - ONLY if asking specifically about one service
  if (text.includes('come funziona') || text.includes('spiegami') || text.includes('come lavora') || text.includes('perché') || text.includes('how does') || text.includes('explain')) {
    // Only respond with single service explanation if one primary service detected
    if (primaryServicesCount <= 1) {
      if (text.includes('e-commerce') || text.includes('vendere online') || text.includes('shop')) {
          return {
            text: isItalian
              ? 'E-commerce: creiamo siti di vendita con UX che converte, checkout ottimizzato, pagamenti, spedizioni e promo. Integrazione con ERP per sincronizzare catalogo, ordini e inventario in tempo reale. Esempio: stock aggiornato live e promozioni automatiche. ROI: meno errori manuali, più vendite.'
              : 'E-commerce: we build high‑conversion stores with optimized checkout, payments, shipping and promos. ERP integration keeps catalog, orders and inventory synced in real time. Example: live stock updates and automatic promos. ROI: fewer manual errors and more sales.'
          }
      }
      if (text.includes('ai') || text.includes('assistente') || text.includes('chatbot')) {
          return {
            text: isItalian
              ? 'AI Assistenti: chatbot 24/7 su FAQ, catalogo e preventivi. Usa AI generativa per suggerire offerte, rispondere a email e fare triage ticket. Se la domanda è complessa, passa a un umano. Esempio: bot che risponde su tempi di consegna e crea ticket. Vantaggio: meno carico sul team, clienti soddisfatti.'
              : 'AI Assistants: 24/7 chatbots for FAQ, catalog and quotes. Uses generative AI to suggest offers, answer emails and triage tickets, with human handoff for complex cases. Example: bot answers delivery times and creates a support ticket. Benefit: less team load, happier customers.'
          }
      }
      if (text.includes('erp') || text.includes('gestionale') || text.includes('contabilità') || text.includes('magazzino')) {
          return {
            text: isItalian
              ? 'ERP & Automazioni: organizziamo i processi (ordini→magazzino→fatture→contabilità) in un\'unica piattaforma. Ruoli, permessi, approvazioni automatiche, integrazioni con banca/fornitori. Esempio: ordine dal sito crea DDT e fattura, con alert al magazzino. Risultato: trasparenza e decisioni basate sui dati.'
              : 'ERP & Automation: we centralize processes (orders→warehouse→invoicing→accounting) in one platform. Roles/permissions, automatic approvals, and integrations with banks/suppliers. Example: web order auto‑creates picking list and invoice with warehouse alerts. Result: transparency and data‑driven decisions.'
          }
      }
    }
    // If multiple services detected, let it fall through to general fallback or other handlers
  }

  const matched = knowledgeBase[language].find((topic) =>
    topic.keywords.some((keyword) => text.includes(keyword))
  )
  if (matched) {
    return { text: matched.response }
  }

  if (text.includes('suggeriscimi') || text.includes('consigliami') || text.includes('quali sono') || text.includes('che cosa') || text.includes('servizio') || text.includes('servizi') || text.includes('services')) {
    return {
      text: isItalian
        ? 'Ecco i 7 servizi Metis:\n\n1) E-commerce: UX+checkout, pagamenti, integrazioni\n2) AI Assistenti: Chatbot 24/7 su FAQ/catalogo\n3) ERP & Automazioni: Processi end-to-end\n4) UI/UX Design: Prototipi e design system\n5) Marketing: SEO+Ads, landing, tracking\n6) IoT: Backend, device management, dati real-time\n7) 1H Consulting: Review e roadmap\n\nLink utili: Servizi /#services • Metodo /#method • Contatti /#contact\nSuggerimento: clicca le card dei servizi per girarle e leggere i dettagli.'
        : 'Here are the 7 Metis services:\n\n1) E-commerce: UX+checkout, payments, integrations\n2) AI Assistants: 24/7 chatbot for FAQ/catalog\n3) ERP & Automation: end‑to‑end processes\n4) UI/UX Design: prototypes and design systems\n5) Marketing: SEO+Ads, landing, tracking\n6) IoT: backend, device management, real‑time data\n7) 1H Consulting: review and roadmap\n\nUseful links: Services /#services • Method /#method • Contact /#contact\nTip: click service cards to flip and read details.'
    }
  }

  return { text: copy[language].generalFallback }
}

export default function AdamAssistant() {
  const { language } = useLanguage()
  const [open, setOpen] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [awaitingQuote, setAwaitingQuote] = useState(false)
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

  const appendAdamMessage = (text: string, askQuote = false) => {
    const message: Message = {
      id: `${Date.now()}-adam`,
      from: 'adam',
      text,
      ...(askQuote ? { meta: { askedQuote: true } } : {})
    }

    setMessages((prev) => [...prev, message])

    if (askQuote) {
      setAwaitingQuote(true)
    }
  }

  const isAffirmative = (value: string) => POSITIVE_RESPONSES.has(normalizeAnswer(value))
  const isNegative = (value: string) => NEGATIVE_RESPONSES.has(normalizeAnswer(value))

  const sendMessage = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      from: 'user',
      text: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    const isItalian = language === 'it'

    if (awaitingQuote) {
      if (isAffirmative(trimmed)) {
        const subject = isItalian ? 'Richiesta preventivo Metis' : 'Metis quote request'
        openEmailClient(subject)
        setAwaitingQuote(false)
        return
      }

      if (isNegative(trimmed)) {
        appendAdamMessage(
          isItalian
            ? 'Nessun problema, resto a disposizione per qualsiasi altra domanda.'
            : 'No problem, I am here for any other questions you may have.'
        )
        setAwaitingQuote(false)
        return
      }

      setAwaitingQuote(false)
    }

    const reply = getReply(trimmed, language)
    appendAdamMessage(reply.text, reply.askQuote === true)
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
              messages.map((message) => {
                const formatted = formatMessageToHtml(message.text)
                const isAdam = message.from === 'adam'

                return (
                  <div
                    key={message.id}
                    className={`rounded-2xl px-4 py-3 shadow-sm break-words ${isAdam ? 'bg-white/10 text-white border border-white/10' : 'bg-gradient-to-r from-cyan-500/30 to-fuchsia-500/20 text-white text-right'}`}
                  >
                    <span dangerouslySetInnerHTML={{ __html: formatted }} />
                  </div>
                )
              })
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
