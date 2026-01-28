export const metadata = {
  title: 'Cookie Policy | Metis Srl',
  description:
    'Informativa sui cookie di Metis Srl in conformità al GDPR e alla normativa ePrivacy.',
}

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-metis-gradient text-white">
      <div className="container mx-auto px-6 py-16 lg:py-24 max-w-5xl space-y-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Metis Srl</p>
          <h1 className="text-4xl lg:text-5xl font-bold">Cookie Policy</h1>
          <p className="text-white/80 max-w-3xl">
            Questa informativa descrive l’uso dei cookie sul sito Metis Srl ai sensi del Regolamento (UE) 2016/679 (GDPR),
            della Direttiva 2002/58/CE (ePrivacy) e dell’art. 122 del D.Lgs. 196/2003 e s.m.i.
          </p>
        </div>

        <div className="glass-light rounded-3xl border border-white/15 p-6 sm:p-8 space-y-6">
          <Section title="Titolare del trattamento">
            <p>
              Metis Srl, Via Giuseppe Garibaldi 3, 40124 Bologna (BO), Italia — Email: {' '}
              <a className="underline" href="mailto:info@metis-tech.it">info@metis-tech.it</a> — Tel: +39 370 360 3909.
            </p>
          </Section>

          <Section title="Che cosa sono i cookie">
            <p>
              I cookie sono piccoli file di testo che i siti inviano al dispositivo dell’utente e che vengono memorizzati
              per essere ritrasmessi agli stessi siti alla visita successiva. Consentono di ricordare preferenze e migliorare
              l’esperienza di navigazione.
            </p>
          </Section>

          <Section title="Tipologie di cookie utilizzati">
            <ul className="list-disc list-inside space-y-2 text-white/85">
              <li><span className="font-semibold">Cookie tecnici necessari</span>: indispensabili per il funzionamento del sito e la sicurezza. Non richiedono consenso.</li>
              <li><span className="font-semibold">Cookie di analytics</span>: usati solo previo consenso per statistiche aggregate sull’uso del sito.</li>
            </ul>
          </Section>

          <Section title="Cookie di terze parti (analytics)">
            <p>
              Utilizziamo Google Analytics esclusivamente previo consenso. I dati sono trattati in forma aggregata con
              anonimizzazione dell’indirizzo IP. Puoi revocare il consenso in qualsiasi momento dalla pagina {' '}
              <a className="underline" href="/cookie-preferences">Preferenze cookie</a>.
            </p>
          </Section>

          <Section title="Base giuridica (art. 6 GDPR)">
            <ul className="list-disc list-inside space-y-2 text-white/85">
              <li>Cookie tecnici: legittimo interesse del titolare (art. 6, par. 1, lett. f).</li>
              <li>Cookie analytics: consenso dell’utente (art. 6, par. 1, lett. a).</li>
            </ul>
          </Section>

          <Section title="Gestione del consenso">
            <p>
              Il consenso è richiesto tramite banner al primo accesso e può essere modificato o revocato in qualsiasi momento.
              Per gestire le preferenze visita la pagina {' '}
              <a className="underline" href="/cookie-preferences">Preferenze cookie</a>.
            </p>
          </Section>

          <Section title="Come disabilitare i cookie dal browser">
            <p>
              Puoi gestire o eliminare i cookie anche dalle impostazioni del browser. Le modalità variano in base al browser
              utilizzato (Chrome, Safari, Firefox, Edge).
            </p>
          </Section>

          <Section title="Aggiornamenti della Cookie Policy">
            <p>
              La presente Cookie Policy può essere aggiornata per adeguamenti normativi o tecnici. La versione pubblicata su
              questa pagina è quella applicabile.
            </p>
          </Section>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="text-white/80 leading-relaxed text-justify sm:text-left">{children}</div>
    </div>
  )
}
