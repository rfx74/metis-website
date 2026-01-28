import Link from 'next/link'
import CookiePreferencesButton from '@/components/CookiePreferencesButton'

export const metadata = {
  title: 'Preferenze Cookie | Metis Srl',
  description:
    'Gestisci le preferenze dei cookie per il sito Metis Srl.',
}

export default function CookiePreferencesPage() {
  return (
    <div className="min-h-screen bg-metis-gradient text-white">
      <div className="container mx-auto px-6 py-16 lg:py-24 max-w-4xl space-y-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Metis Srl</p>
          <h1 className="text-4xl lg:text-5xl font-bold">Preferenze Cookie</h1>
          <p className="text-white/80">
            Qui puoi gestire le tue preferenze sui cookie. I cookie necessari sono sempre attivi; gli analytics sono facoltativi.
          </p>
        </div>

        <div className="glass-light rounded-3xl border border-white/15 p-6 sm:p-8 space-y-5">
          <p className="text-white/80">
            Apri il pannello di preferenze per modificare il consenso:
          </p>
          <CookiePreferencesButton />

          <div className="text-sm text-white/70">
            Per maggiori informazioni consulta la <Link className="underline underline-offset-4" href="/privacy">Privacy Policy</Link> e la
            {' '}
            <Link className="underline underline-offset-4" href="/cookie-policy">Cookie Policy</Link>.
          </div>
        </div>
      </div>
    </div>
  )
}
