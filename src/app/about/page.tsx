export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div>
        <div className="text-xs uppercase tracking-[0.25em] text-muted">Brand</div>
        <h1 className="mt-1 font-[var(--font-display)] text-4xl text-white">V2</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Un’identità scura e minimale. Drop limitati, materiali heavy, grafiche in B/N e accento rosso.
          Questa pagina è un placeholder: sostituiscila con storia, mission, produzione e lookbook.
        </p>
      </div>

      <section className="card p-6">
        <div className="font-[var(--font-display)] text-2xl text-white">Manifesto (placeholder)</div>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>• Underground first</li>
          <li>• No compromessi su fit e qualità</li>
          <li>• Drop reali (stock reale)</li>
          <li>• Minimal layout, massimo impatto</li>
        </ul>
      </section>
    </div>
  );
}
