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
          <Section title="Titolare del trattamento (art. 4 e 24 GDPR)">
            <p>
              Metis Srl, Via Giuseppe Garibaldi 3, 40124 Bologna (BO), Italia — Email: {' '}
              <a className="underline" href="mailto:info@metis-tech.it">info@metis-tech.it</a> — Tel: +39 370 360 3909.
            </p>
          </Section>

          <Section title="Ambito e basi normative (artt. 13–14 GDPR)">
            <p>
              La presente informativa è resa ai sensi degli artt. 13 e 14 del Regolamento (UE) 2016/679 (GDPR) e disciplina il trattamento dei dati personali
              effettuato tramite il sito Metis Srl.
            </p>
          </Section>

          <Section title="Dati trattati">
            <ul className="list-disc list-inside space-y-2 text-white/85">
              <li>Dati identificativi e di contatto forniti dall’utente (nome, email, telefono, messaggio).</li>
              <li>Dati tecnici di navigazione (indirizzo IP, log, user agent), con IP anonimizzato per analytics.</li>
              <li>Preferenze di consenso ai cookie e ai tracciamenti.</li>
            </ul>
          </Section>

          <Section title="Finalità del trattamento e base giuridica (art. 6 GDPR)">
            <ul className="list-disc list-inside space-y-2 text-white/85">
              <li>Rispondere a richieste commerciali o di supporto: esecuzione di misure precontrattuali o contrattuali (art. 6, par. 1, lett. b).</li>
              <li>Sicurezza, prevenzione frodi e continuità del servizio: legittimo interesse del titolare (art. 6, par. 1, lett. f).</li>
              <li>Analisi statistiche non essenziali (analytics): consenso dell’utente (art. 6, par. 1, lett. a).</li>
            </ul>
          </Section>

          <Section title="Modalità del trattamento e misure di sicurezza (artt. 5 e 32 GDPR)">
            <p>
              Il trattamento avviene con strumenti informatici e telematici, in modo lecito, corretto e trasparente. Adottiamo misure tecniche e organizzative
              adeguate a garantire riservatezza, integrità e disponibilità dei dati.
            </p>
          </Section>

          <Section title="Conferimento dei dati">
            <p>
              Il conferimento dei dati è facoltativo, ma necessario per rispondere alle richieste inviate tramite form o email. Il mancato conferimento può
              comportare l’impossibilità di fornire riscontro.
            </p>
          </Section>

          <Section title="Destinatari e responsabili (art. 28 GDPR)">
            <p>
              I dati possono essere trattati da fornitori che operano in qualità di responsabili del trattamento (es. hosting, servizi di analytics) e da
              personale autorizzato. L’elenco aggiornato dei responsabili è disponibile su richiesta.
            </p>
          </Section>

          <Section title="Trasferimenti extra-SEE">
            <p>
              I dati sono trattati principalmente nello Spazio Economico Europeo. Eventuali trasferimenti verso Paesi extra-SEE avvengono nel rispetto delle
              garanzie previste dal GDPR (es. Clausole Contrattuali Standard - SCC).
            </p>
          </Section>

          <Section title="Periodo di conservazione">
            <ul className="list-disc list-inside space-y-2 text-white/85">
              <li>Richieste commerciali/supporto: fino a 24 mesi.</li>
              <li>Log tecnici di sicurezza: fino a 12 mesi salvo necessità di tutela.</li>
              <li>Preferenze cookie/consensi: fino a revoca o secondo durata tecnica dei cookie.</li>
            </ul>
          </Section>

          <Section title="Diritti dell’interessato (artt. 15–22, 7 e 77 GDPR)">
            <p>
              Puoi esercitare i diritti di accesso, rettifica, cancellazione, limitazione, opposizione e portabilità, nonché revocare il consenso in qualsiasi
              momento (art. 7 GDPR) scrivendo a <a className="underline" href="mailto:info@metis-tech.it">info@metis-tech.it</a>. Hai diritto di proporre reclamo
              al Garante per la protezione dei dati personali (art. 77 GDPR).
            </p>
          </Section>

          <Section title="Cookie e tracciamenti">
            <p>
              Usiamo cookie tecnici necessari e, previo consenso, cookie di analytics. Le informazioni dettagliate sono disponibili nella {' '}
              <a className="underline" href="/cookie-policy">Cookie Policy</a> e nella pagina <a className="underline" href="/cookie-preferences">Preferenze cookie</a>.
            </p>
          </Section>

          <Section title="Aggiornamenti della presente informativa">
            <p>
              La presente informativa può essere aggiornata per adeguamenti normativi o tecnici. La versione pubblicata su questa pagina è quella applicabile.
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
