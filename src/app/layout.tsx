import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/LanguageContext'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import AnalyticsManager from '@/components/AnalyticsManager'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://metis-tech.it'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Metis Srl - Innovative IT Solutions | E-commerce, AI, Automazioni, ERP',
    template: '%s | Metis Srl',
  },
  description:
    'Metis Srl: e-commerce su misura, chatbot AI, automazioni e ERP per PMI e startup, consulenza digitale e soluzioni DeFi.',
  keywords: [
    'e-commerce custom',
    'chatbot AI',
    'intelligenza artificiale',
    'automazioni aziendali',
    'sistemi ERP',
    'tokenizzazione asset',
    'consulenza digitale',
    'DeFi',
    'DAO development',
    'soluzioni fintech',
    'marketing digitale',
    'sviluppo software',
    'web3',
    'blockchain',
    'AI generativa',
    'custom development',
    'business solutions',
    'digital transformation',
    'startup solutions',
    'PMI digitali',
  ],
  authors: [{ name: 'Metis Srl' }],
  creator: 'Metis Srl',
  publisher: 'Metis Srl',
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  alternates: {
    canonical: '/',
    languages: {
      'it-IT': '/',
      'en-US': '/',
    },
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
      noimageindex: false,
    },
  },
  verification: {
    google: 'google9c46e0226f3e7206',
    other: {
      'msvalidate.01': 'A783E3D2E150CE989DAFE6E93694A68A',
    },
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Metis Srl',
    title: 'Metis Srl - Innovative IT Solutions',
    description:
      'Metis Srl: e-commerce su misura, chatbot AI, automazioni e ERP per PMI e startup, consulenza digitale e soluzioni DeFi.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Metis Srl - Innovative IT Solutions',
      },
    ],
    locale: 'it_IT',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metis Srl - Innovative IT Solutions',
    description:
      'Metis Srl: e-commerce su misura, chatbot AI, automazioni e ERP per PMI e startup, consulenza digitale e soluzioni DeFi.',
    images: ['/og.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico?v=metis-2026-01-14' },
      { url: '/favicon-16x16.png?v=metis-2026-01-14', type: 'image/png', sizes: '16x16' },
      { url: '/favicon-32x32.png?v=metis-2026-01-14', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/apple-touch-icon.png?v=metis-2026-01-14', type: 'image/png', sizes: '180x180' }],
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Metis Srl',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export const viewport: Viewport = {
  themeColor: '#dde0e3',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'ProfessionalService'],
    name: 'Metis Srl',
    alternateName: 'Metis Tech',
    url: siteUrl,
    logo: `${siteUrl}/solo%20logo%20trasparente.webp`,
    image: `${siteUrl}/og.png`,
    description: 'Soluzioni IT innovative: e-commerce, AI, automazioni, ERP, DeFi e consulenza per PMI e startup',
    foundingDate: '2020',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IT',
      addressLocality: 'Italia',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+39 370 360 3909',
        contactType: 'sales',
        email: 'info@metis-tech.it',
        availableLanguage: ['Italian', 'English'],
        areaServed: ['IT', 'EU'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+39 370 360 3909',
        contactType: 'customer service',
        email: 'info@metis-tech.it',
        availableLanguage: ['Italian', 'English'],
      },
    ],
    sameAs: [
      'https://www.linkedin.com/company/metis-srl',
    ],
    serviceType: [
      'E-commerce Development',
      'AI Chatbots',
      'Business Automation',
      'ERP Systems',
      'DeFi Solutions',
      'Digital Consulting',
      'Fintech Solutions',
      'Asset Tokenization',
    ],
    areaServed: {
      '@type': 'Country',
      name: 'Italy',
    },
    priceRange: '€€€',
  }

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Metis Srl',
    url: siteUrl,
    description: 'Soluzioni IT innovative per aziende moderne',
    inLanguage: ['it-IT', 'en-US'],
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/?s={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
    ],
  }

  return (
    <html lang="it" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          <div className="min-h-screen bg-metis-gradient flex flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <CookieConsent />
          <AnalyticsManager />
        </LanguageProvider>

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />
      </body>
    </html>
  )
}