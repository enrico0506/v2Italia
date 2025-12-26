export default function ReturnsPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="text-xs uppercase tracking-[0.25em] text-muted">Legale</div>
      <h1 className="font-[var(--font-display)]">Resi &amp; Diritto di Recesso (bozza)</h1>

      <p>
        Se sei un consumatore, puoi esercitare il diritto di recesso entro 14 giorni dalla consegna. Questa è una bozza:
        definisci con chiarezza costi di restituzione, condizioni del prodotto e tempi di rimborso.
      </p>

      <h2>Come richiedere un reso</h2>
      <ol>
        <li>Scrivi a <strong>{process.env.BUSINESS_EMAIL ?? "support@yourdomain.it"}</strong> indicando numero ordine e articoli.</li>
        <li>Ricevi istruzioni/RMA (se previsto).</li>
        <li>Spedisci il reso entro 14 giorni dalla comunicazione.</li>
      </ol>

      <h2>Condizioni</h2>
      <ul>
        <li>Prodotti integri, non usati, con etichette e confezione originale.</li>
        <li>Rimborso sullo stesso metodo di pagamento salvo accordo diverso.</li>
      </ul>

      <h2>Modulo tipo di recesso (placeholder)</h2>
      <pre>
{`Destinatario: [Ragione Sociale + indirizzo + email]
Con la presente notifico il recesso dal contratto di vendita dei seguenti beni: [...]
Ordinato il [...] / ricevuto il [...]
Nome consumatore: [...]
Indirizzo consumatore: [...]
Data: [...]
Firma (solo se cartaceo)`}
      </pre>
    </div>
  );
}
