'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import { loadConsent, subscribeToConsent, type ConsentPreferences } from '@/lib/consent'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function AnalyticsManager() {
  const [enableAnalytics, setEnableAnalytics] = useState(false)

  useEffect(() => {
    const current = loadConsent()
    if (current?.analytics) setEnableAnalytics(true)

    const unsubscribe = subscribeToConsent((prefs: ConsentPreferences) => {
      setEnableAnalytics(!!prefs.analytics)
    })
    return unsubscribe
  }, [])

  if (!GA_ID || !enableAnalytics) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  )
}
