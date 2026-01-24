import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/LanguageContext'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://metis-tech.it'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Metis Srl - Innovative IT Solutions | Soluzioni IT Innovative',
    template: '%s | Metis Srl',
  },
  description:
    'Custom e-commerce, AI chatbots, generative AI, automation, ERP systems, marketing & consulting. e-commerce su misura, chatbot AI, IA generativa, automazioni, sistemi ERP, marketing e consulenza.',
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Metis Srl',
    title: 'Metis Srl - Innovative IT Solutions',
    description:
      'Soluzioni IT su misura: e-commerce, automazioni, AI, ERP e consulenza. Tailored digital solutions for SMEs and startups.',
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
      'Custom e-commerce, AI, automazioni, ERP e consulenza. We bring structure to your ideas.',
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
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Metis Srl',
    url: siteUrl,
    logo: `${siteUrl}/solo%20logo%20trasparente.webp`,
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+39 370 360 3909',
        contactType: 'sales',
        email: 'info@metis-tech.it',
        availableLanguage: ['it', 'en'],
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
        </LanguageProvider>

        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  )
}