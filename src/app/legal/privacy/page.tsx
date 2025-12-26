export default function PrivacyPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="text-xs uppercase tracking-[0.25em] text-muted">Legale</div>
      <h1 className="font-[var(--font-display)]">Privacy Policy (bozza GDPR)</h1>

      <p>
        Questa bozza è un punto di partenza. Personalizza finalità, basi giuridiche, conservazione e fornitori (pagamenti,
        spedizioni, email, analytics). Fai revisionare da consulente GDPR.
      </p>

      <h2>Titolare del trattamento</h2>
      <p>
        <strong>{process.env.BUSINESS_NAME ?? "[Ragione Sociale]"}</strong> – {process.env.BUSINESS_ADDRESS ?? "[Indirizzo]"} – P.IVA{" "}
        {process.env.BUSINESS_VAT ?? "[P.IVA]"}
        <br />
        Contatto privacy: <strong>{"privacy@" + (process.env.NEXT_PUBLIC_DOMAIN ?? "yourdomain.it")}</strong> (placeholder)
      </p>

      <h2>Dati trattati</h2>
      <ul>
        <li>Dati account (email, password hash, nome opzionale)</li>
        <li>Dati ordine e spedizione (indirizzo, dettagli acquisto)</li>
        <li>Dati pagamento (gestiti dai provider – non memorizziamo i dati completi della carta)</li>
        <li>Dati di navigazione (cookie tecnici e, previo consenso, analytics/marketing)</li>
      </ul>

      <h2>Finalità e basi giuridiche</h2>
      <ul>
        <li>Esecuzione del contratto (gestione ordini/spedizioni)</li>
        <li>Obblighi legali (fiscali/contabili)</li>
        <li>Legittimo interesse (sicurezza, prevenzione frodi)</li>
        <li>Consenso (newsletter/marketing)</li>
      </ul>

      <h2>Diritti</h2>
      <p>
        Accesso, rettifica, cancellazione, limitazione, portabilità, opposizione, reclamo al Garante.
      </p>
    </div>
  );
}
