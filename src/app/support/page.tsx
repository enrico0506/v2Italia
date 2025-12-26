import Link from "next/link";

export default function SupportPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted">Supporto</div>
        <h1 className="mt-1 font-[var(--font-display)] text-4xl text-white">ASSISTENZA</h1>
        <p className="mt-2 text-sm text-muted">
          FAQ rapide. Per richieste: scrivi a <span className="text-fg">{process.env.BUSINESS_EMAIL ?? "support@yourdomain.it"}</span>.
        </p>
      </div>

      <section className="card p-6">
        <div className="font-[var(--font-display)] text-2xl text-white">FAQ</div>

        <div className="mt-4 grid gap-4">
          <div>
            <div className="text-sm font-medium text-fg">Quanto ci mette la spedizione?</div>
            <div className="mt-1 text-sm text-muted">
              Italia 2–4 giorni (standard) / 1–2 giorni (express). UE 3–7 giorni. Dettagli in{" "}
              <Link className="underline decoration-accent/60 hover:decoration-accent" href="/legal/shipping">
                Spedizioni
              </Link>.
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-fg">Posso fare un reso?</div>
            <div className="mt-1 text-sm text-muted">
              Sì, entro 14 giorni dalla consegna per i consumatori. Leggi{" "}
              <Link className="underline decoration-accent/60 hover:decoration-accent" href="/legal/returns">
                Resi & Recesso
              </Link>.
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-fg">Guida taglie</div>
            <div className="mt-1 text-sm text-muted">
              Ogni prodotto indica vestibilità (regular/oversize). Se vuoi oversize di solito +1 taglia.
            </div>
          </div>

          <div>
            <div className="text-sm font-medium text-fg">Fattura</div>
            <div className="mt-1 text-sm text-muted">
              (Bozza) Puoi richiedere fattura inserendo i dati durante l’ordine. Da finalizzare con il tuo commercialista.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
