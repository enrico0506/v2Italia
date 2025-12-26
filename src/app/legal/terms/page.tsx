export default function TermsPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="text-xs uppercase tracking-[0.25em] text-muted">Legale</div>
      <h1 className="font-[var(--font-display)]">Termini e Condizioni (bozza)</h1>

      <p>
        Questa è una bozza base. Sostituisci i placeholder con i dati reali e fai revisionare da un legale, soprattutto
        per: IVA/OSS, resi, garanzia, licenze grafiche/immagini.
      </p>

      <h2>1. Oggetto</h2>
      <p>
        Le presenti Condizioni Generali disciplinano la vendita online di capi d’abbigliamento (felpe e magliette) tramite il sito
        <strong> [dominio]</strong> (“Sito”) da parte di <strong>[Ragione Sociale]</strong> (“Venditore”).
      </p>

      <h2>2. Prezzi, IVA e costi</h2>
      <p>
        Salvo diversa indicazione, i prezzi sono espressi in Euro e si intendono IVA inclusa (B2C). I costi di spedizione
        sono mostrati al checkout prima della conferma dell’ordine.
      </p>

      <h2>3. Pagamenti</h2>
      <p>
        Metodi accettati: carta (Stripe) e PayPal. Il provider potrebbe richiedere autenticazione forte (SCA/3DS) dove previsto.
      </p>

      <h2>4. Spedizioni</h2>
      <p>
        Tempi e costi dipendono dal Paese e dal metodo selezionato. Vedi pagina <a href="/legal/shipping">Spedizioni</a>.
      </p>

      <h2>5. Diritto di recesso</h2>
      <p>
        Se sei un consumatore, hai diritto di recedere entro 14 giorni dalla consegna, senza obbligo di motivazione, salvo eccezioni
        di legge. Vedi <a href="/legal/returns">Resi &amp; Recesso</a>.
      </p>

      <h2>6. Garanzia legale</h2>
      <p>
        Per i consumatori si applica la garanzia legale di conformità secondo normativa (in Italia tipicamente 24 mesi).
      </p>

      <h2>7. Contatti</h2>
      <p>
        Assistenza: <strong>{process.env.BUSINESS_EMAIL ?? "support@yourdomain.it"}</strong>
      </p>
    </div>
  );
}
