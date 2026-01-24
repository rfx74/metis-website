import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { LanguageProvider } from '@/lib/LanguageContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Metis Srl - Innovative IT Solutions | Soluzioni IT Innovative',
  description: 'Specialized in custom e-commerce solutions, fintech platforms, and DeFi innovations. Specializzati in soluzioni e-commerce su misura, piattaforme fintech e innovazioni DeFi.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <LanguageProvider>
          <div className="min-h-screen bg-metis-gradient">
            {children}
          </div>
        </LanguageProvider>
      </body>
    </html>
  )
}
