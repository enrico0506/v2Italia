export default function CookiesPage() {
  return (
    <div className="prose prose-invert max-w-none">
      <div className="text-xs uppercase tracking-[0.25em] text-muted">Legale</div>
      <h1 className="font-[var(--font-display)]">Cookie Policy (bozza)</h1>

      <p>
        Il sito utilizza cookie tecnici necessari. Cookie analytics e marketing sono attivati solo previo consenso tramite banner.
        Puoi modificare le preferenze in qualsiasi momento.
      </p>

      <h2>Cookie tecnici (necessari)</h2>
      <p>Usati per login, carrello, sicurezza e funzionamento base del sito.</p>

      <h2>Cookie statistici (analytics)</h2>
      <p>Attivati solo dopo consenso. Finalità: misurazione traffico e miglioramento UX.</p>

      <h2>Cookie marketing</h2>
      <p>Attivati solo dopo consenso. Finalità: remarketing, personalizzazione annunci (se implementato).</p>

      <h2>Gestione preferenze</h2>
      <p>
        Usa il banner cookie al primo accesso. Per riaprirlo, cancella il cookie <code>cookie_consent_v1</code> oppure implementa un
        bottone “Cookie settings” nel footer (roadmap).
      </p>
    </div>
  );
}
