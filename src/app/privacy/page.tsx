export const metadata = {
  title: 'Privacy Policy | Metis Srl',
  description:
    'Informativa privacy e gestione dei cookie secondo il GDPR per i servizi digitali di Metis Srl.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-metis-gradient text-white">
      <div className="container mx-auto px-6 py-16 lg:py-24 max-w-5xl space-y-10">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.2em] text-white/70">Metis Srl</p>
          <h1 className="text-4xl lg:text-5xl font-bold">Privacy Policy</h1>
          <p className="text-white/80 max-w-3xl">
            Questa informativa descrive come Metis Srl tratta i dati personali nel rispetto del Regolamento (UE) 2016/679 (GDPR).
          </p>
        </div>

        <div className="glass-light rounded-3xl border border-white/15 p-6 sm:p-8 space-y-6">
          <Section title="Titolare del trattamento">
            <p>Metis Srl — Email: info@metis-tech.it — Tel: +39 370 360 3909.</p>
          </Section>

          <Section title="Dati trattati e finalità">
            <ul className="list-disc list-inside space-y-2 text-white/85">
              <li>Dati di contatto inviati tramite form o email: riscontro a richieste commerciali o di supporto.</li>
              <li>Dati tecnici di navigazione (log, IP mascherato): sicurezza e prevenzione abusi.</li>
              <li>Analytics (solo previo consenso): statistiche anonime/aggregrate sull’uso del sito.</li>
            </ul>
          </Section>

          <Section title="Base giuridica">
            <ul className="list-disc list-inside space-y-2 text-white/85">
              <li>Esecuzione di misure precontrattuali o contrattuali (risposte a richieste).</li>
              <li>Legittimo interesse del titolare per sicurezza e prevenzione frodi, con bilanciamento dei diritti degli interessati.</li>
              <li>Consenso per attività di analytics non essenziali.</li>
            </ul>
          </Section>

          <Section title="Periodo di conservazione">
            <ul className="list-disc list-inside space-y-2 text-white/85">
              <li>Richieste commerciali/supporto: max 24 mesi.</li>
              <li>Log tecnici: in genere fino a 12 mesi salvo esigenze di sicurezza.</li>
              <li>Cookie/analytics: secondo durata tecnica o fino a revoca del consenso.</li>
            </ul>
          </Section>

          <Section title="Diritti degli interessati">
            <p>
              Puoi esercitare i diritti di accesso, rettifica, cancellazione, limitazione, opposizione, portabilità e revoca del consenso scrivendo a
              {' '}
              <a className="underline" href="mailto:info@metis-tech.it">info@metis-tech.it</a>. Hai diritto di proporre reclamo al Garante Privacy.
            </p>
          </Section>

          <Section title="Destinatari e trasferimenti">
            <p>
              Fornitori di servizi (es. hosting, strumenti di analytics) operano come responsabili del trattamento. I dati sono trattati principalmente nello Spazio Economico Europeo; eventuali trasferimenti extra-SEE avvengono con garanzie adeguate (es. SCC).
            </p>
          </Section>

          <Section title="Cookie e preferenze">
            <p className="mb-3">
              Usiamo cookie tecnici necessari e, solo previo consenso, cookie di analytics. Puoi gestire le preferenze dal banner o dal pulsante “Preferenze cookie”.
            </p>
            <ul className="list-disc list-inside space-y-2 text-white/85">
              <li><span className="font-semibold">Necessari:</span> sicurezze, bilanciamento carico, preferenze tecniche.</li>
              <li><span className="font-semibold">Analytics:</span> statistiche anonime/aggregate sull’uso del sito.</li>
            </ul>
          </Section>

          <Section title="Contatti privacy">
            <p>Per chiarimenti o richieste: info@metis-tech.it.</p>
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
